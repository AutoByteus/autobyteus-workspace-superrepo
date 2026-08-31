# AgentOrg Behavioral And Persistence Contract

## Contract Status

- Contract ID: `AORG-CONTRACT-001`
- Requirements package: `AORG-FLAT-TEAM-001`
- Requirements revision: `RER-004`
- Status: `Ready for Approval`
- Owner/date: Requirements Engineer / 2026-08-31
- Purpose: Define supported composition, entry, addressing, handoff, lifecycle, task, and durable-state cases before Architecture Design.

This is a normative behavior and persistence supplement. It does not assign target modules, classes, file names, schema mechanics, or rollout architecture. Illustrative field names express required semantics only.

## Governing Model

```text
AgentOrg                                  structural root; no coordinator
├── independent Agent                    /agent
├── flat Team                            /team  -> Team coordinator ingress
│   ├── Agent                            /team/agent
│   └── Agent                            /team/agent
└── flat Team                            /team
    └── Agent                            /team/agent
```

1. `AgentOrg` is the only persistent multi-Team composition root.
2. AgentOrg may contain direct independent Agents and direct flat Teams; it cannot contain AgentOrg.
3. A flat Team contains Agents only and has exactly one direct Agent coordinator.
4. AgentOrg has no coordinator. A caller selects an exact mounted Agent or Team when beginning or focusing interaction.
5. One AgentOrg run owns one collaboration/address/lifecycle scope.
6. Containment expresses membership; explicit handoff rules express authorized workflow.
7. Standalone flat Teams remain reusable and directly launchable.
8. A task Team spawned by an Org member exists under that AgentOrg's execution aggregate, anchored to the exact delegating host scope; it is not a configured Org/Team member. A standalone Team owns tasks delegated from its own run.

## Contract Cases

### Definition And Composition

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-001 | Define AgentOrg with independent Agents only | Valid when names and refs are unique and resolvable | Org is not represented as a recursive Team. |
| ORG-CASE-002 | Define AgentOrg with flat Teams only | Valid; every Team independently satisfies its coordinator invariant | No Team needs a synthetic parent Team. |
| ORG-CASE-003 | Define AgentOrg with both direct member kinds | Valid; all placements share one Org scope | Members are not unrelated roots joined implicitly. |
| ORG-CASE-004 | Define a flat Team | Valid only with Agent members and exactly one direct Agent coordinator | Team/Org members are rejected. |
| ORG-CASE-005 | Add AgentOrg below AgentOrg or Team | Reject before partial persistence/launch and identify the placement | No recursive Org composition. |
| ORG-CASE-006 | Add Team below Team | Reject before partial persistence/launch and identify the placement | No silent flattening, remounting, or compatibility fallback. |
| ORG-CASE-007 | Launch standalone flat Team | Preserve coordinator-led Team behavior and supported lifecycle/task behavior | Org membership is not mandatory. |

### Entry And User Targeting

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-008 | Define or launch AgentOrg | No Org coordinator is required or accepted as Org semantics | A CEO/lead may be an independent Agent but is not a runtime coordinator by virtue of title. |
| ORG-CASE-009 | Caller selects independent Agent | Initial/focused interaction targets that exact Agent execution | No first-member or name fallback. |
| ORG-CASE-010 | Caller selects Team | Interaction targets the selected Team through its direct Agent coordinator | AgentOrg does not invent a second coordinator. |
| ORG-CASE-011 | No valid selection is supplied for an action that requires a recipient | Reject the action and require an exact mounted target | Do not target the structural root or guess a default. |

### Addressing

| Case ID | Address | Required Subject / Outcome |
| --- | --- | --- |
| ORG-CASE-012 | `/independent_agent` | Exact direct Org Agent placement. |
| ORG-CASE-013 | `/team` | Exact direct flat-Team placement; ordinary delivery uses Team coordinator ingress. |
| ORG-CASE-014 | `/team/agent` | Exact Agent placement inside the Team. |
| ORG-CASE-015 | `/` | Structural Org root; not a collaboration recipient. |
| ORG-CASE-016 | `/team/subteam` where the second segment denotes a Team | Reject unsupported configured composition. |
| ORG-CASE-017 | `/team/agent/deeper` | Reject persistent placement deeper than two member segments. |
| ORG-CASE-018 | Bare/relative/parent-traversal/backslash/unknown/case-colliding address | Fail closed without coordinator or name fallback. |

Task/run identifiers may add transient execution identity, but they do not create a new persistent Team-within-Team placement.

