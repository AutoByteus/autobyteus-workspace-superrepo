<template>
  <div class="flex h-full flex-col bg-white" data-test="agent-org-run-history">
    <div class="flex items-center justify-between border-t border-gray-200 px-3 py-2">
      <h3 class="text-sm font-semibold text-gray-700">Workspaces</h3>
      <button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-indigo-50 hover:text-indigo-600" aria-label="Refresh Agent Org history" @click="refresh">
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
          <div class="px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Agent Orgs</div>
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
                  <button v-if="!run.is_active" type="button" class="ml-1 rounded px-1.5 py-0.5 text-[0.6875rem] font-semibold text-indigo-600 hover:bg-indigo-50" :disabled="store.restoring" @click.stop="restore(run)">Restore</button>
                  <span class="ml-2 text-xs text-gray-400">{{ relative(run.created_at) }}</span>
                </div>

                <div v-if="isRunExpanded(run.root_run_id)" class="team-execution-tree ml-3 space-y-0.5" role="tree" :aria-label="`${orgGroup.name} execution hierarchy`">
                  <template v-for="display in rowsFor(run)" :key="display.row.key">
                    <button v-if="display.row.kind === 'agent'" type="button" class="org-execution-row relative flex min-h-7 w-full items-center rounded-md text-left text-sm" :class="isSelected(run.root_run_id, display.row.address) ? 'is-selected text-indigo-900' : 'text-gray-600 hover:bg-gray-50'" :style="rowStyle(display.row.depth)" role="treeitem" @click="focusAgent(run, display.row.address)">
                      <WorkspaceHierarchyBranches :depth="display.row.depth" :continuing-ancestor-depths="display.continuingAncestorDepths" :has-following-sibling="display.hasFollowingSibling" />
                      <span class="ml-2 mr-1 h-3.5 w-3.5 flex-none" /><span class="mr-1.5 h-2 w-2 flex-none rounded-full bg-emerald-500" /><span class="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[0.5625rem] font-semibold text-gray-600">{{ initials(display.row.address) }}</span><span class="truncate">{{ label(display.row.address) }}</span>
                    </button>
                    <button v-else-if="display.row.kind === 'team'" type="button" class="org-execution-row relative flex min-h-7 w-full items-center rounded-md text-left text-sm" :class="isSelected(run.root_run_id, display.row.address) ? 'is-selected text-indigo-900' : 'text-gray-600 hover:bg-gray-50'" :style="rowStyle(display.row.depth)" :aria-expanded="isTeamExpanded(run.root_run_id, display.row.address)" role="treeitem" @click="focusTeam(run, display.row.address)">
                      <WorkspaceHierarchyBranches :depth="display.row.depth" :continuing-ancestor-depths="display.continuingAncestorDepths" :has-following-sibling="display.hasFollowingSibling" />
                      <Icon icon="heroicons:chevron-down-20-solid" class="ml-2 mr-1 h-3.5 w-3.5 text-gray-400" :class="isTeamExpanded(run.root_run_id, display.row.address) ? '' : '-rotate-90'" /><Icon icon="heroicons:user-group-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" /><span class="truncate font-semibold">{{ label(display.row.address) }}</span>
                    </button>
                    <div v-else-if="display.row.kind === 'task'" class="org-execution-row relative flex min-h-7 w-full items-center rounded-md bg-indigo-50/70 text-sm text-indigo-900" :style="rowStyle(display.row.depth)" role="treeitem">
                      <WorkspaceHierarchyBranches :depth="display.row.depth" :continuing-ancestor-depths="display.continuingAncestorDepths" :has-following-sibling="display.hasFollowingSibling" />
                      <span class="ml-2 mr-1 h-3.5 w-3.5" /><Icon :icon="display.row.taskKind === 'team' ? 'heroicons:user-group-20-solid' : 'svg-spinners:ring-resize'" class="mr-1.5 h-3.5 w-3.5 text-indigo-600" /><span class="truncate">Task: {{ label(display.row.address) }}</span>
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
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import WorkspaceHierarchyBranches from '~/components/workspace/history/WorkspaceHierarchyBranches.vue'
import { useAgentOrgRunStore, type AgentOrgHistoryItem } from '~/stores/agentOrgRunStore'
import { useRootExecutionViewStore } from '~/stores/rootExecutionViewStore'
import { executionTreeFromView, isAgentOrgAgentNode, isAgentOrgTaskAgentNode, type AgentOrgExecutionTree, type AgentOrgTaskExecutionNode } from '~/types/collaboration/agentOrgExecution'

