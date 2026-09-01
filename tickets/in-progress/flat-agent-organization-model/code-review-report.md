# Code Review Report

## Review Round Meta

- Review Entry Point: `Implementation Review`
- Requirements Doc Reviewed As Context: `requirements-doc.md` (`RER-019`; approved behavior remains cumulative `RER-018`)
- Investigation Notes Reviewed As Context: `investigation-notes.md`
- Requirements Revision Record Reviewed As Context: `requirements-revision-record.md`
- Design Spec Reviewed As Context: `design-spec.md` (`AD-REV-006`)
- Supplemental Task Artifacts Reviewed As Context: `agent-org-contract.md`; approved `RV-012` / `VIS-001`–`VIS-020`; `BASELINE-PROMOTION-001`; `production_data_migration_conventions.md`
- Architecture Design Revision Record Reviewed As Context: `architecture-design-revision-record.md`
- Relevant Architecture Design Revision IDs: `AD-REV-006` (cumulative `AD-REV-001`–`AD-REV-005` retained)
- Design Review Report Reviewed As Context: `design-review-report.md`
- Architecture Review Revision Record Reviewed As Context: `architecture-review-revision-record.md`
- Relevant Architecture Review Revision IDs: `ARCH-REV-004 / Pass`
- Implementation Handoff Reviewed As Context: `implementation-handoff.md`
- Implementation Revision Record Reviewed As Context: `implementation-revision-record.md`
- Relevant Implementation Revision IDs: `IR-004` (cumulative `IR-001`–`IR-003` retained)
- Code Review Revision Record: `code-review-revision-record.md`
- Current Code Review Revision ID: `CRR-004`
- Current Review Round: `4`
- Trigger: IR-004 source commit `3d59992a4` and documentation commit `17c370e6e` returned after API/E2E `API-REV-001` exposed `ADI-007` and Architecture recovered it in `AD-REV-006` / `ARCH-REV-004`.
- Prior Review Round Reviewed: `CRR-003 / Pass`
- Latest Authoritative Round: `4`
- Coverage Investigation Reviewed: `api-e2e-coverage-investigation.md` and `API-REV-001` evidence as triggering context; no API/E2E pass is claimed.
- Execution Coverage Report Reviewed: `N/A — validation stopped at API-REV-001`
- API/E2E Revision Record Reviewed: `N/A — no canonical revision record supplied`
- Relevant API/E2E Revision IDs: `API-REV-001 / stopped for ADI-007`
- Delivery Revision Record Reviewed: `N/A — pending`
- Relevant Delivery Revision IDs: `N/A — pending`
- Triggering Scenario IDs: `API-E2E-005`; current reviewer scenarios `CR-SCN-004`–`CR-SCN-008`
- Reviewer Evidence: `/tmp/aorg-crr004-correlation-probe.log`; focused contract/server/web commands recorded below.

## Routing Classification Review

- Task size: `Large`
- Architectural risk: `High`
- Selected route: `Implementation Review`
- Independent source review required by the classification: `Yes`
- Classification evidence or correction required: Confirmed. IR-004 changes shared Agent presentation contracts, Team serialization, Org projection/stream/context/recovery, commands, contextual queries, accepted workspace surfaces, history lifecycle placement, and process history ordering.

## Review Scope

- Changed implementation and behavior reviewed: cumulative package at `17c370e6e`, with round-4 focus on `8e680617c..3d59992a4` and the `ADI-007` recovery.
- Files / areas reviewed: shared presentation and collaboration-stream contracts; Team compatibility composition; server Agent presentation admission, Org aggregate/projector/stream/command/reference/history paths; web Org hydration/context/stream, active-target facade, shared Agent/Team surfaces, contextual tools, reference viewers, token/trace paths, history stop; IR-004 tests and rendered evidence; prior findings; cumulative size/legacy/cleanup state.
- Explicit exclusions: external definition repositories remain read-only and outside ticket edits; untracked API/E2E artifacts remain owned by API/E2E; generated application SDK/Brief Studio `dist` directories are not attributed to IR-004; delivery remains pending.

