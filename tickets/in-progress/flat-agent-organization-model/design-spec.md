# Design Spec

## Document Status

- Package: `AORG-FLAT-TEAM-001`
- Approved requirements revision: `RER-018`
- Normative supplement: `AORG-CONTRACT-001`
- Normative Product UI revision: `RV-012` / `VIS-001`-`VIS-020`
- Architecture result: `Architecture Design Complete`
- Architecture revision: `AD-REV-005`
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

The supplied workspace is an isolated git worktree. Approved
`RER-018@e1f26fbe1` is an ancestor of the current reviewed baseline
`ARCH-REV-002@614f705ff`; the worktree now also contains Implementation's
uncommitted `IR-001` draft. `AD-REV-001` remains in history at
`36bc02deca363798b6eda878e5eb4850e624da6f`; `AD-REV-002` is the architecture
impact revision that integrates approved Product `RV-012`, the RER-013
configuration/focus behavior, and the later user-approved Team-V2/Org-V1 durable
correction. `ARCH-REV-001@899c60a70` failed on the definition-file transition
and effective handoff ordering. Approved RER-018 resolves the former with exact
Team Definition Config V2 / Org Definition Config V1 target-only admission and
a read-only external-project boundary. `AD-REV-003` resolves that approved
impact plus the remaining root-first ordering correction. The user then pointed
to the canonical production data-migration convention. Inspection found that
AD-REV-003's bespoke journal/staging/backup recovery plan contradicted its
proportionate-recovery rules and the current runner. `AD-REV-004` replaces only
those architecture-owned mechanics with one registered, forward-only,
capability-scoped migration using ordinary startup retry; the approved target
behavior and file families do not change. `ARCH-REV-002@614f705ff` then passed
the cumulative design and routed it to Implementation. Initial implementation
`IR-001` stopped with `IDI-001`: the supposedly lower-level Agent/Team runtime
path is statically owned by `RootTeamRun`, `TeamRunContext`, Team identities,
Team physical paths, and Team-only task/message/event callbacks, so it cannot
materialize an Org without a forbidden synthetic Team root. `AD-REV-005`
resolves that architecture-owned impact with a root-neutral internal configured-
Agent/flat-Team execution plane beneath two still-distinct public root
aggregates, explicit Org sidecars and memory placement, subject adapters for
tasks/messages/events/persistence, and defined construction/restore/shutdown
order. The separate `architecture-design-self-validation.md` walks the revised
design through supported use cases and dependency/boundary checks. The partial
uncommitted implementation draft is evidence only and is not modified or
claimed by this design round.

## Task Size And Architectural Risk (Mandatory)

- Task size: `Large`
- Size rationale and supporting evidence: The payload population is only 23
  external definition roots used as topology evidence, three observed
  server-owned definition sources, and 43 currently readable execution trees,
  but the code delta changes versioned definition ownership/admission, flatness
  validators, a new AgentOrg
  runtime aggregate and durable store, root-neutral Agent/flat-Team execution
  extraction, private Team/Org task-message-event adapters, process lifecycle,
  migration authority, launch/configuration APIs, history/stream/workspace
  discriminated projections, task host ownership,
  atomic handoff authoring, and separate frontend definition/configuration
  surfaces. A repository scan found 207 consumers of Team-root field names and
  11 direct configured-definition recursion consumers before tests and generated
  transport code. Those structural surfaces, not record count, make the task
  Large.
- Architectural risk: `High`
- Risk rationale and supporting evidence: The work changes public contracts,
  persistence family and sidecar selection, Agent/Team/Org lifecycle and tagged
  identity ownership, full-scope candidate publication/fail-stop ordering, startup
  migration, definition transaction semantics, and frontend/runtime projection across
  multiple repositories. A wrong family classification or partial cutover can
  make run history, tasks, memory, or packages unreachable or create two
  canonical authorities for one identity. Incorrect external admission can
  either activate retired packages or strand compatible definitions globally.
- Selected route: `Architecture Review`
- Escalation trigger if implementation or validation discovers new impact:
  `IDI-001` is resolved by AD-REV-005 without changing the approved durable
  boundary. Return another `Design Impact` if implementation cannot realize the
  specified root-neutral internal capability plane while preserving both public
  subject owners, or if it needs to change the approved exact
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
| Worktree verification | `git rev-parse HEAD`; `git worktree list --porcelain`; `git status --short --branch`; `git log --oneline` | Isolated task worktree; RER-018, AD-REV-001-004, ARCH-REV-002, and IR-001 evidence share one task history/worktree. The implementation draft is intentionally uncommitted. | Revise only canonical architecture artifacts in place as AD-REV-005; do not stage, reset, or claim the partial implementation. | Implementation must reconcile its draft only after the revised design passes review. |
| Architecture Review round 1 | `design-review-report.md`; `architecture-review-revision-record.md`; `ARCH-REV-001@899c60a70` | Major design passed; AR-FIND-001 exposed the definition format/scope boundary and AR-FIND-002 exposed reversed handoff order. The user clarification converted AR-FIND-001 into the RER-018 requirement revision. | Implement RER-018 admission/ownership exactly and preserve current root-owned-before-Team-local effective order. | None. |
| Canonical production migration convention | `autobyteus-server-ts/docs/design/production_data_migration_conventions.md`; server README `Production migration practice` | Requires known-source/fixed-target transformation, forward-only runtime, existing-runner retry, narrow final-state classification, bounded diagnostics, and no bespoke journal/restoration/crash matrix absent a separate reachable contract. | Replace AD-REV-003's custom journal/staging/backup protocol with atomic current-file writes, one package rename, ordinary startup retry, capability-scoped exclusion, runner-owned status/log/recovery action, and one interruption/idempotence test. | None. |
| Existing app-data runner and startup | `autobyteus-server-ts/src/app-data-migrations/app-data-migration-runner.ts`; `domain/app-data-migration-types.ts`; `app-data-migration-registry.ts`; `migrations/team-run-execution-tree-v2-app-data-migration.ts`; `autobyteus-server-ts/src/server-runtime.ts` | Runner owns record/attempt/log, ordered prerequisites, `STARTUP_ONLY` `RESTART_TO_RETRY`, and aggregate status; server continues through capability-scoped migration failures and rebuilds strict catalogs. The prior Team Run V2 migration uses exact old/current classification, the established atomic writer, strict reread, sorted disposition counts, and at most five examples. | Register one startup-only definition after Team Run V2 and follow that migration's bounded result shape; do not add runner/ledger/Settings recovery machinery or a blanket fatal gate. | Exact root/definition readiness projection is new but bounded. |
| Architecture Review round 2 | `design-review-report.md`; `architecture-review-revision-record.md`; `ARCH-REV-002@614f705ff` | Independent review passed AD-REV-003/004, including strict target admission, root-first handoff order, split run families, and convention-compliant migration. | Preserve those passed decisions while revising only the implementation-proven internal execution composition gap. | AD-REV-005 requires another independent review before implementation resumes. |
| Implementation Design Impact `IDI-001` | `implementation-handoff.md`; `implementation-revision-record.md`; uncommitted draft under `autobyteus-server-ts/src/agent-org-execution/` | `IR-001` proves that an injected Org activator is not a production composition. The draft cannot create Org-direct AgentRuns, mounted Team executions, Org task hosts, root-owned sidecars, message/event routing, fail-stop persistence, or restore/shutdown without Team-root assumptions. | Replace the vague lower-level reuse statement with explicit internal contracts and composition; treat the draft as evidence only and leave it untouched. | None after AD-REV-005; implementation must rebase the draft onto the revised design. |
| Configured Agent coupling | `agent-team-execution/backends/mixed/members/mixed-agent-member-handle.ts`; `services/member-team-context-builder.ts`; `domain/team-run-context.ts`; `domain/team-member-execution-identity.ts`; `domain/team-run-physical-scope.ts` | The handle consumes `TeamRunContext`, creates `TeamMemberExecutionIdentity`, resolves Team memory, emits Team events/bindings, and injects a resolver returning `RootTeamRun`. | Extract a root-neutral configured-Agent handle/context/identity/physical scope; keep Team and Org event/persistence translation above it. | None. |
| Task/message root coupling | `agent-tools/task-delegation/task-delegation-tool-*`; `agent-team-execution/task-delegation/task-delegation-service*.ts`; `services/team-communication/team-communication-service.ts`; Team task/message sidecar stores | The tool resolver returns `RootTeamRun`; the services accept Team tree/index/mutator/persistence types and sidecars correlate only by `rootTeamRunId`. Record bodies themselves do not contain a Team-root field. | Inject a selector-free `MemberTaskCommandCapability`, share only root-neutral record/FIFO engines behind subject adapters, and add strict Org sidecar envelopes while keeping Team sidecars exact. | None. |
| Team local execution coupling | `mixed-team-run-backend-factory.ts`; `mixed-sub-team-run-factory.ts`; `mixed-team-manager.ts`; `domain/team-run.ts` | A useful local Team execution exists, but its factory creates Team-root scope and its configured registry still materializes configured child Teams. Task-Team materialization is a separate valid recursive mechanism. | Extract `FlatTeamExecutionFactory` that accepts an explicit root host/scope, owns direct Agent handles plus task descendants, and never creates a root package; remove configured-child materialization. | None. |
| Memory/location evidence | `agent-memory/store/agent-memory-layout.ts`; `agent-memory/services/agent-memory-location-service.ts`; representative Org-like package directory listing | Relative paths are already `<root>/<teamRunId...>/<agentRunId>`; a whole-package family rename preserves direct root Agent directories and Team/task lineage directories. | Use tagged root physical scope plus unchanged relative TeamRun lineage; Org direct Agents use zero Team ancestors and mounted Team Agents include the mounted Team run ID. | None. |
| Process composition evidence | `agent-execution/runtime/general-process-run-supervisor.ts`; `application-platform/execution/application-execution-scope-kernel-builder.ts`; `application-execution-shutdown-coordinator.ts`; `global-agent-run-message-router.ts` | General and application scopes construct AgentRun then Team manager; shutdown stops Team then Agent; global same-root routing hard-codes `AgentTeamRunManager`. | General scope constructs shared execution factories/directory, then Team and Org managers; closes Org before Team before Agent. Application scope remains Team-only but uses the extracted factories. Global same-root delivery dispatches by tagged active-root directory. | None. |
| Architecture self-validation | `tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md` | Supported fresh/restore/task/message/platform-binding/failure/migration/history/UI cases are walked end-to-end against owners, boundaries, dependency direction, durability, and forbidden shortcuts. | Make this a retained AD-REV-005 review input and implementation checklist, not executable-test evidence. | Downstream code/API/E2E validation remains required. |
| Definition model/codec | `autobyteus-server-ts/src/agent-team-definition/domain/models.ts`; `providers/team-definition-config.ts` | Current unversioned config requires `refType: agent \| agent_team`; target Team V2 removes the field and target Org V1 retains explicit kind. | Add separate strict config file types/codecs and isolate the current parser as a migration-only server-owned decoder. | None. |
| Recursive resolution/compiler | `autobyteus-server-ts/src/agent-team-definition/services/team-definition-graph-resolver.ts`; `team-handoff-compiler.ts` | Configured Teams are traversed recursively and local handoffs are recursively rebased. | Replace normal configured recursion with explicit Team-local and fixed-depth Org compilers; preserve recursive task traversal separately. | None. |
| Persistence-before-validation pressure | `autobyteus-server-ts/src/agent-team-definition/services/agent-team-definition-service.ts`; `file-agent-team-definition-provider.ts` | Create can write before full graph validation/rollback; `team.md` and config files are not one crash-safe parent transaction. | Validate a complete candidate first and use a revisioned, journaled definition-package commit. | None. |
| Planner/config | `autobyteus-server-ts/src/agent-team-execution/domain/team-run-config.ts`; `services/team-definition-topology-planner.ts` | Root is always a Team node and planner/index construction is recursive. | Keep a flat Team planner/service and add a fixed-depth Org planner/service; share only tight placement/config primitives. | None. |
| Existing configuration precedence | `autobyteus-web/types/agent/TeamRunConfig.ts`; `utils/teamRunLaunchHierarchy.ts`; `stores/teamRunConfigStore.ts`; server `team-definition-topology-planner.ts` | Root, Team-placement, and Agent-placement overrides already exist conceptually and are expanded before activation. | Extract a server-authoritative fixed-depth resolver for Org and root->Agent specialization for Team; web preview mirrors the pure merge vocabulary. | Workspace creation stays separate from focus. |
| Team runtime | `autobyteus-server-ts/src/agent-team-execution/domain/root-team-run.ts`; `domain/team-run.ts`; `backends/mixed/mixed-team-manager.ts` | `RootTeamRun` correctly owns standalone Team lifecycle; useful AgentRun candidate and local Team/task mechanics exist, but their current constructors, contexts, callbacks, and paths assume a Team root. | Retain Team aggregate/service/manager for standalone Team; extract the explicit root-neutral configured-Agent handle and rootless flat-Team local factory specified by AD-REV-005, then compose them under separate Team and Org root adapters. | None at the architecture boundary; a different ownership/interface split requires another Design Impact. |
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
at cutover while leaving flat Team V2 packages byte/physically unchanged. Add a tagged root-neutral internal configured-Agent/flat-Team execution plane
with private Team/Org task/message/event/persistence adapters and strict Org
sidecars; add truthful mixed-root projections, subject-specific GraphQL and
definition/run services, configuration-first full-scope Org activation with nullable
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

### AD-REV-004 Canonical Production Migration Convention Correction

Architecture impact ID: `ADI-006`.

| Impact | AD-REV-003 Position | AD-REV-004 Correction | Requirement/Product Effect |
| --- | --- | --- | --- |
| Recovery mechanism | Custom global plan, journal, protected backup, non-discoverable staging tree, restoration state machine, and fsync-boundary matrix. | Use the existing registered runner, atomic current-file replacement, one same-filesystem package rename, validation/reread, and ordinary later-startup idempotent retry. No custom journal, backup, staging or restore command. | None; logical target files/paths and preservation remain exact. |
| Failure scope | In-scope failure kept a blanket runtime/readiness gate closed. | Classify at the narrowest current owner. An invalid definition/root is unavailable; compatible definitions/runs and unrelated server capabilities start. Strict current catalogs never admit legacy/partial state. | Aligns REQ-027 non-blocking behavior and does not weaken REQ-012/013 item preservation. |
| Runner recovery | Offline/operator retry was architecture-specific. | Register `requiredOnStartup:true`, `STARTUP_ONLY`, Team Run V2 prerequisite; existing status/log and `RESTART_TO_RETRY`/disabled manual retry are authoritative. | No new Product UI or runner API. |
| Interruption coverage | Exhaustive crash/collision/fsync state testing. | One supported incomplete-attempt category plus relaunch/idempotence coverage; unsupported infrastructure/tampering premises add no machinery. | None. |
| Cleanup/result truth | Source/backup removal was required for success through a custom recovery protocol. | This migration defines no warning residue. A retry removes any retired file left after an interrupted rename; `SUCCEEDED` requires an independently valid current target and complete retired-file cleanup. Missing/invalid target, cleanup failure, or both family paths is `FAILED` and capability-scoped unavailable. | Preserves one semantic authority without inventing a product-approved residue exception. |

The user's convention pointer is architecture-owned Design Impact, not a
Requirement Gap: it changes rollout/recovery mechanics only. AD-REV-003's exact
definition/admission and handoff-order corrections remain intact. Classification
remains Large/High and the cumulative AD-REV-004 package requires re-review.

### AD-REV-005 Root-Neutral Execution Composition Recovery

Architecture impact ID: `IDI-001` from Implementation `IR-001`. It is an
architecture-owned boundary defect, not a Requirement Gap: RER-018 already fixes
the public Team V2 / Org V1 families and Product behavior, but AD-REV-004 did
not define a production-capable internal extraction.

| Impact Surface | Invalid Prior Assumption | AD-REV-005 Decision | Preserved Authority |
| --- | --- | --- | --- |
| Agent execution | `MixedAgentMemberHandle` could be reused beneath Org while it consumed `TeamRunContext`, Team identity, Team events/bindings, Team memory, and `RootTeamRun`. | Extract one root-neutral `ConfiguredAgentExecutionHandle` and factory. It consumes an explicit tagged root identity, physical scope, member identity/context, command callbacks, memory locator, and activation mode. It owns only AgentRun prepare/publish/abort/input/termination mechanics. | `RootTeamRun` and `AgentOrgRun` remain separate public aggregates; AgentRun remains the provider/runtime owner. |
| Member tools/context | A resolver returning `RootTeamRun` was acceptable shared context. | Replace `MemberTaskRootResolver` and `TeamMemberExecutionIdentity` in collaboration-bound AgentRun configuration with `MemberTaskCommandCapability` and `CollaborationMemberExecutionIdentity`. Tools invoke the bound capability directly; they never resolve or cast a root aggregate. | Same selector-free task tool inputs/results and same-root authorization semantics. |
| Flat Team materialization | Existing Team backend factory was already root-neutral. | Add `FlatTeamExecutionFactory.materialize(...)` over explicit root host/scope. A materialized `TeamRun` owns direct Agent handles and task Agent/Team descendants only; it cannot own a configured Team child, create a root package, register with `AgentTeamRunManager`, or choose persistence. | Standalone Team root still uses `RootTeamRun`; Org alone owns direct configured Team placements. Recursive task Teams remain valid. |
| Task lifecycle | Team-tree-specific `TaskDelegationService` could be injected unchanged. | Split the task subsystem into root-neutral record/FIFO lifecycle engine plus a subject-owned `TaskRootAdapter`. The adapter resolves exact hosts, mutates only its Team or Org tree, prepares local task executions through `TaskExecutionHostCapability`, commits its subject sidecars/tree, publishes subject events, and enters its root fail-stop. | Exact `TaskDelegationRecordV1` and nested task execution record shapes; no generic persisted tree/root. |
| Communication | Team-specific intent/identity/service could represent Org. | Use a tagged root-neutral delivery intent/participant identity and a shared accepted-message engine behind a subject-owned communication adapter. The owning root resolves and reserves the exact same-root Agent, persists its own sidecar, then publishes its own event. | Same message record fields, same-root isolation, Team coordinator ingress, and no global logical-address lookup. |
| Durability | Org could reuse Team sidecar envelopes after a directory rename. | Keep Team sidecars exact. Add strict Org task/message sidecars with `subjectKind:"agent_org"` and `orgRunId`; record arrays reuse exact current record shapes. `AgentOrgRunPersistenceCoordinator` serializes Org tree/task/message mutation and owns Org fail-stop. | Exact approved execution-tree files/paths remain unchanged; record bodies are reused, root envelope truth is not conflated. |
| Memory | An Org-specific shallow Agent path was enough. | Introduce tagged `RootExecutionPhysicalScope { root, ancestorTeamRunIds }`. Relative memory is `<family>/<rootRunId>/<ancestorTeamRunIds...>/<agentRunId>`. Direct Org Agents have no Team ancestors; mounted Team Agents include its TeamRun ID; task Team descendants append IDs. | Whole-package migration remains a direct family rename and preserves existing relative memory/content paths. |
| Events/global lookup | Team manager could remain the only same-root dispatcher. | Agent handles emit neutral agent-execution event bodies to their owning root adapter. Team and Org publishers wrap them in subject events. `ActiveCollaborationRootDirectory` maps explicit tagged root identity to a narrow message/query boundary; global AgentRun lookup compares tagged identities and dispatches to the owning root. | No public generic aggregate, no root-kind inference, no cross-root logical routing. |
| Assembly/lifecycle | An injected `AgentOrgExecutionActivator` could hide wiring. | Delete that abstraction. Subject managers build root composition explicitly from strict package state, persistence, publisher, task/message adapters, direct Agent handles, and flat Team executions. Root registration happens only after configured activation succeeds. General-process shutdown closes admission, stops Org roots, stops standalone Team roots, then stops remaining AgentRuns. | Full Org activation, fail-closed restore, subject registry ownership, and Team-only application scopes. |