type Row = { key: string; kind: 'agent'; address: string; depth: number } | { key: string; kind: 'team'; address: string; coordinatorAddress: string; depth: number } | { key: string; kind: 'task'; address: string; taskKind: 'agent' | 'team'; depth: number }
type DisplayRow = { row: Row; continuingAncestorDepths: number[]; hasFollowingSibling: boolean }
const store = useAgentOrgRunStore(); const rootViews = useRootExecutionViewStore(); const route = useRoute(); const router = useRouter()
const expandedWorkspaces = ref(new Set<string>()); const expandedOrgs = ref(new Set<string>()); const expandedRuns = ref(new Set<string>()); const expandedTeams = ref(new Set<string>())
const treeFor = (run: AgentOrgHistoryItem): AgentOrgExecutionTree => executionTreeFromView(rootViews.stateFor('agent_org', run.root_run_id)?.view) ?? run.org as unknown as AgentOrgExecutionTree
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
const flattenTasks = (tasks: readonly AgentOrgTaskExecutionNode[], depth: number): Row[] => tasks.flatMap((task) => isAgentOrgTaskAgentNode(task) ? [{ key: `task-agent:${task.agentRunId}`, kind: 'task' as const, taskKind: 'agent' as const, address: task.address, depth }] : [{ key: `task-team:${task.teamRunId}`, kind: 'task' as const, taskKind: 'team' as const, address: task.address, depth }, ...task.taskExecutions.flatMap((child) => flattenTasks([child], depth + 1))])
const rowsFor = (run: AgentOrgHistoryItem): DisplayRow[] => { const tree = treeFor(run); const rows: Row[] = []; for (const member of tree.rootOrg.members) { if (isAgentOrgAgentNode(member)) rows.push({ key: `agent:${member.agentRunId}`, kind: 'agent', address: member.address, depth: 0 }); else { rows.push({ key: `team:${member.teamRunId}`, kind: 'team', address: member.address, coordinatorAddress: member.coordinatorAddress, depth: 0 }); if (isTeamExpanded(run.root_run_id, member.address)) { rows.push(...member.members.map((agent) => ({ key: `agent:${agent.agentRunId}`, kind: 'agent' as const, address: agent.address, depth: 1 }))); rows.push(...flattenTasks(member.taskExecutions, 1)) } } } rows.push(...flattenTasks(tree.rootOrg.taskExecutions, 0)); const hasSibling = (index: number, depth: number) => { for (let next = index + 1; next < rows.length; next++) { if (rows[next].depth < depth) return false; if (rows[next].depth === depth) return true } return false }; return rows.map((row, index) => ({ row, continuingAncestorDepths: Array.from({ length: row.depth }, (_, depth) => depth).filter((depth) => hasSibling(index, depth)), hasFollowingSibling: hasSibling(index, row.depth) })) }
const rowStyle = (depth: number) => ({ paddingLeft: `calc((${depth} + 1) * 0.875rem)` })
const isSelected = (runId: string, address: string) => String(route.query.orgRunId || '') === runId && rootViews.stateFor('agent_org', runId)?.selectedAddress === address
const activateRoute = (run: AgentOrgHistoryItem) => router.push({ path: '/workspace', query: { rootSubjectKind: 'agent_org', definitionId: treeFor(run).rootOrg.orgDefinitionId, orgRunId: run.root_run_id, mode: 'active' } })
const openRun = async (run: AgentOrgHistoryItem) => { if (!run.is_active) { toggle(expandedRuns, run.root_run_id); return } if (!isRunExpanded(run.root_run_id)) toggle(expandedRuns, run.root_run_id); rootViews.connectAgentOrg(run.root_run_id); await activateRoute(run) }
const focusAgent = async (run: AgentOrgHistoryItem, address: string) => { if (!run.is_active) return; rootViews.selectAddress('agent_org', run.root_run_id, address); await activateRoute(run) }
const focusTeam = async (run: AgentOrgHistoryItem, address: string) => { if (!run.is_active) return; const key = teamKey(run.root_run_id, address); if (!expandedTeams.value.has(key)) toggle(expandedTeams, key); rootViews.selectAddress('agent_org', run.root_run_id, address); await activateRoute(run) }
const restore = async (run: AgentOrgHistoryItem) => { const runId = await store.restore(run.root_run_id); rootViews.selectAddress('agent_org', runId, null); rootViews.connectAgentOrg(runId); await activateRoute({ ...run, root_run_id: runId, is_active: true }) }
const refresh = () => store.fetchHistory().catch(() => undefined)
onMounted(async () => { await refresh(); const activeRunId = String(route.query.orgRunId || ''); const active = store.history.find((item) => item.root_run_id === activeRunId); if (active) { expandedWorkspaces.value.add(workspaceFor(active)); expandedOrgs.value.add(treeFor(active).rootOrg.orgDefinitionId); expandedRuns.value.add(activeRunId) } })
</script>

<style scoped>
.org-execution-row { isolation: isolate; }
.org-execution-row > :not(.hierarchy-branches) { position: relative; z-index: 2; }
.org-execution-row.is-selected { border-radius: 0; background-color: #eef2ff; box-shadow: inset 2px 0 #6366f1; }
</style>
