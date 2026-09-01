import { mount, flushPromises } from '@vue/test-utils'
import { reactive } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AgentStatus } from '~/types/agent/AgentStatus'
import AgentOrgRunHistoryPanel from '../AgentOrgRunHistoryPanel.vue'

const launch = {
  runtimeKind: 'codex_app_server', llmModelIdentifier: 'gpt-5.6-sol', llmConfig: null,
  autoExecuteTools: false, skillAccessMode: 'PRELOADED_ONLY', workspaceRootPath: '/tmp/org',
}
const agent = (address: string, runId: string) => ({
  address, agentDefinitionId: `${runId}-definition`, role: null, description: null,
  agentRunId: runId, platformAgentRunId: null, launchConfiguration: launch,
})
const taskAgent = (address: string, runId: string) => ({
  address, agentRunId: runId, platformAgentRunId: null,
  startedAt: '2026-09-01T00:00:00.000Z', settledAt: null,
})
const tree = {
  schemaVersion: 1, subjectKind: 'agent_org', createdAt: '2026-09-01T00:00:00.000Z',
  archivedAt: null, applicationBinding: null, handoffs: [],
  rootOrg: {
    address: '/', orgDefinitionId: 'org-def', orgDefinitionName: 'Agent Org', orgRunId: 'org-run',
    defaultLaunchConfiguration: launch,
    members: [agent('/lead', 'direct-org-agent')],
    taskExecutions: [],
  },
}
const statusTree = {
  ...tree,
  rootOrg: {
    ...tree.rootOrg,
    members: [
      agent('/lead', 'direct-org-agent'),
      {
        address: '/design', teamDefinitionId: 'design-definition', role: null, description: null,
        teamRunId: 'design-team-run', coordinatorAddress: '/design/designer',
        defaultLaunchConfiguration: launch,
        members: [
          agent('/design/designer', 'design-designer'),
          agent('/design/researcher', 'design-researcher'),
        ],
        taskExecutions: [
          taskAgent('/design/designer', 'design-direct-task'),
          {
            address: '/design', teamRunId: 'design-task-team',
            startedAt: '2026-09-01T00:00:00.000Z', settledAt: null,
            members: [
              { address: '/design/reviewer', agentRunId: 'design-task-reviewer', platformAgentRunId: null },
              {
                address: '/design/audit', teamRunId: 'design-nested-task-team',
                members: [{ address: '/design/audit/auditor', agentRunId: 'design-task-auditor', platformAgentRunId: null }],
                taskExecutions: [taskAgent('/design/audit/auditor', 'design-nested-child-task')],
              },
            ],
            taskExecutions: [taskAgent('/design/reviewer', 'design-task-team-child')],
          },
        ],
      },
      {
        address: '/engineering', teamDefinitionId: 'engineering-definition', role: null, description: null,
        teamRunId: 'engineering-team-run', coordinatorAddress: '/engineering/engineer',
        defaultLaunchConfiguration: launch,
        members: [agent('/engineering/engineer', 'engineering-agent')],
        taskExecutions: [],
      },
    ],
    taskExecutions: [taskAgent('/lead', 'root-task-agent')],
  },
}

const store = reactive<any>({
  history: [{
    root_subject_kind: 'agent_org', root_run_id: 'org-run', created_at: '2026-09-01T00:00:00.000Z',
    archived_at: null, is_active: true, summary: 'Active Org', org: tree,
  }],
  historyError: null,
  restoring: false,
  terminatingRunIds: new Set<string>(),
  terminationErrors: {} as Record<string, string | null>,
  fetchHistory: vi.fn().mockResolvedValue(undefined),
  restore: vi.fn(),
  terminate: vi.fn().mockResolvedValue(undefined),
})
const disconnect = vi.fn()
const connect = vi.fn()
const select = vi.fn()
const route = reactive<any>({ query: {
  rootSubjectKind: 'agent_org', definitionId: 'org-def', orgRunId: 'org-run', mode: 'active',
} })
const routerPush = vi.fn()
const routerReplace = vi.fn()
const contextState = vi.hoisted(() => ({ current: null as any }))

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ push: routerPush, replace: routerReplace }),
}))
vi.mock('~/stores/agentOrgRunStore', () => ({ useAgentOrgRunStore: () => store }))
vi.mock('~/stores/agentOrgContextsStore', () => ({
  useAgentOrgContextsStore: () => ({
    contextFor: () => contextState.current, connect, select, disconnect,
  }),
}))

