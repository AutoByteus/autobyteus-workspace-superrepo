# Design Spec

## Document Status

- Package: `AORG-FLAT-TEAM-001`
- Approved requirements revision: `RER-024`
- Normative supplement: `AORG-CONTRACT-001`
- Normative Product UI revisions: `RV-012` / `VIS-001`-`VIS-020`; focused
  mounted-Team status supplement `AORG-FLAT-TEAM-STATUS-001` /
  `VIS-STATUS-001`-`VIS-STATUS-003`; focused mounted-Team launch-override
  supplement `AORG-TEAM-OVERRIDES-001` / `VIS-OVR-001`-`VIS-OVR-006`, which
  supersedes only RV-012 Placement Overrides lines 89-95 and `VIS-015`
- Architecture result: `Architecture Design Complete`
- Architecture revision: `AD-REV-013`
- Date: 2026-09-03
- Workspace: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`
- Branch / approved revision commit: `requirements/flat-agent-organization-model` / `d881d815a995af166074728c0e6a6431829ad52f`

## Current-State Read

Before this ticket, the product used one recursively composable
`AgentTeamDefinition` and one recursively shaped Team execution family.
`AgentTeamDefinition.nodes` accepted both Agent and AgentTeam refs;
`TeamDefinitionGraphResolver` recursively loaded them; `TeamHandoffCompiler`
recursively rebased handoffs; and `TeamDefinitionTopologyPlanner` could allocate
configured child TeamRuns at arbitrary depth. `RootTeamRun`,
`TeamExecutionIndex`, the mixed Team backend, GraphQL, the Team WebSocket
contract, and the web workspace all encoded the root as a Team. The earlier
`8e680617c` implementation baseline performed the approved split/extraction;
this cumulative paragraph remains the pre-change architecture evidence rather
than a claim that configured recursion is still current.

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

The supplied workspace is an isolated git worktree at `RER-024@d881d815a`,
with downstream-owned dirty/untracked API/test/review evidence left untouched.
The current reviewed implementation result is
`IR-026@3199ba081ad450be72fba239fe86e76c0c697a33`, passed by cumulative source
review `CRR-032` and real-system `API-REV-008`; `CRR-033` records that no
durable API/E2E test code changed. Delivery `DR-003` had opened the Electron
package for explicit user verification when the user found the three current
launch/shell/default defects. Historical Code Review `CRR-021` returned
`CR-FIND-020`, which AD-REV-012 and IR-018 resolved. Its separate
`CR-FIND-019` local fix was also implemented in IR-018 and remains a distinct
regression obligation rather than part of this new architecture correction. Approved
`RER-019@f3035a2d5` changed only Product baseline activation/provenance;
RER-020/021 now add the mounted-Team status behavior and approved focused Product
evidence without changing RER-018's durable/runtime/schema authority. The chronological architecture record begins with `AD-REV-001` at
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
design through supported use cases and dependency/boundary checks. Architecture
Review `ARCH-REV-003@ae61ecd38` passed AD-REV-005. Implementation then completed
`IR-002/IR-003` at `8e680617c`, and Code Review `CRR-003` passed. A real
API/E2E browser run subsequently exposed `ADI-007`: the production Org workspace
bypasses the accepted Agent/Team presentation stack, stores raw root events, and
renders them through `JSON.stringify` plus a bespoke composer and member-header
`Stop Org` action. AD-REV-006 corrects that production-surface boundary by
making AgentOrg transport emit a strict Agent presentation stream, hydrating the
same `AgentContext` read model, and routing exact Org focus through reusable
Agent/Team workspace surfaces and the existing active-context command boundary.
The implementation and API/E2E worktree changes remain downstream-owned evidence
and are not modified or claimed by this design round. Architecture Review
`ARCH-REV-004@2ae61a11f` passed AD-REV-006. Later API/E2E evidence
`API-FIND-007` and the user's original Team-tree screenshot exposed a separate
Product baseline omission: a mounted Team row had lost the established aggregate
status signal. Code Review `CRR-009` correctly classified that as upstream
`CR-FIND-011`, not a defect against the then-approved RV-012 package. Requirements
`RER-020` approved `BEH-011` / `REQ-028` / `AC-023` / `SCN-012`; Product then
completed the explicitly user-approved focused `AORG-FLAT-TEAM-STATUS-001`
supplement, and `RER-021@ed236a63e` returned the closed package to Architecture.
AD-REV-007 maps that behavior to the existing production five-state Team-branch
status policy and strict AgentOrg context without changing any server, durable,
transport, lifecycle, focus, routing, or migration contract.

Implementation subsequently completed through `IR-012@73a2c06eb` and Code
Review `CRR-013` passed the cumulative source while holding API/E2E on
`API-FIND-008`. The first isolated same-task revision/resubmission probe and
direct graceful shutdown passed. The later exact two-task correlation proved a
technical queue/termination coupling, but its long wait was created by an
unsupported verifier self-review call deliberately left awaiting approval.
`ARCH-REV-006@2ad4bcc06` therefore blocked `AD-REV-008` as Unclear under
`AR-FIND-003`: that invalid action cannot establish a supported production
premise for a new settlement coordinator, token lifecycle, or shared shutdown
machinery.

`AD-REV-009` reconciles the design with independently supported production
paths. A normal task submission returns its tool result before the assignee's
canonical provider turn terminates, so a different delegator Agent can validly
accept the task during that interval. Settlement must inspect quiescence
without waiting at the root FIFO head and retry on the established idle event.
Separately, application-owned SIGTERM may reach an active task Agent waiting on
a legitimate approval-gated tool; each Team/Org root must freeze and interrupt
its owned Agent scope before draining task work so shutdown itself can release
that wait. The blocked AD-REV-008 coordinator, passive/committed token split,
independent cleanup jobs, and new dependency graph are withdrawn. Existing
task records, `settledAt`, prepared settlement transaction, one root mutation
FIFO, deepest-first sweep, fail-stop policy, and tool/API behavior remain.

Architecture Review `ARCH-REV-007@6cec1ee1b` accepted that supported basis and
the narrow settlement direction, resolving `AR-FIND-003`, but failed the
complete-scope shutdown target on `AR-FIND-004`. A normally delegated task can
durably activate and asynchronously release its first message; `AgentRun` can
admit/claim or begin provider dispatch before canonical `TURN_STARTED` exists.
The AD-REV-009 active-turn-only phase then accepts `NO_ACTIVE_TURN` as success,
allowing provider work to begin after the root believes interruption is done.

`AD-REV-010` closes that exact supported race at the existing `AgentRun`
input/lifecycle owner. Each frozen Team/Org scope invokes one idempotent,
irreversible per-Agent root-shutdown fence. The fence closes input admission,
cancels admitted-but-not-provider-started input through the existing
`cancelled / AGENT_RUN_TERMINATED_BEFORE_INPUT_FORWARD` lifecycle, and joins any
provider start that already won serialization. If that start has not yet
published `TURN_STARTED`, shutdown intent remains armed; canonical turn start
immediately reserves the existing interrupt, and the phase does not complete
until the input/turn is terminal. Claim-to-provider-start registration is made
atomic under the AgentRun dispatch queue, so a provider start is either tracked
before the fence or rejected after it—never untracked across it. Ordinary
non-root `prepareTermination()` keeps its established FIFO-drain semantics;
the new cancellation rule applies only to irreversible root shutdown. No new
persisted state, public API, provider timeout, replay, force-kill, settlement
coordinator, token/job graph, or Product policy is introduced.

Architecture Review `ARCH-REV-008@a6f712265` independently verified that
AD-REV-010 resolves `AR-FIND-004` and found no defect in the core design. It
identified one stale affirmative statement in the Architecture-owned
self-validation: VAL-006 still described AD-REV-008's withdrawn independent
cleanup jobs and concurrent cleanup outside the root FIFO. `AD-REV-011` makes
only that coherence correction. Recursive task-Team terminal settlement now
states the same authoritative path as DS-022 and VAL-026/029: deepest-first leaf
eligibility through the existing root FIFO; immediate `null` deferral and FIFO
release for a non-quiescent leaf; existing prepared settlement/finish for a
quiescent leaf; parent eligibility only after settled children. No source, API,
schema, Product, migration, or AD-REV-009/010 core-design change is introduced.

Architecture Review `ARCH-REV-009@f9b7fff0d` passed cumulative AD-REV-011 and
Implementation later integrated through `IR-017@b2c96d6b0`. During the requested
fresh comparison, Code Review `CRR-021` established `CR-FIND-020`: production
`AgentOrgRunConfigPanel -> AgentOrgPlacementOverrideRow` substantially follows
the formerly approved `VIS-015`, but that denser always-exposed Team-child
hierarchy is now superseded by direct user authority. Requirements Engineering
recorded the behavior in RER-022 and returned the explicitly user-approved
focused Product package as `RER-023@c4f39b02e`. `AD-REV-012` maps that approved
presentation correction to the already production-tested Team launch
components. It does not create a generic Team/Org configuration owner: the
AgentOrg draft, effective precedence, payload split, launch service, and
coordinator-free domain remain Org-owned, while `TeamScopeConfigEditor`,
`TeamMemberConfigTree`, `MemberOverrideItem`, and the compact outer disclosure
are reused strictly as presentation/edit-command boundaries. The focused change
is frontend-only: the existing AgentOrg GraphQL placement patch already carries
the required runtime/model/tool/workspace fields, and server resolution remains
authoritative. The separate `CR-FIND-019` local fix is not redesigned here.

After `ARCH-REV-010` passed AD-REV-012, implementation/review/validation advanced
through IR-026, CRR-032, API-REV-008 and the DR-003 Electron user-verification
gate. The user then found three connected production-path failures in the
AgentOrg launch experience: an exact Agent runtime/model override previews as
cleared locally but reaches the server without the required explicit
`llmConfig:null`; entering the Org configuration route replaces the established
Workspace/history left panel with an Org-only panel; and a new Org root does not
select the same default temporary workspace as the established Team root, so an
expanded inherited Team can truthfully project an empty workspace and Run stays
blocked. Source inspection confirms all three are design/implementation boundary
defects now explicitly clarified by approved RER-024, not missing Product intent.
`AD-REV-013` corrects them through one canonical Org launch-patch mapper, one
route-stable mixed Workspace/history projection, and the established root
workspace-default policy. It adds no requirement, Product, GraphQL, server,
durable, migration, lifecycle, focus, or Team/Org ownership change.

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
  atomic handoff authoring, separate frontend definition/configuration
  surfaces, the concrete Agent presentation stream/context/workspace extraction
  required to reuse the accepted live conversation surface, and the shared
  presentation-only mounted-Team status projection reconciled by AD-REV-007.
  AD-REV-012 also replaces the bespoke AgentOrg mounted-Team override tree with
  the established Team launch disclosure/editing components while retaining a
  separately owned Org draft and launch serializer. AD-REV-013 tightens that
  serializer into the single canonical frontend patch boundary, restores the
  Team-equivalent root workspace default, and replaces route-selected competing
  history panels with one tagged mixed Workspace read model.
  AD-REV-009 additionally tightens the shared task-settlement admission check,
  both Team/Org local task registries, and both root shutdown sequences so an
  active provider turn is never awaited by a settlement attempt at the root
  mutation FIFO head. AD-REV-010 completes that sequence by fencing accepted and
  provider-start-pending Agent input at the AgentRun boundary and threading the
  phase through every direct, mounted, task-Agent, and recursive task-Team scope.
  The focused AD-REV-007 delta is a bounded frontend projection/refactor and
  would be `Medium / Low` in isolation; it adds no backend contract or durable
  field. The focused AD-REV-009/010 recovery is `Medium / High` in isolation because it
  is a bounded internal concurrency/shutdown correction across the shared task
  engine, AgentRun input owner, and both root subjects. The cumulative package remains Large because all prior
  structural work remains the implementation/review scope. A repository scan found
  207 consumers of Team-root field names and
  11 direct configured-definition recursion consumers before tests and generated
  transport code. Those structural surfaces, not record count, make the task
  Large.
- AD-REV-011 delta classification: `Small / Low` in isolation because the
  revision corrects one contradictory Architecture-owned validation statement
  and introduces no implementation surface. It does not lower the cumulative
  `Large / High` classification or bypass the selected Architecture Review
  route.
- AD-REV-012 delta classification: `Medium / Low` in isolation. It is a bounded
  frontend presentation/state refactor across the existing AgentOrg run-config
  panel/store/projector and the already accepted Team launch components. It
  changes no server API, launch precedence, durable schema, migration,
  lifecycle, transport, or runtime owner. It is Medium rather than Small because
  exact Team/Agent override maps, Team workspace draft selection, shared
  disclosure state, serialization and desktop/narrow accessibility tests must
  remain coherent. The cumulative ticket remains `Large / High`.
- AD-REV-013 delta classification: `Medium / High` in isolation. It changes no
  public API or persistence, but it corrects a cross-layer launch-patch
  invariant and consolidates a shell-wide Workspace/history projection owner.
  The source delta is bounded to frontend configuration, navigation/history and
  tests. High reflects the risk of silently launching a different effective
  provider configuration or exposing competing history/lifecycle authorities.
  The cumulative ticket remains `Large / High`.
- Architectural risk: `High`
- Risk rationale and supporting evidence: The work changes public contracts,
  persistence family and sidecar selection, Agent/Team/Org lifecycle and tagged
  identity ownership, full-scope candidate publication/fail-stop ordering, startup
  migration, definition transaction semantics, and frontend/runtime projection across
  multiple repositories. A wrong family classification or partial cutover can
  make run history, tasks, memory, or packages unreachable or create two
  canonical authorities for one identity. Incorrect external admission can
  either activate retired packages or strand compatible definitions globally.
  Source and the correlated `API-FIND-008` evidence prove that current settlement
  calls provider quiescence at the shared task FIFO head. `ARCH-REV-006` correctly
  rejected the unsupported self-review as a behavioral premise; AD-REV-009 is
  instead grounded in normal submit/independent-accept overlap and application
  shutdown of a task Agent waiting on a legitimate approval-gated tool. The
  `ARCH-REV-007 / AR-FIND-004` trace additionally proves a supported normal
  task's accepted initial input can sit between AgentRun admission/provider
  dispatch and canonical turn start when SIGTERM arrives. AD-REV-010 makes
  provider-start admission and the irreversible root-shutdown fence one
  AgentRun-owned serialization contract. The correction changes shared
  concurrency and shutdown ordering, so risk remains High even without a schema
  or public API change.
- Selected route: `Architecture Review`
- Escalation trigger if implementation or validation discovers new impact:
  `IDI-001` is resolved by AD-REV-005, `ADI-007` is resolved by AD-REV-006,
  and `API-FIND-007` / `CR-FIND-011` is resolved at the design boundary by
  AD-REV-007. `API-FIND-008` / `CR-CAND-020` / `AR-FIND-003` is resolved at the
  design boundary by AD-REV-009; `AR-FIND-004` is resolved by AD-REV-010 without changing the approved durable boundary,
  and `AR-FIND-005` is resolved by AD-REV-011 by removing the stale contradictory
  validation statement without changing the core design, task record shape,
  tool contract, or user-visible task state machine. `CR-FIND-020` is resolved
  at the design boundary by AD-REV-012 under approved RER-023; the already
  implemented `CR-FIND-019` behavior remains a separate regression obligation.
  The user-reported Electron
  launch/shell/default defects are resolved at the design boundary by
  AD-REV-013 under approved RER-024. Return
  another `Design Impact` if a non-quiescent execution cannot be detected without
  waiting at the task FIFO head, if idle/status events cannot retry deferred
  settlement, if a root cannot freeze a stable complete scope before task
  drain, or if any accepted/provider-start-pending input can start provider work
  after its AgentRun root-shutdown fence completes. Also return
  `Design Impact` if implementation cannot realize the
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
  focus semantics; address/handoff/task ownership; frontend stores/routes;
  AgentOrg launch-draft projection/shared Team presentation, canonical sparse
  patch serialization, route-stable mixed Workspace/history ownership, and
  root workspace default selection; and
  the shared task mutation/terminal-settlement/shutdown concurrency boundary.
- House test: the existing structure cannot expose coordinator-free AgentOrg
  truthfully, because normal roots are `RootTeamRun`, strict storage requires
  `rootTeam.coordinatorAddress`, configured Team recursion is legal, and mixed
  transport has no root-kind discriminator. Conversely, it already consumes a
  flat Team correctly and must not be rewritten.
- Target-versus-delta result: the separate AgentOrg root/runtime/store, preserved
  Team V2 family, mixed projections, fixed-depth conversion of only the
  organization-like cohort, recursive configured-Team removal, and approved UI
  are in this round. AD-REV-009/010 also correct idle-gated terminal-task settlement,
  interrupt-before-drain root shutdown, and the pre-turn-start Agent input fence
  while preserving the approved task states, records,
  tools, and outcomes. AD-REV-012 is the bounded frontend-only delta: it reuses
  the accepted Team launch presentation beneath an Org-owned draft/projector and
  unchanged Org command. AD-REV-013 remains within that approved behavior: it
  aligns client preview with server resolution, keeps the left Workspace shell
  stable across route changes, and applies the existing Team root workspace
  policy to Org roots. Dynamic membership, cross-run routing, shared Agent
  instances, and new product-visible task semantics are not.

## Architecture Investigation Evidence

| Source / Command / Probe | Exact Path / Reference | Observation | Design Decision Supported | Remaining Uncertainty |
| --- | --- | --- | --- | --- |
| Approved requirements package | `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md` | `RER-024@d881d815a` is Approved Architecture-Ready. It preserves RER-023 and adds `BEH-013`-`BEH-015`, `REQ-030`-`REQ-032`, `AC-025`-`AC-027`, and `SCN-014`-`SCN-016`: exact effective-config equality, a unified route-stable Workspace/history surface with `Agent Orgs` directly below `Teams`, and fresh-Org Temp Workspace default parity. | Correct the three production-path defects without changing AgentOrg/AgentTeam domain, APIs, persistence, lifecycle, focus, or existing Product packages. | None. |
| Normative contract | `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | Exact Team Definition Config V2, Org Definition Config V1, Team run V2, Org run V1, source classes, admission diagnostics, transition, and mixed-reader rules are approved. | Treat all four logical versions/shapes and ownership/admission behavior as upstream constraints. | Internal modules and rollout mechanics remain architecture-owned. |
| Worktree verification | `git rev-parse HEAD`; `git worktree list --porcelain`; `git status --short --branch`; `git log --oneline` | Isolated task worktree at canonical `RER-024@d881d815a`; AD-REV-012 passed as ARCH-REV-010, current source `IR-026` passed CRR-032/API-REV-008, and DR-003 was awaiting user verification. Downstream-owned Delivery reports/evidence remain dirty or untracked. | Modify and commit only `design-spec.md`, `architecture-design-revision-record.md`, and `architecture-design-self-validation.md` as AD-REV-013; do not stage, reset, edit, or claim downstream artifacts. | Independent review is required before implementation resumes this correction; preserve the separate CR-FIND-019 regression obligation. |
| Current downstream baseline | `implementation-revision-record.md` (`IR-026@3199ba081`); `code-review-report.md` / `code-review-revision-record.md` (`CRR-032`, `CRR-033`); `api-e2e-execution-coverage-report.md` / `api-e2e-revision-record.md` (`API-REV-008`); `delivery-revision-record.md` (`DR-003`) | The cumulative pre-RER-024 source and system package passed, and Delivery produced the Electron build for explicit user verification. The user's normal launch journey then exposed the three current defects; these are new evidence over that pass, not permission to reopen unrelated validated behavior. | Preserve unaffected IR-026/API-REV-008 behavior and constrain AD-REV-013 to the canonical launch patch, unified history owner, and root workspace default; require renewed focused plus cumulative regression evidence. | No implementation or delivery completion is claimed by Architecture. |
| User Electron launch evidence | Supplied screenshots `ctx_d447ee010eb5__image.png`, `ctx_21d6681af54c__image.png`, `ctx_b956b806fc6f__image.png`, `ctx_fcf2f19f0f06__image.png`, and `ctx_02bf252bf8a2__image.png`; current delivered Electron build | Exact Agent override selects AutoByteus + DeepSeek Flash but launch fails; entering Org config replaces the populated Workspace/history shell; a new Org root and inherited mounted Team expose an empty workspace and disabled Run. The user confirms the established Team path does not behave this way. | Treat the three observations as connected architecture/implementation defects under accepted Team-equivalent launch behavior; do not require a Product supplement to prescribe component defaults or serialization. | Executable reproduction and fix validation remain downstream work. |
| Frontend effective-config versus wire serialization | `autobyteus-web/utils/teamRunConfigUtils.ts:39-45`; `components/workspace/config/MemberOverrideItem.vue:450-460`; `AgentOrgRunConfigPanel.vue:338-360`; current AgentOrg config tests | The UI's effective-config helper clears model config when runtime or model identity changes, but `MemberOverrideItem` emits no owned `llmConfig` on a changed model and the Org serializer therefore omits the field. Existing tests accept that sparse shape without comparing it to server resolution. | Add one canonical Org launch-patch mapper that preserves sparse inheritance but emits explicit `llmConfig:null` whenever runtime/model identity changes without an explicit compatible config; test client/server equivalence. | No GraphQL field is missing. |
| Server launch resolution | `autobyteus-server-ts/src/agent-collaboration/services/collaboration-launch-configuration-resolver.ts:24-37,71-100`; `agent-org-run-service.ts` complete validation | The authoritative resolver is field-wise: omitted `llmConfig` inherits, while an owned `null` clears. Thus the current Org wire patch can inherit root Codex/GPT reasoning config into an AutoByteus/DeepSeek placement even though the browser preview shows null. | Keep the server contract and validation authoritative; correct the frontend command boundary rather than adding a second server inference rule. | None after cross-boundary golden tests. |
| Route-selected left-panel ownership | `autobyteus-web/components/AppLeftPanel.vue:77-93,137-142`; pre-AgentOrg `origin/personal@5fb16658` AppLeftPanel | Current code switches from `WorkspaceAgentRunsTreePanel` to `AgentOrgRunHistoryPanel` solely when `/workspace?rootSubjectKind=agent_org`; the accepted earlier shell always mounted the Workspace tree. Route transition therefore swaps state owners and visual/history surfaces. | Keep one route-stable Workspace/history component and one tagged mixed read model; integrate Org roots into it and delegate root-specific actions through typed ports. Remove the route-selected competing panel. | Exact row extraction is implementation detail within the prescribed boundary. |
| Root workspace-default divergence | `AgentOrgRunConfigPanel.vue:25-31`; `TeamScopeConfigEditor.vue:49-68`; `WorkspaceSelector.vue`; current root/mounted-Team config flow | Team root explicitly enables `auto-select-default`; Org root explicitly disables it. Mounted Team scope correctly avoids an independent default, but with an empty Org root it inherits nothing and the run is blocked. | Apply the established default-selection policy once at the AgentOrg root. Mounted Team and Agent rows project root inheritance unless their exact scope owns a workspace override. | No API or persistence change. |
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
| Code Review re-entry | `code-review-report.md`; `code-review-revision-record.md`; `CRR-013` | IR-012 passes cumulative source review, CR-FIND-012/013/014 are resolved, and API-FIND-008 / CR-CAND-020 is held without speculative implementation attribution. | Preserve the source-pass baseline, classify only supported reachability at Architecture, and require review before task-lifecycle source changes. | None after AD-REV-009; implementation reconciliation and renewed validation remain required. |
| API-FIND-008 clean control | `api-e2e-evidence/API-REV-002/followup-api-find008/correlated-rerun-observed-boundaries.md` | One isolated request-revision/resubmission crosses provider, MCP, root queue, durability, publication, notification, and provider result in 14 ms; direct application-owned shutdown exits 0. | Preserve the supported task states/tool results and reject timeout/replay machinery; the defect requires concurrent terminal settlement, not ordinary resubmission. | None. |
| API-FIND-008 exact reproduction | `api-e2e-evidence/API-REV-002/followup-api-find008-settlement/settlement-correlation-observed-boundaries.md`; `boundary-evidence-assertions.log`; `run3-*-excerpt.jsonl` | Accepted verifier settlement becomes FIFO head and `prepareTerminationOnce` waits on a live provider turn; an unrelated analyst command queues and SIGTERM cannot complete. The retained long wait, however, was induced by an unsupported verifier self-review approval. | Use this only as technical evidence for the queue/termination coupling. It does not establish supported behavior and does not justify a coordinator, replay, timeout, or new persisted state. | Supported reachability is established separately below. |
| Architecture Review round 6 | `design-review-report.md`; `architecture-review-revision-record.md`; `ARCH-REV-006@2ad4bcc06` | AR-FIND-003 blocks AD-REV-008 because VAL-026/027 treated the unsupported self-review wait as a supported BEH-009 trigger. AR-PREM-004/005 are Unclear; no Requirement or Product gap exists. | Reclassify the invalid run, establish independent supported paths, and remove disproportionate AD-REV-008 machinery before another review. | None after AD-REV-009 evidence and scope reconciliation. |
| Supported submit/accept overlap | Verifier trace `api-e2e-evidence/API-REV-002/live/server-data/memory/agent_teams/aorg_e2e_research_squad_406e38c2bf72449ea5685e1489282463/aorg_e2e_verifier_e8de47b91a8243b2ab2ecea5c39552f6/raw_traces_active.jsonl`; delegator trace in sibling `aorg_e2e_lead_ba085468b828408abb166692912680fc/raw_traces_active.jsonl`; `codex-thread-event-name.ts`; `agent-run.ts`; `root-task-lifecycle-engine.ts` | The supported assignee `submit_task_result` returned at `1788292703.598`; the different authorized delegator received the notification and accepted at `1788292706.652`; the assignee's same canonical turn had not terminated. Source confirms local MCP tool completion and canonical `turn/completed` are distinct, and submission commits/notifies before returning. Events after `1788292709.932` are unsupported self-review and are excluded. | A terminal settlement attempt may validly overlap the assignee's normal final provider-turn interval. It must perform a non-waiting quiescence check and defer/retry on the existing idle event; unrelated root task commands remain runnable. | Deterministic controlled-backend coverage is required; no invalid tool call may be used. |
| Supported approval-wait shutdown | Product `ui-ux-spec.md` (`Auto approve tools`); `server-runtime.ts`; `general-process-run-supervisor.ts`; `root-task-lifecycle-engine.ts`; `root-team-run.ts`; `agent-org-run.ts`; `agent-run.ts`; `agent-run-input-admission-state.ts`; `node_modules/autobyteus-ts/tests/integration/agent/runtime/agent-runtime.test.ts` approval-interrupt case | A supported task Agent may wait on a legitimate approval-gated tool when auto-approve is off. Application SIGTERM is a supported operational trigger. Agent input remains non-quiescent until canonical completion/interruption; the accepted runtime test proves interrupt terminalizes pending approval. Current Org shutdown invokes task settlement before Agent/Team interruption, and Team awaits an initial task drain before its interrupt phase. | Both root subjects must close/freeze and interrupt the exact owned scope before task drain/settlement. Shutdown-created interrupted task records then settle through the existing transaction after AgentRuns are quiescent. | Exact Team and Org phase-order tests plus one real application-handler shutdown are required. |
| Current task/shutdown source | `agent-collaboration/execution/task/root-task-lifecycle-engine.ts`; `root-task-lifecycle-command-queue.ts`; Team/Org task adapters; task Agent/Team registries; `root-team-run.ts`; `agent-org-run.ts`; `agent-run.ts` | `settleAtHead` awaits adapter settlement; registries call `prepareTermination()` before proving provider/input quiescence; AgentRun preparation waits unresolved input. The existing idle events already reschedule terminal sweeps. Team and Org roots already own the exact scope needed to interrupt before task drain. | Add one non-waiting AgentRun/local-execution `tryPrepareTerminationIfQuiescent` boundary, defer settlement when it returns null, retain the existing prepared settlement/one FIFO/deepest-first sweep, and reorder root shutdown to interrupt before task drain. | None after the target contract below. |
| Architecture Review round 7 | `design-review-report.md`; `architecture-review-revision-record.md`; `ARCH-REV-007@6cec1ee1b` | AR-FIND-003 is resolved and AD-REV-009's one-FIFO prepared-or-null direction is proportionate. AR-FIND-004 identifies one supported shutdown race: normal task `releaseWork()` may admit or begin provider input before canonical `TURN_STARTED`; active-turn-only interruption then accepts `NO_ACTIVE_TURN` and can finish before that provider start. | Preserve AD-REV-009 and add one bounded AgentRun-owned root-shutdown fence covering reserved/committed/queued/claimed/provider-start-pending input plus active turns. | None after AD-REV-010; independent review and executable validation remain required. |
| AgentRun admission/dispatch race source | `agent-execution/domain/agent-run.ts`; `input/agent-run-input-admission-state.ts`; `input/agent-run-input-contract.ts`; `configured-agent-execution-handle.ts`; `flat-team-agent-execution-handle.ts`; `frozen-team-run-termination-scope.ts` | `postUserMessage` claims under `dispatchQueue` but calls `startInputDispatch` after the queue closure; `interrupt` rejects `activeTurn=NONE`; the root wrapper maps that result to success. Admission already defines `cancelled / AGENT_RUN_TERMINATED_BEFORE_INPUT_FORWARD`, but the state owner never emits it. | Serialize claim-to-provider-start registration with the shutdown fence, use the existing cancellation lifecycle for pre-forward entries, arm interrupt intent for provider-started/pre-`TURN_STARTED` input, and keep the phase open until terminal. | No public/durable contract uncertainty. |
| Root scope stability source | Team `root-team-run-materialization-gate.ts`, `flat-team-execution-manager.ts`, task Agent/Team registries; Org root-Agent registry, Team directory, task adapter and `agent-org-run.ts` | Team's root operation gate already tracks admitted operations and frozen local scope already captures active/prepared Agent handles plus recursive task Teams. Org owns the equivalent direct-Agent/mounted-Team/task registries but currently has no composed frozen termination scope. | Close and drain only the admitted operation/materialization publication gate needed to establish a stable handle set; then compose direct Org handles and every mounted/task Team frozen scope and invoke the per-Agent fence before general task drain. | Implementation must not drain terminal settlement before this phase. |
| Origin/personal shutdown history | `git show origin/personal@773bce779:.../agent-run.ts`; same root/registry files; AgentRun test `drains claimed and queued inputs in FIFO order before provider termination`; commits `1e7837929` and `f7d65ad75` | Origin/personal has the same claim-then-start gap and active-turn-only root interruption. Its normal termination intentionally drains admitted FIFO input, and its Stop Team regression began with an already-active approval wait. Root tests mocked interruption and never placed a barrier between input admission/provider dispatch and `TURN_STARTED`. | Treat AR-FIND-004 as a latent shared AgentRun/root-shutdown gap, not an AgentOrg-specific regression. Add a distinct irreversible root-shutdown fence while preserving ordinary prepared-termination drain semantics. | None; this historical explanation is evidence, not a requirement change. |
| Architecture Review round 8 | `design-review-report.md`; `architecture-review-revision-record.md`; `ARCH-REV-008@a6f712265` | AR-FIND-004 is resolved and the AD-REV-009/010 core design passes, but AR-FIND-005 identifies one stale VAL-006 sentence that still prescribes withdrawn AD-REV-008 cleanup jobs/concurrent work outside the root FIFO. | Correct only VAL-006 to deepest-first leaf eligibility through the existing FIFO, prepared-or-null quiescence, idle-event retry, and parent eligibility after settled children; retain all core design boundaries. | None after AD-REV-011; another independent review is required. |
| Architecture self-validation | `tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md` | Thirty-three cases preserve the prior runtime/config checks and add SCN-014-016 walkthroughs for canonical effective-config equality, route-stable unified history, and root workspace default/inheritance. | Make this a retained AD-REV-013 review input and implementation checklist, not executable-test evidence. | Revised downstream code/browser/API/E2E validation remains required. |
| Code Review CR-FIND-020 | `code-review-report.md`; `code-review-revision-record.md`; `CRR-021`; current `AgentOrgRunConfigPanel.vue` and `AgentOrgPlacementOverrideRow.vue` | The production Org panel follows the old VIS-015 interaction: opening the outer section exposes every mounted Team's Agent children, Team inherited state is implicit, and one component fabricates an Agent-shaped form node even for a Team row. The user selected full AgentTeam launch-hierarchy parity, not a badge-only patch. | Treat this as approved Product/design impact, remove the bespoke Team branch, and reuse the established Team scope/tree/editor presentation contract behind an Org-specific projector and command adapter. | None after RER-023 and the focused design below. |
| Accepted Team launch implementation | `origin/personal@5fb16658e`; current `TeamRunConfigForm.vue`, `TeamMemberConfigTree.vue`, `TeamScopeConfigEditor.vue`, `MemberOverrideItem.vue`; `git diff origin/personal -- <four paths>` | The four current production components are byte-identical to origin/personal and already own outer progressive disclosure, independently collapsed Team scope rows, explicit inherited/customized state, coordinator-on-Agent identity, Team fields, Agent fields, draft-preserving `v-show`, keyboard semantics and narrow-safe layout. | Reuse these components directly; do not create a second Org-specific Team editor or duplicate the styling/state policy. Keep Team and Org state/projectors separate above the view-model boundary. | The compact outer disclosure markup is still embedded in TeamRunConfigForm; extract only that small stateless/shared disclosure shell if needed to guarantee parity. |
| Approved override Product package | `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-TEAM-OVERRIDES-001/ui-ux-spec.md`; `user-decision-record.md`; manifest; `VIS-OVR-001`-`VIS-OVR-006` | User-approved states cover initial outer collapse, outer-open/all-Teams-collapsed, one inherited Team expanded, Team customization retained after collapse/reopen, exact-Agent customization, and `390x844`; Product explicitly preserves direct Agent behavior and all runtime/domain boundaries. | Use the reference set as the visible/browser authority and keep prototype local state/services non-authoritative. | None. |
| Current Org draft and launch API | `agentOrgRunConfigStore.ts`; `agentOrgRunStore.ts`; `agent-org-run.ts`; `agent-org-run-service.ts`; `collaboration-launch-configuration-resolver.ts` | The server/API already accepts separate sparse Team and Agent placement patches, including `workspaceRootPath`, and authoritatively resolves root -> Team -> Agent. The web store currently collapses Team/Agent patches into one `AgentConfigOverride` map and its serializer omits Team workspace, even though the accepted Team scope editor exposes it. | Split the web draft into exact `teamOverrides` and `agentOverrides`; map Team workspace selection to the existing placement `workspaceRootPath`; do not change GraphQL/server types or resolution. | Implementation must verify current runtime/model-catalog and workspace operation adapters used by Team editing can be supplied without importing `teamRunConfigStore` into the Org owner. |
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
| Requirements baseline promotion | `requirements-doc.md`; `requirements-revision-record.md`; `RER-019@f3035a2d5` | RER-019 records Product baseline activation only; BEH/REQ/AC/SCN and RV-012 behavior are unchanged. | Synchronize current authority to RER-019 without reopening prior durable/runtime decisions. | None. |
| Approved active-workspace visuals | Product `ui-ux-spec.md`; VIS-016, VIS-017, VIS-018; baseline supplements VIS-PROMOTE-002/003/004 | The approved Org has a prompt-only unfocused center; direct Agent focus is the accepted Agent header/conversation/composer; Team focus is the accepted Team-member header/conversation/composer. There is no custom dashboard or focused-member `Stop Org` button. | Reuse concrete accepted Agent/Team surfaces through an Org focus adapter; root stop remains outside member header. | Header action commands must use subject ports while preserving visible accepted chrome. |
| API/E2E real-browser Design Impact | `api-e2e-coverage-investigation.md`; `api-e2e-evidence/API-REV-001/screenshots/02-org-active-unfocused-desktop.png`; `03-org-live-raw-events-defect.png`; user VNC image `ctx_f8a08ac8c866__image.png` | Real imported definition/full stack/Codex launch and exact focus passed, but a real prompt rendered large raw AGENT RUN JSON and bespoke MEMBER INPUT cards; source fallback is `JSON.stringify(item.event)`. | Classify `ADI-007` as a presentation-contract/ownership defect and revise transport, browser state, component reuse, command parity and stop placement before testing resumes. | No Requirement/Product gap; executable validation must resume only after revised design review and implementation. |
| Defective Org workspace source | `autobyteus-web/components/workspace/org/AgentOrgWorkspaceView.vue`; `stores/rootExecutionViewStore.ts`; `services/rootExecution/rootExecutionViewState.ts`; `@autobyteus/collaboration-stream-contracts/root-execution-view-dtos.ts` | One component owns header/raw events/composer/termination; store retains opaque events; live DTO uses `z.unknown`; client supports only SEND_MESSAGE. | Remove the parallel presentation path; strict typed event union, Org execution context, interaction port and thin focus adapter are required. | None. |
| Accepted Team/Agent production presentation | `AgentWorkspaceView.vue`; `TeamWorkspaceView.vue`; `AgentTeamEventMonitor.vue`; `AgentEventMonitor.vue`; `AgentUserInputForm.vue`; `activeContextStore.ts`; `TeamStreamingService.ts`; `teamExecutionViewState.ts` | Mature path projects typed Team Agent messages into `AgentContext`, uses shared conversation/trace/composer, handles local submission, interrupt/tool approval, and supplies accepted headers/right tools. | Extract prop/port-driven surfaces and generalize the active-target facade; do not copy markup or register mounted Teams as standalone roots. | Team store dependencies inside accepted components must be removed from the reusable presentation core. |
| Accepted root termination evidence | `WorkspaceHistoryWorkspaceSection.vue`; `TeamMembersPanel.vue`; current `AgentOrgRunHistoryPanel.vue`; VIS-017/018 | Root lifecycle actions belong on root history rows; focused members and mounted Teams are not lifecycle owners. The Org root action currently lives inside the competing Org-only panel. | Move the already-correct Org root action with its row into the unified Workspace section through a typed subject action port; keep member/mounted-Team actions absent. | None. |
| Focused mounted-Team status authority | `requirements-doc.md` / `requirements-revision-record.md` at `RER-021@ed236a63e`; Product `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-STATUS-001/ui-ux-spec.md`, manifest, approval record, VIS-STATUS-001-003 | The user-approved correction requires one exact-branch five-state Team aggregate, visible collapsed and accessible, over configured plus task-scoped descendant Agent statuses; it explicitly adds no Team-root persistence, transport field, lifecycle, polling, focus, routing or command behavior. Product fixture status mixtures are illustrative. | Implement a browser-only branch projection over existing AgentOrg topology and AgentContext status truth; preserve every negative lifecycle/contract boundary and validate expanded, collapsed and stopped/history states. | None. |
| API/E2E and source-review origin evidence | `api-e2e-coverage-investigation.md`; current `ORG-005-direct-agent-conversation.png`; user image `ctx_8cd213e66142__image.png`; `code-review-report.md` `CRR-009` / `CR-FIND-011` | Current Org Team rows render disclosure/icon/name without Team status while the origin Team hierarchy has a Team aggregate beside individual Agent signals. Code Review correctly held source work until Product/Requirements authority existed. | Treat this round as upstream impact recovery; do not alter unrelated implementation/API findings or claim runtime validation. | Downstream API/E2E must revalidate after reviewed implementation. |
| Original-personal five-state Team aggregate policy | `git show origin/personal:autobyteus-web/components/workspace/history/workspaceHistoryNestedTeamStatus.ts`; the corresponding `NestedTeamAggregateStatusDot.vue` and `WorkspaceTeamExecutionTree.vue` at `origin/personal@773bce779`; current task-branch equivalents; focused tests; `StatusDot.vue` / `workspaceStatusDotPresentation.ts` | Direct inspection confirms the user's similarity assessment: original-personal already normalizes unknown/missing to offline, folds `running > initializing > error > idle > offline`, scans every deeper descendant row before the Team branch ends (including task Agents), isolates sibling branches, computes from complete execution rows rather than `visibleRows`, exposes `Team status: <State>`, and uses the established dot grammar. The current task branch retains the same implementation. | Preserve that behavior and algorithmic ownership: extract only the tight pure fold/normalizer and reuse one Team aggregate dot; add an AgentOrg-shaped exact branch/status adapter because its strict tree is not the old flat history-row array. Keep Team-history and AgentOrg traversal adapters subject-shaped rather than forcing dissimilar DTOs into a generic hierarchy. | Existing names are configured-nesting-oriented and should be neutralized without a compatibility wrapper; do not copy the original fold into the Org component or reintroduce configured Team nesting. |
| Current AgentOrg status/topology projection | `autobyteus-web/services/agentOrgExecution/agentOrgExecutionContext.ts`; `agentOrgContextHydration.ts`; `stores/agentOrgContextsStore.ts`; `autobyteus-collaboration-stream-contracts/src/agent-org-execution-dtos.ts`; `root-execution-view-dtos.ts` | One strict active Org context already indexes every configured/live task Agent and owns reactive `AgentContext.state.currentStatus`; strict snapshots require exact status correlation for live AgentRuns. Historical Org history carries topology but no durable per-Agent status field, and missing status is approved as offline. | Derive active Team status only when `run.is_active`, the exact context is active, and stream phase is `live`; otherwise use the existing terminal/history status projection when present, normalize live-only/missing/unknown to offline, and add no query/field/polling. | None; illustrative historical error/idle fixtures do not require new production persistence. |
| Current AgentOrg hierarchy component | `autobyteus-web/components/workspace/history/AgentOrgRunHistoryPanel.vue`; focused component test | Team rows omit the aggregate; Agent rows hard-code green; child rows are materialized only when expanded. Computing from visible rows would therefore lose collapsed truth and could include/exclude the wrong branch. | Project each configured Team from its immutable Team node plus exact per-Agent source before visibility filtering; render the dot between disclosure and Team icon; make configured Agent dots use the same truthful source; keep expansion/focus/lifecycle separate. | Task-row visual cleanup is limited to supplying existing exact status presentation where already represented; no new task interaction is authorized. |
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
handoff ordering, and the approved separate Team/Org frontend journeys. For
an active AgentOrg, reuse the existing Agent conversation/event-monitor and Team
member workspace presentation through a strict Org focus adapter; do not create
an Org runtime dashboard, raw event cards, custom composer, or member-header root
lifecycle action. Add one presentation-only status projection to every direct mounted
Team row: traverse only that configured Team's configured and task-scoped Agent
identities, resolve their already-projected statuses under an explicit live or
historical authority, fold them through the shared five-state precedence, and
render the existing accessible Team status-dot grammar independently of
expansion. This creates no Team root state or API.

