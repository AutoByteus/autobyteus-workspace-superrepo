# Architecture Design Self-Validation

## Status

- Package: `AORG-FLAT-TEAM-001`
- Architecture revision validated: `AD-REV-009`
- Requirements authority: `RER-021` (approved BEH-011/REQ-028/AC-023/SCN-012 status supplement; prior runtime/durable behavior unchanged)
- Product authority: `RV-012` / `VIS-001`-`VIS-020`; focused `AORG-FLAT-TEAM-STATUS-001` / `VIS-STATUS-001`-`VIS-STATUS-003`
- Trigger: `ARCH-REV-006` / `AR-FIND-003` supported-reachability review of
  `AD-REV-008`, while retaining the user-requested use-case/data-flow/ownership/
  boundary/dependency self-validation discipline
- Date: 2026-09-01
- Result: `Design Self-Validation Pass — independent Architecture Review still required`
- Code/API/E2E validation: `Not performed; this artifact validates the design, not the partial implementation`

## Purpose And Method

This artifact checks whether the cumulative design is complete enough to
implement without reconstructing architecture decisions. It does not redefine
approved behavior and does not claim executable correctness.

For each supported use case it verifies:

1. an independently supported trigger or governing contract;
2. a primary spine long enough to show caller, orchestration, authoritative
   owner, critical dependency, and meaningful outcome;
3. any material return/event or bounded local spine;
4. one clear owner for lifecycle/state/invariants at every main node;
5. no caller above a boundary depending on both the boundary and its internals;
6. explicit, one-directional dependencies and a rejected-shortcut check;
7. exact durability/identity consequences where applicable; and
8. a conclusion of `Pass`, `Fail`, or `Open`.

Inputs:

- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md` (`ARCH-REV-006` / `AR-FIND-003`)
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-handoff.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-revision-record.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/followup-api-find008/correlated-rerun-observed-boundaries.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/followup-api-find008-settlement/settlement-correlation-observed-boundaries.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/followup-api-find008-settlement/boundary-evidence-assertions.log`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/live/server-data/memory/agent_teams/aorg_e2e_research_squad_406e38c2bf72449ea5685e1489282463/aorg_e2e_verifier_e8de47b91a8243b2ab2ecea5c39552f6/raw_traces_active.jsonl`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/live/server-data/memory/agent_teams/aorg_e2e_research_squad_406e38c2bf72449ea5685e1489282463/aorg_e2e_lead_ba085468b828408abb166692912680fc/raw_traces_active.jsonl`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/autobyteus-server-ts/node_modules/autobyteus-ts/tests/integration/agent/runtime/agent-runtime.test.ts` (accepted pending-tool-approval interruption behavior)
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-001/screenshots/03-org-live-raw-events-defect.png`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/autobyteus-server-ts/docs/design/production_data_migration_conventions.md`
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/ui-ux-spec.md`
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/visual-references/visual-reference-manifest.json`
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-STATUS-001/ui-ux-spec.md`
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-STATUS-001/user-decision-record.md`
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-STATUS-001/visual-references/visual-reference-manifest.json`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/code-review-report.md` (`CRR-013`; retained `CRR-009` / `CR-FIND-011` history and `CR-CAND-020` hold)
- `origin/personal@773bce779` implementations of `workspaceHistoryNestedTeamStatus.ts`, `NestedTeamAggregateStatusDot.vue`, and `WorkspaceTeamExecutionTree.vue` (inspected with `git show`; continuity evidence only)
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/BASELINE-PROMOTION-001/ui-ux-spec.md`

## Universal Invariants Used By Every Walkthrough

| Invariant | Required Design Consequence | Self-Check |
| --- | --- | --- |
| Team is Agent-only and coordinator-led | Only Team definition/root owns coordinator; local Team runtime has direct configured Agents only | Pass |
| Org is coordinator-free | No synthetic Team/Org coordinator, root recipient, fallback focus, or `RootTeamRun` wrapper | Pass |
| Two strict durable families | Team V2 tree and Team sidecars remain exact; Org V1 tree and Org sidecars are separate and strict | Pass |
| Org owns its complete execution scope | Direct Org Agents, mounted local Teams, tasks, messages, bindings, events and fail-stop stay under one AgentOrgRun | Pass |
| Shared runtime is internal capability composition | Tagged mandatory identity/context/ports; no public/durable generic root | Pass |
| Mounted Team is not a standalone Team root | `FlatTeamExecutionFactory` creates no Team package or Team manager registration | Pass |
| Configured and task Team depth differ | Configured Team child removed; recursive Team is legal only in `taskExecutions` | Pass |
| Root kind is never inferred | Compound `{rootSubjectKind, rootRunId}` at mixed/live boundaries; strict family store dispatch | Pass |
| Focus is not activation | Full Org scope activates before client focus; focus starts null and is never durable | Pass |
| Current runtime is forward-only | Legacy decoding exists only in registered migration; no normal dual parser/reader | Pass |
| External definition projects are read-only | Target admission/diagnostics only; no write, commit, release, or completion claim | Pass |
| Agent-visible Org events are strictly projected | Raw Agent callbacks cross one presentation adapter and a strict Org envelope before AgentContext mutation; no opaque/JSON renderer | Pass |
| Exact Org focus reuses accepted workspaces | Direct Agent uses Agent surface; Team/Team Agent uses Team surface; no custom Org runtime dashboard | Pass |
| Browser Org state has one owner | One checkpointed AgentOrgExecutionContext owns view, AgentContexts, mounted-Team views, nullable focus and stream recovery | Pass |
| Member presentation does not own root lifecycle | Org stop lives on active Org history root row; focused member and mounted Team have no root-stop action | Pass |
| Mounted Team status is pure presentation | Exact configured/task descendant Agent statuses fold `running > initializing > error > idle > offline`; collapse does not alter input; historical live-only/missing values are offline; no status/lifecycle/API owner is added | Pass |
| Settlement never waits for a non-quiescent execution | The existing one root FIFO and existing terminal sweep remain; exact handles offer non-waiting quiescence preparation, return deferred immediately while a turn/approval is live, and rely on the existing Agent idle/offline resweep | Pass |
| Root shutdown interrupts before task drains | Team and Org close/freeze their complete scope and interrupt active provider turns before waiting for task command or settlement drains | Pass |

## Identity And Physical-Scope Truth Table

| Execution | Root Identity | Physical TeamRun Ancestry | Memory Location | Durable Owner | Valid? |
| --- | --- | --- | --- | --- | --- |
| Standalone Team direct Agent | `{agent_team, teamRootId}` | `[]` | `agent_teams/<teamRootId>/<agentRunId>` | RootTeamRun / Team package | Pass |
| Standalone Team root-hosted task Agent | `{agent_team, teamRootId}` | `[]` | `agent_teams/<teamRootId>/<taskAgentRunId>` | RootTeamRun root task array | Pass |
| Standalone Team task-Team Agent | `{agent_team, teamRootId}` | `[taskTeamRunId, ...]` | `agent_teams/<teamRootId>/<taskTeamRunId>/.../<agentRunId>` | RootTeamRun exact task Team host | Pass |
| Org direct configured Agent | `{agent_org, orgRunId}` | `[]` | `agent_orgs/<orgRunId>/<agentRunId>` | AgentOrgRun / Org package | Pass |
| Org mounted-Team configured Agent | `{agent_org, orgRunId}` | `[mountedTeamRunId]` | `agent_orgs/<orgRunId>/<mountedTeamRunId>/<agentRunId>` | AgentOrgRun; local Team owns only live mechanics | Pass |
| Org root-hosted task Agent | `{agent_org, orgRunId}` | `[]` | `agent_orgs/<orgRunId>/<taskAgentRunId>` | `rootOrg.taskExecutions` | Pass |
| Org mounted-Team task-Team Agent | `{agent_org, orgRunId}` | `[mountedTeamRunId, taskTeamRunId, ...]` | `agent_orgs/<orgRunId>/<mountedTeamRunId>/<taskTeamRunId>/.../<agentRunId>` | Exact mounted/task Team host under AgentOrgRun | Pass |

The physical rule preserves all relative directories during the approved direct
package-family rename. It does not infer logical topology from directory depth.

## Persistence Correlation Truth Table

