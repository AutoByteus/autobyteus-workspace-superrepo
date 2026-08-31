# AgentOrg And AgentTeam Structure / Persistence Contract

## Contract Status

- Contract ID: `AORG-CONTRACT-001`
- Requirements package: `AORG-FLAT-TEAM-001`
- Requirements revision: `RER-009`
- Status: `Approved`
- Approval reference: User confirmation on 2026-08-31 following review of `RER-008`; recorded in `RER-009`.
- Owner/date: Requirements Engineer / 2026-08-31
- Purpose: Provide one normative configured-structure and on-disk execution-tree contract that later Architecture Design must preserve.

This contract intentionally reuses the generic current TeamRun V2 tree. The
target is a semantic narrowing and minimal root generalization, not a new
execution topology. Target modules, physical storage directories, rollout
mechanics, and implementation sequencing remain Architecture Design-owned.

## Governing Configured Model

```text
AgentOrg                                  no coordinator
├── independent Agent                    /agent
├── AgentTeam                            /team  -> Team coordinator ingress
│   ├── Agent                            /team/agent
│   └── Agent                            /team/agent
└── AgentTeam                            /team
    └── Agent                            /team/agent
```

```text
AgentOrgDefinition
  coordinator: absent
  members: (AgentMemberRef | AgentTeamMemberRef)[]
  handoffs: AgentSource -> AgentOrTeamDestination

AgentTeamDefinition
  coordinator: exact direct Agent member
  members: AgentMemberRef[]
  handoffs: AgentSource -> AgentOrTeamDestination within Team scope
```

1. `AgentOrg` is the only persistent multi-Team composition root.
2. AgentOrg may contain direct independent Agents and direct AgentTeams.
3. AgentOrg cannot contain AgentOrg and has no coordinator.
4. AgentTeam contains Agents only and has exactly one direct Agent coordinator.
5. `flat` is an AgentTeam invariant, not a subtype or type/file-name prefix.
6. One AgentOrg run owns one address, handoff, lifecycle, and persistence scope.
7. Standalone AgentTeams remain directly launchable and reusable in an AgentOrg.
8. Task Teams are runtime task executions beneath their exact host scope; they do not mutate configured membership.
9. AgentTeam supports progressive composition: the same definition may be tested standalone and later referenced directly by AgentOrg without copying or specialization.

## Behavioral Contract Cases

### Definition And Composition

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-001 | Define AgentOrg with independent Agents only | Valid with unique, resolvable members | Org is not represented as AgentTeam. |
| ORG-CASE-002 | Define AgentOrg with AgentTeams only | Valid; every Team independently satisfies its coordinator invariant | No synthetic parent Team. |
| ORG-CASE-003 | Define AgentOrg with both direct member kinds | Valid; all placements share one Org scope | No implicit joining of unrelated root runs. |
| ORG-CASE-004 | Define AgentTeam | Valid only with Agent members and exactly one direct Agent coordinator | Team/Org members are rejected. |
| ORG-CASE-005 | Add AgentOrg below AgentOrg or Team | Reject before partial persistence/launch | No recursive Org composition. |
| ORG-CASE-006 | Add AgentTeam below AgentTeam | Reject before partial persistence/launch | No silent flattening or compatibility fallback. |
| ORG-CASE-007 | Launch standalone AgentTeam | Preserve coordinator-led Team lifecycle and task behavior | Org membership is not mandatory. |

### Entry And User Targeting

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-008 | Define or launch AgentOrg | No Org coordinator is required or persisted | Leadership role/title does not create runtime coordinator semantics. |
| ORG-CASE-009 | Caller selects independent Agent | Target that exact Agent execution | No first-member or name fallback. |
| ORG-CASE-010 | Caller selects AgentTeam | Route through that Team's direct coordinator | Org does not invent a second coordinator. |
| ORG-CASE-011 | Recipient-requiring action has no valid selection | Reject and require an exact mounted target | Do not target `/` or guess. |

### Addressing

| Case ID | Address | Required Subject / Outcome |
| --- | --- | --- |
| ORG-CASE-012 | `/independent_agent` | Exact direct Org Agent placement. |
| ORG-CASE-013 | `/team` | Exact direct Team placement; delivery uses Team coordinator ingress. |
| ORG-CASE-014 | `/team/agent` | Exact Agent placement inside Team. |
| ORG-CASE-015 | `/` | Structural root; not a collaboration recipient. |
| ORG-CASE-016 | `/team/subteam` where second segment is Team | Reject configured Team-in-Team composition. |
| ORG-CASE-017 | `/team/agent/deeper` | Reject configured placement deeper than target model. |
| ORG-CASE-018 | Bare/relative/parent-traversal/backslash/unknown/case-colliding address | Fail closed without fallback. |

