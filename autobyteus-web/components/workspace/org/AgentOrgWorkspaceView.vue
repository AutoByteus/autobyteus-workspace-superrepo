<template>
  <div class="relative h-full min-h-0 bg-white" data-test="agent-org-workspace-view">
    <main class="relative h-full min-h-0 min-w-0">
      <div v-if="!view" class="flex h-full items-center justify-center text-slate-500">Connecting to Agent Org…</div>
      <div v-else-if="!focusedAgent" class="flex h-full items-center justify-center px-6 text-center text-gray-500" data-test="agent-org-active-unfocused">
        <div class="max-w-md space-y-3">
          <span class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon icon="heroicons:building-office-2-20-solid" class="h-6 w-6" /></span>
          <div><h2 class="text-lg font-semibold text-gray-700">Choose an Agent or Team</h2><p class="mt-1">Select a member from the active Agent Org in the sidebar. Teams focus their coordinator first.</p></div>
        </div>
      </div>
      <div v-else class="flex h-full min-h-0 flex-col">
        <header class="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
          <span class="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{{ initials(focusedAgent.address) }}</span>
          <div class="min-w-0 flex-1"><p class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ orgName }} · Agent Org member</p><h2 class="truncate text-lg font-semibold text-slate-900">{{ label(focusedAgent.address) }}</h2><p class="truncate font-mono text-xs text-slate-500">{{ focusedAgent.address }} · {{ focusedAgent.agentRunId }}</p></div>
          <button type="button" class="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50" @click="terminate">Stop Org</button>
        </header>
        <div class="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-4" data-test="agent-org-focused-events">
          <div v-if="!focusedEvents.length" class="flex h-full items-center justify-center text-sm text-slate-500">No messages yet. Start the conversation below.</div>
          <ol v-else class="mx-auto max-w-3xl space-y-3">
            <li v-for="event in focusedEvents" :key="event.change_sequence" class="rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm"><p class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ eventLabel(event) }}</p><p class="mt-1 whitespace-pre-wrap break-words text-slate-700">{{ eventText(event) }}</p></li>
          </ol>
        </div>
        <form class="border-t border-slate-200 bg-white p-3" @submit.prevent="send"><div class="mx-auto flex max-w-3xl items-end gap-2"><textarea v-model="draft" rows="2" class="min-h-11 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" :placeholder="`Message ${label(focusedAgent.address)}`" /><button type="submit" :disabled="!draft.trim()" class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Send</button></div></form>
      </div>
      <p v-if="streamError" class="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-red-600 px-3 py-2 text-xs text-white">{{ streamError }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgentOrgRunStore } from '~/stores/agentOrgRunStore'
import { useRootExecutionViewStore } from '~/stores/rootExecutionViewStore'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { executionTreeFromView, isAgentOrgAgentNode } from '~/types/collaboration/agentOrgExecution'

const route = useRoute(); const router = useRouter(); const store = useAgentOrgRunStore(); const rootViews = useRootExecutionViewStore(); const definitions = useAgentOrgDefinitionStore()
const orgRunId = computed(() => String(route.query.orgRunId || ''))
const rootState = computed(() => rootViews.stateFor('agent_org', orgRunId.value))
const view = computed(() => rootState.value?.view ?? null)
const tree = computed(() => executionTreeFromView(view.value))
const rootOrg = computed(() => tree.value?.rootOrg ?? null)
const orgName = computed(() => rootOrg.value?.orgDefinitionName || definitions.byId(String(route.query.definitionId || ''))?.name || 'Agent Org')
const selectedAddress = computed(() => rootState.value?.selectedAddress ?? null); const draft = ref('')
const streamError = computed(() => rootState.value?.error ?? null)
const label = (address: string) => address.split('/').filter(Boolean).at(-1)?.replace(/[_-]+/g, ' ') || address
const initials = (address: string) => label(address).split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')
const allAgents = computed(() => (rootOrg.value?.members ?? []).flatMap((member) => isAgentOrgAgentNode(member) ? [member] : member.members))
const focus = computed(() => rootViews.agentOrgFocus(orgRunId.value))
const focusedAgent = computed(() => allAgents.value.find((agent) => agent.agentRunId === focus.value?.agentRunId) ?? null)
const focusedEvents = computed(() => (rootState.value?.events ?? []).filter((item) => { const raw = item.event as any; return raw?.execution?.memberAddress === focusedAgent.value?.address || raw?.execution?.agentRunId === focusedAgent.value?.agentRunId }))
const eventLabel = (item: any) => item.event?.kind === 'agent' ? item.event?.event?.kind?.replace(/_/g, ' ') || 'Agent event' : item.event?.kind?.replace(/_/g, ' ') || 'Event'
const eventText = (item: any) => item.event?.event?.message?.content || item.event?.event?.event?.payload?.details?.message || item.event?.message?.content || JSON.stringify(item.event)
const send = () => { if (!focusedAgent.value || !draft.value.trim()) return; rootViews.sendAgentOrgMessage({ orgRunId: orgRunId.value, targetAgentRunId: focusedAgent.value.agentRunId, content: draft.value.trim() }); draft.value = '' }
const terminate = async () => { await store.terminate(orgRunId.value); rootViews.disconnect('agent_org', orgRunId.value); await router.push('/agent-orgs') }
onMounted(() => { void definitions.fetchAll(); if (orgRunId.value) rootViews.connectAgentOrg(orgRunId.value) })
</script>