| Subject | Execution Tree | Task Sidecar | Message Sidecar | Required Correlation | Self-Check |
| --- | --- | --- | --- | --- | --- |
| AgentTeam | `team_run_execution_tree.json`, V2, `rootTeam` | `task_delegation_records.json`, `rootTeamRunId` | `team_communication_messages.json`, `rootTeamRunId` | package ID = tree root ID = both sidecar root IDs | Pass; unchanged |
| AgentOrg | `agent_org_run_execution_tree.json`, V1, `subjectKind:agent_org`, `rootOrg` | `agent_org_task_delegation_records.json`, `subjectKind:agent_org`, `orgRunId` | `agent_org_communication_messages.json`, `subjectKind:agent_org`, `orgRunId` | package ID = Org tree ID = both Org sidecar IDs and kinds | Pass; explicit AD-REV-005 |
| Mixed projection | selected strict subject package | selected strict subject sidecars | selected strict subject sidecars | requested `root_subject_kind` = family = decoded branch | Pass; no inference |

## Use-Case Validation Index

| Validation ID | Supported Basis | Case | Primary Spine | Result |
| --- | --- | --- | --- | --- |
| VAL-001 | SCN-006; REQ-005/014 | Fresh standalone flat Team launch | DS-002, DS-006T, DS-014 | Pass |
| VAL-002 | SCN-002/009; REQ-004/024 | Fresh full-scope Org launch | DS-003, DS-012, DS-014 | Pass |
| VAL-003 | REQ-003/006/007 | Org logical message/handoff to Agent or Team | DS-004, DS-009 | Pass |
| VAL-004 | Existing exact-Agent messaging contract + BEH-003 | Same-root exact AgentRun routing in Org | DS-004, DS-008, DS-014 | Pass |
| VAL-005 | AC-010; ORG-CASE-028 | Direct Org Agent delegates from Org-root host | DS-005, DS-006O, DS-014, DS-022 | Pass |
| VAL-006 | PRE-005; REQ-015 | Mounted/task Team delegation and recursive task lineage | DS-005, DS-006T/O, DS-022 | Pass |
| VAL-007 | REQ-014 persisted binding | External provider binding during Org activation | DS-003, DS-006O, DS-014 | Pass |
| VAL-008 | Existing fail-stop durability contract | Org message/task/tree persistence becomes indeterminate | DS-004-006O, DS-014 | Pass |
| VAL-009 | SCN-002/004/010; AC-008/009/020 | Strict AgentOrg restore | DS-006O, DS-014, DS-015 | Pass |
| VAL-010 | Existing server lifecycle contract | Process construction failure and normal shutdown | DS-015, DS-022 | Pass |
| VAL-011 | REQ-016/025 | Mixed history/stream/workspace truth | DS-008 | Pass |
| VAL-012 | SCN-004/010; REQ-012/013 | One-level Org-like Team package migration | DS-007, DS-010 | Pass |
| VAL-013 | REQ-014; AC-020 | Native flat Team V2 no-op at cutover | DS-007, DS-010 | Pass |
| VAL-014 | SCN-011; REQ-026/027 | Incompatible external Team and dependent Org | DS-000, DS-007 | Pass |
| VAL-015 | SCN-002/009; RV-012 | Full Org activation with no focus, then exact focus | DS-003, DS-013 | Pass |
| VAL-016 | SCN-001/008; REQ-020-023 | Team/Org handoff authoring and atomic save | DS-001, DS-009, DS-011 | Pass |
| VAL-017 | Existing application Team execution; REQ-018 scope | Application-owned flat Team after extraction | DS-002, DS-015 | Pass |
| VAL-018 | SCN-007/009; REQ-004/016/019/025; VIS-017 | Real direct Org Agent conversation renders through accepted Agent workspace | DS-016-DS-018 | Pass |
| VAL-019 | SCN-007/009; REQ-016/019; VIS-018 | Mounted Team/coordinator/exact Team Agent reuses accepted Team workspace | DS-013, DS-016-DS-018 | Pass |
| VAL-020 | Accepted Agent interaction behavior; REQ-019 | Org send/context-file, interrupt and tool-decision parity | DS-017 | Pass |
| VAL-021 | Existing strict stream/recovery and trace behavior; REQ-016/025 | Invalid Org event/sequence and restore hydration recover without raw fallback | DS-016, DS-018 | Pass |
| VAL-022 | REQ-016/025; VIS-016-VIS-018; established Team history interaction | Org root termination placement and mounted-Team lifecycle boundary | DS-019 | Pass |
| VAL-023 | SCN-012; REQ-028; AC-023; VIS-STATUS-001 | Active expanded mounted Team aggregates exact configured and task-scoped Agent statuses | DS-020, DS-021 | Pass |
| VAL-024 | SCN-012; REQ-028; AC-023; VIS-STATUS-002 | Collapsed mounted Team retains reactive aggregate and exact branch isolation | DS-020, DS-021 | Pass |
| VAL-025 | SCN-012; REQ-028; AC-023; VIS-STATUS-003 | Stopped/history Team aggregate loses live-only state and adds no lifecycle authority | DS-020 | Pass |
| VAL-026 | REQ-015; AC-010; supported submit plus independent authorized accept traces | Accepted task settlement overlaps its assignee's still-finishing normal provider turn while an unrelated supported task command arrives | DS-005, DS-022 | Pass |
| VAL-027 | Existing Team/Org graceful-shutdown contract; supported approval-gated tool and application SIGTERM | Team and Org shutdown while a normal task Agent awaits tool approval | DS-015, DS-022 | Pass |
| VAL-028 | Existing task mutation durability/fail-stop contract | Existing prepared settlement failure before versus after durability | DS-006T/O, DS-022 | Pass |
| VAL-029 | PRE-005; REQ-015 | Recursive task-Team all-or-none quiescence preparation and deepest-first settlement | DS-005, DS-022 | Pass |

## Detailed Use-Case Walkthroughs

### VAL-001 — Fresh Standalone Flat Team Launch

- **Trigger:** user/application launches an available Agent-only Team.
- **Primary spine:** `Team UI/application -> AgentTeamRunService -> flat Team
  planner -> AgentTeamRunManager -> RootTeamRun + Team adapters ->
  FlatTeamExecutionFactory -> configured Agent handle/AgentRun -> exact Team V2
  tree + existing Team sidecars -> coordinator-led result`.
- **Bounded spine:** the configured Agent handle prepares/restores/publishes one
  AgentRun using a tagged Team identity; Team adapter wraps events/bindings.
- **Owners:** Team service owns orchestration; Team manager owns root registry;
  RootTeamRun owns tree/tasks/messages/fail-stop; local Team owns direct Agent and
  task mechanics; AgentRun owns provider execution.
- **Boundary check:** Team service never calls Team store/local handle beside the
  manager/root; RootTeamRun alone holds private Team adapters/engines.
- **Dependency check:** Team root -> Team adapters -> shared engines/local Team ->
  configured Agent -> AgentRun. No Org import is required.
- **Rejected shortcut:** preserving the old configured-child Team registry.
- **Outcome:** native Team paths/wire semantics remain valid after extraction.
- **Result:** Pass.

### VAL-002 — Fresh Full-Scope AgentOrg Launch

- **Trigger:** user completes one valid Org configuration and selects Launch.
- **Primary spine:** `Org configuration UI -> AgentOrgRunService ->
  configuration resolver -> Org planner -> AgentOrgRunManager -> explicit Org
  scope builder -> AgentOrgRun/private adapters -> direct Agent handles + mounted
  FlatTeam executions -> prepare every AgentRun -> strict Org tree/task/message
  package commit -> AgentRun publication -> Org/root-directory registration ->
  {agentOrgRunId}, focus=null`.
- **Return/event spine:** prepared Agent events remain unpublished until the Org
  package is durable; after registration the Org publisher emits tagged snapshots
  to the mixed stream.
- **Owners:** Org service owns launch orchestration; Org manager owns root
  registry; AgentOrgRun owns the complete execution aggregate; configured Agent
  and local Team objects own only live local mechanics.
- **Boundary check:** scope builder receives stores/factories through the manager
  and returns a complete aggregate; GraphQL never receives a local Team/handle or
  persistence coordinator.
- **Dependency check:** Org may import the Team-local factory, never
  RootTeamRun/AgentTeamRunManager/Team stores. Shared configured-Agent code sees
  only tagged identity/callback ports.
- **Rejected shortcuts:** synthetic Team root/coordinator; direct Org Agent as a
  standalone Agent; mounted Team as an independent Team root; catch-all injected
  activator.
- **Failure check:** preparation/write failure aborts candidates and leaves no
  live registry entry; post-durability indeterminacy fail-stops the whole
  unregistered Org package for later restore.
