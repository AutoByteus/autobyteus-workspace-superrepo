import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const mocks = vi.hoisted(() => ({
  instances: [] as Array<Record<string, any>>,
  refreshAgentOrgHistory: vi.fn(async () => undefined),
}))

vi.mock('~/services/agentOrgExecution/agentOrgStreamingService', () => ({
  AgentOrgStreamingService: class {
    readonly connect = vi.fn()
    readonly disconnect = vi.fn()

    constructor(readonly options: Record<string, any>) {
      mocks.instances.push(this)
    }
  },
}))

vi.mock('~/stores/runHistoryStore', () => ({
  useRunHistoryStore: () => ({ refreshAgentOrgHistory: mocks.refreshAgentOrgHistory }),
}))

import { useAgentOrgContextsStore } from '~/stores/agentOrgContextsStore'

describe('agentOrgContextsStore accepted-message history invalidation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mocks.instances.length = 0
    vi.clearAllMocks()
  })

  it('injects one authoritative AgentOrg-family refresh callback into the stream owner', async () => {
    const store = useAgentOrgContextsStore()
    store.connect(' org-run ')

    expect(mocks.instances).toHaveLength(1)
    expect(mocks.instances[0]?.options.orgRunId).toBe('org-run')
    await mocks.instances[0]?.options.onAcceptedExternalUserMessage({
      orgRunId: 'org-run',
      agentRunId: 'agent-run',
      commandId: 'command-1',
    })

    expect(mocks.refreshAgentOrgHistory).toHaveBeenCalledTimes(1)
    store.disconnect('org-run')
  })
})
