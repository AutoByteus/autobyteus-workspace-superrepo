<template>
  <div class="flex h-full flex-col bg-white" data-testid="agent-workspace-surface">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-3 py-2 sm:px-4">
      <div class="flex min-w-0 flex-1 items-center space-x-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
          <img
            v-if="showAvatar"
            :src="avatarUrl"
            :alt="`${agentName} avatar`"
            class="h-full w-full object-cover"
            @error="avatarFailed = true"
          />
          <span v-else class="text-[0.625rem] font-semibold tracking-wide text-slate-600">{{ initials }}</span>
        </div>
        <h4 class="truncate text-base font-medium text-gray-800" :title="headerTitle">{{ headerTitle }}</h4>
        <AgentStatusDisplay :status="target.context.state.currentStatus" />
      </div>
      <WorkspaceHeaderActions
        v-if="showHeaderActions"
        @new-agent="$emit('new-agent')"
        @edit-config="$emit('edit-config')"
      />
    </div>
    <div v-if="recoveryNotice" role="alert" class="mx-3 mt-3 flex items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 sm:mx-4">
      <span>{{ recoveryNotice }}</span>
      <button v-if="recoveryActionLabel" type="button" class="shrink-0 rounded-md bg-amber-900 px-3 py-1.5 font-semibold text-white" @click="$emit('recover')">
        {{ recoveryActionLabel }}
      </button>
    </div>
    <div class="min-h-0 flex-1">
      <AgentEventMonitor
        :conversation="target.context.state.conversation"
        :run-id="target.context.state.runId"
        :agent-name="agentName"
        :agent-avatar-url="avatarUrl || null"
        :presentation-revision="target.context.state.eventMonitorPresentationRevision"
        :has-earlier-active-trace-events="target.context.state.hasEarlierActiveTraceEvents"
        :browse-subject="target.browse"
        class="h-full"
      >
        <template v-if="skillTarget" #composerContext>
          <SkillImprovementComposerCta :target="skillTarget" />
        </template>
      </AgentEventMonitor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ActiveAgentWorkspaceTarget } from '~/types/workspace/activeAgentWorkspaceTarget'
import AgentEventMonitor from '~/components/workspace/agent/AgentEventMonitor.vue'
import AgentStatusDisplay from '~/components/workspace/agent/AgentStatusDisplay.vue'
import WorkspaceHeaderActions from '~/components/workspace/common/WorkspaceHeaderActions.vue'
import SkillImprovementComposerCta from '~/components/workspace/skill-improvement/SkillImprovementComposerCta.vue'
import type { SkillImprovementComposerCtaTarget } from '~/components/workspace/skill-improvement/skillImprovementComposerCtaTarget'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'

const props = withDefaults(defineProps<{
  target: ActiveAgentWorkspaceTarget
  showHeaderActions?: boolean
  recoveryNotice?: string | null
  recoveryActionLabel?: string | null
}>(), { showHeaderActions: false, recoveryNotice: null, recoveryActionLabel: null })
defineEmits<{ (event: 'new-agent'): void; (event: 'edit-config'): void; (event: 'recover'): void }>()

const definitions = useAgentDefinitionStore()
const avatarFailed = ref(false)
const agentName = computed(() => props.target.context.config.agentDefinitionName || 'Agent')
const avatarUrl = computed(() => props.target.context.config.agentAvatarUrl?.trim()
  || definitions.getAgentDefinitionById(props.target.context.config.agentDefinitionId)?.avatarUrl?.trim()
  || '')
const showAvatar = computed(() => Boolean(avatarUrl.value) && !avatarFailed.value)
const initials = computed(() => agentName.value.split(/\s+/).filter(Boolean).slice(0, 2)
  .map((part) => part[0]?.toUpperCase() ?? '').join('') || 'AI')
const headerTitle = computed(() => {
  if (props.target.context.state.runId.startsWith('temp-')) return `New - ${agentName.value}`
  const suffix = props.target.context.state.runId.slice(-4).toUpperCase()
  return `${agentName.value} - ${suffix}`
})
const skillTarget = computed<SkillImprovementComposerCtaTarget | null>(() =>
  props.target.kind === 'standalone_agent'
    ? {
        kind: 'agent',
        runId: props.target.context.state.runId,
        isHelperRun:
          props.target.context.config.agentDefinitionId === 'autobyteus-retrospective-skill-improver'
          || props.target.context.config.agentDefinitionName === 'Retrospective Skill Improver',
      }
    : null)

watch(avatarUrl, () => { avatarFailed.value = false })
</script>
