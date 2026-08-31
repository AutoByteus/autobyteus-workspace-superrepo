# Design Spec

## Document Status

- Package: `AORG-FLAT-TEAM-001`
- Approved requirements revision: `RER-009`
- Normative supplement: `AORG-CONTRACT-001`
- Architecture result: `Architecture Design Complete`
- Architecture revision: `AD-REV-001`
- Date: 2026-08-31
- Workspace: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`
- Branch / approved starting commit: `requirements/flat-agent-organization-model` / `c7b711b1cbd98bca0c6f7c61dc77ae1afbecfcd1`

## Current-State Read

The product currently has one recursively composable `AgentTeamDefinition` and
one recursively shaped Team execution root. `AgentTeamDefinition.nodes` accepts
both Agent and AgentTeam refs; `TeamDefinitionGraphResolver` recursively loads
them; `TeamHandoffCompiler` recursively rebases their handoffs; and
`TeamDefinitionTopologyPlanner` allocates a root TeamRun plus arbitrarily nested
configured TeamRuns. `RootTeamRun`, `TeamExecutionIndex`, the mixed runtime
backend, task delegation, memory layout, strict V2 persistence, GraphQL, the
Team WebSocket contract, history projections, and the web workspace all encode
that root as a Team.

The execution topology itself is not the design defect. The current V2 tree is
already a generic aggregate with direct Agent/Team placements, canonical
addresses, handoffs, launch configuration, IDs, and host-owned task lineage.
The defect is that the definition and root subject boundaries are conflated:
an organization-like root is forced to be a Team with a coordinator, while a
Team is allowed to contain another Team. This duplicates organization and Team
semantics across domain, transport, runtime, persistence, and UI owners.

The target therefore preserves the generic execution topology but makes its
root a strict `AgentOrg | AgentTeam` union. An AgentOrg root may contain direct
Agents and flat AgentTeams and has no coordinator. An AgentTeam root or child
contains Agents only and has one direct Agent coordinator. Recursive task Team
lineage remains separate and unchanged in meaning.

The supplied workspace is a clean, isolated git worktree. `HEAD` equals the
approved requirements commit, its merge base with `personal` is
`80e2bd195c42ea3ced778dbc051d4d00edaef16f`, and the branch is ten commits ahead
with no unrelated working-tree changes before this architecture round.

## Task Size And Architectural Risk (Mandatory)

- Task size: `Large`
- Size rationale and supporting evidence: The implementation changes definition
  ownership and file formats, root runtime ownership, launch/entry APIs,
  collaboration addressing text/types, strict persistence and migration,
  history/memory layout, GraphQL and WebSocket contracts, application/package
  integration, and separate web authoring plus shared workspace execution.
  A repository scan found 207 source consumers of current root-Team field names
  and 11 direct definition-recursion consumers, before tests and generated
  transport code. The 23 definition roots and 41 execution trees are a small
  payload inventory; they do not drive the size. The structural production
  surfaces do.
- Architectural risk: `High`
- Risk rationale and supporting evidence: This is a material shared-contract,
  persisted-root-invariant, migration, lifecycle, identity, ownership-boundary,
  API, and UI change. A faulty root classification or cutover can make run
  history, tasks, memory, or package definitions unreachable. The design also
  intersects application launches, external-channel targeting, memory sync, and
  a separate unmerged dynamic-Team draft.
- Selected route: `Architecture Review`
- Escalation trigger if implementation or validation discovers new impact: Return
  `Design Impact` if implementation requires a second Org/Team execution-tree
  family, a compatibility reader in normal runtime, a different addressing or
  entry contract, configured Team depth beyond Org -> Team -> Agent, mutation of
  reusable Team definitions on Org adoption, shared Agent runtime instances, a
  non-atomic migration posture, or a new application/security/concurrency
  contract. Return `Requirement Gap` if evidence contradicts `PRE-001`-
  `PRE-005` or a product decision is needed rather than an implementation
  choice.

### Structural Versus Payload Classification

- Payload inventory: 23 inspected root definition packages, 41 readable V2 run
  trees, their Markdown/JSON bodies, derived catalogs/indexes, fixtures,
  generated GraphQL, and documentation.
- Structural surfaces: definition subjects and validators; source ownership;
  launch planners and public APIs; root/member runtime ownership; addresses and
  handoffs; task host ownership; strict persistence readers/writers and physical
  layout; migration; history/memory; WebSocket/GraphQL; application resources;
  and web authoring/workspace state.
- House test: Existing structural contracts cannot consume AgentOrg truthfully:
  V2 requires a root coordinator, Team definitions accept Teams, the runtime
  root is a `RootTeamRun`, and transport exposes `root_team`. This is not a bulk
  content conversion through an unchanged contract.
- Target-versus-delta result: The fixed-depth AgentOrg/AgentTeam model, V3 root
  union, affected APIs/UI, migration, and recursive configured-Team removal are
  explicitly in this implementation round. Unrelated task settlement semantics,
  dynamic membership, or cross-run routing are not.

## Architecture Investigation Evidence

| Source / Command / Probe | Exact Path / Reference | Observation | Design Decision Supported | Remaining Uncertainty |
| --- | --- | --- | --- | --- |
| Approved requirements package | `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md` | `RER-009` is Approved and explicitly selects Architecture Design with preliminary Large/High. | Intended behavior and route are ready; no requirement elicitation is needed. | None. |
| Normative contract | `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | One generic V3 root union and unchanged member/handoff/task meanings are mandatory. | Do not create parallel Org/Team topology families or a `FlatTeam` subtype. | Physical target paths and type/module names were architecture-owned and are fixed below. |
| Worktree verification | `git rev-parse HEAD`; `git worktree list --porcelain`; `git merge-base HEAD personal`; `git status --short --branch` | Isolated worktree, approved `HEAD=c7b711b1c`, clean starting state, known `personal` merge base. | Continue in supplied worktree; do not create another workspace. | Implementation must refresh the base before source work if `personal` advances. |
| Definition model | `autobyteus-server-ts/src/agent-team-definition/domain/models.ts` | `TeamMember.refType` is `agent | agent_team`; `AgentTeamDefinition` owns both recursive membership and the coordinator. | Split AgentOrg and flat AgentTeam into separate domain subjects and inputs. | None. |
| Recursive resolver/compiler | `autobyteus-server-ts/src/agent-team-definition/services/team-definition-graph-resolver.ts`; `team-handoff-compiler.ts` | Both recursively traverse configured Team membership and use root-relative rebasing. | Replace with a fixed-depth collaboration topology resolver and one compiler that combines Org handoffs plus once-rebased Team-local handoffs. | None. |
| Persistence-before-validation defect | `autobyteus-server-ts/src/agent-team-definition/services/agent-team-definition-service.ts`; `file-agent-team-definition-provider.ts` | Create writes a definition and then validates/rolls back; file writes are not an authoritative pre-persistence invariant boundary. | New definition services must validate complete candidates before any provider mutation and stage atomic file replacement. | None. |
| Planner/config | `autobyteus-server-ts/src/agent-team-execution/domain/team-run-config.ts`; `services/team-definition-topology-planner.ts` | Root is always `TeamRunAgentTeamNode`; planner indexes and allocates recursive Teams. | Introduce a discriminated root config union and fixed-depth planner; Team nodes are Agent-only at type and validator level. | None. |
| Root runtime | `autobyteus-server-ts/src/agent-team-execution/domain/root-team-run.ts`; `domain/team-run.ts`; `backends/mixed/mixed-team-manager.ts` | `RootTeamRun` is the public aggregate; the mixed manager already owns generic direct Agent/Team activation, tasks, events, and termination. | Generalize the authoritative root to `RootCollaborationRun`, keep `TeamRun` only for actual Team executions, and reuse/specialize the mixed member mechanics. | Exact implementation split may adjust without weakening the public boundaries below. |
| Recipient resolution | `autobyteus-server-ts/src/agent-team-execution/services/team-recipient-resolver.ts`; `services/team-execution-index.ts` | `/` is rejected, Agent resolves directly, Team resolves through `coordinatorAddress`, but traversability is recursively generic. | Preserve resolution semantics while constraining configured addresses to standalone `/agent` or Org `/agent`, `/team`, `/team/agent`. | None. |
| Task lineage | `autobyteus-server-ts/src/agent-team-execution/task-delegation/**`; `domain/team-run-execution-tree.ts` | Task Agent/Team records are attached to an exact host and recursive task lineage is separate from configured membership. | Preserve task record shapes and recursive task lineage; generalize host ownership so an Org root is not treated as a Team. | No new standalone-Team-to-unmounted-Team selector is authorized. |
| Strict V2 schema | `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-schema.ts`; `team-run-execution-tree-store.ts` | Exact keys require `rootTeam`, root Team fields, schema 2, and a root coordinator. Normal reader is strict/current-only. | Build a strict V3-only normal reader and confine V2 decoding to migration code. | None. |
| Physical memory layout | `autobyteus-server-ts/src/agent-memory/store/agent-memory-layout.ts` and `rg 'getTeamRootDirPath|agent_teams' autobyteus-server-ts/src` | Root runs live below `memory/agent_teams`; memory, history, migrations, sync, and runtime classifiers depend on this Team-only name. | Move native root packages to generic `memory/collaboration_runs` during the required cutover and update all current owners together. | Imported/exported old snapshots are not a continuing runtime format; they must be migrated before import admission. |
| Stream/API truth | `autobyteus-team-stream-contracts/src/team-execution-view-dtos.ts`; `autobyteus-server-ts/src/services/agent-streaming/team-execution-view-projector.ts`; GraphQL AgentTeam types | Stream schema/version and GraphQL authoring/launch expose root-Team and recursive Team member semantics. | Publish a V3 root union, separate AgentOrg definition/launch APIs, and a generic collaboration execution stream. | Generated client regeneration is required. |
| Web authoring/workspace | `autobyteus-web/components/agentTeams/**`; `stores/agentTeamDefinitionStore.ts`; `stores/agentTeamRunStore.ts`; `services/teamExecution/**` | Team form offers Team members; detail shows nested Teams; runtime contexts assume a root Team. | Separate Org authoring from flat Team authoring and extract one generic collaboration-run workspace state owner. | Exact styling is implementation-owned; no prototype is required. |
| Definition inventory probe | Python scan of `/home/autobyteus/workspace/autobyteus-agents/agent-teams/*/team-config.json` and `/home/autobyteus/workspace/autobyteus-private-agents/agent-teams/*/team-config.json` | 23 roots; 3 organization-like; no child Team contains another Team. | Use exhaustive fixed-depth definition classification, not recursive flattening. | External roots must remain writable during the maintenance cutover or be updated by their owning deployment step. |
| V2 run probe | Python/`jq` scan of `/home/autobyteus/data/memory/agent_teams/*/team_run_execution_tree.json` | 41 readable V2 trees; 14 have one direct configured Team level; none is deeper; task records remain separate. | Use deterministic root-subject/key projection and preserve task hosts. | Exact production volume outside the approved population is intentionally not a design obligation. |
| Representative stored Org-like tree | `/home/autobyteus/data/memory/agent_teams/software_development_department_09e8e85e26524e7d9dd869866c27496b/team_run_execution_tree.json` | Root coordinator plus direct Agent/Team records; every direct Team has Agent-only members and its own coordinator. | Remove only root coordinator semantics; preserve direct Team records and IDs. | This stored definition predates current package content, so migration must trust snapshots, not mutable definitions, for run conversion. |
| Concurrent draft check | `origin/codex/dynamic-agent-team-runtime@7d9b4ba69`; `git merge-base --is-ancestor 7d9b4ba69 HEAD` | Draft commit is not in the task branch and currently adds only ticket artifacts, but its approved direction is not part of this package. | Do not import recursive configured mutation. Reconcile any later code at rebase against `REQ-017`. | Branch may evolve before implementation. |

## Intended Change

Introduce AgentOrg as a first-class definition and root execution subject while
contracting AgentTeam to one coordinator-led Agent-only unit. Persist both with
one strict generic V3 execution tree. Replace configured recursive-Team runtime
ownership with a fixed root union and one Org-to-Team hop, while preserving
recursive task execution lineage. Add truthful, separate definition/launch
surfaces for AgentOrg and AgentTeam, a generic collaboration execution/history
transport, fixed-depth web authoring/workspace projection, and a preflighted,
restart-safe migration for both approved existing-data cohorts.