### Handoffs

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-019 | Team author defines Agent-to-Agent handoff | Preserve as Team-local and rebase once when mounted | Team-local scope cannot independently address Org peers. |
| ORG-CASE-020 | Org author defines independent Agent → Team handoff | Resolve in Org and deliver through Team coordinator | Nesting is not needed to authorize route. |
| ORG-CASE-021 | Org author defines Team Agent → peer Agent/Team/Team Agent | Resolve exact endpoints in same Org | No global/unrelated-run lookup. |
| ORG-CASE-022 | Handoff source is Team or Org | Reject; source must be Agent | No synthetic structural actor. |
| ORG-CASE-023 | Duplicate effective edge or self-resolving Team target | Reject deterministically | No duplicate/self delivery guidance. |
| ORG-CASE-024 | Agent calls `get_handoff_rules` | Return ordered outgoing rules for exact mounted Agent | Framework does not evaluate rule prose. |
| ORG-CASE-025 | Agent calls `send_message_to(recipient_address)` | Resolve only in active Org or standalone Team scope | No implicit cross-run routing. |

### Execution, Lifecycle, And Tasks

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-026 | Launch AgentOrg | Create one Org-owned execution-tree root with direct Agent/Team members | Root has no coordinator. |
| ORG-CASE-027 | Activate Team in Org | Preserve Team definition/run identity, coordinator, launch config, Agents, tasks, events, stop, and restore | No configured child Team below it. |
| ORG-CASE-028 | Org member delegates task to Team | Fresh task TeamRun is stored beneath exact delegating host scope and starts through Team coordinator | It is not configured membership or a permanent address. |
| ORG-CASE-029 | Stop/restore AgentOrg | Apply lifecycle to complete Org scope using stored identities/snapshot | Do not reinterpret from mutable definitions. |
| ORG-CASE-030 | Launch/restore standalone Team | Preserve Team-owned lifecycle/tasks | No Org-only Team requirement. |

### Standalone-To-Org Reuse

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-031 | User adds a previously tested standalone AgentTeam definition to AgentOrg and authors Org-scoped handoffs | Org references the same Team definition identity and preserves its coordinator, Agent members, Team-local handoffs, independent launchability, and prior run history | No copy, fork, Org-specific Team subtype, or Team-within-Team placement is required. |

## Current TeamRun V2 Assessment

### Current On-Disk Shape

```text
TeamRunExecutionTreeFileV2
  schemaVersion, timestamps, applicationBinding, handoffs
  rootTeam
    Team definition/name/run identity
    coordinatorAddress
    defaultLaunchConfiguration
    members[]                 // Agent or Team, recursively
    taskExecutions[]          // recursive task lineage
```

Authority:

- `autobyteus-server-ts/src/agent-team-execution/domain/team-run-execution-tree.ts`
- `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-schema.ts`
- `autobyteus-server-ts/src/agent-team-execution/services/team-run-execution-tree-builder.ts`
- `autobyteus-team-stream-contracts/src/team-execution-view-dtos.ts`

### Reuse Finding

The V2 tree was designed generically and already contains the target topology:

- a root execution aggregate;
- direct Agent or Team placements;
- canonical addresses;
- Team-local coordinators and launch defaults;
- root-scoped handoffs;
- task executions attached to their owning root/Team/task scope; and
- recursive task lineage independent of configured topology depth.

Therefore native AgentOrg does **not** require a second execution-tree topology,
a parallel AgentOrg/Team schema family, explicit `flat` node types, or rebuilding
member/task records. Only the root subject contract and configured-depth
validation need to change.

## Normative Minimal-Delta On-Disk Contract

### One Generic Record

The target logical record is one versioned `RunExecutionTreeFileV3`. A generic
physical file name such as `run_execution_tree.json` is appropriate because the
root may be AgentOrg or AgentTeam; Architecture Design owns the final physical
name and directory placement.

```text
RunExecutionTreeFileV3
  schemaVersion: 3
  createdAt
  archivedAt
  applicationBinding
  handoffs
  root: AgentOrgRootExecution | AgentTeamRootExecution
```

The envelope, configured Agent record, configured child-Team record, launch
configuration, handoff record, task Agent record, task Team record, timestamps,
IDs, and addresses preserve the current V2 fields and meaning. No new `kind`
discriminator is required on existing configured or task member nodes; the
current AgentRun-ID-versus-TeamRun-ID union remains sufficient.

