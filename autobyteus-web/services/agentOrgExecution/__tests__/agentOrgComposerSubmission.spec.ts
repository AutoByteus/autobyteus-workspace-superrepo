import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AgentUserInputTextArea from '~/components/agentInput/AgentUserInputTextArea.vue'
import { useAgentOrgContextsStore } from '~/stores/agentOrgContextsStore'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { taskBearingView } from './taskBearingOrgFixture'

const mocks = vi.hoisted(() => ({
  query: vi.fn(), historyRefresh: vi.fn(), navigation: vi.fn(),
  route: { query: { rootSubjectKind: 'agent_org', orgRunId: 'org-run', mode: 'active' } },
}))
vi.mock('vue-router', async (original) => ({ ...await original<typeof import('vue-router')>(), useRoute: () => mocks.route }))
vi.mock('~/stores/windowNodeContextStore', () => ({
  useWindowNodeContextStore: () => ({ getBoundEndpoints: () => ({ orgWs: 'ws://example.test/org' }) }),
}))
vi.mock('~/utils/remoteAccess/authorizedTransport', () => ({ getActiveRemoteAccessCredential: () => null }))
vi.mock('~/utils/remoteAccess/websocketAuth', () => ({ buildAuthenticatedWebSocketUrl: (url: string) => url }))
vi.mock('~/utils/apolloClient', () => ({ getApolloClient: () => ({ query: mocks.query }) }))
vi.mock('~/stores/runHistoryStore', () => ({ useRunHistoryStore: () => ({
  refreshAgentOrgHistory: mocks.historyRefresh, applyRunNavigationEffect: mocks.navigation,
}) }))
vi.mock('~/stores/voiceInputStore', () => ({ useVoiceInputStore: () => ({
  isAvailable: false, initialize: vi.fn(), cancelOperationForSource: vi.fn(),
}) }))

class Socket {
  static OPEN = 1
  static CONNECTING = 0
  static instances: Socket[] = []
  readyState = 1
  onmessage: ((event: { data: string }) => void) | null = null
  onclose: (() => void) | null = null
  onerror = null
  sent: any[] = []
  constructor() { Socket.instances.push(this) }
  send(value: string) { this.sent.push(JSON.parse(value)) }
  close(code?: number) {
    if (code !== undefined && code !== 1000 && (code < 3000 || code > 4999)) throw new Error('Invalid client close code')
    this.readyState = 3
    this.onclose?.()
  }
  emit(message: unknown) { this.onmessage?.({ data: JSON.stringify(message) }) }
}
const attachment = (id = 'submitted') => ({
  id, kind: 'workspace_path' as const, locator: `/workspace/${id}.txt`, displayName: `${id}.txt`, type: 'Text' as const,
})
let wrapper: ReturnType<typeof mount> | undefined
let socket: Socket
let sequence: number
const ack = (state = 'accepted') => {
  const command = socket.sent.at(-1)!
  socket.emit({ type: 'AGENT_COMMAND_ACK', payload: {
    root_subject_kind: 'agent_org', root_run_id: 'org-run',
    command_id: command.payload.command_id, command_type: 'SEND_MESSAGE',
    target_agent_run_id: command.payload.target_agent_run_id, state,
    code: state === 'accepted' ? null : 'REJECTED', message: state === 'accepted' ? null : 'Input was rejected',
  } })
}
const presentation = (message: unknown) => {
  const id = socket.sent.at(-1)!.payload.target_agent_run_id
  const context = useAgentOrgContextsStore().contextFor('org-run')!
  socket.emit({ type: 'ROOT_EXECUTION_EVENT', payload: {
    root_subject_kind: 'agent_org', root_run_id: 'org-run', change_sequence: ++sequence,
    event: { kind: 'agent_presentation', agent_run_id: id, member_address: context.index.requireAgent(id).address, message },
  } })
}
const echo = () => {
  const command = socket.sent.at(-1)!.payload
  presentation({ type: 'MEMBER_INPUT_MESSAGE', payload: {
    message_id: command.message_id, dedupe_key: command.dedupe_key, content: command.content,
    input_origin: 'user_message', received_at: '2026-09-11T23:00:00.000Z',
    context_file_paths: command.context_file_paths.map((path: string) => ({ path, type: 'Text' })),
    sender_agent_run_id: null,
    parent_communication_message_id: null,
  } })
}
const status = (value: string) => presentation({ type: 'AGENT_STATUS', payload: {
  status: value, trigger: null, tool_name: null, error_message: null, error_details: null,
} })