## Target Definition And Source Contracts

The implementation must use separate subject records rather than a base class
with optional coordinator/member fields.

```ts
type AgentTeamMemberRef = Readonly<{
  memberName: string;
  ref: string;
  refScope: "shared" | "team_local";
}>;

type AgentTeamDefinition = Readonly<{
  id: string;
  name: string;
  description: string;
  instructions: string;
  members: readonly AgentTeamMemberRef[];
  coordinatorMemberName: string;
  handoffs: readonly CollaborationHandoff[];
  // Existing category/avatar/default-launch/source metadata remains.
}>;

type AgentOrgMemberRef = Readonly<{
  memberName: string;
  ref: string;
  refType: "agent" | "agent_team";
  refScope: "shared" | "agent_org_owned";
}>;

type AgentOrgDefinition = Readonly<{
  id: string;
  name: string;
  description: string;
  instructions: string;
  members: readonly AgentOrgMemberRef[];
  handoffs: readonly CollaborationHandoff[];
  // No coordinator field. Existing category/avatar/default-launch/source
  // metadata remains where it is meaningful.
}>;
```

- `agent-teams/<team-id>/team-config.json` uses `members` of the first shape;
  it has no `refType`, because every Team member is an Agent. A Team-local Agent
  remains physically under that Team's `agents/<local-id>` directory.
- `agent-orgs/<org-id>/org-config.json` uses explicit `refType` because an Org
  may contain either direct Agents or Team references.
- An Org-owned Agent or Team remains a separate definition source under
  `agent-orgs/<org-id>/agents/<local-id>` or
  `agent-orgs/<org-id>/agent-teams/<local-id>`. Physical ownership makes it
  discoverable; Org membership still holds a reference and never an embedded
  definition copy.
- For migration identity continuity, the target source index deliberately maps
  an Org-owned local source to the exact existing encoded canonical ID
  (`team-local-agent:<former-root-id>:<local-id>` or
  `team-local-team:<former-root-id>:<local-id>`). These strings are treated as
  opaque stable IDs. The target `agent_org_owned` source scope and physical Org
  source path determine ownership; current code must not infer Team nesting from
  or recursively resolve the historic prefix. New Org-owned local sources use
  the same stable namespace so there is one identity rule rather than migrated
  and native aliases.
- Shared AgentTeams referenced by an Org retain their existing definition ID
  and physical source unchanged. Adding the reference or Org handoffs does not
  edit the Team. Existing application-owned AgentTeams remain flat, but this
  package does not add a cross-ownership Org reference to them.
- AgentOrg is a shared/package-root definition in this approved round and cannot
  be owned by another Org. Existing application-owned AgentTeams remain valid
  only after they satisfy the flat Team contract; adding application-owned
  AgentOrg authoring is not required by this package.

## Relevant Behavior And Production-Path Map (Mandatory)

| Behavior ID | Kind | Approved Requirement / Intent And Acceptance-Criteria IDs | Approved Trigger Or Governing Contract | Relevant Existing Behavior And Evidence Reference | Approved Change Or Preserved Outcome | Target Production Path / Lifecycle And Spine ID(s) |
| --- | --- | --- | --- | --- | --- | --- |
| BEH-001 | Contract | REQ-001, REQ-002, REQ-008, REQ-018; AC-001, AC-005, AC-013 | Author/create/update/import an AgentOrg or AgentTeam definition. | Recursive `AgentTeamDefinition`, graph resolver, and package config; requirements investigation code facts. | AgentOrg alone may reference Teams; Team accepts Agents only; all boundaries fail before mutation; Org stores Team references without copying. | Org/Team UI or package import -> subject-specific GraphQL/service -> strict candidate resolver/validator -> atomic provider -> catalog (DS-001). |
| BEH-002 | System | REQ-004, REQ-005, REQ-011; AC-002, AC-007 | Launch/restore an Org or standalone Team. | Recursive topology planner -> `TeamRunConfig` -> `AgentTeamRunManager` -> `RootTeamRun`. | One root collaboration scope uses AgentOrg-or-AgentTeam config; Org has no coordinator and requires exact entry selection; Team uses its coordinator. | Launch UI/application -> subject-specific launch service -> fixed-depth planner -> root manager -> selected Agent/Team ingress (DS-002, DS-003). |
| BEH-003 | Contract | REQ-005-REQ-007; AC-003, AC-004 | Agent calls handoff tools inside an active root. | Recursive handoff compiler plus same-root recipient resolver. | Preserve ordered Agent-sourced handoffs and same-root failure-closed resolution; compile Team-local handoffs once at mount and Org edges at root. | Member context -> handoff rules -> collaboration root -> fixed-depth address resolver -> exact Agent or Team coordinator (DS-004). |
| BEH-004 | Contract | REQ-003, REQ-004; AC-002, AC-003 | Caller targets a Team or chooses Org entry. | Every root/child Team has coordinator; root `/` is not recipient. | Actual Teams retain direct coordinator ingress; AgentOrg omits coordinator and never guesses an entry. | Entry/recipient address -> collaboration resolver -> Team coordinator or exact Agent -> active AgentRun (DS-003, DS-004). |
| BEH-005 | System | REQ-012, REQ-014, REQ-016; AC-008, AC-009, AC-011 | Persist, restore, stream, inspect, archive, or stop a run. | V2 strict root Team plus recursive configured members across persistence/history/web. | V3 strict root union with fixed configured depth; task/content/history/memory identity preserved; transport and UI show subject truth. | Root mutation -> V3 store -> generic stream/history projection -> web workspace; restore reverses through V3-only reader (DS-006, DS-008). |
| BEH-006 | User | REQ-001, REQ-002, REQ-004, REQ-011, REQ-016, REQ-018; AC-002, AC-007, AC-011, AC-013 | Open authoring, catalog, detail, launch, history, or workspace. | One Agent Teams catalog/form supports nested Teams and nested hierarchy labels. | Separate Org and Team catalogs/forms, exact Org entry chooser, reusable Team library, and fixed-depth runtime/history presentation. | Web routes/stores -> distinct GraphQL contracts -> shared collaboration execution view (DS-001-DS-003, DS-006). |
| BEH-007 | Operational | REQ-009, REQ-010, REQ-012, REQ-013; AC-004, AC-006, AC-008 | Upgrade the approved definition/run population. | 23 roots and 41 V2 trees; no deep configured topology. | Flat roots stay Teams; one-level roots become Orgs; unexpected depth stops globally before writes; no recursive flattening. | Startup maintenance gate -> exhaustive classifier -> backup/stage/promote -> V3 validation -> rebuild projections -> release gate (DS-007). |
| BEH-008 | Contract | REQ-014; AC-009 | Native write/read/restore of durable root state. | Exact V2 `rootTeam` schema and generic child/task records. | One `RunExecutionTreeFileV3` with root discriminator and conditional coordinator; configured Team members are Agent-only. | Planner/root -> V3 builder/schema/store -> V3 restore/config builder (DS-006). |
| BEH-009 | System | REQ-015; AC-010 | Delegate a task to a mounted Agent/Team and settle/restore it. | Task Agent/Team records live under exact Team host; task Team lineage can recurse. | AgentOrg root becomes a valid host scope without becoming a Team; direct Org Team tasks start through coordinator; task lineage stays recursive and non-configured. | Agent tool -> root task service -> target/host resolver -> fresh task Agent/Team -> durable host task array -> settlement event (DS-005, DS-008). |

## Relevant Supplemental Task Artifacts

| Artifact Path | Purpose | Related Requirement / Acceptance-Criteria IDs | Relationship To This Design | Status / Approval Applicability |
| --- | --- | --- | --- | --- |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | Normative configured structure, V3 logical schema, task ownership, and V2 mapping. | REQ-001-REQ-018; AC-001-AC-013 | Governs the root union, fixed-depth invariants, reuse rules, and migration projection. | Approved in `RER-009`; authoritative. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md` | Requirements-owned evidence and current production-path inventory. | BEH-001-BEH-009; PRE-001-PRE-005 | Supplies the approved behavior evidence; architecture evidence above extends rather than rewrites it. | Current evidence; not behavior authority by itself. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md` | Cumulative approval/navigation history. | RER-001-RER-009 | Establishes that the minimal-delta V3 and progressive Team reuse are approved. | Approved/cumulative. |
| `/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/requirements_engineer_6568eac682114f2cb3ddb8f1d91d3c34/context_files/ctx_4cc02361f417__image.png` | Representative current hierarchy screenshot. | REQ-016; AC-011 | Current-state evidence only; it does not prescribe target layout/styling. | Evidence only; no separate approval. |
| `origin/codex/flat-agent-team-domain-simplification@c3a318812` (local `ca6d24dfa`) | Prior concept evidence. | BEH-001, BEH-004, BEH-009 | Its supported decisions are already incorporated upstream; it is not a competing design. | Superseded by approved package. |

## Task Design Health Assessment (Mandatory)

- Change posture: `Larger Requirement` and `Refactor`
- Current design issue found: `Yes`
- Root cause classification: `Boundary Or Ownership Issue` with
  `Duplicated Policy Or Coordination`, `Shared Structure Looseness`, and
  `Legacy Or Compatibility Pressure` consequences.
- Refactor needed now: `Yes`
- Evidence: The main definition subject owns both Team and Org semantics;
  callers depend on recursive graph internals; normal root runtime, persistence,
  history, and transports require Team semantics even for organization roots;
  UI and APIs advertise nested Team composition. Retaining those paths beside
  AgentOrg would create two overlapping hierarchy models and violate REQ-001,
  REQ-002, and REQ-008.
- Design response: Split AgentOrg and AgentTeam definition owners, extract a
  semantically tight collaboration topology/handoff owner, generalize only the
  root execution aggregate and V3 schema, keep Team execution explicit, remove
  configured recursion, and isolate V2 knowledge in one migration boundary.
- Refactor rationale: Addition-only AgentOrg would leave recursive Team APIs,
  validators, and runtime behavior as a second supported model. A clean-cut
  structural refactor is required for the approved exclusive boundary.
- Intentional deferrals and residual risk: Dynamic membership, distributed
  cross-run routing, shared Agent instances, arbitrary departments, and new task
  settlement semantics remain out of scope. The historic encoded
  `team-local-*` definition IDs for migrated Org-owned sources remain opaque
  stable identities because REQ-012/REQ-014 require identity preservation; new
  target code must not interpret that string prefix as permission for Team-in-
  Team ownership. This is a naming residue in an external identity namespace,
  not a legacy runtime behavior path.

## Terminology

- **Root collaboration run**: one active/persisted root execution whose subject
  is either AgentOrg or standalone AgentTeam. It owns the address, handoff,
  task, event, lifecycle, and persistence aggregate.
- **Configured scope**: the AgentOrg root, standalone AgentTeam root, or direct
  AgentTeam placement that directly owns configured Agent executions. Only an
  AgentOrg configured scope may own configured Team placements.
- **Org-owned definition source**: a Team or Agent source physically packaged
  below an AgentOrg for the migrated/current package cohort. It is still a
  distinct reusable definition identity, not a nested Team member.
- **Host scope**: the exact Org root, Team, or task Team whose `taskExecutions`
  array owns a fresh task execution.

## Legacy Removal Policy (Mandatory)

- Policy: `No backward compatibility; remove legacy code paths.`
- Required action: Delete recursive configured-Team definition resolution,
  validation, launch planning, public inputs, WebSocket/GraphQL fields, UI
  selectors, and normal V2 readers in this change. Remove V2 files only after
  each target V3 package validates.
- Clean-cut boundary: Normal definition/runtime/history code accepts only the
  target AgentOrg/AgentTeam and V3 contracts. Historical V2 types/decoders live
  only under the named migration folder and are never imported by current
  business services or stores.
- No dual API/stream: Do not retain old recursive GraphQL inputs, `root_team`
  stream payloads, or client fallbacks beside the target contracts.

## Persisted Data / State Transition Decision (Mandatory When Persisted Data May Be Affected)

- Stored subject, location, representative shape, and approximate volume:
  definitions below configured `agent-teams/**` package roots; 23 inspected root
  definitions, three organization-like. Runtime packages below
  `/home/autobyteus/data/memory/agent_teams/<rootTeamRunId>/`; 41 readable V2
  execution trees, 14 organization-like, plus task/communication/memory/history
  content. Representative V2 evidence is listed above.
