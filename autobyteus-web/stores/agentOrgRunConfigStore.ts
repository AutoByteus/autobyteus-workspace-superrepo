import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AgentTeamAddress } from '~/types/agent/AgentTeamAddress'
import type { TeamWorkspaceOperationState } from '~/types/agent/TeamLaunchDraft'
import type { AgentConfigOverride, TeamScopeConfigOverride } from '~/types/agent/TeamRunConfig'
import type { RuntimeModelConfigSchemaState } from '~/types/agent/RuntimeModelConfigSchemaState'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'

export type AgentOrgRunConfigIntent = Readonly<{
  definitionId: string
  runtimeKind: string
  llmModelIdentifier: string
  llmConfig: Record<string, unknown> | null
  autoExecuteTools: boolean
  workspaceSelection: WorkspaceSelectionState
  teamOverrides: Readonly<Record<AgentTeamAddress, TeamScopeConfigOverride>>
  agentOverrides: Readonly<Record<AgentTeamAddress, AgentConfigOverride>>
  teamWorkspaceSelections: Readonly<Record<AgentTeamAddress, WorkspaceSelectionState>>
}>

const emptyWorkspace = (): WorkspaceSelectionState => ({ mode: 'new', existingWorkspaceId: null, newWorkspacePath: '' })
const idleWorkspaceOperation = (): TeamWorkspaceOperationState => ({ status: 'idle', error: null })
const loadingSchemaState = (): RuntimeModelConfigSchemaState => ({ status: 'loading', message: null })
const cloneTeamOverride = (override: TeamScopeConfigOverride): TeamScopeConfigOverride => ({
  ...override,
  ...(override.workspace ? {
    workspace: {
      workspaceId: override.workspace.workspaceId,
      workspaceMetadata: override.workspace.workspaceMetadata
        ? { ...override.workspace.workspaceMetadata }
        : null,
    },
  } : {}),
})

