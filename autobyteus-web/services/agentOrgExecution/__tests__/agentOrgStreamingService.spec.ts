import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AgentOrgExecutionContext } from '../agentOrgExecutionContext'

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  hydrate: vi.fn(),
}))

vi.mock('~/stores/windowNodeContextStore', () => ({
  useWindowNodeContextStore: () => ({ getBoundEndpoints: () => ({ orgWs: 'ws://example.test/org' }) }),
}))
vi.mock('~/utils/remoteAccess/authorizedTransport', () => ({
  getActiveRemoteAccessCredential: () => null,
}))
vi.mock('~/utils/remoteAccess/websocketAuth', () => ({
  buildAuthenticatedWebSocketUrl: (url: string) => url,
}))
vi.mock('~/utils/apolloClient', () => ({
  getApolloClient: () => ({ query: mocks.query }),
}))
vi.mock('../agentOrgContextHydration', () => ({
  hydrateAgentOrgExecutionContext: mocks.hydrate,
}))

import { AgentOrgStreamingService } from '../agentOrgStreamingService'

class TestWebSocket {
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly CLOSED = 3
  static instances: TestWebSocket[] = []

  readyState = TestWebSocket.OPEN
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: (() => void) | null = null
  onclose: (() => void) | null = null
  sent: string[] = []

  constructor(readonly url: string) { TestWebSocket.instances.push(this) }
  send(value: string) { this.sent.push(value) }
  close() {
    if (this.readyState === TestWebSocket.CLOSED) return
    this.readyState = TestWebSocket.CLOSED
    this.onclose?.()
  }
  emitClose() {
    if (this.readyState === TestWebSocket.CLOSED) return
    this.readyState = TestWebSocket.CLOSED
    this.onclose?.()
  }
  emit(message: unknown) {
    this.onmessage?.({ data: JSON.stringify(message) } as MessageEvent)
  }
  emitRaw(raw: string) { this.onmessage?.({ data: raw } as MessageEvent) }
}

const launch = {
  runtimeKind: 'codex_app_server', llmModelIdentifier: 'gpt-5.6-sol', llmConfig: null,
  autoExecuteTools: false, skillAccessMode: 'PRELOADED_ONLY', workspaceRootPath: null,
}
const connected = {
  type: 'CONNECTED',
  payload: { root_subject_kind: 'agent_org', root_run_id: 'org-run', session_id: 'session-1' },
}
const snapshot = {
  type: 'ROOT_EXECUTION_VIEW_SNAPSHOT',
  payload: {
    root_subject_kind: 'agent_org', root_run_id: 'org-run', schema_version: 1,
    root_org: {
      base_change_sequence: 4, is_active: true,
      execution_tree: {
        schemaVersion: 1, subjectKind: 'agent_org', createdAt: '2026-09-01T00:00:00.000Z',
        archivedAt: null, applicationBinding: null, handoffs: [],
        rootOrg: {
          address: '/', orgDefinitionId: 'org-def', orgDefinitionName: 'Org', orgRunId: 'org-run',
          defaultLaunchConfiguration: launch, taskExecutions: [],
          members: [{
            address: '/direct', agentDefinitionId: 'agent-def', role: null, description: null,
            agentRunId: 'agent-run', platformAgentRunId: null, launchConfiguration: launch,
          }],
        },
      },
      task_records: { schemaVersion: 1, subjectKind: 'agent_org', orgRunId: 'org-run', records: [] },
      communication_messages: { schemaVersion: 1, subjectKind: 'agent_org', orgRunId: 'org-run', messages: [] },
      agent_statuses: [{
        member_address: '/direct', agent_run_id: 'agent-run', status: 'idle', trigger: null,
        tool_name: null, error_message: null, error_details: null,
      }],
    },
  },
}

const candidate = (selectedAddress: string | null = null, changeSequence = 4) => ({
  phase: 'live', changeSequence, selectedAddress,
  select: vi.fn(), setActive: vi.fn(), applyEvent: vi.fn(), requireReopen: vi.fn(),
}) as unknown as AgentOrgExecutionContext

