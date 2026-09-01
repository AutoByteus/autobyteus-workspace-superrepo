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
- Relevant Implementation Revision IDs: `IR-007` (cumulative `IR-001`–`IR-006` retained)
- Code Review Revision Record: `code-review-revision-record.md`
- Current Code Review Revision ID: `CRR-007`
- Current Review Round: `7`
- Trigger: IR-007 source commit `f26d6f502` and artifact commit `3d14678d5` returned after `CRR-006 / CR-FIND-006` Local Fix.
- Prior Review Round Reviewed: `CRR-006 / Fail — Local Fix`
- Latest Authoritative Round: `CRR-007`
- Coverage Investigation Reviewed: `api-e2e-coverage-investigation.md` as prior stopped-validation context
- Relevant API/E2E Revision IDs: `API-REV-001 / stopped; no pass`
- Delivery Revision Record / IDs: `N/A — pending`
- Failing Scenario IDs: `CR-SCN-012`
- Exact Reviewer Commands / Execution Mode: current exact AgentOrg streaming Vitest; temporary two-witness exact streaming Vitest; full cumulative production-path, static cleanup, size, legacy, and `git diff --check` review
- Failure Evidence Paths: `/tmp/aorg-crr007-stream-current.log`; `/tmp/aorg-crr007-retired-inflight-focused.log`; `/tmp/aorg-crr007-retired-inflight-probe.patch`; implementation logs listed in `implementation-handoff.md`

## Routing Classification Review

- Task size: `Large`
- Architectural risk: `High`
- Selected route: `Implementation Review`
- Independent source review required by the classification: `Yes`
- Classification evidence or correction required: Confirmed. The cumulative package changes shared contracts, Team/Org execution, persistence/migration, browser context/stream recovery, accepted workspace surfaces, and lifecycle behavior. No classification correction is required.

## Review Scope

- Changed implementation and behavior reviewed: complete cumulative implementation from approved requirements baseline `f3035a2d5..3d14678d5`, not only the IR-007 two-file delta. This continues the requested full-review posture after repeated Local Fixes.
- Files / areas reviewed: strict Team V2/Org V1 admission/persistence/migration; task execution/publication; root event barrier and stream handler; Org snapshot/hydration/context/streaming; context-store/component lifecycle; exact focus/commands/reference/workspace adapters; standalone Team preservation; retired presentation cleanup; current tests and all cumulative changed-source size signals.
- Explicit exclusions: separately maintained external definition repositories remain read-only; incoming API/E2E artifacts and generated application `dist` directories are untracked and not attributed to IR-007; delivery remains pending.

## Independent Validation Performed

- Rechecked `CR-FIND-006` first. IR-007 gives every socket/frame a private generation, retires the old generation before close, ignores a queued old-socket frame, and leaves current-generation strict failure intact. Source trace plus the committed deterministic regression verify the exact CRR-006 manifestation is resolved.
- Independently reran the unmodified AgentOrg streaming suite: `7/7` passed (`/tmp/aorg-crr007-stream-current.log`). Cross-checked implementation evidence: broader focused Org/Team web `11 files / 51 tests`; web production build with `16` prerendered routes; broad Nuxt typecheck at the documented baseline with no changed-owner diagnostic.
- Extended the same service temporarily with two cumulative-lifecycle witnesses. `9/9` passed while deliberately asserting current wrong behavior: (1) a snapshot already awaiting hydration publishes a live candidate after `disconnect()` releases the context; (2) an activation handler already awaiting its checkpoint creates a new open socket after `disconnect()` (`/tmp/aorg-crr007-retired-inflight-focused.log`; exact patch `/tmp/aorg-crr007-retired-inflight-probe.patch`). The temporary tests were restored.
- Revalidated the full cumulative production spines and cleanup rather than inferring completeness from the two-file diff. Static searches found no retired recursive configured-Team model, duplicate/raw Org presentation, mounted-Team root registration, direct component socket path, or normal legacy parser.
- Cumulative production-source audit from `f3035a2d5..HEAD`: `344` files, `52` signals above 220 effective non-empty lines, `0` above 500. All signals were re-assessed; `agentOrgStreamingService.ts` is now `300` and remains the correct cohesive owner.
- `git diff --check` passed. The worktree returned to the incoming untracked-artifact state before report updates.

