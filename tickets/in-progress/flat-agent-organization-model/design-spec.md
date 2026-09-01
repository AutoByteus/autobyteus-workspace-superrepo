# Design Spec

## Document Status

- Package: `AORG-FLAT-TEAM-001`
- Approved requirements revision: `RER-018`
- Normative supplement: `AORG-CONTRACT-001`
- Normative Product UI revision: `RV-012` / `VIS-001`-`VIS-020`
- Architecture result: `Architecture Design Complete`
- Architecture revision: `AD-REV-003`
- Date: 2026-09-01
- Workspace: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`
- Branch / approved revision commit: `requirements/flat-agent-organization-model` / `e1f26fbe128a33ef863a3735607b1b3857f161e6`

## Current-State Read

The product currently uses one recursively composable `AgentTeamDefinition` and
one recursively shaped Team execution family. `AgentTeamDefinition.nodes`
accepts both Agent and AgentTeam refs; `TeamDefinitionGraphResolver` recursively
loads them; `TeamHandoffCompiler` recursively rebases handoffs; and
`TeamDefinitionTopologyPlanner` can allocate configured child TeamRuns at
arbitrary depth. `RootTeamRun`, `TeamExecutionIndex`, the mixed Team backend,
GraphQL, the Team WebSocket contract, and the web workspace all encode the root
as a Team.

The durable TeamRun V2 topology is nevertheless the right native contract for a
standalone flat Team. It already persists the coordinator, direct Agents,
launch settings, handoffs, application binding, timestamps, task executions,
and package identity under
`$MEMORY_ROOT/agent_teams/<rootTeamRunId>/team_run_execution_tree.json`. An
Agent-only root already satisfies the approved target without a version, key,
file, path, or byte-shape rewrite. The model defect is configured ownership:
an organization-like root is forced to be a Team with a coordinator while a
Team may contain a Team.

The target therefore uses two truthful root subjects and two strict durable
families:

- a standalone `AgentTeam` keeps native `TeamRunExecutionTreeFileV2`, a required
  direct-Agent coordinator, and Agent-only configured membership;
- an `AgentOrg` gains `AgentOrgRunExecutionTreeFileV1` under the separate
  `agent_orgs` package family, has no coordinator, and contains direct Agents
  and direct flat Teams;
- common configured Agent/Team, handoff, launch, binding/timestamp, and task
  records are reused as tight shared record modules without creating a generic
  persisted root union; and
- mixed history, stream, GraphQL, and workspace projections carry the explicit
  logical discriminator `root_subject_kind: "agent_team" | "agent_org"` and
  select the corresponding strict family before decoding.

The supplied workspace is an isolated git worktree. `HEAD` equals approved
`RER-018@e1f26fbe1`. `AD-REV-001` remains in history at
`36bc02deca363798b6eda878e5eb4850e624da6f`; `AD-REV-002` is the architecture
impact revision that integrates approved Product `RV-012`, the RER-013
configuration/focus behavior, and the later user-approved Team-V2/Org-V1 durable
correction. `ARCH-REV-001@899c60a70` failed on the definition-file transition
and effective handoff ordering. Approved RER-018 resolves the former with exact
Team Definition Config V2 / Org Definition Config V1 target-only admission and
a read-only external-project boundary. `AD-REV-003` resolves that approved
impact plus the remaining root-first ordering correction. No application source
changed during these architecture/requirements rounds.

## Task Size And Architectural Risk (Mandatory)

- Task size: `Large`
- Size rationale and supporting evidence: The payload population is only 23
  external definition roots used as topology evidence, three observed
  server-owned definition sources, and 43 currently readable execution trees,
  but the code delta changes versioned definition ownership/admission, flatness
  validators, a new AgentOrg
  runtime aggregate and durable store, migration authority, launch/configuration
  APIs, history/stream/workspace discriminated projections, task host ownership,
  atomic handoff authoring, and separate frontend definition/configuration
  surfaces. A repository scan found 207 consumers of Team-root field names and
  11 direct configured-definition recursion consumers before tests and generated
  transport code. Those structural surfaces, not record count, make the task
  Large.
- Architectural risk: `High`
- Risk rationale and supporting evidence: The work changes public contracts,
  persistence family selection, lifecycle/identity ownership, startup migration,
  definition transaction semantics, and frontend/runtime projection across
  multiple repositories. A wrong family classification or partial cutover can
  make run history, tasks, memory, or packages unreachable or create two
  canonical authorities for one identity. Incorrect external admission can
  either activate retired packages or strand compatible definitions globally.
- Selected route: `Architecture Review`
- Escalation trigger if implementation or validation discovers new impact:
  return `Design Impact` if implementation needs to change the approved exact
  Team V2 or AgentOrg V1 schema/file/path boundary, needs a generic persisted
  root file, cannot preserve Team-only wire compatibility where retained, needs
  configured depth beyond Org -> Team -> Agent, requires a new cross-run route,
  or changes launch/focus/handoff semantics. Return `Requirement Gap` if any
  approved definition config version/member shape/admission policy or durable
  key/version/path/discriminator must change, a Product decision is required,
  or evidence contradicts `PRE-001`-`PRE-005`.

### Structural Versus Payload Classification

- Payload surfaces: 23 read-only external definition packages used as evidence,
  the cutover inventory of server-owned definitions, 43 current Team V2 trees,
  their Markdown/JSON bodies, derived catalogs/indexes, fixtures, generated
  code, and Product reference assets.
- Structural surfaces: domain subjects and validators; definition source
  ownership; root run owners; strict readers/writers and two physical package
  families; fixed-depth migration; history/stream/GraphQL unions; launch and
  focus semantics; address/handoff/task ownership; and frontend stores/routes.
- House test: the existing structure cannot expose coordinator-free AgentOrg
  truthfully, because normal roots are `RootTeamRun`, strict storage requires
  `rootTeam.coordinatorAddress`, configured Team recursion is legal, and mixed
  transport has no root-kind discriminator. Conversely, it already consumes a
  flat Team correctly and must not be rewritten.
- Target-versus-delta result: the separate AgentOrg root/runtime/store, preserved
  Team V2 family, mixed projections, fixed-depth conversion of only the
  organization-like cohort, recursive configured-Team removal, and approved UI
  are in this round. Dynamic membership, cross-run routing, shared Agent
  instances, and new task settlement semantics are not.

## Architecture Investigation Evidence

| Source / Command / Probe | Exact Path / Reference | Observation | Design Decision Supported | Remaining Uncertainty |
| --- | --- | --- | --- | --- |
| Approved requirements package | `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md` | `RER-018` is Approved Architecture-Ready; it preserves RER-016 runtime families and adds REQ-026/027 exact definition versions, source ownership, target-only admission, and per-definition availability. | Keep external repositories read-only, convert only server-owned definitions, and make incompatible external definitions/dependent Orgs individually unavailable without global startup/history impact. | None. |
| Normative contract | `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | Exact Team Definition Config V2, Org Definition Config V1, Team run V2, Org run V1, source classes, admission diagnostics, transition, and mixed-reader rules are approved. | Treat all four logical versions/shapes and ownership/admission behavior as upstream constraints. | Internal modules and rollout mechanics remain architecture-owned. |
| Worktree verification | `git rev-parse HEAD`; `git worktree list --porcelain`; `git status --short --branch`; `git log --oneline` | Isolated task worktree at approved `HEAD=e1f26fbe1`; AD-REV-001/002, ARCH-REV-001, and RER-018 are in one history. | Revise canonical architecture artifacts in place as AD-REV-003. | Implementation refreshes its base if the integration branch advances. |
| Architecture Review round 1 | `design-review-report.md`; `architecture-review-revision-record.md`; `ARCH-REV-001@899c60a70` | Major design passed; AR-FIND-001 exposed the definition format/scope boundary and AR-FIND-002 exposed reversed handoff order. The user clarification converted AR-FIND-001 into the RER-018 requirement revision. | Implement RER-018 admission/ownership exactly and preserve current root-owned-before-Team-local effective order. | None. |
| Definition model/codec | `autobyteus-server-ts/src/agent-team-definition/domain/models.ts`; `providers/team-definition-config.ts` | Current unversioned config requires `refType: agent \| agent_team`; target Team V2 removes the field and target Org V1 retains explicit kind. | Add separate strict config file types/codecs and isolate the current parser as a migration-only server-owned decoder. | None. |
| Recursive resolution/compiler | `autobyteus-server-ts/src/agent-team-definition/services/team-definition-graph-resolver.ts`; `team-handoff-compiler.ts` | Configured Teams are traversed recursively and local handoffs are recursively rebased. | Replace normal configured recursion with explicit Team-local and fixed-depth Org compilers; preserve recursive task traversal separately. | None. |
| Persistence-before-validation pressure | `autobyteus-server-ts/src/agent-team-definition/services/agent-team-definition-service.ts`; `file-agent-team-definition-provider.ts` | Create can write before full graph validation/rollback; `team.md` and config files are not one crash-safe parent transaction. | Validate a complete candidate first and use a revisioned, journaled definition-package commit. | None. |
| Planner/config | `autobyteus-server-ts/src/agent-team-execution/domain/team-run-config.ts`; `services/team-definition-topology-planner.ts` | Root is always a Team node and planner/index construction is recursive. | Keep a flat Team planner/service and add a fixed-depth Org planner/service; share only tight placement/config primitives. | None. |
| Existing configuration precedence | `autobyteus-web/types/agent/TeamRunConfig.ts`; `utils/teamRunLaunchHierarchy.ts`; `stores/teamRunConfigStore.ts`; server `team-definition-topology-planner.ts` | Root, Team-placement, and Agent-placement overrides already exist conceptually and are expanded before activation. | Extract a server-authoritative fixed-depth resolver for Org and root->Agent specialization for Team; web preview mirrors the pure merge vocabulary. | Workspace creation stays separate from focus. |
| Team runtime | `autobyteus-server-ts/src/agent-team-execution/domain/root-team-run.ts`; `domain/team-run.ts`; `backends/mixed/mixed-team-manager.ts` | `RootTeamRun` correctly owns standalone Team lifecycle; mixed mechanics can materialize direct Agent/Team placements but currently assume a Team root. | Retain Team aggregate/service/manager for standalone Team; add an AgentOrg aggregate/service/manager that composes direct Agents/TeamRuns and reuses lower-level execution mechanisms. | Exact extraction boundaries may adjust if ownership rules remain intact. |
| Recipient resolution | `autobyteus-server-ts/src/agent-team-execution/services/team-recipient-resolver.ts`; `services/team-execution-index.ts` | `/` is rejected; Agent resolves directly; Team resolves through coordinator; current traversal is recursively generic. | Give Team and Org aggregates explicit same-root resolver methods over a shared canonical address parser and exact execution index. | None. |
| Web focus | `autobyteus-web/services/teamExecution/teamExecutionViewState.ts`; `stores/agentTeamContextsStore.ts`; `stores/agentSelectionStore.ts`; `stores/runHistorySelectionActions.ts` | Current Team focus is non-null and repaired to coordinator/first Agent. | Preserve coordinator-first standalone Team behavior; add nullable Org focus and remove fallback from the mixed Org view path. | None. |
| Task lineage | `autobyteus-server-ts/src/agent-team-execution/task-delegation/**`; `domain/team-run-execution-tree.ts` | Task Agent/Team records attach to an exact host; task Team recursion is distinct from configured membership. | Reuse task record shapes and lifecycle services; add Org root as a legal host without adding configured members. | No unmounted/global task selector is authorized. |
| Native Team V2 | `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-schema.ts`; `team-run-execution-tree-path.ts`; `team-run-execution-tree-store.ts`; `agent-memory-layout.ts` | Exact schema 2/rootTeam/file/path is already authoritative and strict. | Keep current store/path and exact serialized keys; narrow configured `rootTeam.members` validation to Agents. | Existing organization-like roots must be converted before normal flat-Team restore. |
| New Org V1 need | Same Team V2 sources plus approved `AORG-CONTRACT-001` | Team V2 cannot encode `rootOrg` or omit root coordinator under exact validation. | Add separate strict AgentOrg V1 domain/schema/path/store under `$MEMORY_ROOT/agent_orgs`. | None. |
| Mixed stream/API truth | `autobyteus-team-stream-contracts/src/team-execution-view-dtos.ts`; server team execution projector; current GraphQL history types | Current external shape is Team-only. | Retain Team-only DTOs/endpoints where useful and compatible; add discriminated mixed-root contracts with `root_subject_kind`; never guess a family from payload shape. | Generated clients must be regenerated for new mixed/Org surfaces. |
| Current definition UI/API | `autobyteus-web/components/agentTeams/**`; `useAgentTeamDefinitionFormState.ts`; `agentTeamDefinitionStore.ts`; server GraphQL `agent-team-definition.ts` | Team form offers nested Teams; complete handoff authoring is absent; parent mutation already exists. | Separate Org and Team drafts; add owner-scoped From/To/When editing; save the complete parent candidate with CAS. | None. |
| Approved Product UI | `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/ui-ux-spec.md`; `user-decision-record.md`; `visual-references/visual-reference-manifest.json`; `VIS-001`-`VIS-020` | RV-012 is approved and normative for distinct surfaces, direct-to-config Org Run, full-scope/no-focus activation, exact focus, task lineage, desktop and narrow views. | Map normative UI state to production owners without adopting mocked persistence/orchestration. | None. |
| Product validation | `browser-validation-rv-012.json`; `validation/final-package/final-package-validation.json` | 59/59 browser checks, 6/6 package checks, and 20/20 image hashes/dimensions pass. | Product gate is closed. | Production correctness remains downstream engineering work. |
| Definition ownership/inventory | `team-definition-source-paths.ts`; `app-config.ts`; `git ls-files '*team-config.json'`; source scan | The 23 public/private roots are read-only external evidence (3 organization-like). Observed server-owned sources are one writable data-root Team and two built-in application Teams, all current legacy flat configs. | Inventory source classes separately; migrate only server-owned sources; never derive write permission from definition ID or runtime history. | Cutover inventory, not observed count, is authoritative. |
| Run inventory | Python/`jq` re-probe of `/home/autobyteus/data/memory/agent_teams/*/team_run_execution_tree.json` | 43 readable V2 trees; 27 Agent-only; 16 one-level organization-like; none deeper. Runtime ownership is server-side regardless of definition origin. | Flat Team packages are no-op; convert every cutover-time organization-like package to Org V1. | Cutover inventory supersedes historical count 41. |
| Representative Org-like V2 | `/home/autobyteus/data/memory/agent_teams/software_development_department_09e8e85e26524e7d9dd869866c27496b/team_run_execution_tree.json` | Root coordinator plus direct Agent/Team records; child Teams are Agent-only and coordinator-led. | Project only root subject/identity/coordinator semantics and package family; preserve direct records and task hosts. | Definition snapshot may differ from current package, so migrate run snapshots independently of mutable definitions. |
| Concurrent draft | `origin/codex/dynamic-agent-team-runtime@7d9b4ba69`; merge-base check | Draft is not integrated and its behavior is outside this approved package. | Do not import recursive configured mutation; re-evaluate any later source conflict under REQ-017. | Branch may evolve before implementation. |

## Intended Change

Introduce `AgentOrg` as the sole persistent multi-Team composition subject and
contract `AgentTeam` to an Agent-only coordinator-led unit. Preserve native
standalone TeamRun V2 state and its package path. Add a distinct AgentOrg run
aggregate plus strict V1 store/path over reused configured/member/handoff/task
records. Publish exact Team Definition Config V2 and Org Definition Config V1
normal codecs; convert only server-owned legacy definitions, keep the two
external definition repositories read-only, and apply target-only per-definition
admission diagnostics without globally blocking compatible work or existing
history. Convert every server memory one-level organization-like runtime package
at cutover while leaving flat Team V2 packages byte/physically unchanged. Add
truthful mixed-root projections, subject-specific GraphQL and definition/run
services, configuration-first full-scope Org activation with nullable
post-launch focus, complete atomic From/To/When authoring, root-first effective
handoff ordering, and the approved separate Team/Org frontend journeys.

### AD-REV-002 Product, Runtime, And Durable Impact Decision

| Impact ID | Approved Evidence | AD-REV-001 / Earlier Draft Position | AD-REV-002 Decision |
| --- | --- | --- | --- |
| ADI-001 | REQ-004, REQ-024, SCN-002, SCN-009, VIS-014-VIS-018 | Org launch accepted `entryAddress` and yielded a focused Agent. | Remove entry selection/input/result. Resolve full effective configuration, activate every mounted execution, return Org run identity, and initialize Org focus to `null`. |
| ADI-002 | REQ-024, AC-019, VIS-014, VIS-015, VIS-020 | Configuration precedence had no single owner. | Add server-authoritative `CollaborationLaunchConfigurationResolver`: Org root -> Team placement -> exact Agent; root -> exact Agent for direct Org Agents/standalone Teams. Definitions stay immutable. |
| ADI-003 | REQ-020-REQ-023, SCN-008, VIS-004, VIS-008, VIS-013, VIS-019 | Handoff compilation existed; authoring/save lifecycle was underspecified. | Add owner-scoped endpoint catalogs, reversible complete drafts, typed validation, optimistic revision checks, and one journaled atomic parent-definition commit. |
| ADI-004 | REQ-019, AC-014, RV-012, VIS-001-VIS-020 | UI layout was implementation-owned and had no approved prototype authority. | Treat `ui-ux-spec.md` and all non-fixture visible reference details as normative; validate desktop/narrow/accessibility behavior. |
| ADI-005 | REQ-012, REQ-014, REQ-025, AORG-CONTRACT-001@RER-016 | AD-REV-001 and the superseded RER-014 impact draft proposed one generic V3 root/store/path. | Preserve exact Team V2 and add separate AgentOrg V1. Share only tight child/handoff/launch/task record modules. Add `root_subject_kind` solely to mixed projections. Flat Team packages are no-op; one-level Org-like packages convert atomically to Org V1. |

All five impacts are resolved within the approved package. No requirement or
Product UI gap remains.

### AD-REV-003 Architecture Review And RER-018 Recovery Decisions

| Finding / Impact | Evidence | AD-REV-003 Decision | Downstream Consequence |
| --- | --- | --- | --- |
| `AR-FIND-001` / RER-017-018 | Current normal Team codec is unversioned and requires member `refType`; external definition projects are out of ticket scope. | Implement strict `AgentTeamDefinitionConfigFileV2` (`schemaVersion:2`, Agent members without `refType`) and `AgentOrgDefinitionConfigFileV1` (`schemaVersion:1`, explicit Agent/Team `refType`). The retired decoder is callable only by the server-owned definition migration. External roots are read-only target-admission inputs and are never rewritten. | Compatible definitions admit; incompatible external definitions and dependent Orgs receive actionable unavailable records and are excluded from new catalog/launch/authoring without blocking server startup, compatible definitions, runtime migration, or historical snapshot inspection. |
| `AR-FIND-002` | Current recursive compiler emits root definition handoffs before child-Team handoffs; real Agents receive both and rule lookup preserves array order. | `compileOrg` appends Org-owned handoffs in saved order first, then each direct Team's local handoffs in the stable relative order of Team placements in `AgentOrgDefinition.members`; each Team list and `rules[]` order remain unchanged. `compileTeam` emits Team-local saved order. | New Org snapshots, migrated unchanged snapshots, `get_handoff_rules`, owner-labeled effective projections, and tests share one preserved order. Duplicate/self validation does not reorder. |
| Navigation cleanup | RER-016 added `SCN-010`; RER-018 adds `SCN-011`. | AD-REV-003 navigation/traceability covers `SCN-001`-`SCN-011`. | No behavior change. |

