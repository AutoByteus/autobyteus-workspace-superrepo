import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AgentOrgMemberRunConfigPanel from '../AgentOrgMemberRunConfigPanel.vue'

const target = {
  kind: 'agent_org_team_member',
  root: { orgRunId: 'org-run-1' },
  address: '/delivery/reviewer',
  context: {
    state: { runId: 'agent-run-1' },
    config: {
      agentDefinitionId: 'reviewer-def',
      agentDefinitionName: 'Reviewer',
      agentAvatarUrl: null,
      runtimeKind: 'codex_app_server',
      llmModelIdentifier: 'gpt-5.3-codex',
      llmConfig: { reasoning_effort: 'high' },
      workspaceId: 'workspace-1',
      workspaceMetadata: {
        workspaceId: 'workspace-1',
        workspaceRootPath: '/workspace/project',
        displayName: 'project',
        kind: 'filesystem',
      },
      autoExecuteTools: false,
      skillAccessMode: 'PRELOADED_ONLY',
      isLocked: false,
    },
  },
} as any

describe('AgentOrgMemberRunConfigPanel', () => {
  it.each([
    ['agent_org_direct_agent', '/reviewer'],
    ['agent_org_team_member', '/delivery/reviewer'],
  ])('keeps the exact active %s locked after compatible model selection integration', async (kind, address) => {
    const AgentRunConfigFormStub = {
      name: 'AgentRunConfigForm',
      props: [
        'config', 'agentDefinition', 'workspaceLoadingState', 'workspaceSelection',
        'workspaceLocked', 'runtimeLocked', 'existingRun', 'existingModelConfigEditable', 'originalModelIdentifier',
      ],
      template: '<div data-test="locked-agent-form" />',
    }
    const wrapper = mount(AgentOrgMemberRunConfigPanel, {
      props: { target: { ...target, kind, address } },
      global: {
        stubs: {
          Icon: true,
          AgentRunConfigForm: AgentRunConfigFormStub,
        },
      },
    })

    const panel = wrapper.get('[data-test="agent-org-member-run-config"]')
    expect(panel.attributes()).toEqual(expect.objectContaining({
      'data-org-run-id': 'org-run-1',
      'data-member-address': address,
      'data-agent-run-id': 'agent-run-1',
    }))
    const form = wrapper.findComponent({ name: 'AgentRunConfigForm' })
    expect(form.props()).toEqual(expect.objectContaining({
      workspaceLocked: true,
      runtimeLocked: true,
      existingRun: true,
      existingModelConfigEditable: false,
      originalModelIdentifier: 'gpt-5.3-codex',
      config: expect.objectContaining({ isLocked: true, llmModelIdentifier: 'gpt-5.3-codex' }),
      workspaceSelection: expect.objectContaining({ existingWorkspaceId: 'workspace-1' }),
    }))

    await wrapper.get('[data-test="agent-org-config-back-to-events"]').trigger('click')
    expect(wrapper.emitted('back')).toEqual([[]])
  })
})
