# AgentOrg And AgentTeam Structure / Persistence Contract

## Contract Status

- Contract ID: `AORG-CONTRACT-001`
- Requirements package: `AORG-FLAT-TEAM-001`
- Requirements revision: `RER-015`
- Status: `Ready for Approval — Durable Contract Requirement Impact`
- Approval reference: Behavior through `RER-014` remains approved. During the `RER-014` → `AD-REV-002` impact round, the user explicitly corrected the persistence direction: do not replace the standalone AgentTeam run JSON; preserve native Team V2 and add a separate AgentOrg execution JSON with adjusted Org attributes. The exact Team V2 / AgentOrg V1 file, schema, generic projection, and migration boundary below requires explicit confirmation before it supersedes the previously approved generic V3 union.
- Owner/date: Requirements Engineer / 2026-08-31
- Purpose: Provide one normative configured-structure, launch/configuration/focus, handoff behavior/authoring, and on-disk execution-tree contract that Product Design and later Architecture Design must preserve after applicable approval.

This contract reuses the current TeamRun V2 child, handoff, launch, and task
records without changing the native standalone Team file family. AgentOrg is a
new root/file family over the same fixed-depth member/task topology. Target
modules/classes, internal abstractions, rollout mechanics, and implementation
sequencing remain Architecture Design-owned; the logical keys/versions and
canonical execution-tree paths below are contract inputs.

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
  handoffs: AgentSource -> AgentDestination within Team scope
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
10. AgentOrg activation and recipient focus are separate: `Run` opens Org configuration, launch activates the full Org without focus, and a later exact Agent/Team focus is required only for a recipient-requiring interaction.
11. AgentOrg configuration applies root choices across the scope, then direct Team placement and exact Agent placement overrides by increasing specificity; it does not mutate referenced definitions or alter Team coordinator ingress.
12. Standalone Team runs remain native Team V2 packages; AgentOrg runs use a separate AgentOrg V1 package/file. Shared record shapes do not imply a generic persisted root union.

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
| ORG-CASE-008 | Invoke `Run` for AgentOrg | Open one AgentOrg run-configuration journey; no Org coordinator or entry recipient is required | Do not open a separate pre-launch Agent/Team selector or infer leadership as runtime ingress. |
| ORG-CASE-009 | After launch, user focuses an independent Agent or an Agent inside a Team | Focus that exact mounted Agent execution | No first-member, name, or address-prefix fallback. |
| ORG-CASE-010 | After launch, user focuses an AgentTeam | Focus/deliver through that Team's exact direct coordinator | Org does not invent a second coordinator or broadcast to the Team. |
| ORG-CASE-011 | Recipient-requiring action has no valid post-launch focus | Reject and require an exact mounted Agent or Team selection from the active workspace | Launch/configuration/inspection remain valid without focus; do not target `/` or guess. |

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

### Handoff Information And Required Authoring Capabilities — Approved In RER-012

One user-visible **Handoff** is one ordered directional endpoint pair with:

```text
From: exact Agent placement
To: exact Agent placement or, for AgentOrg-owned handoffs, direct Team placement
When: one or more ordered natural-language conditions
```