Preserve the existing task submission/review states, one root task FIFO,
prepared-settlement transaction, idle-event retry, and durable records. Before
settlement waits on termination, atomically test whether the exact task execution
is already quiescent; an active turn yields immediate deferral and FIFO release.
Root shutdown freezes and interrupts the complete owned execution scope before
it drains task commands/settlements. “Interrupts” means an AgentRun-owned
root-shutdown fence, not a one-shot active-turn query: admission closes,
pre-forward input is cancelled through the existing lifecycle, any provider
start that already won serialization stays tracked, and a pre-`TURN_STARTED`
start is interrupted as soon as its canonical turn becomes visible. The fence
does not resolve while provider work can still start after it. No coordinator,
token lifecycle, timeout, replay, new persisted `settling` state, task-recovery
path, or user-visible task contract is added.

### AD-REV-002 Product, Runtime, And Durable Impact Decision

| Impact ID | Approved Evidence | AD-REV-001 / Earlier Draft Position | AD-REV-002 Decision |
| --- | --- | --- | --- |
| ADI-001 | REQ-004, REQ-024, SCN-002, SCN-009, VIS-014-VIS-018 | Org launch accepted `entryAddress` and yielded a focused Agent. | Remove entry selection/input/result. Resolve full effective configuration, activate every mounted execution, return Org run identity, and initialize Org focus to `null`. |
| ADI-002 | REQ-024, AC-019, VIS-014, formerly VIS-015, VIS-020 | Configuration precedence had no single owner. | Add server-authoritative `CollaborationLaunchConfigurationResolver`: Org root -> Team placement -> exact Agent; root -> exact Agent for direct Org Agents/standalone Teams. Definitions stay immutable. RER-023 replaces only the presentation hierarchy, not this precedence owner. |
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

### AD-REV-006 Accepted Running-Workspace And Typed Presentation Recovery

Architecture impact ID: `ADI-007`, triggered by API/E2E real-browser scenario
`API-E2E-005` after `CRR-003` Pass. It is an architecture-owned boundary defect,
not a Requirement Gap: REQ-004/016/019/025, SCN-007/009, Product RV-012, and
VIS-016-VIS-018 already require exact member focus to reuse the accepted Agent
or Team workspace and explicitly reject a custom AgentOrg runtime dashboard.
RER-019 only promotes that already-approved experience to the Product baseline.

| Impact Surface | Observed Invalid Implementation / Missing Prior Design | AD-REV-006 Decision | Preserved Authority |
| --- | --- | --- | --- |
| Live Agent event projection | `AgentOrgRunEvent` carried raw `CollaborationAgentExecutionEvent`; `RootExecutionEventDto.event` was `unknown`; the web retained the envelope and rendered a `JSON.stringify` fallback. AD-REV-005 named a tagged stream but did not map it to the mature Agent presentation protocol. | Move the existing Team Agent-event admission logic into one root-neutral `CollaborationAgentPresentationAdapter`. Team and Org callbacks convert raw AgentRun/member-input/status/readiness events before publication. The Org wire branch is a strict discriminated presentation-event union; unsupported events are rejected and trigger stream recovery, never UI fallback rendering. | AgentRun remains runtime-event owner; Team and Org remain subject publishers; Team-only serialized messages remain wire compatible. |
| Browser execution read model | `RootExecutionViewState` owned an array of opaque root events rather than per-Agent conversation/status/tool state. | Add `AgentOrgExecutionViewState` and `AgentOrgExecutionContext`: strict tree/tasks/messages/status snapshot plus exact `agentRunId -> AgentContext` map and nullable focus. Apply typed Agent presentation messages through the existing `dispatchAgentStreamMessage` handlers. Root topology and Agent presentation state have one Org context authority. | Org V1 remains durable topology authority; `AgentContext` remains accepted browser conversation/presentation state. |
| Workspace component boundary | `AgentOrgWorkspaceView.vue` implemented a second header, event list, empty state, textarea and send button. Prior VIS mapping stopped at `RootExecutionViewStore`/focus and did not name reusable production components. | Extract prop/port-driven `AgentWorkspaceSurface` and `TeamWorkspaceSurface` from the accepted `AgentWorkspaceView`, `TeamWorkspaceView`, `AgentTeamEventMonitor`, and `AgentEventMonitor`. Existing standalone wrappers adapt their stores. `AgentOrgWorkspaceView` becomes only a three-branch focus adapter: no focus -> approved prompt; direct Agent -> Agent surface; mounted Team/Team Agent -> Team surface. It owns no event rendering, composer, or lifecycle action. | Accepted shell/header/conversation/composer/Team presentation in VIS-017/018; subject route and focus remain Org-owned. |
| Input and command parity | Org used a direct one-off `SEND_MESSAGE`; accepted composer/tool cards require context attachments, local submission, interrupt, and approval/denial commands. | Generalize `useActiveContextStore` behind an exact tagged `ActiveAgentWorkspaceTarget` plus `AgentInteractionPort`. Standalone Agent, standalone Team member, direct Org Agent, and mounted Org Team member provide subject adapters. Extend the strict Org client command union and acknowledgements for send, interrupt, approve, and deny; the server invokes the already-existing exact `AgentOrgRun.executeAgentCommand`. | Recipient and root validation remain subject-owned; UI components depend only on the active-target boundary, never on Org/Team managers or sockets. |
| Hydration and trace browse | The Org surface had no equivalent of Team member projection/hydration or active-trace browse. | Add Org-member run projection and active-trace queries keyed by `{orgRunId, memberAddress, agentRunId}` and backed by the strict Org execution location service. Org context hydration builds every configured/live AgentContext, starts focus `null`, hydrates current projection best-effort, and uses checkpointed replacement after a sequence gap. Add an `agentOrgMember` browse-subject branch to the existing event-monitor service. | Agent memory remains physically Org-owned; history is read from the run snapshot/location, never current definition or a synthetic Team root. |
| Contextual Team/right-tool surfaces | Existing right tabs and Team overview infer only global standalone selection; registering a mounted Team as standalone would create false authority. | Introduce a read-only `TeamWorkspaceContextView` port. Standalone `AgentTeamContext` and an Org-mounted-Team adapter implement it. Right tabs, Team overview, files/activity/token/artifact surfaces resolve from `ActiveAgentWorkspaceTarget`, so Team focus exposes accepted Team UI without registering in `AgentTeamContextsStore` or writing a Team package. Org token/history queries remain Org-tagged. | Mounted Team runtime ownership remains AgentOrg; Team presentation reuse does not create a Team root. |
| Headers and root stop | The bespoke focused-member header showed Org internals and placed `Stop Org` beside the member. Product images show the accepted member header/actions; established Team root termination is a root-level history action (and the separate Team members panel uses its existing confirmation). | Reuse the accepted member header and `WorkspaceHeaderActions` through subject action ports. Remove `Stop Org` from the member header. Put active Org termination on the AgentOrg history root-run row using the same stop-icon/pending/error interaction as the existing active Team history row. A mounted Team has no independent terminate action. Do not change the standalone Team panel confirmation behavior. | Root lifecycle remains AgentOrg-owned; member focus never masquerades as root ownership; no unrelated Team behavior change. |

This correction does not change Org launch, focus semantics, durable schemas,
memory paths, migration, handoff order, or accepted Product layout. It makes the
previous abstract “workspace projection” statement constructible and removes the
invalid parallel runtime presentation path.

### AD-REV-007 Mounted-Team Aggregate Status Projection Recovery

Architecture impact: `API-FIND-007` / `CR-FIND-011`, now closed upstream by
approved `RER-021` and the user-approved focused Product supplement
`AORG-FLAT-TEAM-STATUS-001`. The focused delta is presentation-only and reuses
existing status truth. It does not reopen AD-REV-005/006 execution or transport
architecture.

| Concern | Current Production Evidence | AD-REV-007 Decision | Explicit Non-Effect |
| --- | --- | --- | --- |
| Exact Team branch membership | `AgentOrgRunHistoryPanel.rowsFor` hides Team descendants when collapsed, while the strict Org tree retains configured members and recursive task executions under each direct configured Team. | `projectAgentOrgTeamBranchStatus` receives the exact configured Team node, recursively enumerates only its configured Agent members and every task-scoped Agent below `team.taskExecutions`, and ignores Team containers. Enumeration happens before/independently of visible-row filtering. | Direct Org Agents, root-owned tasks, ancestor/sibling Teams and outside rows never contribute. |
| Status authority | Active `AgentOrgExecutionContext` already owns correlated reactive `AgentContext.state.currentStatus` for all live configured/task Agents. Stopped history exposes topology without a new durable status record. | A source adapter is live only when the history row is active and the exact Org context is active in `phase === "live"`. Live reads use `agentRunId` from that context. Historical/terminal reads use only an already-available terminal status projection; missing/unknown is offline and running/initializing without live authority is normalized to offline. | No polling, GraphQL addition, WebSocket field, persisted Team status, cache sidecar or definition lookup. Product fixture mixtures are illustrative; the current missing historical source truthfully yields offline. |
| Five-state policy | `workspaceHistoryNestedTeamStatus.ts` already implements the approved precedence and branch isolation. | Extract one root-neutral pure `foldTeamAggregateStatus(statuses, authority)` concern. It normalizes values and folds `running > initializing > error > idle > offline`; empty/missing/unknown is offline. Team-history and AgentOrg adapters own their distinct traversal shapes and call the same fold. | No generic tree DTO, no status owner, no root lifecycle state machine. |
| Visual/a11y reuse | `NestedTeamAggregateStatusDot.vue` wraps the established `StatusDot` and already exposes Team status via role/title/accessible label. `TeamActivityDot.vue` is instead a binary standalone root-activity signal. | Clean-cut rename the reusable component to `TeamAggregateStatusDot.vue` and neutralize its localization/test names; both existing Team-history use and AgentOrg use it. Place it between Team disclosure and Team icon, with the established 8px solid dot and 6px trailing space. The tree item and dot expose `Team status: <State>`. | Do not replace `TeamActivityDot`, alter root-running semantics, add badge/count/legend, or create different Org styling. |
| Exact Agent signals and reactivity | Current Org Agent rows hard-code a green circle even when the context/history source differs. | Give configured/task Agent display rows their exact `agentRunId` and render the existing `StatusDot` from the same authority adapter. A reactive Agent status mutation recomputes the Team fold; collapse changes only descendant visibility and never the aggregate input. | The Team aggregate coexists with, and never overwrites, Agent signals; it cannot change focus, readiness, routing or commands. |
| Lifecycle boundary | Mounted Teams are local executions owned by AgentOrg and have no public root lifecycle. | Keep the existing Org root stop/restore owner and all AD-REV-006 active-target boundaries unchanged. The new projection is a pure read used only by the hierarchy row. | No mounted-Team Stop/restore/archive, standalone registration, root package, status endpoint, recipient fallback or command effect. |

Target presentation contract:

```ts
type TeamStatusAuthority = "live" | "historical";

// Pure shared policy; it owns normalization and precedence, not topology.
function foldTeamAggregateStatus(
  statuses: readonly (AgentStatus | string | null | undefined)[],
  authority: TeamStatusAuthority,
): AgentStatus;

// AgentOrg-shaped traversal; it owns exact branch membership, not status state.
function projectAgentOrgTeamBranchStatus(input: Readonly<{
  team: AgentOrgConfiguredTeamNode;
  authority: TeamStatusAuthority;
  statusForAgentRunId(agentRunId: string): AgentStatus | string | null | undefined;
}>): AgentStatus;
```

For `authority="historical"`, the fold accepts `idle`, `error`, and `offline` as
terminal projections and demotes `running`/`initializing` to `offline`; no live
pulse survives loss of live authority. For `authority="live"`, all five values
participate. Branch traversal includes configured members, task Agent executions,
task-Team members, nested task-Team members, and child task executions below the
selected configured Team; it excludes the configured Team container itself and
every Org-root/sibling branch. This is task-recursion traversal only and does not
reintroduce configured Team nesting.

The focused implementation posture is `Refactor needed now — bounded`: extract
one shared pure fold and one reusable dot instead of copying precedence/a11y
policy into the Org component. Keep the Team-history row traversal and Org-tree
traversal separate because their DTOs and lifecycle authorities differ. The
focused delta alone is `Medium / Low`; the cumulative ticket remains
`Large / High`, so independent Architecture Review is still selected.

### AD-REV-008 Review Disposition And AD-REV-009 Supported-Reachability Reconciliation

Architecture impact: `API-FIND-008` / `CR-CAND-020`, reviewed as
`ARCH-REV-006` / `AR-FIND-003`. AD-REV-008 is retained as revision history but
its new settlement coordinator, passive/committed token split, independent
cleanup jobs, task dependency graph, and cleanup-outside-FIFO contract are
withdrawn. The exact long stall was mechanically real but behaviorally
unsupported because verifier self-review created the approval wait. That action
remains rejected and cannot drive current architecture.

AD-REV-009 uses two independent supported production paths:

| Supported basis | Normal production path | Current coupling | AD-REV-009 decision |
| --- | --- | --- | --- |
| Normal task submission and independent review | Task assignee calls `submit_task_result`; the root FIFO durably records `awaiting_review`, notifies the delegator, and returns the MCP tool result. The assignee's canonical provider turn completes later. The different authorized delegator may receive the notification and call `review_task_result(accept)` during that interval. | Accept schedules settlement at the same FIFO. The subject registry calls `prepareTermination()` before proving the task execution is quiescent, so the FIFO can wait for the still-open assignee turn and delay an unrelated supported command. | Add a non-waiting `tryPrepareTerminationIfQuiescent` boundary. If input/provider execution is active, return `null` without quiescing admission or waiting; the settlement entry returns `false`, releases the FIFO, and the existing Agent idle/offline event reschedules the sweep. Once quiescent, the existing prepared-settlement transaction commits `settledAt` and finishes local teardown exactly as today. |
| Application graceful shutdown while a task Agent awaits a legitimate tool decision | With Auto approve tools disabled, a supported task Agent may be in the accepted approval-wait state. Application SIGTERM enters `server-runtime` and `GeneralProcessRunSupervisor`, then the exact Team/Org root. | Org currently executes task shutdown/settlement before terminating its Teams/root Agents; Team awaits an initial task drain before freezing/interruption. The root can therefore wait on task work before issuing the Agent interrupt that makes it quiescent. | Each root closes command/message/materialization admission, freezes the complete configured/mounted/task scope, interrupts every active Agent turn, and only then drains task commands, persists shutdown-created task interruptions, runs the existing deepest-first settlement sweep, drains persistence, and finishes/unregisters local executions. |
| Exact API-FIND-008 invalid self-review run | Invalid verifier self-review was held by provider approval; accepted verifier settlement then blocked the FIFO, an analyst command, and shutdown. | It precisely exposes where current code waits, but its initiating action is unsupported. | Retain only as technical boundary evidence and a negative validation. Do not support self-review and do not add timeout, replay, force-kill, persisted `settling`, coordinator, or token lifecycle for it. |

The target normal settlement sequence is deliberately small:

```text
accepted/interrupted task record
  -> existing terminal settlement sweep
  -> root task FIFO
       -> validate terminal record + no open child
       -> tryPrepareTerminationIfQuiescent(exact task execution)
          -> null: release FIFO; existing idle/offline event retries later
          -> prepared: existing durable settledAt transaction
             -> commit tree/index/event and local prepared termination
             -> finish backend/MCP/resources
  -> existing deepest-first parent resweep
```

`tryPrepareTerminationIfQuiescent` is owned by `AgentRun` and composed by the
existing configured-Agent/task-Team local handles. It checks canonical input
admission and runtime lifecycle under the AgentRun dispatch boundary. It has two
outcomes only:

- `null`: the execution is initializing, running, waiting on a tool decision, or
  otherwise has unresolved input/turn work; it performs no state change and does
  not wait;
- `PreparedAgentRunTermination`: the execution was atomically observed
  quiescent, input admission was closed, and the existing cancel/commit
  termination contract applies.

Task-Team preparation applies the same rule recursively: if any descendant has
open execution work, preparation returns `null` without partially quiescing the
subtree. If the entire subtree is quiescent, the existing prepared local
termination and settlement commit proceed. Parent task settlement remains
blocked by open/unsettled children through the existing deepest-first policy.
No new durable data, public interface, task state, root kind, or migration is
introduced.

This focused correction is `Medium / High`: it spans the shared AgentRun/task
settlement boundary and both root shutdown sequences, but it removes rather
than adds coordination machinery. The cumulative package remains `Large / High`
and requires independent Architecture Review before implementation or API/E2E
resumes.

### AD-REV-010 AgentRun Root-Shutdown Admission And Provider-Start Fence

Architecture impact: `ARCH-REV-007 / AR-FIND-004`, protecting the established
application graceful-shutdown contract and `BEH-009` / `REQ-015` / `AC-010`.
The supported path is ordinary `delegate_task -> durable activation ->
releaseWork -> task Agent input`, independently overlapped by application
SIGTERM. It requires no self-review, hidden-state mutation, process-group kill,
or artificial Product action.

#### Singular AgentRun boundary

Add one internal lifecycle method:

```ts
AgentRun.fenceInputAndInterruptForRootShutdown(): Promise<AgentOperationResult>
```

The method is idempotent and irreversible for that AgentRun. It is serialized
by the existing AgentRun dispatch queue and owns all of the following as one
phase:

1. latch `rootShutdownFenced` and close new input admission;
2. invalidate a never-admitted `reserved` entry without notifying an admission
   lifecycle, so its later reservation commit fails under the existing one-shot
   contract;
3. terminalize every admitted `committed`, `queued`, or claimed-but-not-started
   entry with the existing
   `{kind:"cancelled", code:"AGENT_RUN_TERMINATED_BEFORE_INPUT_FORWARD"}` fact;
4. coordinate the single input dispatch slot and canonical turn lifecycle;
5. reserve and execute the existing provider interrupt for an already-active
   turn or for a provider-started input immediately when its canonical
   `TURN_STARTED` arrives; and
6. resolve only after no input can still invoke the provider, every provider
   start that won serialization has reached failure/non-forwarding or canonical
   terminal interruption, the interrupt reservation has settled, and the
   AgentRun input state is quiescent.

The current gap between `claimNextInput()` and `startInputDispatch()` is removed.
Claiming creates the one local input-dispatch slot, and the transition from
`provider_start_pending` to `provider_started` is ordered by the same dispatch
queue as the shutdown fence. The backend call may run outside the queue, but it
may be invoked only after that transition wins. Therefore:

- start transition first: the fence observes a tracked provider start, arms
  shutdown interrupt intent, and awaits its terminal outcome;
- fence first: it cancels the pre-forward entry/slot, and the later start
  transition performs no backend call; or
- canonical active turn first: the fence joins/reserves the existing interrupt.

There is no fourth state in which the backend starts after the fence without a
tracked slot. The slot and shutdown latch are ephemeral AgentRun internals, not
a root task token, cleanup job, public contract, or persisted state.

| Input state when the fence wins | Required disposition | Observer / provider consequence |
| --- | --- | --- |
| `reserved` and not admitted | Remove/invalidate | No `admitted` or `cancelled` fact; later commit fails; provider is never called. |
| `committed` or `queued` | Cancel before forward | Existing `cancelled` fact exactly once; provider is never called. |
| Claimed, provider-start transition not committed | Revoke slot and cancel | Existing `cancelled` fact exactly once; queued start becomes a no-op. |
| Provider call registered/in flight, no `TURN_STARTED` yet | Keep shutdown intent armed | Do not misreport cancellation after provider side effects may have begun; failure/non-forwarding uses existing facts, while `TURN_STARTED` immediately triggers existing interrupt. |
| Forwarded/pending canonical start or active canonical turn | Interrupt and await terminal | Existing association/interrupted/error lifecycle remains authoritative. |
| No unresolved input/turn | Complete locally | No synthetic turn or event. |

Ordinary `AgentRun.prepareTermination()` remains intentionally different: away
from root shutdown it continues draining already-admitted FIFO input before
provider termination, preserving the origin/personal behavior and current unit
contract. `tryPrepareTerminationIfQuiescent()` also remains a non-mutating
`null` result for active work. Once the root-shutdown latch exists, cancellation
of a later prepared termination must not call `inputAdmissionState.reopen()`;
root-stop retry joins the same fenced state rather than reopening input.

#### Stable frozen Team and Org scopes

Before the per-Agent phase, each subject root synchronously closes external
task/message/command admission and closes the operation/materialization
publication gate. It awaits only already-admitted operations that can publish
an Agent/Team handle or commit a reserved recipient input, establishing a stable
active/prepared handle set. This prerequisite is not the general task-command or
terminal-settlement drain and cannot wait on provider quiescence.

- A standalone Team reuses its root operation gate, then
  `FlatTeamExecutionManager.freezeForRootTermination()` snapshots configured,
  task, and prepared Agent handles plus recursive task-Team scopes.
- An AgentOrg adds the equivalent private root-operation gate and one composed
  frozen Org scope: exact direct configured/task/prepared Agent handles from
  `AgentOrgRootAgentExecutionRegistry`, plus every mounted/root-task Team's
  `FrozenTeamRunTerminationScope` from `AgentOrgTeamExecutionDirectory`.
- A recursive task Team freezes its own direct/task/prepared Agents and child
  task Teams using the same Team scope contract. Mounted Teams do not gain a
  root, registry, stop action, package, or independent lifecycle.

`FrozenTeamRunTerminationScope.interruptActiveTurns()` is clean-cut replaced by
`fenceAgentRunsForRootShutdown()`. Direct configured-Agent handles expose the
same narrow forwarding method; the scope recursively invokes it for every
captured Agent. The frozen Org scope is private to `AgentOrgRun` and composes
root Agent handles with Team scopes rather than creating a generic public root.

#### Correct root sequence

```text
application SIGTERM / root stop
  -> subject root enters terminating and closes external admission
  -> close+drain admitted operation/materialization publication gate
  -> freeze exact direct/mounted/task/prepared execution scope
  -> fenceAgentRunsForRootShutdown across the full recursive scope
       -> close Agent input
       -> cancel pre-forward work OR track provider-started work
       -> interrupt canonical active/start-pending turn
       -> await terminal Agent input/turn state
  -> drain short task mutations
  -> durably interrupt remaining open task records
  -> existing deepest-first prepared-or-null settlement
  -> persistence drain
  -> finish local Team/Agent resources and unregister root
  -> process continues Org -> standalone Team -> residual Agent cleanup
```

An Agent fence error is a real root cleanup error and follows existing
Team/Org/process aggregation/fail-stop behavior; it is never converted to a
timeout, replay, force-kill, or successful `NO_ACTIVE_TURN`. A provider that has
already started but never produces either dispatch failure or canonical
lifecycle terminal may still delay graceful shutdown under the existing
provider contract; AD-REV-010 prevents false phase completion and post-phase
provider start, not an unapproved provider deadline policy.

The focused AD-REV-010 delta is `Medium / High`: it extends the existing
AgentRun input owner, root-neutral configured-Agent forwarding, recursive Team
termination scope, and the two subject root shutdown compositions. Cumulative
classification remains `Large / High`, and independent Architecture Review is
required before implementation or API/E2E resumes.

### AD-REV-012 Established AgentTeam Launch-Hierarchy Reuse

Architecture impact: `CRR-021 / CR-FIND-020` under approved `RER-023`, serving
`BEH-012`, `REQ-029`, `AC-024`, `SCN-013`, `QR-009`, and
`ORG-CASE-059`-`ORG-CASE-061`. This is an observable presentation correction,
not a new configuration architecture. The original/current AgentTeam launch
components are already the accepted owner of the relevant visual and
progressive-disclosure language; the AgentOrg form must adapt its distinct
fixed-depth draft into that presentation instead of maintaining a parallel Team
editor.

#### Tight reuse boundary

| Concern | Authoritative owner | Reuse / change | Explicit non-owner |
| --- | --- | --- | --- |
| AgentOrg root and sparse placement draft | `agentOrgRunConfigStore` | Split its current mixed `memberOverrides` record into exact `teamOverrides: Record<Address, TeamScopeConfigOverride>` and `agentOverrides: Record<Address, AgentConfigOverride>`, plus Team-scope workspace-selection/operation state needed by the accepted Team editor. | `teamRunConfigStore`; mounted Team definitions; Vue disclosure components. |
| Fixed-depth form projection | New pure `projectEditableAgentOrgRunFormModel` | Resolve the Org root baseline, direct Agent presentation nodes, mounted Team scope nodes, exact direct-Agent child nodes, exact coordinator address, and exact configurable-Agent count. It emits only view models consumed by the established components; it cannot write either store or launch a run. | GraphQL, server resolution, Team definition mutation, configured recursion. |
| Outer Member-overrides disclosure | Extract the compact accessible disclosure shell already embedded in `TeamRunConfigForm` into `MemberOverridesDisclosure` and use it from both Team and Org forms. | Own label/count, adjacent chevron, `aria-expanded`/`aria-controls`, local default-collapsed state, and visibility-preserving content slot. | Override maps, effective settings, validation, launch, member traversal. |
| Mounted Team row and editor | Existing `TeamMemberConfigTree -> TeamScopeConfigEditor` | Consume only direct mounted-Team nodes. Keep every Team's internal disclosure independently collapsed; render Team name, `TEAM`, exact address, exact Team-scope state, Team fields, reset, and Agent child slot exactly as AgentTeam launch does. An optional presentation string may supply the approved flat-Team helper copy. | Org coordinator, root lifecycle, payload serialization, nested configured Team creation. |
| Exact Agent editor | Existing `MemberOverrideItem` | Render the coordinator badge from exact Team coordinator membership and the Agent's own inherited/overridden state. Direct Org Agents keep their current compact Org placement row and behavior; that row becomes Agent-only. | Containing Team customization; Team/Org ownership. |
| Launch command | `AgentOrgRunConfigPanel` command adapter -> `agentOrgRunStore.launch` | Serialize the two exact sparse maps into the already existing `teamOverrides` and `agentOverrides` GraphQL fields. Team workspace selection maps to the existing placement `workspaceRootPath`; server `AgentOrgRunService` still canonicalizes workspaces, validates all effective configurations, and resolves root -> Team -> Agent. | Shared Team payload/store, new API, client-authoritative effective configuration. |

No generic Team/Org run-config store, payload, root form, or recursive definition
model is introduced. Reusing `EditableTeamScopeFormModel`,
`EditableTeamFormTeamNode`, `EditableTeamFormAgentNode`, and the three existing
editing components is valid because they are presentation models for a real
Team placement and its direct Agents. The Org projector may construct exactly
one Team node level from the strict admitted Org definition. A missing referenced
Team, missing coordinator/member correlation, duplicate exact address, or other
projection inconsistency is a fail-closed unavailable configuration state that
disables Run and identifies the affected address; it is never silently removed
with `flatMap`, repaired in the browser, or represented as an empty Team. Target
definition admission makes configured deeper Team shape impossible. The
AgentOrg domain and launch command remain separate above this view boundary.

#### Exact state and command rules

1. A new Org draft sets the outer disclosure closed. Opening it does not change
   any override and every Team editor retains its own default-closed state.
2. `Member overrides (N)` counts direct configured Org Agent placements plus
   every direct Agent placement in each mounted Team. Team containers do not
   increment `N`; task-scoped runtime Agents are not configuration placements.
3. Team state uses only `hasMeaningfulLaunchOverride(teamOverrides[address])`.
   Agent state uses only its exact `agentOverrides[address]`. An Agent-only edit
   therefore cannot mark its Team `Customized`.
4. The Team baseline is the current Org root draft. Each Team Agent baseline is
   that Team's effective presentation config. These previews explain current
   values, but the server remains authoritative and repeats complete resolution
   and validation before allocating/activating the run.
5. `Reset` at a Team deletes only that Team patch and Team workspace selection;
   it retains every exact Agent patch. Agent reset deletes only that Agent patch.
6. Collapse uses `v-show` or equivalently preserves the store-backed draft; it
   never destroys/recreates the draft or resets local runtime/model/workspace
   field state. Reopening projects the same exact values and state labels.
7. Coordinator identity is derived from the referenced Team's exact
   `coordinatorMemberName`/member address and appears only on that Agent row. It
   does not become an Org coordinator, Team-row action, or launch target.
8. Sibling Team disclosure state is independent. Expanding one Team neither
   expands nor rewrites another; direct Org Agent behavior remains unchanged.
9. Team workspace edits serialize through the existing GraphQL
   `AgentOrgPlacementLaunchConfigurationInput.workspaceRootPath`. No schema,
   resolver, server service, durable tree, or migration change is permitted.

The clean-cut removal is limited to the obsolete Team branch of
`AgentOrgPlacementOverrideRow`. Rename/tighten that component to
`AgentOrgDirectAgentOverrideRow` (or delete it if the existing direct-Agent
primitive can be used without changing the approved compact direct-Agent
behavior). Do not retain the old Team-row path behind a flag, compatibility
prop, or alternate layout. `TeamMemberConfigTree` is the one mounted-Team
presentation path for both desktop and narrow layouts.

The focused AD-REV-012 delta is `Medium / Low`: a small set of frontend owners
and tests changes, but exact draft typing, Team workspace serialization,
progressive disclosure, accessibility, and standalone Team regression make it
larger than a styling-only patch. It adds no backend or persistence risk. The
cumulative package remains `Large / High`, so independent Architecture Review
is still required before Implementation resumes this correction.

### AD-REV-013 AgentOrg Launch-Configuration And Unified Workspace-Shell Recovery

Architecture impact: the user's Electron findings, now governed by approved
`RER-024` (`BEH-013`-`BEH-015`, `REQ-030`-`REQ-032`, `AC-025`-`AC-027`,
`SCN-014`-`SCN-016`, `QR-010`, and `DEC-017`-`DEC-019`). The target is not a
new AgentOrg experience. It is the smallest clean correction that makes the
AgentOrg form and shell obey the established AgentTeam behavior while retaining
the separate Org domain, payload, history identity, and lifecycle.

#### Root causes and owned corrections

| Finding | Root cause / design-health classification | Owning correction | Explicit non-change |
| --- | --- | --- | --- |
| Runtime/model choice previews successfully but launch fails or differs | `Duplicated Policy Or Coordination`: the client preview clears model config on an explicit runtime/model patch, while the Org serializer omits that clear and the server correctly interprets omission as inheritance. | Complete root setter commands plus one pure, idempotent `canonicalizeAgentOrgPlacementLaunchPatch` at the Org draft/command boundary. The same root/placement states feed preview, validation, serialization, and equivalence tests. | No sparse root blob, new GraphQL field, resolved-payload API, server inference rule, or model-catalog policy. |
| Clicking AgentOrg Run replaces the left Workspaces/history tree | `Boundary Or Ownership Issue`: `AppLeftPanel` uses route kind to swap between two components and two navigation/history state owners. | One always-mounted `WorkspaceAgentRunsTreePanel` backed by one mixed tagged workspace-history projection; add `Agent Orgs` as the sibling category directly below `Teams`. | No flattening of Org roots into Teams, no mounted Team root, no history schema change, and no route-specific compatibility panel. |
| Fresh Org and inherited Team show no Workspace although Temp default exists | `Local Implementation Defect` at the root config boundary: Team root opts into the shared selector's available-default policy while Org root opts out; mounted Team correctly has no independent default. | AgentOrg root uses the same root `WorkspaceSelector` default-selection contract as Team. Team/Agent scopes receive the projected inherited root value unless an exact supported Team override exists. | No hard-coded path, definition mutation, focus, mounted-Team auto-default, or workspace persistence change. |

#### DS-024 — one effective launch configuration

The server remains the authoritative fixed-depth resolver. Its existing sparse
field semantics are retained: an omitted field inherits, while an owned
`llmConfig:null` explicitly clears model-specific configuration. The correction
is at the web command boundary because that boundary currently presents a
different meaning from the request it emits.

`canonicalizeAgentOrgPlacementLaunchPatch(patch)` applies these rules to both
Team and Agent placement patches:

1. Preserve exact owned `runtimeKind`, `llmModelIdentifier`,
   `autoExecuteTools`, workspace, and explicit `llmConfig` values.
2. If `runtimeKind` or `llmModelIdentifier` is explicitly owned and
   `llmConfig` is not owned, add `llmConfig:null`. This makes the already-shown
   reset of model-specific settings explicit rather than allowing the server to
   re-inherit a parent provider's settings.
3. If neither runtime nor model is owned and `llmConfig` is absent, keep it
   absent so ordinary inheritance remains sparse. Exact reset deletes the whole
   placement patch and therefore restores inheritance.
4. Normalize once when the Org store accepts a Team/Agent edit; serialization
   asserts or idempotently reapplies the same function. Do not maintain a raw
   patch beside a canonical patch.
5. The form projector computes its displayed effective value from these
   canonical patches and the same root -> Team -> Agent precedence. The server
   independently repeats authoritative resolution and complete validation.

The Org root is deliberately not forced into the sparse placement-patch type.
It remains one complete `AgentLaunchConfiguration`. The existing
`RuntimeModelConfigFields` behavior already emits a dependent `llmConfig:null`
when root runtime/model changes; AD-REV-013 routes those events through explicit
`agentOrgRunConfigStore.setRootRuntimeKind`, `setRootModel`, and
`setRootLlmConfig` commands rather than assigning refs in the panel. Each root
command makes the affected complete root tuple coherent before the next render,
and root launch serialization always includes `llmConfig` (including null).
Thus one invariant covers two truthful representations: complete root state and
canonical sparse placement intent. They are not collapsed into an optional-field
generic configuration blob.

Example: root `{runtimeKind: CODEX_APP_SERVER, model: gpt-5.6-sol,
llmConfig:{reasoning_effort:'low'}}` plus exact `/lead`
`{runtimeKind: AUTOBYTEUS, model: deepseek-v4-flash}` becomes the wire patch
`{runtimeKind: AUTOBYTEUS, model: deepseek-v4-flash, llmConfig:null}`. Client
preview, server resolver, validator, and persisted Agent snapshot therefore all
produce the same result. The rule applies identically to a direct Org Agent, a
mounted Team scope, and an Agent inside that Team.

The architecture requires a cross-layer fixture matrix, not duplicated
TypeScript implementations asserted only in isolation. Each fixture supplies
root/Team/Agent sparse intent and asserts: (a) browser projected effective
configuration; (b) exact GraphQL variables; (c) server resolver output; and
(d) stored run-tree placement configuration. Cover inherited, explicit config,
explicit null, runtime-only, model-only, runtime+model, Team+Agent precedence,
reset-to-inherit, incompatible-model rejection, workspace, and tool approval.

#### DS-025 — one route-stable Workspaces/history owner

`AppLeftPanel` always mounts `WorkspaceAgentRunsTreePanel`; the current
`showAgentOrgRunHistory` route predicate and the alternate
`AgentOrgRunHistoryPanel` mount are removed. Route transitions change only the
center workspace target, never the left history owner. The unified panel reads
one workspace projection with ordered sibling collections:

1. existing standalone Agent collection(s), unchanged;
2. `Teams`, unchanged standalone Team roots;
3. `Agent Orgs`, immediately below `Teams`, containing AgentOrg roots; and
4. any other already-established category in its existing relative position.

The exact presentation order is owned by the workspace-section projector, not
by the current route. Org rows reuse the passed AD-REV-006/007 hierarchy:
Org root -> direct Agents/direct mounted Teams -> Team Agents and task lineage,
including mounted-Team aggregate status. They remain tagged
`root_subject_kind:'agent_org'`. The projector must never insert an Org under
`Teams` or register a mounted Team as a Team root. The section's loading/error/
empty predicates count all three root collections; an Org-only workspace is not
rendered as empty, and the `Agent Orgs` heading remains the sibling after the
Teams position even when that workspace has no Team roots.

The one web read owner fans out through the two already-implemented queries; it
does not require a new history API. `ListWorkspaceRunHistory` remains the source
for established standalone Agent and Team workspace groups.
`ListCollaborationRootHistory` is filtered by the explicit
`root_subject_kind:'agent_org'` branch and strictly parses each Org tree before
projecting its root Workspace. A non-empty root path joins the existing
normalized-path Workspace group (or its existing history-only projection when
the catalog no longer contains it); a legacy/null root path remains visible in
one localized read-only `No Workspace` history group and is never discarded or
turned into an invented path. The query's Team branch is not re-added to the
workspace store, so standalone Teams cannot be duplicated. Refresh commits each
valid family slice atomically and preserves the prior committed slice when the
other query fails, with a family-scoped error. No JSON-shape cast, bare-ID
inference, or route input participates in this merge.

