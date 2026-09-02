# AgentOrg

## Scope

AgentOrg is the coordinator-free persistent composition root for multiple
independent Agents and reusable flat AgentTeams. The configured topology has one
fixed shape:

```text
AgentOrg
├── Agent
└── AgentTeam
    └── Agent
```

An AgentTeam contains Agents only. AgentOrg cannot contain another AgentOrg, and
configured Team-within-Team nesting is rejected. Task-scoped delegation to a
flat Team remains supported and is not configured membership.

## Definition Contract

A normal AgentOrg definition uses
`agent-orgs/<org-definition-id>/org-config.json` and exact
`schemaVersion: 1`:

```json
{
  "schemaVersion": 1,
  "members": [
    {
      "memberName": "software_engineering_team",
      "ref": "software-engineering-team",
      "refType": "agent_team",
      "refScope": "shared"
    }
  ],
  "handoffs": [],
  "avatarUrl": null,
  "defaultLaunchConfig": null
}
```

The adjacent `org.md` owns authored name, description, category, and
instructions.

- `refType` is exactly `agent` or `agent_team`.
- `refScope` is `shared`, `agent_org_owned`, or
  `application_owned` when valid for the source owner.
- An Org has no `coordinatorMemberName`, initial recipient, focus, or fallback
  field.
- Referenced Teams must be admitted flat Team V2 definitions.
- Invalid versions, unresolved references, deeper configured composition, and
  unavailable external dependencies fail target admission without mutation or
  legacy fallback.

## Addresses And Handoffs

Configured placement addresses are root-relative and exact:

- direct Org Agent: `/concierge`
- Team placement: `/software_engineering_team`
- Agent inside a mounted Team: `/software_engineering_team/code_reviewer`

AgentOrg handoff sources are Agent addresses. Destinations may be Agent or Team
addresses. A Team destination resolves to that mounted Team's direct coordinator
ingress. Handoff rules remain ordered natural-language guidance. The compiler
rejects invalid/self-resolving endpoints and duplicate effective pairs.

Runtime collaboration tools operate only inside the active root scope.
`get_handoff_rules` exposes the current Agent's eligible rules,
`send_message_to` targets an already existing execution, and
`delegate_task` creates a separately tracked task execution. Logical addresses
never discover unrelated roots.

## Launch Configuration And Admission

AgentOrg Run opens one configuration surface for the complete mounted scope.
The root configuration supplies required runtime/model/tool/skill/workspace
values, while sparse Team and Agent placement overrides add only local intent:

```text
direct Org Agent: exact Agent override -> Org root
mounted Team Agent: exact Agent override -> Team placement override -> Org root
```

Definition defaults continue to seed standalone Agent or Team launches; merely
referencing a definition does not make its default replace the active Org
configuration.

All exact root, Team, and Agent scopes must have resolved valid runtime/model
schema state before launch. Pending, invalid, or unavailable catalog/schema
state blocks Run with an exact diagnostic. A failed Agent runtime choice remains
visible and retryable but is not committed; returning to the actual current or
global-default choice abandons the failed operation, restores readiness, and
cannot leave a stale override in the launch payload.

Server-side projection and validation remain authoritative. The browser does not
allocate run IDs, infer missing settings, mutate referenced definitions, or
supply a recipient.

## Runtime And Focus

`AgentOrgRunService` plans and validates the fixed-depth definition,
`AgentOrgRunManager` owns root lifecycle, and `AgentOrgRun` owns the
coordinator-free root scope. Direct Agents use configured-Agent execution
handles. Each mounted Team uses the same flat Team execution machinery as a
standalone Team while keeping its definition identity, direct coordinator,
Team-local handoffs, and independent launchability.

Launching activates the full Org scope with no focused recipient. The user must
select an exact Agent or Team before a recipient-requiring interaction. Selecting
a Team focuses its direct coordinator; there is no first-member or Org
coordinator fallback.