### AgentOrg Root Variant

```json
{
  "schemaVersion": 3,
  "createdAt": "2026-08-31T00:00:00.000Z",
  "archivedAt": null,
  "applicationBinding": null,
  "handoffs": [],
  "root": {
    "subjectKind": "agent_org",
    "address": "/",
    "definitionId": "software-development-department",
    "definitionName": "Software Development Department",
    "runId": "software-development-department-run-id",
    "defaultLaunchConfiguration": {
      "runtimeKind": "autobyteus",
      "llmModelIdentifier": "default",
      "llmConfig": null,
      "autoExecuteTools": true,
      "skillAccessMode": "PRELOADED_ONLY",
      "workspaceRootPath": null
    },
    "members": [
      {
        "address": "/requirements_engineer",
        "agentDefinitionId": "requirements-engineer",
        "role": null,
        "description": null,
        "agentRunId": "requirements-engineer-run-id",
        "platformAgentRunId": null,
        "launchConfiguration": {
          "runtimeKind": "autobyteus",
          "llmModelIdentifier": "default",
          "llmConfig": null,
          "autoExecuteTools": true,
          "skillAccessMode": "PRELOADED_ONLY",
          "workspaceRootPath": null
        }
      },
      {
        "address": "/software_engineering_team",
        "teamDefinitionId": "software-engineering-team",
        "role": null,
        "description": null,
        "teamRunId": "software-engineering-team-run-id",
        "coordinatorAddress": "/software_engineering_team/architecture_designer",
        "defaultLaunchConfiguration": {
          "runtimeKind": "autobyteus",
          "llmModelIdentifier": "default",
          "llmConfig": null,
          "autoExecuteTools": true,
          "skillAccessMode": "PRELOADED_ONLY",
          "workspaceRootPath": null
        },
        "members": [
          {
            "address": "/software_engineering_team/architecture_designer",
            "agentDefinitionId": "architecture-designer",
            "role": null,
            "description": null,
            "agentRunId": "architecture-designer-run-id",
            "platformAgentRunId": null,
            "launchConfiguration": {
              "runtimeKind": "autobyteus",
              "llmModelIdentifier": "default",
              "llmConfig": null,
              "autoExecuteTools": true,
              "skillAccessMode": "PRELOADED_ONLY",
              "workspaceRootPath": null
            }
          }
        ],
        "taskExecutions": []
      }
    ],
    "taskExecutions": []
  }
}
```

AgentOrg root invariants:

- `subjectKind` is `agent_org`.
- `root` has no `coordinatorAddress`.
- Direct `members` may be current-format configured Agent or Team records.
- Every direct Team retains its current `coordinatorAddress` and has configured Agent members only.
- `defaultLaunchConfiguration` remains a common launch fallback; it is not coordinator semantics.

### Standalone AgentTeam Root Variant

The same envelope and member/task records are used. Only the root variant differs:

```json
{
  "subjectKind": "agent_team",
  "address": "/",
  "definitionId": "software-engineering-team",
  "definitionName": "Software Engineering Team",
  "runId": "software-engineering-team-run-id",
  "coordinatorAddress": "/architecture_designer",
  "defaultLaunchConfiguration": {
    "runtimeKind": "autobyteus",
    "llmModelIdentifier": "default",
    "llmConfig": null,
    "autoExecuteTools": true,
    "skillAccessMode": "PRELOADED_ONLY",
    "workspaceRootPath": null
  },
  "members": [],
  "taskExecutions": []
}
```

AgentTeam root invariants:

- `subjectKind` is `agent_team`.
- `coordinatorAddress` is required and resolves to one direct configured Agent.
- Configured `members` contains Agents only.
- No `FlatTeam` type, field, discriminator, or file name exists.

### Reused Child And Task Records

| Current V2 Record | V3 Outcome |
| --- | --- |
| Configured Agent execution node | Reuse unchanged. |
| Configured Team execution node | Reuse field shape; constrain configured `members` to Agents only. |
| Task Agent execution | Reuse unchanged. |
| Task Team execution and task-Team members | Reuse unchanged; its nested `taskExecutions` remain task lineage. |
| Handoff snapshot | Reuse unchanged. |
| Application binding, timestamps, launch configuration | Reuse unchanged. |

A task execution remains stored in the `taskExecutions` array of its exact host:
the AgentOrg root, an AgentTeam root/member, or another task Team. Its current
`address` continues to identify the configured target placement; its fresh
AgentRun/TeamRun ID identifies the concrete task execution. It does not add a
configured member or permanent address.