`AD-REV-005` does not authorize a generic durable root, synthetic Team root,
independent Team-family roots inside an Org, or a public `RootRun` base. The
shared layer is deliberately a narrow internal execution/capability plane whose
fields are mandatory and semantically common. Subject-specific tree/index/
persistence/event adapters remain above it.

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
  current unversioned recursive Team config into exact Team V2 or Org V1. The
  implementation/build rewrites repository-owned files; the registered startup
  migration uses established atomic file replacement plus one package rename
  for writable data-root Org definitions. Neither path is a normal parser.
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
- External incompatibility is never a migration item. A server-owned source that
  cannot convert/validate contributes a truthful migration `FAILED` disposition
  and makes that definition/dependent new work unavailable, while unrelated
  current capabilities start. It is not silently reclassified as an external
  owner follow-up and no legacy runtime reader is enabled.
- Cutover ordering is strict: install target codecs/diagnostics and the
  registered migration; ship repository-owned current definitions; run the
  startup migration attempt over data-root definitions/runtime; rebuild strict
  current catalogs; then expose available target definitions plus unavailable
  diagnostics. Retired external packages become unavailable only in that
  coordinated release, never before the replacement capability exists.
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
- Reuse below the roots is limited to the AD-REV-005 internal execution plane:
  `ConfiguredAgentExecutionHandle`, `FlatTeamExecutionFactory`, tagged member/
  physical identities, task/message record engines, the AgentRun candidate
  protocol, atomic physical file writer, and address parsing. Team and Org own
  separate indexes, tree mutators, persistence coordinators, sidecar envelopes,
  event publishers, lifecycle registries, and public services. A single public
  generic root manager/aggregate is not introduced because it would erase the
  approved durable/lifecycle ownership split.
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

### Internal Runtime Composition Contract (AD-REV-005)

The internal shared execution vocabulary is tagged and root-neutral. It is not a
serialized root union and is never accepted by Team/Org public APIs in place of
their subject-specific commands.

```ts
type RootExecutionIdentity =
  | Readonly<{ rootSubjectKind: "agent_team"; rootRunId: string }>
  | Readonly<{ rootSubjectKind: "agent_org"; rootRunId: string }>;

type CollaborationMemberExecutionIdentity = Readonly<{
  root: RootExecutionIdentity;
  memberAddress: AgentTeamAddress;
  agentRunId: string;
}>;

type RootExecutionPhysicalScope = Readonly<{
  root: RootExecutionIdentity;
  // Physical TeamRun lineage only. [] is direct to the root subject.
  ancestorTeamRunIds: readonly string[];
}>;

type TaskExecutionHostIdentity = Readonly<{
  root: RootExecutionIdentity;
  hostKind: "root" | "team";
  hostRunId: string;       // rootRunId for root; concrete TeamRun ID for team
  hostAddress: AgentTeamAddress; // "/" for root; exact Team address otherwise
}>;

type MemberTaskCommandCapability = Readonly<{
  root: RootExecutionIdentity;
  delegateTask(caller: CollaborationMemberExecutionIdentity,
               input: DelegateTaskInput): Promise<DelegateTaskResult>;
  submitTaskResult(caller: CollaborationMemberExecutionIdentity,
                   input: SubmitTaskResultInput): Promise<SubmitTaskResultResult>;
  reviewTaskResult(caller: CollaborationMemberExecutionIdentity,
                   input: ReviewTaskResultInput): Promise<ReviewTaskResultResult>;
}>;

type MemberLogicalMessageInput = Readonly<{
  recipientAddress: AgentTeamAddress;
  content: string;
  messageType?: string | null;
  referenceFiles?: readonly string[] | null;
}>;

type MemberExecutionContext = Readonly<{
  identity: CollaborationMemberExecutionIdentity;
  // Team instruction for a Team member; Org instruction for an Org-direct Agent.
  authoredEnclosingScopeInstruction: string | null;
  collaboration: Readonly<{
    outgoingHandoffs: readonly CollaborationHandoff[];
    deliverLogicalMessage(input: MemberLogicalMessageInput):
      Promise<AgentOperationResult>;
  }>;
  tasks: MemberTaskCommandCapability;
}>;

type RootAgentExecutionCallbacks = Readonly<{
  publishAgentEvent(
    member: CollaborationMemberExecutionIdentity,
    event: CollaborationAgentExecutionEvent,
  ): void;
  acceptPlatformBinding(
    member: CollaborationMemberExecutionIdentity,
    binding: CollaborationAgentPlatformBinding,
  ): Promise<void>;
}>;
```

Every constructor validates exact keys and clones/freezes its values. Equality
of roots means equality of both `rootSubjectKind` and `rootRunId`. No adapter may
compare the bare ID, infer kind from an address/payload, or translate an Org
identity into `rootTeamRunId`.

The member context is selector-free and sender-bound. Message and task inputs do
not carry a caller/root selector; the closure uses `identity`, and the owning
root revalidates that exact caller before resolution. A configured Agent under a
mounted Team receives that Team's authored instruction, while a direct Org Agent
receives the Org instruction. This preserves the current nearest-enclosing-Team
instruction behavior and gives an Org-direct Agent a truthful enclosing scope;
it does not concatenate mutable parent definition text into a run snapshot.
`RootAgentExecutionCallbacks` deliberately excludes recipient resolution,
stores, indexes, managers, and fail-stop mutation. Those remain private root
adapter responsibilities.

#### Configured Agent execution

`ConfiguredAgentExecutionHandle` is extracted from
`MixedAgentMemberHandle`. Its required construction input is:

- the exact configured/task Agent execution node and activation mode;
- `CollaborationMemberExecutionIdentity` and
  `RootExecutionPhysicalScope`;
- a prepared `MemberExecutionContext` containing authored enclosing-scope
  instruction, effective outgoing handoffs, root-neutral delivery callback, and
  `MemberTaskCommandCapability`;
- `AgentRunManager`, workspace resolver, conversation-activity inspector, and
  root-neutral Agent memory locator; and
- a `RootAgentExecutionCallbacks` port with `publishAgentEvent`,
  and `acceptPlatformBinding`; logical delivery is already sender-bound in the
  member context.

It owns provider selection, AgentRun candidate prepare/restore, input/command
reservation, event subscription, status overlay, publication/abort, and local
termination. It does **not** own a root tree, sidecar, subject event sequence,
recipient resolution, task policy, package path, root registry, or fail-stop
policy. It emits `CollaborationAgentExecutionEvent` and
`CollaborationAgentPlatformBinding` using the tagged member identity; the owning
root adapter converts those into Team or Org tree mutation/event contracts.

The AgentRun config field is renamed cleanly from `memberTeamContext` to
`memberExecutionContext`. `MemberTeamContext`, `TeamMemberExecutionIdentity`,
`MemberTaskRootResolver`, and Team-specific delivery-intent identity are removed
from the normal shared path. Team-only transport/projectors may translate their
subject event DTO at the root boundary; Agent tools and provider backends use
only `MemberExecutionContext`.

`prepareConfiguredActivation()` uses the existing AgentRun candidate protocol
and returns staged platform bindings plus `commitAfterDurability()` / `abort()`.
Org launch/restore invokes it for every configured Agent in stable canonical
address order. Standalone Team may preserve its current lazy direct-Agent
readiness, but it uses the same handle and its root-neutral inputs; task Agent
activation continues to use the same prepare-before-durability protocol.

#### Flat Team execution and task hosts

`FlatTeamExecutionFactory.materialize(input)` accepts an explicit
`RootExecutionIdentity`, physical scope, one concrete Agent-only Team node,
activation mode, root callbacks, and task-command capability. It returns the
existing local `TeamRun` facade backed by a narrowed mixed manager:

- configured registry: direct Agent handles only;
- task registry: direct task Agents and recursive task TeamRuns;
- local commands/status/termination: retained;
- configured child-Team registry and
  `getOrCreateConfiguredChildTeam`: removed.

The factory never writes a Team/Org execution tree, creates sidecars, registers a
root, or constructs `RootTeamRun`. Standalone `AgentTeamRunManager` uses it for
the root Team body with Team identity and empty Team ancestry. `AgentOrgRun`
uses it for every direct configured Team with Org identity and ancestry
`[mountedTeamRunId]`. Task Team materialization appends its fresh TeamRun ID to
the exact host's ancestry and retains recursion only in `taskExecutions`.

Both `TeamRun` and the new `AgentOrgRootTaskHost` implement the narrow
`TaskExecutionHostCapability` (`prepareTaskAgent`, `prepareTaskTeam`,
`prepareDirectTaskSettlement`, local termination). The Org root host is needed
for tasks delegated by a direct Org Agent; it owns only prepared/local task
handles. The `AgentOrgRun` aggregate still owns the durable root task array and
all persistence.

#### Root-neutral task engine with subject adapters

`RootTaskLifecycleEngine` owns the existing selector-free command FIFO, task
record lifecycle, authorization call order, notification sequencing, deepest-
first shutdown/settlement policy, and exact `TaskDelegationRecordV1` bodies. It
accepts no Team/Org execution tree, manager, store, or event type. Its one
`TaskRootAdapter` port must provide:

1. tagged root identity, open/fail-stop state, and exact member authorization;
2. same-root recipient resolution and task-source projection;
3. exact `TaskExecutionHostIdentity` resolution plus a
   `TaskExecutionHostCapability` for that host;
4. subject-specific prepare/commit operations that add/settle task records in
   the owning Team V2 or Org V1 node and atomically coordinate the matching task
   sidecar;
5. root-neutral task-index queries used for ownership/review/settlement;
6. system-message delivery and subject task-event publication; and
7. root fail-stop entry when post-durability local publication/teardown becomes
   indeterminate.

`TeamTaskRootAdapter` closes over `RootTeamRun` state, `TeamExecutionIndex`, Team
mutators and `TeamRunPersistenceCoordinator`.
`AgentOrgTaskRootAdapter` closes over `AgentOrgRun` state,
`AgentOrgExecutionIndex`, Org mutators and
`AgentOrgRunPersistenceCoordinator`. No caller above either root aggregate may
hold an adapter or the engine directly. This preserves one policy
implementation without inventing a common stored tree.

The task tool binding stores `{identity, commands}`. It validates that
`identity.root === commands.root` and calls the bound methods; the router no
longer returns `RootTeamRun` or consults either subject manager.

#### Communication, event routing, and active lookup

The accepted-message record is extracted as
`CollaborationCommunicationMessageV1` with the exact existing fields. A
`RootCommunicationEngine` owns reservation/dedupe/message-body construction and
same-root identity checks behind a `CommunicationRootAdapter`; the adapter owns
recipient/index lookup, exact Agent command endpoint, durable subject-sidecar
append, event wrapping, and fail-stop entry.

- Team wraps neutral Agent/task/communication/member-input event bodies as the
  existing compatible `TeamRunEvent`.
- Org wraps the same bodies as `AgentOrgRunEvent` and publishes through a
  separate `AgentOrgRunEventPublisher`/Org snapshot sequence.
- Mixed streams project either event branch with
  `root_subject_kind`; they do not expose the internal neutral callback type.

`ActiveCollaborationRootDirectory` is a process/scope-owned index from the
compound `RootExecutionIdentity` to a narrow
`ActiveRootMessageBoundary`. Subject managers reserve then commit/release their
own root registration; the directory owns no lifecycle or persistence. The
existing `AgentRunManager` remains the exact `agentRunId -> AgentRun` registry
for standalone and collaboration members. `GlobalAgentRunMessageRouter`:

1. loads exact sender/target AgentRuns;
2. if both have member contexts and the tagged roots are equal, resolves that
   compound root in `ActiveCollaborationRootDirectory` and calls
   `deliverExactAgentMessage`;
3. otherwise applies the existing explicit direct-message grant path.

A root directory entry can never authorize cross-root logical-address delivery,
and no bare run ID selects Team versus Org.

#### Org physical memory and strict sidecars

`AgentMemoryLayout.getRootedAgentRunDirPath(scope, agentRunId)` dispatches only
on `scope.root.rootSubjectKind`:

```text
Team direct Agent:
  $MEMORY_ROOT/agent_teams/<rootTeamRunId>/<agentRunId>/
Org direct Agent or root-hosted task Agent:
  $MEMORY_ROOT/agent_orgs/<orgRunId>/<agentRunId>/
Org mounted-Team Agent:
  $MEMORY_ROOT/agent_orgs/<orgRunId>/<teamRunId>/<agentRunId>/
Org mounted-Team task-Team Agent:
  $MEMORY_ROOT/agent_orgs/<orgRunId>/<teamRunId>/<taskTeamRunId>/.../<agentRunId>/
```

The same relative rule applies to Team task lineage. This exactly matches the
current package layout after the approved whole-directory family rename; it
adds no per-Agent data move. `CollaborationExecutionLocationService` composes
strict Team and Org location providers, accepts explicit compound root identity
for root queries, and enforces unique AgentRun correlation for global
Agent-owned services. Context-file ownership, run-file changes, token usage,
history, and identity allocation depend on that facade or on a subject-specific
provider, never on Team locations alone.

Team sidecars remain exact and unchanged:

- `task_delegation_records.json` /
  `{schemaVersion:1, rootTeamRunId, records}`;
- `team_communication_messages.json` /
  `{schemaVersion:1, rootTeamRunId, messages}`.

Org adds strict subject-owned equivalents:

```ts
type AgentOrgTaskDelegationRecordsFileV1 = Readonly<{
  schemaVersion: 1;
  subjectKind: "agent_org";
  orgRunId: string;
  records: readonly TaskDelegationRecordV1[];
}>; // agent_org_task_delegation_records.json

type AgentOrgCommunicationMessagesFileV1 = Readonly<{
  schemaVersion: 1;
  subjectKind: "agent_org";
  orgRunId: string;
  messages: readonly CollaborationCommunicationMessageV1[];
}>; // agent_org_communication_messages.json
```

`AgentOrgStatePackageLoader` requires the Org tree and both Org sidecars to
correlate by kind/ID. It reuses the existing root-neutral task-reopen policy
(active/awaiting tasks become interrupted and orphan task nodes settle) through
an Org tree adapter. It never accepts Team sidecar envelopes. The migration
transforms the two Team sidecar envelopes into these Org envelopes beside the
prospective Org tree, validates the entire prospective Org package, performs
the same direct package rename, then removes the three retired Team authority
files. Record arrays and all relative Agent memory/content files remain
unchanged.

`AtomicRunPackageFileCommitWriter` is the only shared physical writer: it owns
temp-write/fsync/rename outcome reporting and knows no root schema. Team and Org
stores supply subject-specific file roles. `TeamRunPersistenceCoordinator` and
`AgentOrgRunPersistenceCoordinator` remain distinct mutation serializers and
fail-stop owners.

#### AgentOrg construction, activation, restore, and termination

`AgentOrgRun` has lifecycle
`assembling -> activating -> active -> persistence_fail_stop|terminating -> terminated`.
`AgentOrgRunManager` performs one transition lane per Org ID:

**Fresh launch**

1. validate definition availability and complete configuration; allocate all
   IDs; build exact Org tree plus empty strict Org sidecars;
2. construct Org persistence coordinator, publisher, indexes, task/message
   engines with Org adapters, and an `AgentOrgRun` in `assembling` state;
3. construct direct Org Agent handles, one local flat Team execution per direct
   Team, and the Org root task host; attach that local execution scope exactly
   once to the aggregate;
4. prepare every configured Agent candidate in stable canonical-address order;
   collect any external platform bindings and apply them to the candidate Org
   tree in memory;
5. durably write the correlated initial Org tree/task/message package; if a
   pre-rename write fails, abort all candidates in reverse order and expose no
   root;
6. commit AgentRun publications, attach event subscriptions, and mark local
   executions active. If post-durability publication is indeterminate, enter
   Org fail-stop, terminate/abort the whole prepared scope, leave the strict
   package for later restore, and do not register an active root;