describe('AgentOrgStreamingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.query.mockReset()
    mocks.hydrate.mockReset()
    TestWebSocket.instances = []
    vi.stubGlobal('WebSocket', TestWebSocket)
  })

  it('keeps the committed context until a checkpointed candidate is complete, then restores focus atomically', async () => {
    const first = candidate('/direct')
    const second = candidate()
    let finishHydration!: (value: AgentOrgExecutionContext) => void
    const pendingHydration = new Promise<AgentOrgExecutionContext>((resolve) => { finishHydration = resolve })
    mocks.hydrate.mockResolvedValueOnce(first).mockReturnValueOnce(pendingHydration)
    mocks.query.mockResolvedValue({
      data: { getAgentOrgExecutionCheckpoint: {
        orgRunId: 'org-run', changeSequence: 4, hasOpenExecutionWork: false,
      } },
    })
    const publish = vi.fn()
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({ orgRunId: 'org-run', publish, reportError })

    service.connect()
    const initialSocket = TestWebSocket.instances[0]!
    initialSocket.emit(connected)
    initialSocket.emit(snapshot)
    await vi.waitFor(() => expect(publish).toHaveBeenCalledWith(first))

    initialSocket.emitRaw('{not-json')
    await vi.waitFor(() => expect(first.requireReopen).toHaveBeenCalled())
    expect(publish).toHaveBeenCalledTimes(1)

    await vi.waitFor(() => expect(TestWebSocket.instances).toHaveLength(2))
    const recoverySocket = TestWebSocket.instances[1]!
    recoverySocket.emit(connected)
    recoverySocket.emit(snapshot)
    await vi.waitFor(() => expect(mocks.hydrate).toHaveBeenCalledTimes(2))
    expect(publish).toHaveBeenCalledTimes(1)

    finishHydration(second)
    await vi.waitFor(() => expect(publish).toHaveBeenCalledTimes(2))
    expect(second.select).toHaveBeenCalledWith('/direct')
    expect(publish).toHaveBeenLastCalledWith(second)
    expect(mocks.query).toHaveBeenCalledTimes(2)
    expect(reportError).not.toHaveBeenCalled()
  })

  it('recovers transparently when a strict snapshot arrives before CONNECTED', async () => {
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({
      orgRunId: 'org-run', publish: vi.fn(), reportError,
    })
    service.connect()
    TestWebSocket.instances[0]!.emit(snapshot)
    await vi.waitFor(() => expect(TestWebSocket.instances).toHaveLength(2))
    expect(reportError).not.toHaveBeenCalled()
    expect(mocks.hydrate).not.toHaveBeenCalled()
  })

  it('uses checkpointed transparent recovery after an established stream closes and preserves focus', async () => {
    const first = candidate('/direct')
    const second = candidate()
    mocks.hydrate.mockResolvedValueOnce(first).mockResolvedValueOnce(second)
    mocks.query.mockResolvedValue({ data: { getAgentOrgExecutionCheckpoint: {
      orgRunId: 'org-run', changeSequence: 4, hasOpenExecutionWork: false,
    } } })
    const publish = vi.fn()
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({ orgRunId: 'org-run', publish, reportError })

    service.connect()
    const initialSocket = TestWebSocket.instances[0]!
    initialSocket.emit(connected)
    initialSocket.emit(snapshot)
    await vi.waitFor(() => expect(publish).toHaveBeenCalledWith(first))

    initialSocket.emitClose()
    await vi.waitFor(() => expect(TestWebSocket.instances).toHaveLength(2))
    const replacement = TestWebSocket.instances[1]!
    replacement.emit(connected)
    replacement.emit(snapshot)

    await vi.waitFor(() => expect(publish).toHaveBeenLastCalledWith(second))
    expect(first.requireReopen).toHaveBeenCalled()
    expect(second.select).toHaveBeenCalledWith('/direct')
    expect(mocks.query).toHaveBeenCalledTimes(2)
    expect(reportError).not.toHaveBeenCalled()
  })

  it('shows the bounded error only after checkpointed transparent recovery is exhausted', async () => {
    const first = candidate('/direct')
    mocks.hydrate.mockResolvedValue(first)
    const publish = vi.fn()
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({ orgRunId: 'org-run', publish, reportError })

    service.connect()
    const initialSocket = TestWebSocket.instances[0]!
    initialSocket.emit(connected)
    initialSocket.emit(snapshot)
    await vi.waitFor(() => expect(publish).toHaveBeenCalledWith(first))
    mocks.query.mockRejectedValue(new Error('checkpoint unavailable'))

    vi.useFakeTimers()
    try {
      initialSocket.emitClose()
      await vi.runAllTimersAsync()
      expect(mocks.query).toHaveBeenCalledTimes(5)
      expect(reportError).toHaveBeenCalledTimes(1)
      expect(reportError).toHaveBeenCalledWith('checkpoint unavailable')
      expect(TestWebSocket.instances).toHaveLength(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('checkpoint-hydrates a fresh task activation instead of publishing a partial context', async () => {
    const first = candidate()
    vi.mocked(first.applyEvent).mockReturnValue('checkpoint_required')
    const second = candidate(null, 5)
    mocks.hydrate.mockResolvedValueOnce(first).mockResolvedValueOnce(second)
    mocks.query.mockResolvedValue({
      data: { getAgentOrgExecutionCheckpoint: {
        orgRunId: 'org-run', changeSequence: 5, hasOpenExecutionWork: true,
      } },
    })
    const publish = vi.fn()
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({ orgRunId: 'org-run', publish, reportError })

    service.connect()
    const initialSocket = TestWebSocket.instances[0]!
    initialSocket.emit(connected)
    initialSocket.emit(snapshot)
    await vi.waitFor(() => expect(publish).toHaveBeenCalledWith(first))

    initialSocket.emit({
      type: 'ROOT_EXECUTION_EVENT',
      payload: {
        root_subject_kind: 'agent_org', root_run_id: 'org-run', change_sequence: 5,
        event: { kind: 'task', event: { kind: 'activated', task: {
          taskId: 'task-fresh', delegatorAgentRunId: 'agent-run',
          recipientAddress: '/direct', taskExecution: { agentRunId: 'agent-task-fresh' },
          description: 'Fresh task', referenceFiles: [], status: 'active', updates: [],
          createdAt: '2026-09-01T00:00:01.000Z',
        } } },
      },
    })

    await vi.waitFor(() => expect(TestWebSocket.instances).toHaveLength(2))
    expect(publish).toHaveBeenCalledTimes(1)
    const recoverySocket = TestWebSocket.instances[1]!
    recoverySocket.emit(connected)
    recoverySocket.emit(snapshot)
    await vi.waitFor(() => expect(publish).toHaveBeenLastCalledWith(second))
    expect(first.applyEvent).toHaveBeenCalledWith(5, expect.objectContaining({ kind: 'task' }))
    expect(first.requireReopen).not.toHaveBeenCalled()
    expect(reportError).not.toHaveBeenCalled()
    expect(mocks.query).toHaveBeenCalledTimes(2)
  })

  it('completes a command only from an ACK with the exact command type and target', async () => {
    const context = candidate()
    mocks.hydrate.mockResolvedValue(context)
    mocks.query.mockResolvedValue({ data: { getAgentOrgExecutionCheckpoint: {
      orgRunId: 'org-run', changeSequence: 4, hasOpenExecutionWork: false,
    } } })
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({
      orgRunId: 'org-run', publish: vi.fn(), reportError,
    })
    service.connect()
    const socket = TestWebSocket.instances[0]!
    socket.emit(connected)
    socket.emit(snapshot)
    await vi.waitFor(() => expect(mocks.hydrate).toHaveBeenCalled())

    const completed = service.interactionFor('agent-run').interrupt()
    await vi.waitFor(() => expect(socket.sent).toHaveLength(1))
    const command = JSON.parse(socket.sent[0]!)
    socket.emit({
      type: 'AGENT_COMMAND_ACK',
      payload: {
        root_subject_kind: 'agent_org', root_run_id: 'org-run',
        command_id: command.payload.command_id,
        command_type: 'INTERRUPT_GENERATION', target_agent_run_id: 'agent-run',
        state: 'accepted', code: null, message: null,
      },
    })

    await expect(completed).resolves.toBeUndefined()
    expect(reportError).not.toHaveBeenCalled()
    expect(context.requireReopen).not.toHaveBeenCalled()
  })

  it.each([
    ['command type', 'SEND_MESSAGE', 'agent-run'],
    ['target AgentRun', 'INTERRUPT_GENERATION', 'other-agent-run'],
  ] as const)('fails closed and rejects the pending command for a miscorrelated ACK %s', async (
    _mismatch,
    commandType,
    targetAgentRunId,
  ) => {
    const context = candidate()
    mocks.hydrate.mockResolvedValue(context)
    mocks.query.mockResolvedValue({ data: { getAgentOrgExecutionCheckpoint: {
      orgRunId: 'org-run', changeSequence: 4, hasOpenExecutionWork: false,
    } } })
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({
      orgRunId: 'org-run', publish: vi.fn(), reportError,
    })
    service.connect()
    const socket = TestWebSocket.instances[0]!
    socket.emit(connected)
    socket.emit(snapshot)
    await vi.waitFor(() => expect(mocks.hydrate).toHaveBeenCalled())

    const rejected = service.interactionFor('agent-run').interrupt()
    await vi.waitFor(() => expect(socket.sent).toHaveLength(1))
    const command = JSON.parse(socket.sent[0]!)
    socket.emit({
      type: 'AGENT_COMMAND_ACK',
      payload: {
        root_subject_kind: 'agent_org', root_run_id: 'org-run',
        command_id: command.payload.command_id,
        command_type: commandType, target_agent_run_id: targetAgentRunId,
        state: 'accepted', code: null, message: null,
      },
    })

    await expect(rejected).rejects.toThrow(/identity mismatch/)
    await vi.waitFor(() => expect(TestWebSocket.instances).toHaveLength(2))
    expect(reportError).not.toHaveBeenCalled()
    expect(context.requireReopen).toHaveBeenCalledWith(expect.stringContaining('identity mismatch'))
  })

  it('ignores a queued frame from the retired socket while checkpoint replacement publishes atomically', async () => {
    const first = candidate()
    vi.mocked(first.applyEvent).mockReturnValue('checkpoint_required')
    const second = candidate(null, 6)
    mocks.hydrate.mockResolvedValueOnce(first).mockResolvedValueOnce(second)
    let finishCheckpoint!: (value: unknown) => void
    mocks.query
      .mockReturnValueOnce(new Promise((resolve) => { finishCheckpoint = resolve }))
      .mockResolvedValueOnce({ data: { getAgentOrgExecutionCheckpoint: {
        orgRunId: 'org-run', changeSequence: 6, hasOpenExecutionWork: true,
      } } })
    const publish = vi.fn()
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({ orgRunId: 'org-run', publish, reportError })

    service.connect()
    const initialSocket = TestWebSocket.instances[0]!
    initialSocket.emit(connected)
    initialSocket.emit(snapshot)
    await vi.waitFor(() => expect(publish).toHaveBeenCalledWith(first))

    initialSocket.emit({
      type: 'ROOT_EXECUTION_EVENT',
      payload: {
        root_subject_kind: 'agent_org', root_run_id: 'org-run', change_sequence: 5,
        event: { kind: 'task', event: { kind: 'activated', task: {
          taskId: 'task-fresh', delegatorAgentRunId: 'agent-run',
          recipientAddress: '/direct', taskExecution: { agentRunId: 'agent-task-fresh' },
          description: 'Fresh task', referenceFiles: [], status: 'active', updates: [],
          createdAt: '2026-09-01T00:00:01.000Z',
        } } },
      },
    })
    await vi.waitFor(() => expect(mocks.query).toHaveBeenCalledTimes(1))

    initialSocket.emit({
      type: 'ROOT_EXECUTION_EVENT',
      payload: {
        root_subject_kind: 'agent_org', root_run_id: 'org-run', change_sequence: 6,
        event: {
          kind: 'agent_presentation', member_address: '/direct', agent_run_id: 'agent-task-fresh',
          message: { type: 'AGENT_STATUS', payload: {
            status: 'running', trigger: 'task', tool_name: null,
            error_message: null, error_details: null,
          } },
        },
      },
    })
    finishCheckpoint({ data: { getAgentOrgExecutionCheckpoint: {
      orgRunId: 'org-run', changeSequence: 6, hasOpenExecutionWork: true,
    } } })

    await vi.waitFor(() => expect(TestWebSocket.instances).toHaveLength(2))
    const replacementSocket = TestWebSocket.instances[1]!
    replacementSocket.emit({
      type: 'CONNECTED',
      payload: { root_subject_kind: 'agent_org', root_run_id: 'org-run', session_id: 'session-2' },
    })
    replacementSocket.emit(snapshot)

    await vi.waitFor(() => expect(publish).toHaveBeenLastCalledWith(second))
    expect(replacementSocket.readyState).toBe(TestWebSocket.OPEN)
    expect(first.requireReopen).not.toHaveBeenCalled()
    expect(reportError).not.toHaveBeenCalled()
    expect(mocks.hydrate).toHaveBeenCalledTimes(2)
    expect(mocks.query).toHaveBeenCalledTimes(2)
  })

  it('does not publish hydration that completes after the AgentOrg context is released', async () => {
    const hydrated = candidate()
    let finishHydration!: (value: AgentOrgExecutionContext) => void
    mocks.hydrate.mockReturnValueOnce(new Promise((resolve) => { finishHydration = resolve }))
    const publish = vi.fn()
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({ orgRunId: 'org-run', publish, reportError })

    service.connect()
    const socket = TestWebSocket.instances[0]!
    socket.emit(connected)
    socket.emit(snapshot)
    await vi.waitFor(() => expect(mocks.hydrate).toHaveBeenCalledTimes(1))

    service.disconnect()
    finishHydration(hydrated)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(socket.readyState).toBe(TestWebSocket.CLOSED)
    expect(TestWebSocket.instances).toHaveLength(1)
    expect(publish).not.toHaveBeenCalled()
    expect(reportError).not.toHaveBeenCalled()
  })

  it('does not reconnect when an activation checkpoint completes after context release', async () => {
    const first = candidate()
    vi.mocked(first.applyEvent).mockReturnValue('checkpoint_required')
    mocks.hydrate.mockResolvedValueOnce(first)
    let finishCheckpoint!: (value: unknown) => void
    mocks.query.mockReturnValueOnce(new Promise((resolve) => { finishCheckpoint = resolve }))
    const publish = vi.fn()
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({ orgRunId: 'org-run', publish, reportError })

    service.connect()
    const socket = TestWebSocket.instances[0]!
    socket.emit(connected)
    socket.emit(snapshot)
    await vi.waitFor(() => expect(publish).toHaveBeenCalledWith(first))

    socket.emit({
      type: 'ROOT_EXECUTION_EVENT',
      payload: {
        root_subject_kind: 'agent_org', root_run_id: 'org-run', change_sequence: 5,
        event: { kind: 'task', event: { kind: 'activated', task: {
          taskId: 'task-fresh', delegatorAgentRunId: 'agent-run',
          recipientAddress: '/direct', taskExecution: { agentRunId: 'agent-task-fresh' },
          description: 'Fresh task', referenceFiles: [], status: 'active', updates: [],
          createdAt: '2026-09-01T00:00:01.000Z',
        } } },
      },
    })
    await vi.waitFor(() => expect(mocks.query).toHaveBeenCalledTimes(1))

    service.disconnect()
    finishCheckpoint({ data: { getAgentOrgExecutionCheckpoint: {
      orgRunId: 'org-run', changeSequence: 5, hasOpenExecutionWork: true,
    } } })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(socket.readyState).toBe(TestWebSocket.CLOSED)
    expect(TestWebSocket.instances).toHaveLength(1)
    expect(publish).toHaveBeenCalledTimes(1)
    expect(first.setActive).toHaveBeenCalledWith(false)
    expect(reportError).not.toHaveBeenCalled()
  })
})