## Migration Preconditions / Preknown Conditions

1. All relevant definitions and live/historical execution data derive from the currently managed AgentTeam definitions.
2. Configured topology has at most one Team-membership edge: current root Team → optional direct child Team → Agents.
3. No relevant root Team → child Team → grandchild Team data exists.
4. Existing data has exactly two configured cohorts: Agent-only roots and one-level organization-like roots.
5. Task-scoped Team lineage is not configured Team nesting and remains anchored to its exact runtime host.
6. Migration does not need recursive flattening or a deep legacy compatibility branch.
7. An unexpected precondition violation stops before writes and reports the invariant; it does not guess a conversion.

Observed evidence: 23 root package definitions and 41 readable stored TeamRun
trees; 27 stored roots are Agent-only and 14 have exactly one direct Team level;
none is deeper. The user confirmed this is the relevant migration population.

## Minimal V2 → V3 Mapping

| Current V2 Input | Agent-Only Root | One-Level Organization-Like Root |
| --- | --- | --- |
| Physical file name | Rename/move to generic selected V3 file name if required | Same |
| `schemaVersion: 2` | Set to `3` | Set to `3` |
| Envelope fields | Preserve unchanged | Preserve unchanged |
| `rootTeam` | Rename/project to `root` | Rename/project to `root` |
| Root `teamDefinitionId/name/teamRunId` | Rename/project to generic `definitionId/name/runId`; preserve values | Same |
| Root kind | Set `subjectKind: agent_team` | Set `subjectKind: agent_org` |
| Root `coordinatorAddress` | Preserve | Remove; AgentOrg has no coordinator. The referenced Agent member remains unchanged. |
| Root default launch configuration | Preserve | Preserve as Org-wide launch fallback. |
| Direct Agent records | Preserve byte-equivalent fields | Preserve byte-equivalent fields as independent Org Agents. |
| Direct Team records | Not present | Preserve byte-equivalent fields as direct Org Teams; enforce Agent-only members. |
| Handoffs | Preserve unchanged | Preserve unchanged. |
| Root/Team/task-owned task executions | Preserve unchanged and at same host | Preserve unchanged and at same host. |

This is a deterministic key/subject migration, not a topology transformation.
It MUST be idempotent and MUST commit canonical definition/execution records
before rebuilding derived indexes or projections.

## Contract Verification Matrix

| Verification ID | Scope | Verification Intent |
| --- | --- | --- |
| ORG-VERIFY-001 | ORG-CASE-001–007, ORG-CASE-031 | Definition/import/update, standalone-Team validation, and progressive Team-to-Org reuse. |
| ORG-VERIFY-002 | ORG-CASE-008–018 | Coordinator-free Org targeting and strict addresses. |
| ORG-VERIFY-003 | ORG-CASE-019–025 | Team-local and Org-wide handoffs using reused address records. |
| ORG-VERIFY-004 | ORG-CASE-026–030 | Org/Team lifecycle and host-anchored task execution. |
| ORG-VERIFY-005 | V3 root variants and reused-node table | Strict schema, root conditional fields, depth constraints, restore. |
| ORG-VERIFY-006 | Preconditions and V2 mapping | Exhaustive cohort classification, idempotent minimal migration, no topology rebuild. |

## Contract Non-Goals

- A separate AgentOrg execution-tree topology.
- Parallel AgentOrg V1 and AgentTeam V3 schema families.
- `FlatTeam` domain/schema/file names.
- Recursive configured AgentTeam or AgentOrg definitions.
- A root AgentOrg coordinator or default coordinator fallback.
- Shared Agent runtime instances across configured placements.
- Automatic cross-run logical routing.
- Live topology mutation/file watching.
- Recursive legacy topology migration.
- Removing supported task-scoped Team delegation.

## Approval Basis

The 2026-08-31 approval recorded in `RER-009` confirms:

1. AgentOrg is the only persistent multi-Team composition root and has no coordinator.
2. AgentTeam is Agent-only by invariant and retains its direct Agent coordinator.
3. The current generic V2 execution topology is reused rather than replaced.
4. One generic V3 execution-tree record uses an AgentOrg-or-AgentTeam root variant and current child/task record shapes.
5. AgentOrg root omits `coordinatorAddress`; direct Team nodes retain it.
6. Migration is a fixed-depth subject/key/file-name projection, not tree reconstruction.
7. Task Teams remain under their exact runtime host and do not affect configured depth.
8. A standalone-tested AgentTeam is directly reusable by reference inside AgentOrg; Org-scoped handoffs are sufficient to connect it without copying or changing the Team.
