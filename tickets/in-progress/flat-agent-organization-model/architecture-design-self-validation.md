# Architecture Design Self-Validation

## Status

- Package: `AORG-FLAT-TEAM-001`
- Architecture: `AD-REV-021`, canonical `design-spec.md`
- Approved requirements: `RER-031@3b8c18a28af7674619a797a92a208dabfa851f54`
- Prior review: AD-REV-020 / ARCH-REV-018 Pass; current inspected source
  IR-039 checkpoint `932c81b22`. RER-031 resolves UI-CLEAN-001; earlier
  source/validation pins below remain historical, not new execution claims.
- Date: 2026-09-11
- Result: `Design Self-Validation Pass — independent Architecture Review required`
- 50 design walkthroughs; no source, browser, provider or API/E2E execution
  performed/claimed in this round. Prior scoped tests remain historical evidence.
- Product: no new gate. Existing approved packages remain normative elsewhere.

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

Source lists below retain earlier rounds' evidence at their recorded pins;
claims described there as “current” belong to those rounds. AD-REV-020 source
is the reviewed IR-038 checkpoint `14a94fc45`; its delta is DS-031–033. Existing
VAL-001–045 remain cumulative behavior checks; VAL-046–050 add the authored
format and owned-definition transition. No older source-gap note says an
already implemented correction is still absent.

- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md` (latest completed ARCH-REV-017 Pass on AD-REV-019; earlier findings retained as historical evidence)
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-handoff.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-revision-record.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-013/post-pass-user-discovery/API-FIND-019-agentorg-communication-visibility-gap.md`
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
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-TEAM-OVERRIDES-001/ui-ux-spec.md`
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-TEAM-OVERRIDES-001/user-decision-record.md`
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-TEAM-OVERRIDES-001/visual-references/visual-reference-manifest.json`
- `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/code-review-report.md` and `code-review-revision-record.md` (`CRR-021` / `CR-FIND-020` trigger history; current `CRR-036` cumulative source Pass and `CRR-037` proportional test-code Pass over IR-028 / API-REV-010)
- `origin/personal@773bce779` implementations of `workspaceHistoryNestedTeamStatus.ts`, `NestedTeamAggregateStatusDot.vue`, and `WorkspaceTeamExecutionTree.vue` (inspected with `git show`; continuity evidence only)
- `origin/personal@773bce779` implementations of `agent-run.ts`,
  `agent-run-input-admission-state.ts`, Team frozen/root termination, and the
  AgentRun FIFO-drain test; commits `1e7837929` / `f7d65ad75` (latent-shutdown-
  gap and preserved ordinary-termination evidence)
- `origin/personal@5fb16658e` and current implementations of
  `TeamRunConfigForm.vue`, `TeamMemberConfigTree.vue`,
  `TeamScopeConfigEditor.vue`, and `MemberOverrideItem.vue` (byte-identical
  established launch-presentation evidence), plus current
  `AgentOrgRunConfigPanel.vue`, `AgentOrgPlacementOverrideRow.vue`,
  `agentOrgRunConfigStore.ts`, generated AgentOrg GraphQL input, and server
  `agent-org-run-service.ts` (focused production boundary evidence)
- Current `autobyteus-web/utils/teamRunConfigUtils.ts`,
  `components/workspace/config/MemberOverrideItem.vue`,
  `AgentOrgRunConfigPanel.vue`, and server
  `agent-collaboration/services/collaboration-launch-configuration-resolver.ts`
  (preview/serialization/server omission-versus-null evidence)
- Current `autobyteus-web/components/AppLeftPanel.vue`,
  `components/workspace/history/WorkspaceAgentRunsTreePanel.vue`, and
  `AgentOrgRunHistoryPanel.vue`, plus pre-AgentOrg
  `origin/personal@5fb16658e` AppLeftPanel (route-selected competing history
  owner evidence)
- Current `AgentOrgRunConfigPanel.vue`, `TeamScopeConfigEditor.vue`, and
  `WorkspaceSelector.vue` (Org root versus Team root default-selection evidence)
- User Electron screenshots `ctx_d447ee010eb5__image.png`,
  `ctx_21d6681af54c__image.png`, `ctx_b956b806fc6f__image.png`,
  `ctx_fcf2f19f0f06__image.png`, and `ctx_02bf252bf8a2__image.png`
- Current `autobyteus-server-ts/src/services/agent-streaming/agent-org-stream-handler.ts`, `agent-team-stream-handler.ts`, `agent-org-execution/domain/agent-org-run.ts`, `agent-org-execution/services/agent-org-execution-index.ts`, `agent-org-execution/services/agent-org-run-service.ts`, `run-history/services/agent-org-run-history-catalog-service.ts`, `team-run-history-catalog-service.ts`, and `run-history-service-helpers.ts` (exact accepted-command, configured/task-kind, missing Org write, established Team normalization/first-write, and current composition evidence)
- Current `autobyteus-server-ts/src/agent-memory/store/agent-memory-layout.ts`, `agent-memory/store/memory-file-store.ts`, `agent-memory/services/runtime-memory-event-accumulator.ts`, root communication/task sidecars and deterministic input builders, and `app-data-migrations/app-data-migration-registry.ts` (exact configured direct/mounted paths, complete trace corpus, current trace limitations, internal-input exclusion evidence, and registered migration prerequisites)
- Current `autobyteus-web/services/agentOrgExecution/agentOrgStreamingService.ts`, `stores/agentOrgContextsStore.ts`, `stores/runHistoryLoadActions.ts`, and `components/workspace/history/WorkspaceAgentOrgHistoryCollection.vue` (accepted ACK, missing invalidation, strict existing Org history read, and current summary/fallback rendering)
- Current `autobyteus-server-ts/src/agent-org-execution/services/agent-org-communication-adapter.ts`, `agent-org-execution/domain/agent-org-run.ts`, established `services/team-communication/team-communication-message-append-plan.ts`, and `agent-collaboration/execution/events/member-input-presentation-event-builder.ts` (one durable Org record succeeds; Team publishes root plus receiver input; Org currently omits the latter despite an existing strict receiver presentation boundary), plus `agent-collaboration/execution/task/root-task-lifecycle-input.ts`, `agent-collaboration/domain/agent-team-collaboration-llm-contract.ts`, `agent-communication/services/send-message-to-dispatcher.ts`, `agent-communication/services/global-agent-run-message-router.ts`, and `agent-org-execution/services/agent-org-execution-index.ts` (normal task packet exposes configured delegator AgentRun ID; the dispatcher/router accepts same-root exact-ID messaging; one index distinguishes configured/task/task-Team-member endpoints)
- Current `autobyteus-web/types/workspace/activeAgentWorkspaceTarget.ts`, `services/agentOrgExecution/agentOrgExecutionContext.ts`, `agentOrgTeamPresentation.ts`, `components/layout/RightSideTabs.vue`, `composables/useRightSideTabs.ts`, `TeamOverviewPanel.vue`, and `TeamCommunicationPanel.vue` (historical RER-026 finding; current RER-028 adds task-inclusive identity, independent Tasks and exact task selection)
- Deployed current Org/Team history indexes plus the configured-member raw trace and user screenshots `ctx_f1133d7d05d9__image.png` / `ctx_9b7731d65643__image.png` recorded by Requirements Engineering (3/3 empty Org summaries versus 6/6 non-empty Team summaries)
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
| AgentOrg launch appearance reuses established Team presentation | Outer disclosure and mounted Team scope/Agent editors are the accepted Team components; Org adds only a strict projector and command adapter | Pass |
| AgentOrg and AgentTeam config authority stays separate | Org root/team/agent sparse maps and existing Org launch payload remain Org-owned; shared components import neither store and never compute server-effective configuration | Pass |
| Form projection is complete or blocked | Missing Team/member/coordinator/address correlation produces an exact diagnostic and disabled Run; no `flatMap` omission, browser repair, synthetic member, or partial launch view | Pass |
| Effective launch configuration is singular | Org Team/Agent edits enter one canonical patch map; owned runtime/model without owned config carries `llmConfig:null`; preview, request, server resolution and snapshot must agree | Pass |
| Workspace/history owners are route-stable and non-overlapping | Mixed read owner loads/strictly projects/groups/orders stable-keyed rows; the one always-mounted panel/`useWorkspaceHistoryTreeState` instance owns expansion/reveal/highlight/scroll continuity; Org is a sibling directly below Teams; route changes never swap either owner | Pass |
| Workspace default is root-only and real | Fresh untouched Team/Org root may select the actual available Temp default; descendants inherit or use exact supported override; no hard-coded path or focus | Pass |
| Settlement never waits for a non-quiescent execution | The existing one root FIFO and existing terminal sweep remain; exact handles offer non-waiting quiescence preparation, return deferred immediately while a turn/approval is live, and rely on the existing Agent idle/offline resweep | Pass |
| Root shutdown fences input/provider starts before task drains | Team and Org stabilize and freeze their complete direct/mounted/task/prepared scope, then every AgentRun closes admission, cancels pre-forward work or tracks and interrupts provider-started work through terminal state before task command/settlement drain | Pass |
| AgentRun fence and ordinary termination stay distinct | Root shutdown is irreversible and may use the existing pre-forward cancellation fact; ordinary prepared termination still drains admitted FIFO input and a prepared cancel cannot reopen a root-fenced run | Pass |
| AgentOrg summary is derived once from exact accepted external input | Only an accepted non-empty SEND_MESSAGE to an execution-kind `configured` direct/mounted Agent may enter the serialized Org history first-write; later/task/system/inter-Agent/rejected/empty traffic cannot replace or seed it; web renders only an authoritative history read | Pass |
| Accepted ordinary communication includes every exact participant | Org root resolves both committed IDs; all admitted configured/task pairs receive exact receiver input and participant Messages rows; admission unchanged | Pass |

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
| VAL-027 | Existing Team/Org graceful-shutdown contract; normal task activation; supported approval-gated tool and application SIGTERM | Team and Org shutdown across both pre-`TURN_STARTED` provider-start race and active approval wait | DS-015, DS-022 | Pass |
| VAL-028 | Existing task mutation durability/fail-stop contract | Existing prepared settlement failure before versus after durability | DS-006T/O, DS-022 | Pass |
| VAL-029 | PRE-005; REQ-015 | Recursive task-Team all-or-none quiescence preparation and deepest-first settlement | DS-005, DS-022 | Pass |
| VAL-030 | SCN-013; REQ-029; AC-024; VIS-OVR-001-006 | AgentOrg launch hierarchy reuses accepted Team presentation while preserving exact Org draft/API ownership | DS-003, DS-012, DS-023 | Pass |
| VAL-031 | SCN-014; REQ-030; AC-025 | Runtime/model edit without explicit model config has one effective preview/request/server/snapshot result | DS-012, DS-024 | Pass |
| VAL-032 | SCN-015; REQ-031; AC-026 | Unified Workspace/history surface and state persist across AgentOrg routes and subject switching | DS-008, DS-013, DS-019, DS-025 | Pass |
| VAL-033 | SCN-016; REQ-032; AC-027 | Fresh Org selects actual Temp default and placements inherit or apply exact Team override without focus | DS-003, DS-012, DS-026 | Pass |
| VAL-034 | SCN-017; REQ-033; AC-028 | First accepted non-empty external message to a direct configured Org Agent commits Team-normalized summary and updates the live row authoritatively | DS-027 | Pass |
| VAL-035 | SCN-017; REQ-033; AC-028 | Mounted-Team configured Agent qualifies identically while task/system/inter-Agent/approval/interrupt/rejected/failed/empty inputs remain excluded | DS-027 | Pass |
| VAL-036 | QR-011; REQ-033; AC-028 | Concurrent qualifying acceptances choose one first completion and preserve it across later traffic, stop, restore and rebuild; stale web reads cannot overwrite it | DS-027 | Pass |
| VAL-037 | SCN-017; REQ-033; AC-028; DEC-020 | Startup recovery writes only one provenance-qualified uniquely earliest configured-member trace, preserves existing values, and leaves nonqualifying/absent/tied/invalid/ambiguous evidence on fallback | DS-027 | Pass |
| VAL-038 | SCN-018; REQ-034; AC-029 | Direct exact receiver publication and root Messages perspectives | DS-028 | Pass |
| VAL-039 | SCN-018; REQ-034; AC-029 | Cross-placement/task identity and references | DS-028–029 | Pass |
| VAL-040 | SCN-018; REQ-034; AC-029 | All accepted endpoint directions, recovery and rejection | DS-028–030 | Pass |
| VAL-041 | SCN-019; REQ-035; AC-030 | Exact delegator/task Agent/fresh Team participant Tasks relevance | DS-029 | Pass |
| VAL-042 | SCN-018–019; REQ-034–035 | Concurrent same-address task navigation and task-origin delegation | DS-029 | Pass |
| VAL-043 | SCN-020; REQ-036; AC-031 | Saved records versus accepted/failed system input | DS-030 | Pass |
| VAL-044 | SCN-019–020; AC-030–031; AAV-001 | Settlement/read-only exact retained history without activation | DS-029–030 | Pass |
| VAL-045 | SCN-018–020; REQ-034–036 | Shared Team responsive UI, reactivity and no false ownership | DS-028–030 | Pass |
| VAL-046 | SCN-021; REQ-026; AC-021/032 | Field-free Team/Org author/save/reload/package roundtrip and strict negatives | DS-031 | Pass |
| VAL-047 | SCN-022; AC-033 | Completed prior migration, owned numeric targets and current zero-write cohort | DS-032 | Pass |
| VAL-048 | SCN-004/022; AC-033 | Skip-version ordering, unchanged historical intermediate, retry and independent status | DS-032–033 | Pass |
| VAL-049 | AC-022/033; ORG-CASE-049–055/062–063 | Physical owned child inventory, external zero writes and truthful diagnostics | DS-031–033 | Pass |
| VAL-050 | AC-032/033; forward-only convention | Complete source cut, failure truth and no runtime/UI expansion | DS-031–033 | Pass |
| VAL-051 | REQ-034/036; AC-034; SCN-018 | Compact Messages defaults with exact on-demand identity and unchanged accepted rows | DS-034a/r | Pass |
| VAL-052 | REQ-035; AC-034; SCN-019 | Task detail without strip, exact Agent/Team participant navigation and retained references | DS-034b/r | Pass |
| VAL-053 | REQ-031; AC-026; SCN-015 | Exact Org history heading with unchanged sibling order and UI state | DS-034c | Pass |

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
- **Terminal path:** the existing deepest-first terminal sweep selects an
  eligible leaf through the one root FIFO. Its exact local registry calls
  `tryPrepareTerminationIfQuiescent`: `null` returns deferred and releases the
  FIFO for an existing idle/offline-event retry; a quiescent leaf returns the
  existing prepared settlement, commits `settledAt`, then finishes/unregisters
  through that same serialized mutation path. A task-Team parent becomes
  eligible only after its children are durably settled. No independent cleanup
  job, second lane, or concurrent mutation path exists.
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
  message admission -> drain admitted publication operations only -> freeze
  complete direct/mounted/task/prepared scope -> complete every AgentRun input/
  provider-start/interrupt fence -> drain short task mutations -> durably
  interrupt open task records -> drain deepest-first settlement cleanup -> drain
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
  drains commands/settlements before completing every Agent fence, or process
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
- **Primary spine:** `unified Workspace history AgentOrg root-row stop -> typed
  WorkspaceHistorySubjectActions {rootSubjectKind:'agent_org', rootRunId,
  action:'stop'} -> AgentOrgRunStore/GraphQL lifecycle mutation ->
  AgentOrgRunService -> manager -> whole AgentOrgRun reverse
  termination/persistence -> tagged lifecycle event -> the same unified history
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
- **Owners:** AgentOrg lifecycle remains the only stop/restore authority;
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

