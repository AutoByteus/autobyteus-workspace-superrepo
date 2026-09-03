import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWorkspaceHistorySubjectActions } from '../useWorkspaceHistorySubjectActions'

const mocks = vi.hoisted(() => ({
  route: { query: {} as Record<string, string> },
  push: vi.fn().mockResolvedValue(undefined),
  replace: vi.fn().mockResolvedValue(undefined),
  history: {
    agentOrgHistory: [] as any[],
    refreshTreeQuietly: vi.fn().mockResolvedValue(undefined),
  },
  orgRun: {
    restore: vi.fn().mockResolvedValue('restored-org-run'),
    terminate: vi.fn().mockResolvedValue(undefined),
  },
  contexts: {
    select: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}))

vi.mock('vue-router', () => ({
  useRoute: () => mocks.route,
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
}))
vi.mock('~/stores/runHistoryStore', () => ({ useRunHistoryStore: () => mocks.history }))
vi.mock('~/stores/agentOrgRunStore', () => ({ useAgentOrgRunStore: () => mocks.orgRun }))
vi.mock('~/stores/agentOrgContextsStore', () => ({ useAgentOrgContextsStore: () => mocks.contexts }))

const historyRun = (isActive: boolean) => ({
  rootRunId: 'org-run-1',
  isActive,
  executionTree: { rootOrg: { orgDefinitionId: 'delivery-org' } },
})

describe('useWorkspaceHistorySubjectActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.route.query = {}
    mocks.history.agentOrgHistory = []
    mocks.orgRun.restore.mockResolvedValue('restored-org-run')
    mocks.orgRun.terminate.mockResolvedValue(undefined)
  })

  it('opens an inactive AgentOrg as terminal history without restoring it', async () => {
    mocks.history.agentOrgHistory = [historyRun(false)]
    const { execute } = useWorkspaceHistorySubjectActions()

    await execute({ rootSubjectKind: 'agent_org', rootRunId: 'org-run-1', action: 'open' })

    expect(mocks.orgRun.restore).not.toHaveBeenCalled()
    expect(mocks.contexts.connect).not.toHaveBeenCalled()
    expect(mocks.push).toHaveBeenCalledWith({
      path: '/workspace',
      query: {
        rootSubjectKind: 'agent_org',
        definitionId: 'delivery-org',
        orgRunId: 'org-run-1',
        mode: 'history',
      },
    })
  })

  it('lazily restores an inactive root exactly once when a member is selected', async () => {
    mocks.history.agentOrgHistory = [historyRun(false)]
    const { execute } = useWorkspaceHistorySubjectActions()

    await execute({
      rootSubjectKind: 'agent_org',
      rootRunId: 'org-run-1',
      action: 'select',
      memberAddress: '/software',
    })

    expect(mocks.orgRun.restore).toHaveBeenCalledOnce()
    expect(mocks.orgRun.restore).toHaveBeenCalledWith('org-run-1')
    expect(mocks.contexts.select).toHaveBeenCalledWith('restored-org-run', '/software')
    expect(mocks.contexts.connect).toHaveBeenCalledWith('restored-org-run')
    expect(mocks.history.refreshTreeQuietly).toHaveBeenCalledOnce()
    expect(mocks.push).toHaveBeenCalledWith({
      path: '/workspace',
      query: {
        rootSubjectKind: 'agent_org',
        definitionId: 'delivery-org',
        orgRunId: 'restored-org-run',
        mode: 'active',
      },
    })
  })

  it('stops only the exact active AgentOrg root and leaves no mounted-Team lifecycle path', async () => {
    mocks.history.agentOrgHistory = [historyRun(true)]
    mocks.route.query = {
      rootSubjectKind: 'agent_org',
      orgRunId: 'org-run-1',
      mode: 'active',
    }
    const { execute } = useWorkspaceHistorySubjectActions()

    await execute({ rootSubjectKind: 'agent_org', rootRunId: 'org-run-1', action: 'stop' })

    expect(mocks.orgRun.terminate).toHaveBeenCalledWith('org-run-1')
    expect(mocks.contexts.disconnect).toHaveBeenCalledWith('org-run-1')
    expect(mocks.history.refreshTreeQuietly).toHaveBeenCalledOnce()
    expect(mocks.replace).toHaveBeenCalledWith({
      path: '/workspace',
      query: { rootSubjectKind: 'agent_org', definitionId: 'delivery-org', mode: 'configuration' },
    })
  })
})
