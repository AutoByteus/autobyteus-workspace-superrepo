import { useRoute, useRouter } from 'vue-router'
import { useAgentOrgContextsStore } from '~/stores/agentOrgContextsStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { useAgentSelectionStore } from '~/stores/agentSelectionStore'

export type WorkspaceHistorySubjectAction = Readonly<{
  rootSubjectKind: 'agent_org'
  rootRunId: string
  action: 'open' | 'select' | 'inspect' | 'stop'
  memberAddress?: string
  agentRunId?: string
}>

export const useWorkspaceHistorySubjectActions = () => {
  const route = useRoute()
  const router = useRouter()
  const historyStore = useRunHistoryStore()
  const orgContexts = useAgentOrgContextsStore()
  const selection = useAgentSelectionStore()

  const execute = async (command: WorkspaceHistorySubjectAction): Promise<void> => {
    let run = historyStore.agentOrgHistory.find((item) => item.rootRunId === command.rootRunId)
    if (!run) {
      // Exact participant links can be used before the history drawer mounts.
      // Resolve through the same strict read owner, not through live-context inference.
      await historyStore.refreshAgentOrgHistory()
      if (historyStore.historyFamilyErrors.agentOrg) {
        throw new Error(historyStore.historyFamilyErrors.agentOrg)
      }
      run = historyStore.agentOrgHistory.find((item) => item.rootRunId === command.rootRunId)
    }
    if (!run) throw new Error(`AgentOrg history run '${command.rootRunId}' is unavailable.`)
    const definitionId = run.executionTree.rootOrg.orgDefinitionId

    if (command.action === 'stop') {
      try { await orgContexts.stopAndInspect(run.rootRunId) }
      finally {
        if (orgContexts.contextFor(run.rootRunId)?.phase === 'historical'
          && route.query.rootSubjectKind === 'agent_org' && String(route.query.orgRunId || '') === run.rootRunId) {
          await router.replace({ path: '/workspace', query: { ...route.query, mode: 'history' } })
        }
      }
      return
    }

    await orgContexts.openForInspection(run.rootRunId)
    const context = orgContexts.contextFor(run.rootRunId)
    if (!context) throw new Error(`AgentOrg inspection '${run.rootRunId}' is unavailable.`)
    if (command.action === 'inspect') {
      const agent = command.agentRunId ? context.index.agents.get(command.agentRunId) : null
      if (!agent || (command.memberAddress && agent.address !== command.memberAddress)) {
        throw new Error('Exact task Agent execution is unavailable.')
      }
      orgContexts.select(run.rootRunId, { kind: 'agent_execution', agentRunId: agent.agentRunId })
    } else if (command.action === 'select') {
      const address = command.memberAddress?.trim()
      if (!address || !context.index.configured.has(address)) throw new Error('AgentOrg member selection requires an exact address.')
      orgContexts.select(run.rootRunId, address)
    }
    selection.clearSelection()
    await router.push({ path: '/workspace', query: {
      rootSubjectKind: 'agent_org', definitionId, orgRunId: run.rootRunId,
      mode: context.isActive ? 'active' : 'history',
      ...(command.action !== 'open' && command.memberAddress ? { memberAddress: command.memberAddress } : {}),
      ...(command.action === 'inspect' ? { agentRunId: command.agentRunId } : {}),
    } })
  }
  return { execute }
}