- Relevant code-model, serialization, semantic, or physical-store change:
  definition roots split into `agent-orgs` and flat `agent-teams`; Team configs
  become Agent-only; execution tree changes from V2 `rootTeam` to V3 `root`
  union; root fields become generic; Org root drops coordinator; native root-run
  packages move to `memory/collaboration_runs`; generic history/index and tree
  filenames replace Team-only names.
- Normal reader/writer behavior and representative evidence: Current definition
  readers recursively discover Team-local Teams; current execution-tree reader
  validates exact V2 keys and cannot represent coordinator-free AgentOrg. Direct
  use would either reject AgentOrg or preserve false Team/coordinator semantics.
- Required semantics and invariants under direct use: preserve definition/run
  identities, mounted addresses, Team coordinators, launch configuration,
  handoffs, content, tasks, task hosts, Agent memory reachability, timestamps,
  application binding, and history; classify only the two approved cohorts; no
  configured Team below a Team; no Org coordinator.
- Physical-store, privacy/security, disposal/rebuild, and operational
  constraints: Durable content cannot be discarded. Derived catalogs/indexes
  may be rebuilt. Cutover runs before definition/run services admit work, with
  one process and no concurrent old/new application access. Package source
  roots must be writable or updated by their owning deployment step before the
  gate can pass.
- Decision: `Migration Required`
- Decision rationale, including concrete benefit versus I/O, downtime,
  corruption, recovery, and rollout cost: An unchanged V2 file cannot encode an
  Org root without a false coordinator and the normal exact reader will reject
  a V3 projection. Definition location/subject also changes. The approved
  population is small, the transform is deterministic, and directory renames
  plus atomic JSON commits avoid bulk content rewriting. The concrete benefit
  is a single truthful current schema and removal of all dual-shape business
  logic. A short maintenance/startup gate, backups, and restart-safe promotion
  are proportionate to the identity/history risk.
- Acceptance criteria or design constraints supported by this decision:
  AC-004, AC-006, AC-008-AC-010; QR-002-QR-005; PRE-001-PRE-005.

### Migration Plan

- Current canonical schema / version: AgentTeam package roots with recursive
  `team-config.json`; `TeamRunExecutionTreeFileV2` in
  `memory/agent_teams/<rootTeamRunId>/team_run_execution_tree.json`; Team history
  index V2.
- Older persisted schema version(s) that require transformation: exact V2 only
  for this migration. Earlier TeamRun migrations remain prerequisites and must
  have succeeded first.
- Why direct use and discard/rebuild are insufficient: V2 requires a root Team
  coordinator and wrong root keys/semantics; definitions must change subject and
  reject Team members. Durable content/history may not be discarded.
- Migration trigger: `Startup maintenance gate`, also callable through the
  existing app-data migration administration surface for retry while runtime
  admission remains closed.
- Migration owner and file / subsystem location:
  `autobyteus-server-ts/src/app-data-migrations/migrations/agent-org-flat-team-v3/agent-org-flat-team-v3-app-data-migration.ts`
  with plan, definition transformer, V2 decoder/transformer, promoter, and
  validator files confined to that folder.
- Normal business/runtime path that remains current-schema-only: AgentOrg/Team
  providers, collaboration planner/manager, `RunExecutionTreeStore`, history,
  GraphQL, stream projector, and web client accept only target definitions/V3.
- Historical-shape types or decoders confined to migration-owned code: exact V2
  tree type/schema plus old recursive Team config parser. They may not be
  imported from `agent-org-definition`, `agent-team-definition`,
  `agent-collaboration-execution`, run-history current stores, or transport.
- Completion marker / version ledger: existing app-data migration repository
  record with ID `20260831_agent_org_flat_team_v3`; a durable per-item promotion
  journal and backup manifest under
  `<appData>/migration-backups/20260831_agent_org_flat_team_v3/<attempt>/`.
- Restart-safety or idempotency strategy: A preflight produces a complete plan
  before writes. Every item is then classified as exact source, exact target,
  staged, promoted, or conflicting. Target-valid/source-absent is skipped;
  source-valid/target-absent is transformed; source and target collision or an
  invalid target fails closed. For run packages, the old V2 file is the
  promotion marker and is removed/moved to backup only after the new V3 file and
  unchanged task/communication package validate together. Directory promotion
  uses same-filesystem atomic rename and fsync.
- Validation before current runtime proceeds: validate every definition graph
  against fixed depth, every V3 tree against strict schema and identity/address/
  coordinator/task-host invariants, package cross-file root ID correlation,
  source/target counts, and exact classification coverage. Any deep configured
  topology discovered during preflight returns a `PRE-002` violation before any
  backup/promotion write.
- Backup / rollback / quarantine / operator-recovery strategy: Copy definition
  source files and V2 tree/index authorities into the attempt backup before
  promotion; never duplicate large Agent trace/content trees. Atomic directory
  renames preserve those subtrees. On pre-promotion failure, no source changes.
  On interrupted promotion, runtime remains gated and retry completes from the
  journal. Operator rollback is offline restoration of the complete attempt
  backup plus directory rename reversal; there is no runtime fallback reader.
- Concurrent old/new application access risk and cutover / maintenance /
  deployment-sequencing decision: Migration is registered after existing V2
  prerequisites and before server definition catalogs, root managers, memory
  sync, or GraphQL/WebSocket admission. A single-process lock rejects a second
  migrator. Old application binaries must be stopped for the cutover.
- Historical migration retention decision: Retain the migration and its V2
  decoder as isolated historical migration code while supported installations
  may still hold V2. Remove only under a separately approved minimum-version and
  backup-retention policy; never promote it to a normal reader.

| Migration Step | Source Shape / Version | Target Shape / Version | Transformation Owner | Validation | Failure / Recovery Behavior |
| --- | --- | --- | --- | --- | --- |
| 1. Global preflight | All discovered old/new definition roots, V2/V3 run roots, existing migration ledger | Immutable migration plan | `agent-org-flat-team-v3-plan.ts` | Two exhaustive cohorts; no depth violation; all refs resolvable; target paths collision-free; source roots writable; previous migrations complete | Stop before writes and report exact item/path/invariant. No recursive flattening. |
| 2. Backup/journal | Planned definition files, V2 trees, old derived index | Attempt backup + per-item journal | `agent-org-flat-team-v3-promoter.ts` | Hash/size/readback of backup and fsync | Leave sources authoritative; runtime stays gated. |
| 3. Definitions | Agent-only Team root or one-level organization-like Team root | Flat `agent-teams/<id>` or `agent-orgs/<id>` with strict configs; Org-owned sources physically below Org | `agent-org-definition-v1-transformer.ts` | IDs/refs/handoffs/coordinator rules; all Team members Agent-only; Org has no coordinator; known package case snapshots | Atomic promote each planned source; retry from journal. Invalid/collision quarantines target and restores source name. |
| 4. Run packages | Exact V2 root Team file under `memory/agent_teams` | Exact V3 root union under `memory/collaboration_runs/<rootRunId>/run_execution_tree.json` | `run-execution-tree-v2-to-v3-transformer.ts` and promoter | Strict V2 before; strict V3 after; root ID and child/task records preserved; Org coordinator removed only at root | Old V2 marker remains migration-owned until complete; no normal runtime admission. |
| 5. Derived projections | `team_run_history_index.json`, old catalog/cache projections | `collaboration_run_history_index.json` and regenerated catalogs | current history/catalog rebuild services | Row count and root kind/ID/definition correlation against every V3 root | Rebuild is repeatable; discard partial derived target and retry. |
| 6. Completion | All items promoted and package-valid | Migration ledger `SUCCEEDED` / services admitted | app-data migration runner + readiness gate | Full rescan finds only target forms and expected counts | Any failed item marks migration failed; app exposes migration recovery status but does not launch/restore/mutate runs or definitions. |

## Supported Scenario And Reachability Classification

| Scenario / Premise | Classification | Witness / Governing Basis | Design Consequence |
| --- | --- | --- | --- |
| Author AgentOrg with direct Agents/Teams and launch through an exact mounted entry | Supported Normal Scenario | SCN-001, SCN-002; AgentOrg web/GraphQL/package surfaces -> launch service -> selected address | Provide separate AgentOrg definition/launch boundaries and no coordinator fallback. |
| Launch/test flat Team, later reference same Team in Org | Supported Normal Scenario | SCN-006; Team catalog/launch history then Org member ref | Org stores only definition identity; no copy or mutation of Team source/history. |
| Org Agent delegates to direct mounted Team | Supported Normal Scenario | AC-010, ORG-CASE-028; `/team` resolves to coordinator | Fresh task Team is stored at exact delegator host and has no configured membership/address effect. |
| Standalone Team Agent delegates to one of its mounted Agents | Supported Normal Scenario | REQ-015 preserved task behavior and current tool path | Task remains owned by standalone Team root. |
| Standalone Team Agent delegates to an unrelated/unmounted Team by logical address | Technically Possible only if a new selector/global lookup were invented; unsupported/contrived | REQ-007, ORG-CASE-025, and current resolver prohibit cross-root discovery; no independent approved entry surface exists | Do not add definition-ID or global Team discovery to `delegate_task`. This premise cannot justify new API/security machinery. |
| Historical recursive task Team has another task Team below it | Supported Explicit Edge Scenario | PRE-005 and reused task record contract | Preserve recursive task lineage and its restore/index traversal even though configured Team depth is fixed. |
| Deep configured Team appears during migration | Supported Explicit Operational Failure | REQ-013, PRE-002, QR-003 | Fail the global preflight before writes; report invariant; do not design conversion. |

## Data-Flow Spine Inventory

| Spine ID | Scope | Related Behavior ID(s) | Start | End | Governing Owner | Why It Matters |
| --- | --- | --- | --- | --- | --- | --- |
| DS-001 | Primary End-to-End | BEH-001, BEH-006 | Definition author/import action | Atomically persisted and cataloged AgentOrg or flat AgentTeam | Subject-specific definition service | Establishes exclusive model and pre-persistence validation. |
| DS-002 | Primary End-to-End | BEH-002, BEH-004, BEH-006 | Standalone Team launch | Team coordinator AgentRun ready/focused | `AgentTeamRunService` behind root collaboration manager | Preserves independent Team behavior and history. |
| DS-003 | Primary End-to-End | BEH-002, BEH-004, BEH-006 | AgentOrg launch plus entry address | Exact Agent execution, or selected Team coordinator, ready/focused | `AgentOrgRunService` plus `RootCollaborationRun` | Ensures no synthetic Org coordinator or guessed entry. |
| DS-004 | Primary End-to-End | BEH-003, BEH-004 | Mounted Agent requests/sends a handoff | Exact same-root AgentRun accepts message or request fails closed | `RootCollaborationRun` collaboration boundary | Preserves scope isolation and Team ingress. |
| DS-005 | Primary End-to-End | BEH-009 | Mounted Agent delegates task | Fresh task Agent/Team execution durably attached to exact host and lifecycle result returned | Root task-delegation service | Separates task lineage from configured membership. |
| DS-006 | Primary End-to-End | BEH-005, BEH-008 | Root creation/mutation or restore request | Strict V3 package committed/restored with identities and task hosts intact | Run persistence/history subsystem | Makes the root union durable without parallel schemas. |
| DS-007 | Primary End-to-End | BEH-007, BEH-008 | Startup migration gate | Entire approved population promoted or runtime remains closed | App-data migration subsystem | Protects existing definitions/history and enforces preconditions. |
| DS-008 | Return-Event | BEH-005, BEH-009 | Agent/task/lifecycle event in active root | Web collaboration workspace/history state reflects sequenced event | Root event publisher and collaboration stream | Carries truthful root subject and unchanged task semantics to UI. |
| DS-009 | Bounded Local | BEH-003 | Fixed-depth definition graph | Validated compiled handoff snapshot | Collaboration topology compiler | Rebase Team-local rules once, merge Org rules, reject duplicates/self targets. |
| DS-010 | Bounded Local | BEH-007 | One migration plan item | Journaled staged/promoted/validated disposition | V3 migration promoter | Provides idempotency and failure-closed cutover. |

## Primary Execution Spine(s)

