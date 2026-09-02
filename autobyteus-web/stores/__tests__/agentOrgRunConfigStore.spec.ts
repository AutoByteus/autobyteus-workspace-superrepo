import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAgentOrgRunConfigStore } from '../agentOrgRunConfigStore'

describe('agentOrgRunConfigStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('owns separate exact Team and Agent sparse patches', () => {
    const store = useAgentOrgRunConfigStore()
    store.begin({ definitionId: 'org-1', runtimeKind: 'autobyteus', llmModelIdentifier: 'gpt-root' })
    store.setTeamOverride('/software', { runtimeKind: 'codex_app_server' })
    store.setAgentOverride('/software/worker', { llmModelIdentifier: 'gpt-worker' })

    expect(store.intent.teamOverrides).toEqual({ '/software': { runtimeKind: 'codex_app_server' } })
    expect(store.intent.agentOverrides).toEqual({ '/software/worker': { llmModelIdentifier: 'gpt-worker' } })
    expect(store.intent).not.toHaveProperty('memberOverrides')
  })

  it('resets only the exact Team patch and its workspace authoring state', () => {
    const store = useAgentOrgRunConfigStore()
    store.begin({ definitionId: 'org-1' })
    store.setTeamOverride('/software', {
      workspace: { workspaceId: null, workspaceMetadata: null },
      autoExecuteTools: true,
    })
    store.setTeamWorkspaceSelection('/software', {
      mode: 'new', existingWorkspaceId: null, newWorkspacePath: '/workspace/software',
    })
    store.setTeamWorkspaceOperation('/software', { status: 'error', error: 'unavailable' })
    store.setAgentOverride('/software/worker', { autoExecuteTools: true })

    store.resetTeamOverride('/software')

    expect(store.teamOverrides).toEqual({})
    expect(store.teamWorkspaceSelections).toEqual({})
    expect(store.teamWorkspaceOperations).toEqual({})
    expect(store.agentOverrides).toEqual({ '/software/worker': { autoExecuteTools: true } })
  })

  it('starts a different Org draft from a clean sparse configuration', () => {
    const store = useAgentOrgRunConfigStore()
    store.begin({ definitionId: 'org-1' })
    store.setTeamOverride('/software', { autoExecuteTools: true })
    store.setAgentOverride('/direct', { autoExecuteTools: true })
    store.setProjectionError('projection unavailable')
    store.setLaunchError('launch unavailable')
    store.setTeamWorkspaceSelection('/software', {
      mode: 'existing', existingWorkspaceId: 'workspace-1', newWorkspacePath: '',
    })

    store.begin({ definitionId: 'org-2', runtimeKind: 'codex_app_server', llmModelIdentifier: 'gpt-next' })

    expect(store.definitionId).toBe('org-2')
    expect(store.teamOverrides).toEqual({})
    expect(store.agentOverrides).toEqual({})
    expect(store.teamWorkspaceSelections).toEqual({})
    expect(store.workspaceSelection).toEqual({ mode: 'new', existingWorkspaceId: null, newWorkspacePath: '' })
    expect(store.projectionError).toBeNull()
    expect(store.launchError).toBeNull()
  })
})