## Independent Validation Performed

- Contract packages: Agent presentation `1/1`, collaboration stream `4/4`, Team stream `2/2` passed.
- Focused server: Org stream handler, cold-start history ordering, and Org reference content `3 files / 9 tests` passed.
- Focused web: Org stream state, Org workspace wrapper, active-context routing, and Org history stop `4 files / 12 tests` passed.
- Reviewer correlation witness: `3/3` passed while intentionally asserting current defective behavior—an out-of-Team coordinator is admitted and targeted, a communication event with an unknown sender is appended while the context remains live, and a mismatched target/command-type ACK completes a pending command. This is reproduction evidence, not desired-behavior validation.
- Static checks: `git diff --check` passed. The worktree returned to its incoming untracked-artifact state after the temporary reviewer test was removed.

## Upstream Behavior And Production-Path Basis Confirmation

- Approved requirements basis understood: Yes — `RER-019` / cumulative `RER-018`, `REQ-001`–`REQ-027`, `AC-001`–`AC-022`, and the approved Product/contract supplements remain authoritative.
- Design-spec behavior map verified against the implementation: Partially. The accepted Agent/Team workspace and root-stop correction is implemented, but the strict identity/correlation portion of `DS-016`–`DS-018` is incomplete.
- Design review report and round confirmed: `ARCH-REV-004 / Pass` over `AD-REV-006`.
- Behavior-basis status: `Contradicted by implementation`
- Changed or newly discovered behavior, if any: None. `CR-FIND-004` is a bounded implementation defect against already-approved strict stream/focus/command behavior.
- Remaining material ambiguity, if any: None.

| Behavior ID | Current Status | Current Implementation Path And Lifecycle Evidence | Contradicting Or Newly Discovered Supported Behavior Evidence |
| --- | --- | --- | --- |
| `BEH-001` | `Confirmed` | Exact Team V2/Org V1 definition admission and atomic authoring remain intact. | N/A |
| `BEH-002` | `Confirmed` | Root-neutral complete Org activation/configuration and no initial focus remain intact. | N/A |
| `BEH-003` | `Confirmed` | Root-first stable handoff order and exact same-root routing remain intact. | N/A |
| `BEH-004` | `Contradicted` | Valid snapshots select direct Agents and Team coordinators correctly, but a schema-valid snapshot whose Team coordinator points to another Org Agent is admitted; Team focus then targets that unrelated Agent. | `CR-FIND-004`; `CR-SCN-005` / `006`. |
| `BEH-005` | `Contradicted` | Strict family persistence/history/restore remains, but miscorrelated task/communication events and ACK identities do not enter the required browser recovery path. | `CR-FIND-004`; `CR-SCN-006`. |
| `BEH-006` | `Contradicted` | Raw JSON, duplicate Org header/composer, and member-header stop are removed, but the accepted workspace can still be fed a miscorrelated target/event instead of truthful recovery. | `CR-FIND-004`. |
| `BEH-007` | `Confirmed` | Required startup migration mechanics and external read-only boundaries are unchanged from the verified IR-003 result. | N/A |
| `BEH-008` | `Contradicted` | Team V2 remains separate and compatible; the Org V1 wire branch is shape-strict but not fully identity-correlated at the browser admission/reducer boundary. | `CR-FIND-004`; `REQ-025`, `DS-016`–`DS-018`. |
| `BEH-009` | `Confirmed` | Task delegation remains root/host-scoped and recursively task-owned; no configured recursion was reintroduced. | N/A |
| `BEH-010` | `Confirmed` | Normal definition admission remains target-only; migration-private legacy decoding is unchanged. | N/A |

## Supported Product Scenario And Reachability Gate (Mandatory)

