import type { AgentOrgExecutionViewDto } from '@autobyteus/collaboration-stream-contracts'
import type { AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import { memberAddressBasename } from '~/types/agent/AgentTeamAddress'
import type {
  DelegatedTaskDirection,
  DelegatedTaskEntry,
  DelegatedTaskLifecycleItem,
  DelegatedTaskParticipant,
} from '~/utils/teamDelegatedTaskEntries'
import { projectAgentOrgReference } from './agentOrgReferenceProjection'

type RootMember = AgentOrgExecutionViewDto['execution_tree']['rootOrg']['members'][number]
type ConfiguredTeam = Extract<RootMember, { teamRunId: string }>
type TaskRecord = AgentOrgExecutionViewDto['task_records']['records'][number]

const named = (address: string): DelegatedTaskParticipant => ({
  kind: 'named',
  label: memberAddressBasename(address),
})
const directed = (from: DelegatedTaskParticipant, to: DelegatedTaskParticipant): DelegatedTaskDirection => ({
  kind: 'directed',
  from,
  to,
})
const displayStatus = (task: TaskRecord): DelegatedTaskEntry['displayStatus'] => {
  if (task.status === 'active') {
    const latest = task.updates.at(-1)
    return latest && 'decision' in latest && latest.decision === 'request_revision'
      ? 'revision_requested'
      : 'in_progress'
  }
  return task.status
}

const lifecycle = (
  task: TaskRecord,
  delegatorAddress: AgentTeamAddress,
): readonly [DelegatedTaskLifecycleItem, ...DelegatedTaskLifecycleItem[]] => {
  const delegator = named(delegatorAddress)
  const recipient = named(task.recipientAddress)
  const assignment = directed(delegator, recipient)
  const response = directed(recipient, delegator)
  const items: DelegatedTaskLifecycleItem[] = [{
    kind: 'assignment',
    itemKey: `task:${task.taskId}:assignment`,
    createdAt: task.createdAt,
    content: task.description,
    direction: assignment,
    referenceFiles: task.referenceFiles.map((filePath) =>
      projectAgentOrgReference(task.taskId, filePath, task.createdAt)),
  }]
  const ordinals = new Map<string, number>()
  let ordinal = 0
  let revisionPending = false
  for (const update of task.updates) {
    if ('submissionId' in update) {
      ordinal += 1
      ordinals.set(update.submissionId, ordinal)
      items.push({
        kind: 'submission',
        itemKey: `task:${task.taskId}:submission:${update.submissionId}`,
        createdAt: update.createdAt,
        content: update.message,
        direction: response,
        referenceFiles: update.referenceFiles.map((filePath) =>
          projectAgentOrgReference(update.submissionId, filePath, update.createdAt)),
        resultOrdinal: ordinal,
        revised: revisionPending,
      })
      revisionPending = false
      continue
    }
    if ('reviewId' in update) {
      const reviewedResultOrdinal = ordinals.get(update.reviewedSubmissionId)
      if (reviewedResultOrdinal === undefined) continue
      if (update.decision === 'request_revision') {
        items.push({
          kind: 'review',
          decision: 'request_revision',
          itemKey: `task:${task.taskId}:review:${update.reviewId}`,
          createdAt: update.createdAt,
          content: update.comment ?? 'Revision requested',
          direction: assignment,
          referenceFiles: update.referenceFiles.map((filePath) =>
            projectAgentOrgReference(update.reviewId, filePath, update.createdAt)),
          reviewedResultOrdinal,
        })
        revisionPending = true
      } else {
        items.push({
          kind: 'review',
          decision: 'accept',
          itemKey: `task:${task.taskId}:review:${update.reviewId}`,
          createdAt: update.createdAt,
          content: update.comment,
          direction: assignment,
          referenceFiles: update.referenceFiles.map((filePath) =>
            projectAgentOrgReference(update.reviewId, filePath, update.createdAt)),
          reviewedResultOrdinal,
        })
        revisionPending = false
      }
      continue
    }
    items.push({
      kind: 'interruption',
      itemKey: `task:${task.taskId}:interruption:${update.interruptionId}`,
      createdAt: update.createdAt,
      content: update.reason,
      direction: { kind: 'system' },
      referenceFiles: [],
    })
  }
  return items as [DelegatedTaskLifecycleItem, ...DelegatedTaskLifecycleItem[]]
}

export const projectAgentOrgTeamTasks = (input: Readonly<{
  orgRunId: string
  view: AgentOrgExecutionViewDto
  team: ConfiguredTeam
  focusedAgentRunId: string
}>): readonly DelegatedTaskEntry[] => {
  const addressByRun = new Map(input.team.members.map((member) => [member.agentRunId, member.address]))
  return input.view.task_records.records.flatMap((task): DelegatedTaskEntry[] => {
    const targetAgentRunId = 'agentRunId' in task.taskExecution ? task.taskExecution.agentRunId : null
    if (task.delegatorAgentRunId !== input.focusedAgentRunId
      && targetAgentRunId !== input.focusedAgentRunId) return []
    const delegatorAddress = addressByRun.get(task.delegatorAgentRunId)
    if (!delegatorAddress) return []
    const runId = targetAgentRunId
      ?? ('teamRunId' in task.taskExecution ? task.taskExecution.teamRunId : '')
    if (!runId) return []
    return [{
      kind: targetAgentRunId ? 'task_agent' : 'task_team',
      entryKey: `task:${task.taskId}`,
      teamRunId: input.orgRunId,
      taskId: task.taskId,
      runId,
      displayStatus: displayStatus(task),
      lastActivityAt: task.updates.at(-1)?.createdAt ?? task.createdAt,
      lifecycleItems: lifecycle(task, delegatorAddress),
    }]
  })
}
