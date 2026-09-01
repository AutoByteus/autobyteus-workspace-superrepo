<template>
  <div class="h-full overflow-auto bg-slate-50" data-test="agent-org-experience">
    <div class="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <template v-if="view === 'org-list'">
        <header class="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <h1 class="sr-only">Agent Orgs</h1>
          <label class="relative min-w-0 flex-1 rounded-lg border border-slate-200 bg-white shadow-sm">
            <span class="sr-only">Search Agent Orgs</span>
            <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="search" class="block w-full rounded-lg border-transparent bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Search organizations by name">
          </label>
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              :class="reloading ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'"
              :disabled="reloading"
              @click="reloadOrgs"
            >
              <Icon icon="heroicons:arrow-path-20-solid" class="mr-2 h-4 w-4" :class="{ 'animate-spin': reloading }" />
              {{ reloading ? 'Reloading…' : 'Reload' }}
            </button>
            <button type="button" class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-test="create-org" @click="go('org-create')">
              Create Agent Org
            </button>
          </div>
        </header>

        <div v-if="catalogSections.length > 0" class="space-y-8">
          <section v-for="section in catalogSections" :key="section.id">
            <h2 v-if="section.title" class="mb-3 text-xl font-semibold text-slate-900">{{ section.title }}</h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article v-for="org in section.orgs" :key="org.id" class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md" :data-test="`org-card-${org.id}`">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-start">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-700">
                    <span class="text-2xl font-semibold tracking-wide">{{ orgInitials(org.name) }}</span>
                  </div>
                  <div class="min-w-0">
                    <h3 class="truncate text-xl font-semibold text-slate-900">{{ org.name }}</h3>
                    <p class="mt-1 line-clamp-2 text-sm text-slate-600">{{ org.description }}</p>
                  </div>
                  <div class="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
                    <button type="button" class="inline-flex min-w-[104px] justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" @click="openLaunch(org.id)">Run</button>
                    <button type="button" class="inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" @click="go('org-detail', org.id)">View Details <span class="ml-1" aria-hidden="true">→</span></button>
                  </div>
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <span v-for="member in org.members" :key="`${member.kind}-${member.ref}`" :data-test="`org-member-${member.kind}-${member.ref}`" class="inline-flex max-w-[14rem] items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium" :class="member.kind === 'team' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700'" :aria-label="`${member.kind === 'team' ? 'Team' : 'Agent'} ${member.kind === 'team' ? teamById(member.ref).name : agentById(member.ref).name}`">
                    <Icon :icon="member.kind === 'team' ? 'heroicons:user-group-20-solid' : 'heroicons:user-20-solid'" class="h-4 w-4 flex-none" />
                    <span class="truncate">{{ member.kind === 'team' ? teamById(member.ref).name : agentById(member.ref).name }}</span>
                  </span>
                </div>

              </article>
            </div>
          </section>
        </div>
        <div v-else class="rounded-lg border border-slate-200 bg-white py-16 text-center shadow-sm">
          <p class="text-lg font-medium text-slate-500">No organizations found</p>
          <p class="mt-2 text-sm text-slate-400">No organizations matched “{{ search.trim() }}”</p>
        </div>
      </template>

      <template v-else-if="view === 'org-detail'">
        <button type="button" class="mb-5 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('org-list')"><Icon icon="heroicons:arrow-left-20-solid" class="mr-2 h-4 w-4" /> Back to Agent Orgs</button>
        <header class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="flex min-w-0 items-start gap-4">
              <span class="inline-flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-slate-100 text-2xl font-semibold tracking-wide text-slate-700">{{ orgInitials(selectedOrg.name) }}</span>
              <div class="min-w-0"><h1 class="text-3xl font-bold tracking-tight text-slate-950">{{ selectedOrg.name }}</h1></div>
            </div>
            <div class="flex shrink-0 gap-2">
              <button type="button" class="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-test="run-organization" @click="openLaunch(selectedOrg.id)">Run</button>
              <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('org-edit', selectedOrg.id)">Edit</button>
            </div>
          </div>
        </header>

        <div class="mt-4 space-y-4">
          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-xl font-semibold text-slate-900">Description</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ selectedOrg.description }}</p>
          </section>

          <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 px-5 py-4"><h2 class="text-xl font-semibold text-slate-900">Members</h2></div>
            <div class="grid divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <div class="p-5">
                <div class="mb-4 flex items-center gap-2"><Icon icon="heroicons:user-20-solid" class="h-5 w-5 text-slate-500" /><h3 class="font-semibold text-slate-900">Agents ({{ directAgents.length }})</h3></div>
                <ul class="space-y-3"><li v-for="agent in directAgents" :key="agent.id" class="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agent.initials }}</span><p class="min-w-0 truncate text-sm font-semibold text-slate-900">{{ agent.name }}</p></li></ul>
              </div>
              <div class="p-5">
                <div class="mb-4 flex items-center gap-2"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5 text-blue-600" /><h3 class="font-semibold text-slate-900">Teams ({{ referencedTeams.length }})</h3></div>
                <ul class="space-y-3"><li v-for="team in referencedTeams" :key="team.id" class="rounded-lg border border-blue-200 bg-blue-50/50 p-3"><div class="flex items-center gap-3"><span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-700"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5" /></span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ team.name }}</p><p class="truncate text-xs text-slate-500">Coordinator: {{ agentById(team.coordinatorId).name }}</p></div><button type="button" class="text-xs font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="openTeam(team.id)">View ↗</button></div></li></ul>
              </div>
            </div>
          </section>

          <HandoffManager :model-value="detailOrgHandoffs" :from-options="detailOrgHandoffOptions.from" :to-options="detailOrgHandoffOptions.to" mode="view" scope="org" />
        </div>
      </template>

      <template v-else>
        <button type="button" class="mb-5 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('org-list')"><Icon icon="heroicons:arrow-left-20-solid" class="mr-2 h-4 w-4" /> Back to Agent Orgs</button>
        <header class="mb-6"><h1 class="text-3xl font-bold tracking-tight text-slate-950">{{ view === 'org-create' ? 'Create Agent Org' : 'Edit ' + selectedOrg.name }}</h1><p class="mt-2 max-w-3xl text-base text-slate-600">Add Agents and Teams, then configure handoffs.</p></header>
        <form class="space-y-4" @submit.prevent="saveOrg">
          <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 class="font-semibold text-slate-900">Basics</h2><div class="mt-4 space-y-4"><label class="block"><span class="text-sm font-medium text-slate-700">Name</span><input v-model="formName" required class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"></label><label class="block"><span class="text-sm font-medium text-slate-700">Description</span><textarea v-model="formDescription" rows="3" class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"></textarea></label></div></section>

          <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <h2 class="text-xl font-semibold text-slate-900">Members</h2>
              <button type="button" class="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-test="open-member-picker" @click="memberPickerOpen ? closeMemberPicker() : openMemberPicker()">
                <Icon :icon="memberPickerOpen ? 'heroicons:x-mark-20-solid' : 'heroicons:plus-20-solid'" class="h-4 w-4" /> {{ memberPickerOpen ? 'Close' : 'Add member' }}
              </button>
            </div>
            <section v-if="memberPickerOpen" class="border-b border-slate-200 bg-slate-50 px-5 py-5" data-test="org-member-picker" aria-labelledby="member-picker-title">
              <div class="flex items-start justify-between gap-4"><div><h3 id="member-picker-title" class="font-semibold text-slate-900">Choose members</h3><p class="mt-1 text-sm text-slate-600">Add a direct Agent or an existing Team.</p></div></div>
              <label class="relative mt-4 block"><span class="sr-only">Search members</span><Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input v-model="memberSearch" type="search" class="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Search members"></label>
              <div class="mt-4 flex gap-1 border-b border-slate-200" role="tablist" aria-label="Member type">
                <button type="button" role="tab" class="border-b-2 px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :class="memberPickerTab === 'agents' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'" :aria-selected="memberPickerTab === 'agents'" @click="memberPickerTab = 'agents'">Agents</button>
                <button type="button" role="tab" class="border-b-2 px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :class="memberPickerTab === 'teams' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'" :aria-selected="memberPickerTab === 'teams'" @click="memberPickerTab = 'teams'">Teams</button>
              </div>
              <ul v-if="memberPickerTab === 'agents'" class="mt-4 grid gap-2 lg:grid-cols-2" data-test="member-picker-agents">
                <li v-for="agent in filteredMemberAgents" :key="agent.id" class="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                  <span class="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agent.initials }}</span>
                  <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ agent.name }}</p><p class="truncate text-xs text-slate-500">{{ agent.description }}</p></div>
                  <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :class="formAgentIds.includes(agent.id) ? 'cursor-default bg-slate-100 text-slate-500' : 'border border-blue-200 bg-white text-blue-700 hover:bg-blue-50'" :disabled="formAgentIds.includes(agent.id)" :aria-label="formAgentIds.includes(agent.id) ? `${agent.name} added` : `Add ${agent.name}`" @click="addOrgAgent(agent.id)">{{ formAgentIds.includes(agent.id) ? 'Added' : 'Add' }}</button>
                </li>
                <li v-if="filteredMemberAgents.length === 0" class="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 lg:col-span-2">No Agents match your search.</li>
              </ul>
              <ul v-else class="mt-4 grid gap-2 lg:grid-cols-2" data-test="member-picker-teams">
                <li v-for="team in filteredMemberTeams" :key="team.id" class="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                  <span class="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5" /></span>
                  <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ team.name }}</p><p class="truncate text-xs text-slate-500">Coordinator: {{ agentById(team.coordinatorId).name }}</p></div>
                  <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :class="formTeamIds.includes(team.id) ? 'cursor-default bg-slate-100 text-slate-500' : 'border border-blue-200 bg-white text-blue-700 hover:bg-blue-50'" :disabled="formTeamIds.includes(team.id)" :aria-label="formTeamIds.includes(team.id) ? `${team.name} added` : `Add ${team.name}`" @click="addOrgTeam(team.id)">{{ formTeamIds.includes(team.id) ? 'Added' : 'Add' }}</button>
                </li>
                <li v-if="filteredMemberTeams.length === 0" class="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 lg:col-span-2">No Teams match your search.</li>
              </ul>
              <div class="mt-4 flex justify-end"><button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="closeMemberPicker">Done</button></div>
            </section>
            <div class="grid lg:grid-cols-2 lg:divide-x lg:divide-slate-100">
              <div class="p-5"><h3 class="font-semibold text-slate-900">Agents</h3><ul v-if="formAgentIds.length" class="mt-4 space-y-2"><li v-for="agentId in formAgentIds" :key="agentId" class="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agentById(agentId).initials }}</span><p class="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{{ agentById(agentId).name }}</p><button type="button" class="rounded text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-label="`Remove ${agentById(agentId).name}`" @click="removeOrgAgent(agentId)"><Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" /></button></li></ul><p v-else class="mt-4 text-sm text-slate-500">No Agents added.</p></div>
              <div class="p-5"><h3 class="font-semibold text-slate-900">Teams</h3><ul v-if="formTeamIds.length" class="mt-4 space-y-2"><li v-for="teamId in formTeamIds" :key="teamId" class="rounded-lg border border-blue-200 bg-blue-50/50 p-3"><div class="flex items-center gap-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-700"><Icon icon="heroicons:user-group-20-solid" class="h-4 w-4" /></span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ teamById(teamId).name }}</p><p class="truncate text-xs text-slate-500">Coordinator: {{ agentById(teamById(teamId).coordinatorId).name }}</p></div><button type="button" class="rounded text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-label="`Remove ${teamById(teamId).name}`" @click="removeOrgTeam(teamId)"><Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" /></button></div></li></ul><p v-else class="mt-4 text-sm text-slate-500">No Teams added.</p></div>
            </div>
          </section>

          <HandoffManager ref="orgHandoffManager" v-model="formOrgHandoffs" :from-options="formOrgHandoffOptions.from" :to-options="formOrgHandoffOptions.to" mode="edit" scope="org" />
          <section v-if="saveError" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700" role="alert">{{ saveError }}</section>
          <section v-if="saved" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800" role="status">Agent Org saved.</section>
          <div class="flex justify-end gap-3"><button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('org-list')">Cancel</button><button type="submit" class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{{ view === 'org-create' ? 'Create Org' : 'Save changes' }}</button></div>
        </form>
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import HandoffManager from '~/components/collaboration/handoffs/HandoffManager.vue'
import { useAgentDefinitionStore, type AgentDefinition } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore, type AgentTeamDefinition } from '~/stores/agentTeamDefinitionStore'
import {
  useAgentOrgDefinitionStore,
  type AgentOrgDefinition,
  type AgentOrgDefinitionDraft,
  type AgentOrgMember,
} from '~/stores/agentOrgDefinitionStore'
import {
  toDefinitionHandoffs,
  toEditableHandoffs,
  type EditableHandoff,
  type HandoffEndpointOption,
} from '~/types/collaboration/handoffs'