Both review findings are resolved architecture-side under approved RER-018.
Classification remains Large/High and another independent review is required.

## Target Definition And Source Contracts

Definition config file versions are independent of execution-tree versions.
Normal providers admit exactly one target file per subject; the legacy Team
shape exists only in the server-owned migration folder.

```ts
type AgentTeamDefinitionConfigMemberV2 = Readonly<{
  memberName: string;
  ref: string;
  refScope: "shared" | "team_local" | "application_owned";
  // No refType: every Team member is an Agent.
}>;

type AgentTeamDefinitionConfigFileV2 = Readonly<{
  schemaVersion: 2;
  coordinatorMemberName: string;
  members: readonly AgentTeamDefinitionConfigMemberV2[];
  handoffs: readonly CollaborationHandoff[];
  avatarUrl: string | null;
  defaultLaunchConfig: DefaultLaunchConfig | null;
}>;

type AgentOrgDefinitionConfigMemberV1 = Readonly<{
  memberName: string;
  ref: string;
  refType: "agent" | "agent_team";
  refScope: "shared" | "agent_org_owned" | "application_owned";
}>;

type AgentOrgDefinitionConfigFileV1 = Readonly<{
  schemaVersion: 1;
  members: readonly AgentOrgDefinitionConfigMemberV1[];
  handoffs: readonly CollaborationHandoff[];
  avatarUrl: string | null;
  defaultLaunchConfig: DefaultLaunchConfig | null;
  // No coordinator, recipient, or focus field.
}>;
```

The resolved domain remains subject-specific:

```ts
type AgentTeamDefinition = Readonly<{
  id: string;
  name: string;
  description: string;
  instructions: string;
  members: readonly AgentTeamDefinitionConfigMemberV2[];
  coordinatorMemberName: string;
  handoffs: readonly CollaborationHandoff[];
  avatarUrl: string | null;
  defaultLaunchConfig: DefaultLaunchConfig | null;
  source: DefinitionSourceDescriptor;
}>;

type AgentOrgDefinition = Readonly<{
  id: string;
  name: string;
  description: string;
  instructions: string;
  members: readonly AgentOrgDefinitionConfigMemberV1[];
  handoffs: readonly CollaborationHandoff[];
  avatarUrl: string | null;
  defaultLaunchConfig: DefaultLaunchConfig | null;
  source: DefinitionSourceDescriptor;
}>;

type DefinitionSourceDescriptor =
  | Readonly<{ sourceClass: "server_data";
      mutationOwner: "server_definition_migration_and_provider";
      packageRoot: string; definitionPath: string }>
  | Readonly<{ sourceClass: "implementation_repository";
      mutationOwner: "implementation_change";
      packageRoot: string; definitionPath: string }>
  | Readonly<{ sourceClass: "external_read_only";
      mutationOwner: "external_project";
      packageRoot: string; definitionPath: string }>;
```

- `agent-teams/<team-id>/team-config.json` is exact Team Definition Config V2.
  Exact-key parsing requires numeric `schemaVersion: 2`; a member with
  `refType`, a Team/Org ref, invalid scope, unresolved ref, or invalid
  coordinator is rejected. The normal writer always emits the complete exact
  V2 top-level shape.
- `agent-orgs/<org-id>/org-config.json` is exact Org Definition Config V1.
  Exact-key parsing requires numeric `schemaVersion: 1`, explicit member
  `refType`, and no coordinator/focus. A nested Org, configured Team below Team,
  invalid scope, unavailable Team dependency, or unresolved ref is rejected.
- `team.md` / `org.md` continue to own authored name, description, category,
  and instructions. The config version does not version those Markdown files.
- `DefinitionSourceDescriptor` carries explicit source class, mutation owner,
  and canonical package root/path. `server_data` may be updated by the migration
  and normal provider, `implementation_repository` only by this implementation
  change/build, and `external_read_only` only by its external owner. Definition
  identity never implies write permission.
- In-scope server-owned definitions are `$DATA_DIR/agent-teams/**` and
  definitions versioned in this implementation repository, including built-in
  application-owned Teams. The migration-only legacy decoder may convert their
  current unversioned recursive Team config into exact Team V2 or Org V1 through
  the same journaled definition-package transaction used by normal writes.
- `/home/autobyteus/workspace/autobyteus-agents` and
  `/home/autobyteus/workspace/autobyteus-private-agents` are
  `external_read_only`. This ticket may read them only with the target codecs;
  it must not stage, migrate, edit, commit, release, or report completion for
  their updates. Separate owners publish target packages.
- A target admission scan returns a record for every discovered package rather
  than throwing one global catalog exception:

```ts
type DefinitionAdmissionResult =
  | { status: "available"; subjectKind: "agent_team" | "agent_org";
      definitionId: string; definition: AgentTeamDefinition | AgentOrgDefinition }
  | { status: "unavailable"; sourceClass:
        "server_data" | "implementation_repository" | "external_read_only";
      packageRoot: string; definitionPath: string; definitionId?: string;
      expectedFamily: "agent_team_v2" | "agent_org_v1";
      expectedSchemaVersion: 2 | 1; code:
        "DEFINITION_SCHEMA_VERSION_UNSUPPORTED" |
        "DEFINITION_FAMILY_MISMATCH" |
        "DEFINITION_CONTRACT_INVALID" |
        "DEFINITION_REFERENCE_UNRESOLVED" |
        "DEFINITION_DEPENDENCY_UNAVAILABLE";
      reason: string; dependencyChain: readonly string[];
      ownerAction: string };
```

- Normal catalog/launch/authoring indexes include only `available` definitions.
  A diagnostics query/admin projection exposes unavailable records. Dependency
  closure marks an otherwise valid Org unavailable when any referenced Team is
  unavailable, includes both Org and Team paths/IDs in the diagnostic, and does
  not partially admit the Org.
- Unavailability is definition-scoped: it does not fail server readiness,
  prevent compatible definition admission, block server memory runtime
  migration, or block history/inspection restored from immutable run snapshots.
  New-run launch/authoring always requires an available target-version
  definition and never consults a retired parser.
- The non-blocking readiness guarantee applies to `external_read_only`
  incompatibility. A server-owned source that the cutover plan cannot convert
  or validate fails the server-owned migration gate with the same diagnostic
  fields; it is not silently downgraded to an external-style follow-up.
- Cutover ordering is strict: install target codecs/diagnostics and migration
  gate; convert/validate server-owned definitions; migrate/validate server
  runtime packages; enable target-only normal admission; then expose ready
  compatible definitions. Retired external packages become unavailable only at
  that coordinated cutover, never before the replacement capability exists.
- Org-owned Agent or Team sources created in target packages remain distinct
  definitions under `agent-orgs/<org-id>/agents/<local-id>` or
  `agent-orgs/<org-id>/agent-teams/<local-id>`. Membership stores a reference,
  not an embedded/copy definition.
- Migrated server-owned local sources preserve their exact historical opaque
  canonical IDs. Target code does not parse historical `team-local-*` prefixes
  as topology. Newly created Org-owned sources use truthful opaque
  `agent-org-owned-agent:*` / `agent-org-owned-team:*` namespaces; the source
  index maps IDs directly without aliases.
- Adding an available Team reference or Org handoff never edits that Team. The
  same Team identity remains independently launchable and retains prior history.
- Definition query results include an opaque revision derived from canonical
  target-serialized package content. Update supplies `expectedRevision`; under a
  per-definition lock the provider re-reads it, stages a complete package, and
  commits through the journaled old-directory-to-backup/stage-to-canonical
  transaction. Readers/catalog publication share recovery/lock discipline and
  see the prior or complete next package. A mismatch returns
  `DEFINITION_REVISION_CONFLICT` with zero mutation.

Representative server-owned flat conversion (migration/build path only):

```jsonc
// Retired unversioned input, decoded only by the migration module.
{
  "coordinatorMemberName": "researcher",
  "members": [{
    "memberName": "researcher",
    "ref": "researcher",
    "refType": "agent",
    "refScope": "team_local"
  }],
  "handoffs": [],
  "avatarUrl": null,
  "defaultLaunchConfig": null
}
```

```jsonc
// Exact normal Team Definition Config V2 output.
{
  "schemaVersion": 2,
  "coordinatorMemberName": "researcher",
  "members": [{
    "memberName": "researcher",
    "ref": "researcher",
    "refScope": "team_local"
  }],
  "handoffs": [],
  "avatarUrl": null,
  "defaultLaunchConfig": null
}
```

The transformer first proves `refType:"agent"` and reference/coordinator
validity, then removes only that redundant field and adds the numeric version.
The same retired input in an `external_read_only` descriptor is **not**
transformed: target admission returns `DEFINITION_SCHEMA_VERSION_UNSUPPORTED`
and the external-owner action. This distinction closes AR-FIND-001 without a
dual normal parser.

## Target Run-Tree And Launch Contracts

The two durable root families remain subject-owned. Reuse is by composition of
approved record shapes, not inheritance into an optional-field root blob and
not a generic persisted root union.

```ts
// Existing native Team authority. Serialized keys/file/path stay exact.
type TeamRunExecutionTreeFileV2 = Readonly<{
  schemaVersion: 2;
  createdAt: string;
  archivedAt: string | null;
  applicationBinding: ApplicationBinding | null;
  handoffs: readonly PersistedCollaborationHandoff[];
  rootTeam: PersistedFlatRootTeam; // coordinator required, Agent members only
}>;

type AgentOrgRunExecutionTreeFileV1 = Readonly<{
  schemaVersion: 1;
  subjectKind: "agent_org";
  createdAt: string;
  archivedAt: string | null;
  applicationBinding: ApplicationBinding | null;
  handoffs: readonly PersistedCollaborationHandoff[];
  rootOrg: Readonly<{
    address: "/";
    orgDefinitionId: string;
    orgDefinitionName: string;
    orgRunId: string;
    defaultLaunchConfiguration: LaunchConfiguration;
    members: readonly (PersistedConfiguredAgent | PersistedFlatConfiguredTeam)[];
    taskExecutions: readonly PersistedTaskExecution[];
  }>;
}>;

type RootExecutionTreeProjection =
  | Readonly<{
      root_subject_kind: "agent_team";
      execution_tree: TeamRunExecutionTreeDtoV2;
    }>
  | Readonly<{
      root_subject_kind: "agent_org";
      execution_tree: AgentOrgRunExecutionTreeDtoV1;
    }>;

type CreateAgentOrgRunCommand = Readonly<{
  agentOrgDefinitionId: string;
  rootConfiguration: LaunchConfiguration;
  teamOverrides: readonly PlacementLaunchOverride[];
  agentOverrides: readonly PlacementLaunchOverride[];
  applicationBinding?: ApplicationBinding | null;
}>;
```

- `TeamRunExecutionTreeFileV2` stays at
  `$MEMORY_ROOT/agent_teams/<rootTeamRunId>/team_run_execution_tree.json`. Its
  exact top-level/root keys and `schemaVersion: 2` stay unchanged. The only
  current-contract narrowing is that `rootTeam.members` accepts configured
  Agent records only, and `coordinatorAddress` must resolve to one of them.
- `AgentOrgRunExecutionTreeFileV1` is written only at
  `$MEMORY_ROOT/agent_orgs/<orgRunId>/agent_org_run_execution_tree.json`. Its
  strict validator requires the exact RER-018-preserved runtime keys,
  `subjectKind: "agent_org"`,
  coordinator-free `rootOrg`, fixed configured depth, and exact root ID/path
  correlation.
- `PersistedConfiguredAgent`, `PersistedFlatConfiguredTeam`, handoff,
  application-binding, timestamp, launch configuration, task Agent, task Team,
  and task-Team-member records are extracted from the current V2 code into
  persistence-owned shared record modules without changing their serialized
  keys. Team and Org schemas compose those modules independently.
- `AgentTeamRunService` and `AgentTeamRunManager` remain the authoritative public
  Team creation/restore/active registry. `RootTeamRun` remains the standalone
  Team aggregate, contracted to direct configured Agents. Team-only consumers
  may keep current identifiers and wire shapes.
- `AgentOrgRunService` and `AgentOrgRunManager` are new subject boundaries.
  `AgentOrgRun` owns direct Agent executions and direct flat `TeamRun` handles,
  the Org address/handoff/task/lifecycle scope, an Org execution index, Org V1
  persistence correlation, and Org events. It has no coordinator method.
- Lower-level Agent runtime factories, `TeamRun` execution mechanics, task
  delegation primitives, event types, fail-stop commit helpers, launch fields,
  and address parsing are reused where their meaning is identical. A single
  public generic root manager/aggregate is not introduced because it would
  erase the approved durable/lifecycle ownership split.
- `CollaborationLaunchConfigurationResolver` loads a fixed-depth immutable
  definition graph, validates unique exact override addresses, applies
  `Org root -> Team placement -> exact Agent placement` specificity (or Team
  root -> exact Agent for standalone Team), and produces complete settings for
  every mounted execution before any run ID, workspace, runtime, or tree write.
- AgentOrg launch returns `{agentOrgRunId}` only and activates the complete
  mounted scope. It persists no recipient or focus. Web/session focus is
  nullable; explicit Agent selection maps to that AgentRun and explicit direct
  Team selection maps through the Org snapshot/index to its coordinator AgentRun.
  Recipient-requiring actions fail before send when focus is absent/stale.
- Standalone Team launch and Team-only UI preserve coordinator-led initial
  focus. That is subject-specific preserved behavior, not a fallback applied to
  AgentOrg.
- Generic history/stream/workspace APIs select a family from an authoritative
  subject-tagged catalog/location, call that family's strict reader, and return
  the matching projection branch. Requested branch, package family, payload,
  and root identity must agree; mismatch fails closed.

### Effective Handoff Ordering Contract

`CollaborationHandoffCompiler` produces one stable array and never relies on a
map/object traversal order:

1. `compileTeam` emits the Team-owned `handoffs` array in saved order and keeps
   the order of every handoff's `rules[]` unchanged.
2. `compileOrg` first emits the Org-owned `handoffs` array in saved order.
3. It then iterates only the direct `agent_team` placements in their stable
   relative order within `AgentOrgDefinition.members`. For each placement it
   appends that Team's local handoffs in saved order after rebasing each local
   address exactly once beneath the Team placement address; each `rules[]`
   remains unchanged.
4. Duplicate/self/endpoint validation reports errors without sorting,
   deduplicating, or otherwise rewriting the candidate. No later persistence,
   projection, filtering, or rendering step may reorder the compiled array.

The persisted run snapshot stores this effective compiled array. New Team and
Org launches therefore use the same root-first order as the current compiler.
Migration copies the already-compiled legacy snapshot array byte-equivalently;
it does not recompile from a mutable definition. `get_handoff_rules` performs a
stable filter over the snapshot and preserves the matched handoff order and
each rule order. Owner-labeled effective-definition/API/UI projections decorate
the same sequence rather than regrouping it. Golden tests cover an Agent that
has both Org-owned and Team-local routes, multiple Team placements, and multiple
rules per handoff.

Example: for Org members `[directAgent, teamB, peerAgent, teamA]`, Org handoffs
`[O1, O2]`, Team B locals `[B1, B2]`, and Team A local `[A1]`, the stored and
effective sequence is `[O1, O2, rebase(/teamB,B1), rebase(/teamB,B2),
rebase(/teamA,A1)]`. Filtering that sequence for one source Agent may remove
nonmatching entries but cannot change the relative order of matches.

## Relevant Behavior And Production-Path Map (Mandatory)

| Behavior ID | Kind | Approved Requirement / Acceptance IDs | Trigger / Governing Contract | Existing Path | Approved Outcome | Target Production Path / Spine(s) |
| --- | --- | --- | --- | --- | --- | --- |
| BEH-001 | Contract | REQ-001, REQ-002, REQ-008, REQ-018, REQ-020-REQ-023, REQ-026; AC-001, AC-005, AC-013, AC-015-AC-018, AC-021 | Create/update/import AgentOrg or AgentTeam and scope-owned handoffs. | Recursive unversioned Team model/resolver, incomplete authoring, write-then-validate pressure. | Exact Team Definition V2 or Org Definition V1; Org alone references Teams; Team contains Agents only; complete candidate/ordered handoffs validate before one revisioned atomic save; Org adoption does not copy/edit Team. | Target admission -> subject form/import -> subject GraphQL -> DefinitionService -> resolver/endpoint/handoff validation -> definition-package transaction -> catalog (DS-000, DS-001, DS-011). |
| BEH-002 | System | REQ-004, REQ-005, REQ-011, REQ-024; AC-002, AC-007, AC-019 | Configure, launch, or restore Org/Team. | Recursive Team planner -> Team manager -> RootTeamRun; Team UI coordinator-focused. | Org full configuration resolves and activates complete scope unfocused; standalone Team remains coordinator-led. | Config UI/application -> subject run service -> configuration resolver -> subject planner/manager -> full active scope (DS-002, DS-003, DS-012). |
| BEH-003 | Contract | REQ-005-REQ-007, REQ-020-REQ-023; AC-003, AC-015-AC-018 | Author/inspect handoffs or Agent calls collaboration tools. | Recursive compiler emits root-owned handoffs first, then child Teams in stable member order; rule lookup filters without reordering. | Preserve ordered Agent-sourced routes: Org-owned saved order first, then each direct Team's local saved order in stable Org member order; Team-local edges rebase once; exact same-root resolution fails closed. | Definition candidate path (DS-011); fixed-depth ordered compilation (DS-009); member context -> subject root resolver -> AgentRun/coordinator (DS-004). |
| BEH-004 | User / contract | REQ-003, REQ-004, REQ-024; AC-002, AC-003, AC-019 | Launch Org, select workspace member, or address Team. | Required/repaired Team focus. | No Org coordinator/initial focus/fallback; explicit Agent focus is exact; Team focus uses its exact coordinator; no-focus blocks only recipient-required action. | Org launch -> focus=null; sidebar selection -> family-specific execution view/index -> send guard -> transport (DS-003, DS-004, DS-013). |
| BEH-005 | System | REQ-012, REQ-014, REQ-016, REQ-025, REQ-027; AC-008, AC-009, AC-011, AC-020, AC-022 | Persist/restore/stream/history/archive/stop a run. | Strict Team V2 everywhere, including organization-like Team roots. | Flat Team remains native V2; Org uses separate V1; every cutover-time server memory package remains in scope regardless of current definition availability; mixed projections preserve history truth. | Subject aggregate -> subject store -> subject-tagged catalog -> mixed projector/stream/workspace; restore selects strict store by family without live definition admission (DS-006T, DS-006O, DS-008). |
| BEH-006 | User | REQ-001, REQ-002, REQ-004, REQ-011, REQ-016, REQ-018-REQ-027; AC-002, AC-007, AC-011, AC-013-AC-022 | Open catalog/authoring/detail/config/launch/history/workspace. | One Team catalog/form advertises nesting; shared runtime assumes Team root/non-null focus; discovery has no per-definition admission status. | Implement RV-012 for available target definitions and truthful runtime/history; incompatible external definitions/dependent Orgs are omitted from new-work surfaces with actionable diagnostics, without blocking compatible UI/history. | Definition admission index -> web subject stores/components -> subject GraphQL; mixed durable projection remains separately available (DS-000-DS-003, DS-008, DS-011-DS-013). |
| BEH-007 | Operational | REQ-009, REQ-010, REQ-012, REQ-013, REQ-027; AC-004, AC-006, AC-008, AC-022 | Cut over server definitions/runtime while discovering external dependencies. | Unversioned recursive Team codec; 23 external evidence roots; 43 current server V2 trees; no deep topology. | Convert only server-owned definitions to target configs; never write external roots; flat runtime roots are no-op; one-level runtime roots convert to Org V1; unavailable external definitions do not block global readiness/history. | Startup migration gate -> separate definition/runtime inventories -> server-owned definition transactions + runtime family promotion -> target admission/diagnostics -> derived rebuild/readiness (DS-000, DS-007, DS-010). |
| BEH-008 | Contract | REQ-014, REQ-025; AC-009, AC-020 | Native durable write/read and mixed projection. | Exact Team V2 only. | Exact Team V2 preserved; exact Org V1 added; child/task records reused; family/payload/projection mismatch fails. | Team planner/root -> Team V2 store (DS-006T); Org planner/root -> Org V1 store (DS-006O); generic facade -> tagged union (DS-008). |
| BEH-009 | System | REQ-015; AC-010 | Delegate/settle/restore task execution. | Task records attach recursively to exact Team host. | Org root becomes a valid host; direct Org Team remains configured placement; fresh task Team remains task lineage at exact delegator host. | Agent tool -> subject root task boundary -> target/host resolver -> task factory -> host task array -> settlement event (DS-005, DS-008). |
| BEH-010 | Contract / operational | REQ-026, REQ-027; AC-021, AC-022 | Discover/admit server-owned and registered external definition packages at cutover/startup. | One unversioned normal Team parser accepts recursive shapes across all roots. | Normal admission accepts only exact Team Config V2/Org Config V1. Server-owned legacy decoding is migration-only; rejected external packages/dependent Orgs are individually unavailable with owner diagnostics and no source mutation/fallback. | Source inventory -> server migration classification or target codec -> dependency closure -> available catalog/unavailable diagnostics -> new-work gate (DS-000, DS-007). |