- **Outcome:** all configured executions are active under one Org with no focus.
- **Result:** Pass.

### VAL-003 — Org Logical Message / Handoff

- **Trigger:** a mounted Agent invokes `get_handoff_rules` or sends to an approved
  exact Agent/Team address.
- **Primary spine:** `Agent tool -> MemberExecutionContext -> owning-root delivery
  callback -> AgentOrgRun authorization -> Org execution index/recipient resolver
  -> exact Agent or Team coordinator -> receiver reservation -> Org communication
  sidecar commit -> Agent input commit -> Org communication/member-input event`.
- **Bounded spine:** `compileOrg -> Org-owned saved order -> stable Org Team
  placement order -> rebased Team-local saved order -> stable filter`.
- **Owners:** member context owns only bound identity/rules/callback; AgentOrgRun
  owns same-root authorization/address resolution; communication engine owns
  record/reservation sequencing; Org adapter owns sidecar/event/fail-stop.
- **Boundary check:** tool cannot query Org manager/index/sidecar; engine cannot
  import Org tree/store.
- **Dependency check:** tool -> bound capability -> root -> private adapter ->
  shared engine/local Agent endpoint.
- **Rejected shortcut:** global logical address lookup or implicit Team/Org
  recipient fallback.
- **Result:** Pass.

### VAL-004 — Same-Root Exact AgentRun Message In Org

- **Trigger:** supported global message route targets an exact AgentRun ID.
- **Primary spine:** `GlobalAgentRunMessageRouter -> AgentRunManager exact
  sender/target -> both MemberExecutionContexts -> tagged-root equality ->
  ActiveCollaborationRootDirectory compound lookup -> owning AgentOrgRun narrow
  message boundary -> exact target reservation -> Org sidecar/event result`.
- **Owners:** AgentRunManager owns AgentRun lookup; active-root directory owns
  compound capability lookup only; AgentOrgRun owns collaboration authorization.
- **Boundary check:** directory cannot return a concrete root or stop/restore it;
  router cannot query Org manager plus root internals.
- **Dependency check:** router depends on AgentRun registry + narrow directory,
  not Team and Org managers simultaneously.
- **Rejected shortcut:** compare only `rootRunId`, call AgentTeamRunManager, or
  infer root kind from payload/missing coordinator.
- **Result:** Pass.

### VAL-005 — Direct Org Agent Delegates From Org Root Host

- **Trigger:** a direct Org Agent calls `delegate_task` for an exact mounted
  Agent/Team.
- **Primary spine:** `Task tool -> bound MemberTaskCommandCapability ->
  RootTaskLifecycleEngine FIFO -> AgentOrgTaskRootAdapter authorization/recipient
  -> TaskExecutionHostIdentity(rootOrg) -> AgentOrgRootTaskHost prepares task
  Agent or task Team -> Org tree root task-array + Org task-sidecar commit ->
  local task publication -> Org task event -> active result`.
- **Owners:** engine owns command/record lifecycle; Org adapter owns host/tree/
  persistence/event translation; Org root task host owns only local prepared task
  handles.
- **Boundary check:** tool does not resolve RootTeamRun/AgentOrgRun; root task
  host cannot persist or register a root.
- **Dependency check:** engine is subject-neutral; Org adapter closes over Org
  state and passes only TaskExecutionHostCapability downward.
- **Terminal path:** submit/review/interrupt mutates through the same existing
  FIFO; accepted/interrupted records schedule DS-022. The Org adapter first
  attempts exact non-waiting quiescence preparation, defers if an Agent turn is
  active, and otherwise commits `settledAt` before existing prepared finish.
- **Rejected shortcut:** fabricate a root Team host or attach task Team to
  configured members.
- **Result:** Pass.

### VAL-006 — Mounted Team And Recursive Task Team Lineage

- **Trigger:** an Agent under a mounted Team delegates; later a task Agent/Team
  delegates again.
- **Primary spine:** `bound task capability -> root task FIFO -> Org/Team subject
  adapter -> exact containing Team/task-Team host -> local Team task registry ->
  task Agent/Team prepare -> owning subject tree host.taskExecutions + sidecar ->
  event/result`.
- **Owners:** owning root retains one task record authority; each local Team owns
  local task execution handles; exact host node owns the durable task array.
- **Boundary check:** task recursion never re-enters configured membership or
  AgentOrg definition resolution.
- **Dependency check:** recursive task Team uses FlatTeamExecutionFactory with
  appended physical ancestry; it creates no root package/manager entry.
- **Terminal path:** a task-Team parent is eligible only after every owned child
  cleanup job completes; independent terminal leaves may clean up concurrently
  and never occupy the root mutation FIFO.
- **Rejected shortcut:** delete task-Team recursion when configured Team recursion
  is removed.
- **Result:** Pass.

### VAL-007 — External Provider Binding During Org Activation

- **Trigger:** configured Org Agent uses an external runtime and candidate returns
  a platform conversation ID.
- **Primary spine:** `Org scope builder -> ConfiguredAgentExecutionHandle
  prepare candidate -> CollaborationAgentPlatformBinding(tagged identity) -> Org
  platform-binding adapter -> Org tree mutator -> candidate Org tree -> Org
  persistence coordinator -> strict tree commit -> candidate publication/event`.
- **Owners:** handle validates provider result; AgentOrgRun validates member/root;
  Org persistence coordinator owns durability and fail-stop outcome.
- **Boundary check:** handle cannot write tree/store; provider cannot publish
  before the owning root accepts durability.
- **Rejected shortcut:** create TeamAgentPlatformBinding with `rootTeamRunId` for
  an Org or commit binding after AgentRun publication.
- **Result:** Pass.

### VAL-008 — Org Persistence Finalization Indeterminate

- **Trigger:** supported existing atomic writer reports post-rename directory
  finalization indeterminate for Org tree/task/message mutation.
- **Primary spine:** `root operation -> Org adapter -> Org persistence
  coordinator -> atomic writer indeterminate result -> AgentOrgRun closes
  admission -> task/message engines enter fail-stop -> whole Org termination ->
  manager/directory unregister or never register`.
- **Owners:** writer owns physical outcome truth; Org coordinator latches
  persistence fail-stop; AgentOrgRun owns aggregate teardown.
- **Boundary check:** mounted Team cannot decide to stay active or retry its own
  package because it owns neither.
- **Rejected shortcut:** downgrade to ordinary failure, keep a partial Org live,
  or launch a mounted Team independently.
- **Result:** Pass.

### VAL-009 — Strict AgentOrg Restore

- **Trigger:** user/system restores a stopped valid Org package/history row.
- **Primary spine:** `explicit Org restore -> RootRunPackageReadinessIndex ->
  AgentOrgRunManager -> AgentOrgStatePackageLoader -> strict Org tree + Org
  sidecar correlation/task reopen repair -> indexes/physical scopes -> Org scope
  builder -> prepare all direct/mounted AgentRuns -> binding durability if needed
  -> publish/register complete Org -> tagged snapshot`.
- **Owners:** readiness selects family; Org loader owns package correlation/repair;
  Org manager/aggregate own live reconstruction.
- **Boundary check:** restore does not consult current mutable definitions or Team
  store; mixed history facade cannot bypass readiness/Org manager.
- **Dependency check:** root-neutral task reopen policy is applied through an Org
  tree adapter, not by accepting a generic tree union.
- **Rejected shortcut:** try Team then Org, accept Team sidecar envelope, or infer
  family from coordinator absence.
- **Result:** Pass.

### VAL-010 — Process Construction And Shutdown

- **Trigger:** general server starts, construction fails, or normal shutdown is
  requested with active Org/Team/Agent runs.
- **Construction spine:** `AgentRun/provider resources -> strict Team/Org
  locations -> active-root directory -> configured-Agent + local-Team factories
  -> Team manager -> Org manager -> subject services/history/streams -> open
  admission`.
- **Shutdown spine:** process visits `Org roots -> standalone Team roots ->
  residual AgentRuns`. Each root performs `close all external/materialization/
  message admission -> freeze complete direct/mounted/task scope -> interrupt
  every active provider turn -> drain short task mutations -> durably interrupt
  open task records -> drain deepest-first settlement cleanup -> drain
  persistence -> finish/unregister local execution`; then process releases
  services/directory/tool resources in reverse.
- **Owners:** GeneralProcessRunSupervisor owns ordering; subject managers own
  their roots; AgentRunManager owns residual AgentRuns.