The current logical record remains `{ from, to, rules[] }`; `When` is the
user-facing name for each `rules[]` string. The prose guides the source Agent
when it reviews `get_handoff_rules`. It is not an executable expression, event
subscription, scheduler, or authorization rule. Additional conditions for the
same endpoint pair belong in the same Handoff because duplicate effective
`(from,to)` pairs remain invalid.

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-032 | Inspect a Handoff | Explicit `From`, `To`, and every `When` condition are unambiguous; exact canonical endpoint identity is readily inspectable | Do not replace the information with a nickname, generic arrow, inaccessible address, or ambiguous rule count. Product Design owns the concrete presentation. |
| ORG-CASE-033 | Author a `When` condition | Require one or more non-empty trimmed natural-language strings and preserve their order | No expression builder, automatic evaluation, scheduling, or authorization meaning. |
| ORG-CASE-034 | Choose AgentOrg-owned `From` | Offer direct Org Agents and Agents mounted inside direct Teams | Team, Org, task execution, root, unrelated-run, and out-of-scope subjects are not sources. |
| ORG-CASE-035 | Choose AgentOrg-owned `To` | Offer direct Org Agents, Agents mounted inside direct Teams, and direct Team placements | Org root, task execution, deeper, unrelated-run, and out-of-scope subjects are not destinations. |
| ORG-CASE-036 | Select or inspect a Team destination | Communicate the Team name/address and `Via coordinator <Agent>` meaning, with that coordinator's canonical Agent address readily inspectable | Do not imply Team broadcast or an Org coordinator. Product Design owns the concrete presentation. |
| ORG-CASE-037 | Author Team-local Handoff | `From` and `To` choices are direct Agent members of that Team; edit only from the Team surface | Team root `/`, Org peers, mounted-parent paths, and Team/Org subjects are not Team-local choices. |
| ORG-CASE-038 | Add, edit, delete, or reorder | Provide functional `Add handoff`, Edit, Delete, and handoff-order controls; within one Handoff provide add/edit/delete/reorder for When conditions | Do not expose an inert `Add rule` action or conflate endpoint pairs with conditions. |
| ORG-CASE-039 | Author self-resolving or duplicate effective endpoints | Block save and identify the affected Handoff; add another When condition to an existing pair instead of duplicating it | No duplicate pair, direct self-target, or Team target whose coordinator resolves to the source. |
| ORG-CASE-040 | Remove/rename a member used by a Handoff | Identify every affected Handoff and require explicit resolution before save | Do not silently delete, retarget, rebase, or persist a stale address. |
| ORG-CASE-041 | Cancel or save Handoff edits | All edits remain in the definition draft; Cancel discards them; one complete validated definition save commits atomically and gives visible success/failure feedback while retaining a failed draft | No per-control partial persistence, loss of a failed draft, or mutation before complete validation. |
| ORG-CASE-042 | View Org-owned versus Team-local Handoffs | Org surface edits Org-owned Handoffs only; Team surface edits Team-local Handoffs only; any compiled/effective combined view labels its owner and is read-only | Org editing never mutates the referenced Team or becomes a second Team-local editing authority. |

### AgentOrg Configuration, Activation, And Focus — Approved In RER-013

Configuration answers how every mounted execution will run; it does not answer
who the user will communicate with. The supported effective-setting order is:

```text
direct Org Agent: Agent placement override -> Org root choices
Team Agent:       Agent placement override -> Team placement override -> Org root choices
```

The AgentOrg definition's launch defaults seed the Org-root choices. A mounted
Agent or Team definition's own default launch preferences do not independently
replace the Org choices merely because that definition is referenced; those
defaults still seed the definition's standalone launch journey.

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-043 | Invoke AgentOrg `Run` | Proceed directly to one AgentOrg configuration journey covering the complete mounted scope | No separate pre-configuration entry selector. Product Design owns the concrete interaction solution. |
| ORG-CASE-044 | Set or change an Org-root launch choice | Apply it to every mounted execution that has no more-specific valid placement override | Do not require repeating the same choice per Team/Agent. |
| ORG-CASE-045 | Override one direct Team placement | Apply the Team override to that Team and its Agents unless an exact Agent override exists | Do not mutate the referenced Team definition or affect peer/direct Org Agents. |
| ORG-CASE-046 | Override an exact mounted Agent | Apply that override only to the exact Agent placement, with highest specificity | Do not change its containing Team, sibling Agents, or reusable Agent definition. |
| ORG-CASE-047 | Reference a Team or Agent whose definition has standalone launch defaults | Preserve those definition defaults for standalone launch, but do not let them silently supersede the active Org-root/placement choices | Referencing a definition is not an implicit run override or definition mutation. |
| ORG-CASE-048 | Launch a completely valid Org configuration | Activate one full Org execution scope with every mounted execution configured and no initially focused recipient | Do not launch a single chosen entry, auto-focus a member, or change Team coordinator ingress. |

### Execution, Lifecycle, And Tasks

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-026 | Launch AgentOrg | Create and activate one Org-owned execution-tree root with all direct Agent/Team members and no initial focus | Root has no coordinator; activation does not require or infer a recipient. |
| ORG-CASE-027 | Activate Team in Org | Preserve Team definition/run identity, coordinator, launch config, Agents, tasks, events, stop, and restore | No configured child Team below it. |
| ORG-CASE-028 | Org member delegates task to Team | Fresh task TeamRun is stored beneath exact delegating host scope and starts through Team coordinator | It is not configured membership or a permanent address. |
| ORG-CASE-029 | Stop/restore AgentOrg | Apply lifecycle to complete Org scope using stored identities/snapshot | Do not reinterpret from mutable definitions. |
| ORG-CASE-030 | Launch/restore standalone Team | Preserve Team-owned lifecycle/tasks | No Org-only Team requirement. |

