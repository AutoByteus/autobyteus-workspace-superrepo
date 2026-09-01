import type { AgentTeamContext } from '~/types/agent/AgentTeamContext'
import { parseAgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type { TeamWorkspaceContextView } from '~/types/workspace/activeAgentWorkspaceTarget'
import { projectTeamCommunicationPerspective } from '~/utils/teamCommunication/teamCommunicationPerspective'
import { deriveDelegatedTaskEntries } from '~/utils/teamDelegatedTaskEntries'

export const testTeamWorkspaceContextView = (
  team: AgentTeamContext,
  focusedAgentRunId = team.view.getFocusedAgentRunId(),
): TeamWorkspaceContextView => {
  const view = team.view
  const context = view.getAgentContext(focusedAgentRunId)
  if (!context) throw new Error(`Missing test focused AgentRun '${focusedAgentRunId}'.`)
  const memberAddress = view.getMemberAddress(focusedAgentRunId)
  if (!memberAddress) throw new Error(`Missing test focused address '${focusedAgentRunId}'.`)
  const entries = view.listAgentContextEntries()
  return {
    rootKind: 'agent_team',
    rootRunId: view.getRootTeamRunId(),
    teamRunId: view.getRootTeamRunId(),
    teamAddress: parseAgentTeamAddress('/'),
    teamDefinitionName: view.getTeamDefinitionName(),
    coordinatorAddress: parseAgentTeamAddress(view.getExecutionTree().root_team.coordinator_address),
    focusedMemberAddress: memberAddress,
    focusedAgentRunId,
    focusedAgentContext: context,
    listMembers: () => entries.map((entry) => ({
      address: entry.memberAddress,
      agentRunId: entry.agentRunId,
      context: entry.agentContext,
      coordinator: entry.memberAddress === view.getExecutionTree().root_team.coordinator_address,
    })),
    senderNameByAgentRunId: () => Object.fromEntries(entries.map((entry) => [
      entry.agentRunId,
      entry.memberAddress.split('/').at(-1) || entry.memberAddress,
    ])),
    listCommunicationMessages: () => projectTeamCommunicationPerspective({
      view,
      messages: view.listCommunicationMessages(),
      focusedAgentRunId,
    }).messages,
    listDelegatedTaskEntries: () => deriveDelegatedTaskEntries(team, focusedAgentRunId),
    communicationReferenceContentPath: (messageId, referenceId) =>
      `team-runs/${view.getRootTeamRunId()}/team-communication/messages/${messageId}/references/${referenceId}/content`,
    taskReferenceContentPath: (taskId, referenceId) =>
      `team-runs/${view.getRootTeamRunId()}/task-delegations/${taskId}/references/${referenceId}/content`,
  }
}
