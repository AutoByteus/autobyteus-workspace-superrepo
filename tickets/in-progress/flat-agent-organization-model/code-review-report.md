# Code Review Report

## Review Round Meta

- Review Entry Point: `Implementation Review`
- Requirements Doc Reviewed As Context: `requirements-doc.md` (`RER-019`; behavior remains cumulative `RER-018`)
- Investigation Notes Reviewed As Context: `investigation-notes.md`
- Requirements Revision Record Reviewed As Context: `requirements-revision-record.md`
- Design Spec Reviewed As Context: `design-spec.md` (`AD-REV-006`, cumulative `AD-REV-005`)
- Supplemental Task Artifacts Reviewed As Context: `agent-org-contract.md`; approved Product `RV-012` / `VIS-001`–`VIS-020`; `BASELINE-PROMOTION-001`; `production_data_migration_conventions.md`
- Architecture Design Revision Record Reviewed As Context: `architecture-design-revision-record.md`
- Relevant Architecture Design Revision IDs: `AD-REV-006`
- Design Review Report Reviewed As Context: `design-review-report.md`
- Architecture Review Revision Record Reviewed As Context: `architecture-review-revision-record.md`
- Relevant Architecture Review Revision IDs: `ARCH-REV-004 / Pass`
- Implementation Handoff Reviewed As Context: `implementation-handoff.md`
- Implementation Revision Record Reviewed As Context: `implementation-revision-record.md`
- Relevant Implementation Revision IDs: `IR-006` (cumulative `IR-001`–`IR-005` retained)
- Code Review Revision Record: `code-review-revision-record.md`
- Current Code Review Revision ID: `CRR-006`
- Current Review Round: `6`
- Trigger: IR-006 source commit `d045e55e0` and artifact commit `2fd846fdd` returned after `CRR-005 / CR-FIND-004 / CR-FIND-005` Local Fix.
- Prior Review Round Reviewed: `CRR-005 / Fail — Local Fix`
- Latest Authoritative Round: `CRR-006`
- Coverage Investigation Reviewed: `api-e2e-coverage-investigation.md` as prior stopped-validation context
- Relevant API/E2E Revision IDs: `API-REV-001 / stopped; no pass`
- Delivery Revision Record / IDs: `N/A — pending`
- Failing Scenario IDs: `CR-SCN-011`
- Exact Reviewer Commands / Execution Mode: full web Vitest run (including one temporary reviewer witness), focused exact AgentOrg streaming Vitest run, cumulative source-size/static audit, `git diff --check`
- Failure Evidence Paths: `/tmp/aorg-crr006-stale-socket-focused.log`; `/tmp/aorg-crr006-stale-socket-probe.patch`; `/tmp/aorg-crr006-stale-socket-probe.log`; implementation evidence listed in `implementation-handoff.md`

## Routing Classification Review

- Task size: `Large`
- Architectural risk: `High`
- Selected route: `Implementation Review`
- Independent source review required by the classification: `Yes`
- Classification evidence or correction required: Confirmed. The cumulative package changes shared Team/Org contracts, execution, persistence/migration, projection/stream recovery, accepted workspace surfaces, and lifecycle behavior. No classification correction is required.

## Review Scope

- Changed implementation and behavior reviewed: the complete cumulative implementation from approved requirements baseline `f3035a2d5..2fd846fdd`, not only the IR-006 delta. This full round was intentional after repeated Local Fixes. Round priority remained the IR-006 fresh-task identity/hydration correction and its interaction with the cumulative checkpointed stream state machine.
- Files / areas reviewed: strict Team V2/Org V1 contracts; definition admission and startup migration; Org task engine/adapter/persistence/event publication; root event barrier and websocket handler; Org snapshot/hydration/context/streaming; command/focus/reference/workspace adapters; standalone Team preservation; presentation cleanup; current tests and validation evidence; all cumulative changed-source size signals.
- Explicit exclusions: separately maintained external definition repositories remain read-only; incoming API/E2E artifacts and generated application `dist` directories are untracked and not attributed to IR-006; delivery remains pending.