## Relevant Supplemental Task Artifacts

| Artifact Path | Purpose | Related Requirement / Acceptance-Criteria IDs | Relationship To This Design | Status / Approval Applicability |
| --- | --- | --- | --- | --- |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | Normative configured structure, exact definition and run families, source ownership/admission, task ownership, handoff authoring/order, launch/configuration/focus, and mixed projections. | REQ-001-REQ-027; AC-001-AC-022; ORG-CASE-001-055 | Governs fixed-depth invariants, Team Definition V2 / Org Definition V1, native Team Run V2 / Org Run V1, target-only admission, two-family reuse, no-focus activation, transition, and failure-closed projection. | Approved through `RER-018`; authoritative. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md` | Requirements-owned evidence and current production-path inventory. | BEH-001-BEH-010; PRE-001-PRE-005 | Supplies approved behavior and inventory evidence; architecture evidence above extends rather than rewrites it. | Current through `RER-018`; not behavior authority by itself. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md` | Cumulative approval/navigation history. | RER-001-RER-018 | Establishes progressive Team reuse, Product UI, configuration-first launch, Team-V2/Org-V1 runtime correction, and external-definition scope/admission approval. | Approved/cumulative. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md` and `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md` | Independent review result and finding history for AD-REV-001/002. | AR-FIND-001, AR-FIND-002; ARCH-REV-001 | Active recovery input: RER-018 resolves the source-scope/format finding; AD-REV-003 resolves effective ordering and aligns SCN-010/011. | `ARCH-REV-001` Fail / Design Impact remains authoritative until the revised package passes another review. |
| `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/ui-ux-spec.md` | Normative Product interaction, visual, responsive, and accessibility contract. | REQ-019-REQ-024; AC-014-AC-019; SCN-007-SCN-009 | Governs production UI structure and state meaning; mocked persistence/runtime are explicitly non-authoritative. | Approved `RV-012`; authoritative. |
| `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/visual-references/visual-reference-manifest.json` and sibling `VIS-001`-`VIS-020` images | Normative final visual references, routes, viewports, state descriptions, hashes, and fixture boundary. | REQ-019; AC-014 | Every visible non-fixture detail informs the file/component/state mapping and browser acceptance checks. | Approved after user review; authoritative. |
| `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/user-decision-record.md` | Explicit Product approval record. | RER-014; REQ-019; AC-014 | Closes the Product gate; RER-018 makes no Product change. | Approved 2026-08-31. |
| `/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/requirements_engineer_6568eac682114f2cb3ddb8f1d91d3c34/context_files/ctx_4cc02361f417__image.png` | Representative current hierarchy screenshot. | REQ-016; AC-011 | Current-state evidence only; it does not prescribe target layout/styling. | Evidence only; no separate approval. |
| `origin/codex/flat-agent-team-domain-simplification@c3a318812` (local `ca6d24dfa`) | Prior concept evidence. | BEH-001, BEH-004, BEH-009 | Its supported decisions are already incorporated upstream; it is not a competing design. | Superseded by approved package. |

## Approved Product UI To Production Mapping

| Normative References | Product Surface / State | Production State Owner | Production API / Domain Owner | Required Implementation Boundary And Validation |
| --- | --- | --- | --- | --- |
| VIS-001-VIS-008 | Baseline Team catalog, Agent-only builder/detail, coordinator, Team-local From/To/When, narrow builder | `agentTeamDefinitionStore` complete Team draft; Team subject components | AgentTeamDefinition GraphQL/Service + Team endpoint catalog + revisioned provider commit | Remove Team library/nesting; preserve baseline shell/cards; direct Agent endpoints only; one coordinator; inline reversible handoff editor; keyboard/click fallback. |
| VIS-009-VIS-013 | Org catalog, in-flow Agent/Team member authoring, clean detail, Org handoff detail, narrow authoring | `agentOrgDefinitionStore` complete Org draft; Org subject components | AgentOrgDefinition GraphQL/Service + Org endpoint catalog + revisioned provider commit | No Category/coordinator/overlay; referenced Team identity is query-only; Org From includes mounted Agents, To also direct Teams; exact addresses/coordinator metadata inspectable. |
| VIS-019 | Org handoff CRUD/reorder/atomic-save state | Org definition draft plus shared handoff view/editor primitives | Complete-candidate validation and one Org definition CAS | No per-handoff write. Preserve failed draft; stale endpoints remain visible; typed errors map adjacent to handoff/field; success updates canonical revision. |
| VIS-014, VIS-015, VIS-020 | One Org configuration, collapsed member overrides, Team/Agent specificity, workspace-required blocked state, narrow configuration | `agentOrgRunConfigStore` sparse intent; shared configuration components | CollaborationLaunchConfigurationResolver + AgentOrgRunService | UI preview uses same pure merge vocabulary; server recomputes; no recipient selector; no overlay/overflow; every mounted execution validates before create. |
| VIS-016-VIS-018 | Full scope active unfocused; exact direct-Agent focus; direct-Team coordinator focus | Mixed `RootExecutionViewStore` plus `CollaborationFocusController` | Discriminated Team-V2/Org-V1 stream snapshot plus family-specific execution index; message boundary validates target AgentRun in root | Org focus starts `null`; prompt only; Team row maps to stored coordinator; no implicit fallback; standalone Team remains coordinator-first. |
| VIS-016-VIS-018 and UI spec shared runtime/history | Org root, direct sibling Agents/Teams, Team children, task lineage/rails/selection | Mixed execution-tree projection and history navigation state | Subject-tagged history/stream facade over strict Team V2 and Org V1 projectors | Configured depth is fixed; task lineage remains recursive under host; ancestor rails/L-branches/depth/selected marker are normative; root subject labels are truthful. |
| REQ-026, REQ-027, AC-021, AC-022, SCN-011; RV-012 unchanged | New-work catalog/authoring/launch eligibility and separate operational definition diagnostics | Subject catalog stores consume only `available` admission rows; history store remains snapshot-backed | `DefinitionAdmissionService` plus dependency availability resolver and diagnostics query | Do not render an incompatible definition as launchable or silently normalize it. Keep compatible RV-012 cards/routes unchanged; an unavailable external definition/dependent Org is absent from new-work lists and queryable with package root, identity/path, expected family/version, reason, and owner action. Existing history remains reachable. |

Implementation must use the accepted AutoByteus shell and visual vocabulary.
Prototype fixture names, messages, IDs, timestamps, paths, and record values are
illustrative; layout, hierarchy, labels, controls, validation/focus states,
responsive behavior, and interaction meanings are normative. Production code
must not import prototype local persistence, simulated streams, or mocked
orchestration.

## Task Design Health Assessment (Mandatory)

- Change posture: `Larger Requirement` and `Refactor`
- Current design issue found: `Yes`
- Root cause classification: `Boundary Or Ownership Issue`, with
  `Duplicated Policy Or Coordination` and `Shared Structure Looseness` in the
  recursive configured hierarchy.
- Refactor needed now: `Yes`
- Evidence: one Team definition/runtime subject owns ordinary Team and
  organization behavior; recursive graph/planner/transport/UI contracts legalize
  Team-in-Team; organization roots require a fake Team coordinator. Adding Org
  alongside those paths would leave two configured multi-Team models.
- Design response: separate AgentOrg and AgentTeam definition/run/persistence
  owners; keep native Team V2 and Team runtime intact where they are already
  truthful; add Org V1 and Org runtime; add exact subject definition codecs and
  a source-aware admission owner; extract only semantically tight shared
  Agent/Team/handoff/launch/task records and low-level execution mechanisms;
  replace configured recursion with fixed-depth validation and projection.
- Refactor rationale: the durable correction specifically reduces the prior
  refactor: there is no justification to rename or replace the valid Team V2
  family. Refactor remains required at definition recursion, organization
  runtime ownership, mixed projection, and frontend boundaries.
- Intentional deferrals/residual risk: dynamic membership, distributed cross-run
  routing, shared Agent instances, new application-owned Org resources, and new
  task settlement semantics remain out of scope. Updating or releasing either
  external definition repository is separately owned; temporary unavailability
  is explicit, not architecture debt inside this ticket. Historical opaque
  `team-local-*` definition IDs may remain as identity strings; current code
  must never parse that prefix as configured nesting permission.

## Terminology

- **Standalone Team run:** native `RootTeamRun`/TeamRun aggregate persisted as
  exact `TeamRunExecutionTreeFileV2` under `agent_teams`.
- **AgentOrg run:** coordinator-free Org aggregate persisted as strict
  `AgentOrgRunExecutionTreeFileV1` under `agent_orgs`; it owns direct Agent and
  flat Team placements in one collaboration scope.
- **Team Definition Config V2:** exact normal `team-config.json` with numeric
  version 2, direct Agent members without `refType`, and one direct-Agent
  coordinator. It is independent of Team Run Execution Tree V2.
- **Org Definition Config V1:** exact normal `org-config.json` with numeric
  version 1, explicit Agent/Team member kinds, and no coordinator.
- **Definition admission:** source-aware target-codec validation and dependency
  closure that yields an available catalog row or an actionable unavailable
  diagnostic; it never invokes the migration-only decoder.
- **External read-only definition:** a package whose source project owns its
  format/update/release. This ticket may target-validate it but may not mutate
  it.
- **Root execution projection:** non-authoritative mixed transport/history DTO
  tagged with `root_subject_kind`, containing either Team V2 or Org V1 view.
- **Configured scope:** standalone Team root, Org root, or direct Team placement
  that owns configured Agent executions. Only Org may own configured Teams.
- **Org-owned definition source:** a Team/Agent package physically owned under an
  Org source boundary for the migrated cohort. It remains a distinct reusable
  definition identity, not a Team nested in another Team.
- **Host scope:** exact Org root, Team, or task Team whose `taskExecutions` array
  owns a fresh task execution.
- **Activation:** create/restore complete configured scope; does not select a
  communication recipient.
- **Communication focus:** nullable client/session selection of an exact AgentRun
  (or Team row resolved to its coordinator); never persisted in either family.
- **Definition revision:** opaque provider-issued hash/token used only for one
  complete parent-definition compare-and-swap transaction.

## Design Reading Order

1. Read `Intended Change`, `Target Definition And Source Contracts`, and
   `Target Run-Tree And Launch Contracts` for the solution boundary.
2. Read the behavior map, Product mapping, and supported-scenario table for the
   approved behavior witnesses.
3. Read DS-000-DS-013 and ownership/dependency sections for implementation
   control flow and encapsulation.
4. Read the persisted-data decision/migration plan before changing any Team V2
   schema, history, or memory code; flat Team is deliberately a no-op cohort.
5. Use the final file mapping, removal plan, sequence, risks, and implementation
   guidance as the implementation/review checklist.

## Legacy Removal Policy (Mandatory)

- Policy: clean-cut removal of recursive configured-Team behavior; no runtime
  compatibility branch for unsupported configured depth.
- Preserve (not compatibility): exact Team V2 normal store/path/schema and
  Team-only APIs/DTOs that remain semantically valid for flat Teams, as required
  by REQ-014/REQ-025.
- Remove from normal code: Team-member input beneath Team, recursive configured
  definition resolution/planning, recursive Team selectors, Org-as-Team
  coordinator semantics, Org entry selector/fallback focus, and mixed readers
  that infer root kind.
- Definition cut: replace the unversioned normal Team config parser with strict
  Team Definition Config V2 and Org Definition Config V1 codecs. Do not leave a
  normal dual parser, implicit `refType` insertion/removal, or retired external
  fallback. The unversioned recursive definition decoder exists only inside the
  named server-owned migration module; normal source discovery cannot import it.
- Historical boundary: the old organization-like Team Run V2
  decoder/transformer and unversioned definition decoder exist only inside the
  named migration module. Flat Team Run V2 is not historical and continues
  through the native store. External source owners update their own packages;
  this ticket retains no writer or converter for those roots.
- No dual authority: migrated organization-like roots cannot remain advertised
  under both `agent_teams` and `agent_orgs`; current services never auto-retype,
  auto-move, or try both validators.

## Persisted Data / State Transition Decision (Mandatory When Persisted Data May Be Affected)

- **Observed populations (evidence, not a frozen rollout plan):** 23 definition
  roots under the two external repositories are read-only topology evidence (20
  Agent-only and 3 organization-like); one writable server-data Team and two
  implementation-repository application Teams were observed in the approved
  probe, all in the retired unversioned flat shape. The authoritative definition
  inventory is the cutover scan by source class. The `RER-017` runtime re-probe
  found 43 readable Team Run V2 packages: 27 Agent-only and 16 one-level
  organization-like, with none deeper. The cutover runtime inventory, not the
  earlier 41-package count, is authoritative.
- **Code/serialization/physical change:** every normal definition source must
  publish exact Team Definition Config V2 or Org Definition Config V1. Native
  flat Team runtime JSON/file/path stays exact V2. An organization-like Team Run
  V2 package moves to `$MEMORY_ROOT/agent_orgs/<sameRootRunId>/` and receives
  strict Org Run V1 tree JSON. Mixed derived projections gain
  `root_subject_kind`; focus is never persisted.
- **Normal reader/writer evidence:** the Team Run V2 reader is strict and already
  correct for Agent-only roots; it cannot represent a coordinator-free Org.
  The current unversioned definition parser accepts the retired recursive model
  and is not directly usable for normal target admission. Separate exact target
  definition codecs and a separate strict Org Run V1 reader are required.
- **Required preserved semantics:** definition/run IDs, canonical member
  addresses, direct Team coordinators, launch configuration, effective handoff
  array/rule order, application binding, timestamps, tasks and exact task hosts,
  memory/messages/content/history, and standalone Team history. A migrated
  legacy root coordinator remains an ordinary direct Org Agent but loses root
  coordinator/default-recipient meaning.
- **Physical/operational constraints:** durable runtime package content cannot be
  discarded. Derived indexes/caches may be rebuilt. Server-data definition and
  runtime transformation executes under the exclusive startup/maintenance gate
  before definition/run/history/stream admission. Both runtime family parents
  must be on one filesystem for atomic directory renames. Repository-versioned
  definitions are changed and validated in the implementation commit/build, not
  mutated in a deployed read-only checkout. External definition roots receive
  zero writes under every outcome.

| Cohort | Transition Decision | Required Outcome |
| --- | --- | --- |
| Implementation-repository server-owned definitions | `Migration Required — source/build conversion` | Use the migration-only decoder/transformer during implementation, commit exact Team V2 or Org V1 files with the target codecs, and make the build fail on any remaining retired file. Runtime never edits the repository checkout. |
| Writable server-data definitions | `Migration Required — startup package transaction` | Inventory with explicit `server_data` ownership; convert flat retired Team config to Team V2 or one-level organization-like config to Org V1; validate and promote the complete package journaled/atomically. |
| External definition roots | `External Dependency — no in-ticket migration` | Perform target-only read/admission. Compatible target packages admit; incompatible packages and dependent Orgs are unavailable with diagnostics. Record owner follow-up but make no source/SCM/release claim or write. |
| Agent-only Team Run V2 packages | `Directly Usable — No Migration` | Validate exact V2/root/path/coordinator/Agent-only membership; do not move, rename, rewrite, back up, touch timestamps, or rebuild the package. |
| One-level organization-like Team Run V2 packages | `Migration Required — runtime family promotion` | Preserve supported content and identity while atomically establishing exactly one Org Run V1 canonical package family. Definition-source availability does not remove a runtime item from this cohort. |
| Subject history/catalog indexes and caches | `Discard or Rebuild` | Rebuild Team and Org indexes from strict family packages, then merge only tagged derived rows. |

The Team definition file conversion is intentionally small; the runtime and
cross-subsystem cutover remain Large/High. Rewriting flat Team runtime packages
would add corruption risk with no semantic benefit. Leaving the unversioned
normal definition parser would instead create two accepted configured models
and violate the approved admission boundary. Supported criteria are AC-004,
AC-006, AC-008-AC-010, AC-020-AC-022; QR-002-QR-005 and QR-007;
PRE-001-PRE-005.

### Migration Plan

- **Migration identity and owner:** extend the existing
  `AppDataMigrationRunner` startup maintenance gate with migration ID
  `20260901_agent_org_flat_team_families_v1` and an offline status/retry entry.
  The proposed module is
  `autobyteus-server-ts/src/app-data-migrations/migrations/agent-org-flat-team-families-v1/`.
  It alone owns the retired unversioned definition decoder and the
  organization-like Team Run V2 transformer. No current definition service may
  import this module.
- **Capability-safe release boundary:** ship strict Team Definition V2, Org
  Definition V1, Team Run V2, and Org Run V1 codecs/stores; source registry,
  admission diagnostics, and dependency availability computation; converted
  implementation-repository definitions; and the migration runner in one
  coordinated release. On startup, normal definition/run service admission is
  closed while server-data definition and runtime phases execute. After success,
  only target definition codecs become normal. Thus the retired external format
  is rejected only when its diagnostic/recovery path and the new runtime family
  are ready, without ever creating a normal dual parser.
- **Three independent inventories:** preflight records (1) implementation-
  repository/server-data definitions with mutation owner and target disposition,
  (2) external packages as read-only target-admission candidates, and (3) every
  runtime package under the server memory root regardless of definition origin.
  Definition counts never determine runtime inclusion.
- **Server-owned definition classification/conversion:** the migration-only
  decoder accepts only the approved retired zero/one-level input. For a flat
  Team it proves every member is an Agent, adds numeric `schemaVersion:2`,
  removes each proven redundant `refType:"agent"`, and preserves coordinator,
  member order, handoffs/rule order, avatar, defaults, Markdown, and source IDs.
  For an organization-like root it writes Org Config V1, removes root
  coordinator semantics, retains the coordinator member as an ordinary Agent,
  preserves direct member and Org-owned handoff order, emits explicit member
  kinds/scopes, and references rather than copies direct Teams. Each direct
  server-owned flat Team dependency is independently converted to Team V2.
- **Implementation-repository mechanics:** run the transformer as an explicit
  development/build conversion against versioned application-owned packages;
  review and commit the resulting exact target files with implementation. CI
  scans those registered roots using only target codecs and fails if any retired
  file remains. The deployed migration ledger records the release version/hash,
  not a fictitious runtime rewrite of repository files.
- **Writable server-data definition transaction:** under the global gate and a
  per-package lock, back up/hash mutable authorities, decode/classify the legacy
  candidate, stage the complete target subject package, validate target codecs,
  IDs/refs/handoffs/source indexes, fsync, rename old package to protected
  backup, rename stage to canonical target, fsync parents, and journal the item.
  A referenced Team is not copied or edited as part of the Org transaction. A
  local source subtree moves with its owning package while preserving opaque
  definition IDs. A structurally valid server-owned Org that depends on an
  incompatible external Team may finish format conversion but becomes
  admission-unavailable by dependency closure; that external dependency does
  not fail global readiness.
- **External admission:** the migration performs no external write, staging,
  backup, chmod, rename, SCM, or release operation. Normal target codecs validate
  the registered file/family. Exact-key diagnostics may describe rejected raw
  keys but may not construct a legacy domain definition. Results include source
  root, definition path/identity if recoverable, expected family/version, stable
  code/reason, dependency chain, and external-owner action. No rejected package
  enters catalog, launch, authoring, or dependency resolution.
- **Flat Team runtime no-op proof:** preflight validates exact Run V2,
  Agent-only configured membership, a direct coordinator, package/root ID
  correlation, absence of a conflicting Org target, and the complete file
  inventory. It records hashes/stats in the immutable plan but performs no
  mkdir, rename, file rewrite, timestamp update, index mutation, or backup for
  that package.
- **Org runtime conversion mapping:** preserve root run-ID value as `orgRunId`;
  project root definition ID/name to Org fields; omit root coordinator field but
  retain that Agent record; preserve root default launch config, all direct
  Agent records, direct flat Team records and coordinators, already-compiled
  handoff array/rule order, task arrays/hosts, binding/timestamps, and every
  non-tree package file. Write exactly `schemaVersion:1`,
  `subjectKind:"agent_org"`, and approved `rootOrg` keys. Do not consult current
  definition admission or recompile handoffs from a current definition.
- **Atomic runtime family promotion:** with runtime closed and plan/journal
  fsynced: (1) atomically rename `agent_teams/<id>` to
  `agent_orgs/.migration-staging/<attempt>/<id>`; (2) retain the original Team
  tree in protected backup, write/validate Org V1 through the target store in
  staging, remove the old tree, and fsync; (3) atomically rename staging to
  `agent_orgs/<id>`, fsync both family parents, and journal `PROMOTED`. Source and
  target active paths are never both canonical. A crash may leave the package
  only in non-discoverable staging while readiness remains closed.
- **Attempt state/recovery:** `source only` means not started; `staging only`
  resumes or restores according to journal; valid `target only` means committed;
  source+target, wrong-family payload, invalid target, ID mismatch, or
  unjournaled staging is a conflict. Pre-move failure leaves source canonical.
  Staged failure restores source and old tree. Post-promotion rollback is an
  explicit offline whole-item/attempt operation from journaled originals; no
  normal reader falls back or selects the newer path.
- **Preflight and zero-write failure:** before any mutation enumerate all
  server-owned definition packages and all runtime roots; validate source
  ownership, two runtime cohorts, zero deep configured Team edges, resolvable
  server-owned references, direct coordinators, unique addresses/IDs, writable
  source/target parents, same filesystem, collision-free targets, prior ledger
  prerequisites, package/tree/root ID correlation, and source-index coverage.
  Unexpected in-scope depth or unmappable state reports exact path/invariant and
  produces zero migration writes. An incompatible external package is not an
  in-scope migration violation; it becomes an unavailable admission record.
- **Derived rebuild/readiness:** after definition/runtime item commits, rescan
  strict Team and Org runtime families; rebuild separate subject indexes; merge
  `root_subject_kind` rows; target-admit definitions; compute dependent-Org
  availability; and publish readiness. Unavailable external definitions do not
  prevent this final readiness transition. Existing history/inspection reads
  strict immutable runtime snapshots and never requires the live definition.
- **Retention:** retain the isolated transformers while supported installations
  may contain server-owned retired definitions or organization-like Team Run V2
  packages. Remove them only under a separately approved minimum-version and
  backup-retention policy. Native Team Run V2 and both target definition codecs
  are permanent current code.

| Migration Step | Source | Target / Result | Owner | Validation | Failure / Recovery |
| --- | --- | --- | --- | --- | --- |
| 0. Repository source conversion | Versioned server-owned retired configs | Committed exact Team V2 / Org V1 packages | implementation + migration transformer | CI target-only scan; no retired config | Build/release fails; no deployed source mutation. |
| 1. Global preflight | Source registry, server definitions, all runtime packages, ledgers/targets | Immutable source-classified definition/runtime plan | migration planner | ownership, depth, refs, IDs, filesystem, collisions, exhaustive runtime coverage | Stop before migration writes; external incompatibility is recorded for later admission, not a gate failure. |
| 2. Server-data definitions | Writable retired packages | Journaled exact Team V2 / Org V1 package | definition transformer + package promoter | strict target config/Markdown/refs/handoffs/source index | Restore/continue by journal; server-owned conversion defects keep gate closed. |
| 3. Native Team runtime | Agent-only Team Run V2 packages | Same bytes/files/paths | flat runtime verifier | exact V2, Agent-only, coordinator, IDs, hashes/stats | Report only; zero package writes. |
| 4. Org runtime | One-level organization-like Team Run V2 packages | Org Run V1 package with unchanged non-tree content | runtime transformer/promoter + Org V1 store | strict old/target, identity, handoff order, tasks/hosts, one active family | Source→staging→target recovery; gate remains closed on conflict. |
| 5. Admission | Target server and registered external packages | Available definitions plus actionable unavailable records/dependency closure | `DefinitionAdmissionService` | exact family/version/keys/refs; no fallback or write | Invalid external/dependent Org excluded individually; valid work and readiness continue. |
| 6. Derived projections | Runtime family packages | Team index, Org index, tagged mixed history/stream rows | subject history owners + mixed facade | counts and kind/ID/location/payload agreement | Discard partial index and rebuild. |
| 7. Completion | All in-scope plan items and admission results | Ledger `SUCCEEDED`, runtime/services admitted | migration runner/readiness | full rescan: flat runtime unchanged, Org cohort only in Org family, target server definitions, external zero-write audit | Gate stays closed only for in-scope conversion/runtime conflict; external unavailability remains diagnosed after readiness. |

## Supported Scenario And Reachability Classification

| Scenario / Premise | Classification | Witness / Governing Basis | Design Consequence |
| --- | --- | --- | --- |
| Author AgentOrg with direct Agents/Teams, configure once, and launch the full scope unfocused | Supported Normal Scenario | SCN-001, SCN-002, SCN-009; AgentOrg web/GraphQL/package surfaces -> configuration resolver -> full activation | Provide separate AgentOrg definition/launch boundaries, sparse placement overrides, nullable focus, and no coordinator/fallback. |
| Launch/test flat Team, later reference same Team in Org | Supported Normal Scenario | SCN-006; Team catalog/launch history then Org member ref | Org stores only definition identity; no copy or mutation of Team source/history. |
| After Org launch, user explicitly selects a direct Agent, Team, or Team Agent | Supported Normal Scenario | REQ-004, AC-002, VIS-016-VIS-018 | Web focus is nullable and exact; Team row maps to stored coordinator; no first/name fallback or durable focus field. |
| Author/reorder/cancel/save Org-owned or Team-local From/To/When handoffs | Supported Normal Scenario | SCN-008; AC-015-AC-018; VIS-008, VIS-019 | One subject-owned definition draft validates all members/handoffs and commits atomically with revision protection. |
| Org Agent delegates to direct mounted Team | Supported Normal Scenario | AC-010, ORG-CASE-028; `/team` resolves to coordinator | Fresh task Team is stored at exact delegator host and has no configured membership/address effect. |
| Standalone Team Agent delegates to one of its mounted Agents | Supported Normal Scenario | REQ-015 preserved task behavior and current tool path | Task remains owned by standalone Team root. |
| Standalone Team Agent delegates to an unrelated/unmounted Team by logical address | Technically Possible only if a new selector/global lookup were invented; unsupported/contrived | REQ-007, ORG-CASE-025, and current resolver prohibit cross-root discovery; no independent approved entry surface exists | Do not add definition-ID or global Team discovery to `delegate_task`. This premise cannot justify new API/security machinery. |
| Historical recursive task Team has another task Team below it | Supported Explicit Edge Scenario | PRE-005 and reused task record contract | Preserve recursive task lineage and its restore/index traversal even though configured Team depth is fixed. |
| Deep configured Team appears during migration | Supported Explicit Operational Failure | REQ-013, PRE-002, QR-003 | Fail the global preflight before writes; report invariant; do not design conversion. |
| Preserve native flat Team Run V2 and add strict AgentOrg Run V1 over reused records | Supported Governing Contract Scenario | SCN-010; REQ-014, REQ-025; AORG-CONTRACT-001@RER-018 | Implement separate subject-owned stores/paths and a discriminated mixed projection; this is the approved durable boundary, not an optional architecture choice. |
| Cut over with valid target definitions, incompatible external definitions, and a dependent Org | Supported Operational Scenario | SCN-011; REQ-026, REQ-027; AC-021, AC-022 | Admit only exact targets, exclude incompatible external/dependent definitions from new work, expose diagnostics, preserve compatible readiness/runtime migration/history, and prove external zero writes. |
| Scan both runtime families and infer root kind from whichever payload parser accepts | Technically Possible but Explicitly Rejected | SCN-010; REQ-025, AC-020 | Select family from authoritative tagged location and fail on family/payload/projection mismatch; no guessing or auto-retyping. |
| Retry the retired definition parser after target admission fails | Technically Possible but Explicitly Rejected | SCN-011; REQ-026, REQ-027; AC-021 | Return one unavailable diagnostic; do not normalize `refType`, construct a legacy definition, mutate the source, or activate it. |

## Data-Flow Spine Inventory

| Spine ID | Scope | Behavior(s) | Start | End | Governing Owner | Why It Matters |
| --- | --- | --- | --- | --- | --- | --- |
| DS-000 | Primary End-to-End | BEH-001, BEH-006, BEH-007, BEH-010 | Registered definition source inventory | Available target definitions plus actionable unavailable/dependency diagnostics | `DefinitionAdmissionService` | Enforces exact target formats and external ownership without a dual parser or global outage. |
| DS-001 | Primary End-to-End | BEH-001, BEH-006 | Definition author/import | Revisioned atomically persisted/cataloged Org or flat Team | Subject DefinitionService | Exclusive configured model and pre-write validation. |
| DS-002 | Primary End-to-End | BEH-002, BEH-004, BEH-006 | Standalone Team launch | Native Team scope active, coordinator ready/focused | `AgentTeamRunService` / `RootTeamRun` | Preserves independent Team behavior and V2 history. |
| DS-003 | Primary End-to-End | BEH-002, BEH-004, BEH-006 | Valid Org configuration | Complete Org scope active, focus absent | `AgentOrgRunService` / `AgentOrgRun` | Separates activation from communication target. |
| DS-004 | Primary End-to-End | BEH-003, BEH-004 | Mounted Agent handoff/message | Exact same-root AgentRun accepts or request fails closed | Subject root collaboration boundary | Preserves isolation and Team coordinator ingress. |
| DS-005 | Primary End-to-End | BEH-009 | Mounted Agent delegation | Fresh task execution attached to exact host and lifecycle returned | Subject root task boundary | Separates task lineage from configured topology. |
| DS-006T | Primary End-to-End | BEH-005, BEH-008 | Team root mutation/restore | Exact Team V2 package committed/restored | Team run persistence/history owner | Proves Team JSON/path remains native. |
| DS-006O | Primary End-to-End | BEH-005, BEH-008 | Org root mutation/restore | Exact Org V1 package committed/restored | Org run persistence/history owner | Gives Org truthful coordinator-free authority. |
| DS-007 | Primary End-to-End | BEH-007, BEH-008, BEH-010 | Startup migration gate | Server-owned definitions/runtime verified/converted or in-scope gate closed | App-data migration subsystem | Separates writable conversion from read-only external admission and protects one canonical runtime family. |
| DS-008 | Return/Event | BEH-005, BEH-009 | Subject-root event/history query | Tagged mixed projection reaches web/history consumer | Subject event publisher + mixed projection facade | Mixed UI cannot infer family. |
| DS-009 | Bounded Local | BEH-003 | Fixed-depth definition graph | Stable root-owned-first compiled handoff snapshot | Collaboration handoff compiler | Preserves current effective order, one rebase, owner separation, and `rules[]` order. |
| DS-010 | Bounded Local | BEH-007 | One Org-like migration item | Journaled staged/promoted/verified disposition | Runtime package promoter | Restart-safe family cutover. |
| DS-011 | Primary End-to-End | BEH-001, BEH-003, BEH-006 | Definition/handoff draft save | Complete candidate committed once or unchanged with precise errors | Subject DefinitionService / package transaction | Atomic owner-separated authoring. |
| DS-012 | Bounded Local | BEH-002, BEH-006 | Root choices + sparse overrides | Complete immutable settings for all placements | `CollaborationLaunchConfigurationResolver` | Owns fixed-depth precedence. |
| DS-013 | Primary End-to-End | BEH-004, BEH-006 | Exact post-launch row selection/send action | Exact Agent/coordinator focus or blocked no-focus state | Web root execution view/focus owner | Focus stays exact, local, and non-durable. |

## Primary Execution Spine(s)

- **DS-000 definition admission:** `registered source roots -> DefinitionSourceRegistry ownership classification -> exact Team V2 / Org V1 codec -> dependency availability closure -> available subject catalogs + unavailable diagnostics -> new-work gate`; history bypasses this spine and reads durable snapshots.
- **DS-001 Org definition:** `AgentOrg form/import -> AgentOrg GraphQL -> AgentOrgDefinitionService -> fixed-depth resolver + endpoint/handoff validator -> FileAgentOrgDefinitionProvider definition-package transaction -> Org catalog`.
- **DS-001 Team definition:** `AgentTeam form/import -> AgentTeam GraphQL -> AgentTeamDefinitionService -> Agent-only/coordinator/local-handoff validator -> FileAgentTeamDefinitionProvider definition-package transaction -> Team catalog`.
- **DS-002 standalone Team launch:** `Team Run action -> createAgentTeamRun -> AgentTeamRunService -> TeamLaunchConfigurationResolver -> FlatTeamTopologyPlanner -> AgentTeamRunManager -> RootTeamRun -> coordinator AgentRun -> Team V2 store/history`.
- **DS-003 Org launch:** `Org Run action -> Org configuration draft -> createAgentOrgRun(rootConfiguration, sparse overrides) -> AgentOrgRunService -> CollaborationLaunchConfigurationResolver -> AgentOrgTopologyPlanner -> AgentOrgRunManager/AgentOrgRun -> all direct Agent/Team executions -> Org V1 store; focus=null`.
- **DS-004 handoff/message:** `Mounted Agent tool -> MemberCollaborationContext -> owning RootTeamRun or AgentOrgRun -> subject execution index + recipient resolver -> exact AgentRun or Team coordinator AgentRun`.
- **DS-005 task delegation:** `Mounted Agent tool -> subject root TaskDelegationService -> exact host/target -> fresh task AgentRun or TeamRun -> subject tree host task array commit -> ingress/settlement lifecycle`.
- **DS-006T Team persistence:** `RootTeamRun mutation/restore -> TeamRunPersistenceCoordinator -> strict TeamRunExecutionTreeStore V2 -> Team history/index -> AgentTeamRunManager`.
- **DS-006O Org persistence:** `AgentOrgRun mutation/restore -> AgentOrgRunPersistenceCoordinator -> strict AgentOrgRunExecutionTreeStore V1 -> Org history/index -> AgentOrgRunManager`.
- **DS-007 migration:** `Server startup -> AppDataMigrationRunner -> source-classified definition/runtime preflight -> journaled server-data definition conversion + no-op flat runtime verification + Org-like runtime promotion -> strict subject rescans -> target admission/dependency diagnostics -> derived index rebuild -> readiness release`.
- **DS-008 mixed projection:** `Subject root event or history catalog row -> subject projector/store -> RootExecutionTreeProjection(root_subject_kind) -> mixed stream/history GraphQL -> RootExecutionViewStore -> workspace/history components`.
- **DS-011 definition/handoff save:** `Complete reversible draft -> update mutation(expectedRevision) -> subject service candidate validation -> per-definition package transaction -> refreshed canonical revision, or typed failure with draft retained`.
- **DS-012 configuration:** `Org definition launch defaults + root draft + exact Team/Agent patches -> fixed-depth address index -> specificity merge -> runtime/model/workspace validation -> complete plan`.
- **DS-013 focus:** `active Org focus=null -> explicit Agent/Team sidebar row -> mixed view branch's exact index -> AgentRun or Team coordinator -> recipient guard; absent/stale focus -> no send`.

