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

const candidate = (selectedAddress: string | null = null) => ({
  phase: 'live', changeSequence: 4, selectedAddress,
  select: vi.fn(), setActive: vi.fn(), applyEvent: vi.fn(), requireReopen: vi.fn(),
}) as unknown as AgentOrgExecutionContext

describe('AgentOrgStreamingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

    await service.reopen()
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
  })

  it('fails closed when a strict snapshot arrives before CONNECTED', async () => {
    const reportError = vi.fn()
    const service = new AgentOrgStreamingService({
      orgRunId: 'org-run', publish: vi.fn(), reportError,
    })
    service.connect()
    TestWebSocket.instances[0]!.emit(snapshot)
    await vi.waitFor(() => expect(reportError).toHaveBeenCalledWith(
      expect.stringContaining('snapshot arrived before CONNECTED'),
    ))
    expect(mocks.hydrate).not.toHaveBeenCalled()
  })

  it('completes a command only from an ACK with the exact command type and target', async () => {
    const context = candidate()
    mocks.hydrate.mockResolvedValue(context)
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
    await vi.waitFor(() => expect(reportError).toHaveBeenCalledWith(
      expect.stringContaining('identity mismatch'),
    ))
    expect(context.requireReopen).toHaveBeenCalledWith(expect.stringContaining('identity mismatch'))
  })
})