The unified history read model owns workspace grouping, row ordering, expansion,
scroll, and selected-row continuity. Subject stores retain commands only:
their already-supported actions are invoked through a discriminated
`WorkspaceHistorySubjectActions` port carrying explicit root kind and ID. Agent
and standalone-Team action sets remain unchanged. An Org root supports its
existing open/select, restore, and stop paths only; the consolidation does not
invent Org archive/delete. Org lifecycle still terminates/restores only the Org
root. The AgentOrg execution context continues to own active Org
topology/focus/stream; the unified history store consumes its public projection
and does not become a second runtime authority.

Consequently, `agentOrgRunStore.history`, `historyError`, and `fetchHistory`
are removed. Org launch/restore/terminate commands return their normal result
without mutating a parallel history cache. The launch caller and the typed
history subject-action adapter request a refresh from the unified read owner
after a successful command; active Org context/stream facts continue to overlay
live status through the existing context projection. Neither store imports the
other to perform lifecycle work.

Useful Org row/tree rendering currently inside `AgentOrgRunHistoryPanel` is
extracted into neutral workspace-section children or moved into
`WorkspaceHistoryWorkspaceSection`. The standalone panel is then deleted in the
same change. Do not retain it behind a route, flag, wrapper, or fallback. A
catalog -> config -> launch -> focus -> stopped/history route sequence must keep
the same component/store instance and existing Agent/Team/Org rows, expansion,
selection, and scroll unless the user changes them.

#### DS-026 — root workspace default and exact inheritance

The AgentOrg root uses the same existing `WorkspaceSelector` root policy as
`TeamScopeConfigEditor`'s Team root:

1. The Org config store tracks the root selection source as one of
   `untouched | defaulted | explicit`. On a fresh draft only, after the shared
   workspace catalog is available and while the source is `untouched`, select
   the actually available `Temp Workspace (Default)` record and mark it
   `defaulted`.
2. Never synthesize the label or path. If no eligible default exists or the
   catalog fails, keep the root unset, display the existing actionable error,
   and keep Run disabled.
3. Any user existing/new Workspace interaction marks the source `explicit`
   before applying its value. It wins and survives Team disclosure,
   route-preserving center transitions, catalog refresh, and validation errors.
   If its record/path later becomes unavailable, retain it with a scoped error;
   do not default over it.
4. Mounted Team and exact Agent editors do not auto-select another default.
   Their baseline projects the effective root workspace. Only a supported exact
   Team workspace patch replaces it for that Team branch; Agent workspace
   remains governed by the approved input shape.
5. Selecting a workspace changes configuration only. It never focuses a member,
   creates an Org coordinator, mutates a definition, or starts a run.

Freshness is an explicit launch-draft lifecycle, not a test that the definition
ID changed. The catalog/detail `Run` action begins a new Org draft (new draft
epoch) even when it targets the same definition as the previous completed run;
ordinary re-render, disclosure, model-catalog retry, or validation error stays in
the current epoch. A new epoch resets selection source to `untouched`, after
which the available-default rule may run once. This prevents both stale reuse and
the current store's same-definition early-return from defeating a genuinely
fresh launch.

The shared workspace store/catalog is the only source of workspace records.
The Org panel neither owns a second list nor refetches/resets the left history
tree. `WorkspaceSelector` remains a presentation/selection control; the Org
config store owns the chosen draft value and the existing launch command maps
it to `workspaceRootPath`.

#### Failure and lifecycle behavior

| Failure | Owner | Required result |
| --- | --- | --- |
| Runtime/model catalog selection is unavailable or invalid | Existing runtime/model selector plus Org config store | Retain exact draft and adjacent error; do not serialize a partial placement or launch. |
| Canonical patch and projected effective result disagree | Org launch command boundary | Fail closed before GraphQL with an invariant diagnostic; never guess or defer the disagreement to the server. |
| Server rejects the complete effective plan | Existing AgentOrgRunService | No Agent/run ID allocation or partial activation; return scoped validation and retain the browser draft. |
| Unified history query fails for one subject family | Mixed history projector/store | Keep already committed rows visible, show family-scoped refresh error, and do not replace the entire panel with another authority. |
| Org row identity/family mismatch | Mixed history projector | Reject the row; never place it under Teams or try another family reader. |
| Temp default is absent/unavailable | Shared workspace catalog + Org root draft | No invented path; root stays unset and Run stays blocked with existing error. |
| Exact Team workspace override becomes unavailable | Org config store/server validator | Preserve the exact Team patch and scoped error; do not fall back silently to root or mutate siblings. |

#### Scope, migration, and classification

AD-REV-013 affects frontend configuration and workspace/history composition
only. Existing GraphQL inputs, server resolution, Team V2/Org V1 run files,
sidecars, migration, streams, focus, task lifecycle, and root lifecycle remain
unchanged. Existing stored runs are directly usable; history indexes remain
derived and require no persisted-data migration. The obsolete alternate left
panel is source removal, not data migration.

The focused delta is `Medium / High`: implementation spans several existing web
owners and one cross-layer semantic invariant, while the mixed history owner is
a shell-wide boundary. Cumulative classification remains `Large / High`, and
independent Architecture Review is required before implementation resumes.


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

`RootTaskLifecycleEngine` remains the selector-free owner of the single task
mutation FIFO, task record lifecycle, authorization call order, notification
sequencing, terminal sweep, and exact `TaskDelegationRecordV1` bodies. The FIFO
continues to serialize activation, submit, review, interruption, and the existing
prepared settlement transaction. No second coordinator, queue, or durable state
is added.

The defect is narrowed to settlement eligibility. A settlement FIFO closure may
commit only when the exact task execution can be prepared without waiting. Its
one `TaskRootAdapter` port provides:

1. tagged root identity, open/fail-stop state, and exact member authorization;
2. same-root recipient resolution and task-source projection;
3. exact `TaskExecutionHostIdentity` plus its `TaskExecutionHostCapability`;
4. subject-specific activation/record/settlement mutations in the owning Team V2
   or Org V1 node, atomically coordinated with the matching task sidecar;
5. a non-waiting exact-execution preparation call returning the existing
   `PreparedTaskSettlement | null`;
6. root-neutral task-index queries used for ownership, review, child eligibility,
   and settlement;
7. system-message delivery and subject task-event publication; and
8. root fail-stop entry when a committed durable/publication/local-finalization
   outcome becomes indeterminate.

`TeamTaskRootAdapter` closes over `RootTeamRun` state, `TeamExecutionIndex`, Team
mutators and `TeamRunPersistenceCoordinator`. `AgentOrgTaskRootAdapter` closes
over `AgentOrgRun` state, `AgentOrgExecutionIndex`, Org mutators and
`AgentOrgRunPersistenceCoordinator`. No caller above either root aggregate may
hold an adapter or engine directly. Shared policy therefore remains root-neutral
without inventing a common stored tree.

The existing `PreparedTaskSettlement` retains its current prepare/cancel/commit
meaning. The local registry first calls
`tryPrepareTerminationIfQuiescent()` on the exact AgentRun or recursively on the
task Team. A `null` result is ordinary deferral: no input admission, registry,
tree, sidecar, or provider state changes, `settleAtHead` returns `false`, and the
FIFO releases. Existing Agent idle/offline publication invokes
`onExecutionBecameIdle()` and reschedules the terminal sweep. A prepared result
closes local admission, participates in the existing pre-durability cancellation
and post-durability commit, and finishes teardown only after the exact
`settledAt` mutation commits. The existing whole-root fail-stop remains the
post-durability failure owner.

The task tool binding stores `{identity, commands}`. It validates that
`identity.root === commands.root` and calls the bound methods; the router no
longer returns `RootTeamRun` or consults either subject manager. Unsupported
self-review remains rejected by the existing delegator authorization rule.

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

The root closes external message/task/command/materialization admission and
freezes the Org root host, direct Agent handles, mounted Teams and recursive
task descendants **before any task or settlement drain**. It interrupts every
active provider turn, then drains the task FIFO, durably interrupts remaining
open task records, runs the existing deepest-first settlement sweep now that
the scope is quiescent, and drains persistence. It next
prepares/finishes any remaining local execution handles in reverse
materialization order, unregisters the compound root directory and subject
manager entries, clears publishers, and becomes `terminated`. Existing prepared
handle termination is idempotent so root interruption and later settlement
cannot terminate one provider twice. A mounted Team never unregisters a
Team-family root because it was never registered as one.

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

### AgentOrg Running-Workspace Projection And Reuse Contract (AD-REV-006)

#### Tight transport and presentation shapes

The shared element is an Agent presentation **message body**, not a Team/Org
root envelope. A small new workspace package
`@autobyteus/agent-presentation-contracts` owns strict Agent conversation,
status, tool, activity, artifact/file, member-input, external-input, error, and
token detail schemas without a root identifier or change sequence. Both subject
stream packages compose those schemas:

```ts
type AgentPresentationMessage =
  | { type: "SEGMENT_START"; payload: SegmentStartDetails }
  | { type: "SEGMENT_CONTENT"; payload: SegmentContentDetails }
  | { type: "SEGMENT_END"; payload: SegmentEndDetails }
  | { type: "MEMBER_INPUT_MESSAGE"; payload: MemberInputDetails }
  | { type: "AGENT_STATUS"; payload: AgentStatusDetails }
  | { type: "TOOL_APPROVAL_REQUESTED"; payload: ToolApprovalDetails }
  | { type: "TOKEN_USAGE_UPDATED"; payload: TokenUsageDetails }
  | /* every currently supported accepted Agent monitor message */
    { type: "ERROR"; payload: AgentPresentationErrorDetails };

type AgentOrgExecutionEventDto =
  | Readonly<{
      kind: "agent_presentation";
      member_address: AgentTeamAddress;
      agent_run_id: string;
      message: AgentPresentationMessage;
    }>
  | Readonly<{ kind: "task"; event: AgentOrgTaskEventDto }>
  | Readonly<{ kind: "communication"; message: AgentOrgCommunicationMessageDto }>;

type AgentOrgRootExecutionEventDto = Readonly<{
  root_subject_kind: "agent_org";
  root_run_id: string;
  change_sequence: number;
  event: AgentOrgExecutionEventDto;
}>;
```

- `CollaborationAgentPresentationAdapter` accepts the internal
  `CollaborationAgentExecutionEvent` plus exact tagged member identity, validates
  raw AgentRun payloads, filters the same collaboration duplicates as the Team
  path, and returns either one normalized presentation message, a filtered
  disposition, or a typed rejection. It subsumes the subject-neutral part of
  `TeamAgentEventAdapter`; Team callbacks and Team wire serializers keep their
  current outer message shape and field spellings.
- Token presentation uses a root-neutral internal summary plus subject-specific
  serializers. The Team serializer continues to emit the existing
  `root_team_run_id`; the Org serializer emits/correlates
  `root_subject_kind:"agent_org"` and `root_run_id`. An Org event must never
  carry a field whose semantics claim a Team root.
- `AgentOrgRootExecutionViewDto` replaces `unknown` members/handoffs/tasks/
  messages with exact Org V1 projection schemas and adds one exact status record
  for every live Agent execution. Snapshot root ID, every Agent address/run ID,
  task/message sidecar identity, and status identity must correlate before the
  browser can publish the candidate context.
- The browser parser has no `unknown`/`any` live-event branch. Invalid type,
  identity, sequence, or payload closes the candidate stream, marks it
  `reopen_required`, and preserves the last committed context until explicit
  checkpointed recovery. There is no text/JSON fallback.
- After Org envelope correlation, `AgentOrgStreamingService` composes the exact
  `agent_run_id` and `change_sequence` with the root-neutral message body into
  the existing internal Agent stream-presentation input expected by
  `dispatchAgentStreamMessage`. This is an internal adapter, not a fabricated
  Team envelope: it carries no `root_team_run_id`, Team root ID, or Team stream
  discriminator, and it selects the target AgentContext only from the correlated
  Org member index.

#### Org context, hydration, and stream state machine

`AgentOrgExecutionContext` is the sole active browser aggregate for one Org run.
It owns a strict `AgentOrgExecutionViewState`, per-Agent `AgentContext`s,
read-only mounted-Team projections, nullable exact focus, and synchronization
phase. `rootExecutionViewStore` becomes a thin mixed-route/history facade over
subject contexts; it does not retain a second Org tree or raw event log.

Fresh open/restore follows:

`AgentOrg history/route -> agentOrgRunContextHydrationService -> strict Org
resume/tree/tasks/messages -> Org member projection service + workspace
resolution -> AgentContext map with focus=null -> AgentOrgStreamingService
CONNECTED -> exact snapshot barrier -> atomic context registration -> typed
live messages -> dispatchAgentStreamMessage -> accepted conversation/event
monitor`.

The state machine mirrors the proven Team stream phases
`disconnected -> awaiting_connected_root -> awaiting_snapshot -> ready`, with
`reopen_required` on a schema/correlation/sequence failure. Recovery loads a
complete candidate context, verifies an Org execution checkpoint before/after
when open execution work permits, connects it at the expected base sequence,
and swaps contexts atomically. It never clears conversation state or continues
through an opaque raw event list; the previously committed context remains
visible with the recovery notice until the candidate is complete.

#### Exact focus and presentation targets

```ts
type ActiveAgentWorkspaceTarget =
  | { kind: "standalone_agent"; context: AgentContext; interaction: AgentInteractionPort; browse: RunBrowseSubject }
  | { kind: "standalone_team_member"; context: AgentContext; team: TeamWorkspaceContextView; interaction: AgentInteractionPort; browse: TeamBrowseSubject }
  | { kind: "agent_org_direct_agent"; root: { orgRunId: string }; address: AgentTeamAddress; context: AgentContext; interaction: AgentInteractionPort; browse: OrgBrowseSubject }
  | { kind: "agent_org_team_member"; root: { orgRunId: string }; team: TeamWorkspaceContextView; address: AgentTeamAddress; context: AgentContext; interaction: AgentInteractionPort; browse: OrgBrowseSubject };

interface AgentInteractionPort {
  send(input: AgentComposerSubmission): Promise<void>;
  interrupt(): Promise<void> | void;
  decideTool(input: ToolDecisionInput): Promise<void> | void;
}
```

- `CollaborationFocusController` accepts only an exact address from the strict
  Org view. A direct Team address resolves to its stored coordinator; an exact
  Team Agent resolves to itself. It returns `null` for absent/stale/settled
  targets and never repairs by first member or name.
- `ActiveAgentWorkspaceTarget` is presentation/interaction state, not durable
  topology. `useActiveContextStore`, input components, tool cards, right tabs,
  activity/token/artifact/file surfaces depend on this boundary only.
- `TeamWorkspaceContextView` exposes focused AgentContext, member presentation,
  scoped messages/tasks and coordinator identity. Its Org adapter filters the
  owning Org context by exact Team host/address and sends all commands through
  the Org interaction port. It cannot stop/restore/register/persist a Team root.
- Direct Org Agent focus renders `AgentWorkspaceSurface`; Team or Team-Agent focus
  renders `TeamWorkspaceSurface`; both surfaces contain the existing accepted
  `AgentEventMonitor`/`AgentConversationFeed`/`AgentUserInputForm` stack. Existing
  standalone `AgentWorkspaceView` and `TeamWorkspaceView` are wrappers over the
  same surfaces, so parity is structural rather than duplicated CSS.
- Header settings/new-run events flow through subject-specific action ports.
  They may navigate to a valid definition/run-config journey, but they never
  mutate the immutable running snapshot or terminate the Org. Root termination
  stays on the active history root row. Mounted-Team termination is forbidden.

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
| BEH-002 | System | REQ-004, REQ-005, REQ-011, REQ-024, REQ-030, REQ-032; AC-002, AC-007, AC-019, AC-025, AC-027 | Configure, launch, or restore Org/Team. | Recursive Team planner -> Team manager -> RootTeamRun; Team UI coordinator-focused. | Org full configuration resolves and activates complete scope unfocused; standalone Team remains coordinator-led; preview/request/server/snapshot agree and a fresh Org uses the available Temp Workspace default. | Config UI/application -> canonical exact patch/default-selection boundary -> subject run service -> configuration resolver -> subject planner/manager -> subject aggregate/adapters -> root-neutral Agent/flat-Team candidates -> durable full active scope (DS-002, DS-003, DS-012, DS-014, DS-015, DS-024, DS-026). |
| BEH-003 | Contract | REQ-005-REQ-007, REQ-020-REQ-023; AC-003, AC-015-AC-018 | Author/inspect handoffs or Agent calls collaboration tools. | Recursive compiler emits root-owned handoffs first, then child Teams in stable member order; rule lookup filters without reordering. | Preserve ordered Agent-sourced routes: Org-owned saved order first, then each direct Team's local saved order in stable Org member order; Team-local edges rebase once; exact same-root resolution fails closed. | Definition candidate path (DS-011); fixed-depth ordered compilation (DS-009); member execution context -> bound owning-root message/task capability -> subject adapter/index -> AgentRun/coordinator (DS-004, DS-014). |
| BEH-004 | User / contract | REQ-003, REQ-004, REQ-024; AC-002, AC-003, AC-019 | Launch Org, select workspace member, or address Team. | Required/repaired Team focus. | No Org coordinator/initial focus/fallback; explicit Agent focus is exact; Team focus uses its exact coordinator; no-focus blocks only recipient-required action. | Org launch -> focus=null; sidebar selection -> Org context exact target -> accepted Agent/Team surface -> strict interaction port/transport (DS-003, DS-004, DS-013, DS-016-DS-018). |
| BEH-005 | System | REQ-012, REQ-014, REQ-016, REQ-025, REQ-027; AC-008, AC-009, AC-011, AC-020, AC-022 | Persist/restore/stream/history/archive/stop a run. | Strict Team V2 everywhere, including organization-like Team roots. | Flat Team remains native V2; Org uses separate V1; every cutover-time server memory package remains in scope regardless of current definition availability; mixed projections preserve history truth. | Subject aggregate -> subject tree/task/message persistence coordinator -> subject-tagged catalog -> strict subject projector/stream/context; restore selects/correlates the complete package/member projections by family; root stop stays on root history (DS-006T, DS-006O, DS-008, DS-014-DS-019). |
| BEH-006 | User | REQ-001, REQ-002, REQ-004, REQ-011, REQ-016, REQ-018-REQ-032; AC-002, AC-007, AC-011, AC-013-AC-027 | Open catalog/authoring/detail/config/launch/history/workspace. | One Team catalog/form advertises nesting; shared runtime assumes Team root/non-null focus; discovery has no per-definition admission status; current Org route swaps the established history panel. | Implement the approved Product packages plus RER-024 parity for available target definitions and truthful runtime/history; one familiar Workspace shell keeps Agents, Teams, and Agent Orgs visible across route states. | Definition admission -> subject web/API; mixed durable history plus strict Org context -> one tagged Workspace projection and shared accepted Agent/Team surfaces, contextual tools, mounted-Team aggregate, and established Team launch/config hierarchy (DS-000-DS-003, DS-008, DS-011-DS-013, DS-016-DS-026). |
| BEH-007 | Operational | REQ-009, REQ-010, REQ-012, REQ-013, REQ-027; AC-004, AC-006, AC-008, AC-022 | Cut over server definitions/runtime while discovering external dependencies. | Unversioned recursive Team codec; 23 external evidence roots; 43 current server V2 trees; no deep topology. | Convert only server-owned definitions to target configs; never write external roots; flat runtime roots are no-op; one-level runtime roots convert to Org V1; unavailable external definitions do not block global readiness/history. | Existing startup migration runner -> separate definition/runtime inventories -> migration-owned atomic current-file writes and one direct package-family rename -> strict target admission/diagnostics -> per-item catalog rebuild/readiness (DS-000, DS-007, DS-010). |
| BEH-008 | Contract | REQ-014, REQ-025; AC-009, AC-020 | Native durable write/read and mixed projection. | Exact Team V2 only. | Exact Team V2 preserved; exact Org V1 added; child/task records reused; family/payload/projection mismatch fails. | Team planner/root -> exact Team V2 tree/sidecars (DS-006T); Org planner/root -> exact Org V1 tree/Org sidecars (DS-006O); generic facade -> tagged union (DS-008); root-neutral execution callbacks remain internal (DS-014). |
| BEH-009 | System | REQ-015; AC-010 | Delegate/submit/review/settle/restore task execution, including independent assignee/delegator turns and application root shutdown. | Task records attach recursively to exact Team host; current settlement calls waiting `prepareTermination()` at the single root FIFO head. Current roots can drain task work before interruption, and active-turn-only interruption can miss admitted/provider-start-pending input before `TURN_STARTED`. | Org root becomes a valid host; fresh task Team remains exact task lineage; a normal accept that overlaps the assignee's still-finishing provider turn defers settlement without holding the FIFO; supported SIGTERM freezes a stable scope and invokes an irreversible per-Agent input/provider-start/interrupt fence before task drain; task records/tools/results stay exact. | Agent tool -> bound member task command -> root FIFO -> private subject durable commit; terminal record -> non-waiting exact-execution quiescence check -> defer/retry on existing idle event or existing prepared `settledAt` transaction; root termination -> stable freeze -> AgentRun fence across direct/mounted/task scopes -> task drain (DS-005, DS-008, DS-014, DS-015, DS-022). |
| BEH-010 | Contract / operational | REQ-026, REQ-027; AC-021, AC-022 | Discover/admit server-owned and registered external definition packages at cutover/startup. | One unversioned normal Team parser accepts recursive shapes across all roots. | Normal admission accepts only exact Team Config V2/Org Config V1. Server-owned legacy decoding is migration-only; rejected external packages/dependent Orgs are individually unavailable with owner diagnostics and no source mutation/fallback. | Source inventory -> server migration classification or target codec -> dependency closure -> available catalog/unavailable diagnostics -> new-work gate (DS-000, DS-007). |
| BEH-011 | User / presentation | REQ-028; AC-023 | Inspect an active, collapsed, or stopped AgentOrg mounted Team row while exact descendant Agent statuses change. | Current AgentOrg Team row omits Team status and current Agent rows use a hard-coded live-looking dot; a mature five-state Team branch fold/dot exists only in the Team history path. | One accessible Team-row aggregate folds exact configured and task-scoped descendant Agent status truth for that branch, stays visible collapsed, preserves exact Agent signals, and loses live-only states without live authority. | Strict Org tree + exact AgentOrgExecutionContext/history status source -> AgentOrg Team-branch projector -> shared five-state fold -> reusable Team status dot (DS-020, DS-021). |
| BEH-012 | User / presentation | REQ-029; AC-024 | Open a new AgentOrg launch draft, disclose Member overrides, inspect one mounted Team, make exact Team/Agent edits, collapse/reopen, and launch. | Current Org form uses a bespoke always-exposed Team-child hierarchy and implicit inherited state even though the accepted Team form already owns the desired progressive disclosure. | Outer and per-Team disclosures start collapsed; exact-Agent count, Team identity/address/state, coordinator Agent and exact local override state are explicit; one expanded Team uses the accepted Team controls; valid sparse draft survives collapse and launches through unchanged Org APIs. | AgentOrg detail -> Org config route -> Org draft/projector -> shared disclosure + Team scope/tree/Agent editors -> exact Org command adapter -> existing GraphQL `createAgentOrgRun` -> server complete resolution/validation (DS-023). |
| BEH-013 | User / contract | REQ-030; AC-025 | Change runtime/model/config at Org, Team, or exact Agent scope and launch. | Browser effective preview clears dependent config, but sparse Org serialization can omit the clear and the server then inherits a different parent config. | Preview, client validation, exact request semantics, server resolution, and stored snapshot are identical; an explicit runtime/model change without config clears incompatible inherited model config. | Team/Agent edit -> canonical Org placement patch -> form projection + GraphQL variables -> authoritative server fixed-depth resolver/validator -> exact run snapshot (DS-012, DS-024). |
| BEH-014 | User / presentation | REQ-031; AC-026 | Move catalog/detail -> Org config -> launch/focus -> stopped/history or switch subjects. | AppLeftPanel route predicate swaps the populated Workspace tree for a separate Org-only history owner. | One stable Workspaces surface retains existing categories/rows/state and adds `Agent Orgs` directly below `Teams`; Org rows remain distinctly tagged and own Org hierarchy/actions. | Mixed history/context projection -> unified Workspace read model -> ordered workspace categories -> typed subject selection/lifecycle actions; route changes only center content (DS-008, DS-013, DS-019, DS-025). |
| BEH-015 | User | REQ-032; AC-027 | Open a fresh AgentOrg launch configuration. | Team root selects available Temp default; Org root disables default selection, leaving inherited Team workspace empty and Run blocked. | Fresh Org selects the actually available Temp Workspace default; exact placements inherit root unless a supported Team override applies; explicit choice wins. | Shared workspace catalog -> root default-selection policy -> Org draft -> Team/Agent inherited projection -> existing launch `workspaceRootPath` validation (DS-003, DS-012, DS-026). |

## Relevant Supplemental Task Artifacts

| Artifact Path | Purpose | Related Requirement / Acceptance-Criteria IDs | Relationship To This Design | Status / Approval Applicability |
| --- | --- | --- | --- | --- |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | Normative configured structure, exact definition and run families, source ownership/admission, task ownership, handoff authoring/order, launch/configuration/focus, mixed projections, and launch override hierarchy. | REQ-001-REQ-029; AC-001-AC-024; ORG-CASE-001-061 | Governs fixed-depth invariants, Team Definition V2 / Org Definition V1, native Team Run V2 / Org Run V1, target-only admission, two-family reuse, no-focus activation, transition, failure-closed projection, and exact override disclosure/state semantics. | Approved through `RER-023`; authoritative. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md` | Requirements-owned evidence and current production-path inventory. | BEH-001-BEH-015; PRE-001-PRE-005 | Supplies approved behavior and inventory evidence, including the Electron config/shell/default source trace; architecture evidence above extends rather than rewrites it. | Current through `RER-024`; not behavior authority by itself. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md` | Cumulative approval/navigation history. | RER-001-RER-024 | Establishes progressive Team reuse, Product UI, configuration-first launch, Team-V2/Org-V1 runtime correction, external-definition scope/admission, override hierarchy, and launch/shell/workspace parity clarification. | Approved/cumulative. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md` and `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md` | Independent review result and finding history through AD-REV-012. | AR-FIND-001-005; ARCH-REV-001-010; ADI-006/007; IDI-001; API-FIND-007/008 | Records prior findings and confirms the cumulative design through AD-REV-012. | `ARCH-REV-010@3ddff04d7` passed AD-REV-012. AD-REV-013 is a new focused impact and requires renewed independent review. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-handoff.md` and `implementation-revision-record.md` | Implementation-owned history and recovery evidence. | IR-001-026; IDI-001; ADI-007 | IR-001 proved Team-root coupling; later reviewed rounds implemented runtime/presentation/status/lifecycle, mounted-Team launch/status, localization, recovery, and bounded CRR/API fixes. | Current reviewed source result is `IR-026@3199ba081`; implementation remains held for the AD-REV-013 review route. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`, `api-e2e-execution-coverage-report.md`, and `api-e2e-evidence/API-REV-002/followup-api-find008*` | Real-system evidence through API-FIND-008, including clean control, normal submit/independent-accept overlap, and the invalid-self-review settlement reproduction. | BEH-009; REQ-015; AC-010; API-FIND-008; CR-CAND-020 | Separates supported production reachability from technical coupling evidence; the invalid self-review tail is explicitly non-authoritative for behavior. | Retained downstream evidence only; AD-REV-011/ARCH-REV-009 closed that design path. Current cumulative execution remains held for AD-REV-013 review and implementation reconciliation. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md` | Architecture-owned use-case/data-flow self-validation requested by the user. | BEH-001-BEH-015; SCN-001-SCN-016; IDI-001; ADI-007; API-FIND-007/008; CR-FIND-020; AR-FIND-003-005 | Walks the cumulative runtime plus canonical launch-patch equivalence, route-stable Workspace history, and root workspace-default inheritance with owners, boundaries and rejected shortcuts. | AD-REV-013 review input; design validation only, not executable evidence. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/autobyteus-server-ts/docs/design/production_data_migration_conventions.md` | Canonical server convention for known-source/fixed-target transformation, forward-only runtime, reachability, failure scope, recovery, residue, summaries/logs, and review. | REQ-012, REQ-013, REQ-027; AC-008, AC-022; SCN-004, SCN-011 | Governs AD-REV-004 migration mechanics; requirements continue to govern target state and availability. | Current repository architecture authority; explicitly identified by the user. |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/code-review-report.md` and `code-review-revision-record.md` | Failure-origin and cumulative source-review authority through CRR-033. | CR-FIND-011-024; API-FIND-008/016 | CRR-021 established the prior Product/Architecture impact; IR-018 implemented CR-FIND-019/020. CRR-032 passed current cumulative source and CRR-033 found no durable API/E2E test-code change after API-REV-008. | RER-024/AD-REV-013 now govern the newly user-reported launch/shell/default recovery; prior findings remain regression context, not this design's new behavior. |
| `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-STATUS-001/ui-ux-spec.md`, `user-decision-record.md`, manifest and VIS-STATUS-001-003 | Focused mounted-Team status Product authority. | BEH-011; REQ-028; AC-023; SCN-012; ORG-CASE-056-058 | Governs exact branch fold, dot placement, collapsed visibility, accessibility, terminal/history truth and lifecycle non-effects; fixture status mixtures remain illustrative. | Completed, explicitly user-approved, integrated by `RER-021`; authoritative only for the prior omission. |
| `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-TEAM-OVERRIDES-001/ui-ux-spec.md`, `user-decision-record.md`, manifest and VIS-OVR-001-006 | Focused AgentOrg launch override hierarchy Product authority. | BEH-012; REQ-029; AC-024; SCN-013; ORG-CASE-059-061 | Governs exact count/disclosure placement, independent Team collapse, Team/Agent local state, coordinator Agent placement, draft continuity, established Team control language, and narrow behavior. | Completed and explicitly user-approved; supersedes only RV-012 Placement Overrides lines 89-95 and VIS-015. |
| `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/ui-ux-spec.md` | Normative Product interaction, visual, responsive, and accessibility contract. | REQ-019-REQ-024; AC-014-AC-019; SCN-007-SCN-009 | Governs production UI structure and state meaning; mocked persistence/runtime are explicitly non-authoritative. | Approved `RV-012`; authoritative except the superseded Placement Overrides lines 89-95 / VIS-015 slice. |
| `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/visual-references/visual-reference-manifest.json` and sibling `VIS-001`-`VIS-020` images | Normative final visual references, routes, viewports, state descriptions, hashes, and fixture boundary. | REQ-019; AC-014 | Every visible non-fixture detail informs the file/component/state mapping and browser acceptance checks. | Approved after user review; authoritative. |
| `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/user-decision-record.md` | Explicit Product approval record. | RER-014; REQ-019; AC-014 | Closes the Product gate; RER-019 changes only baseline activation/provenance. | Approved 2026-08-31. |
| `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/BASELINE-PROMOTION-001/ui-ux-spec.md` and VIS-PROMOTE-001-004 | Clean-route/default-baseline activation supplement. | RER-019; SCN-007 | Confirms the same approved Team/Org runtime on normal routes; supplements but does not replace RV-012/VIS-001-020. | User-authorized and integrated; no behavior change. |
| `/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/requirements_engineer_6568eac682114f2cb3ddb8f1d91d3c34/context_files/ctx_4cc02361f417__image.png` | Representative current hierarchy screenshot. | REQ-016; AC-011 | Current-state evidence only; it does not prescribe target layout/styling. | Evidence only; no separate approval. |
| `origin/codex/flat-agent-team-domain-simplification@c3a318812` (local `ca6d24dfa`) | Prior concept evidence. | BEH-001, BEH-004, BEH-009 | Its supported decisions are already incorporated upstream; it is not a competing design. | Superseded by approved package. |

## Approved Product UI To Production Mapping

| Normative References | Product Surface / State | Production State Owner | Production API / Domain Owner | Required Implementation Boundary And Validation |
| --- | --- | --- | --- | --- |
| VIS-001-VIS-008 | Baseline Team catalog, Agent-only builder/detail, coordinator, Team-local From/To/When, narrow builder | `agentTeamDefinitionStore` complete Team draft; Team subject components | AgentTeamDefinition GraphQL/Service + Team endpoint catalog + revisioned provider commit | Remove Team library/nesting; preserve baseline shell/cards; direct Agent endpoints only; one coordinator; inline reversible handoff editor; keyboard/click fallback. |
| VIS-009-VIS-013 | Org catalog, in-flow Agent/Team member authoring, clean detail, Org handoff detail, narrow authoring | `agentOrgDefinitionStore` complete Org draft; Org subject components | AgentOrgDefinition GraphQL/Service + Org endpoint catalog + revisioned provider commit | No Category/coordinator/overlay; referenced Team identity is query-only; Org From includes mounted Agents, To also direct Teams; exact addresses/coordinator metadata inspectable. |
| VIS-019 | Org handoff CRUD/reorder/atomic-save state | Org definition draft plus shared handoff view/editor primitives | Complete-candidate validation and one Org definition CAS | No per-handoff write. Preserve failed draft; stale endpoints remain visible; typed errors map adjacent to handoff/field; success updates canonical revision. |
| VIS-014, VIS-020 plus VIS-OVR-001-VIS-OVR-006; REQ-029-REQ-030, REQ-032; AC-024-AC-025, AC-027; SCN-013-SCN-014, SCN-016 (`VIS-015` historical only; RER-024 governs incidental empty-root depiction) | One Org configuration; exact-Agent count; outer and independent Team disclosures; exact local state; direct-Agent continuity; draft continuity; fresh available Temp Workspace default; one preview/request/resolution/snapshot result; narrow configuration | `agentOrgRunConfigStore` exact root draft plus canonical Team/Agent sparse maps; pure AgentOrg form projector; shared Team launch presentation and root workspace-selection components | Existing CreateAgentOrgRun GraphQL input -> CollaborationLaunchConfigurationResolver -> AgentOrgRunService | Reuse the established Team controls and root default policy; canonicalize dependent `llmConfig` clear before preview/serialization; keep Org draft/payload separate and server resolution authoritative. No recipient selector, hard-coded path, always-exposed child tree, Team-store import, resolved-payload API, or new field. |
| VIS-016-VIS-018 | Full scope active unfocused; exact direct-Agent focus; direct-Team coordinator focus and accepted live conversation/composer | `AgentOrgExecutionContext` + `CollaborationFocusController` + tagged `ActiveAgentWorkspaceTarget`; `AgentOrgWorkspaceView` is a thin router to shared `AgentWorkspaceSurface` / `TeamWorkspaceSurface` | Strict AgentOrg snapshot/event/command contract; root-neutral Agent presentation adapter; Org member projection/trace service; exact `AgentOrgRun.executeAgentCommand` | Org focus starts `null` and renders prompt only. Direct Agent and Team/coordinator focus structurally reuse `AgentEventMonitor`, accepted header/actions, composer, tool/activity/files/token surfaces. No raw event cards, `JSON.stringify`, custom composer, implicit fallback, standalone Team registration, or member-header Org stop. |
| VIS-016-VIS-018 and UI spec shared runtime/history, governed by RER-024 REQ-031/AC-026/SCN-015 for shell continuity | Org root, direct sibling Agents/Teams, Team children, task lineage/rails/selection inside one familiar left Workspaces surface | One route-stable mixed Workspace/history read model; AgentOrgExecutionContext remains active Org runtime owner | Subject-tagged history/stream facade over strict Team V2 and Org V1 projectors; typed subject action ports | Preserve existing categories and add `Agent Orgs` immediately below `Teams`; entering Org config/active/history never swaps the panel or hides prior rows. Configured depth is fixed; root kind/actions remain truthful. |
| VIS-PROMOTE-001-VIS-PROMOTE-004 | Normal-route activation supplement: standalone Team config/history and AgentOrg active hierarchy | Existing Team contexts/history plus Org context/history facade on clean routes | Unchanged Team run boundary plus strict Org run boundary | These four images prove normal-route/default-baseline availability and standalone Team preservation; they supplement, never replace, VIS-001-VIS-020. Shared-surface extraction must keep the standalone Team active/history experience exact. |
| VIS-STATUS-001-VIS-STATUS-003; REQ-028; AC-023; SCN-012 | Mounted Team status active/expanded, active/collapsed and stopped/history | Exact AgentOrg topology + `AgentOrgExecutionContext` live Agent statuses or existing terminal/history projection; shared pure fold and `TeamAggregateStatusDot` | No new server/API owner; AgentOrg history remains topology/lifecycle owner and AgentContext remains exact live status owner | Team dot appears between disclosure and Team icon; configured/task Agent signals remain exact; fold is branch-local and computed before collapse; `Team status: <State>` is accessible; historical missing/live-only inputs are offline; no mounted-Team lifecycle action or new transport. |
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
  `Duplicated Policy Or Coordination`, `Shared Structure Looseness`, and a
  `Concurrency / Lifecycle Ordering Defect` in the shared task boundary. The
  AD-REV-013 focused evidence adds a duplicated effective-configuration policy,
  a route-selected competing history owner, and one local root-default defect.
- Refactor needed now: `Yes`
- Evidence: one Team definition/runtime subject owns ordinary Team and
  organization behavior; recursive graph/planner/transport/UI contracts legalize
  Team-in-Team; organization roots require a fake Team coordinator. `IDI-001`
  adds concrete evidence that even the local Agent/Team execution path depends
  on `RootTeamRun`, Team identity/physical scope, Team task/message sidecars, and
  Team event/persistence callbacks. Adding an Org activator around those internals
  would leave either a synthetic Team owner or an unowned Org execution graph.
  ADI-007 provides a second, distinct boundary witness: the Org wire contract
  admitted `unknown`, the browser root store retained opaque events, and the Org
  Vue component owned protocol formatting, conversation rendering, input, and
  root termination. That bypassed the accepted Agent presentation owner and
  created a parallel product runtime surface. API-FIND-007 adds a bounded
  presentation-policy witness: the Org history panel bypasses the established
  Team aggregate status concern, omits Team status, hard-codes Agent green, and
  ties branch construction to expansion. Copying another fold into that
  component would duplicate policy rather than restore the missing projection.
  API-FIND-008 and ARCH-REV-006 add the task-lifecycle boundary evidence and its
  necessary reachability correction. Source proves provider quiescence is awaited
  inside the record FIFO and roots can drain task work before interruption. The
  long exact stall used unsupported self-review and is technical evidence only.
  Independent supported paths are normal assignee-submit/delegator-accept overlap
  and application shutdown of an active task Agent at a legitimate tool approval.
  `ARCH-REV-007 / AR-FIND-004` adds the missing normal phase witness: durable
  task activation releases initial work asynchronously, and SIGTERM can enter
  after AgentRun admits/starts provider input but before canonical
  `TURN_STARTED`. Origin/personal has the same latent gap because normal
  termination intentionally drains admitted input and its stop regressions began
  only after an active approval wait. `CRR-021 / CR-FIND-020` adds a focused
  frontend `Duplicated Policy Or Coordination` witness: the Org form recreated
  the mounted-Team hierarchy, disclosure and state language in
  `AgentOrgPlacementOverrideRow` even though the accepted Team components are
  unchanged and already own those concerns. The old component also represents a
  Team scope by fabricating an Agent-shaped node, which loosens the presentation
  boundary and omits Team workspace editing. RER-024's Electron evidence adds
  three concrete design-health failures: `resolveOverrideLlmConfig` clears a
  dependent config that the Org serializer omits and the server re-inherits;
  `AppLeftPanel` swaps the established tree for `AgentOrgRunHistoryPanel` by
  route; and `AgentOrgRunConfigPanel` disables root default selection even
  though the Team root enables the shared policy. These are architecture-owned
  consistency defects, not evidence that the requirements should prescribe
  component implementation.