### VAL-027 — Root Shutdown Fences Pre-Turn Input And Active Approval Waits

- **Supported trigger A — pre-turn window:** a normal member delegates a task.
  Its durable activation commits and `releaseWork()` asynchronously posts the
  initial task message. Independently, application SIGTERM arrives after the
  exact AgentRun has admitted/claimed or registered provider start but before a
  canonical `TURN_STARTED` is visible.
- **Supported trigger B — active wait:** with normal auto-approval disabled, a
  supported task Agent invokes an approval-gated tool and waits; application
  SIGTERM then enters the same shutdown path.
- **Production evidence:** task Agent/Team registries queue the normal initial
  post after activation; AgentRun currently claims under its dispatch queue but
  starts outside that closure; `server-runtime.ts` owns SIGTERM; the accepted
  runtime test proves interrupt terminalizes pending tool approval. No PTY
  Ctrl-C, SIGKILL, self-review, hidden mutation, or invalid task action is used.
- **Primary spine:** `delegate_task -> root task engine -> durable activation ->
  releaseWork -> AgentRun admission/provider-start slot`, concurrent with
  `application SIGTERM -> GeneralProcessRunSupervisor -> Team/Org manager ->
  root closes external admission -> drain admitted publication operations only
  -> freeze exact direct/mounted/task/prepared scope -> recursively invoke
  fenceInputAndInterruptForRootShutdown -> terminal Agent input/turn -> drain
  task FIFO -> persist open-task interruption -> deepest-first settlement ->
  persistence/local finish -> root unregister`; process continues Org -> Team ->
  residual Agent.
- **Bounded AgentRun spine:** `dispatch queue orders provider-start transition
  versus root fence -> fence wins: reserved invalidation or exact pre-forward
  cancelled fact and no backend call; provider start wins: tracked slot + armed
  shutdown intent -> canonical TURN_STARTED -> existing interrupt -> canonical
  interrupted/error terminal -> fence resolves`. Active approval wait enters the
  same latter branch directly.
- **State/fact check:** never-admitted reservation emits no lifecycle; admitted
  pre-forward work emits exactly one existing
  `AGENT_RUN_TERMINATED_BEFORE_INPUT_FORWARD` cancellation; provider-started work
  is not mislabeled cancelled and finishes through existing forward/association/
  interrupt/failure facts. No backend call can occur after fence completion.
- **Stable-scope check:** Team's operation/materialization gate and Org's private
  equivalent close before snapshot. Frozen scopes include active and prepared
  direct/task handles plus every mounted/root-task/recursive task-Team scope. No
  handle capable of later publication is omitted, and this short publication
  drain is not terminal task settlement.
- **Owners:** the process supervisor owns cross-root sequencing; each subject root
  owns close/freeze/drain order; frozen scopes own immutable enumeration only;
  `AgentRun` owns input/start/turn/interrupt decisions and exact facts; the task
  engine/adapter owns record settlement and durability.
- **Boundary check:** supervisor -> subject manager -> subject root -> frozen
  scope -> configured handle -> AgentRun. No caller uses root plus AgentRun
  internals; no task engine/provider/MCP bypass exists.
- **Retry/cancellation check:** the Agent fence is idempotent and irreversible.
  Root retry joins it. If a later prepared settlement cancels before durability,
  it cannot reopen Agent input. Ordinary non-root prepared termination continues
  draining admitted FIFO input exactly as origin/personal tests require.
- **Rejected shortcut:** active-turn-only `NO_ACTIVE_TURN` success, task drain
  before fence, timeout/replay/force kill, persisted shutdown/settling state,
  coordinator/token/job graph, or treating process-group death as graceful.
- **Outcome:** root shutdown cannot miss provider work in the pre-turn window,
  cannot wait on an approval that only later interruption would release, and
  does not change ordinary input or durable task semantics.
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

### VAL-030 — AgentOrg Launch Reuses Accepted Team Presentation Without Owner Merge

- **Trigger:** on the normal AgentOrg detail/configuration route, a user opens a
  new launch draft containing direct Agents and at least two mounted flat Teams,
  expands Member overrides, opens only one Team, edits its Team workspace/model
  and one exact Agent field, collapses/reopens, then launches.
- **Primary spine:** `admitted AgentOrg detail -> AgentOrgRunConfigPanel ->
  agentOrgRunConfigStore root/team/agent sparse draft ->
  projectEditableAgentOrgRunFormModel -> MemberOverridesDisclosure ->
  TeamMemberConfigTree -> TeamScopeConfigEditor -> MemberOverrideItem -> typed
  exact-address edit events -> Org store -> toAgentOrgRunLaunchInput -> existing
  createAgentOrgRun GraphQL -> AgentOrgRunService ->
  CollaborationLaunchConfigurationResolver -> full unfocused activation`.
- **Return/event spine:** each typed edit/reset updates only its exact Org map;
  pure reprojection returns Team `Inherited`/`Customized` or mounted-Team Agent
  `Inherited`/`Overridden` state while disclosure changes visibility only; the
  direct Org Agent row retains its existing approved behavior.
  Launch failure retains the
  complete draft with scoped errors; success returns the existing Org run ID.
- **Owners:** `agentOrgRunConfigStore` owns the draft and exact sparse maps; the
  pure projector owns only complete fixed-depth presentation correlation;
  `MemberOverridesDisclosure` and Team form components own established visual,
  responsive, accessible disclosure/edit behavior; the Org command adapter owns
  existing payload mapping; the server resolver alone owns effective settings.
- **State checks:** `N` counts direct and Team-mounted configurable Agents only;
  all Team rows start independently collapsed; Team state reads only its Team
  patch; Agent state reads only its exact Agent patch; coordinator appears only
  on the exact coordinator Agent row; Team reset preserves child Agent patches;
  `v-show`/store ownership preserves values across collapse/reopen; sibling and
  direct-Agent state stays unchanged.
- **Boundary check:** the Org path imports the Team presentation/view-model
  components but not `teamRunConfigStore`, Team launch payload, Team root
  lifecycle, or writable Team definition. Shared components accept props and
  emit commands; they never query either subject store.
- **Failure check:** a missing Team definition, duplicate address, missing
  member/coordinator correlation, invalid field, or workspace failure produces
  an exact blocking diagnostic and disables Run. No `flatMap` omission, empty
  synthetic Team, browser repair, partial launch view, or client-authoritative
  effective configuration is permitted.
- **Rejected shortcuts:** badge-only patch over the old hierarchy; copied Org
  Team editor; always-expanded Team children; implicit inherited state;
  fabricated Team-as-Agent row; generic Team/Org config store; Team payload reuse;
  nested configured Team; Product prototype mock service import.
- **Regression evidence required:** TeamRunConfigForm still renders/behaves as
  origin/personal; direct Org Agent row remains compact; existing GraphQL fields
  including Team `workspaceRootPath` serialize exactly; desktop and `390x844`
  production captures match VIS-OVR-001-006.
- **Outcome:** the user sees the established AgentTeam launch hierarchy while
  the AgentOrg remains coordinator-free and independently owned beneath the UI.
- **Result:** Pass.

### VAL-031 — One Effective Runtime/Model/Model-Config Result

- **Trigger:** in a fresh AgentOrg draft whose root uses Codex App Server,
  GPT-5.6-Sol and `{reasoning_effort:'low'}`, the user changes exact `/lead` to
  AutoByteus and DeepSeek Flash without editing model-specific configuration,
  then launches. Repeat at the complete Org root, a mounted Team scope, and a
  Team Agent scope.
- **Primary spine:** `MemberOverrideItem typed edit -> exact Org store command ->
  canonicalizeAgentOrgPlacementLaunchPatch -> canonical Team/Agent map ->
  projectEditableAgentOrgRunFormModel preview/validation ->
  toAgentOrgRunLaunchInput -> existing GraphQL input ->
  CollaborationLaunchConfigurationResolver root->Team->Agent merge ->
  AgentOrgRunService complete validation -> Org activation -> exact Org V1
  placement configuration`.
- **Bounded spine:** canonicalization preserves every owned field. If runtime or
  model is owned and `llmConfig` is absent, it adds owned `llmConfig:null`.
  Ordinary patches with no runtime/model/config remain sparse and inherit.
  Reset deletes the exact patch and restores inheritance. The root is complete,
  not sparse: RuntimeModelConfigFields events call explicit Org-store root
  commands, a runtime/model change coherently clears root config, and root launch
  serialization always owns `llmConfig` including null.
