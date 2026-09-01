<template>
  <TeamWorkspaceSurface
    v-if="target"
    :target="target"
    :show-header-actions="true"
    :recovery-notice="streamRecoveryNotice"
    @new-team="createNewTeamRun"
    @edit-config="openSelectedTeamConfig"
  />
  <div v-else class="flex h-full items-center justify-center bg-gray-50 p-8 text-center text-gray-500">
    <div>
      <h3 class="text-lg font-medium text-gray-900">{{ $t('workspace.components.workspace.team.TeamWorkspaceView.no_active_team_runs') }}</h3>
      <p class="mx-auto mt-2 max-w-md">{{ $t('workspace.components.workspace.team.TeamWorkspaceView.this_team_profile_has_no_running') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import TeamWorkspaceSurface from '~/components/workspace/team/TeamWorkspaceSurface.vue'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useTeamRunConfigStore } from '~/stores/teamRunConfigStore'
import { useAgentTeamRunStore } from '~/stores/agentTeamRunStore'
import { useAgentRunConfigStore } from '~/stores/agentRunConfigStore'
import { useAgentSelectionStore } from '~/stores/agentSelectionStore'
import { useWorkspaceCenterViewStore } from '~/stores/workspaceCenterViewStore'
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore'
import { buildEditableTeamRunSeed } from '~/composables/useDefinitionLaunchDefaults'

const active = useActiveContextStore()
const definitions = useAgentDefinitionStore()
const teamRunConfig = useTeamRunConfigStore()
const teamRuns = useAgentTeamRunStore()
const agentRunConfig = useAgentRunConfigStore()
const selection = useAgentSelectionStore()
const center = useWorkspaceCenterViewStore()
const teamContexts = useAgentTeamContextsStore()
const target = computed(() => active.activeWorkspaceTarget?.kind === 'standalone_team_member'
  ? active.activeWorkspaceTarget
  : null)
const streamRecoveryNotice = computed(() => target.value
  && teamRuns.getTeamStreamRecoveryNotice(target.value.team.rootRunId)
  ? 'Live Team updates are out of sync. Wait for the Team to finish its current work, then select this Team member again to reload the complete conversation.'
  : null)

const createNewTeamRun = () => {
  const source = teamContexts.activeTeamContext
  if (!source) return
  teamRunConfig.setConfig(buildEditableTeamRunSeed(source.view.getConfigurationView()))
  agentRunConfig.clearConfig()
  selection.clearSelection()
}
const openSelectedTeamConfig = () => { if (target.value) center.showConfig() }

onMounted(async () => {
  if (!definitions.agentDefinitions.length) await definitions.fetchAllAgentDefinitions().catch(() => undefined)
})
</script>