type OrgView = 'org-list' | 'org-detail' | 'org-create' | 'org-edit'
type HandoffManagerExpose = { validateAll: () => boolean; clearStatus: () => void }
type AgentView = { id: string; name: string; description: string; initials: string }
type TeamView = { id: string; name: string; description: string; coordinatorId: string }
type CatalogMember = { kind: 'agent' | 'team'; ref: string }
type CatalogOrg = Omit<AgentOrgDefinition, 'members'> & { members: CatalogMember[] }

const route = useRoute()
const router = useRouter()
const orgStore = useAgentOrgDefinitionStore()
const agentStore = useAgentDefinitionStore()
const teamStore = useAgentTeamDefinitionStore()
const search = ref('')
const reloading = ref(false)
const saved = ref(false)
const saveError = ref('')
const saving = ref(false)
const orgHandoffManager = ref<HandoffManagerExpose | null>(null)
const memberPickerOpen = ref(false)
const memberPickerTab = ref<'agents' | 'teams'>('agents')
const memberSearch = ref('')
const formName = ref('')
const formDescription = ref('')
const formMembers = ref<AgentOrgMember[]>([])
const formOrgHandoffs = ref<EditableHandoff[]>([])

const emptyOrg: AgentOrgDefinition = {
  id: '', name: '', description: '', instructions: '', revision: '', members: [], handoffs: [],
}
const view = computed<OrgView>(() => {
  const candidate = String(route.query.view || 'org-list') as OrgView
  return ['org-list', 'org-detail', 'org-create', 'org-edit'].includes(candidate) ? candidate : 'org-list'
})
const selectedOrg = computed(() => orgStore.byId(String(route.query.id || '')) ?? emptyOrg)
const orgInitials = (name: string): string => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'AO'
const toAgentView = (definition: AgentDefinition | null | undefined, fallbackId: string): AgentView => {
  const name = definition?.name || fallbackId
  return { id: definition?.id || fallbackId, name, description: definition?.description || '', initials: orgInitials(name) }
}
const agentById = (id: string): AgentView => toAgentView(agentStore.getAgentDefinitionById(id), id)
const teamById = (id: string): TeamView => {
  const team = teamStore.getAgentTeamDefinitionById(id)
  if (!team) return { id, name: id, description: '', coordinatorId: '' }
  const coordinator = team.nodes.find((member) => member.memberName === team.coordinatorMemberName)
  return { id: team.id, name: team.name, description: team.description, coordinatorId: coordinator?.ref || team.coordinatorMemberName }
}
const toCatalogOrg = (org: AgentOrgDefinition): CatalogOrg => ({
  ...org,
  members: org.members.map((member) => ({ kind: member.refType === 'AGENT_TEAM' ? 'team' : 'agent', ref: member.ref })),
})
const catalogOrgs = computed(() => orgStore.definitions.map(toCatalogOrg))
const filteredOrgs = computed(() => {
  const query = search.value.trim().toLowerCase()
  return query ? catalogOrgs.value.filter((org) => `${org.name} ${org.description}`.toLowerCase().includes(query)) : catalogOrgs.value
})
const catalogSections = computed(() => {
  if (search.value.trim()) return filteredOrgs.value.length ? [{ id: 'search', title: '', orgs: filteredOrgs.value }] : []
  return catalogOrgs.value.length ? [{ id: 'featured', title: 'Featured organizations', orgs: catalogOrgs.value }] : []
})
const directAgents = computed(() => selectedOrg.value.members.filter((member) => member.refType === 'AGENT').map((member) => agentById(member.ref)))
const referencedTeams = computed(() => selectedOrg.value.members.filter((member) => member.refType === 'AGENT_TEAM').map((member) => teamById(member.ref)))
const availableAgents = computed(() => agentStore.sharedAgentDefinitions.map((agent) => toAgentView(agent, agent.id)))
const availableTeams = computed(() => teamStore.sharedAgentTeamDefinitions.map((team) => teamById(team.id)))
const formAgentIds = computed(() => formMembers.value.filter((member) => member.refType === 'AGENT').map((member) => member.ref))
const formTeamIds = computed(() => formMembers.value.filter((member) => member.refType === 'AGENT_TEAM').map((member) => member.ref))
const normalizedMemberSearch = computed(() => memberSearch.value.trim().toLowerCase())
const filteredMemberAgents = computed(() => availableAgents.value.filter((agent) => !normalizedMemberSearch.value || `${agent.name} ${agent.description}`.toLowerCase().includes(normalizedMemberSearch.value)))
const filteredMemberTeams = computed(() => availableTeams.value.filter((team) => !normalizedMemberSearch.value || `${team.name} ${team.description} ${agentById(team.coordinatorId).name}`.toLowerCase().includes(normalizedMemberSearch.value)))