7. atomically register the root with `AgentOrgRunManager` and
   `ActiveCollaborationRootDirectory`, publish lifecycle/snapshot availability,
   and return only `{agentOrgRunId}`. Client focus remains `null`.

**Restore**

1. `RootRunPackageReadinessIndex` selects Org family, then
   `AgentOrgStatePackageLoader` strict-reads/correlates/repairs Org tree and
   sidecars before live construction;
2. reconstruct indexes, engines, physical scopes, direct handles, mounted flat
   Teams and task lineage from the persisted snapshot without consulting live
   definitions;
3. prepare all configured Agent candidates. Existing provider bindings restore
   exactly; any allowed new external binding for a no-activity execution is
   applied through one Org tree commit before publication;
4. publish the complete scope and register it only after preparation and
   durability succeed. Any failure aborts prepared candidates in reverse order
   and leaves no partial registry/directory entry.

**Runtime mutation/fail-stop**

All platform-binding, task, and accepted-message changes enter the Org
persistence coordinator. It writes strict Org files before live state/event
publication. Pre-rename failure cancels/reservations and keeps the root active
when safely retryable. Post-rename finalization uncertainty or post-durability
live-finalization failure closes root admission and starts whole-Org fail-stop;
no embedded Team can remain independently active or writable.

**Termination**

The root closes external message/task/command/materialization admission; drains
root command and persistence queues; freezes the Org root host, direct Agent
handles, mounted Teams and recursive task descendants; interrupts active turns;
settles tasks deepest-first when not fail-stopped; prepares local teardown;
finishes children in reverse materialization order; unregisters the compound
root directory entry and subject manager entry; clears publishers; then becomes
`terminated`. A mounted Team never unregisters a Team-family root because it was
never registered as one.

#### Process and application-scope composition

`GeneralProcessRunSupervisor` construction order is:

1. `AgentRunManager` and shared Agent provider/resource/session services;
2. strict Team/Org stores and location providers, then
   `CollaborationExecutionLocationService` and memory/context-file services;
3. `ActiveCollaborationRootDirectory`, root-neutral configured-Agent factory,
   and flat-Team execution factory;
4. `AgentTeamRunManager` with Team adapters/stores, then
   `AgentOrgRunManager` with Org adapters/stores;
5. subject run services/history/stream sources and explicit mixed projection
   facades; finally bind process entry services.

On construction failure, release in the exact reverse order. Normal close first
closes new launch/stream admission, then calls `stopAllAgentOrgRuns()`, then
`stopAllTeamRuns()`, then `stopAllAgentRuns()`, releases Org/Team/services and
the active-root directory, and finally closes tool sessions/resources. Errors
are aggregated without skipping later cleanup steps.

Application execution scopes in this ticket still launch only application-owned
Agents/flat Teams. They use the extracted root-neutral Agent/flat-Team factories
with a Team identity, do not construct `AgentOrgRunManager`, and retain
`Team -> AgentRun` shutdown. This prevents an unapproved application-owned Org
surface while ensuring the shared extraction is production composition rather
than a general-process-only special case.

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
| BEH-002 | System | REQ-004, REQ-005, REQ-011, REQ-024; AC-002, AC-007, AC-019 | Configure, launch, or restore Org/Team. | Recursive Team planner -> Team manager -> RootTeamRun; Team UI coordinator-focused. | Org full configuration resolves and activates complete scope unfocused; standalone Team remains coordinator-led. | Config UI/application -> subject run service -> configuration resolver -> subject planner/manager -> subject aggregate/adapters -> root-neutral Agent/flat-Team candidates -> durable full active scope (DS-002, DS-003, DS-012, DS-014, DS-015). |
| BEH-003 | Contract | REQ-005-REQ-007, REQ-020-REQ-023; AC-003, AC-015-AC-018 | Author/inspect handoffs or Agent calls collaboration tools. | Recursive compiler emits root-owned handoffs first, then child Teams in stable member order; rule lookup filters without reordering. | Preserve ordered Agent-sourced routes: Org-owned saved order first, then each direct Team's local saved order in stable Org member order; Team-local edges rebase once; exact same-root resolution fails closed. | Definition candidate path (DS-011); fixed-depth ordered compilation (DS-009); member execution context -> bound owning-root message/task capability -> subject adapter/index -> AgentRun/coordinator (DS-004, DS-014). |
| BEH-004 | User / contract | REQ-003, REQ-004, REQ-024; AC-002, AC-003, AC-019 | Launch Org, select workspace member, or address Team. | Required/repaired Team focus. | No Org coordinator/initial focus/fallback; explicit Agent focus is exact; Team focus uses its exact coordinator; no-focus blocks only recipient-required action. | Org launch -> focus=null; sidebar selection -> family-specific execution view/index -> send guard -> transport (DS-003, DS-004, DS-013). |
| BEH-005 | System | REQ-012, REQ-014, REQ-016, REQ-025, REQ-027; AC-008, AC-009, AC-011, AC-020, AC-022 | Persist/restore/stream/history/archive/stop a run. | Strict Team V2 everywhere, including organization-like Team roots. | Flat Team remains native V2; Org uses separate V1; every cutover-time server memory package remains in scope regardless of current definition availability; mixed projections preserve history truth. | Subject aggregate -> subject tree/task/message persistence coordinator -> subject-tagged catalog -> mixed projector/stream/workspace; restore selects/correlates the strict complete package by family without live definition admission (DS-006T, DS-006O, DS-008, DS-014, DS-015). |
| BEH-006 | User | REQ-001, REQ-002, REQ-004, REQ-011, REQ-016, REQ-018-REQ-027; AC-002, AC-007, AC-011, AC-013-AC-022 | Open catalog/authoring/detail/config/launch/history/workspace. | One Team catalog/form advertises nesting; shared runtime assumes Team root/non-null focus; discovery has no per-definition admission status. | Implement RV-012 for available target definitions and truthful runtime/history; incompatible external definitions/dependent Orgs are omitted from new-work surfaces with actionable diagnostics, without blocking compatible UI/history. | Definition admission index -> web subject stores/components -> subject GraphQL; mixed durable projection remains separately available (DS-000-DS-003, DS-008, DS-011-DS-013). |
| BEH-007 | Operational | REQ-009, REQ-010, REQ-012, REQ-013, REQ-027; AC-004, AC-006, AC-008, AC-022 | Cut over server definitions/runtime while discovering external dependencies. | Unversioned recursive Team codec; 23 external evidence roots; 43 current server V2 trees; no deep topology. | Convert only server-owned definitions to target configs; never write external roots; flat runtime roots are no-op; one-level runtime roots convert to Org V1; unavailable external definitions do not block global readiness/history. | Existing startup migration runner -> separate definition/runtime inventories -> migration-owned atomic current-file writes and one direct package-family rename -> strict target admission/diagnostics -> per-item catalog rebuild/readiness (DS-000, DS-007, DS-010). |
| BEH-008 | Contract | REQ-014, REQ-025; AC-009, AC-020 | Native durable write/read and mixed projection. | Exact Team V2 only. | Exact Team V2 preserved; exact Org V1 added; child/task records reused; family/payload/projection mismatch fails. | Team planner/root -> exact Team V2 tree/sidecars (DS-006T); Org planner/root -> exact Org V1 tree/Org sidecars (DS-006O); generic facade -> tagged union (DS-008); root-neutral execution callbacks remain internal (DS-014). |
| BEH-009 | System | REQ-015; AC-010 | Delegate/settle/restore task execution. | Task records attach recursively to exact Team host. | Org root becomes a valid host; direct Org Team remains configured placement; fresh task Team remains task lineage at exact delegator host. | Agent tool -> bound member task commands -> root-neutral task engine -> private subject adapter -> exact root/Team host capability -> subject tree+sidecar -> settlement event (DS-005, DS-008, DS-014). |
| BEH-010 | Contract / operational | REQ-026, REQ-027; AC-021, AC-022 | Discover/admit server-owned and registered external definition packages at cutover/startup. | One unversioned normal Team parser accepts recursive shapes across all roots. | Normal admission accepts only exact Team Config V2/Org Config V1. Server-owned legacy decoding is migration-only; rejected external packages/dependent Orgs are individually unavailable with owner diagnostics and no source mutation/fallback. | Source inventory -> server migration classification or target codec -> dependency closure -> available catalog/unavailable diagnostics -> new-work gate (DS-000, DS-007). |

## Relevant Supplemental Task Artifacts

| Artifact Path | Purpose | Related Requirement / Acceptance-Criteria IDs | Relationship To This Design | Status / Approval Applicability |
| --- | --- | --- | --- | --- |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | Normative configured structure, exact definition and run families, source ownership/admission, task ownership, handoff authoring/order, launch/configuration/focus, and mixed projections. | REQ-001-REQ-027; AC-001-AC-022; ORG-CASE-001-055 | Governs fixed-depth invariants, Team Definition V2 / Org Definition V1, native Team Run V2 / Org Run V1, target-only admission, two-family reuse, no-focus activation, transition, and failure-closed projection. | Approved through `RER-018`; authoritative. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md` | Requirements-owned evidence and current production-path inventory. | BEH-001-BEH-010; PRE-001-PRE-005 | Supplies approved behavior and inventory evidence; architecture evidence above extends rather than rewrites it. | Current through `RER-018`; not behavior authority by itself. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md` | Cumulative approval/navigation history. | RER-001-RER-018 | Establishes progressive Team reuse, Product UI, configuration-first launch, Team-V2/Org-V1 runtime correction, and external-definition scope/admission approval. | Approved/cumulative. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md` and `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md` | Independent review result and finding history through AD-REV-004. | AR-FIND-001, AR-FIND-002; ARCH-REV-001/002 | Records resolution of definition transition, handoff order, and migration-convention impact. | `ARCH-REV-002@614f705ff` passed AD-REV-003/004; AD-REV-005 now requires another independent review because IDI-001 materially revises internal runtime ownership. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-handoff.md` and `implementation-revision-record.md` | Implementation-owned Design Impact evidence. | IR-001; IDI-001 | Proves the reviewed lower-level reuse direction was not constructible and lists exact Team-root coupling. The partial uncommitted draft is evidence only. | Active AD-REV-005 recovery input; not merge/code-review ready. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md` | Architecture-owned use-case/data-flow self-validation requested by the user. | BEH-001-BEH-010; SCN-001-SCN-011; IDI-001 | Walks supported launch, collaboration, task, persistence, restore, shutdown, migration, history and UI cases through owner/boundary/dependency checks. | AD-REV-005 review input; design validation only, not executable evidence. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/autobyteus-server-ts/docs/design/production_data_migration_conventions.md` | Canonical server convention for known-source/fixed-target transformation, forward-only runtime, reachability, failure scope, recovery, residue, summaries/logs, and review. | REQ-012, REQ-013, REQ-027; AC-008, AC-022; SCN-004, SCN-011 | Governs AD-REV-004 migration mechanics; requirements continue to govern target state and availability. | Current repository architecture authority; explicitly identified by the user. |
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
  Team-in-Team; organization roots require a fake Team coordinator. `IDI-001`
  adds concrete evidence that even the local Agent/Team execution path depends
  on `RootTeamRun`, Team identity/physical scope, Team task/message sidecars, and
  Team event/persistence callbacks. Adding an Org activator around those internals
  would leave either a synthetic Team owner or an unowned Org execution graph.
- Design response: separate AgentOrg and AgentTeam definition/run/persistence
  owners; keep native Team V2 and Team runtime intact where they are already
  truthful; add Org V1 and Org runtime; add exact subject definition codecs and
  a source-aware admission owner; extract only semantically tight shared
  Agent/Team/handoff/launch/task records and low-level execution mechanisms;
  replace configured recursion with fixed-depth validation and projection. Keep
  current source forward-only and isolate the known old-to-current transform in
  one registered migration that follows the existing runner/convention rather
  than adding a second recovery architecture.
- Refactor rationale: the durable correction specifically reduces the prior
  refactor: there is no justification to rename or replace the valid Team V2
  family. IDI-001 demonstrates that the runtime extraction cannot be deferred;
  it is required to make Org composition valid without weakening the two-family
  authority. Refactor remains required at configured Agent/Team execution
  context, task/message adapters, definition recursion, organization runtime
  ownership, mixed projection, and frontend boundaries.
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
- **Root execution identity:** internal tagged compound identity
  `{rootSubjectKind, rootRunId}` used by shared execution capabilities; it is not
  a persisted generic root envelope.
- **Root execution physical scope:** tagged root identity plus physical TeamRun
  ancestry used only to locate Agent memory. Empty ancestry means direct to the
  Team/Org root; it does not invent a Team for an Org.
- **Member execution context:** AgentRun-injected collaboration identity,
  outgoing handoffs/delivery, enclosing authored instruction, and bound task
  command capability. It supersedes the Team-root-specific member context.
- **Flat Team execution:** one local `TeamRun` containing direct configured
  Agents and optional task descendants, materialized beneath either a standalone
  Team root or an Org root without owning a root package/registry.
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
3. Read DS-000-DS-015, especially the AD-REV-005 internal runtime composition
   contract, and the ownership/dependency sections for implementation control
   flow and encapsulation.
4. Read the persisted-data decision/migration plan before changing any Team V2
   schema, history, or memory code; flat Team is deliberately a no-op cohort.
5. Use the final file mapping, removal plan, sequence, risks, implementation
   guidance, and separate `architecture-design-self-validation.md` use-case
   walkthrough as the implementation/review checklist.

## Legacy Removal Policy (Mandatory)

- Policy: clean-cut removal of recursive configured-Team behavior; no runtime
  compatibility branch for unsupported configured depth.
- Preserve (not compatibility): exact Team V2 normal store/path/schema and
  Team-only APIs/DTOs that remain semantically valid for flat Teams, as required
  by REQ-014/REQ-025.
- Remove from normal code: Team-member input beneath Team, recursive configured
  definition resolution/planning, configured-child Team materialization,
  `getOrCreateConfiguredChildTeam`, Team-root-specific member/tool identity and
  task-root resolution in shared AgentRun code, recursive Team selectors,
  Org-as-Team coordinator semantics, injected no-owner Org activator, Org entry
  selector/fallback focus, and mixed readers that infer root kind.
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

The governing production convention is
`/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/autobyteus-server-ts/docs/design/production_data_migration_conventions.md`,
linked from the server README. This design applies that convention rather than
inventing a second recovery framework.

- **Observed populations (evidence, not a frozen rollout plan):** 23 definition
  roots under the two external repositories are read-only topology evidence (20
  Agent-only and 3 organization-like); one writable server-data Team and two
  implementation-repository application Teams were observed in the approved
  probe, all in the retired unversioned flat shape. The authoritative definition
  inventory is the cutover scan by source class. The `RER-017` runtime re-probe
  found 43 readable Team Run V2 packages: 27 Agent-only and 16 one-level
  organization-like, with none deeper. The cutover runtime inventory, not the
  earlier 41-package count, is authoritative.
- **Fixed targets:** normal definition code accepts only Team Definition Config
  V2 or Org Definition Config V1. Normal runtime code accepts only native Team
  Run V2 under `agent_teams` or Org Run V1 under `agent_orgs`. There is no
  current-runtime legacy definition/run decoder, dual reader/writer, lazy
  conversion, or path fallback.
- **Required preserved semantics:** definition/run IDs, canonical member
  addresses, direct Team coordinators, launch configuration, effective handoff
  array/rule order, application binding, timestamps, tasks and exact task hosts,
  memory/messages/content/history, and standalone Team history. A migrated root
  coordinator remains an ordinary direct Org Agent but loses root coordinator
  and default-recipient meaning.
- **Normal operating assumptions:** one startup migration writer, stable process
  and power for an attempt, normal filesystem behavior, and readable/writable
  same-filesystem server data. The two runtime family directories are children
  of one configured memory root. These prerequisites do not justify custom
  journals, restoration state machines, per-syscall branches, or exhaustive
  power/kernel/device failure tests.

| Cohort | Transition Decision | Required Outcome |
| --- | --- | --- |
| Implementation-repository server-owned definitions | `Migration Required — source/build conversion` | Use the migration-only transform during implementation, commit exact Team V2 or Org V1 files, and fail CI if a registered repository-owned retired file remains. Deployed runtime never rewrites its repository checkout. |
| Writable server-data definitions | `Migration Required — registered startup migration` | Deterministically convert the approved zero/one-level released shape using atomic current-file writes and, only for Org roots, one same-filesystem package-directory rename. Validate before the rename; no backup/journal/staging protocol. |
| External definition roots | `External Dependency — no in-ticket migration` | Perform target-only admission. Compatible packages admit; incompatible packages and dependent Orgs are capability-scoped unavailable with diagnostics. Record owner action but make no write/SCM/release claim. |
| Agent-only Team Run V2 packages | `Directly Usable — No Migration` | Validate exact V2/root/path/coordinator/Agent-only membership and record `SKIPPED_ALREADY_CURRENT`; perform no package/file/path/timestamp write. |
| One-level organization-like Team Run V2 packages | `Migration Required — registered startup migration` | Materialize and validate the complete Org V1 package (Org tree plus strict Org task/message sidecars) inside the source package, atomically rename that package to the Org family, then remove all retired Team authority files before success. Cleanup failure leaves that root unavailable and retryable. Definition-source availability never removes a runtime package from this cohort. |
| Subject history/catalog indexes and caches | `Discard or Rebuild` | Rebuild strict Team and Org indexes from current packages and merge only tagged derived rows. Old/failed items do not enter a current catalog. |

The Team definition file conversion is small; the runtime and cross-subsystem
cutover remain Large/High. Rewriting flat Team runtime packages adds risk with
no semantic benefit. Leaving an unversioned normal definition parser would
create two configured models and violate the approved admission boundary.
Supported criteria are AC-004, AC-006, AC-008-AC-010, AC-020-AC-022;
QR-002-QR-005 and QR-007; PRE-001-PRE-005.

### Production Migration Convention Application