- **Boundary check:** supervisor calls managers, never individual local Teams or
  Agent handles. Construction abort releases successfully created dependencies
  in reverse order.
- **Application specialization:** application scope constructs no Org manager and
  retains Team -> Agent shutdown while using the extracted factories.
- **Rejected shortcut:** Team manager registers embedded Org Teams, root shutdown
  drains commands/settlements before interrupting its provider turns, or process
  stops residual AgentRuns before the roots that own them.
- **Result:** Pass.

### VAL-011 — Mixed History / Stream / Workspace

- **Trigger:** user opens a Team or Org live/history row.
- **Primary spine:** `subject-tagged catalog row/stream handshake ->
  RootRunPackageReadinessIndex or active subject manager -> strict Team/Org
  snapshot + events -> RootExecutionProjectionService ->
  root_subject_kind-tagged DTO -> web RootExecutionViewStore -> exact hierarchy/
  task lineage/focus behavior`.
- **Owners:** subject store/publisher owns truth; mixed facade owns dispatch/tag;
  web store owns presentation/focus only.
- **Boundary check:** mixed facade does not open files and a component does not
  query both subject stores.
- **Rejected shortcut:** infer kind from payload shape or treat task Team as
  configured nesting.
- **Result:** Pass.

### VAL-012 — One-Level Org-Like Team Package Migration

- **Trigger:** startup migration inventory finds a supported one-level
  organization-like Team V2 package.
- **Primary spine:** `AppDataMigrationRunner -> registered migration -> isolated
  legacy classifier -> in-memory Org tree + Org task/message envelope transform
  -> strict prospective package validation -> atomic writes/rereads in source
  package -> one direct directory rename -> canonical Org reread/correlation ->
  retired Team authority cleanup -> bounded disposition/catalog readiness`.
- **Owners:** runner owns attempts/status/log; migration owns historical knowledge
  and transform; current Org codecs own target validation; current catalogs own
  availability after migration.
- **Boundary check:** no current runtime imports migration and migration does not
  call AgentOrgRunManager or definition authoring transaction.
- **Data preservation:** record arrays and all relative Agent memory/content
  directories remain unchanged; root envelope and family authority change.
- **Rejected shortcut:** per-Agent move, custom journal/backup/restore machinery,
  dual family authority, or deep recursive flatten.
- **Result:** Pass.

### VAL-013 — Native Flat Team V2 No-Op

- **Trigger:** startup inventory finds an exact flat Team V2 package.
- **Primary spine:** `migration inventory -> strict Team V2/package correlation ->
  flat classifier -> SKIPPED_NATIVE_FLAT_TEAM_RUN -> Team readiness/catalog ->
  native Team history/restore`.
- **Owners:** Team current codec/store validates; migration records disposition
  only.
- **Boundary check:** migration has no writer call for the item.
- **Validation consequence:** hash/path/mtime/directory inventory must be
  unchanged.
- **Result:** Pass.

### VAL-014 — Incompatible External Definition

- **Trigger:** admission scans an external read-only Team in retired format and an
  Org depending on it.
- **Primary spine:** `registered source descriptor -> DefinitionAdmissionService
  -> exact Team V2 codec failure -> unavailable external diagnostic -> dependency
  closure -> dependent Org unavailable -> compatible catalog/startup/history
  continue`.
- **Owners:** external project owns update/release; admission owns new-work
  availability; runtime history remains snapshot-owned.
- **Boundary check:** no migration/writer path is reachable from an
  `external_read_only` descriptor.
- **Result:** Pass.

### VAL-015 — Full Org Activation, Null Focus, Exact Later Focus

- **Trigger:** user launches valid Org, then selects direct Agent, direct Team, or
  Team Agent from workspace sidebar.
- **Primary spine:** `Org launch -> complete server activation/persistence ->
  tagged workspace snapshot -> focus=null prompt -> explicit sidebar row -> web
  exact branch/index -> AgentRun or Team coordinator AgentRun -> recipient guard/
  send`.
- **Owners:** AgentOrgRun owns active scope; web focus controller owns transient
  selection; subject recipient resolver owns server validation.
- **Boundary check:** launch command/result/tree has no focus; web cannot invent a
  recipient from definition order.
- **Rejected shortcut:** pre-launch selector, first member, root coordinator, or
  fallback repair.
- **Result:** Pass.

### VAL-016 — Handoff Authoring And Atomic Save

- **Trigger:** user creates/reorders/cancels/saves Team-local or Org-owned
  From/To/When rules.
- **Primary spine:** `subject form draft -> owner endpoint catalog -> inline
  reversible editor -> complete candidate + expected revision -> subject GraphQL
  -> subject DefinitionService -> member/endpoint/order validation -> definition
  package transaction -> canonical revision/store refresh`.
- **Bounded compile spine:** `Org saved handoffs -> stable direct-Team placement
  order -> Team-local saved handoffs rebased once -> stable runtime snapshot`.
- **Owners:** subject draft owns unsaved state; DefinitionService owns invariant;
  package transaction owns publication; compiler owns runtime order.
- **Boundary check:** shared UI cannot query providers or save one handoff; Org
  cannot mutate referenced Team-local handoffs.
- **Result:** Pass.

### VAL-017 — Application-Owned Flat Team After Extraction

- **Trigger:** existing application execution scope launches an application-owned
  flat Team.
- **Primary spine:** `Application execution scope -> TeamRunService -> Team
  manager/root -> FlatTeamExecutionFactory -> configured Agent handle ->
  application-scoped AgentRun/resource publication -> Team stream/artifact
  services -> Team->Agent shutdown`.
- **Owners:** application scope kernel owns scoped dependencies; Team root owns
  Team lifecycle; application does not gain AgentOrg authoring/launch authority.
- **Boundary check:** extracted factories are injected in the scoped composition;
  they do not fall back to a process-global Org manager/directory.
- **Rejected shortcut:** introduce application-owned Org as an accidental result
  of generalizing runtime.
- **Result:** Pass.

### VAL-018 — Real Direct Org Agent Conversation Uses Accepted Agent Workspace

- **Trigger:** after configuration-first Org launch and explicit `/concierge`
  selection, a user submits a real prompt through the accepted composer.
- **Primary spine:** `accepted AgentUserInputForm -> ActiveAgentWorkspaceTarget
  (agent_org_direct_agent) -> AgentInteractionPort -> strict Org SEND_MESSAGE ->
  AgentOrg stream handler -> AgentOrgRun exact target command -> AgentRun -> raw
  callback -> CollaborationAgentPresentationAdapter -> strict Org subject event
  + sequence -> AgentOrgStreamingService -> exact AgentContext handlers ->
  AgentWorkspaceSurface/AgentEventMonitor/AgentConversationFeed`.
- **Return/event spine:** typed command acknowledgement clears submission state;
  segment/status/tool/error messages mutate only the exact AgentContext; completed
  conversation is visible through the same monitor as a standalone Agent.
- **Owners:** AgentOrgRun owns target authorization/execution; presentation
  adapter owns raw-event admission; Org stream owns envelope/sequence; Org
  context owns browser correlation; AgentContext owns accepted conversation and
  composer state; surface owns rendering only.
- **Boundary check:** the surface never sees a WebSocket envelope or imports an
  Org store/socket; the stream service never renders; the root facade does not
  retain a second event list.
- **Dependency check:** subject runtime -> presentation adapter -> strict Org
  contract -> Org context -> existing Agent handlers -> shared surface. No
  component-to-socket or component-to-raw-event edge exists.
- **Rejected shortcut:** `event: unknown`, `any` casting, `JSON.stringify`, a
  bespoke Org event card/composer, or translating only the assistant-complete
  case while losing streaming/tool/status semantics.
- **Outcome:** the real prompt is an ordinary accepted conversation, not an
  “AGENT RUN” protocol dashboard.
- **Result:** Pass.

### VAL-019 — Mounted Team Reuses Accepted Team Workspace Without Becoming A Root

- **Trigger:** user selects a direct Team row (initial exact coordinator) or an
  exact Agent within that Team after the Org is active.
- **Primary spine:** `Org sidebar exact address -> CollaborationFocusController
  -> AgentOrgExecutionContext -> Org-mounted TeamWorkspaceContextView ->
  ActiveAgentWorkspaceTarget(agent_org_team_member) -> TeamWorkspaceSurface ->
  accepted header/status/AgentTeamEventMonitor/composer + Team contextual tab`.