## Spine Narratives (Mandatory)

| Spine ID | Short Narrative | Main Nodes | Governing Owner | Key Off-Spine Concerns |
| --- | --- | --- | --- | --- |
| DS-000 | Registry classifies source ownership before exact target decoding; valid definitions flow to subject catalogs and invalid/dependent ones become diagnostics without fallback or source mutation. | SourceDescriptor; target codec; admission result; dependency closure | DefinitionAdmissionService | external owner action, diagnostic redaction, catalog invalidation |
| DS-001 | One subject-specific candidate is resolved/validated before a crash-recoverable package commit; only fully valid state enters its catalog. | Definition; DefinitionService; Provider | Subject DefinitionService | source discovery, codecs, revision lock, cache invalidation |
| DS-002 | Team launch validates one flat Team, allocates IDs after configuration coverage, creates native RootTeamRun, persists V2, then exposes coordinator-led interaction. | AgentTeamDefinition; Team plan; RootTeamRun; AgentRun | AgentTeamRunService | workspace prep, ID allocation, Team history |
| DS-003 | Org launch resolves referenced Teams without mutating them, computes full settings, creates one Org scope and all direct placements, persists V1, and returns without focus. | AgentOrgDefinition; Org plan; AgentOrgRun; TeamRun/AgentRun | AgentOrgRunService | Team definition query, workspace prep, activation rollback |
| DS-004 | The mounted Agent sees only its ordered outgoing rules; the owning subject aggregate resolves within its immutable snapshot and Team targets through exact coordinator. | Member context; RootTeamRun/AgentOrgRun; execution index; AgentRun | Subject root aggregate | address parser, instruction renderer, message persistence |
| DS-005 | Delegation authorizes exact caller/host, prepares and durably attaches a fresh task execution, then activates ingress; recursive task descendants stay task records. | Task service; HostScope; TaskExecution | Subject root task boundary | run IDs, reference files, settlement/review |
| DS-006T | Team mutations and restore pass only through strict V2 schema/store; flat Team snapshots never move or acquire Org fields. | Team V2 file; Team package; RootTeamRun | Team persistence coordinator | atomic writer, Team history, memory layout |
| DS-006O | Org mutations and restore pass only through strict V1 schema/store; root has no coordinator/focus and direct Teams remain flat. | Org V1 file; Org package; AgentOrgRun | Org persistence coordinator | atomic writer, Org history, memory layout |
| DS-007 | Startup classifies writable definition and all runtime roots before writes, converts only server-owned definitions, performs zero writes for flat runtime, promotes Org-like runtime through staging, then target-admits external definitions without making their incompatibility a global blocker. | MigrationPlan; DefinitionTransaction; RuntimeItemTransaction; ReadinessGate | App-data migration subsystem | filesystem lock, backups, source ownership, operator diagnostics |
| DS-008 | Each subject publisher/projector preserves its native snapshot; a thin mixed facade attaches/checks root kind and clients reduce the correct union branch. | Subject event/snapshot; tagged DTO; web view | Subject publisher + projection facade | WebSocket recovery, generated clients, selectors |
| DS-011 | Save sends the whole draft and expected revision; current members and every ordered handoff validate under the owning subject before one package transaction. | Draft; candidate validator; definition revision | Subject DefinitionService | endpoint catalog, accessible reorder, journal recovery |
| DS-012 | Resolver seeds root, overlays Team placement then exact Agent, validates all placements, and freezes plan before activation or IDs. | Root config; PlacementOverride; EffectivePlan | LaunchConfigurationResolver | runtime/model catalogs, workspace normalization |
| DS-013 | Org view begins unfocused; only explicit row action maps through the selected union branch to an AgentRun/coordinator; send stays blocked otherwise. | RootExecutionView; FocusTarget; AgentRun | Web focus controller | responsive sidebar, hydration, history row semantics |