## Upstream Behavior And Production-Path Basis Confirmation

- Approved requirements basis understood: `RER-019` / cumulative `RER-018`, especially `REQ-015`, `REQ-016`, `REQ-025`, `AC-010`, and the approved active-workspace/history navigation.
- Design-spec behavior map verified against the implementation: Partial. IR-007 fixes retired queued-frame isolation, but context release does not cancel async work already executing for that generation. This contradicts the `AgentOrgContextsStore` lifecycle and `DS-018` candidate publication boundary.
- Design review report and round confirmed: `ARCH-REV-004 / Pass` over `AD-REV-006`.
- Behavior-basis status: `Contradicted`
- Changed or newly discovered behavior: None. Navigating away from an active/loading Org and releasing its context is an existing workspace lifecycle.
- Remaining material ambiguity: None.

| Behavior ID | Current Status | Current Implementation Path And Lifecycle Evidence | Contradicting Evidence |
| --- | --- | --- | --- |
| `BEH-001` | `Confirmed` | AgentOrg remains the sole persistent multi-Team root; configured Teams remain Agent-only. | — |
| `BEH-002` | `Confirmed` | One Org root owns its complete execution and lifecycle; no synthetic Team root returned. | — |
| `BEH-003` | `Confirmed` | Ordered same-root handoffs and target-only routing remain. | — |
| `BEH-004` | `Confirmed` | Org remains coordinator-free; Team focus uses its exact stored direct coordinator. | — |
| `BEH-005` | `Contradicted` | Snapshot/task identity and queued retired-frame isolation are correct. | A released Org context can be republished by in-flight hydration, creating state outside the owning store/service lifecycle. |
| `BEH-006` | `Contradicted` | Accepted Agent/Team surfaces and truthful authoring/history remain. | Leaving a loading Org does not reliably release its browser context; stale state can re-enter the workspace store. |
| `BEH-007` | `Confirmed` | Migration and external ownership remain unchanged from CRR-003. | — |
| `BEH-008` | `Confirmed` | Exact Team V2/Org V1 families and task address/run identity remain. | — |
| `BEH-009` | `Contradicted` | Fresh task activation and replacement work while the service remains owned. | If the user leaves during activation checkpoint retrieval, that retired handler reconnects an orphan service after release. |
| `BEH-010` | `Confirmed` | Exact target admission and migration-private historical decoding remain. | — |

## Supported Product Scenario And Reachability Gate (Mandatory)