- **Event spine:** exact mounted Agent callback follows VAL-018's presentation
  path and mutates its AgentContext; Team view derives member/status/tasks/
  messages from the owning Org context.
- **Owners:** Org context owns focus and mounted-Team projection; read-only Team
  view owns presentation selection/filtering; Team surface owns rendering; Org
  interaction port owns every command.
- **Boundary check:** the adapter exposes no Team root stop/restore/persistence/
  registry method and never enters `AgentTeamRunManager`, Team history, Team
  persistence, or `agentTeamContextsStore`.
- **Dependency check:** Org context -> read-only Team view -> shared Team surface.
  The surface does not depend on either standalone or Org root internals.
- **Rejected shortcut:** launch/register the mounted Team independently, use its
  TeamRun ID as a Team root ID, or copy `TeamWorkspaceView` markup into the Org
  component.
- **Outcome:** VIS-018 parity is structural while AgentOrg remains the sole
  lifecycle/durability owner.
- **Result:** Pass.

### VAL-020 — Org Interaction Command Parity

- **Trigger:** on the accepted Org-focused conversation a user sends text with
  context files, interrupts a running turn, or approves/denies a tool request.
- **Primary spine:** `accepted composer/tool card -> useActiveContextStore ->
  exact ActiveAgentWorkspaceTarget -> AgentInteractionPort -> strict Org client
  command + identity/dedupe fields -> AgentOrg stream parser -> AgentOrgRun
  executeAgentCommand -> exact Agent handle/AgentRun -> typed acknowledgement and
  presentation events -> AgentContext state`.
- **Owners:** active-context facade owns primary-action gating; target port owns
  subject command adaptation; Org stream handler owns parsing/acknowledgement;
  AgentOrgRun owns target validation; AgentRun owns execution.
- **Boundary check:** shared input/tool components cannot distinguish sockets or
  call Org/Team stores directly. Org handler receives no inferred focus; every
  command carries/validates exact root and Agent identity.
- **Dependency check:** view components -> active-context boundary -> subject
  interaction port -> subject stream/root. No send-only parallel client exists.
- **Rejected shortcut:** support only SEND_MESSAGE, drop context attachments,
  approve through Team APIs, or treat missing/stale focus as the coordinator.
- **Outcome:** direct and mounted Org Agents preserve accepted send/interrupt/
  tool-decision behavior.
- **Result:** Pass.

### VAL-021 — Strict Org Stream Failure And Checkpointed Recovery

- **Trigger:** a supported live connection observes an invalid Org event payload,
  identity mismatch, sequence gap, reconnect, or opens a stopped/restored Org
  requiring conversation/activity hydration.
- **Primary spine:** `Org route/history -> hydration service -> strict Org
  snapshot + exact member run projections + workspace resolution -> candidate
  AgentOrgExecutionContext -> checkpoint barrier -> strict stream handshake/
  snapshot -> atomic context publication -> typed events`; on failure:
  `strict parser/reducer -> reopen_required -> preserve committed context +
  notice -> new candidate hydration/checkpoint -> atomic swap`.
- **Bounded spine:** `raw callback -> presentation admission -> publish/filter/
  reject`; rejection becomes stream recovery/error, never content.
- **Owners:** projection service owns historical conversation/activity from Org
  location; hydration owns candidate construction; stream state machine owns
  sequence; context store owns atomic publication; AgentContext owns rendered
  state.
- **Boundary check:** current definitions and Team projection/location services
  are absent; the old context is not mutated by an unverified candidate.
- **Dependency check:** route -> Org projection/hydration -> Org context ->
  accepted surface. Root facade delegates; component never parses protocol.
- **Rejected shortcut:** append unknown payloads, clear conversation on a gap,
  try Team restore, or show raw JSON until reconnect succeeds.
- **Outcome:** restore/reconnect preserves truthful conversation/trace state and
  fails closed visibly when recovery cannot complete.
- **Result:** Pass.

### VAL-022 — Org Root Termination Placement And Ownership

- **Trigger:** user stops an active AgentOrg from its active root history row
  while no member, a direct Agent, or a mounted Team is focused.
- **Primary spine:** `AgentOrgRunHistoryPanel root-row stop -> pending state ->
  AgentOrgRunStore/GraphQL lifecycle mutation -> AgentOrgRunService -> manager ->
  whole AgentOrgRun reverse termination/persistence -> lifecycle event/history
  row inactive -> Org context disconnect/cleanup`.
- **Owners:** history root row owns only action presentation/pending/error;
  AgentOrgRunService/manager/aggregate own lifecycle; member surfaces own none.
- **Boundary check:** focus does not alter root stop availability/identity; a
  TeamWorkspaceContextView has no terminate capability; standalone Team panel
  confirmation remains its separate established behavior.
- **Dependency check:** history UI -> Org lifecycle store/API -> Org service/root.
  No focused member component or Team adapter is involved.
- **Rejected shortcut:** `Stop Org` in the focused header, independent mounted-
  Team stop, or changing standalone Team confirmation to make Org simpler.
- **Outcome:** root lifecycle control is consistent with root history placement
  and cannot be mistaken for a member/Team action.
- **Result:** Pass.

### VAL-023 — Active Expanded Mounted Team Status Includes Exact Task Descendants

- **Trigger:** a user inspects an expanded direct configured Team while one
  configured or task-scoped Agent in that exact branch changes status.
- **Primary spine:** `strict Org snapshot/status event ->
  CollaborationAgentPresentationAdapter -> AgentOrgExecutionContext exact
  AgentContext -> configured Team node -> AgentOrgTeamBranchStatusProjector ->
  shared five-state fold -> TeamAggregateStatusDot and unchanged Agent dots`.
- **Bounded spine:** enumerate direct configured Agent members, task Agent
  executions, task-Team Agent members, nested task-Team members and child task
  executions below this Team node; ignore Team containers and every root/sibling
  branch.
- **Owners:** AgentContext owns exact live Agent status; the Org tree owns branch
  identity; AgentOrg Team-branch projector owns traversal/source admission; the
  shared fold/dot owns only normalization, precedence and accessible rendering.
- **Concrete check:** Team A has configured `idle`, configured `error`, and a
  task Agent `running`; its aggregate is `running`. A direct Org Agent or Team B
  Agent cannot affect Team A. If Team A task Agent becomes `idle` while one Team
  A Agent is `error`, Team A becomes `error`.
- **Boundary/dependency check:** projector receives the exact Team node and an
  injected `agentRunId -> status` function. It does not query context stores,
  sockets, GraphQL, definitions, persistence or lifecycle services.
- **Rejected shortcut:** scan canonical address prefixes, fold all Org statuses,
  fold visible rows only, copy the precedence into the component, or persist a
  Team status.
- **Outcome:** expanded Team and exact Agent status signals coexist and react to
  the same current truth.
- **Result:** Pass.

### VAL-024 — Collapsed Team Retains Aggregate Without Hidden-Row Authority

- **Trigger:** the user collapses a direct mounted Team and a hidden descendant
  Agent later changes between `idle`, `initializing`, `running`, or `error`.
- **Primary spine:** `AgentOrg history render -> complete strict Team node + live
  AgentOrgExecutionContext -> branch projection/fold -> Team row dot -> collapse
  filter hides only descendant rows`; later status events follow DS-021 and
  recompute the same dot.
- **Owners:** expansion state owns visibility only; it does not own topology or
  status membership. The branch projector reads the immutable full Team node
  before visible-row construction.
- **Boundary check:** no hidden Vue row must exist for its Agent status to
  contribute. Collapse neither selects a recipient nor changes Team/coordinator
  focus, root readiness or commands.
- **Accessibility check:** the retained dot has role/title/name `Team status:
  <State>` and the Team tree item remains keyboard/disclosure compatible; color
  is not the only communication.
- **Rejected shortcut:** compute from `rowsFor` after expansion filtering or
  issue a polling request when children are hidden.
- **Outcome:** collapsed presentation is truthful, reactive and branch-local.
- **Result:** Pass.

### VAL-025 — Stopped/Historical Team Status Uses Terminal Authority Only

- **Trigger:** the AgentOrg root stops or the user opens an inactive historical
  run after earlier descendants were running/initializing.
- **Primary spine:** `Org root lifecycle/history refresh -> run is_active=false
  and live context authority is absent -> strict stored Org topology + existing
  terminal/history Agent projections -> historical normalization -> branch fold
  -> non-live TeamAggregateStatusDot`.