- **Return/event spine:** invalid catalog selection or server validation returns
  to the exact field and retains the canonical draft. Successful create returns
  one Org run ID; the strict snapshot projects the same effective placement as
  the browser showed. No partial root is activated.
- **Owners:** Org store/command boundary owns canonical client intent; the form
  projector owns only preview; GraphQL transports exact fields; server resolver
  independently owns authoritative effective resolution; AgentOrgRun owns the
  stored snapshot. The panel never mutates root refs directly, and no shared
  presentation component or server infers intent.
- **Equality matrix:** inherited; explicit non-null config; explicit null;
  runtime-only; model-only; runtime+model; Team then Agent precedence;
  reset-to-inherit; incompatible model/config rejection; workspace and tool-
  approval fields. Each fixture asserts projected value = request semantics =
  server result = stored snapshot.
- **Failure check:** if any client projection/request comparison disagrees, the
  command fails before GraphQL with an invariant diagnostic. It must not drop
  null, copy a parent provider config, guess a replacement schema, or silently
  rely on server rejection.
- **Rejected shortcuts:** changing server omission semantics; serializing a fully
  resolved client-owned plan; parallel raw and canonical patch maps; fixing only
  the one DeepSeek model; modifying `MemberOverrideItem` with Org-specific wire
  knowledge.
- **Outcome:** the requested AutoByteus/DeepSeek placement carries
  `llmConfig:null`, launches when otherwise valid, and persists exactly what was
  previewed. Standalone Team behavior and the public API remain unchanged.
- **Result:** Pass.

### VAL-032 — Route-Stable Unified Workspace And History

- **Trigger:** the left Workspaces tree already contains Agent and standalone
  Team history plus AgentOrg rows. The user opens the AgentOrg catalog/detail,
  clicks Run, edits configuration, launches, focuses a direct Agent and mounted
  Team, switches subjects, stops the Org, and reopens historical state.
- **Primary spine:** `strict Agent/Team/Org histories + active contexts -> tagged
  mixed workspace-history projector -> ordered workspace/category model -> one
  always-mounted WorkspaceAgentRunsTreePanel ->
  WorkspaceHistoryWorkspaceSection/Org row tree -> typed
  WorkspaceHistorySubjectActions -> exact Agent/Team/Org store/service`.
- **Read-boundary spine:** `existing ListWorkspaceRunHistory -> Agent/Team slice`
  plus `existing ListCollaborationRootHistory -> explicit agent_org filter ->
  strict Org-tree parse -> Org slice` -> per-family atomic commit -> one mixed
  projection. The collaboration query's Team branch is deliberately ignored so
  standalone Team roots appear once.
- **Return/event spine:** history/status/context updates merge one tagged row into
  the same model; the existing panel reacts without remounting. Center route and
  exact Org focus change independently. Subject-scoped refresh failure retains
  already committed rows and exposes an error rather than replacing the panel.
- **Owners:** mixed read model owns query loading, strict decoding,
  family-scoped slices/errors, stable row keys, grouping, and category/row order.
  The exactly-once `useWorkspaceHistoryTreeState` instance created by the
  always-mounted panel owns expansion, ancestor reveal, and selected-row
  highlight continuity; the panel's persistent scroll container owns scroll
  position. The existing selection store owns selected subject identity and is
  only an input to the tree controller. `AgentOrgExecutionContext` owns active
  Org topology/focus/stream; subject stores own lifecycle commands; router owns
  center route only.
- **State checks:** all existing categories/rows remain; `Teams` still contains
  only standalone Team roots; `Org` appears directly below `Teams` and
  contains Org roots; mounted Teams stay Org children; exact Agent status and
  Team aggregate status remain; expansion, selection and scroll survive route
  transitions unless the user changes them. Org paths join the exact normalized
  Workspace projection; a catalog-missing path remains history-visible and a
  legacy/null path remains in the localized read-only `No Workspace` group. An
  Org-only workspace is non-empty and still renders `Org` at the sibling
  position immediately after the Teams position.
- **Owner-separation check:** replacing a successful history family slice with
  new row objects carrying the same stable keys changes data but does not reset
  expanded/revealed/highlighted keys or panel scroll. A user selection command
  changes the existing selected-identity authority; the panel controller reacts
  by revealing/highlighting that key without becoming the identity owner. A
  center-route change touches neither boundary, and no second controller is
  constructed.
- **Lifecycle check:** Org open/select, restore, and stop act only on the exact Org
  root through the Org command store. After success, the action caller asks the
  unified history owner to refresh; the Org command store has no `history`,
  `historyError`, `fetchHistory`, or internal history mutation. Team actions
  remain on standalone Team roots. No Org archive/delete action is invented;
  mounted Teams and focused members have no root lifecycle action.
- **Boundary check:** `AppLeftPanel` imports/mounts one history panel and has no
  route-kind predicate. `runHistoryStore`/the projector expose stable-keyed data
  and own no expansion/reveal/highlight/scroll state. The panel creates one
  tree-state controller and never recreates it for center-route changes. The
  unified row renderer receives projections/actions, not all concrete subject
  stores. No read model duplicates Org events, focus or runtime state.
- **Rejected shortcuts:** hide/show two panels; keep AgentOrgRunHistoryPanel as a
  fallback; key the panel by route; place Orgs under Teams; register mounted
  Teams as roots; ingest the collaboration-history Team branch beside the
  Workspace Team slice; keep an Org-store history cache; cast `org` JSON without
  strict parsing; drop a null/catalog-missing Workspace row; invent a Workspace
  path; infer subject kind from payload shape or ID.
- **Outcome:** entering or running an AgentOrg changes the center surface only;
  earlier runs never appear to disappear and all roots remain truthfully
  categorized.
- **Result:** Pass.

### VAL-033 — Fresh Root Workspace Default And Exact Inheritance

- **Trigger:** an available workspace catalog contains the actual
  `Temp Workspace (Default)` record and the user opens a fresh AgentOrg draft
  without any prior workspace interaction. The user then expands a mounted Team,
  optionally chooses an exact Team workspace override, collapses/reopens, and
  launches with no recipient focus.
- **Primary spine:** `shared workspace catalog load -> existing root-only default
  selector policy -> actual default record -> AgentOrg root draft -> pure root->
  Team->Agent form projection -> exact optional Team workspace patch -> existing
  createAgentOrgRun workspaceRootPath fields -> server workspace validation ->
  full Org activation with focus=null`.
- **Bounded spine:** selection runs once only for a fresh untouched root. Team and
  Agent editors keep independent auto-default disabled. Their displayed baseline
  comes from the root, with a supported exact Team override applying to that
  Team branch. Explicit existing/new root choice marks the root source explicit,
  wins, and remains store-owned. Freshness is one new-launch draft epoch, not
  definition-ID inequality; re-render/retry/error stays in-epoch, while clicking
  Run again for the same definition after a completed launch starts a new epoch.
- **Owners:** workspace store/catalog owns available records; shared selector
  policy owns eligibility; Org config store owns root/Team draft choices; form
  projector owns inherited display; server validates paths; focus controller
  remains separate and null.
- **Failure check:** if catalog loading fails or no eligible Temp default exists,
  root stays unset, the existing actionable error is visible, and Run remains
  disabled. No label/path is synthesized and no descendant silently selects a
  different workspace. An unavailable Team override remains exact/errorful; it
  does not fall back to root or mutate siblings.
- **Continuity check:** expanding/collapsing Team controls and moving between
  center states preserves explicit draft selection while the always-mounted left
  Workspace/history state is unaffected. A same-definition new launch resets to
  untouched and reapplies the actual available default; a validation failure does
  not reset or overwrite the current explicit selection.
- **Rejected shortcuts:** hard-coded `/tmp` path; name-only selection without an
  available record; Org-specific workspace list; mounted-Team default selection;
  workspace selection as recipient focus; definition mutation.
- **Outcome:** fresh Org configuration behaves like the established Team root,
  inherited Team workspace is non-empty when the default exists, exact override
  is respected, and launch remains unfocused.
- **Result:** Pass.


### VAL-034 — Direct Configured Agent First Accepted Summary And Live Projection

- **Trigger:** an active AgentOrg is focused on a direct configured Agent and the
  user submits an external message whose collapsed/trimmed text is non-empty.
- **Primary spine:** `accepted Agent composer -> AgentOrgStreamingService
  SEND_MESSAGE -> AgentOrgStreamHandler -> AgentOrgRun unchanged exact command with indexed-kind outcome ->
  exact AgentRun accepted with kind configured -> AgentOrgRunService.recordRunActivity -> serialized
  AgentOrgRunHistoryCatalogService -> shared AgentOrgRunHistorySummaryWriter
  first write -> atomic current index -> accepted
  ACK -> injected callback -> newest-generation strict Org history query ->
  existing Org row`.
- **Normalization check:** inputs with internal newlines/tabs/multiple spaces are
  collapsed and trimmed by the exported Team helper; <=100 characters stay
  exact and >100 uses the first 97 plus `...`. Empty compacted content performs
  no history write.
- **Owners:** AgentOrgRun owns exact command admission and returns indexed kind/liveness outcome; handler
  owns external-command/result ordering; service is a narrow facade; catalog
  owns normal-runtime serialization/current rows; shared writer owns compaction/
  first-write/atomic reread; mixed web history owner owns the
  authoritative slice; row/tree-state components own presentation only.
- **Boundary/dependency check:** production composition injects the supervisor's
  existing AgentOrgRunService into the handler. The startup migration invokes
  the stateless shared writer before supervisor construction, while normal
  runtime injects it into the single catalog. No second manager/catalog, no
  stream DTO field, no optimistic submitted-text mutation, and no tree/sidecar
  write exists.
- **Failure check:** rejected/failed Agent command never reaches history. A
  derived-index operational failure after Agent acceptance does not replay or
  relabel the Agent input; it is reported through existing observability. A web
  refresh failure retains the previous family slice and error state.
- **Outcome:** after durable commit the same mounted left history row shows the
  exact normalized first prompt without navigation/reload no later than the
  first authoritative post-acceptance history result.
- **Result:** Pass.

### VAL-035 — Mounted Configured Agent Symmetry And Exclusion Boundary

- **Trigger:** first send targets an Agent hosted by one directly mounted flat
  Team; control cases target a task Agent or introduce task/system/inter-Agent,
  approval, interrupt, rejected, failed, or compacted-empty traffic first.
- **Primary spine:** mounted target resolves through the Org execution index as
  `executionKind:'configured'`, then follows the same DS-027 root history path as
  a direct Agent. Exact mounted ancestry affects Agent execution/memory only; it
  does not select Team history.
- **Bounded exclusion spine:** task Agent has `executionKind:'task'` or
  `task_team_member`; its SEND_MESSAGE follows unchanged command admission and may
  be accepted, but the returned non-configured kind suppresses only the history
  mutation. Other input/command classes never enter the handler's accepted
  external SEND_MESSAGE summary branch. A later qualifying configured external
  send remains eligible.
- **Owners:** the strict Org execution index supplies the kind fact; it does not
  infer from address depth. Agent communication/task engines cannot call the Org
  summary catalog. The Org catalog row is the only mutation target.
- **Rejected shortcuts:** treating any live `getAgent` result as configured; rejecting task sends merely to filter history; using current focus;
  parsing `/team/agent`; scanning Team memory; updating standalone Team history;
  considering inter-Agent message records or task notifications.
- **Outcome:** direct and mounted configured members behave identically, while
  every approved exclusion leaves the Org row empty/stable as appropriate.
- **Result:** Pass.

### VAL-036 — First-Write Concurrency, Restart Stability, And Stale Web Reads

- **Trigger:** two qualifying messages to different configured members are in
  flight, their Agent command results complete in a controlled order, a prior
  full history request is also in flight, and later traffic/stop/restore/rebuild
  occurs.