- **DS-001 Org definition:** `AgentOrg form/package import -> AgentOrg GraphQL/import boundary -> AgentOrgDefinitionService -> fixed-depth AgentOrgDefinitionResolver + CollaborationHandoffCompiler -> FileAgentOrgDefinitionProvider atomic commit -> Org catalog projection`
- **DS-001 Team definition:** `AgentTeam form/package import -> AgentTeam GraphQL/import boundary -> AgentTeamDefinitionService -> flat Team validator + local handoff validator -> FileAgentTeamDefinitionProvider atomic commit -> Team catalog projection`
- **DS-002 standalone Team launch:** `Team catalog/run action -> createAgentTeamRun -> AgentTeamRunService -> CollaborationTopologyPlanner -> CollaborationRunManager/RootCollaborationRun -> TeamRun -> coordinator AgentRun`
- **DS-003 Org launch:** `Org catalog/run action + exact entryAddress -> createAgentOrgRun -> AgentOrgRunService -> CollaborationTopologyPlanner -> CollaborationRunManager/RootCollaborationRun -> fixed-depth recipient resolver -> exact AgentRun or Team coordinator`
- **DS-004 handoff/message:** `Mounted Agent tool -> MemberCollaborationContext -> RootCollaborationRun -> CollaborationExecutionIndex + CollaborationRecipientResolver -> owning AgentOrgRun/TeamRun -> recipient AgentRun`
- **DS-005 task delegation:** `Mounted Agent tool -> RootCollaborationRun TaskDelegationService -> host/target resolution -> fresh task AgentRun or flat TeamRun -> V3 host task array + task records commit -> target ingress/result lifecycle`
- **DS-006 persistence/restore:** `Root state mutation/restore request -> RunPersistenceCoordinator -> strict RunExecutionTreeStore V3 -> package validator/history catalog -> CollaborationRunConfig builder -> CollaborationRunManager`
- **DS-007 migration:** `Server startup -> AppDataMigrationRunner -> global V2/config preflight -> backup/journal -> definition and run promoters -> strict target rescan -> derived history rebuild -> readiness gate release`

## Spine Narratives (Mandatory)

| Spine ID | Short Narrative | Main Domain Subject Nodes | Governing Owner | Key Off-Spine Concerns |
| --- | --- | --- | --- | --- |
| DS-001 | Each public boundary constructs one complete subject-specific candidate. The service resolves refs and compiles handoffs before the provider stages files; only a fully valid candidate is atomically promoted. | AgentOrgDefinition or AgentTeamDefinition; DefinitionService; Provider | The subject-specific definition service | Source discovery, Markdown/config codecs, package sync, cache invalidation. |
| DS-002 | A standalone Team planner loads one flat Team, validates root/team/member launch settings, allocates IDs only after coverage validation, snapshots handoffs, creates the root aggregate, and focuses the coordinator. | AgentTeamDefinition; AgentTeamRootConfig; RootCollaborationRun; TeamRun; AgentRun | AgentTeamRunService | Identity allocation, workspace activation, persistence/history. |
| DS-003 | An Org planner loads direct Agents and Team definitions by reference, validates fixed depth and launch settings, allocates the Org root/direct Team/member IDs, creates one root scope, and resolves the caller's exact entry. | AgentOrgDefinition; AgentOrgRootConfig; RootCollaborationRun; AgentOrgRun; TeamRun/AgentRun | AgentOrgRunService | Team definition lookup, entry validation, workspace activation, history. |
| DS-004 | A member sees only compiled outgoing rules for its mounted address. Sending resolves within the immutable root snapshot; an Agent target maps directly and a Team target maps to its coordinator. | MemberCollaborationContext; RootCollaborationRun; CollaborationExecutionIndex; AgentRun | RootCollaborationRun | Address parser, LLM instruction renderer, communication persistence. |
| DS-005 | Delegation authorizes the current Agent identity, finds the exact host scope and configured target, prepares a fresh task execution, durably commits tree plus task record, then activates ingress. Task Team descendants remain task lineage. | TaskDelegationService; HostScope; TaskExecution; Task TeamRun/AgentRun | RootCollaborationRun task boundary | Run-ID allocation, reference files, system messages, settlement/review. |
| DS-006 | Every mutation commits one V3 root union through a strict store. Restore loads/repairs the current package, rebuilds current config and indexes, then materializes the correct root subject without consulting mutable definitions for topology. | RunExecutionTreeV3; RunStatePackage; RootCollaborationRun | Run persistence/history subsystem | Atomic writer, task/message correlation, memory layout, derived indexes. |
| DS-007 | Startup scans the complete approved population, stops before writes on a precondition violation, then backs up and promotes definitions and run packages item-by-item with a durable journal. No current service opens until the target rescan succeeds. | MigrationPlan; MigrationItem; Promoter; ReadinessGate | App-data migration subsystem | Filesystem locks, backup manifest, derived rebuild, operator diagnostics. |
| DS-008 | Root events are sequenced once, projected into the generic V3 collaboration stream, validated by the contracts package, and applied to one web collaboration execution view whose root discriminator controls labels/entry behavior. | Root event; Stream DTO; CollaborationExecutionView | Root event publisher / stream session | WebSocket recovery, generated types, UI selectors. |

## Spine Actors / Main-Line Nodes

- `AgentOrgDefinitionService` and `AgentTeamDefinitionService`: authoritative
  mutation/query boundaries for their respective definition subjects.
- `CollaborationTopologyPlanner`: compiles a validated immutable runtime plan
  from either root subject without allocating IDs before validation completes.
- `AgentOrgRunService` / `AgentTeamRunService`: subject-specific public launch
  owners; neither exposes the other's selector semantics.
- `CollaborationRunManager`: owns active/restored root registration and lifecycle
  for both root kinds.
- `RootCollaborationRun`: sole public operation boundary for one root aggregate.
- `AgentOrgRun`: configured Org root scope; may own direct Agent and Team handles,
  but no coordinator.
- `TeamRun`: actual Team execution; owns direct Agent handles and Team coordinator
  invariant, never a configured child Team.
- `RunExecutionTreeStore`: current V3 persistence boundary.
- `CollaborationExecutionView` (transport/web): immutable/read-model root union.
- `AgentOrgFlatTeamV3AppDataMigration`: exclusive historical conversion owner.

## Ownership Map

| Node | Owns | Does Not Own |
| --- | --- | --- |
| AgentOrgDefinitionService | Org candidate validation, direct ref resolution, Org handoff compilation inputs, atomic provider orchestration, catalog invalidation | Team mutation/copying, runtime IDs, migration decoding |
| AgentTeamDefinitionService | Agent-only membership, direct coordinator, Team-local handoffs, atomic provider orchestration | Org membership/handoffs, child Team discovery |
| CollaborationTopologyPlanner | Fixed-depth resolved topology, launch coverage, address placement, immutable IDs/config snapshot | Filesystem definition mutation, active lifecycle |
| AgentOrgRunService | Org launch input and exact entry semantics | Standalone Team coordinator semantics, application-owned Org authoring, low-level member materialization |
| AgentTeamRunService | Standalone Team launch/coordinator semantics | Org entry selection or Org membership |
| CollaborationRunManager | Root registration, restore/create/stop, readiness, root package construction | Definition authoring and GraphQL presentation |
| RootCollaborationRun | Aggregate authorization, task/communication/event sequencing, index, persistence correlation, lifecycle | Provider-specific Agent execution details or historical decoding |
| AgentOrgRun | Direct configured Agent/Team activation and Org root task host | Coordinator, configured grandchild Team |
| TeamRun | Direct Agents, direct coordinator, Team task host, task children | Configured Team membership or Org-wide source resolution |
| CollaborationExecutionIndex | Derived immutable address/run/host lookup over validated V3 | Lifecycle mutation or fallback discovery |
| V3 migration | V2/config classification, transformation, backup, promotion, old physical layout | Normal reads, feature behavior, deep conversion |
| Web AgentOrg/Team authoring stores | Subject-specific form/query/mutation state | Shared live run event ownership |
| Web collaboration run store/view | Generic V3 active/history execution state keyed by root ID and subject kind | Definition mutation rules |

## Thin Entry Facades / Public Wrappers

| Facade / Entry Wrapper | Governing Owner Behind It | Why It Exists | Must Not Secretly Own |
| --- | --- | --- | --- |
| GraphQL `AgentOrgDefinitionResolver` | AgentOrgDefinitionService | Transport mapping/errors | Definition validation or filesystem writes |
| GraphQL `AgentTeamDefinitionResolver` | AgentTeamDefinitionService | Transport mapping/errors | Org/Team policy or provider access |
| GraphQL `AgentOrgRunResolver` | AgentOrgRunService | Typed Org launch/restore/terminate API | Entry fallback or direct manager internals |
| GraphQL `AgentTeamRunResolver` | AgentTeamRunService | Typed Team launch/restore/terminate API | Org semantics |
| Collaboration WebSocket handler | RootCollaborationRun and event publisher | Session/DTO framing and recovery | Task, message, or lifecycle state |
| Agent management tools for Org/Team | Subject-specific definition services | Agent-callable transport and serialization | Alternate validation or compatibility parsing |

## Removal / Decommission Plan (Mandatory)

| Item To Remove / Decommission | Why It Becomes Unnecessary | Replaced By Which Owner / File / Structure | Scope | Notes |
| --- | --- | --- | --- | --- |
| Recursive `TeamMember.refType: agent_team` in AgentTeam inputs/config | Team is Agent-only. | Flat AgentTeam member type/config/validator | In This Change | Unsupported extra/member kind fails with offending placement. |
| `team-definition-graph-resolver.ts` and recursive graph validator | No configured Team recursion exists. | AgentOrg fixed-depth resolver + flat Team validator | In This Change | Do not leave a recursive utility callable by import/launch. |
| Recursive `TeamHandoffCompiler.visit` | Team-local rules need one mount rebase only. | `CollaborationHandoffCompiler` | In This Change | Org and Team rules merge once with duplicate/self checks. |
| Team-local Team discovery/source ownership under a Team | A Team cannot own Team members. | AgentOrg-owned Team discovery under `agent-orgs/<id>/agent-teams` | In This Change | Team-local Agents remain valid. |
| Recursive configured Team planner/index/config types | Fixed-depth root union makes recursion invalid. | `CollaborationTopologyPlanner` and discriminated config nodes | In This Change | Recursive task types remain. |
| `RootTeamRun` as generic root and `AgentTeamRunManager` as both-root owner | AgentOrg is not a Team. | `RootCollaborationRun` and `CollaborationRunManager` | In This Change | `TeamRun` remains for actual Teams. |
| `getOrCreateConfiguredChildTeam` on TeamRun/backend | Team cannot have configured Team child. | AgentOrgRun direct Team materializer | In This Change | Task Team preparation remains on TeamRun. |
| `AgentTeamAddress` and recursive Team-specific LLM address text | Same scope can now be an Org or standalone Team. | `CollaborationAddress` and root-kind-aware renderer | In This Change | Wire address strings remain identical/canonical. |
| Normal V2 schema/store reader and `team_run_execution_tree.json` | Native state is V3 only. | V3 `RunExecutionTreeStore`; isolated migration decoder | In This Change | Remove source file after successful per-package promotion. |
| Runtime `memory/agent_teams` and `team_run_history_index.json` ownership | Root may be Org. | `memory/collaboration_runs`; generic history index | In This Change | Historical migration modules may mention old paths only. |
| `root_team`, `root_team_run_id`, schema 2 stream view | External stream must be truthful. | V3 generic root/`root_run_id` contracts | In This Change | Regenerate all clients; no fallback parser. |
| Team form Team selector, nested-Team detail/count/warnings, recursive configured launch tree | Flat Team authoring cannot advertise Teams. | Agent-only Team form plus separate AgentOrg form | In This Change | History still renders task Team lineage distinctly. |
| Nested configured-Team tests/fixtures/docs as supported behavior | They assert rejected target behavior. | Org fixed-depth and rejection/migration cases | In This Change | Convert `nested-classroom-test` into AgentOrg + flat child Team coverage. |
| Parallel `.js` source tests mirroring `.ts` Team definition/tool tests where stale generated copies exist | They can preserve old inputs and drift. | Canonical TypeScript tests/build output | In This Change | Verify repository test convention before deletion; do not edit generated copies as source. |

## Return Or Event Spine(s)