- **Owners:** AgentOrg lifecycle remains the only stop/restore/archive authority;
  the history projection supplies any existing terminal Agent truth. The fold
  accepts `error`, `idle`, `offline`, demotes `running`/`initializing` without
  live authority to `offline`, and maps missing/unknown/empty to `offline`.
- **Current production truth:** stopped Org history does not persist a per-Agent
  status field. Therefore a branch with no separate terminal projection is
  truthfully `offline`; illustrative Product error/idle mixtures do not authorize
  new persistence or transport.
- **Lifecycle/non-effect check:** no mounted-Team Stop/restore/archive appears;
  no Team status cache, poll, endpoint, sidecar or root registration exists.
- **Rejected shortcut:** retain a stale pulsing live dot from a disconnected
  context, infer Team health from root `is_active`, or add a historical status
  field solely for the visual fixture.
- **Outcome:** history never fabricates live activity and does not move root
  lifecycle ownership.
- **Result:** Pass.

### VAL-026 — Supported Submit/Accept Overlap Cannot Starve Another Task Command

- **Trigger:** a task Agent completes a supported `submit_task_result` call; its
  independent authorized delegator then accepts the submission before the
  assignee's otherwise normal provider turn emits `TURN_COMPLETED`; an unrelated
  supported task command reaches the same root FIFO during that overlap.
- **Production evidence:** the retained Team traces show assignee tool success at
  `1788292703.598`, delegator acceptance success at `1788292706.652`, and a
  distinct later assignee turn boundary. `LOCAL_MCP_TOOL_EXECUTION_COMPLETED` is
  not `TURN_COMPLETED`, so the accepted task may be terminal while its execution
  is temporarily non-quiescent. Events after the unsupported self-review start
  at `1788292709.932` are excluded from this supported witness.
- **Primary spine:** `accepted record -> existing terminal sweep -> existing root
  FIFO -> exact handle tryPrepareTerminationIfQuiescent -> null because the
  assignee turn is still open -> return deferred/release FIFO -> unrelated task
  command validates, persists and returns -> Agent idle/offline event -> existing
  terminal resweep -> quiescent prepared termination -> settledAt durability ->
  existing finish/unregister`.
- **Owners:** the root FIFO keeps its existing command and durability ordering;
  `AgentRun` owns atomic input/turn quiescence and admission closure; the local
  registry owns exact-handle preparation; the Team/Org task adapter owns subject
  persistence and fail-stop.
- **Boundary check:** `RootTaskLifecycleEngine` receives only a nullable prepared
  settlement through its root-neutral adapter. It neither inspects provider
  internals nor waits on an active turn. The existing Agent execution-state event
  remains the retry signal; no scheduler or second lane is added.
- **Rejected shortcut:** treat self-review as supported, add a timeout/replay,
  run task mutations concurrently, invent a cleanup coordinator/token, or add a
  persisted `settling` state.
- **Outcome:** the supported overlap is live without broad concurrency machinery,
  and terminal record/tool semantics remain unchanged.
- **Result:** Pass.

### VAL-027 — Supported Approval Wait Is Interrupted Before Root Task Drain

- **Trigger:** with normal auto-approval disabled, a supported task Agent invokes
  an approval-gated tool and waits for the user; the application then receives
  its supported SIGTERM/shutdown action.
- **Production evidence:** the accepted Agent runtime integration test proves
  that interrupting a pending tool approval produces a terminal tool lifecycle;
  `server-runtime.ts` owns SIGTERM dispatch. This does not rely on PTY Ctrl-C,
  SIGKILL, self-review, or the confounded API trace.
- **Primary spine:** `application SIGTERM -> GeneralProcessRunSupervisor -> Team/
  Org manager -> root closes external, message and task-materialization admission
  -> freeze complete configured/mounted/task scope -> interrupt every active
  AgentRun (including approval wait) -> drain existing task FIFO -> persist
  active/awaiting_review task interruption -> existing deepest-first terminal
  sweep -> persistence drain -> finish/unregister local handles -> manager
  unregister`; process continues Org -> Team -> residual Agent.
- **Owners:** the process supervisor owns cross-root sequencing; each subject root
  owns phase ordering; `AgentRun` owns approval interruption and terminal event
  emission; the existing task engine/adapter owns settlement and durability.
- **Boundary check:** the supervisor calls only subject managers. Each root walks
  its already-owned execution scope and interrupts before invoking task drain;
  neither supervisor nor task engine reaches into provider/MCP internals.
- **Rejected shortcut:** drain before interrupt, add a shutdown timeout/force
  kill, or treat process-group death as graceful completion.
- **Outcome:** supported shutdown cannot wait on the approval that only its later
  interrupt would release.
- **Result:** Pass.

### VAL-028 — Existing Prepared Settlement Failure Boundary Remains Monotonic

- **Trigger A:** exact quiescent preparation succeeds, but the subject
  `settledAt` write fails before atomic rename.
- **Spine A:** `terminal sweep -> FIFO revalidation -> all required handles
  prepared -> subject persistence not_committed -> cancel prepared termination
  in reverse -> unchanged task/tree/index/active registry -> FIFO release ->
  ordinary resweep remains possible`.
- **Trigger B:** `settledAt` is durable and task/tree/index state commits, but
  existing `finish`/unregister/backend/MCP/resource teardown rejects.
- **Spine B:** `durable settlement -> existing prepared finish rejects -> subject
  adapter/root enters existing whole-root fail-stop -> close/interrupt/finish all
  owned work -> surface failure`.
- **Owners:** local registries own reversible prepared termination; subject
  persistence owns physical commit outcome; subject root owns post-durability
  fail-stop. No new passive or committed token owner exists.
- **Boundary check:** a pre-durability failure restores input admission through
  existing cancel semantics. A post-durability failure never rolls back, reopens,
  or replays terminal task truth.
- **Rejected shortcut:** swallow finish rejection, publish before durability,
  reanimate a settled task, or expose a partially active mounted Team/task Agent.
- **Result:** Pass.

### VAL-029 — Recursive Task-Team Preparation Is All-Or-None And Deepest-First

- **Trigger:** a terminal task Team contains multiple terminal descendants, with
  at least one descendant Agent still in a supported active turn/approval wait.
- **Primary spine:** `existing deepest-first terminal sweep -> recursively try
  prepare exact descendant handles -> quiescent children return prepared values
  -> active descendant returns null -> cancel earlier prepared descendants in
  reverse -> return deferred/release FIFO -> descendant idle/offline event ->
  resweep -> all descendants prepare atomically -> persist child/parent terminal
  truth in existing order -> finish exact subtree`.
- **Owners:** existing task records/tree own parent/host truth; task Team local
  registry owns recursive all-or-none preparation; each `AgentRun` owns its
  quiescence fence; the root task adapter owns durable deepest-first settlement.
- **Boundary check:** configured Teams are not part of task recursion, mounted
  Teams gain no root settlement authority, and no dependency graph or independent
  cleanup job is introduced beside the existing task tree.
- **Failure check:** a non-quiescent descendant causes no durable write or partial
  admission closure; a later idle event retries the same ordinary sweep. After
  durability, existing fail-stop covers finish failure.
- **Rejected shortcut:** mark the parent settled while a descendant is active,
  retain prepared siblings across attempts, flatten task Teams into configured
  membership, or add duplicate task-keyed jobs.
- **Result:** Pass.

## Ownership And Authoritative-Boundary Audit

