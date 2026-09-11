import { RootExecutionViewDtoSchema } from '@autobyteus/collaboration-stream-contracts'
import type { OrgWorkspaceSelection } from '~/services/agentOrgExecution/agentOrgExecutionViewIndex'
import { hydrateAgentOrgExecutionContext } from '~/services/agentOrgExecution/agentOrgContextHydration'
import { GetAgentOrgRunInspection } from '~/graphql/queries/runHistoryQueries'
import { getApolloClient } from '~/utils/apolloClient'
import { defineStore } from 'pinia'
import { ref, shallowReactive } from 'vue'
import type { AgentOrgExecutionContext } from '~/services/agentOrgExecution/agentOrgExecutionContext'
import { AgentOrgStreamingService } from '~/services/agentOrgExecution/agentOrgStreamingService'
import { useRunHistoryStore } from '~/stores/runHistoryStore'

const services = new Map<string, AgentOrgStreamingService>()

export const useAgentOrgContextsStore = defineStore('agentOrgContexts', () => {
  const contexts = ref<Record<string, AgentOrgExecutionContext>>({})
  const errors = ref<Record<string, string | null>>({})
  const pendingFocus = ref<Record<string, OrgWorkspaceSelection | string | null | undefined>>({})

  const inspections = new Map<string, symbol>()

  const connect = (orgRunIdInput: string): void => {
    const orgRunId = orgRunIdInput.trim()
    if (!orgRunId) return
    inspections.delete(orgRunId)
    const existing = services.get(orgRunId)
    if (existing) {
      existing.connect()
      return
    }
    const service = new AgentOrgStreamingService({
      orgRunId,
      publish: (context) => {
        const requested = pendingFocus.value[orgRunId]
        if (requested !== undefined) context.select(requested)
        contexts.value = { ...contexts.value, [orgRunId]: context }
        errors.value = { ...errors.value, [orgRunId]: null }
      },
      reportError: (message) => {
        errors.value = { ...errors.value, [orgRunId]: message }
      },
      onAcceptedExternalUserMessage: () => {
        void useRunHistoryStore().refreshAgentOrgHistory()
      },
    })
    services.set(orgRunId, service)
    service.connect()
  }

  const disconnect = (orgRunId: string): void => {
    inspections.delete(orgRunId)
    services.get(orgRunId)?.disconnect()
    services.delete(orgRunId)
    const nextContexts = { ...contexts.value }
    const nextErrors = { ...errors.value }
    delete nextContexts[orgRunId]
    delete nextErrors[orgRunId]
    contexts.value = nextContexts
    errors.value = nextErrors
    const nextFocus = { ...pendingFocus.value }
    delete nextFocus[orgRunId]
    pendingFocus.value = nextFocus
  }

  const select = (orgRunId: string, address: OrgWorkspaceSelection | string | null): void => {
    pendingFocus.value = { ...pendingFocus.value, [orgRunId]: address }
    contexts.value[orgRunId]?.select(address)
  }

  const inspect = async (orgRunId: string): Promise<void> => {
    if (services.has(orgRunId)) return
    const ownership = Symbol(orgRunId)
    inspections.set(orgRunId, ownership)
    try {
      const result = await getApolloClient().query({ query: GetAgentOrgRunInspection,
        variables: { orgRunId }, fetchPolicy: 'network-only' })
      if (inspections.get(orgRunId) !== ownership) return
      if (result.errors?.length) throw new Error(result.errors.map((error: { message: string }) => error.message).join(', '))
      const envelope = RootExecutionViewDtoSchema.parse(result.data?.getAgentOrgRunInspection)
      if (envelope.root_subject_kind !== 'agent_org' || envelope.root_run_id !== orgRunId) {
        throw new Error('AgentOrg inspection root mismatch.')
      }
      if (envelope.root_org.is_active) { connect(orgRunId); return }
      const candidate = shallowReactive(await hydrateAgentOrgExecutionContext({
        orgRunId, view: envelope.root_org,
        isCurrent: () => inspections.get(orgRunId) === ownership,
      }))
      if (inspections.get(orgRunId) !== ownership) return
      const requested = pendingFocus.value[orgRunId]
      if (requested !== undefined) candidate.select(requested)
      contexts.value = { ...contexts.value, [orgRunId]: candidate }
      errors.value = { ...errors.value, [orgRunId]: null }
    } catch (error) {
      if (inspections.get(orgRunId) === ownership) {
        errors.value = { ...errors.value, [orgRunId]: error instanceof Error ? error.message : String(error) }
      }
    } finally {
      if (inspections.get(orgRunId) === ownership) inspections.delete(orgRunId)
    }
  }

  const contextFor = (orgRunId: string): AgentOrgExecutionContext | null =>
    contexts.value[orgRunId] ?? null
  const errorFor = (orgRunId: string): string | null => errors.value[orgRunId] ?? null

  return { contexts, errors, connect, inspect, disconnect, select, contextFor, errorFor }
})
