# Architecture Design Self-Validation

## Status

- Package: `AORG-FLAT-TEAM-001`
- Architecture revision validated: `AD-REV-005`
- Requirements authority: `RER-018`
- Product authority: `RV-012` / `VIS-001`-`VIS-020`
- Trigger: user-requested use-case/data-flow/ownership/boundary/dependency self-validation plus Implementation Design Impact `IDI-001`
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
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-handoff.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-revision-record.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/autobyteus-server-ts/docs/design/production_data_migration_conventions.md`
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/ui-ux-spec.md`

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
| VAL-005 | AC-010; ORG-CASE-028 | Direct Org Agent delegates from Org-root host | DS-005, DS-006O, DS-014 | Pass |
| VAL-006 | PRE-005; REQ-015 | Mounted/task Team delegation and recursive task lineage | DS-005, DS-006T/O | Pass |
| VAL-007 | REQ-014 persisted binding | External provider binding during Org activation | DS-003, DS-006O, DS-014 | Pass |
| VAL-008 | Existing fail-stop durability contract | Org message/task/tree persistence becomes indeterminate | DS-004-006O, DS-014 | Pass |
| VAL-009 | SCN-002/004/010; AC-008/009/020 | Strict AgentOrg restore | DS-006O, DS-014, DS-015 | Pass |
| VAL-010 | Existing server lifecycle contract | Process construction failure and normal shutdown | DS-015 | Pass |
| VAL-011 | REQ-016/025 | Mixed history/stream/workspace truth | DS-008 | Pass |
| VAL-012 | SCN-004/010; REQ-012/013 | One-level Org-like Team package migration | DS-007, DS-010 | Pass |
| VAL-013 | REQ-014; AC-020 | Native flat Team V2 no-op at cutover | DS-007, DS-010 | Pass |
| VAL-014 | SCN-011; REQ-026/027 | Incompatible external Team and dependent Org | DS-000, DS-007 | Pass |
| VAL-015 | SCN-002/009; RV-012 | Full Org activation with no focus, then exact focus | DS-003, DS-013 | Pass |
| VAL-016 | SCN-001/008; REQ-020-023 | Team/Org handoff authoring and atomic save | DS-001, DS-009, DS-011 | Pass |
| VAL-017 | Existing application Team execution; REQ-018 scope | Application-owned flat Team after extraction | DS-002, DS-015 | Pass |

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
- **Shutdown spine:** `close launch/stream admission -> stop all Org roots -> stop
  standalone Team roots -> stop remaining AgentRuns -> release Org/Team/services/
  directory -> close tool sessions/resources`.
- **Owners:** GeneralProcessRunSupervisor owns ordering; subject managers own
  their roots; AgentRunManager owns residual AgentRuns.
- **Boundary check:** supervisor calls managers, never individual local Teams or
  Agent handles. Construction abort releases successfully created dependencies
  in reverse order.
- **Application specialization:** application scope constructs no Org manager and
  retains Team -> Agent shutdown while using the extracted factories.
- **Rejected shortcut:** Team manager registers embedded Org Teams or shutdown
  stops AgentRuns before the roots that own them.
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
| Task/message engine | one subject adapter port | subject tree/index/store/event imports | Pass |
| Global exact-Agent router | AgentRunManager + ActiveCollaborationRootDirectory | Team and Org managers together | Pass |
| Mixed projection | explicit subject query boundaries | subject stores/files plus manager | Pass |
| GeneralProcessRunSupervisor | subject managers/services | local Team/Agent handles | Pass |

## Dependency-Direction Audit

```text
Transport/UI
  -> subject services or explicit mixed projection
  -> subject managers
  -> RootTeamRun | AgentOrgRun
  -> private Team/Org adapters
  -> root-neutral task/message/configured-Agent capabilities
  -> Team-local execution capability
  -> AgentRun/provider/workspace/memory infrastructure

Subject roots -> strict subject tree/sidecar stores -> AtomicRunPackageFileCommitWriter
Mixed location facade -> strict Team location provider + strict Org location provider
Migration -> isolated legacy codecs + current target validators/writers
Current runtime -X-> migration
AgentOrg -X-> AgentTeamRunManager / Team root store
Shared execution -X-> concrete Team/Org root/tree/store/event types
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

## Design-Principle Self-Check

| Principle | Evidence In Revised Design | Result |
| --- | --- | --- |
| Approved behavior first | Every case cites REQ/AC/SCN/Product or established runtime contract; no new product behavior | Pass |
| Supported-scenario gate | 17 concrete supported cases; contrived global lookup/tampering/deep conversion remain rejected | Pass |
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

## Questions / Open Decisions

- Product or requirements questions requiring user input: `None`.
- Architecture questions left to implementation: `None material`. Concrete class
  names may change only if the same ownership, identity, dependency and forbidden
  import rules remain obvious and the design artifact is updated before a
  material boundary change.
- Implementation evidence still required: all tests and rendered/API/E2E checks
  named in `design-spec.md`; the uncommitted IR-001 draft is not validated by
  this artifact.

## Self-Validation Conclusion

`AD-REV-005` resolves `IDI-001` at the architecture boundary. All supported
walkthroughs have a complete production spine, one authoritative root owner,
strict durable identity, explicit failure/restore/shutdown behavior, and a
one-directional dependency path. No walkthrough requires a synthetic Team root,
standalone mounted Team, standalone direct Org Agent, Team sidecar reinterpretation,
public generic root, or boundary bypass.

The self-validation therefore passes. Because the correction materially changes
shared Agent execution/tool context, Team local runtime extraction, tasks,
messages, memory, sidecars, global routing and process lifecycle, classification
remains `Large / High` and independent Architecture Review is mandatory before
implementation resumes.