| Scenario ID | Related Behavior / Contract IDs | Kind | Actor / Initiator | Coherent Goal Or Governing Event | Supported Entry Surface / Event | Scenario Shape | Forward Production Path / Lifecycle | Expected Outcome / Consequence | Independent Evidence | Scenario Validity | Review Use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-SCN-001` | `BEH-007`; `REQ-012`, `REQ-013`; migration convention | `System / Contract` | Required startup migration | Convert fixed-depth sources and reject an unexpected precondition violation before writes. | Registered startup migration. | `Explicit Edge` | runner -> complete preflight -> write or failed disposition | Unexpected deeper input is byte-faithful with an exact reason. | Approved migration contract; CRR-003 evidence. | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-002` | `BEH-007`; `AR-PREM-001` | `Operational` | Process interruption and later startup | Resume the approved incomplete-attempt category. | Termination after prospective output, then ordinary startup. | `Explicit Edge` | prospective output -> termination -> retry recognition -> commit/cleanup | Retry succeeds without a journal/runtime fallback. | Migration convention; CRR-003 probes/tests. | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-003` | `BEH-001`, `BEH-002`, `BEH-006` | `User` | AgentOrg author | Edit visible Org fields without clearing hidden durable state. | `/agent-orgs` edit journey. | `Normal` | component -> partial update -> atomic provider transaction | Omitted durable fields remain unchanged. | Approved Product journey; CRR-003 source/test evidence. | `Supported Normal Scenario` | `Use` |
| `CR-SCN-004` | `BEH-004`–`006`; `REQ-004`, `REQ-016`, `REQ-019`; `VIS-017` | `User` | User with a live AgentOrg | Focus a direct Agent, send a prompt, and read the answer in the accepted Agent workspace. | Active Org workspace and exact sidebar Agent selection. | `Normal` | Org route -> context -> active target -> shared Agent surface -> exact command -> typed event -> AgentContext | Normal conversation/composer, no raw protocol or duplicate Org surface. | Approved Product package; `API-E2E-005`; IR-004 real Codex render evidence. | `Supported Normal Scenario` | `Use` |
| `CR-SCN-005` | `BEH-004`, `BEH-006`; `REQ-004`; `VIS-018`; `DS-017` | `User` | User with a live AgentOrg | Focus a direct mounted Team or its Agent and interact through the accepted Team surface. | Active Org sidebar Team/Agent selection and accepted composer/tool actions. | `Normal` | exact selection -> Team coordinator/member -> `ActiveAgentWorkspaceTarget` -> Org interaction port -> exact Agent command/ACK | Team focus targets only its stored direct-Agent coordinator; command completion is correlated to the exact command type and Agent. | Approved Product/design; existing Team exact-target contract. | `Supported Normal Scenario` | `Use` |
| `CR-SCN-006` | `BEH-004`–`006`, `BEH-008`; `REQ-025`; `DS-016`–`DS-018` | `Contract` | Strict AgentOrg stream boundary | Reject an unknown, malformed, miscorrelated, or sequence-gapped Org message. | AgentOrg WebSocket server-message contract while an Org context is open. | `Explicit Edge` | server frame -> strict parser/correlation -> context reducer or rejection -> `reopen_required` -> checkpoint hydration | No wrong target/event/ACK is admitted; last committed context remains visible and recovery is required. | `design-spec.md` supported-scenario row at the strict presentation contract; `ARCH-REV-004`; Team recovery contract. | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-007` | `BEH-005`, `BEH-006`; `REQ-016`; `DS-019` | `User` | Operator of an active Org | Stop the complete Org from the root history row. | AgentOrg history active root row. | `Normal Lifecycle` | history row -> Org store/service -> whole-root termination | Root pending/error parity; no focused-member or mounted-Team stop. | Approved design and Product boundary; IR-004 source/render/tests. | `Supported Normal Scenario` | `Use` |
| `CR-SCN-008` | `BEH-005`, `BEH-006`; history derivation contract | `System` | First Org launch in a cold data root | Initialize derived history before publishing a new current package. | `createAgentOrgRun`. | `Normal` | service -> history initialize -> manager create/package publish -> history record | First launch succeeds without rediscovering its package as a prior row. | Current history owner contract; focused regression. | `Supported Normal Scenario` | `Use` |

### Candidate Finding And Mechanism Gate

