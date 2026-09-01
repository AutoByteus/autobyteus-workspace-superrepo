import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AgentConfigOverride } from '~/types/agent/TeamRunConfig'
import type { WorkspaceSelectionState } from '~/types/workspace/WorkspaceSelectionState'

export type AgentOrgRunConfigIntent = Readonly<{
  definitionId: string
  runtimeKind: string
  llmModelIdentifier: string
  llmConfig: Record<string, unknown> | null
  autoExecuteTools: boolean
  workspaceSelection: WorkspaceSelectionState
  memberOverrides: Readonly<Record<string, AgentConfigOverride>>
}>

const emptyWorkspace = (): WorkspaceSelectionState => ({ mode: 'new', existingWorkspaceId: null, newWorkspacePath: '' })

export const useAgentOrgRunConfigStore = defineStore('agentOrgRunConfig', () => {
  const definitionId = ref('')
  const runtimeKind = ref('autobyteus')
  const llmModelIdentifier = ref('')
  const llmConfig = ref<Record<string, unknown> | null>(null)
  const autoExecuteTools = ref(false)
  const workspaceSelection = ref<WorkspaceSelectionState>(emptyWorkspace())
  const memberOverrides = ref<Record<string, AgentConfigOverride>>({})

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
    memberOverrides.value = {}
  }

  const setWorkspaceSelection = (selection: WorkspaceSelectionState): void => {
    workspaceSelection.value = { ...selection }
  }
  const setPlacementOverride = (address: string, override: AgentConfigOverride | null): void => {
    const next = { ...memberOverrides.value }
    if (override) next[address] = { ...override }
    else delete next[address]
    memberOverrides.value = next
  }
  const intent = computed<AgentOrgRunConfigIntent>(() => Object.freeze({
    definitionId: definitionId.value,
    runtimeKind: runtimeKind.value,
    llmModelIdentifier: llmModelIdentifier.value,
    llmConfig: llmConfig.value,
    autoExecuteTools: autoExecuteTools.value,
    workspaceSelection: { ...workspaceSelection.value },
    memberOverrides: Object.freeze({ ...memberOverrides.value }),
  }))
  return {
    definitionId, runtimeKind, llmModelIdentifier, llmConfig, autoExecuteTools,
    workspaceSelection, memberOverrides, intent,
    begin, setWorkspaceSelection, setPlacementOverride,
  }
})
