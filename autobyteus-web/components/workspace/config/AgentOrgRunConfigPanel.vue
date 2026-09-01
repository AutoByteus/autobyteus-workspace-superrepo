<template>
  <div class="flex h-full flex-col bg-white" data-test="agent-org-run-config">
    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div v-if="org" class="mx-auto max-w-3xl space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Agent Org</label>
          <div class="block w-full select-none rounded-md bg-slate-50 px-3 py-2 text-sm text-gray-500">{{ org.name }}</div>
        </div>

        <RuntimeModelConfigFields
          :runtime-kind="runtimeKind" :llm-model-identifier="llmModelIdentifier" :llm-config="llmConfig"
          runtime-help-text="Selects the runtime used by this organization run."
          model-label="Default LLM Model" model-help-text="Used across the organization unless a placement is customized."
          id-prefix="org-run" control-variant="quiet"
          @update:runtime-kind="runtimeKind = $event" @update:llm-model-identifier="llmModelIdentifier = $event" @update:llm-config="llmConfig = $event"
        />

        <div class="pt-4">
          <WorkspaceSelector
            :model="{ mode: 'editable', selection: workspaceSelection, isLoading: workspaceLoading, error: workspaceError }"
            control-variant="quiet" :auto-select-default="false"
            @update:model-value="handleWorkspaceSelection"
          />
        </div>

        <div class="flex items-center justify-between gap-4 py-2" data-test="org-auto-approve-row">
          <div class="min-w-0"><label class="block text-base text-gray-900">Auto approve tools</label><p class="mt-1 text-xs text-gray-500">Automatically allows tool calls and access requests for this run.</p></div>
          <button type="button" role="switch" :aria-checked="autoExecuteTools" class="relative inline-flex h-6 w-11 flex-none rounded-full border-2 border-transparent transition-colors focus:ring-2 focus:ring-blue-500" :class="autoExecuteTools ? 'bg-blue-600' : 'bg-gray-200'" @click="autoExecuteTools = !autoExecuteTools"><span class="sr-only">Auto approve tools</span><span class="inline-block h-5 w-5 rounded-full bg-white shadow transition" :class="autoExecuteTools ? 'translate-x-5' : 'translate-x-0'" /></button>
        </div>

        <div>
          <button type="button" data-test="org-member-overrides-toggle" class="flex w-full items-center justify-between rounded-md px-1 py-2 text-left text-sm font-medium text-gray-700 hover:text-gray-900" :aria-expanded="overridesExpanded" @click="overridesExpanded = !overridesExpanded"><span>Member overrides</span><Icon icon="heroicons:chevron-down-20-solid" class="h-4 w-4 transition-transform" :class="overridesExpanded ? '' : '-rotate-90'" /></button>
          <div v-show="overridesExpanded" class="mt-3 overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm" data-test="org-member-overrides-panel">
            <AgentOrgPlacementOverrideRow v-for="agent in directAgents" :key="agent.address" :placement-key="agent.address" kind="agent" :name="agent.name" :address="agent.address" :expanded="editingPlacement === agent.address" :override="memberOverrides[agent.address]" :global-runtime-kind="runtimeKind" :global-llm-model="llmModelIdentifier" :global-llm-config="llmConfig" :global-auto-execute-tools="autoExecuteTools" @toggle="togglePlacement(agent.address)" @update:override="setPlacementOverride(agent.address, $event)" />
            <section v-for="team in teams" :key="team.address" class="border-t border-slate-200 bg-slate-50/60">
              <AgentOrgPlacementOverrideRow :placement-key="team.address" kind="team" :name="team.name" :address="team.address" :detail="`Coordinator: ${team.coordinatorName}`" :expanded="editingPlacement === team.address" :override="memberOverrides[team.address]" :global-runtime-kind="runtimeKind" :global-llm-model="llmModelIdentifier" :global-llm-config="llmConfig" :global-auto-execute-tools="autoExecuteTools" @toggle="togglePlacement(team.address)" @update:override="setPlacementOverride(team.address, $event)" />
              <div class="ml-6 border-l border-slate-200 bg-white"><AgentOrgPlacementOverrideRow v-for="agent in team.agents" :key="agent.address" :placement-key="agent.address" kind="agent" :name="agent.name" :address="agent.address" :expanded="editingPlacement === agent.address" :override="memberOverrides[agent.address]" :global-runtime-kind="runtimeKind" :global-llm-model="llmModelIdentifier" :global-llm-config="llmConfig" :global-auto-execute-tools="autoExecuteTools" @toggle="togglePlacement(agent.address)" @update:override="setPlacementOverride(agent.address, $event)" /></div>
            </section>
          </div>
        </div>
        <p v-if="launchError" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ launchError }}</p>
      </div>
      <div v-else class="flex h-full items-center justify-center text-gray-500">Loading Agent Org…</div>
    </div>
    <div class="border-t border-gray-200 bg-gray-50 px-4 py-3">
      <button type="button" data-test="run-agent-org" class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50" :disabled="!canRun || orgRunStore.launching" @click="runOrg">{{ orgRunStore.launching ? 'Starting Agent Org…' : 'Run Agent Org' }}</button>
      <p v-if="!workspaceReady" class="mt-2 text-xs text-amber-700">Workspace is required to run an Agent Org.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import RuntimeModelConfigFields from '~/components/launch-config/RuntimeModelConfigFields.vue'
