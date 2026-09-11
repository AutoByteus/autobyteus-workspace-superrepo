import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import { taskBearingView } from '~/services/agentOrgExecution/__tests__/taskBearingOrgFixture'
const mocks = vi.hoisted(() => ({ query: vi.fn(), instances: [] as any[] }))
vi.mock('~/utils/apolloClient', () => ({ getApolloClient: () => ({ query: mocks.query }) }))
vi.mock('~/services/agentOrgExecution/agentOrgStreamingService', () => ({ AgentOrgStreamingService: class {
  connect = vi.fn(); disconnect = vi.fn()
  constructor(readonly options: any) { mocks.instances.push(this) }
} }))
vi.mock('~/stores/runHistoryStore', () => ({ useRunHistoryStore: () => ({
  refreshAgentOrgHistory: vi.fn(), ensureWorkspaceByRootPath: vi.fn(), resolveWorkspaceMetadataByRootPath: vi.fn(),
}) }))
import { useAgentOrgContextsStore } from '../agentOrgContextsStore'
const projection = (variables: any) => ({ data: { getAgentOrgMemberRunProjection: { ...variables,
  conversation: [], activities: [], hasEarlierActiveTraceEvents: false,
} } })
const inspection = (active = false) => {
  const view = taskBearingView(); view.is_active = active
  if (!active) view.agent_statuses = []
  return { data: { getAgentOrgRunInspection: { schema_version: 1, root_subject_kind: 'agent_org', root_run_id: 'org-run', root_org: view } } }
}
beforeEach(() => { setActivePinia(createPinia()); mocks.instances.length = 0; mocks.query.mockReset() })
afterEach(() => useAgentOrgContextsStore().disconnect('org-run'))
describe('same-owner read-only Org inspection', () => {
  it('publishes strict retained contexts and exact selection without creating a transport', async () => {
    mocks.query.mockImplementation(async ({ variables }) => variables.agentRunId ? projection(variables) : inspection())
    const store = useAgentOrgContextsStore()
    store.select('org-run', { kind: 'agent_execution', agentRunId: 'agent-task-lead' })
    await store.inspect('org-run')
    expect(store.errorFor('org-run')).toBeNull()
    expect(store.contextFor('org-run')?.activeTarget()).toMatchObject({ access: 'read_only', kind: 'agent_org_task_team_member',
      context: { state: { runId: 'agent-task-lead' } } })
    expect(mocks.instances).toHaveLength(0)
  })
  it.each(['disconnect', 'connect'] as const)('retires pending hydration on %s, without stale publication', async (operation) => {
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    mocks.query.mockImplementation(async ({ variables }) => {
      if (!variables.agentRunId) return inspection()
      await gate; return projection(variables)
    })
    const store = useAgentOrgContextsStore()
    const pending = store.inspect('org-run')
    await flushPromises()
    expect(mocks.query.mock.calls.length).toBeGreaterThan(1)
    store[operation]('org-run')
    release(); await pending
    expect(store.contextFor('org-run')).toBeNull()
    expect(store.errorFor('org-run')).toBeNull()
    expect(mocks.instances).toHaveLength(operation === 'connect' ? 1 : 0)
  })
  it('hands active inspection back to the one strict stream owner instead of publishing disk data', async () => {
    mocks.query.mockResolvedValue(inspection(true))
    const store = useAgentOrgContextsStore(); await store.inspect('org-run')
    expect(mocks.instances).toHaveLength(1)
    expect(mocks.instances[0].connect).toHaveBeenCalledOnce()
    expect(store.contextFor('org-run')).toBeNull()
    expect(mocks.query).toHaveBeenCalledOnce()
  })
  it('keeps unavailable projection distinct from an empty historical conversation', async () => {
    mocks.query.mockImplementation(async ({ variables }) => variables.agentRunId
      ? { data: { getAgentOrgMemberRunProjection: null } } : inspection())
    const store = useAgentOrgContextsStore(); await store.inspect('org-run')
    expect(store.contextFor('org-run')).toBeNull()
    expect(store.errorFor('org-run')).toContain('Projection unavailable')
    expect(mocks.instances).toHaveLength(0)
  })
})