## Spine Actors / Main-Line Nodes

- `DefinitionSourceRegistry` / `DefinitionAdmissionService`: explicit source
  ownership, target-only codec dispatch, dependency closure, available catalog
  rows, and unavailable diagnostics for new work.
- `AgentOrgDefinitionService` / `AgentTeamDefinitionService`: authoritative
  candidate validation, mutation, and query boundaries for their subjects.
- `CollaborationLaunchConfigurationResolver`: authoritative fixed-depth effective
  setting computation; no focus or runtime activation.
- `AgentOrgTopologyPlanner` / `FlatTeamTopologyPlanner`: build immutable
  subject-specific run plans only after complete validation.
- `AgentOrgRunService` / `AgentTeamRunService`: explicit public launch/restore
  owners.
- `AgentOrgRunManager` / `AgentTeamRunManager`: separate active registries and
  root factories; each owns one durable family.
- `AgentOrgRun`: Org aggregate, direct Agent/Team execution handles, no
  coordinator, Org V1 correlation.
- `RootTeamRun`: native standalone Team aggregate, direct Agents/coordinator,
  Team V2 correlation.
- `TeamRun`: coordinator-led Team execution used as the standalone root body or
  direct Org Team placement; cannot own configured Teams.
- `TeamRunExecutionTreeStoreV2` / `AgentOrgRunExecutionTreeStoreV1`: strict
  subject stores over shared record validators.
- `RootExecutionProjectionService`: thin explicit-kind read/projection facade for
  mixed history/stream/workspace; owns no lifecycle or persistence.
- Web `RootExecutionView` / `CollaborationFocusController`: mixed read model and
  exact nullable focus behavior.
- `AgentOrgFlatTeamFamiliesV1AppDataMigration`: exclusive server-owned retired
  definition and old organization-like Team Run conversion owner.

## Ownership Map

| Node | Owns | Does Not Own |
| --- | --- | --- |
| DefinitionSourceRegistry | Registered roots, source class, mutation owner, canonical package/definition paths | Decoding, definition identity inference, filesystem mutation |
| DefinitionAdmissionService | Exact target codec selection, admission result, dependency availability closure, available catalogs/unavailable diagnostics | Legacy decoding, source writes, runtime/history eligibility |
| AgentOrgDefinitionService | Direct Agent/Team refs, Org endpoint catalog/handoffs, complete candidate validation, definition transaction orchestration | Team-local edits, Team copies, runtime IDs, migration decoding |
| AgentTeamDefinitionService | Agent-only members, direct coordinator, Team-local endpoints/handoffs, complete candidate validation | Org membership/handoffs, child Team discovery |
| DefinitionPackageTransaction | Per-definition lock, expected revision, staged directory, journaled atomic visibility/recovery, canonical revision publication | Domain validation or cross-definition policy |
| CollaborationLaunchConfigurationResolver | Root/Team/Agent precedence, placement validation, complete effective plan | Focus, definition mutation, runtime activation |
| AgentOrgTopologyPlanner | Fixed Org -> direct Team -> Agent addresses/IDs/config snapshot | Filesystem writes or live lifecycle |
| FlatTeamTopologyPlanner | One Team -> Agents addresses/IDs/config snapshot | Org members or configured child Team |
| AgentOrgRunService / Manager | Org launch/restore/stop, active Org registry, Org V1 package correlation | Team-only registry, focus, definition mutation |
| AgentTeamRunService / Manager | Native Team launch/restore/stop, active Team registry, Team V2 package correlation | Org registry/configuration inheritance |
| AgentOrgRun | Org address/handoff/task/lifecycle scope, direct Agent/Team handles, Org execution index/events | Coordinator, configured Team below Team |
| RootTeamRun | Team address/handoff/task/lifecycle scope, direct Agents, coordinator, Team execution index/events | Org semantics or configured child Team |
| TeamRun | Direct Agents, exact coordinator, Team-local task host/task descendants | Configured Team children or Org-wide resolution |
| Subject tree stores | Exact family schema/path/atomic file reads/writes | Trying the other validator, mixed kind inference, migration selection |
| RootExecutionProjectionService | Dispatch by explicit `root_subject_kind`, family/payload agreement, tagged union projection | Root lifecycle, file scanning/guessing, topology authority |
| Migration | Source-classified in-scope plan, server-owned retired definition/Org-like Run V2 transformation, staging/promotion/recovery, runtime-derived rebuild | External writes, normal target admission, feature behavior, deep conversion |
| Web subject authoring stores | Separate complete drafts, revision, endpoint choices/errors | Live run event state or other-subject edits |
| Web RootExecutionView | Tagged Team/Org snapshot, selectors/event reduction, nullable Org focus | Durable focus, definition rules, family inference |

## Thin Entry Facades / Public Wrappers

| Facade / Entry Wrapper | Governing Owner Behind It | Why It Exists | Must Not Secretly Own |
| --- | --- | --- | --- |
| Definition catalog resolvers | DefinitionAdmissionService + subject query service | Return only available new-work definitions | Legacy retry, source mutation, history filtering |
| Definition admission diagnostics resolver | DefinitionAdmissionService | Actionable operational inspection | Make external incompatibility a global startup failure or expose raw secrets |
| GraphQL Org definition resolver | AgentOrgDefinitionService | Transport mapping/errors | Validation/filesystem writes |
| GraphQL Team definition resolver | AgentTeamDefinitionService | Transport mapping/errors | Org policy/provider access |
| GraphQL Org run resolver | AgentOrgRunService | Typed config/launch/restore/terminate | Focus or manager/store internals |
| GraphQL Team run resolver | AgentTeamRunService | Native Team launch/restore/terminate | Org semantics |
| Mixed history/query resolver | RootExecutionProjectionService | Explicit-kind union mapping | Guessing kind or mutating subject roots |
| Team-only stream handler | RootTeamRun publisher/projector | Preserve compatible Team stream surface | Org dispatch/lifecycle |
| Mixed/Org stream handler | RootExecutionProjectionService + subject publisher | Frame tagged snapshot/events | Task/message/lifecycle state |
| Agent definition tools | Subject DefinitionService | Agent-callable serialization | Alternate validation/compatibility parser |
| Web handoff primitives | Subject draft adapter | From/To/When presentation and reversible commands | Endpoint policy/persistence/cross-owner mutation |
| Web Org config/focus components | Org config store / RootExecutionView | Approved interactions | Server precedence, durable focus, fallback |

## Removal / Decommission Plan (Mandatory)

| Item To Remove / Decommission | Why | Replacement | Scope / Preservation Note |
| --- | --- | --- | --- |
| Normal `providers/team-definition-config.ts` unversioned recursive codec | Target admission has two exact versioned families. | `agent-team-definition-config-v2.ts` + `agent-org-definition-config-v1.ts`; copied legacy knowledge only in migration folder | Delete normal import/export paths; external rejection must not reach migration decoder. |
| `TeamMember.refType: agent_team` in Team inputs/config | Team is Agent-only. | Agent-only Team member type/schema/validator | Remove from current Team authoring/import/launch; old parser only migration. |
| Recursive configured Team graph resolver/validator | No current configured Team recursion. | AgentOrg fixed-depth resolver + flat Team resolver | Task recursion is separate and retained. |
| Recursive Team handoff compiler traversal | Team-local handoffs rebase once. | Explicit `compileTeam` / `compileOrg` methods | Preserve order, owner, duplicate/self checks. |
| Team-local Team source ownership under a Team | Team cannot own Team member. | Org-owned source discovery or shared Team reference | Team-local Agent sources remain. |
| Recursive configured planner/index/config types | Fixed configured depth. | Subject-specific Org/Team plan types plus shared placement records | Recursive task types remain. |
| `getOrCreateConfiguredChildTeam` on Team runtime/backend | A Team cannot materialize configured Team child. | `AgentOrgRun` direct Team materializer | Task Team preparation remains task-owned. |
| Treating `RootTeamRun`/`AgentTeamRunManager` as Org owner | Org is not Team. | New AgentOrgRun/Manager/Service | Preserve RootTeamRun/Team manager for native Team. |
| Root-generic V3 schema/store/path proposal | Superseded by RER-016 and violates native Team contract. | Exact Team V2 + exact Org V1 stores/paths | No `collaboration_runs` directory or Team rewrite. |
| Inferring root kind from coordinator/member/version | Two families must fail closed. | Explicit tagged catalog/location and strict store dispatch | No “try both” reader. |
| Recursive Team-specific LLM hierarchy prose | Agents must see Org/flat-Team truth. | Root-kind-aware renderer over canonical address parser | String address format stays unchanged. |
| Team UI Team selector/nested counts/warnings | Team authoring cannot advertise Teams. | Agent-only Team UI + separate Org UI | Task lineage still renders Team task nodes. |
| Org `entryAddress` selector/input/result and initial focus fallback | Activation and targeting are separate. | Org config command + full activation + nullable focus | No ignored compatibility field. |
| Org focus repair to coordinator/first Agent | Org has no default recipient. | Clear invalid focus and block recipient action | Standalone Team coordinator-first remains. |
| Nested configured-Team supported fixtures/docs | Assert rejected target model. | Org fixed-depth + negative Team nesting fixtures | Convert rather than keep as alternate mode. |
| Stale generated `.js` test/source mirrors, where repository convention confirms they are artifacts | Can retain obsolete inputs. | Canonical TypeScript sources/build output | Verify convention before deletion. |

## Return Or Event Spine(s)

- **DS-008 Team event:** `RootTeamRun/Agent/task event -> Team publisher -> Team
  projector -> compatible Team stream and/or tagged mixed adapter -> web reducer`.
- **DS-008 Org event:** `AgentOrgRun/Agent/Team/task event -> Org publisher -> Org
  V1 projector -> tagged mixed stream -> web RootExecutionView`.
- **History result:** `TeamHistoryStore + AgentOrgHistoryStore ->
  RootRunHistoryCatalogService merge/check -> tagged GraphQL result -> web
  history navigation`.
- **Definition result:** `DefinitionPackageTransaction commit -> DefinitionService
  -> GraphQL canonical result/revision -> subject store/form`.
- **Migration result:** `Item journal -> migration ledger/status -> operator retry
  or readiness release`.
- **Focus result:** `explicit sidebar selection -> exact focus state -> composer;
  clear/invalid focus -> prompt and blocked send without changing root lifecycle`.

## Bounded Local / Internal Spines

- **DS-009, `CollaborationHandoffCompiler`:** `validate Org-owned and Team-local
  candidates without mutation -> append Org-owned saved order -> visit direct Team placements in
  stable Org member order -> validate/rebase each Team-local list once -> append
  without sorting/deduplication -> freeze snapshot`; standalone Team emits only
  its local saved order.
- **DS-010, migration item:** `PLANNED -> BACKED_UP -> SOURCE_MOVED_TO_STAGING ->
  TARGET_WRITTEN -> VALIDATED -> PROMOTED -> RECORDED`; runtime admission is
  closed until all items and indexes complete.
- **DS-006T Team commit:** `prepare RootTeamRun snapshot -> strict Team V2 atomic
  write -> commit live state -> publish Team event`.
- **DS-006O Org commit:** `prepare AgentOrgRun snapshot -> strict Org V1 atomic
  write -> commit live state -> publish Org event`.
- **DS-011 definition commit:** `exact candidate parse -> resolve -> endpoint/handoff validate
  -> lock -> compare revision -> stage full package -> journaled promote/recover
  -> cache publish`.
- **DS-012 configuration:** `seed Org root -> Team patch -> exact Agent patch ->
  validate all resolved records -> freeze plan`; no definition/focus mutation.

## Off-Spine Concerns Around The Spine

| Concern | Spines | Serves | Responsibility | Why / Misplacement Risk |
| --- | --- | --- | --- | --- |
| Definition source discovery/codecs | DS-000, DS-001, DS-007 | Admission, definition services, migration | Classify source ownership; exact target decode/encode; migration-only legacy decode for server-owned sources | Prevents filesystem/write authority and compatibility leakage into domain. |
| Definition package transaction | DS-001, DS-011 | Definition services | Revision lock, staged directory, journal/recovery, fsync | Prevents partial `md/config` visibility and lost updates. |
| Canonical address parser | DS-003-DS-005, DS-009 | Resolvers/compilers | Rooted parse/build/rebase/depth checks | Avoids divergent fallback/depth policy. |
| Workspace/runtime catalog activation | DS-002, DS-003, DS-012 | Run services | Validate runtime/model/workspace and prepare resources before activation | Keeps external setup out of aggregate. |
| Identity allocators | DS-002, DS-003, DS-005 | Planner/task service | Allocate IDs after validation | Avoids validation side effects. |
| Shared persisted record schemas | DS-006T, DS-006O | Subject stores | Exact common Agent/Team/handoff/launch/task record keys | Reuse without root-family conflation. |
| History/index projectors | DS-006T, DS-006O, DS-008 | Subject persistence/web | Subject rows plus tagged mixed merge | Derived only; cannot reinterpret definitions. |
| Application-owned Team validation | DS-001, DS-002 | Team owner | Enforce Agent-only Team and standalone launch | Closes application recursion loophole. |
| LLM instruction renderer | DS-004, DS-005 | Member context | Explain actual root/address/tool semantics | Keeps prose out of resolver. |
| UI accessibility/presentation | DS-001-DS-003, DS-008, DS-011-DS-013 | Web owners | RV-012 layout, focus, narrow, keyboard, validation | Prevents mock/prototype orchestration entering domain. |

## Ownership Boundaries

Definition services return validated immutable definitions; planners never read
raw files/providers. Each run service calls only its own manager. Each manager
owns its own active registry, aggregate factory, and persistence coordinator.
Upstream callers do not call a subject manager and its store/index together.

Source discovery precedes subject decoding. `DefinitionSourceRegistry` supplies
the source class and path; `DefinitionAdmissionService` selects exactly one
target codec from registered family/path metadata and computes dependency
availability. Subject catalogs consume only its available results. Migration
uses the same source descriptors but a separate server-owned-only legacy
decoder; external descriptors are structurally incapable of reaching a writer.
Runtime restore/history bypass live definition admission and select their strict
store from the durable family identity.

`AgentOrgRun` and `RootTeamRun` are peers, not variants behind a shared public
aggregate. Both may compose tight shared mechanisms (Agent factory, flat
`TeamRun`, task service primitives, event/commit helpers), but no shared base may
expose optional coordinator/root identity fields. `AgentOrgRun` alone may own
direct configured TeamRun handles. `RootTeamRun`/`TeamRun` cannot.

The Team V2 store and Org V1 store are both current. A mixed projection facade
requires explicit kind and routes to the corresponding subject query/manager or
history store; it cannot scan paths, inspect coordinator presence, or try both
validators. The migration alone may decode organization-like Team Run V2 and
server-owned retired recursive definitions.

Configuration and focus are separate. The server resolver owns effective launch
settings and complete activation. Web focus is local, nullable for Org, exact,
and absent from both durable families. An exact member history row selection may
focus because the row click is explicit; a root open remains unfocused.

Definition authoring and runtime compilation are separate. The subject service
validates and commits one complete candidate under expected revision. Runtime
compilers consume saved immutable snapshots and never repair/reorder/write
handoffs.

## Boundary Encapsulation Map

| Authoritative Boundary | Encapsulates | Callers | Forbidden Bypass | Fix If Too Thin |
| --- | --- | --- | --- | --- |
| DefinitionSourceRegistry | source root registration/class/mutation owner/path | admission, migration planner | infer writability from ID/refScope or scan arbitrary roots | Add typed descriptors and allowlisted root adapters. |
| DefinitionAdmissionService | target codec dispatch, stable diagnostics, dependency closure, available catalog projection | subject catalog resolvers, diagnostics API, launch/authoring gates | call legacy decoder, mutate source, filter runtime history | Add `scan()` / `requireAvailable(kind,id)` methods. |
| AgentOrgDefinitionService | Org resolver/provider/ref queries/candidate validation | GraphQL, tools, import/UI backend | Write Org files then validate/rollback | Add preview/validate/update method. |
| AgentTeamDefinitionService | Flat validator/provider/Agent resolver | GraphQL, tools, import/application | Accept child Team then rely on launch rejection | Strengthen typed candidate/input. |
| DefinitionPackageTransaction | lock/revision/staging/journal/promotion/recovery | Subject DefinitionServices only | Per-file writes or UI last-write-wins | Add `commit(candidate, expectedRevision)`. |
| AgentOrgRunService | config resolver/Org planner/Org manager | GraphQL/application Org launch | Caller uses planner/manager/store directly | Add typed create/restore/stop method. |
| AgentTeamRunService | Team config/Team planner/Team manager | GraphQL/application Team launch | Caller uses manager/store directly | Add typed Team method. |
| AgentOrgRunManager / AgentTeamRunManager | subject registry/factory/package loader | Respective run service, explicit-kind projection adapter | One caller queries manager plus store | Add subject query/snapshot method. |
| AgentOrgRun / RootTeamRun | subject index/task/message/event/persistence coordination | tools/stream/live queries through subject boundary | Caller reaches inner TeamRun/AgentRun manager | Expose exact root operation. |
| Team V2 store / Org V1 store | exact schema/path/atomic writer | Respective persistence coordinator, migration target validator | Runtime reads JSON or wrong family | Add strict subject method. |
| RootExecutionProjectionService | explicit-kind dispatch and tagged DTO | mixed history/stream/GraphQL | Infer kind or mutate root | Add explicit compound identity/result branch. |
| RootExecutionView (web) | union selectors/reducer/focus mapping | workspace/history components | Components parse raw payload/use wrong subject store | Add root-kind-aware selectors. |

