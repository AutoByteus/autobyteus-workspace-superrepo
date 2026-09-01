import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AgentOrgExecutionContext } from '~/services/agentOrgExecution/agentOrgExecutionContext'
import { AgentOrgStreamingService } from '~/services/agentOrgExecution/agentOrgStreamingService'

const services = new Map<string, AgentOrgStreamingService>()

export const useAgentOrgContextsStore = defineStore('agentOrgContexts', () => {
  const contexts = ref<Record<string, AgentOrgExecutionContext>>({})
  const errors = ref<Record<string, string | null>>({})
  const pendingFocus = ref<Record<string, string | null | undefined>>({})

  const connect = (orgRunIdInput: string): void => {
    const orgRunId = orgRunIdInput.trim()
    if (!orgRunId) return
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
    })
    services.set(orgRunId, service)
    service.connect()
  }

  const reopen = async (orgRunId: string): Promise<void> => {
    try {
      await services.get(orgRunId)?.reopen()
    } catch (error) {
      errors.value = {
        ...errors.value,
        [orgRunId]: error instanceof Error ? error.message : String(error),
      }
    }
  }

  const disconnect = (orgRunId: string): void => {
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

  const select = (orgRunId: string, address: string | null): void => {
    pendingFocus.value = { ...pendingFocus.value, [orgRunId]: address }
    contexts.value[orgRunId]?.select(address)
  }

  const contextFor = (orgRunId: string): AgentOrgExecutionContext | null =>
    contexts.value[orgRunId] ?? null
  const errorFor = (orgRunId: string): string | null => errors.value[orgRunId] ?? null

  return { contexts, errors, connect, reopen, disconnect, select, contextFor, errorFor }
})
