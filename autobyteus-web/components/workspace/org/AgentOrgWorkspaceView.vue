<template>
  <div class="relative h-full min-h-0 bg-white" data-test="agent-org-workspace-view">
    <div v-if="!context && !streamError" class="flex h-full items-center justify-center text-slate-500">
      Connecting to Agent Org…
    </div>
    <div v-else-if="!context" class="flex h-full items-center justify-center px-6 text-center">
      <div class="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900" role="alert">
        <h2 class="font-semibold">Agent Org stream needs to reconnect</h2>
        <p class="mt-1 text-sm">{{ streamError }}</p>
        <button type="button" class="mt-4 rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white" @click="reopen">
          Reconnect
        </button>
      </div>
    </div>
    <div v-else-if="!target" class="flex h-full items-center justify-center px-6 text-center text-gray-500" data-test="agent-org-active-unfocused">
      <div class="max-w-md space-y-3">
        <span class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon icon="heroicons:building-office-2-20-solid" class="h-6 w-6" />
        </span>
        <div>
          <h2 class="text-lg font-semibold text-gray-700">Choose an Agent or Team</h2>
          <p class="mt-1">Select a member from the active Agent Org in the sidebar. Teams focus their coordinator first.</p>
        </div>
      </div>
    </div>
    <AgentWorkspaceSurface
      v-else-if="target.kind === 'agent_org_direct_agent'"
      :target="target"
      :show-header-actions="true"
      :recovery-notice="recoveryNotice"
      recovery-action-label="Reconnect"
      @new-agent="openNewOrgRun"
      @edit-config="openOrgConfiguration"
      @recover="reopen"
    />
    <TeamWorkspaceSurface
      v-else-if="target.kind === 'agent_org_team_member'"
      :target="target"
      :show-header-actions="true"
      :recovery-notice="recoveryNotice"
      recovery-action-label="Reconnect"
      @new-team="openNewOrgRun"
      @edit-config="openOrgConfiguration"
      @recover="reopen"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useActiveContextStore } from '~/stores/activeContextStore'
import AgentWorkspaceSurface from '~/components/workspace/agent/AgentWorkspaceSurface.vue'
import TeamWorkspaceSurface from '~/components/workspace/team/TeamWorkspaceSurface.vue'

const route = useRoute()
const router = useRouter()
const active = useActiveContextStore()
const orgRunId = computed(() => String(route.query.orgRunId || ''))
const context = computed(() => active.agentOrgContextFor(orgRunId.value))
const streamError = computed(() => active.agentOrgErrorFor(orgRunId.value))
const recoveryNotice = computed(() => streamError.value || context.value?.error
  ? 'Live Agent Org updates are out of sync. Reconnect to load a verified complete conversation before sending another message.'
  : null)
const target = computed(() => {
  const current = active.activeWorkspaceTarget
  return current?.kind === 'agent_org_direct_agent' || current?.kind === 'agent_org_team_member'
    ? current
    : null
})
const connect = () => { if (orgRunId.value) active.connectAgentOrg(orgRunId.value) }
const reopen = () => { void active.reopenAgentOrg(orgRunId.value) }
const openConfiguration = () => {
  const definitionId = context.value?.executionTree.rootOrg.orgDefinitionId
    || String(route.query.definitionId || '')
  if (!definitionId) return
  void router.push({
    path: '/workspace',
    query: { rootSubjectKind: 'agent_org', definitionId, mode: 'configuration' },
  })
}
const openNewOrgRun = openConfiguration
const openOrgConfiguration = openConfiguration

onMounted(connect)
onBeforeUnmount(() => { if (orgRunId.value) active.disconnectAgentOrg(orgRunId.value) })
watch(orgRunId, (next, previous) => {
  if (previous && previous !== next) active.disconnectAgentOrg(previous)
  connect()
})
</script>