## Independent Validation Performed

- Rechecked every prior finding first. IR-006 now admits configured-address reuse by fresh task executions while keeping configured placements and run identities exact; task activation enters the existing checkpoint path; task-bearing hydration succeeds. The repaired store-neutral Team focus/send workflow passes.
- Reviewed the cumulative production paths and structural boundaries rather than limiting the round to `f6e60dec0..d045e55e0`. Static cleanup searches found no retired mixed-Team model, raw/opaque Org presentation path, duplicate Org dashboard/composer, mounted-Team root registration, or Team-inside-Team configured authority.
- Cumulative source audit from `f3035a2d5..HEAD`: `344` changed production-source files, `52` signals above 220 effective non-empty lines, `0` above 500. All signals were assessed; the changed AgentOrg context/stream owners remain cohesive, though the repeated recovery patches expose the session-transition gap in `CR-FIND-006`.
- Cross-checked IR-006 evidence: collaboration contracts `6/6`; focused server `4 files / 23 tests`; focused web `11 files / 50 tests`; server and web production builds passed. The broad Nuxt typecheck retains the documented repository baseline with no IR-006 changed-path diagnostic.
- Reviewer full web run, temporarily including one additional streaming witness: `438` files passed, `1` failed, `2` skipped; `2413` tests passed, `1` failed, `2` skipped. The sole failure is the established unrelated fixed-px audit. The IR-006 Team workflow and normal changed suites pass.
- Reviewer focused stream run: `7/7` passed. The seventh temporary witness deliberately asserts the current wrong behavior: a valid post-activation presentation frame already queued from the retiring socket is processed after the replacement socket is installed, reports “before the snapshot barrier,” and closes the replacement before it can publish a candidate (`/tmp/aorg-crr006-stale-socket-focused.log`, exact patch in `/tmp/aorg-crr006-stale-socket-probe.patch`).
- `git diff --check` passed. The temporary test was restored; the worktree returned to the incoming untracked-artifact state before report updates.

## Upstream Behavior And Production-Path Basis Confirmation

- Approved requirements basis understood: `RER-019` / cumulative `RER-018`, particularly `REQ-014`–`REQ-016`, `REQ-025`, `AC-009`–`AC-011`.
- Design-spec behavior map verified against the implementation: Partial. Definition, runtime, migration, identity, presentation, focus, command, and fresh-task snapshot shapes match. The normal task activation-to-recovery path contradicts `DS-018` because queued work is not correlated to the websocket/session that owned it.
- Design review report and round confirmed: `ARCH-REV-004 / Pass` over `AD-REV-006`.
- Behavior-basis status: `Contradicted`
- Changed or newly discovered behavior: None. The defect occurs inside the already-approved normal fresh-task lifecycle and explicit checkpoint recovery contract.
- Remaining material ambiguity: None.

| Behavior ID | Current Status | Current Implementation Path And Lifecycle Evidence | Contradicting Evidence |
| --- | --- | --- | --- |
| `BEH-001` | `Confirmed` | Strict Org-only composition and Agent-only Teams remain enforced. | — |
| `BEH-002` | `Confirmed` | One Org root still owns configured Agents, mounted Teams, tasks, lifecycle, and restore. | — |
| `BEH-003` | `Confirmed` | Ordered same-root handoffs and target-only routing remain. | — |
| `BEH-004` | `Confirmed` | Org stays coordinator-free; exact Team focus uses the selected Team's stored direct coordinator. | — |
| `BEH-005` | `Contradicted` | Strict tree/task identity and task-bearing snapshot admission are fixed. | During an ordinary task activation, the committed browser view can remain stuck in `reopen_required` because a retired-socket frame closes the candidate replacement stream. |
| `BEH-006` | `Contradicted` | Accepted Agent/Team surfaces and truthful authoring/history remain. | The live task result cannot reliably reach those surfaces through the approved recovery lifecycle. |
| `BEH-007` | `Confirmed` | Migration/external ownership remains unchanged from resolved CRR-003 evidence. | — |
| `BEH-008` | `Confirmed` | Team V2 and Org V1 remain exact; IR-006 correctly scopes configured-address uniqueness separately from task run identity. | — |
| `BEH-009` | `Contradicted` | The server creates and publishes the fresh task correctly. | Immediate task work can publish a valid follow-on frame while the browser's activation checkpoint is in flight; the frame is applied to replacement session state instead of retired-session state. |
| `BEH-010` | `Confirmed` | Exact target definition admission and migration-private legacy decoding remain. | — |