### Standalone-To-Org Reuse

| Case ID | Trigger / Input | Required Outcome | Rejected Or Preserved Alternative |
| --- | --- | --- | --- |
| ORG-CASE-031 | User adds a previously tested standalone AgentTeam definition to AgentOrg and authors Org-scoped handoffs | Org references the same Team definition identity and preserves its coordinator, Agent members, Team-local handoffs, independent launchability, and prior run history | No copy, fork, Org-specific Team subtype, or Team-within-Team placement is required. |

## Current TeamRun V2 Assessment

### Current Native Team Contract

The supported standalone Team execution authority is already strict and
versioned:

```text
$MEMORY_ROOT/agent_teams/<rootTeamRunId>/team_run_execution_tree.json

TeamRunExecutionTreeFileV2
  schemaVersion: 2
  createdAt
  archivedAt
  applicationBinding
  handoffs
  rootTeam
    address: "/"
    teamDefinitionId
    teamDefinitionName
    teamRunId
    coordinatorAddress
    defaultLaunchConfiguration
    members[]
    taskExecutions[]
```

Authority:

- `autobyteus-server-ts/src/agent-team-execution/domain/team-run-execution-tree.ts`
- `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-schema.ts`
- `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-path.ts`
- `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-store.ts`
- `autobyteus-server-ts/src/agent-memory/store/agent-memory-layout.ts`
- `autobyteus-team-stream-contracts/src/team-execution-view-dtos.ts`

The current file uses exact-key validation. `rootTeam` requires one direct Agent
coordinator. Configured Agent, configured Team, handoff, launch-configuration,
application-binding, timestamp, task Agent, task Team, and task-Team-member
records already contain the fields needed by the fixed-depth AgentOrg topology.

### Corrected Reuse Finding

The reusable asset is the **record topology**, not a mandate to replace the
native Team file family. The user's corrected boundary is:

1. a flat standalone AgentTeam continues to persist and restore as exact Team V2;
2. Team flatness is enforced by narrowing `rootTeam.members` to configured Agent records, not by changing Team JSON keys, version, file name, or package path;
3. AgentOrg gets a new AgentOrg V1 file/root family;
4. AgentOrg V1 reuses the current V2 envelope/member/handoff/launch/task field shapes where their meaning is common; and
5. generic readers expose an explicit root-kind union rather than forcing both files into one persisted generic root.

## Normative Durable File-Family Contract

### Family A — Native Standalone AgentTeam V2 (Preserved)

Canonical logical type and physical execution-tree location:

```text
TeamRunExecutionTreeFileV2
$MEMORY_ROOT/agent_teams/<rootTeamRunId>/team_run_execution_tree.json
```

The exact persisted envelope/root structure remains:

```json
{
  "schemaVersion": 2,
  "createdAt": "2026-08-31T00:00:00.000Z",
  "archivedAt": null,
  "applicationBinding": null,
  "handoffs": [],
  "rootTeam": {
    "address": "/",
    "teamDefinitionId": "software-engineering-team",
    "teamDefinitionName": "Software Engineering Team",
    "teamRunId": "software-engineering-team-run-id",
    "coordinatorAddress": "/architecture_designer",
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
        "address": "/architecture_designer",
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
}
```

Native Team V2 invariants after the model change:

- `schemaVersion` remains `2`; no Team V3 is created.
- The exact top-level keys and exact `rootTeam` keys remain unchanged.
- The file name remains `team_run_execution_tree.json`.
- The root package remains `$MEMORY_ROOT/agent_teams/<rootTeamRunId>/`.
- `rootTeam.coordinatorAddress` remains required and resolves to one direct configured Agent.
- `rootTeam.members` contains configured Agent records only. A configured Team or AgentOrg member is rejected before write/activation/restore.
- Existing flat Team V2 files already satisfying these invariants remain native and require no execution-tree rewrite, move, rename, or version bump.
- No `subjectKind`, generic `root`, `FlatTeam`, or other field is added to the Team V2 JSON.

### Family B — New AgentOrg V1

Canonical logical type and physical execution-tree location:

```text
AgentOrgRunExecutionTreeFileV1
$MEMORY_ROOT/agent_orgs/<orgRunId>/agent_org_run_execution_tree.json
```

The exact logical JSON contract is:

```json
{
  "schemaVersion": 1,
  "subjectKind": "agent_org",
  "createdAt": "2026-08-31T00:00:00.000Z",
  "archivedAt": null,
  "applicationBinding": null,
  "handoffs": [],
  "rootOrg": {
    "address": "/",
    "orgDefinitionId": "software-development-department",
    "orgDefinitionName": "Software Development Department",
    "orgRunId": "software-development-department-run-id",
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

AgentOrg V1 exact-key and semantic invariants:

- Top-level keys are exactly `schemaVersion`, `subjectKind`, `createdAt`, `archivedAt`, `applicationBinding`, `handoffs`, and `rootOrg`.
- `schemaVersion` is `1`; `subjectKind` is exactly `agent_org`.
- `rootOrg` keys are exactly `address`, `orgDefinitionId`, `orgDefinitionName`, `orgRunId`, `defaultLaunchConfiguration`, `members`, and `taskExecutions`.
- `rootOrg.address` is `/`; `rootOrg` has no `coordinatorAddress`, interaction target, or recipient-default field.
- `defaultLaunchConfiguration` persists the Org-root run choices required by the approved configuration hierarchy; it is not coordinator or focus state.
- Direct `members` are current-format configured Agent or configured Team records.
- Every direct configured Team retains its current `coordinatorAddress`, launch configuration, task executions, and configured Agent member records. Its configured `members` contains Agents only.
- Org activation persists no initial recipient/focus. Later workspace focus is interaction state and MUST NOT be inferred from a removed legacy root coordinator.
- Configured addresses are limited to `/agent`, `/team`, and `/team/agent`; configured Team below Team and AgentOrg below any configured member are invalid.

### Shared Record Shapes — Reuse Without A Generic Persisted Root

| Record / Field Group | Team V2 | AgentOrg V1 | Required Contract |
| --- | --- | --- | --- |
| `createdAt`, `archivedAt` | Existing exact fields | Same exact fields | Preserve ISO-8601 UTC meaning. |
| `applicationBinding` | Existing exact field shape | Same exact field shape | Preserve application/binding identity or `null`. |
| `handoffs` | Existing `{from,to,rules[]}` records | Same exact record shape | Preserve order, rooted addresses, and natural-language conditions. |
| Launch configuration | Existing exact field shape | Same exact root/member field shape | Preserve runtime/model/tool/skill/workspace values. |
| Configured Agent | Existing exact record | Same exact record | Preserve address, definition/run identity, role/description, platform ID, and launch configuration. |
| Configured Team | Not valid in flat Team root after cutover | Reuse existing exact record | Constrain members to Agents; retain coordinator and task executions. |
| Task Agent | Existing exact record | Same exact record | Preserve target address, run IDs, timestamps, and settlement. |
| Task Team / task-Team member | Existing exact records | Same exact records | Preserve recursive task lineage; do not treat it as configured nesting. |

No new `kind` field is added to these persisted configured/task records. Their
existing AgentRun-ID-versus-TeamRun-ID exact-key unions remain the shared
record discriminator. Implementations may share internal types/validators, but
that does not merge the two persisted root families.

A task execution remains stored in the `taskExecutions` array of its exact
semantic host: native `rootTeam`, AgentOrg `rootOrg`, a direct configured Team,
or another task Team. It does not add configured membership or a permanent
address.

### Generic History, Catalog, Restore-Location, GraphQL, And Stream Projection

A consumer that can return both roots MUST expose the following logical
discriminated union (wire casing may follow the existing contract convention,
but the logical field and values are normative):

```text
RootExecutionTreeProjection =
  | {
      root_subject_kind: "agent_team",
      execution_tree: TeamRunExecutionTreeDtoV2
    }
  | {
      root_subject_kind: "agent_org",
      execution_tree: AgentOrgRunExecutionTreeDtoV1
    }