## Dependency Rules

1. New-work definition catalog/launch/authoring -> DefinitionAdmissionService ->
   exact subject query/service. Definition writes -> subject service ->
   source-authorized provider. Mixed runtime/history read -> explicit-kind
   projection service -> subject query boundaries; it does not depend on
   definition admission.
2. AgentOrg definitions query AgentTeam identity/content through the public Team
   query boundary only; no mutation, clone, or Team provider dependency.
3. Collaboration address/handoff compilers depend on resolved topology records,
   not providers or GraphQL types.
4. AgentTeam definition/runtime code does not import Org member/root types to make
   Team generic. AgentOrg may compose public flat Team plan/runtime mechanisms.
5. Team V2 and Org V1 schemas compose common persisted-record validators but do
   not import each other's root schema/store/path.
6. `AgentOrgRun` may own direct configured `TeamRun`; `TeamRun` may own task
   TeamRun descendants only, never configured TeamRun.
7. Task domain code uses subject-neutral root/host identities internally; any
   approved old on-disk field spelling remains confined to versioned codecs.
8. Mixed GraphQL/stream/web types require `root_subject_kind`; subject-only Team
   types may remain compatible. No client inference from tree shape.
9. History topology comes from persisted snapshot, never current mutable
   definition. Subject indexes are derived and rebuildable.
10. Migration may import its isolated legacy codecs plus current target
    validators. No current service imports migration. Migration writers reject
    `external_read_only` descriptors before creating a transaction.
11. Web preview may share pure merge functions; server recomputes/validates the
    authoritative effective plan.
12. Org and Team draft stores are separate. Shared handoff components accept an
    owner-provided endpoint catalog/commands only.
13. Focus is absent from launch commands, durable schemas, root lifecycle, and
    history authority.
14. Target definition codecs never call migration decoders or normalize unknown
    keys. Dependency unavailability is propagated as data, not a partial Org.

Forbidden shortcuts:

- No generic persisted root V3, `collaboration_runs` path, optional-coordinator
  root blob, or `AgentOrgDefinition extends AgentTeamDefinition`.
- No configured recursive `members` under Team and no reuse of task factories
  for configured membership.
- No normal reader that tries both stores, scans both family paths for an ID,
  auto-moves/retypes payload, or infers kind.
- No caller depending on a subject service/manager and its provider/store at the
  same level.
- No pre-launch Org entry/focus, fallback recipient, global address lookup, Team
  copy, client-authoritative launch plan, last-write-wins definition save,
  per-handoff write, or stale-handoff auto-repair.

## Interface Boundary Mapping

| Interface / Method | Subject | Responsibility | Identity Shape | Notes |
| --- | --- | --- | --- | --- |
| `DefinitionSourceRegistry.list()` | Source ownership | Return allowlisted package roots with explicit source class/mutation owner | descriptor + canonical paths | No decoding and no ID-based write inference. |
| `DefinitionAdmissionService.scan/requireAvailable` | New-work admission | Exact target decode, stable rejection, dependency closure | subject kind + definition ID or source descriptor | No legacy retry/write; history does not call it. |
| GraphQL `definitionAdmissionDiagnostics` | Operations | Inspect unavailable packages/dependencies | source root + definition path/ID + expected family/version | Actionable owner message; external incompatibility is not readiness failure. |
| `AgentOrgDefinitionService.create/update/get/list` | Org definition | Complete Org/ref/handoff CRUD | Org definition ID; explicit Agent/Team refs; expected revision | No coordinator; typed candidate/conflict result. |
| `AgentTeamDefinitionService.create/update/get/list` | Team definition | Complete flat Team/local-handoff CRUD | Team definition ID; Agent refs only; expected revision | Coordinator is exact direct Agent. |
| `DefinitionEndpointCatalog.project(candidate)` | Handoff choices | Eligible exact From/To and Team coordinator metadata | subject kind + complete candidate | Server validator authoritative. |
| `CollaborationHandoffCompiler.compileOrg/compileTeam` | Runtime handoff snapshot | Fixed-depth effective ordered edges | resolved Org or flat Team | Org saved order first, then Team-local saved lists in stable Org member order; no later reorder. |
| `CollaborationLaunchConfigurationResolver.resolveOrg/resolveTeam` | Launch config | Produce complete effective settings | root config + unique exact patches | No focus/definition mutation. |
| `AgentOrgRunService.create(command)` | Org launch | Validate/activate full Org scope | `{agentOrgDefinitionId, rootConfiguration, teamOverrides, agentOverrides}` | Returns `{agentOrgRunId}` only. |
| `AgentTeamRunService.create(command)` | Team launch | Native coordinator-led flat Team | `{agentTeamDefinitionId, rootConfiguration, agentOverrides}` | Returns Team run ID; existing result naming may remain. |
| `AgentOrgRunManager.restore(orgRunId)` | Org runtime | Restore exact Org V1 | Org run ID already known as Org | Calls only Org store; no guessing. |
| `AgentTeamRunManager.restore(rootTeamRunId)` | Team runtime | Restore exact Team V2 | Team run ID already known as Team | Calls only Team store. |
| `AgentOrgRun.resolveRecipient(address)` / `RootTeamRun.resolveRecipient(address)` | Active target | Same-root exact resolution | canonical non-root address | Team address uses coordinator in Org; Team root has Agent destinations. |
| subject root `delegateTask(caller,input)` | Task lifecycle | Authorize/prepare/commit/activate task | exact caller identity + mounted address | No global definition selector. |
| `TeamRunExecutionTreeStoreV2.read/write(rootTeamRunId)` | Team durability | Exact native Team V2 | Team package identity | Existing path/file/keys unchanged. |
| `AgentOrgRunExecutionTreeStoreV1.read/write(orgRunId)` | Org durability | Exact Org V1 | Org package identity | `subjectKind/rootOrg`, no coordinator. |
| `RootExecutionProjectionService.get({root_subject_kind, root_run_id})` | Mixed query | Explicit dispatch and union projection | compound kind + ID | Payload/family/result branch must agree. |
| GraphQL Org surfaces | Org external | Catalog/author/detail/config/launch | Org-specific inputs/results | No entry selector or per-handoff mutation. |
| GraphQL Team surfaces | Team external | Catalog/author/detail/standalone launch | Team-specific inputs/results | Agent-only members; Team-only compatibility where retained. |
| Mixed stream handshake | Mixed root view | Tagged snapshot/events | `{root_subject_kind, root_run_id}` | Team-only stream may remain compatible. |
| Existing application Team ref | Application launch | Continue flat Team resource launch | `{refType:'agent_team', definitionId}` | No application-owned Org surface this round. |
| Web `CollaborationFocusController.select(addressOrNull)` | Local focus | Exact selection/send readiness | address in current tagged snapshot | Team row -> coordinator; null never persists. |

## Interface Boundary Check

| Interface | Singular? | Explicit Identity? | Risk | Corrective Action |
| --- | --- | --- | --- | --- |
| Definition source registry/admission | Yes | Yes | Medium | Explicit source class, exact one-family codec, unavailable data result, no legacy retry. |
| Org definition API | Yes | Yes | Low | Reject coordinator/nested Org. |
| Team definition API | Yes | Yes | Low | Agent-only member input. |
| Definition transaction | Yes | Yes | Medium | Complete candidate + expected revision + package journal. |
| Subject run services/managers | Yes | Yes | Low | No public generic create/restore guessing kind. |
| Configuration resolver | Yes | Yes | Medium | Exact patches; server recomputes; all-or-nothing validation. |
| Subject tree stores | Yes | Yes | Low | Each path/store accepts one family/version/root only. |
| Mixed projection | Yes | Yes | Medium | Compound kind+ID; verify family/payload/branch. |
| Recipient resolver | Yes | Yes | Low | Canonical parser/index; reject root/depth/unknown. |
| Application Team launch | Yes | Yes | Medium | Preserve explicit Team ref and Team service. |
| Web focus/send | Yes | Yes | Medium | Nullable for Org; exact mapping; never fallback. |

## Main Domain Subject Naming Check

| Subject | Current / Target Name | Natural? | Risk | Action |
| --- | --- | --- | --- | --- |
| Multi-Team composition | recursive `AgentTeamDefinition` / `AgentOrgDefinition` | Yes | Low | Delete recursive Team representation. |
| Flat unit | `AgentTeamDefinition` / same, Agent-only | Yes | Low | Never add `FlatTeam`. |
| Team root aggregate | `RootTeamRun` / same, flat | Yes | Low | Preserve native Team owner/name. |
| Org root aggregate | none / `AgentOrgRun` | Yes | Low | New subject; no generic root wrapper. |
| Team durable tree | `TeamRunExecutionTreeFileV2` / same | Yes | Low | Preserve exact contract. |
| Org durable tree | none / `AgentOrgRunExecutionTreeFileV1` | Yes | Low | Distinct exact contract. |
| Mixed read DTO | Team-only view / `RootExecutionTreeProjection` | Yes | Medium | Always require `root_subject_kind`. |
| Logical address | `AgentTeamAddress` / `CollaborationAddress` | Yes | Low | String format unchanged; semantics span Org/Team. |
| Org source scope | legacy `team_local` / `agent_org_owned` | Yes | Medium | Do not parse historical opaque ID prefix. |

## Existing Capability / Subsystem Reuse Check

| Need | Existing Capability | Decision | Why / Boundary |
| --- | --- | --- | --- |
| Target definition admission | Existing source paths/providers and catalog scans | Create cross-subject admission capability over strict subject codecs | Source ownership and dependency availability span Team/Org, but the capability owns neither subject mutation nor runtime history. |
| Org definition | Team provider/package patterns | New subject; reuse Markdown/config/source/transaction primitives | Team owner cannot absorb coordinator-free direct Team refs. |
| Flat Team definition | AgentTeam definition | Refactor existing | Retain ID/source/catalog; remove Team member kind/recursion. |
| Addresses/handoffs | `agent-collaboration` and current compiler | Extend | Same canonical addresses/records; compiler becomes explicit fixed-depth. |
| Standalone Team runtime | `agent-team-execution` | Preserve/refactor locally | It already owns native Team lifecycle/V2; contract configured children out. |
| Org runtime | mixed Team backend/TeamRun/Agent factory/task primitives | New `agent-org-execution`; compose narrow public mechanisms | Separate aggregate/store is required; duplicating Agent/Team execution loops is not. |
| Persisted records | current Team tree domain/schema | Extract tight shared record types/validators | Reuse exact fields without generic root. |
| Team durability/history | current Team store/index/memory layout | Preserve and narrow | Byte/path compatibility is approved. |
| Org durability/history | current atomic store/index patterns | Create subject store/index | Separate family/path/root invariant. |
| Mixed projection | Team history/stream/projectors | Add thin explicit-kind facade; retain Team-only paths | Shared UI needs one union, but lifecycle/storage stay subject-owned. |
| Migration | app-data migrations | Extend | Existing ledger/readiness; no lazy compatibility. |
| Web workspace | Team execution view components/state | Extract mixed read view around two union branches | Shared interactions should not duplicate; focus policy remains root-kind-specific. |
| Org authoring | Team form primitives | New subject-specific UI | Membership/coordinator semantics differ. |
| Launch precedence | current Team config hierarchy | Extract/extend | Existing root/placement logic; server authority is new. |
| Definition atomic save | parent mutations + atomic file writer | Extend with package transaction | Multiple package files need revision/journal/recovery. |
| Handoff UI | current record + Product design | Shared presentational primitives | Endpoint eligibility/persistence remain subject owners. |

## Subsystem / Capability-Area Allocation

| Subsystem | Owns | Spines | Decision | Notes |
| --- | --- | --- | --- | --- |
| Collaboration Definition Admission | Source registry, target-only decode result, dependency availability, diagnostics/new-work gate | DS-000, DS-007 | Create | External roots are read-only; runtime/history do not depend on live admission. |
| AgentOrg Definition | Org domain/config/source/ref/candidate/catalog | DS-001, DS-007, DS-011 | Create | Query Team definitions only. |
| AgentTeam Definition | Agent-only Team/coordinator/local source | DS-001, DS-002, DS-011 | Refactor | Remove Team-owned Team sources. |
| Agent Collaboration | address/handoff/endpoint catalog/task delegation primitives | DS-003-DS-005, DS-009 | Extend | Shared mechanisms, not generic root authority. |
| AgentTeam Execution | RootTeamRun/TeamRun/Team manager/service/V2 persistence coordination | DS-002, DS-004-DS-006T | Refactor/Preserve | Native Team family retained. |
| AgentOrg Execution | AgentOrgRun/manager/service/planner/index/V1 persistence coordination | DS-003-DS-006O | Create | Composes direct Agent and flat Team mechanisms. |
| Run History/Persistence | strict subject schemas/stores/indexes and tagged mixed catalog | DS-006T, DS-006O, DS-008 | Extend | Two authorities; mixed derived facade. |
| App Data Migration | old config/Org-like V2 conversion and promotion | DS-007, DS-010 | Extend | Flat Team path is verification-only. |
| GraphQL/Application | subject definition/run plus mixed read contracts | DS-001-DS-003, DS-008 | Extend | No bypass; Team application ref preserved. |
| Stream Contracts | compatible Team view + new Org/tagged mixed view | DS-008 | Extend | No forced Team wire rewrite. |
| Web Definition Authoring | separate Team/Org surfaces + shared handoff primitives | DS-001, DS-011 | Create/Refactor | RV-012 normative. |
| Web Launch Configuration | separate drafts + shared preview | DS-002, DS-003, DS-012 | Create/Refactor | Org no focus; Team coordinator-led. |
| Web Root Workspace | tagged live/history projection + focus | DS-008, DS-013 | Refactor | Branch-specific selectors, one visual workspace. |

## Draft File Responsibility Mapping

| Candidate File | Subsystem | Concern | Why One File / Reuse |
| --- | --- | --- | --- |
| `collaboration-definition-admission/domain/definition-source-descriptor.ts` | Definition Admission | Explicit source class/mutation owner/path | One cross-subject ownership vocabulary. |
| `collaboration-definition-admission/domain/definition-admission-result.ts` | Definition Admission | Available/unavailable result and diagnostic codes | Data result shared by catalogs/operations. |
| `collaboration-definition-admission/providers/definition-source-registry.ts` | Definition Admission | Allowlisted registered roots/descriptors | Discovery only; no decode/write. |
| `collaboration-definition-admission/services/definition-admission-service.ts` | Definition Admission | Exact target codec dispatch/new-work gate | One target-only policy; no history/legacy dependency. |
| `collaboration-definition-admission/services/definition-dependency-availability.ts` | Definition Admission | Org→Team availability closure | One deterministic dependency diagnostic owner. |
| `agent-org-definition/domain/agent-org-definition.ts` | Org Definition | Org direct members/handoffs/defaults | One subject; reuse address/handoff types. |
| `agent-org-definition/providers/agent-org-definition-config-v1.ts` | Org Definition | Exact Org V1 file codec | No coordinator or legacy acceptance. |
| `agent-team-definition/domain/agent-team-definition.ts` | Team Definition | Agent-only members/coordinator | Existing subject narrowed. |
| `agent-team-definition/providers/agent-team-definition-config-v2.ts` | Team Definition | Exact Team V2 file codec | No member `refType` or legacy normalization. |
| `agent-collaboration/definition/resolved-collaboration-topology.ts` | Collaboration | Explicit Org and Team resolved variants | Shared compiler input, never recursive generic. |
| `agent-collaboration/definition/collaboration-handoff-compiler.ts` | Collaboration | `compileOrg`/`compileTeam` | One ordered endpoint policy. |
| `agent-collaboration/definition/definition-endpoint-catalog.ts` | Collaboration | From/To eligibility/coordinator metadata | One authoring vocabulary. |
| `agent-collaboration/services/collaboration-launch-configuration-resolver.ts` | Collaboration | Fixed-depth effective settings | One precedence owner. |
| `run-history/domain/run-execution-tree-shared-records.ts` | Persistence | Exact shared envelope field/Agent/Team/task record types | No root union; both subject trees compose. |
| `run-history/store/run-execution-tree-shared-record-schemas.ts` | Persistence | Exact reusable zod schemas | Avoid duplicate field validators. |
| existing `agent-team-execution/domain/team-run-execution-tree.ts` | Team Execution | Exact Team V2 domain/root | Preserve native owner. |
| existing `run-history/store/team-run-execution-tree-*.ts` | Team Persistence | Exact V2 schema/path/store | Preserve file/path/keys; narrow configured members. |
| `agent-org-execution/domain/agent-org-run-execution-tree.ts` | Org Execution | Exact Org V1 domain/root | New subject contract. |
| `run-history/store/agent-org-run-execution-tree-*.ts` | Org Persistence | Exact V1 schema/path/store | New family-specific store. |
| `agent-org-execution/domain/agent-org-run.ts` | Org Execution | Org aggregate/direct handles/index | No coordinator/generic root. |
| `agent-org-execution/services/agent-org-topology-planner.ts` | Org Execution | Fixed Org plan | Subject-specific IDs/placements. |
| `agent-org-execution/services/agent-org-run-manager.ts` | Org Execution | Active Org registry/restore | One family manager. |
| `run-history/services/root-execution-projection-service.ts` | Mixed Read | Explicit-kind dispatch/tagged DTO | Thin derived facade only. |
| `app-data-migrations/.../legacy-team-definition-config.ts` | Migration | Retired unversioned server-owned decoder | Cannot be imported by normal admission. |
| `app-data-migrations/.../team-v2-to-agent-org-v1-transformer.ts` | Migration | Org-like Run V2 mapping | Old runtime knowledge isolated. |
| `autobyteus-team-stream-contracts/...` | Team Stream | Existing Team-only contract | Keep compatible where still used. |
| new mixed/Org stream DTO file/package | Stream | `root_subject_kind` union | Adds Org without retyping Team-only callers. |
| `autobyteus-web/stores/agentOrgDefinitionStore.ts` | Web Authoring | Org catalog/draft/revision/errors | Separate subject state. |
| `autobyteus-web/components/collaboration/handoffs/*` | Web Authoring | From/To/When cards/editor/reorder/errors | Shared presentation; owner supplies policy. |
| `autobyteus-web/stores/agentOrgRunConfigStore.ts` | Web Config | Org root/Team/Agent sparse overrides | Org-specific intent. |
| `autobyteus-web/stores/rootExecutionViewStore.ts` | Web Workspace | Tagged open/connect/history state | One mixed read owner, not persistence authority. |
| `autobyteus-web/services/rootExecution/rootExecutionViewState.ts` | Web Workspace | union selectors/reducer/focus mapping | Branch-aware exact selection. |

## Reusable Owned Structures Check

| Structure / Logic | Shared Owner | Why Shared | Must Not Become |
| --- | --- | --- | --- |
| Definition source descriptor/admission result | collaboration-definition-admission | Team/Org catalogs need the same explicit source/availability semantics | Definition union that owns mutation/runtime |
| Canonical address | `agent-collaboration/domain/collaboration-address.ts` | Definition/runtime/transport share exact string rules | Global run locator |
| Resolved topology variants | `resolved-collaboration-topology.ts` | Compiler/endpoint/config use same fixed-depth placements | Recursive generic tree |
| Persisted Agent/Team/handoff/launch/task records | `run-history/domain` + `store` shared-record files | Keys/meaning are approved identical | Generic root schema or optional-field blob |
| Launch configuration merge | Collaboration resolver + pure field merge module | Org and Team reuse field precedence | Focus/coordinator policy |
| Task delegation mechanism | Collaboration task service interface | Both roots authorize/commit fresh tasks similarly | Configured membership API |
| Handoff UI model | web collaboration components | Display/edit commands repeat | Endpoint/persistence owner |
| Mixed projection DTO | stream/history contract | Server/web share explicit union | Client-inferred kind |
| Definition package transaction | definition provider utility | Org/Team multi-file save needs same crash safety | Domain validator or global lock |

