# Implementation Handoff — AORG-FLAT-TEAM-001 / IR-043 / UI-CLEAN-001

## Upstream Artifact Package
- **Architecture-reviewed / implementation-owned Local Fix**, triggered by **CRR-065 / CR-FIND-034 / API-FIND-029**. Supported normal scenario: an active standalone Team's Tasks detail links to its exact accepted/settled Agent execution; inspection must succeed without reactivation.
- Authority remains **RER-032** (including RER028–031), cumulative **AD-REV-022**, retained **AD-REV-021 / ARCH-REV-019 Pass**. Additional architecture review for the earlier one-word copy change: **N/A — not applicable**. Requirements/design/revision records, agent-org-contract, design-review report and supplemental inventories in investigation-notes.md remain upstream authority.
- Approved Product: cumulative RV012 core, mounted-Team-status and Team-overrides supplements plus baseline promotion. VIS015 remains historical for overrides, replaced by VIS-OVR001–006; baseline promotion uses its visual README, not an invented manifest. Orgs/组织 heading and compact Messages/task-detail presentation remain unchanged.
- Prior source **14f7acfce33d28b74d619ce7d10bf13903c20c3f**, artifact **b5e56b4659c1df80e7fb535eb683e4bfad00d93c**. CRR064 source Pass is historical; CRR065 supersedes advancement. API26 remains **Fail79.0**, scoped passes and held cases preserved. CRR059/API24/DR008 and DR007 evidence limits remain historical, not current acceptance.
- **CR-FIND033/API-FIND028 is resolved by API26's real cold390 Org confirmation. IR042 is untouched and not reopened.**

## Current Result / Classification
- **Implementation and implementation-scoped validation complete; ready for fresh independent cumulative source review.**
- Current production/test source **4ffcdf733ff597a0d2ae94587eb91ec47f749501**. This handoff/current code are authoritative; implementation-revision-record.md retains IR001–043, including the initial IR001 baseline.
- **task_size=Large / architectural_risk=High — confirmed cumulatively.** The focused change is bounded to current frontend inspection/view/selection/target owners. No Design Impact, Requirement Gap, Product gate, backend/API/schema/persistence/migration or lifecycle change discovered.
- Current source/API/Delivery result: **N/A — pending**. Implementation self-check is not independent source review; direct-route lightweight review is N/A for this Large/High package. Selected current `get_handoff_rules` condition: “When an implementation-owned Local Fix requested by the code reviewer or delivery engineer is complete, the existing package is task_size=Large or architectural_risk=High, and the updated implementation must return for source review.” Exact recipient **/software_engineering_team/code_reviewer**.

## Behavior / Production-Path Trace
| IDs / supported spine | Current implementation outcome | Local proof |
| --- | --- | --- |
| BEH018; REQ035/036; AC030/034; SCN019; DS030/DS034b | Shared task name/disclosure -> real navigation -> runHistoryStore inspection -> exact projection hydration -> view inspection focus -> target -> established Team monitor and Activity. Retained membership/placement, not live-list visibility, admits the exact read. | New production-shaped actual-component/Pinia/navigation/hydration/view/target suite; browser renderer with actual shared controls and synthetic exact responses. |
| AC034; DS034b | Commit focus only after successful hydration; repeated same-address tasks retain exact AgentRun and browse identity. Settled targets expose `read_only`, no interaction port, no Restore or root activity toggle. | Held projection, exact conversation/Activity and first/second task IDs, strict unavailable/miscorrelated/unknown/replaced-root negatives, zero command/stream/mutation calls. |
| REQ035/036; DS028–030 retained identity | Existing view owns one selected ID plus retained-inspection intent. Live navigation still excludes settled rows. Ordinary selected live task repairs to a live member when settlement arrives; deliberate retained inspection survives later task events/snapshots. | View task-Agent/task-Team/non-coordinator/recursive tests; live accepted-before-settlement case; strict snapshot and same-root placement tests. |
| Existing Team open/recovery contracts | Normal hydration and existing verified stream-replacement candidate use the same inspection focus operation, not the live-row gate. No new recovery path. | Active/inactive retained hydration, exact retained replacement, existing checkpoint/context/revision/conflict-bound suites. |
| Cumulative RER028–032 / IR042 | Org cold-read fix, task-inclusive communication/relevance, accepted input, title eligibility, authoring transition, persistence/migrations/FIFO/fences/settlement and approved layout remain. | Org context/stream/no-refocus and cold-history suites in affected cohort; no server or Org source delta. Broader provider/system validation remains API/E2E-owned. |