### Handoffs

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-019 | Team author defines Agent-to-Agent handoff | Preserve as Team-local; mounting may rebase it once beneath `/team` | Team-local scope cannot address Org peers. |
| ORG-CASE-020 | Org author defines independent Agent → Team handoff | Resolve in the Org and deliver through Team coordinator when applicable | Nesting is not needed to authorize the route. |
| ORG-CASE-021 | Org author defines Team Agent → peer Agent/Team/Team Agent | Resolve both exact endpoints in the same Org | No global name or unrelated-run discovery. |
| ORG-CASE-022 | Source is Team or Org | Reject; a handoff source is an Agent | No synthetic structural actor. |
| ORG-CASE-023 | Duplicate effective edge or source resolves to the same Agent as a Team destination | Reject deterministically | No duplicate/self delivery guidance. |
| ORG-CASE-024 | Agent calls `get_handoff_rules` | Return ordered outgoing rules for that exact mounted Agent | Framework does not evaluate natural-language conditions. |
| ORG-CASE-025 | Agent calls `send_message_to(recipient_address)` | Resolve only in the active Org or standalone Team scope | No implicit cross-process/unrelated-run routing. |

### Execution, Lifecycle, And Tasks

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-026 | Launch AgentOrg | Create one Org-owned scope with direct independent Agent executions and direct flat-Team executions | Root is not persisted/restored as AgentTeam. |
| ORG-CASE-027 | Activate Team in Org | Preserve Team instruction, coordinator, launch configuration, workspace, Agents, events, status, stop, and restore identity | No configured child Team lifecycle. |
| ORG-CASE-028 | AgentOrg member delegates a task to flat Team | A fresh task-scoped TeamRun starts through that Team's coordinator and is recorded under the same AgentOrg execution aggregate at the exact delegating host scope | It is not added to configured Org membership, is not a configured child Team, and receives no new permanent Org member address. |
| ORG-CASE-029 | Stop or restore AgentOrg | Apply lifecycle to the complete Org scope using stored exact identities and snapshot | Do not reinterpret via current mutable definitions. |
| ORG-CASE-030 | Launch/restore standalone flat Team | Preserve Team-owned lifecycle and supported tasks | No Org-only requirement for Team execution. |

For lifecycle and persistence, “under AgentOrg” means the AgentOrg run is the
top-level durable owner. The task execution remains attached to the exact host
scope that delegated it (the Org scope or a Team scope inside the Org), keeps a
fresh task TeamRun identity, and is reached through task lifecycle identity.
It does not alter the Org definition or the fixed configured address tree.

## Current `team_run_execution_tree.json` Assessment

### Existing Strict V2 Semantics

```text
rootTeam
  teamDefinitionId
  teamDefinitionName
  teamRunId
  coordinatorAddress        // required direct root Agent
  members[]                 // recursively Agent or configured Team
  taskExecutions[]          // may include task Team executions
```

Authority:

- `autobyteus-server-ts/src/agent-team-execution/domain/team-run-execution-tree.ts`
- `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-schema.ts`
- `autobyteus-server-ts/src/agent-team-execution/services/team-run-execution-tree-builder.ts`
- `autobyteus-team-stream-contracts/src/team-execution-view-dtos.ts`

The validator uses exact keys, requires `rootTeam`, requires a direct root Agent coordinator, and recursively accepts configured Team members. It therefore cannot truthfully represent native AgentOrg semantics unchanged.

### JSON Decision

`JSON-DEC-001 — A native AgentOrg requires a new durable semantic contract.`

- The existing V2 file may remain valid for standalone flat-Team runs and/or legacy reading if Architecture Design chooses that transition.
- A native AgentOrg run MUST NOT be written by merely renaming/aliasing V2 `rootTeam` while retaining its coordinator and recursion invariants.
- Architecture Design may choose a new schema version of the existing artifact, a distinct Org execution artifact, or another durable aggregate. That file/mechanism choice is not a requirements decision.

Required AgentOrg durable semantics, independent of exact names:

```text
Organization execution root
  Organization definition identity
  Organization run identity
  direct independent Agents
  direct flat Teams
  Organization-scoped effective handoffs
  selected interaction target, when the product persists focus/entry
  task executions created inside the Org, anchored to their delegating host scope

Flat Team execution
  Team definition identity
  Team run identity
  exact coordinator address
  Agent configured members only
  supported task-scoped executions
```

Required invariants:

1. The root subject is explicitly AgentOrg, not Team.
2. No Org coordinator field or fallback is semantically required.
3. Direct Org members discriminate independent Agent from flat Team.
4. Configured Team members are Agents only; configured Team recursion is invalid.
5. Effective handoff endpoints use fixed-depth canonical addresses.
6. If interaction focus/entry is stored, it is an exact member address rather than an Org coordinator.
7. Restore uses the immutable stored run snapshot, not current mutable definitions.
8. Configured Team nodes and task-scoped Team executions remain distinguishable.
9. Unsupported/ambiguous data fails before mutation or activation.