| Canonical Convention | This Migration's Concrete Application |
| --- | --- |
| Known released source to one fixed target | Migration-only codecs accept only the investigated released Team Run V2 envelope and approved zero/one-level retired server-owned definitions. The migration first tries the strict current flat-Team V2 validator; otherwise its isolated released-V2 classifier accepts only the proven one-level organization-like shape. Each item deterministically becomes exact Team Definition V2, Org Definition V1, native Team Run V2 no-op, exact Org Run V1, or an explicit unsupported/failed disposition. No identity/topology guessing. |
| Forward-only current runtime | All retired definition decoding and Team-V2-to-Org-V1 transformation live under the registered migration folder. Target definition providers, run stores, history, launch, and admission never import them or try an old path/shape. |
| Validate before mutation/destructive cleanup | Preflight validates the complete affected definition/package, fixed depth, identity/ref mapping, destination absence, and target payload in memory before its first write. For Org packages, the new current authority is written and reread before the directory rename; the old authority is removed only after the renamed target validates. |
| Abrupt termination | Treat quit/kill/shutdown/power loss as one incomplete-attempt category. Atomic file replacement leaves old or current content; atomic directory rename leaves source or target. Ordinary later startup retry recognizes those deterministic states. No bespoke journal, backup, staging tree, rollback/restoration state machine, or boundary-by-boundary crash matrix. |
| Existing runner and recovery action | Register `20260901_agent_org_flat_team_families_v1` as `requiredOnStartup:true`, `executionPolicy:"STARTUP_ONLY"`, after the current Team Run V2 prerequisite. `AppDataMigrationRunner.runPending()` owns attempts/record/log. Failed/stale startup work exposes `RESTART_TO_RETRY`, `canRetry:false`; the Settings Retry mutation must not run it. |
| Narrow final-state classification | One invalid/unconverted definition or run makes only that definition/root and dependent new-work operation unavailable. Compatible definitions/runs and unrelated server capabilities start. A missing current platform/store would be critical, but no such change is introduced. External incompatibility is an admission result, not migration failure. |
| Truthful statuses | `SUCCEEDED` only when every supported in-scope item is independently current and retired-file cleanup completes. This migration defines no `SUCCEEDED_WITH_WARNINGS` disposition because no bounded residue consequence was separately approved. Any invalid target, cleanup failure, or unsupported in-scope item yields migration `FAILED`; strict catalogs exclude the affected item and restart retries it. |
| Bounded diagnostics | Process one package at a time. Return aggregate disposition counts with at most five sorted relative-path examples per disposition. The runner persists only its canonical opaque summary sentence and writes detail to its existing attempt log. Do not add item arrays/alternate summaries to the database/API/UI. |
| Cleanup residue | After package rename, retry recognizes the exact target and removes any retired `team_run_execution_tree.json`, `task_delegation_records.json`, `team_communication_messages.json`, `team-config.json`, or `team.md` before declaring success. This ticket has no separately approved storage-residue exception: cleanup failure, source+target family paths, invalid target, or semantically selected residue is `FAILED`/capability-scoped unavailable. |
| Product reachability/proportionality | Supported triggers are server startup, normal process interruption followed by restart, and Settings inspection of server-owned status/restart guidance. Hostile tampering, arbitrary corruption, adversarial writers, restore commands, cross-device recovery, and manual migration-record edits are out of scope. |

### Migration Plan

- **Definition and registration:** create
  `AgentOrgFlatTeamFamiliesV1AppDataMigration` under
  `autobyteus-server-ts/src/app-data-migrations/migrations/agent-org-flat-team-families-v1/`,
  register it after `TEAM_RUN_EXECUTION_TREE_V2_MIGRATION_ID`, set
  `requiredOnStartup=true`, `executionPolicy="STARTUP_ONLY"`, and declare that
  prerequisite. Do not extend the runner, record repository, GraphQL recovery
  enum, or Settings retry behavior.
- **Capability-safe release:** ship exact definition/run codecs and stores,
  source-aware diagnostics, repository-owned definition conversions, and the
  registered migration together. `runPending()` executes before strict current
  catalogs/providers. After its attempt, current catalogs admit only independently
  validated targets; no legacy service path is enabled even when the migration
  reports `FAILED`.
- **Three independent inventories:** enumerate (1) repository/data-root
  server-owned definitions with explicit mutation owner, (2) registered external
  roots as read-only admission candidates, and (3) every runtime package below
  the server memory root regardless of definition origin. Sort identifiers for
  deterministic processing and do not use definition counts to select runtime.
- **Family-root preparation:** resolve each configured source/target family as
  siblings below its one owning data or memory root. After inventory validation,
  create a missing empty target-family parent with the normal directory helper;
  never create a per-item target directory. The one item rename is therefore
  within the same owning root and uses ordinary filesystem atomic-rename
  semantics rather than a cross-device fallback.
- **Preflight:** before any write to an affected item, decode its complete
  supported source, prove zero/one configured Team depth, direct coordinators,
  stable IDs/addresses/member order, ref/source mapping, target family/path
  absence, and target payload validity. Unexpected depth, unresolved semantic
  mapping, unsupported entry, or pre-existing source+target family conflict is
  recorded `FAILED` and left intact; migration continues to other independently
  owned items.
- **Repository-owned definitions:** the implementation/build transform rewrites
  registered source files and CI validates them using only target codecs. This is
  source evolution, not a runtime mutation or fabricated migration ledger item.
- **Writable flat Team definition:** transform the complete legacy candidate in
  memory, prove all member kinds are Agent, add numeric `schemaVersion:2`, remove
  only proven redundant member `refType:"agent"`, validate exact V2, atomically
  replace `team-config.json` using the established current-file writer, reread,
  and record migrated/current/failed disposition. The directory and `team.md`
  stay in place.
- **Writable organization-like definition:** validate the whole fixed-depth
  package before writes; atomically write/validate each direct owned flat Team's
  exact V2 config, then prospective `org.md` and Org Config V1 alongside the
  legacy root files. Reread the complete prospective target through exact target
  providers, then atomically rename the package directory from the server-data
  Team root to the server-data Org root. Reread at the canonical target before
  removing legacy `team.md`/`team-config.json`. Referenced shared/external Teams
  are not copied or edited. An external dependency may make the converted Org
  admission-unavailable without making the format migration fail.
- **Native flat Team runtime:** strict-validate the existing Team Run V2 file,
  direct Agent membership/coordinator, ID/path correlation, and family conflict
  absence; record current/failed. A successful no-op performs zero filesystem
  mutations, including no timestamp, backup, temp file, or index write.
- **Organization-like runtime:** read and validate the complete Team Run V2 state package; transform and
  target-validate the Org Run V1 tree plus `agent_org_task_delegation_records.json`
  and `agent_org_communication_messages.json` in memory; atomically write/reread
  those three prospective Org authorities beside the old Team authorities; then
  atomically rename the entire package directory from `agent_teams/<id>` to
  `agent_orgs/<id>`. Reread/correlate the complete canonical Org package before
  removing the old Team tree and Team task/message sidecars. Task/message record
  arrays and all relative Agent memory/content directories are unchanged; only
  their strict root envelopes change. The transform preserves the already-
  compiled handoff/rule order and never consults a live definition.
- **Ordinary relaunch/idempotence:** old-only source repeats transformation;
  source with a complete valid prospective Org tree/sidecar set revalidates and performs the same
  rename; an interrupted definition whose direct owned Teams are already exact
  V2 accepts those target children as completed transform output rather than
  applying the retired decoder to them again; valid target-only verifies the complete correlated current package and removes any known retired Team authority file before recording success; a
  pre-existing source+target family conflict fails without choosing a side.
  These are deterministic observations of one interrupted attempt, not a custom
  persisted state machine. No cleanup residue is treated as a warning in this
  migration.
- **External admission:** perform no external write, backup, chmod, rename, SCM,
  or release operation. Exact target codecs emit available/unavailable results.
  A rejected Team propagates `DEFINITION_DEPENDENCY_UNAVAILABLE` to dependent
  Orgs. Existing runtime/history selection remains based on strict snapshots,
  not live definition availability.
- **Derived current catalogs:** after `runPending()`, rebuild Team and Org package
  indexes through `RootRunPackageReadinessIndex`: classify family paths by name,
  reject duplicate IDs across families, call only the selected strict current
  store, and require the current package manifest to contain no retired root
  authority file. A root with no current target, cleanup residue, or a
  source+target conflict is capability-scoped unavailable and carries the
  migration log/restart guidance. Mixed history merges only independently valid
  tagged rows. Definition admission applies the analogous exact target-package
  manifest check before computing compatible and unavailable definitions. No
  readiness check decodes old content and no failure re-enables a legacy reader.
- **Retention:** keep the registered migration and its isolated legacy codecs for
  supported direct and skip-version upgrades. Native Team Run V2, Org Run V1,
  and both target definition codecs remain current. Removal requires a separate
  minimum-supported-version decision, not automatic cleanup after one success.

| Migration Disposition | Current-State Test | Runner Result Contribution | Product Disposition |
| --- | --- | --- | --- |
| `MIGRATED_DEFINITION` / `MIGRATED_ORG_RUN` | Exact canonical target definition or complete Org tree/task/message package rereads and validates; source authority is not discoverable | migrated | Available subject/root. |
| `SKIPPED_ALREADY_CURRENT` | Exact target definition/package already valid | skipped | Available subject/root. |
| `SKIPPED_NATIVE_FLAT_TEAM_RUN` | Exact native flat Team Run V2 remains at the same path with zero writes | skipped | Available Team root. |
| `UNAVAILABLE_EXTERNAL_DEFINITION` | Read-only package fails exact target admission or depends on unavailable Team | not a migration item | Omit only from new-work catalog/launch/authoring; actionable owner diagnostic. |
| `FAILED_UNSUPPORTED_SOURCE` | Depth/shape/ref/identity cannot map deterministically before mutation | failed | Preserve source; affected definition/root unavailable; restart after corrected release/data. |
| `FAILED_CURRENT_VALIDATION` | Exact current target absent/invalid after attempt | failed | Do not admit affected capability; preserve observable evidence; restart retries. |
| `FAILED_FAMILY_CONFLICT` | Both source and target family paths are discoverable or target collision exists | failed | Admit neither identity; do not choose/delete/merge automatically. |

Minimum migration tests use disposable roots and the real filesystem/current
providers: exact target codec negatives; server-owned flat definition atomic
conversion; one fixed-depth Org definition/package conversion; all current
runtime record/task/handoff mappings; native flat Team zero-write hashes/stats;
external zero-write/dependency unavailability; unsupported depth pre-mutation
preservation; target collision; target-only skip; one representative interrupted
attempt followed by ordinary startup retry and completed retired-file cleanup;
strict catalog exclusion of a failed item while compatible startup/history
continues; runner summary/log and `STARTUP_ONLY` `RESTART_TO_RETRY`/disabled
manual retry. Do not add per-fsync/per-syscall crash matrices, custom journal
fixtures, live-user-data tests, or infrastructure-corruption scenarios.

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
| Deep configured Team appears during migration | Supported Explicit Operational Failure | REQ-013, PRE-002, QR-003 | Fail that independently owned item before mutation, preserve it, report the invariant, keep it unavailable to strict current catalogs, and continue compatible capabilities; do not design deep conversion. |
| Process terminates during a migration attempt and the application later starts normally | Supported Operational Interruption Category | Canonical production migration convention plus existing stale-`RUNNING`/`runPending()` behavior | Atomic file replacement/direct rename leave a deterministic old, prospective-target, or target observation; the same startup-only migration revalidates and completes/idempotently skips. Cover this category once, not per shutdown label or syscall boundary. |
| Arbitrary filesystem corruption, hostile tampering, or an adversarial concurrent migration writer | Unsupported infrastructure/security premise | No approved product/security/operations contract makes it a supported trigger; canonical convention reachability gate | Add no backup format, repair command, alternate reader, custom journal, or failure matrix. Fail closed on any observed unsupported payload/conflict. |
| Full Org activation contains direct Agents and mounted Team Agents without a synthetic Team root | Supported Normal Scenario | SCN-002/009; REQ-004/024; AC-002/019; IDI-001 production path | Build one Org aggregate, prepare every configured Agent through the root-neutral handle, materialize each Team locally, persist the complete Org package, and register only the complete scope. |
| Direct Org Agent delegates a task while the exact host is the Org root | Supported Normal Scenario | REQ-015; AC-010; ORG-CASE-028 plus direct Org Agent membership | `AgentOrgRootTaskHost` prepares the task Agent/Team; Org task adapter mutates rootOrg.taskExecutions and Org sidecar. No fake Team host. |
| External provider binding is learned while an Org configured Agent is prepared | Supported Normal/Provider Scenario | Existing provider lifecycle and REQ-014 persisted binding reuse | Gather binding before publication, durably mutate Org V1 through Org coordinator, then publish; indeterminate durability fail-stops the whole Org. |
| Restore a stopped/migrated Org with direct/mounted Agent memory and historical task/message records | Supported Normal Scenario | SCN-002/004/010; REQ-012/014/016; AC-008/009/011/020 | Strict Org loader correlates tree plus Org sidecars, applies shared task reopen policy through Org adapter, reconstructs exact physical scopes, prepares all Agents, and registers only after success. |
| Persistence finalization becomes indeterminate after an Org tree/task/message rename | Supported Explicit Operational Edge | Existing Team fail-stop contract reused under Org owner; QR-004 durability | Close only that Org root, stop its embedded executions as one aggregate, leave strict package for restore; do not keep a mounted Team independently active. |
| General-process shutdown with active Org, standalone Team, and standalone Agents | Supported Operational Scenario | Existing supervisor lifecycle plus new active Org capability | Close admission; stop Org roots, then Team roots, then remaining AgentRuns; aggregate errors and release construction dependencies in reverse order. |
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
| DS-007 | Primary End-to-End | BEH-007, BEH-008, BEH-010 | Required startup migration attempt | Independently valid current items cataloged; failed items unavailable with restart guidance | App-data migration subsystem + current catalog readiness | Forward-only cutover without a blanket outage or legacy fallback. |
| DS-008 | Return/Event | BEH-005, BEH-009 | Subject-root event/history query | Tagged mixed projection reaches web/history consumer | Subject event publisher + mixed projection facade | Mixed UI cannot infer family. |
| DS-009 | Bounded Local | BEH-003 | Fixed-depth definition graph | Stable root-owned-first compiled handoff snapshot | Collaboration handoff compiler | Preserves current effective order, one rebase, owner separation, and `rules[]` order. |
| DS-010 | Bounded Local | BEH-007 | One Org-like migration item | Valid Org file plus atomic package rename, or preserved failed source | Registered migration definition | Deterministic one-family cutover with ordinary relaunch idempotence. |
| DS-011 | Primary End-to-End | BEH-001, BEH-003, BEH-006 | Definition/handoff draft save | Complete candidate committed once or unchanged with precise errors | Subject DefinitionService / package transaction | Atomic owner-separated authoring. |
| DS-012 | Bounded Local | BEH-002, BEH-006 | Root choices + sparse overrides | Complete immutable settings for all placements | `CollaborationLaunchConfigurationResolver` | Owns fixed-depth precedence. |
| DS-013 | Primary End-to-End | BEH-004, BEH-006 | Exact post-launch row selection/send action | Exact Agent/coordinator focus or blocked no-focus state | Web root execution view/focus owner | Focus stays exact, local, and non-durable. |
| DS-014 | Bounded Local / Return | BEH-002, BEH-003, BEH-005, BEH-009 | Subject manager has a validated Team/Org package plan | Complete configured Agent/flat-Team scope prepared, durably bound, published, or wholly aborted/fail-stopped | Subject root aggregate over root-neutral execution capabilities | Resolves IDI-001 without a synthetic Team/public generic root. |
| DS-015 | Primary Operational | BEH-002, BEH-005, BEH-008, BEH-009 | General-process construction/restore/shutdown | Subject managers/services registered in order or all rooted executions stopped/released safely | GeneralProcessRunSupervisor | Makes Org, Team and Agent lifecycle composition and reverse cleanup explicit. |

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
- **DS-007 migration:** `Server startup -> AppDataMigrationRunner.runPending -> registered source-classified definition/runtime migration -> atomic current file/package transform + validation -> runner status/summary/log -> strict subject catalog rebuild -> per-item availability + target admission/dependency diagnostics -> compatible server startup`.
- **DS-008 mixed projection:** `Subject root event or history catalog row -> subject projector/store -> RootExecutionTreeProjection(root_subject_kind) -> mixed stream/history GraphQL -> RootExecutionViewStore -> workspace/history components`.
- **DS-011 definition/handoff save:** `Complete reversible draft -> update mutation(expectedRevision) -> subject service candidate validation -> per-definition package transaction -> refreshed canonical revision, or typed failure with draft retained`.
- **DS-012 configuration:** `Org definition launch defaults + root draft + exact Team/Agent patches -> fixed-depth address index -> specificity merge -> runtime/model/workspace validation -> complete plan`.
- **DS-013 focus:** `active Org focus=null -> explicit Agent/Team sidebar row -> mixed view branch's exact index -> AgentRun or Team coordinator -> recipient guard; absent/stale focus -> no send`.
- **DS-014 root-neutral execution composition:** `subject manager strict plan -> subject aggregate/adapters -> configured-Agent and flat-Team factories -> AgentRun candidates + staged provider bindings -> subject persistence coordinator -> AgentRun publication -> subject registry + active-root directory`; failure before durability aborts, indeterminate post-durability state fail-stops the subject root.
- **DS-015 process lifecycle:** `server/application scope construction -> AgentRun infrastructure -> explicit locations/directory/factories -> Team manager -> Org manager/general services -> open admission`; shutdown is `close admission -> stop Org roots -> stop Team roots -> stop AgentRuns -> reverse release`.

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
| DS-007 | Startup deterministically classifies source ownership, converts only server-owned supported items, performs zero writes for flat runtime, records bounded runner dispositions, and rebuilds strict current catalogs; invalid items remain unavailable while compatible work starts. | RegisteredMigration; atomic writer/rename; runner result; strict catalog readiness | App-data migration subsystem | source ownership, capped diagnostics, restart guidance |
| DS-008 | Each subject publisher/projector preserves its native snapshot; a thin mixed facade attaches/checks root kind and clients reduce the correct union branch. | Subject event/snapshot; tagged DTO; web view | Subject publisher + projection facade | WebSocket recovery, generated clients, selectors |
| DS-011 | Save sends the whole draft and expected revision; current members and every ordered handoff validate under the owning subject before one normal-authoring package transaction. | Draft; candidate validator; definition revision | Subject DefinitionService | endpoint catalog, accessible reorder, atomic publication recovery |
| DS-012 | Resolver seeds root, overlays Team placement then exact Agent, validates all placements, and freezes plan before activation or IDs. | Root config; PlacementOverride; EffectivePlan | LaunchConfigurationResolver | runtime/model catalogs, workspace normalization |
| DS-013 | Org view begins unfocused; only explicit row action maps through the selected union branch to an AgentRun/coordinator; send stays blocked otherwise. | RootExecutionView; FocusTarget; AgentRun | Web focus controller | responsive sidebar, hydration, history row semantics |
| DS-014 | A subject root assembles strict state and adapters, prepares every required Agent/local Team without publication, commits its own package/bindings, then publishes/registers the complete scope or aborts/fail-stops it as one root. | Subject root; ConfiguredAgentExecutionHandle; Flat Team execution; subject persistence | RootTeamRun or AgentOrgRun | AgentRun candidates, memory locator, platform binding, active-root directory |
| DS-015 | Process composition constructs dependencies from provider/runtime infrastructure upward and tears them down in reverse root-ownership order so embedded Org Teams never appear in the Team root registry. | GeneralProcessRunSupervisor; AgentRunManager; subject managers; active-root directory | GeneralProcessRunSupervisor | application-scope Team-only specialization, aggregate error collection |

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
- `ConfiguredAgentExecutionHandle` / factory: provider/local AgentRun candidate and command mechanics over explicit tagged root/member/physical inputs; no root authority.
- `FlatTeamExecutionFactory`: one local Agent-only Team plus task descendants beneath an explicit Team or Org root; no root package/registry.
- `RootTaskLifecycleEngine` / `RootCommunicationEngine`: common record/FIFO/reservation policy invoked only through private subject adapters.
- `ActiveCollaborationRootDirectory` / `CollaborationExecutionLocationService`: process-owned compound live capability lookup and strict two-family physical location projection; neither owns a root lifecycle.
- `GeneralProcessRunSupervisor`: explicit construction/admission/shutdown ordering across AgentRun, Team root and Org root managers.
- `TeamRunExecutionTreeStoreV2` / `AgentOrgRunExecutionTreeStoreV1`: strict
  subject stores over shared record validators.
