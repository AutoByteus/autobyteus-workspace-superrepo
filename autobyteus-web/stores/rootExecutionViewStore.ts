import { defineStore } from 'pinia'
import { useAgentOrgContextsStore } from '~/stores/agentOrgContextsStore'
import type { RootExecutionSubjectKind } from '~/services/rootExecution/rootExecutionViewState'

export const useRootExecutionViewStore = defineStore('rootExecutionView', () => {
  const orgs = useAgentOrgContextsStore()

  const connectAgentOrg = (orgRunId: string): void => {
    orgs.connect(orgRunId)
  }

  const selectAddress = (kind: RootExecutionSubjectKind, runId: string, address: string | null): void => {
    if (kind === 'agent_org') orgs.select(runId, address)
  }
  const disconnect = (kind: RootExecutionSubjectKind, runId: string): void => {
    if (kind === 'agent_org') orgs.disconnect(runId)
  }
  return { connectAgentOrg, selectAddress, disconnect }
})