## Shared Structure / Data Model Tightness Check

| Structure | Singular Meaning? | Overlap Risk | Corrective Action |
| --- | --- | --- | --- |
| `DefinitionAdmissionResult` | Yes | Medium | Available branch contains one exact subject; unavailable branch is diagnostic data, never a fallback definition. |
| `AgentOrgDefinition` | Yes | Low | No coordinator/inherited Team fields. |
| `AgentTeamDefinition` | Yes | Low | Agent-only member record. |
| Shared persisted configured/task records | Yes | Medium | Exact current fields only; no root IDs/discriminator added. |
| `TeamRunExecutionTreeFileV2` | Yes | Low | Remains exact native Team family. |
| `AgentOrgRunExecutionTreeFileV1` | Yes | Low | Exact Org keys; no optional coordinator/focus. |
| `RootExecutionTreeProjection` | Yes | Medium | `root_subject_kind` selects exact DTO branch; projection only. |
| `DefinitionRevision` | Yes | Low | Opaque provider token only. |
| `PlacementLaunchOverride` | Yes | Medium | Exact address+subject kind; no focus. |
| Internal root/host identity vs approved old task field spellings | Yes per boundary | Medium | Map once in versioned codec; do not rename persisted shared records. |
| Migrated Org-owned definition ID | Yes, opaque | Medium | Source index owns mapping; never parse prefix. |

## Final File Responsibility Mapping

| File / Path | Owner | Concrete Responsibility | Dependency Rule |
| --- | --- | --- | --- |
| `autobyteus-server-ts/src/collaboration-definition-admission/domain/definition-source-descriptor.ts` | Definition Admission | Source class, mutation owner, canonical root/path | No codecs or filesystem mutation. |
| `.../collaboration-definition-admission/domain/definition-admission-result.ts` | Definition Admission | Available branch and stable unavailable diagnostic contract | No legacy payload/domain object. |
| `.../collaboration-definition-admission/providers/definition-source-registry.ts` | Definition Admission | Allowlisted server/repository/external root descriptors | No decoding; external descriptors cannot become writable. |
| `.../collaboration-definition-admission/services/definition-admission-service.ts` | Definition Admission | Select exact target codec, emit results, guard new work | No migration import, write, runtime/history filtering. |
| `.../collaboration-definition-admission/services/definition-dependency-availability.ts` | Definition Admission | Deterministic Org→Team unavailable closure/chain | No partial Org admission or Team mutation. |
| `autobyteus-server-ts/src/agent-org-definition/domain/agent-org-definition.ts` | Org Definition | Org metadata/direct member/handoff/default/source invariant | Imports public Agent/Team ref and collaboration types only. |
| `.../agent-org-definition/providers/agent-org-definition-config-v1.ts` | Org Definition | Strict exact Org Definition Config V1 codec | No Team root alias, coordinator, unknown key, or legacy fallback. |
| `.../agent-org-definition/providers/file-agent-org-definition-provider.ts` | Org Definition | Org source reads + definition-package transaction adapter | Provider not called above service. |
| `.../agent-org-definition/services/agent-org-definition-resolver.ts` | Org Definition | Direct Agent/Team ref resolution/depth | Team query interface only. |
| `.../agent-org-definition/services/agent-org-definition-service.ts` | Org Definition | Authoritative validate-before-write CRUD/catalog | Encapsulates resolver/provider. |
| `.../agent-team-definition/domain/agent-team-definition.ts` | Team Definition | Agent-only Team/coordinator | No Org or Team member union. |
| `.../agent-team-definition/providers/agent-team-definition-config-v2.ts` | Team Definition | Strict exact Team Definition Config V2 codec | Numeric v2; no member `refType`, unknown key, or legacy fallback. |
| `.../agent-team-definition/services/agent-team-definition-service.ts` | Team Definition | Flat validate-before-write CRUD/catalog | Encapsulates provider. |
| `.../agent-team-definition/providers/definition-package-transaction.ts` (or neutral sibling provider utility) | Definition persistence | Revision lock/stage/journal/promote/recover | Used only by subject providers/services. |
| `.../agent-collaboration/domain/collaboration-address.ts` | Collaboration | Parse/build/rebase/depth | Not a global locator. |
| `.../agent-collaboration/definition/collaboration-handoff-compiler.ts` | Collaboration | Explicit Team/Org compile | Resolved topology only. |
| `.../agent-collaboration/definition/definition-endpoint-catalog.ts` | Collaboration | Eligible endpoints/coordinator metadata | Candidate topology only. |
| `.../agent-collaboration/services/collaboration-launch-configuration-resolver.ts` | Collaboration | Org/Team effective launch settings | No activation/focus. |
| `.../run-history/domain/run-execution-tree-shared-records.ts` | Persistence | Shared exact record types | No root union. |
| `.../run-history/store/run-execution-tree-shared-record-schemas.ts` | Persistence | Shared exact record validators | No path/family selection. |
| existing `.../agent-team-execution/domain/team-run-execution-tree.ts` | Team Execution | Exact Team V2 domain/root | Compose shared records; Agent-only members. |
| existing `.../run-history/store/team-run-execution-tree-schema.ts` | Team Persistence | Strict V2 exact keys/invariants | Never accept Org V1. |
| existing `.../run-history/store/team-run-execution-tree-path.ts` | Team Persistence | `$MEMORY_ROOT/agent_teams/<id>/team_run_execution_tree.json` | Unchanged. |
| existing `.../run-history/store/team-run-execution-tree-store.ts` | Team Persistence | Native V2 atomic read/write | No try-Org fallback. |
| existing `.../run-history/store/team-run-file-commit-writer.ts` | Team Persistence | Correlated Team V2 tree/task/metadata commit sequence | Retain Team-only semantics and package path. |
| `.../agent-org-execution/domain/agent-org-run-execution-tree.ts` | Org Execution | Exact Org V1 domain/root | Compose shared records. |
| `.../agent-org-execution/domain/agent-org-run.ts` | Org Execution | Org aggregate/direct Agent/Team handles/index/events | No coordinator; owns Org operations. |
| `.../agent-org-execution/services/agent-org-topology-planner.ts` | Org Execution | Fixed-depth run plan/IDs | No raw provider reads. |
| `.../agent-org-execution/services/agent-org-run-manager.ts` | Org Execution | Org active registry/factory/restore | Calls Org store only. |
| `.../agent-org-execution/services/agent-org-run-service.ts` | Org Execution | Config-first full-scope create/restore/stop | Public Org boundary. |
| `.../agent-team-execution/services/flat-team-topology-planner.ts` | Team Execution | Team->Agents plan | Replaces configured recursive planning. |
| existing Team run manager/service/root files | Team Execution | Native Team lifecycle/registry/coordinator | Call Team V2 store only. |
| `.../run-history/store/agent-org-run-execution-tree-schema.ts` | Org Persistence | Strict Org V1 keys/invariants | Never accept Team V2. |
| `.../run-history/store/agent-org-run-execution-tree-path.ts` | Org Persistence | `$MEMORY_ROOT/agent_orgs/<id>/agent_org_run_execution_tree.json` | Exact approved path. |
| `.../run-history/store/agent-org-run-execution-tree-store.ts` | Org Persistence | Native Org V1 atomic read/write | No try-Team fallback. |
| `.../run-history/store/agent-org-run-file-commit-writer.ts` | Org Persistence | Correlated Org V1 tree/task/metadata commit sequence | Mirrors fail-stop mechanics, not Team root semantics. |
| existing `.../agent-memory/store/agent-memory-layout.ts` | Memory layout | Preserve Team package locator; add explicit Org package locator and compound-kind projection mapping | No kind inference or one generic physical root. |
| `.../run-history/domain/agent-org-run-history-index.ts` + store/service | Org History | Org history rows/index | Subject-specific authority. |
| existing Team history index/store/service | Team History | Native Team history | Retained for Team. |
| `.../run-history/services/root-run-history-catalog-service.ts` | Mixed Read | Merge tagged Team/Org derived rows | Calls subject query boundaries. |
| `.../run-history/services/root-execution-projection-service.ts` | Mixed Read | Explicit compound identity -> tagged tree DTO | No file scan/guess/lifecycle. |
| `.../app-data-migrations/migrations/agent-org-flat-team-families-v1/*` | Migration | Plan/old codecs/transform/stage/promote/recover/verify | Only old-shape owner. |
| `.../api/graphql/types/definition-admission.ts` | GraphQL Operations | Unavailable definition/dependency diagnostics query | Admission service only; does not make invalid definitions launchable. |
| `.../api/graphql/types/agent-org-definition.ts` | GraphQL | Org definitions/mutations | Org service only. |
| `.../api/graphql/types/agent-org-run.ts` | GraphQL | Org config launch/lifecycle | Org run service only. |
| existing Team GraphQL definition/run files | GraphQL | Flat Team authoring/native launch | Remove nested input; preserve compatible Team results where possible. |
| existing Team stream contract/projector files | Team Stream | Team-only V2-compatible snapshot/events | No Org payload. |
| new `autobyteus-collaboration-stream-contracts/src/root-execution-view-dtos.ts` with package name `@autobyteus/collaboration-stream-contracts` | Mixed Stream | Tagged Team-V2/Org-V1 union | Must not replace Team-only contract unless all consumers intentionally migrate. |
| `autobyteus-web/stores/agentOrgDefinitionStore.ts` | Web Authoring | Org catalog/draft/revision/errors | Org GraphQL only. |
| `autobyteus-web/stores/agentTeamDefinitionStore.ts` | Web Authoring | Flat Team draft/revision/errors | Team GraphQL only. |
| `autobyteus-web/components/collaboration/handoffs/HandoffList.vue` | Web UI | Ordered From/To/When display/read-only owner label | Presentation only. |
| `.../HandoffEditor.vue` | Web UI | Inline endpoint/condition CRUD/reorder/cancel/errors | Subject commands/catalog only. |
| `autobyteus-web/stores/agentOrgRunConfigStore.ts` | Web Config | Org root + Team/Agent override intent | No focus. |
| existing Team run config store (renamed only if repository convention demands) | Web Config | Simplified Team root/Agent overrides | Coordinator behavior retained. |
| `autobyteus-web/stores/rootExecutionViewStore.ts` | Web Workspace | Tagged active/history view and transport lifecycle | Projection, not root authority. |
| `autobyteus-web/services/rootExecution/rootExecutionViewState.ts` | Web Workspace | Union reducer/selectors/exact focus mapping | Clear invalid Org focus; never choose fallback. |
| approved Team/Org catalog/form/detail/config/workspace Vue components | Web UI | RV-012 states/layout/responsive/accessibility | Use production stores, never prototype mocks. |

## Applied Patterns

- **Subject-specific aggregates and stores:** Team and Org are peers with exact
  invariants; no optional-field generic root.
- **Composition of tight shared records:** approved child/handoff/launch/task
  shapes are shared without merging root schemas or paths.
- **Explicit discriminated projection:** `root_subject_kind` exists at mixed
  read/stream/workspace boundaries, never as a substitute persisted Team field.
- **Immutable topology snapshot:** launch snapshots definitions; restore never
  reinterprets topology from mutable definitions.
- **Validate-plan-commit:** validation completes before IDs/persistence/runtime.
- **Revisioned package transaction:** complete definition files commit/recover as
  one aggregate under lock and expected revision.
- **Most-specific configuration overlay:** root, Team placement, exact Agent.
- **Nullable client focus:** Org activation owns no recipient; explicit selection
  creates temporary exact focus.
- **Native current stores plus isolated migration:** Team V2 and Org V1 are both
  current; only organization-like old Team V2 is historical migration input.
- **Derived tagged catalog:** mixed history/stream rows are rebuildable and never
  topology authority.
- **Target-only admission result:** source classification and exact decoding
  produce available definitions or actionable data; there is no exception-driven
  fallback parse and live definition availability never reinterprets history.

## Target Subsystem / Folder / File Mapping

| Path | Kind | Owner | Responsibility | Must Not Contain |
| --- | --- | --- | --- | --- |
| `autobyteus-server-ts/src/collaboration-definition-admission/` | New folder | Definition Admission | source registry, exact target admission/dependency closure, diagnostics/new-work gate | legacy decoder, definition writes, runtime/history policy |
| `autobyteus-server-ts/src/agent-org-definition/` | New folder | Org Definition | Org domain/provider/service/source ownership | runtime managers, Team mutation |
| `autobyteus-server-ts/src/agent-team-definition/` | Existing folder | Team Definition | Agent-only Team/coordinator/local Agents | Org members, recursive resolver |
| `autobyteus-server-ts/src/agent-collaboration/definition/` | Existing/extended | Collaboration | resolved variants, endpoint catalog, handoff compilation | file I/O, live runs |
| `autobyteus-server-ts/src/agent-collaboration/services/` | Existing/extended | Collaboration | configuration resolver and reusable root-scope mechanisms | root registry or persisted root union |
| `autobyteus-server-ts/src/agent-team-execution/` | Existing folder | Team Execution | native RootTeamRun/TeamRun/manager/service, flat planner | Org root, configured Team children |
| `autobyteus-server-ts/src/agent-org-execution/` | New folder | Org Execution | AgentOrgRun/manager/service/planner/index | Team V2 authority, coordinator |
| `autobyteus-server-ts/src/run-history/domain/` | Existing folder | Persistence contracts | shared exact records + subject history rows | generic persisted root |
| `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-*.ts` | Existing files | Team Persistence | exact native V2 schema/path/store | Org keys or fallback |
| `autobyteus-server-ts/src/run-history/store/agent-org-run-execution-tree-*.ts` | New files | Org Persistence | exact V1 schema/path/store | Team root or try-both logic |
| `autobyteus-server-ts/src/agent-memory/store/agent-memory-layout.ts` and memory sync/classifier callers | Existing files | Memory layout | retain Team paths; add Org paths and explicit-kind dispatch | inferred kind or path rewrite for flat Teams |
| `autobyteus-server-ts/src/run-history/services/root-*-projection*.ts` | New files | Mixed Read | explicit-kind derived catalog/tree projection | lifecycle, kind inference |
| `autobyteus-server-ts/src/persistence/file/atomic-directory-transaction.ts` | New shared file | File persistence | lock-agnostic staged directory promotion/recovery primitive | definition rules or root-family policy |
| `autobyteus-server-ts/src/app-data-migrations/migrations/agent-org-flat-team-families-v1/` | New folder | Migration | server-owned retired definition and Org-like Team Run conversion knowledge | current services importing old codecs; external writers/converters |
| `autobyteus-server-ts/src/api/graphql/types/agent-org-*.ts` | New files | GraphQL Org adapter | Org definitions/run APIs | Team coordinator default/focus |
| `autobyteus-server-ts/src/api/graphql/types/definition-admission.ts` | New file | GraphQL Operations | actionable unavailable definition/dependency diagnostics | fallback activation or source mutation |
| existing `agent-team-*.ts` GraphQL files | Existing files | GraphQL Team adapter | flat Team APIs | Team member kind containing Team |
| `autobyteus-team-stream-contracts/` | Existing package | Team stream | compatible Team-only view/events | Org payload |
| `autobyteus-collaboration-stream-contracts/` | New package | Mixed stream | tagged Team/Org snapshot/events | runtime logic or inferred kind |
| `autobyteus-web/components/agentOrgs/` | New folder | Web Org | RV-012 catalog/detail/builder | coordinator/entry/copy Team |
| `autobyteus-web/components/agentTeams/` | Existing folder | Web Team | Agent-only Team authoring/detail | Team library/nesting UI |
| `autobyteus-web/components/collaboration/handoffs/` | New shared UI | Handoff presentation | From/To/When list/editor/reorder/errors | endpoint/persistence policy |
| subject run-config stores | Web config | Org/Team intent | separate root/placement drafts over shared pure merge | one conditional cross-subject blob |
| `autobyteus-web/services/rootExecution/` | New/refactored | Web read model | tagged union reducers/selectors/focus | definition policy, family guessing |
| workspace collaboration components | Web workspace | Product runtime presentation | full tree, tasks, messages, focus/prompt | recursive configured depth/persisted focus |
| package `agent-orgs/<id>/org.md`, `org-config.json`, optional `agents/`, `agent-teams/` | Physical source | Org provider | Org plus owned sources/references | nested Org or Team-under-Team |
| package `agent-teams/<id>/team.md`, `team-config.json`, optional `agents/` | Physical source | Team provider | reusable standalone Team | child `agent-teams/` source |
| `$MEMORY_ROOT/agent_teams/<rootTeamRunId>/team_run_execution_tree.json` | Exact physical authority | Team V2 store | native Team execution tree/package | `subjectKind`, Org root, path move |
| `$MEMORY_ROOT/agent_orgs/<orgRunId>/agent_org_run_execution_tree.json` | Exact physical authority | Org V1 store | native Org execution tree/package | coordinator/focus, Team root |
| `$MEMORY_ROOT/team_run_history_index.json` | Existing derived file | Team History | native Team rows | Org rows after migration |
| `$MEMORY_ROOT/agent_org_run_history_index.json` | New derived file | Org History | Org rows | Team rows |

### Files/Paths Deleted Or Renamed As A Unit

- Do **not** rename/move `agent-team-execution`, Team V2 store/path files,
  `autobyteus-team-stream-contracts`, or native flat Team runtime directories as
  a generic collaboration subsystem. RER-016 explicitly retains them.
- Delete configured-recursion owners after all callers move: recursive Team
  graph resolver/validator, Team-local Team discovery, recursive configured
  planner branches/types, configured-child-Team factory path, nested Team
  selectors/inputs, and Org-as-Team UI/API code.
- Replace/delete the normal unversioned `team-definition-config.ts` codec and
  exports as one unit after the migration-only decoder and both strict target
  codecs are in place. No compatibility re-export or silent normalizer remains.
- Add `agent-org-execution` beside Team execution. Extract only concrete shared
  records/mechanisms; do not move the whole Team subsystem to manufacture a
  generic root.
- Regenerate `autobyteus-web/generated/graphql.ts` and mixed stream generated
  types from new authoritative schemas. Do not hand-maintain compatibility
  aliases.
- Runtime migration moves only organization-like package directories from
  `agent_teams` through non-discoverable staging to `agent_orgs`; flat Team
  directories/files are untouched.
- No file/path under `/home/autobyteus/workspace/autobyteus-agents` or
  `/home/autobyteus/workspace/autobyteus-private-agents` is added, deleted,
  renamed, committed, or released by this ticket. They appear only in
  source-registry/admission and zero-write validation evidence.

## Folder Boundary Check