- `RootRunPackageReadinessIndex`: current-only family/path/manifest inventory;
  rejects cross-family ID collisions and retired root-authority residue before a
  root can enter restore/history/stream catalogs, without decoding old content.
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
| DefinitionPackageTransaction | Normal authoring only: per-definition lock, expected revision, complete staged package, atomic visibility/recovery, canonical revision publication | Domain validation, cross-definition policy, or data migration |
| CollaborationLaunchConfigurationResolver | Root/Team/Agent precedence, placement validation, complete effective plan | Focus, definition mutation, runtime activation |
| AgentOrgTopologyPlanner | Fixed Org -> direct Team -> Agent addresses/IDs/config snapshot | Filesystem writes or live lifecycle |
| FlatTeamTopologyPlanner | One Team -> Agents addresses/IDs/config snapshot | Org members or configured child Team |
| AgentOrgRunService / Manager | Org launch/restore/stop, active Org registry, Org V1 package correlation | Team-only registry, focus, definition mutation |
| AgentTeamRunService / Manager | Native Team launch/restore/stop, active Team registry, Team V2 package correlation | Org registry/configuration inheritance |
| AgentOrgRun | Org address/handoff/task/lifecycle scope, direct Agent/Team handles, Org execution index/events | Coordinator, configured Team below Team |
| RootTeamRun | Team address/handoff/task/lifecycle scope, direct Agents, coordinator, Team execution index/events | Org semantics or configured child Team |
| TeamRun | Direct Agents, exact coordinator, Team-local task host/task descendants | Configured Team children or Org-wide resolution |
| ConfiguredAgentExecutionHandle | AgentRun candidate prepare/restore/publish/abort, local commands/status/events/termination | Root tree/index/store/registry, subject event wrapping, address/task policy |
| FlatTeamExecutionFactory / local TeamRun | One Agent-only Team local plane and task descendants under supplied root/scope | Root package/persistence/registration, configured Team child, Org-wide routing |
| RootTaskLifecycleEngine | Task FIFO, records, review/submission/settlement sequencing | Subject tree/index/store/event, root lifecycle/registry |
| RootCommunicationEngine | Same-root message record/reservation lifecycle | Subject address/index/sidecar/event owner |
| Team/Org private adapters | Translate engine/handle ports to exact subject index/tree/mutator/persistence/event and fail-stop | Public API, cross-subject store, generic durable root |
| ActiveCollaborationRootDirectory | Compound tagged live-root narrow message/query capability | Root construction/restore/stop, concrete aggregate, bare-ID lookup |
| CollaborationExecutionLocationService | Explicit Team/Org Agent physical/history location composition | Root-kind inference, data transformation, lifecycle |
| GeneralProcessRunSupervisor | Dependency construction, service binding, admission close and Org->Team->Agent teardown order | Subject domain policy or embedded Team lifecycle |
| Subject tree/sidecar stores | Exact family schema/path/envelope/atomic file reads/writes | Trying the other validator, mixed kind inference, migration selection |
| RootRunPackageReadinessIndex | Sorted current family inventory, compound kind/ID readiness, cross-family ID exclusivity, exact target manifest readiness | Payload transformation, legacy decoding, lifecycle, history projection |
| RootExecutionProjectionService | Dispatch by explicit `root_subject_kind`, family/payload agreement, tagged union projection | Root lifecycle, file scanning/guessing, topology authority |
| Migration | Source-classified server-owned retired definition/Org-like Run V2 transformation, atomic current-file write/one direct rename, validation, cleanup, bounded dispositions | External writes, definition-package transaction, custom runner/journal/recovery, normal target admission, feature behavior, deep conversion |
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
| `MemberTaskRootResolver.resolveActiveRoot(): RootTeamRun` and Team-root task tool context | Cannot represent an Org and leaks aggregate type into Agent tools. | `MemberTaskCommandCapability` bound to tagged identity/root | No manager lookup/cast; selector-free inputs/results preserved. |
| `TeamMemberExecutionIdentity` / shared AgentRun `memberTeamContext` | Falsely asserts every collaboration member belongs to a Team root. | `CollaborationMemberExecutionIdentity` / `memberExecutionContext` | Team root adapters translate only at compatible Team event boundaries. |
| `MixedAgentMemberHandle` Team-root constructor | Couples provider/local mechanics to Team context/store/events/memory. | Root-neutral `ConfiguredAgentExecutionHandle` and factory | Preserve AgentRun candidate behavior; remove Team imports. |
| `MixedTeamRunBackendFactory` root creation and configured-child path | Cannot materialize a mounted Team without creating/assuming Team root. | `agent-team-execution/local/FlatTeamExecutionFactory` plus subject root assembly | Local Team owns direct Agents/task descendants only. |
| Injected `AgentOrgExecutionActivator` / placeholder Org run | Hides missing root ownership and cannot prove production composition. | Explicit `AgentOrgExecutionScopeBuilder` and aggregate adapters | No catch-all activator remains. |
| Team-only task/message sidecar reuse for Org | Root identity/envelope would be false and fail-closed restore impossible. | Strict Org sidecars over identical record arrays | Team sidecars remain exact. |
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

- **DS-008 Team event:** `ConfiguredAgent/task/message neutral body -> private Team adapter -> RootTeamRun/Team
  projector -> compatible Team stream and/or tagged mixed adapter -> web reducer`.
- **DS-008 Org event:** `ConfiguredAgent/task/message neutral body -> private Org adapter -> AgentOrgRun/Org
  V1 projector -> tagged mixed stream -> web RootExecutionView`.
- **DS-004 exact-Agent route:** `GlobalAgentRunMessageRouter -> sender/target MemberExecutionContext tagged-root comparison -> ActiveCollaborationRootDirectory -> owning root message boundary -> exact Agent reservation/sidecar/event result`.
- **History result:** `TeamHistoryStore + AgentOrgHistoryStore ->
  RootRunHistoryCatalogService merge/check -> tagged GraphQL result -> web
  history navigation`.
- **Definition result:** `DefinitionPackageTransaction commit -> DefinitionService
  -> GraphQL canonical result/revision -> subject store/form`.
- **Migration result:** `bounded dispositions -> existing runner summary/log/status
  -> strict current catalog availability -> RESTART_TO_RETRY for failed startup-only work`.
- **Focus result:** `explicit sidebar selection -> exact focus state -> composer;
  clear/invalid focus -> prompt and blocked send without changing root lifecycle`.

## Bounded Local / Internal Spines

- **DS-014 configured scope activation:** `construct subject aggregate/adapters -> materialize root-direct handles and local flat Teams -> prepare configured AgentRun candidates in canonical address order -> collect/apply provider bindings to candidate tree -> strict subject package commit -> publish candidates -> register subject root/directory`; pre-durability failure aborts in reverse, post-durability indeterminacy fail-stops the whole root.
- **DS-005 root-neutral task command:** `bound member capability -> root-neutral FIFO engine -> subject TaskRootAdapter authorize/resolve exact host -> host prepares task execution -> subject tree+sidecar durability -> local publication -> subject event`; no tool resolves a root aggregate.
- **DS-004 root-neutral accepted message:** `bound delivery callback -> owning root authorization/address resolution -> exact receiver reservation -> subject message-sidecar durability -> input commit -> subject event`; Team and Org use distinct envelopes/publishers.
- **DS-015 root termination:** `close external admission -> drain command/persistence queues -> freeze root host/direct handles/mounted Teams/task descendants -> interrupt -> deepest-first task settlement -> reverse local teardown -> root directory/manager unregister -> publisher clear`.
- **DS-009, `CollaborationHandoffCompiler`:** `validate Org-owned and Team-local
  candidates without mutation -> append Org-owned saved order -> visit direct Team placements in
  stable Org member order -> validate/rebase each Team-local list once -> append
  without sorting/deduplication -> freeze snapshot`; standalone Team emits only
  its local saved order.
- **DS-010, migration item:** `read/validate supported source -> transform and
  validate current payload -> atomic current-file write/reread -> one package
  rename when subject family changes -> target reread -> inert cleanup attempt ->
  bounded disposition`; interruption uses the same later-startup retry.
- **DS-006T Team commit:** `prepare RootTeamRun mutation -> strict affected Team tree/task/message authority write under Team coordinator -> commit live state -> publish Team event`.
- **DS-006O Org commit:** `prepare AgentOrgRun mutation -> strict affected Org tree/task/message authority write under Org coordinator -> commit live state -> publish Org event`; initial full activation commits the correlated three-file package before Agent publication.
- **DS-011 definition commit:** `exact candidate parse -> resolve -> endpoint/handoff validate
  -> lock -> compare revision -> stage full package -> journaled promote/recover
  -> cache publish`.
- **DS-012 configuration:** `seed Org root -> Team patch -> exact Agent patch ->
  validate all resolved records -> freeze plan`; no definition/focus mutation.

## Off-Spine Concerns Around The Spine

| Concern | Spines | Serves | Responsibility | Why / Misplacement Risk |
| --- | --- | --- | --- | --- |
| Definition source discovery/codecs | DS-000, DS-001, DS-007 | Admission, definition services, migration | Classify source ownership; exact target decode/encode; migration-only legacy decode for server-owned sources | Prevents filesystem/write authority and compatibility leakage into domain. |
| App-data runner/status/log | DS-007, DS-010 | Registered migration and Settings status | Existing attempts, prerequisites, compact summary, detail log, `RESTART_TO_RETRY` | Prevents a ticket-specific ledger, recovery command, or unbounded status payload. |
| Current catalog readiness | DS-000, DS-006T/006O, DS-007/008 | Definition/run/history consumers | Admit independently valid current packages; exclude failed/conflicting IDs and expose bounded diagnostic linkage | Prevents blanket startup failure and legacy fallback. |
| Definition package transaction | DS-001, DS-011 | Definition services | Normal authoring revision lock, complete candidate staging, atomic publication/recovery | Prevents partial `md/config` visibility and lost updates; migration does not use it. |
| Canonical address parser | DS-003-DS-005, DS-009 | Resolvers/compilers | Rooted parse/build/rebase/depth checks | Avoids divergent fallback/depth policy. |
| Workspace/runtime catalog activation | DS-002, DS-003, DS-012 | Run services | Validate runtime/model/workspace and prepare resources before activation | Keeps external setup out of aggregate. |
| Identity allocators | DS-002, DS-003, DS-005 | Planner/task service | Allocate IDs after validation | Avoids validation side effects. |
| Configured Agent execution factory | DS-002-DS-005, DS-014 | Subject root aggregates | Provider/local AgentRun prepare/publish/abort/input/termination over explicit root-neutral context | Prevents Team context/persistence ownership leaking below roots. |
| Flat Team execution factory | DS-002, DS-003, DS-005, DS-014 | Subject root aggregates and task host | Materialize one Agent-only Team local plane without package/root registry | Prevents mounted Org Teams becoming standalone Team roots. |
| Active collaboration root directory | DS-004, DS-008, DS-014, DS-015 | Subject managers and global exact-Agent message router | Compound tagged-root lookup to narrow live message/query capability | Prevents Team-manager hard-coding and bare-ID kind inference; owns no lifecycle. |
| Collaboration execution location service | DS-006T, DS-006O, DS-008, DS-014 | Agent memory/context-file/run-file/history consumers | Compose explicit Team/Org locations and derive exact physical Agent paths | Prevents Org Agents from disappearing behind Team-only location services. |
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
aggregate. Both compose the AD-REV-005 internal execution plane through
root-specific adapters. `ConfiguredAgentExecutionHandle`,
`FlatTeamExecutionFactory`, task/message record engines, tagged identities and
the physical writer own only semantically common local mechanics; none can read
or mutate a root tree/store/registry. Team/Org adapters close over their exact
index, mutators, sidecars, persistence coordinator and publisher. No shared base
may expose optional coordinator/root fields. `AgentOrgRun` alone owns direct
configured TeamRun handles. `RootTeamRun`/`TeamRun` cannot. Above the root
boundary, callers use only the subject aggregate/service; they cannot acquire an
adapter, local TeamRun, Agent handle, engine or subject store.

`ActiveCollaborationRootDirectory` is below process composition and beside the
subject managers: managers register/unregister their already-owned roots by
compound identity; the global exact-Agent router may query only its narrow live
message boundary. The directory cannot create/restore/stop roots and cannot
return a concrete aggregate. `AgentRunManager` remains the exact AgentRun
registry. This two-index composition is intentional, not competing lifecycle
authority.

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
| DefinitionPackageTransaction | Normal authoring lock/revision/complete package staging/atomic publication/recovery | Subject DefinitionServices only | Per-file writes, UI last-write-wins, or migration reuse | Add `commit(candidate, expectedRevision)`. |
| AgentOrgRunService | config resolver/Org planner/Org manager | GraphQL/application Org launch | Caller uses planner/manager/store directly | Add typed create/restore/stop method. |
| AgentTeamRunService | Team config/Team planner/Team manager | GraphQL/application Team launch | Caller uses manager/store directly | Add typed Team method. |
| AgentOrgRunManager / AgentTeamRunManager | subject registry/factory/package loader | Respective run service, explicit-kind projection adapter | One caller queries manager plus store | Add subject query/snapshot method. |
| AgentOrgRun / RootTeamRun | subject index/task/message/event/persistence coordination | tools/stream/live queries through subject boundary | Caller reaches inner TeamRun/AgentRun manager | Expose exact root operation. |
| ConfiguredAgentExecutionFactory | AgentRun candidate/local command/event mechanics over explicit tagged member/scope | Subject root assembly and local Team factory only | Handle imports RootTeamRun/AgentOrgRun, subject store/index/event, or infers root | Add a mandatory callback/capability input; keep subject translation above. |
| FlatTeamExecutionFactory | One Agent-only Team local plane plus task descendants | Subject root assembly and task-host capability | Create root package, register manager root, or materialize configured child Team | Accept explicit root identity/scope/callbacks; expose task/local facade only. |
| RootTaskLifecycleEngine / RootCommunicationEngine | Common record/FIFO/message lifecycle policy | Subject adapters owned privately by root aggregate | Engine imports subject tree/store/manager or caller holds engine beside root | Strengthen the subject adapter/root method; never expose engine publicly. |
| ActiveCollaborationRootDirectory | compound live root -> narrow message/query capability | Subject managers register; global router reads | Directory creates/stops roots or returns concrete aggregate; bare ID lookup | Require `RootExecutionIdentity`; keep lifecycle in manager. |
| CollaborationExecutionLocationService | explicit Team/Org Agent location projection | memory/context/run-file/identity services | Try-both inference or direct Team-only scan for mixed Agent | Require compound root for root-scoped queries and enforce unique AgentRun result. |
| Team V2 store / Org V1 store | exact schema/path/atomic writer | Respective persistence coordinator, migration target validator | Runtime reads JSON or wrong family | Add strict subject method. |
| RootRunPackageReadinessIndex | family/path/target-manifest readiness and compound identity availability | subject run services, history/stream catalog rebuild | Decode legacy content, transform packages, or invoke both stores | Add `requireAvailable(kind,id)` and current-only rebuild methods. |
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
   Team generic. Both roots import only the tagged internal execution capabilities;
   AgentOrg composes `FlatTeamExecutionFactory`, never Team root manager/store.
5. Team V2 and Org V1 schemas compose common persisted-record validators but do
   not import each other's root schema/store/path.
