<template>
  <div class="relative flex h-full min-h-0 flex-col bg-white" data-test="agent-org-workspace-view">
    <div v-if="isHistorical" class="flex h-full items-center justify-center px-6 text-center text-gray-500" data-test="agent-org-stopped-history">
      <div class="max-w-md space-y-3">
        <span class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon icon="heroicons:building-office-2-20-solid" class="h-6 w-6" />
        </span>
        <div>
          <h2 class="text-lg font-semibold text-gray-700">{{ t('workspace.agentOrg.stoppedHistory.title') }}</h2>
          <p class="mt-1">{{ t('workspace.agentOrg.stoppedHistory.description') }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="!context && !streamError" class="flex h-full items-center justify-center text-slate-500">
      Connecting to Agent Org…
    </div>
    <div v-else-if="!context" class="flex min-h-0 flex-1 items-start justify-center px-3 pt-3 sm:px-4">
      <WorkspaceRecoveryNotice class="w-full max-w-xl" :message="recoveryNotice || ''" />
    </div>
    <template v-else-if="!target">
      <WorkspaceRecoveryNotice v-if="recoveryNotice" :message="recoveryNotice" />
      <div class="flex min-h-0 flex-1 items-center justify-center px-6 text-center text-gray-500" data-test="agent-org-active-unfocused">
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
    </template>
    <AgentWorkspaceSurface
      v-else-if="target.kind === 'agent_org_direct_agent'"
      class="min-h-0 flex-1"
      :target="target"
      :show-header-actions="true"
      :recovery-notice="recoveryNotice"
      @new-agent="openNewOrgRun"
      @edit-config="openOrgConfiguration"
    />
    <TeamWorkspaceSurface
      v-else-if="target.kind === 'agent_org_team_member'"
      class="min-h-0 flex-1"
      :target="target"
      :show-header-actions="true"
      :recovery-notice="recoveryNotice"
      @new-team="openNewOrgRun"
      @edit-config="openOrgConfiguration"
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
import WorkspaceRecoveryNotice from '~/components/workspace/common/WorkspaceRecoveryNotice.vue'

const route = useRoute()
const router = useRouter()
const active = useActiveContextStore()
const { t } = useLocalization()
const orgRunId = computed(() => String(route.query.orgRunId || ''))
const isHistorical = computed(() => route.query.mode === 'history')
const context = computed(() => active.agentOrgContextFor(orgRunId.value))
const streamError = computed(() => active.agentOrgErrorFor(orgRunId.value))
const recoveryNotice = computed(() => streamError.value
  ? t('workspace.agentOrg.recovery.exhausted')
  : null)
const target = computed(() => {
  const current = active.activeWorkspaceTarget
  return current?.kind === 'agent_org_direct_agent' || current?.kind === 'agent_org_team_member'
    ? current
    : null
})
const connect = () => { if (orgRunId.value && !isHistorical.value) active.connectAgentOrg(orgRunId.value) }
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
onBeforeUnmount(() => { if (orgRunId.value && !isHistorical.value) active.disconnectAgentOrg(orgRunId.value) })
watch([orgRunId, isHistorical], ([nextRunId, nextHistorical], [previousRunId, previousHistorical]) => {
  if (previousRunId && !previousHistorical && (previousRunId !== nextRunId || nextHistorical)) {
    active.disconnectAgentOrg(previousRunId)
  }
  if (!nextHistorical) connect()
})
</script>
