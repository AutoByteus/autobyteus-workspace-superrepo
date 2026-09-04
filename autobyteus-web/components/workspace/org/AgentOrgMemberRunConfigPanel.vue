<template>
  <div
    class="flex h-full min-h-0 flex-col bg-white"
    data-test="agent-org-member-run-config"
    :data-org-run-id="target.root.orgRunId"
    :data-member-address="target.address"
    :data-agent-run-id="target.context.state.runId"
  >
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-2">
      <h3 class="truncate text-sm font-semibold text-gray-800">
        {{ t('workspace.components.workspace.config.RunConfigPanel.title.agentConfiguration') }}
      </h3>
      <button
        type="button"
        data-test="agent-org-config-back-to-events"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-indigo-600 transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        :title="t('workspace.components.workspace.config.RunConfigPanel.return_to_event_view')"
        :aria-label="t('workspace.components.workspace.config.RunConfigPanel.back_to_event_view')"
        @click="$emit('back')"
      >
        <svg
          aria-hidden="true"
          class="h-4 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L5.56 9.25h10.69A.75.75 0 0 1 17 10Z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <AgentRunConfigForm
        :config="lockedConfig"
        :agent-definition="agentDefinition"
        :workspace-loading-state="workspaceLoadingState"
        :workspace-selection="workspaceSelection"
        :workspace-locked="true"
        :runtime-locked="true"
        :existing-run="true"
        :existing-model-config-editable="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AgentRunConfigForm from '~/components/workspace/config/AgentRunConfigForm.vue'
import { useLocalization } from '~/composables/useLocalization'
import type { AgentRunConfig } from '~/types/agent/AgentRunConfig'
import type { ActiveAgentWorkspaceTarget } from '~/types/workspace/activeAgentWorkspaceTarget'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'

type AgentOrgMemberTarget = Extract<ActiveAgentWorkspaceTarget,
  { kind: 'agent_org_direct_agent' | 'agent_org_team_member' }>

const props = defineProps<{ target: AgentOrgMemberTarget }>()
defineEmits<{ (event: 'back'): void }>()

const { t } = useLocalization()
const lockedConfig = computed<AgentRunConfig>(() => ({
  ...props.target.context.config,
  isLocked: true,
}))
const agentDefinition = computed(() => ({
  name: props.target.context.config.agentDefinitionName
    || props.target.address.split('/').filter(Boolean).at(-1)
    || props.target.address,
}))
const workspaceSelection = computed<WorkspaceSelectionState>(() => ({
  mode: 'existing',
  existingWorkspaceId: props.target.context.config.workspaceId,
  newWorkspacePath: props.target.context.config.workspaceMetadata?.workspaceRootPath ?? '',
}))
const workspaceLoadingState = computed(() => ({
  isLoading: false,
  error: null,
  loadedPath: props.target.context.config.workspaceMetadata?.workspaceRootPath ?? null,
}))
</script>