- **DS-008 active event:** `AgentRun/TaskDelegation/Communication -> configured scope backend -> RootCollaborationRun event publisher -> Collaboration WebSocket projector -> @autobyteus/collaboration-stream-contracts validation -> CollaborationStreamingService -> CollaborationExecutionView -> workspace/history components`.
- **Definition result:** `Provider atomic commit -> DefinitionService -> GraphQL result/cache refetch -> AgentOrg/AgentTeam store -> catalog/detail form`.
- **Migration result:** `Per-item disposition -> app-data migration summary/ledger -> app migration GraphQL/status UI -> operator retry or readiness release`.

## Bounded Local / Internal Spines

- **DS-009, parent owner `CollaborationHandoffCompiler`:**
  `Validate flat Team handoffs -> rebase at direct Team mount -> validate Org handoffs -> resolve fixed-depth endpoints -> resolve Team target coordinator for self-check -> deduplicate ordered edges -> freeze snapshot`.
  It matters because Team reuse requires local rules to remain unchanged while
  Org rules connect mounted peers without recursive compilation.
- **DS-010, parent owner `AgentOrgFlatTeamV3AppDataMigration`:**
  `DISCOVER -> PREFLIGHTED -> BACKED_UP -> STAGED -> PROMOTED -> VALIDATED -> RECORDED`.
  A process crash may resume only from journal-observed states; runtime cannot
  enter between them.
- **Root persistence commit loop, parent owner `RootCollaborationRun`:**
  `Prepare against current snapshot -> atomically write V3/tree or task record -> commit live state after durability -> publish sequenced event`; it preserves the current fail-stop rule and prevents live/durable divergence.

## Off-Spine Concerns Around The Spine

| Off-Spine Concern | Related Spine ID(s) | Serves Which Owner | Responsibility | Why It Exists | Risk If Misplaced On Main Line |
| --- | --- | --- | --- | --- | --- |
| Definition source discovery/codecs | DS-001, DS-007 | Definition services/migration | Locate shared, Org-owned, and application-owned Markdown/config sources and serialize exact subject shapes. | Physical packaging varies by owner. | Provider details would leak into domain validation. |
| Definition identity allocation | DS-001, DS-007 | Definition providers/migration | Preserve current IDs and allocate stable new IDs, including opaque migrated local IDs. | History/progressive reuse depend on identity. | Planner or UI could copy/rename Teams. |
| Address parser | DS-003-DS-005, DS-009 | Topology/compiler/root resolver | Canonical rooted parsing and fixed-depth placement checks. | Shared contract across definition/runtime/transport. | Each caller would apply inconsistent fallback/depth policy. |
| Workspace/runtime catalog activation | DS-002, DS-003 | Run services/planner | Resolve workspace and runtime/model choices before activation. | Existing launch behavior must remain. | Root aggregate would mix external setup with lifecycle. |
| Identity allocators | DS-002, DS-003, DS-005 | Planner/task service | Allocate root, Team, and Agent execution IDs only after validation. | Prevent partial identity side effects. | Resolver/transport could allocate during validation. |
| Package validation/atomic writer | DS-006, DS-007 | Persistence/migration | Strict cross-file correlation and durable promotion. | Tree/tasks/messages must agree. | Runtime service would contain historical/file-commit branches. |
| History/index projection | DS-006-DS-008 | Root persistence/web | Build generic root rows and execution rows from V3. | Derived views are rebuildable and should not be authorities. | History could reinterpret mutable definitions. |
| Application-owned Team validation | DS-001, DS-002 | Application bundle/Team definition owners | Enforce Agent-only Team membership for application-owned Team sources and preserve their standalone launch behavior. | Application bundles are an existing Team definition boundary. | App parsing could retain a recursive Team loophole. |
| LLM collaboration instruction renderer | DS-004, DS-005 | Member context | Explain actual root kind, fixed-depth examples, and tools. | Agents must not be taught recursive Teams. | Core resolver would own prose/presentation. |
| UI localization/presentation | DS-001-DS-003, DS-006 | Web authoring/workspace | Subject-correct labels, errors, and hierarchy. | No prototype is needed, but semantic truth is. | Stores/domain could absorb visual choices. |

## Ownership Boundaries

The definition boundary ends after a validated immutable definition/reference
graph is available; launch planning must not read raw files or call providers.
The planner owns the immutable execution plan but not active state. The root
manager is the only active/restored aggregate registry. `RootCollaborationRun`
is the sole operation boundary for task, message, command, platform-binding,
snapshot, and lifecycle operations; callers must not combine it with an
internal AgentOrgRun/TeamRun manager or persistence store.

AgentOrgRun and TeamRun share provider mechanics but not invariants. The former
may materialize direct configured Teams and has no coordinator API. The latter
has one coordinator and cannot materialize a configured Team. Recursive task
Team factories are explicitly task-owned and cannot be used to add configured
members.

Current persistence stores accept only V3. The migration boundary alone may
read V2/old definition files or old physical directories. History and UI read
the durable run snapshot and subject discriminator; they do not re-resolve
current definitions to reinterpret old runs.

## Boundary Encapsulation Map

| Authoritative Boundary | Internal Owned Mechanism(s) It Encapsulates | Upstream Callers That Must Use The Boundary | Forbidden Bypass Shape | If Boundary API Is Too Thin, Fix By |
| --- | --- | --- | --- | --- |
| AgentOrgDefinitionService | Resolver, Org provider, ref lookup, compiler orchestration | GraphQL, tools, package sync/import, UI backend | Caller writes Org files then asks validator to roll back | Add candidate/preview/validate methods to service before exposing provider. |
| AgentTeamDefinitionService | Flat validator, Team provider, local-Agent resolver | GraphQL, tools, package sync/import, application bundle | Import/converter accepts `agent_team` then relies on launch rejection | Strengthen subject-specific input and service error contract. |
| AgentOrgRunService / AgentTeamRunService | Planner invocation, typed input normalization, manager call, catalog record | GraphQL, application orchestration, external channels | Caller invokes planner and manager/store directly | Add explicit subject-specific launch/restore method. |
| CollaborationRunManager | root factory, readiness, active registry, restore package loader | Run services, WebSocket session resolver | API uses manager plus persistence store/index | Add query/lifecycle method to manager/root. |
| RootCollaborationRun | index, task service, communication service, internal scope resolver, persistence coordinator, event publisher | Tools, stream handler, command/task/history live projections | Caller uses root and internal TeamRun/AgentRun manager together | Expose the required operation on root with exact identity. |
| RunExecutionTreeStore | V3 schema/atomic writer/path | persistence coordinator, package loader, migration target validator | Runtime reads JSON or V2 decoder directly | Add strict V3 store method. |
| CollaborationExecutionView (web) | tree selectors, context factory, event reducer | workspace/history/running components | Components parse raw union and use Team-only stores | Add root-kind-aware selector/computed API. |

## Dependency Rules

1. Transport/adapters -> subject-specific application services -> domain
   definition/planner/root boundaries -> provider/persistence mechanisms.
2. AgentOrg definition may reference AgentTeam definition identity through the
   AgentTeam query boundary; it may not mutate, clone, or depend on Team provider
   internals.
3. The collaboration compiler depends on resolved topology types, addresses,
   and handoff contracts, not file providers or GraphQL types.
4. AgentTeam definition code must not import AgentOrg membership types to make
   Team nodes generic. AgentOrg may import the public Team definition query
   interface.
5. Root execution may depend on strict V3 domain types; V3 current code must not
   import migration V2 types.
6. AgentOrgRun may own direct TeamRun handles. TeamRun may own task TeamRun
   handles, but never configured TeamRun handles.
7. Task code uses generic `rootRunId`/host-scope domain identities. Versioned
   task/message codecs may retain approved existing on-disk field names such as
   `rootTeamRunId`, but those names do not leak back into current Org ownership.
8. GraphQL and WebSocket projectors map domain -> transport only. The web client
   consumes generated/contract types; it does not infer subject from member
   depth or missing coordinator.
9. History projections depend on V3 snapshots and indexes, not mutable
   definitions. Definition deletion/change cannot rewrite historical subject.
10. Migration may depend on both old isolated codecs and current strict
    validators; current services cannot depend on migration.

Forbidden shortcuts:

- No `AgentOrgDefinition extends AgentTeamDefinition` with optional coordinator.
- No root type with mostly optional Org/Team fields; use a discriminator union.
- No recursive generic `members` type for configured Team nodes.
- No V2/V3 branch in the normal store, planner, root manager, stream projector,
  or web reducer.
- No implicit default Org entry, global address lookup, Team-definition copy,
  or direct UI filesystem mutation.
- No application/external-channel path bypassing the subject-specific run
  service.

## Interface Boundary Mapping

| Interface / API / Query / Command / Method | Subject Owned | Responsibility | Accepted Identity Shape(s) | Notes |
| --- | --- | --- | --- | --- |
| `AgentOrgDefinitionService.create/update/get/list` | AgentOrg definition | Validate/persist/query Org and direct refs | `agentOrgDefinitionId`; Org member refs with explicit kind/scope | No coordinator field. |
| `AgentTeamDefinitionService.create/update/get/list` | AgentTeam definition | Validate/persist/query flat Team | `agentTeamDefinitionId`; Agent refs only | Coordinator resolves one direct Agent. |
| `CollaborationHandoffCompiler.compileOrg/compileTeam` | Handoff snapshot | Compile fixed-depth effective edges | Resolved Org topology or flat Team | One owner, two explicit subject entry methods. |
| `AgentOrgRunService.create({agentOrgDefinitionId, entryAddress, ...})` | AgentOrg root launch | Validate exact entry and create Org run | compound `{subjectKind:'agent_org', definitionId}` plus CollaborationAddress | Returns `{agentOrgRunId, entryAgentRunId}`. |
| `AgentTeamRunService.create({agentTeamDefinitionId, ...})` | standalone Team root launch | Create Team and coordinator ingress | compound `{subjectKind:'agent_team', definitionId}` | Returns `{teamRunId, entryAgentRunId}`. |
| `CollaborationRunManager.restore({rootRunId, expectedSubjectKind})` | persisted root | Restore exact V3 root | `{rootRunId, expectedSubjectKind}` | Type mismatch fails, never coerces. |
| `RootCollaborationRun.resolveRecipient(address)` | active configured target | Same-root exact resolution | canonical non-root `CollaborationAddress` | Team returns coordinator ingress. |
| `RootCollaborationRun.delegateTask(identity,input)` | task lifecycle | Authorize, prepare, commit, activate fresh execution | exact root member identity + mounted address | No definition/global selector. |
| `RunExecutionTreeStore.read/write(rootDir, rootRunId)` | durable V3 tree | Strict current schema persistence | physical root path + exact root ID | V3 only. |
| GraphQL `agentOrgDefinitions`, `createAgentOrgDefinition`, `createAgentOrgRun` | Org external contract | Catalog/author/launch Org | Org-specific inputs/results | Separate from Team API. |
| GraphQL `agentTeamDefinitions`, `createAgentTeamDefinition`, `createAgentTeamRun` | Team external contract | Catalog/author/launch Team | Team-specific inputs/results | Team member input has no Team kind. |
| Collaboration stream handshake/snapshot | active root view | Stream generic V3 root and sequenced events | `{rootRunId, subjectKind}` | Contract package validates root union. |
| Existing application Team resource ref | application launch resource | Continue selecting a flat AgentTeam | `{refType:'agent_team', definitionId}` | Route through AgentTeamRunService; no AgentOrg application resource is added in this round. |

## Interface Boundary Check

| Interface | Responsibility Is Singular? | Identity Shape Is Explicit? | Ambiguous Selector Risk | Corrective Action |
| --- | --- | --- | --- | --- |
| AgentOrg definition service/API | Yes | Yes | Low | Reject coordinator and nested Org fields at input schema. |
| AgentTeam definition service/API | Yes | Yes | Low | Remove member-kind enum; Agent-only type. |
| Subject-specific run services | Yes | Yes | Low | Keep common mechanics behind manager, not a public generic `create(any)`. |
| Root collaboration manager | Yes | Yes | Low | Require `expectedSubjectKind` on subject-specific restore paths. |
| Recipient resolver | Yes | Yes | Low | Canonical parser + immutable root index; reject `/` and invalid depth. |
| Application resource launch | Yes | Yes | Medium | Add explicit `refType`/`entryAddress`; do not infer from definition lookup order. |
| History/open route | Yes | Yes | Low | Row carries `subjectKind` and `rootRunId`. |

## Main Domain Subject Naming Check