async function open(agentRunId = 'agent-director') {
  const store = useAgentOrgContextsStore()
  store.connect('org-run')
  socket = Socket.instances[0]!
  const view = taskBearingView()
  sequence = view.base_change_sequence
  socket.emit({ type: 'CONNECTED', payload: { root_subject_kind: 'agent_org', root_run_id: 'org-run', session_id: 'session' } })
  socket.emit({ type: 'ROOT_EXECUTION_VIEW_SNAPSHOT', payload: {
    root_subject_kind: 'agent_org', root_run_id: 'org-run', schema_version: 1, root_org: view,
  } })
  await vi.waitFor(() => expect(store.contextFor('org-run')).not.toBeNull())
  const org = store.contextFor('org-run')!
  org.select({ kind: 'agent_execution', agentRunId })
  const active = useActiveContextStore()
  wrapper = mount(AgentUserInputTextArea, { global: { stubs: { Icon: true } } })
  await flushPromises()
  return { org, active, context: active.activeAgentContext! }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  Socket.instances = []
  vi.stubGlobal('WebSocket', Socket)
  mocks.query.mockImplementation(async ({ variables }: any) => ({ data: { getAgentOrgMemberRunProjection: {
    agentRunId: variables.agentRunId, memberAddress: variables.memberAddress,
    conversation: [], activities: [], hasEarlierActiveTraceEvents: false,
  } } }))
})
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  useAgentOrgContextsStore().disconnect('org-run')
  vi.unstubAllGlobals()
})

