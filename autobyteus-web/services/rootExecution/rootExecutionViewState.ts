import type {
  CollaborationStreamServerMessage,
  RootExecutionEventDto,
  RootExecutionViewDto,
} from '@autobyteus/collaboration-stream-contracts'

export type RootExecutionSubjectKind = 'agent_team' | 'agent_org'

export type RootExecutionViewState = Readonly<{
  rootSubjectKind: RootExecutionSubjectKind
  rootRunId: string
  view: RootExecutionViewDto | null
  events: readonly RootExecutionEventDto[]
  nextChangeSequence: number | null
  isActive: boolean | null
  selectedAddress: string | null
  error: string | null
}>

export const createRootExecutionViewState = (input: {
  rootSubjectKind: RootExecutionSubjectKind
  rootRunId: string
}): RootExecutionViewState => Object.freeze({
  rootSubjectKind: input.rootSubjectKind,
  rootRunId: required(input.rootRunId, 'rootRunId'),
  view: null,
  events: Object.freeze([]),
  nextChangeSequence: null,
  isActive: null,
  selectedAddress: null,
  error: null,
})

export const reduceRootExecutionServerMessage = (
  state: RootExecutionViewState,
  message: CollaborationStreamServerMessage,
): RootExecutionViewState => {
  if (message.type === 'ERROR') {
    return freeze({ ...state, error: `${message.payload.code}: ${message.payload.message}` })
  }
  assertCorrelation(state, message.payload.root_subject_kind, message.payload.root_run_id)
  switch (message.type) {
    case 'CONNECTED':
      return freeze({ ...state, error: null })
    case 'ROOT_EXECUTION_VIEW_SNAPSHOT': {
      const nextSequence = message.payload.root_subject_kind === 'agent_org'
        ? message.payload.root_org.base_change_sequence + 1
        : null
      const isActive = message.payload.root_subject_kind === 'agent_org'
        ? message.payload.root_org.is_active
        : state.isActive
      return freeze({
        ...state,
        view: message.payload,
        events: Object.freeze([]),
        nextChangeSequence: nextSequence,
        isActive,
        selectedAddress: resolveExactSelectedAddress(message.payload, state.selectedAddress),
        error: null,
      })
    }
    case 'ROOT_EXECUTION_EVENT': {
      if (state.nextChangeSequence === null) {
        throw new Error('Root execution event arrived before its snapshot barrier.')
      }
      if (message.payload.change_sequence !== state.nextChangeSequence) {
        throw new Error(`Root execution change-sequence gap: expected ${state.nextChangeSequence}, received ${message.payload.change_sequence}.`)
      }
      return freeze({
        ...state,
        events: Object.freeze([...state.events, message.payload].slice(-300)),
        nextChangeSequence: state.nextChangeSequence + 1,
        error: null,
      })
    }
    case 'ROOT_LIFECYCLE':
      return freeze({ ...state, isActive: message.payload.is_active, error: null })
  }
}

export const selectRootExecutionAddress = (
  state: RootExecutionViewState,
  address: string | null,
): RootExecutionViewState => freeze({
  ...state,
  selectedAddress: resolveExactSelectedAddress(state.view, address),
})

export type AgentOrgFocus = Readonly<{
  requestedAddress: string
  agentAddress: string
  agentRunId: string
  enteredThroughTeam: boolean
}>

export const resolveAgentOrgFocus = (
  view: RootExecutionViewDto | null,
  address: string | null,
): AgentOrgFocus | null => {
  if (!view || view.root_subject_kind !== 'agent_org' || !address) return null
  const members = view.root_org.execution_tree.rootOrg.members as Array<Record<string, unknown>>
  for (const member of members) {
    if (member.address === address && typeof member.agentRunId === 'string') {
      return Object.freeze({ requestedAddress: address, agentAddress: address, agentRunId: member.agentRunId, enteredThroughTeam: false })
    }
    if (member.address === address && Array.isArray(member.members) && typeof member.coordinatorAddress === 'string') {
      const coordinator = member.members.find((candidate) => isRecord(candidate)
        && candidate.address === member.coordinatorAddress
        && typeof candidate.agentRunId === 'string')
      return coordinator && typeof coordinator.agentRunId === 'string'
        ? Object.freeze({ requestedAddress: address, agentAddress: member.coordinatorAddress, agentRunId: coordinator.agentRunId, enteredThroughTeam: true })
        : null
    }
    if (Array.isArray(member.members)) {
      const agent = member.members.find((candidate) => isRecord(candidate)
        && candidate.address === address
        && typeof candidate.agentRunId === 'string')
      if (agent && typeof agent.agentRunId === 'string') {
        return Object.freeze({ requestedAddress: address, agentAddress: address, agentRunId: agent.agentRunId, enteredThroughTeam: false })
      }
    }
  }
  return null
}

const resolveExactSelectedAddress = (
  view: RootExecutionViewDto | null,
  address: string | null,
): string | null => view?.root_subject_kind === 'agent_org'
  ? resolveAgentOrgFocus(view, address)?.requestedAddress ?? null
  : address

const assertCorrelation = (
  state: RootExecutionViewState,
  rootSubjectKind: RootExecutionSubjectKind,
  rootRunId: string,
): void => {
  if (rootSubjectKind !== state.rootSubjectKind || rootRunId !== state.rootRunId) {
    throw new Error(`Root execution stream correlation mismatch for ${rootSubjectKind}:${rootRunId}.`)
  }
}

const required = (value: string, field: string): string => {
  const normalized = value.trim()
  if (!normalized) throw new Error(`${field} is required.`)
  return normalized
}
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const freeze = (state: RootExecutionViewState): RootExecutionViewState => Object.freeze(state)