6. `AgentOrgRun` may own direct configured `TeamRun`; `TeamRun` owns direct
   configured Agents and task TeamRun descendants only, never a configured
   TeamRun or root package.
7. Task/message engines and Agent tools use tagged root/member/host identities
   internally. Team and Org adapters alone see their tree/index/mutator/store;
   approved root-specific on-disk field spelling remains confined to each strict
   versioned sidecar/tree codec.
8. Mixed GraphQL/stream/web types require `root_subject_kind`; subject-only Team
   types may remain compatible. No client inference from tree shape.
9. History topology comes from persisted snapshot, never current mutable
   definition. Subject indexes are derived and rebuildable. Live restore,
   history, and stream discovery require `RootRunPackageReadinessIndex` before
   the already-selected strict subject store is called; no subject manager
   bypasses a cross-family conflict or retired-authority residue.
10. Migration may import its isolated legacy codecs, existing atomic current-file
    writer, and current target validators. No current service imports migration.
    Migration rejects `external_read_only` descriptors before any write and does
    not call the normal definition-package transaction or add a recovery owner.
11. Web preview may share pure merge functions; server recomputes/validates the
    authoritative effective plan.
12. Org and Team draft stores are separate. Shared handoff components accept an
    owner-provided endpoint catalog/commands only.
13. Focus is absent from launch commands, durable schemas, root lifecycle, and
    history authority.
14. Target definition codecs never call migration decoders or normalize unknown
    keys. Dependency unavailability is propagated as data, not a partial Org.
15. `ConfiguredAgentExecutionHandle` and `FlatTeamExecutionFactory` depend downward on AgentRun/workspace/memory capabilities and upward only through injected callback ports; they never import a root aggregate, subject manager/store/index/publisher, or GraphQL/stream type.
16. Subject managers alone register compound roots in `ActiveCollaborationRootDirectory`. The directory may expose only a narrow active message/query boundary; global routing cannot use it to create, restore, stop, or cross-address roots.
17. Root-neutral physical location dispatch requires the tagged root kind. Relative TeamRun ancestry is opaque physical lineage and cannot be used to infer configured topology.
18. General-process composition constructs AgentRun infrastructure -> locations/directory/factories -> Team manager -> Org manager -> services, and tears down Org -> Team -> Agent before reverse release. Application scopes remain Team-only in public capability.

Forbidden shortcuts:

- No generic persisted root V3, `collaboration_runs` path, optional-coordinator
  root blob, or `AgentOrgDefinition extends AgentTeamDefinition`.
- No configured recursive `members` under Team, configured-child Team handle,
  injected synthetic Team context for Org Agents, or reuse of task factories for
  configured membership.
- No normal reader that tries both stores, scans both family paths for an ID,
  auto-moves/retypes payload, or infers kind.
- No caller depending on a subject service/manager and its provider/store at the
  same level; no caller above a root aggregate holds its task/message adapter,
  local TeamRun, configured-Agent handle, or lifecycle engine.
- No pre-launch Org entry/focus, fallback recipient, global logical-address lookup,
  bare-ID root-kind lookup, Team
  copy, client-authoritative launch plan, last-write-wins definition save,
  per-handoff write, or stale-handoff auto-repair.
- No `AgentOrgExecutionActivator` catch-all, fake `RootTeamRun`, Team-family
  sidecar/package for an Org, independent mounted-Team root registration, or
  direct Org Agent launched as a standalone AgentRun outside the Org aggregate.

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
| `ConfiguredAgentExecutionFactory.create(input)` | Internal Agent execution | Prepare/restore one configured or task Agent under its owning root | tagged member identity + physical scope + mandatory callbacks | Returns handle/candidate mechanics only; no root/store access. |
| `FlatTeamExecutionFactory.materialize(input)` | Internal Team local plane | Materialize one Agent-only Team below explicit root host | tagged root + Team node + physical ancestry | No root package/manager registration/configured Team child. |
| `MemberTaskCommandCapability.*` | Bound Agent tool command | Delegate/submit/review in exact owning root | tagged caller identity; capability carries same root | Tool never resolves `RootTeamRun` or manager. |
| `TaskRootAdapter` (private Team/Org implementations) | Subject task bridge | Resolve host, prepare/commit/settle through exact subject tree | tagged host identity and exact record commands | Only root aggregate constructs/owns; not exported as application API. |
| `ActiveCollaborationRootDirectory.get(root)` | Live compound lookup | Return narrow active message/query boundary | `{rootSubjectKind,rootRunId}` | No bare ID, no concrete aggregate, no lifecycle. |
| `CollaborationExecutionLocationService.findAgent(...)` | Mixed physical location | Locate exact Agent memory/history context across two families | compound root when scoped; unique agentRunId when global | Strict subject providers; no try-both payload inference. |
| `AgentOrgRun.resolveRecipient(address)` / `RootTeamRun.resolveRecipient(address)` | Active target | Same-root exact resolution | canonical non-root address | Team address uses coordinator in Org; Team root has Agent destinations. |
| subject root `delegateTask(caller,input)` | Task lifecycle | Authorize/prepare/commit/activate task | exact caller identity + mounted address | No global definition selector. |
| `TeamRunExecutionTreeStoreV2.read/write(rootTeamRunId)` | Team durability | Exact native Team V2 | Team package identity | Existing path/file/keys unchanged. |
| `AgentOrgRunExecutionTreeStoreV1.read/write(orgRunId)` | Org durability | Exact Org V1 | Org package identity | `subjectKind/rootOrg`, no coordinator. |
| `AgentOrgTaskDelegationRecordsStoreV1.read/write(orgRunId)` | Org task sidecar | Strict Org task envelope over exact records | Org package identity | `subjectKind/orgRunId`; Org-specific filename. |
| `AgentOrgCommunicationMessagesStoreV1.read/write(orgRunId)` | Org message sidecar | Strict Org message envelope over exact record bodies | Org package identity | `subjectKind/orgRunId`; no Team envelope reuse. |
| `RootRunPackageReadinessIndex.requireAvailable({root_subject_kind,root_run_id})` | Current run admission | Enforce one family location, exact target manifest, and selected strict-store validation | compound kind + run ID | No old decode or try-both payload validation; history/live restore enters through this check. |
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
| Definition transaction | Yes | Yes | Medium | Normal authoring uses one complete candidate + expected revision + atomic package publication; migration is separate. |
| Subject run services/managers | Yes | Yes | Low | No public generic create/restore guessing kind. |
| Configured Agent / flat Team internal factories | Yes | Yes | High | Mandatory tagged root/member/physical inputs; no root aggregate/store imports; configured-child Team API absent. |
| Bound task command capability | Yes | Yes | High | Carries exact root and caller; calls task engine through owning root adapter; returns no aggregate. |
| Active root directory | Yes | Yes | Medium | Compound root only; narrow live message/query capability; managers retain lifecycle. |
| Collaboration location facade | Yes | Yes | Medium | Explicit compound root for scoped queries; unique global AgentRun; strict subject providers. |
| Configuration resolver | Yes | Yes | Medium | Exact patches; server recomputes; all-or-nothing validation. |
| Subject tree stores | Yes | Yes | Low | Each path/store accepts one family/version/root only. |
| Root run package readiness | Yes | Yes | Medium | Family path supplies kind; reject duplicate IDs/residue, then invoke only that family's strict store. |
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
| Org runtime | Team-root-coupled mixed backend plus AgentRun candidate protocol | New `agent-org-execution` over extracted root-neutral configured-Agent/flat-Team factories and private subject adapters | Separate aggregate/store is required; Team-root contexts/managers cannot be reused, while provider/local Agent execution and record/FIFO logic should not be duplicated. |
| Configured Agent execution | `MixedAgentMemberHandle` + AgentRun candidate API | Extract and replace | Activation mechanics are reusable only after removing Team context/identity/event/memory/task-root ownership. |
| Flat Team local execution | `TeamRun`/mixed manager/task registries | Extract and narrow | Reuse direct Agent/task mechanics under explicit root host; remove configured child Team and all root package behavior. |
| Task/message lifecycle | Team task/message services | Extract record/FIFO engines; add Team/Org adapters | Common lifecycle/records are tight; tree/index/persistence/event ownership is subject-specific. |
| Live same-root lookup | Team manager hard-coded in global router | Add compound active-root directory | Supports Team and Org without public generic root or bare-ID guessing. |
| Persisted records | current Team tree domain/schema | Extract tight shared record types/validators | Reuse exact fields without generic root. |
| Team durability/history | current Team store/index/memory layout | Preserve and narrow | Byte/path compatibility is approved. |
| Org durability/history | current atomic store/index patterns | Create subject store/index | Separate family/path/root invariant. |
| Mixed projection | Team history/stream/projectors | Add thin explicit-kind facade; retain Team-only paths | Shared UI needs one union, but lifecycle/storage stay subject-owned. |
| Migration | app-data migrations | Extend | Reuse the existing runner/record/log/restart policy; isolate legacy codecs and add no lazy compatibility or bespoke recovery. |
| Web workspace | Team execution view components/state | Extract mixed read view around two union branches | Shared interactions should not duplicate; focus policy remains root-kind-specific. |
| Org authoring | Team form primitives | New subject-specific UI | Membership/coordinator semantics differ. |
| Launch precedence | current Team config hierarchy | Extract/extend | Existing root/placement logic; server authority is new. |
| Definition atomic save | parent mutations + atomic file writer | Extend with a normal-authoring package transaction | Multiple package files need revisioned all-or-complete publication; data migration remains separate. |
| Handoff UI | current record + Product design | Shared presentational primitives | Endpoint eligibility/persistence remain subject owners. |

## Subsystem / Capability-Area Allocation

| Subsystem | Owns | Spines | Decision | Notes |
| --- | --- | --- | --- | --- |
| Collaboration Definition Admission | Source registry, target-only decode result, dependency availability, diagnostics/new-work gate | DS-000, DS-007 | Create | External roots are read-only; runtime/history do not depend on live admission. |
| AgentOrg Definition | Org domain/config/source/ref/candidate/catalog | DS-001, DS-007, DS-011 | Create | Query Team definitions only. |
| AgentTeam Definition | Agent-only Team/coordinator/local source | DS-001, DS-002, DS-011 | Refactor | Remove Team-owned Team sources. |
| Agent Collaboration | address/handoff/endpoint catalog and tool contracts | DS-003-DS-005, DS-009 | Extend | Shared semantics, not generic root authority. |
| Collaboration Execution (internal) | Tagged root/member/host/physical identities, member context, configured-Agent factory, root-neutral task/message engines, active-root directory and location facade | DS-002-DS-006O, DS-008, DS-014, DS-015 | Create by extraction | Mandatory tight capabilities only; Team-local execution and subject adapters/trees/stores/events remain in their domain owners. |
| AgentTeam Execution | RootTeamRun/Team manager/service/V2 persistence, root-neutral flat-Team local factory, and Team task/message/event adapters | DS-002, DS-004-DS-006T, DS-014-DS-015 | Refactor/Preserve | Native Team family retained; local Team execution moves under an explicit `local/` boundary consumable by Org; configured child removed. |
| AgentOrg Execution | AgentOrgRun/manager/service/planner/index, Org task/message/event adapters, strict sidecars and V1 persistence coordination | DS-003-DS-006O, DS-014-DS-015 | Create | Composes direct Agent and flat Team mechanisms without Team root/package. |
| Run History/Persistence | strict subject schemas/stores/indexes and tagged mixed catalog | DS-006T, DS-006O, DS-008 | Extend | Two authorities; mixed derived facade. |
| App Data Migration | old config/Org-like V2 conversion, current-file writes, one direct family rename, cleanup, bounded dispositions | DS-007, DS-010 | Extend existing runner | Flat Team path is verification-only; no custom journal/staging/recovery owner. |
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
| `agent-collaboration/execution/domain/root-execution-identity.ts` | Collaboration Execution | Tight tagged root/member/host/physical identity constructors | Internal only; no persisted root union or bare-ID kind inference. |
| `agent-collaboration/execution/domain/member-execution-context.ts` | Collaboration Execution | AgentRun collaboration/tool context | Replaces Team-root-specific member context. |
| `agent-collaboration/execution/backends/configured-agent-execution-handle.ts` | Collaboration Execution | AgentRun candidate/local execution mechanics | Mandatory callbacks; no root/store/index imports. |
| `agent-team-execution/local/flat-team-execution-factory.ts` | Team Local Execution | One Agent-only local Team below explicit root host | No root package/registry/configured child Team. |
| `agent-collaboration/execution/task/root-task-lifecycle-engine.ts` | Collaboration Execution | Root-neutral task record/FIFO lifecycle | Subject adapter owns tree/persistence/event. |
| `agent-collaboration/execution/communication/root-communication-engine.ts` | Collaboration Execution | Root-neutral accepted message lifecycle | Subject adapter owns exact receiver/persistence/event. |
| `agent-collaboration/execution/services/active-collaboration-root-directory.ts` | Collaboration Execution | Compound active-root narrow boundary | No lifecycle/concrete aggregate/bare-ID lookup. |
| `agent-collaboration/execution/services/collaboration-execution-location-service.ts` | Collaboration Execution | Explicit Team/Org physical Agent lookup | Composes strict subject location providers. |
| `run-history/domain/run-execution-tree-shared-records.ts` | Persistence | Exact shared envelope field/Agent/Team/task record types | No root union; both subject trees compose. |
| `run-history/store/run-execution-tree-shared-record-schemas.ts` | Persistence | Exact reusable zod schemas | Avoid duplicate field validators. |
| existing `agent-team-execution/domain/team-run-execution-tree.ts` | Team Execution | Exact Team V2 domain/root | Preserve native owner. |
| existing `run-history/store/team-run-execution-tree-*.ts` | Team Persistence | Exact V2 schema/path/store | Preserve file/path/keys; narrow configured members. |
| `agent-org-execution/domain/agent-org-run-execution-tree.ts` | Org Execution | Exact Org V1 domain/root | New subject contract. |
| `run-history/store/agent-org-run-execution-tree-*.ts` | Org Persistence | Exact V1 schema/path/store | New family-specific store. |
| `agent-org-execution/persistence/agent-org-*-sidecar-*.ts` | Org Persistence | Strict Org task/message envelopes, schemas and stores | Reuse exact record arrays; require `subjectKind/orgRunId`. |
| `agent-org-execution/persistence/agent-org-run-persistence-coordinator.ts` | Org Persistence | Serialize Org tree/task/message commits and fail-stop | No Team sidecar/store. |
| `agent-org-execution/task/agent-org-task-root-adapter.ts` and communication/event siblings | Org Execution | Translate shared engines into Org index/tree/persistence/event operations | Private to AgentOrgRun. |
| `agent-team-execution/task/team-task-root-adapter.ts` and communication/event siblings | Team Execution | Translate shared engines into Team index/tree/persistence/event operations | Private to RootTeamRun. |
| `agent-org-execution/domain/agent-org-run.ts` | Org Execution | Org aggregate/direct handles/index | No coordinator/generic root. |
| `agent-org-execution/services/agent-org-topology-planner.ts` | Org Execution | Fixed Org plan | Subject-specific IDs/placements. |
| `agent-org-execution/services/agent-org-run-manager.ts` | Org Execution | Active Org registry/restore | One family manager. |
| `run-history/services/root-execution-projection-service.ts` | Mixed Read | Explicit-kind dispatch/tagged DTO | Thin derived facade only. |
| `run-history/services/root-run-package-readiness-index.ts` | Current Run Readiness | Sorted family/path inventory, cross-family ID exclusivity, exact current manifest/store validation, unavailable diagnostic linkage | Never decodes or transforms legacy payloads and never guesses kind from content. |
| `app-data-migrations/.../legacy-team-definition-config.ts` | Migration | Retired unversioned server-owned decoder | Cannot be imported by normal admission. |
| `app-data-migrations/.../legacy-organization-like-team-run-v2.ts` | Migration | Strict released Team V2 organization-like classifier/decoder after current flat-V2 validation fails | Cannot be imported by current Team/Org stores or history. |
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
| Tagged root/member/host/physical identity | `agent-collaboration/execution/domain` | Both roots must bind common Agent/task/message mechanics without false Team ownership | Public generic root, optional kind, or persisted root envelope |
| Configured Agent execution handle | Collaboration execution backend | Provider/local AgentRun lifecycle is identical once root policy is injected | Root aggregate/store/event owner or union of subject state |
| Flat Team local execution | AgentTeam execution `local/` | One Agent-only Team and recursive task descendants run identically below Team/Org root | Standalone root aggregate, package writer, or configured Team recursion |
| Task/message record engines | Collaboration execution task/communication | FIFO/record/reservation lifecycle is common | Subject tree/index/persistence/event union |
| Atomic run-package file writer | run-history physical persistence | Temp-write/fsync/rename outcome reporting is subject-agnostic | Schema/path selection or root transaction owner |
| Launch configuration merge | Collaboration resolver + pure field merge module | Org and Team reuse field precedence | Focus/coordinator policy |
| Task delegation record/FIFO engine | Collaboration execution task owner | Both roots share record lifecycle/queue while adapters own exact host/tree commits | Root aggregate, subject tree union, or configured membership API |
| Handoff UI model | web collaboration components | Display/edit commands repeat | Endpoint/persistence owner |
| Mixed projection DTO | stream/history contract | Server/web share explicit union | Client-inferred kind |
| Definition package transaction | definition provider utility | Org/Team normal multi-file save needs the same atomic visibility and revision control | Domain validator, global lock, or migration mechanism |

## Shared Structure / Data Model Tightness Check

