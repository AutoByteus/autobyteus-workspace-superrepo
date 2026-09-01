import type { RootExecutionViewDto } from '@autobyteus/collaboration-stream-contracts'

export type AgentOrgConfiguredAgentNode = Readonly<{
  address: string
  agentDefinitionId: string
  agentRunId: string
}>

export type AgentOrgTaskAgentNode = Readonly<{
  address: string
  agentRunId: string
  startedAt?: string
  settledAt?: string | null
}>

export type AgentOrgTaskTeamMember = AgentOrgTaskAgentNode | Readonly<{
  address: string
  teamRunId: string
  members: readonly AgentOrgTaskTeamMember[]
  taskExecutions: readonly AgentOrgTaskExecutionNode[]
}>

export type AgentOrgTaskExecutionNode = AgentOrgTaskAgentNode | Readonly<{
  address: string
  teamRunId: string
  members: readonly AgentOrgTaskTeamMember[]
  taskExecutions: readonly AgentOrgTaskExecutionNode[]
  startedAt?: string
  settledAt?: string | null
}>

export type AgentOrgConfiguredTeamNode = Readonly<{
  address: string
  teamDefinitionId: string
  teamRunId: string
  coordinatorAddress: string
  members: readonly AgentOrgConfiguredAgentNode[]
  taskExecutions: readonly AgentOrgTaskExecutionNode[]
}>

export type AgentOrgExecutionTree = Readonly<{
  schemaVersion: 1
  subjectKind: 'agent_org'
  createdAt: string
  archivedAt: string | null
  rootOrg: Readonly<{
    orgDefinitionId: string
    orgDefinitionName: string
    orgRunId: string
    defaultLaunchConfiguration: Readonly<{ workspaceRootPath?: string | null } & Record<string, unknown>>
    members: readonly (AgentOrgConfiguredAgentNode | AgentOrgConfiguredTeamNode)[]
    taskExecutions: readonly AgentOrgTaskExecutionNode[]
  }>
}>

export const isAgentOrgAgentNode = (
  node: AgentOrgConfiguredAgentNode | AgentOrgConfiguredTeamNode,
): node is AgentOrgConfiguredAgentNode => 'agentRunId' in node

export const isAgentOrgTaskAgentNode = (
  node: AgentOrgTaskExecutionNode | AgentOrgTaskTeamMember,
): node is AgentOrgTaskAgentNode => 'agentRunId' in node

export const executionTreeFromView = (view: RootExecutionViewDto | null | undefined): AgentOrgExecutionTree | null => {
  if (!view || view.root_subject_kind !== 'agent_org') return null
  return view.root_org.execution_tree as unknown as AgentOrgExecutionTree
}
