# Design Review Report

## Review Round Meta

- Stable package: `AORG-FLAT-TEAM-001`.
- Upstream Requirements Doc: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md` — approved `RER-033@f84c5299f10898f49acff6a0e481d1cd61c769a9`.
- Upstream Investigation Notes: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`.
- Upstream Requirements Revision Record: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md`.
- Reviewed Design Spec: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md` — `AD-REV-027@129c0e3867470e45a54700c6f5c4f7274a91fdba`.
- Supplemental Task Artifacts Reviewed: extended architecture-history-inspection investigation; architecture self-validation; CRR089 original comparison, installed-client composition proof and API37 failure summary; retained contract, Product specifications/manifests and earlier architecture authorities. Complete incoming reference inventory remains `code-review-evidence/CRR-089/handoff-reference-files.txt`; this report does not claim independent examination of every referenced file.
- Architecture Design Revision Record Reviewed: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-revision-record.md`.
- Relevant Architecture Design Revision IDs: AD-REV-027 / DS-047, strengthened DS-037, VAL-058/076–078; retained cumulative AD001–026 outside explicit supersession.
- Architecture Review Revision Record: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`.
- Current Architecture Review Revision ID: `ARCH-REV-024`.
- Current Review Round: 24.
- Trigger: CRR089 / CR-FIND046 / API-FIND039; confirmed late old history response restores Running/Stop after successful Stop, despite IR058 immediate inactive publication.
- Prior Review Round Reviewed: `ARCH-REV-023@7fde1faf1` Pass on AD026. That result does not approve this revised async read contract.
- Latest Authoritative Round: ARCH-REV-024.
- Current-State Evidence Basis: IR001–058 source `bbdea002ee59da87cc7174bfc2924888c0bb38f7`, incoming artifact `d76731eaa3260a123f1ce8c6ace0e14994fddcde`. Independently inspected current history load/actions/publication, context inspection/Stop/staging/adoption, exact projection query/service, root row controls, branch status fold and installed Apollo QueryManager. Both local `personal` and `origin/personal` rechecked at `5645b49d6f51faa60bd3545bc8e3f0e7e3f96793`; inspected original Team termination/history publication/context overlay and reconciliation. No fetch, checkout, original-branch execution or live root action.
- Evidence limits: API37's four hosted cases and CRR089's actual-loader/installed-client counterexample remain separate from this source-informed design review. Reviewer ran only in-memory installed-client diagnostics, not application/Pinia/browser/provider tests. A bounded extra diagnostic extracted the actual member `fetchProjection` and GraphQL document: two same-identity network-only reads share one Link; a diagnostic per-query override makes two. Its simplified newest-token publisher accepts the old member body in the first variant and the new body in the second. Synthetic content and controlled Link confirm the mechanism, not product reachability or a fifth observed API failure. Four cache.diff/canonizeResults deprecation diagnostics were disclosed for that probe. Temporary scripts/logs are under `/tmp/aorg-arch024-*`, not canonical executable acceptance artifacts.
- Document checks: four upstream artifacts match RER033 byte-for-byte; 78 unique design walkthroughs remain design evidence only. No source/test/data/migration or Delivery change is made by this review.

## Routing Classification Review

- Task size (`Small`/`Medium`/`Large`): `Large` cumulative; focused `Medium`.
- Architectural risk (`Low`/`High`): `High` cumulative and focused.
- Classification rationale reviewed: physical observation versus logical commit provenance crosses existing client, context/history stores and visible lifecycle controls. Structural concurrency and ownership justify review, not 2169 reference files or response size.
- Independent Architecture Review required by the classification: `Yes`.
- Classification evidence or correction required: None.

## Upstream Behavior And Production-Path Basis Confirmation

