import { useRoute, useRouter } from 'vue-router'
import { useAgentOrgContextsStore } from '~/stores/agentOrgContextsStore'
import { useAgentOrgRunStore } from '~/stores/agentOrgRunStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'

export type WorkspaceHistorySubjectAction = Readonly<{
  rootSubjectKind: 'agent_org'
  rootRunId: string
  action: 'open' | 'select' | 'stop'
  memberAddress?: string
}>

export const useWorkspaceHistorySubjectActions = () => {
  const route = useRoute()
  const router = useRouter()
  const historyStore = useRunHistoryStore()
  const orgRunStore = useAgentOrgRunStore()
  const orgContexts = useAgentOrgContextsStore()

  const execute = async (command: WorkspaceHistorySubjectAction): Promise<void> => {
    const run = historyStore.agentOrgHistory.find((item) => item.rootRunId === command.rootRunId)
    if (!run) throw new Error(`AgentOrg history run '${command.rootRunId}' is unavailable.`)
    const definitionId = run.executionTree.rootOrg.orgDefinitionId

    if (command.action === 'stop') {
      await orgRunStore.terminate(run.rootRunId)
      orgContexts.disconnect(run.rootRunId)
      await historyStore.refreshTreeQuietly()
      if (route.query.rootSubjectKind === 'agent_org'
        && route.query.mode === 'active'
        && String(route.query.orgRunId || '') === run.rootRunId) {
        await router.replace({
          path: '/workspace',
          query: { rootSubjectKind: 'agent_org', definitionId, mode: 'configuration' },
        })
      }
      return
    }

    if (command.action === 'open') {
      if (run.isActive) orgContexts.connect(run.rootRunId)
      await router.push({
        path: '/workspace',
        query: {
          rootSubjectKind: 'agent_org',
          definitionId,
          orgRunId: run.rootRunId,
          mode: run.isActive ? 'active' : 'history',
        },
      })
      return
    }

    const memberAddress = command.memberAddress?.trim()
    if (!memberAddress) throw new Error('AgentOrg member selection requires an exact address.')
    const activeRunId = run.isActive ? run.rootRunId : await orgRunStore.restore(run.rootRunId)
    orgContexts.select(activeRunId, memberAddress)
    orgContexts.connect(activeRunId)
    await historyStore.refreshTreeQuietly()
    await router.push({
      path: '/workspace',
      query: { rootSubjectKind: 'agent_org', definitionId, orgRunId: activeRunId, mode: 'active' },
    })
  }

  return { execute }
}
