import { mount, flushPromises } from '@vue/test-utils'
import { reactive } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AgentOrgRunHistoryPanel from '../AgentOrgRunHistoryPanel.vue'

const launch = {
  runtimeKind: 'codex_app_server', llmModelIdentifier: 'gpt-5.6-sol', llmConfig: null,
  autoExecuteTools: false, skillAccessMode: 'PRELOADED_ONLY', workspaceRootPath: '/tmp/org',
}
const tree = {
  schemaVersion: 1, subjectKind: 'agent_org', createdAt: '2026-09-01T00:00:00.000Z',
  archivedAt: null, applicationBinding: null, handoffs: [],
  rootOrg: {
    address: '/', orgDefinitionId: 'org-def', orgDefinitionName: 'Agent Org', orgRunId: 'org-run',
    defaultLaunchConfiguration: launch, taskExecutions: [],
    members: [{
      address: '/lead', agentDefinitionId: 'agent-def', role: null, description: null,
      agentRunId: 'agent-run', platformAgentRunId: null, launchConfiguration: launch,
    }],
  },
}
const store = reactive({
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

vi.mock('vue-router', () => ({
  useRoute: () => reactive({ query: { orgRunId: 'org-run' } }),
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock('~/stores/agentOrgRunStore', () => ({ useAgentOrgRunStore: () => store }))
vi.mock('~/stores/agentOrgContextsStore', () => ({
  useAgentOrgContextsStore: () => ({
    contextFor: () => null, connect: vi.fn(), select: vi.fn(), disconnect,
  }),
}))

describe('AgentOrgRunHistoryPanel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('owns whole-Org stop on the active root row and exposes no member stop action', async () => {
    const wrapper = mount(AgentOrgRunHistoryPanel, {
      global: { stubs: { Icon: true, WorkspaceHierarchyBranches: true } },
    })
    await flushPromises()
    const stop = wrapper.get('button[aria-label="Stop Agent Org"]')
    expect(wrapper.findAll('button[aria-label="Stop Agent Org"]')).toHaveLength(1)
    expect(wrapper.findAll('[role="treeitem"] button[aria-label*="Stop"]')).toHaveLength(0)
    await stop.trigger('click')
    await flushPromises()
    expect(store.terminate).toHaveBeenCalledWith('org-run')
    expect(disconnect).toHaveBeenCalledWith('org-run')
  })
})
