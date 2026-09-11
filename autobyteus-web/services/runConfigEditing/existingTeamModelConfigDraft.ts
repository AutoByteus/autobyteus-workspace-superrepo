import type { ExistingRunModelSelection } from '~/types/agent/ExistingRunModelConfigDraft'
import type {
  AgentLaunchConfigurationDto,
  TeamRunExecutionTreeDto,
} from '@autobyteus/team-stream-contracts'
import { existingRunModelConfigsEqual, cloneExistingRunSelection, existingRunSelectionsEqual } from './existingAgentModelConfigDraft'

export type ExistingTeamModelConfigScopeKind = 'CONFIGURED_TEAM' | 'CONFIGURED_AGENT'

export type ExistingTeamModelConfigScope = Readonly<{
  scopeKind: ExistingTeamModelConfigScopeKind
  address: string
  parentAddress: string | null
  runtimeKind: string
  originalSelection: ExistingRunModelSelection
  draftSelection: ExistingRunModelSelection
  linkedToParentAtDraftStart: boolean
  directlyEdited: boolean
}>

export type ExistingTeamModelConfigDraft = Readonly<{
  scopesByAddress: Readonly<Record<string, ExistingTeamModelConfigScope>>
  childAddressesByParent: Readonly<Record<string, readonly string[]>>
}>

export type ExistingTeamModelConfigPatch = Readonly<{
  scopeKind: ExistingTeamModelConfigScopeKind
  scopeAddress: string
  llmModelIdentifier: string
  llmConfig: Record<string, unknown> | null
}>

const fixedAndConfigEqual = (
  child: AgentLaunchConfigurationDto,
  parent: AgentLaunchConfigurationDto,
): boolean => child.runtime_kind === parent.runtime_kind &&
  child.llm_model_identifier === parent.llm_model_identifier &&
  existingRunModelConfigsEqual(child.llm_config, parent.llm_config)

export const createExistingTeamModelConfigDraft = (
  tree: TeamRunExecutionTreeDto,
): ExistingTeamModelConfigDraft => {
  const scopes: Record<string, ExistingTeamModelConfigScope> = {}
  const children: Record<string, string[]> = {}
  const add = (
    kind: ExistingTeamModelConfigScopeKind,
    address: string,
    parentAddress: string | null,
    launch: AgentLaunchConfigurationDto,
    parentLaunch: AgentLaunchConfigurationDto | null,
  ) => {
    scopes[address] = {
      scopeKind: kind,
      address,
      parentAddress,
      runtimeKind: launch.runtime_kind,
      originalSelection: cloneExistingRunSelection({ llmModelIdentifier: launch.llm_model_identifier, llmConfig: launch.llm_config }),
      draftSelection: cloneExistingRunSelection({ llmModelIdentifier: launch.llm_model_identifier, llmConfig: launch.llm_config }),
      linkedToParentAtDraftStart: Boolean(parentLaunch && fixedAndConfigEqual(launch, parentLaunch)),
      directlyEdited: false,
    }
    if (parentAddress) (children[parentAddress] ??= []).push(address)
  }
  add('CONFIGURED_TEAM', '/', null, tree.root_team.default_launch_configuration, null)
  for (const member of tree.root_team.members) {
    add('CONFIGURED_AGENT', member.address, '/', member.launch_configuration, tree.root_team.default_launch_configuration)
  }
  return { scopesByAddress: scopes, childAddressesByParent: children }
}

export const updateExistingTeamScopeModelConfig = (
  draft: ExistingTeamModelConfigDraft,
  address: string,
  selection: ExistingRunModelSelection,
  directlyEdited = true,
): ExistingTeamModelConfigDraft => {
  if (!draft.scopesByAddress[address]) throw new Error(`Configured Team scope '${address}' was not found.`)
  const scopes: Record<string, ExistingTeamModelConfigScope> = { ...draft.scopesByAddress }
  const target = scopes[address]!
  scopes[address] = { ...target, draftSelection: cloneExistingRunSelection(selection), directlyEdited: target.directlyEdited || directlyEdited }
  const propagate = (parentAddress: string, inherited: ExistingRunModelSelection): void => {
    for (const childAddress of draft.childAddressesByParent[parentAddress] ?? []) {
      const child = scopes[childAddress]!
      if (!child.linkedToParentAtDraftStart || child.directlyEdited) continue
      scopes[childAddress] = { ...child, draftSelection: cloneExistingRunSelection(inherited) }
    }
  }
  propagate(address, selection)
  return { ...draft, scopesByAddress: scopes }
}

export const planExistingTeamModelConfigPatches = (
  draft: ExistingTeamModelConfigDraft,
): ExistingTeamModelConfigPatch[] => Object.values(draft.scopesByAddress)
  .filter((scope) => !existingRunSelectionsEqual(scope.originalSelection, scope.draftSelection))
  .sort((left, right) => left.address.localeCompare(right.address))
  .map((scope) => ({
    scopeKind: scope.scopeKind,
    scopeAddress: scope.address,
    ...cloneExistingRunSelection(scope.draftSelection),
  }))