- **Primary spine:** each accepted-result continuation enqueues
  `recordRunSummary` immediately before another await. The existing catalog
  queue serializes normal-runtime mutations and invokes the shared summary
  writer; first non-empty current row wins and the second is a no-op. Reversing
  controlled result resolution reverses the expected winner.
- **Return spine:** accepted ACK callbacks start AgentOrg-family refreshes with a
  shared monotonic generation. Only the latest initiated successful response
  commits, so an older pre-write response cannot overwrite the newer slice.
  Neither response computes a winner.
- **Persistence check:** stop/restore/rebuild project the existing non-empty
  summary unchanged. Restart reads that same strict index. Later external or
  internal traffic never replaces it.
- **Owners/dependencies:** live accepted completion ordering belongs to the
  handler plus catalog queue; durable value belongs to the Org history catalog;
  physical compare/write belongs to the stateless shared writer; request ordering
  belongs to the web history read owner. No shared root FIFO,
  trace timestamp, socket-arrival time, address order, lock file, or client
  arbitration is introduced.
- **Failure check:** failed refresh retains last committed slice. Unsupported
  storage failure uses existing observability/restart behavior and never causes
  Agent input replay.
- **Outcome:** one deterministic first accepted completion becomes the durable
  stable title and stale reads cannot regress its live presentation.
- **Result:** Pass.

### VAL-037 — Deterministic Existing-Row Recovery

- **Trigger:** the registered startup runner reaches an existing current
  AgentOrg history row after AgentOrg-family and both raw-trace-layout
  prerequisites. Cases include a pre-existing non-empty summary, one unique
  earliest direct or mounted configured-member trace, no evidence, an equal
  earliest tie, invalid/unreadable required candidate evidence, and a repeated
  startup after interruption.
- **Primary migration spine:** `strict current Org catalog row -> if empty,
  strict V1 tree -> configured nodes only -> AgentMemoryLayout exact direct/
  mounted paths -> complete archived+active trace corpora + root communication/
  task exclusion evidence -> migration-only provenance validation -> one strictly
  earliest qualified timestamp -> shared summary writer before supervisor/runtime
  catalog construction -> strict reread`.
- **Candidate check:** requires object `trace_type:'user'`,
  `source_event:'AgentRun.postUserMessage'`, non-empty compacted string content,
  and finite timestamp, plus a complete causal prefix. Root communication/task
  records are consulted only to exclude their deterministic nonqualifying input
  envelopes and finite creation/transition timestamps; the candidate must be
  strictly earlier than every sidecar fact capable of configured-Agent delivery
  and not exactly match an internal envelope for that recipient. Sidecars can
  never establish a positive external-message candidate. A matching, earlier/
  equal, incomplete, or otherwise ambiguous nonqualifying fact skips the row
  rather than promoting a later trace. Task nodes/directories are never
  enumerated. Tie-break or origin inference by path/address/file order/run ID/
  content/prose is forbidden.
- **Disposition check:** existing non-empty is skipped before trace read. Unique
  evidence writes once through the same physical primitive used by the normal
  catalog. No/tied/invalid evidence records
  `SKIPPED_NO_UNIQUE_QUALIFYING_TRACE`, leaves empty summary/fallback, and yields
  bounded `SUCCEEDED_WITH_WARNINGS` for
  `20260905_agent_org_history_first_message_summary_v1`. Required current
  package/index read or validation failure, or selected-value atomic
  write/strict-reread failure, is runner `FAILED` / `RESTART_TO_RETRY` and takes
  precedence over any warning skip. If there is no failed item, the summary
  migration is `SUCCEEDED_WITH_WARNINGS` when at least one warning skip exists
  and otherwise `SUCCEEDED`.
- **Migration-ownership check:**
  `20260901_agent_org_flat_team_families_v1` retains its separate terminal
  matrix: unsupported in-scope source, invalid target/current structure, family
  conflict, or required retired-authority cleanup failure is `FAILED`; with no
  failed item it is `SUCCEEDED`; it has no `SUCCEEDED_WITH_WARNINGS`
  disposition. The summary migration's independently valid nullable-metadata
  warning cannot weaken that family migration, and the family migration's
  cleanup rule cannot turn an ambiguous-but-valid empty summary into failure.
- **Restart/retention check:** a successful write becomes an ordinary non-empty
  skip; an interrupted attempt is reclassified and retried by the existing
  runner. Diagnostics contain reason counts and capped IDs/paths, never message
  content. The retained migration/classifier is never imported by current
  runtime or web reads.
- **Rejected shortcuts:** trace-on-read/lazy backfill; normal dual writer;
  directory scan; task/inter-Agent message inference; custom journal/backup;
  fabricated earliest tie; rewrite of Team rows or current non-empty values.
- **Outcome:** only provable historical evidence upgrades the derived row; all
  other valid current rows retain their stable value or approved fallback.
- **Result:** Pass.


### VAL-038 — Direct Org Receiver Event And Owning-Root Perspectives

- **Trigger:** configured `/lead` sends an ordinary accepted message with
  references to `/verifier` through the supported tool.
- **Spine:** exact sender -> existing delivery/authorization -> root engine
  reservation -> single Org durable commit -> root communication -> exact
  receiver input -> release -> context -> sender/receiver Messages views.
- **Owners:** root engine records; Org adapter sequences durability; AgentOrgRun
  resolves both committed IDs and publishes; Org context projects the sole
  sidecar; shared component only renders. No eligibility-by-kind remains.
- **Invariant:** one receiver item with recorded time/correlation/reference
  context, one sent/received perspective each; unrelated focus gets no row.
  Failure before durable acceptance creates neither. Post-commit publication
  error uses existing recovery, never replay/rollback or browser synthesis.
- **Result:** design walkthrough Pass; executable evidence still required.

### VAL-039 — Cross-Placement Identity And References

- **Trigger:** direct↔mounted and mounted↔mounted configured sends, colliding
  basename labels, and exact-ID task counterparts.
- **Spine:** retained root view/index -> exact selected participant -> root
  message record -> exact counterpart/direction/reference path -> shared UI;
  accepted receiver event separately reaches only its exact AgentContext.
- **Owners:** Org index resolves full run/host/task identity; facets own pure
  projections. Team view supplies genuine roster/header, not message/task scope.
- **Checks:** never drop a task or cross-Team counterpart; never use a basename,
  source definition or collapsed rows as identity. References remain Org-owned.
  Settled counterpart remains resolvable; invalid current correlation is explicit
  unavailable/reopen, not `Unknown` or fabricated configured identity.
- **Result:** design walkthrough Pass; required browser coverage remains open.

### VAL-040 — Every Admitted Endpoint Direction, Recovery And Negative Paths

- **Trigger:** accepted exact-run-ID ordinary messages in all four combinations.
  Each task slot is tested as a task Agent and as a member of a fresh task Team.

  | Sender | Receiver | Durable ordinary record/root event | Receiver input | Messages perspective |
  | --- | --- | --- | --- | --- |
  | configured | configured | Exactly one | Exactly one | Selected sender/receiver |
  | configured | task | Exactly one | Exactly one | Selected sender/receiver |
  | task | configured | Exactly one | Exactly one | Selected sender/receiver |
  | task | task | Exactly one | Exactly one | Selected sender/receiver |

- **Spine:** unchanged root authorization/reservation -> record/root publication
  -> AgentOrgRun exact-ID resolution -> receiver event -> selected AgentContext;
  strict snapshot + sequenced updates -> Messages perspective.
- **Owner check:** root resolves identities, adapter remains kind-blind; web
  reads retained exact identity, not its own permission matrix. API assertions
  previously demanding task absence are superseded by RER-028, not relabeled
  as historical failures.
- **Recovery:** reconnect hydrates one correlated candidate; replay sequence/
  message identity prevents duplicates. Stop/Restore preserves sidecar rows and
  truthful provider history; no history filter suppresses task input (AAV-001).
- **Negative paths:** test existing rejects (self/out-of-root, unsupported
  logical task selector, reservation conflict, pre-durable failure). None yields
  accepted input/row. An authorized exact-ID task return is NOT a negative case.
  Preserve command errors, authorization, reference resolution and ACK meaning.
- **Presentation:** shared Team/Org Messages and participant Tasks appear in
  desktop right tool and narrow drawer. No synthetic Org dashboard or Team root.
- **Result:** design walkthrough Pass; deterministic/provider/browser tests
  must establish the expanded matrix before any new cumulative pass.

### VAL-041 — Direct Org Delegator Sees Its Task Agent And Fresh Task Team

- **Authority/trigger:** REQ-035 / AC-030 / SCN-019. Direct Org Agent A delegates
  to configured Team T and separately to configured Agent B using existing tools.
- **Primary spine:** A -> root capability -> exact host resolution -> existing
  task engine/prepared execution -> fresh task Team T1 or task Agent B1 -> task
  tree/record commit -> activation event -> initial work release.
- **Read/return spine:** checkpoint includes committed new nodes/records -> Org
  context candidate + exact view index -> A's Tasks facet -> accepted shared
  task section/count/list/detail. Live submission/review events update the same
  record; newly relevant task opens by the existing interaction rule.
- **Identity/relevance:** A, B1 and each Agent member of T1 see their relevant
  task. B, T's configured coordinator, unrelated root members, and another fresh
  Team of the same source do not become participants by source identity alone.
  A requires no TeamWorkspaceContextView or selecting T. T1 is attached to A's
  exact host, never installed as configured membership or standalone root.
- **Boundary/dependency:** shared section receives `CollaborationTasksContextView`
  only; no sidecar/store access. Team adapter uses the same facet over its own
  existing selector. One Org task sidecar remains authority.
- **Outcome:** delegator/assignee workflow looks like established Team; actual
  Team/Org ownership remains different. Result: design walkthrough Pass.

### VAL-042 — Same-Address Tasks, Exact Navigation And Task-Origin Delegation

- **Authority/trigger:** SCN-018–019. Create T1 and T2 from the same configured T;
  both contain Agent source `/research/analyst`, with distinct AgentRun IDs M1/M2.
  Select M1/M2 from active task rows or Tasks participant links. Let M1 perform a
  supported delegation through its existing task host.
- **Spine:** exact clicked AgentRun (or taskTeam row -> exact fresh coordinator)
  -> root-tagged router/action -> Org selection union -> retained index -> exact
  AgentContext/actual binding/Team roster -> shared workspace + read facets.
- **Return:** activation topology triggers checkpoint before dependent events;
  one context/index swap publishes new relevance and selection. Reconnect/pending
  navigation preserves exact ID, not just address. No intermediate candidate is
  visible with old identity and new task records.
- **Checks:** configured source, M1 and M2 never share conversation, provider ID,
  composer target or selected state. Configured Team focus still selects its
  configured coordinator; taskTeam focus selects its fresh task coordinator.
  M1 sees assignments it actually delegates; independently delegated descendant
  tasks do not make all ancestors/siblings participants. Enumerating assigned
  Team participants follows members, not descendant taskExecutions.
- **Failure check:** invalid exact identity gives unavailable/unfocused state,
  no source/first-member fallback. Active commands still use existing exact-ID
  route; read-only targets cannot invoke it. Result: design walkthrough Pass.

### VAL-043 — Submission/Review Record Is Not A Notification Receipt

- **Authority/trigger:** REQ-036 / AC-031 / SCN-020. Task Agent or fresh Team
  coordinator submits; authorized delegator requests revision/accepts. Cover
  initial work and each genuinely emitted task-system notification.
- **Spine:** tool -> existing task engine record commit -> task event/Tasks view
  -> separate exact recipient system input -> AgentRun accepted result -> shared
  handle/adaptation -> one existing SYSTEM_TASK_NOTIFICATION in conversation.
- **Owners:** task engine owns saved submission/review and warning; AgentRun owns
  admission; existing task input builders mark provenance/suppression before post;
  presentation adapter emits once only on accepted result; Tasks facet never
  synthesizes input. Ordinary `send_message_to` instead follows DS-028 and its
  sidecar—these are different paths.
