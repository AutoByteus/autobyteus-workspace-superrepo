import { reactive, shallowReactive } from 'vue'
import type {
  AgentOrgExecutionEventDto,
  AgentOrgExecutionViewDto,
} from '@autobyteus/collaboration-stream-contracts'
import type { AgentContext } from '~/types/agent/AgentContext'
import { AgentStatus } from '~/types/agent/AgentStatus'
import { parseAgentTeamAddress, type AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type {
  ActiveAgentWorkspaceTarget,
  AgentInteractionPort,
  TeamWorkspaceContextView,
} from '~/types/workspace/activeAgentWorkspaceTarget'
import type { CollaborationMessagesContextView } from '~/types/workspace/collaborationMessagesContextView'
import { toAgentPresentationProjectionMessage } from '~/services/agentStreaming/teamStreamDtoAdapters'
import { dispatchAgentStreamMessage } from '~/services/agentStreaming/agentStreamMessageProjector'
import { applyOfflineOrTerminalCleanup } from '~/services/runStatus/agentRuntimeStatusState'
import { projectAgentOrgTeamTasks } from './agentOrgTeamPresentation'
import { projectSettledAgentOrgTask } from './agentOrgTaskSettlementProjection'
import {
  assertAgentOrgCommunicationMessagesCorrelated,
  createAgentOrgCommunicationPerspectiveIndex,
  projectAgentOrgCommunicationPerspective,
  type AgentOrgCommunicationPerspectiveIndex,
} from './agentOrgCommunicationPerspective'

export type AgentOrgSyncPhase = 'hydrating' | 'live' | 'reopen_required' | 'closed'
export type AgentOrgEventApplication = 'applied' | 'checkpoint_required'

export interface AgentOrgCommandTransport {
  interactionFor(agentRunId: string): AgentInteractionPort
}

export type AgentOrgContextEntry = Readonly<{
  agentRunId: string
  memberAddress: AgentTeamAddress
  context: AgentContext
}>

type ConfiguredMember = AgentOrgExecutionViewDto['execution_tree']['rootOrg']['members'][number]
type ConfiguredTeam = Extract<ConfiguredMember, { teamRunId: string }>
type ConfiguredAgent = Extract<ConfiguredMember, { agentRunId: string }>
type TaskExecution = AgentOrgExecutionViewDto['execution_tree']['rootOrg']['taskExecutions'][number]
type TaskTeam = Extract<TaskExecution, { teamRunId: string }>
type TaskTeamMember = TaskTeam['members'][number]
type TaskTeamNode = TaskTeam | Extract<TaskTeamMember, { teamRunId: string }>
type TaskRecord = AgentOrgExecutionViewDto['task_records']['records'][number]
type TaskEvent = Extract<AgentOrgExecutionEventDto, { kind: 'task' }>['event']
type ConfiguredPlacementKind = 'agent' | 'team'

const nameAt = (address: string): string => address.split('/').filter(Boolean).at(-1)?.replace(/[_-]+/g, ' ') || address

export class AgentOrgExecutionContext {
  readonly orgRunId: string
  view: AgentOrgExecutionViewDto
  phase: AgentOrgSyncPhase = 'hydrating'
  error: string | null = null
  focusAddress: AgentTeamAddress | null = null
  private readonly contexts = shallowReactive(new Map<string, AgentContext>())
  private readonly addressByRunId = new Map<string, AgentTeamAddress>()
  private readonly addressByTeamRunId = new Map<string, AgentTeamAddress>()
  private readonly configuredPlacementKindByAddress = new Map<AgentTeamAddress, ConfiguredPlacementKind>()
  private readonly taskAgentAddressByRunId = new Map<string, AgentTeamAddress>()
  private readonly taskTeamAddressByRunId = new Map<string, AgentTeamAddress>()
  private readonly communicationIndex: AgentOrgCommunicationPerspectiveIndex
  private readonly messagesViewByAgentRunId = new Map<string, CollaborationMessagesContextView>()
  private nextChangeSequence: number

  constructor(input: Readonly<{
    orgRunId: string
    view: AgentOrgExecutionViewDto
    entries: readonly AgentOrgContextEntry[]
    transport: AgentOrgCommandTransport
  }>) {
    this.orgRunId = input.orgRunId
    this.view = structuredClone(input.view)
    this.nextChangeSequence = input.view.base_change_sequence + 1
    for (const entry of input.entries) {
      if (entry.agentRunId !== entry.context.state.runId || this.contexts.has(entry.agentRunId)) {
        throw new Error(`Invalid or duplicate AgentOrg context '${entry.agentRunId}'.`)
      }
      entry.context.state = reactive(entry.context.state)
      const context = reactive(entry.context)
      this.contexts.set(entry.agentRunId, context)
      this.addressByRunId.set(entry.agentRunId, entry.memberAddress)
    }
    this.indexAndValidateIdentities()
    this.communicationIndex = createAgentOrgCommunicationPerspectiveIndex(this.view)
    assertAgentOrgCommunicationMessagesCorrelated(
      this.communicationIndex,
      this.view.communication_messages.messages,
    )
    for (const status of input.view.agent_statuses) {
      const address = this.addressByRunId.get(status.agent_run_id)
      if (address !== status.member_address) {
        throw new Error(`AgentOrg status '${status.agent_run_id}' has no exact context identity.`)
      }
      this.contexts.get(status.agent_run_id)!.state.currentStatus = status.status as AgentStatus
    }
    this.transport = input.transport
    this.phase = 'live'
  }

  private readonly transport: AgentOrgCommandTransport

  get executionTree() { return this.view.execution_tree }
  get isActive(): boolean { return this.view.is_active }
  get changeSequence(): number { return this.nextChangeSequence - 1 }
  get selectedAddress(): AgentTeamAddress | null { return this.focusAddress }

  listAgentContextEntries(): readonly AgentOrgContextEntry[] {
    return Object.freeze([...this.contexts].map(([agentRunId, context]) => Object.freeze({
      agentRunId,
      memberAddress: this.addressByRunId.get(agentRunId)!,
      context,
    })))
  }

  getAgentContext(agentRunId: string): AgentContext | null {
    return this.contexts.get(agentRunId) ?? null
  }

  select(address: string | null): void {
    if (!address) {
      this.focusAddress = null
      return
    }
    const parsed = parseAgentTeamAddress(address)
    const member = this.executionTree.rootOrg.members.find((candidate) => candidate.address === parsed)
    if (member && 'agentRunId' in member) {
      this.focusAddress = parsed
      return
    }
    if (member && 'teamRunId' in member && this.teamCoordinator(member)) {
      this.focusAddress = parsed
      return
    }
    const team = this.teamContainingAgent(parsed)
    this.focusAddress = team ? parsed : null
  }

  activeTarget(): ActiveAgentWorkspaceTarget | null {
    if (!this.focusAddress
      || (this.phase !== 'live' && this.phase !== 'reopen_required')
      || !this.isActive) return null
    const rootMember = this.executionTree.rootOrg.members.find((member) => member.address === this.focusAddress)
    if (rootMember && 'agentRunId' in rootMember) {
      const context = this.contexts.get(rootMember.agentRunId)
      if (!context) return null
      return Object.freeze({
        kind: 'agent_org_direct_agent',
        root: Object.freeze({ orgRunId: this.orgRunId }),
        address: rootMember.address,
        collaborationMessages: this.messagesView(rootMember.address, rootMember.agentRunId),
        context,
        interaction: this.transport.interactionFor(rootMember.agentRunId),
        browse: Object.freeze({
          kind: 'agentOrgMember', orgRunId: this.orgRunId,
          memberAddress: rootMember.address, agentRunId: rootMember.agentRunId,
        }),
      })
    }
    const team = rootMember && 'teamRunId' in rootMember
      ? rootMember
      : this.teamContainingAgent(this.focusAddress)
    if (!team) return null
    const focusedMember = rootMember && 'teamRunId' in rootMember
      ? this.teamCoordinator(team)
      : team.members.find((member) => member.address === this.focusAddress)
    if (!focusedMember) return null
    const memberAddress = focusedMember.address
    const agentRunId = focusedMember.agentRunId
    const context = this.contexts.get(agentRunId)
    if (!context || this.addressByRunId.get(agentRunId) !== memberAddress) return null
    return Object.freeze({
      kind: 'agent_org_team_member',
      root: Object.freeze({ orgRunId: this.orgRunId }),
      team: this.teamView(team, memberAddress, agentRunId, context),
      address: memberAddress,
      collaborationMessages: this.messagesView(memberAddress, agentRunId),
      context,
      interaction: this.transport.interactionFor(agentRunId),
      browse: Object.freeze({
        kind: 'agentOrgMember', orgRunId: this.orgRunId,
        memberAddress, agentRunId,
      }),
    })
  }

  applyEvent(changeSequence: number, event: AgentOrgExecutionEventDto): AgentOrgEventApplication {
    if (this.phase !== 'live') throw new Error('AgentOrg context is not accepting stream events.')
    if (changeSequence !== this.nextChangeSequence) {
      this.requireReopen(`Expected change sequence ${this.nextChangeSequence}, received ${changeSequence}.`)
      throw new Error(this.error!)
    }
    if (event.kind === 'agent_presentation') {
      const address = this.addressByRunId.get(event.agent_run_id)
      const context = this.contexts.get(event.agent_run_id)
      if (!context || address !== event.member_address) {
        this.requireReopen(`Agent presentation identity '${event.agent_run_id}' is not in the context.`)
        throw new Error(this.error!)
      }
      dispatchAgentStreamMessage(
        toAgentPresentationProjectionMessage(event.message, event.agent_run_id),
        {
          kind: 'agent_org_member', context, orgRunId: this.orgRunId,
          agentRunId: event.agent_run_id, memberAddress: address,
        },
      )
    } else if (event.kind === 'task') {
      if (this.validateTaskEvent(event.event) === 'checkpoint_required') {
        return 'checkpoint_required'
      }
      const settlement = event.event.kind === 'settled'
        ? this.projectTaskSettlement(event.event.task, event.event.settledAt)
        : null
      if (settlement) this.view = settlement.view
      else {
        const records = [...this.view.task_records.records]
        const index = records.findIndex((record) => record.taskId === event.event.task.taskId)
        if (index >= 0) records[index] = event.event.task
        else records.push(event.event.task)
        this.view = {
          ...this.view,
          task_records: { ...this.view.task_records, records },
        }
      }
    } else {
      try {
        assertAgentOrgCommunicationMessagesCorrelated(this.communicationIndex, [event.message])
      } catch {
        this.correlationFailure(`AgentOrg communication message '${event.message.messageId}' identity mismatch.`)
      }
      this.view = {
        ...this.view,
        communication_messages: {
          ...this.view.communication_messages,
          messages: [...this.view.communication_messages.messages, event.message],
        },
      }
    }
    this.nextChangeSequence += 1
    return 'applied'
  }

  setActive(active: boolean): void {
    this.view = { ...this.view, is_active: active }
    if (!active) {
      this.focusAddress = null
      this.phase = 'closed'
    }
  }

  requireReopen(message: string): void {
    this.error = message
    this.phase = 'reopen_required'
  }

  private teamContainingAgent(address: AgentTeamAddress): ConfiguredTeam | null {
    return this.executionTree.rootOrg.members.find((member): member is ConfiguredTeam =>
      'teamRunId' in member && member.members.some((agent) => agent.address === address)) ?? null
  }

  private indexAndValidateIdentities(): void {
    for (const member of this.executionTree.rootOrg.members) {
      if ('agentRunId' in member) {
        this.registerConfiguredPlacement(member.address, 'agent')
        this.requireAgentContextIdentity(member.agentRunId, member.address, 'Configured Agent')
        continue
      }
      this.registerConfiguredPlacement(member.address, 'team')
      this.registerTeamIdentity(member.teamRunId, member.address)
      for (const agent of member.members) {
        this.registerConfiguredPlacement(agent.address, 'agent')
        this.requireAgentContextIdentity(
          agent.agentRunId,
          agent.address,
          `Configured Team '${member.address}' member`,
        )
      }
      if (!this.teamCoordinator(member)) {
        throw new Error(`Configured Team '${member.address}' coordinator is not one of its direct Agent members.`)
      }
      member.taskExecutions.forEach((task) => this.indexTaskExecution(task))
    }
    this.executionTree.rootOrg.taskExecutions.forEach((task) => this.indexTaskExecution(task))
    for (const task of this.view.task_records.records) this.validateSnapshotTask(task)
  }

  private registerConfiguredPlacement(address: string, kind: ConfiguredPlacementKind): void {
    const parsed = parseAgentTeamAddress(address)
    if (this.configuredPlacementKindByAddress.has(parsed)) {
      throw new Error(`Duplicate AgentOrg configured address '${parsed}'.`)
    }
    this.configuredPlacementKindByAddress.set(parsed, kind)
  }

  private requireAgentContextIdentity(agentRunId: string, address: string, label: string): void {
    if (this.addressByRunId.get(agentRunId) !== address || !this.contexts.has(agentRunId)) {
      throw new Error(`${label} '${address}' has no exact AgentOrg context.`)
    }
  }

  private registerTeamIdentity(teamRunId: string, address: string): void {
    if (this.addressByTeamRunId.has(teamRunId)) {
      throw new Error(`Duplicate AgentOrg TeamRun identity '${teamRunId}'.`)
    }
    this.addressByTeamRunId.set(teamRunId, parseAgentTeamAddress(address))
  }

  private indexTaskExecution(task: TaskExecution): void {
    if ('agentRunId' in task) {
      this.requireAgentContextIdentity(task.agentRunId, task.address, 'Task Agent')
      this.taskAgentAddressByRunId.set(task.agentRunId, parseAgentTeamAddress(task.address))
      return
    }
    this.indexTaskTeam(task, true)
  }

  private indexTaskTeam(team: TaskTeamNode, taskExecutionRoot: boolean): void {
    this.registerTeamIdentity(team.teamRunId, team.address)
    if (taskExecutionRoot) {
      this.taskTeamAddressByRunId.set(team.teamRunId, parseAgentTeamAddress(team.address))
    }
    team.members.forEach((member) => {
      if ('agentRunId' in member) {
        this.requireAgentContextIdentity(member.agentRunId, member.address, 'Task Team Agent')
      } else {
        this.indexTaskTeam(member, false)
      }
    })
    team.taskExecutions.forEach((task) => this.indexTaskExecution(task))
  }

  private teamCoordinator(team: ConfiguredTeam): ConfiguredAgent | null {
    const coordinator = team.members.find((member) => member.address === team.coordinatorAddress) ?? null
    return coordinator
      && this.addressByRunId.get(coordinator.agentRunId) === coordinator.address
      && this.contexts.has(coordinator.agentRunId)
      ? coordinator
      : null
  }

  private validateTaskEvent(event: TaskEvent): AgentOrgEventApplication {
    const task = event.task
    if (!this.addressByRunId.has(task.delegatorAgentRunId)) {
      this.correlationFailure(`AgentOrg task '${task.taskId}' delegator identity mismatch.`)
    }
    const existing = this.view.task_records.records.find((record) => record.taskId === task.taskId)
    if (event.kind === 'activated') {
      if (existing) this.correlationFailure(`AgentOrg task '${task.taskId}' activation is duplicated.`)
      this.validateFreshTaskExecution(task)
      return 'checkpoint_required'
    }
    if (!existing || !this.sameTaskIdentity(existing, task)
      || !this.taskExecutionMatchesConfiguredRecipient(task)) {
      this.correlationFailure(`AgentOrg task '${task.taskId}' lifecycle identity mismatch.`)
    }
    return 'applied'
  }

  private validateSnapshotTask(task: TaskRecord): void {
    if (!this.addressByRunId.has(task.delegatorAgentRunId)
      || !this.taskExecutionMatchesConfiguredRecipient(task)) {
      throw new Error(`AgentOrg task '${task.taskId}' snapshot identity mismatch.`)
    }
  }

  private taskExecutionMatchesConfiguredRecipient(task: TaskRecord): boolean {
    const recipient = parseAgentTeamAddress(task.recipientAddress)
    if ('agentRunId' in task.taskExecution) {
      return this.configuredPlacementKindByAddress.get(recipient) === 'agent'
        && this.taskAgentAddressByRunId.get(task.taskExecution.agentRunId) === recipient
    }
    return this.configuredPlacementKindByAddress.get(recipient) === 'team'
      && this.taskTeamAddressByRunId.get(task.taskExecution.teamRunId) === recipient
  }

  private validateFreshTaskExecution(task: TaskRecord): void {
    const recipient = parseAgentTeamAddress(task.recipientAddress)
    const expectedKind = 'agentRunId' in task.taskExecution ? 'agent' : 'team'
    const runId = 'agentRunId' in task.taskExecution
      ? task.taskExecution.agentRunId
      : task.taskExecution.teamRunId
    if (this.configuredPlacementKindByAddress.get(recipient) !== expectedKind
      || this.addressByRunId.has(runId)
      || this.addressByTeamRunId.has(runId)) {
      this.correlationFailure(`AgentOrg task '${task.taskId}' execution identity mismatch.`)
    }
  }

  private sameTaskIdentity(left: TaskRecord, right: TaskRecord): boolean {
    if (left.delegatorAgentRunId !== right.delegatorAgentRunId
      || left.recipientAddress !== right.recipientAddress) return false
    return 'agentRunId' in left.taskExecution
      ? 'agentRunId' in right.taskExecution
        && left.taskExecution.agentRunId === right.taskExecution.agentRunId
      : 'teamRunId' in right.taskExecution
        && left.taskExecution.teamRunId === right.taskExecution.teamRunId
  }

  private projectTaskSettlement(task: TaskRecord, settledAt: string) {
    let settlement: ReturnType<typeof projectSettledAgentOrgTask>
    try {
      settlement = projectSettledAgentOrgTask({
        view: this.view,
        task,
        settledAt,
      })
    } catch {
      this.correlationFailure(`AgentOrg task '${task.taskId}' settlement projection mismatch.`)
    }
    const contexts = settlement.terminalAgentRunIds.map((agentRunId) => this.contexts.get(agentRunId))
    if (contexts.some((context) => !context)) {
      this.correlationFailure(`AgentOrg task '${task.taskId}' settlement context mismatch.`)
    }
    contexts.forEach((context) => applyOfflineOrTerminalCleanup(context!))
    return settlement
  }

  private correlationFailure(message: string): never {
    this.requireReopen(message)
    throw new Error(this.error!)
  }

  private teamView(
    team: ConfiguredTeam,
    focusedMemberAddress: AgentTeamAddress,
    focusedAgentRunId: string,
    focusedAgentContext: AgentContext,
  ): TeamWorkspaceContextView {
    const members = team.members.map((member) => Object.freeze({
      address: member.address,
      agentRunId: member.agentRunId,
      context: this.contexts.get(member.agentRunId)!,
      coordinator: member.address === team.coordinatorAddress,
    }))
    return Object.freeze({
      rootKind: 'agent_org', rootRunId: this.orgRunId,
      teamRunId: team.teamRunId, teamAddress: team.address,
      teamDefinitionName: nameAt(team.address), coordinatorAddress: team.coordinatorAddress,
      focusedMemberAddress, focusedAgentRunId, focusedAgentContext,
      focusedTaskPresentation: () => null,
      isFocusedProjectionAuthoritative: () => true,
      listMembers: () => Object.freeze(members),
      listDelegatedTaskEntries: () => projectAgentOrgTeamTasks({
        orgRunId: this.orgRunId,
        view: this.view,
        team,
        focusedAgentRunId,
      }),
      taskReferenceContentPath: (taskId: string, referenceId: string) =>
        `agent-org-runs/${encodeURIComponent(this.orgRunId)}/task-delegations/${encodeURIComponent(taskId)}/references/${encodeURIComponent(referenceId)}/content`,
    })
  }

  private messagesView(
    focusedMemberAddress: AgentTeamAddress,
    focusedAgentRunId: string,
  ): CollaborationMessagesContextView {
    const current = this.messagesViewByAgentRunId.get(focusedAgentRunId)
    if (current) return current
    const memberIdentities = Object.freeze(Object.fromEntries(
      [...this.communicationIndex.configuredByRunId].map(([agentRunId, identity]) => [
        agentRunId,
        Object.freeze({ ...identity }),
      ]),
    ))
    const messages = Object.freeze({
      rootKind: 'agent_org',
      rootRunId: this.orgRunId,
      focusedAgentRunId,
      focusedMemberAddress,
      memberIdentityByAgentRunId: () => memberIdentities,
      listMessages: () => projectAgentOrgCommunicationPerspective({
        index: this.communicationIndex,
        messages: this.view.communication_messages.messages,
        focusedAgentRunId,
      }),
      referenceContentPath: (messageId: string, referenceId: string) =>
        `agent-org-runs/${encodeURIComponent(this.orgRunId)}/communication/messages/${encodeURIComponent(messageId)}/references/${encodeURIComponent(referenceId)}/content`,
    })
    this.messagesViewByAgentRunId.set(focusedAgentRunId, messages)
    return messages
  }
}
