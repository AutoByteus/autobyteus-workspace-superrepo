import { describe, expect, it } from 'vitest'
import { CollaborationStreamServerMessageSchema } from '@autobyteus/collaboration-stream-contracts'
import {
  createRootExecutionViewState,
  reduceRootExecutionServerMessage,
  resolveAgentOrgFocus,
  selectRootExecutionAddress,
} from '../rootExecutionViewState'

const snapshot = (base = 4) => CollaborationStreamServerMessageSchema.parse({
  type: 'ROOT_EXECUTION_VIEW_SNAPSHOT',
  payload: {
    root_subject_kind: 'agent_org', root_run_id: 'org-run', schema_version: 1,
    root_org: {
      base_change_sequence: base, is_active: true,
      execution_tree: {
        schemaVersion: 1, subjectKind: 'agent_org', createdAt: '2026-09-01T00:00:00.000Z', archivedAt: null,
        applicationBinding: null, handoffs: [],
        rootOrg: {
          address: '/', orgDefinitionId: 'org-def', orgDefinitionName: 'Org', orgRunId: 'org-run',
          defaultLaunchConfiguration: {}, taskExecutions: [],
          members: [
            { address: '/direct', agentRunId: 'agent-direct' },
            {
              address: '/team', teamRunId: 'team-run', coordinatorAddress: '/team/coordinator',
              members: [
                { address: '/team/coordinator', agentRunId: 'agent-coordinator' },
                { address: '/team/member', agentRunId: 'agent-member' },
              ],
            },
          ],
        },
      },
      task_records: { schemaVersion: 1, subjectKind: 'agent_org', orgRunId: 'org-run', records: [] },
      communication_messages: { schemaVersion: 1, subjectKind: 'agent_org', orgRunId: 'org-run', messages: [] },
    },
  },
})

describe('root execution view state', () => {
  it('starts an Org snapshot unfocused and accepts only contiguous sequenced events', () => {
    const initial = createRootExecutionViewState({ rootSubjectKind: 'agent_org', rootRunId: 'org-run' })
    const hydrated = reduceRootExecutionServerMessage(initial, snapshot())
    expect(hydrated.selectedAddress).toBeNull()
    expect(hydrated.nextChangeSequence).toBe(5)
    const next = reduceRootExecutionServerMessage(hydrated, CollaborationStreamServerMessageSchema.parse({
      type: 'ROOT_EXECUTION_EVENT',
      payload: { root_subject_kind: 'agent_org', root_run_id: 'org-run', change_sequence: 5, event: { kind: 'lifecycle' } },
    }))
    expect(next.nextChangeSequence).toBe(6)
    expect(() => reduceRootExecutionServerMessage(next, CollaborationStreamServerMessageSchema.parse({
      type: 'ROOT_EXECUTION_EVENT',
      payload: { root_subject_kind: 'agent_org', root_run_id: 'org-run', change_sequence: 7, event: {} },
    }))).toThrow(/expected 6, received 7/)
  })

  it('rejects every wrong root branch or root ID', () => {
    const state = createRootExecutionViewState({ rootSubjectKind: 'agent_org', rootRunId: 'org-run' })
    expect(() => reduceRootExecutionServerMessage(state, CollaborationStreamServerMessageSchema.parse({
      type: 'ROOT_LIFECYCLE',
      payload: { root_subject_kind: 'agent_team', root_run_id: 'org-run', is_active: true },
    }))).toThrow(/correlation mismatch/)
    expect(() => reduceRootExecutionServerMessage(state, CollaborationStreamServerMessageSchema.parse({
      type: 'CONNECTED',
      payload: { root_subject_kind: 'agent_org', root_run_id: 'other', session_id: 'session' },
    }))).toThrow(/correlation mismatch/)
  })

  it('maps Team focus to its exact coordinator and never falls back', () => {
    const hydrated = reduceRootExecutionServerMessage(
      createRootExecutionViewState({ rootSubjectKind: 'agent_org', rootRunId: 'org-run' }),
      snapshot(),
    )
    expect(resolveAgentOrgFocus(hydrated.view, '/direct')).toMatchObject({ agentRunId: 'agent-direct', enteredThroughTeam: false })
    expect(resolveAgentOrgFocus(hydrated.view, '/team')).toMatchObject({ agentAddress: '/team/coordinator', agentRunId: 'agent-coordinator', enteredThroughTeam: true })
    expect(resolveAgentOrgFocus(hydrated.view, '/team/member')).toMatchObject({ agentRunId: 'agent-member', enteredThroughTeam: false })
    expect(selectRootExecutionAddress(hydrated, '/missing').selectedAddress).toBeNull()
  })
})