| Structure | Singular Meaning? | Overlap Risk | Corrective Action |
| --- | --- | --- | --- |
| `DefinitionAdmissionResult` | Yes | Medium | Available branch contains one exact subject; unavailable branch is diagnostic data, never a fallback definition. |
| `AgentOrgDefinition` | Yes | Low | No coordinator/inherited Team fields. |
| `AgentTeamDefinition` | Yes | Low | Agent-only member record. |
| Shared persisted configured/task records | Yes | Medium | Exact current fields only; no root IDs/discriminator added. |
| `TeamRunExecutionTreeFileV2` | Yes | Low | Remains exact native Team family. |
| `AgentOrgRunExecutionTreeFileV1` | Yes | Low | Exact Org keys; no optional coordinator/focus. |
| `RootExecutionIdentity` | Yes | Medium | Mandatory discriminated two-branch identity; never serialized as the root tree. |
| `RootExecutionPhysicalScope` | Yes | Medium | Root identity plus TeamRun ancestry only; logical host/address remains separate. |
| `CollaborationMemberExecutionIdentity` | Yes | Medium | One root, exact canonical address, exact AgentRun; no duplicate `rootTeamRunId`. |
| `TaskExecutionHostIdentity` | Yes | Medium | Exact root/host kind/run/address; host adapter validates correlation. |
| `MemberExecutionContext` | Yes | Medium | Authored instruction, handoffs/delivery and task commands only; no root aggregate/context. |
| Org task/message sidecar envelopes | Yes per file | Medium | Mandatory `subjectKind/orgRunId`; record arrays exact; no Team field aliases. |
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
| `.../agent-team-definition/providers/definition-package-transaction.ts` (or neutral sibling provider utility) | Definition persistence | Normal authoring revision lock, complete package staging, atomic publication/recovery | Used only by subject providers/services; migration must not call it. |
| `.../agent-collaboration/domain/collaboration-address.ts` | Collaboration | Parse/build/rebase/depth | Not a global locator. |
| `.../agent-collaboration/definition/collaboration-handoff-compiler.ts` | Collaboration | Explicit Team/Org compile | Resolved topology only. |
| `.../agent-collaboration/definition/definition-endpoint-catalog.ts` | Collaboration | Eligible endpoints/coordinator metadata | Candidate topology only. |
| `.../agent-collaboration/services/collaboration-launch-configuration-resolver.ts` | Collaboration | Org/Team effective launch settings | No activation/focus. |
| `.../agent-collaboration/execution/domain/root-execution-identity.ts` | Collaboration Execution | Construct/compare/clone tagged root, member, host and physical identities | No optional kind, persisted root, or bare-ID inference. |
| `.../agent-collaboration/execution/domain/member-execution-context.ts` | Collaboration Execution | AgentRun-bound authored instruction, handoff/delivery and task-command context | No `RootTeamRun`, subject manager/store/index. |
| `.../agent-collaboration/execution/backends/configured-agent-execution-handle.ts` | Collaboration Execution | AgentRun candidate prepare/restore/publish/abort, local commands/events/termination | Mandatory tagged identity/scope/callbacks; no root policy. |
| `.../agent-collaboration/execution/backends/configured-agent-execution-factory.ts` | Collaboration Execution | Controlled handle construction | No service locator or root selection. |
| `.../agent-collaboration/execution/task/root-task-lifecycle-engine.ts` | Collaboration Execution | Task FIFO/record/review/settlement lifecycle | Adapter only; no Team/Org tree/store/event imports. |
| `.../agent-collaboration/execution/task/member-task-command-capability.ts` | Collaboration Execution | Selector-free Agent tool command boundary | Returns results, never root aggregate. |
| `.../agent-collaboration/execution/communication/root-communication-engine.ts` | Collaboration Execution | Accepted-message record/reservation lifecycle | Adapter only; no Team/Org envelope. |
| `.../agent-collaboration/execution/services/active-collaboration-root-directory.ts` | Collaboration Execution | Compound tagged root -> narrow live message/query capability | No lifecycle, concrete aggregate or bare-ID lookup. |
| `.../agent-collaboration/execution/services/collaboration-execution-location-service.ts` | Collaboration Execution | Compose strict Team/Org Agent locations for mixed consumers | Explicit kind/correlation; no payload guessing. |
| `.../run-history/domain/run-execution-tree-shared-records.ts` | Persistence | Shared exact record types | No root union. |
| `.../run-history/store/run-execution-tree-shared-record-schemas.ts` | Persistence | Shared exact record validators | No path/family selection. |
| existing `.../agent-team-execution/domain/team-run-execution-tree.ts` | Team Execution | Exact Team V2 domain/root | Compose shared records; Agent-only members. |
| existing `.../run-history/store/team-run-execution-tree-schema.ts` | Team Persistence | Strict V2 exact keys/invariants | Never accept Org V1. |
| existing `.../run-history/store/team-run-execution-tree-path.ts` | Team Persistence | `$MEMORY_ROOT/agent_teams/<id>/team_run_execution_tree.json` | Unchanged. |
| existing `.../run-history/store/team-run-execution-tree-store.ts` | Team Persistence | Native V2 atomic read/write | No try-Org fallback. |
| `.../run-history/store/atomic-run-package-file-commit-writer.ts` (move/rename existing Team writer) | Physical Persistence | Subject-neutral temp-write/fsync/rename outcome reporting | No schema/path/root transaction policy; Team and Org stores supply strict file roles. |
| `.../agent-org-execution/domain/agent-org-run-execution-tree.ts` | Org Execution | Exact Org V1 domain/root | Compose shared records. |
| `.../agent-org-execution/domain/agent-org-run.ts` | Org Execution | Org aggregate/direct Agent/Team handles/index/events | No coordinator; owns Org operations. |
| `.../agent-org-execution/services/agent-org-topology-planner.ts` | Org Execution | Fixed-depth run plan/IDs | No raw provider reads. |
| `.../agent-org-execution/services/agent-org-run-manager.ts` | Org Execution | Org active registry/factory/restore | Calls Org store only. |
| `.../agent-org-execution/services/agent-org-run-service.ts` | Org Execution | Config-first full-scope create/restore/stop | Public Org boundary. |
| `.../agent-org-execution/services/agent-org-execution-scope-builder.ts` | Org Execution | Explicit aggregate/adapters/root-host/direct-handle/flat-Team assembly | Replaces catch-all activator; no Team root/package. |
| `.../agent-org-execution/services/agent-org-state-package-loader.ts` | Org Execution | Strict tree/task/message correlation and task reopen repair | No Team sidecar envelope or live definition lookup. |
| `.../agent-org-execution/task/agent-org-task-root-adapter.ts` | Org Execution | Host/index/tree/persistence/event bridge for shared task engine | Private to AgentOrgRun. |
| `.../agent-org-execution/communication/agent-org-communication-root-adapter.ts` | Org Execution | Exact receiver/sidecar/event bridge | Private to AgentOrgRun. |
| `.../agent-org-execution/events/agent-org-run-event*.ts` | Org Execution | Subject event contract/publisher/snapshot sequencing | Neutral handle events enter only through adapter. |
| `.../agent-team-execution/services/flat-team-topology-planner.ts` | Team Execution | Team->Agents plan | Replaces configured recursive planning. |
| `.../agent-team-execution/local/flat-team-execution-factory.ts` | Team Local Execution | Materialize one Agent-only Team beneath explicit root scope | No root package/registry or configured child Team. |
| `.../agent-team-execution/local/flat-team-execution-manager.ts` and `team-run.ts` | Team Local Execution | Direct configured Agent/task Agent/task Team commands/status/termination | Task Team recursion only; no root persistence. |
| `.../agent-team-execution/task/team-task-root-adapter.ts` | Team Execution | Team tree/index/persistence/event bridge for shared task engine | Private to RootTeamRun. |
| `.../agent-team-execution/communication/team-communication-root-adapter.ts` | Team Execution | Existing Team message envelope/event bridge | Private to RootTeamRun. |
| existing Team run manager/service/root files | Team Execution | Native Team lifecycle/registry/coordinator | Call Team V2 store only. |
| `.../run-history/store/agent-org-run-execution-tree-schema.ts` | Org Persistence | Strict Org V1 keys/invariants | Never accept Team V2. |
| `.../run-history/store/agent-org-run-execution-tree-path.ts` | Org Persistence | `$MEMORY_ROOT/agent_orgs/<id>/agent_org_run_execution_tree.json` | Exact approved path. |
| `.../run-history/store/agent-org-run-execution-tree-store.ts` | Org Persistence | Native Org V1 atomic read/write | No try-Team fallback. |
| `.../agent-org-execution/persistence/agent-org-task-delegation-records-v1-*.ts` | Org Persistence | `agent_org_task_delegation_records.json`, strict `subjectKind/orgRunId`, exact record array | Never accept `rootTeamRunId`. |
| `.../agent-org-execution/persistence/agent-org-communication-messages-v1-*.ts` | Org Persistence | `agent_org_communication_messages.json`, strict `subjectKind/orgRunId`, exact message array | Never accept Team filename/envelope. |
| `.../agent-org-execution/persistence/agent-org-run-persistence-coordinator.ts` | Org Persistence | Serialize Org tree/task/message mutation and latch Org fail-stop | No Team store/path/root. |
| `.../run-history/store/agent-org-run-file-commit-writer.ts` | Org Persistence | Correlated Org V1 tree/task/metadata commit sequence | Mirrors fail-stop mechanics, not Team root semantics. |
| existing `.../agent-memory/store/agent-memory-layout.ts` | Memory layout | Map tagged root + TeamRun ancestry + AgentRun to exact Team/Org path while preserving relative lineage | No shallow Org special case, logical topology inference, or flat-Team path rewrite. |
| `.../run-history/domain/agent-org-run-history-index.ts` + store/service | Org History | Org history rows/index | Subject-specific authority. |
| existing Team history index/store/service | Team History | Native Team history | Retained for Team. |
| `.../run-history/services/root-run-history-catalog-service.ts` | Mixed Read | Merge tagged Team/Org derived rows | Calls subject query boundaries. |
| `.../run-history/services/root-run-package-readiness-index.ts` | Current Run Readiness | Index family locations, reject duplicate IDs/retired authority residue, invoke selected strict store, link unavailable status to migration evidence | No legacy decode, family guessing, transform, or lifecycle ownership. |
| `.../run-history/services/root-execution-projection-service.ts` | Mixed Read | Explicit compound identity -> tagged tree DTO | No file scan/guess/lifecycle. |
| `.../app-data-migrations/migrations/agent-org-flat-team-families-v1/agent-org-flat-team-families-v1-app-data-migration.ts` | Migration | Deterministic definition/run inventory, fixed transforms, atomic current writes, one direct package rename, cleanup, verification, bounded dispositions | Uses existing runner contracts; only old-shape orchestration owner and no custom ledger/journal/recovery. |
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
- **Ports/adapters below subject roots:** configured Agent, task and message engines own common local policy; private Team/Org adapters own tree/index/persistence/event translation.
- **Prepare-durability-publish activation:** every Org configured Agent candidate and provider binding is prepared before the correlated Org package commit; publication/registration follows durability or the entire root aborts/fail-stops.
- **Compound active-root directory:** live global routing uses explicit tagged root identity and a narrow capability, never a concrete aggregate or bare ID.
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
| `autobyteus-server-ts/src/agent-collaboration/services/` | Existing/extended | Collaboration | configuration resolver | runtime root registry or persisted root union |
| `autobyteus-server-ts/src/agent-collaboration/execution/` | New extraction folder | Collaboration Execution | tagged identities/context, configured-Agent backend, task/message engines, active-root directory, mixed location facade | concrete RootTeamRun/AgentOrgRun, subject tree/store/event, GraphQL |
| `autobyteus-server-ts/src/agent-team-execution/` | Existing folder | Team Execution | native RootTeamRun/manager/service, flat planner, Team adapters; `local/` owns root-neutral flat-Team execution | Org root, configured Team children, Org persistence |
| `autobyteus-server-ts/src/agent-org-execution/` | New folder | Org Execution | AgentOrgRun/manager/service/planner/index, explicit scope builder, Org adapters/events/sidecars/persistence | Team V2 authority, coordinator, catch-all activator |
| `autobyteus-server-ts/src/run-history/domain/` | Existing folder | Persistence contracts | shared exact records + subject history rows | generic persisted root |
| `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-*.ts` | Existing files | Team Persistence | exact native V2 schema/path/store | Org keys or fallback |
| `autobyteus-server-ts/src/run-history/store/agent-org-run-execution-tree-*.ts` | New files | Org Persistence | exact V1 schema/path/store | Team root or try-both logic |
| `autobyteus-server-ts/src/agent-memory/store/agent-memory-layout.ts` and mixed location callers | Existing files | Memory layout | tagged family root plus unchanged relative TeamRun ancestry | shallow Org-only path, inferred kind, or flat-Team path rewrite |
| `autobyteus-server-ts/src/run-history/services/root-*-projection*.ts` | New files | Mixed Read | explicit-kind derived catalog/tree projection | lifecycle, kind inference |
| `autobyteus-server-ts/src/run-history/services/root-run-package-readiness-index.ts` | New file | Current Run Readiness | family-path/target-manifest inventory and compound-kind readiness | legacy payload decoder, transformation, or try-both validation |
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
| `$MEMORY_ROOT/agent_orgs/<orgRunId>/agent_org_task_delegation_records.json` | Exact Org sidecar | Org task store | strict Org envelope + exact task records | `rootTeamRunId` or Team store fallback |
| `$MEMORY_ROOT/agent_orgs/<orgRunId>/agent_org_communication_messages.json` | Exact Org sidecar | Org communication store | strict Org envelope + exact message records | Team filename/envelope or cross-root messages |
| `$MEMORY_ROOT/<family>/<rootRunId>/<teamRunLineage...>/<agentRunId>/` | Physical Agent memory | Memory layout | direct/mounted/task Agent content under owning root family | synthetic Team segment for direct Org Agent or per-Agent migration |
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
  identities/context/configured-Agent/task/message mechanisms to
  `agent-collaboration/execution/`; move the one-Team local runtime into
  `agent-team-execution/local/`. Do not move the whole Team subsystem or create
  a public generic root.
- Move/rename `team-run-file-commit-writer.ts` to the subject-neutral physical
  `atomic-run-package-file-commit-writer.ts`; preserve its write semantics while
  moving Team/Org file-role selection to strict stores. Remove normal shared
  imports of `MemberTeamContext`, `TeamMemberExecutionIdentity`,
  `MemberTaskRootResolver`, `MixedAgentMemberHandle`, the root-creating mixed
  factory, and the placeholder `AgentOrgExecutionActivator` only after all
  callers use the replacement capabilities.
- Regenerate `autobyteus-web/generated/graphql.ts` and mixed stream generated
  types from new authoritative schemas. Do not hand-maintain compatibility
  aliases.
- Runtime migration atomically renames only organization-like package
  directories directly from `agent_teams/<id>` to `agent_orgs/<id>` after the
  prospective Org tree and Org task/message sidecars validate/correlate inside the source package; flat Team
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
| `agent-collaboration` | Shared address/handoff/config mechanisms | Yes | Tight cross-root semantics; no public root authority. |
| `agent-collaboration/execution` | Internal shared execution capabilities | Yes | Tagged mandatory identities/ports and record engines only; concrete subject state remains outside. |
| `agent-team-execution` | Team root plus `local/` one-Team mechanics | Yes | Root and local Team depths are explicit; local factory is Org-consumable but cannot own a root package. |
| `agent-org-execution` | Org root runtime/adapters/sidecars | Yes | New lifecycle/persistence subject; composes only the Team-local factory and shared execution ports. |
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
| Org execution composition | `AgentOrgRun -> Org adapters -> ConfiguredAgentExecutionHandle + FlatTeamExecutionFactory`; mounted Team has no root registry/package | Synthetic RootTeamRun, standalone Team roots, or standalone direct Org Agents | One Org lifecycle/durability owner. |
| Tagged member context | `{root:{rootSubjectKind:'agent_org',rootRunId}, memberAddress, agentRunId}` plus bound task commands | `rootTeamRunId` alias or resolver returning RootTeamRun | Same Agent tools operate without false Team ownership. |
| Org memory | `agent_orgs/<org>/<teamRunLineage...>/<agent>`; direct Agent has empty lineage | shallow-only helper that loses mounted/task Team lineage or synthetic root segment | Preserves direct package rename and exact content. |
| Org sidecars | strict `subjectKind/orgRunId` task/message envelopes over unchanged records | reuse Team envelope/filename and reinterpret `rootTeamRunId` | Fail-closed subject truth. |
| Mixed projection | `{root_subject_kind:'agent_team', execution_tree: teamV2Dto}` or Org branch | Infer from missing coordinator/version/name | Fail-closed correctness. |
| Fixed depth | Org `/software_engineering_team/architecture_designer`; Team `/architecture_designer` | `/department/team/subteam/agent` | Explicit configured ownership. |
| Task host | Org Agent delegates to `/software_engineering_team`; fresh task Team lives in exact host `taskExecutions` | Add task Team to Org `members` | Configured vs task distinction. |
| Handoff compile | Org saved edges first; then each Team-local saved list in stable Org placement order, rebased once | Team-local-first, owner regrouping, sorting/deduping, or recursive indefinite compile | Preserves current observable rule lookup and owner separation. |
| Definition admission | exact Team Config V2/Org Config V1 -> available, or stable unavailable diagnostic | retry old parser, silently add/remove `refType`, or mutate external source | REQ-026/027 target-only boundary. |
| Definition save | Complete ordered candidate + expected revision -> validate -> normal-authoring atomic package commit | Per-handoff/per-file writes or silent stale repair | Atomicity/reversibility. |
| Org configuration | root choices + `/team` patch + `/team/agent` patch -> server complete plan | Trust client expansion or Team defaults silently win | Deterministic specificity. |
| Org focus | launch returns Org run ID/focus null; explicit Team row maps to stored coordinator | pre-launch entry, first Agent, durable focus | Activation/target separation. |
| Migration | existing startup runner + server-owned definition conversion + flat runtime hash/path unchanged + validated Org target followed by one direct package rename; external roots zero-write | rewrite external projects, rewrite all runtime Teams, custom journal/staging/recovery, try-both reader, recursive flattening | Minimal in-scope change, forward-only runtime, and exact ownership/runtime contracts. |
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
| Generic public root aggregate/base to solve IDI-001 | Rejected | Two subject aggregates over tagged internal capabilities and private adapters. |
| Synthetic Team root/coordinator for Org | Rejected | Native AgentOrgRun with direct root Agent handles and mounted local Teams. |
| Register mounted Org Teams in AgentTeamRunManager | Rejected | Org owns local Team executions; no Team root package/registry. |
| Launch direct Org Agent as standalone AgentRun | Rejected | Root-neutral configured-Agent handle remains owned by Org aggregate. |
| Keep `MemberTaskRootResolver` and cast/union return | Rejected | Bound `MemberTaskCommandCapability` exposes commands, not aggregate identity. |
| Reuse Team task/message envelopes inside Org | Rejected | Strict Org envelopes and stores over exact shared record bodies. |
| Rewrite/move flat Team V2 | Rejected | Leave file/path/bytes native; only stricter validation. |
| Normal reader tries Team then Org | Rejected | Explicit family/kind dispatch and strict one-family reader. |
| Leave migrated Org-like Team package in both paths | Rejected | Preflight destination absence, validate target in the source package, then one direct atomic source-to-target directory rename and strict reread. |
| Auto-retype/move wrong-family payload on restore | Rejected | Failure-closed mismatch; the registered startup migration is the sole old-shape boundary. |
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
   policy, subject planners/aggregates/indexes/private adapters and task-host
   invariants.