- **Truth matrix:**

  | Task record | Notification result | Tasks | Conversation | Messages |
  | --- | --- | --- | --- | --- |
  | Committed | Accepted | Saved submission/review | One actual system input | No fabricated row |
  | Committed | Rejected/failed | Saved record + existing warning | No fabricated input | No fabricated row |
  | Not committed | No notify attempted | No new saved result | No new input | No row |

- **Duplicate/provenance check:** exactly one accepted-input adapter result, not
  both member input and system notification; use existing backend suppression.
  Verify AutoByteus and provider-backed runtimes. Separate accepted notifications
  with identical text remain separate: do not content-dedupe them. Reference
  files in Tasks come from saved records; conversation only shows references
  actually carried with input. No task text parsing to invent provenance.
- **Result:** design walkthrough Pass; accepted/rejected/duplicate integration
  coverage remains required. No task retry/outbox/record schema is introduced.

### VAL-044 — Settlement Retains Exact History Without Reactivation

- **Authority/trigger:** task completes/settles normally; inspect original Agent,
  settled task details and participant history before/after stopping and restoring
  root. The configured definition may subsequently change or become unavailable.
- **Live return spine:** task settlement event -> retained tree marks settledAt
  -> exact statuses/active rows retire -> context keeps task/participant identity
  and original Agent's accepted input; if task selected it becomes readonly.
- **Historical spine:** task detail/exact history action -> Org service inspection
  -> manager existing per-root transition boundary -> active coherent snapshot
  OR inactive strict tree/tasks/messages reads -> existing view projector/decoder
  -> same context historical candidate -> exact member projection -> shared UI.
- **Identity:** actual task node gives run/platform IDs and physical ancestors;
  captured configured source gives launch/definition only. Missing actual
  platform binding remains nullable; exact task liveness, not live-root status,
  selects retained projection. Inactive read preserves stored task statuses
  without repair or fabricated completion. Current definition,
  configured provider binding and placeholder `task-execution` are forbidden.
  Same-address T1/T2 histories remain separate; counterpart task messages and
  submissions/reviews remain available even if active rows are gone.
- **Read invariants:** manager serializes inspection and existing terminate on
  its existing transition boundary; no nested lock or task FIFO change. Inactive
  read never calls materialize/loadAndRepair/restore. View projector accepts an
  explicit snapshot without constructing a live root. Inactive sequence zero is
  not a resume cursor. No runtime starts and no active/task membership appears.
- **Presentation capability:** readonly target lacks interaction; shared controls
  narrow `access` before use. Explicit Org Restore is the sole reactivation path
  and does not resurrect settled task executions. Missing/corrupt projection is
  unavailable/error, not empty or inferred history. Older genuine provider input
  without structured sender provenance stays retained input, not fabricated
  external-human attribution or undelivered task result.
- **Outcome:** original Agent retains accepted task messages/results and Tasks;
  settled participant history remains inspectable. Result: design walkthrough Pass.

### VAL-045 — Shared Team UI, Responsive Parity And Authority Boundaries

- **Authority/trigger:** replay delegation/message/submission/review/settlement
  with direct Org, mounted-Team and task selections; compare standalone Team
  control at desktop and narrow drawer widths.
- **Spine:** Team adapter or Org exact context -> independent Messages/Tasks read
  facets -> shared CollaborationOverviewPanel + delegated task section/detail/
  reference navigation + established Agent/Team workspace event monitor/header.
- **Checks:** correct relevant count/empty state, newly relevant disclosure,
  sender/receiver identity/direction, Task header provenance, references,
  keyboard labels and same panel/drawer composition. Selecting another exact
  participant resets only its local task-detail selection; root history scroll/
  expansion stays at DS-025 owner. Task/communication updates render without
  refocus through one shallow-reactive context publication boundary.
- **Boundary audit:** no Team wrapper for direct Org/task Agent, no Team ID
  carrying Org identity in shared task row, no Team-local root task filter,
  duplicated types/store, active-only history fallback, kind exclusion, provider
  binding from a configured source, independent mounted-Team action or new task
  command. Unrelated member sees neither another pair's Messages nor irrelevant
  Tasks. Initial launch stays unfocused and configured Teams stay flat.
- **Result:** design walkthrough Pass. This is an implementation/review checklist,
  not a rendered comparison or new source/API/E2E pass.


### VAL-046 — Fresh Field-Free Team/Org Authoring And Roundtrip

- Basis: Supported Normal Scenario, SCN-021 / REQ-026 / AC-021/032.
- Actor/goal: package author or existing form user creates a Team/Org without
  having to know an internal version, then saves, reloads and imports the package.
- Primary: authored file/form → existing subject service → current family codec
  plus complete semantic validation → provider transaction → canonical files →
  registered package/current admission → catalog and launch configuration.
- Return: existing serializer outputs the exact keys; copy/export/reimport uses
  the same current shape, not a second schema-version injector. Root registration
  alone is not proof of individual definition admission.
- Owner/dependencies: DefinitionService owns subject validation, provider owns
  bytes/revision, admission owns source/dependency availability. UI/GitHub installer
  may not normalize or import a migration decoder. Org-owned index and built-in
  bundle provider must move to the same current family codecs.
- Check: both family saves omit schemaVersion; Team member refType is absent,
  Org refType retained, coordinator only on Team. Defaults/null presence,
  instructions, IDs, handoffs/order and refs roundtrip unchanged. Opening fields
  or saving defaults does not reinsert version. No runtime files involved.
- Negative: schemaVersion of any value, unrelated missing required field, Team
  refType, recursive/family-mismatched input fail normally; no silent stripping.
- Result: Pass (design); actual production serializer/provider/roundtrip tests
  and rendered existing authoring paths remain downstream obligations.

### VAL-047 — Already-Upgraded Owned Definitions And Current No-Op Cohort

- Basis: Supported operational upgrade, SCN-022 / AC-033. Both inspected database
  snapshots already mark 20260901 SUCCEEDED; source can hold prior versioned
  targets, so changing only that earlier implementation cannot perform the delta.
- Primary: ordinary startup → runPending skips completed family migration →
  new 20260911 definition inventory → migration-only exact prior validator →
  atomic single-config replacement/reread → strict current admission/new work.
- Bounded local: one file at a time; compare every non-version JSON value;
  current field-free source validates/skips with no write. Derived definition
  content hash may change, but opaque ID/refs/Markdown/assets remain.
- Ownership: new registered definition migration is sole transition writer;
  AtomicRunPackageFileCommitWriter owns atomic commit mechanics, not schema.
- Check: versioned Team and Org both convert; field-free configs have unchanged
  bytes/mtime; all execution-tree/task/message/history snapshots retain hashes
  and versions; successful old migration records are not reset/replayed.
- Result: Pass (design). Real disposable file/runner integration with completed
  prior records must prove the new migration still executes and succeeds.

### VAL-048 — Skip-Version Upgrade, Retry And Independent Migration Status

- Basis: supported earlier release → current startup and ordinary restart,
  SCN-004/022; existing runner/prerequisite and migration conventions.
- Primary: startup → pending 20260901 legacy definition/family transform →
  preserved historical versioned intermediate → new definition-only pass →
  final field-free codec/admission; earlier runtime conversion stays unchanged.
- Re-entry: a retry sees already terminal field-free roots/owned Teams and skips
  inside the old migration; no version reinsertion. Existing prospective target
  comparisons accept only equal validated non-version values. New pass skips
  committed current files and retries unfinished source through normal runner.
- Ownership: old migration alone understands refType/depth/family conversion;
  shared historical numeric validator is migration-only. New pass knows exact
  prior numeric/current definitions, not recursive Team interpretation.
- Independence: registry order is required, not a runtime-success prerequisite.
  An unrelated old runtime failure does not stop valid definition conversion.
  Any incomplete/unsupported definition or pending family residue in the new
  inventory is FAILED, source intact; a complete definition inventory can
  succeed independently of failed unrelated runtime. No false warning status.
- Check: completed/pending/failed prior states; earlier/current/prior-numeric
  definitions; single retry/idempotence sequence; unchanged summary warning
  policy. Do not manually reset prior records or rerun old runtime for authoring.
- Result: Pass (design); reject per-poweroff/kill branches, timeout/repair
  machinery, normal dual parsers and arbitrary corruption scenarios.

### VAL-049 — Owned Child Inventory, External Boundaries And Admission Diagnostics

- Basis: registered owned/external packages at ordinary cutover, AC-022/033,
  ORG-CASE-049–055/062–063. Version-bearing Org parents currently prevent the
  normal Org-owned source index from enumerating their Teams.
- Primary: startup → migration's physical known data-root inventory → Org plus
  one owned-Team level → strict per-file transform → normal Org-owned identity
  index/Team dependencies → current catalog and exact unavailable diagnostics.
- Check: owned Team is visited even when parent's prior version is not normally
  decodable; existing unreferenced owned child configs are included; deduplicate
  canonical paths. Existing authoring journals resolve through their established
  read/recovery owner before conversion, never as new definitions. No new journal
  or artifact recovery protocol. Root scan/read errors are not empty success.
- External: local linked/GitHub-managed external roots remain unchanged even if
  physically writable. Version-bearing or old-refType external Team is unavailable;
  dependent Org is unavailable, compatible siblings/history stay usable. Missing
  external refs do not falsify independently completed format conversion.
- Repository: the two built-in Team files are changed in source/build only;
  runtime startup does not write installed application packages.
- Return: current-family/path/ID/reason/action diagnostics, with no expected
  numeric version or instruction to add it. Same GraphQL diagnostic owner.
- Result: Pass (design); tests must hash external roots, use a versioned Org
  parent/owned child fixture, and assert per-definition—not global—availability.

### VAL-050 — Source Cut, Failure Truth And No Runtime/Presentation Expansion

- Basis: AC-032/033 and existing forward-only startup contract, RER-029 only.
- Primary: reviewed code/config change → current codec/provider/bundle consumers
  and diagnostics → startup migration attempt → current per-item admission →
  independent source/API validation → fresh Delivery build/user verification.
- Check: no normal version constants, versioned aliases/exports or historical
  imports; normal requests never invoke transformation. Commit outcome and strict
  reread are necessary for success. Required source/write/inventory failure gives
  FAILED with bounded reasons; valid files remain available. Next ordinary
  startup retries failed work; Settings publishes existing restart guidance only.
- Invariants: runtime tree versions, sidecar/journal versions, physical roots,
  memory, tasks/messages, scoped UI and launch/focus stay unchanged. Existing
  retained evidence is not edited to impersonate new field-free fixtures.
- Distinct observations: DR-008 is prior RER-028 native evidence, not validation
  of this change. No new UI/prototype/transport event or runtime migration owner.
- Result: Pass (design). Independent review and production-code/file/runner and
  current-browser validations remain required before a new delivery result.


### VAL-051 — Compact Messages Without Losing Task-Origin Communication

- **Supported trigger:** user reads accepted configured/task messages and selects
  content/references live and after settlement/Restore, including same-name
  counterparts in separate fresh executions. Authority: REQ-034/036, AC-034.
- **Spine:** unchanged root communication view -> selected-participant facet ->
  compact list -> selected detail/reference -> optional identity disclosure.
- **Expected:** sender/receiver direction/name, time, content and references
  remain. No permanent address, Task badge or run suffix in the left list.
  Configured-to-task, task-to-configured and task-to-task ordinary messages stay;
  no formal task record is synthesized as a message. IDs/eligibility/count/order
  are not affected by removing markup.
- **On demand:** inspect existing exact address/AgentRun plus task/host context
  through a keyboard/touch-operable detail-header control, not hover alone.
  Default detail is closed; changing message/reference/subject closes it, while
  an update to the same selected item does not unnecessarily reset it. Two equal
  labels remain distinct rows keyed by their real message IDs. References keep
  existing IDs/content routes and do not open identity or navigate a participant.
- **Boundary/result:** same source row/facet, no API/schema/filter/history change;
  rendered checks required on Team/Org desktop/narrow. Design walkthrough Pass,
  not executable validation.

### VAL-052 — Familiar Task Detail With Exact Inline Navigation