- Design response: separate AgentOrg and AgentTeam definition/run/persistence
  owners; keep native Team V2 and Team runtime intact where they are already
  truthful; add Org V1 and Org runtime; add exact subject definition codecs and
  a source-aware admission owner; extract only semantically tight shared
  Agent/Team/handoff/launch/task records and low-level execution mechanisms;
  replace configured recursion with fixed-depth validation and projection. Keep
  current source forward-only and isolate the known old-to-current transform in
  one registered migration that follows the existing runner/convention rather
  than adding a second recovery architecture. For ADI-007, move raw Agent event
  admission to one root-neutral presentation adapter, create a strict Org
  execution context/stream, extract reusable Agent/Team workspace surfaces and
  make the active-target/interaction facade the sole component command boundary;
  remove the bespoke Org runtime dashboard. For AD-REV-007, extract the existing
  five-state normalizer/fold and dot into neutral Team-branch presentation
  concerns, keep Team-history and AgentOrg traversal adapters subject-shaped,
  and make the Org hierarchy consume exact context/history Agent statuses before
  collapse. For AD-REV-009, retain the existing one-FIFO/prepared-settlement
  architecture but make task-execution preparation a non-waiting atomic
  quiescence attempt: active work defers and retries on the existing idle event.
  For AD-REV-010, add a distinct irreversible AgentRun root-shutdown fence,
  serialize claim/provider-start registration against it, reuse the existing
  pre-forward cancellation fact, and recursively invoke it through stable frozen
  Team/Org scopes before task drain. Keep ordinary AgentRun preparation's FIFO
  drain behavior. Withdraw AD-REV-008's coordinator/token/dependency machinery.
  For AD-REV-012, keep the AgentOrg draft and create-run command Org-owned,
  split exact Team/Agent override state, add one pure fixed-depth Org form
  projector, and route mounted Team nodes through the existing
  `TeamMemberConfigTree -> TeamScopeConfigEditor -> MemberOverrideItem`
  presentation/edit-command path. Extract only the compact outer disclosure
  shell needed by both root forms; remove the bespoke Org Team-row branch rather
  than keeping two visual policies. For AD-REV-013, canonicalize every Org Team/
  Agent patch at its one store/command boundary so explicit runtime/model edits
  carry an explicit dependent-config clear; keep one always-mounted mixed
  Workspace/history surface and delete the route-selected Org-only panel; and
  apply the existing root workspace-default selection policy to the AgentOrg
  root while leaving placement inheritance exact.
- Refactor rationale: the durable correction specifically reduces the prior
  refactor: there is no justification to rename or replace the valid Team V2
  family. IDI-001 demonstrates that the runtime extraction cannot be deferred;
  it is required to make Org composition valid without weakening the two-family
  authority. Refactor remains required at configured Agent/Team execution
  context, task/message adapters, definition recursion, organization runtime
  ownership, mixed projection, and frontend boundaries. The AD-REV-012 frontend
  refactor is required now because a badge-only change would retain the
  superseded always-exposed hierarchy and duplicated Team editor; direct reuse is
  smaller and keeps standalone Team visual behavior as the regression oracle.
  The AD-REV-013 history consolidation is also required now: retaining both
  panels would preserve two navigation authorities and make continuity depend on
  route rather than state. The patch/default corrections are bounded local
  changes but must be specified with cross-layer equality tests because either
  silent drift can launch the wrong runtime configuration.
- Intentional deferrals/residual risk: dynamic membership, distributed cross-run
  routing, shared Agent instances, new application-owned Org resources, and new
  product-visible task settlement semantics remain out of scope. Updating or releasing either
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
- **Task mutation FIFO:** the root-neutral queue that serializes task
  record/tree/sidecar durability, publication, and settlement of an execution
  already proven quiescent. A non-quiescent execution defers without waiting.
- **Non-waiting quiescence preparation:** atomic AgentRun/local-Team operation
  that returns `null` with no state change while any input/turn is unresolved,
  or returns the existing prepared termination after closing admission on a
  quiescent execution.
- **Activation:** create/restore complete configured scope; does not select a
  communication recipient.
- **Communication focus:** nullable client/session selection of an exact AgentRun
  (or Team row resolved to its coordinator); never persisted in either family.
- **Definition revision:** opaque provider-issued hash/token used only for one
  complete parent-definition compare-and-swap transaction.
- **AgentOrg form projector:** pure, fixed-depth web adapter from one admitted
  Org plus referenced flat Team definitions and the Org-owned sparse draft to
  existing Team presentation nodes, exact configurable-Agent count, and a
  closed success/diagnostic result. It owns neither state nor launch policy.
- **Canonical AgentOrg placement patch:** the single Org-owned Team/Agent sparse
  patch representation consumed by preview and request serialization. An owned
  runtime/model identity plus absent model config is materialized as explicit
  `llmConfig:null`; ordinary absent fields still inherit.
- **Unified Workspace/history read model:** one route-independent presentation
  projection that groups tagged Agent, Team, and AgentOrg roots below one
  workspace. It owns navigation presentation state, not subject runtime or
  lifecycle.

## Design Reading Order

1. Read `Intended Change`, `Target Definition And Source Contracts`, and
   `Target Run-Tree And Launch Contracts` for the solution boundary.
2. Read the behavior map, Product mapping, and supported-scenario table for the
   approved behavior witnesses.
3. Read DS-000-DS-026, especially the AD-REV-005 internal runtime composition,
   AD-REV-006 accepted-workspace projection, AD-REV-007 mounted-Team status, and
   AD-REV-009 supported idle-gated settlement contract plus AD-REV-010 AgentRun
   root-shutdown fence, AD-REV-012 established Team launch-hierarchy reuse, and
   AD-REV-013 configuration-equality/unified-shell/default recovery,
   then the ownership and dependency sections for implementation control flow
   and encapsulation.
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
- Remove from the task lifecycle: any call that begins waiting
  `prepareTermination()` for a non-quiescent execution at the root mutation FIFO
  head, drain-before-fence root shutdown, and any root wrapper that treats
  active-turn-only `NO_ACTIVE_TURN` as complete while input may still start.
  Replace the wait with the
  AD-REV-009 non-waiting quiescence preparation plus established idle-event
  resweep, and use AD-REV-010's stable recursive scope plus AgentRun-owned input/
  provider-start/interrupt fence before task drain. Do not add the blocked
  AD-REV-008 coordinator/token path as a fallback.
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
- Presentation cut: remove the Team-kind branch and always-exposed mounted-Team
  child hierarchy from `AgentOrgPlacementOverrideRow`; use the existing Team
  form presentation through the Org projector. Do not retain a feature flag,
  alternate layout, Team store dependency, or mixed override-map authority.

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
- **AD-REV-009 runtime-state decision:** `Directly Usable — No Migration`.
  Terminal task records already use `accepted`/`interrupted`, and execution
  nodes already own `settledAt`. The correction changes only in-process
  settlement eligibility and shutdown ordering. Existing strict readers preserve
  the same meaning; no file, schema, sidecar, history, or migration change is
  authorized.
- **AD-REV-010 runtime-state decision:** `Not Affected`. The AgentRun
  root-shutdown latch, input-dispatch slot phase, and pending interrupt intent
  are process-local lifecycle state. Pre-forward cancellation already exists in
  `AgentRunInputLifecycle`; no durable task/run field is added or reinterpreted.
  Existing Team V2 and Org V1 packages remain directly usable under the
  AD-REV-009 decision and require no additional migration.
- **AD-REV-013 frontend-state decision:** `Not Affected`. Canonical web launch
  patches exist only before create; root workspace selection maps to the
  existing launch field; and the unified history surface consumes the same
  tagged derived rows and strict run snapshots. No stored Team V2/Org V1 file,
  sidecar, index schema, migration cohort, or existing run is rewritten. The
  alternate Org-only Vue panel is source code, not persisted user data.

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
| Task assignee submits normally; its tool result returns; the different delegator accepts before the assignee's canonical provider turn completes; another supported task command arrives | Supported Concurrent Lifecycle Scenario | BEH-009 preserved submission/review behavior; separate MCP-tool-result/turn-terminal source events; TEAM-004 assignee/delegator trace through valid accept | The settlement attempt atomically checks quiescence without waiting. Active work returns `null`, releases the FIFO, and retries on the established idle event; the unrelated command can run. Later invalid self-review events are excluded and remain rejected. |
| Team or Org receives application SIGTERM while an active task Agent waits on a legitimate approval-gated tool | Supported Operational Scenario | Existing root shutdown contract; Product Auto approve tools control; server SIGTERM handler; accepted Agent approval/interrupt runtime test | Close/freeze and interrupt the full owned scope before draining task mutations or settlements; then persist interruptions, settle deepest-first, finish local resources, and complete root/process shutdown. Do not add a timeout or force-kill product path. |
| Normal delegated task commits and releases its initial input; application SIGTERM arrives after AgentRun admission/provider-start registration but before canonical `TURN_STARTED` | Supported Concurrent Operational Scenario | `BEH-009` / `REQ-015` / `AC-010`; task `releaseWork()` source; AgentRun claim/start source; server SIGTERM; `ARCH-REV-007 / AR-PREM-006` | The stable frozen scope invokes the AgentRun root-shutdown fence. A pre-forward start loses to cancellation, or a provider-started input remains tracked and is interrupted on canonical start. The phase cannot report success while a provider may still start afterward. |
| Terminal task settlement `settledAt` persistence fails before rename, or local cleanup fails after durability | Supported Explicit Failure Scenario | Existing prepared-settlement cancellation and post-durability root fail-stop contracts | Existing prepared termination cancellation leaves live/tree state unchanged before durability. After durable commit, cleanup failure fail-stops the owning root; it never reopens or resurrects the terminal task. |
| Terminal task provider wait caused only by verifier self-review deliberately held for approval | Technically Possible but Unsupported/Contrived | ARCH-REV-006 / AR-FIND-003; exact API-FIND-008 correlation | Retain as technical coupling evidence and negative coverage only. It cannot require coordinator/token/replay/timeout machinery or make self-review supported. |
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
| General-process shutdown with active Org, standalone Team, standalone Agents, and task provider turns | Supported Operational Scenario | Existing supervisor lifecycle, server SIGTERM handler, approved Auto approve tools control, and accepted approval interruption semantics | Close process/root admission; within each root establish a stable frozen scope and complete every AgentRun input/provider-start/interrupt fence before task command/settlement drain; stop Org roots, then Team roots, then remaining AgentRuns; aggregate errors and release construction dependencies in reverse order. |
| Preserve native flat Team Run V2 and add strict AgentOrg Run V1 over reused records | Supported Governing Contract Scenario | SCN-010; REQ-014, REQ-025; AORG-CONTRACT-001@RER-018 | Implement separate subject-owned stores/paths and a discriminated mixed projection; this is the approved durable boundary, not an optional architecture choice. |
| Cut over with valid target definitions, incompatible external definitions, and a dependent Org | Supported Operational Scenario | SCN-011; REQ-026, REQ-027; AC-021, AC-022 | Admit only exact targets, exclude incompatible external/dependent definitions from new work, expose diagnostics, preserve compatible readiness/runtime migration/history, and prove external zero writes. |
| Scan both runtime families and infer root kind from whichever payload parser accepts | Technically Possible but Explicitly Rejected | SCN-010; REQ-025, AC-020 | Select family from authoritative tagged location and fail on family/payload/projection mismatch; no guessing or auto-retyping. |
| Retry the retired definition parser after target admission fails | Technically Possible but Explicitly Rejected | SCN-011; REQ-026, REQ-027; AC-021 | Return one unavailable diagnostic; do not normalize `refType`, construct a legacy definition, mutate the source, or activate it. |
| User sends a real prompt to a focused direct Org Agent and receives a normal streamed answer | Supported Normal Scenario | REQ-004/016/019/025; SCN-007/009; VIS-017; API-E2E-005 real full-stack witness | Strictly project the exact Org member event into AgentContext and render through the accepted Agent conversation/event-monitor/composer surface; raw envelopes and JSON fallback are forbidden. |
| User focuses a direct Team or Team Agent in an active Org and communicates through the accepted Team member workspace | Supported Normal Scenario | REQ-003/004/011/018; SCN-006/009; VIS-018 | Adapt the exact mounted Team scope to `TeamWorkspaceContextView`; Team selection maps to coordinator; reuse Team surface without standalone Team registration or independent termination. |
| Focused Org Agent is running and the user presses the accepted red composer stop control or responds to a tool approval | Supported Normal Scenario | Existing accepted Agent/Team interaction surface incorporated by RV-012; real Agent provider lifecycle | Org interaction port sends exact interrupt/approve/deny commands with acknowledgements to AgentOrgRun; no custom composer and no direct socket call from components. |
| Operator terminates an active AgentOrg | Supported Normal Lifecycle Scenario | REQ-016 launch/history/stop lifecycle; Product mock boundary names actual stop; existing Team root-row interaction | Stop is a root-run action in Org history with pending/error parity; it is not displayed as a focused member header action and cannot stop a mounted Team independently. |
| Org live stream contains an unknown, malformed, miscorrelated, or sequence-gapped event | Supported Explicit Contract Failure | REQ-025 fail-closed projection plus established Team stream recovery contract | Reject the candidate message, enter `reopen_required`, and checkpoint-hydrate a replacement context; never stringify or display the protocol envelope. |
| User inspects a mounted Team while configured or task-scoped Agent statuses change, collapses it, and later inspects the stopped run | Supported Normal Scenario | SCN-012; REQ-028; AC-023; user original/current screenshots and approved VIS-STATUS-001-003 | Resolve statuses from the exact current authority, traverse only that configured Team branch independently of expansion, fold the five states, keep the accessible dot visible collapsed, and normalize historical live-only/missing values without adding Team lifecycle. |
| User opens a new AgentOrg launch draft, expands Member overrides, opens only one mounted Team, edits exact Team/Agent placement values, collapses/reopens, and launches | Supported Normal Scenario | SCN-013; REQ-029; AC-024; CR-SCN-037; explicitly approved VIS-OVR-001-006 | Reuse the established AgentTeam disclosure, Team scope, and Agent row presentation under an Org-owned projector/draft. Preserve exact local sparse patches, independent disclosure state, coordinator-on-Agent identity, fail-closed projection, and the unchanged Org launch command/API. |
| User changes an exact Agent from root Codex/GPT to AutoByteus/DeepSeek Flash without supplying model config, then launches | Supported Normal Scenario | SCN-014; REQ-030; AC-025; Electron failure plus successful Team control | Canonical Org patch owns `llmConfig:null`; preview, variables, server effective plan, and stored snapshot agree. A missing clear is an invariant failure, not inheritance. |
| User enters AgentOrg config from a populated catalog, launches, focuses a member, switches away/back, and opens stopped history | Supported Normal Scenario | SCN-015; REQ-031; AC-026 | Keep one left Workspace/history owner mounted; retain earlier Agent/Team/Org rows and UI state; add Agent Orgs below Teams; only center target changes. |
| User opens a fresh AgentOrg while Temp Workspace is available, then inspects a mounted Team's inherited workspace and optionally selects an exact Team override | Supported Normal Scenario | SCN-016; REQ-032; AC-027 | Root applies the established available-default policy once; mounted placements inherit root; exact Team override wins; unavailable defaults remain unset/actionable; focus remains null. |

## Data-Flow Spine Inventory

| Spine ID | Scope | Behavior(s) | Start | End | Governing Owner | Why It Matters |
| --- | --- | --- | --- | --- | --- | --- |
| DS-000 | Primary End-to-End | BEH-001, BEH-006, BEH-007, BEH-010 | Registered definition source inventory | Available target definitions plus actionable unavailable/dependency diagnostics | `DefinitionAdmissionService` | Enforces exact target formats and external ownership without a dual parser or global outage. |
| DS-001 | Primary End-to-End | BEH-001, BEH-006 | Definition author/import | Revisioned atomically persisted/cataloged Org or flat Team | Subject DefinitionService | Exclusive configured model and pre-write validation. |
| DS-002 | Primary End-to-End | BEH-002, BEH-004, BEH-006 | Standalone Team launch | Native Team scope active, coordinator ready/focused | `AgentTeamRunService` / `RootTeamRun` | Preserves independent Team behavior and V2 history. |
| DS-003 | Primary End-to-End | BEH-002, BEH-004, BEH-006 | Valid Org configuration | Complete Org scope active, focus absent | `AgentOrgRunService` / `AgentOrgRun` | Separates activation from communication target. |
| DS-004 | Primary End-to-End | BEH-003, BEH-004 | Mounted Agent handoff/message | Exact same-root AgentRun accepts or request fails closed | Subject root collaboration boundary | Preserves isolation and Team coordinator ingress. |
| DS-005 | Primary End-to-End | BEH-009 | Mounted Agent task command | Exact host task mutation is durably committed; a settlement overlapping active provider work defers without holding the FIFO | Subject root task boundary | Separates task lineage from configured topology and keeps supported task commands live. |
| DS-006T | Primary End-to-End | BEH-005, BEH-008 | Team root mutation/restore | Exact Team V2 package committed/restored | Team run persistence/history owner | Proves Team JSON/path remains native. |
| DS-006O | Primary End-to-End | BEH-005, BEH-008 | Org root mutation/restore | Exact Org V1 package committed/restored | Org run persistence/history owner | Gives Org truthful coordinator-free authority. |
| DS-007 | Primary End-to-End | BEH-007, BEH-008, BEH-010 | Required startup migration attempt | Independently valid current items cataloged; failed items unavailable with restart guidance | App-data migration subsystem + current catalog readiness | Forward-only cutover without a blanket outage or legacy fallback. |
| DS-008 | Return/Event | BEH-005, BEH-009 | Subject-root event/history query | Tagged mixed projection reaches web/history consumer | Subject event publisher + mixed projection facade | Mixed UI cannot infer family. |
| DS-009 | Bounded Local | BEH-003 | Fixed-depth definition graph | Stable root-owned-first compiled handoff snapshot | Collaboration handoff compiler | Preserves current effective order, one rebase, owner separation, and `rules[]` order. |
| DS-010 | Bounded Local | BEH-007 | One Org-like migration item | Valid Org file plus atomic package rename, or preserved failed source | Registered migration definition | Deterministic one-family cutover with ordinary relaunch idempotence. |
| DS-011 | Primary End-to-End | BEH-001, BEH-003, BEH-006 | Definition/handoff draft save | Complete candidate committed once or unchanged with precise errors | Subject DefinitionService / package transaction | Atomic owner-separated authoring. |
| DS-012 | Bounded Local | BEH-002, BEH-006 | Root choices + sparse overrides | Complete immutable settings for all placements | `CollaborationLaunchConfigurationResolver` | Owns fixed-depth precedence. |
| DS-013 | Primary End-to-End | BEH-004, BEH-006 | Exact post-launch row selection/send action | Exact Agent/coordinator focus or blocked no-focus state | AgentOrgExecutionContext / focus controller | Focus stays exact, local, non-durable, and bound to accepted presentation. |
| DS-014 | Bounded Local / Return | BEH-002, BEH-003, BEH-005, BEH-009 | Subject manager has a validated Team/Org package plan | Complete configured Agent/flat-Team scope prepared, durably bound, published, or wholly aborted/fail-stopped | Subject root aggregate over root-neutral execution capabilities | Resolves IDI-001 without a synthetic Team/public generic root. |
| DS-015 | Primary Operational | BEH-002, BEH-005, BEH-008, BEH-009 | General-process construction/restore/shutdown | Subject managers/services registered in order or every rooted Agent input/provider start is fenced, interrupted, settled and released safely | GeneralProcessRunSupervisor + subject roots + AgentRun | Makes stable scope freeze, per-Agent admission/provider-start fencing, interrupt-before-drain, and reverse cleanup explicit. |
| DS-016 | Return/Event | BEH-004, BEH-005, BEH-006 | Raw AgentRun/member input/status event inside AgentOrg | Typed Agent presentation mutates the exact AgentContext or stream enters recovery | Subject callback + `CollaborationAgentPresentationAdapter` + `AgentOrgStreamingService` | Makes the accepted conversation surface consume the same strict presentation semantics as Team. |
| DS-017 | Primary End-to-End | BEH-004, BEH-006 | User focuses an Org member and sends/interacts | Accepted Agent/Team workspace renders and exact Org Agent command is acknowledged | `AgentOrgExecutionContext` + active-target/interaction facade | Reuses production surfaces without a custom dashboard or standalone mounted root. |
| DS-018 | Primary Read/Hydration | BEH-005, BEH-006 | Open/restore/recover active AgentOrg workspace | Complete strict Org context with Agent conversations/statuses and nullable focus is atomically published | AgentOrg member projection/hydration service | Prevents empty/raw UI after restore and preserves trace browsing. |
| DS-019 | Primary Lifecycle/UI | BEH-005, BEH-006 | Operator activates stop on AgentOrg history root row | Whole Org terminates, UI marks root inactive, focus/contexts clean up | AgentOrg run store/service + root history action | Keeps root lifecycle control out of member presentation and forbids mounted-Team stop. |
| DS-020 | Primary Read/Projection | BEH-006, BEH-011 | AgentOrg hierarchy renders an active or historical direct configured Team row | Accessible five-state Team aggregate plus unchanged exact Agent signals | AgentOrg Team-branch presentation projector | Makes exact branch membership, live/history authority, collapsed visibility and lifecycle non-effects explicit. |
| DS-021 | Return/Event | BEH-011 | Strict Agent status snapshot/event mutates one exact AgentContext | Mounted Team aggregate reactively recomputes on the same Team row | AgentOrgExecutionContext + shared Team status fold | Reuses existing Agent truth instead of adding polling or Team status transport. |
| DS-022 | Bounded Local / Operational | BEH-009 | A task record becomes terminal while its execution may still own a provider turn | Settlement performs a non-waiting exact quiescence check; active work defers and retries on idle, while quiescent work uses the existing prepared durable settlement | `RootTaskLifecycleEngine` + subject adapter + AgentRun/local execution | Prevents a supported accept/turn-completion overlap from occupying the FIFO without adding a second lifecycle owner. |
| DS-023 | Primary End-to-End / UI Command | BEH-002, BEH-006, BEH-012 | User opens an admitted AgentOrg launch draft and selectively edits exact placement overrides | Existing AgentOrg launch command carries validated root, Team and Agent sparse patches after accepted progressive disclosure | `agentOrgRunConfigStore` + AgentOrg form projector/command adapter | Reuses the mature Team presentation without merging Team/Org state, payload, lifecycle, or configuration authority. |
| DS-024 | Primary End-to-End / Contract Equality | BEH-002, BEH-013 | User edits runtime/model/model-config at an exact Org placement | Browser preview, GraphQL variables, server effective plan and stored snapshot agree | Org canonical patch mapper + `CollaborationLaunchConfigurationResolver` | Closes omission-versus-null drift without adding API/server inference. |
| DS-025 | Primary Read/Navigation | BEH-005, BEH-006, BEH-014 | App starts or route changes across catalog/config/live/history | One stable Workspaces tree retains existing rows/state and shows Agent Orgs directly below Teams | Mixed workspace-history read model + `WorkspaceAgentRunsTreePanel` | Removes competing route-owned panels while keeping subject runtime/lifecycle distinct. |
| DS-026 | Bounded Local / UI Command | BEH-002, BEH-015 | Fresh Org draft loads an available workspace catalog | Root selects actual Temp Workspace default; placements inherit or apply exact Team override | Shared workspace catalog + Org root config store | Reuses established Team default semantics without hard-coded paths or focus. |

## Primary Execution Spine(s)

- **DS-000 definition admission:** `registered source roots -> DefinitionSourceRegistry ownership classification -> exact Team V2 / Org V1 codec -> dependency availability closure -> available subject catalogs + unavailable diagnostics -> new-work gate`; history bypasses this spine and reads durable snapshots.
- **DS-001 Org definition:** `AgentOrg form/import -> AgentOrg GraphQL -> AgentOrgDefinitionService -> fixed-depth resolver + endpoint/handoff validator -> FileAgentOrgDefinitionProvider definition-package transaction -> Org catalog`.
- **DS-001 Team definition:** `AgentTeam form/import -> AgentTeam GraphQL -> AgentTeamDefinitionService -> Agent-only/coordinator/local-handoff validator -> FileAgentTeamDefinitionProvider definition-package transaction -> Team catalog`.
- **DS-002 standalone Team launch:** `Team Run action -> createAgentTeamRun -> AgentTeamRunService -> TeamLaunchConfigurationResolver -> FlatTeamTopologyPlanner -> AgentTeamRunManager -> RootTeamRun -> coordinator AgentRun -> Team V2 store/history`.
- **DS-003 Org launch:** `Org Run action -> Org configuration draft -> createAgentOrgRun(rootConfiguration, sparse overrides) -> AgentOrgRunService -> CollaborationLaunchConfigurationResolver -> AgentOrgTopologyPlanner -> AgentOrgRunManager/AgentOrgRun -> all direct Agent/Team executions -> Org V1 store; focus=null`.
- **DS-004 handoff/message:** `Mounted Agent tool -> MemberCollaborationContext -> owning RootTeamRun or AgentOrgRun -> subject execution index + recipient resolver -> exact AgentRun or Team coordinator AgentRun`.
- **DS-005 task lifecycle command:** `Mounted Agent tool -> bound root task capability -> RootTaskLifecycleEngine mutation FIFO -> exact subject adapter/host -> task record + tree/sidecar durable mutation -> immediate state/event publication -> FIFO release`; terminal settlement follows DS-022 and never waits for an active provider turn in this lane.
- **DS-006T Team persistence:** `RootTeamRun mutation/restore -> TeamRunPersistenceCoordinator -> strict TeamRunExecutionTreeStore V2 -> Team history/index -> AgentTeamRunManager`.
- **DS-006O Org persistence:** `AgentOrgRun mutation/restore -> AgentOrgRunPersistenceCoordinator -> strict AgentOrgRunExecutionTreeStore V1 -> Org history/index -> AgentOrgRunManager`.
- **DS-007 migration:** `Server startup -> AppDataMigrationRunner.runPending -> registered source-classified definition/runtime migration -> atomic current file/package transform + validation -> runner status/summary/log -> strict subject catalog rebuild -> per-item availability + target admission/dependency diagnostics -> compatible server startup`.
- **DS-008 mixed projection:** `Subject root event or history catalog row -> subject projector/store -> RootExecutionTreeProjection(root_subject_kind) -> strict subject stream/history GraphQL -> Team/Org context -> thin RootExecutionViewStore route/history facade -> workspace/history components`.
- **DS-011 definition/handoff save:** `Complete reversible draft -> update mutation(expectedRevision) -> subject service candidate validation -> per-definition package transaction -> refreshed canonical revision, or typed failure with draft retained`.
- **DS-012 configuration:** `Org definition launch defaults + root draft + exact Team/Agent patches -> fixed-depth address index -> specificity merge -> runtime/model/workspace validation -> complete plan`.
- **DS-013 focus:** `active Org context focus=null -> explicit Agent/Team sidebar row -> strict Org placement/index -> exact AgentRun or Team coordinator -> ActiveAgentWorkspaceTarget/shared surface -> recipient guard; absent/stale focus -> no send`.
- **DS-014 root-neutral execution composition:** `subject manager strict plan -> subject aggregate/adapters -> configured-Agent and flat-Team factories -> AgentRun candidates + staged provider bindings -> subject persistence coordinator -> AgentRun publication -> subject registry + active-root directory`; failure before durability aborts, indeterminate post-durability state fail-stops the subject root.
- **DS-015 process lifecycle:** `server/application scope construction -> AgentRun infrastructure -> explicit locations/directory/factories -> Team manager -> Org manager/general services -> open admission`; each root shutdown is `close external admission -> drain only admitted operation/materialization publication -> freeze stable complete scope -> AgentRun fence every direct/mounted/task Agent (cancel pre-forward or track+interrupt provider-started input through terminal) -> drain task mutations -> persist open-task interruptions -> run existing deepest-first quiescent settlement -> persistence drain -> local finish/unregister`, and process shutdown remains `Org roots -> standalone Team roots -> residual AgentRuns -> reverse release`.
- **DS-016 typed Org Agent event:** `AgentRun event -> root-neutral presentation admission -> AgentOrg subject envelope with exact member identity/sequence -> strict Org WebSocket parse -> AgentOrgExecutionViewState -> dispatchAgentStreamMessage -> AgentContext conversation/status/tool/activity mutation -> AgentEventMonitor`.
- **DS-017 focused interaction:** `Org sidebar exact address -> CollaborationFocusController -> ActiveAgentWorkspaceTarget -> shared AgentWorkspaceSurface or TeamWorkspaceSurface -> accepted AgentUserInputForm/tool card -> AgentInteractionPort -> strict Org command -> AgentOrgRun exact Agent handle -> command acknowledgement/presentation event`.
- **DS-018 Org hydration/recovery:** `active Org route/restore or sequence failure -> Org checkpoint + strict resume snapshot -> Org location-backed member projections/workspaces -> candidate AgentOrgExecutionContext -> expected-sequence stream handshake -> atomic context swap -> accepted workspace`.
- **DS-019 Org termination presentation:** `active Org history root row -> shared root stop action -> AgentOrgRunStore pending guard -> terminateAgentOrgRun -> AgentOrgRun whole-scope shutdown -> lifecycle event/history refresh -> active context cleanup`; no focused-member or mounted-Team stop path exists.
- **DS-020 mounted-Team status read:** `AgentOrg history render -> strict Org execution snapshot -> exact configured Team node -> live AgentOrgExecutionContext status source or existing terminal/history source -> branch-local configured/task Agent enumeration -> shared five-state fold -> TeamAggregateStatusDot + accessible tree item`; Team expansion is not an input.
- **DS-021 status update return:** `AgentRun status event -> root-neutral presentation admission -> strict Org event -> AgentOrgExecutionContext exact AgentContext mutation -> reactive branch fold -> mounted Team dot update`; no API request, Team lifecycle mutation, or focus/routing effect occurs.
- **DS-022 terminal task settlement:** `terminal task record -> existing settlement sweep -> mutation FIFO terminal-leaf revalidation -> tryPrepareTerminationIfQuiescent(exact Agent/task Team) -> active: return false + FIFO release + retry on idle; quiescent: existing prepared settlement -> subject tree/sidecar settledAt durability -> tree/index/event commit -> local finish -> parent resweep`. No settlement closure waits for an active provider turn.
- **DS-023 AgentOrg launch-override presentation:** `admitted AgentOrg detail -> agentOrgRunConfigStore root/team/agent sparse draft -> projectEditableAgentOrgRunFormModel strict fixed-depth projection -> MemberOverridesDisclosure -> TeamMemberConfigTree/TeamScopeConfigEditor/MemberOverrideItem edit commands -> Org command adapter -> existing createAgentOrgRun(rootConfiguration, teamOverrides, agentOverrides) -> server CollaborationLaunchConfigurationResolver`. Projection inconsistency disables Run with an exact error; collapse changes visibility only and never mutates the draft.
- **DS-024 effective configuration equality:** `typed Team/Agent edit -> canonicalizeAgentOrgPlacementLaunchPatch -> one canonical Org draft -> client projection/validation -> exact GraphQL variables -> CollaborationLaunchConfigurationResolver -> complete validation -> Org V1 placement snapshot`. Runtime/model ownership with no owned model config materializes `llmConfig:null`; ordinary omission remains inheritance.
- **DS-025 unified Workspace/history:** `subject-tagged Agent/Team/Org history and active-context rows -> mixed workspace-history projector -> stable workspace/category model -> always-mounted WorkspaceAgentRunsTreePanel -> typed subject select/restore/stop/archive/delete port -> exact subject store/service`. Router changes only center content; left-tree identity and UI state remain.
- **DS-026 workspace default:** `fresh Org draft -> shared workspace catalog ready -> existing root default-selection policy -> actual Temp Workspace record -> Org root draft -> Team/Agent inherited form projection -> existing workspaceRootPath launch validation`. Exact user or Team override wins; missing default blocks without invention.

## Spine Narratives (Mandatory)

| Spine ID | Short Narrative | Main Nodes | Governing Owner | Key Off-Spine Concerns |
| --- | --- | --- | --- | --- |
| DS-000 | Registry classifies source ownership before exact target decoding; valid definitions flow to subject catalogs and invalid/dependent ones become diagnostics without fallback or source mutation. | SourceDescriptor; target codec; admission result; dependency closure | DefinitionAdmissionService | external owner action, diagnostic redaction, catalog invalidation |
| DS-001 | One subject-specific candidate is resolved/validated before a crash-recoverable package commit; only fully valid state enters its catalog. | Definition; DefinitionService; Provider | Subject DefinitionService | source discovery, codecs, revision lock, cache invalidation |
| DS-002 | Team launch validates one flat Team, allocates IDs after configuration coverage, creates native RootTeamRun, persists V2, then exposes coordinator-led interaction. | AgentTeamDefinition; Team plan; RootTeamRun; AgentRun | AgentTeamRunService | workspace prep, ID allocation, Team history |
| DS-003 | Org launch resolves referenced Teams without mutating them, computes full settings, creates one Org scope and all direct placements, persists V1, and returns without focus. | AgentOrgDefinition; Org plan; AgentOrgRun; TeamRun/AgentRun | AgentOrgRunService | Team definition query, workspace prep, activation rollback |
| DS-004 | The mounted Agent sees only its ordered outgoing rules; the owning subject aggregate resolves within its immutable snapshot and Team targets through exact coordinator. | Member context; RootTeamRun/AgentOrgRun; execution index; AgentRun | Subject root aggregate | address parser, instruction renderer, message persistence |
| DS-005 | Each delegate/submit/review/interrupt command authorizes the exact caller and serializes only its record/tree/sidecar mutation plus immediate publication; recursive task descendants stay task records and cleanup is delegated to DS-022. | Task engine; mutation FIFO; TaskRootAdapter; HostScope; TaskExecution | Subject root task boundary | run IDs, reference files, notification, settlement scheduling |
| DS-006T | Team mutations and restore pass only through strict V2 schema/store; flat Team snapshots never move or acquire Org fields. | Team V2 file; Team package; RootTeamRun | Team persistence coordinator | atomic writer, Team history, memory layout |
| DS-006O | Org mutations and restore pass only through strict V1 schema/store; root has no coordinator/focus and direct Teams remain flat. | Org V1 file; Org package; AgentOrgRun | Org persistence coordinator | atomic writer, Org history, memory layout |
| DS-007 | Startup deterministically classifies source ownership, converts only server-owned supported items, performs zero writes for flat runtime, records bounded runner dispositions, and rebuilds strict current catalogs; invalid items remain unavailable while compatible work starts. | RegisteredMigration; atomic writer/rename; runner result; strict catalog readiness | App-data migration subsystem | source ownership, capped diagnostics, restart guidance |
| DS-008 | Each subject publisher/projector preserves its native snapshot; a thin mixed facade attaches/checks root kind and clients reduce the correct union branch. | Subject event/snapshot; tagged DTO; web view | Subject publisher + projection facade | WebSocket recovery, generated clients, selectors |
| DS-011 | Save sends the whole draft and expected revision; current members and every ordered handoff validate under the owning subject before one normal-authoring package transaction. | Draft; candidate validator; definition revision | Subject DefinitionService | endpoint catalog, accessible reorder, atomic publication recovery |
| DS-012 | Resolver seeds root, overlays Team placement then exact Agent, validates all placements, and freezes plan before activation or IDs. | Root config; PlacementOverride; EffectivePlan | LaunchConfigurationResolver | runtime/model catalogs, workspace normalization |
| DS-013 | Org view begins unfocused; only explicit row action maps through the selected union branch to an AgentRun/coordinator; send stays blocked otherwise. | RootExecutionView; FocusTarget; AgentRun | Web focus controller | responsive sidebar, hydration, history row semantics |
| DS-014 | A subject root assembles strict state and adapters, prepares every required Agent/local Team without publication, commits its own package/bindings, then publishes/registers the complete scope or aborts/fail-stops it as one root. | Subject root; ConfiguredAgentExecutionHandle; Flat Team execution; subject persistence | RootTeamRun or AgentOrgRun | AgentRun candidates, memory locator, platform binding, active-root directory |
| DS-015 | Process composition constructs dependencies from provider/runtime infrastructure upward. On shutdown each subject root closes its operation/publication gate, freezes a stable complete scope, and invokes the AgentRun-owned input/provider-start/interrupt fence recursively before task drains; process teardown then proceeds in reverse root-ownership order so embedded Org Teams never appear in the Team root registry. | GeneralProcessRunSupervisor; subject roots; frozen Team/Org scopes; configured-Agent handles; AgentRun; task engines; subject managers; active-root directory | GeneralProcessRunSupervisor + subject root lifecycle owners + AgentRun input/lifecycle owner | application-scope Team-only specialization, idempotent fence, canonical input cancellation/interrupt facts, aggregate error collection |
| DS-016 | Every internal Org Agent event crosses one validating presentation adapter, one subject envelope and one strict web reducer before the existing Agent handlers mutate conversation/status/tool state. | AgentRun; presentation adapter; Org publisher/projector; Org stream state; AgentContext | AgentOrg subject event boundary | payload schemas, sequence recovery, token usage adapter |
| DS-017 | Exact Org focus creates one tagged active workspace target; shared Agent/Team surfaces and their composer/tool actions call only its subject interaction port. | Focus controller; ActiveAgentWorkspaceTarget; shared workspace surface; AgentInteractionPort; AgentOrgRun | AgentOrgExecutionContext / active-context facade | header action adapter, file/activity/token scopes, a11y |
| DS-018 | Open/restore/recovery hydrates a complete candidate Org context from strict snapshot locations and member projections, verifies checkpoint/stream base and swaps it atomically. | Org resume query; location service; member projections; context factory; candidate stream | AgentOrgRunContextHydrationService | workspace activation, active trace pages, recent-event baseline |
| DS-019 | Root history owns the visible Org stop action and pending/error state; server termination stops the entire aggregate and clears the active presentation target. | Org history row; AgentOrgRunStore; GraphQL service; AgentOrgRun; lifecycle reducer | AgentOrg lifecycle owner | toast/error, history refresh, focus cleanup |
| DS-020 | Org hierarchy projects one configured Team from the complete strict branch and exact live/history Agent statuses, folds them once, and renders one accessible dot independently of expansion. | Org snapshot; configured Team; Agent status source; branch adapter; shared fold/dot | AgentOrg Team-branch presentation projector | status normalization, localization/a11y, visual status grammar |
| DS-021 | An exact Agent status event mutates its AgentContext and Vue reactivity recomputes only the containing Team's display aggregate without a Team event or status request. | strict Org event; AgentOrgExecutionContext; exact AgentContext; branch fold; Team row | AgentOrgExecutionContext + Team branch presentation | stream sequence, render scheduling, collapse visibility |
| DS-022 | A terminal record schedules the existing sweep. The FIFO closure revalidates the leaf and asks the exact Agent/task Team to prepare only if already quiescent. `null` releases the FIFO and idle events retry; a prepared execution uses the existing durable settlement and cleanup transaction. | terminal record; mutation FIFO; subject adapter/persistence; AgentRun/task Team; idle event | RootTaskLifecycleEngine with subject TaskRootAdapter | atomic quiescence check, prepared cancellation, fail-stop, deepest-first child eligibility |
| DS-023 | The Org form owns its root and exact sparse patches, projects one strict Team level into the accepted Team launch view models, and translates edit commands back to the exact Org patch map before invoking the unchanged Org launch API. | Org route; Org config store; fixed-depth projector; shared disclosure/Team editors; Org command adapter; GraphQL launch | `agentOrgRunConfigStore` and `AgentOrgRunConfigPanel` command boundary | Team definition query, workspace selection, validation/error presentation, responsive/a11y state |
| DS-024 | One canonical placement patch gives browser preview and the existing server resolver the same omission/null semantics, so the validated request and stored execution cannot diverge. | Team/Agent edit; canonical patch; form projector; GraphQL variables; server resolver; run snapshot | AgentOrg config store/command boundary; server remains authoritative resolver | runtime/model catalog, config-schema compatibility, scoped errors |
| DS-025 | One mixed tagged workspace read model adds Agent Orgs beneath Teams and drives the same mounted left tree through every route; typed ports delegate commands to exact subject owners. | strict subject histories/contexts; mixed projector; workspace section model; stable panel; subject action port | Workspace history presentation owner | expansion/selection/scroll, family-scoped error, root lifecycle delegation |
| DS-026 | A fresh Org root reuses the established Team root workspace selector policy; descendants project inheritance and exact Team overrides without choosing independent defaults. | workspace catalog; default policy; Org root draft; Team/Agent projection; launch command | shared workspace catalog + AgentOrg config store | unavailable default, explicit-choice stability, no-focus boundary |

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
- `AgentRun`: exact input admission, claim/provider-start serialization,
  canonical turn lifecycle, ordinary prepared termination, non-waiting
  quiescence preparation, and the irreversible root-shutdown fence.