4. **Internal execution capabilities:** tagged identities/context, configured-
   Agent handle, Team-local factory, task/message engines, active-root directory
   and location facade. Subject roots depend on these ports; they do not depend
   on each other's managers/stores.
5. **Providers/persistence:** AgentRun providers plus subject definition
   providers, Team V2 and Org V1 trees/sidecars/history/memory.
6. **Migration:** old configured recursion and organization-like Team V2 codecs,
   fixed transforms, atomic current-file writer, direct package rename, cleanup,
   and bounded dispositions behind the existing runner; no upward dependency
   from current code.

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
   server-owned definition files and make CI target-scan them. Publish each
   target-only catalog only after the startup runner attempt and strict
   per-item readiness rebuild.
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
6. **Add atomic definition aggregate save.** Implement the normal-authoring
   package transaction plus subject revision locks/adapters. Verify
   create/update/cancel/conflict and one interrupted-save recovery category with
   zero partial visibility; keep this mechanism out of data migration.
7. **Extract tagged collaboration execution identities/context first.** Add
   `RootExecutionIdentity`, member/host/physical identities,
   `MemberExecutionContext`, bound task command contract, and explicit Team/Org
   memory/location composition. Update AgentRun/tool/context-file/run-file/token
   consumers cleanly; remove `MemberTaskRootResolver` and Team-root identity from
   shared Agent paths. Prove existing standalone Team tools still pass through a
   Team adapter before adding Org activation.
8. **Extract configured Agent execution.** Move provider/local mechanics from
   `MixedAgentMemberHandle` to `ConfiguredAgentExecutionHandle`; require all
   root callbacks/identity/scope/memory explicitly. Add prepare-configured-
   activation and preserve task preparation, retry-safe failure, platform binding,
   event adaptation and termination tests under both tagged root kinds without
   constructing either aggregate.
9. **Narrow the local Team plane.** Move one-Team mechanics under
   `agent-team-execution/local/`; create `FlatTeamExecutionFactory`; delete
   configured-child registry/materialization while retaining direct configured
   Agents and recursive task Team registries. Prove the factory creates no root
   files/manager registrations and maps Team/Org physical scopes correctly.
10. **Rebuild native Team root over the extracted ports.** Keep `RootTeamRun`,
    Team manager/service, exact Team V2 tree/sidecars/path/history and current
    Team semantics. Add Team task/message/event/platform-binding adapters and
    use the local Team factory with Team identity. Run the full focused Team
    runtime/tool/task/message/restore/fail-stop suite before proceeding.
11. **Extract task/message engines and physical writer.** Split shared
    record/FIFO/reservation lifecycle from Team tree/index/persistence/event
    adapters; move the atomic physical writer to a subject-neutral file while
    preserving Team write outcomes. No engine accepts a subject tree/store or is
    exposed above a root aggregate.
12. **Add strict Org state ownership.** Implement Org V1 tree/index/mutators,
    strict Org task/message sidecars, Org state-package loader/reopen repair,
    Org persistence coordinator, task/message/event adapters, and root task host.
    Prove family/sidecar mismatch and root correlation fail before live assembly.
13. **Implement explicit Org scope assembly and full activation.** Replace the
    placeholder activator with `AgentOrgExecutionScopeBuilder`; construct direct
    Agent handles and mounted local Teams, prepare all configured Agent
    candidates, gather/persist provider bindings with the complete Org package,
    publish/register only the full scope, and implement whole-root fail-stop and
    reverse teardown. Test direct Org Agent, mounted Team Agent, Org-root task
    host, Team-host task, restore and partial-preparation abort.
14. **Wire process/global lifecycle.** Add `ActiveCollaborationRootDirectory`,
    make global exact-Agent same-root routing use tagged roots, construct general
    process dependencies in the specified order, and shut down Org -> Team ->
    Agent. Keep application execution scopes Team-only but move them to the same
    extracted factories. Add construction-abort and aggregate shutdown tests.
15. **Add configuration resolver.** Server-authoritative Org root->Team->Agent
    and Team root->Agent resolution; validate all settings/workspaces before IDs
    and activation. Org returns no focus/entry.
16. **Add explicit mixed projections.** Preserve Team-only endpoints/contracts;
    add tagged history/tree/stream GraphQL and contract package, with family-
    payload-sidecar-branch agreement and negative mismatch tests.
17. **Implement/register migration and admission cutover.** Place after prior V2
    prerequisites and before service admission. For Org-like packages write and
    validate the prospective Org tree plus Org task/message sidecars, direct-
    rename the package, then clean retired Team authorities; keep Agent memory
    relative paths unchanged. Test the current 27 no-op flat and 16 Org-like
    fixtures plus cutover-generated cases, sidecar correlation, task hosts,
    destination collision, target-only retry, one interruption/relaunch,
    PRE-002 zero-write failure, external zero-write/non-blocking diagnostics,
    bounded runner summary/log, restart guidance and inventory count drift.
18. **Cut definition/launch external contracts.** Add Org
    GraphQL/tools/package discovery and admission diagnostics; remove nested Team
    input; preserve compatible Team-only run DTOs; regenerate GraphQL/contracts.
19. **Implement web/Product cut.** Add separate Team/Org catalog/builder/detail,
    owner-scoped handoff drafts, Org config, tagged workspace/history, nullable
    Org focus, exact Team-coordinator mapping, availability-filtered new-work
    catalogs, and RV-012 desktop/narrow/a11y. Existing snapshot history remains
    visible even when a current definition is unavailable.
20. **Convert only owned examples and remove obsolete code.** Convert all
    implementation-repository/server-data definitions from the authoritative
    inventory. Use Software Development Department/Northstar external packages
    only as read-only admission/diagnostic fixtures until owners update. Delete
    current recursive configured owners/selectors/docs, normal unversioned parser,
    Team-root shared member/task contexts, root-creating mixed factory,
    configured-child APIs, placeholder Org activator, and stale generated mirrors
    where repository convention permits.
21. **Validate in risk order.** Run the separate
    `architecture-design-self-validation.md` use-case matrix as the design/code
    trace checklist, then exact definition/run/sidecar schemas; source ownership;
    Team regression; root-neutral factory contract tests; Org full activation/
    task/message/platform binding/restore/fail-stop/shutdown; migration; mixed
    mismatch; GraphQL/streams; VIS-001-VIS-020 browser journeys; full builds/
    typechecks. No source-review handoff occurs until all partial-draft and
    obsolete-test failures are resolved.

No temporary dual write, try-both runtime read, normal dual definition parser,
external-source writer, generic V3 root, or public configured recursion may
survive the cutover.

## Key Tradeoffs

1. **Two subject aggregates/stores over a narrow internal execution plane.**
   Some adapter/orchestration code is duplicated, but it preserves exact Team V2
   and truthful Org V1 ownership. Tagged identities, configured-Agent mechanics,
   Team-local execution, task/message record engines and the physical writer keep
   provider/local duplication bounded without a public/durable generic root.
2. **No-op flat cohort.** It intentionally leaves Team-named paths/contracts
   because they remain accurate, avoiding unnecessary I/O and client breakage.
3. **Separate Org history/stream projection plus mixed facade.** More adapters
   than one generic store, but no false single authority or kind inference.
4. **Validated direct package rename.** Writing and rereading the target Org
   tree plus strict Org task/message sidecars in the source package before one
   same-filesystem atomic rename avoids copying large Agent memory/content and
   preserves one package identity without adding a
   second recovery framework. A later ordinary startup retries an interruption.
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
10. **Explicit internal extraction over copied Org runtime.** The extraction touches existing Team/Agent tool paths, but one common provider/local implementation is safer than duplicating Agent activation/task/message behavior and letting them diverge. Subject adapters make the risk reviewable.
11. **Org-specific sidecar envelopes.** Two extra current codecs/files and a small migration envelope transform avoid reinterpreting `rootTeamRunId` inside an Org and permit strict family correlation. Record bodies and memory content do not move.
12. **Prepare all Org configured Agents before root registration.** Launch work is larger than lazy synthetic composition, but it implements approved full-scope activation and gives one failure/teardown boundary with no partial active Org.

## Risks

| Risk | Likelihood / Impact | Control | Residual |
| --- | --- | --- | --- |
| Flat Team is accidentally rewritten/moved | Medium / Critical | Golden bytes/path/inode/mtime no-op tests; migration write audit | Validation code changes but serialized native contract stays. |
| Root misclassified | Low / Critical | Exhaustive preflight, direct configured-Team cohort rule, strict fixtures | Contradictory data blocks rollout. |
| Both families become canonical for one ID | Low / Critical | Preflight destination absence, one direct atomic rename, strict post-rename reread, and failure-closed source+target conflict | Unsupported/manual conflicts gate only that root and require corrected data/release followed by restart. |
| Definition/package ref breaks on Org conversion | Medium / High | Global server-owned ref plan, preserve IDs, exact target validation, dependency diagnostics | External owners must publish compatible targets separately. |
| In-ticket code writes or claims external repositories | Low / Critical | Typed source descriptors, external writer rejection, filesystem/SCM zero-write audit, scope review | Misconfigured source registration must fail safely. |
| Target admission silently falls back or globally blocks startup | Medium / Critical | One-family exact codecs, no migration imports, available/unavailable result, mixed compatibility scenario | Incompatible definitions remain intentionally unavailable. |
| Effective handoff order reverses or projections regroup owners | Medium / High | Root-first compiler contract, unchanged migration snapshots, stable-filter/projection golden tests | New ordering changes require requirements approval. |
| Task Team lineage removed with configured recursion | Medium / Critical | Separate types/folders/tests; recursive task records/factory retained | Future refactors need explicit distinction. |
| Root-neutral extraction remains Team-root-coupled by alias/cast | Medium / Critical | Exact tagged constructors, no Team imports in shared handle/engines, compile-time ports and Org-direct-Agent tests | Broad existing call-site migration is substantial. |
| Org full activation exposes a partial root | Medium / Critical | Prepare all candidates, commit strict package, publish/register last; reverse abort and no directory entry on failure | Post-durability publication uncertainty leaves a resumable package and fail-stopped non-active root. |
| Task/message engine becomes a generic root owner or bypass | Medium / High | Engine has one private subject adapter port; root aggregate constructs it; no tree/store/event imports or external getters | Adapter contracts must stay minimal as task features evolve. |
| Org platform binding commits to Team tree or after Agent publication | Medium / Critical | Tagged binding, Org mutator/coordinator, initial binding batch before publication, fail-stop on indeterminate finalization | External provider cleanup may still quarantine and requires existing AgentRun controls. |
| Org direct/mounted/task Agent memory is misplaced | Medium / Critical | Tagged root scope + unchanged relative TeamRun lineage golden paths and migrated package content probes | Opaque historical IDs remain, intentionally. |
| Org state package accepts Team sidecars or mismatched IDs | Low / Critical | Strict Org filenames/envelopes, `subjectKind/orgRunId` correlation, full-package loader and migration reread | Manual corruption remains capability-scoped unavailable. |
| Global same-root router uses bare IDs or cross-routes Team/Org | Medium / Critical | Compare tagged member roots, compound active directory, cross-kind collision negatives | Direct grant path remains separately governed. |
| Shutdown leaves an embedded Org Team active | Medium / Critical | Org owns every local Team; freeze/teardown whole graph; process order Org->Team->Agent; active directory unregister assertion | Provider teardown errors are aggregated and surfaced. |
| Org code reaches Team root manager/store or local factory creates root authority | Medium / Critical | Explicit `local/FlatTeamExecutionFactory`, no root-file/registry dependencies, import-boundary and negative registration tests | Future Team local changes require both root adapters to remain compatible. |
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
- Implement the AD-REV-005 internal execution boundary before continuing the partial Org activator draft. Shared AgentRun/tool code uses `RootExecutionIdentity`, `CollaborationMemberExecutionIdentity`, `RootExecutionPhysicalScope`, `MemberExecutionContext`, and bound task commands; it must not retain a `rootTeamRunId` alias or cast a root aggregate.
- `ConfiguredAgentExecutionHandle` owns only AgentRun candidate/local mechanics. `FlatTeamExecutionFactory` owns one Agent-only local Team and task descendants. Neither may import a subject root/manager/store/index/publisher or create/register a root package.
- Keep task/message engines behind private Team/Org adapters. If a common interface starts carrying a Team/Org tree union, optional coordinator, store, or event, stop and tighten the port rather than growing a generic root.
- Team task/message sidecars remain exact. Org uses only `agent_org_task_delegation_records.json` and `agent_org_communication_messages.json` with strict `subjectKind/orgRunId`; record arrays retain exact fields.
- Use tagged root physical scope and unchanged relative TeamRun ancestry for all Agent memory, context-file, run-file and history locations. A direct Org Agent has empty Team ancestry; never synthesize a Team directory.
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
- Keep the revisioned package transaction limited to normal multi-file
  definition authoring. Migration instead uses the existing runner, the
  established atomic current-file writer, one direct package rename, strict
  rereads, cleanup, and ordinary startup retry; add no journal, backup, staging
  tree, restore command, runner redesign, or per-syscall failure matrix.
- Migration preflight must create nothing. For flat Team packages prove byte,
  path, mtime, and directory inventory unchanged. For an Org-like package,
  validate the prospective Org tree plus strict Org task/message sidecars inside
  the source package, rename that package directly to the Org family, reread/
  correlate the complete package, and remove retired Team authority files before
  success; never advertise both family paths.
- Preserve handoff sequence end to end: Org/root-owned saved order first, then
  each direct Team's local saved order in stable Org member order, with each
  rules array unchanged. Migration copies compiled runtime snapshots; it does
  not recompile. `get_handoff_rules` and effective/UI projections filter or
  decorate without sorting, regrouping, or deduplication.
- Org launch settings resolve server-side from root plus sparse exact Team/Agent
  patches. Construct one Org aggregate, prepare every configured Agent/direct
  Team placement, persist any provider bindings and all three Org authorities,
  then publish/register the complete scope. Return no entry/focus and never
  mutate referenced definitions. Pre-durability failure aborts every candidate;
  post-durability indeterminacy fail-stops the whole unregistered Org.
- Org web focus starts/clears to `null`; exact Agent focuses directly; exact Team
  maps through Org snapshot to stored coordinator. Recipient actions validate
  focus both client- and server-side; no fallback repair.
- Keep task Team creation in the root-neutral task engine plus subject host
  adapter. Task Teams may recurse only in `taskExecutions` at the exact Org root/
  Team/task-Team host and never configured `members`. Direct Org Agents use the
  `AgentOrgRootTaskHost`, not a fake Team.
- General process assembly order is AgentRun infrastructure -> strict locations/directory/factories -> Team manager -> Org manager -> services. Shutdown closes admission and stops Org -> Team -> Agent before reverse release. Application scopes remain publicly Team-only while using the same extracted factories.
- Global exact-Agent routing compares tagged member roots and uses `ActiveCollaborationRootDirectory`; no bare root ID or Team manager lookup may select an Org.
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
  scenarios; Team Run V2 byte/path golden tests; standalone Team regression over
  the extracted handle/local-Team factory; Org Run V1 exact tree/task/message
  package schema/store/restore; family/sidecar mismatch negatives; root-neutral
  Agent handle import/contract tests; Org direct/mounted Agent full activation,
  root/Team task hosts, platform binding, message routing, partial-preparation
  abort, persistence fail-stop, exact memory paths and Org->Team->Agent shutdown; current-inventory and
  generated no-op/Org-like migration with one interruption/relaunch,
  destination-collision, target-only retry, and deep-precondition cases;
  runner summary/log/restart guidance; definition transaction conflict and one
  interrupted-save case; root-first effective
  handoff ordering through compilation/snapshot/migration/`get_handoff_rules`/
  projection; Org/Team GraphQL and streams; tasks/stop/restore/history; web
  From/To/When CRUD/order/cancel/save, config precedence, no-focus/exact focus,
  history/task lineage, responsive/a11y, standalone Team create/launch/reuse.
- Before implementation handoff, search current source excluding migration and
  immutable historical docs for configured Team member recursion,
  `getOrCreateConfiguredChildTeam`, `MemberTaskRootResolver`, shared
  `TeamMemberExecutionIdentity`/`memberTeamContext`, root-creating mixed factory,
  placeholder Org activator, Team-sidecar Org reuse, Org-as-RootTeam assumptions,
  Org `entryAddress`, required/fallback Org focus, root-kind inference, and generic
  V3/`collaboration_runs` artifacts. Also review every remaining `rootTeam`,
  `team_run_execution_tree.json`, and `agent_teams` occurrence: they are expected
  and correct in native Team code, but forbidden as Org/mixed authority.