- **Supported trigger:** read assignment, submission, revision, accept and
  interruption for task Agent and fresh task Team; inspect delegator and each
  assigned member, including settled history and repeated same-address tasks.
- **Spine:** exact selected root/task record -> existing adapter with named
  direction links/group -> shared detail -> explicit inline name action ->
  existing root-tagged inspection -> correct live/retained Agent workspace.
- **Expected:** no top participant name/ID strip. Existing heading/status/
  direction/time/Markdown and reference viewer remain. Agent names open exact
  recorded AgentRuns; task-Team name reveals only that fresh Team's participant
  links, including non-coordinator members. Assignment/review and submission
  direction references remain correctly oriented; interruption stays system text.
- **Identity:** on-demand detail is keyboard/touch accessible and uses existing
  exact metadata. No label/address-based target lookup, first-member or configured
  source fallback. Missing historical identity produces non-actionable text,
  never an invented recipient. System item inspection uses its actual task's
  assignment endpoints rather than creating a system Agent.
- **Retention/state:** settled member links remain inspectable through the
  existing read-only path; no task restart/Restore side effect. Subject/item
  change closes disclosure, live same-item updates retain content selection.
  Reference click opens only the reference, no participant navigation. Test
  standalone Team plus Org direct/mounted/task delegators on desktop/narrow.
- **Boundary/result:** pure detail emits typed links, section retains navigation,
  root facets keep data; no task policy/store/wire change. Design walkthrough Pass.

### VAL-053 — Org History Label Only

- **Supported trigger:** user with mixed Agent/Team/Org history opens config,
  runs, focuses, switches subjects, and inspects stopped history (SCN-015).
- **Spine:** same history/grouping data -> same Workspace collection renderer ->
  changed localized label -> same tree-state/selection/action behavior.
- **Expected:** exact English `Org` under `Teams` (existing uppercase styling
  may render `ORG`); localized maps stay synchronized. Existing main navigation
  `Agent Orgs`, definition/run titles, category key/order and stable tree keys
  remain. No remount, lost scroll/expansion/selection or root-kind inference.
