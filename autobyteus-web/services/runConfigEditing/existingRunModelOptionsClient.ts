import { getApolloClient } from '~/utils/apolloClient'
import { AgentRunModelOptions, TeamRunModelOptions } from '~/graphql/queries/runModelOptionsQueries'
import type { ExistingRunModelConfigDraft, ExistingRunModelOptions, ExistingRunModelOptionsState } from '~/types/agent/ExistingRunModelConfigDraft'
export async function loadExistingRunModelOptions(draft: ExistingRunModelConfigDraft): Promise<Record<string, ExistingRunModelOptionsState>> {
  const { data, errors } = await getApolloClient().query<{
    agentRunModelOptions?: ExistingRunModelOptions
    teamRunModelOptions?: (ExistingRunModelOptions & { scopeAddress: string })[]
  }>({ query: draft.kind === 'agent' ? AgentRunModelOptions : TeamRunModelOptions,
    variables: draft.kind === 'agent' ? { agentRunId: draft.runId } : { teamRunId: draft.teamRunId }, fetchPolicy: 'network-only' })
  if (errors?.length || !data) throw new Error('Model options unavailable.')
  const rows = draft.kind === 'agent' && data.agentRunModelOptions
    ? [{ ...data.agentRunModelOptions, scopeAddress: '/' }] : data.teamRunModelOptions
  if (!rows || rows.some((row) => typeof row.currentModelIdentifier !== 'string' || !Array.isArray(row.replacements))) throw new Error('Model options unavailable.')
  return Object.fromEntries(rows.map(({ scopeAddress, ...options }) => [scopeAddress, { status: 'ready', options }]))
}
