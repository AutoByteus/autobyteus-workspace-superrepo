import type { AgentOrgExecutionViewDto } from '@autobyteus/collaboration-stream-contracts'
import { memberAddressBasename, parseAgentTeamAddress, type AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type {
  CollaborationMessageMemberIdentity,
  CollaborationMessagePerspectiveRow,
} from '~/types/workspace/collaborationMessagesContextView'
import { projectAgentOrgReference } from './agentOrgReferenceProjection'

type RootMember = AgentOrgExecutionViewDto['execution_tree']['rootOrg']['members'][number]
type ConfiguredTeam = Extract<RootMember, { teamRunId: string }>
type RootTask = AgentOrgExecutionViewDto['execution_tree']['rootOrg']['taskExecutions'][number]
type TaskTeam = Extract<RootTask, { teamRunId: string }>
type TaskTeamMember = TaskTeam['members'][number]
type TaskTeamNode = TaskTeam | Extract<TaskTeamMember, { teamRunId: string }>
type Message = AgentOrgExecutionViewDto['communication_messages']['messages'][number]

export interface AgentOrgCommunicationPerspectiveIndex {
  readonly configuredByRunId: ReadonlyMap<string, CollaborationMessageMemberIdentity>
  readonly taskAgentRunIds: ReadonlySet<string>
}

const registerTaskAgent = (
  runId: string,
  configured: ReadonlyMap<string, CollaborationMessageMemberIdentity>,
  taskAgentRunIds: Set<string>,
): void => {
  if (configured.has(runId) || taskAgentRunIds.has(runId)) {
    throw new Error(`Duplicate AgentOrg communication AgentRun identity '${runId}'.`)
  }
  taskAgentRunIds.add(runId)
}

const visitTaskTeam = (
  team: TaskTeamNode,
  configured: ReadonlyMap<string, CollaborationMessageMemberIdentity>,
  taskAgentRunIds: Set<string>,
): void => {
  for (const member of team.members) {
    if ('agentRunId' in member) registerTaskAgent(member.agentRunId, configured, taskAgentRunIds)
    else visitTaskTeam(member, configured, taskAgentRunIds)
  }
  for (const task of team.taskExecutions) visitTask(task, configured, taskAgentRunIds)
}

const visitTask = (
  task: RootTask,
  configured: ReadonlyMap<string, CollaborationMessageMemberIdentity>,
  taskAgentRunIds: Set<string>,
): void => {
  if ('agentRunId' in task) registerTaskAgent(task.agentRunId, configured, taskAgentRunIds)
  else visitTaskTeam(task, configured, taskAgentRunIds)
}

export const createAgentOrgCommunicationPerspectiveIndex = (
  view: AgentOrgExecutionViewDto,
): AgentOrgCommunicationPerspectiveIndex => {
  const configured = new Map<string, CollaborationMessageMemberIdentity>()
  const taskAgentRunIds = new Set<string>()
  const registerConfigured = (agentRunId: string, address: AgentTeamAddress): void => {
    if (configured.has(agentRunId)) {
      throw new Error(`Duplicate configured AgentOrg AgentRun identity '${agentRunId}'.`)
    }
    configured.set(agentRunId, Object.freeze({ address, label: memberAddressBasename(address) }))
  }
  for (const member of view.execution_tree.rootOrg.members) {
    if ('agentRunId' in member) registerConfigured(member.agentRunId, parseAgentTeamAddress(member.address))
    else for (const agent of member.members) {
      registerConfigured(agent.agentRunId, parseAgentTeamAddress(agent.address))
    }
  }
  for (const member of view.execution_tree.rootOrg.members) {
    if ('teamRunId' in member) {
      for (const task of member.taskExecutions) visitTask(task, configured, taskAgentRunIds)
    }
  }
  for (const task of view.execution_tree.rootOrg.taskExecutions) visitTask(task, configured, taskAgentRunIds)
  return Object.freeze({ configuredByRunId: configured, taskAgentRunIds })
}

const endpointKind = (
  index: AgentOrgCommunicationPerspectiveIndex,
  agentRunId: string,
): 'configured' | 'task' => {
  if (index.configuredByRunId.has(agentRunId)) return 'configured'
  if (index.taskAgentRunIds.has(agentRunId)) return 'task'
  throw new Error(`AgentOrg communication endpoint '${agentRunId}' is not a correlated execution.`)
}

export const assertAgentOrgCommunicationMessagesCorrelated = (
  index: AgentOrgCommunicationPerspectiveIndex,
  messages: readonly Message[],
): void => {
  for (const message of messages) {
    if (message.senderAgentRunId === message.receiverAgentRunId) {
      throw new Error(`AgentOrg communication message '${message.messageId}' is self-targeted.`)
    }
    endpointKind(index, message.senderAgentRunId)
    endpointKind(index, message.receiverAgentRunId)
  }
}

export const projectAgentOrgCommunicationPerspective = (input: Readonly<{
  index: AgentOrgCommunicationPerspectiveIndex
  messages: readonly Message[]
  focusedAgentRunId: string
}>): readonly CollaborationMessagePerspectiveRow[] => {
  assertAgentOrgCommunicationMessagesCorrelated(input.index, input.messages)
  if (!input.index.configuredByRunId.has(input.focusedAgentRunId)) {
    throw new Error(`Focused AgentOrg AgentRun '${input.focusedAgentRunId}' is not configured.`)
  }
  return input.messages.flatMap((message): CollaborationMessagePerspectiveRow[] => {
    const senderKind = endpointKind(input.index, message.senderAgentRunId)
    const receiverKind = endpointKind(input.index, message.receiverAgentRunId)
    if (senderKind === 'task' || receiverKind === 'task') return []
    const sent = message.senderAgentRunId === input.focusedAgentRunId
    const received = message.receiverAgentRunId === input.focusedAgentRunId
    if (!sent && !received) return []
    const counterpartAgentRunId = sent ? message.receiverAgentRunId : message.senderAgentRunId
    const counterpart = input.index.configuredByRunId.get(counterpartAgentRunId)!
    return [Object.freeze({
      messageId: message.messageId,
      senderAgentRunId: message.senderAgentRunId,
      receiverAgentRunId: message.receiverAgentRunId,
      content: message.content,
      messageType: message.messageType,
      createdAt: message.createdAt,
      referenceFiles: Object.freeze(message.referenceFiles.map((filePath) =>
        projectAgentOrgReference(message.messageId, filePath, message.createdAt))),
      direction: sent ? 'sent' : 'received',
      counterpartAgentRunId,
      counterpartAddress: counterpart.address,
      counterpartLabel: counterpart.label,
    })]
  }).sort((left, right) => right.createdAt.localeCompare(left.createdAt)
    || left.messageId.localeCompare(right.messageId))
}