const translations: Record<string, string> = {
  'workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.team_status_running': 'Team status: Running',
  'workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.team_status_initializing': 'Team status: Initializing',
  'workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.team_status_error': 'Team status: Error',
  'workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.team_status_idle': 'Team status: Idle',
  'workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.team_status_offline': 'Team status: Offline',
}
const mountSubject = () => mount(AgentOrgRunHistoryPanel, {
  global: {
    stubs: { Icon: true, WorkspaceHierarchyBranches: true },
    mocks: { $t: (key: string) => translations[key] ?? key },
  },
})

const liveContext = (statuses: Record<string, AgentStatus>, phase = 'live') => {
  const contexts = reactive(Object.fromEntries(Object.entries(statuses).map(
    ([runId, currentStatus]) => [runId, { state: reactive({ currentStatus }) }],
  )))
  return reactive({
    orgRunId: 'org-run', executionTree: statusTree, phase, isActive: true,
    selectedAddress: null,
    getAgentContext: (runId: string) => contexts[runId] ?? null,
    contexts,
  })
}

const setStatusHistory = () => {
  store.history = [{
    root_subject_kind: 'agent_org', root_run_id: 'org-run', created_at: '2026-09-01T00:00:00.000Z',
    archived_at: null, is_active: true, summary: 'Active Org', org: statusTree,
  }]
}

describe('AgentOrgRunHistoryPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    contextState.current = null
    route.query.orgRunId = 'org-run'
    route.query.rootSubjectKind = 'agent_org'
    route.query.definitionId = 'org-def'
    route.query.mode = 'active'
    store.history = [{
      root_subject_kind: 'agent_org', root_run_id: 'org-run', created_at: '2026-09-01T00:00:00.000Z',
      archived_at: null, is_active: true, summary: 'Active Org', org: tree,
    }]
  })

  it('owns whole-Org stop on the active root row and exposes no member stop action', async () => {
    const wrapper = mountSubject()
    await flushPromises()
    const stop = wrapper.get('button[aria-label="Stop Agent Org"]')
    expect(wrapper.findAll('button[aria-label="Stop Agent Org"]')).toHaveLength(1)
    expect(wrapper.findAll('[role="treeitem"] button[aria-label*="Stop"]')).toHaveLength(0)
    await stop.trigger('click')
    await flushPromises()
    expect(store.terminate).toHaveBeenCalledWith('org-run')
    expect(disconnect).toHaveBeenCalledWith('org-run')
    expect(routerReplace).toHaveBeenCalledWith({
      path: '/workspace',
      query: { rootSubjectKind: 'agent_org', definitionId: 'org-def', mode: 'configuration' },
    })
  })

  it('does not clear a different active Org route or navigate after failed termination', async () => {
    const wrapper = mountSubject()
    await flushPromises()
    route.query.orgRunId = 'another-org-run'
    await wrapper.get('button[aria-label="Stop Agent Org"]').trigger('click')
    await flushPromises()
    expect(disconnect).toHaveBeenCalledWith('org-run')
    expect(routerReplace).not.toHaveBeenCalled()

    vi.clearAllMocks()
    route.query.orgRunId = 'org-run'
    store.terminationErrors['org-run'] = 'termination failed'
    await wrapper.get('button[aria-label="Stop Agent Org"]').trigger('click')
    await flushPromises()
    expect(disconnect).not.toHaveBeenCalled()
    expect(routerReplace).not.toHaveBeenCalled()
  })

  it('expands a newly launched active Org after history and route update without remounting', async () => {
    store.history = []
    route.query.orgRunId = ''
    const wrapper = mountSubject()
    await flushPromises()
    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(0)

    store.history = [{
      root_subject_kind: 'agent_org', root_run_id: 'org-run', created_at: '2026-09-01T00:00:00.000Z',
      archived_at: null, is_active: true, summary: 'Active Org', org: tree,
    }]
    await flushPromises()
    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(0)

    route.query.orgRunId = 'org-run'
    await flushPromises()

    expect(wrapper.get('section > button').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('button[aria-expanded="true"] span.font-medium').text()).toBe('Agent Org')
    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(1)
    expect(wrapper.get('[role="treeitem"]').text()).toContain('lead')
  })

  it('folds the complete mounted Team branch before collapse and keeps exact Agent signals reactive', async () => {
    setStatusHistory()
    contextState.current = liveContext({
      'direct-org-agent': AgentStatus.Running,
      'design-designer': AgentStatus.Idle,
      'design-researcher': AgentStatus.Error,
      'design-direct-task': AgentStatus.Idle,
      'design-task-reviewer': AgentStatus.Idle,
      'design-task-auditor': AgentStatus.Idle,
      'design-nested-child-task': AgentStatus.Idle,
      'design-task-team-child': AgentStatus.Idle,
      'engineering-agent': AgentStatus.Running,
      'root-task-agent': AgentStatus.Running,
    })
    const wrapper = mountSubject()
    await flushPromises()

    const designRow = wrapper.get('[data-test="agent-org-team-row-design-team-run"]')
    const designDot = () => designRow.get('[data-test="team-aggregate-status-dot"]')
    expect(designRow.attributes('aria-expanded')).toBe('false')
    expect(designDot().attributes()).toMatchObject({
      'data-status': AgentStatus.Error,
      'aria-label': 'Team status: Error',
      title: 'Team status: Error',
      role: 'img',
    })
    expect(designRow.attributes('aria-label')).toContain('Team status: Error')
    expect(wrapper.find('[data-test="agent-org-agent-row-design-designer"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-test="team-aggregate-status-dot"]')).toHaveLength(2)

    contextState.current.contexts['design-task-auditor'].state.currentStatus = AgentStatus.Running
    await wrapper.vm.$nextTick()
    expect(designDot().attributes('data-status')).toBe(AgentStatus.Running)

    await designRow.trigger('click')
    await flushPromises()
    expect(select).toHaveBeenCalledWith('org-run', '/design')
    expect(designRow.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-test="agent-org-agent-row-design-designer"]').attributes('data-status'))
      .toBe(AgentStatus.Idle)
    expect(wrapper.get('[data-test="agent-org-agent-row-design-researcher"]').attributes('data-status'))
      .toBe(AgentStatus.Error)
    expect(wrapper.get('[data-test="agent-org-task-agent-row-design-direct-task"]').attributes('data-status'))
      .toBe(AgentStatus.Idle)
    expect(wrapper.get('[data-test="agent-org-task-agent-row-design-task-auditor"]').attributes('data-status'))
      .toBe(AgentStatus.Running)
    expect(wrapper.get('[data-test="agent-org-task-agent-row-design-nested-child-task"]').attributes('data-status'))
      .toBe(AgentStatus.Idle)

    await designRow.trigger('click')
    await flushPromises()
    expect(designRow.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[data-test="agent-org-task-agent-row-design-task-auditor"]').exists()).toBe(false)
    contextState.current.contexts['design-task-auditor'].state.currentStatus = AgentStatus.Initializing
    contextState.current.contexts['design-researcher'].state.currentStatus = AgentStatus.Idle
    await wrapper.vm.$nextTick()
    expect(designDot().attributes('data-status')).toBe(AgentStatus.Initializing)
    expect(designDot().get('[aria-hidden="true"]').classes()).toContain('animate-pulse')
  })

  it('admits live status only from the exact active live context and demotes history to offline', async () => {
    setStatusHistory()
    contextState.current = liveContext({
      'direct-org-agent': AgentStatus.Running,
      'design-designer': AgentStatus.Running,
      'design-researcher': AgentStatus.Initializing,
      'design-direct-task': AgentStatus.Running,
      'design-task-reviewer': AgentStatus.Running,
      'design-task-auditor': AgentStatus.Running,
      'design-nested-child-task': AgentStatus.Running,
      'design-task-team-child': AgentStatus.Running,
      'engineering-agent': AgentStatus.Running,
      'root-task-agent': AgentStatus.Running,
    }, 'reopen_required')
    const wrapper = mountSubject()
    await flushPromises()

    const designDot = () => wrapper.get('[data-test="agent-org-team-row-design-team-run"] [data-test="team-aggregate-status-dot"]')
    expect(designDot().attributes('data-status')).toBe(AgentStatus.Offline)
    expect(designDot().get('[aria-hidden="true"]').classes()).toContain('bg-gray-400')
    expect(designDot().get('[aria-hidden="true"]').classes()).not.toContain('animate-pulse')
    expect(wrapper.get('[data-test="agent-org-agent-row-direct-org-agent"]').attributes('data-status'))
      .toBe(AgentStatus.Offline)

    contextState.current.phase = 'live'
    await wrapper.vm.$nextTick()
    expect(designDot().attributes('data-status')).toBe(AgentStatus.Running)

    contextState.current.orgRunId = 'different-org-run'
    await wrapper.vm.$nextTick()
    expect(designDot().attributes('data-status')).toBe(AgentStatus.Offline)
    contextState.current.orgRunId = 'org-run'

    store.history[0].is_active = false
    await wrapper.vm.$nextTick()
    expect(designDot().attributes('data-status')).toBe(AgentStatus.Offline)
    expect(wrapper.find('button[aria-label="Stop Agent Org"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-test^="agent-org-team-row-"] button[aria-label*="Stop"]')).toHaveLength(0)
  })
})
