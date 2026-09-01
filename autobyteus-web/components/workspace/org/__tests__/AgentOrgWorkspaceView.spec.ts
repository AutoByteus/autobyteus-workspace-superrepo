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
const reopen = vi.fn().mockResolvedValue(undefined)
const push = vi.fn().mockResolvedValue(undefined)

vi.mock('vue-router', () => ({
  useRoute: () => reactive({ query: {
    rootSubjectKind: 'agent_org', definitionId: 'org-def', orgRunId: 'org-run', mode: 'active',
  } }),
  useRouter: () => ({ push }),
}))
vi.mock('~/stores/activeContextStore', () => ({
  useActiveContextStore: () => ({
    get activeWorkspaceTarget() { return state.target },
    connectAgentOrg: connect,
    disconnectAgentOrg: disconnect,
    reopenAgentOrg: reopen,
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
      props: ['target', 'showHeaderActions', 'recoveryNotice', 'recoveryActionLabel'],
      emits: ['new-agent', 'edit-config', 'recover'],
      template: '<div data-test="shared-agent-surface" :data-recovery="recoveryNotice || \'\'" :data-actions="String(showHeaderActions)"><button data-test="org-edit" @click="$emit(\'edit-config\')" /><button data-test="org-recover" @click="$emit(\'recover\')" /></div>',
    },
    TeamWorkspaceSurface: {
      props: ['target', 'showHeaderActions', 'recoveryNotice', 'recoveryActionLabel'],
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

  it('keeps the committed shared surface visible with an explicit recovery action', async () => {
    state.context = context('reopen_required')
    state.error = 'Sequence gap'
    const wrapper = mountSubject()
    expect(wrapper.find('[data-test="shared-agent-surface"]').exists()).toBe(true)
    expect(wrapper.get('[data-test="shared-agent-surface"]').attributes('data-recovery')).toContain('out of sync')
    await wrapper.get('[data-test="org-recover"]').trigger('click')
    expect(reopen).toHaveBeenCalledWith('org-run')
  })

  it('starts with the approved nullable-focus prompt instead of inventing a member fallback', () => {
    state.target = null
    const wrapper = mountSubject()
    expect(wrapper.get('[data-test="agent-org-active-unfocused"]').text()).toContain('Choose an Agent or Team')
    expect(wrapper.find('[data-test="shared-agent-surface"]').exists()).toBe(false)
  })
})