const uniqueMemberName = (raw: string): string => {
  const stem = raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'member'
  let candidate = stem
  for (let suffix = 2; formMembers.value.some((member) => member.memberName.toLowerCase() === candidate.toLowerCase()); suffix += 1) candidate = `${stem}_${suffix}`
  return candidate
}
const buildHandoffOptions = (members: readonly AgentOrgMember[]) => {
  const from: HandoffEndpointOption[] = []
  const to: HandoffEndpointOption[] = []
  for (const member of members) {
    if (member.refType === 'AGENT') {
      const option = { id: member.memberName, kind: 'agent' as const, label: agentById(member.ref).name, address: `/${member.memberName}`, group: 'Direct Agents' }
      from.push(option); to.push(option); continue
    }
    const team = teamStore.getAgentTeamDefinitionById(member.ref)
    if (!team) continue
    const teamAddress = `/${member.memberName}`
    const teamOption = { id: member.memberName, kind: 'team' as const, label: team.name, address: teamAddress, group: 'Teams', coordinatorAddress: `${teamAddress}/${team.coordinatorMemberName}` }
    to.push(teamOption)
    for (const agent of team.nodes) {
      const option = { id: `${member.memberName}/${agent.memberName}`, kind: 'agent' as const, label: `${team.name} / ${agent.memberName}`, address: `${teamAddress}/${agent.memberName}`, group: `Team · ${team.name}` }
      from.push(option); to.push(option)
    }
  }
  return { from, to }
}
const detailOrgHandoffOptions = computed(() => buildHandoffOptions(selectedOrg.value.members))
const detailOrgHandoffs = computed(() => toEditableHandoffs(selectedOrg.value.handoffs))
const formOrgHandoffOptions = computed(() => buildHandoffOptions(formMembers.value))