| Node / Subject | Current / Proposed Name | Natural And Self-Descriptive? | Naming Drift Risk | Corrective Action |
| --- | --- | --- | --- | --- |
| Multi-Team composition | `AgentTeamDefinition` / `AgentOrgDefinition` | Yes (proposed) | Low | Delete recursive Team representation. |
| Flat work unit | `AgentTeamDefinition` / same, Agent-only | Yes | Low | Do not introduce `FlatTeam`. |
| Generic root aggregate | `RootTeamRun` / `RootCollaborationRun` | Yes | Low | TeamRun remains only for actual Team. |
| Generic durable tree | `TeamRunExecutionTreeFileV2` / `RunExecutionTreeFileV3` | Yes | Low | Root discriminator supplies subject. |
| Logical address | `AgentTeamAddress` / `CollaborationAddress` | Yes | Low | Wire format remains rooted string. |
| Root manager | `AgentTeamRunManager` / `CollaborationRunManager` | Yes | Low | Subject-specific creation stays in services. |
| Org-local source scope | `team_local` for nested Team / `agent_org_owned` | Yes | Medium due old opaque IDs | Keep old encoded values isolated as identity strings; new domain scope is truthful. |

## Existing Capability / Subsystem Reuse Check

| Need / Concern | Existing Capability Area / Subsystem | Decision | Why | If New, Why Existing Areas Are Not Right |
| --- | --- | --- | --- | --- |
| Org definition persistence | AgentTeam definition provider patterns + package roots | Create New subject, reuse provider primitives | Org has distinct invariant/files and no coordinator; common Markdown/atomic utilities are reusable. | Team service cannot own Org without recreating conflation. |
| Fixed-depth topology/handoffs | `agent-collaboration` + current graph/compiler | Extend | Addresses/handoff records and compiler checks already fit. | N/A |
| Root execution | `agent-team-execution` mixed runtime | Refactor/Rename existing | Member activation, task, message, event, fail-stop, termination mechanisms are reusable. | Parallel Org runtime would duplicate state/coordination. |
| Strict V3 persistence | current execution-tree schema/store/writer | Extend and rename | Same envelope/child/task records and atomic writer. | Separate Org store is forbidden. |
| Migration | app-data migrations | Extend | Existing registry, ledger, status, backups, and startup ordering pattern. | Ad hoc startup compatibility is unsafe. |
| History/memory | current Team run history and Agent memory layout | Extend and rename root owner | Same data, generic subject needed. | Parallel Org history would fragment workspace. |
| Stream | team stream contracts/projector | Refactor/Rename existing | Same events/tasks/messages; root view needs union. | Two sockets would duplicate live state. |
| Web live workspace | Team execution stores/services/components | Extract generic owner | Same communication/task/event interaction applies to both roots. | Duplicated Org workspace store would diverge. |
| Org authoring UI | Agent Team authoring | Create New subject-specific UI, reuse form primitives | Member libraries and coordinator behavior differ materially. | One form with conditional fields risks invalid mixed state. |

## Subsystem / Capability-Area Allocation

| Subsystem / Capability Area | Owns Which Concerns | Related Spine ID(s) | Governing Owner(s) Served | Decision | Notes |
| --- | --- | --- | --- | --- | --- |
| AgentOrg Definition | Org domain/config/source/ref validation/catalog | DS-001, DS-007 | AgentOrgDefinitionService | Create New | May query Team definitions, never mutate them. |
| AgentTeam Definition | Flat Team and direct coordinator/local Agent source | DS-001, DS-002 | AgentTeamDefinitionService | Refactor Existing | Remove Team-local Team ownership. |
| Agent Collaboration | address, handoff records/compiler, member collaboration contract | DS-003, DS-004, DS-009 | Planner/RootCollaborationRun | Extend | Root-kind-aware prose and fixed-depth compiler. |
| Collaboration Execution | root union config/runtime/index/lifecycle/tasks/events | DS-002-DS-006, DS-008 | Run services/RootCollaborationRun | Refactor/Rename Existing | TeamRun remains a specialized local execution. |
| Run Persistence/History/Memory | V3 store, package, generic physical layout/index | DS-006-DS-008 | Root manager/history | Refactor Existing | Derived catalogs rebuild. |
| App Data Migration | exact old-shape conversion and promotion | DS-007, DS-010 | Startup readiness | Extend Existing | Sole V2/recursive-config owner. |
| GraphQL/Application Integration | subject-specific public Org/Team definitions/launch; existing flat application Team resources | DS-001-DS-003, DS-006 | Definition/run services | Extend Existing | No provider/manager bypass; no new application-owned Org surface. |
| Collaboration Stream Contracts | V3 root DTO, messages/tasks/events | DS-008 | Stream projector/web client | Refactor/Rename Existing Package | One generic stream. |
| Web Definition Authoring | separate Org and Team catalogs/forms/details | DS-001-DS-003 | Definition APIs | Create/Refactor | Shared visual primitives only. |
| Web Collaboration Workspace | live/history state, selectors, stream hydration, configuration | DS-002-DS-006, DS-008 | V3 transport | Refactor/Rename Existing | Root discriminator drives subject behavior. |

## Draft File Responsibility Mapping

| Candidate File | Owning Subsystem | Owner / Boundary | Concrete Concern | Why This Is One File | Reuses Shared Structure? |
| --- | --- | --- | --- | --- | --- |
| `agent-org-definition/domain/agent-org-definition.ts` | AgentOrg Definition | AgentOrgDefinition | Org metadata/direct member/handoff model | One domain subject | Collaboration handoff, launch default |
| `agent-team-definition/domain/agent-team-definition.ts` | AgentTeam Definition | AgentTeamDefinition | Agent-only Team/coordinator model | One domain subject | Agent member ref, handoff |
| `agent-collaboration/definition/resolved-collaboration-topology.ts` | Agent Collaboration | resolved topology | Discriminated fixed-depth resolved root | Shared compiler/planner input | Yes |
| `agent-collaboration/definition/collaboration-handoff-compiler.ts` | Agent Collaboration | compiler | Team local rebase + Org edge compile | One ordered policy | Yes |
| `agent-collaboration-execution/domain/collaboration-run-config.ts` | Collaboration Execution | immutable plan | Root config union and flat Team nodes | One runtime config authority | launch config/address |
| `agent-collaboration-execution/domain/run-execution-tree.ts` | Run Persistence | V3 domain contract | Root union + reused nodes/tasks | One durable schema family | Yes |
| `agent-collaboration-execution/domain/root-collaboration-run.ts` | Collaboration Execution | root aggregate | public operations/state/lifecycle | Sole root boundary | execution index/tasks/events |
| `agent-collaboration-execution/services/collaboration-topology-planner.ts` | Collaboration Execution | planner | validated topology to IDs/config | One plan compiler | resolved topology |
| `run-history/store/run-execution-tree-schema.ts` | Persistence | V3 validator | exact keys and invariants | One current schema | V3 types/address |
| `app-data-migrations/.../run-execution-tree-v2-to-v3-transformer.ts` | Migration | historical transformer | deterministic V2 -> V3 only | Old knowledge isolated | current validator target |
| `autobyteus-collaboration-stream-contracts/src/run-execution-view-dtos.ts` | Stream contract | DTO schema | V3 external root union | One wire authority | configured/task DTOs |
| `autobyteus-web/stores/agentOrgDefinitionStore.ts` | Web authoring | Org state | Org query/mutation/cache | Subject-specific state | generated GraphQL |
| `autobyteus-web/stores/collaborationRunStore.ts` | Web workspace | root live state | connect/open/command lifecycle | Shared execution owner | collaboration view |

## Reusable Owned Structures Check

| Repeated Structure / Logic | Candidate Shared File | Owning Subsystem | Why Shared | Redundant Attributes Removed? | Overlapping Representations Removed? | Must Not Become |
| --- | --- | --- | --- | --- | --- | --- |
| Root definition topology for compiler/planner | `resolved-collaboration-topology.ts` | Agent Collaboration | Org and standalone Team both compile handoffs/plans | Yes | Yes | Generic recursive tree |
| Canonical rooted addresses | `collaboration-address.ts` | Agent Collaboration | Definition/runtime/transport use one parser | Yes | Yes | Global run locator |
| V3 configured/task records | `run-execution-tree.ts` | Persistence | Both root variants reuse exact nodes/tasks | Yes | Yes | Two schema families or optional-field blob |
| Runtime root config | `collaboration-run-config.ts` | Collaboration Execution | Planner, builder, root manager share immutable plan | Yes | Yes | `AgentOrgDefinition extends AgentTeamDefinition` |
| Launch configuration | existing launch-preferences / config type | Launch/Execution | Same defaults per root/team/agent | Yes | Yes | Coordinator semantics |
| V3 transport root | collaboration stream DTO | Stream | Server/web share exact wire schema | Yes | Yes | Client-inferred union |
| Web execution selectors/reducer | `services/collaborationExecution/**` | Web Workspace | Org/Team live/history actions are the same after root discrimination | Yes | Yes | Definition authoring policy owner |

## Shared Structure / Data Model Tightness Check

| Shared Structure / Type / Schema | One Clear Meaning Per Field? | Redundant Attributes Removed? | Parallel / Overlapping Representation Risk | Corrective Action |
| --- | --- | --- | --- | --- |
| `AgentOrgDefinition` | Yes | Yes | Low | No coordinator or inherited Team fields. |
| `AgentTeamDefinition` | Yes | Yes | Low | Agent-only member type; no redundant Team member kind. |
| `CollaborationResolvedRoot` union | Yes | Yes | Low | Discriminator and variant-specific coordinator. |
| `CollaborationRunConfig` root union | Yes | Yes | Low | Team node member type is Agent-only. |
| `RunExecutionTreeFileV3` | Yes | Yes | Low | Root-only discriminator; reuse child/task records; exact schemas. |
| Domain `rootRunId` vs on-disk task `rootTeamRunId` | Yes at each boundary | N/A (on-disk shape approved unchanged) | Medium | Confine old field spelling to versioned codec/record modules; map once at persistence boundary. |
| Migrated Org-owned definition ID | Yes (opaque identity) | N/A | Medium | Source index owns the mapping; do not parse its historical prefix as topology. |

## Final File Responsibility Mapping

