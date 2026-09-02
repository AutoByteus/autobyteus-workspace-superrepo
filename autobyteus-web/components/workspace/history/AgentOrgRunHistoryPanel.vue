<template>
  <div class="flex h-full flex-col bg-white" data-test="agent-org-run-history">
    <div class="flex items-center justify-between border-t border-gray-200 px-3 py-2">
      <h3 class="text-sm font-semibold text-gray-700">Workspaces</h3>
      <button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-indigo-50 hover:text-indigo-600" :aria-label="t('workspace.agentOrg.history.refreshLabel')" @click="refresh">
        <Icon icon="heroicons:arrow-path-20-solid" class="h-4 w-4" />
      </button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-1 pb-2">
      <p v-if="store.historyError" class="px-3 py-3 text-xs text-red-600">{{ store.historyError }}</p>
      <section v-for="group in groups" :key="group.workspace" class="rounded-md">
        <button type="button" class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50" :aria-expanded="isWorkspaceExpanded(group.workspace)" @click="toggleWorkspace(group.workspace)">
          <Icon icon="heroicons:chevron-down-20-solid" class="mr-1.5 h-4 w-4 text-gray-400 transition-transform" :class="isWorkspaceExpanded(group.workspace) ? '' : '-rotate-90'" />
          <Icon icon="heroicons:folder-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" />
          <span class="truncate">{{ workspaceLabel(group.workspace) }}</span>
        </button>

        <div v-if="isWorkspaceExpanded(group.workspace)" class="ml-2 mt-0.5 space-y-1">
          <div class="px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">{{ t('workspace.agentOrg.history.collectionLabel') }}</div>
          <div v-for="orgGroup in group.orgs" :key="orgGroup.definitionId" class="rounded-md">
            <button type="button" class="flex w-full items-center rounded-md px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-50" :aria-expanded="isOrgExpanded(orgGroup.definitionId)" @click="toggleOrg(orgGroup.definitionId)">
              <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="isOrgExpanded(orgGroup.definitionId) ? '' : '-rotate-90'" />
              <span class="mr-1.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded bg-gray-100 text-gray-600"><Icon icon="heroicons:building-office-2-20-solid" class="h-3.5 w-3.5" /></span>
              <span class="truncate font-medium">{{ orgGroup.name }}</span>
              <span class="ml-1 text-xs text-gray-400">({{ orgGroup.runs.length }})</span>
            </button>

            <div v-if="isOrgExpanded(orgGroup.definitionId)" class="ml-3 mt-0.5 space-y-0.5">
              <div v-for="run in orgGroup.runs" :key="run.root_run_id" class="rounded-md">
                <div class="group flex items-center justify-between rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">
                  <button type="button" class="flex min-w-0 flex-1 items-center text-left" :aria-expanded="isRunExpanded(run.root_run_id)" @click="openRun(run)">
                    <Icon icon="heroicons:chevron-down-20-solid" class="mr-1 h-3.5 w-3.5 text-gray-400 transition-transform" :class="isRunExpanded(run.root_run_id) ? '' : '-rotate-90'" />
                    <span class="mr-1.5 h-2 w-2 flex-none rounded-full" :class="run.is_active ? 'bg-emerald-500' : 'bg-gray-300'" :aria-label="run.is_active ? 'Running' : 'Stopped'" />
                    <span class="truncate font-medium">{{ run.summary || `New - ${orgGroup.name}` }}</span>
                  </button>
                  <button
                    v-if="run.is_active"
                    type="button"
                    class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    :title="t('workspace.agentOrg.history.stopLabel')"
                    :aria-label="t('workspace.agentOrg.history.stopLabel')"
                    :disabled="store.terminatingRunIds.has(run.root_run_id)"
                    @click.stop="stopOrg(run)"
                  >
                    <Icon icon="heroicons:stop-20-solid" class="h-3.5 w-3.5" />
                  </button>
                  <span class="ml-2 text-xs text-gray-400">{{ relative(run.created_at) }}</span>
                </div>
                <p v-if="store.terminationErrors[run.root_run_id]" class="px-7 py-1 text-xs text-red-600" role="alert">
                  {{ store.terminationErrors[run.root_run_id] }}
                </p>

                <div v-if="isRunExpanded(run.root_run_id)" class="team-execution-tree ml-3 space-y-0.5" role="tree" :aria-label="`${orgGroup.name} execution hierarchy`">
                  <template v-for="display in rowsFor(run)" :key="display.row.key">
                    <button
                      v-if="display.row.kind === 'agent'"
                      type="button"
                      class="org-execution-row relative flex min-h-7 w-full items-center rounded-md text-left text-sm disabled:cursor-wait disabled:opacity-60"
                      :class="isSelected(run.root_run_id, display.row.address) ? 'is-selected text-indigo-900' : 'text-gray-600 hover:bg-gray-50'"
                      :disabled="!run.is_active && store.restoring"
                      :style="rowStyle(display.row.depth)"
                      :aria-label="agentRowLabel(display.row)"
                      :aria-level="display.row.depth + 1"
                      :data-test="`agent-org-agent-row-${display.row.agentRunId}`"
                      :data-status="display.row.status"
                      role="treeitem"
                      @click="focusAgent(run, display.row.address)"
                    >
                      <WorkspaceHierarchyBranches :depth="display.row.depth" :continuing-ancestor-depths="display.continuingAncestorDepths" :has-following-sibling="display.hasFollowingSibling" />
                      <span class="ml-2 mr-1 h-3.5 w-3.5 flex-none" aria-hidden="true" />
                      <StatusDot class="mr-1.5" :status="display.row.status" />
                      <span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">{{ initials(display.row.address) }}</span>
                      <span class="truncate">{{ label(display.row.address) }}</span>
                    </button>
                    <button
                      v-else-if="display.row.kind === 'team'"
                      type="button"
                      class="org-execution-row relative flex min-h-7 w-full items-center rounded-md text-left text-sm disabled:cursor-wait disabled:opacity-60"
                      :class="isSelected(run.root_run_id, display.row.address) ? 'is-selected text-indigo-900' : 'text-gray-600 hover:bg-gray-50'"
                      :disabled="!run.is_active && store.restoring"
                      :style="rowStyle(display.row.depth)"
                      :aria-expanded="isTeamExpanded(run.root_run_id, display.row.address)"
                      :aria-label="teamRowLabel(display.row)"
                      :aria-level="display.row.depth + 1"
                      :data-test="`agent-org-team-row-${display.row.teamRunId}`"
                      role="treeitem"
                      @click="focusTeam(run, display.row.address)"
                    >
                      <WorkspaceHierarchyBranches :depth="display.row.depth" :continuing-ancestor-depths="display.continuingAncestorDepths" :has-following-sibling="display.hasFollowingSibling" />
                      <Icon icon="heroicons:chevron-down-20-solid" class="ml-2 mr-1 h-3.5 w-3.5 text-gray-400" :class="isTeamExpanded(run.root_run_id, display.row.address) ? '' : '-rotate-90'" />
                      <TeamAggregateStatusDot class="mr-1.5" :status="display.row.status" />
                      <Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" />
                      <span class="truncate font-semibold">{{ label(display.row.address) }}</span>
                    </button>
                    <div
                      v-else-if="display.row.kind === 'task_agent'"
                      class="org-execution-row relative flex min-h-7 w-full items-center rounded-md text-sm"
                      :class="display.row.taskKind === 'direct' ? 'bg-indigo-50/70 text-indigo-900' : 'text-gray-600'"
                      :style="rowStyle(display.row.depth)"
                      :aria-label="agentRowLabel(display.row)"
                      :aria-level="display.row.depth + 1"
                      :data-test="`agent-org-task-agent-row-${display.row.agentRunId}`"
                      :data-status="display.row.status"
                      role="treeitem"
                    >
                      <WorkspaceHierarchyBranches :depth="display.row.depth" :continuing-ancestor-depths="display.continuingAncestorDepths" :has-following-sibling="display.hasFollowingSibling" />
                      <span class="ml-2 mr-1 h-3.5 w-3.5 flex-none" aria-hidden="true" />
                      <StatusDot class="mr-1.5" :status="display.row.status" :variant="display.row.taskKind === 'direct' ? 'transient' : 'solid'" />
                      <span v-if="display.row.taskKind === 'team_member'" class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">{{ initials(display.row.address) }}</span>
                      <span class="truncate">{{ display.row.taskKind === 'direct' ? `Task: ${label(display.row.address)}` : label(display.row.address) }}</span>
                    </div>
                    <div v-else class="org-execution-row relative flex min-h-7 w-full items-center rounded-md bg-indigo-50/70 text-sm text-indigo-900" :style="rowStyle(display.row.depth)" :aria-level="display.row.depth + 1" :data-test="`agent-org-task-team-row-${display.row.teamRunId}`" role="treeitem">
                      <WorkspaceHierarchyBranches :depth="display.row.depth" :continuing-ancestor-depths="display.continuingAncestorDepths" :has-following-sibling="display.hasFollowingSibling" />
                      <span class="ml-2 mr-1 h-3.5 w-3.5" aria-hidden="true" />
                      <Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-3.5 w-3.5 text-indigo-600" />
                      <span class="truncate">Task: {{ label(display.row.address) }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <p v-if="!groups.length && !store.historyError" class="px-3 py-4 text-xs text-gray-500">No Agent Org run history yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import StatusDot from '~/components/workspace/common/StatusDot.vue'
import TeamAggregateStatusDot from '~/components/workspace/history/TeamAggregateStatusDot.vue'
import WorkspaceHierarchyBranches from '~/components/workspace/history/WorkspaceHierarchyBranches.vue'
import { useLocalization } from '~/composables/useLocalization'
import { projectAgentOrgTeamBranchStatus } from '~/services/agentOrgExecution/agentOrgTeamBranchStatus'
import { useAgentOrgRunStore, type AgentOrgHistoryItem } from '~/stores/agentOrgRunStore'
import { useAgentOrgContextsStore } from '~/stores/agentOrgContextsStore'
import { AgentStatus } from '~/types/agent/AgentStatus'
import {
  parseAgentOrgExecutionTree,
  isAgentOrgAgentNode,
  isAgentOrgTaskAgentNode,
  type AgentOrgExecutionTree,
  type AgentOrgTaskExecutionNode,
  type AgentOrgTaskTeamMember,
} from '~/types/collaboration/agentOrgExecution'
import { foldTeamAggregateStatus, type TeamStatusAuthority } from '~/utils/workspaceTeamAggregateStatus'

type AgentRow = { key: string; kind: 'agent'; address: string; agentRunId: string; status: AgentStatus; depth: number }
type TeamRow = { key: string; kind: 'team'; address: string; teamRunId: string; coordinatorAddress: string; status: AgentStatus; depth: number }
type TaskAgentRow = { key: string; kind: 'task_agent'; taskKind: 'direct' | 'team_member'; address: string; agentRunId: string; status: AgentStatus; depth: number }
type TaskTeamRow = { key: string; kind: 'task_team'; address: string; teamRunId: string; depth: number }
type Row = AgentRow | TeamRow | TaskAgentRow | TaskTeamRow
type DisplayRow = { row: Row; continuingAncestorDepths: number[]; hasFollowingSibling: boolean }
type TaskBranchNode = AgentOrgTaskExecutionNode | AgentOrgTaskTeamMember
type TaskTeamNode = Exclude<TaskBranchNode, { agentRunId: string }>
type StatusSource = Readonly<{
  authority: TeamStatusAuthority;
  statusForAgentRunId(agentRunId: string): AgentStatus | string | null | undefined;
}>

const store = useAgentOrgRunStore(); const orgContexts = useAgentOrgContextsStore(); const route = useRoute(); const router = useRouter(); const { t } = useLocalization()
const expandedWorkspaces = ref(new Set<string>()); const expandedOrgs = ref(new Set<string>()); const expandedRuns = ref(new Set<string>()); const expandedTeams = ref(new Set<string>())
const treeFor = (run: AgentOrgHistoryItem): AgentOrgExecutionTree => orgContexts.contextFor(run.root_run_id)?.executionTree ?? parseAgentOrgExecutionTree(run.org)
const workspaceFor = (run: AgentOrgHistoryItem) => String(treeFor(run).rootOrg.defaultLaunchConfiguration.workspaceRootPath || 'No workspace')
const groups = computed(() => { const workspaces = new Map<string, Map<string, { definitionId: string; name: string; runs: AgentOrgHistoryItem[] }>>(); for (const run of store.history) { const tree = treeFor(run); const workspace = workspaceFor(run); const byOrg = workspaces.get(workspace) ?? new Map<string, { definitionId: string; name: string; runs: AgentOrgHistoryItem[] }>(); const definitionId = tree.rootOrg.orgDefinitionId; const group = byOrg.get(definitionId) ?? { definitionId, name: tree.rootOrg.orgDefinitionName, runs: [] as AgentOrgHistoryItem[] }; group.runs.push(run); byOrg.set(definitionId, group); workspaces.set(workspace, byOrg) } return [...workspaces].map(([workspace, orgs]) => ({ workspace, orgs: [...orgs.values()] })) })
const toggle = (state: typeof expandedWorkspaces, key: string) => { const next = new Set(state.value); next.has(key) ? next.delete(key) : next.add(key); state.value = next }
const isWorkspaceExpanded = (key: string) => expandedWorkspaces.value.has(key); const toggleWorkspace = (key: string) => toggle(expandedWorkspaces, key)
const isOrgExpanded = (key: string) => expandedOrgs.value.has(key); const toggleOrg = (key: string) => toggle(expandedOrgs, key)
const isRunExpanded = (key: string) => expandedRuns.value.has(key)
const teamKey = (runId: string, address: string) => `${runId}:${address}`; const isTeamExpanded = (runId: string, address: string) => expandedTeams.value.has(teamKey(runId, address))
const label = (address: string) => address.split('/').filter(Boolean).at(-1)?.replace(/[_-]+/g, ' ') || address
const initials = (address: string) => label(address).split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')
const workspaceLabel = (workspace: string) => workspace === 'No workspace' ? workspace : workspace.split(/[\\/]/).filter(Boolean).at(-1) || workspace
const relative = (createdAt: string) => { const seconds = Math.max(0, Math.floor((Date.now() - Date.parse(createdAt)) / 1000)); if (seconds < 60) return 'now'; if (seconds < 3600) return `${Math.floor(seconds / 60)}m`; if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`; return `${Math.floor(seconds / 86400)}d` }
const statusLabelKey = (status: AgentStatus) => `workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.team_status_${status}`
const agentStatusLabelKey = (status: AgentStatus) => `workspace.history.hierarchy.status.${status}`
const agentRowLabel = (row: AgentRow | TaskAgentRow) => `${label(row.address)}, ${t(agentStatusLabelKey(row.status))}`
const teamRowLabel = (row: TeamRow) => `${label(row.address)}. ${t(statusLabelKey(row.status))}`

const statusSourceFor = (run: AgentOrgHistoryItem): StatusSource => {
  const context = orgContexts.contextFor(run.root_run_id)
  const live = Boolean(
    run.is_active
    && context?.orgRunId === run.root_run_id
    && context.executionTree.rootOrg.orgRunId === run.root_run_id
    && context.isActive
    && context.phase === 'live',
  )
  return {
    authority: live ? 'live' : 'historical',
    statusForAgentRunId: (agentRunId) => live
      ? context?.getAgentContext(agentRunId)?.state.currentStatus
      : undefined,
  }
}
const exactAgentStatus = (source: StatusSource, agentRunId: string): AgentStatus =>
  foldTeamAggregateStatus([source.statusForAgentRunId(agentRunId)], source.authority)

const flattenTaskTeam = (team: TaskTeamNode, depth: number, source: StatusSource): Row[] => {
  const rows: Row[] = [{ key: `task-team:${team.teamRunId}`, kind: 'task_team', address: team.address, teamRunId: team.teamRunId, depth }]
  for (const member of team.members) {
    if (isAgentOrgTaskAgentNode(member)) {
      rows.push({ key: `task-team-agent:${member.agentRunId}`, kind: 'task_agent', taskKind: 'team_member', address: member.address, agentRunId: member.agentRunId, status: exactAgentStatus(source, member.agentRunId), depth: depth + 1 })
    } else rows.push(...flattenTaskTeam(member, depth + 1, source))
  }
  for (const task of team.taskExecutions) rows.push(...flattenTask(task, depth + 1, source))
  return rows
}
const flattenTask = (task: AgentOrgTaskExecutionNode, depth: number, source: StatusSource): Row[] =>
  isAgentOrgTaskAgentNode(task)
    ? [{ key: `task-agent:${task.agentRunId}`, kind: 'task_agent', taskKind: 'direct', address: task.address, agentRunId: task.agentRunId, status: exactAgentStatus(source, task.agentRunId), depth }]
    : flattenTaskTeam(task, depth, source)

const rowsFor = (run: AgentOrgHistoryItem): DisplayRow[] => {
  const tree = treeFor(run); const source = statusSourceFor(run); const rows: Row[] = []
  for (const member of tree.rootOrg.members) {
    if (isAgentOrgAgentNode(member)) {
      rows.push({ key: `agent:${member.agentRunId}`, kind: 'agent', address: member.address, agentRunId: member.agentRunId, status: exactAgentStatus(source, member.agentRunId), depth: 0 })
      continue
    }
    rows.push({ key: `team:${member.teamRunId}`, kind: 'team', address: member.address, teamRunId: member.teamRunId, coordinatorAddress: member.coordinatorAddress, status: projectAgentOrgTeamBranchStatus({ team: member, ...source }), depth: 0 })
    if (!isTeamExpanded(run.root_run_id, member.address)) continue
    rows.push(...member.members.map((agent) => ({ key: `agent:${agent.agentRunId}`, kind: 'agent' as const, address: agent.address, agentRunId: agent.agentRunId, status: exactAgentStatus(source, agent.agentRunId), depth: 1 })))
    for (const task of member.taskExecutions) rows.push(...flattenTask(task, 1, source))
  }
  for (const task of tree.rootOrg.taskExecutions) rows.push(...flattenTask(task, 0, source))
  const hasSibling = (index: number, depth: number) => { for (let next = index + 1; next < rows.length; next++) { if (rows[next].depth < depth) return false; if (rows[next].depth === depth) return true } return false }
  return rows.map((row, index) => ({ row, continuingAncestorDepths: Array.from({ length: row.depth }, (_, depth) => depth).filter((depth) => hasSibling(index, depth)), hasFollowingSibling: hasSibling(index, row.depth) }))
}
const rowStyle = (depth: number) => ({ paddingLeft: `calc((${depth} + 1) * 0.875rem)` })
const isSelected = (runId: string, address: string) => String(route.query.orgRunId || '') === runId && orgContexts.contextFor(runId)?.selectedAddress === address
const activateRoute = (run: AgentOrgHistoryItem) => router.push({ path: '/workspace', query: { rootSubjectKind: 'agent_org', definitionId: treeFor(run).rootOrg.orgDefinitionId, orgRunId: run.root_run_id, mode: 'active' } })
const historicalRoute = (run: AgentOrgHistoryItem) => router.push({ path: '/workspace', query: { rootSubjectKind: 'agent_org', definitionId: treeFor(run).rootOrg.orgDefinitionId, orgRunId: run.root_run_id, mode: 'history' } })
const openRun = async (run: AgentOrgHistoryItem) => {
  if (!run.is_active) {
    toggle(expandedRuns, run.root_run_id)
    await historicalRoute(run)
    return
  }
  if (!isRunExpanded(run.root_run_id)) toggle(expandedRuns, run.root_run_id)
  orgContexts.connect(run.root_run_id)
  await activateRoute(run)
}
const ensureActive = async (run: AgentOrgHistoryItem): Promise<AgentOrgHistoryItem> => {
  if (run.is_active) return run
  const runId = await store.restore(run.root_run_id)
  return { ...run, root_run_id: runId, is_active: true }
}
const focusAgent = async (run: AgentOrgHistoryItem, address: string) => {
  const activeRun = await ensureActive(run)
  orgContexts.select(activeRun.root_run_id, address)
  orgContexts.connect(activeRun.root_run_id)
  await activateRoute(activeRun)
}
const focusTeam = async (run: AgentOrgHistoryItem, address: string) => {
  toggle(expandedTeams, teamKey(run.root_run_id, address))
  const activeRun = await ensureActive(run)
  orgContexts.select(activeRun.root_run_id, address)
  orgContexts.connect(activeRun.root_run_id)
  await activateRoute(activeRun)
}
const stopOrg = async (run: AgentOrgHistoryItem) => {
  await store.terminate(run.root_run_id).catch(() => undefined)
  if (store.terminationErrors[run.root_run_id]) return
  orgContexts.disconnect(run.root_run_id)
  if (route.query.rootSubjectKind === 'agent_org'
    && route.query.mode === 'active'
    && String(route.query.orgRunId || '') === run.root_run_id) {
    await router.replace({
      path: '/workspace',
      query: {
        rootSubjectKind: 'agent_org',
        definitionId: treeFor(run).rootOrg.orgDefinitionId,
        mode: 'configuration',
      },
    })
  }
}
const refresh = () => store.fetchHistory().catch(() => undefined)
const expandActivePath = () => {
  const activeRunId = String(route.query.orgRunId || '')
  const active = store.history.find((item) => item.root_run_id === activeRunId)
  if (!active) return
  expandedWorkspaces.value = new Set([...expandedWorkspaces.value, workspaceFor(active)])
  expandedOrgs.value = new Set([...expandedOrgs.value, treeFor(active).rootOrg.orgDefinitionId])
  expandedRuns.value = new Set([...expandedRuns.value, activeRunId])
}
watch(
  [
    () => String(route.query.orgRunId || ''),
    () => store.history.map((item) => item.root_run_id).join('\0'),
  ],
  expandActivePath,
  { flush: 'post' },
)
onMounted(async () => { await refresh(); expandActivePath() })
</script>

<style scoped>
.org-execution-row { isolation: isolate; }
.org-execution-row > :not(.hierarchy-branches) { position: relative; z-index: 2; }
.org-execution-row.is-selected { border-radius: 0; background-color: #eef2ff; box-shadow: inset 2px 0 #6366f1; }
</style>
