import type { AgentContext } from '~/types/agent/AgentContext'
import type { AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type { ContextFilePath } from '~/types/conversation'
import type { ToolApprovalTarget } from '~/types/segments'
import type { EventMonitorActiveTraceBrowseSubject } from '~/services/eventMonitor/eventMonitorActiveTracePageService'
import type { TeamCommunicationPerspectiveMessage } from '~/stores/teamCommunicationTypes'
import type { DelegatedTaskEntry } from '~/utils/teamDelegatedTaskEntries'
import type { TeamExecutionTaskPresentation } from '~/services/teamExecution/taskDelegationPresentation'

export interface AgentInteractionPort {
  send(content: string, contextPaths: readonly ContextFilePath[]): Promise<void>
  interrupt(): Promise<void>
  decideTool(
    invocationId: string,
    approved: boolean,
    reason: string | null,
    target?: ToolApprovalTarget | null,
  ): Promise<void>
}

export interface TeamWorkspaceContextView {
  readonly rootKind: 'agent_team' | 'agent_org'
  readonly rootRunId: string
  readonly teamRunId: string
  readonly teamAddress: AgentTeamAddress
  readonly teamDefinitionName: string
  readonly coordinatorAddress: AgentTeamAddress
  readonly focusedMemberAddress: AgentTeamAddress
  readonly focusedAgentRunId: string
  readonly focusedAgentContext: AgentContext
  focusedTaskPresentation(): TeamExecutionTaskPresentation | null
  isFocusedProjectionAuthoritative(): boolean
  listMembers(): readonly Readonly<{
    address: AgentTeamAddress
    agentRunId: string
    context: AgentContext
    coordinator: boolean
  }>[]
  senderNameByAgentRunId(): Readonly<Record<string, string>>
  listCommunicationMessages(): readonly TeamCommunicationPerspectiveMessage[]
  listDelegatedTaskEntries(): readonly DelegatedTaskEntry[]
  communicationReferenceContentPath(messageId: string, referenceId: string): string
  taskReferenceContentPath(taskId: string, referenceId: string): string
}

type WorkspaceTargetCore = Readonly<{
  context: AgentContext
  interaction: AgentInteractionPort
  browse: EventMonitorActiveTraceBrowseSubject
}>

export type ActiveAgentWorkspaceTarget =
  | (WorkspaceTargetCore & Readonly<{ kind: 'standalone_agent' }>)
  | (WorkspaceTargetCore & Readonly<{
      kind: 'standalone_team_member'
      team: TeamWorkspaceContextView
    }>)
  | (WorkspaceTargetCore & Readonly<{
      kind: 'agent_org_direct_agent'
      root: Readonly<{ orgRunId: string }>
      address: AgentTeamAddress
    }>)
  | (WorkspaceTargetCore & Readonly<{
      kind: 'agent_org_team_member'
      root: Readonly<{ orgRunId: string }>
      team: TeamWorkspaceContextView
      address: AgentTeamAddress
    }>)