The shared collaboration stream uses `root_subject_kind: "agent_org"` and
`root_run_id`. Commands carry one exact member execution identity. Supported
client commands are `SEND_MESSAGE`, `INTERRUPT_GENERATION`,
`APPROVE_TOOL`, and `DENY_TOOL`. Unknown roots, stale run IDs, incomplete
task lineage, and cross-root targets fail closed.

## Tasks, Status, And Lifecycle

- Direct Org Agents and mounted-Team Agents can message and delegate through
  canonical addresses.
- Task Agents and task Teams are transient execution projections with durable
  task records; they do not alter configured topology.
- Each Agent owns its exact five-state runtime status.
- A mounted Team row may show a presentation-only aggregate over its descendant
  Agent statuses with precedence
  `running > initializing > error > idle > offline`. The aggregate is not a
  persisted Team status or lifecycle authority.
- Root lifecycle, WebSocket connection, Agent status, task status, and command
  overlays are separate facts.
- Stop Org fences new work, drains or interrupts admitted work according to the
  root shutdown contract, terminates the entire materialized scope, and retains
  durable history. Restore uses stored run identities and provider bindings,
  not mutable current definitions.

## Persistence And History

AgentOrg has its own durable family:

```text
memory/agent_org_run_history_index.json
memory/agent_orgs/<org-run-id>/
  agent_org_run_execution_tree.json
  agent_org_task_delegation_records.json
  agent_org_communication_messages.json
  <rooted member memory...>
```

`AgentOrgRunExecutionTreeFileV1` has `schemaVersion: 1`,
`subjectKind: "agent_org"`, and a coordinator-free `rootOrg`. It stores
direct Agent placements, direct mounted-Team placements with their Agent
members, compiled handoffs, effective launch configurations, concrete local and
provider identities, application binding, timestamps, and task snapshots.

Native standalone Teams remain byte/path native Team V2 under
`memory/agent_teams/<team-run-id>/team_run_execution_tree.json`. Generic
history uses an explicit `agent_team | agent_org` root union; it does not force
both families into one persisted generic root. `listCollaborationRootHistory`
exposes the two root kinds while family-specific loaders retain strict package
validation.

## Migration And External Publication

Required startup migration
`20260901_agent_org_flat_team_families_v1` performs the approved fixed-depth
cutover for server-owned definitions and server memory run packages. It
preflights candidates before writes, uses atomic replacement or same-root
family rename, rereads and validates target families, updates the two history
indexes, and reports per-item failures for restart Retry. Current runtime has no unversioned decoder, dual write, or
request-time migration fallback.

Registered external definition repositories are read-only dependencies to this
ticket. Their owners must publish valid Team V2 and AgentOrg V1 definitions
separately. An incompatible external definition becomes individually
unavailable; it does not block server startup, compatible definitions, memory
migration, or history inspection.

## API Surface

Definition GraphQL operations:

- `agentOrgDefinitions`, `agentOrgDefinition`,
  `agentOrgEndpointCatalog`
- `createAgentOrgDefinition`, `updateAgentOrgDefinition`,
  `deleteAgentOrgDefinition`

Run GraphQL operations:

- `createAgentOrgRun`, `restoreAgentOrgRun`, `terminateAgentOrgRun`
- `getAgentOrgMemberRunProjection`
- `getAgentOrgMemberEventMonitorActiveTracePage`
- `getAgentOrgExecutionCheckpoint`
- `getAgentOrgMemberTokenUsageSummary`
- `listCollaborationRootHistory`

Reference-content REST routes are rooted below
`/agent-org-runs/:orgRunId/communication/messages/...` and
`/agent-org-runs/:orgRunId/task-delegations/...`.

## Key Source

- `src/agent-org-definition`
- `src/agent-org-execution`
- `src/agent-collaboration`
- `src/api/graphql/types/agent-org-definition.ts`
- `src/api/graphql/types/agent-org-run.ts`
- `src/api/graphql/types/collaboration-root-history.ts`
- `src/api/rest/agent-org-references.ts`
- `src/run-history/store/agent-org-*`
- `src/run-history/services/agent-org-*`
- `src/app-data-migrations/migrations/agent-org-flat-team-families-v1`
- `@autobyteus/collaboration-stream-contracts`
