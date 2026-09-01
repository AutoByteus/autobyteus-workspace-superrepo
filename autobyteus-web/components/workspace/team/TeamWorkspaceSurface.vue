<template>
  <div class="flex h-full flex-col bg-white" data-testid="team-workspace-surface">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-3 py-2 sm:px-4">
      <div class="flex min-w-0 flex-1 items-center space-x-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-[0.625rem] font-semibold tracking-wide text-slate-600">
          <img
            v-if="showAvatar"
            :src="avatarUrl"
            :alt="`${memberName} avatar`"
            class="h-full w-full object-cover"
            @error="avatarFailed = true"
          />
          <span v-else>{{ initials }}</span>
        </div>
        <h4 class="truncate text-base font-medium text-gray-800" :title="memberName">{{ memberName }}</h4>
        <AgentStatusDisplay :status="target.context.state.currentStatus" />
      </div>
      <WorkspaceHeaderActions
        v-if="showHeaderActions"
        @new-agent="$emit('new-team')"
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
        :agent-name="memberName"
        :inter-agent-sender-name-by-id="target.team.senderNameByAgentRunId()"
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

type TeamTarget = Extract<ActiveAgentWorkspaceTarget,
  { kind: 'standalone_team_member' | 'agent_org_team_member' }>
const props = withDefaults(defineProps<{
  target: TeamTarget
  showHeaderActions?: boolean
  recoveryNotice?: string | null
  recoveryActionLabel?: string | null
}>(), { showHeaderActions: false, recoveryNotice: null, recoveryActionLabel: null })
defineEmits<{ (event: 'new-team'): void; (event: 'edit-config'): void; (event: 'recover'): void }>()

const definitions = useAgentDefinitionStore()
const avatarFailed = ref(false)
const memberName = computed(() => props.target.context.config.agentDefinitionName
  || props.target.team.focusedMemberAddress.split('/').at(-1)?.replace(/[_-]+/g, ' ')
  || props.target.team.teamDefinitionName)
const initials = computed(() => memberName.value.split(/\s+/).filter(Boolean).slice(0, 2)
  .map((part) => part[0]?.toUpperCase() ?? '').join('') || 'AI')
const avatarUrl = computed(() => props.target.context.config.agentAvatarUrl?.trim()
  || definitions.getAgentDefinitionById(props.target.context.config.agentDefinitionId)?.avatarUrl?.trim()
  || '')
const showAvatar = computed(() => Boolean(avatarUrl.value) && !avatarFailed.value)
const skillTarget = computed<SkillImprovementComposerCtaTarget | null>(() =>
  props.target.kind === 'standalone_team_member'
    ? {
        kind: 'team-member',
        teamRunId: props.target.team.rootRunId,
        agentRunId: props.target.context.state.runId,
        isHelperRun:
          props.target.context.config.agentDefinitionId === 'autobyteus-retrospective-skill-improver'
          || props.target.context.config.agentDefinitionName === 'Retrospective Skill Improver',
      }
    : null)
watch(avatarUrl, () => { avatarFailed.value = false })
</script>