- **Boundary/result:** localized copy only, current empty/no-workspace behavior
  and runtime unchanged; focused localization/history component test and rendered
  desktop/narrow check required. Design walkthrough Pass.


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
| Subject root shutdown | stable frozen Team/Org scope | AgentRun admission/dispatch internals or provider/MCP direct calls | Pass |
| Frozen Team/Org scope | configured-handle `fenceForRootShutdown` | AgentRun state inspection, task persistence, root registration, or mounted-Team lifecycle | Pass |
| Configured Agent root fence forwarding | `AgentRun.fenceInputAndInterruptForRootShutdown` | converting `NO_ACTIVE_TURN` to completion or duplicating admission policy | Pass |
| AgentRun root-shutdown boundary | same dispatch/input/turn owner plus existing lifecycle facts | subject root/task/store identity, timeout/replay, second queue or persisted phase | Pass |
| Global exact-Agent router | AgentRunManager + ActiveCollaborationRootDirectory | Team and Org managers together | Pass |
| Mixed projection | explicit subject query boundaries | subject stores/files plus manager | Pass |
| GeneralProcessRunSupervisor | subject managers/services | local Team/Agent handles | Pass |
| Team/Org subject callback | CollaborationAgentPresentationAdapter then subject serializer | raw AgentRun payload published directly or component formatter | Pass |
| RootExecutionViewStore | AgentOrgContextsStore / subject context boundary | duplicate Org tree/focus/events and direct Org socket command | Pass |
| AgentOrgExecutionContext | one strict root view/retained index; exact selection; Tasks/Messages facets; atomic active/history candidate | Team store/root, second cache, kind restriction, address-only task identity, delivery fabrication | Pass |
| Agent/Team workspace surface | ActiveAgentWorkspaceTarget and explicit action/view ports | subject store, GraphQL client, socket or raw event | Pass |
| Mounted Team presentation adapter | TeamWorkspaceContextView | Team lifecycle/persistence/registration/termination | Pass |
| Unified Workspace history panel | Mixed tagged read model + typed subject action port | route-selected Org panel, concrete all-subject stores, focused member lifecycle or mounted-Team stop | Pass |
| AgentOrg hierarchy row builder | AgentOrgTeamBranchStatusProjector + AgentOrgExecutionContext public selectors | visible-row scan, WebSocket/GraphQL, Team root store, definition lookup | Pass |
| AgentOrg/Team hierarchy adapters | shared fold + TeamAggregateStatusDot | duplicated precedence/localization, topology-generic status owner, TeamActivityDot substitution | Pass |
| AgentOrgRunConfigPanel | AgentOrg config store + pure Org form projector + existing Org launch adapter | Team run config store/payload, Team definition provider, server effective resolver | Pass |
| AgentOrg form projector | admitted Org/flat-Team definitions + Org draft -> closed view/diagnostic result | store write, GraphQL launch, silent omission/repair, configured recursion | Pass |
| Shared disclosure/Team config components | caller-provided view models and typed edit commands | AgentOrg/Team store lookup, patch identity, lifecycle or API serialization | Pass |
| AgentOrg config store/command | canonical AgentOrg placement patch + existing GraphQL input | parallel raw patch, local/server resolver import, hand-written field-dropping serializer | Pass |
| AgentOrg root config commands | complete root tuple with dependent config clear | panel writable-ref mutation, sparse root representation, or server inference | Pass |
| Mixed workspace-history projector | tagged subject projections -> stable-keyed ordered category model | current route, expansion/reveal/highlight/scroll, AgentOrg runtime internals, subject lifecycle, kind inference | Pass |
| Unified history read owner | existing Workspace Agent/Team query + strict AgentOrg-only collaboration-history branch | presentation state, duplicate collaboration-history Team ingestion, unchecked Org JSON cast, or AgentOrg command-store history cache | Pass |
| Always-mounted history panel/tree-state owner | one `useWorkspaceHistoryTreeState` instance + persistent scroll container, consuming stable keys and selected-identity input | history query/grouping, subject selected identity/runtime/lifecycle, or route-scoped duplicate state | Pass |
| AgentOrg command store | launch/restore/terminate result only | `history`/`historyError`/`fetchHistory`, unified read state, or store-to-store lifecycle refresh | Pass |
| Shared root workspace selector | available workspace catalog + untouched Org/Team root draft | hard-coded default, descendant auto-default, focus or definition mutation | Pass |
| AgentOrg WebSocket handler | injected `AgentOrgRunService` configured-command/activity surface | direct Org manager/history store construction or task/message owners | Pass |
| AgentOrgRun command-with-kind outcome | strict execution index + unchanged exact direct/mounted/task handle path | address-depth inference, task-send rejection for metadata filtering, current focus, history catalog or task policy | Pass |
| AgentOrgRunHistoryCatalogService | serialized normal-runtime attempts/current rows + shared writer invocation | trace inference, physical mutation duplication, Agent command admission or UI state | Pass |
| AgentOrgRunHistorySummaryWriter | shared compaction + stateless first-write/atomic strict reread | runtime queue, migration inference, manager/catalog construction or UI state | Pass |
| Web Org accepted-message callback | mixed history read action | submitted-text/optimistic summary, row mutation or tree-state reset | Pass |
| AgentOrg summary migration | strict current Org tree/location/trace/sidecar readers + shared stateless summary writer | normal runtime reader/import, manager/catalog construction, positive inference from sidecars, Team rows, task directories or alternate index | Pass |
| RootCommunicationEngine | Org-private communication adapter | AgentOrgRun/index/publisher/browser presentation internals | Pass |
| AgentOrg communication adapter | Kind-blind callback carrying the committed message's two endpoint IDs plus receiver input to the AgentOrgRun-owned classifier after durability | endpoint classification/address lookup, receiver-only gate, second record/schema, browser state, Team root or task-recipient normalization | Pass |
| AgentOrgExecutionContext | one strict root view/retained index; exact selection; Tasks/Messages facets; atomic active/history candidate | Team store/root, second cache, kind restriction, address-only task identity, delivery fabrication | Pass |
| Shared Agent/Team/right Messages surfaces | ActiveAgentWorkspaceTarget + CollaborationMessagesContextView | subject stores/sockets, Team-kind inference, lifecycle or same-Team filtering | Pass |

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
Root shutdown -> close/drain publication gate -> freeze stable full scope -> frozen scope -> configured handle -> AgentRun root fence -> task command drain -> settlement drain
AgentRun root fence -> same dispatch owner orders input claim/provider start/fence -> existing cancellation or canonical interrupt/terminal facts
AgentRun root fence -X-> root/task/store identity, timeout/replay, persisted state
Task command/settlement drain -X-> pre-fence root shutdown position
Provider backend start -X-> after completed AgentRun fence
AgentOrg config route -> AgentOrgRunConfigPanel -> agentOrgRunConfigStore + pure fixed-depth Org form projector -> shared disclosure/Team presentation -> typed Org edit commands -> existing Org launch input
AgentOrg config path -X-> teamRunConfigStore / Team launch payload / Team lifecycle / writable Team definitions
Shared disclosure/Team presentation -X-> AgentOrg or Team store lookup / effective configuration / GraphQL serialization
Org form projector -X-> silent omission / browser repair / nested configured Team / partial launchable view
AgentOrg Team/Agent edit -> canonical patch -> one Org store map -> form projection + existing launch input -> independent server resolution -> strict snapshot
Canonical patch -X-> catalog/server/store side effects / parallel raw representation
Tagged subject history/context rows -> mixed workspace projector -> stable WorkspaceAgentRunsTreePanel -> typed subject actions -> exact subject store
AppLeftPanel/router -X-> root-kind-selected history component / duplicate Org history owner
Workspace catalog -> root-only default selection -> Org root draft -> descendant inherited projection
Descendant workspace editor -X-> independent default discovery / focus / hard-coded path
AgentOrg external SEND_MESSAGE -> unchanged exact command-with-kind boundary -> accepted configured result -> Org history service/catalog -> atomic current index
Accepted Org SEND_MESSAGE ACK -> injected callback -> mixed history read owner -> strict AgentOrg slice -> existing row
Registered Org-summary migration -> strict current Org tree/location/complete traces + root sidecar exclusions -> migration-only provenance classifier -> shared stateless summary writer
Current runtime/web reads -X-> migration classifier / trace-on-read backfill
Org row/context/tree-state -X-> optimistic submitted-text summary mutation
RootCommunicationEngine -> Org-private adapter -> one durable sidecar/input -> AgentOrgRun root event -> exact endpoint resolution -> every admitted pair: receiver presentation -> input release
RootCommunicationEngine -X-> browser/component/receiver presentation schema
strict Org sidecar + complete retained exact execution index -> AgentOrgExecutionContext -> owning-root participant Messages facet -> ActiveAgentWorkspaceTarget -> shared Messages presentation
TeamWorkspaceContextView -X-> Org message scope/filter/store
visible Team/basename/current definition -X-> Org message counterpart identity
browser -X-> synthetic MEMBER_INPUT_MESSAGE / duplicate ledger / delivery repair
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
| AgentOrg launch projector cannot correlate Team definition/member/coordinator/address | AgentOrg form projector + config panel | return exact blocking diagnostic, preserve draft, disable Run; do not omit/repair/synthesize | No launchable partial hierarchy | Pass |
| Team workspace/model/runtime validation fails in Org draft | AgentOrg config store/command adapter, then server resolver | retain exact scoped patch and adjacent error; launch does not allocate/activate | No Team definition or sibling patch mutation | Pass |
| User collapses/reopens or resets one Team scope | Shared disclosure + AgentOrg config store | visibility change preserves state; Team reset deletes only Team patch/workspace selection and retains Agent patches | No cross-scope mutation | Pass |
| Runtime/model patch omits model config after client preview cleared it | AgentOrg canonical patch boundary | materialize owned `llmConfig:null`, reproject, and serialize the same patch; fail before GraphQL if equality invariant breaks | No incompatible parent config re-inherited | Pass |
| Server rejects canonical effective configuration | AgentOrgRunService + Org config error adapter | allocate/activate nothing; return scoped validation and retain exact draft | No partial Org root | Pass |
| One subject history refresh fails | Mixed workspace-history read model | retain the previously committed family data slice, show a family-scoped error, and retry without replacing or resetting the panel/tree-state owner | No second history authority or presentation-state mutation | Pass |
| History row subject kind or root action mismatches | Mixed projector / typed action adapter | reject exact row/action; never try another store or place Org under Teams | No wrong-root lifecycle | Pass |
| Available Temp default is absent or workspace catalog fails | Shared workspace catalog + Org root draft | keep root unset, show existing actionable error, disable Run; never invent path | No false inherited workspace | Pass |
| User explicitly selected root or exact Team workspace | AgentOrg config store | preserve the exact choice through collapse/validation; do not reapply default or mutate sibling/focus | No implicit override | Pass |
| Prepared settlement write fails before durability | Subject task adapter + local prepared termination | cancel every prepared handle in reverse; retain tree/index/active handle; release FIFO and allow ordinary resweep | No durable or partial admission authority | Pass |
| Terminal fence commits but prepared finish rejects | Subject adapter + subject root | report failure and enter whole-root fail-stop; never reopen/replay task | No terminal-task resurrection | Pass |
| Terminal task execution is not quiescent while unrelated task command arrives | AgentRun quiescence boundary + mutation FIFO | preparation returns null without waiting; release FIFO; unrelated command commits; existing idle/offline event retries settlement | No global task-lane starvation | Pass |
| Root shutdown begins with provider approval wait | Subject root + AgentRun | stabilize/freeze exact scope and complete every Agent fence before any task drain; active wait joins existing interrupt and terminal facts | No fence-after-wait cycle | Pass |
| Root shutdown reaches AgentRun after admission/claim but before provider start | AgentRun | root fence wins dispatch serialization, invalidates/cancels exact pre-forward entry, and makes queued start a no-op | No provider call or invented turn | Pass |
| Provider start wins serialization but `TURN_STARTED` has not arrived | AgentRun | retain tracked slot and shutdown intent; on canonical start reserve existing interrupt; resolve only after failure/non-forwarding or terminal turn | No false `NO_ACTIVE_TURN` success | Pass |
| Prepared settlement cancel follows root fence | AgentRun + local registry | preserve root latch and closed admission; reverse local preparation without reopen; root retry joins fence | No post-shutdown input admission | Pass |
| Admitted root operation can still publish a handle during freeze | Subject operation/materialization gate | close and drain that bounded publication operation before snapshot; include active+prepared handle | No omitted live execution | Pass |
| Repeated settlement sweep sees the same non-quiescent terminal task | Existing terminal sweep + AgentRun quiescence boundary | each attempt either prepares atomically or defers without durable/local partial state; idle/offline resweep supplies progress | No duplicate job/token machinery | Pass |
| External Org SEND_MESSAGE is rejected/failed or target is task-scoped | AgentOrg command-with-kind boundary + stream handler | preserve existing command admission/result; do not call history for rejected/failed or non-configured kind; no fallback target | No summary mutation | Pass |
| First qualifying Agent result is accepted and history write reports operational failure | AgentOrg stream handler/history catalog | preserve truthful Agent acceptance, report metadata failure through existing observability, never replay input or substitute later/client text in that operation | No false Agent result or optimistic authority | Pass |
| Older AgentOrg history request returns after post-commit refresh | Mixed web history read owner | reject stale generation commit; retain newest strict family slice | No presentation regression | Pass |
| Legacy Org summary evidence is absent, tied, invalid or unreadable | Registered summary migration | bounded redacted warning, keep empty summary and approved fallback; do not guess | No fabricated derived data | Pass |
| Existing Org summary is non-empty during migration/rebuild | Migration + Org catalog | skip before trace read and preserve exact normalized current value | No overwrite | Pass |
| Org message rejects or fails before durable commit | Root communication engine + Org adapter | release/cancel through existing path; publish neither root message nor receiver input presentation | No UI/ledger fact | Pass |
| Org post-durable root/member publication fails | AgentOrgRun | enter existing fail-stop/reopen path; preserve one committed record/input; do not replay/delete/fabricate | No second durable authority | Pass |
| Committed Org record participant is neither a configured nor known task execution | AgentOrgExecutionContext / hydration | reject candidate or enter `reopen_required`; retain prior committed context | No hidden/unknown counterpart row; valid task identities remain included | Pass |
| Direct or mounted target lacks Messages facet | Active target resolver | treat as invariant/test failure for configured Org focus; do not fall back to Team store or hide the tool | No false Team authority | Pass |
| Reconnect re-delivers already reduced Org events | AgentOrg stream/context | apply canonical sequence/dedupe rules and atomically replace correlated candidate | No duplicate center or ledger row | Pass |

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
| Direct Org send-only component/store socket path | Yes | ActiveAgentWorkspaceTarget + AgentInteractionPort + strict command union |
| Parallel Org raw event array / duplicate focus authority | Yes | one AgentOrgExecutionContext; mixed root store delegates |
| Mounted Team registered as standalone for UI reuse | Rejected | read-only TeamWorkspaceContextView backed by Org context |
| Member-header Stop Org / mounted-Team stop | Yes / Rejected | root history-row action owned by AgentOrg lifecycle |
| Copied AgentOrg Team-status precedence or visible-row fold | Rejected | one shared pure fold plus exact Org branch adapter |
| `NestedTeamAggregateStatusDot` / nesting-specific helper names retained through aliases | No; clean-cut rename | neutral TeamAggregateStatusDot and Team-history adapter, all imports/tests/locales updated |
| Team aggregate persisted/polled/transported or mapped from TeamActivityDot | Rejected | pure projection over existing exact Agent status truth |
| Bespoke AgentOrg mounted-Team override editor / always-exposed Team children | Yes | strict Org projector drives the existing Team disclosure/scope/Agent components; old Team-kind branch is removed |
| `AgentOrgPlacementOverrideRow` fabricates an Agent form node for Team | Yes | retained/renamed direct-Agent-only row; real mounted Team uses `EditableTeamFormTeamNode` through TeamMemberConfigTree |
| Generic Team/Org config store or AgentOrg import of `teamRunConfigStore`/Team payload | Rejected | separate exact Org sparse maps and existing Org launch-input mapper; shared presentation only |
| Silent omission/repair of invalid Org Team/member/coordinator projection | Rejected | closed complete-view-or-diagnostic projector and disabled Run |
| Panel-local sparse serializer that drops dependent config clear | Yes | canonical AgentOrg patch map and mapper; exact `llmConfig:null` equality fixture |
| Parallel raw/canonical Org placement patch maps or server inference heuristic | Rejected | one store representation; server omission/null contract unchanged |
| Route-selected `AgentOrgRunHistoryPanel` / duplicate left history owner | Yes | always-mounted unified Workspace panel; Org row concerns extracted and old panel deleted |
| `agentOrgRunStore.history` / `historyError` / `fetchHistory` parallel read cache | Yes | strict AgentOrg slice moves to `runHistoryStore`; Org store retains commands only and callers request unified refresh |
| Collaboration-history Team branch ingested beside Workspace Team history | Rejected | the unified reader filters only `root_subject_kind:'agent_org'` from that query, so standalone Team roots appear once |
| AgentOrg roots under Teams or mounted Teams as history roots | Rejected | explicit ordered Org sibling category and tagged hierarchy projection |
| Hard-coded or Org-specific Temp Workspace default | Rejected | shared catalog-backed root-only Team/Org selector policy |
| Mounted Team/Agent independently auto-selects default or workspace changes focus | Rejected | descendants project root/exact Team override; focus remains separate/null |
| Provider/local teardown awaited indefinitely by root task mutation FIFO | Yes | nullable non-waiting quiescence preparation defers before any blocking teardown |
| Drain-before-fence Team/Org root shutdown | Yes | close bounded publication gate, stable freeze, and complete recursive Agent fences precede command and settlement drains |
| Active-turn-only root wrapper accepts `NO_ACTIVE_TURN` while input may start | Yes | clean-cut `fenceInputAndInterruptForRootShutdown` and `fenceAgentRunsForRootShutdown` replacement |
| Provider start after completed root fence | Rejected | claim/start transition and fence share AgentRun dispatch serialization; deterministic two-order test |
| Root shutdown changes ordinary prepared termination into cancellation | Rejected | explicit separate fence; origin/personal FIFO-drain behavior retained |
| AD-REV-008 task-keyed coordinator, passive/committed tokens and independent cleanup jobs | Withdrawn | ARCH-REV-006 supported-reachability review showed the extra machinery was disproportionate; existing FIFO/sweep/prepared settlement remain |
| Duplicate settlement lanes or dependency graph beside the task tree | Rejected | existing serialized sweep and exact task hierarchy remain authoritative |
| Team-domain shared settlement contract imported by Org | Yes | root-neutral nullable prepared-settlement adapter remains under collaboration execution task |
| Timeout/replay/new `settling` status/self-review support | Rejected | ownership/sequencing correction preserves existing task contract |
| Org summary stored in AgentOrg V1 tree/sidecars/stream ACK or new API field | Rejected | existing history row/index is the sole derived durable authority; web rereads it |
| Any live AgentOrg Agent command or address depth treated as configured, or task SEND_MESSAGE rejected merely to filter history | Rejected | unchanged exact command returns strict indexed kind; only accepted+`configured` qualifies for summary |
| Optimistic client title from submitted prompt | Rejected | accepted callback triggers authoritative strict Org-family refresh only |
| Trace-on-read/lazy historical backfill or runtime import of migration classifier | Rejected | registered startup-only migration folder and dependency guard |
| Legacy earliest-tie resolution by address/path/file/content order | Rejected | unique strictly earliest timestamp or valid empty fallback |
| Second Org manager/catalog constructed by WebSocket defaults or startup migration | Rejected | WebSocket composition injects the supervisor's service; migration uses the stateless summary writer before supervisor construction |
| Same-Team-only `projectAgentOrgTeamMessages` path | Yes | Replaced by complete-Org selected-Agent perspective over the sole Org sidecar |
| Root message ownership inside `TeamWorkspaceContextView` | Yes | Separate `CollaborationMessagesContextView`; Team view retains identity/roster/header only; Tasks is an independent facet |
| Team-kind-only Messages tab gate or direct Org omission | Yes | Active target's owning-root facet governs one shared desktop/narrow tool definition |
| Bespoke Org Messages dashboard/second ledger/browser MEMBER_INPUT synthesis | Rejected | Established Team Messages/event-monitor presentation consumes strict Org context projections only |

## Design-Principle Self-Check

