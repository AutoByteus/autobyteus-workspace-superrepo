import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getApolloClient } from '~/utils/apolloClient'
import { CreateAgentOrgRun, RestoreAgentOrgRun, TerminateAgentOrgRun } from '~/graphql/mutations/agentOrgRunMutations'
import { ListCollaborationRootHistory } from '~/graphql/queries/collaborationRootHistoryQueries'

export type AgentOrgLaunchInput = {
  agentOrgDefinitionId: string
  rootConfiguration: Record<string, unknown>
  teamOverrides: Array<{ address: string; configuration: Record<string, unknown> }>
  agentOverrides: Array<{ address: string; configuration: Record<string, unknown> }>
}

export type AgentOrgHistoryItem = Readonly<{
  root_subject_kind: 'agent_org'
  root_run_id: string
  created_at: string
  archived_at: string | null
  is_active: boolean
  summary: string
  org: Record<string, unknown>
}>

export const useAgentOrgRunStore = defineStore('agentOrgRun', () => {
  const launching = ref(false)
  const restoring = ref(false)
  const history = ref<AgentOrgHistoryItem[]>([])
  const historyError = ref<string | null>(null)
  const terminatingRunIds = ref<ReadonlySet<string>>(new Set())
  const terminationErrors = ref<Record<string, string | null>>({})

  const launch = async (input: AgentOrgLaunchInput): Promise<string> => {
    launching.value = true
    try {
      const { data, errors: gqlErrors } = await getApolloClient().mutate({ mutation: CreateAgentOrgRun, variables: { input } })
      if (gqlErrors?.length) throw new Error(gqlErrors.map((entry: { message: string }) => entry.message).join(', '))
      const result = data?.createAgentOrgRun
      if (!result?.success || !result.agentOrgRunId) throw new Error(result?.message || 'AgentOrg launch failed.')
      await fetchHistory().catch(() => undefined)
      return result.agentOrgRunId
    } finally { launching.value = false }
  }

  const fetchHistory = async (): Promise<void> => {
    historyError.value = null
    try {
      const response = await getApolloClient().query<{ listCollaborationRootHistory: Array<Record<string, unknown>> }>({
        query: ListCollaborationRootHistory,
        fetchPolicy: 'network-only',
      })
      if (response.errors?.length) throw new Error(response.errors.map((entry: { message: string }) => entry.message).join(', '))
      const items = (response.data?.listCollaborationRootHistory ?? []) as Array<Record<string, unknown>>
      history.value = items
        .filter((item) => item.root_subject_kind === 'agent_org')
        .map((item) => item as unknown as AgentOrgHistoryItem)
    } catch (cause) {
      historyError.value = cause instanceof Error ? cause.message : String(cause)
      throw cause
    }
  }

  const restore = async (orgRunId: string): Promise<string> => {
    restoring.value = true
    try {
      const { data, errors: gqlErrors } = await getApolloClient().mutate({ mutation: RestoreAgentOrgRun, variables: { agentOrgRunId: orgRunId } })
      if (gqlErrors?.length) throw new Error(gqlErrors.map((entry: { message: string }) => entry.message).join(', '))
      const result = data?.restoreAgentOrgRun
      if (!result?.success || !result.agentOrgRunId) throw new Error(result?.message || 'AgentOrg restore failed.')
      await fetchHistory().catch(() => undefined)
      return result.agentOrgRunId
    } finally { restoring.value = false }
  }

  const terminate = async (orgRunId: string): Promise<void> => {
    if (terminatingRunIds.value.has(orgRunId)) return
    terminatingRunIds.value = new Set([...terminatingRunIds.value, orgRunId])
    terminationErrors.value = { ...terminationErrors.value, [orgRunId]: null }
    try {
      const { data, errors: gqlErrors } = await getApolloClient().mutate({ mutation: TerminateAgentOrgRun, variables: { agentOrgRunId: orgRunId } })
      if (gqlErrors?.length) throw new Error(gqlErrors.map((entry: { message: string }) => entry.message).join(', '))
      if (!data?.terminateAgentOrgRun?.success) throw new Error(data?.terminateAgentOrgRun?.message || 'AgentOrg termination failed.')
      await fetchHistory().catch(() => undefined)
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : String(cause)
      terminationErrors.value = { ...terminationErrors.value, [orgRunId]: detail }
      throw cause
    } finally {
      const next = new Set(terminatingRunIds.value)
      next.delete(orgRunId)
      terminatingRunIds.value = next
    }
  }
  return {
    launching, restoring, history, historyError, terminatingRunIds, terminationErrors,
    launch, restore, fetchHistory, terminate,
  }
})
