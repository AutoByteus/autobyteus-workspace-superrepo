import {
  CollaborationStreamServerMessageSchema,
  type CollaborationStreamClientMessage,
  type CollaborationStreamServerMessage,
} from '@autobyteus/collaboration-stream-contracts'
import type { ContextFilePath } from '~/types/conversation'
import type { AgentInteractionPort } from '~/types/workspace/activeAgentWorkspaceTarget'
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore'
import { getActiveRemoteAccessCredential } from '~/utils/remoteAccess/authorizedTransport'
import { buildAuthenticatedWebSocketUrl } from '~/utils/remoteAccess/websocketAuth'
import { GetAgentOrgExecutionCheckpoint } from '~/graphql/queries/runHistoryQueries'
import { getApolloClient } from '~/utils/apolloClient'
import { hydrateAgentOrgExecutionContext } from './agentOrgContextHydration'
import {
  AgentOrgExecutionContext,
  type AgentOrgCommandTransport,
} from './agentOrgExecutionContext'

type CommandAck = Extract<CollaborationStreamServerMessage, { type: 'AGENT_COMMAND_ACK' }>
type PendingCommand = Readonly<{
  commandType: CollaborationStreamClientMessage['type']
  targetAgentRunId: string
  resolve(): void
  reject(error: Error): void
  timeout: ReturnType<typeof setTimeout>
}>
type ExecutionCheckpoint = Readonly<{
  orgRunId: string
  changeSequence: number
  hasOpenExecutionWork: boolean
}>
type StreamGeneration = Readonly<{
  id: number
  socket: WebSocket
}>
type AgentOrgStreamPhase = 'disconnected' | 'awaiting_connected_root' | 'awaiting_snapshot' | 'ready'

const attachmentLocator = (attachment: ContextFilePath): string => attachment.locator
const MAX_TRANSPARENT_RECOVERY_ATTEMPTS = 5
const recoveryDelay = (attempt: number): number => attempt === 0
  ? 0
  : Math.min(1_000 * (2 ** (attempt - 1)), 30_000)

