import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  CollaborationStreamServerMessageSchema,
  type CollaborationStreamClientMessage,
} from '@autobyteus/collaboration-stream-contracts'
import {
  createRootExecutionViewState,
  reduceRootExecutionServerMessage,
  resolveAgentOrgFocus,
  selectRootExecutionAddress,
  type RootExecutionSubjectKind,
  type RootExecutionViewState,
} from '~/services/rootExecution/rootExecutionViewState'
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore'
import { getActiveRemoteAccessCredential } from '~/utils/remoteAccess/authorizedTransport'
import { buildAuthenticatedWebSocketUrl } from '~/utils/remoteAccess/websocketAuth'

const sockets = new Map<string, WebSocket>()
const key = (kind: RootExecutionSubjectKind, runId: string): string => `${kind}:${runId}`

export const useRootExecutionViewStore = defineStore('rootExecutionView', () => {
  const states = ref<Record<string, RootExecutionViewState>>({})

  const requireState = (kind: RootExecutionSubjectKind, runId: string): RootExecutionViewState => {
    const stateKey = key(kind, runId)
    const existing = states.value[stateKey]
    if (existing) return existing
    const created = createRootExecutionViewState({ rootSubjectKind: kind, rootRunId: runId })
    states.value = { ...states.value, [stateKey]: created }
    return created
  }

  const replace = (state: RootExecutionViewState): void => {
    states.value = { ...states.value, [key(state.rootSubjectKind, state.rootRunId)]: state }
  }

  const connectAgentOrg = (orgRunId: string): void => {
    const stateKey = key('agent_org', orgRunId)
    const current = sockets.get(stateKey)
    if (current?.readyState === WebSocket.OPEN || current?.readyState === WebSocket.CONNECTING) return
    requireState('agent_org', orgRunId)
    const endpoint = `${useWindowNodeContextStore().getBoundEndpoints().orgWs}/${encodeURIComponent(orgRunId)}`
    const socket = new WebSocket(buildAuthenticatedWebSocketUrl(endpoint, getActiveRemoteAccessCredential() ?? ''))
    sockets.set(stateKey, socket)
    socket.onmessage = (message) => {
      try {
        const parsed = CollaborationStreamServerMessageSchema.parse(JSON.parse(String(message.data)))
        replace(reduceRootExecutionServerMessage(requireState('agent_org', orgRunId), parsed))
      } catch (cause) {
        replace(Object.freeze({
          ...requireState('agent_org', orgRunId),
          error: cause instanceof Error ? cause.message : String(cause),
        }))
        socket.close(1002, 'Invalid root execution stream')
      }
    }
    socket.onerror = () => replace(Object.freeze({ ...requireState('agent_org', orgRunId), error: 'AgentOrg stream connection failed.' }))
    socket.onclose = () => { if (sockets.get(stateKey) === socket) sockets.delete(stateKey) }
  }

  const sendAgentOrgMessage = (input: {
    orgRunId: string
    targetAgentRunId: string
    content: string
    contextFilePaths?: string[]
    imageUrls?: string[]
  }): void => {
    const socket = sockets.get(key('agent_org', input.orgRunId))
    if (!socket || socket.readyState !== WebSocket.OPEN) throw new Error('AgentOrg stream is not ready.')
    const messageId = crypto.randomUUID()
    const message: CollaborationStreamClientMessage = {
      type: 'SEND_MESSAGE',
      payload: {
        root_subject_kind: 'agent_org', root_run_id: input.orgRunId,
        target_agent_run_id: input.targetAgentRunId, content: input.content,
        context_file_paths: input.contextFilePaths ?? [], image_urls: input.imageUrls ?? [],
        message_id: messageId, dedupe_key: `member_input:${input.orgRunId}:${input.targetAgentRunId}:${messageId}`,
      },
    }
    socket.send(JSON.stringify(message))
  }

  const selectAddress = (kind: RootExecutionSubjectKind, runId: string, address: string | null): void => {
    replace(selectRootExecutionAddress(requireState(kind, runId), address))
  }
  const disconnect = (kind: RootExecutionSubjectKind, runId: string): void => {
    const stateKey = key(kind, runId)
    sockets.get(stateKey)?.close()
    sockets.delete(stateKey)
  }

  const stateFor = computed(() => (kind: RootExecutionSubjectKind, runId: string) => states.value[key(kind, runId)] ?? null)
  const agentOrgFocus = computed(() => (orgRunId: string) => {
    const state = states.value[key('agent_org', orgRunId)]
    return state ? resolveAgentOrgFocus(state.view, state.selectedAddress) : null
  })
  return { states, stateFor, agentOrgFocus, connectAgentOrg, sendAgentOrgMessage, selectAddress, disconnect }
})