- `FlatTeamExecutionFactory`: one local Agent-only Team plus task descendants beneath an explicit Team or Org root; no root package/registry.
- Frozen Team/Org termination scopes: immutable recursive enumeration of every
  direct/task/prepared Agent handle after materialization publication closes;
  they invoke but never implement the AgentRun fence.
- `RootTaskLifecycleEngine`: common task record policy, one mutation FIFO,
  terminal sweep, and existing deepest-first settlement policy. Settlement
  proceeds only after a non-waiting local quiescence preparation succeeds.
  `RootCommunicationEngine` retains message record/reservation policy.
- `ActiveCollaborationRootDirectory` / `CollaborationExecutionLocationService`: process-owned compound live capability lookup and strict two-family physical location projection; neither owns a root lifecycle.
- `GeneralProcessRunSupervisor`: explicit construction/admission/shutdown ordering across AgentRun, Team root and Org root managers.
- `TeamRunExecutionTreeStoreV2` / `AgentOrgRunExecutionTreeStoreV1`: strict
  subject stores over shared record validators.
- `RootRunPackageReadinessIndex`: current-only family/path/manifest inventory;
  rejects cross-family ID collisions and retired root-authority residue before a
  root can enter restore/history/stream catalogs, without decoding old content.
- `RootExecutionProjectionService`: thin explicit-kind read/projection facade for
  mixed history/stream/workspace; owns no lifecycle or persistence.
- `CollaborationAgentPresentationAdapter`: root-neutral validation and
  normalization of raw Agent callbacks; subject serializers retain root/sequence
  ownership.
- Web `AgentOrgExecutionContext` / `CollaborationFocusController`: one strict
  Org browser aggregate, per-Agent AgentContexts, mounted-Team presentation,
  checkpoint recovery and exact nullable focus.
- Web `ActiveAgentWorkspaceTarget`, `AgentWorkspaceSurface` and
  `TeamWorkspaceSurface`: exact interaction/browse/action ports and accepted
  rendering shared across standalone and Org wrappers; no subject lifecycle.
- Web `AgentOrgTeamBranchStatusProjector` / `TeamAggregateStatusDot`: exact
  configured-Team branch traversal plus pure five-state fold/accessible rendering;
  no status, lifecycle, transport, polling or persistence authority.
- Web `agentOrgRunConfigStore` / `projectEditableAgentOrgRunFormModel`: sole
  AgentOrg launch-draft owner plus pure strict projection into the accepted Team
  presentation models; no Team store, effective server configuration, or
  definition mutation authority.
- Web `MemberOverridesDisclosure`, `TeamMemberConfigTree`,
  `TeamScopeConfigEditor`, and `MemberOverrideItem`: accepted presentation and
  edit-command components. They own disclosure/a11y/visual language only; the
  caller owns exact draft state and command translation.
- Web `RootExecutionViewStore`: thin mixed route/history facade over subject
  contexts; no raw event list or duplicate Org focus/tree.
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
| RootTaskLifecycleEngine | Task records, authorization/notification policy, one FIFO, terminal sweep, child eligibility, non-waiting settlement deferral and existing prepared settlement invocation | Waiting on non-quiescent provider turns, subject tree/index/store/event, root lifecycle/registry |
| AgentRun / local task execution | Atomic `tryPrepareTerminationIfQuiescent`; irreversible root-shutdown admission/provider-start/interrupt fence; existing prepared termination; exact input/provider/turn lifecycle | Task record state, subject persistence, root-scope enumeration or process shutdown policy |
| Frozen Team/Org termination scopes | Stable enumeration and recursive invocation of the AgentRun root-shutdown fence across direct, mounted, task, and prepared executions | Agent input state, provider interrupt implementation, task record persistence, mounted-Team root authority |
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
| Web `agentOrgRunConfigStore` | AgentOrg root draft; exact Team/Agent sparse launch patches; Team workspace selections; validation/projection/launch error state | Team run draft/payload, effective server resolution, disclosure state, Team definition mutation |
| `projectEditableAgentOrgRunFormModel` | Pure fixed-depth admitted Org-to-Team-presentation projection, exact Agent count, coordinator correlation and projection diagnostics | Store writes, GraphQL serialization, override inheritance authority, nested configured Teams |
| `MemberOverridesDisclosure` + accepted Team editors | Disclosure/a11y/visual presentation and typed edit events over caller-provided Team/Agent form nodes | AgentOrg or Team store ownership, patch identity, API payloads, lifecycle |
| CollaborationAgentPresentationAdapter | Validate/normalize raw AgentRun/member-input/status/readiness into closed presentation or filter/reject | Subject root/sequence envelope, browser state, rendering |
| AgentOrgExecutionContext / context store | Strict Org view/tasks/messages/status, exact AgentContexts, mounted-Team presentation, nullable focus, hydration/stream phase and atomic recovery | Durable topology mutation, standalone Team registration, raw event journal |
| ActiveAgentWorkspaceTarget / AgentInteractionPort | Exact focused Agent context, subject command/browse/action adaptation | Implicit focus, root lifecycle, component socket access |
| TeamWorkspaceContextView | Read-only Team member/status/task/message presentation in either standalone or Org host | Team root registration/persistence/restore/stop |
| AgentWorkspaceSurface / TeamWorkspaceSurface | Accepted header/status/event monitor/composer rendering from explicit ports | Subject stores, GraphQL/WebSocket, protocol parsing, root lifecycle |
| AgentOrgTeamBranchStatusProjector | Exact one-Team configured/task Agent identity traversal and live/history status-source admission | Agent state, visible-row filtering, sibling/root topology, lifecycle, transport, polling, persistence |
| TeamAggregateStatusFold / Dot | Pure normalization/precedence and accessible five-state Team signal | Subject topology, store/context lookup, root activity/lifecycle, commands |
| Web RootExecutionViewStore | Tagged route/history subject delegation | Second Org tree/focus/events, direct Agent command, durable focus, family inference |

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
| Mixed/Org stream handler | Org projector/publisher + AgentOrgRun command boundary | Frame strict snapshots/events/acks and map exact commands | Raw payload pass-through, task/message state ownership, focus fallback |
| Agent definition tools | Subject DefinitionService | Agent-callable serialization | Alternate validation/compatibility parser |
| Web handoff primitives | Subject draft adapter | From/To/When presentation and reversible commands | Endpoint policy/persistence/cross-owner mutation |
| Web Org config/focus components | Org config store / AgentOrgExecutionContext | Approved interactions and exact shared-surface selection | Server precedence, durable focus, raw protocol rendering, fallback |
| Agent/Team workspace wrappers | ActiveAgentWorkspaceTarget + shared surfaces | Adapt standalone or Org subject context/actions without duplicate rendering | Subject-agnostic socket logic, root lifecycle, copied Org dashboard |
| AgentOrg history root row | AgentOrgRunStore/Service + Team-branch presentation projector | Present root stop plus exact Agent/Team hierarchy status/navigation | Own Agent status, mounted-Team lifecycle, status transport/polling or fold policy |
| TeamAggregateStatusDot | Pure shared fold/status-dot presentation | Reuse one visual/a11y contract in Team and Org rows | Traverse subject topology or resolve status state |
| AgentOrg launch-override form adapter | `agentOrgRunConfigStore` + strict Org form projector | Adapt an Org-owned sparse draft to accepted Team disclosure/edit components and back to exact Org launch fields | Import Team run store/payload, compute authoritative effective configuration, silently omit invalid Team refs, or clone Team definitions |

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
| `FrozenTeamRunTerminationScope.interruptActiveTurns()` and `ConfiguredAgentExecutionHandle.interruptForRootTermination()` active-turn-only success wrapper | It treats pre-`TURN_STARTED` admitted/provider-started input as safely interrupted and can let work start after the phase. | `fenceAgentRunsForRootShutdown()` -> `AgentRun.fenceInputAndInterruptForRootShutdown()` | Clean-cut rename/replacement; ordinary user interrupt API remains unchanged. |
| Injected `AgentOrgExecutionActivator` / placeholder Org run | Hides missing root ownership and cannot prove production composition. | Explicit `AgentOrgExecutionScopeBuilder` and aggregate adapters | No catch-all activator remains. |
| Team-only task/message sidecar reuse for Org | Root identity/envelope would be false and fail-closed restore impossible. | Strict Org sidecars over identical record arrays | Team sidecars remain exact. |
| Treating `RootTeamRun`/`AgentTeamRunManager` as Org owner | Org is not Team. | New AgentOrgRun/Manager/Service | Preserve RootTeamRun/Team manager for native Team. |
| Root-generic V3 schema/store/path proposal | Superseded by RER-016 and violates native Team contract. | Exact Team V2 + exact Org V1 stores/paths | No `collaboration_runs` directory or Team rewrite. |
| Inferring root kind from coordinator/member/version | Two families must fail closed. | Explicit tagged catalog/location and strict store dispatch | No “try both” reader. |
| Recursive Team-specific LLM hierarchy prose | Agents must see Org/flat-Team truth. | Root-kind-aware renderer over canonical address parser | String address format stays unchanged. |
| Team UI Team selector/nested counts/warnings | Team authoring cannot advertise Teams. | Agent-only Team UI + separate Org UI | Task lineage still renders Team task nodes. |
| Org `entryAddress` selector/input/result and initial focus fallback | Activation and targeting are separate. | Org config command + full activation + nullable focus | No ignored compatibility field. |
| Org focus repair to coordinator/first Agent | Org has no default recipient. | Clear invalid focus and block recipient action | Standalone Team coordinator-first remains. |
| Raw AgentOrg `events[]`, opaque DTO event, `any` render casts and `JSON.stringify` event fallback | Protocol envelopes are not a conversation model and violate failure-closed projection. | Strict presentation admission/envelope + AgentOrgExecutionContext + AgentContext handlers | Reject/recover an unknown event; never retain a hidden diagnostic dashboard fallback. |
| Bespoke AgentOrg focused header/event cards/composer and direct send-only store call | Duplicates accepted Agent/Team ownership and loses context-file/interrupt/tool behavior. | Store-neutral Agent/Team surfaces + exact ActiveAgentWorkspaceTarget/AgentInteractionPort | Org view retains only null prompt and exact surface selection. |
| Member-header `Stop Org` and any mounted-Team terminate action | Focused member/Team is not the root lifecycle owner. | Active AgentOrg history root-row stop/pending/error | Standalone Team members-panel confirmation remains unchanged. |
| Duplicate Org tree/focus/raw-event state in RootExecutionViewStore | Creates two browser authorities and prevents atomic hydration/recovery. | AgentOrgExecutionContext + thin mixed route/history facade | Mixed store may hold route/connection handles only. |
| Configured-nesting-specific Team aggregate component/helper names and duplicated precedence ownership | The aggregate now serves retained Team history and direct Teams mounted under Org; copying it would drift. | `TeamAggregateStatusDot.vue`, `workspaceTeamAggregateStatus.ts`, subject-shaped traversal adapters | Clean rename/import/test/localization update; no alias wrapper or second fold. |
| Mounted-Team branch in `AgentOrgPlacementOverrideRow` and the always-exposed child hierarchy | It duplicates the accepted Team launch editor, represents a Team as a fabricated Agent-like node, hides inherited state, and violates approved progressive disclosure. | `projectEditableAgentOrgRunFormModel` -> `TeamMemberConfigTree` / `TeamScopeConfigEditor` / `MemberOverrideItem`; retain or rename the old component only as an Agent-only direct-Org row. | Remove the Team-kind prop/branch and old layout cleanly; no feature flag, alternate legacy layout, or compatibility wrapper. |
| `agentOrgRunStore.history`, `historyError`, and `fetchHistory` | A subject command store plus the route-selected panel currently form a second web history authority and duplicate the mixed Workspace owner's refresh/state. | `runHistoryStore` owns the strictly parsed Org history slice and family-scoped read errors; successful Org commands request its refresh through the caller/action adapter. | Keep Org launch/restore/terminate commands in `agentOrgRunStore`; remove only read-history state and internal refresh side effects. No store-to-store lifecycle import. |
| Nested configured-Team supported fixtures/docs | Assert rejected target model. | Org fixed-depth + negative Team nesting fixtures | Convert rather than keep as alternate mode. |
| Stale generated `.js` test/source mirrors, where repository convention confirms they are artifacts | Can retain obsolete inputs. | Canonical TypeScript sources/build output | Verify convention before deletion. |

## Return Or Event Spine(s)

- **DS-008 Team event:** `ConfiguredAgent/task/message neutral body -> private Team adapter -> RootTeamRun/Team
  projector -> compatible Team stream and/or tagged mixed adapter -> web reducer`.
- **DS-008/DS-016 Org event:** `ConfiguredAgent raw event -> CollaborationAgentPresentationAdapter -> private Org adapter/publisher -> strict AgentOrg presentation envelope -> AgentOrgStreamingService -> AgentOrgExecutionViewState -> dispatchAgentStreamMessage -> exact AgentContext`. Root task/message events update the strict Org view separately. No opaque event list reaches a component.
- **DS-021 Team aggregate update:** an already-admitted exact Agent status mutation returns into the mounted-Team presentation fold. The fold reads the full strict branch, so a hidden descendant can update a collapsed Team dot without materializing hidden rows or emitting a Team event.
- **DS-004 exact-Agent route:** `GlobalAgentRunMessageRouter -> sender/target MemberExecutionContext tagged-root comparison -> ActiveCollaborationRootDirectory -> owning root message boundary -> exact Agent reservation/sidecar/event result`.
- **History result:** `TeamHistoryStore + AgentOrgHistoryStore ->
  RootRunHistoryCatalogService merge/check -> tagged GraphQL result -> web
  history navigation`.
- **Definition result:** `DefinitionPackageTransaction commit -> DefinitionService
  -> GraphQL canonical result/revision -> subject store/form`.
- **Migration result:** `bounded dispositions -> existing runner summary/log/status
  -> strict current catalog availability -> RESTART_TO_RETRY for failed startup-only work`.
- **Focus result:** `explicit sidebar selection -> exact ActiveAgentWorkspaceTarget -> shared Agent/Team workspace and composer -> subject interaction port; clear/invalid focus -> prompt and blocked send without changing root lifecycle`.
- **Org command result:** `accepted composer/tool/interrupt action -> AgentInteractionPort -> strict Org client command -> exact AgentOrgRun member handle -> command acknowledgement plus typed presentation event -> existing UI state handlers`.
- **Org stream failure result:** `schema/correlation/sequence rejection -> reopen_required -> checkpointed complete context hydration -> candidate snapshot barrier -> atomic context swap`; raw payload is never displayed.
- **Org termination result:** `history root stop -> pending guard -> whole-root terminate -> lifecycle/history/context cleanup`; no member or mounted-Team terminate path.
- **DS-023 Org launch-draft result:** typed Team/Agent edit event -> exact Org patch mutation -> pure reprojection -> stable disclosure/state label; Run -> existing Org GraphQL result/error -> active unfocused Org or retained draft with scoped errors. No Team run draft or definition is mutated.
- **DS-024 launch result:** canonical GraphQL variables -> server resolution/validation -> success returns one Org ID and later strict snapshot shows the identical effective placement, or typed rejection returns to the exact draft field. No browser/server repair or alternate inheritance occurs.
- **DS-025 history update:** subject history/active-context update -> tagged row merge -> same workspace/category node updates reactively; the panel, expansion, selection and unrelated rows stay mounted. A family-scoped error decorates the retained model rather than replacing it.
- **DS-026 default result:** eligible catalog row -> root draft selection -> form reprojection shows the same inherited workspace at mounted scopes; explicit user edit returns through the same root/Team command path and never changes focus.

## Bounded Local / Internal Spines

- **DS-014 configured scope activation:** `construct subject aggregate/adapters -> materialize root-direct handles and local flat Teams -> prepare configured AgentRun candidates in canonical address order -> collect/apply provider bindings to candidate tree -> strict subject package commit -> publish candidates -> register subject root/directory`; pre-durability failure aborts in reverse, post-durability indeterminacy fail-stops the whole root.
- **DS-005 root-neutral task command:** `bound member capability -> root-neutral mutation FIFO -> subject TaskRootAdapter authorize/resolve exact host -> prepare task mutation -> subject tree+sidecar durability -> immediate local state/event publication -> FIFO release`; no tool resolves a root aggregate and no provider-dependent cleanup runs in the command closure.
- **DS-022 terminal task settlement:** `terminal record -> existing sweep/leaf gate -> mutation FIFO -> tryPrepareTerminationIfQuiescent -> null and immediate FIFO release, or existing prepared settlement -> subject settledAt tree/sidecar durability -> tree/index/event commit -> local finish -> parent resweep`. A parent cannot settle before open children; active provider work is never awaited at the FIFO head.
- **DS-004 root-neutral accepted message:** `bound delivery callback -> owning root authorization/address resolution -> exact receiver reservation -> subject message-sidecar durability -> input commit -> subject event`; Team and Org use distinct envelopes/publishers.
- **DS-015 root termination:** `close external task/message/command admission -> close+drain only admitted operation/materialization publication -> freeze root host/direct handles/mounted Teams/task/prepared descendants -> recursively fence every AgentRun -> cancel never-forwarded input or track provider-started input -> interrupt active or newly-started canonical turn -> require terminal fence completion -> drain task mutations -> durably interrupt remaining open task records -> run existing deepest-first quiescent settlement -> drain persistence -> finish remaining local teardown -> root directory/manager unregister -> publisher clear`. No general task FIFO/settlement drain precedes the Agent fence, and no provider start may cross a completed fence.
- **DS-016 presentation admission:** `CollaborationAgentExecutionEvent + exact tagged member identity -> validate/normalize raw AgentRun or member-input/status/readiness variant -> filter collaboration duplicate or return strict AgentPresentationMessage -> subject serializer`; rejection becomes one typed stream failure/recovery signal, never JSON text.
- **DS-017 active workspace target:** `strict focus address -> exact Org placement/run lookup -> direct-Agent or mounted-Team-member target -> bind AgentContext + AgentInteractionPort + browse subject + optional TeamWorkspaceContextView -> render shared surface`; clearing/root stop atomically invalidates the target.
- **DS-018 candidate recovery:** `read Org checkpoint -> hydrate strict tree/tasks/messages/member projections -> create candidate contexts -> read checkpoint again -> require no open work/same sequence -> connect expected snapshot -> swap -> dispose failed stream/context`.
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
- **DS-023 form projection/edit loop:** `strict admitted Org + referenced flat Teams + Org draft -> project exact one-level Team/Agent view nodes and count -> render accepted disclosure/editor -> typed edit/reset -> mutate only exact teamOverrides[address] or agentOverrides[address] -> reproject`. Invalid reference/coordinator/address correlation returns a blocking projection diagnostic; it never omits a row.
- **DS-024 canonical patch:** `incoming typed patch -> preserve owned fields -> if runtime/model owned and llmConfig absent, own llmConfig:null -> freeze/store -> idempotent serialization assertion`. Reset removes the patch; no second raw representation exists.
- **DS-025 category projection:** `tagged rows grouped by workspace -> existing Agent categories -> Teams roots -> Agent Orgs roots -> remaining established categories`. Category order is deterministic and independent of current route.
- **DS-026 fresh-root selection:** `catalog ready + fresh untouched Org draft -> find actual eligible default record -> set root selection once`, otherwise return no selection/actionable error. Descendant baselines read root plus exact Team override; no descendant default operation runs.

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
| Agent presentation schemas/adapter | DS-008, DS-016-DS-018 | Team and Org subject publishers plus web stream reducers | Strict root-neutral presentation details, raw AgentRun admission, subject serialization | Prevents protocol envelopes/unknown payloads/JSON formatting from entering Vue components. |
| AgentOrg context hydration/recovery | DS-016-DS-018 | Org route/store and accepted event monitor | Strict resume/member projections, workspace resolution, checkpointed candidate context swap | Prevents tree, AgentContext and raw event arrays becoming competing browser authorities. |
| Active workspace target/interaction facade | DS-013, DS-017-DS-019 | Shared Agent/Team center and right-tool components | Exact AgentContext, optional Team presentation view, browse identity, command port | Prevents reusable components from reading both subject stores/sockets or registering mounted Teams as roots. |
| Root termination action | DS-019 | Org/Team history presentation | Root-row stop placement, pending guard, error presentation | Keeps lifecycle out of focused member header and mounted-Team scope. |
| Team aggregate status policy | DS-020, DS-021 | AgentOrg and retained Team hierarchy presentation | Normalize/fold five Agent states and render one accessible Team dot; subject adapters provide exact branch/status source | Prevents duplicated precedence/a11y policy and any temptation to persist/poll a Team status. |
| Terminal task settlement | DS-005, DS-015, DS-022 | Team/Org root task owners plus AgentRun/local execution | Atomically try to prepare only a quiescent exact execution; defer without side effects or waiting and retry on existing idle events; keep the existing durable prepared-settlement transaction | Prevents a supported provider-turn overlap from starving unrelated commands without creating a second cleanup owner; root interrupt releases legitimate approval waits before shutdown drain. |
| AgentOrg launch form projection | DS-003, DS-012, DS-023 | Org config store and accepted Team editor components | Convert strict fixed-depth Org/Team definitions plus exact sparse patches into Team presentation nodes/count/state and typed edit commands | Prevents a second Team editor while keeping Org state/API ownership distinct. |
| Canonical Org launch patch | DS-012, DS-023, DS-024 | Org config store/projector/command adapter | Preserve one sparse intent representation; materialize dependent config clear; assert client/server/snapshot equivalence | Prevents omission/null drift or duplicated resolver semantics. |
| Unified Workspace history | DS-008, DS-013, DS-019, DS-025 | Mixed history projector and stable left panel | Ordered tagged categories, retained UI state and typed root actions | Prevents route-specific competing history/runtime owners and false disappearance. |
| Root workspace selection | DS-003, DS-012, DS-026 | Shared workspace catalog/policy and Org root draft | Select actual available default once; preserve explicit choice and exact inheritance | Prevents hard-coded paths and descendant defaults. |
| UI accessibility/presentation | DS-001-DS-003, DS-008, DS-011-DS-013, DS-023-DS-026 | Web owners | Approved Product packages plus RER-024 continuity/default/equality, focus, narrow, keyboard, disclosure and validation | Prevents mock/prototype orchestration entering domain and preserves the established AgentTeam interaction grammar. |

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

`AgentOrgExecutionContext` is the sole browser owner of one active Org
snapshot, its per-Agent `AgentContext` map, mounted-Team presentation adapters,
stream sequence/recovery and nullable focus. `rootExecutionViewStore` may expose
mixed route/history selectors over that context but cannot retain another Org
tree or opaque events. `useActiveContextStore` is the authoritative component
facade for the exact active presentation target and interaction port. Center and
right-side components cannot call subject stores, stream services or sockets
beside that facade. `AgentOrgWorkspaceView` is a thin focus router, not a
conversation/event/root-lifecycle owner.

The server Agent presentation boundary sits between raw Agent execution and
subject publication. The root-neutral adapter owns raw-event validation and
normalization; Team/Org serializers own outer root/sequence/identity fields.
Neither Vue nor a browser store accepts raw AgentRun domain objects. The Org
member projection service reads through exact Org locations; it never calls the
Team member service for a mounted Team.

The Team V2 store and Org V1 store are both current. A mixed projection facade
requires explicit kind and routes to the corresponding subject query/manager or
history store; it cannot scan paths, inspect coordinator presence, or try both
validators. The migration alone may decode organization-like Team Run V2 and
server-owned retired recursive definitions.

Configuration and focus are separate. The server resolver owns effective launch
settings and complete activation. Web focus is local, nullable for Org, exact,
and absent from both durable families. An exact member history row selection may
focus because the row click is explicit; a root open remains unfocused.

AgentOrg and AgentTeam launch drafts also remain separate even where their Team
presentation is identical. `agentOrgRunConfigStore` is the only owner of the Org
root draft and exact Team/Agent sparse maps. Its pure projector may read admitted
Team definitions and emit the existing Team form view models, but the shared
disclosure/edit components receive only values and typed commands. They cannot
import either run-config store. The Org command adapter alone translates those
commands and serializes the existing Org `teamOverrides` / `agentOverrides`
input. `teamRunConfigStore`, `TeamRunConfig`, and Team launch serialization are
not dependencies of the Org path.

Within that Org path, `agentOrgRunConfigStore` accepts only canonical placement
patches. `canonicalizeAgentOrgPlacementLaunchPatch` is the singular owner of the
dependent model-config clear rule; `AgentOrgRunConfigPanel` does not hand-roll
object spreading and the shared Team editor does not decide wire semantics.
The pure form projector and launch serializer consume the same canonical map.
The server resolver remains an independent authoritative validator, and
cross-layer fixtures prove semantic equality rather than coupling web code to a
server implementation.

Workspace/history presentation is a separate read-model boundary. One mixed
workspace-history projector owns grouping and explicit category order; one
always-mounted `WorkspaceAgentRunsTreePanel` owns left-tree presentation state.
Subject histories and active contexts supply tagged rows, while typed action
ports delegate lifecycle back to Agent, Team, or Org stores. The unified read
model never owns an AgentOrg execution context or root lifecycle, and the router
never selects a different history owner. `AgentOrgRunHistoryPanel` is removed.

The workspace catalog owns available workspace records and default eligibility.
The AgentOrg config store owns the root's selected draft record/path. The shared
selector applies the existing root-only default policy; descendant Team/Agent
editors receive projected effective workspace and cannot independently default
or mutate the root.

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
| RootTaskLifecycleEngine / RootCommunicationEngine | Task mutation/settlement policy and message lifecycle policy | Subject adapters owned privately by root aggregate | Engine imports subject tree/store/manager; settlement waits on a non-quiescent execution; caller holds an internal owner beside root | Strengthen the subject adapter and AgentRun non-waiting preparation; never expose internal owners publicly. |
| ActiveCollaborationRootDirectory | compound live root -> narrow message/query capability | Subject managers register; global router reads | Directory creates/stops roots or returns concrete aggregate; bare ID lookup | Require `RootExecutionIdentity`; keep lifecycle in manager. |
| CollaborationExecutionLocationService | explicit Team/Org Agent location projection | memory/context/run-file/identity services | Try-both inference or direct Team-only scan for mixed Agent | Require compound root for root-scoped queries and enforce unique AgentRun result. |
| Team V2 store / Org V1 store | exact schema/path/atomic writer | Respective persistence coordinator, migration target validator | Runtime reads JSON or wrong family | Add strict subject method. |
| RootRunPackageReadinessIndex | family/path/target-manifest readiness and compound identity availability | subject run services, history/stream catalog rebuild | Decode legacy content, transform packages, or invoke both stores | Add `requireAvailable(kind,id)` and current-only rebuild methods. |
| RootExecutionProjectionService | explicit-kind dispatch and tagged DTO | mixed history/stream/GraphQL | Infer kind or mutate root | Add explicit compound identity/result branch. |
| CollaborationAgentPresentationAdapter | Validate raw AgentRun/member input/status/readiness and produce strict presentation message or rejection | Team/Org subject callback adapters | Subject/projector/component parses raw AgentRun payload independently | Extend one strict presentation type/adapter and subject serializer. |
| AgentOrgExecutionContext / AgentOrgStreamingService | Strict Org topology/tasks/messages/statuses, AgentContext map, sequence/recovery, nullable focus | Org route/history/focus and active-target resolver | Root store also retains tree/raw events; component owns socket/parser | Add context-owned selectors/commands and checkpointed candidate replacement. |
| ActiveAgentWorkspaceTarget / useActiveContextStore | Exact active AgentContext, interaction port, browse subject and optional Team presentation view | Agent/Team shared center and right-tool components | Component imports Org/Team run stores, contexts and stream directly | Strengthen subject adapters behind the facade. |
| Shared AgentWorkspaceSurface / TeamWorkspaceSurface | Accepted header/event monitor/composer presentation over explicit props/ports | Standalone wrappers and AgentOrg focus adapter | Surface reads global subject selection/store or renders raw payload | Add explicit presentation/action/interaction inputs. |
| AgentOrg history root stop action | Whole-root termination UI command/pending/error | Active Org root row | Focused member header or mounted Team action terminates root | Reuse history root action pattern and AgentOrgRunStore. |
| AgentOrgTeamBranchStatusProjector | Exact configured Team branch traversal plus live/history status-source admission | AgentOrg hierarchy row builder only | Component scans visible rows, includes sibling/root branches, reads stores directly, or invents Team status state | Require exact Team node and injected `statusForAgentRunId`; delegate normalization/precedence to shared fold. |
| TeamAggregateStatusDot / fold | Pure five-state normalization, precedence and accessible dot grammar | Team-history and AgentOrg branch adapters | Own topology, transport, polling, root lifecycle or subject-store lookup | Keep inputs to values + authority; subject adapters remain authoritative for membership/source. |
| `agentOrgRunConfigStore` + Org form command adapter | Org root/Team/Agent sparse draft, exact patch commands, existing GraphQL serialization and scoped errors | AgentOrg launch route and form | Import Team run store/payload, mutate Team definition, treat disclosure as state authority, or compute server-authoritative effective plan | Add exact address-scoped Team/Agent commands and one launch-input projection. |
| `projectEditableAgentOrgRunFormModel` | Strict one-level presentation projection, exact Agent count, Team/coordinator/member correlation and diagnostics | AgentOrgRunConfigPanel | Write a store, silently omit invalid references, create nested nodes, or serialize API payload | Return a closed success/diagnostic result over admitted definitions and current draft. |
| `MemberOverridesDisclosure` / Team form editors | Established disclosure, labels, responsive/a11y rendering and typed edit events | TeamRunConfigForm and AgentOrgRunConfigPanel | Read either store, decide patch identity/inheritance, launch, or own lifecycle | Keep props/view models explicit and emit commands to caller. |
| `canonicalizeAgentOrgPlacementLaunchPatch` | Canonical sparse Team/Agent patch, including explicit dependent model-config clear | AgentOrg config store, projector and launch mapper | Query catalogs, resolve server authority, retain a parallel raw patch, or mutate Team store | Pure/idempotent; omission stays inheritance except owned runtime/model without owned config becomes `llmConfig:null`. |
| Mixed workspace-history projector | Group tagged subject rows into one ordered workspace/category model | WorkspaceAgentRunsTreePanel | Own subject runtime/focus/lifecycle, infer root kind, or react to current route | Preserve existing rows/state; Agent Orgs is a distinct sibling directly below Teams. |
| `WorkspaceHistorySubjectActions` | Typed selection/open/restore/stop/archive/delete delegation | Unified Workspace history components | Expose concrete stores in row components or permit mounted-Team lifecycle | Require explicit subject kind/root ID and call only the matching subject store. |
| Shared root workspace-selection policy | Select actual available Temp default only for untouched fresh root drafts | Team/Org root config adapters | Hard-code a path/label, focus a member, or default descendant scopes | Workspace catalog supplies records; explicit user selection wins. |
| RootExecutionView facade (web) | mixed route/history selectors over subject context | workspace/history components | Own a second Org tree/raw event log or parse payload | Delegate to AgentOrgExecutionContext; no opaque events. |

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
19. Raw `AgentRunEvent`/`CollaborationAgentExecutionEvent` may flow only into `CollaborationAgentPresentationAdapter`; subject publishers and transport projectors consume the validated presentation result. Web contracts/components never import raw server domain events or accept `unknown` event payloads.
20. `@autobyteus/agent-presentation-contracts` is lower than both Team and collaboration stream packages. It owns message details only and cannot import root/team/org snapshots. Team and Org packages add their own root, sequence, member identity and token-root correlation without changing Team wire.
21. `AgentOrgExecutionContext` owns Org browser state. `rootExecutionViewStore`, history and workspace depend on its public selectors; none keeps a parallel Org tree/event array. The context depends on Org hydration/stream services, which depend on strict contracts and existing Agent message handlers.
22. Shared Agent/Team workspace surfaces depend on explicit presentation/action inputs and the active-context facade. Standalone wrappers and Org focus adapters may build those inputs; the surfaces cannot import selection, subject contexts, run stores or sockets.
23. Org member projection/trace/token queries require `{orgRunId, memberAddress, agentRunId}` and strict Org location correlation. A mounted Team never calls Team-root history/token APIs with its local TeamRun ID.
24. Root termination is available only through subject root services/stores. Mounted Team presentation exposes no terminate capability; focused member headers expose none.
25. AgentOrg Team-branch projection depends on the strict Org tree and public AgentOrgExecutionContext selectors; it must not import WebSocket/GraphQL clients, Team root stores, current definitions, or visible-row expansion state. The shared fold/dot depends only on AgentStatus/presentation utilities and localization.
26. Live status authority exists only for an active run with the exact Org context active in `phase=live`. Historical/terminal projection cannot retain running/initializing; absent or unrecognized values are offline. Neither adapter may request or persist a Team aggregate.
27. `RootTaskLifecycleCommandQueue` may invoke settlement only through a
    non-waiting adapter preparation. It must never call waiting
    `prepareTermination()` for an execution with unresolved input/provider work;
    `null` is normal deferral and releases the FIFO.
28. `AgentRun.tryPrepareTerminationIfQuiescent` owns the atomic lifecycle/input
    check and admission close. It returns no token/state on deferral and reuses
    the existing prepared termination on success. Subject adapters do not infer
    quiescence from a racy status read.
29. Existing Team/Org Agent idle/offline events reschedule terminal settlement.
    No polling, timeout, replay, second queue, or persisted settlement state may
    substitute for that event-driven retry.
30. Subject root shutdown must close/drain the admitted operation/materialization
    publication gate, freeze its stable complete owned scope, and complete each
    AgentRun input/provider-start/interrupt fence before it waits for general
    task mutation or settlement drains. Process-level order remains Org ->
    standalone Team -> residual Agent; neither process nor root shutdown may use
    a provider timeout, replay, force-kill policy, or new persisted task state.
31. AgentRun input claim/provider-start registration and
    `rootShutdownFenced` are serialized by the same dispatch owner. A start that
    loses the fence cannot call the backend; one that wins remains tracked until
    canonical failure/interruption/terminal state. No root, handle, status
    adapter, or task engine may infer this from `activeTurn` alone.
32. Root-shutdown cancellation reuses the current input lifecycle: never-admitted
    reservation invalidation is silent, admitted pre-forward work emits the
    existing cancellation fact once, and provider-started work is never
    mislabeled cancelled. Ordinary non-root preparation remains FIFO-draining;
    a later prepared cancellation cannot reopen root-fenced admission.
33. AgentOrg launch presentation depends `AgentOrgRunConfigPanel ->
    agentOrgRunConfigStore/projectEditableAgentOrgRunFormModel -> shared
    disclosure and Team presentation components`. Edit events return to the Org
    command adapter. No shared component imports an Org/Team store, and the Org
    path never imports `teamRunConfigStore` or Team launch payload serializers.
34. The Org projector accepts only the already-admitted fixed-depth Org plus
    referenced flat Team definitions and exact sparse draft. Missing or
    inconsistent reference/member/coordinator/address correlation returns one
    blocking typed diagnostic; it may not silently omit, normalize, clone, or
    synthesize a placement.
35. Team `Inherited`/`Customized` and mounted-Team Agent
    `Inherited`/`Overridden` labels are exact-scope-local; the direct Org Agent
    row preserves its already-approved behavior. The
    browser may project inherited values for explanation, but only the server
    `CollaborationLaunchConfigurationResolver` determines and validates the
    effective launch plan. Collapse state is presentation-only and cannot change
    sparse patches or the launch input.
36. `agentOrgRunConfigStore` canonicalizes Team/Agent patches before storing
    them. The form projector and `toAgentOrgRunLaunchInput` read that one map;
    neither reconstructs omission/null semantics. An owned runtime/model with no
    owned model config carries `llmConfig:null`. The server resolver remains
    independently authoritative and never imports web policy.
37. `AppLeftPanel` depends on exactly one `WorkspaceAgentRunsTreePanel`; it does
    not branch on route/root kind to select a history component. The unified
    workspace projector depends on tagged subject projections and typed subject
    actions, not concrete active-context internals or current route.
38. Workspace category projection preserves all existing categories and places
    `Agent Orgs` immediately below `Teams`. An Org root remains tagged Org; a
    mounted Team remains a child presentation node and cannot enter the Teams
    root collection.
39. Root workspace default selection depends on the shared available workspace
    catalog and untouched-draft state. Descendant Team/Agent projection depends
    on the root value plus exact supported override; no descendant control owns
    default discovery or changes recipient focus.

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
- No `z.unknown`/`any` AgentOrg live event, opaque browser event list, `JSON.stringify`/generic object card, custom Org conversation/composer, or component-owned protocol formatting.
- No direct Org stream/store/socket call from `AgentOrgWorkspaceView`, input components, tool cards or right panels; all actions use the exact active-target interaction port.
- No mounted Team inserted into `AgentTeamContextsStore`, no Team-root trace/token API called for an Org member, no independent mounted-Team stop, and no `Stop Org` in a focused member header.
- No Team aggregate field in Org V1/sidecars/GraphQL/WebSocket, no status polling, no store-owned Team status cache, no fold over only visible rows, no sibling/direct-Org leakage, no stale historical running/initializing pulse, no replacement of exact Agent dots, and no reuse of binary `TeamActivityDot` as the five-state aggregate.
- No waiting provider quiescence preparation for a non-quiescent execution
  inside a task mutation FIFO closure; no racy status precheck outside AgentRun;
  and no root shutdown that drains task work before completing the frozen scope's
  AgentRun input/provider-start/interrupt fence.
- No timeout/replay/force-kill task recovery, new persisted `settling` status,
  reopening of a terminal task, support for self-review, or API/tool/result
  change. Do not implement the blocked AD-REV-008 coordinator/token/dependency
  design as an alternate path.