| Principle | Evidence In Revised Design | Result |
| --- | --- | --- |
| Approved behavior first | Every case cites REQ/AC/SCN/Product or established runtime contract; no new product behavior | Pass |
| Supported-scenario gate | 40 concrete supported cases, including SCN-013-018's launch hierarchy, effective-config equality, unified history, workspace-default, history-summary and communication-observability paths; normal submit/independent-accept overlap, normal task activation plus SIGTERM before `TURN_STARTED`, and normal approval-gated shutdown prove the affected lifecycle reachability. The self-review witness is `Unsupported/Contrived` and used only as technical coupling evidence; global lookup/tampering/deep conversion remain rejected | Pass |
| Spine span sufficiency | Each primary case spans initiating caller through owner/durability/provider to result/event | Pass |
| Multiple primary spines | Definition, Team launch, Org launch, message, task, persistence, migration, mixed read, focus, process lifecycle are distinct | Pass |
| Ownership clarity | Root aggregates own subject lifecycle/order; frozen scopes own enumeration; AgentRun owns admission/provider-start/turn/interrupt; adapters own translation | Pass |
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
| Existing capability reuse | The byte-identical current/origin-personal Team form chain owns the desired presentation; AgentOrg adds only a strict projector/command adapter and extracts one disclosure shell | Pass |
| One semantic representation | AgentOrg config store retains one canonical patch; preview and request consume it; the server independently resolves the same fixture; no raw/canonical duality | Pass |
| Stable shell ownership | One route-independent mixed read owner owns data/grouping/order only; one mounted panel/tree-state controller owns expansion/reveal/highlight/scroll continuity; existing selection and subject contexts/stores retain identity, runtime and lifecycle | Pass |
| Default-policy reuse | AgentOrg root invokes the established catalog-backed Team root selection policy; descendants inherit and never own independent defaults | Pass |
| Presentation versus domain boundary | Identical Team appearance does not merge AgentOrg and AgentTeam drafts, payloads, effective resolution, coordinators, or lifecycles | Pass |
| Collapse-independent hierarchy truth | Full strict Team node is traversed before display filtering; hidden task Agents remain inputs and outside branches cannot leak | Pass |
| Concurrency lane ownership | One existing serialized task lane remains; it probes quiescence without waiting and defers to the existing execution-state resweep | Pass |
| Shutdown dependency order | Admitted publication closes, full owned scope is frozen, and each AgentRun fence reaches terminal before command/settlement drain; no provider may start after the phase | Pass |
| Durable failure boundary | Existing prepared termination is reversible before durability; after durability, finish is monotonic and whole-root fail-stop on failure | Pass |
| Derived-metadata ownership | Unchanged exact command returns the execution kind used to filter summary eligibility; Org history catalog owns runtime sequencing/current rows; shared writer owns physical first-write; mixed read owner owns live projection; migration alone owns legacy inference | Pass |
| First-write concurrency | Accepted-result completion plus immediate serialized catalog enqueue is the only live arbitration; later writes and rebuilds preserve the winner | Pass |
| Conservative recovery | Unique-earliest complete configured-member evidence may backfill; absence/tie/invalid evidence retains valid fallback with bounded diagnostics | Pass |
| Authoritative live update | Accepted SEND_MESSAGE triggers a newest-generation strict history read; no optimistic summary or row/context mutation | Pass |
| One-record/all-participant communication | One root sidecar record drives root and exact receiver events for every admitted pair; no second authority | Pass |
| Root-scoped presentation reuse | Independent Tasks/Messages facets reuse Team interaction without merging roots, sidecars or Team roster/header ownership | Pass |
| Complete identity and recovery | One retained exact AgentRun/host/task index is rebuilt in correlated candidate; source address/configuration cannot substitute task binding or identity | Pass |
| One communication authority | Team or Org sidecar remains the single durable message record; receiver-center and Messages rows are correlated projections, never copies | Pass |
| Exact receiver presentation | Every supported accepted configured/task pair publishes one receiver input after durability; rejected/uncommitted sends do not | Pass |
| Owning-root selected-member scope | Every selected configured/task Org Agent receives participant Messages and Tasks; no containing-Team relevance shortcut | Pass |

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
  AD-REV-011's one-FIFO VAL-006 coherence, and AD-REV-009/010's deterministic
  normal submit/accept overlap, non-waiting
  quiescence deferral, recursive all-or-none preparation, pre-/post-durable
  failure, normal task activation barrier before `TURN_STARTED`, exact
  cancellation/interrupt facts, no post-fence provider call, ordinary FIFO-
  draining termination regression, and fence-before-drain Team/Org shutdown
  checks. AD-REV-012 additionally requires the pure Org form projector/store/
  serializer matrix; exact count/local-state/reset/collapse/workspace/failure
  checks; shared disclosure/a11y tests; standalone Team form regression; import/
  no-new-API scans; and desktop/narrow production comparison with
  VIS-OVR-001-006. AD-REV-013 additionally requires the VAL-031 cross-layer
  effective-config fixture matrix; removal of the local sparse serializer;
  VAL-032 same-panel/category/order/state/action/browser journey; and VAL-033
  actual-default/explicit-choice/inheritance/absent-default/no-focus matrix.
  It also requires scans proving no alternate history panel/route predicate,
  parallel raw patch, hard-coded workspace, or new API/persistence/lifecycle
  contract remains. AD-REV-015 additionally requires VAL-034-037: direct and
  mounted configured accepted-message parity; exact Team compaction; all
  exclusion classes; controlled first-accept completion in both orders; durable
  preservation across stop/restore/rebuild; authoritative no-navigation refresh
  with stale/failure ordering; current non-empty preservation; unique direct/
  mounted legacy evidence; absent/tied/invalid conservative fallback; runner
  prerequisite/restart/idempotence; redacted diagnostics; and scans proving no
  Team/schema/stream field, optimistic title, runtime migration import, trace-on-
  read fallback, or second Org manager/catalog. AD-REV-016 additionally requires
  a migration-ID-qualified status assertion: the family migration cannot warn;
  the summary migration warns only for independently valid empty metadata with
  no unique evidence; and required current-structure or selected-value
  persistence failure wins as `FAILED`. Cumulative AD-REV-017/018 additionally
  requires VAL-038-040: exact post-durable root/member event order,
  deterministic configured→configured, configured→task, task→configured and
  task→task eligibility, direct↔direct,
  direct↔mounted and mounted↔mounted sender/receiver perspectives, complete
  address identity and references, unrelated-focus/exclusion paths, live/
  reconnect/restore equivalence, desktop/narrow shared Messages behavior,
  standalone Team regression, and scans proving no same-Team filter, Team-kind
  gate, second ledger, browser event synthesis, schema or lifecycle expansion.
  The
  downstream implementation/test changes and evidence are not validated or
  claimed by this artifact.

## Self-Validation Conclusion

AD-REV-021 adds VAL-051–053 under approved RER-031. The supported cleanup has
one coherent UI owner at each boundary, keeps all accepted data and exact
navigation, and needs no migration or backend change. Fifty-three indexed design
walkthroughs now exist; only the three new cases and affected UI assertions were
re-walked for this round. No prior source/API pass is upgraded by this document.
AD-REV-020/ARCH-REV-018 authoring authority remains unchanged; the following
conclusions are prior-round history, not a renewed approval hold on AD-REV-020.

AD-REV-020 adds five passing design walkthroughs (VAL-046–050) for approved
RER-029. One strict current definition shape per family, migration-only previous
format knowledge, independent definition conversion/status and unchanged runtime
versions are coherent. No Requirement/Product gap remains; independent
Architecture Review and actual implementation/validation are still required.

`AD-REV-005` continues to resolve `IDI-001`; `AD-REV-006` resolves real-browser
`ADI-007`; and AD-REV-007 resolves `API-FIND-007` / `CR-FIND-011` at the
architecture boundary under approved RER-021. `AD-REV-009` resolves
`ARCH-REV-006` / `AR-FIND-003` by grounding the lifecycle concern in two
independently supported production paths and proportionately replacing the
blocked AD-REV-008 machinery with a nullable, non-waiting AgentRun quiescence
boundary plus interrupt-before-drain root shutdown. `AD-REV-010` resolves
`ARCH-REV-007 / AR-FIND-004` by adding the singular AgentRun-owned input/provider-
start/interrupt fence and stable recursive Team/Org scope composition for the
supported pre-`TURN_STARTED` SIGTERM window. `AD-REV-011` resolves
`ARCH-REV-008 / AR-FIND-005` by restoring VAL-006 to that same one-FIFO,
deepest-first, prepared-or-null settlement contract and removing its last
affirmative independent-cleanup-job statement. All other AD-REV-008 references
in this artifact are explicit withdrawal/rejection history only. `AD-REV-012`
resolves `CRR-021 / CR-FIND-020` under approved RER-023 by routing the distinct
AgentOrg draft through one complete fixed-depth projector into the established
AgentTeam disclosure/Team-scope/Agent-row presentation, then translating typed
commands back to the unchanged Org launch API. The superseded bespoke Team row
is removed without sharing Team store, payload, coordinator or lifecycle
authority. `AD-REV-013` resolves the RER-024 Electron design impact with one
canonical placement patch, one route-stable Workspace/history surface, and the
established catalog-backed root workspace default/inheritance policy.
`AD-REV-014` resolves `ARCH-REV-011 / AR-FIND-006` by assigning data loading,
strict projection, grouping, order and family errors only to the mixed read
owner, while one panel-scoped `useWorkspaceHistoryTreeState` instance owns
expansion/reveal/highlight continuity and the mounted panel owns scroll.
`AD-REV-015` resolves the RER-025 history-title impact with exact configured
external-message qualification, catalog-owned first-write durability,
authoritative live refresh, and startup-only unique-evidence recovery.
`AD-REV-016` resolves
`ARCH-REV-013 / AR-FIND-007` by assigning a separate terminal-status matrix to
each registered migration: the family migration has no warning disposition,
while the summary migration permits only the independently valid empty-metadata
warning and keeps current-structure/write/reread failures fatal to its attempt.
`AD-REV-017/018` resolved the then-approved RER-026 scope. RER-028 now
supersedes the configured-only gate. AD-REV-019 keeps one durable authority and
post-commit order, includes every admitted ordinary-message endpoint pair, and
separates participant Tasks from Team roster ownership. Exact task selection and
actual platform/physical identity remain stable through checkpoint, settlement
and readonly history. Task record commits and accepted system inputs remain
independent facts; rejected notify never becomes fabricated conversation.

All 45 design walkthroughs have an initiating supported scenario, data-flow
spine, exact ownership/identity boundary, failure meaning and test obligation.
No source/API/E2E pass is inferred. The design requires no new task engine,
configured nesting, synthetic Team/coordinator, alternate ledger, history input
filter, recovery machinery, durable schema or migration. It requires one new
readonly Org inspection query, tightened internal presentation/selection types,
shared read facets and current projection corrections as explicitly mapped in
DS-028–030. Earlier one-FIFO settlement and Agent shutdown fence remain unchanged.

Focused classification is Medium/High; cumulative Large/High requires independent
Architecture Review. No Requirements or Product question remains. Implementation,
full source review and expanded deterministic/rendered/API validation remain
required after that review. Delivery readiness is not claimed.


## AD-REV-019 Artifact Consistency Checks

- `git diff --check` on all five architecture-owned modified artifacts: passed.
- Markdown table-column shapes versus current headers: passed (zero errors).
- Revision record: one new AD-REV-019 entry/index; AD-REV-001–018 preserved.
- Self-validation: VAL-001–045 each has one detailed walkthrough and one index
  row; existing runtime/definition/migration/shutdown cases remain.
- Supersession scan: remaining configured-only message language is historical
  or an explicit removal; REQ-033 title eligibility stays configured-only and
  is not accidentally widened by task communication parity.
- No source/requirements/Product/test artifacts were edited by this round;
  downstream dirty files/evidence were excluded from staging. No executable
  validation or delivery completion is implied by these document checks.

## AD-REV-020 Artifact Consistency Checks

- Target authored types/examples contain no schemaVersion; migration-only prior
  shapes and runtime/sidecar/journal versions are explicitly distinguished.
- New DS-031–033 and VAL-046–050 cover both families, normal writes/read/import,
  diagnostics, completed/pending prior migration, owned child inventory, failure,
  ordinary retry, external zero writes and no runtime replay.
- One new revision index/body; earlier AD-REV-001–019 history is unchanged.
- Executed checks: zero Markdown table/fence errors; 50 unique detailed VAL
  walkthroughs matching 50 index rows; one AD-REV-020 body/index; prior AD-REV-001–019
  bodies unchanged; no literal schemaVersion key in current target examples/types;
  upstream files unchanged; git diff --check passed. These are document checks,
  not executable validation.

## AD-REV-021 Artifact Consistency Checks

- Executed document checks passed: four architecture artifacts have consistent
  Markdown table/fence shapes; VAL-001–053 have exactly 53 unique detailed
  walkthroughs and matching index rows; AD-REV-021 has one index/body.
- Earlier AD-REV-001–020 bodies remain unchanged. The four canonical upstream
  artifacts have no diff against approved RER-031 commit 3b8c18a28.
- Current category references use Org; the preserved main-navigation name is
  explicitly unchanged. DS-029's former prominent Messages badge directive is
  superseded by DS-034 rather than left as competing presentation authority.
- git diff --check passed. No application source, test, runtime or other-owner
  report was changed. The read-only comparison and design walkthroughs are not
  a rendered browser, implementation, API/E2E or delivery pass.