| Higher-Level Caller | Allowed Boundary | Forbidden Same-Level Dependency | Result |
| --- | --- | --- | --- |
| GraphQL Org run resolver | AgentOrgRunService | Org manager/store/scope builder | Pass |
| GraphQL Team run resolver | AgentTeamRunService | Team manager/store/local Team | Pass |
| Agent tool | MemberExecutionContext bound commands/delivery | Root manager/index/store or aggregate cast | Pass |
| AgentOrgRunManager | AgentOrgRun/scope builder + Org package owner | AgentTeamRunManager/Team store | Pass |
| AgentTeamRunManager | RootTeamRun + Team package owner | AgentOrgRunManager/Org store | Pass |
| AgentOrgRun | private Org adapters + shared capabilities | Team root manager/store or public generic root | Pass |
| RootTeamRun | private Team adapters + shared capabilities | Org root types/store | Pass |
| Configured Agent handle | AgentRun/workspace/memory ports + root callbacks | Root aggregate/index/store/publisher | Pass |
| Flat Team local factory | configured Agent factory + explicit root callbacks | root package/manager registration | Pass |
| RootTaskLifecycleEngine / mutation FIFO | one subject adapter with nullable prepared settlement | subject tree/index/store/event imports or any wait on a non-quiescent execution | Pass |
| AgentRun quiescence boundary | `tryPrepareTerminationIfQuiescent` under AgentRun input/turn authority | root task/tree/store knowledge or blocking provider wait | Pass |
| Global exact-Agent router | AgentRunManager + ActiveCollaborationRootDirectory | Team and Org managers together | Pass |
| Mixed projection | explicit subject query boundaries | subject stores/files plus manager | Pass |
| GeneralProcessRunSupervisor | subject managers/services | local Team/Agent handles | Pass |
| Team/Org subject callback | CollaborationAgentPresentationAdapter then subject serializer | raw AgentRun payload published directly or component formatter | Pass |
| RootExecutionViewStore | AgentOrgContextsStore / subject context boundary | duplicate Org tree/focus/events and direct Org socket command | Pass |
| AgentOrgExecutionContext | strict hydration/stream/member projection ports | standalone Team context/store or current definition fallback | Pass |
| Agent/Team workspace surface | ActiveAgentWorkspaceTarget and explicit action/view ports | subject store, GraphQL client, socket or raw event | Pass |
| Mounted Team presentation adapter | TeamWorkspaceContextView | Team lifecycle/persistence/registration/termination | Pass |
| AgentOrgRunHistoryPanel | Org lifecycle store/service | focused member surface or mounted-Team stop | Pass |
| AgentOrg hierarchy row builder | AgentOrgTeamBranchStatusProjector + AgentOrgExecutionContext public selectors | visible-row scan, WebSocket/GraphQL, Team root store, definition lookup | Pass |
| AgentOrg/Team hierarchy adapters | shared fold + TeamAggregateStatusDot | duplicated precedence/localization, topology-generic status owner, TeamActivityDot substitution | Pass |

## Dependency-Direction Audit

```text
Transport/UI
  -> shared Agent/Team surfaces -> ActiveAgentWorkspaceTarget
  -> AgentOrgExecutionContext | standalone Agent/Team context
  -> strict subject streaming/projection
  -> root-neutral Agent presentation details
  -> subject services or explicit mixed projection
  -> subject managers
  -> RootTeamRun | AgentOrgRun
  -> private Team/Org adapters
  -> root-neutral task lifecycle engine + nullable prepared-settlement adapter
  -> root-neutral message/configured-Agent capabilities
  -> Team-local execution capability
  -> AgentRun/provider/workspace/memory infrastructure

Subject roots -> strict subject tree/sidecar stores -> AtomicRunPackageFileCommitWriter
Mixed location facade -> strict Team location provider + strict Org location provider
Migration -> isolated legacy codecs + current target validators/writers
Current runtime -X-> migration
AgentOrg -X-> AgentTeamRunManager / Team root store
Shared execution -X-> concrete Team/Org root/tree/store/event types
Agent presentation details -X-> Team/Org root identity, sequence or runtime
AgentOrg surface -X-> raw events / socket / standalone Team stores
Mounted Team view -X-> Team lifecycle, root store or Team registration
AgentOrg Team branch adapter -> strict Org Team node + public AgentContext status selector -> pure Team status fold -> TeamAggregateStatusDot
Team status fold/dot -X-> subject store, topology traversal, polling, transport, persistence or lifecycle
Collapse/visible rows -X-> aggregate membership authority
Task mutation FIFO -> subject adapter -> local registry -> non-waiting AgentRun quiescence preparation
Task mutation FIFO -X-> blocking provider/backend/MCP/local registry teardown
AgentRun quiescence boundary -X-> Team/Org tree/store/index/manager
Non-quiescent preparation -> null/deferred -> FIFO release -> existing idle/offline resweep
Root shutdown -> freeze/interrupt full scope -> task command drain -> settlement drain
Task command/settlement drain -X-> pre-interrupt root shutdown position
```

No upward bypass is needed in any validated use case. The active-root directory
is a lateral process index with a narrow capability, not a lifecycle layer.

## Failure And Lifecycle Decision Audit

| Failure Point | Owner | Required Response | Partial Authority Exposed? | Result |
| --- | --- | --- | --- | --- |
| Org configuration/plan invalid | AgentOrgRunService | return typed validation failure before IDs/runtime | No | Pass |
| Configured Agent candidate prepare fails | Org scope builder + handle | abort prepared candidates in reverse; no package/root registration | No | Pass |
| Initial Org package pre-rename write fails | Org persistence + scope builder | abort candidates; no active root | No | Pass |
| Initial post-durability publication indeterminate | AgentOrgRun | fail-stop/teardown complete scope; leave strict package for restore; do not register active root | No live partial root | Pass |
| Runtime Org tree/task/message pre-rename write fails | Org coordinator/adapter | cancel reservation/candidate and keep root active only when retry-safe | No new live state | Pass |
| Runtime post-rename finalization indeterminate | AgentOrgRun | close admission and fail-stop whole root | No independently active mounted Team | Pass |
| Org restore preparation fails | Org manager/scope builder | reverse abort; no root/directory registration | No | Pass |
| Process shutdown child error | GeneralProcessRunSupervisor | aggregate error and continue later cleanup steps | No skipped owner | Pass |
| Unsupported deep migration item | Migration | zero preflight writes; failed/unavailable item; continue compatible items | Source preserved | Pass |
| Incompatible external definition | Admission | unavailable diagnostic; no source write; compatible runtime/history continue | No invalid new work | Pass |
| Raw Agent callback cannot be admitted | Presentation adapter + subject stream | publish typed failure/recovery signal; do not publish/render raw payload | No protocol content exposed | Pass |
| Org stream identity/sequence/schema mismatch | AgentOrgStreamingService | enter `reopen_required`, preserve last committed context, hydrate/checkpoint candidate, swap only when complete | No partial candidate or JSON fallback | Pass |
| Org member projection/hydration fails | Org hydration service/context store | keep prior context/history state and visible recovery error; do not guess from Team/current definition | No false conversation authority | Pass |
| Org command acknowledgement fails or target is stale | Active target/Org stream handler | preserve draft/tool decision state as appropriate and surface typed error; execute no fallback target | No wrong Agent command | Pass |
| Org root termination fails | Org lifecycle service + history row | clear pending into root-row error; focused surface remains non-authoritative | No mounted Team stopped independently | Pass |
| Live Agent status is missing/unknown or context loses live authority | AgentOrg branch status source + shared fold | normalize to offline; historical running/initializing cannot pulse | No invented Team state or request | Pass |
| Team branch traversal encounters empty/no Agent descendants | AgentOrg Team-branch projector | return offline through shared fold | No outside branch fallback | Pass |
| Prepared settlement write fails before durability | Subject task adapter + local prepared termination | cancel every prepared handle in reverse; retain tree/index/active handle; release FIFO and allow ordinary resweep | No durable or partial admission authority | Pass |
| Terminal fence commits but prepared finish rejects | Subject adapter + subject root | report failure and enter whole-root fail-stop; never reopen/replay task | No terminal-task resurrection | Pass |
| Terminal task execution is not quiescent while unrelated task command arrives | AgentRun quiescence boundary + mutation FIFO | preparation returns null without waiting; release FIFO; unrelated command commits; existing idle/offline event retries settlement | No global task-lane starvation | Pass |
| Root shutdown begins with provider approval wait | Subject root + AgentRun | close/freeze and interrupt full scope before any task drain; then drain commands/settlements and finish | No interrupt-after-wait cycle | Pass |
| Repeated settlement sweep sees the same non-quiescent terminal task | Existing terminal sweep + AgentRun quiescence boundary | each attempt either prepares atomically or defers without durable/local partial state; idle/offline resweep supplies progress | No duplicate job/token machinery | Pass |

## Removal And Forbidden-Shortcut Audit