- Overall Basis Status (`Confirmed`/`Contradicted`/`Blocked`): `Contradicted` only in the final retained-projection target path. Approved intent and the supported scenario basis are confirmed; no business decision is reopened.
- Approved requirements / intended behavior understood: truthful root controls after successful Stop; observational history; same exact selection and retained conversation; independent root/Agent/Team aggregate truth. A final post-Stop inspection must not silently reuse a pre-Stop conversation sample as current final content.
- Relevant existing behavior confirmed: actual API37 late-history failure, current bound Apollo default in-flight deduplication, and source-supported root/member inspection staging. Original Team publishes inactive immediately, but its own history reconciliation can mark a context active; context-over-history overlay alone is not demonstrated immunity.
- Scope guardrail: bounded existing Org history/inspection read and commit boundaries, final retained presentation, current positive/negative controls. Outside scope: new lifecycle policy, global client changes, server consistency protocols, permanent stopped overlay, generic request coordinator, compatibility/migration work, original configured Team recursion and replaying used API roots.
- Every prospective blocking Design Impact finding is traceable to approved authority: Yes — AR-FIND-009 protects the existing DS-037 final retained-conversation contract under REQ-016/031 and AC-011/026, not a new snapshot-isolation policy.
- Remaining material ambiguity: None in the initiating path or code mechanism; the incomplete target scope requires architecture-owned correction. No claim of durable content loss or a hosted member-projection failure.

| Behavior ID | Kind | Design Alignment With Approved Intent (`Pass`/`Fail`) | Approved Trigger / Contract And Current-State Evidence (`Pass`/`Fail`/`Unclear`) | Target Outcome / Path / Spine Coherence (`Pass`/`Fail`/`Unclear`) | Status (`Confirmed`/`Needs Correction`/`Unclear`) | Required Action |
| --- | --- | --- | --- | --- | --- | --- |
| BEH-014 / REQ-031 / AC-026; HIST-INSPECT-002 | User Stop / root navigation | Pass | Pass | Pass | Confirmed | DS-047 closes old physical history-response reuse; retain IR058 immediate inactive topology publication. |
| BEH-004/006 / REQ-004/016/031; HIST-INSPECT-001 | User opens active history then Stops | Pass | Pass | Pass | Confirmed | Independent root inspection plus existing Symbol/staging guards prevents stale root activity from a superseded open. This is source-supported adjacency, not a fifth API37 observation. |
| BEH-004/006; REQ-016/031; DS-037 preserved final conversation | User Stops to inspect retained output while first hydration is pending | Pass | Pass | Fail | Needs Correction | AR-FIND-009 / AR-PREM-013: root freshness does not prevent post-Stop hydration from joining an old member-projection request. |
| BEH-011 / REQ-028 / AC-023 | Exact Agent and mounted-Team status | Pass | Pass | Pass | Confirmed | Original/current separation is sound: root activity, exact Agent states and descendant fold have distinct authorities. |
| Other cumulative approved behaviors | Preserved | Pass | Pass | Pass | Confirmed | No runtime, task, schema, authoring, attachment, migration, route, Product or standalone-Team redesign. Prior independent scopes remain, not new executable acceptance. |

## Supplemental Artifact Coherence Verdict

| Artifact | Purpose And Scope Are Clear? (`Pass`/`Fail`) | Linked To Relevant Core Artifacts? (`Pass`/`Fail`) | Internally Complete? (`Pass`/`Fail`) | Consistent With Related Core Artifacts? (`Pass`/`Fail`) | Status And Approval Applicability Are Clear? (`Pass`/`Fail`) | Required Action |
| --- | --- | --- | --- | --- | --- | --- |
| Requirements / contract / inventory | Pass | Pass | Pass | Pass | Pass | Unchanged RER033, current Org heading and cumulative Product supplements retained. |
| AD027 original comparison and CRR089/API37 evidence | Pass | Pass | Pass | Pass | Pass | Pinned source comparison is not original runtime validation; actual loader, simplified probe and hosted evidence scopes remain distinct. |
| DS-037/047 / self-validation / history investigation | Pass | Pass | Fail | Fail | Pass | AR-FIND-009: final retained projection is promised, but child projection physical reads are excluded and VAL077 covers only root observation reuse. |
| Prior attachment/task/authoring/UI and installation supplements | Pass | Pass | Pass | Pass | Pass | Preserve earlier authorities and IR049 before-cutover return; not a blanket coding hold. |
| Current API/source/Delivery reports and reference index | Pass | Pass | Pass | Pass | Pass | API37 remains Fail69.3; retained results, missing evidence and held gates are not expanded into acceptance. |