- No bespoke AgentOrg mounted-Team override editor, always-expanded Team child
  list, implicit inherited state, Team-as-Agent fabricated view node, Team run
  config-store import, generic Team/Org draft, or browser-authoritative effective
  configuration. No retention of the superseded layout behind a flag.
- No hand-written Org object spread that drops a dependent `llmConfig:null`, no
  parallel raw/canonical patch maps, no client preview semantics that differ
  from request semantics, and no server heuristic that guesses a clear from a
  changed model.
- No route-selected `AgentOrgRunHistoryPanel`, duplicate Org history state,
  whole-panel swap, Org roots under `Teams`, or mounted Teams registered as
  standalone history roots. Do not keep the obsolete panel as fallback.
- No hard-coded Temp Workspace path/label, Org-specific workspace catalog,
  descendant auto-default, silent unavailable-path fallback, or workspace
  selection that creates focus or mutates a definition.

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
| `TaskRootAdapter` (private Team/Org implementations) | Subject task bridge | Resolve host, prepare/commit task mutations, atomically attempt quiescent local preparation, and commit existing `settledAt` transaction | tagged host/task identity and exact record commands | Only root aggregate constructs/owns; `null` preparation is normal deferral with no side effect. |
| `AgentRun.tryPrepareTerminationIfQuiescent()` | Local Agent lifecycle | Under AgentRun dispatch/input authority, return `null` immediately for unresolved work or the existing prepared termination after atomically closing admission | exact AgentRun | Never waits for an active turn and never infers quiescence from UI status. |
| `AgentRun.fenceInputAndInterruptForRootShutdown()` | Local Agent root shutdown | Irreversibly close admission, cancel admitted pre-forward input, serialize provider start, interrupt any provider-started canonical turn, and resolve only at terminal quiescence | exact AgentRun | Idempotent internal method; no task/root identity, timeout, persisted state, or ordinary-preparation behavior change. |
| `ConfiguredAgentExecutionHandle.fenceForRootShutdown()` | Root-neutral Agent forwarding | Await any admitted handle construction and invoke the exact AgentRun root-shutdown fence | exact configured/task Agent handle | Does not translate `NO_ACTIVE_TURN` into phase success; owns no root enumeration. |
| `FrozenTeamRunTerminationScope.fenceAgentRunsForRootShutdown()` | Recursive Team local shutdown | Invoke the configured-Agent fence for the immutable direct/task/prepared handle set and every child task-Team scope | one frozen local Team subtree | Clean-cut replaces `interruptActiveTurns()`; never creates a Team root/package. |
| private AgentOrg frozen termination scope | Org root shutdown composition | Combine exact direct configured/task/prepared Agent handles with mounted/root-task Team frozen scopes | exact AgentOrgRun | Private subject composition; no public generic root/scope API. |
| `RootTaskLifecycleEngine.settle(taskId)` / `onExecutionBecameIdle()` | Shared task settlement | Revalidate terminal leaf, call non-waiting preparation, defer or commit existing prepared settlement, and retry from established idle/offline events | exact task ID within bound root | One FIFO and current record/tree/event semantics remain; no coordinator/token lifecycle. |
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
| `CollaborationAgentPresentationAdapter.adapt(identity,event)` | Agent presentation | Validate/normalize one raw collaboration Agent event | tagged member identity + internal event | Returns publish/filter/reject; subject serializer adds root/sequence. |
| `AgentOrgStreamingService.connect/replaceCandidate` | Org browser synchronization | Strict snapshot barrier, typed event reduction, command acks, recovery | exact Org run ID + AgentOrgExecutionContext | No raw event callback or direct component access. |
| `AgentOrgMemberRunViewProjectionService.getProjection/getActiveTracePage` | Org member history | Hydrate accepted conversation/activity/trace from Org memory | `{orgRunId,memberAddress,agentRunId}` | Strict Org location/snapshot; no Team member service. |
| `ActiveAgentWorkspaceTarget` / `AgentInteractionPort` | Web active interaction | Expose exact context, browse and send/interrupt/tool decision | tagged target branch | Components do not infer subject or call stores/sockets. |
| `TeamWorkspaceContextView` | Team presentation | Read focused member/roster/messages/tasks/coordinator for accepted Team surface | standalone Team root or exact mounted Team adapter | Read-only presentation; Org variant cannot terminate/register/persist Team. |
| GraphQL `getAgentOrgMemberRunProjection/getAgentOrgMemberEventMonitorActiveTracePage/getAgentOrgExecutionCheckpoint` | Org workspace hydration/recovery | Subject-specific member projection and stable recovery barrier | Org run + exact address/AgentRun | Fails family/address/run mismatch. |
| Org stream client command union | Org interaction | SEND_MESSAGE, INTERRUPT_GENERATION, APPROVE_TOOL, DENY_TOOL plus typed ack | Org root + exact target AgentRun/command IDs | Dispatches only through AgentOrgRun.executeAgentCommand. |
| `AgentOrgRunStore.terminate(orgRunId)` + `WorkspaceHistorySubjectActions` | Org lifecycle UI | Pending-guarded whole-root termination; on success the caller asks the unified history read owner to refresh | exact Org run ID | The command store owns no history list; no focus/member/mounted Team input. |
| Web `CollaborationFocusController.select(addressOrNull)` | Local focus | Exact selection/send readiness | address in current tagged snapshot | Team row -> coordinator; null never persists. |
| `projectEditableAgentOrgRunFormModel(input)` | Web Org launch presentation | Project one admitted Org plus referenced flat Teams and current sparse draft into exact direct-Agent/Team form nodes, Agent count and blocking diagnostics | Org definition ID/revision + exact addresses | Pure closed result; no store writes, API payload, nested Team, or silent omission. |
| `agentOrgRunConfigStore.set/resetTeamOverride(address, patch)` / `set/resetAgentOverride(address, patch)` | Web Org launch draft | Mutate only one exact scope and preserve sibling/child patches according to approved reset rules | canonical Org member/Team-Agent address | Team reset preserves Agent patches; invalid address rejected. |
| `agentOrgRunConfigStore.setRootRuntimeKind/setRootModel/setRootLlmConfig` | Web Org root launch draft | Maintain one complete coherent root runtime/model/model-config tuple and clear dependent config on root runtime/model change | structural root `/` inside this Org draft | Panel binds events to commands, not writable refs; root launch always serializes owned `llmConfig`, including null. |
| `toAgentOrgRunLaunchInput(draft)` | Web Org launch command | Serialize root plus exact sparse Team/Agent maps to existing GraphQL input | AgentOrg definition ID + address-keyed patches | Includes existing Team `workspaceRootPath`; never serializes disclosure or computed effective values. |
| `canonicalizeAgentOrgPlacementLaunchPatch(patch)` | Web Org launch contract | Materialize the one canonical sparse patch used by preview and request | exact Team or Agent placement patch | Pure/idempotent; preserves owned null/config; owned runtime/model without owned config adds `llmConfig:null`. |
| `projectWorkspaceHistoryByWorkspace(rows)` | Web mixed history read | Strictly combine the existing Workspace Agent/Team result with only the explicit AgentOrg branch of collaboration-root history, then group roots under normalized workspaces and ordered categories | tagged root subject rows + normalized workspace path or explicit no-workspace identity | Agent Orgs immediately follows Teams; legacy null-path Org rows remain in a read-only No Workspace group; no duplicate collaboration-history Team rows, current-route input, unchecked JSON cast, or kind inference. |
| `WorkspaceHistorySubjectActions.execute(action)` | Web history commands | Delegate an action valid for that exact root kind to its Agent, Team, or Org store | discriminated `{rootSubjectKind, rootRunId, action}` | Org admits only current open/select, restore and stop actions; no Org archive/delete is invented. Mounted Team is not a root action target; row components never import all subject stores. |
| `selectDefaultWorkspaceForFreshRoot(catalog,draft)` | Web root config | Choose the actual eligible Temp Workspace only when the current launch-draft epoch is untouched | workspace record ID/path + `draftEpoch` + `untouched/defaulted/explicit` source | Shared Team/Org root policy; same-definition new Run begins a new epoch, retry/error does not; absent default returns none; no focus or path synthesis. |
| `MemberOverridesDisclosure` | Shared launch presentation | Render accessible label/count/adjacent disclosure and preserve slotted draft subtree while collapsed | caller-provided count/control id | Default collapsed; no store, traversal or patch policy. |
| `foldTeamAggregateStatus(statuses, authority)` | Shared web presentation | Normalize/fold five Agent status values under explicit live/history authority | value array + `live\|historical` | Pure; empty/unknown is offline; historical running/initializing is offline. |
| `projectAgentOrgTeamBranchStatus(input)` | AgentOrg hierarchy presentation | Enumerate exact configured/task Agent identities beneath one direct configured Team and resolve their status | configured Team node + authority + exact AgentRun status resolver | No visible-row, focus, store, socket, API, lifecycle or persistence dependency. |
| `TeamAggregateStatusDot` | Shared hierarchy presentation | Render established five-state status dot with accessible Team status name/title | one normalized AgentStatus | Replaces configured-nesting-specific component naming; not `TeamActivityDot`. |

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
| Task FIFO / non-waiting settlement preparation | Yes | Yes — exact root, task and execution | High | One FIFO retains durable ordering; AgentRun/local execution atomically returns prepared-or-deferred without awaiting active work. |
| AgentRun root-shutdown fence | Yes | Yes — exact AgentRun | High | Same dispatch owner serializes admission, claim/provider start, canonical turn and interrupt; no active-turn-only precheck or root-internal bypass. |
| Frozen Team/Org termination scopes | Yes | Yes — exact immutable subject subtree | High | Enumerate/invoke only; AgentRun owns input/turn decisions and subject roots own shutdown sequencing. |
| Existing PreparedTaskSettlement | Yes | Yes — exact execution binding | High | Existing cancel/commit/finish semantics remain; it is created only after quiescence succeeds and no new committed token type is added. |
| Active root directory | Yes | Yes | Medium | Compound root only; narrow live message/query capability; managers retain lifecycle. |
| Collaboration location facade | Yes | Yes | Medium | Explicit compound root for scoped queries; unique global AgentRun; strict subject providers. |
| Configuration resolver | Yes | Yes | Medium | Exact patches; server recomputes; all-or-nothing validation. |
| Subject tree stores | Yes | Yes | Low | Each path/store accepts one family/version/root only. |
| Root run package readiness | Yes | Yes | Medium | Family path supplies kind; reject duplicate IDs/residue, then invoke only that family's strict store. |
| Mixed projection | Yes | Yes | Medium | Compound kind+ID; verify family/payload/branch. |
| Recipient resolver | Yes | Yes | Low | Canonical parser/index; reject root/depth/unknown. |
| Application Team launch | Yes | Yes | Medium | Preserve explicit Team ref and Team service. |
| Agent presentation contract/adapter | Yes | Yes | High | Root-neutral strict message details; subject envelope supplies exact root/member/sequence; reject unknown/raw payload. |
| AgentOrg browser context/stream | Yes | Yes | High | One strict context owner, complete candidate hydration, sequence barrier and recovery; no parallel root store. |
| Active workspace target/interaction port | Yes | Yes | High | Tagged target branch carries exact context/commands/browse/optional Team view; shared surfaces cannot bypass. |
| Org member projection/trace | Yes | Yes | Medium | Compound Org/member/run identity and strict location; no Team-root alias. |
| Org root stop | Yes | Yes | Medium | Exact Org root only, pending/error guard; no member/mounted Team action. |
| Team aggregate fold/dot | Yes | N/A — value-only | Low | One pure five-state policy and accessible component; no topology/state owner. |
| AgentOrg Team-branch projector | Yes | Yes — exact Team node and AgentRun IDs | Medium | Full branch before collapse; injected explicit live/history status source; no outside branch. |
| AgentOrg run-config store / launch adapter | Yes | Yes — exact Team/Agent addresses | Low | Separate sparse maps and exact commands; reuse existing GraphQL fields; no Team store/payload import. |
| AgentOrg canonical placement patch | Yes | Yes — exact Team/Agent address supplied by caller | High | One pure idempotent omission/null rule serves preview/request; cross-layer fixture proves server/snapshot equality. |
| Unified Workspace/history projection | Yes | Yes — tagged subject root + workspace | High | One route-stable UI owner, explicit category order, typed actions; no subject lifecycle or second Org context. |
| Root workspace default policy | Yes | Yes — actual workspace record | Medium | Reuse existing Team root selector behavior; untouched fresh root only; no hard-coded path or descendant default. |
| AgentOrg fixed-depth form projector | Yes | Yes — admitted Org/ref/member/coordinator addresses | Low | Pure closed projection; blocking diagnostic on mismatch; no silent omission or browser repair. |
| Shared Member overrides / Team editors | Yes — presentation only | Yes — caller-provided form node/address | Low | Reuse established a11y/disclosure/edit grammar; typed events return to subject owner. |
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
| Agent presentation message | Team-named payloads/raw Org event / `AgentPresentationMessage` | Yes | Medium | Root-neutral details only; Team/Org outer contracts remain subject-specific. |
| Browser Org runtime state | raw `RootExecutionViewState` / `AgentOrgExecutionContext` | Yes | Low | Own exact topology, AgentContexts, stream/recovery and nullable focus. |
| Mounted Team UI adapter | none / `TeamWorkspaceContextView` | Yes | Medium | Presentation view only; never call it a Team root/context authority. |
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
| Pending-input root shutdown | AgentRun admission/dispatch/lifecycle plus current frozen Team scope | Extend AgentRun with one irreversible fence; clean-cut rename the recursive frozen-scope method; compose a private Org frozen scope | The authoritative input owner can distinguish pre-forward cancellation from provider-started interruption. A root-level active-turn query cannot. |
| Live same-root lookup | Team manager hard-coded in global router | Add compound active-root directory | Supports Team and Org without public generic root or bare-ID guessing. |
| Persisted records | current Team tree domain/schema | Extract tight shared record types/validators | Reuse exact fields without generic root. |
| Team durability/history | current Team store/index/memory layout | Preserve and narrow | Byte/path compatibility is approved. |
| Org durability/history | current atomic store/index patterns | Create subject store/index | Separate family/path/root invariant. |
| Mixed projection | Team history/stream/projectors | Add thin explicit-kind facade; retain Team-only paths | Shared UI needs one union, but lifecycle/storage stay subject-owned. |
| Migration | app-data migrations | Extend | Reuse the existing runner/record/log/restart policy; isolate legacy codecs and add no lazy compatibility or bespoke recovery. |
| Agent event presentation | `TeamAgentEventAdapter`, Team projector, `dispatchAgentStreamMessage`, AgentContext handlers | Extract root-neutral presentation adapter/detail contract; compose current Team and strict Org envelopes | Mature Team validation/presentation is reusable; raw Org domain events and `unknown` transport are not. |
| Agent conversation workspace | `AgentWorkspaceView`, `TeamWorkspaceView`, `AgentTeamEventMonitor`, `AgentEventMonitor`, `AgentUserInputForm` | Extract prop/port-driven Agent/Team surfaces and keep standalone wrappers | Product explicitly requires reuse; global store reads must move behind active-target facade rather than duplicate markup. |
| Active interaction/right tools | `useActiveContextStore`, `RightSideTabs`, activity/token/file/artifact components | Generalize to exact tagged active target plus subject interaction/query adapters | Preserve accepted UI and commands without treating mounted Team/Org Agent as standalone. |
| Org member history/trace | Team member projection/hydration/active trace pattern | Add Org-specific location-backed projection and candidate recovery; reuse presentation builders | Persistence location/root semantics differ; visual conversation shape is shared. |
| Web workspace | Team execution view components/state | Refactor Org branch into AgentOrgExecutionContext plus shared presentation surfaces | One visual workspace; exact subject adapters and nullable Org focus. |
| Org authoring | Team form primitives | New subject-specific UI | Membership/coordinator semantics differ. |
| AgentOrg launch hierarchy presentation | `TeamRunConfigForm -> TeamMemberConfigTree -> TeamScopeConfigEditor -> MemberOverrideItem` from current/origin-personal | Reuse the accepted disclosure/row/editor chain through an Org-owned fixed-depth projector and typed command adapter | User-visible style/navigation/progressive disclosure should not be reinvented; the Org store, payload and coordinator-free domain remain distinct. |
| Launch precedence | current Team config hierarchy | Extract/extend | Existing root/placement logic; server authority is new. |
| Definition atomic save | parent mutations + atomic file writer | Extend with a normal-authoring package transaction | Multiple package files need revisioned all-or-complete publication; data migration remains separate. |
| Handoff UI | current record + Product design | Shared presentational primitives | Endpoint eligibility/persistence remain subject owners. |

AD-REV-007 capability check: reuse is mandatory. `StatusDot.vue` and
`workspaceStatusDotPresentation.ts` already own the palette/motion; the existing
nested-Team fold/dot already own the exact precedence and accessible Team label;
`AgentOrgExecutionContext` already owns live Agent status. The target extracts
only the pure shared fold and neutral dot, while the AgentOrg adapter supplies
its own exact tree traversal. `TeamActivityDot.vue` is deliberately not reused
because it is a binary root-activity indicator rather than a five-state branch
aggregate. No new backend status capability is allocated.

## Subsystem / Capability-Area Allocation

| Subsystem | Owns | Spines | Decision | Notes |
| --- | --- | --- | --- | --- |
| Agent Execution | Input admission, one dispatch slot, canonical turn lifecycle, ordinary preparation, non-waiting quiescence attempt, irreversible root-shutdown fence | DS-015, DS-022 | Extend | Root/task subjects receive results only; they cannot inspect active-turn/input internals. |
| Team/Org local termination scopes | Stable recursive enumeration of configured/task/prepared Agent handles and task Teams | DS-015 | Refactor/compose | Replaces active-turn-only traversal; Org composition remains private and creates no generic root. |
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
| Agent Presentation Contracts | Root-neutral strict Agent conversation/status/tool/activity/input/error/token detail schemas | DS-016-DS-018 | Create by extraction | Lower than Team/Org envelopes; no root snapshot or runtime logic. |
| Stream Contracts | compatible Team view + strict Org/tagged mixed view and command acks | DS-008, DS-016-DS-018 | Extend | Compose presentation details; no forced Team wire rewrite and no `unknown` Org live events. |
| Web Definition Authoring | separate Team/Org surfaces + shared handoff primitives | DS-001, DS-011 | Create/Refactor | RV-012 normative. |
| Web Launch Configuration | separate Team/Org drafts; shared disclosure/Team editors and root workspace policy; strict Org projector and canonical placement patch | DS-002, DS-003, DS-012, DS-023, DS-024, DS-026 | Refactor existing | Org no focus and retains Org payload ownership; preview/request/server/snapshot equality; Team coordinator-led; user-visible Team hierarchy/default stays established. |
| Web AgentOrg Execution Context | strict Org topology/tasks/messages/status, AgentContexts, stream/hydration/recovery, mounted-Team presentation adapters | DS-008, DS-013, DS-016-DS-018 | Create/Refactor | One active Org browser authority; no raw event list or standalone mounted root. |
| Web Shared Agent/Team Workspace | accepted member header/event monitor/composer and active target/interaction/right tools | DS-013, DS-016-DS-019 | Refactor existing | Standalone and Org wrappers reuse structurally identical surfaces. |
| Web Root Workspace | one route-stable mixed history projection, ordered Agent/Team/AgentOrg categories, exact focus and typed root lifecycle actions | DS-008, DS-013, DS-019, DS-025 | Refactor | Delegates subject state; one visual/history workspace owner; Agent Orgs follows Teams; root stop stays subject-owned. |

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
| `agent-collaboration/execution/task/root-task-lifecycle-engine.ts` | Collaboration Execution | Root-neutral task record policy, one FIFO, existing terminal sweep and non-waiting settlement deferral | Subject adapter owns tree/persistence/event; active provider work yields immediate deferral. |
| `agent-collaboration/execution/task/root-task-lifecycle-command-queue.ts` | Collaboration Execution | Admit/order/drain the existing task mutation/settlement closures | No direct provider/local execution dependency. |
| `agent-execution/domain/agent-run.ts` and `input/agent-run-input-admission-state.ts` | Agent Execution | Atomic `tryPrepareTerminationIfQuiescent` plus irreversible root-shutdown admission/provider-start/interrupt fence under canonical lifecycle/input authority | Deferral remains no-op; root fence uses existing cancellation/interrupt facts; no task/root/persistence knowledge. |
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
| `autobyteus-agent-presentation-contracts/src/agent-presentation-message-dtos.ts` | Agent Presentation | Strict root-neutral conversation/status/tool/activity/input/error detail union | Shared by subject serializers; owns no root identity or sequence. |
| `autobyteus-agent-presentation-contracts/src/token-usage-presentation-dto.ts` | Agent Presentation | Tight root-neutral token-usage detail | Team/Org serializers add their truthful outer identity fields. |
| `autobyteus-team-stream-contracts/...` | Team Stream | Existing Team-only contract | Keep compatible where still used. |
| `autobyteus-collaboration-stream-contracts/src/root-execution-view-dtos.ts` | Mixed/Org Stream | Strict Org snapshot/event/lifecycle and client-command unions plus tagged mixed root dispatch | Adds Org without retyping Team-only callers; no `z.unknown()` in the Org live/view branch. |
| `agent-collaboration/execution/events/collaboration-agent-presentation-adapter.ts` | Agent Presentation | Validate/normalize raw configured-Agent callbacks once for Team and Org | Returns publish/filter/reject; does not serialize a subject envelope. |
| `services/agent-streaming/agent-org-execution-view-projector.ts` and `agent-org-stream-handler.ts` | Org Stream | Strict Org envelope/status/snapshot projection and send/interrupt/tool command handling | Use AgentOrgRun/query boundaries only; never expose raw runtime events. |
| `run-history/services/agent-org-member-run-view-projection-service.ts` | Org Member Read | Conversation/activity projection for one exact Org member execution | Uses explicit Org location and compound identity, never a Team root lookup. |
| `autobyteus-web/stores/agentOrgDefinitionStore.ts` | Web Authoring | Org catalog/draft/revision/errors | Separate subject state. |
| `autobyteus-web/components/collaboration/handoffs/*` | Web Authoring | From/To/When cards/editor/reorder/errors | Shared presentation; owner supplies policy. |
| `autobyteus-web/stores/agentOrgRunConfigStore.ts` | Web Config | Org root/Team/Agent sparse overrides | Org-specific intent. |
| `autobyteus-web/services/agentOrgExecution/agentOrgExecutionContext.ts` | Web Org Runtime | One Org topology/task/message/status, AgentContext, mounted-Team view and nullable-focus aggregate | Sole active Org browser authority. |
| `autobyteus-web/services/agentOrgExecution/agentOrgExecutionContextHydrationService.ts` | Web Org Runtime | Strict candidate hydration, member projection and checkpoint verification | Publishes only a complete correlated context. |
| `autobyteus-web/services/agentOrgExecution/AgentOrgStreamingService.ts` | Web Org Runtime | CONNECTED/snapshot/sequence state machine and typed message dispatch | No raw event retention or component callbacks. |
| `autobyteus-web/stores/agentOrgContextsStore.ts` | Web Org Runtime | Active/historical Org context registration and exact focus | Does not register mounted Teams as standalone contexts. |
| `autobyteus-web/stores/rootExecutionViewStore.ts` | Web Workspace | Tagged route/history/transport facade | Delegates Org context; no second tree, focus, or event array. |
| `autobyteus-web/stores/activeContextStore.ts` | Web Interaction | Resolve exact active target and delegate send/interrupt/tool decisions | No direct selection-kind branching inside shared composer components. |
| `autobyteus-web/components/workspace/agent/AgentWorkspaceSurface.vue` | Web Shared Workspace | Accepted Agent header, status, event monitor and composer from an explicit target/ports | No subject store imports. |
| `autobyteus-web/components/workspace/team/TeamWorkspaceSurface.vue` | Web Shared Workspace | Accepted focused Team-member header, Team event monitor and composer from `TeamWorkspaceContextView` | No standalone Team registry assumption. |
| `autobyteus-web/components/workspace/org/AgentOrgWorkspaceView.vue` | Web Org Workspace | Null-focus prompt or exact Agent/Team surface selection | No protocol formatting, composer, raw-event list or lifecycle button. |

### AD-REV-007 Focused File Responsibilities

| Change | Target File | Responsibility |
| --- | --- | --- |
| Add | `autobyteus-web/utils/workspaceTeamAggregateStatus.ts` | Pure normalize/fold policy with explicit live/history authority and approved precedence. |
| Add | `autobyteus-web/services/agentOrgExecution/agentOrgTeamBranchStatus.ts` | Exact configured-Team configured/task descendant AgentRun enumeration and status-source adapter; no UI/store/transport ownership. |
| Rename/Move | `autobyteus-web/components/workspace/history/NestedTeamAggregateStatusDot.vue` -> `TeamAggregateStatusDot.vue` | One accessible 8px five-state Team aggregate dot used by Team and Org hierarchy rows; update neutral localization/test contract, no wrapper. |
| Rename/Modify | `workspaceHistoryNestedTeamStatus.ts` -> `workspaceHistoryTeamBranchStatus.ts` | Retained Team-history row traversal only; import shared fold rather than own precedence/normalization. |
| Modify | `autobyteus-web/components/workspace/history/AgentOrgRunHistoryPanel.vue` | Build exact Agent/Team/task status rows from strict tree/context, project Team aggregate before collapse, render shared dot between disclosure/icon, keep focus/stop unchanged. |
| Modify | `autobyteus-web/components/workspace/history/WorkspaceTeamExecutionTree.vue`, `WorkspaceStableExecutionRow.vue` | Consume renamed neutral fold adapter/dot without changing retained Team behavior. |
| Modify | `autobyteus-web/localization/messages/{en,zh-CN}/workspace.ts` | Neutral `team_status_*` accessible labels; exact meaning remains `Team status: <State>`. |
| Add/Modify tests | Org history, Team branch fold/dot and workspace hierarchy specs | Prove five-state precedence, exact task branch, sibling/direct-root exclusion, live reactive update, collapsed visibility, historical live-state demotion, a11y, exact Agent coexistence, and lifecycle non-effects. |

No server, schema, GraphQL, WebSocket, store persistence, migration, definition,
focus, command, or root-lifecycle file is in the AD-REV-007 delta. If source work
requires one, return `Design Impact` rather than broadening the focused correction.

### AD-REV-009 Focused File Responsibilities

| Change | Target File | Responsibility |
| --- | --- | --- |
| Modify | `autobyteus-server-ts/src/agent-execution/input/agent-run-input-admission-state.ts` | Expose an owner-internal atomic quiescence predicate/transition usable only under AgentRun dispatch sequencing; no public status inference. |
| Modify | `autobyteus-server-ts/src/agent-execution/domain/agent-run.ts` | Add `tryPrepareTerminationIfQuiescent(): Promise<PreparedAgentRunTermination \| null>`; return null immediately for unresolved input/turn/provider work, otherwise reuse existing prepared cancellation/commit semantics. |
| Modify | `agent-collaboration/execution/backends/configured-agent-execution-handle.ts` and `agent-team-execution/local/flat-team-agent-execution-handle.ts` | Forward the non-waiting local lifecycle capability without adding root/task knowledge. |
| Modify | `agent-team-execution/local/flat-team-execution-manager.ts` | Recursively prepare a task-Team subtree only when every owned execution is quiescent; cancel any already-prepared children and return null if a later child is active. |
| Modify | `agent-team-execution/local/registries/task-agent-execution-registry.ts`, `task-team-execution-registry.ts`, `agent-org-execution/services/agent-org-root-agent-execution-registry.ts`, and `agent-org-team-execution-directory.ts` | Replace waiting `prepareTermination()` during settlement with exact non-waiting prepared-or-null delegation; retain current registry, binding, cancel/commit and teardown contract. |
| Modify | `agent-team-execution/task-delegation/team-task-lifecycle-adapter.ts` and `agent-org-execution/services/agent-org-task-lifecycle-adapter.ts` | Treat null preparation as ordinary `false`/deferred settlement; preserve existing `settledAt` durability, state/event commit, finish and fail-stop behavior. |
| Modify | `agent-collaboration/execution/task/root-task-lifecycle-engine.ts` | Retain one FIFO and terminal sweep; ensure deferred settlement releases the queue and existing idle/offline events schedule retry. No coordinator/token/job state. |
| Modify | `agent-team-execution/domain/root-team-run.ts` and `agent-org-execution/domain/agent-org-run.ts` | Close/freeze complete scope and invoke its root-shutdown AgentRun fence before awaiting task drain/shutdown settlement; preserve subject/process ownership and existing error handling. |
| Add/Modify tests | AgentRun input/lifecycle, task Agent/Team registries, shared task engine, Team root, Org root, process supervisor | Prove immediate deferral, valid submit/independent-accept overlap, unrelated command progress, idle retry, recursive all-or-none preparation, supported approval-wait SIGTERM, and invalid self-review rejection. |

No new coordinator, settlement contract/token type, durable schema/file, task
record/status, Agent tool/API/result, definition, migration, frontend, or Product
file is in the AD-REV-009 delta. Delete or leave unimplemented every AD-REV-008-
only coordinator/token/dependency artifact; do not keep it as dormant indirection.

### AD-REV-010 Focused File Responsibilities

| Change | Target File | Responsibility |
| --- | --- | --- |
| Modify | `autobyteus-server-ts/src/agent-execution/input/agent-run-input-admission-state.ts` | Add the owner-internal irreversible root-shutdown transition: close admission, silently invalidate never-admitted reservations, emit the existing cancellation fact once for admitted pre-forward entries, revoke a not-started claim, and expose exact terminal/quiescence notification. Do not change public lifecycle types. |
| Modify | `autobyteus-server-ts/src/agent-execution/domain/agent-run.ts` | Add idempotent `fenceInputAndInterruptForRootShutdown`; serialize claim/provider-start registration with the fence, retain one tracked dispatch slot through pre-`TURN_STARTED`, arm existing interrupt on canonical start, await terminal state, and prevent prepared cancellation from reopening fenced admission. Ordinary `prepareTermination` and `tryPrepareTerminationIfQuiescent` retain their distinct semantics. |
| Modify | `autobyteus-server-ts/src/agent-collaboration/execution/backends/configured-agent-execution-handle.ts` and `agent-team-execution/local/flat-team-agent-execution-handle.ts` | Forward the exact AgentRun root-shutdown fence after any admitted construction resolves; do not translate `NO_ACTIVE_TURN` into complete-scope success or own input policy. |
| Modify | `autobyteus-server-ts/src/agent-team-execution/domain/frozen-team-run-termination-scope.ts` | Clean-cut replace `interruptActiveTurns()` with `fenceAgentRunsForRootShutdown()`; keep immutable subtree enumeration, preparation, and finish responsibilities distinct. |
| Modify | `autobyteus-server-ts/src/agent-team-execution/local/flat-team-execution-manager.ts` | Freeze configured/task/prepared Agent handles and recursive task-Team scopes, recursively invoke the Agent fence, then retain current prepared local finish. No configured child Team or root authority. |
| Add | `autobyteus-server-ts/src/agent-org-execution/domain/agent-org-run-operation-gate.ts` | Org-private admission counter/close-and-drain boundary for already-admitted operations that can publish prepared handles or commit reserved Agent input. It owns no task FIFO, provider wait, persistence policy, or settlement. |
| Add | `autobyteus-server-ts/src/agent-org-execution/domain/frozen-agent-org-termination-scope.ts` | Private immutable composition of direct configured/task/prepared Agent handles and mounted/root-task Team frozen scopes; invoke their fences and finish without creating a generic root or mounted-Team lifecycle. |
| Modify | `autobyteus-server-ts/src/agent-org-execution/services/agent-org-root-agent-execution-registry.ts` and `agent-org-team-execution-directory.ts` | Close materialization, expose stable active/prepared handle and Team-scope snapshots to the Org frozen scope, and preserve current subject-private registry/binding/settlement semantics. |
| Modify | `autobyteus-server-ts/src/agent-team-execution/domain/root-team-run.ts` and `agent-org-execution/domain/agent-org-run.ts` | Close external admission, stabilize admitted handle/input publication, freeze the exact scope, await every Agent fence, and only then drain task commands/settlement and finish persistence/local cleanup. Preserve existing root/process error aggregation. |
| Modify | `autobyteus-server-ts/src/agent-execution/services/agent-run-manager.ts` only if needed for the existing public manager boundary | Forward the AgentRun-owned fence/preparation without duplicating its state machine; do not expose root/task semantics. |
| Add/Modify tests | AgentRun admission/dispatch/interrupt, configured handle, recursive Team frozen scope, Org frozen scope/operation gate, Team/Org root and process SIGTERM | Cover every input-state disposition, claim/start/fence ordering, pre-`TURN_STARTED` barrier, active approval wait, direct/mounted/task/prepared recursion, no reopen, no post-fence provider call, task drain phase order, retry/idempotence, and ordinary termination FIFO-drain regression. |

No schema, file, sidecar, task status, API/tool result, provider timeout, replay,
force-kill, frontend, Product, or migration file belongs to AD-REV-010. No
`RootTaskSettlementCoordinator`, cleanup token/job/dependency graph, second FIFO,
or generic frozen-root abstraction may be added. If a correct Agent fence
requires observable input semantics beyond the existing cancellation fact, that
is a Requirement Gap rather than an implementation liberty.

### AD-REV-012 Focused File Responsibilities

| Change | Target File | Responsibility |
| --- | --- | --- |
| Add | `autobyteus-web/components/workspace/config/MemberOverridesDisclosure.vue` | Extract the accepted compact Member overrides shell: adjacent label/count/chevron, default-collapsed local disclosure, `aria-expanded`/`aria-controls`, keyboard behavior, and a `v-show`-equivalent content slot that does not destroy caller draft state. |
| Modify | `autobyteus-web/components/workspace/config/TeamRunConfigForm.vue` | Replace its inline outer disclosure markup with `MemberOverridesDisclosure`; retain Team draft/store/launch semantics byte-for-byte outside the presentation extraction. |
| Add | `autobyteus-web/utils/editableAgentOrgRunFormModel.ts` | Purely project one admitted Org, its referenced flat Team definitions and current Org draft into exact direct-Agent and one-level `EditableTeamFormTeamNode`/Agent child nodes, coordinator identity, configurable-Agent count and closed blocking diagnostics. Never silently omit a reference. |
| Modify | `autobyteus-web/stores/agentOrgRunConfigStore.ts` | Own separately typed `teamOverrides` and `agentOverrides`, Team workspace selection/operation state, exact address-scoped set/reset commands, draft preservation and launch/projection errors. Do not import `teamRunConfigStore`. |
| Modify | `autobyteus-web/components/workspace/config/AgentOrgRunConfigPanel.vue` | Compose `MemberOverridesDisclosure`; render direct Org Agents through the retained compact row and mounted Teams through `TeamMemberConfigTree`; map typed edit/reset/workspace events to exact Org store commands; disable Run on projection/validation failure; serialize through the unchanged Org launch adapter. |
| Rename/Modify | `autobyteus-web/components/workspace/config/AgentOrgPlacementOverrideRow.vue` -> `AgentOrgDirectAgentOverrideRow.vue` | Retain only the approved direct-Org-Agent row. Remove `kind='team'`, fabricated Team-as-Agent nodes, Team coordinator text and the superseded Team layout. Delete the file instead if an existing exact direct-Agent primitive preserves the approved compact behavior without branching. |
| Modify, only for presentation props | `autobyteus-web/components/workspace/config/TeamMemberConfigTree.vue`, `TeamScopeConfigEditor.vue` | Accept only narrowly required caller-provided helper copy/control IDs if the focused Org copy cannot be expressed today. Preserve established Team row/field/Agent behavior; add no Org/store/payload branch. |
| Modify | `autobyteus-web/stores/agentOrgRunStore.ts` or the existing Org launch-input mapper | Tighten the typed Org command mapping so root, Team and Agent sparse maps—including Team `workspaceRootPath`—reach the already generated GraphQL input. No server field or effective-resolution logic is added. |
| Add/Modify tests | `components/workspace/config/__tests__/AgentOrgRunConfigPanel.spec.ts`, `MemberOverridesDisclosure.spec.ts`, existing `TeamRunConfigForm.spec.ts`, `stores/__tests__/agentOrgRunConfigStore.spec.ts`, and `utils/__tests__/editableAgentOrgRunFormModel.spec.ts` | Prove SCN-013/VIS-OVR desktop+narrow hierarchy, default/independent disclosure, exact count, local state labels, coordinator Agent row, reset isolation, collapse persistence, workspace serialization, fail-closed projection, direct-Agent stability, and standalone Team regression. |

No server, GraphQL schema/generated contract, stream, durable tree/sidecar,
definition, runtime lifecycle, task, migration, history, or active-workspace file
belongs to AD-REV-012. `CR-FIND-019` remains a separate Implementation Local Fix
and may be implemented in the same downstream source round, but it does not
expand this design. If implementation cannot achieve the focused experience
without changing the existing Org API or Team/Org ownership, it must return a
new Design Impact rather than inventing a generic config owner.

### AD-REV-013 Focused File Responsibilities