| Obsolete / Shortcut | Removed Or Rejected By Design? | Evidence |
| --- | --- | --- |
| Configured Team child under Team | Yes | Flat Team local configured registry is Agent-only; `getOrCreateConfiguredChildTeam` removed |
| `MemberTaskRootResolver -> RootTeamRun` | Yes | bound `MemberTaskCommandCapability` |
| Shared `TeamMemberExecutionIdentity` / `memberTeamContext` | Yes | tagged collaboration identity / `memberExecutionContext` |
| Team-root `MixedAgentMemberHandle` | Yes | root-neutral configured Agent handle |
| Root-creating mixed Team factory for Org | Yes | explicit Team-local factory under supplied root scope |
| Placeholder/catch-all Org activator | Yes | explicit Org scope builder/aggregate/adapters |
| Synthetic Team root/coordinator | Rejected | native AgentOrgRun root |
| Mounted Team as standalone Team root/package | Rejected | local Team object owned by Org |
| Direct Org Agent as standalone Agent | Rejected | configured handle owned by Org |
| Public/durable generic root union/base | Rejected | two public roots over internal tagged capabilities |
| Team sidecar envelope reused for Org | Rejected | strict Org sidecars |
| Try-both reader/root-kind inference | Rejected | compound identity + strict family selection |
| Migration-specific journal/backup/restore | Rejected | existing runner + atomic write/direct rename/restart retry |
| Opaque AgentOrg event schema / `any` / JSON renderer | Yes | closed Agent presentation + Org event contracts and strict context reducer |
| Bespoke AgentOrg runtime header/event cards/composer | Yes | thin Org focus adapter over shared Agent/Team workspace surfaces |
| Direct Org send-only component/store socket path | Yes | ActiveAgentWorkspaceTarget + AgentInteractionPort + strict command union |
| Parallel Org raw event array / duplicate focus authority | Yes | one AgentOrgExecutionContext; mixed root store delegates |
| Mounted Team registered as standalone for UI reuse | Rejected | read-only TeamWorkspaceContextView backed by Org context |
| Member-header Stop Org / mounted-Team stop | Yes / Rejected | root history-row action owned by AgentOrg lifecycle |
| Copied AgentOrg Team-status precedence or visible-row fold | Rejected | one shared pure fold plus exact Org branch adapter |
| `NestedTeamAggregateStatusDot` / nesting-specific helper names retained through aliases | No; clean-cut rename | neutral TeamAggregateStatusDot and Team-history adapter, all imports/tests/locales updated |
| Team aggregate persisted/polled/transported or mapped from TeamActivityDot | Rejected | pure projection over existing exact Agent status truth |
| Provider/local teardown awaited indefinitely by root task mutation FIFO | Yes | nullable non-waiting quiescence preparation defers before any blocking teardown |
| Drain-before-interrupt Team/Org root shutdown | Yes | close/freeze/interrupt complete scope precedes command and settlement drains |
| AD-REV-008 task-keyed coordinator, passive/committed tokens and independent cleanup jobs | Withdrawn | ARCH-REV-006 supported-reachability review showed the extra machinery was disproportionate; existing FIFO/sweep/prepared settlement remain |
| Duplicate settlement lanes or dependency graph beside the task tree | Rejected | existing serialized sweep and exact task hierarchy remain authoritative |
| Team-domain shared settlement contract imported by Org | Yes | root-neutral nullable prepared-settlement adapter remains under collaboration execution task |
| Timeout/replay/new `settling` status/self-review support | Rejected | ownership/sequencing correction preserves existing task contract |

## Design-Principle Self-Check

| Principle | Evidence In Revised Design | Result |
| --- | --- | --- |
| Approved behavior first | Every case cites REQ/AC/SCN/Product or established runtime contract; no new product behavior | Pass |
| Supported-scenario gate | 29 concrete supported cases; normal submit/independent-accept overlap and normal approval-gated shutdown prove the affected reachability. The self-review witness is classified `Unsupported/Contrived` and used only as technical coupling evidence; global lookup/tampering/deep conversion remain rejected | Pass |
| Spine span sufficiency | Each primary case spans initiating caller through owner/durability/provider to result/event | Pass |
| Multiple primary spines | Definition, Team launch, Org launch, message, task, persistence, migration, mixed read, focus, process lifecycle are distinct | Pass |
| Ownership clarity | Root aggregates own lifecycle/state; lower capabilities own local mechanics; adapters own translation | Pass |
| Authoritative boundary | Higher-level callers use one service/root boundary and do not hold internals beside it | Pass |
| Off-spine concerns | Locations, active directory, physical writer, codecs, projectors serve explicit root/process owners | Pass |
| Shared structure tightness | Tagged mandatory identities and record engines; no optional coordinator/root blob or tree union | Pass |
| Clean-cut removal | Team-root shared contexts, configured-child path, placeholder activator and normal legacy paths are explicitly removed | Pass |
| Persisted-data proportionality | Flat Team no-op; Org-like fixed transform; strict Org sidecars; no per-Agent move/custom recovery | Pass |
| Dependency direction | Subject roots depend on capabilities; capabilities do not import roots; current runtime does not import migration | Pass |
| File placement follows ownership | shared execution under collaboration; local Team under Team execution; subject adapters/sidecars remain in subject folders | Pass |
| Accepted production reuse | Direct Org Agent and Team focus terminate in extracted accepted surfaces; Org view is only an adapter | Pass |
| Strict presentation boundary | Raw callbacks are admitted once, subject-enveloped strictly, reduced into AgentContext and never formatted as protocol JSON | Pass |
| Lifecycle/action ownership | Org stop is a root history action; focused Agent and mounted Team surfaces expose no root lifecycle capability | Pass |
| Projection proportionality | Existing Agent status/context/tree truth plus one pure fold/dot satisfies REQ-028; no backend, durable, polling or transport machinery is introduced | Pass |
| Collapse-independent hierarchy truth | Full strict Team node is traversed before display filtering; hidden task Agents remain inputs and outside branches cannot leak | Pass |
| Concurrency lane ownership | One existing serialized task lane remains; it probes quiescence without waiting and defers to the existing execution-state resweep | Pass |
| Shutdown dependency order | Full owned scope is frozen/interrupted before command or settlement drain, breaking the evidenced wait cycle for both Team and Org | Pass |
| Durable failure boundary | Existing prepared termination is reversible before durability; after durability, finish is monotonic and whole-root fail-stop on failure | Pass |

## Questions / Open Decisions

- Product or requirements questions requiring user input: `None`.
- Architecture questions left to implementation: `None material`. Concrete class
  names may change only if the same ownership, identity, dependency and forbidden
  import rules remain obvious and the design artifact is updated before a
  material boundary change.
- Implementation evidence still required: all tests and rendered/API/E2E checks
  named in `design-spec.md`, especially Team-wire compatibility, strict Org
  presentation/command parsing, checkpointed member hydration, structural
  workspace reuse, pure Team fold/branch matrices, expanded/collapsed/stopped
  AgentOrg status rendering, the real imported-package prompt/browser comparison,
  and AD-REV-009's deterministic normal submit/accept overlap, non-waiting
  quiescence deferral, recursive all-or-none preparation, pre-/post-durable
  failure and interrupt-before-drain Team/Org shutdown checks. The
  downstream implementation/test changes and evidence are not validated or
  claimed by this artifact.

## Self-Validation Conclusion

`AD-REV-005` continues to resolve `IDI-001`; `AD-REV-006` resolves real-browser
`ADI-007`; and AD-REV-007 resolves `API-FIND-007` / `CR-FIND-011` at the
architecture boundary under approved RER-021. `AD-REV-009` resolves
`ARCH-REV-006` / `AR-FIND-003` by grounding the lifecycle concern in two
independently supported production paths and proportionately replacing the
blocked AD-REV-008 machinery with a nullable, non-waiting AgentRun quiescence
boundary plus interrupt-before-drain root shutdown. All 29 supported walkthroughs
have a complete production spine, one authoritative owner, explicit status/
lifecycle/durability truth and a one-directional dependency path. No
walkthrough requires a synthetic Team root, standalone mounted Team, standalone
direct Org Agent, Team sidecar reinterpretation, public generic root, raw Org
dashboard, opaque/JSON event fallback, component-owned Org socket, visible-row
aggregate authority, status polling/persistence, blocking provider teardown in
the task FIFO, a second settlement lane/coordinator/token protocol,
drain-before-interrupt shutdown, timeout/replay machinery, or boundary bypass.

The self-validation therefore passes. The focused AD-REV-009 correction is
`Medium / High`: bounded to the existing AgentRun quiescence boundary, shared
task/local-execution adapters, and Team/Org shutdown sequencing, but material to
concurrency, fail-stop and shutdown. The cumulative
package remains `Large / High`; independent Architecture Review is mandatory
before Implementation changes this path or API/E2E resumes cumulative
validation. The unsupported self-review correlation remains retained only as
technical evidence of the current blocking coupling, never as intended behavior
or as the justification for broad recovery machinery.