| Candidate ID | Observation Or Mechanism | Scenario / Contract ID | Independent Trigger | Forward Path / Lifecycle / Consequence | Evidence | Disposition | Reason / Proportionate Response |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-CAND-001` | Prior definition migration mutated an earlier child before complete preflight. | `CR-SCN-001` | Registered migration encounters an unexpected later child. | IR-003 still plans the complete item before the first write. | Source unchanged since CRR-003; prior probe/test evidence remains valid. | `Promote` | Verified resolved; no new machinery. |
| `CR-CAND-002` | Prior migration could not resume exact prospective definition output. | `CR-SCN-002` | Approved interruption/relaunch category. | IR-003 prospective recognition and ordinary retry remain unchanged. | Source unchanged; prior subprocess/focused tests remain valid. | `Promote` | Verified resolved through the existing runner. |
| `CR-CAND-003` | Prior Org edit cleared hidden durable fields. | `CR-SCN-003` | User saves an existing nonempty Org. | Edit still sends visible fields only; backend preserves omission. | Source unchanged; prior focused test remains. | `Promote` | Verified resolved. |
| `CR-CAND-004` | API-REV-001 raw/opaque Org dashboard, bespoke composer/header, and member-header root stop. | `CR-SCN-004`, `CR-SCN-005`, `CR-SCN-007` | Real focused Org prompt and root lifecycle actions. | IR-004 now projects typed Agent messages into one Org context, reuses accepted surfaces, and places Stop Org only on the history root row. | Source trace; 70 implementation tests; reviewer 12 focused web tests; real Codex/render evidence. | `Promote` | `ADI-007` presentation/lifecycle symptom is verified resolved. |
| `CR-CAND-005` | Org stream admission validates shapes but not every identity relationship: Team coordinator membership is unchecked; task/communication events mutate without current-context correlation; pending ACKs retain no expected target/type. | `CR-SCN-005`, `CR-SCN-006`; strict `DS-016`–`DS-018` contract | The established strict AgentOrg transport receives a schema-shaped but miscorrelated snapshot, event, or command ACK while the context is open. | Parser accepts -> Team focus can use a global unrelated Agent; task/message state can be appended from unknown identities; mismatched ACK can resolve a different pending command -> no `reopen_required`. | `root-execution-view-dtos.ts:35-119,121-137`; `agentOrgExecutionContext.ts:98-158,161-202`; `agentOrgStreamingService.ts:19-24,136-149,169-172,209-215`; `/tmp/aorg-crr004-correlation-probe.log` (`3/3` reproduction). | `Promote` | Established explicit failure contract and exact-target normal journey are contradicted. Bounded correlation checks and focused regressions are proportionate; no design revision or new recovery subsystem is needed. |
| `CR-CAND-006` | First-launch history initialization occurred after package publication during IR-004 development. | `CR-SCN-008` | First supported Org launch in a cold data root. | Current service initializes derived history before manager publication. | `agent-org-run-service.ts`; reviewer focused server tests `9/9`, including history-order `1/1`. | `Promote` | Verified resolved in current source. |

## Structural / Design Checks

| Check | Result | Evidence | Required Action |
| --- | --- | --- | --- |
| Task design health assessment is present, evidence-backed, and preserved by the implementation | `Pass` | Large/High and `Refactor Needed Now` remain explicit; IR-004 follows the selected structural recovery. | None. |
| Implementation matches approved behavior-defining supplemental artifacts | `Fail` | Accepted surfaces/root-stop match; strict snapshot/event/ACK identity handling does not match AD-REV-006. | Resolve `CR-FIND-004`. |
| Data-flow spine inventory clarity and preservation under shared principles | `Fail` | `DS-016`–`DS-018` are clear, but some miscorrelated frames bypass rejection/recovery. | Complete the existing correlation stage before mutation/ack completion. |
| Ownership boundary preservation and clarity | `Pass` | Agent presentation, subject envelope, Org aggregate/context, active target, and shared surfaces have distinct owners. | None. |
| Off-spine concern clarity | `Pass` | Projection, hydration, reference content, token/trace browse, and history stay attached to clear subject owners. | None. |
| Existing capability/subsystem reuse check | `Pass` | Existing Agent projector, accepted Agent/Team surfaces, Team context port, history action, and root-neutral runtime are reused. | None. |
| Reusable owned structures check | `Pass` | Root-neutral Agent message/token bodies are extracted below Team and Org envelopes. | None. |
| Shared-structure/data-model tightness check | `Fail` | Shapes are closed and subject-specialized, but the Org snapshot model omits the Team coordinator-to-own-member invariant and event/ACK correlation state is incomplete. | Resolve `CR-FIND-004`; keep Team outer wire unchanged. |
| Repeated coordination ownership check | `Pass` | One Org context/stream owns hydration, sequencing, focus, and recovery; components do not repeat protocol logic. | None. |
| Empty indirection check | `Pass` | New adapters/surfaces translate or own real policy; no pass-through-only boundary was found. | None. |
| Scope-appropriate separation of concerns and file responsibility clarity | `Pass` | Contract, adapter, projector, context, stream, surface, and history responsibilities are coherent. | None. |
| Ownership-driven dependency check | `Pass` | Shared presentation is below subject contracts; mounted Teams do not import/register Team root authority. | None. |
| Authoritative Boundary Rule check | `Pass` | Components use active-target/context ports; no reviewed caller combines an owning subject boundary with its private store/manager/socket. | None. |
| File placement check | `Pass` | New files reside under their owning contract, server subject, web context, workspace surface, or history area. | None. |
| Flat-vs-over-split layout judgment | `Pass` | The 69 IR-004 production files reflect real cross-subsystem owners without artificial micro-wrappers. | None. |
| Interface/API/query/command/service-method boundary clarity | `Fail` | Compound Org browse/query identities are clear, but ACK completion and non-Agent event admission do not enforce their declared identity fields. | Resolve `CR-FIND-004`. |
| Naming quality and naming-to-responsibility alignment check | `Pass` | Presentation, context, target, interaction, browse, and history names align with their responsibilities. | None. |
| No unjustified duplication of code / repeated structures in changed scope | `Pass` | Raw Org dashboard and duplicate surface authority are removed; shared accepted surfaces replace duplicate markup. | None. |
| Patch-on-patch complexity control | `Pass` | IR-004 replaces the parallel path rather than layering a fallback; recovery remains one checkpointed context. | None. |
| Dead/obsolete code cleanup completeness in changed scope | `Pass` | Raw Org event rendering, bespoke composer/header, direct component send path, and member-header root stop are absent. | None. |
| Relevant test scenarios and assertions are clear and requirement-aligned | `Fail` | Current tests cover malformed JSON/order/reopen atomics and valid UI states, but omit semantic snapshot/event/ACK correlation; the reviewer probe exposes all three gaps. | Add focused negative correlation tests with the fix. |
| Test fixtures/helpers are reasonably reusable and test structure remains coherent | `Pass` | Contract fixtures and Team/workspace context builders are appropriately scoped. | None. |
| No stale, duplicated, or compatibility-only tests are retained in changed scope | `Pass` | No obsolete raw-dashboard test remains; Team tests still exercise current behavior. | None. |
| API/E2E readiness for the next workflow stage | `Fail` | ADI-007 rendering is corrected, but the strict Org stream contract can still silently mis-target or accept bad state. | Return to Implementation; do not resume API/E2E until re-review passes. |

## Source File Size And Structure Audit (If Applicable)

Audit method: cumulative production implementation changes from `f3035a2d5..HEAD`; `.ts/.tsx/.js/.mjs/.vue`, excluding tests, fixtures, `test-support`, and `dist`. Result: `344` files, `52` signals over 220 effective non-empty lines, `0` over 500. IR-004 alone: `69` production files, `10` signals over 220, `0` over 500.

| Source File / Cohort | Effective Non-Empty Lines | `>500` Hard-Limit Check | `>220` Delta Check | SoC / Ownership Check | Placement Check | Preliminary Classification | Required Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `app-config.ts`; Agent manager/autobyteus backend/Claude session | `500`, `498`, `498`, `492` | `Pass` | Signal | Existing cohesive owners with bounded ticket deltas. | Pass | `Pass` | None. |
| Root Team; Team form; application provider; migration; Team manager; token store; Agent provider | `478`, `455`, `453`, `445`, `443`, `436`, `424` | `Pass` | Signal | Existing or focused owners; no newly conflated concern. | Pass | `Pass` | None. |
| Flat-Team manager; standalone host; Codex bootstrapper; presentation adapter; process supervisor | `381`, `373`, `371`, `369`, `364` | `Pass` | Signal | Cohesive execution/admission/lifecycle owners. | Pass | `Pass` | None. |
| Team GraphQL; Org aggregate; composition; history queries; scope builder; Org experience; predecessor migration; task engine; launch baseline | `349`–`313` | `Pass` | Signal | Broad but responsibility-aligned existing/new owners. | Pass | `Pass` | None. |
| Configured Agent handle through handoff manager (nine files) | `292`–`263` | `Pass` | Signal | Cohesive runtime/store/API/UI owners. | Pass | `Pass` | None. |
| `agentOrgStreamingService.ts`; active context; Team/Org task adapters; Team projector/panel; `agentOrgExecutionContext.ts` | `257`, `256`, `252`, `251`, `243`, `242`, `240` | `Pass` | Signal | File responsibilities are coherent; the two Org browser owners contain the correlation defect. | Pass | `Local Fix` for Org context/stream | Resolve `CR-FIND-004`; no size-driven split required. |
| Remaining eleven signals: Team index/service/memory; Agent projector/router; shared schema/location/persistence/registry/classifier/discovery | `234`–`222` | `Pass` | Signal | Existing/focused owners; no actionable structural pressure. | Pass | `Pass` | None. |
| `autobyteus-collaboration-stream-contracts/src/root-execution-view-dtos.ts` | `141` | `Pass` | Pass | Correct contract owner, but missing coordinator membership correlation. | Pass | `Local Fix` | Resolve `CR-FIND-004`; no split required. |

## Legacy / Backward-Compatibility Verdict

| Check | Result | Notes |
| --- | --- | --- |
| No backward-compatibility mechanisms in changed scope | `Pass` | Shared Agent bodies preserve Team semantics without a dual runtime parser. |
| No legacy old-behavior retention in changed scope | `Pass` | Raw Org dashboard and send-only path are removed; migration-only legacy decoding remains isolated. |
| Dead/obsolete code cleanup completeness in changed scope | `Pass` | No actionable retired Org component/store/socket path remains. |
| Approved persisted-data transition decision is followed without unnecessary migration work | `Pass` | IR-004 changes no durable family or migration mechanics. |
| No version-specific dual reads/writes or request-time old-shape fallback exists | `Pass` | Current Team/Org readers remain family-specific. |
| Approved transition mechanics match the reviewed design, including migration safety only when required | `Pass` | IR-003 migration corrections remain unchanged and verified resolved. |

## Dead / Obsolete / Legacy Items Requiring Removal (Mandatory If Any Exist)

None.

## Docs-Impact Verdict

- Docs impact: `Yes`
- Why: The cumulative Large/High cutover changes public Team/Org definitions, runtime, stream/query contracts, product workflows, and migration behavior. IR-004 documentation already records the intended presentation recovery, but final delivery synchronization remains pending.
- Files or areas likely affected: server/web AgentOrg and AgentTeam architecture/user docs, strict stream/command/query contracts, migration guidance, and final ticket artifacts.

## Additional Material Premise Validation (When Required)

### Upstream Design-Review Material-Premise Decisions

| Premise ID | Current Status | Changed Evidence / Reason |
| --- | --- | --- |
| `AR-PREM-001` | `Confirmed` | Approved migration interruption/relaunch behavior remains unchanged and resolved. |
| `AR-PREM-002` | `Confirmed` | Arbitrary corruption/tampering remains unsupported and drives no finding or machinery. `CR-FIND-004` does not rely on that premise; it relies on the separately approved strict stream failure contract. |
| `AR-PREM-003` | `Confirmed` | Subject fail-stop for indeterminate durable finalization remains unchanged. |

No new or reclassified premise is required. `CR-SCN-006` is already an explicit supported contract-failure scenario in `AD-REV-006`; the reviewer did not infer it from the probe.

## Review Scorecard (Mandatory)

- Overall score (`/10`): `8.9/10`
- Overall score (`/100`): `88.4/100`
- Score calculation note: Simple average of the ten mandatory categories. The decision is `Fail` because five categories remain below the `9.0` clean-pass threshold and `CR-FIND-004` is open.

| Priority | Category | Score | Why This Score | What Is Weak / Holding It Down | What Should Improve |
| --- | --- | --- | --- | --- | --- |
| `1` | `Data-Flow Spine Inventory and Clarity` | `8.8` | The intended presentation, interaction, hydration, and history spines are clear and mostly implemented. | Semantic identity failures can skip the rejection/recovery branch in `DS-016`–`DS-018`. | Correlate every snapshot/event/ACK relationship before mutation or completion. |
| `2` | `Ownership Clarity and Boundary Encapsulation` | `9.2` | One Org aggregate/context and shared accepted surfaces replace the duplicate dashboard; mounted Teams remain rootless. | No material ownership weakness beyond the local validation omission. | Preserve current owners while fixing their invariants. |
| `3` | `API / Interface / Query / Command Clarity` | `8.4` | Compound browse/query identities and closed message shapes are strong. | Declared coordinator, event, command-type, and target identities are not all enforced. | Make correlation executable at the owning contract/context/command boundary. |
| `4` | `Separation of Concerns and File Placement` | `9.1` | Contracts, adapters, projectors, contexts, surfaces, and history remain responsibility-aligned. | Broad scope creates density but not an actionable split. | Keep fixes local; do not add another recovery owner. |
| `5` | `Shared-Structure / Data-Model Tightness and Reusable Owned Structures` | `8.8` | Root-neutral Agent detail extraction is semantically tight and Team specialization remains separate. | Org snapshot/event/ACK semantics are shape-strict but incompletely correlated. | Add the missing semantic refinements/pending identity state. |
| `6` | `Naming Quality and Local Readability` | `9.0` | Names consistently expose subject, presentation, target, browse, context, and lifecycle responsibilities. | Some dense one-line contract declarations slow review. | Preserve explicit names and format future refinements readably. |
| `7` | `API/E2E Readiness` | `8.2` | Builds and broad focused tests/rendered journeys pass; prior raw UI is corrected. | Core negative identity cases are uncovered and currently fail the approved contract. | Fix and re-review before API/E2E resumes. |
| `8` | `Runtime Correctness And Behavioral Fidelity` | `8.3` | Valid direct-Agent/Team/live-conversation/root-stop paths behave correctly. | Miscorrelated snapshot/event/ACK frames can silently target or mutate the wrong state instead of recovery. | Resolve `CR-FIND-004` with focused regressions. |
| `9` | `No Backward-Compatibility / No Legacy Retention` | `9.3` | Team compatibility is achieved by shared current contracts, not legacy runtime branches; migration knowledge stays private. | Migration necessarily retains approved old-shape knowledge. | Keep that isolation. |
| `10` | `Cleanup Completeness` | `9.3` | Raw/opaque Org rendering, duplicate header/composer, direct component socket path, and member-header stop are removed. | No material cleanup gap found. | Preserve absence through tests. |

## Findings

### `CR-FIND-004` — High — Strict AgentOrg stream identity correlation is incomplete

- Candidate gate: `CR-CAND-005 / Promote`
- Affected approved behavior: `BEH-004`, `BEH-005`, `BEH-006`, `BEH-008`; `REQ-004`, `REQ-016`, `REQ-025`; `DS-016`–`DS-018`; `CR-SCN-005`, `CR-SCN-006`.
- Supported trigger and path: The approved strict AgentOrg transport contract explicitly treats an unknown, malformed, **miscorrelated**, or sequence-gapped message as a supported contract failure. The active Org WebSocket parses the frame, correlates it to the current context, and must either apply it to the exact target or enter `reopen_required` and checkpoint recovery.
- Evidence:
  1. `root-execution-view-dtos.ts:35-119` correlates root, duplicate identities, task/message sidecars, and statuses, but never requires a configured Team's `coordinatorAddress` to identify one of that Team's own direct Agent members.
  2. `agentOrgExecutionContext.ts:109-153` accepts Team focus when the coordinator exists anywhere in the global Org address map; a miscorrelated Team coordinator can therefore target an unrelated direct Org Agent or another Team's Agent while presenting the selected Team.
  3. `agentOrgExecutionContext.ts:181-202` appends task and communication events without checking their delegator/execution/sender/receiver identities against the current context, unlike the exact Agent-presentation branch.
  4. `agentOrgStreamingService.ts:19-24,136-149,209-215` stores only callbacks/timeouts for a pending command and resolves by `command_id` alone, ignoring the ACK's declared `command_type` and `target_agent_run_id`.
  5. `/tmp/aorg-crr004-correlation-probe.log` records a `3/3` reproduction of the current wrong behavior. The probe intentionally asserted observation: cross-Team coordinator targeting, unknown-sender message admission, and mismatched ACK completion.
- Material consequence: Under the exact failure lifecycle the architecture specifically requires the browser to contain, Team focus can address the wrong Agent, task/message presentation can accept state from identities outside the current Org context, and a command promise can report success for a different target/type. None enters the visible recovery path, so the last known-good context is no longer the only committed authority.
- Required action: Within the existing contract/context/stream owners, (a) validate every configured Team coordinator against that Team's direct Agent members before snapshot publication; (b) correlate task and communication event identities/execution address against the current context before mutation and route mismatch through the existing `reopen_required` path; (c) retain expected command type and target with pending commands and never complete a mismatch, using the reviewed failure behavior without adding a second recovery system; and (d) add focused negative tests for all three cases plus unchanged valid Team/Agent/command paths.
- Classification: `Local Fix` — the reviewed design and requirements are complete; the defect is bounded to implementation-owned validation/reducer state and tests.

`CR-FIND-001`, `CR-FIND-002`, and `CR-FIND-003` remain resolved; see `CRR-004` prior-finding resolution.

## Classification

- `Local Fix`

## Recommended Recipient

- `implementation_engineer`
- API/E2E must not resume until the correction returns through independent source review and passes.

## Residual Risks

- Independent API/E2E remains stopped at `API-REV-001`; after the local fix and source-review pass it must repeat real imported-package/Codex/browser, checkpoint recovery, contextual identity, lifecycle, Team compatibility, and migration/persistence evidence.
- Team outer-wire preservation is strongly supported by source composition and current integration/package tests, but the architecture-requested broader golden coverage remains valuable downstream.
- The repository-wide Nuxt typecheck remains broadly red. Its log also contains one diagnostic in the ticket-created `AgentOrgExperience.spec.ts`; it is not the basis of `CR-FIND-004`, and no full typecheck pass is claimed.
- External definition publication remains separately owned; incompatible external definitions remain capability-scoped unavailable.

## Latest Authoritative Result

- Review Decision: `Fail`
- Review Entry Point: `Implementation Review`
- Supported Product Scenario Gate: `Pass`
- Material-Premise Gate: `Pass`
- Score Summary: `8.9/10 (88.4/100)`; `Data-Flow`, `API/Interface`, `Shared-Model`, `API/E2E Readiness`, and `Runtime Correctness` are below the clean-pass target.
- Failure Origin: `Implementation defect against the approved strict AgentOrg stream/focus/command correlation contract.`
- Recommended Recipient: `implementation_engineer`
- Notes: IR-004 resolves the visible `ADI-007` raw-dashboard and lifecycle-placement problem, but source review cannot pass while schema-shaped miscorrelated frames silently target/mutate/complete instead of using the existing recovery path.