export class AgentOrgStreamingService implements AgentOrgCommandTransport {
  private socket: WebSocket | null = null
  private context: AgentOrgExecutionContext | null = null
  private processing: Promise<void> = Promise.resolve()
  private readonly pending = new Map<string, PendingCommand>()
  private nextGenerationId = 0
  private activeGeneration: StreamGeneration | null = null
  private released = false
  private intentionalClose = false
  private recoveryCheckpoint: ExecutionCheckpoint | null = null
  private recoveryFocus: string | null = null
  private streamPhase: AgentOrgStreamPhase = 'disconnected'
  private transparentRecoveryAttempts = 0
  private transparentRecoveryScheduled = false
  private transparentRecoveryInFlight = false
  private transparentRecoveryTimer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly options: Readonly<{
    orgRunId: string
    publish(context: AgentOrgExecutionContext): void
    reportError(message: string): void
  }>) {}

  connect(): void {
    if (this.released) return
    if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) return
    this.resetTransparentRecovery()
    if (this.context?.phase === 'reopen_required') {
      this.scheduleTransparentRecovery(this.context.error ?? 'AgentOrg stream recovery is required.')
      return
    }
    try {
      this.openSocket()
    } catch (cause) {
      this.scheduleTransparentRecovery(this.detail(cause))
    }
  }

  private openSocket(): void {
    if (this.released) return
    if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) return
    const endpoint = `${useWindowNodeContextStore().getBoundEndpoints().orgWs}/${encodeURIComponent(this.options.orgRunId)}`
    const socket = new WebSocket(buildAuthenticatedWebSocketUrl(
      endpoint,
      getActiveRemoteAccessCredential() ?? '',
    ))
    const generation = Object.freeze({ id: ++this.nextGenerationId, socket })
    this.intentionalClose = false
    this.socket = socket
    this.activeGeneration = generation
    this.streamPhase = 'awaiting_connected_root'
    socket.onmessage = (raw) => {
      this.processing = this.processing
        .then(() => this.processFrame(generation, String(raw.data)))
    }
    socket.onerror = () => undefined
    socket.onclose = () => {
      if (!this.isCurrent(generation)) return
      const shouldRecover = !this.intentionalClose
      this.socket = null
      this.activeGeneration = null
      this.streamPhase = 'disconnected'
      const detail = 'AgentOrg stream closed before a complete synchronized view was available.'
      if (shouldRecover && this.context) {
        this.context.requireReopen(detail)
      }
      this.rejectPending('AgentOrg stream closed before command acknowledgement.')
      if (shouldRecover) this.scheduleTransparentRecovery(detail)
    }
  }

  private async reopenOwned(generation: StreamGeneration | null): Promise<void> {
    if (!this.ownsOperation(generation)) return
    let checkpoint: ExecutionCheckpoint
    try {
      checkpoint = await this.fetchCheckpoint()
    } catch (cause) {
      if (!this.ownsOperation(generation)) return
      throw cause
    }
    if (!this.ownsOperation(generation)) return
    this.recoveryCheckpoint = checkpoint
    this.recoveryFocus = this.context?.selectedAddress ?? null
    this.closeSocket('AgentOrg checkpointed recovery')
    if (this.released) return
    this.openSocket()
  }

  disconnect(): void {
    this.released = true
    this.clearTransparentRecovery()
    this.closeSocket('AgentOrg context released')
    this.context?.setActive(false)
    this.context = null
    this.recoveryCheckpoint = null
    this.recoveryFocus = null
    this.rejectPending('AgentOrg context was released.')
  }

  interactionFor(agentRunId: string): AgentInteractionPort {
    const target = agentRunId.trim()
    if (!target) throw new Error('AgentOrg interaction requires an exact AgentRun ID.')
    return Object.freeze({
      send: async (content: string, contextPaths: readonly ContextFilePath[]) => {
        const messageId = crypto.randomUUID()
        await this.command({
          type: 'SEND_MESSAGE',
          payload: {
            ...this.commandRoot(target),
            content,
            context_file_paths: contextPaths.map(attachmentLocator),
            image_urls: [],
            message_id: messageId,
            dedupe_key: `member_input:${this.options.orgRunId}:${target}:${messageId}`,
          },
        })
      },
      interrupt: () => this.command({
        type: 'INTERRUPT_GENERATION',
        payload: this.commandRoot(target),
      }),
      decideTool: (invocationId: string, approved: boolean, reason: string | null) => this.command({
        type: approved ? 'APPROVE_TOOL' : 'DENY_TOOL',
        payload: {
          ...this.commandRoot(target),
          invocation_id: invocationId,
          reason,
        },
      }),
    })
  }

  private commandRoot(targetAgentRunId: string) {
    return {
      root_subject_kind: 'agent_org' as const,
      root_run_id: this.options.orgRunId,
      target_agent_run_id: targetAgentRunId,
      command_id: crypto.randomUUID(),
    }
  }

  private command(message: CollaborationStreamClientMessage): Promise<void> {
    const socket = this.socket
    if (!socket || socket.readyState !== WebSocket.OPEN
      || this.streamPhase !== 'ready' || this.context?.phase !== 'live') {
      return Promise.reject(new Error('AgentOrg interaction stream is not ready.'))
    }
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(message.payload.command_id)
        reject(new Error(`AgentOrg command '${message.payload.command_id}' acknowledgement timed out.`))
      }, 15_000)
      this.pending.set(message.payload.command_id, Object.freeze({
        commandType: message.type,
        targetAgentRunId: message.payload.target_agent_run_id,
        resolve,
        reject,
        timeout,
      }))
      socket.send(JSON.stringify(message))
    })
  }

  private async handleMessage(generation: StreamGeneration, raw: string): Promise<void> {
    const message = CollaborationStreamServerMessageSchema.parse(JSON.parse(raw))
    if (message.type === 'ERROR') {
      throw new Error(`${message.payload.code}: ${message.payload.message}`)
    }
    if (message.payload.root_run_id !== this.options.orgRunId
      || message.payload.root_subject_kind !== 'agent_org') {
      throw new Error(`AgentOrg stream correlation mismatch for '${this.options.orgRunId}'.`)
    }
    if (message.type === 'CONNECTED') {
      if (this.streamPhase !== 'awaiting_connected_root') {
        throw new Error('AgentOrg stream CONNECTED message arrived out of order.')
      }
      this.streamPhase = 'awaiting_snapshot'
      return
    }
    if (message.type === 'AGENT_COMMAND_ACK') {
      if (this.streamPhase !== 'ready') throw new Error('AgentOrg command acknowledgement arrived before the snapshot barrier.')
      this.acknowledge(message)
      return
    }
    if (message.type === 'ROOT_EXECUTION_VIEW_SNAPSHOT') {
      if (this.streamPhase !== 'awaiting_snapshot') {
        throw new Error('AgentOrg snapshot arrived before CONNECTED or after the snapshot barrier.')
      }
      if (message.payload.root_subject_kind !== 'agent_org') {
        throw new Error('AgentOrg stream supplied a non-Org snapshot.')
      }
      const previousFocus = this.recoveryFocus ?? this.context?.selectedAddress ?? null
      const candidate = await hydrateAgentOrgExecutionContext({
        orgRunId: this.options.orgRunId,
        view: message.payload.root_org,
        transport: this,
      })
      if (!this.isCurrent(generation)) return
      if (!await this.verifyRecoveryCandidate(candidate, generation)) return
      if (!this.isCurrent(generation)) return
      if (previousFocus) candidate.select(previousFocus)
      this.context = candidate
      this.recoveryCheckpoint = null
      this.recoveryFocus = null
      this.streamPhase = 'ready'
      this.resetTransparentRecovery()
      this.options.publish(candidate)
      return
    }
    if (!this.context || this.streamPhase !== 'ready') {
      throw new Error('AgentOrg stream event arrived before the snapshot barrier.')
    }
    if (message.type === 'ROOT_EXECUTION_EVENT') {
      if (message.payload.root_subject_kind !== 'agent_org') {
        throw new Error('AgentOrg stream supplied a non-Org event.')
      }
      const application = this.context.applyEvent(message.payload.change_sequence, message.payload.event)
      if (application === 'checkpoint_required') await this.reopenOwned(generation)
      return
    }
    this.context.setActive(message.payload.is_active)
  }

  private async processFrame(generation: StreamGeneration, raw: string): Promise<void> {
    if (!this.isCurrent(generation)) return
    try {
      await this.handleMessage(generation, raw)
    } catch (cause) {
      if (this.isCurrent(generation)) this.failClosed(cause, generation)
    }
  }

  private isCurrent(generation: StreamGeneration): boolean {
    return this.activeGeneration?.id === generation.id
      && this.activeGeneration.socket === generation.socket
      && this.socket === generation.socket
  }

  private ownsOperation(generation: StreamGeneration | null): boolean {
    if (this.released) return false
    return generation === null
      ? this.activeGeneration === null && this.socket === null
      : this.isCurrent(generation)
  }

  private acknowledge(message: CommandAck): void {
    const command = this.pending.get(message.payload.command_id)
    if (!command) {
      throw new Error(`AgentOrg command acknowledgement '${message.payload.command_id}' has no pending command.`)
    }
    if (command.commandType !== message.payload.command_type
      || command.targetAgentRunId !== message.payload.target_agent_run_id) {
      throw new Error(`AgentOrg command acknowledgement '${message.payload.command_id}' identity mismatch.`)
    }
    clearTimeout(command.timeout)
    this.pending.delete(message.payload.command_id)
    if (message.payload.state === 'accepted') command.resolve()
    else command.reject(new Error(message.payload.message ?? message.payload.code ?? 'AgentOrg command rejected.'))
  }

  private failClosed(cause: unknown, generation: StreamGeneration): void {
    if (!this.isCurrent(generation)) return
    const detail = this.detail(cause)
    this.context?.requireReopen(detail)
    this.intentionalClose = true
    this.streamPhase = 'disconnected'
    this.socket = null
    this.activeGeneration = null
    this.rejectPending(detail)
    generation.socket.close(1002, 'Invalid AgentOrg stream')
    this.scheduleTransparentRecovery(detail)
  }

  private scheduleTransparentRecovery(detail: string): void {
    if (this.released || this.transparentRecoveryScheduled || this.transparentRecoveryInFlight || this.socket) return
    if (this.transparentRecoveryAttempts >= MAX_TRANSPARENT_RECOVERY_ATTEMPTS) {
      this.options.reportError(detail)
      return
    }
    const delay = recoveryDelay(this.transparentRecoveryAttempts)
    this.transparentRecoveryAttempts += 1
    this.transparentRecoveryScheduled = true
    const run = () => {
      this.transparentRecoveryScheduled = false
      this.transparentRecoveryTimer = null
      void this.attemptTransparentRecovery(detail)
    }
    if (delay === 0) queueMicrotask(run)
    else this.transparentRecoveryTimer = setTimeout(run, delay)
  }

  private async attemptTransparentRecovery(previousDetail: string): Promise<void> {
    if (this.released || this.socket || this.transparentRecoveryInFlight) return
    this.transparentRecoveryInFlight = true
    let failure: unknown = null
    try {
      if (this.context) await this.reopenOwned(null)
      else this.openSocket()
    } catch (cause) {
      failure = cause
    } finally {
      this.transparentRecoveryInFlight = false
    }
    if (failure) this.scheduleTransparentRecovery(this.detail(failure) || previousDetail)
  }

  private resetTransparentRecovery(): void {
    this.clearTransparentRecovery()
    this.transparentRecoveryAttempts = 0
  }

  private clearTransparentRecovery(): void {
    if (this.transparentRecoveryTimer) clearTimeout(this.transparentRecoveryTimer)
    this.transparentRecoveryTimer = null
    this.transparentRecoveryScheduled = false
  }

  private detail(cause: unknown): string {
    return cause instanceof Error ? cause.message : String(cause)
  }

  private closeSocket(reason: string): void {
    const generation = this.activeGeneration
    this.intentionalClose = true
    this.streamPhase = 'disconnected'
    this.socket = null
    this.activeGeneration = null
    generation?.socket.close(1000, reason)
    this.rejectPending('AgentOrg stream closed before command acknowledgement.')
  }

  private async fetchCheckpoint(): Promise<ExecutionCheckpoint> {
    const response = await getApolloClient().query<{
      getAgentOrgExecutionCheckpoint: ExecutionCheckpoint
    }>({
      query: GetAgentOrgExecutionCheckpoint,
      variables: { orgRunId: this.options.orgRunId },
      fetchPolicy: 'network-only',
    })
    const checkpoint = response.data?.getAgentOrgExecutionCheckpoint
    if (!checkpoint || checkpoint.orgRunId !== this.options.orgRunId
      || !Number.isSafeInteger(checkpoint.changeSequence) || checkpoint.changeSequence < 0) {
      throw new Error(`Invalid AgentOrg execution checkpoint for '${this.options.orgRunId}'.`)
    }
    return checkpoint
  }

  private async verifyRecoveryCandidate(
    candidate: AgentOrgExecutionContext,
    generation: StreamGeneration,
  ): Promise<boolean> {
    const before = this.recoveryCheckpoint
    if (!before) return true
    const after = await this.fetchCheckpoint()
    if (!this.isCurrent(generation)) return false
    if (candidate.changeSequence < before.changeSequence
      || candidate.changeSequence > after.changeSequence) {
      throw new Error('AgentOrg recovery snapshot does not fall within the verified checkpoint window.')
    }
    if (!before.hasOpenExecutionWork && !after.hasOpenExecutionWork
      && (before.changeSequence !== after.changeSequence
        || candidate.changeSequence !== after.changeSequence)) {
      throw new Error('AgentOrg recovery checkpoint changed without open execution work.')
    }
    return true
  }

  private rejectPending(message: string): void {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timeout)
      pending.reject(new Error(message))
    }
    this.pending.clear()
  }
}