| Folder | Depth / Boundary | Clear? | Justification |
| --- | --- | --- | --- |
| `collaboration-definition-admission` | domain/providers/services | Yes | Cross-subject source/admission policy, no subject mutation or runtime authority. |
| `agent-org-definition` | Subject domain/services/providers | Yes | Org has independent authoring/source invariant. |
| `agent-team-definition` | Subject domain/services/providers | Yes | Flat Team remains independently launchable/reusable. |
| `agent-collaboration` | Shared address/handoff/config mechanisms | Yes | Tight cross-root semantics; no root authority. |
| `agent-team-execution` | Team runtime root + Team mechanics | Yes | Existing ownership retained; configured recursion removed. |
| `agent-org-execution` | Org root runtime | Yes | New lifecycle/persistence subject; composes public Team mechanisms. |
| `run-history/store` | Subject stores + tight record schemas | Yes | Two strict authorities remain visibly separate. |
| migration folder | Historical transformation boundary | Yes | Only place old organization-like Team V2 is valid. |
| Team vs collaboration stream packages | Subject-only vs mixed transport | Yes | Avoids breaking Team-only consumers or false package naming. |
| Web `agentOrgs` / `agentTeams` | Subject-specific presentation | Yes | Prevents conditional invalid form state. |
| Web `rootExecution` | Mixed read-only/live projection | Yes | Shared workspace without owning definitions/persistence. |

## Concrete Examples / Shape Guidance

| Topic | Good Shape | Avoid | Why |
| --- | --- | --- | --- |
| Team reuse | Org member stores `{kind:'agent_team', ref:'software-engineering-team'}` and Org handoffs; Team source/ID/history unchanged | Copy/fork Team into Org subtype | REQ-018. |
| Team durable tree | Existing flat Team stays `schemaVersion:2`, `rootTeam`, same file/path | Add subjectKind/root rename or version bump | Approved native no-op. |
| Org durable tree | `schemaVersion:1`, `subjectKind:'agent_org'`, `rootOrg`, no coordinator, separate path | Generic root file with optional coordinator | Exact approved Org truth. |
| Mixed projection | `{root_subject_kind:'agent_team', execution_tree: teamV2Dto}` or Org branch | Infer from missing coordinator/version/name | Fail-closed correctness. |
| Fixed depth | Org `/software_engineering_team/architecture_designer`; Team `/architecture_designer` | `/department/team/subteam/agent` | Explicit configured ownership. |
| Task host | Org Agent delegates to `/software_engineering_team`; fresh task Team lives in exact host `taskExecutions` | Add task Team to Org `members` | Configured vs task distinction. |
| Handoff compile | Org saved edges first; then each Team-local saved list in stable Org placement order, rebased once | Team-local-first, owner regrouping, sorting/deduping, or recursive indefinite compile | Preserves current observable rule lookup and owner separation. |
| Definition admission | exact Team Config V2/Org Config V1 -> available, or stable unavailable diagnostic | retry old parser, silently add/remove `refType`, or mutate external source | REQ-026/027 target-only boundary. |
| Definition save | Complete ordered candidate + expected revision -> validate -> journaled package commit | Per-handoff/per-file writes or silent stale repair | Atomicity/reversibility. |
| Org configuration | root choices + `/team` patch + `/team/agent` patch -> server complete plan | Trust client expansion or Team defaults silently win | Deterministic specificity. |
| Org focus | launch returns Org run ID/focus null; explicit Team row maps to stored coordinator | pre-launch entry, first Agent, durable focus | Activation/target separation. |
| Migration | server-owned definition conversion + flat runtime hash/path unchanged + Org-like runtime staging/promotion; external roots zero-write | rewrite external projects, rewrite all runtime Teams, try-both reader, recursive flattening | Minimal in-scope change and exact ownership/runtime contracts. |
| API split | explicit Org and Team create/restore plus compound mixed read identity | `createGroupRun(id)` or `getRun(id)` guesses kind | Subject authority. |

## Backward-Compatibility Rejection Log (Mandatory)

| Candidate | Decision | Clean-Cut Replacement / Preservation |
| --- | --- | --- |
| Keep recursive Team definitions beside Org | Rejected | Convert known Org roots; all current Team inputs reject Team members. |
| Keep unversioned Team config in normal admission | Rejected | Exact Team Definition Config V2 and Org Definition Config V1; legacy decode only for server-owned migration. |
| Retry/normalize retired external config | Rejected | One target-only unavailable diagnostic; external owner publishes the exact target package. |
| Rewrite the two external definition repositories in this ticket | Rejected as out of scope | Read-only validation/dependency diagnostics and separate owner follow-up; never claim their delivery. |
| Make Team coordinator optional | Rejected | Separate coordinator-free AgentOrg subject/root. |
| Generic persisted V3/root union/store/path | Rejected and superseded | Exact Team V2 + exact Org V1. |
| Rewrite/move flat Team V2 | Rejected | Leave file/path/bytes native; only stricter validation. |
| Normal reader tries Team then Org | Rejected | Explicit family/kind dispatch and strict one-family reader. |
| Leave migrated Org-like Team package in both paths | Rejected | Journaled source removal/staging/promotion; one canonical active path. |
| Auto-retype/move wrong-family payload on restore | Rejected | Failure-closed mismatch; migration is offline/startup only. |
| Recursively flatten unexpected depth | Rejected | PRE-002 failure before writes. |
| Copy Team on Org adoption | Rejected | Stable definition reference and Org-owned handoffs. |
| Global Team lookup in delegation | Rejected | Same-root mounted address only. |
| Keep ignored Org `entryAddress` | Rejected | Coordinated Org API/UI cut; full-scope no-focus launch. |
| Per-handoff mutations | Rejected | Complete revisioned parent candidate save. |
| Force old Team-only consumers onto mixed DTO | Rejected as unnecessary break | Retain compatible Team-only surface; add mixed/Org contracts. |

## Derived Layering

Explanatory only:

1. **Presentation/transport:** subject GraphQL, Team-only and mixed streams,
   Agent tools, web authoring/config/workspace.
2. **Application boundaries:** subject definition/run services, definition
   transaction, configuration resolver, mixed projection service.
3. **Domain/control:** Org/Team definitions, resolved topology, endpoint/handoff
   policy, subject planners/aggregates/indexes/task host invariants.
4. **Providers/persistence:** subject definition providers, Team V2 and Org V1
   stores/history/memory, lower-level Agent/Team runtime factories.
5. **Migration:** old configured recursion and organization-like Team V2 codecs,
   transaction journal/promoter; no upward dependency from current code.

A caller may not use both an application boundary and its internal
provider/manager/store.

## Change / Refactor Sequence

1. **Refresh/freeze base.** Integrate the latest authorized implementation base,
   verify worktree isolation, inspect any evolved dynamic-Team branch, and reject
   recursive configured mutation under REQ-017.
2. **Add strict definition admission and converted repository sources.** Add
   source descriptors/registry, exact Team Definition Config V2 and Org
   Definition Config V1 codecs, stable admission diagnostics/dependency closure,
   and migration-only legacy decoder. Convert only implementation-repository
   server-owned definition files and make CI target-scan them. Keep target-only
   catalog activation behind the startup migration/readiness gate.
3. **Add shared exact run-record modules and golden fixtures.** Extract current V2
   configured Agent/Team, handoff, launch, binding/timestamp, task Agent/Team
   field shapes without serialized change. Freeze byte-level native Team V2
   fixtures before modifying validators.
4. **Split definition subjects.** Add AgentOrg domain/config/provider/service;
   narrow AgentTeam to Agents; add fixed-depth resolved variants, endpoint
   catalog, explicit compiler methods, and full candidate typed errors.
5. **Fix and freeze effective handoff order.** Implement `compileTeam` and
   root-first `compileOrg`; prove Org saved order, stable Team placement order,
   each Team saved list, and `rules[]` order through snapshot, migration,
   `get_handoff_rules`, effective projection, and UI display.
6. **Add crash-safe definition aggregate save.** Implement generic atomic
   directory transaction primitive plus subject revision locks/adapters. Verify
   create/update/cancel/conflict/crash recovery and zero partial visibility.
7. **Preserve/contract Team runtime.** Keep RootTeamRun, Team manager/service,
   Team V2 store/path/history; replace configured recursive planner/index/factory
   with flat Team plan and Agent-only validation. Do not migrate flat packages.
8. **Add Org runtime/persistence.** Implement AgentOrg plan/run/manager/service,
   Org V1 tree schema/path/store/history/memory classification, direct TeamRun
   materialization through a narrow Team factory, host task ownership, and
   fail-stop commit/events.
9. **Add configuration resolver.** Server-authoritative Org root->Team->Agent and
   Team root->Agent resolution; validate all settings/workspaces before IDs and
   activation. Org returns no focus/entry.
10. **Add explicit mixed projections.** Preserve Team-only endpoints/contracts;
   add tagged history/tree/stream GraphQL and contract package, with family-
   payload-branch agreement and negative mismatch tests.
11. **Implement/register migration and admission cutover.** Place after prior V2
   prerequisites and before service admission. Test the current 27 no-op flat
   and 16 Org-like runtime fixtures plus cutover-generated cases; server-data
   definition conversion; implementation-source target scan; task hosts;
   collisions; cross-filesystem rejection; every crash state; PRE-002
   zero-write failure; external zero-write/non-blocking diagnostics; and
   cutover-inventory count drift.
12. **Cut definition/launch external contracts.** Add Org
   GraphQL/tools/package discovery and admission diagnostics; remove nested Team
   input; preserve compatible Team-only run DTOs; regenerate GraphQL/contracts.
13. **Implement web/Product cut.** Add separate Team/Org catalog/builder/detail,
   owner-scoped handoff drafts, Org config, tagged workspace/history, nullable
   Org focus, exact Team-coordinator mapping, availability-filtered new-work
   catalogs, and RV-012 desktop/narrow/a11y. Existing snapshot history remains
   visible even when a current definition is unavailable.
14. **Convert only owned examples and remove recursion.** Convert all
   implementation-repository/server-data definitions from the authoritative
   inventory. Use Software Development Department/Northstar external packages
   only as read-only admission/diagnostic fixtures until their owners update;
   do not edit or claim them. Delete current recursive configured
   owners/selectors/docs and the normal unversioned parser.
15. **Validate in risk order.** Exact definition/run schemas; source ownership
   and no-fallback admission; definition transactions; handoff order; subject
   runtimes/stores; migration; task restore; mixed projection mismatch; GraphQL/
   streams; web unit/browser flows for VIS-001-VIS-020 plus SCN-010/011; full
   builds/typechecks.

No temporary dual write, try-both runtime read, normal dual definition parser,
external-source writer, generic V3 root, or public configured recursion may
survive the cutover.

## Key Tradeoffs

1. **Two subject aggregates/stores over shared records.** Some orchestration is
   duplicated, but it preserves exact Team V2 and truthful Org V1 ownership;
   shared Agent/Team/task mechanisms keep duplication bounded.
2. **No-op flat cohort.** It intentionally leaves Team-named paths/contracts
   because they remain accurate, avoiding unnecessary I/O and client breakage.
3. **Separate Org history/stream projection plus mixed facade.** More adapters
   than one generic store, but no false single authority or kind inference.
4. **Journaled directory promotion.** Strong crash recovery and one canonical
   family require staging/journal/fsync complexity; moving directories avoids
   copying large durable content.
5. **Separate authoring UIs.** Wrapper duplication avoids invalid conditional
   state; handoff/config/workspace primitives are shared below subject owners.
6. **Opaque identity preservation.** Historical name prefixes may look stale but
   are not topology; changing them would break approved identity/history.
7. **Sparse client intent/server complete plan.** Adds mapping code but prevents
   drift and definition defaults from silently overriding Org choices.
8. **Revisioned parent save.** Larger payload and transaction machinery preserve
   member/handoff referential integrity and zero partial persistence.
9. **Strict target admission over temporary external unavailability.** It avoids
   permanent server compatibility debt and respects external ownership, at the
   cost that incompatible definitions and their dependent Orgs are unavailable
   for new work until separately released; compatible work and history remain.

## Risks

| Risk | Likelihood / Impact | Control | Residual |
| --- | --- | --- | --- |
| Flat Team is accidentally rewritten/moved | Medium / Critical | Golden bytes/path/inode/mtime no-op tests; migration write audit | Validation code changes but serialized native contract stays. |
| Root misclassified | Low / Critical | Exhaustive preflight, direct configured-Team cohort rule, strict fixtures | Contradictory data blocks rollout. |
| Both families become canonical for one ID | Low / Critical | Exclusive gate, source->staging->target journal, conflict matrix, parent fsync | Manual tampering requires operator recovery. |
| Definition/package ref breaks on Org conversion | Medium / High | Global server-owned ref plan, preserve IDs, exact target validation, dependency diagnostics | External owners must publish compatible targets separately. |
| In-ticket code writes or claims external repositories | Low / Critical | Typed source descriptors, external writer rejection, filesystem/SCM zero-write audit, scope review | Misconfigured source registration must fail safely. |
| Target admission silently falls back or globally blocks startup | Medium / Critical | One-family exact codecs, no migration imports, available/unavailable result, mixed compatibility scenario | Incompatible definitions remain intentionally unavailable. |
| Effective handoff order reverses or projections regroup owners | Medium / High | Root-first compiler contract, unchanged migration snapshots, stable-filter/projection golden tests | New ordering changes require requirements approval. |
| Task Team lineage removed with configured recursion | Medium / Critical | Separate types/folders/tests; recursive task records/factory retained | Future refactors need explicit distinction. |
| Org code bypasses Team public factory and reaches Team manager internals | Medium / High | Narrow embedded TeamRun factory and encapsulation tests/review | Some existing mixed backend code may require extraction. |
| Wrong-family mixed restore/stream succeeds | Low / Critical | Compound kind+ID, subject location, strict store, mismatch tests | Corrupt/manual states remain blocked. |
| Org focus created on launch/recovery | Medium / High | No durable/input field; nullable view; negative fallback tests | Explicit member-row click may focus by design. |
| Config preview/server precedence drifts | Medium / High | Server authority + shared pure fixtures across web/server | Catalog evolution needs tests. |
| Concurrent definition edits partially apply | Medium / High | revision lock, full validation, directory journal/recovery | External file edits cause explicit conflict/refetch. |
| Shared Team is copied/mutated | Low / High | Query-only dependency and identity/coordinator/handoff/history regression tests | Org-owned migrated source remains physically Org-owned but distinct. |
| Runtime/durable state diverges | Low / Critical | prepare -> strict write -> live commit -> event sequence per subject | Existing indeterminate I/O remains operational risk. |
| Stale generated/external consumers | Medium / High | Preserve Team-only contract, regenerate mixed clients, coordinated release | Out-of-repo mixed consumers require release notes. |
| Dynamic Team work reintroduces recursion | Medium / High | REQ-017 dependency scan and reviews | Future approved behavior needs new design. |
| UI diverges from RV-012 | Medium / High | VIS/browser/a11y/narrow checks | Fixture values remain illustrative. |

## Guidance For Implementation

- Treat approved requirements, `AORG-CONTRACT-001`, `ui-ux-spec.md`, decision
  record, manifest, and VIS-001-VIS-020 as read-only authorities. Prototype
  services/persistence are mocked and must not be imported.
- Preserve exact Team V2 `schemaVersion`, top/root keys, file name, package path,
  and existing Team-only wire surfaces selected for compatibility. Narrow only
  configured membership/coordinator validation. Add no `subjectKind` to Team.
- Implement exact Org V1 `schemaVersion:1`, `subjectKind:'agent_org'`, `rootOrg`,
  file/path, coordinator-free root, default configuration, direct Agent/flat
  Team members, and root task records. Add no persisted focus.
- Share exact child/handoff/launch/task record types/schemas, not root envelopes,
  stores, paths, or optional-field roots. No `FlatTeam` type.
- Normal definition admission accepts only exact Team Definition Config V2 and
  Org Definition Config V1. Keep the retired decoder under the server-owned
  migration module, never import it into target providers/catalogs, and never
  add/remove `refType` silently.
- Classify every definition source explicitly. Convert repository/data-root
  server-owned sources through their designed build/startup mechanisms. The two
  external repositories are read-only: no write, migration, commit, release, or
  completion claim belongs to this ticket. Surface actionable per-definition
  diagnostics and propagate unavailable Team dependencies to Orgs without
  filtering runtime history.
- Every mixed response/event requires `root_subject_kind`; dispatch from known
  subject/family and validate agreement. Never scan/guess/try both/auto-move.
- Validate complete definition and launch input before ID allocation or durable
  mutation. Errors include stable code, candidate path/address/handoff, and
  message. Expected revision comparison and package promotion occur under the
  same subject lock.
- Use journaled staged directory transaction for multi-file definition saves and
  migration. Test recovery after every filesystem transition/fsync boundary.
- Migration preflight must create nothing. For flat Team packages prove byte,
  path, mtime, and directory inventory unchanged. Org-like packages alone move
  through non-discoverable staging to Org family; never advertise both paths.
- Preserve handoff sequence end to end: Org/root-owned saved order first, then
  each direct Team's local saved order in stable Org member order, with each
  rules array unchanged. Migration copies compiled runtime snapshots; it does
  not recompile. `get_handoff_rules` and effective/UI projections filter or
  decorate without sorting, regrouping, or deduplication.
- Org launch settings resolve server-side from root plus sparse exact Team/Agent
  patches. Activate all placements, return no entry/focus, and never mutate
  referenced definitions.
- Org web focus starts/clears to `null`; exact Agent focuses directly; exact Team
  maps through Org snapshot to stored coordinator. Recipient actions validate
  focus both client- and server-side; no fallback repair.
- Keep task Team creation in task-delegation code. Task Teams may recurse only in
  `taskExecutions` at exact host and never configured `members`.
- Historical topology comes from its subject snapshot, not current definitions.
  Definition edits/deletion cannot change old subject kind, coordinator, task
  host, or addresses.
- Separate Org and Team form/config state. Shared UI primitives accept explicit
  owner view models/commands and cannot query providers or mutate the other
  subject.
- Preserve handoff array/When order. Rename/removal keeps stale entries visible,
  blocks parent save, and requires explicit author resolution. Org never edits
  Team-local handoffs; effective combined view is labeled/read-only.
- Implement RV-012 desktop and `390x844`: no modal Org member/config picker, no
  document horizontal overflow, keyboard/click control access, position-aware
  reorder labels, visible focus, safe canonical addresses, and adjacent errors.
- Minimum implementation evidence: exact Team Definition V2/Org Definition V1
  codec golden/negative tests; target-only/no-normalization admission;
  source-owner enforcement and external zero-write/non-blocking/dependent-Org
  scenarios; Team Run V2 byte/path golden tests; Org Run V1 exact
  schema/store/restore; family mismatch negatives; current-inventory and
  generated no-op/Org-like migration with crash/collision/deep-precondition
  cases; definition transaction conflict/crash cases; root-first effective
  handoff ordering through compilation/snapshot/migration/`get_handoff_rules`/
  projection; Org/Team GraphQL and streams; tasks/stop/restore/history; web
  From/To/When CRUD/order/cancel/save, config precedence, no-focus/exact focus,
  history/task lineage, responsive/a11y, standalone Team create/launch/reuse.
- Before implementation handoff, search current source excluding migration and
  immutable historical docs for configured Team member recursion,
  `getOrCreateConfiguredChildTeam`, Org-as-RootTeam assumptions, Org
  `entryAddress`, required/fallback Org focus, root-kind inference, and generic
  V3/`collaboration_runs` artifacts. Also review every remaining `rootTeam`,
  `team_run_execution_tree.json`, and `agent_teams` occurrence: they are expected
  and correct in native Team code, but forbidden as Org/mixed authority.