## Existing Data Contract

### Migration Preconditions / Preknown Conditions

1. All relevant definitions and live/historical execution data derive from the currently managed AgentTeam definitions.
2. Configured topology has at most one Team-membership edge: current root Team → optional direct child flat Team → Agents.
3. No relevant root Team → child Team → grandchild Team definition or run data exists.
4. The migration handles exactly two configured cohorts: Agent-only roots and one-level organization-like roots.
5. Task-scoped Team execution lineage is not configured Team nesting and remains attached to its exact runtime host during conversion.
6. Migration therefore uses fixed-depth mapping and does not implement recursive flattening or a deep legacy compatibility branch.
7. If an actual record unexpectedly violates the configured-depth precondition, migration stops before writing and reports the invariant violation; it does not guess a conversion.

| Existing Cohort | Required Outcome | Reason |
| --- | --- | --- |
| Root Team with direct Agents only | Preserve as standalone flat Team | Already satisfies target Team invariant. |
| Root Team with direct Agents and one level of child Teams whose members are Agents only | Convert to AgentOrg when coordinators, identities, addresses, and handoffs map unambiguously | Matches observed Software Development Department/Northstar shape. |
| One-level Org-like run with task-scoped Team history | Preserve task/result content when it maps to the same flat Team; fail closed on ambiguity | Task execution is distinct from configured nesting. |
| Handoff snapshot fitting `/agent`, `/team`, or `/team/agent` | Preserve exact effective endpoints | Workflow remains valid. |
| Derived catalogs/indexes/UI caches | Rebuild from converted durable authority when safe | Derived state is not canonical. |
| Agent memory, context files, messages, tasks, and run/history identity | Preserve whenever conversion is unambiguous | Simplification does not authorize content loss. |

Approved migration assumption: the relevant existing-data population is fully
covered by the first two rows. Investigation inspected 23 local root package
definitions and 41 readable stored TeamRun trees; all configured nesting is
zero or one child-Team level, and the user confirmed there is no deeply nested
data to support. Migration therefore does not need a deep legacy conversion or
compatibility branch. If deeper configured input is unexpectedly presented
later, normal flat-model validation rejects it before mutation or activation.

## Contract Non-Goals

- Recursive AgentOrg or configured AgentTeam definitions.
- Shared Agent runtime instances across placements.
- Automatic cross-run/cross-process logical routing.
- Live Org membership mutation or file watching.
- Framework evaluation of natural-language handoff conditions.
- A migration or compatibility implementation for deeply nested legacy configured topology.
- An AgentOrg label that preserves root-Team coordinator/recursion semantics.
- Removal of supported task-scoped Team delegation as a side effect.

## Contract Verification Matrix

| Verification ID | Cases | Verification Intent |
| --- | --- | --- |
| ORG-VERIFY-001 | ORG-CASE-001–007 | Definition/import/update and standalone-Team validation. |
| ORG-VERIFY-002 | ORG-CASE-008–018 | No-Org-coordinator entry selection and strict address resolution. |
| ORG-VERIFY-003 | ORG-CASE-019–025 | Team-local and Org-cross-member handoff compilation/retrieval/delivery. |
| ORG-VERIFY-004 | ORG-CASE-026–030 | Org/Team launch, task, stop, persistence, and restore. |
| ORG-VERIFY-005 | JSON-DEC-001 invariants 1–9 | Durable schema and transport projection agreement. |
| ORG-VERIFY-006 | Existing Data Contract cohorts | Exhaustive cohort classification, conversion/preservation, idempotency, and unexpected-depth invariant evidence. |

## Approval Basis

Approval of `RER-004` confirms this contract with the requirements document, specifically:

1. AgentOrg is the only persistent multi-Team composition root.
2. AgentOrg has no coordinator; a caller selects an exact Agent or Team target.
3. Teams are flat, Agent-only, coordinator-led, reusable, and independently launchable.
4. One Org scope owns fixed-depth addresses and cross-Team handoffs.
5. The current V2 Team execution JSON cannot be relabeled unchanged as AgentOrg; native Org persistence needs truthful Org-root semantics.
6. The migration population has no deep configured topology: flat roots remain Teams and one-level organization-like roots convert to AgentOrg; no deep legacy compatibility path is required.
7. Task-scoped Team execution remains distinct from configured nested membership.