## Task Design Health Assessment Verdict

| Assessment Area | Result (`Pass`/`Fail`) | Evidence | Required Action |
| --- | --- | --- | --- |
| Assessment present | Pass | Bug Fix / Missing Invariant at physical acquisition versus logical publication. | None. |
| Root-cause classification explicit | Pass | Installed QueryManager shares same query/variables despite newer app token; API37 and CRR089 support current root-history defect. | None. |
| Refactor decision explicit | Pass | One private typed Org-history operation; reuse stores and guards; remove redundant inactive refresh. | None. |
| Concrete design supports complete decision | Fail | Selected root-history correction is sound, but staged member acquisition remains outside the final inspection guarantee. | AR-FIND-009: complete the same bounded inspection spine, not a new subsystem. |

## Spine Inventory Verdict

| Spine ID | Scope | Spine Is Readable? (`Pass`/`Fail`) | Narrative Is Clear? (`Pass`/`Fail`) | Facade Vs Governing Owner Is Clear? (`Pass`/`Fail`/`N/A`) | Main Domain Subject Naming Is Clear? (`Pass`/`Fail`) | Ownership Is Clear? (`Pass`/`Fail`) | Off-Spine Concerns Stay Off Main Line? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DS-037 | Root action -> context latch -> command service/manager -> confirmed inactive -> immediate history/navigation + retained center | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| DS-047 / DS-047-H | History generation -> backend readiness -> typed physical read -> authoritative root activity -> strict parse/latest commit -> navigation | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| DS-035 / DS-047-I | History open or post-Stop inspection -> root read -> staged member projections -> candidate commit -> final center | Pass | Fail | Pass | Pass | Pass | Pass | Fail |
| Retained exact-status / Team fold | Strict exact context -> Agent row or descendant-only fold -> passive mounted-Team dot | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| Other cumulative spines | Definition/runtime/task/persistence/attachment and approved UI spines unaffected by this read-client delta | Pass | Pass | Pass | Pass | Pass | Pass | Pass |

## Boundary Encapsulation Verdict

| Boundary / Owner | Authoritative Public Entry Point Is Clear? (`Pass`/`Fail`) | Internal Owned Mechanisms Stay Internal? (`Pass`/`Fail`) | Caller Bypass Risk Is Controlled? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| History store / load actions | Pass | Pass | Pass | Pass | Private typed read owns query/error/strict parse; generation/publication remain store responsibilities. |
| Context store / staged hydration | Pass | Pass | Pass | Fail | Ownership is clear; AR-FIND-009 is an incomplete observation contract across its existing hydration boundary, not a bypass. |
| Command adapter / runtime owner | Pass | Pass | Pass | Pass | Backend termination remains authoritative; no client status helper gains lifecycle authority. |
| Apollo / pure status/navigation consumers | Pass | Pass | Pass | Pass | Bound client unchanged globally; components consume committed stores, not raw cache as root truth. |

## Dependency Direction / Forbidden Shortcut Verdict

| Owner / Boundary | Allowed Dependencies Are Clear? (`Pass`/`Fail`) | Forbidden Shortcuts Are Explicit? (`Pass`/`Fail`) | Direction Is Coherent With Ownership? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Components/actions -> contexts/history -> existing query/stream services | Pass | Pass | Pass | Pass | No router import or context-store mutation inside private history reader. |
| Root lifecycle vs exact Agent and passive aggregate | Pass | Pass | Pass | Pass | No coordinator/status-fold inference of root activity, synthetic mounted root, or hiding Stop. |
| Inspection staging -> current projection service | Pass | Pass | Pass | Pass | Read-only exact root/Agent IDs; no restore-on-read. Complete freshness at this existing boundary without bypassing it. |