| File | Owning Subsystem | Owner / Boundary | Concrete Concern | Why This Is One File | Reuses Shared Structure? |
| --- | --- | --- | --- | --- | --- |
| `autobyteus-server-ts/src/agent-org-definition/domain/agent-org-definition.ts` | AgentOrg Definition | AgentOrgDefinition | Org metadata, direct members, handoffs, defaults, ownership | One subject invariant | Yes |
| `.../agent-org-definition/providers/agent-org-definition-config.ts` | AgentOrg Definition | config codec | Strict `org-config.json` normalization/build | One physical contract | handoffs/defaults |
| `.../agent-org-definition/providers/file-agent-org-definition-provider.ts` | AgentOrg Definition | provider | shared/Org-owned/application source reads and atomic writes | One I/O owner | store utilities |
| `.../agent-org-definition/services/agent-org-definition-resolver.ts` | AgentOrg Definition | resolver | Fixed direct Agent/Team ref resolution, names, depth | One topology boundary | Team query interface |
| `.../agent-org-definition/services/agent-org-definition-service.ts` | AgentOrg Definition | public owner | validate-before-write CRUD/catalog | One authoritative boundary | resolver/compiler/provider |
| `.../agent-team-definition/domain/agent-team-definition.ts` | AgentTeam Definition | Team subject | Agent-only members and coordinator | One subject invariant | handoffs/defaults |
| `.../agent-team-definition/services/agent-team-definition-service.ts` | AgentTeam Definition | public owner | flat validate-before-write CRUD/catalog | One authoritative boundary | provider/compiler |
| `.../agent-collaboration/domain/collaboration-address.ts` | Agent Collaboration | address contract | Canonical string parse/build/rebase/depth helpers | One shared identity format | N/A |
| `.../agent-collaboration/definition/collaboration-handoff-compiler.ts` | Agent Collaboration | compiler | Compile standalone Team or Org+mounted Team rules | One ordered edge policy | resolved topology |
| `.../agent-collaboration-execution/domain/collaboration-run-config.ts` | Collaboration Execution | runtime config | Root discriminated union, Agent/Team nodes, launch projections | One immutable plan authority | address/launch/handoffs |
| `.../agent-collaboration-execution/domain/run-execution-tree.ts` | Persistence domain | V3 contract | Generic envelope/root union/reused member/task records | One logical family | address/launch |
| `.../agent-collaboration-execution/domain/root-collaboration-run.ts` | Collaboration Execution | root aggregate | public live operations and snapshot ownership | One aggregate boundary | services below |
| `.../agent-collaboration-execution/domain/agent-org-run.ts` | Collaboration Execution | Org local run | direct Agent/Team handles, no coordinator | Variant-specific behavior | configured-scope backend |
| `.../agent-collaboration-execution/domain/team-run.ts` | Collaboration Execution | Team local run | direct Agents/coordinator/task children | Variant-specific behavior | configured-scope backend |
| `.../agent-collaboration-execution/services/collaboration-topology-planner.ts` | Collaboration Execution | planner | fixed-depth plan and ID allocation after validation | One plan compiler | resolved definitions |
| `.../agent-collaboration-execution/services/collaboration-execution-index.ts` | Collaboration Execution | derived index | configured fixed depth + recursive task host/run lookup | One immutable index | V3 types |
| `.../agent-collaboration-execution/services/collaboration-recipient-resolver.ts` | Collaboration Execution | recipient policy | same-root exact Agent/Team ingress resolution | One routing policy | address/index |
| `.../agent-collaboration-execution/services/collaboration-run-manager.ts` | Collaboration Execution | root registry | create/restore/stop/readiness | One process owner | root factory/package loader |
| `.../agent-collaboration-execution/services/agent-org-run-service.ts` | Collaboration Execution | Org app service | typed launch/entry/application behavior | Subject-specific boundary | planner/manager |
| `.../agent-collaboration-execution/services/agent-team-run-service.ts` | Collaboration Execution | Team app service | typed standalone launch/coordinator behavior | Subject-specific boundary | planner/manager |
| `.../run-history/store/run-execution-tree-schema.ts` | Persistence | strict V3 schema | exact keys/root conditional/fixed depth/task correlation | One current validator | V3 types |
| `.../run-history/store/run-execution-tree-store.ts` | Persistence | V3 store | generic filename and atomic current read/write | One current I/O boundary | schema/writer |
| `.../app-data-migrations/migrations/agent-org-flat-team-v3/*` | Migration | historical owner | plan/old codecs/transform/promote/recover | Separate files by concern within one migration | current target validators |
| `.../api/graphql/types/agent-org-definition.ts` | GraphQL | Org transport | Org queries/mutations/types | One subject surface | Org service |
| `.../api/graphql/types/agent-team-definition.ts` | GraphQL | Team transport | flat Team queries/mutations/types | One subject surface | Team service |
| `.../api/graphql/types/agent-org-run.ts` | GraphQL | Org launch transport | create/restore/terminate typed results | One subject surface | Org run service |
| `.../api/graphql/types/agent-team-run.ts` | GraphQL | Team launch transport | standalone Team lifecycle | One subject surface | Team run service |
| `autobyteus-collaboration-stream-contracts/src/run-execution-view-dtos.ts` | Stream contract | V3 wire | generic root union and reused node/task DTOs | One current schema | zod helpers |
| `autobyteus-server-ts/src/services/agent-streaming/collaboration-execution-view-projector.ts` | Stream adapter | projector | V3 domain -> wire mapping | One adapter | stream DTO |
| `autobyteus-web/stores/agentOrgDefinitionStore.ts` | Web authoring | Org state | Org catalog/CRUD | Subject-specific | GraphQL |
| `autobyteus-web/stores/agentTeamDefinitionStore.ts` | Web authoring | Team state | flat Team catalog/CRUD | Subject-specific | GraphQL |
| `autobyteus-web/stores/collaborationRunStore.ts` | Web workspace | live root state | subject-generic open/connect/input/stop/recovery | One active execution owner | V3 view/stream |
| `autobyteus-web/services/collaborationExecution/collaborationExecutionViewState.ts` | Web workspace | immutable view | V3 root union selectors/event reduction | One read-model owner | generated contracts |

## Applied Patterns

- **Discriminated root union:** AgentOrg and AgentTeam share the generic envelope
  but keep coordinator/member invariants variant-specific.
- **Immutable topology snapshot:** launch compiles the current definitions once;
  restore uses the durable snapshot rather than mutable definitions.
- **Thin subject-specific facade over shared mechanics:** Org/Team APIs and run
  services remain truthful while sharing planner/root/persistence internals.
- **Validate-plan-promote:** definitions and migration validate all semantic
  facts before atomic write/promotion.
- **Current-schema runtime plus isolated migration:** V2 is historical input only.
- **Derived immutable index:** addresses, host ancestry, and run IDs are indexed
  from a validated V3 tree; no fallback discovery.

## Target Subsystem / Folder / File Mapping

| Path | Kind | Owner / Boundary | Responsibility | Why It Belongs Here | Must Not Contain |
| --- | --- | --- | --- | --- | --- |
| `autobyteus-server-ts/src/agent-org-definition/` | Folder | AgentOrg Definition | New Org domain/provider/service/source ownership | Distinct product subject | runtime managers, Team mutation |
| `autobyteus-server-ts/src/agent-team-definition/` | Folder | AgentTeam Definition | Contract to Agent-only Team and direct coordinator | Existing subject remains | Org members, recursive resolver |
| `autobyteus-server-ts/src/agent-collaboration/definition/` | Folder | Agent Collaboration | resolved topology and handoff compile policy | Existing address/handoff capability | file I/O, active runs |
| `autobyteus-server-ts/src/agent-collaboration-execution/` | Folder | Collaboration Execution | Move/refactor current `agent-team-execution` root/runtime/task capability | Root may be Org or Team | definition CRUD, V2 migration types |
| `.../agent-collaboration-execution/backends/mixed/` | Folder | provider/local execution | Reuse current mixed Agent/Team mechanics with Org-vs-Team specialization | Provider mechanics remain cohesive | public root orchestration, configured Team recursion in TeamRun |
| `autobyteus-server-ts/src/run-history/store/run-execution-tree-*.ts` | Files | Persistence | V3 generic path/schema/store | Current run history owns durable root package | V2 decoding |
| `autobyteus-server-ts/src/app-data-migrations/migrations/agent-org-flat-team-v3/` | Folder | Migration | All old definition/V2/layout knowledge | Explicit historical boundary | imports from current business code into old codecs |
| `autobyteus-server-ts/src/api/graphql/types/agent-org-*.ts` | Files | GraphQL Org adapter | Org definition/run catalog and mutations | Truthful external subject | Team coordinator defaults |
| `autobyteus-server-ts/src/api/graphql/types/agent-team-*.ts` | Files | GraphQL Team adapter | Flat Team definition/run API | Truthful Team subject | Team member enum containing Team |
| `autobyteus-server-ts/src/application-*/**` | Existing files | Application integration | Remove recursive Team assumptions and keep application-owned/resource Teams flat through AgentTeamRunService | Existing app owner | AgentOrg application authoring or raw provider/manager access |
| `autobyteus-server-ts/src/agent-packages/**` and `src/config/app-config.ts` | Existing files | package/config | Discover/count `agent-orgs`; expose target definition/run roots | Existing package/config authority | subject validation duplicates |
| `autobyteus-collaboration-stream-contracts/` | Folder/Package | Stream contract | Rename/migrate current Team stream package to generic V3 root contract | External contract now spans both roots | V2 union/fallback parser |
| `autobyteus-web/components/agentOrgs/` | Folder | Web Org authoring | Org list/detail/create/edit/member/handoff/entry UI | New subject-specific experience | coordinator control, copied Team definitions |
| `autobyteus-web/components/agentTeams/` | Folder | Web Team authoring | Agent-only Team list/detail/create/edit | Existing Team UX contracted | Team library/nested Team counts |
| `autobyteus-web/services/collaborationExecution/` | Folder | Web live/history domain | Rename/extract current `teamExecution` state/selectors/hydration | Shared root execution semantics | definition form policy |
| `autobyteus-web/components/workspace/collaboration/` | Folder | Web workspace | Generic execution tree, messages, tasks, overview | Both roots share runtime interactions | recursive configured hierarchy assumptions |
| `autobyteus-web/pages/agent-orgs.vue` | File | Web route | AgentOrg catalog/CRUD navigation | Distinct product surface | Team-specific views |
| `autobyteus-web/pages/agent-teams.vue` | File | Web route | Flat Team catalog/CRUD navigation | Preserve standalone Team path | nested Team navigation |
| Package sources: `agent-orgs/<org-id>/org.md`, `org-config.json`, optional `agents/`, `agent-teams/` | Physical contract | AgentOrg provider | Org metadata/config and owned definition sources | Truthful containment owner | nested AgentOrg; Team under Team |
| Package sources: `agent-teams/<team-id>/team.md`, `team-config.json`, optional `agents/` | Physical contract | AgentTeam provider | Reusable standalone flat Team | Preserves current Team development flow | `agent-teams/` child folder |
| Runtime: `<memory>/collaboration_runs/<rootRunId>/run_execution_tree.json` | Physical contract | V3 store | Generic root package authority | Root may be Org or Team | V2 file/root-Team schema |
| Runtime: `<memory>/collaboration_run_history_index.json` | Physical contract | history store | Derived generic root catalog | Truthful root union | authoritative topology/content |

### Files/Paths Deleted Or Renamed As A Unit

- Move/refactor `autobyteus-server-ts/src/agent-team-execution/**` to
  `autobyteus-server-ts/src/agent-collaboration-execution/**`; retain `team-run*`
  names only for files/classes whose subject is an actual Team execution.
- Rename `autobyteus-team-stream-contracts` and package imports to
  `autobyteus-collaboration-stream-contracts` / corresponding package name.
- Delete
  `agent-team-definition/services/team-definition-graph-resolver.ts`,
  `team-definition-graph-validator.ts`,
  `providers/team-local-team-discovery.ts`, and Team-ref resolution functions
  after the Org owners replace every call site.
- Rename current generic web runtime files/stores/services from `teamExecution`,
  `AgentTeamContext`, `TeamStreamingService`, and root-Team terminology to
  collaboration-run terminology. Keep Team-named authoring and actual Team
  execution presentation components where the subject is truly Team.
- Regenerate `autobyteus-web/generated/graphql.ts`; do not hand-maintain old
  recursive types.

## Folder Boundary Check

| Path / Folder | Intended Structural Depth | Ownership Boundary Is Clear? | Mixed-Layer Or Over-Split Risk | Justification / Corrective Action |
| --- | --- | --- | --- | --- |
| `agent-org-definition` | Main-Line Domain-Control + provider subfolder | Yes | Low | Domain/services/providers remain separated within one subject capability. |
| `agent-team-definition` | Main-Line Domain-Control + provider subfolder | Yes | Low | Flat Team remains independently owned. |
| `agent-collaboration/definition` | Off-Spine Concern | Yes | Low | Shared compile/address policy serves both definition roots. |
| `agent-collaboration-execution` | Main-Line Domain-Control with backend/task modules | Yes | Medium | Existing subsystem is large; preserve domain/services/backends/task subfolders rather than flattening. |
| `run-history/store` | Persistence-Provider | Yes | Low | Current schema/store separate from migration. |
| `app-data-migrations/.../agent-org-flat-team-v3` | Off-Spine Concern | Yes | Low | Historical knowledge is intentionally isolated by migration. |
| `autobyteus-collaboration-stream-contracts` | Transport | Yes | Low | No runtime/business logic. |
| Web `agentOrgs` / `agentTeams` | Mixed Justified (subject-specific presentation/state wrappers) | Yes | Low | Separate subject flows reduce conditional-form state. |
| Web `services/collaborationExecution` | Main-Line Domain-Control read model | Yes | Low | Generic live/history state stays out of presentation. |

## Concrete Examples / Shape Guidance