## Supported Product Scenario And Reachability Gate (Mandatory)

| Scenario ID | Related Behavior / Contract IDs | Kind | Actor / Initiator | Coherent Goal Or Governing Event | Supported Entry Surface / Event | Scenario Shape | Forward Production Path / Lifecycle | Expected Outcome / Consequence | Independent Evidence | Scenario Validity | Review Use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-SCN-001` | `BEH-007`; `REQ-012/013`; migration convention | `Operational` | Startup migration runner | Reject unexpected deep source without mutation | Registered startup migration | `Explicit Edge` | full preflight -> failure disposition | byte-faithful source and bounded reason | CRR-003 and convention | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-002` | `BEH-007`; `AR-PREM-001` | `Operational` | Later ordinary application startup | Resume an interrupted one-level migration | `runPending()` startup | `Explicit Edge` | prospective-state recognition -> commit/cleanup | valid target, retired source removed | CRR-003 and convention | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-003` | `BEH-001/003/006`; `REQ-023` | `User` | Org author | Edit an existing Org without losing hidden durable fields | `/agent-orgs` edit/save | `Normal` | visible draft -> partial update -> atomic package save | omitted durable fields preserved | Product/requirements and CRR-003 | `Supported Normal Scenario` | `Use` |
| `CR-SCN-004` | `BEH-004/006`; `REQ-004/016/019`; `VIS-017` | `User` | User with active Org | Focus a direct Agent and converse | Org workspace Agent selection/composer | `Normal` | focus -> exact target/port -> command/events -> shared Agent surface | normal conversation, no raw dashboard | Product/requirements and IR-004 evidence | `Supported Normal Scenario` | `Use` |
| `CR-SCN-005` | `BEH-004/006`; `REQ-003/004/011`; `VIS-018` | `User` | User with active Org | Focus a mounted Team or Team Agent | Org workspace Team selection | `Normal` | Team row -> stored coordinator/member -> Team view/target | exact accepted Team workspace | Product/requirements and current code | `Supported Normal Scenario` | `Use` |
| `CR-SCN-006` | `BEH-005/006/008`; `REQ-025`; `DS-016`–`DS-018` | `Contract` | Strict Org stream | Recover from malformed, miscorrelated, or gapped current-session input | Stream admission failure | `Explicit Edge` | reject -> `reopen_required` -> checkpoint/snapshot candidate -> atomic swap | committed context preserved; no raw fallback | reviewed `AD-REV-006` contract | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-007` | `BEH-005/006`; `REQ-016`; `DS-019` | `User` | Operator | Stop an active whole Org | active Org history root row | `Normal` | stop guard -> root terminate -> history/context cleanup | whole-root stop only | requirements/design/Product | `Supported Normal Scenario` | `Use` |
| `CR-SCN-008` | `BEH-005/006`; history contract | `System` | First Org launch in a cold data root | Publish launch history in correct order | Org run service launch | `Normal` | initialize history -> publish package/run | launch visible without ordering failure | IR-004 source/regression | `Supported Normal Scenario` | `Use` |
| `CR-SCN-009` | `BEH-005/006/008/009`; `REQ-015`; `AC-010`; `DS-005/008` | `User` | Live Org Agent through bound `delegate_task` | Delegate work to a configured Agent or flat Team | bound task tool | `Normal` | fresh run at configured recipient -> durable tree/record -> activation -> task work/settlement | synchronized task lifecycle under same Org | requirements, contract, task engine/adapter | `Supported Normal Scenario` | `Use` |
| `CR-SCN-010` | `BEH-006/009`; `REQ-011/015` | `User` | Standalone Team user | Inspect delegated task detail and continue messaging focused configured Agent | Team workspace | `Normal` | task selection -> Team view -> preserved focus -> exact send | standalone Team behavior preserved | requirements, production caller, repaired regression | `Supported Normal Scenario` | `Use` |
| `CR-SCN-011` | `BEH-005/006/009`; `REQ-015/016/025`; `DS-005/008/016/018` | `System` / `Contract` | Fresh task activation and checkpoint recovery | Continue the single approved task lifecycle while its browser context checkpoint-replaces | committed `activated` event followed by normal task Agent presentation | `Normal` | server publishes activation -> releases work -> task Agent publishes presentation; browser activation handler fetches checkpoint -> retires old socket -> connects verified replacement | frames from the retired stream cannot mutate or close replacement state; replacement snapshot/events atomically publish | `AC-010`; reviewed recovery contract; `commitActivation()` -> `releaseWork()` -> `postMessage()` -> presentation publication; root publisher is synchronous | `Supported Normal Scenario` | `Use` |