```

Rules:

1. `root_subject_kind` is mandatory on mixed-root history, catalog, stream, workspace, and generic execution-tree responses/events.
2. The `agent_team` variant carries/projects Team V2 semantics; the `agent_org` variant carries/projects AgentOrg V1 semantics.
3. Existing Team-only endpoints/DTOs may remain Team-specific and byte/wire compatible; they do not need a synthetic Org union.
4. Persistence discovery selects a validator from the known package family/path and then validates the exact schema version/root keys. It does not scan one family and reinterpret it as the other.
5. A generic reader MUST NOT infer kind from coordinator presence, display name, configured members, schema version alone, or whichever validator happens to accept the payload.
6. Package family, payload discriminator/root, and requested projection kind must agree; a mismatch fails closed and is not auto-moved or auto-retyped during ordinary read/restore.
7. Derived mixed indexes include the root kind and the matching definition/run identity so Team and Org identifiers are never conflated.

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

## Fixed-Depth Family Transition

| Current TeamRun V2 Input | Agent-Only Root | One-Level Organization-Like Root |
| --- | --- | --- |
| Package family/path | Keep `$MEMORY_ROOT/agent_teams/<rootTeamRunId>/` | Convert canonical package to `$MEMORY_ROOT/agent_orgs/<orgRunId>/`; preserve the root run-ID value as `orgRunId` unless an independently approved identity mapping says otherwise. |
| Execution-tree file | Keep `team_run_execution_tree.json` | Write `agent_org_run_execution_tree.json`; retire the old Team execution-tree authority only after the Org package commit succeeds. |
| Version/root | Keep `schemaVersion: 2` and `rootTeam` | Set `schemaVersion: 1`, add `subjectKind: agent_org`, and project `rootTeam` to `rootOrg`. |
| Root identity | Preserve `teamDefinitionId`, `teamDefinitionName`, `teamRunId` | Project values to `orgDefinitionId`, `orgDefinitionName`, `orgRunId`. |
| Root coordinator | Preserve and validate as direct Team Agent | Remove coordinator semantics/field. Preserve the referenced Agent as an ordinary direct Org Agent; do not create initial focus or fallback. |
| Root default launch configuration | Preserve byte-equivalent fields | Preserve byte-equivalent fields as `rootOrg.defaultLaunchConfiguration`. |
| Direct Agent records | Preserve byte-equivalent fields | Preserve byte-equivalent fields as independent Org Agents. |
| Direct Team records | Invalid under the flat Team target; not present in this cohort | Preserve byte-equivalent configured Team records as direct Org Teams; enforce Agent-only members and coordinator validity. |
| Handoffs | Preserve unchanged | Preserve unchanged. |
| Root/Team/task-owned task executions | Preserve unchanged and at the same semantic host | Preserve unchanged and project only the root host name from `rootTeam` to `rootOrg`. |
| Content, memory, messages, task ledgers, history | Keep in native Team package; no destructive rewrite | Move/project to the Org package without identity/content loss; rebuild only derived indexes/caches after canonical commit. |
| Generic indexes/projections | Add/retain `root_subject_kind: agent_team` where mixed | Set `root_subject_kind: agent_org`; never infer from legacy coordinator. |

The transition is fixed-depth and idempotent. It MUST commit and validate the
canonical AgentOrg definition/execution package before retiring the legacy
organization-like Team authority or rebuilding derived indexes. Flat Team V2
packages are not migration output writes; they are already the native target.
A crash or validation failure cannot leave both families simultaneously
advertised as active canonical authority for the same root identity.

## Contract Verification Matrix

| Verification ID | Scope | Verification Intent |
| --- | --- | --- |
| ORG-VERIFY-001 | ORG-CASE-001–007, ORG-CASE-031 | Definition/import/update, standalone-Team validation, and progressive Team-to-Org reuse. |
| ORG-VERIFY-002 | ORG-CASE-008–018 | Coordinator-free Org activation/post-launch targeting and strict addresses. |
| ORG-VERIFY-003 | ORG-CASE-019–025 | Team-local and Org-wide handoffs using reused address records. |
| ORG-VERIFY-004 | ORG-CASE-026–030 | Org/Team lifecycle and host-anchored task execution. |
| ORG-VERIFY-005 | Native Team V2 and AgentOrg V1 file-family contracts | Exact versions/keys/file names/package paths, strict family validation, flat Team invariants, coordinator-free Org root, reused child/task records, and restore. |
| ORG-VERIFY-006 | Preconditions and fixed-depth family transition | Flat Team V2 no-op classification, one-level Org conversion, identity/content preservation, atomic/idempotent authority cutover, and no deep topology branch. |
| ORG-VERIFY-007 | ORG-CASE-032–042 | Explicit From/To/When detail and authoring; eligible endpoint projection; coordinator indication; address visibility; CRUD/order/validation/cancel/atomic save; Org-versus-Team ownership separation. |
| ORG-VERIFY-008 | ORG-CASE-043–048 | Direct-to-Org configuration, Org → Team → Agent effective-setting precedence, referenced-definition immutability, complete launch validation, full-scope activation, and no initial focus. |
| ORG-VERIFY-009 | Mixed-root projection contract | Mandatory `root_subject_kind`, correct Team V2/AgentOrg V1 union branch, Team-only compatibility, package/payload/projection agreement, and failure-closed mismatch handling. |

## Contract Non-Goals

- Changing native standalone Team V2 JSON keys, version, file name, or package path.
- A Team V3 schema, generic persisted root-union file, or migration rewrite for already-flat Team V2 packages.
- Duplicating or redesigning configured Agent/Team, handoff, launch, or task record shapes merely because AgentOrg has its own root/file family.
- `FlatTeam` domain/schema/file names.
- Recursive configured AgentTeam or AgentOrg definitions.
- A root AgentOrg coordinator, pre-launch exact-entry selector, automatic initial focus, or default recipient fallback.
- Shared Agent runtime instances across configured placements.
- Automatic cross-run logical routing.
- Live topology mutation/file watching.
- Recursive legacy topology migration.
- Removing supported task-scoped Team delegation.
- Executable/scheduled handoff policy, a graphical workflow engine, or automatic evaluation of `When` prose.

## Approval Basis And Pending Confirmation

The 2026-08-31 approval recorded in `RER-009` confirms the product/domain basis:

1. AgentOrg is the only persistent multi-Team composition root and has no coordinator.
2. AgentTeam is Agent-only by invariant and retains its direct Agent coordinator.
3. The current generic V2 child/handoff/task topology is reused rather than replaced.
4. AgentOrg and AgentTeam preserve the same observable configured/member/task semantics without requiring recursive configured Teams.
5. AgentOrg root omits `coordinatorAddress`; direct Team nodes retain it.
6. Migration is a fixed-depth root-family projection, not tree reconstruction.
7. Task Teams remain under their exact runtime host and do not affect configured depth.
8. A standalone-tested AgentTeam is directly reusable by reference inside AgentOrg; Org-scoped handoffs are sufficient to connect it without copying or changing the Team.

The previously approved generic persisted V3 root union is the specific point
superseded by the user's later correction during the `RER-014` → `AD-REV-002`
impact round. `RER-015` proposes the exact replacement boundary for approval:

1. native flat Team runs remain exact `TeamRunExecutionTreeFileV2` under `agent_teams/<rootTeamRunId>/team_run_execution_tree.json`;
2. AgentOrg uses new `AgentOrgRunExecutionTreeFileV1` under `agent_orgs/<orgRunId>/agent_org_run_execution_tree.json`;
3. AgentOrg V1 has `subjectKind: agent_org`, coordinator-free `rootOrg`, and Org default configuration;
4. current configured Agent/Team, handoff, launch, application-binding, timestamp, and task record shapes are reused;
5. mixed history/stream/workspace contracts expose explicit `root_subject_kind`; and
6. flat Team V2 is a no-op cohort while one-level organization-like V2 roots convert atomically to AgentOrg V1.

The handoff semantic information and required authoring capabilities defined by
`ORG-CASE-032`–`ORG-CASE-042` were approved in `RER-012`. They constrain what
the experience must communicate and enable, not how Product Prototyper must
compose the UI. Product Prototyper owns the concrete prototype and visual/
interaction solution.

The launch/configuration/focus behavior defined by `ORG-CASE-008`–`ORG-CASE-011`
and `ORG-CASE-043`–`ORG-CASE-048` was approved in `RER-013` from the user's
explicit rejection of the `RV-009` selector. AgentOrg activation covers the
complete configured scope without a recipient; exact focus is chosen afterward
only when a recipient-requiring interaction needs it. The configuration
precedence adapts the current AgentTeam default/placement-override behavior to
the approved fixed-depth Org model without prescribing Product Design's UI or
Architecture Design's target implementation.

The user-approved Product UI package `RV-012` is integrated in `RER-014` and
remains authoritative. The `RER-015` persistence-family correction does not
change its visible Team/Org, handoff, configuration, focus, or runtime/history
behavior; production mixed-root APIs must simply discriminate those approved
root identities truthfully.

`/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/ui-ux-spec.md`
and `VIS-001`–`VIS-020` under that ticket's `visual-references/` directory are
the normative product presentation of these cases. Product-declared fixture
names/values remain illustrative, and the prototype's local mocked persistence,
services, orchestration, streams, and writes do not define production
architecture.