| Topic | Good Example | Bad / Avoided Shape | Why The Example Matters |
| --- | --- | --- | --- |
| Definition reuse | `AgentOrgMember {kind:'agent_team', ref:'software-engineering-team'}` -> query same Team definition; Org handoffs stored only in Org | Copy Team members/coordinator into Org config or create `OrgTeamDefinition` subtype | REQ-018 requires identity/history/standalone reuse. |
| Root V3 union | `{subjectKind:'agent_org', definitionId, runId, members}` or `{subjectKind:'agent_team', ..., coordinatorAddress, members: Agent[]}` | One root type with optional coordinator and recursive `members:any[]` | Conditional invariants stay type/schema-enforced. |
| Fixed depth | Org `/software_engineering_team/architecture_designer`; standalone Team `/architecture_designer` | `/department/team/subteam/agent` | Address contract and configured ownership are explicit. |
| Task host | Independent Org Agent delegates `/software_engineering_team`; fresh task Team is added to Org root `taskExecutions` and uses configured Team address | Add fresh task Team to Org `members` or assign a permanent `/task-team` address | Preserves PRE-005/configured-vs-task distinction. |
| Handoff compile | Team `/reviewer -> /implementer` rebases once to `/software_engineering_team/reviewer -> /software_engineering_team/implementer`; Org cross-Team edge merges afterward | Recursive compiler walks Team definitions indefinitely or Team local edge directly names an Org peer | Teams remain reusable standalone; Org owns cross-member workflow. |
| Migration | Preflight all 23/41 items, backup, atomic per-item promote, strict target rescan | Read V2 lazily in current store or flatten unknown depth during restore | Protects data and removes compatibility runtime. |
| API split | `createAgentOrgRun(definitionId, entryAddress)` and `createAgentTeamRun(definitionId)` over shared manager | `createGroupRun({definitionId})` infers kind and chooses first member | Subject and entry semantics remain explicit. |

## Backward-Compatibility Rejection Log (Mandatory)

| Candidate Compatibility Mechanism | Why It Was Considered | Rejection Decision | Clean-Cut Replacement / Removal Plan |
| --- | --- | --- | --- |
| Keep recursive Team definitions beside AgentOrg | Easier additive rollout | Rejected | Migrate known one-level roots to Org; Team inputs/config reject Team members everywhere. |
| Make coordinator optional on current root Team | Minimal type edit | Rejected | Discriminated AgentOrg/AgentTeam root union; coordinator absent/required by variant. |
| Parallel AgentOrg tree/store | Avoid refactoring Team runtime | Rejected | One `RunExecutionTreeFileV3` and `RootCollaborationRun`. |
| Normal store dual-read V2/V3 | Lazy migration convenience | Rejected | Startup migration gate; V3-only current store. |
| Preserve old Team stream/GraphQL fields with aliases | Client transition convenience | Rejected | One coordinated server/contracts/web cutover and generated clients. |
| Recursively flatten unexpected legacy definitions | Defensive compatibility | Rejected | PRE-002 violation before writes and operator-visible failure. |
| Keep `AgentTeamAddress` and recursive LLM wording | Wire strings are unchanged | Rejected | Rename semantic type/renderer; retain only canonical string format. |
| Copy Team definition on Org adoption | Simplifies local editing | Rejected | Reference same identity; Org owns only placement and Org handoffs. |
| Global Team lookup in `delegate_task` for standalone Team | Could manufacture standalone-to-Team tasks | Rejected | Same-root mounted address contract only; no approved cross-run/security behavior. |
| Leave `memory/agent_teams` as native location indefinitely | Avoid path migration | Rejected | Preflighted atomic move to `memory/collaboration_runs`; old path exists only in migration. |

## Derived Layering

As explanatory structure only:

1. **Transport/presentation:** GraphQL, collaboration WebSocket contracts,
   application adapters, Agent tools, web authoring/workspace.
2. **Application boundaries:** subject-specific definition services and run
   services; collaboration root manager/history services.
3. **Domain/control:** AgentOrg/AgentTeam definitions, resolved topology,
   planner, root aggregate, AgentOrgRun/TeamRun, address/handoff/task invariants.
4. **Provider/persistence:** file providers, mixed Agent execution backends,
   V3 tree/task/message stores, memory/history indexes.
5. **Migration boundary:** old config/V2/layout decoders and promoters; no
   upward dependency from current layers.

No higher layer may call both an application boundary and its internal provider
or manager.

## Change / Refactor Sequence

1. **Refresh and freeze the implementation base.** Rebase/merge the latest
   authorized `personal` into the task branch, verify worktree isolation, inspect
   any evolved dynamic-Team code, and reject recursive configured mutation per
   REQ-017. Do not modify approved requirement artifacts.
2. **Introduce subject-specific definition types and strict config codecs.** Add
   AgentOrg definition/source/service and contract AgentTeam members to Agents.
   Add fixed-depth resolved topology and collaboration compiler. Make create and
   update validate before any provider write. Keep old config parsing only in the
   future migration folder.
3. **Add current V3 domain/schema/store and generic physical paths.** Implement
   strict root union, fixed-depth configured invariant, recursive task invariant,
   generic store/history/memory layout, and package validation. Do not yet admit
   runtime until the manager is converted.
4. **Refactor the runtime root boundary.** Rename/extract collaboration execution,
   create `RootCollaborationRun`, `AgentOrgRun`, flat `TeamRun`, generic index and
   recipient resolver. Remove configured child-Team capability from TeamRun while
   preserving task Team factories, fail-stop persistence, messages, commands,
   events, stop, and restore.
5. **Replace planning and public run services.** Fixed-depth planner compiles both
   roots; subject-specific services own launch inputs. Add exact Org entry
   resolution and keep Team coordinator ingress. Update application/external
   channel routes to explicit subject kinds.
6. **Convert persistence/history/memory consumers.** Update task/message codecs at
   one boundary, package loader, memory location classifier/sync, model config,
   token/history projections, archive/delete, and live projection to generic
   root IDs/subject kind. Remove current-code `rootTeam` assumptions.
7. **Implement and register migration.** Place it after existing V2 prerequisites
   and before service admission. Add definition/run fixtures for both cohorts,
   task host preservation, collisions, crash states, and PRE-002 failures. Prove
   that precondition violation causes zero source writes.
8. **Cut external contracts.** Rename stream contracts package/schema/projector;
   add AgentOrg GraphQL and flat Team GraphQL; update tools/package summaries/
   application manifests; regenerate GraphQL. Delete recursive/old fields rather
   than aliasing them.
9. **Cut web authoring and shared runtime state.** Add `/agent-orgs`, AgentOrg
   store/components and entry chooser; contract Team form/detail; migrate live/
   history stores/services/components to the V3 collaboration view. Preserve
   desktop/web-equivalent interaction and task lineage displays.
10. **Convert canonical example packages and tests.** Software Development
    Department, Northstar, and nested classroom become AgentOrg packages;
    referenced shared Teams stay unchanged; Org-owned flat Teams move under the
    Org source boundary with preserved canonical IDs. Replace nested configured
    tests with fixed-depth, reuse, negative validation, and task-lineage cases.
11. **Remove temporary seams.** Delete recursive resolvers/planners/Team members,
    Team-root generic classes, old normal stores/paths, old contracts/package,
    old UI selectors/fallbacks, and stale docs. Search for forbidden names/
    paths outside migration and versioned unchanged record codecs.
12. **Validate in risk order.** Unit schema/domain/compiler tests; migration
    fixture tests; server integration/e2e for definition, Team/Org launch, entry,
    handoff, tasks, stop/restore/history; stream contract tests; web unit and
    browser flows; full builds/type checks. API/E2E Engineer owns final durable
    executable validation after source review.

No temporary dual read/write or public compatibility seam may survive step 11.

## Key Tradeoffs

1. **Generic internal root with subject-specific public services.** This avoids
   two runtime/persistence families while preventing ambiguous create/entry
   semantics.
2. **Physical root-run directory rename now.** It increases migration surface but
   prevents the new native Org path from permanently living under a false
   `agent_teams` owner. Atomic same-filesystem moves avoid rewriting large Agent
   content.
3. **Separate Org and Team authoring UI.** Some primitives are duplicated at the
   wrapper level, but invalid conditional form states and hidden coordinator
   semantics are avoided. Shared runtime workspace state is extracted instead.
4. **Preserve opaque local definition IDs.** The historic encoded prefix is not
   ideal, but rewriting it would violate durable identity and the approved V3
   minimal mapping. Ownership is determined by indexed source metadata/path,
   never by parsing the label as topology.
5. **One coordinated contract cutover.** Server/contracts/web must land together;
   this is operationally stricter but satisfies the no-compatibility rule and
   avoids two externally supported hierarchy models.

## Risks

| Risk | Likelihood / Impact | Control | Residual |
| --- | --- | --- | --- |
| A root is misclassified during migration | Low / Critical | Exhaustive preflight; direct configured-Team presence is the cohort discriminator; strict old/new validation; fixtures from both real cases | Unexpected contradictory data blocks rollout as required. |
| Definition/file move breaks a package ref | Medium / High | Plan all refs and target paths globally, preserve IDs, validate full target catalog before promotion completion | Read-only external package roots require operator/deployment action. |
| Task Team lineage is accidentally removed with configured recursion | Medium / Critical | Separate types/folders/tests; keep recursive task records/index traversal and task factory; negative configured-depth tests | Future refactors must retain the explicit distinction. |
| Org root is still treated as Team internally through old names | Medium / High | Root/manager/address/stream/history semantic rename and forbidden-name search outside codecs/migration | Versioned task/message fields retain approved old spelling at codec boundary. |
| Entry fallback reappears in UI/application route | Medium / High | Required `entryAddress` in Org interaction launch, resolver validation, negative no-selection/`/` tests | Inspection-only history open need not activate an entry. |
| Shared Team adoption mutates or forks Team | Low / High | Org member is definition reference only; service dependency is query-only; regression tests compare ID/coordinator/handoffs/history | Org-owned migrated source has physical ownership but remains an exact identity. |
| Runtime and durable snapshot diverge during commit | Low / Critical | Preserve prepare/durable/commit/publish fail-stop sequence and package correlation | Existing indeterminate finalization handling remains operationally relevant. |
| Contract cutover leaves stale generated/client code | Medium / High | Rename package, regenerate, type-check all workspace consumers, no old parser | External consumers outside repository require coordinated release notice. |
| Dynamic-Team work reintroduces recursion | Medium / High | Refresh branch and search dependencies; REQ-017 gate; architecture/code review | Later independently approved dynamic membership may require new design. |
| No prototype leads to inconsistent visual terminology | Low / Medium | Requirements specify semantic states; browser validation across catalog/form/launch/history/workspace and localization audit | Styling/layout remain implementation choices. |

## Guidance For Implementation

- Treat `requirements-doc.md` and `agent-org-contract.md` as read-only. Use their
  IDs in tests and code comments when an invariant is non-obvious.
- Compile-time types and strict schemas must both encode the root union and flat
  configured Team. Do not rely on one late validator around a recursive type.
- Validate complete definition/launch/migration input before ID allocation or
  persistent mutation. Errors must name the offending member/address/path.
- Keep the V3 child/task field meanings exactly as approved. Root
  `subjectKind` is the only new discriminator; do not add `kind` to configured or
  task nodes or create `FlatTeam` records.
- Resolve Org entry only after the immutable plan exists and before accepting an
  initial user interaction. Team address entry resolves to its direct
  coordinator. Never persist an Org coordinator.
- Preserve same-root recipient isolation. A canonical logical address is never
  a global run locator.
- Keep task Team creation in task-delegation code. A task Team can appear below
  an Org/Team/task host in `taskExecutions`, but never in configured `members`.
- Use the current atomic writer/fail-stop patterns rather than bespoke JSON
  writes. Migration staging and backups must fsync before source promotion.
- Ensure migration preflight performs no source/target mutation, including no
  implicit directory creation in source roots. Test this with filesystem
  snapshots.
- History/workspace restore must use the V3 snapshot. Current Team definition
  changes after a run must not change historical topology, coordinator, or root
  kind.
- Frontend form state should have separate Org and Team types. Shared visual
  primitives may be parameterized, but do not use one union form whose invalid
  fields are hidden conditionally.
- Run focused tests without watch mode per repository instructions. Minimum
  implementation-scoped evidence should include server and contracts builds,
  exact V3 schema/migration suites, Org/Team GraphQL/integration suites, web
  authoring/workspace unit suites, and browser rendering for Org create/launch/
  entry/history plus standalone Team create/launch/reuse.
- Before handoff, search current source (excluding migration/versioned record
  codecs and historical docs) for `rootTeam`, `root_team`, recursive configured
  `agent_team` Team members, `getOrCreateConfiguredChildTeam`, old stream package
  imports, and native `memory/agent_teams` paths. Every remaining occurrence
  needs a subject-accurate justification.