`CR-SCN-011` is not a pair of contradictory or artificially concurrent user actions. It is one server-owned sequential task lifecycle plus the explicit recovery state machine required for an active stream with open execution work.

### Candidate Finding And Mechanism Gate

| Candidate ID | Observation Or Mechanism | Scenario / Contract ID | Independent Trigger | Forward Path / Lifecycle / Consequence | Evidence | Disposition | Reason / Proportionate Response |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-CAND-001` | Prior migration wrote before complete preflight. | `CR-SCN-001` | startup migration | resolved preflight path | CRR-003; source unchanged | `Promote` | Verified resolved; no action. |
| `CR-CAND-002` | Prior migration could not resume prospective output. | `CR-SCN-002` | later startup | resolved ordinary retry | CRR-003; source unchanged | `Promote` | Verified resolved; no action. |
| `CR-CAND-003` | Prior Org edit cleared hidden fields. | `CR-SCN-003` | normal edit | resolved partial-update path | CRR-003; source unchanged | `Promote` | Verified resolved; no action. |
| `CR-CAND-004` | Prior raw Org dashboard/direct paths bypassed accepted surfaces. | `CR-SCN-004/005/007` | normal focus/stop | resolved shared presentation path | IR-004 and current source | `Promote` | Verified resolved; no action. |
| `CR-CAND-005` | Prior coordinator/message/ACK correlation gaps. | `CR-SCN-005/006` | exact focus/strict stream | resolved strict validation | IR-005/current tests | `Promote` | Verified resolved; no action. |
| `CR-CAND-006` | Prior first-launch history ordering defect. | `CR-SCN-008` | cold launch | resolved ordering | IR-004/current source | `Promote` | Verified resolved; no action. |
| `CR-CAND-007` | Prior fresh task address/run identity assumptions rejected valid activation/snapshot. | `CR-SCN-009` | bound task delegation | IR-006 scopes configured address and fresh task identity, then checkpoint-hydrates | current contract/context/hydration and focused tests | `Promote` | `CR-FIND-004` is resolved. |
| `CR-CAND-008` | Prior Team workflow test omitted the store-neutral Team view. | `CR-SCN-010` | Team workflow regression | repaired harness reaches focus/send assertions | current test and full run | `Promote` | `CR-FIND-005` is resolved. |
| `CR-CAND-009` | The serialized message queue stores only raw text, not its originating socket/session. An old-socket frame queued while `reopen()` awaits its checkpoint is later evaluated under the new socket's `awaiting_connected_root` phase and `failClosed()` closes that new socket. | `CR-SCN-006`, `CR-SCN-009`, `CR-SCN-011`; `DS-018` | normal fresh task activation followed by normal task work/presentation | activation handler awaits checkpoint -> old valid frame queues -> recovery installs replacement -> old frame resumes against replacement phase -> replacement closes before candidate snapshot | production source ordering plus focused reviewer witness/patch | `Promote` | Supported normal lifecycle and explicit recovery contract; add the missing stream-generation ownership check within the existing service and one deterministic regression. No new recovery subsystem is warranted. |

## Structural / Design Checks

| Check | Result | Evidence | Required Action |
| --- | --- | --- | --- |
| Task design health assessment is present, evidence-backed, and preserved by the implementation | `Pass` | Large/High classification and AD-REV-006 recovery remain explicit; no new design impact. | Preserve. |
| Implementation matches approved behavior-defining supplemental artifacts | `Fail` | Identity/presentation paths match, but `CR-CAND-009` contradicts the approved atomic recovery outcome. | Resolve `CR-FIND-006`. |
| Data-flow spine inventory clarity and preservation under shared principles | `Fail` | `DS-005` legitimately triggers `DS-018`; the queue then crosses a retired/current stream boundary without identity. | Correlate queue work to the owning stream generation. |
| Ownership boundary preservation and clarity | `Fail` | `AgentOrgStreamingService` is the right owner, but its queued unit lacks the session identity needed to preserve that ownership across replacement. | Keep the fix in this owner and make the transition invariant explicit. |
| Off-spine concern clarity | `Pass` | Hydration, presentation adaptation, persistence, focus, and component rendering stay attached to their owners. | Preserve. |
| Existing capability/subsystem reuse check | `Pass` | Existing checkpoint/hydration/reconnect/context owners are reused; no second recovery system exists. | Preserve; do not add a parallel path. |
| Reusable owned structures check | `Pass` | Shared task/identity DTOs and root-neutral presentation remain in appropriate shared owners. | Preserve. |
| Shared-structure/data-model tightness check | `Pass` | IR-006 correctly separates configured placement uniqueness from task run identity and retains compound projection identity. | Preserve. |
| Repeated coordination ownership check | `Pass` | One Org context/stream service owns browser sequencing and recovery. | Preserve. |
| Empty indirection check | `Pass` | No pass-through-only boundary was introduced. | None. |
| Scope-appropriate separation of concerns and file responsibility clarity | `Pass` | Contract, context, hydration, stream, and surface responsibilities remain coherent. | Keep correction local to stream session handling/test. |
| Ownership-driven dependency check | `Pass` | Components use ports/context rather than Org runtime internals; server tool/adapter/root boundaries remain directed. | Preserve. |
| Authoritative Boundary Rule check | `Pass` | No caller depends on both an outer runtime owner and its internal manager/repository. | Preserve. |
| File placement check | `Pass` | IR-006 files live under their owning contract, Org execution, and Team workspace areas. | None. |
| Flat-vs-over-split layout judgment | `Pass` | Cohesive owners remain readable; no size-only split is justified. | None. |
| Interface/API/query/command/service-method boundary clarity | `Pass` | Public DTO/command/query identities are explicit; the defect is internal stream-generation coordination. | Preserve external contracts. |
| Naming quality and naming-to-responsibility alignment check | `Pass` | Org/task/context/hydration names remain domain-aligned. | Name any generation/session token explicitly. |
| No unjustified duplication of code / repeated structures in changed scope | `Pass` | No duplicate Org surface, identity model, or recovery authority returned. | Preserve. |
| Patch-on-patch complexity control | `Fail` | Full cumulative review found the activation checkpoint patch transitions shared phase/socket state while earlier queued work has no ownership token. | Add the bounded generation invariant and regression before another delta-only pass. |
| Dead/obsolete code cleanup completeness in changed scope | `Pass` | Retired raw dashboard/direct-send/component paths stay removed. | None. |
| Relevant test scenarios and assertions are clear and requirement-aligned | `Fail` | Fresh task activation/hydration tests are strong, but none retains an old-socket follow-on frame while checkpoint retrieval is pending. | Add the `CR-SCN-011` regression and assert successful replacement. |
| Test fixtures/helpers are reasonably reusable and test structure remains coherent | `Pass` | Team workspace view helper and Org snapshot fixtures are reusable and navigable. | Preserve. |
| No stale, duplicated, or compatibility-only tests are retained in changed scope | `Pass` | `TeamFocusSendWorkflow` is current and passes; no obsolete Org dashboard tests remain. | None. |
| API/E2E readiness for the next workflow stage | `Fail` | A normal task journey can close its replacement stream before the task-bearing candidate publishes. | Return to Implementation; API/E2E remains stopped. |

## Source File Size And Structure Audit (If Applicable)

Method: cumulative production changes from `f3035a2d5..HEAD`; `.ts/.tsx/.js/.mjs/.vue`, excluding tests, fixtures, test support, and `dist`. Result: `344` files, `52` signals above 220 effective non-empty lines, `0` above 500.

| Source File / Cohort | Effective Non-Empty Lines | `>500` Hard-Limit Check | `>220` Delta Check | SoC / Ownership Check | Placement Check | Preliminary Classification | Required Action |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| All cumulative changed production source | `344 files` | `Pass — 0` | `52 signals` | Assessed cumulatively; no general split requirement | `Pass` | Cohesive overall | None beyond finding. |
| `agentOrgExecutionContext.ts` | `394` | `Pass` | `Signal` | One strict Org browser aggregate; IR-006 identity work belongs here | `Pass` | Accept | No split; preserve context authority. |
| `agentOrgStreamingService.ts` | `272` | `Pass` | `Signal` | One stream/command/recovery state machine, but session-generation invariant is incomplete | `Pass` | `Local Fix` | Resolve `CR-FIND-006` in this owner. |
| `agentOrgContextHydration.ts` | `218` | `Pass` | `No signal` | Candidate hydration remains focused and best-effort per AD-REV-006 | `Pass` | Accept | None. |
| `root-execution-view-dtos.ts` | `156` | `Pass` | `No signal` | Exact shared wire correlation; IR-006 task identity correction is tight | `Pass` | Accept | None. |
| Server activation path (`agent-org-task-lifecycle-adapter.ts`; `agent-org-root-agent-execution-registry.ts`) | `251`; `225` | `Pass` | `Signals` | Commit/publication and prepared execution registry are distinct cohesive owners | `Pass` | Accept | No server redesign; use ordering as regression basis. |

## Legacy / Backward-Compatibility Verdict

| Check | Result | Notes |
| --- | --- | --- |
| No backward-compatibility mechanisms in changed scope | `Pass` | Current Team V2 and Org V1 families remain exact; no dual normal parser. |
| No legacy old-behavior retention in changed scope | `Pass` | Recursive configured Team/runtime and raw Org presentation paths remain retired. |
| Dead/obsolete code cleanup completeness in changed scope | `Pass` | No duplicate dashboard, component authority, mounted-Team root, or direct component socket path found. |
| Approved persisted-data transition decision is followed without unnecessary migration work | `Pass` | Registered startup-only migration remains isolated and unchanged from resolved CRR-003. |
| No version-specific dual reads/writes or request-time old-shape fallback exists | `Pass` | Readers remain family/path selected and strict. |
| Approved transition mechanics match the reviewed design | `Pass` | Complete preflight, ordinary retry, exact reread, cleanup, and capability-scoped failure remain. |

## Dead / Obsolete / Legacy Items Requiring Removal (Mandatory If Any Exist)

None.

## Docs-Impact Verdict

- Docs impact: `Yes` for the cumulative public Team/Org/runtime/stream/migration change; final delivery synchronization remains pending.
- Why: New AgentOrg and narrowed AgentTeam contracts, runtime/history/stream identities, authoring, and migration behavior are public architecture/user concepts.
- Files or areas likely affected: AgentOrg/AgentTeam architecture and user docs, strict stream/command/query contracts, migration guidance, final ticket artifacts.

## Additional Material Premise Validation (When Required)

### Upstream Design-Review Material-Premise Decisions

| Premise ID | Current Status | Changed Evidence / Reason |
| --- | --- | --- |
| `AR-PREM-001` | `Confirmed` | Migration interruption/relaunch remains resolved and unchanged. |
| `AR-PREM-002` | `Confirmed` | Arbitrary corruption/tampering remains unsupported and drives no finding. `CR-FIND-006` uses a normal task lifecycle and explicit recovery contract. |
| `AR-PREM-003` | `Confirmed` | Subject fail-stop after indeterminate durability remains unchanged. |

No new or reclassified premise is required; `CR-SCN-011` fully records the supported system/contract basis for the lifecycle ordering used by the finding.

## Review Scorecard (Mandatory)

- Overall score (`/10`): `8.9/10`
- Overall score (`/100`): `88.6/100`
- Score calculation note: simple average across the ten categories; the decision remains `Fail` because four categories are below the `9.0` clean-pass target and `CR-FIND-006` is open.

| Priority | Category | Score | Why This Score | What Is Weak / Holding It Down | What Should Improve |
| --- | --- | ---: | --- | --- | --- |
| `1` | Data-Flow Spine Inventory and Clarity | `8.6` | The full server/task/stream/hydration spine is explicit and most IR-006 identity work is correct. | `CR-CAND-009`: retired and replacement frames share one untagged processing queue. | Correlate each queued unit to its owning stream generation and preserve DS-018 atomic replacement. |
| `2` | Ownership Clarity and Boundary Encapsulation | `8.7` | One stream service owns the transition; no duplicate recovery authority exists. | Its queue item does not carry the ownership identity needed when `socket` is replaced. | Make session/generation ownership explicit inside the same service. |
| `3` | API / Interface / Query / Command Clarity | `9.1` | Strict root/recipient/run/command/checkpoint contracts are explicit and current. | Internal stream generation is implicit rather than represented. | Preserve external APIs; tighten the internal callback/queue contract. |
| `4` | Separation of Concerns and File Placement | `9.0` | Contract, context, hydration, streaming, components, and server runtime are correctly placed. | Recovery logic is dense but still cohesive. | Keep the bounded correction in streaming service rather than extracting a second system. |
| `5` | Shared-Structure / Data-Model Tightness and Reusable Owned Structures | `9.2` | IR-006 correctly models configured address uniqueness separately from fresh task run identity and reuses accepted view ports. | No material model gap remains. | Preserve the corrected compound identity. |
| `6` | Naming Quality and Local Readability | `9.0` | Names are domain-specific and forward paths are traceable. | Stream lifetime identity is absent, so the code cannot name the retired/current distinction. | Add an explicit, readable session/generation identity. |
| `7` | API/E2E Readiness | `8.2` | Builds and broad tests are otherwise clean against the documented baseline. | A normal fresh-task path can close the recovery socket before a candidate snapshot. | Add the interleaving regression, pass source review, then resume the stopped real task/browser validation. |
| `8` | Runtime Correctness And Behavioral Fidelity | `8.2` | Fresh task snapshot/admission and Team compatibility are now correct. | Valid follow-on task activity can poison the replacement stream and prevent task UI synchronization. | Ignore only retired-generation work while keeping strict validation for the current generation. |
| `9` | No Backward-Compatibility / No Legacy Retention | `9.3` | Exact current families and migration-only historical knowledge remain. | No material weakness. | Preserve. |
| `10` | Cleanup Completeness | `9.3` | Retired Org presentation/direct paths remain removed and no new dead path was found. | No material weakness. | Preserve. |

## Findings

### `CR-FIND-006` — High — A queued frame from the retired Org socket closes the checkpoint replacement stream

- Candidate gate: `CR-CAND-009 / Promote`
- Affected authority: `BEH-005`, `BEH-006`, `BEH-009`; `REQ-015`, `REQ-016`, `REQ-025`; `AC-010`; `DS-005`, `DS-008`, `DS-016`, `DS-018`; `CR-SCN-006`, `CR-SCN-009`, `CR-SCN-011`.
- Supported trigger/path: A live Org Agent delegates a task through the bound task tool. The server durably attaches the fresh execution, publishes `activated`, then releases work. That task work publishes ordinary Agent presentation while the client is checkpoint-replacing for the activation. This is one supported task lifecycle, not contradictory user concurrency.
- Evidence:
  1. `agent-org-task-lifecycle-adapter.ts:229-236` publishes activation and immediately calls `releaseWork()` after durability.
  2. `agent-org-root-agent-execution-registry.ts:107-116` commits the fresh Agent and schedules its input with `queueMicrotask`; `configured-agent-execution-handle.ts:109-116,277-285` forwards normal task input/status/run presentation through the Org callback. The Team task registry uses the same release pattern.
  3. `root-event-publisher.ts:31-45` sequences and publishes those events synchronously; the Org stream handler forwards each subscribed event.
  4. `agentOrgStreamingService.ts:62-65` enqueues only raw message text. It does not capture the originating `socket` or a session/generation token.
  5. The activation handler calls and awaits `reopen()` (`agentOrgStreamingService.ts:207-213`). `reopen()` waits for the checkpoint, closes the old socket, creates a replacement, and sets the shared phase to `awaiting_connected_root` (`:80-86`). A follow-on frame received from the old socket while the query was pending remains next in `processing`; when it resumes it hits `:204-205` under the replacement phase. `failClosed()` then closes `this.socket`, which is now the replacement (`:233-240`).
  6. `/tmp/aorg-crr006-stale-socket-focused.log` records `7/7`; the added witness passes by asserting the observed wrong result: the replacement is closed, the committed context is marked for reopen, only the old context was published, and replacement hydration never starts. `/tmp/aorg-crr006-stale-socket-probe.patch` contains the exact witness.
- Consequence: The approved fresh task exists and keeps running server-side, but the browser cannot complete the task-bearing atomic context swap. Live task conversation/status/result visibility remains stuck on the committed pre-task context until another reopen, and the same lifecycle ordering can repeat.
- Required action: Within the existing `AgentOrgStreamingService`, associate queued processing with the socket/session generation that received it. Once checkpoint recovery intentionally retires a generation, do not apply its already-queued frames to replacement state; keep strict schema/root/sequence failure for frames belonging to the current generation. Add a deterministic regression that holds the checkpoint query, queues a valid post-activation Agent presentation from the old socket, completes the checkpoint, then proves the replacement `CONNECTED`/snapshot path remains open and atomically publishes the verified candidate. Do not add a second topology, fallback parser, or recovery authority.
- Classification: `Local Fix` — AD-REV-006 already specifies the correct owner and recovery outcome; this is a bounded session-transition invariant and regression in implementation-owned code.
- Review accountability: CRR-005 correctly identified the fresh-run model but did not evaluate how the new activation checkpoint transition interacts with already-queued socket work. This deliberate cumulative round exposes and records that review gap.

`CR-FIND-001`, `CR-FIND-002`, `CR-FIND-003`, `CR-FIND-004`, and `CR-FIND-005` are resolved; their current verification is recorded in `CRR-006`.

## Classification

- `Local Fix`

## Recommended Recipient

- `implementation_engineer`
- API/E2E must remain stopped until the bounded correction returns through cumulative source review and passes.

## Residual Risks

- API/E2E remains stopped at `API-REV-001`. After source pass it must repeat the real imported-package/Codex/browser task activation, task-bearing checkpoint/restore, contextual identity, lifecycle, Team compatibility, and migration/persistence scenarios.
- The broad web suite is clean for this ticket except the established unrelated fixed-px audit; the broad Nuxt typecheck remains at its documented repository baseline.
- External definition publication remains separately owned and outside this ticket's write/release scope.

## Latest Authoritative Result

- Review Decision: `Fail`
- Review Entry Point: `Implementation Review`
- Supported Product Scenario Gate: `Pass`
- Material-Premise Gate: `Pass`
- Score Summary: `8.9/10 (88.6/100)`; Data-Flow, Ownership, API/E2E Readiness, and Runtime Correctness are below target.
- Failure Origin: `Implementation defect in AgentOrg browser stream-session transition ownership, exposed by the cumulative review after IR-006's otherwise-correct fresh-task checkpoint recovery.`
- Recommended Recipient: `implementation_engineer`
- Notes: IR-006 resolves `CR-FIND-004` and `CR-FIND-005`. Source review remains failed only for `CR-FIND-006`: a normal follow-on task frame queued from the retiring socket can close the replacement before atomic hydration completes.