| Change | Target File | Responsibility |
| --- | --- | --- |
| Add | `autobyteus-web/utils/agentOrgLaunchPatch.ts` | Own pure/idempotent `canonicalizeAgentOrgPlacementLaunchPatch`; preserve sparse inheritance and materialize `llmConfig:null` for owned runtime/model without owned config. No catalog, store, GraphQL, or server imports. |
| Modify | `autobyteus-web/stores/agentOrgRunConfigStore.ts` | Own a launch-draft epoch and root workspace selection source (`untouched/defaulted/explicit`); own complete root runtime/model/config commands that clear dependent root config coherently; canonicalize every exact Team/Agent patch at set/edit time; retain only canonical maps. Same-definition new Run starts a fresh epoch; re-render/retry/error does not. |
| Modify | `autobyteus-web/utils/editableAgentOrgRunFormModel.ts` | Project preview from the canonical maps, including exact root -> Team -> Agent workspace/config inheritance; expose invariant diagnostic rather than compensating for raw patches. |
| Modify | `autobyteus-web/components/workspace/config/AgentOrgRunConfigPanel.vue` | Replace direct root runtime/model/config ref assignment with Org-store root commands; remove local `serializeOverride`; call the canonical launch-input mapper; enable the existing root default workspace policy; preserve explicit selection and all AD-REV-012 Team presentation behavior. |
| Modify, only if needed to expose the existing policy without duplication | `autobyteus-web/components/workspace/config/WorkspaceSelector.vue`, `TeamScopeConfigEditor.vue` | Keep one root-only available-default selection contract used by Team and Org. Descendant editors remain `auto-select-default=false`; no Org branch or hard-coded path. |
| Modify | `autobyteus-web/components/AppLeftPanel.vue` | Always mount `WorkspaceAgentRunsTreePanel`; remove `showAgentOrgRunHistory`, Org history import, and route-selected panel branch. Route continues to choose center content only. |
| Modify | `autobyteus-web/stores/runHistoryStore.ts`, `runHistoryLoadActions.ts`, `runHistoryStoreSupport.ts`, `runHistoryTypes.ts`, `utils/runTreeProjection.ts`, `composables/useWorkspaceHistoryTreeState.ts` | Own one refresh that combines existing `ListWorkspaceRunHistory` Agent/Team data with only the strictly parsed AgentOrg branch of existing `ListCollaborationRootHistory`; commit successful family slices without erasing the other on failure; preserve rows/state and expose ordered Agent/Team/AgentOrg collections with no duplicate Team ingestion, kind inference, or lifecycle commands. |
| Modify | `autobyteus-web/stores/agentOrgRunStore.ts` | Retain launch/restore/terminate command state only; remove `history`, `historyError`, `fetchHistory`, and command-internal history refresh. Command callers/typed action adapter request the unified read-owner refresh after success. |
| Modify | `autobyteus-web/components/workspace/history/WorkspaceAgentRunsTreePanel.vue`, `WorkspaceHistoryWorkspaceSection.vue`, and `workspaceHistorySectionContracts.ts` | Render `Agent Orgs` immediately below `Teams`, compose the existing Org root/hierarchy/status rows, preserve expansion/selection/scroll, and emit typed subject actions. |
| Extract then delete | `autobyteus-web/components/workspace/history/AgentOrgRunHistoryPanel.vue` | Move reusable Org row/tree presentation into the unified workspace-section path, then delete this competing whole-panel owner. No wrapper, feature flag, or fallback remains. |
| Modify | Existing Org lifecycle/selection composables or add a narrow `useWorkspaceHistorySubjectActions.ts` | Dispatch `{rootSubjectKind,rootRunId,action}` to the matching existing Agent/Team/Org store; never expose mounted-Team lifecycle or make the unified read model a runtime owner. |
| Add/Modify tests | `utils/__tests__/agentOrgLaunchPatch.spec.ts`, `components/workspace/config/__tests__/AgentOrgRunConfigPanel.spec.ts`, `stores/__tests__/agentOrgRunConfigStore.spec.ts`, `components/__tests__/AppLeftPanel.spec.ts`, `components/workspace/history/__tests__/WorkspaceAgentRunsTreePanel.spec.ts`, `stores/__tests__/runHistoryStore.spec.ts`, plus server resolver/run snapshot integration fixtures | Prove SCN-014-016: complete-root and sparse-placement explicit-clear/effective equality matrix, actual default/explicit choice/inheritance, one mounted panel across routes, category order and retained state, Org-only workspace non-empty rendering, strict Org-tree/family rejection, normalized/catalog-missing/null-workspace grouping, no duplicate Team rows across the two existing queries, partial-query failure retention, exact root actions/refresh, no Org-under-Team, no old Org-store history cache/panel, and standalone Team regression. |

No server implementation, GraphQL/generated type, persisted tree/sidecar,
migration, stream, AgentOrg runtime context, focus, task, provider lifecycle, or
Product file belongs to AD-REV-013. Server tests may consume shared JSON fixture
inputs but server source semantics remain unchanged. If implementation requires
a new field, resolved launch payload, history API/schema, or lifecycle owner, it
must return a Design Impact rather than broadening this correction.

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
| Task lifecycle engine / message engine | Collaboration execution task/communication | Task record/FIFO/terminal-sweep and message reservation policy are common while subject adapters own exact durability | Subject tree/index/persistence/event union or waiting non-quiescent settlement |
| Non-waiting termination preparation | AgentRun plus local Team composition | Both roots settle the same Agent/task-Team mechanics and need one atomic prepared-or-deferred lifecycle result | Task state, root identity, polling, timeout, persisted settlement state, or second coordinator |
| Root-shutdown Agent fence | AgentRun, forwarded by configured handles and recursively invoked by frozen subject scopes | Every Team/Org placement shares the same input/provider/turn lifecycle and must close the same pre-turn-start gap | Root task coordinator, public shutdown token, persisted phase, subject-generic root, timeout, or active-turn-only wrapper |
| Atomic run-package file writer | run-history physical persistence | Temp-write/fsync/rename outcome reporting is subject-agnostic | Schema/path selection or root transaction owner |
| Launch configuration merge | Collaboration resolver + pure field merge module | Org and Team reuse field precedence | Focus/coordinator policy |
| Task delegation record/FIFO engine | Collaboration execution task owner | Both roots share record lifecycle/queue while adapters own exact host/tree commits | Root aggregate, subject tree union, or configured membership API |
| Handoff UI model | web collaboration components | Display/edit commands repeat | Endpoint/persistence owner |
| Mixed projection DTO | stream/history contract | Server/web share explicit union | Client-inferred kind |
| Agent presentation message | `@autobyteus/agent-presentation-contracts` | Team and Org deliver the same accepted Agent conversation/status/tool/activity semantics | Root envelope, sequence, subject-specific token root field, or runtime event union |
| `AgentOrgExecutionContext` | web AgentOrg execution | Org topology plus all derived live Agent/Team presentation must change as one candidate | Raw-event journal, durable focus, or second root authority |
| `ActiveAgentWorkspaceTarget` / `AgentInteractionPort` | web active-context boundary | Existing composer/tool/header/right surfaces need one exact focused Agent and command owner | Generic root selector, socket access, or implicit focus fallback |
| `TeamWorkspaceContextView` | web Team workspace presentation | Standalone and Org-mounted Teams share one accepted read-only view | Team lifecycle/store/registry interface or writable mounted root |
| `MemberOverridesDisclosure` | web launch presentation | Team and Org forms require the same approved outer disclosure/a11y/compact label grammar | Draft owner, member traversal, override policy, launch command, or subject switch |
| `EditableTeamScopeFormModel` / Team tree editors | web Team launch presentation | A mounted flat Team is a real Team placement with the same Team/Agent fields and row semantics | Generic Team/Org domain model, Team run store coupling, nested Team tree, or API payload |
| AgentOrg form projection | web AgentOrg launch owner | One pure boundary translates the distinct Org draft into the accepted Team view models | Second effective-config resolver, silent repair/omission, or writable Team definition adapter |
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
| `AgentPresentationMessage` | Yes | Medium | One strict event-type/detail pair; root, member, run and sequence identity live only in subject envelopes. |
| `AgentOrgExecutionContext` | Yes | Medium | One correlated Org view plus per-Agent presentation contexts; remove parallel root event arrays and duplicate focus. |
| `ActiveAgentWorkspaceTarget` | Yes | Medium | Four exact tagged branches with mandatory subject command/browse ports; no optional identifiers or inferred selection. |
| `TeamWorkspaceContextView` | Yes | Medium | Read-only presentation and scoped task/message access only; root lifecycle/persistence is deliberately absent. |
| `PreparedTaskSettlement` | Yes | High | Existing exact binding/handle prepared termination after proven quiescence; cancel/commit/finish and root fail-stop semantics remain unchanged. |
| Non-waiting quiescence result | Yes | High | `null` or existing prepared termination only; no parallel status, token, job, retry counter or persisted representation. |
| AgentRun root-shutdown fence state | Yes | High | One boolean/latch plus the existing single dispatch slot and interrupt reservation under AgentRun; no root/task identity, second queue, public token, or persistence. |
| Frozen subject termination scope | Yes per subject | Medium | Team scope is recursively reusable; Org scope composes direct handles and Team scopes privately instead of a mostly-optional generic root type. |
| AgentOrg Team/Agent sparse launch maps | Yes per exact placement kind | Medium | Split exact Team and Agent address maps; remove the current mixed map rather than retaining parallel authorities or reusing TeamRunConfig root shape. |
| `EditableTeamFormTeamNode` emitted by Org projector | Yes — presentation of one mounted flat Team | Medium | Populate only existing Team-scope fields, exact direct Agent children and coordinator identity; add no Org root/payload/lifecycle fields or nested Team children. |
| AgentOrg form projection result | Yes — complete success view or blocking diagnostic | Low | Use a closed discriminated result; success cannot silently omit invalid refs and failure cannot produce a launchable partial view. |

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
| `.../agent-collaboration/execution/backends/configured-agent-execution-handle.ts` | Collaboration Execution | AgentRun candidate prepare/restore/publish/abort, local commands/events/termination, narrow root-shutdown fence forwarding | Mandatory tagged identity/scope/callbacks; no root enumeration or input policy. |
| `.../agent-collaboration/execution/backends/configured-agent-execution-factory.ts` | Collaboration Execution | Controlled handle construction | No service locator or root selection. |
| `.../agent-collaboration/execution/task/root-task-lifecycle-engine.ts` | Collaboration Execution | Task record/review policy, one FIFO, terminal sweep, non-waiting settlement deferral and current deepest-first retry | Adapter only; no Team/Org tree/store/event and no wait on active provider work. |
| `.../agent-collaboration/execution/task/root-task-lifecycle-command-queue.ts` | Collaboration Execution | Serialize/admit/drain existing task mutation/settlement closures | No AgentRun/provider/Team/Org registry imports. |
| `.../agent-execution/domain/agent-run.ts` | Agent Execution | Atomic prepared-or-null termination eligibility, claim/provider-start serialization, irreversible root-shutdown fence, canonical interrupt/terminal completion, and existing lifecycle commit | No task/root/persistence knowledge; no racy external status check or timeout policy. |
| `.../agent-execution/input/agent-run-input-admission-state.ts` | Agent Execution | Canonical unresolved-input/quiescence plus root-fence invalidation/cancellation transition under AgentRun dispatch | Reuse exact lifecycle facts; not public status and no provider/task policy. |
| `.../agent-collaboration/execution/task/member-task-command-capability.ts` | Collaboration Execution | Selector-free Agent tool command boundary | Returns results, never root aggregate. |
| `.../agent-collaboration/execution/communication/root-communication-engine.ts` | Collaboration Execution | Accepted-message record/reservation lifecycle | Adapter only; no Team/Org envelope. |
| `.../agent-collaboration/execution/services/active-collaboration-root-directory.ts` | Collaboration Execution | Compound tagged root -> narrow live message/query capability | No lifecycle, concrete aggregate or bare-ID lookup. |
| `.../agent-collaboration/execution/services/collaboration-execution-location-service.ts` | Collaboration Execution | Compose strict Team/Org Agent locations for mixed consumers | Explicit kind/correlation; no payload guessing. |
| `.../run-history/domain/run-execution-tree-shared-records.ts` | Persistence | Shared exact record types | No root union. |
| `.../run-history/store/run-execution-tree-shared-record-schemas.ts` | Persistence | Shared exact record validators | No path/family selection. |
| existing `.../agent-team-execution/domain/team-run-execution-tree.ts` | Team Execution | Exact Team V2 domain/root | Compose shared records; Agent-only members. |
| `.../agent-team-execution/domain/frozen-team-run-termination-scope.ts` | Team Local Execution | Immutable recursive fence/prepare/finish contract for one Team subtree | No active-turn inference, root package, task record, or provider policy. |
| `.../agent-team-execution/local/flat-team-execution-manager.ts` | Team Local Execution | Freeze exact direct/task/prepared handles and child task Teams; invoke Agent fences recursively | No configured child Team, subject root persistence, or Agent input internals. |
| existing `.../run-history/store/team-run-execution-tree-schema.ts` | Team Persistence | Strict V2 exact keys/invariants | Never accept Org V1. |
| existing `.../run-history/store/team-run-execution-tree-path.ts` | Team Persistence | `$MEMORY_ROOT/agent_teams/<id>/team_run_execution_tree.json` | Unchanged. |
| existing `.../run-history/store/team-run-execution-tree-store.ts` | Team Persistence | Native V2 atomic read/write | No try-Org fallback. |
| `.../run-history/store/atomic-run-package-file-commit-writer.ts` (move/rename existing Team writer) | Physical Persistence | Subject-neutral temp-write/fsync/rename outcome reporting | No schema/path/root transaction policy; Team and Org stores supply strict file roles. |
| `.../agent-org-execution/domain/agent-org-run-execution-tree.ts` | Org Execution | Exact Org V1 domain/root | Compose shared records. |
| `.../agent-org-execution/domain/agent-org-run.ts` | Org Execution | Org aggregate/direct Agent/Team handles/index/events and exact root shutdown sequence | No coordinator; owns Org operations but delegates Agent input policy. |
| `.../agent-org-execution/domain/agent-org-run-operation-gate.ts` | Org Execution | Close/admit/drain operations that can publish handles or commit reserved input before freeze | No task settlement FIFO, provider wait, or persistence policy. |
| `.../agent-org-execution/domain/frozen-agent-org-termination-scope.ts` | Org Execution | Private immutable composition of direct Agent handles and Team frozen scopes | No generic root, mounted-Team lifecycle, Agent input policy, or persistence. |
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
| `.../api/graphql/types/agent-org-member-run-view.ts` and existing active-trace type | GraphQL Org Read | Exact Org member conversation/activity/checkpoint and `agentOrgMember` trace browse | Require `{orgRunId,memberAddress,agentRunId}` and the Org projection service; never call Team member projection with an embedded Team ID. |
| existing Team GraphQL definition/run files | GraphQL | Flat Team authoring/native launch | Remove nested input; preserve compatible Team results where possible. |
| `autobyteus-agent-presentation-contracts/src/agent-presentation-message-dtos.ts` | Agent Presentation Contract | Strict root-neutral Agent conversation/status/tool/activity/input/error schemas and parser | No root/member/run identity, sequence, subject snapshot or client command. |
| `.../token-usage-presentation-dto.ts` | Agent Presentation Contract | Root-neutral token detail shared by subject serializers | No Team-named root field. |
| `.../agent-collaboration/execution/events/collaboration-agent-presentation-adapter.ts` | Server Agent Presentation | Raw AgentRun/member-input/status/readiness admission into publish/filter/reject | No Team/Org envelope, broadcaster or persistence. |
| `.../agent-team-execution/services/team-flat-execution-callbacks.ts` and existing Team stream projector | Team Presentation Adapter | Use the shared admission result, then serialize the unchanged Team message/envelope | Team-only wire remains a compatibility golden; no Org branch. |
| existing Team stream contract/projector files | Team Stream | Team-only V2-compatible snapshot/events and current outer field spellings | Compose shared details internally; no Org payload or forced client migration. |
| `autobyteus-collaboration-stream-contracts/src/root-execution-view-dtos.ts` with package name `@autobyteus/collaboration-stream-contracts` | Mixed/Org Stream | Exact Org snapshot/event/lifecycle, send/interrupt/approve/deny commands and command acknowledgements; tagged Team/Org dispatch | No `z.unknown()`/`any` inside the Org snapshot/live branch; must not replace Team-only contract unless all consumers intentionally migrate. |
| `.../services/agent-streaming/agent-org-execution-view-projector.ts` | Org Stream Projection | Project correlated Org snapshot and strict Agent/task/communication event branches with one root sequence | Cannot pass through `AgentOrgRunEvent` or raw runtime payload. |
| `.../services/agent-streaming/agent-org-stream-handler.ts` | Org Stream Commands | Parse strict Org commands, validate exact target/root, invoke `AgentOrgRun.executeAgentCommand`, publish typed ack/error | No one-off send-only path and no member fallback. |
| `.../run-history/services/agent-org-member-run-view-projection-service.ts` | Org Member Projection | Hydration projection for exact Org direct/mounted/task Agent from Org location-backed traces | Explicit compound identity; no Team store/location/definition lookup. |
| `autobyteus-web/stores/agentOrgDefinitionStore.ts` | Web Authoring | Org catalog/draft/revision/errors | Org GraphQL only. |
| `autobyteus-web/stores/agentTeamDefinitionStore.ts` | Web Authoring | Flat Team draft/revision/errors | Team GraphQL only. |
| `autobyteus-web/components/collaboration/handoffs/HandoffList.vue` | Web UI | Ordered From/To/When display/read-only owner label | Presentation only. |
| `.../HandoffEditor.vue` | Web UI | Inline endpoint/condition CRUD/reorder/cancel/errors | Subject commands/catalog only. |
| `autobyteus-web/stores/agentOrgRunConfigStore.ts` | Web Org Config | Org root draft, canonical exact Team/Agent sparse patches, Team workspace selection/operation state, untouched/explicit root workspace state, exact commands and scoped errors | No focus, Team run draft/payload, disclosure state, or effective server resolution. |
| `autobyteus-web/utils/agentOrgLaunchPatch.ts` | Web Org Config Contract | Canonicalize sparse placement intent and explicit dependent `llmConfig:null` clear | Pure/idempotent; no store, catalog, GraphQL, or server import. |
| existing Team run config store (renamed only if repository convention demands) | Web Config | Simplified Team root/Agent overrides | Coordinator behavior retained. |
| `autobyteus-web/utils/editableAgentOrgRunFormModel.ts` | Web Org Config Projection | Strict admitted Org/flat-Team/draft to exact Team presentation nodes, configurable-Agent count and blocking diagnostic | Pure and fixed-depth; no store write, payload serialization, silent omission or repair. |
| `autobyteus-web/components/workspace/config/MemberOverridesDisclosure.vue` | Web Shared Config Presentation | Accepted label/count/adjacent-chevron disclosure, a11y and visibility-preserving slot | No draft, traversal, override or launch authority. |
| `autobyteus-web/components/workspace/config/AgentOrgRunConfigPanel.vue` | Web Org Config Adapter | Compose Org root inputs/default workspace policy, shared disclosure/Team editors, direct-Agent row and canonical exact Org edit/launch commands | No local object-spread serializer, bespoke mounted-Team editor, Team store import, effective resolver, or API field invention. |
| `autobyteus-web/components/workspace/config/TeamMemberConfigTree.vue`, `TeamScopeConfigEditor.vue`, `MemberOverrideItem.vue` | Web Team Config Presentation | Established Team row/scope/direct-Agent field and edit-event grammar reused for standalone and mounted Team presentation | No Org branch/store/payload/lifecycle and no configured Team recursion. |
| `autobyteus-web/components/workspace/config/AgentOrgDirectAgentOverrideRow.vue` | Web Org Direct-Agent Presentation | Retained compact direct Agent override row only | No Team kind, fabricated Team node, coordinator text or Team disclosure. |
| `autobyteus-web/services/agentOrgExecution/agentOrgExecutionContext.ts` | Web Org Runtime | Correlated Org view/tasks/messages/status, per-Agent `AgentContext`s, mounted-Team views, nullable focus and stream phase | Sole active Org authority; no raw event array or durable focus. |
| `.../agentOrgExecutionContextHydrationService.ts` | Web Org Runtime | Build candidate context from strict resume/member projections/workspace resolution and checkpoint barriers | Last committed context remains visible until atomic swap. |
| `.../AgentOrgStreamingService.ts` | Web Org Runtime | Strict handshake/snapshot/sequence recovery and exact `dispatchAgentStreamMessage` routing | Components never receive protocol envelopes; invalid messages enter `reopen_required`. |
| `autobyteus-web/stores/agentOrgContextsStore.ts` | Web Org Runtime | Context lifecycle, exact focus and lookup by Org run | No registration in `agentTeamContextsStore`. |
| `autobyteus-web/stores/rootExecutionViewStore.ts` | Web Workspace | Tagged route/history connection facade and subject delegation | Remove Org `events[]`, duplicate Org tree/focus and direct `sendAgentOrgMessage`. |
| `autobyteus-web/stores/activeContextStore.ts` plus `types/workspace/activeAgentWorkspaceTarget.ts` | Web Interaction | Resolve four exact target branches and expose context plus `AgentInteractionPort` | Shared composer/tool components never switch on root stores/sockets. |
| `autobyteus-web/services/eventMonitor/eventMonitorActiveTraceBrowse.ts` and page service | Web Trace Browse | Add strict `agentOrgMember` browse subject and Org projection query | No fake Team run ID or generic bare AgentRun lookup. |
| `autobyteus-web/components/workspace/agent/AgentWorkspaceSurface.vue` | Web Shared Agent Surface | Accepted Agent header/status/event monitor/composer from explicit target/action props | No selection or subject store import. |
| existing `.../agent/AgentWorkspaceView.vue` | Web Standalone Agent Wrapper | Adapt standalone Agent stores/actions into `AgentWorkspaceSurface` | No duplicated workspace markup. |
| `autobyteus-web/components/workspace/team/TeamWorkspaceSurface.vue` | Web Shared Team Surface | Accepted Team-member header/recovery/event monitor/composer from `TeamWorkspaceContextView` and action ports | No Team registry/root lifecycle assumption. |
| existing `.../team/TeamWorkspaceView.vue` | Web Standalone Team Wrapper | Adapt `AgentTeamContext` and standalone actions into Team surface | No duplicated workspace markup. |
| existing `.../team/AgentTeamEventMonitor.vue` and `.../agent/AgentEventMonitor.vue` | Web Accepted Event Presentation | Render exact focused `AgentContext` conversation/tool/activity and accepted composer | Consume active-target/context ports only; no root event formatting. |
| `autobyteus-web/components/workspace/org/AgentOrgWorkspaceView.vue` | Web Org Focus Adapter | Render approved null-focus prompt, Agent surface, or Team surface from exact Org target | Delete custom header/event cards/textarea/JSON fallback/Stop Org. |
| `autobyteus-web/components/layout/RightSideTabs.vue` and Team overview/tool consumers | Web Contextual Tools | Resolve files/activity/token/artifact/Team view from `ActiveAgentWorkspaceTarget` | No global standalone-Team inference for mounted Teams and no wrong-family query. |
| `autobyteus-web/components/AppLeftPanel.vue` | Web Shell | Always mount one unified Workspace/history panel; route chooses center content only | No root-kind panel switch or Org history import. |
| `autobyteus-web/stores/runHistoryStore.ts`, `runHistoryLoadActions.ts`, `runHistoryStoreSupport.ts`, `runHistoryTypes.ts`, `utils/runTreeProjection.ts`, `composables/useWorkspaceHistoryTreeState.ts` | Web Mixed History Read | Own the established Workspace Agent/Team slice plus the strictly parsed AgentOrg-only slice from the two existing queries; atomically retain per-family success/error state, merge explicit-kind roots into one route-stable workspace/category projection, and retain navigation state | No duplicate Team ingestion, unchecked Org JSON cast, subject runtime/lifecycle ownership, kind inference, or current-route input. |
| `autobyteus-web/stores/agentOrgRunStore.ts` | Web Org Commands | Launch, restore and terminate one exact Org and expose command pending/errors/results | No history rows/query/cache; successful callers invalidate/refresh the unified read owner. |
| `autobyteus-web/components/workspace/history/WorkspaceAgentRunsTreePanel.vue`, `WorkspaceHistoryWorkspaceSection.vue`, `workspaceHistorySectionContracts.ts` | Web Unified History Presentation | Existing categories plus Agent Orgs directly below Teams, exact Org hierarchy/status, typed subject action emission | No concrete all-store imports in row components and no mounted-Team root action. |
| `autobyteus-web/composables/useWorkspaceHistorySubjectActions.ts` (or tightened existing selection/mutation composables) | Web History Command Adapter | Dispatch explicit-kind root actions to existing Agent/Team/Org stores | No history-state ownership or mounted-Team lifecycle. |
| `autobyteus-web/utils/workspaceTeamAggregateStatus.ts` | Web Status Presentation | Pure five-state normalization/precedence with live/history authority | No topology, state, store, polling, transport or lifecycle. |
| `autobyteus-web/services/agentOrgExecution/agentOrgTeamBranchStatus.ts` | Web Org Hierarchy Projection | Exact one-Team branch AgentRun enumeration and status-source projection | Strict Team node and injected resolver only; includes task descendants, excludes outside branches. |
| `autobyteus-web/components/workspace/history/TeamAggregateStatusDot.vue` | Web Shared Hierarchy Presentation | Established dot grammar and accessible Team status label/title | Shared by retained Team history and AgentOrg; not a root activity indicator. |
| deleted `autobyteus-web/components/workspace/history/AgentOrgRunHistoryPanel.vue` | Removed competing Web history owner | Org row/tree concerns move into unified workspace-section components; file/import/tests removed atomically | No wrapper, flag, route fallback, or duplicate state remains. |
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
- **Pure branch aggregate projection:** subject-shaped traversal supplies only exact descendant Agent status values to one root-neutral five-state fold and one accessible dot; expansion and root lifecycle never become inputs.
- **Target-only admission result:** source classification and exact decoding
  produce available definitions or actionable data; there is no exception-driven
  fallback parse and live definition availability never reinterprets history.
- **Strict presentation admission:** one root-neutral adapter transforms raw
  Agent execution callbacks into a closed Agent presentation union before either
  subject stream serializes it; rejection is a recovery signal, never renderable
  content.
- **Candidate context swap:** Org hydration and stream recovery build and
  correlate an isolated `AgentOrgExecutionContext`, then publish it atomically;
  the accepted surface never observes half-hydrated AgentContexts.
- **Port-driven accepted workspace:** standalone Agent, standalone Team, Org
  direct Agent, and Org Team member targets adapt into the same Agent/Team
  surfaces and interaction ports. Reuse is structural, not copied markup.
- **Subject-owned draft, shared presentation:** Team and Org keep separate
  launch stores and payloads, while a pure Org projector adapts a real mounted
  flat Team into the accepted Team form view models and typed edit events. The
  UI is visually and behaviorally continuous without a generic domain owner.
- **Root lifecycle action placement:** root stop belongs to the subject history
  row; member focus and mounted-Team presentation cannot acquire root lifecycle
  authority.
- **Idle-gated existing settlement:** terminal task settlement tries to prepare
  the exact execution only if already quiescent. Active work defers without
  waiting and retries on the established idle event; prepared work uses the
  existing durable transaction. Root shutdown completes the stable frozen
  scope's AgentRun input/provider-start/interrupt fence before either general
  task-command or settlement drain.

## Target Subsystem / Folder / File Mapping

| Path | Kind | Owner | Responsibility | Must Not Contain |
| --- | --- | --- | --- | --- |
| `autobyteus-server-ts/src/collaboration-definition-admission/` | New folder | Definition Admission | source registry, exact target admission/dependency closure, diagnostics/new-work gate | legacy decoder, definition writes, runtime/history policy |
| `autobyteus-server-ts/src/agent-org-definition/` | New folder | Org Definition | Org domain/provider/service/source ownership | runtime managers, Team mutation |
| `autobyteus-server-ts/src/agent-team-definition/` | Existing folder | Team Definition | Agent-only Team/coordinator/local Agents | Org members, recursive resolver |
| `autobyteus-server-ts/src/agent-collaboration/definition/` | Existing/extended | Collaboration | resolved variants, endpoint catalog, handoff compilation | file I/O, live runs |
| `autobyteus-server-ts/src/agent-collaboration/services/` | Existing/extended | Collaboration | configuration resolver | runtime root registry or persisted root union |
| `autobyteus-server-ts/src/agent-collaboration/execution/` | New extraction folder | Collaboration Execution | tagged identities/context, configured-Agent backend, one task lifecycle engine, message engine, active-root directory, mixed location facade | concrete RootTeamRun/AgentOrgRun, subject tree/store/event, waiting non-quiescent local settlement, GraphQL |
| `autobyteus-server-ts/src/agent-execution/{domain,input}/` | Existing folders | Agent Execution | canonical input/dispatch/turn lifecycle, ordinary termination, quiescent preparation, irreversible root-shutdown fence | task records, root enumeration, subject persistence, provider timeout/replay policy |
| `autobyteus-server-ts/src/agent-team-execution/` | Existing folder | Team Execution | native RootTeamRun/manager/service, flat planner, Team adapters; `local/` owns root-neutral flat-Team execution | Org root, configured Team children, Org persistence |
| `autobyteus-server-ts/src/agent-org-execution/` | New folder | Org Execution | AgentOrgRun/manager/service/planner/index, explicit scope builder, Org operation gate/frozen termination composition, adapters/events/sidecars/persistence | Team V2 authority, coordinator, catch-all activator, Agent input policy, generic root |
| `autobyteus-agent-presentation-contracts/src/` | New workspace package | Agent Presentation Contract | strict root-neutral Agent presentation details and parsers | subject/root envelope, change sequence, stream socket or UI state |
| `autobyteus-server-ts/src/run-history/domain/` | Existing folder | Persistence contracts | shared exact records + subject history rows | generic persisted root |
| `autobyteus-server-ts/src/run-history/store/team-run-execution-tree-*.ts` | Existing files | Team Persistence | exact native V2 schema/path/store | Org keys or fallback |
| `autobyteus-server-ts/src/run-history/store/agent-org-run-execution-tree-*.ts` | New files | Org Persistence | exact V1 schema/path/store | Team root or try-both logic |
| `autobyteus-server-ts/src/agent-memory/store/agent-memory-layout.ts` and mixed location callers | Existing files | Memory layout | tagged family root plus unchanged relative TeamRun ancestry | shallow Org-only path, inferred kind, or flat-Team path rewrite |
| `autobyteus-server-ts/src/run-history/services/root-*-projection*.ts` | New files | Mixed Read | explicit-kind derived catalog/tree projection | lifecycle, kind inference |
| `autobyteus-server-ts/src/run-history/services/agent-org-member-run-view-projection-service.ts` | New file | Org Member Read | exact Org member conversation/activity/checkpoint projection | Team-root location, current definition reinterpretation |
| `autobyteus-server-ts/src/run-history/services/root-run-package-readiness-index.ts` | New file | Current Run Readiness | family-path/target-manifest inventory and compound-kind readiness | legacy payload decoder, transformation, or try-both validation |
| `autobyteus-server-ts/src/app-data-migrations/migrations/agent-org-flat-team-families-v1/` | New folder | Migration | server-owned retired definition and Org-like Team Run conversion knowledge | current services importing old codecs; external writers/converters |
| `autobyteus-server-ts/src/api/graphql/types/agent-org-*.ts` | New files | GraphQL Org adapter | Org definitions/run APIs | Team coordinator default/focus |
| `autobyteus-server-ts/src/api/graphql/types/definition-admission.ts` | New file | GraphQL Operations | actionable unavailable definition/dependency diagnostics | fallback activation or source mutation |
| existing `agent-team-*.ts` GraphQL files | Existing files | GraphQL Team adapter | flat Team APIs | Team member kind containing Team |
| `autobyteus-team-stream-contracts/` | Existing package | Team stream | compatible Team-only view/events | Org payload |
| `autobyteus-collaboration-stream-contracts/` | New package | Mixed/Org stream | tagged Team/Org dispatch plus strict Org snapshot/events/commands/acks | runtime logic, opaque payloads or inferred kind |
| `autobyteus-web/components/agentOrgs/` | New folder | Web Org | RV-012 catalog/detail/builder | coordinator/entry/copy Team |
| `autobyteus-web/components/agentTeams/` | Existing folder | Web Team | Agent-only Team authoring/detail | Team library/nesting UI |
| `autobyteus-web/components/collaboration/handoffs/` | New shared UI | Handoff presentation | From/To/When list/editor/reorder/errors | endpoint/persistence policy |
| `autobyteus-web/stores/{agentOrgRunConfigStore,teamRunConfigStore}.ts` | Existing/refactored | Web config subject owners | separate root/placement drafts; Org uses exact Team/Agent maps and existing Org payload | one conditional cross-subject blob or cross-store import |
| `autobyteus-web/utils/agentOrgLaunchPatch.ts` | New file | Web Org config contract | canonical sparse Team/Agent patches with explicit dependent config clear | store/API imports, parallel raw state, server policy |
| `autobyteus-web/utils/editableAgentOrgRunFormModel.ts` | New file | Web Org config projection | strict fixed-depth Org/Team definition + draft to accepted Team view models/count/diagnostics | store mutation, launch payload, silent omission/repair, nested Teams |
| `autobyteus-web/components/workspace/config/MemberOverridesDisclosure.vue` | New extracted file | Web shared config presentation | accepted compact outer disclosure/a11y/visibility-preserving slot | subject state, traversal, patches, API |
| `autobyteus-web/components/workspace/config/{TeamMemberConfigTree,TeamScopeConfigEditor,MemberOverrideItem}.vue` | Existing/reused | Web Team config presentation | accepted Team row/scope/Agent field and typed edit grammar | Org store/payload branches, lifecycle, configured Team recursion |
| `autobyteus-web/components/workspace/config/AgentOrgRunConfigPanel.vue` | Existing/refactored | Web Org config adapter | compose strict Org projection, shared root workspace default and canonical existing Org launch command | local serializer, bespoke mounted-Team hierarchy, Team run store/payload, effective server policy |
| `autobyteus-web/components/AppLeftPanel.vue` | Existing/simplified | Web shell | one always-mounted Workspace history surface | route/root-kind history component selection |
| `autobyteus-web/{stores/runHistoryStore.ts,stores/runHistoryLoadActions.ts,stores/runHistoryStoreSupport.ts,stores/runHistoryTypes.ts,utils/runTreeProjection.ts,composables/useWorkspaceHistoryTreeState.ts}` | Existing/refactored | Web mixed history read model | combine the existing Workspace Agent/Team query and only the strict AgentOrg branch of existing collaboration-root history; retain per-family results/errors, tagged grouping, ordered categories and stable UI state | duplicate Team query rows, unchecked Org JSON, current route, subject runtime ownership, kind inference |
| `autobyteus-web/stores/agentOrgRunStore.ts` | Existing/simplified | Web Org command adapter | exact launch/restore/terminate pending/error/result only | history list/query/cache or import of the unified history store |
| `autobyteus-web/components/workspace/history/{WorkspaceAgentRunsTreePanel,WorkspaceHistoryWorkspaceSection}.vue` | Existing/refactored | Web unified history presentation | existing rows plus Agent Orgs immediately below Teams and typed subject actions | duplicate Org panel, mounted-Team root action, direct persistence |
| `autobyteus-web/services/rootExecution/` | New/refactored | Web mixed facade | tagged route/history dispatch | Org context duplication, raw event retention, definition policy, family guessing |
| `autobyteus-web/services/agentOrgExecution/` and `stores/agentOrgContextsStore.ts` | New/refactored | Web Org runtime | strict context hydration, streaming, AgentContexts, mounted-Team views, nullable focus/recovery | standalone-Team registration, protocol rendering, durable focus |
| `autobyteus-web/components/workspace/{agent,team}/*Surface.vue` | New by extraction | Web accepted workspace | store-neutral Agent/Team runtime presentation and action ports | root sockets, subject stores, copied Org markup |
| `autobyteus-web/components/workspace/org/AgentOrgWorkspaceView.vue` | Replace in place | Web Org focus | approved no-focus prompt and exact shared-surface selection | raw event list, custom composer/header, JSON fallback, lifecycle button |
| workspace collaboration/right-tool/history components | Existing/refactored | Web workspace | Product runtime hierarchy, context tools and root actions | recursive configured depth, persisted focus, mounted-Team root authority |
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

AD-REV-007 clean-cut presentation renames are included in the same implementation commit: `NestedTeamAggregateStatusDot.vue` -> `TeamAggregateStatusDot.vue` and `workspaceHistoryNestedTeamStatus.ts` -> `workspaceHistoryTeamBranchStatus.ts`, with all imports/tests/localization keys updated and no alias component/module left behind.

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
- Replace `AgentOrgWorkspaceView.vue` as a unit: delete its raw `events`/`focusedEvents`
  consumption, `eventLabel`/`eventText`, `JSON.stringify` fallback, bespoke
  textarea/send form, custom focused-member header and member-header `Stop Org`.
  Delete the direct `rootExecutionViewStore.sendAgentOrgMessage` component path
  and the Org `events[]` reducer state after the typed context/interaction path
  is live. Do not leave the raw dashboard hidden behind a feature flag or error
  fallback.
- Extract the accepted markup/behavior from `AgentWorkspaceView.vue` and
  `TeamWorkspaceView.vue` into their surface components, then keep the original
  files only as standalone subject adapters. Do not copy those components under
  `workspace/org`, and do not remove or reimplement `AgentEventMonitor`,
  `AgentConversationFeed`, `AgentUserInputForm`, or the existing standalone Team
  confirmation behavior.
- Remove every `z.unknown()`/opaque payload in the AgentOrg snapshot/live-event
  branch of `@autobyteus/collaboration-stream-contracts` and every `any` cast used
  to render Org events. The Team-only contract may remain separately compatible;
  no normal dual Org event parser or JSON text fallback survives.
- Keep Org root termination on its root row after moving that row into the
  unified `WorkspaceAgentRunsTreePanel`/workspace-section path; remove any
  terminate command from focused Agent/Team surfaces. A mounted Team receives no
  stop control and is never inserted into standalone Team stores.
- Replace `AgentOrgPlacementOverrideRow` as one clean unit: remove its Team-kind
  branch and the current always-exposed Team-child rendering. Rename the retained
  direct-Agent-only concern to `AgentOrgDirectAgentOverrideRow`, or delete it if
  an existing exact primitive preserves that row. Do not keep an alias, feature
  flag, compatibility prop, or historical layout.
- Extract only the compact outer disclosure shell from `TeamRunConfigForm`; both
  callers use `MemberOverridesDisclosure`, while existing Team tree/scope/Agent
  editors remain the single Team presentation. Remove duplicated Org Team-row
  markup and any mixed Org `memberOverrides` store shape once exact Team/Agent
  maps and launch serialization are live.
- Extract the exact Org root/tree/status row concerns from
  `AgentOrgRunHistoryPanel` into the unified workspace-section presentation,
  then delete `AgentOrgRunHistoryPanel`, its `AppLeftPanel` route branch, and its
  standalone tests/imports in one change. Preserve root actions through the
  typed subject-action adapter; leave no wrapper, flag, or fallback panel.
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
| `autobyteus-agent-presentation-contracts` | Root-neutral wire detail package | Yes | Closed Agent presentation bodies are reused below Team/Org envelopes; no runtime or root owner leaks inward. |
| Team vs collaboration stream packages | Subject-only vs mixed transport | Yes | Avoids breaking Team-only consumers or false package naming. |
| Web `agentOrgs` / `agentTeams` | Subject-specific presentation | Yes | Prevents conditional invalid form state. |
| Web `rootExecution` | Mixed route/history facade | Yes | Dispatches by explicit root kind without duplicating subject contexts. |
| Web `agentOrgExecution` | Org browser aggregate | Yes | Hydration, stream, AgentContexts, mounted-Team views and focus recover together under one owner. |
| Web Agent/Team surface components | Store-neutral presentation boundary | Yes | Accepted workspace reuse is structural while standalone/Org wrappers retain subject command ownership. |
| Web `workspace/config` shared presentation | Disclosure plus Team scope/tree/direct-Agent editors | Yes | Mature Team launch visual/interaction grammar is reused; subject stores and command adapters remain outside the folder's presentation components. |
| Web AgentOrg config store/projector | Subject draft owner plus pure fixed-depth projection | Yes | Keeps exact Org state/payload separate while adapting mounted Teams to accepted presentation models. |

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
| Org launch hierarchy | Org-owned sparse maps -> strict fixed-depth projector -> shared collapsed Member overrides -> independently collapsed `TeamMemberConfigTree` -> exact Team/Agent edit commands -> unchanged Org launch input | Bespoke Org Team editor, always-exposed children, Team run store/payload reuse, or implicit inherited state | Same established user experience with distinct underlying ownership. |
| Org focus | launch returns Org run ID/focus null; explicit Team row maps to stored coordinator | pre-launch entry, first Agent, durable focus | Activation/target separation. |
| Org direct-Agent UI | strict Org event -> exact AgentContext -> `AgentWorkspaceSurface` -> accepted monitor/composer | raw root-event card or Org-specific textarea | VIS-017 is the accepted Agent conversation, not a dashboard. |
| Org Team UI | exact Team focus -> mounted `TeamWorkspaceContextView` -> `TeamWorkspaceSurface` -> coordinator/member AgentContext | register mounted Team as standalone or duplicate Team markup | VIS-018 reuses Team presentation without creating Team lifecycle authority. |
| Org Agent event | raw callback -> presentation adapter -> strict Org subject envelope -> stream reducer -> existing Agent handlers | `event: unknown`, component `any`, `JSON.stringify` | Protocol truth and UI state meet at one typed boundary. |
| Org commands | active target port -> strict send/interrupt/approve/deny command -> exact AgentOrgRun command -> typed ack | component-owned socket/send-only special case | Accepted composer and tool cards retain behavior parity. |
| Root stop | active Org history root-row action -> AgentOrgRunService termination | focused member header or mounted-Team terminate | Lifecycle action stays with its root owner. |
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
| Render raw AgentOrg events or keep a JSON fallback | Rejected | Strict Agent presentation admission, Org envelope, context reducer and accepted event monitor. |
| Maintain a separate AgentOrg runtime dashboard/composer/header | Rejected | Thin focus adapter over extracted Agent/Team workspace surfaces. |
| Register mounted Org Team in standalone Team stores to reuse UI | Rejected | Read-only `TeamWorkspaceContextView` adapter remains owned by `AgentOrgExecutionContext`. |
| Put Stop Org on a focused member surface | Rejected | Active Org history root-row lifecycle action; mounted Team has no independent stop. |
| Keep the superseded bespoke AgentOrg Team override layout beside the accepted Team editor | Rejected | One Org projector/command adapter drives the existing Team disclosure/scope/Agent components; remove the Team branch of `AgentOrgPlacementOverrideRow`. |
| Reuse `teamRunConfigStore` or Team launch payload to obtain UI parity | Rejected | Share presentation/view models only; Org draft maps and GraphQL launch input remain AgentOrg-owned. |
| Keep send-only Org socket commands | Rejected | Strict send/interrupt/approve/deny command and acknowledgement union behind `AgentInteractionPort`. |
| Treat `NO_ACTIVE_TURN` as complete root interruption while admitted/provider-start-pending input exists | Rejected | AgentRun-owned irreversible fence joins/cancels the exact input and resolves only when no post-phase provider start remains possible. |
| Change ordinary `prepareTermination()` to cancel all admitted input | Rejected as unnecessary behavior drift | Preserve its origin/personal FIFO-drain contract; cancellation is scoped to explicit root shutdown. |
| Add provider timeout, replay, force-kill, settlement coordinator/token/job, or persisted shutdown phase | Rejected as disproportionate | Existing AgentRun dispatch/admission/interrupt owner plus recursive frozen scopes close the supported race. |