| Scenario ID | Related Behavior / Contract IDs | Kind | Actor / Initiator | Coherent Goal Or Governing Event | Supported Entry Surface / Event | Scenario Shape | Forward Production Path / Lifecycle | Expected Outcome / Consequence | Independent Evidence | Scenario Validity | Review Use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-SCN-001` | `BEH-007`; `REQ-012/013`; migration convention | `Operational` | Startup runner | Reject unexpected deep migration input without mutation | registered startup migration | `Explicit Edge` | full preflight -> bounded failure | byte-faithful source | CRR-003/convention | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-002` | `BEH-007`; `AR-PREM-001` | `Operational` | Later startup | Resume interrupted one-level migration | startup `runPending()` | `Explicit Edge` | prospective recognition -> commit/cleanup | exact target/retired cleanup | CRR-003/convention | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-003` | `BEH-001/003/006`; `REQ-023` | `User` | Org author | Edit without losing hidden durable fields | `/agent-orgs` save | `Normal` | visible draft -> partial update -> atomic save | durable omissions preserved | Product/requirements/CRR-003 | `Supported Normal Scenario` | `Use` |
| `CR-SCN-004` | `BEH-004/006`; `REQ-004/016/019`; `VIS-017` | `User` | Active-Org user | Focus direct Agent and converse | Org workspace | `Normal` | focus -> exact target/port -> events -> shared Agent surface | accepted conversation | Product/requirements/IR-004 | `Supported Normal Scenario` | `Use` |
| `CR-SCN-005` | `BEH-004/006`; `REQ-003/004/011`; `VIS-018` | `User` | Active-Org user | Focus mounted Team/member | Org workspace Team row | `Normal` | Team row -> coordinator/member -> Team view | exact accepted Team workspace | Product/requirements/current code | `Supported Normal Scenario` | `Use` |
| `CR-SCN-006` | `BEH-005/006/008`; `REQ-025`; `DS-016`–`018` | `Contract` | Strict Org stream | Recover from malformed/miscorrelated/gapped current input | stream admission failure | `Explicit Edge` | reject -> reopen -> checkpoint candidate -> atomic swap | committed view preserved | reviewed AD-REV-006 | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-007` | `BEH-005/006`; `REQ-016`; `DS-019` | `User` | Operator | Stop active whole Org | history root row | `Normal` | stop -> root terminate -> context/history cleanup | whole-root stop | requirements/design/Product | `Supported Normal Scenario` | `Use` |
| `CR-SCN-008` | `BEH-005/006`; history contract | `System` | First cold launch | Publish launch history in order | Org run launch | `Normal` | initialize history -> publish | visible launch | IR-004 | `Supported Normal Scenario` | `Use` |
| `CR-SCN-009` | `BEH-005/006/008/009`; `REQ-015`; `AC-010`; `DS-005/008` | `User` | Live Org Agent | Delegate to configured Agent/Team | bound `delegate_task` | `Normal` | fresh run -> durable record/tree -> activation/work/settlement | synchronized task lifecycle | requirements/contract/task runtime | `Supported Normal Scenario` | `Use` |
| `CR-SCN-010` | `BEH-006/009`; `REQ-011/015` | `User` | Standalone Team user | Inspect task and continue focused messaging | Team workspace | `Normal` | task detail -> preserved focus -> send | standalone Team preserved | requirements/current regression | `Supported Normal Scenario` | `Use` |
| `CR-SCN-011` | `BEH-005/006/009`; `REQ-015/016/025`; `DS-005/018` | `System` / `Contract` | Fresh task activation/recovery | Continue task work while activation checkpoint-replaces | activation then task presentation | `Normal` | old frame queued -> generation retired -> replacement snapshot | old frame inert; atomic candidate | AC-010, DS-018, server ordering | `Supported Normal Scenario` | `Use` |
| `CR-SCN-012` | `BEH-005/006/009`; `REQ-016/025`; `DS-018`; context lifecycle | `User` / `Contract` | User viewing an active/loading Org | Leave that Org to view another supported workspace while its asynchronous snapshot or activation recovery is still completing | history/workspace navigation; component unmount or Org-run-id change | `Normal` | `AgentOrgWorkspaceView` unmount/watch -> `disconnectAgentOrg` -> store deletes service/context -> retiring generation work finishes | release is final for that service: no later publish, shared-state mutation, or reconnect; next visit creates a fresh owned service | Product workspace/history navigation; explicit component/store disconnect path; DS-018 atomic registration boundary | `Supported Normal Scenario` | `Use` |

`CR-SCN-012` is not a contradictory pair of user actions. Leaving a loading view is the coherent completion of its supported navigation/release lifecycle, and the production component explicitly invokes `disconnect()` for that event.

### Candidate Finding And Mechanism Gate

