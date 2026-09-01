import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AgentOrgExecutionViewDto } from '@autobyteus/collaboration-stream-contracts'

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  ensureWorkspaceByRootPath: vi.fn(),
  resolveWorkspaceMetadataByRootPath: vi.fn(),
}))

vi.mock('~/utils/apolloClient', () => ({
  getApolloClient: () => ({ query: mocks.query }),
}))
vi.mock('~/stores/runHistoryStore', () => ({
  useRunHistoryStore: () => ({
    ensureWorkspaceByRootPath: mocks.ensureWorkspaceByRootPath,
    resolveWorkspaceMetadataByRootPath: mocks.resolveWorkspaceMetadataByRootPath,
  }),
}))

import { hydrateAgentOrgExecutionContext } from '../agentOrgContextHydration'

const launch = {
  runtimeKind: 'codex_app_server' as const,
  llmModelIdentifier: 'gpt-5.6-sol',
  llmConfig: null,
  autoExecuteTools: false,
  skillAccessMode: 'PRELOADED_ONLY',
  workspaceRootPath: null,
}

const configuredAgent = (address: string, agentRunId: string) => ({
  address,
  agentDefinitionId: `definition-${agentRunId}`,
  role: null,
  description: null,
  agentRunId,
  platformAgentRunId: null,
  launchConfiguration: launch,
})

const status = (member_address: string, agent_run_id: string) => ({
  member_address,
  agent_run_id,
  status: 'idle' as const,
  trigger: null,
  tool_name: null,
  error_message: null,
  error_details: null,
})

const taskRecord = (
  taskId: string,
  recipientAddress: string,
  taskExecution: { agentRunId: string } | { teamRunId: string },
) => ({
  taskId,
  delegatorAgentRunId: 'agent-director',
  recipientAddress,
  taskExecution,
  description: `Task ${taskId}`,
  referenceFiles: [],
  status: 'active' as const,
  updates: [],
  createdAt: '2026-09-01T00:00:01.000Z',
})

const taskBearingView = (): AgentOrgExecutionViewDto => ({
  base_change_sequence: 8,
  is_active: true,
  execution_tree: {
    schemaVersion: 1,
    subjectKind: 'agent_org',
    createdAt: '2026-09-01T00:00:00.000Z',
    archivedAt: null,
    applicationBinding: null,
    handoffs: [],
    rootOrg: {
      address: '/',
      orgDefinitionId: 'org-definition',
      orgDefinitionName: 'Restored Org',
      orgRunId: 'org-run',
      defaultLaunchConfiguration: launch,
      members: [
        configuredAgent('/director', 'agent-director'),
        configuredAgent('/worker', 'agent-worker-configured'),
        {
          address: '/team',
          teamDefinitionId: 'team-definition',
          role: null,
          description: null,
          teamRunId: 'team-configured',
          coordinatorAddress: '/team/lead',
          defaultLaunchConfiguration: launch,
          members: [
            configuredAgent('/team/lead', 'agent-lead-configured'),
            configuredAgent('/team/worker', 'agent-team-worker-configured'),
          ],
          taskExecutions: [],
        },
      ],
      taskExecutions: [{
        address: '/worker',
        agentRunId: 'agent-worker-task',
        platformAgentRunId: null,
        startedAt: '2026-09-01T00:00:01.000Z',
        settledAt: null,
      }, {
        address: '/team',
        teamRunId: 'team-task',
        members: [
          { address: '/team/lead', agentRunId: 'agent-task-lead', platformAgentRunId: null },
          { address: '/team/worker', agentRunId: 'agent-task-worker', platformAgentRunId: null },
        ],
        taskExecutions: [],
        startedAt: '2026-09-01T00:00:02.000Z',
        settledAt: null,
      }],
    },
  },
  task_records: {
    schemaVersion: 1,
    subjectKind: 'agent_org',
    orgRunId: 'org-run',
    records: [
      taskRecord('task-agent', '/worker', { agentRunId: 'agent-worker-task' }),
      taskRecord('task-team', '/team', { teamRunId: 'team-task' }),
    ],
  },
  communication_messages: {
    schemaVersion: 1,
    subjectKind: 'agent_org',
    orgRunId: 'org-run',
    messages: [],
  },
  agent_statuses: [
    status('/director', 'agent-director'),
    status('/worker', 'agent-worker-configured'),
    status('/team/lead', 'agent-lead-configured'),
    status('/team/worker', 'agent-team-worker-configured'),
    status('/worker', 'agent-worker-task'),
    status('/team/lead', 'agent-task-lead'),
    status('/team/worker', 'agent-task-worker'),
  ],
})

describe('hydrateAgentOrgExecutionContext task-bearing package', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.query.mockResolvedValue({ data: { getAgentOrgMemberRunProjection: null } })
  })

  it('hydrates configured and fresh task runs with shared placement addresses and exact run identities', async () => {
    const context = await hydrateAgentOrgExecutionContext({
      orgRunId: 'org-run',
      view: taskBearingView(),
      transport: { interactionFor: () => ({
        send: vi.fn(), interrupt: vi.fn(), decideTool: vi.fn(),
      }) },
    })

    const entries = context.listAgentContextEntries()
    expect(entries).toHaveLength(7)
    expect(entries.filter((entry) => entry.memberAddress === '/worker').map((entry) => entry.agentRunId))
      .toEqual(['agent-worker-configured', 'agent-worker-task'])
    expect(entries.filter((entry) => entry.memberAddress === '/team/lead').map((entry) => entry.agentRunId))
      .toEqual(['agent-lead-configured', 'agent-task-lead'])
    expect(context.view.task_records.records).toHaveLength(2)
    expect(context.changeSequence).toBe(8)

    context.select('/team')
    expect(context.activeTarget()).toMatchObject({
      kind: 'agent_org_team_member',
      address: '/team/lead',
      context: { state: { runId: 'agent-lead-configured' } },
    })
    expect(mocks.query).toHaveBeenCalledTimes(7)
    expect(mocks.query).toHaveBeenCalledWith(expect.objectContaining({
      variables: {
        orgRunId: 'org-run', memberAddress: '/worker', agentRunId: 'agent-worker-task',
      },
    }))
  })
})