## Derived Layering

Explanatory only:

1. **Presentation/transport:** root-neutral Agent presentation details,
   subject GraphQL, Team-only and mixed/Org streams, Agent tools, web
   authoring/config and shared Agent/Team workspace surfaces.
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

In the browser, `rootExecutionViewStore -> AgentOrgExecutionContext ->
ActiveAgentWorkspaceTarget -> Agent|TeamWorkspaceSurface` is the corresponding
authority chain. Components do not bypass the context to use the collaboration
socket, raw root events, standalone Team stores, or subject GraphQL clients.

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
    mismatch; GraphQL/streams; VIS-001-VIS-020, VIS-STATUS-001-003, and
    VIS-OVR-001-006 browser journeys; full builds/
   typechecks. No source-review handoff occurs until all partial-draft and
   obsolete-test failures are resolved.
22. **Freeze the API/E2E defect baseline before workspace recovery.** Preserve
   the real-browser `03-org-live-raw-events-defect.png` and its imported-package
   setup as failing evidence. Stop further API/E2E claims. Do not edit, reset,
   stage or merge downstream-owned partial tests/reports while applying this
   architecture revision.
23. **Establish strict Agent presentation admission first.** Extract the closed
   root-neutral Agent presentation schemas and server adapter from the accepted
   Team path. Make Team callbacks use the adapter while golden-testing every
   retained Team-only outer message. Replace the Org `unknown` event branch with
   strict Agent/task/communication branches and strict identity/sequence
   correlation before any Vue change.
24. **Complete the Org server projection and command boundary.** Project only
   admitted Agent presentation messages from Org callbacks; add exact Org member
   resume/conversation/activity/trace projection; extend Org streaming commands
   and acknowledgements for send, interrupt, approve and deny through
   `AgentOrgRun.executeAgentCommand`. Prove wrong root/member/run correlations,
   malformed messages and unsupported commands fail closed.
25. **Build one checkpointed Org browser context.** Add
   `AgentOrgExecutionContext`, hydration service, strict streaming state machine,
   per-Agent AgentContexts, mounted-Team presentation views and nullable exact
   focus. Candidate hydration/stream recovery must swap atomically. Reduce
   `rootExecutionViewStore` to route/history delegation and delete its duplicate
   Org tree/focus/raw-event authority.
26. **Extract and route through the accepted workspace surfaces.** Extract
   store-neutral `AgentWorkspaceSurface` and `TeamWorkspaceSurface` without
   changing accepted standalone rendering. Generalize the active-context target,
   interaction, trace, token/file/artifact and Team-view ports. Make the Org view
   select only prompt/Agent surface/Team surface; remove every custom Org event
   card, header, composer, JSON fallback and direct component socket call.
27. **Correct lifecycle-action placement.** Add active Org stop/pending/error to
   the Org history root row with established Team-history interaction placement;
   remove Stop Org from member focus and prove mounted Teams expose no terminate
   action. Retain the independent standalone Team members-panel confirmation
   behavior unchanged.
28. **Revalidate the accepted running experience before API/E2E resumes.** Run
   strict contract/parser and Team-wire golden tests; Org hydration/sequence-
   gap/reconnect tests; direct-Agent and mounted-Team conversation, context-file,
   interrupt and tool-decision component/integration tests; root-stop and
   mounted-Team negative tests; import-boundary scans; desktop/narrow/a11y
   screenshot comparison against VIS-016-VIS-018 and VIS-PROMOTE-002-004; then a
   real imported-package browser prompt that proves normal conversation/tool
   rendering and absence of raw JSON/custom Org controls. Source review and
   API/E2E may resume only after the revised independent Architecture Review
   passes and Implementation reconciles this sequence.
29. **Freeze the mounted-Team status gap evidence and authority.** Retain the user original-tree image, current `ORG-005` omission, CRR-009 failure-origin result, RER-021, focused Product spec/approval/manifest, and VIS-STATUS-001-003. Do not alter unrelated dirty API/E2E/test evidence.
30. **Extract the shared presentation policy cleanly.** Move five-state normalization/precedence into `workspaceTeamAggregateStatus.ts`; rename the reusable dot and Team-history adapter to neutral Team-branch names; update both locales/tests; leave no aliases or copied fold.
31. **Add the AgentOrg exact-branch adapter.** Traverse one configured Team node including recursive task-scoped Agent identities, inject status resolution from the exact Org context/history authority, exclude every outside branch, and normalize historical live-only/missing values as specified. Compute before collapse filtering.
32. **Wire the hierarchy without lifecycle changes.** Render the Team dot between disclosure and Team icon and exact Agent dots from the same authority. Preserve row focus, expansion, Org root stop, Team coordinator ingress, task interaction, and all backend/durable contracts.
33. **Revalidate the focused correction.** Run pure fold/traversal matrices, Team-history regressions, AgentOrg active reactive/expanded/collapsed/stopped component tests, a11y names/title, import/no-new-transport scans, and browser comparisons against VIS-STATUS-001-003 plus unchanged VIS-016-018. Then resume the normal Large/High source-review/API route only after Architecture Review passes.
34. **Freeze and classify API-FIND-008 evidence.** Retain the isolated passing
    control, the valid assignee-submit/delegator-accept prefix, the exact invalid-
    self-review reproduction, and ARCH-REV-006. Mark the invalid tail technical-
    only; never use it as a supported fixture or add timeout/replay machinery.
35. **Add the narrow AgentRun quiescence boundary.** Under AgentRun dispatch and
    input-admission ownership, implement `tryPrepareTerminationIfQuiescent` with
    immediate `null` for unresolved work and existing prepared termination for a
    quiescent run. Prove null has no admission/lifecycle side effect and no wait.
36. **Reconcile existing Team and Org settlement preparation.** Thread the new
    capability through configured Agent and task Team handles. A task-Team
    subtree prepares all-or-none; adapters treat null as existing deferred
    settlement, release the FIFO, and rely on existing idle/offline resweep.
    Preserve current `settledAt`, transaction, cancel/commit/finish, fail-stop,
    child eligibility, record, event and tool behavior. Add no coordinator/token.
37. **Add the irreversible AgentRun root-shutdown fence.** Serialize input claim
    and provider-start registration against `rootShutdownFenced`. Invalidate
    never-admitted reservations; emit the existing cancellation fact exactly
    once for admitted pre-forward entries; track provider-started/pre-turn work,
    interrupt on canonical start, and resolve only at terminal quiescence. Keep
    ordinary prepared termination's FIFO drain and make prepared cancellation
    unable to reopen a root-fenced run.
38. **Correct root shutdown composition in both families.** Root close first
    blocks every external/materialization/message admission and drains only
    already-admitted operations needed to stabilize active/prepared handle
    publication. Freeze the complete owned scope and recursively complete every
    AgentRun fence through direct Agents, mounted Teams, task Agents, prepared
    handles, and task Teams. Only then drain short task mutations, durably
    interrupt open task records, run deepest-first quiescent settlement, drain
    persistence, finish remaining local executions, and unregister. Preserve
    process Org -> standalone Team -> residual Agent order and aggregate real
    cleanup errors; do not introduce a timeout or force kill.
39. **Validate only supported liveness paths before API/E2E resumes.** Run the
    cumulative self-validation as a trace checklist. Deterministically hold a normal
    assignee provider turn open after successful submit while the different
    delegator accepts and an unrelated supported command completes; do not issue
    self-review. Separately hold a legitimate tool approval in an active task,
    enter Team/Org shutdown through the application handler, assert the full
    AgentRun fence precedes task drain, and complete. Retain current settlement failure and
    recursive task regressions. Then use normal task activation with a controlled provider barrier after
    input admission/provider-start registration but before `TURN_STARTED`, enter
    application SIGTERM, and prove either exact pre-forward cancellation or
    canonical start+interrupt; no provider call may occur after fence completion.
    Source review and cumulative API/E2E resume only after the coherent
    AD-REV-011 package independently passes and Implementation reconciles the
    reviewed AD-REV-009/010 mechanism.
40. **Freeze the superseded launch-override evidence and existing production
    reuse boundary.** Retain CRR-021/CR-FIND-020, RER-023, Product approval and
    VIS-OVR-001-006. Compare current `AgentOrgRunConfigPanel` and
    `AgentOrgPlacementOverrideRow` to the byte-identical current/origin-personal
    Team form chain. Do not edit Product artifacts or downstream-owned reports.
41. **Separate exact Org draft state before presentation reuse.** Replace the
    mixed Org override record with exact Team/Agent sparse maps and Team
    workspace selection/operation state. Add exact address-scoped commands and
    the unchanged Org launch-input mapper. Prove existing GraphQL
    `workspaceRootPath`, Team and Agent override fields are sufficient; make no
    server/schema change.
42. **Extract the accepted disclosure and add the strict Org projector.** Move
    only the compact outer shell from TeamRunConfigForm into
    `MemberOverridesDisclosure`; keep Team form behavior stable. Project the
    admitted Org plus real referenced flat Teams into one Team node level and
    exact Agent children. Fail closed with Run disabled on missing/inconsistent
    reference, member, coordinator, or address correlation.
43. **Replace the bespoke Org Team editor cleanly.** Compose
    `TeamMemberConfigTree -> TeamScopeConfigEditor -> MemberOverrideItem` from
    AgentOrgRunConfigPanel, route typed events back to the Org store, and retain
    the compact direct-Agent row as Agent-only. Delete the old Team-kind branch,
    always-exposed hierarchy, fabricated Team-as-Agent node, implicit inherited
    state, and any alternate layout.
44. **Revalidate UI parity and ownership together.** Execute projector/store/
    component tests for exact count, default and sibling-independent disclosure,
    Team `Inherited`/`Customized` and mounted-Team Agent
    `Inherited`/`Overridden` labels, coordinator Agent row, direct-Agent
    continuity, Team reset preserving
    Agent patches, collapse/reopen draft stability, Team workspace serialization,
    projection failure, direct Agent stability, and standalone Team regression.
    Render desktop and narrow production routes against VIS-OVR-001-006 and scan
    imports to prove no Org->Team store/payload dependency. Then route cumulative
    Large/High AD-REV-012 through independent Architecture Review before the
    downstream IR/CR/API route resumes.
45. **Freeze RER-024 evidence and canonicalize the Org launch patch.** Retain the
    Electron screenshots and exact frontend/server source trace. Add the pure
    idempotent patch canonicalizer, apply it at every Team/Agent store command,
    remove the panel-local serializer, and prove preview/variables/server/snapshot
    equality for the full SCN-014 matrix. Do not change the API or server merge.
46. **Restore the established root workspace policy.** Make fresh AgentOrg root
    configuration use the same actual-available Temp Workspace selection path as
    Team root. Keep descendant defaults disabled, project root inheritance and
    exact Team overrides, preserve explicit choices/errors, and prove workspace
    selection never changes focus.
47. **Consolidate the left Workspace/history owner.** Extend the mixed workspace
    read model by combining the existing Workspace Agent/Team query with only
    the strict AgentOrg branch of the existing collaboration-root query. Do not
    ingest its Team branch a second time. Add the ordered `Agent Orgs` category
    directly below `Teams`; move Org root/hierarchy/status rendering and typed
    root actions into the unified workspace section. Remove the Org command
    store's parallel history cache/internal refresh, always mount the unified
    panel, then delete `AgentOrgRunHistoryPanel` and its route predicate without
    a wrapper or fallback.
48. **Self-validate and independently review AD-REV-013.** Run VAL-031-033 plus
    standalone Team/config/history regression, route-transition state retention,
    family/action negatives, absent-default failure, cross-layer configuration
    fixtures, desktop/narrow browser checks, and source scans proving no new API,
    persistence, lifecycle, second history owner, hard-coded workspace, or raw
    patch remains. Implementation resumes only after Architecture Review passes.

No temporary dual write, try-both runtime read, normal dual definition parser,
external-source writer, generic V3 root, public configured recursion, raw Org
event dashboard, JSON presentation fallback, duplicate Org composer, or
standalone registration of a mounted Team may survive the cutover. Neither may
waiting preparation of a non-quiescent task execution inside the mutation FIFO,
a drain-before-fence root shutdown, provider dispatch after a completed AgentRun
fence, any dormant AD-REV-008 coordinator/token/dependency path, or the
superseded bespoke AgentOrg mounted-Team override hierarchy.
The same clean-cut rule rejects a hand-written sparse Org serializer, a
route-selected Org-only history panel, and an Org-specific or hard-coded
workspace default path.

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
13. **Root-neutral Agent presentation details, subject-specific envelopes.** A
    small additional contract package avoids copying the large accepted Team
    event mapping into Org while preserving the Team wire exactly. It is
    intentionally narrower than a generic collaboration stream: it owns only
    strict Agent-visible detail semantics, never root identity or sequencing.
14. **Structural surface extraction over Org-specific visual replication.**
    Extracting port-driven Agent/Team surfaces touches accepted components, but
    makes parity mechanically enforceable and keeps four execution target kinds
    from drifting into four dashboards. Standalone wrappers preserve their
    subject stores and actions.
15. **Hydrated context over append-only raw event inspection.** Building every
    configured/live Org AgentContext costs projection requests and context state,
    but supplies the accepted conversation/tool/activity model, truthful restore,
    and checkpoint recovery. Lazy presentation may be optimized later only
    behind the same context contract; an opaque raw-event fallback is not an
    allowed performance trade.
16. **Shared fold, subject-shaped traversal.** A single five-state policy/dot prevents Team/Org drift, while separate Team-history and AgentOrg traversal adapters avoid a loose generic hierarchy DTO or mixed authority.
17. **Missing historical status resolves offline instead of new persistence.** Production stopped Org history currently has topology but no durable per-Agent status field. The approved missing-value rule gives a truthful non-live result without creating transport/persistence solely to reproduce illustrative fixture mixtures.
18. **Idle-gated existing settlement over a second coordinator.** A terminal
    task whose Agent turn is still active defers immediately and retries from the
    established idle event. Once quiescent, the current prepared settlement keeps
    its persistence-before-finalization and whole-root fail-stop semantics. This
    removes the supported FIFO wait with the smallest new boundary and no new
    job/token/state lifecycle.
19. **Distinct irreversible root fence over changing ordinary termination.**
    Origin/personal intentionally drains already-admitted FIFO input during
    normal prepared termination. Root shutdown instead must prevent any new
    provider work after its phase. Keeping those operations distinct preserves
    ordinary behavior while making cancellation and interruption exact at the
    sole AgentRun input owner.
20. **Shared Team presentation over a generic configuration owner.** Reusing
    the existing disclosure, Team scope and Agent row components adds one pure
    Org view-model adapter and typed command translation, but preserves the
    user-visible origin/personal experience without coupling Org to Team run
    state or payloads. The small adapter cost is preferable to either copied UI
    drift or a loose cross-subject store.
21. **One canonical sparse Org patch over a new resolved launch payload.**
    Materializing the dependent `llmConfig:null` clear at the existing web
    command boundary adds a small pure normalization step, but keeps the
    approved sparse API and server-authoritative resolver while making preview,
    validation, request and snapshot semantics mechanically comparable. A
    second raw draft or a new server inference rule would be harder to reason
    about and would preserve the present disagreement.
22. **One mixed Workspace history owner over route-selected subject panels.**
    Extracting Org rows/actions into the established Workspace tree touches a
    shell-wide component, but preserves the familiar navigation state and makes
    subject identity explicit through tagged rows and typed action ports. Reusing
    the two existing queries adds one bounded fan-out/filter step but avoids a
    new server contract; per-family atomic commits contain partial failure. The
    alternative keeps two visual/state authorities and makes route changes look
    like data loss.
23. **Catalog-backed root default over Org-specific initialization.** Reusing
    the existing root Workspace selection policy intentionally makes fresh Team
    and Org drafts behave alike. Descendant inheritance remains projected
    rather than independently defaulted, preventing a convenience default from
    becoming hidden placement state or communication focus.

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
| Settlement still waits on a non-quiescent provider turn | Medium / Critical | AgentRun-owned atomic prepared-or-null test; controlled normal submit/accept overlap with unrelated command; assert no waiting call and idle-event retry | Final cleanup for an already-quiescent execution remains serialized by the existing FIFO. |
| Racy external status check falsely prepares an active execution | Medium / Critical | Quiescence check and input-admission close occur under AgentRun dispatch ownership; no UI/status snapshot eligibility | A newly supported input mode must extend AgentRun's canonical predicate. |
| Recursive task Team partially quiesces before discovering an active descendant | Medium / Critical | All-or-none recursive preparation with reverse cancel; active-descendant and parent/child tests | Large task subtrees may require repeated idle-event attempts, but no partial prepared state remains. |
| Existing prepared settlement fails before/after durability | Medium / Critical | Retain current cancel-before-durability and whole-root fail-stop after committed cleanup failure; injected outcome tests | Provider cleanup error can fail the owning root and is surfaced rather than replayed. |
| Root shutdown waits on a task drain before fencing/interruption can release provider work | Medium / Critical | Stable-scope root sequence, phase assertions for Team/Org, live-approval + queued-command tests, process graceful-shutdown correlation | External provider termination may still be slow after interrupt, but it no longer owns the mutation lane or forms this cycle. |
| Provider start crosses the completed root interrupt phase before `TURN_STARTED` | Medium / Critical | Same AgentRun dispatch owner for claim/start/fence; deterministic start-wins and fence-wins tests; terminal phase assertion | A provider call that already won may still take time to emit canonical lifecycle; the fence waits rather than fabricating success. |
| Root fence cancels input after provider side effects began or emits duplicate lifecycle facts | Medium / Critical | Explicit state table; cancel only pre-start/pre-forward slots; provider-started path uses existing failure/association/interrupt facts; observer exact-once tests | Provider protocol violations remain existing failures, not cancellation. |
| A prepared settlement cancel reopens a root-fenced AgentRun | Medium / Critical | Irreversible latch check around `reopen`; settlement/root race test; retry joins same fence | Ordinary non-root prepared cancellation still reopens by design. |
| Frozen scope misses a handle published by an admitted activation | Medium / Critical | Close/drain operation/materialization publication gate before snapshot; include active+prepared handles and recursive Team scopes; barrier test | New handle-producing operations must enter the subject gate or return Design Impact. |
| Root-wide fence and later quiescent settlement touch the same execution | Medium / High | Existing idempotent interrupt/prepared termination semantics plus exact registry tests | Duplicate lower-level callbacks must remain harmless and observable. |
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
| Team-only stream behavior drifts during shared presentation extraction | Medium / Critical | Golden every retained Team message/sequence/token/status shape before/after adapter extraction; full Team conversation/tool regression | Internal adapter placement changes, but public Team wire and surface must remain exact. |
| Org event schema still admits opaque/raw payloads | Medium / Critical | Closed zod discriminants, compile-time no-`unknown`/`any` scan, invalid-event and identity/sequence recovery tests | Future Agent event types require explicit presentation-contract addition. |
| Shared surface remains coupled to standalone stores | Medium / High | Surface import-boundary tests and required target/action props; standalone and Org wrapper tests | Some surrounding shell state remains shared through explicit ports. |
| Org command parity is incomplete | Medium / Critical | Send/context-file, interrupt, approve and deny strict command/ack integration plus real-browser prompt/tool flow | New Agent commands must extend the same port and subject parser deliberately. |
| Mounted Team presentation creates false Team root authority | Medium / Critical | Read-only TeamWorkspaceContextView, no Team-store registration/root APIs, negative stop/persistence/history tests | Team presentation evolves against two adapters. |
| Org member hydration or sequence recovery loses/duplicates conversation | Medium / High | Compound identity/checkpoint barriers, candidate atomic swap, gap/reconnect/projection equivalence tests | Projection availability failures remain visible recovery states. |
| Trace/token/file/tool queries use a Team family for an Org member | Medium / High | `agentOrgMember` compound query branch and Org location-backed service; cross-kind collision negatives | Cross-subject analytics facades require explicit tagged dispatch. |
| Root stop remains attached to member focus or exposes mounted-Team stop | Low / High | History-root action assertions, member-header absence, mounted-Team negative tests, standalone Team confirmation regression | Product fixture labels/icons may evolve without changing ownership. |
| Team aggregate includes the wrong branch or loses hidden task Agents | Medium / High | Exact configured Team node traversal, recursive task-only fixtures, direct-root/sibling exclusion matrices, compute before collapse | Future task DTO changes must update the subject adapter deliberately. |
| Historical Team dot retains a live pulse or fabricates state | Medium / High | Explicit live authority gate; historical running/initializing demotion; missing/unknown offline; stopped browser check | Historical error/idle can appear only if an existing truthful terminal projection supplies it. |
| Five-state policy/accessible label duplicates or drifts | Medium / Medium | One pure fold, one reusable Team dot, clean-cut neutral rename, both locale/a11y tests | Visual palette changes remain shared presentation work. |
| Presentation aggregate leaks into lifecycle/API | Low / Critical | No backend file mapping, import/no-new-field scans, mounted-Team action negatives, explicit Design Impact trigger | Later operational Team health would require separate approved behavior. |
| AgentOrg mounted-Team launch UI drifts from the established Team experience again | Medium / High | Direct reuse of the existing Team form chain, shared disclosure extraction, standalone Team regression, and VIS-OVR desktop/narrow browser comparison | Root-level Org copy/direct-Agent rows remain subject-specific by design. |
| Org projection silently omits an unavailable/inconsistent Team or coordinator | Medium / High | Closed success/diagnostic projector result, Run disabled, exact-address error tests; no `flatMap` omission or browser repair | Admission/source drift remains a visible unavailable state until corrected. |
| Collapse/reset loses or cross-mutates exact sparse patches | Medium / High | Store-owned draft, visibility-preserving collapse, Team-reset-preserves-Agent rule, sibling/direct-Agent isolation tests | Invalid field values remain in draft with adjacent error until corrected/reset. |
| Org preview and server launch disagree on model-specific config | Medium / Critical | One canonical patch map, explicit dependent `llmConfig:null`, exact GraphQL golden, server resolver and stored-snapshot equality matrix | Future model-config coupling changes require one deliberate canonicalizer/server-fixture update. |
| Direct root ref updates expose a transient or stale root model/config tuple | Medium / High | Complete root setter commands, dependent clear in the same Org store owner, owned-null root serialization, and root-level fixture parity | Runtime/model catalog work remains asynchronous but Run stays gated by the existing exact schema-readiness state. |
| Unified history accidentally becomes a second Org runtime/lifecycle owner | Medium / Critical | Read-only tagged projection, typed subject action ports, no AgentOrg context duplication, import scans and family/action negatives | Presentation grouping remains shared while each subject retains state and commands. |
| Existing two-query history refresh duplicates Team roots or erases a healthy family on partial failure | Medium / High | Ingest Agent/Team only from `ListWorkspaceRunHistory`, filter collaboration history to strict AgentOrg only, commit slices independently, retain prior successful slice, and test Org-only/null/catalog-missing workspaces | Two network reads remain, but no new API or duplicate read owner is introduced. |
| Route transition or refresh drops prior rows/expansion/selection/scroll | Medium / High | Always-mounted panel/store, route-independent projector, catalog->config->live->history component test and real browser journey | Explicit user navigation may still change selection by design. |
| Root Temp default is synthesized, overwrites explicit choice, or defaults descendants independently | Medium / High | Actual catalog-record selection, untouched-draft gate, explicit-choice tests, absent-default negative and descendant inheritance matrix | Catalog outage remains actionable blocked configuration. |
| Same-definition early return reuses a completed launch draft or suppresses the next fresh default | Medium / High | Explicit new-launch draft epoch distinct from definition identity; retries/errors remain in-epoch; repeated Run and failed-validation regression tests | Route/controller must issue one begin-new-draft signal per deliberate new launch. |
| UI diverges from RV-012 or focused VIS-STATUS/VIS-OVR authority | Medium / High | Structural reuse plus VIS-016-VIS-018, VIS-STATUS-001-003, VIS-OVR-001-006 and VIS-PROMOTE-002-004 browser/a11y/narrow checks and real prompt evidence | Fixture values remain illustrative. |

## Guidance For Implementation

- Treat approved requirements, `AORG-CONTRACT-001`, `ui-ux-spec.md`, decision
  record, manifests, VIS-001-VIS-020, VIS-STATUS-001-003 and VIS-OVR-001-006 as read-only authorities. Prototype
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
- Keep `RootTaskLifecycleCommandQueue`, the terminal sweep, the existing
  `PreparedTaskSettlement`, and current record/tree/sidecar/event order. Do not
  add `RootTaskSettlementCoordinator`, committed cleanup tokens, a second drain,
  or in-memory settlement job/dependency state.
- Add `AgentRun.tryPrepareTerminationIfQuiescent` under canonical dispatch/input
  ownership. It returns `null` immediately and changes nothing for unresolved
  input/turn/provider work; otherwise it closes admission and returns the
  existing prepared termination. Do not approximate it with status polling or a
  precheck outside AgentRun.
- Add `AgentRun.fenceInputAndInterruptForRootShutdown` as a separate irreversible
  operation. Move claim/provider-start registration under the same dispatch
  serialization as the fence. Cancel only never-forwarded work through the
  existing lifecycle; if provider start already won, retain shutdown intent and
  interrupt on canonical start. Do not let a later prepared cancel reopen the
  latch, and do not change ordinary `prepareTermination` FIFO-drain behavior.
- Replace root `interruptActiveTurns` forwarding with recursive frozen-scope
  fence forwarding. Close and drain only admitted root operations needed to
  stabilize active/prepared handle publication before the snapshot; do not wait
  on the task settlement FIFO until every Agent fence is terminal. Compose Org
  direct handles and mounted/task Team scopes privately—never via a synthetic
  Team root or a generic root lifecycle object.
- Thread prepared-or-null through configured Agent, task Agent, task-Team,
  Team adapter and Org adapter boundaries. `null` makes settlement return false
  and release the FIFO; existing idle/offline events reschedule. Recursive task
  Team preparation is all-or-none and cancels already prepared descendants if a
  later descendant is active.
- Preserve existing settlement durability and fail-stop: prepared cancellation
  precedes durability; `settledAt`, tree/index/event and registry changes retain
  their current ordering; a post-durable local finalization failure fail-stops
  the root. Unsupported self-review remains rejected.
- General process assembly order is AgentRun infrastructure -> strict locations/directory/factories -> Team manager -> Org manager -> services. Within each Team/Org root, shutdown is close external admission -> drain admitted publication operations only -> freeze the stable complete owned scope -> complete every AgentRun input/provider-start/interrupt fence -> drain task mutations -> persist task interruptions -> run existing deepest-first quiescent settlement -> drain persistence -> finish/unregister. Process order remains Org -> Team -> Agent before reverse release. Application scopes remain publicly Team-only while using the same extracted factories.
- Global exact-Agent routing compares tagged member roots and uses `ActiveCollaborationRootDirectory`; no bare root ID or Team manager lookup may select an Org.
- Admit raw configured-Agent events exactly once through
  `CollaborationAgentPresentationAdapter`. Team and Org serializers may add only
  their subject identity/sequence fields. Do not publish `AgentOrgRunEvent` as
  an opaque value, add `unknown` to an Org stream schema, pass a protocol
  envelope into Vue, or stringify an unrecognized event.
- Preserve Team-only stream compatibility while extracting Agent presentation
  details. Use golden messages for every current event kind, including member
  input, status/readiness, errors and token usage; do not force Team consumers
  onto the mixed contract to obtain reuse.
- Build `AgentOrgExecutionContext` from strict snapshots and exact member
  projections before it becomes active. It owns the AgentContext map,
  mounted-Team presentation views, nullable focus and stream phase.
  `rootExecutionViewStore` remains only a mixed route/history facade and must not
  keep a second Org tree, event array, focus or command path.
- Implement the four-branch `ActiveAgentWorkspaceTarget` and
  `AgentInteractionPort`. The existing composer, tool cards, event monitor,
  files/activity/tokens/artifacts and trace browse consume those ports; they do
  not branch directly over standalone/Team/Org stores or open subject sockets.
- Extract `AgentWorkspaceSurface` and `TeamWorkspaceSurface` from the accepted
  production components. Standalone views become adapters and remain behavior-
  compatible. The Org view may render only the approved no-focus prompt or one
  of these surfaces. It must contain no event formatter, conversation card,
  textarea/send implementation, custom member header, JSON fallback or stop
  control.
- Treat `TeamWorkspaceContextView` as presentation-only. Its Org adapter is
  backed by the Org context and exact Team placement; never register that Team
  with `AgentTeamRunManager`, `agentTeamContextsStore`, Team history, Team
  persistence or Team termination.
- Extend the strict Org command union/ack path for send, interrupt, approve and
  deny and route each through the exact AgentOrgRun target. Context-file paths
  and media/message identity follow the accepted composer contract. Reject
  stale focus/root/member identities before execution; never fall back.
- Add `agentOrgMember` run projection/active-trace subject keyed by
  `{orgRunId,memberAddress,agentRunId}`. Files, traces, activity, token usage and
  artifacts for Org focus use Org physical location/subject dispatch; they do
  not manufacture a Team root ID from a mounted Team.
- Put Org termination only on the active AgentOrg history root row using the
  established root pending/error affordance. No focused member or mounted Team
  can terminate the Org. Preserve the separate standalone Team members-panel
  confirmation exactly.
- Historical topology comes from its subject snapshot, not current definitions.
  Definition edits/deletion cannot change old subject kind, coordinator, task
  host, or addresses.
- Separate Org and Team form/config state. Shared UI primitives accept explicit
  owner view models/commands and cannot query providers or mutate the other
  subject.
- Reuse the accepted `TeamRunConfigForm -> TeamMemberConfigTree ->
  TeamScopeConfigEditor -> MemberOverrideItem` presentation grammar. Extract
  only `MemberOverridesDisclosure`; do not copy Team row/editor markup into the
  Org form and do not import `teamRunConfigStore` or Team launch serialization.
- Keep AgentOrg root state and exact sparse patches in
  `agentOrgRunConfigStore`. Split Team and Agent maps, map Team workspace through
  existing `workspaceRootPath`, and route every typed Team/Agent edit/reset event
  back to its exact address. Team reset must preserve child Agent patches.
- `projectEditableAgentOrgRunFormModel` must return a complete one-level model or
  a blocking diagnostic. Count only configurable Agent placements; put Team
  customization on Team patches only; put coordinator identity only on the
  exact Agent row; never silently omit or repair an admitted-reference mismatch.
- Outer and per-Team disclosure state starts collapsed and changes presentation
  only. Use visibility-preserving rendering/store-backed state so collapse/
  reopen retains valid draft values. Keep sibling Team disclosure independent
  and direct Org Agent behavior unchanged.
- Canonicalize every AgentOrg Team/Agent patch before it enters store state.
  When runtime or model identity is owned and model config is not, own
  `llmConfig:null`. Preview and launch mapping consume the same canonical map;
  delete the panel-local object-spread serializer. Do not alter the server's
  omission-means-inherit / explicit-null-means-clear contract.
- Keep one `WorkspaceAgentRunsTreePanel` mounted from `AppLeftPanel` on every
  route. Extend the mixed workspace read model with explicit Org roots and render
  `Agent Orgs` immediately below `Teams`; move existing Org row/status/action
  presentation into that path and delete `AgentOrgRunHistoryPanel`. Preserve
  existing Agent/Team rows and expansion/selection/scroll state across routes.
- Route history actions through explicit root-kind/ID commands. An Org root may
  be opened/selected, stopped, or restored through its existing store; Org
  archive/delete actions are not invented. A mounted Team never becomes a root
  action target. The unified tree does not own active Org focus, stream,
  topology, or lifecycle.
- Reuse the existing Team-root workspace selector default for a fresh untouched
  Org root. Select only an actually available Temp Workspace record; never
  synthesize its path. Preserve explicit selection, show absent/unavailable
  errors, project root inheritance into placements, and keep descendant auto-
  default and recipient focus disabled.
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
  history/task lineage, strict Agent presentation parsing, Team-wire golden
  compatibility, Org member hydration/projection/checkpoint recovery,
  send/context-file/interrupt/tool-decision command parity, structural shared-
  surface reuse, raw-dashboard/JSON-fallback absence, root-stop placement,
  responsive/a11y, standalone Team create/launch/reuse, and a real imported-
  package prompt rendered through the accepted conversation/event monitor.
- AD-REV-009 minimum evidence additionally includes: AgentRun atomic
  prepared-or-null tests; a controlled normal submit/tool-result followed by
  independent delegator accept while the assignee turn is held open, with an
  unrelated supported command completing; idle-event resettlement; recursive
  task-Team all-or-none preparation; existing pre-/post-durability failure
  behavior; invalid self-review rejection; legitimate approval-wait interruption
  before Team/Org task drain; and direct application-handler graceful shutdown.
  Do not use the invalid self-review tail, a timing-only test, or a process-group
  kill as supported-liveness evidence.
- AD-REV-010 minimum evidence additionally includes: exact state-table tests for
  reserved, committed, queued, claimed-before-start, provider-started-before-
  turn, forwarded/pending-turn and active-turn input; deterministic ordering in
  which either provider start or root fence wins the same AgentRun queue; one
  task activation barrier after start registration but before canonical
  `TURN_STARTED`; Team and Org application-handler SIGTERM through direct,
  mounted, task-Agent and recursive task-Team scopes; exact cancellation versus
  interruption facts; ordinary preparation still draining FIFO; prepared cancel
  never reopening root-fenced admission; fence retry/idempotence; no backend call
  after fence completion; and no task drain before the full fence completes.
- Before implementation handoff, search current source excluding migration and
  immutable historical docs for configured Team member recursion,
  `getOrCreateConfiguredChildTeam`, `MemberTaskRootResolver`, shared
  `TeamMemberExecutionIdentity`/`memberTeamContext`, root-creating mixed factory,
  placeholder Org activator, Team-sidecar Org reuse, Org-as-RootTeam assumptions,
  Org `entryAddress`, required/fallback Org focus, root-kind inference, and generic
  V3/`collaboration_runs` artifacts. Also review every remaining `rootTeam`,
  `team_run_execution_tree.json`, and `agent_teams` occurrence: they are expected
  and correct in native Team code, but forbidden as Org/mixed authority.

- For REQ-028, reuse `StatusDot` visual grammar and one shared Team aggregate fold; do not use binary `TeamActivityDot`, hard-code colors, or duplicate precedence in the unified Org row renderer.
- Enumerate a mounted Team from its strict configured Team node, including configured Agents and recursive task-scoped Agents under that Team only. Do not derive aggregate membership from visible rows or canonical-address prefix scans.
- Treat live authority as exact active Org context in `phase=live`. On inactive/history/recovery-without-authority, retain only existing terminal idle/error/offline truth and normalize running/initializing/missing/unknown to offline. Add no status fetch or persistence.
- Render `TeamAggregateStatusDot` between disclosure and Team icon and preserve it while collapsed. Its role/title/accessible name is `Team status: <State>`; individual Agent dots remain present and truthful.
- Keep Org focus, Team coordinator mapping, root stop/restore and historical
  archive metadata, readiness, commands, task lifecycle and transport
  untouched. Do not invent an Org archive/delete command. Any implementation
  need for a new backend field, polling path, Team lifecycle owner or status
  cache is a Design Impact.
- Validate AD-REV-007 with the added VAL-023-025 self-validation witnesses, pure precedence/branch tests, live reactive and stopped-history component tests, accessibility assertions, no-new-contract/import scans, and browser comparison with VIS-STATUS-001-003.
- Validate cumulative AD-REV-009/010 with VAL-026-029 and the retained clean/trace evidence.
  Require deterministic evidence for normal submit result, independent accept,
  non-waiting deferred settlement, unrelated command completion, idle retry,
  exact durability, and root shutdown phases. Team and Org shutdown must
  establish a stable frozen scope and complete each AgentRun input/provider-
  start/interrupt fence before task drain, including the pre-`TURN_STARTED`
  barrier, and terminate through the application handler.
  Do not interpret source compilation, elapsed time, invalid self-review,
  process-group SIGKILL, or one non-reproduction as proof of supported liveness.
- Validate AD-REV-012 with VAL-030, exact projector/store/serializer unit tests,
  shared disclosure and AgentOrg form component tests, standalone Team form
  regression, accessible control names/focus, and rendered desktop/narrow
  comparisons against VIS-OVR-001-006. Include negative import/API/schema scans;
  no server, durable, stream, runtime, definition, migration, or Team lifecycle
  change is authorized by this focused correction.
- Validate AD-REV-013 with VAL-031-033. Use one root/Team/Agent configuration
  fixture matrix through browser effective projection, exact GraphQL variables,
  server resolver and stored Org snapshot; include the Codex/GPT-config to
  AutoByteus/DeepSeek-with-null case and reset/inheritance/tool/workspace cases.
  Prove the same left-panel instance retains existing rows/state across catalog,
  config, launch, focus and stopped/history; `Agent Orgs` follows `Teams`; root
  actions dispatch to the correct subject and mounted Teams have none. Prove an
  actual available Temp default is selected once, explicit choice wins,
  descendant inheritance/Team override is exact, absent default blocks, and
  focus stays null. Scan for the removed route predicate/panel, parallel raw
  patches, local serializer, hard-coded workspace path, and any new API/schema/
  persistence/lifecycle field.