## Key Files / Design Health / Clean Cut
- `services/runHydration/teamMemberProjectionHydrationService.ts`: validates exact retained AgentContext/run/location under the mounted root; removes the erroneous live-navigation-row precondition. Existing exact request, projection correlation and pre/post-await context/location/revision checks remain.
- `services/teamExecution/teamExecutionViewState.ts`: one view-owned `focusAgentForInspection` and derived focused access, using existing retained/live selectors; existing `focusAgent` keeps ordinary navigation admission. Focused detail projection includes retained task presentation without adding it to live rows or changing root state.
- `services/runOpen/teamMemberInspectionCoordinator.ts`: successful hydration then inspection focus then existing selection commit. `teamRunContextHydrationService.ts` and `teamRunOpenCoordinator.ts` preserve the same exact focus through existing read/recovery boundaries.
- `stores/activeContextStore.ts`: assembles the already-supported read-only target variant for retired task executions, without an interaction port. Configured and eligible task interaction paths retain existing behavior, including stopped configured-member handling.
- Four test files: new `RetainedTeamTaskNavigation.spec.ts`; extended view-state, Team context hydration and Team open coordinator suites. Eleven new cases; actual task records/tree are strictly decoded in the new integration fixture.
- Six production files, maximum **411 effective nonempty lines**, no >500 file or >220 production changed-line signal. No shared DTO expansion, wrapper, fallback, alternate cache/selection/runtime owner, polling, retries, timeout, replay, manual reconnect or permissive deduplication. Existing conflict handling is unchanged, not added here.
- Design-health diagnosis agrees with CRR065: conflation of live navigation eligibility and retained inspection. A bounded correction within existing owners suffices; no architecture-owned refactor or new Product design is needed. Persisted data **Not Affected**.

## Local Implementation Checks
Evidence: `implementation-evidence/IR-043/local-checks.md`, exact commands/logs and source inventory.
- Final affected cohort **28 files /203 tests pass**. Includes Team/Org context/stream/history/task presentation, actual retained navigation, strict identity/hydration/revision checks, task settlement focus repair, existing focus-send, and unchanged IR042 Org cold navigation.
- Overlapping earlier focused **7 files /47 tests pass**, not additive. Three subsequently added hydration/recovery cases are included in final203.
- The finalized strict-fixture new case fails against the original pre-fix hydration gate with the original visible-member error and no projection read; fixed source restored byte-for-byte afterward. This expected failing run is not a current-package failure/pass claim.
- Both boundary guards and mandatory localization audit pass, **zero unresolved findings**.
- Existing generated SDK prerequisite build and production Nuxt build/prerender pass, **16 routes**. No full typecheck, Electron build, AppImage/package, provider or API/E2E sign-off claimed.
- Initial test/fixture issues are disclosed in local-checks.md: hydrated message shape expectation, return-to-delegator before another task, missing active hydration callback, missing synthetic update discriminators. No production admission was weakened to accommodate them.

## Rendered Frontend Feedback Loop
- Read approved shared Tasks/retained-inspection behavior and adjacent shared Team surfaces; used normal isolated Nuxt renderer and native Chromium.
- Five final states, desktop1440×900 and narrow390×844: closed/accepted task detail, exact retained verifier, repeated same-address second verifier, actual conversation/Activity, accepted/Offline header, no composer, root still active. Keyboard Enter and touch Back-to-lead exercised; no pageerrors/horizontal overflow/mutation or lifecycle requests.
- Direct visual inspection caught a fixture-only narrow flex-height problem and incorrect synthetic update discriminators; corrected both and reran. Final viewport assertions verify the monitor is actually visible, not merely present in DOM. No production layout/style change needed.
- Synthetic current records/projections, memory router and temporary diagnostic header/Back/layout are scaffolding. This is not the actual normal workspace-tree/browser-history/provider journey or all locales/targets. API/E2E must execute the real current-artifact journey and held matrix.

## Preservation / Environment / Residual Risks
- **11,545 starting other-owner dirty/untracked hashes unchanged** after local validation. API/reviewer/Delivery tests/reports/docs and raw evidence remain untouched/unstaged. No raw DB/env/key material or old package committed/published.
- Own temporary page/dev process and initially absent generated SDK output removed. Production frontend output is generated evidence only, not a fresh desktop package. Reproduction needs the same SDK build prerequisite.
- API26's original Team query-retention assertion remains an API-owned observation correction; the independently normal-tree settled-task defect is addressed here. No server-crash/provider-stall/old settlement-delay/first-guard origin is inferred. Prior external-definition, native/manual-user, multi-node and queue-timestamp evidence limitations remain binding.

## Downstream Handoff
Return one cumulative package for **fresh source review**, then **full renewed API/E2E** after Pass. Specifically rerun normal active standalone Team -> tree /lead -> accepted/settled assignment -> disclosed exact verifier, with actual conversation/Activity/read-only and no writes. Reconcile warm/inactive/repeated identity and all held locale/narrow/frozen/recovery/restart/Restore/compaction/title/stopped cases on the current artifact. Historical API24/CRR059/DR008 or local fixture evidence cannot substitute. No Delivery, native-shell, user verification, release or deployment readiness.
