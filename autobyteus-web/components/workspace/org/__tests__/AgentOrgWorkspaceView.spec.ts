import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AgentOrgWorkspaceView from '../AgentOrgWorkspaceView.vue'

const state = reactive({
  context: null as any,
  error: null as string | null,
  target: null as any,
})
const connect = vi.fn()
const disconnect = vi.fn()
const push = vi.fn().mockResolvedValue(undefined)
const route = reactive({ query: {
  rootSubjectKind: 'agent_org', definitionId: 'org-def', orgRunId: 'org-run', mode: 'active',
} })

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ push }),
}))
vi.mock('~/stores/activeContextStore', () => ({
  useActiveContextStore: () => ({
    get activeWorkspaceTarget() { return state.target },
    connectAgentOrg: connect,
    disconnectAgentOrg: disconnect,
    agentOrgContextFor: () => state.context,
    agentOrgErrorFor: () => state.error,
  }),
}))

const context = (phase: 'live' | 'reopen_required' = 'live') => ({
  phase,
  error: phase === 'reopen_required' ? 'Sequence gap' : null,
  executionTree: { rootOrg: { orgDefinitionId: 'org-def' } },
})
const directTarget = { kind: 'agent_org_direct_agent', context: { state: { runId: 'agent-run' } } }

const mountSubject = () => mount(AgentOrgWorkspaceView, {
  global: { stubs: {
    Icon: true,
    AgentWorkspaceSurface: {
      props: ['target', 'showHeaderActions', 'recoveryNotice'],
      emits: ['new-agent', 'edit-config'],
      template: '<div data-test="shared-agent-surface" :data-recovery="recoveryNotice || \'\'" :data-actions="String(showHeaderActions)"><button data-test="org-edit" @click="$emit(\'edit-config\')" /></div>',
    },
    TeamWorkspaceSurface: {
      props: ['target', 'showHeaderActions', 'recoveryNotice'],
      template: '<div data-test="shared-team-surface" />',
    },
  } },
})

describe('AgentOrgWorkspaceView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    state.context = context()
    state.error = null
    state.target = directTarget
    route.query.mode = 'active'
  })

  it('renders the accepted shared Agent surface and routes header actions through the Org journey', async () => {
    const wrapper = mountSubject()
    expect(wrapper.find('[data-test="shared-agent-surface"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="shared-team-surface"]').exists()).toBe(false)
    expect(wrapper.get('[data-test="shared-agent-surface"]').attributes('data-actions')).toBe('true')
    expect(wrapper.text()).not.toContain('AGENT RUN EVENT')
    await wrapper.get('[data-test="org-edit"]').trigger('click')
    expect(push).toHaveBeenCalledWith({
      path: '/workspace',
      query: { rootSubjectKind: 'agent_org', definitionId: 'org-def', mode: 'configuration' },
    })
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalledWith('org-run')
  })

  it('keeps the committed shared surface visible while bounded recovery remains transport-owned', () => {
    state.context = context('reopen_required')
    state.error = 'Sequence gap'
    const wrapper = mountSubject()
    expect(wrapper.find('[data-test="shared-agent-surface"]').exists()).toBe(true)
    expect(wrapper.get('[data-test="shared-agent-surface"]').attributes('data-recovery')).toContain('recover automatically')
    expect(wrapper.text()).not.toContain('Reconnect')
  })

  it('uses the shared bounded recovery notice when no committed context is available', () => {
    state.context = null
    state.target = null
    state.error = 'Automatic recovery exhausted'
    const wrapper = mountSubject()
    expect(wrapper.get('[role="alert"]').text()).toContain('recover automatically')
    expect(wrapper.text()).not.toContain('Agent Org stream needs to reconnect')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('starts with the approved nullable-focus prompt instead of inventing a member fallback', () => {
    state.target = null
    const wrapper = mountSubject()
    expect(wrapper.get('[data-test="agent-org-active-unfocused"]').text()).toContain('Choose an Agent or Team')
    expect(wrapper.find('[data-test="shared-agent-surface"]').exists()).toBe(false)
  })

  it('opens an inactive root as terminal history without starting a live stream', () => {
    route.query.mode = 'history'
    state.context = null
    state.target = null
    const wrapper = mountSubject()

    expect(wrapper.get('[data-test="agent-org-stopped-history"]').text()).toContain('Stopped Agent Org')
    expect(wrapper.get('[data-test="agent-org-stopped-history"]').text()).toContain('saved state')
    expect(connect).not.toHaveBeenCalled()
    expect(wrapper.text()).not.toContain('Restore')
  })
})
