import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import AgentOrgExperience from '../AgentOrgExperience.vue'

const { route, push, org, orgStore, agentStore, teamStore } = vi.hoisted(() => {
  const agents = [
    { id: 'requirements-agent', name: 'Requirements Engineer', description: 'Owns requirements.' },
    { id: 'architecture-agent', name: 'Architecture Designer', description: 'Owns architecture.' },
    { id: 'implementation-agent', name: 'Implementation Engineer', description: 'Owns implementation.' },
  ]
  const team = {
    id: 'software-team', name: 'Software Engineering', description: 'Builds the product.',
    coordinatorMemberName: 'architecture_designer', ownershipScope: 'SHARED',
    nodes: [
      { memberName: 'architecture_designer', ref: 'architecture-agent', refScope: 'SHARED' },
      { memberName: 'implementation_engineer', ref: 'implementation-agent', refScope: 'SHARED' },
    ],
  }
  const org = {
    id: 'software-org', name: 'Software Development Department', description: 'One complete delivery organization.',
    instructions: '', revision: 'org-rev-7', category: null, avatarUrl: null, defaultLaunchConfig: null,
    members: [
      { memberName: 'requirements_engineer', ref: 'requirements-agent', refType: 'AGENT', refScope: 'SHARED' },
      { memberName: 'software_engineering', ref: 'software-team', refType: 'AGENT_TEAM', refScope: 'SHARED' },
    ],
    handoffs: [{ from: '/requirements_engineer', to: '/software_engineering', rules: ['Requirements are approved.', 'Architecture may begin.'] }],
  }
  return {
    route: { query: { view: 'org-list' } as Record<string, string> },
    push: vi.fn().mockResolvedValue(undefined),
    org,
    orgStore: {
      definitions: [org], loading: false, error: null,
      byId: vi.fn((id: string) => id === org.id ? org : null),
      fetchAll: vi.fn().mockResolvedValue(undefined),
      create: vi.fn().mockResolvedValue(org),
      update: vi.fn().mockResolvedValue(org),
    },
    agentStore: {
      agentDefinitions: agents, sharedAgentDefinitions: agents,
      getAgentDefinitionById: vi.fn((id: string) => agents.find((agent) => agent.id === id)),
      fetchAllAgentDefinitions: vi.fn().mockResolvedValue(undefined),
    },
    teamStore: {
      rootAgentTeamDefinitions: [team], sharedAgentTeamDefinitions: [team],
      getAgentTeamDefinitionById: vi.fn((id: string) => id === team.id ? team : null),
      fetchAllAgentTeamDefinitions: vi.fn().mockResolvedValue(undefined),
    },
  }
})

vi.mock('vue-router', () => ({ useRoute: () => route, useRouter: () => ({ push }) }))
vi.mock('~/stores/agentOrgDefinitionStore', () => ({ useAgentOrgDefinitionStore: () => orgStore }))
vi.mock('~/stores/agentDefinitionStore', () => ({ useAgentDefinitionStore: () => agentStore }))
vi.mock('~/stores/agentTeamDefinitionStore', () => ({ useAgentTeamDefinitionStore: () => teamStore }))

const mountExperience = async (view: string, id?: string) => {
  route.query = { view, ...(id ? { id } : {}) }
  const wrapper = mount(AgentOrgExperience)
  await flushPromises()
  return wrapper
}

describe('AgentOrgExperience', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the baseline-native catalog with Run, member chips, and no fabricated run facts', async () => {
    const wrapper = await mountExperience('org-list')

    expect(wrapper.text()).toContain('Featured organizations')
    expect(wrapper.text()).toContain('Software Development Department')
    expect(wrapper.text()).toContain('Requirements Engineer')
    expect(wrapper.text()).toContain('Software Engineering')
    expect(wrapper.text()).toContain('Run')
    expect(wrapper.text()).not.toContain('Last run')
    expect(wrapper.text()).not.toContain('No coordinator')
  })

  it('uses an in-flow Agent/Team member chooser and exposes the Team coordinator', async () => {
    const wrapper = await mountExperience('org-create')
    await wrapper.get('[data-test="open-member-picker"]').trigger('click')

    expect(wrapper.get('[data-test="org-member-picker"]').exists()).toBe(true)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    expect(wrapper.get('[data-test="member-picker-teams"]').text()).toContain('Software Engineering')
    expect(wrapper.get('[data-test="member-picker-teams"]').text()).toContain('Architecture Designer')
  })

  it('shows same-identity Teams, their coordinator, and ordered From/To/When detail', async () => {
    const wrapper = await mountExperience('org-detail', org.id)

    expect(wrapper.text()).toContain('Coordinator: Architecture Designer')
    expect(wrapper.text()).toContain('/requirements_engineer')
    expect(wrapper.text()).toContain('/software_engineering')
    expect(wrapper.text().indexOf('Requirements are approved.')).toBeLessThan(wrapper.text().indexOf('Architecture may begin.'))
    expect(wrapper.text()).not.toContain('Handoff 1')
  })

  it('saves the complete Org atomically with the expected revision and preserved rule order', async () => {
    const wrapper = await mountExperience('org-edit', org.id)
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()

    expect(orgStore.update).toHaveBeenCalledWith(
      org.id,
      'org-rev-7',
      expect.objectContaining({
        members: org.members,
        handoffs: [{ from: '/requirements_engineer', to: '/software_engineering', rules: ['Requirements are approved.', 'Architecture may begin.'] }],
      }),
    )
    expect(wrapper.text()).toContain('Agent Org saved.')
  })
})
