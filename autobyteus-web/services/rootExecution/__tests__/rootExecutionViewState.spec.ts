import { describe, expect, it, vi } from 'vitest'
import { AgentOrgExecutionContext } from '~/services/agentOrgExecution/agentOrgExecutionContext'
import { AgentContext } from '~/types/agent/AgentContext'
import { AgentRunState } from '~/types/agent/AgentRunState'
import { AgentStatus } from '~/types/agent/AgentStatus'
import { parseAgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type { AgentOrgExecutionViewDto } from '@autobyteus/collaboration-stream-contracts'

const launch = {
  runtimeKind: 'codex_app_server' as const,
  llmModelIdentifier: 'gpt-5.6-sol',
  llmConfig: null,
  autoExecuteTools: false,
  skillAccessMode: 'PRELOADED_ONLY',
  workspaceRootPath: null,
}
const view = (): AgentOrgExecutionViewDto => ({
  base_change_sequence: 4,
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
      orgDefinitionId: 'org-def',
      orgDefinitionName: 'Org',
      orgRunId: 'org-run',
      defaultLaunchConfiguration: launch,
      taskExecutions: [],
      members: [
        {
          address: '/direct', agentDefinitionId: 'direct-def', role: null, description: null,
          agentRunId: 'agent-direct', platformAgentRunId: null, launchConfiguration: launch,
        },
        {
          address: '/team', teamDefinitionId: 'team-def', role: null, description: null,
          teamRunId: 'team-run', coordinatorAddress: '/team/coordinator',
          defaultLaunchConfiguration: launch, taskExecutions: [],
          members: [
            {
              address: '/team/coordinator', agentDefinitionId: 'coordinator-def', role: null,
              description: null, agentRunId: 'agent-coordinator', platformAgentRunId: null,
              launchConfiguration: launch,
            },
            {
              address: '/team/member', agentDefinitionId: 'member-def', role: null,
              description: null, agentRunId: 'agent-member', platformAgentRunId: null,
              launchConfiguration: launch,
            },
          ],
        },
      ],
    },
  },
  task_records: { schemaVersion: 1, subjectKind: 'agent_org', orgRunId: 'org-run', records: [] },
  communication_messages: { schemaVersion: 1, subjectKind: 'agent_org', orgRunId: 'org-run', messages: [] },
  agent_statuses: [
    { member_address: '/direct', agent_run_id: 'agent-direct', status: 'idle', trigger: null, tool_name: null, error_message: null, error_details: null },
    { member_address: '/team/coordinator', agent_run_id: 'agent-coordinator', status: 'idle', trigger: null, tool_name: null, error_message: null, error_details: null },
    { member_address: '/team/member', agent_run_id: 'agent-member', status: 'idle', trigger: null, tool_name: null, error_message: null, error_details: null },
  ],
})
const agentContext = (runId: string, name: string) => new AgentContext({
  agentDefinitionId: `${name}-def`, agentDefinitionName: name,
  llmModelIdentifier: launch.llmModelIdentifier, runtimeKind: launch.runtimeKind,
  workspaceId: null, workspaceMetadata: null, autoExecuteTools: false,
  skillAccessMode: 'PRELOADED_ONLY', isLocked: true, llmConfig: null,
}, new AgentRunState(runId, {
  id: runId, messages: [], createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z', agentDefinitionId: `${name}-def`,
  agentName: name, llmModelIdentifier: launch.llmModelIdentifier,
}))
const build = () => {
  const send = vi.fn().mockResolvedValue(undefined)
  const context = new AgentOrgExecutionContext({
    orgRunId: 'org-run', view: view(),
    entries: [
      { agentRunId: 'agent-direct', memberAddress: parseAgentTeamAddress('/direct'), context: agentContext('agent-direct', 'Direct') },
      { agentRunId: 'agent-coordinator', memberAddress: parseAgentTeamAddress('/team/coordinator'), context: agentContext('agent-coordinator', 'Coordinator') },
      { agentRunId: 'agent-member', memberAddress: parseAgentTeamAddress('/team/member'), context: agentContext('agent-member', 'Member') },
    ],
    transport: { interactionFor: () => ({ send, interrupt: vi.fn(), decideTool: vi.fn() }) },
  })
  return { context, send }
}

describe('AgentOrgExecutionContext', () => {
  it('starts unfocused and resolves direct Team focus only to its exact coordinator', () => {
    const { context } = build()
    expect(context.selectedAddress).toBeNull()
    expect(context.activeTarget()).toBeNull()
    context.select('/team')
    expect(context.activeTarget()).toMatchObject({
      kind: 'agent_org_team_member', address: '/team/coordinator',
      context: { state: { runId: 'agent-coordinator' } },
    })
    context.select('/team/member')
    expect(context.activeTarget()).toMatchObject({
      kind: 'agent_org_team_member', address: '/team/member',
      context: { state: { runId: 'agent-member' } },
    })
    context.select('/missing')
    expect(context.activeTarget()).toBeNull()
  })

  it('projects strict Agent presentation and fails closed on a sequence gap', () => {
    const { context } = build()
    context.applyEvent(5, {
      kind: 'agent_presentation', member_address: '/direct', agent_run_id: 'agent-direct',
      message: { type: 'AGENT_STATUS', payload: {
        status: 'running', trigger: 'user', tool_name: null,
        error_message: null, error_details: null,
      } },
    })
    expect(context.getAgentContext('agent-direct')?.state.currentStatus).toBe(AgentStatus.Running)
    expect(context.changeSequence).toBe(5)
    expect(() => context.applyEvent(7, {
      kind: 'communication',
      message: {
        messageId: 'message-1', senderAgentRunId: 'agent-direct', receiverAgentRunId: 'agent-member',
        content: 'hello', messageType: 'agent_message', referenceFiles: [],
        createdAt: '2026-09-01T00:00:01.000Z',
      },
    })).toThrow(/Expected change sequence 6, received 7/)
    expect(context.phase).toBe('reopen_required')
    context.select('/direct')
    expect(context.activeTarget()).toMatchObject({
      kind: 'agent_org_direct_agent',
      address: '/direct',
      context: { state: { runId: 'agent-direct' } },
    })
  })
})
