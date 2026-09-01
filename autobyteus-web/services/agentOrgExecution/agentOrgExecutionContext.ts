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
import { toAgentPresentationProjectionMessage } from '~/services/agentStreaming/teamStreamDtoAdapters'
import { dispatchAgentStreamMessage } from '~/services/agentStreaming/agentStreamMessageProjector'
import {
  projectAgentOrgTeamMessages,
  projectAgentOrgTeamTasks,
} from './agentOrgTeamPresentation'

export type AgentOrgSyncPhase = 'hydrating' | 'live' | 'reopen_required' | 'closed'

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

const nameAt = (address: string): string => address.split('/').filter(Boolean).at(-1)?.replace(/[_-]+/g, ' ') || address

export class AgentOrgExecutionContext {
  readonly orgRunId: string
  view: AgentOrgExecutionViewDto
  phase: AgentOrgSyncPhase = 'hydrating'
  error: string | null = null
  focusAddress: AgentTeamAddress | null = null
  private readonly contexts = shallowReactive(new Map<string, AgentContext>())
  private readonly addressByRunId = new Map<string, AgentTeamAddress>()
  private readonly runIdByAddress = new Map<AgentTeamAddress, string>()
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
      this.runIdByAddress.set(entry.memberAddress, entry.agentRunId)
    }
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
    if (member && 'teamRunId' in member && this.runIdByAddress.has(member.coordinatorAddress)) {
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
    const memberAddress = rootMember && 'teamRunId' in rootMember
      ? team.coordinatorAddress
      : this.focusAddress
    const agentRunId = this.runIdByAddress.get(memberAddress)
    const context = agentRunId ? this.contexts.get(agentRunId) : null
    if (!agentRunId || !context) return null
    return Object.freeze({
      kind: 'agent_org_team_member',
      root: Object.freeze({ orgRunId: this.orgRunId }),
      team: this.teamView(team, memberAddress, agentRunId, context),
      address: memberAddress,
      context,
      interaction: this.transport.interactionFor(agentRunId),
      browse: Object.freeze({
        kind: 'agentOrgMember', orgRunId: this.orgRunId,
        memberAddress, agentRunId,
      }),
    })
  }

  applyEvent(changeSequence: number, event: AgentOrgExecutionEventDto): void {
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
      const records = [...this.view.task_records.records]
      const index = records.findIndex((record) => record.taskId === event.event.task.taskId)
      if (index >= 0) records[index] = event.event.task
      else records.push(event.event.task)
      this.view = {
        ...this.view,
        task_records: { ...this.view.task_records, records },
      }
    } else {
      this.view = {
        ...this.view,
        communication_messages: {
          ...this.view.communication_messages,
          messages: [...this.view.communication_messages.messages, event.message],
        },
      }
    }
    this.nextChangeSequence += 1
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
      listMembers: () => Object.freeze(members),
      senderNameByAgentRunId: () => Object.freeze(Object.fromEntries(
        members.map((member) => [member.agentRunId, nameAt(member.address)]),
      )),
      listCommunicationMessages: () => projectAgentOrgTeamMessages({
        view: this.view,
        team,
        focusedAgentRunId,
      }),
      listDelegatedTaskEntries: () => projectAgentOrgTeamTasks({
        orgRunId: this.orgRunId,
        view: this.view,
        team,
        focusedAgentRunId,
      }),
      communicationReferenceContentPath: (messageId: string, referenceId: string) =>
        `agent-org-runs/${encodeURIComponent(this.orgRunId)}/communication/messages/${encodeURIComponent(messageId)}/references/${encodeURIComponent(referenceId)}/content`,
      taskReferenceContentPath: (taskId: string, referenceId: string) =>
        `agent-org-runs/${encodeURIComponent(this.orgRunId)}/task-delegations/${encodeURIComponent(taskId)}/references/${encodeURIComponent(referenceId)}/content`,
    })
  }
}