export const useAgentOrgRunConfigStore = defineStore('agentOrgRunConfig', () => {
  const definitionId = ref('')
  const runtimeKind = ref('autobyteus')
  const llmModelIdentifier = ref('')
  const llmConfig = ref<Record<string, unknown> | null>(null)
  const autoExecuteTools = ref(false)
  const workspaceSelection = ref<WorkspaceSelectionState>(emptyWorkspace())
  const teamOverrides = ref<Record<AgentTeamAddress, TeamScopeConfigOverride>>({})
  const agentOverrides = ref<Record<AgentTeamAddress, AgentConfigOverride>>({})
  const teamWorkspaceSelections = ref<Record<AgentTeamAddress, WorkspaceSelectionState>>({})
  const teamWorkspaceOperations = ref<Record<AgentTeamAddress, TeamWorkspaceOperationState>>({})
  const modelSchemaScopeAddresses = ref<readonly AgentTeamAddress[]>(['/'])
  const modelSchemaStateByAddress = ref<Record<AgentTeamAddress, RuntimeModelConfigSchemaState>>({
    '/': loadingSchemaState(),
  })
  const projectionError = ref<string | null>(null)
  const launchError = ref<string | null>(null)

  const begin = (input: {
    definitionId: string
    runtimeKind?: string | null
    llmModelIdentifier?: string | null
    llmConfig?: Record<string, unknown> | null
  }): void => {
    if (definitionId.value === input.definitionId) return
    definitionId.value = input.definitionId
    runtimeKind.value = input.runtimeKind || 'autobyteus'
    llmModelIdentifier.value = input.llmModelIdentifier || ''
    llmConfig.value = input.llmConfig ?? null
    autoExecuteTools.value = false
    workspaceSelection.value = emptyWorkspace()
    teamOverrides.value = {}
    agentOverrides.value = {}
    teamWorkspaceSelections.value = {}
    teamWorkspaceOperations.value = {}
    modelSchemaScopeAddresses.value = ['/']
    modelSchemaStateByAddress.value = { '/': loadingSchemaState() }
    projectionError.value = null
    launchError.value = null
  }

  const setWorkspaceSelection = (selection: WorkspaceSelectionState): void => {
    workspaceSelection.value = { ...selection }
  }
  const setTeamOverride = (address: AgentTeamAddress, override: TeamScopeConfigOverride | null): void => {
    const next = { ...teamOverrides.value }
    if (override) next[address] = cloneTeamOverride(override)
    else delete next[address]
    teamOverrides.value = next
  }
  const resetTeamOverride = (address: AgentTeamAddress): void => {
    setTeamOverride(address, null)
    const selections = { ...teamWorkspaceSelections.value }
    const operations = { ...teamWorkspaceOperations.value }
    delete selections[address]
    delete operations[address]
    teamWorkspaceSelections.value = selections
    teamWorkspaceOperations.value = operations
  }
  const setAgentOverride = (address: AgentTeamAddress, override: AgentConfigOverride | null): void => {
    const next = { ...agentOverrides.value }
    if (override) next[address] = { ...override }
    else delete next[address]
    agentOverrides.value = next
  }
  const setTeamWorkspaceSelection = (address: AgentTeamAddress, selection: WorkspaceSelectionState): void => {
    teamWorkspaceSelections.value = {
      ...teamWorkspaceSelections.value,
      [address]: { ...selection },
    }
    setTeamWorkspaceOperation(address, idleWorkspaceOperation())
  }
  const setTeamWorkspaceOperation = (address: AgentTeamAddress, operation: TeamWorkspaceOperationState): void => {
    teamWorkspaceOperations.value = {
      ...teamWorkspaceOperations.value,
      [address]: { ...operation },
    }
  }
  const teamWorkspaceSelectionFor = (address: AgentTeamAddress): WorkspaceSelectionState | null =>
    teamWorkspaceSelections.value[address] ?? null
  const teamWorkspaceOperationFor = (address: AgentTeamAddress): TeamWorkspaceOperationState =>
    teamWorkspaceOperations.value[address] ?? idleWorkspaceOperation()
  const reconcileModelSchemaScopes = (addresses: readonly AgentTeamAddress[]): void => {
    const exactAddresses = [...new Set(addresses)]
    if (exactAddresses.length === modelSchemaScopeAddresses.value.length
      && exactAddresses.every((address, index) => modelSchemaScopeAddresses.value[index] === address)) return
    modelSchemaScopeAddresses.value = Object.freeze(exactAddresses)
    modelSchemaStateByAddress.value = Object.fromEntries(exactAddresses.map((address) => [
      address,
      modelSchemaStateByAddress.value[address] ?? loadingSchemaState(),
    ]))
  }
  const setModelSchemaState = (address: AgentTeamAddress, state: RuntimeModelConfigSchemaState): void => {
    if (!modelSchemaScopeAddresses.value.includes(address)) return
    const current = modelSchemaStateByAddress.value[address]
    if (current?.status === state.status && current.message === state.message) return
    modelSchemaStateByAddress.value = {
      ...modelSchemaStateByAddress.value,
      [address]: { ...state },
    }
  }
  const modelSchemaStateFor = (address: AgentTeamAddress): RuntimeModelConfigSchemaState =>
    modelSchemaStateByAddress.value[address] ?? loadingSchemaState()
  const firstModelSchemaBlock = computed(() => {
    for (const address of modelSchemaScopeAddresses.value) {
      const state = modelSchemaStateFor(address)
      if (state.status !== 'ready') return Object.freeze({ address, state })
    }
    return null
  })
  const allModelSchemaScopesReady = computed(() => Boolean(
    modelSchemaScopeAddresses.value.length && !firstModelSchemaBlock.value,
  ))
  const setProjectionError = (error: string | null): void => {
    projectionError.value = error
  }
  const setLaunchError = (error: string | null): void => {
    launchError.value = error
  }

  const intent = computed<AgentOrgRunConfigIntent>(() => Object.freeze({
    definitionId: definitionId.value,
    runtimeKind: runtimeKind.value,
    llmModelIdentifier: llmModelIdentifier.value,
    llmConfig: llmConfig.value,
    autoExecuteTools: autoExecuteTools.value,
    workspaceSelection: { ...workspaceSelection.value },
    teamOverrides: Object.freeze(Object.fromEntries(
      Object.entries(teamOverrides.value).map(([address, override]) => [address, cloneTeamOverride(override)]),
    )),
    agentOverrides: Object.freeze(Object.fromEntries(
      Object.entries(agentOverrides.value).map(([address, override]) => [address, { ...override }]),
    )),
    teamWorkspaceSelections: Object.freeze(Object.fromEntries(
      Object.entries(teamWorkspaceSelections.value).map(([address, selection]) => [address, { ...selection }]),
    )),
  }))

  return {
    definitionId, runtimeKind, llmModelIdentifier, llmConfig, autoExecuteTools,
    workspaceSelection, teamOverrides, agentOverrides, teamWorkspaceSelections, teamWorkspaceOperations,
    modelSchemaScopeAddresses, modelSchemaStateByAddress, firstModelSchemaBlock, allModelSchemaScopesReady,
    projectionError, launchError, intent,
    begin, setWorkspaceSelection, setTeamOverride, resetTeamOverride, setAgentOverride,
    setTeamWorkspaceSelection, setTeamWorkspaceOperation, teamWorkspaceSelectionFor, teamWorkspaceOperationFor,
    reconcileModelSchemaScopes, setModelSchemaState, modelSchemaStateFor,
    setProjectionError, setLaunchError,
  }
})