describe('Org shared composer -> exact interaction -> correlated stream', () => {
  it.each(['agent-director', 'agent-team-worker-configured', 'agent-task-worker'])(
    'clears exact %s text/attachments immediately, retains pending and projects one authoritative echo', async (id) => {
      const { context } = await open(id)
      context.contextFilePaths = [attachment()]
      await wrapper!.find('textarea').setValue('hello')
      await wrapper!.find('button[title="Send message"]').trigger('click')
      expect(socket.sent).toHaveLength(1)
      expect(socket.sent[0].payload).toMatchObject({ content: 'hello', target_agent_run_id: id,
        context_file_paths: ['/workspace/submitted.txt'] })
      expect(wrapper!.find('textarea').element.value).toBe('')
      expect(context.requirement).toBe('')
      expect(context.contextFilePaths).toEqual([])
      expect(context.submissionPending).toBe(true)
      expect(context.conversation.messages).toHaveLength(1)
      expect(context.conversation.messages[0]).toMatchObject({ messageId: socket.sent[0].payload.message_id,
        dedupeKey: socket.sent[0].payload.dedupe_key, contextFilePaths: [attachment()] })
      expect(mocks.navigation).not.toHaveBeenCalled()
      expect(mocks.historyRefresh).not.toHaveBeenCalled()
      echo()
      await flushPromises()
      expect(useAgentOrgContextsStore().contextFor('org-run')!.phase).toBe('live')
      expect(context.conversation.messages[0]!.timestamp).toEqual(new Date('2026-09-11T23:00:00.000Z'))
      echo(); ack(); status('running'); status('idle')
      await flushPromises()
      expect(context.conversation.messages.filter((m) => m.type === 'user')).toHaveLength(1)
      expect(context.submissionPending).toBe(false)
      expect(wrapper!.find('textarea').element.value).toBe('')
      expect(mocks.historyRefresh).toHaveBeenCalledTimes(1)
      expect(mocks.navigation).not.toHaveBeenCalled()
      expect(useAgentOrgContextsStore().errorFor('org-run')).toBeNull()
    },
  )

  it('restores an untouched rejected draft/attachments and shows local error without history or replay', async () => {
    const { active, context } = await open()
    context.requirement = 'retry me'; context.contextFilePaths = [attachment()]
    const outcome = active.send()
    const rejected = expect(outcome).rejects.toThrow('Input was rejected')
    ack('rejected')
    await rejected; await flushPromises()
    expect(context.requirement).toBe('retry me')
    expect(wrapper!.find('textarea').element.value).toBe('retry me')
    expect(context.contextFilePaths).toEqual([attachment()])
    expect(context.submissionPending).toBe(false)
    expect(context.conversation.messages.at(-1)).toMatchObject({ segments: [expect.objectContaining({ code: 'LOCAL_SUBMISSION_ERROR' })] })
    expect(mocks.historyRefresh).not.toHaveBeenCalled()
    expect(mocks.navigation).not.toHaveBeenCalled()
    expect(socket.sent).toHaveLength(1)
  })

  it.each(['accepted', 'rejected'])('preserves focus-switched drafts/attachments when ACK is %s', async (state) => {
    const { org, active, context } = await open()
    context.requirement = 'first'; context.contextFilePaths = [attachment()]
    const outcome = active.send().catch((error) => error)
    context.requirement = 'new draft'; context.contextFilePaths = [attachment('new')]
    org.select({ kind: 'agent_execution', agentRunId: 'agent-team-worker-configured' })
    const other = active.activeAgentContext!
    other.requirement = 'other draft'
    other.contextFilePaths = [attachment('other')]
    ack(state)
    await outcome; await flushPromises()
    expect(context.requirement).toBe('new draft')
    expect(context.contextFilePaths).toEqual([attachment('new')])
    expect(other.requirement).toBe('other draft')
    expect(other.contextFilePaths).toEqual([attachment('other')])
    expect(wrapper!.find('textarea').element.value).toBe('other draft')
    expect(socket.sent[0].payload.target_agent_run_id).toBe('agent-director')
  })

  it('preserves not-yet-debounced newer textarea edits on rejection', async () => {
    const { context } = await open()
    context.contextFilePaths = [attachment()]
    await wrapper!.find('textarea').setValue('first')
    await wrapper!.find('button[title="Send message"]').trigger('click')
    await wrapper!.find('textarea').setValue('newer unsaved text')
    // Deliberately do not wait for the 750ms draft debounce.
    expect(context.requirement).toBe('')
    ack('rejected'); await flushPromises()
    expect(wrapper!.find('textarea').element.value).toBe('newer unsaved text')
    expect(context.requirement).toBe('newer unsaved text')
    expect(context.contextFilePaths).toEqual([])
  })

  it('does not restore a deliberately cleared newer draft on rejection', async () => {
    const { active, context } = await open()
    context.requirement = 'first'
    const outcome = active.send().catch((error) => error)
    context.requirement = 'new'; context.requirement = ''
    ack('rejected'); await outcome
    expect(context.requirement).toBe('')
  })

  it('rejects an already disconnected send without consuming its draft', async () => {
    const { active, context } = await open()
    context.requirement = 'not sent'; context.contextFilePaths = [attachment()]
    socket.readyState = 3
    await expect(active.send()).rejects.toThrow('not ready')
    expect(context.requirement).toBe('not sent')
    expect(context.contextFilePaths).toEqual([attachment()])
    expect(context.submissionPending).toBe(false)
    expect(context.conversation.messages).toEqual([])
    expect(socket.sent).toEqual([])
  })

  it('preserves a newer attachment-only draft after rejection', async () => {
    const { active, context } = await open()
    context.requirement = 'first'; context.contextFilePaths = [attachment()]
    const outcome = active.send().catch((error) => error)
    context.contextFilePaths.push(attachment('new-only'))
    ack('rejected'); await outcome
    expect(context.requirement).toBe('')
    expect(context.contextFilePaths).toEqual([attachment('new-only')])
  })

  it('handles a synchronous transport failure and retires its pending command', async () => {
    const { active, context } = await open()
    context.requirement = 'retry transport'
    vi.spyOn(socket, 'send').mockImplementationOnce(() => { throw new Error('transport failed') })
    await expect(active.send()).rejects.toThrow('transport failed')
    expect(context.requirement).toBe('retry transport')
    expect(context.submissionPending).toBe(false)
    expect(mocks.historyRefresh).not.toHaveBeenCalled()
    // A subsequent ordinary user send remains possible; no automatic retry.
    const next = active.send()
    ack(); await next
    expect(socket.sent).toHaveLength(1)
    expect(mocks.historyRefresh).toHaveBeenCalledTimes(1)
  })

  it('preserves the exact newer draft and focus through existing verified recovery after a pending disconnect', async () => {
    const { org, active, context } = await open()
    context.requirement = 'submitted'
    const outcome = active.send().catch((error) => error)
    context.requirement = 'unsent next'; context.contextFilePaths = [attachment('next')]
    org.select({ kind: 'agent_execution', agentRunId: 'agent-team-worker-configured' })
    active.activeAgentContext!.requirement = 'mounted draft'
    mocks.query.mockImplementation(async ({ query, variables }: any) => ({ data:
      query.definitions[0].name.value === 'GetAgentOrgExecutionCheckpoint'
        ? { getAgentOrgExecutionCheckpoint: { orgRunId: 'org-run', changeSequence: sequence, hasOpenExecutionWork: false } }
        : { getAgentOrgMemberRunProjection: { agentRunId: variables.agentRunId, memberAddress: variables.memberAddress,
          conversation: [], activities: [], hasEarlierActiveTraceEvents: false } },
    }))
    socket.close()
    expect(await outcome).toBeInstanceOf(Error)
    await vi.waitFor(() => expect(Socket.instances).toHaveLength(2))
    socket = Socket.instances[1]!
    socket.emit({ type: 'CONNECTED', payload: { root_subject_kind: 'agent_org', root_run_id: 'org-run', session_id: 'recovery' } })
    socket.emit({ type: 'ROOT_EXECUTION_VIEW_SNAPSHOT', payload: {
      root_subject_kind: 'agent_org', root_run_id: 'org-run', schema_version: 1, root_org: taskBearingView(),
    } })
    await vi.waitFor(() => expect(useAgentOrgContextsStore().contextFor('org-run')).not.toBe(org))
    const replacement = useAgentOrgContextsStore().contextFor('org-run')!
    expect(replacement.phase).toBe('live')
    expect(replacement.selection).toEqual({ kind: 'agent_execution', agentRunId: 'agent-team-worker-configured' })
    expect(active.activeAgentContext!.requirement).toBe('mounted draft')
    expect(replacement.getAgentContext('agent-director')!.requirement).toBe('unsent next')
    expect(replacement.getAgentContext('agent-director')!.contextFilePaths).toEqual([attachment('next')])
    expect(replacement.getAgentContext('agent-director')!.submissionPending).toBe(false)
    expect(replacement.getAgentContext('agent-director')!.conversation.messages).toEqual([])
    expect(socket.sent).toEqual([])
    expect(mocks.historyRefresh).not.toHaveBeenCalled()
  })

  it('releases the exact pending submission on disconnect without touching the newly focused draft', async () => {
    const { org, active, context } = await open()
    context.requirement = 'pending'
    const outcome = active.send().catch((error) => error)
    org.select({ kind: 'agent_execution', agentRunId: 'agent-team-worker-configured' })
    const other = active.activeAgentContext!
    other.requirement = 'other'
    useAgentOrgContextsStore().disconnect('org-run')
    expect(await outcome).toBeInstanceOf(Error)
    expect(context.submissionPending).toBe(false)
    expect(context.requirement).toBe('pending')
    expect(other.requirement).toBe('other')
    expect(socket.sent).toHaveLength(1)
    expect(mocks.historyRefresh).not.toHaveBeenCalled()
  })
})