import WorkspaceSelector from '~/components/workspace/config/WorkspaceSelector.vue'
import AgentOrgPlacementOverrideRow from '~/components/workspace/config/AgentOrgPlacementOverrideRow.vue'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useAgentOrgRunStore } from '~/stores/agentOrgRunStore'
import { useAgentOrgRunConfigStore } from '~/stores/agentOrgRunConfigStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { useRightSideTabs } from '~/composables/useRightSideTabs'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'
import type { AgentConfigOverride } from '~/types/agent/TeamRunConfig'

type AgentPlacement = { name: string; address: string }
type TeamPlacement = AgentPlacement & { coordinatorName: string; agents: AgentPlacement[] }
const route = useRoute(); const router = useRouter()
const orgStore = useAgentOrgDefinitionStore(); const agentStore = useAgentDefinitionStore(); const teamStore = useAgentTeamDefinitionStore(); const orgRunStore = useAgentOrgRunStore(); const configStore = useAgentOrgRunConfigStore(); const workspaceStore = useWorkspaceStore(); const { setActiveTab } = useRightSideTabs()
const { runtimeKind, llmModelIdentifier, llmConfig, autoExecuteTools, workspaceSelection, memberOverrides } = storeToRefs(configStore)
const definitionId = computed(() => String(route.query.definitionId || ''))
const org = computed(() => orgStore.byId(definitionId.value))
const workspaceLoading = ref(false); const workspaceError = ref<string | null>(null); const launchError = ref<string | null>(null)
const overridesExpanded = ref(false); const editingPlacement = ref<string | null>(null)
watch(org, (value) => { if (!value) return; configStore.begin({ definitionId: value.id, runtimeKind: value.defaultLaunchConfig?.runtimeKind, llmModelIdentifier: value.defaultLaunchConfig?.llmModelIdentifier, llmConfig: value.defaultLaunchConfig?.llmConfig ?? null }) }, { immediate: true })
const directAgents = computed<AgentPlacement[]>(() => (org.value?.members ?? []).filter((member) => member.refType === 'AGENT').map((member) => ({ name: agentStore.getAgentDefinitionById(member.ref)?.name || member.memberName, address: `/${member.memberName}` })))
const teams = computed<TeamPlacement[]>(() => (org.value?.members ?? []).filter((member) => member.refType === 'AGENT_TEAM').flatMap((member) => { const team = teamStore.getAgentTeamDefinitionById(member.ref); if (!team) return []; const address = `/${member.memberName}`; return [{ name: team.name, address, coordinatorName: team.nodes.find((node) => node.memberName === team.coordinatorMemberName)?.memberName || team.coordinatorMemberName, agents: team.nodes.map((node) => ({ name: agentStore.getAgentDefinitionById(node.ref)?.name || node.memberName, address: `${address}/${node.memberName}` })) }] }))
const workspaceReady = computed(() => workspaceSelection.value.mode === 'existing' ? Boolean(workspaceSelection.value.existingWorkspaceId) : Boolean(workspaceSelection.value.newWorkspacePath.trim()))
const canRun = computed(() => Boolean(org.value && runtimeKind.value && llmModelIdentifier.value && workspaceReady.value))
const handleWorkspaceSelection = (selection: WorkspaceSelectionState) => { configStore.setWorkspaceSelection(selection); workspaceError.value = null; if (selection.mode === 'existing' && selection.existingWorkspaceId) setActiveTab('files') }
const togglePlacement = (address: string) => { editingPlacement.value = editingPlacement.value === address ? null : address }
const setPlacementOverride = (address: string, override: AgentConfigOverride | null) => configStore.setPlacementOverride(address, override)
const resolveWorkspacePath = async (): Promise<string> => { const selection = workspaceSelection.value; if (selection.mode === 'new') { const path = selection.newWorkspacePath.trim(); if (!path) throw new Error('Workspace path is required.'); workspaceLoading.value = true; try { await workspaceStore.createWorkspace({ root_path: path }); setActiveTab('files'); return path } finally { workspaceLoading.value = false } } const workspace = selection.existingWorkspaceId ? workspaceStore.workspaces[selection.existingWorkspaceId] : null; const path = workspace?.workspaceRootPath || workspace?.absolutePath || workspace?.workspaceConfig?.root_path || workspace?.workspaceConfig?.rootPath || ''; if (!path) throw new Error('Selected workspace has no usable root path.'); return path }
const runOrg = async () => { if (!org.value || !canRun.value) return; launchError.value = null; try { const workspaceRootPath = await resolveWorkspacePath(); const configuration = (override: AgentConfigOverride) => ({ ...(override.runtimeKind ? { runtimeKind: override.runtimeKind } : {}), ...(override.llmModelIdentifier ? { llmModelIdentifier: override.llmModelIdentifier } : {}), ...(Object.prototype.hasOwnProperty.call(override, 'llmConfig') ? { llmConfig: override.llmConfig ?? null } : {}), ...(override.autoExecuteTools === undefined ? {} : { autoExecuteTools: override.autoExecuteTools }) }); const teamAddresses = new Set(teams.value.map((team) => team.address)); const overrides = Object.entries(memberOverrides.value).filter(([, value]) => Object.keys(configuration(value)).length).map(([address, value]) => ({ address, configuration: configuration(value) })); const orgRunId = await orgRunStore.launch({ agentOrgDefinitionId: org.value.id, rootConfiguration: { runtimeKind: runtimeKind.value, llmModelIdentifier: llmModelIdentifier.value, llmConfig: llmConfig.value, autoExecuteTools: autoExecuteTools.value, skillAccessMode: 'PRELOADED_ONLY', workspaceRootPath }, teamOverrides: overrides.filter((item) => teamAddresses.has(item.address)), agentOverrides: overrides.filter((item) => !teamAddresses.has(item.address)) }); await router.replace({ path: '/workspace', query: { rootSubjectKind: 'agent_org', definitionId: org.value.id, orgRunId, mode: 'active' } }) } catch (cause) { launchError.value = cause instanceof Error ? cause.message : String(cause) } }
onMounted(() => Promise.all([orgStore.fetchAll(), agentStore.fetchAllAgentDefinitions(), teamStore.fetchAllAgentTeamDefinitions(), workspaceStore.fetchAllWorkspaces()]))
</script>