const hydrateForm = (): void => {
  const org = selectedOrg.value
  formName.value = view.value === 'org-create' ? '' : org.name
  formDescription.value = view.value === 'org-create' ? '' : org.description
  formMembers.value = view.value === 'org-create' ? [] : org.members.map((member) => ({ ...member }))
  formOrgHandoffs.value = view.value === 'org-create' ? [] : toEditableHandoffs(org.handoffs)
  saved.value = false; saveError.value = ''; memberPickerOpen.value = false; memberPickerTab.value = 'agents'; memberSearch.value = ''
}
watch([view, () => route.query.id], hydrateForm, { immediate: true })
const go = (nextView: OrgView, id?: string) => router.push({ path: '/agent-orgs', query: { view: nextView, ...(id ? { id } : {}) } })
const openTeam = (id: string) => router.push({ path: '/agent-teams', query: { view: 'team-detail', id, returnToOrg: selectedOrg.value.id } })
const openLaunch = (id: string) => router.push({ path: '/workspace', query: { rootSubjectKind: 'agent_org', definitionId: id, mode: 'configuration' } })
const reloadOrgs = async (): Promise<void> => { reloading.value = true; try { await orgStore.fetchAll(true) } finally { reloading.value = false } }
const openMemberPicker = (): void => { memberPickerTab.value = 'agents'; memberSearch.value = ''; memberPickerOpen.value = true }
const closeMemberPicker = (): void => { memberPickerOpen.value = false; memberSearch.value = '' }
const addMember = (ref: string, refType: AgentOrgMember['refType'], displayName: string): void => {
  if (formMembers.value.some((member) => member.ref === ref && member.refType === refType)) return
  formMembers.value.push({ memberName: uniqueMemberName(displayName), ref, refType, refScope: 'SHARED' })
  saved.value = false
}
const addOrgAgent = (id: string) => addMember(id, 'AGENT', agentById(id).name)
const addOrgTeam = (id: string) => addMember(id, 'AGENT_TEAM', teamById(id).name)
const removeMember = (ref: string, refType: AgentOrgMember['refType']): void => { formMembers.value = formMembers.value.filter((member) => member.ref !== ref || member.refType !== refType); saved.value = false }
const removeOrgAgent = (id: string) => removeMember(id, 'AGENT')
const removeOrgTeam = (id: string) => removeMember(id, 'AGENT_TEAM')
const saveOrg = async (): Promise<void> => {
  if (saving.value) return
  if (!formName.value.trim()) { saveError.value = 'Enter an Agent Org name before saving.'; return }
  if (!orgHandoffManager.value?.validateAll()) { saveError.value = 'Resolve the highlighted handoffs before saving this Agent Org.'; return }
  saving.value = true; saved.value = false; saveError.value = ''
  const visibleInput = {
    name: formName.value.trim(),
    description: formDescription.value.trim(),
    members: formMembers.value.map((member) => ({ ...member })),
    handoffs: toDefinitionHandoffs(formOrgHandoffs.value),
  }
  try {
    if (view.value === 'org-create') {
      const createInput: AgentOrgDefinitionDraft = {
        ...visibleInput,
        instructions: '',
        category: null,
        avatarUrl: null,
        defaultLaunchConfig: null,
      }
      const created = await orgStore.create(createInput)
      await go('org-edit', created.id)
    } else {
      await orgStore.update(selectedOrg.value.id, selectedOrg.value.revision, visibleInput)
    }
    await nextTick(); orgHandoffManager.value?.clearStatus(); saved.value = true
  } catch (error) { saveError.value = error instanceof Error ? error.message : String(error) } finally { saving.value = false }
}
onMounted(async () => {
  await Promise.allSettled([orgStore.fetchAll(), agentStore.fetchAllAgentDefinitions(), teamStore.fetchAllAgentTeamDefinitions()])
  if (view.value !== 'org-create') hydrateForm()
})
</script>