## Interface Boundary Verdict

| Interface / API / Query / Command / Method | Subject Is Clear? (`Pass`/`Fail`) | Responsibility Is Singular? (`Pass`/`Fail`) | Identity Shape Is Explicit? (`Pass`/`Fail`) | Generic Boundary Risk (`Low`/`Medium`/`High`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- | --- |
| readAgentOrgHistory(client) | Pass | Pass | Pass | Low | Pass |
| readInspection(orgRunId) + staging | Pass | Pass | Pass | Low | Pass |
| GetAgentOrgMemberRunProjection(orgRunId,address,agentRunId) | Pass | Pass | Pass | Low | Pass |
| applyAgentOrgActivity(orgRunId,isActive) | Pass | Pass | Pass | Low | Pass |
| Existing terminate / continuation / stream APIs | Pass | Pass | Pass | Low | Pass |

The interface shapes remain sound. AR-FIND-009 concerns the composite read invariant, not a new API or generic identity.

## Existing Capability / Subsystem Reuse Verdict

| Need / Concern | Existing Capability Area Was Checked? (`Pass`/`Fail`) | Reuse / Extension Decision Is Sound? (`Pass`/`Fail`) | New Support Piece Is Justified? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| History acquisition and publication | Pass | Pass | N/A | Pass | Current owners are appropriate; local consolidation removes duplicated policy. |
| Original Team comparison | Pass | Pass | N/A | Pass | Retain root/leaf/aggregate separation, immediate publication and scoped topology; reject unproved race immunity. |
| Hydration/projection acquisition | Pass | Pass | N/A | Pass | Reuse is correct. AR-FIND-009 completes its physical-read obligation; no new support subsystem required. |

## Subsystem / Capability-Area Allocation Verdict

| Subsystem / Capability Area | Ownership Allocation Is Clear? (`Pass`/`Fail`) | Reuse / Extend / Create-New Decision Is Sound? (`Pass`/`Fail`) | Supports The Right Spine Owners? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| History | Pass | Pass | Pass | Pass | Read-only family slices/generation/navigation remain one existing owner. |
| Org browser execution / hydration | Pass | Pass | Pass | Pass | Existing context publication boundary should govern the entire staged observation. |
| Runtime, transport infrastructure, status presentation | Pass | Pass | Pass | Pass | No wholesale refactor or additional owner justified. |

## Reusable Owned Structures Verdict

| Repeated Structure / Logic | Extraction Need Was Evaluated? (`Pass`/`Fail`) | Shared File Choice Is Sound? (`Pass`/`Fail`/`N/A`) | Ownership Of Shared Structure Is Clear? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Duplicate Org history query/error/parse | Pass | Pass | Pass | Pass | One private operation in existing load-actions file; no generic query framework. |
| Logical request generation / inspection Symbol | Pass | N/A | Pass | Pass | Different owners retain their existing guards; not combined into a new shared epoch. |
| Exact projection/AgentContext structures | Pass | N/A | Pass | Pass | Retain schemas and matched-context identity; no extra freshness field needed by the finding. |

## Shared Structure / Data Model Tightness Verdict

| Shared Structure / Type / Schema | One Clear Meaning Per Field? (`Pass`/`Fail`) | Redundant Attributes Removed? (`Pass`/`Fail`) | Overlapping Representation Risk Is Controlled? (`Pass`/`Fail`) | Shared Core Vs Specialized Variant / Composition Decision Is Sound? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| History/root inspection DTOs | Pass | Pass | Pass | Pass | Pass | Existing strict tagged families; no redundant client activity record. |
| Agent projection and context identity | Pass | Pass | Pass | Pass | Pass | Exact root/Agent IDs and address are checked; same IDs do not establish freshness of content. |
| Status and lifecycle facts | Pass | Pass | Pass | Pass | Pass | Root activity, Agent status, aggregate and command readiness remain separate meanings. |

## File Responsibility Mapping Verdict

| File | Responsibility Is Singular And Clear? (`Pass`/`Fail`) | Responsibility Matches The Intended Owner/Boundary? (`Pass`/`Fail`) | Responsibilities Were Re-Tightened After Shared-Structure Extraction? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| runHistoryLoadActions.ts | Pass | Pass | Pass | Pass | Private typed Org operation; preserve full/focused error and independent workspace behavior. |
| agentOrgContextsStore.ts | Pass | Pass | Pass | Pass | Read/Stop/current-generation publication owner; remove redundant onInactive refresh only. |
| agentOrgContextHydration.ts / exact member read | Pass | Pass | Fail | Fail | AR-FIND-009: absent from the changed physical-read mapping despite final post-Stop staged content dependency. |
| Existing root store/status fold/row tests | Pass | Pass | Pass | Pass | Retain IR058 and positive controls; no production edits required without evidence. |

## Subsystem / Folder / File Placement Verdict

| Path / Item | Target Placement Is Clear? (`Pass`/`Fail`) | Folder Matches Owning Boundary? (`Pass`/`Fail`) | Mixed-Layer Or Over-Split Risk (`Low`/`Medium`/`High`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Existing web/stores and services/agentOrgExecution | Pass | Pass | Low | Pass | Semantic placement is sound; a small boundary correction suffices. |
| Tests beside existing loader/context/navigation owners | Pass | Pass | Low | Pass | Real installed-client/Pinia regression belongs here; no new subsystem or test-only runtime path. |

## Removal / Decommission Completeness Verdict

| Item / Area | Redundant / Obsolete Piece To Remove Is Named? (`Pass`/`Fail`) | Replacement Owner / Structure Is Clear? (`Pass`/`Fail`/`N/A`) | Removal / Decommission Scope Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Duplicate full/focused Org query setup/parsing | Pass | Pass | Pass | Pass | Replace with one private typed read, not wrappers around both. |
| Redundant stream onInactive history refresh | Pass | Pass | Pass | Pass | markHistorical -> applyActivity already refreshes; preserve accepted-message summary refresh. |
| Superseded assumption: newest logical generation implies independent observation | Fail | Pass | Fail | Fail | Root reads are corrected, but the composite final-inspection member read remains exposed. AR-FIND-009. |
| Current activity/fold/lifecycle mechanisms | Pass | Pass | Pass | Pass | Explicitly retain, not remove to hide the symptom. |

## Legacy / Backward-Compatibility Verdict

| Area | Compatibility Wrapper / Dual-Path / Legacy Retention Exists? (`Yes`/`No`) | Clean-Cut Removal Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- |
| AD027 acquisition/commit contract | No | Pass | Pass | No alias, compatibility reader, old client path or global configuration fork. |
| Cumulative persistence/authoring/attachment transitions | No | Pass | Pass | Existing migration-local history remains isolated; no new transition authorized. |

## Persisted-Data Transition Verdict (When Applicable)

| Area / Stored Subject | Approved Decision | Representative Reader / Semantic / Invariant Evidence Is Sufficient? (`Pass`/`Fail`) | Direct Use, Rebuild, Or Migration Choice Is Proportionate? (`Pass`/`Fail`) | Migration Safety Is Complete If Required? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| AD027 history/inspection read behavior | Not Affected | Pass | Pass | N/A | Pass | No durable field/format/semantic change; missing physical freshness does not justify migration. |
| IR049 actual terminal-family/old-locator installation | Retain separate BEFORE CUTOVER decision | Pass | Pass | N/A | Pass | No replay/reset or installed-data readiness claim; this review neither resolves it nor converts it into a coding hold. |
| Earlier approved family/authoring/summary/attachment decisions | Unchanged | Pass | Pass | Pass | Pass | Reuse prior reviewed scope. This round does not repeat or certify operational migration execution. |

## Change / Refactor Safety Verdict

| Area | Sequence Is Realistic? (`Pass`/`Fail`) | Temporary Seams Are Explicit? (`Pass`/`Fail`) | Cleanup / Removal Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- |
| History private operation plus generation/publication | Pass | Pass | Pass | Pass |
| Independent root inspection and complete staged final view | Fail | Pass | Fail | Fail |
| Removal of duplicate inactive refresh | Pass | Pass | Pass | Pass |
| Real-client source tests -> selected source review -> full cumulative API/E2E -> proportional test review -> applicable Delivery | Pass | Pass | Pass | Pass |

## Example Adequacy Verdict

| Topic / Area | Example Was Needed? (`Yes`/`No`) | Example Is Present And Clear? (`Pass`/`Fail`/`N/A`) | Bad / Avoided Shape Is Explained When Helpful? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| History dedup despite newer generation | Yes | Pass | Pass | Pass | Original/current code and installed-client diagnostic clearly explain network-only versus independent Link. |
| Superseded root inspection | Yes | Pass | Pass | Pass | VAL077 traces active open then Stop, with root generation/staging limits. |
| Post-Stop member-content hydration | Yes | Fail | Fail | Fail | AR-FIND-009: root inspection completion before Stop and member projection completion afterward is not covered. |
| Valid active, pending/rejected Stop and exact status | Yes | Pass | Pass | Pass | Preserve genuine active observation and command-readiness separation; no blanket greying. |

## Material Premise Validation (Only When Needed)

### AR-PREM-011 — New logical history generation can inherit a pre-Stop physical response

- Related approved requirement / behavior: BEH-014, REQ-031, AC-026; DS-037 truthful root history after confirmed Stop.
- Initiating basis kind: `User`.
- Independent trigger: in normal Workspaces, the user Stops an active Org while its ordinary history refresh is outstanding.
- Support evidence: exposed root Stop action; API37 four direct/mounted and 1502/390 cases; CRR089 exact loader/client proof.
- Forward path: root Stop -> context/command adapter -> successful server termination -> applyAgentOrgActivity invalidates generation and immediately publishes inactive -> normal new focused read -> installed Apollo may reuse the old identical in-flight operation -> latest-generation commit republishes old active.
- Lifecycle/consequence: old physical response sampled active before success, but completes after success; root Running/Stop reappears even though backend is inactive. Logical checks alone cannot distinguish response provenance.
- Reachability: `Reachable`, observed supported workflow.
- Review consequence: accept DS-047 bounded private history operation plus per-operation independent physical read and unchanged latest commit guards. No new finding against that correction.

### AR-PREM-012 — Active-history root inspection overlaps the same root's Stop

- Related approved requirement / behavior: BEH-004/006/014, REQ-016/031, AC-011/026; HIST-INSPECT-001/002, DS-035/037.
- Initiating basis kind: `User`.
- Independent trigger: user opens an already-running Org Agent from Workspaces, then Stops that root while observational loading is pending.
- Support evidence: WorkspaceAgentOrgHistoryCollection exposes Stop from history isActive, disabled only for termination; openForInspection does not reserve the continuation/Stop operation latch. This is a coherent inspect-and-stop workflow, not two conflicting edits or invented multi-tab use.
- Forward path: history exact selection -> readInspection root query -> user Stop invalidates its Symbol -> confirmed inactive -> new readInspection with same orgRunId -> newer Symbol may receive old physical root body if client dedup remains enabled.
- Lifecycle/consequence: stale root inspection can publish active and attach transport despite completed Stop. Current strict IDs/staging guard the initiating candidate, not a new subscriber reusing its response.
- Reachability: `Reachable`, source-supported adjacent path; not an additional hosted API37 failure.
- Review consequence: accept DS-047 independent root read while retaining generation/staging/identity barriers and failed-read retention.

### AR-PREM-013 — Final stopped hydration inherits an older member-conversation sample

- Related approved requirement / behavior: BEH-004/006, REQ-016/031, AC-011/026; DS-037 preserved conversation and final retained task/message/projection truth. The change does not introduce snapshot isolation during ordinary live execution.
- Initiating basis kind: `User`.
- Independent trigger: user reopens an already-running offscreen Org to inspect its work, then Stops it while initial conversation hydration is pending. The already-admitted Agent may produce normal retained output before Stop completes.
- Support evidence: same normal exact-history and root Stop surfaces as AR-PREM-012. Root inspection and member projection are distinct real queries; server AgentOrgMemberRunViewProjectionService reads the exact Agent's retained conversation. Normal active execution is not suspended by observational history loading.
- Forward path: exact history selection -> readInspection obtains an active root view -> stageAgentOrgExecutionContext starts fetchProjection for that exact Agent -> server samples its conversation and response is delayed -> already-running Agent produces retained output -> user Stop completes -> independent inactive root inspection starts a new stage -> identical member query/variables reuse the old physical response -> new stage passes its own current Symbol and exact-ID checks -> publish assigns the old conversation-bearing candidate as final stopped content; when a matching previous context exists, adoptLocalContexts replaces its state with the same stale projection.
- Lifecycle preconditions and consequence: the first root query has already completed, its member query remains in flight, and output was durably recorded before completed Stop. No browser stream need be attached during initial hydration. Activity expectedRevision is captured after projection resolution, so it does not attest when server content was sampled. The obsolete stage itself may be rejected correctly; the new stage still consumes its response. Result is a stale final conversation, not durable loss or false root activity. A subsequent stopped-history click uses the historical open fast path, so it can expose and retain that stale view until another genuine cold read.
- Reachability: `Reachable`, source-supported normal inspect-and-stop workflow. AST-extracted helper plus installed-client diagnostic confirms sharing, not the production scenario or a hosted outcome.
- Review consequence: AR-FIND-009. Complete physical observation ownership for member projections consumed by the existing final inspection; retain exact identity, staged commit, draft/selection and failure behavior. No global client policy, new queue/epoch, server snapshot protocol or unrelated query sweep is justified.

## Unresolved Approved-Behavior Or Current-State Gaps

| Item | Why It Matters | Required Action | Status |
| --- | --- | --- | --- |
| AR-FIND-009: final member projection freshness | DS-037 final retained view can contain a pre-Stop sample under the normal inspect-and-stop path. | Correct the bounded hydration read contract and its deterministic regression; return revised design for review. | Design Impact; no Requirement Gap. |

## Review Decision

**Fail — Design Impact.** The demonstrated root-history correction and adjacent root-inspection correction are sound. One in-scope gap remains in the post-Stop final member-projection read; implementation of this revised package must wait for architecture recovery and independent re-review.

## Findings

### AR-FIND-009 — Final post-Stop inspection can reuse a pre-Stop member projection

- Type: `Design Impact`.
- Severity: `Medium` — incorrect retained presentation; no demonstrated durable loss, server reactivation or fifth API37 failure.
- Approved authority protected: BEH-004/006; REQ-016/031; AC-011/026; existing HIST-INSPECT-001/002 and DS-037 promise to retain the conversation and read final retained projection truth after confirmed termination.
- Scope status: `Within Approved Scope`.
- Changes approved behavior: `No`; no new user approval is required to preserve the already-approved stopped/history experience.
- Affected journey: a user opens an already-active offscreen Org and Stops it while its first member projection is still loading; normal active output can arrive at the server before completed Stop.
- Evidence: design DS-047 narrows independent requests to two history call sites and the root inspection; its file mapping restricts production edits to those two files. The history investigation expressly leaves member content reads outside that scope. Current `agentOrgContextHydration.ts:113–128,140–158,164–219` uses the same bound Apollo client and network-only exact member query without independent physical acquisition. `agentOrgContextsStore.ts:112–151,238–249` invalidates the old root candidate and stages a new one after Stop, but does not isolate the child request. `agentOrgExecutionContext.ts:129–147` adopts the newly staged conversation-bearing state. Root Stop remains exposed during initial loading in `WorkspaceAgentOrgHistoryCollection.vue:36–44`. Server member projection reads exact retained content in `agent-org-member-run-view-projection-service.ts:49–67`. Installed Apollo QueryManager keys in-flight work by query/variables unless overridden; a reviewer diagnostic using the unchanged actual member helper/document confirms one Link for both reads, versus two for a diagnostic scoped override.
- Material premise: `AR-PREM-013`; initiating product goal and complete current path above. Synthetic timing is confirming mechanism evidence only.
- Required update: extend the existing inspection/hydration observation contract so its post-Stop final member projections cannot inherit an earlier in-flight sample. Map the existing responsible file/caller and keep strict exact identity, current-generation/staging checks, final candidate atomic publication and failure retention. Add the explicit overlap case where the old root read has already completed but its member projection remains pending; verify final conversation/activities alongside inactive root, draft/selection and ordinary live/Team controls. Remove or qualify the explicit exclusion of this child read. Do not broaden to global deduplication disable or a new freshness framework.
- Proportionality: the gap is one existing read dependency inside the already-reviewed final-inspection spine. The same bounded physical-read principle suffices; no new owner, API/schema, persisted state, runtime algorithm, task policy or migration follows.
- Recommended recipient: `/software_engineering_team/architecture_designer` under the configured Fail rule. Keep the accepted history/root-inspection and IR058 parts; do not restart the overall architecture.

## Classification

`Design Impact` — incomplete final-inspection acquisition contract. No Requirement Gap or Product UI gate. Cumulative task_size=Large / architectural_risk=High; focused Medium/High remains appropriate.

## Recommended Recipient

`/software_engineering_team/architecture_designer` — revise AR-FIND-009 and return through the independent architecture-review route. No Implementation forwarding for this failed revised package.

## Residual Risks

- Independent requests still complete out of order: preserve latest success/error guards after all async work, immediate navigation publication and independent workspace-family results. Remove only the redundant inactive refresh; summary refresh remains.
- Real positive controls are mandatory: genuinely newer active evidence stays valid; pending/rejected Stop is not greyed; inactive configured Agent remains continuable but unready commands stay unavailable. Exact Agent status and passive mounted-Team aggregate remain distinct from root activity.
- Reviewer diagnostics are not durable real-store/browser regressions. Require implementation validation, selected source review, full cumulative API/E2E, successful proportional review of API-owned test changes and applicable Delivery gates. Renew direct/mounted ×1502/390 with new owned roots, never replay API37 roots or accept four cases as cumulative acceptance.
- API37 stays Fail69.3 (41 groups: 2 Pass, 37 Not Tested with partial evidence, 1 Fail, 1 N/A). Its 33 repo commands/434 distinct files/2645 tests are carried evidence, not new Architecture execution or overall acceptance. API36 narrow/post-consumption, API35 Restore body, API33 missing associations and CRR059/067, IR041, API27/29, DR007/009, API20, unknown stalls/native-worker limitations remain bounded/missing as recorded.
- AAV002 complete-package-only scope, AAV003 labels versus actual associations and API37 POSIX metadata disclosures remain separate. Do not fabricate old subscriber associations or evidence. IR049 actual-installation transition remains Architecture-owned before cutover, not a generic coding hold; no replay/reset/readiness claim.
- No Delivery/user/native-shell/AppImage/release readiness is claimed. Original Team source comparison does not prove original race immunity or authorize configured Team recursion/Org coordinator.

## Latest Authoritative Result

- Review Decision: `Fail` — `ARCH-REV-024` on `AD-REV-027@129c0e3867470e45a54700c6f5c4f7274a91fdba`.
- Material-Premise Gate (`Pass`/`Fail`/`Blocked`): `Pass` — current mechanism and finding trace to independently supported inspect/Stop paths. Adjacent member-content issue is not represented as observed API37 evidence.
- Notes: AR-FIND-009 is the sole new blocker. Keep prior passed scoped authority and the valid parts of DS-047; correct the final staged member read before implementation forwarding. This report is authoritative; prior Passes are not AD027 approval.
