import type { AgentOrgExecutionViewDto } from '@autobyteus/collaboration-stream-contracts'
import { AgentContext } from '~/types/agent/AgentContext'
import { AgentRunState } from '~/types/agent/AgentRunState'
import { AgentStatus } from '~/types/agent/AgentStatus'
import type { AgentRunConfig, SkillAccessMode } from '~/types/agent/AgentRunConfig'
import type { WorkspaceMetadata } from '~/types/workspace/WorkspaceMetadata'
import { parseAgentTeamAddress, type AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import { initializeRuntimeStatusState } from '~/services/runStatus/agentRuntimeStatusState'
import { buildConversationFromProjection } from '~/services/runHydration/runProjectionConversation'
import type { RunProjectionConversationEntry } from '~/services/runHydration/runProjectionConversation'
import {
  hydrateActivitiesFromProjection,
  type RunProjectionActivityEntry,
} from '~/services/runHydration/runProjectionActivityHydration'
import {
  primeRecentEventMonitorBaseline,
  resetRecentEventMonitorBaseline,
} from '~/services/eventMonitor/recentEventMonitorMutationCoordinator'
import { GetAgentOrgMemberRunProjection } from '~/graphql/queries/runHistoryQueries'
import { getApolloClient } from '~/utils/apolloClient'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import {
  AgentOrgExecutionContext,
  type AgentOrgCommandTransport,
  type AgentOrgContextEntry,
} from './agentOrgExecutionContext'

type LaunchConfiguration = AgentOrgExecutionViewDto['execution_tree']['rootOrg']['defaultLaunchConfiguration']
type TaskExecution = AgentOrgExecutionViewDto['execution_tree']['rootOrg']['taskExecutions'][number]
type TaskMember = Extract<TaskExecution, { teamRunId: string }>['members'][number]

type AgentSeed = Readonly<{
  address: AgentTeamAddress
  agentRunId: string
  agentDefinitionId: string
  launch: LaunchConfiguration
}>

type Projection = Readonly<{
  agentRunId: string
  memberAddress: string
  conversation: RunProjectionConversationEntry[]
  activities: RunProjectionActivityEntry[]
  hasEarlierActiveTraceEvents: boolean
}>

const nameAt = (address: string): string =>
  address.split('/').filter(Boolean).at(-1)?.replace(/[_-]+/g, ' ') || address

const collectTaskMemberSeeds = (
  member: TaskMember,
  inherited: LaunchConfiguration,
  output: AgentSeed[],
): void => {
  if ('agentRunId' in member) {
    output.push(Object.freeze({
      address: parseAgentTeamAddress(member.address), agentRunId: member.agentRunId,
      agentDefinitionId: 'task-execution', launch: inherited,
    }))
    return
  }
  member.members.forEach((child) => collectTaskMemberSeeds(child, inherited, output))
  member.taskExecutions.forEach((task) => collectTaskSeeds(task, inherited, output))
}

const collectTaskSeeds = (
  task: TaskExecution,
  inherited: LaunchConfiguration,
  output: AgentSeed[],
): void => {
  if ('agentRunId' in task) {
    output.push(Object.freeze({
      address: parseAgentTeamAddress(task.address), agentRunId: task.agentRunId,
      agentDefinitionId: 'task-execution', launch: inherited,
    }))
    return
  }
  task.members.forEach((member) => collectTaskMemberSeeds(member, inherited, output))
  task.taskExecutions.forEach((child) => collectTaskSeeds(child, inherited, output))
}

const collectAgentSeeds = (view: AgentOrgExecutionViewDto): readonly AgentSeed[] => {
  const output: AgentSeed[] = []
  const root = view.execution_tree.rootOrg
  for (const member of root.members) {
    if ('agentRunId' in member) output.push(Object.freeze({
      address: parseAgentTeamAddress(member.address), agentRunId: member.agentRunId,
      agentDefinitionId: member.agentDefinitionId, launch: member.launchConfiguration,
    }))
    else {
      member.members.forEach((agent) => output.push(Object.freeze({
        address: parseAgentTeamAddress(agent.address), agentRunId: agent.agentRunId,
        agentDefinitionId: agent.agentDefinitionId, launch: agent.launchConfiguration,
      })))
      member.taskExecutions.forEach((task) => collectTaskSeeds(task, member.defaultLaunchConfiguration, output))
    }
  }
  root.taskExecutions.forEach((task) => collectTaskSeeds(task, root.defaultLaunchConfiguration, output))
  const runIds = new Set<string>()
  const addresses = new Set<string>()
  for (const seed of output) {
    if (runIds.has(seed.agentRunId) || addresses.has(seed.address)) {
      throw new Error(`Duplicate AgentOrg Agent identity '${seed.agentRunId}' at '${seed.address}'.`)
    }
    runIds.add(seed.agentRunId)
    addresses.add(seed.address)
  }
  return Object.freeze(output)
}

const resolveWorkspaces = async (
  seeds: readonly AgentSeed[],
  active: boolean,
): Promise<ReadonlyMap<string, WorkspaceMetadata>> => {
  const history = useRunHistoryStore()
  const byRoot = new Map<string, Promise<WorkspaceMetadata | null>>()
  const resolve = (root: string): Promise<WorkspaceMetadata | null> => {
    const existing = byRoot.get(root)
    if (existing) return existing
    const pending = (async () => {
      if (active) await history.ensureWorkspaceByRootPath(root)
      return history.resolveWorkspaceMetadataByRootPath(root)
    })()
    byRoot.set(root, pending)
    return pending
  }
  await Promise.all(seeds.map(async (seed) => {
    if (seed.launch.workspaceRootPath) await resolve(seed.launch.workspaceRootPath)
  }))
  const output = new Map<string, WorkspaceMetadata>()
  for (const [root, pending] of byRoot) {
    const metadata = await pending
    if (metadata) output.set(root, metadata)
  }
  return output
}

const createAgentContext = (
  seed: AgentSeed,
  createdAt: string,
  workspace: WorkspaceMetadata | null,
): AgentContext => {
  const config: AgentRunConfig = {
    agentDefinitionId: seed.agentDefinitionId,
    agentDefinitionName: nameAt(seed.address),
    llmModelIdentifier: seed.launch.llmModelIdentifier,
    runtimeKind: seed.launch.runtimeKind,
    workspaceId: workspace?.workspaceId ?? null,
    workspaceMetadata: workspace,
    autoExecuteTools: seed.launch.autoExecuteTools,
    skillAccessMode: seed.launch.skillAccessMode as SkillAccessMode,
    llmConfig: seed.launch.llmConfig ? structuredClone(seed.launch.llmConfig) : null,
    isLocked: true,
  }
  const state = new AgentRunState(seed.agentRunId, {
    id: seed.agentRunId,
    messages: [],
    createdAt,
    updatedAt: createdAt,
    agentDefinitionId: seed.agentDefinitionId,
    agentName: nameAt(seed.address),
    llmModelIdentifier: seed.launch.llmModelIdentifier,
  })
  initializeRuntimeStatusState(state, AgentStatus.Offline)
  return new AgentContext(config, state)
}

const fetchProjection = async (
  orgRunId: string,
  seed: AgentSeed,
): Promise<Projection | null> => {
  try {
    const response = await getApolloClient().query<{ getAgentOrgMemberRunProjection: Projection | null }>({
      query: GetAgentOrgMemberRunProjection,
      variables: { orgRunId, memberAddress: seed.address, agentRunId: seed.agentRunId },
      fetchPolicy: 'network-only',
    })
    if (response.errors?.length) {
      throw new Error(response.errors.map((error: { message: string }) => error.message).join(', '))
    }
    const projection = response.data?.getAgentOrgMemberRunProjection ?? null
    if (projection && (projection.agentRunId !== seed.agentRunId || projection.memberAddress !== seed.address)) {
      throw new Error(`Projection identity mismatch for '${seed.agentRunId}'.`)
    }
    return projection
  } catch (error) {
    console.warn(`[agentOrgContextHydration] Projection unavailable for '${seed.agentRunId}'.`, error)
    return null
  }
}

const applyProjection = (context: AgentContext, seed: AgentSeed, projection: Projection | null): void => {
  if (!projection) return
  resetRecentEventMonitorBaseline(context)
  context.state.conversation = buildConversationFromProjection(
    seed.agentRunId,
    projection.conversation,
    {
      agentDefinitionId: seed.agentDefinitionId,
      agentName: nameAt(seed.address),
      llmModelIdentifier: seed.launch.llmModelIdentifier,
    },
  )
  context.state.hasEarlierActiveTraceEvents = projection.hasEarlierActiveTraceEvents === true
  hydrateActivitiesFromProjection(seed.agentRunId, projection.activities)
  primeRecentEventMonitorBaseline(context)
}

export const hydrateAgentOrgExecutionContext = async (input: Readonly<{
  orgRunId: string
  view: AgentOrgExecutionViewDto
  transport: AgentOrgCommandTransport
}>): Promise<AgentOrgExecutionContext> => {
  if (input.view.execution_tree.rootOrg.orgRunId !== input.orgRunId
    || input.view.task_records.orgRunId !== input.orgRunId
    || input.view.communication_messages.orgRunId !== input.orgRunId) {
    throw new Error(`AgentOrg snapshot correlation mismatch for '${input.orgRunId}'.`)
  }
  const seeds = collectAgentSeeds(input.view)
  const workspaces = await resolveWorkspaces(seeds, input.view.is_active)
  const entries: AgentOrgContextEntry[] = await Promise.all(seeds.map(async (seed) => {
    const rootPath = seed.launch.workspaceRootPath
    const context = createAgentContext(
      seed,
      input.view.execution_tree.createdAt,
      rootPath ? workspaces.get(rootPath) ?? null : null,
    )
    applyProjection(context, seed, await fetchProjection(input.orgRunId, seed))
    return Object.freeze({ agentRunId: seed.agentRunId, memberAddress: seed.address, context })
  }))
  return new AgentOrgExecutionContext({ ...input, entries })
}