| Candidate ID | Observation Or Mechanism | Scenario / Contract ID | Independent Trigger | Forward Path / Lifecycle / Consequence | Evidence | Disposition | Reason / Proportionate Response |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-CAND-001` | Prior migration wrote before full preflight. | `CR-SCN-001` | startup migration | resolved | CRR-003/source unchanged | `Promote` | Verified resolved. |
| `CR-CAND-002` | Prior migration retry gap. | `CR-SCN-002` | later startup | resolved | CRR-003/source unchanged | `Promote` | Verified resolved. |
| `CR-CAND-003` | Prior Org edit cleared hidden fields. | `CR-SCN-003` | normal edit | resolved | CRR-003/source unchanged | `Promote` | Verified resolved. |
| `CR-CAND-004` | Prior raw/duplicate Org workspace. | `CR-SCN-004/005/007` | focus/stop | resolved | IR-004/current source | `Promote` | Verified resolved. |
| `CR-CAND-005` | Prior coordinator/message/ACK correlation gaps. | `CR-SCN-005/006` | strict focus/stream | resolved | IR-005/current tests | `Promote` | Verified resolved. |
| `CR-CAND-006` | Prior cold-launch history ordering. | `CR-SCN-008` | first launch | resolved | IR-004/current source | `Promote` | Verified resolved. |
| `CR-CAND-007` | Prior fresh task identity/address assumptions. | `CR-SCN-009` | delegation | resolved | IR-006/current source/tests | `Promote` | Verified resolved. |
| `CR-CAND-008` | Prior stale Team workflow harness. | `CR-SCN-010` | Team regression | resolved | IR-006/current test | `Promote` | Verified resolved. |
| `CR-CAND-009` | Prior queued old-socket frame executed against replacement phase. | `CR-SCN-011` | task activation/recovery | IR-007 frame captures generation; retired queued frame is inert; replacement publishes | current source, committed regression, reviewer `7/7` | `Promote` | `CR-FIND-006` is resolved. |
| `CR-CAND-010` | Generation is checked only before `await handleMessage()` and on error. A current frame already awaiting hydration/checkpoint can survive `disconnect()`, then publish or reconnect after its generation/service is released. | `CR-SCN-012`; `DS-018` | ordinary route unmount/run switch invokes explicit context release | release deletes service/context -> in-flight `hydrate` resumes and calls `publish`, or in-flight activation `reopen` resumes and creates an unowned socket | component/store/service source plus two deterministic reviewer witnesses | `Promote` | Supported normal lifecycle with material stale-state/socket consequence. Complete the same owner's async generation/lifecycle guard and add release-during-await regressions; no new subsystem. |

## Structural / Design Checks

| Check | Result | Evidence | Required Action |
| --- | --- | --- | --- |
| Task design health assessment is present, evidence-backed, and preserved by the implementation | `Pass` | Large/High and AD-REV-006 remain correct; new issue is bounded. | Preserve. |
| Implementation matches approved behavior-defining supplemental artifacts | `Fail` | IR-007 matches queued-frame recovery, but context release is not final for already-running async work. | Resolve `CR-FIND-007`. |
| Data-flow spine inventory clarity and preservation under shared principles | `Fail` | Route/context lifecycle reaches the stream owner, but its async continuation crosses the release boundary. | Extend generation/lifecycle validity through async commit points. |
| Ownership boundary preservation and clarity | `Fail` | `AgentOrgStreamingService` is the right owner; an orphan socket/context can outlive deletion from `AgentOrgContextsStore`. | Prevent retired service work from publishing/reconnecting. |
| Off-spine concern clarity | `Pass` | Hydration, presentation, persistence, focus, and components remain appropriately attached. | Preserve. |
| Existing capability/subsystem reuse check | `Pass` | One stream/context/recovery system remains. | Keep fix local; no second recovery path. |
| Reusable owned structures check | `Pass` | Shared DTOs/task records/presentation/view ports remain correctly owned. | Preserve. |
| Shared-structure/data-model tightness check | `Pass` | Configured placement and fresh task identities remain exact. | Preserve. |
| Repeated coordination ownership check | `Pass` | One Org stream service owns sequencing/recovery. | Preserve. |
| Empty indirection check | `Pass` | No pass-through-only layer added. | None. |
| Scope-appropriate separation of concerns and file responsibility clarity | `Pass` | The stream service remains cohesive at 300 lines. | Correct within it/store lifecycle boundary. |
| Ownership-driven dependency check | `Pass` | Components depend on active/store ports rather than runtime internals. | Preserve. |
| Authoritative Boundary Rule check | `Pass` | No mixed outer-owner/internal dependency found. | Preserve. |
| File placement check | `Pass` | IR-007 source/test are in the correct Org stream owner. | None. |
| Flat-vs-over-split layout judgment | `Pass` | No size-driven split is justified. | None. |
| Interface/API/query/command/service-method boundary clarity | `Pass` | External command/checkpoint contracts are explicit. | Keep correction private to lifecycle/generation. |
| Naming quality and naming-to-responsibility alignment check | `Pass` | `StreamGeneration` clearly names socket lifetime. | Extend its validity semantics through awaits. |
| No unjustified duplication of code / repeated structures in changed scope | `Pass` | No duplicate Org context/recovery authority. | Preserve. |
| Patch-on-patch complexity control | `Fail` | Generation guards cover queued-not-started frames but not already-running async continuations across release. | Add complete, tested transition guards before another delta-only conclusion. |
| Dead/obsolete code cleanup completeness in changed scope | `Pass` | Retired presentation/direct paths stay removed. | None. |
| Relevant test scenarios and assertions are clear and requirement-aligned | `Fail` | The new old-frame regression is good, but no test releases the service while hydration or checkpoint retrieval is pending. | Add both release-during-await assertions or one equivalent store-level lifecycle suite. |
| Test fixtures/helpers are reasonably reusable and test structure remains coherent | `Pass` | Current socket/candidate fixtures are adequate. | Reuse them. |
| No stale, duplicated, or compatibility-only tests are retained in changed scope | `Pass` | Current Team and Org tests remain purposeful. | None. |
| API/E2E readiness for the next workflow stage | `Fail` | Route release can resurrect stale context or leave an unowned stream. | Return to Implementation; API/E2E remains stopped. |

## Source File Size And Structure Audit (If Applicable)

Method: cumulative production changes from `f3035a2d5..HEAD`; `.ts/.tsx/.js/.mjs/.vue`, excluding tests, fixtures, test support, and `dist`. Result: `344` files, `52` signals above 220 effective non-empty lines, `0` above 500.

| Source File / Cohort | Effective Non-Empty Lines | `>500` | `>220` | SoC / Ownership | Placement | Classification / Action |
| --- | ---: | --- | --- | --- | --- | --- |
| All cumulative changed production source | `344 files` | `Pass — 0` | `52 signals` | Re-assessed cumulatively | `Pass` | No general split. |
| `agentOrgExecutionContext.ts` | `394` | `Pass` | `Signal` | Sole strict Org aggregate remains cohesive | `Pass` | Accept. |
| `agentOrgStreamingService.ts` | `300` | `Pass` | `Signal` | Correct stream/recovery owner; release validity is incomplete after awaits | `Pass` | `Local Fix` for `CR-FIND-007`; no split. |
| `agentOrgContextHydration.ts` | `218` | `Pass` | `No` | Focused candidate hydration | `Pass` | Accept. |
| `root-execution-view-dtos.ts` | `156` | `Pass` | `No` | Exact wire correlation | `Pass` | Accept. |
| Server activation owners | `251`; `225` | `Pass` | `Signals` | Cohesive commit/registry boundaries | `Pass` | No server redesign. |

## Legacy / Backward-Compatibility Verdict

| Check | Result | Notes |
| --- | --- | --- |
| No backward-compatibility mechanisms in changed scope | `Pass` | Exact current Team V2 and Org V1 families; no dual parser. |
| No legacy old-behavior retention in changed scope | `Pass` | Recursive configured Team and raw Org presentation remain retired. |
| Dead/obsolete code cleanup completeness in changed scope | `Pass` | No duplicate dashboard/component/socket authority found. |
| Approved persisted-data transition decision is followed without unnecessary migration work | `Pass` | Startup-only migration remains isolated/unchanged. |
| No version-specific dual reads/writes or request-time old-shape fallback exists | `Pass` | Family/path selection remains strict. |
| Approved transition mechanics match the reviewed design | `Pass` | Preflight/retry/reread/cleanup/capability failure remain. |

## Dead / Obsolete / Legacy Items Requiring Removal (Mandatory If Any Exist)

None.

## Docs-Impact Verdict

- Docs impact: `Yes` for the cumulative public Team/Org/runtime/stream/migration change; final delivery synchronization remains pending.
- Why: AgentOrg/AgentTeam contracts, runtime/history/stream identities, authoring, and migration behavior are public architecture/user concepts.
- Files or areas likely affected: AgentOrg/AgentTeam architecture and user docs, strict stream/command/query contracts, migration guidance, final ticket artifacts.

## Additional Material Premise Validation (When Required)

### Upstream Design-Review Material-Premise Decisions

| Premise ID | Current Status | Changed Evidence / Reason |
| --- | --- | --- |
| `AR-PREM-001` | `Confirmed` | Migration interruption/relaunch remains resolved. |
| `AR-PREM-002` | `Confirmed` | Arbitrary corruption/tampering remains unsupported and drives no finding. |
| `AR-PREM-003` | `Confirmed` | Subject fail-stop after indeterminate durability remains unchanged. |

No new premise is required. `CR-SCN-012` records the supported navigation/context-release lifecycle directly.

## Review Scorecard (Mandatory)

- Overall score (`/10`): `8.9/10`
- Overall score (`/100`): `88.8/100`
- Score calculation note: simple average; decision remains `Fail` because four categories are below `9.0` and `CR-FIND-007` is open.

| Priority | Category | Score | Why This Score | What Is Weak / Holding It Down | What Should Improve |
| --- | --- | ---: | --- | --- | --- |
| `1` | Data-Flow Spine Inventory and Clarity | `8.7` | Cumulative spines are explicit and old queued frames are correctly isolated. | In-flight hydration/checkpoint work crosses route release. | Revalidate generation/ownership after async boundaries before side effects. |
| `2` | Ownership Clarity and Boundary Encapsulation | `8.7` | One store/service/context owner exists. | Deleted service ownership can be bypassed by its own stale continuation. | Make release terminal for all work owned by that service instance. |
| `3` | API / Interface / Query / Command Clarity | `9.1` | Strict external identities and checkpoints remain clear. | Internal lifecycle validity after awaits is incomplete. | Preserve APIs; tighten internal generation contract. |
| `4` | Separation of Concerns and File Placement | `9.0` | Owners remain correctly separated and placed. | Stream state machine is dense but cohesive. | Keep bounded fix local. |
| `5` | Shared-Structure / Data-Model Tightness and Reusable Owned Structures | `9.2` | Fresh task/configured identities and shared ports remain tight. | No material model gap. | Preserve. |
| `6` | Naming Quality and Local Readability | `9.0` | `StreamGeneration` and phases are clear. | Validity is checked only at entry/error, not named at commit points. | Make post-await validity explicit. |
| `7` | API/E2E Readiness | `8.3` | Current suites/build pass and CR-FIND-006's exact path is fixed. | A normal route release can resurrect context or orphan a socket. | Add regressions, pass review, then resume API/E2E. |
| `8` | Runtime Correctness And Behavioral Fidelity | `8.2` | Normal live/recovery behavior mostly matches. | In-flight work survives explicit release with material stale-state/resource effects. | Cancel or no-op retired continuations before publish/reconnect. |
| `9` | No Backward-Compatibility / No Legacy Retention | `9.3` | Exact current families and migration-only history remain. | No material weakness. | Preserve. |
| `10` | Cleanup Completeness | `9.3` | Retired UI/direct paths remain removed. | No material weakness. | Preserve. |

## Findings

### `CR-FIND-007` — High — In-flight Org stream work survives context release and can republish or reconnect an orphaned service

- Candidate gate: `CR-CAND-010 / Promote`
- Affected authority: `BEH-005`, `BEH-006`, `BEH-009`; `REQ-015`, `REQ-016`, `REQ-025`; `DS-018`; `CR-SCN-012`.
- Supported trigger/path: A user opens an active Org and, while its asynchronous snapshot hydration or fresh-activation checkpoint is still completing, selects another supported workspace or Org. `AgentOrgWorkspaceView` explicitly releases the old Org on unmount/run change. Leaving a loading view is a normal navigation/cancellation lifecycle, not contradictory user concurrency.
- Evidence:
  1. `AgentOrgWorkspaceView.vue:86-90` connects on mount and invokes `disconnectAgentOrg` on unmount or Org-run-id change.
  2. `agentOrgContextsStore.ts:48-59` calls service `disconnect()`, deletes the service, then removes the context/error/focus records. This establishes final release ownership for that service instance.
  3. `agentOrgStreamingService.ts:228-235` checks `isCurrent(generation)` before `await this.handleMessage(raw)` and only again on an exception. A successful async continuation has no post-await retirement check.
  4. Snapshot handling awaits hydration and checkpoint verification at `:200-205`, then unconditionally replaces `this.context`, marks the shared phase `ready`, and calls `publish` at `:206-211`. If release occurred during either await, the store callback can recreate the deleted context without an owned service.
  5. Fresh task activation awaits `reopen()` at `:221-223`; `reopen()` awaits its checkpoint then unconditionally writes recovery state, closes, and connects at `:90-96`. If release occurred while the checkpoint was pending, the deleted service creates a new open socket that the store can no longer disconnect.
  6. `/tmp/aorg-crr007-retired-inflight-focused.log` records `9/9`; two temporary witnesses pass by asserting these wrong outcomes after explicit release. `/tmp/aorg-crr007-retired-inflight-probe.patch` contains the exact witnesses.
- Consequence: The old Org may be reinserted into `contexts` after the caller deliberately removed it, so a later visit can briefly expose stale live state. The activation path can also leave an untracked websocket/service continuing to receive and publish updates with no store owner, producing stale mutations and a resource leak.
- Required action: Within the existing `AgentOrgStreamingService`/context-lifecycle ownership, make every async frame/recovery continuation validate that its service/generation is still owned immediately before post-await mutation, publish, close, or connect. Explicit context release must make pending snapshot hydration and activation checkpoint work inert; preserve manual reopen for a still-owned fail-closed service and strict validation for current-generation frames. Add deterministic regressions for release during pending snapshot hydration and during pending activation checkpoint (or an equivalent store-level lifecycle test proving no context resurrection and no replacement socket). Do not add a second context, topology, or recovery subsystem.
- Classification: `Local Fix` — the approved stream/context/store owners and DS-018 outcome remain correct; the cancellation/commit guard is a bounded implementation lifecycle defect.

`CR-FIND-001`–`CR-FIND-006` are resolved. In particular, `CR-FIND-006` is closed because IR-007 now ignores queued-but-not-started frames from the retired checkpoint socket and preserves the replacement stream exactly as required.

## Classification

- `Local Fix`

## Recommended Recipient

- `implementation_engineer`
- API/E2E must remain stopped until the correction returns through cumulative source review and passes.

## Residual Risks

- API/E2E remains stopped at `API-REV-001`. After source pass it must repeat real imported-package/Codex/browser task activation, route/context release, task-bearing checkpoint/restore, contextual identity, lifecycle, Team compatibility, and migration/persistence scenarios.
- The prior broad web suite remains clean for this ticket except the established unrelated fixed-px audit; the broad Nuxt typecheck remains at its documented repository baseline.
- External definition publication remains separately owned and outside this ticket's write/release scope.

## Latest Authoritative Result

- Review Decision: `Fail`
- Review Entry Point: `Implementation Review`
- Supported Product Scenario Gate: `Pass`
- Material-Premise Gate: `Pass`
- Score Summary: `8.9/10 (88.8/100)`; Data-Flow, Ownership, API/E2E Readiness, and Runtime Correctness are below target.
- Failure Origin: `A new cumulative-review finding in AgentOrg browser context-release lifecycle: IR-007 fixes queued retired frames, but already-running async work can still outlive store/service ownership.`
- Recommended Recipient: `implementation_engineer`
- Notes: `CR-FIND-006` is resolved exactly. Source review remains failed only for `CR-FIND-007`, a bounded release-during-await defect in the existing stream/context owner.
