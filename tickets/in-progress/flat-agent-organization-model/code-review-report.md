# Code Review Report

## Review Round Meta

- Review Entry Point: `Implementation Review — skill-reloaded full cumulative re-review`
- Requirements Doc Reviewed As Context: `requirements-doc.md` through approved `RER-021`
- Investigation / Requirements Revision Context: `investigation-notes.md`; `requirements-revision-record.md`
- Design Spec Reviewed As Context: `design-spec.md` through cumulative `AD-REV-011`, including the accepted `AD-REV-009/010` lifecycle mechanism
- Supplemental Artifacts: `agent-org-contract.md`; Product `RV-012 / VIS-001–020`; approved mounted-Team-status supplement `VIS-STATUS-001–003`; `production_data_migration_conventions.md`; the user-confirmed automatic-recovery/terminal-history correction recorded in `IR-015`
- Architecture Review: `ARCH-REV-009 / Pass`
- Implementation Handoff / Revision Record: reviewed through `IR-016`
- Current Source Revision: `IR-016@394fc27f896dac4121ef166cc0972b60e8b89ce4`
- Current Implementation Artifact: `b19c41e68c119f9a9590c5b04839454dae5f64b8`
- Code Review Revision ID: `CRR-017`
- Current Review Round: `17`
- Trigger: IR-016 Local Fix for `CR-FIND-017/018`; the user's standing instruction to repeat a fresh whole-ticket review after multiple local-fix rounds
- Prior Authoritative Result: `CRR-016 / Fail — Local Fix`
- Relevant API/E2E Result: `API-REV-003 / Fail / 92.9%`, executed against IR-012; its implementation findings were corrected in IR-014 and accepted in CRR-016
- Delivery Revisions: `N/A — pending`

## Routing Classification Review

- Task size: `Large`
- Architectural risk: `High`
- Selected route: `Implementation Review`
- Independent source review required: `Yes`
- Classification correction required: `None`. The cumulative ticket still spans definition, migration, runtime, task, shutdown, persistence, history, GraphQL/stream, and responsive web boundaries.

## Review Scope

- Changed implementation and behavior reviewed: the full cumulative implementation from pre-implementation authority `f3035a2d5ba90e64c51113fcd957524a3afd9cf9` through `b19c41e68`, not only IR-016; all prior findings; strict Team V2/Org V1 definitions and packages; startup migration; execution identity; communication/tasks; shutdown; persistence/history/restore; stream/context/focus; accepted Agent/Team surfaces; mounted-Team status; automatic recovery and terminal-history UX.
- Files / areas reviewed: `621` cumulative changed paths, including the previously established `367` production implementation-source paths; all `63` changed production-source files over `220` effective non-empty lines; `0` over the `500` hard limit. IR-016 modifies three production files and one focused test file, reducing rather than expanding the public surface.
- Explicit exclusions: API/E2E-owned dirty integration edits and retained evidence are review inputs rather than IR-016 source; generated SDK `dist/` outputs are not implementation source; external Agent repositories remain outside this ticket's edit/release scope; Code Review authored no production fix.
- Method: reloaded the Code Reviewer skill, shared design principles, Example 9, report template, upstream authority, and current implementation artifacts; rebuilt the cumulative path/size/legacy inventory; traced every material candidate from an approved scenario or engineering contract through the production path before deciding or scoring it.

## Upstream Behavior And Production-Path Basis Confirmation

- Approved requirements basis understood: `Yes`
- Design-spec behavior map verified against implementation: `Yes`
- Architecture review round confirmed: `ARCH-REV-009 / Pass`
- Behavior-basis status: `Confirmed`
- Changed or newly discovered behavior: `None`
- Remaining material ambiguity: `None`

| Behavior ID | Current Status | Current Implementation Path And Lifecycle Evidence | Contradicting Or New Evidence |
| --- | --- | --- | --- |
| `BEH-001`–`BEH-004`, `BEH-007/008/010/011` | `Confirmed` | Target-only definition admission, fixed-depth Org composition, root-first handoffs, startup-only migration, exact Team V2/Org V1 packages, accepted focus/surfaces, and mounted-Team status remain intact. | None. |
| `BEH-005/006/009`; `CR-FIND-015/016` | `Confirmed` | IR-014 retains exact task-event retirement during committed local teardown and complete-generation atomic/awaited root-package readiness. | Independent server `15 files / 110 tests` and the retained production-shaped IR-014 regressions pass. |
| `DS-017/018/019`; automatic recovery | `Confirmed` | Valid server `ERROR` throws into current-generation fail-close, then the single bounded recovery scheduler. Only the five-attempt exhaustion boundary publishes a visible error; a later verified snapshot clears it. | Exact stream `13/13`; focused web `75/75`; source trace at `agentOrgStreamingService.ts:207-210,267-273,304-348`. |
| IR-015 terminal-history behavior | `Confirmed` | Inactive Org roots open as history without a stream or manual lifecycle action; historical member selection uses the existing exact-root restore and exact focus path. | Focused workspace/history tests and retained desktop/narrow rendered evidence. |

## Supported Product Scenario And Reachability Gate

| Scenario ID | Related Behavior / Contract IDs | Kind | Actor / Initiator | Coherent Goal Or Governing Event | Supported Entry Surface / Event | Shape | Forward Production Path / Lifecycle | Expected Outcome / Consequence | Independent Evidence | Validity | Review Use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-SCN-027` | `BEH-009`, `REQ-015`, `AC-010`, `SCN-005/006` | `User/System` | Org delegator/reviewer and mounted-Team task Agent | Complete a delegated task and settle its execution without losing root authority | Collaboration task tools and normal terminal settlement | `Normal` | task tools -> root FIFO -> durable terminal record -> exact teardown -> unregister | durable settlement and usable Org | approved requirements/design and real API-FIND-012 evidence | `Supported Normal Scenario` | `Use` |
| `CR-SCN-028` | `BEH-005/006/008`, `AC-009/011/020`, `SCN-006/010` | `User/System` | user after same-data application restart | Reopen retained standalone Team and Org history | normal history/workspace surfaces | `Normal` | generic history -> shared readiness -> subject catalog -> Team row/Restore | every valid retained package is visible/restorable | requirements and real API-FIND-013 retained data | `Supported Normal Scenario` | `Use` |
| `CR-SCN-031` | `DS-017/018/019`, `AC-009`; automatic-recovery contract | `Operational/System` | supported AgentOrg stream/restart lifecycle | Transparently recover an active/reopening Org connection and report failure only after bounded attempts actually exhaust | production WebSocket close or valid server `ERROR` | `Explicit Edge` | connect -> strict frame handling -> fail-close -> bounded reconnect/checkpoint -> verified candidate or terminal notice | no false exhaustion notice; exact context/focus remains authoritative | reviewed design, IR-015/016 artifacts, production server/client paths, focused regression | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-032` | IR-015 terminal history; `AC-009/011`; `VIS-STATUS-003` | `User` | user inspecting a stopped Org | Inspect history and continue by selecting an exact historical member | Org history root/member rows | `Normal` | inactive root -> history/no stream -> member selection -> exact restore/focus -> accepted surface | truthful offline history and exact continuation | approved history/restore requirements and user-confirmed simplification | `Supported Normal Scenario` | `Use` |
| `CR-CONTRACT-004` | shared removal/cleanup contract; IR-015 removal scope | `Contract` | engineering ownership contract | Remove superseded manual recovery entry points when automatic recovery becomes sole authority | changed service/store API boundary | `Normal` | removed UI action -> service/store usage audit | no dead public manual-reopen chain | shared design principles and repository usage graph | `Supported Normal Scenario` | `Use` |

### Candidate Finding And Mechanism Gate

| Candidate ID | Observation Or Mechanism | Scenario / Contract ID | Independent Trigger | Forward Path / Lifecycle / Consequence | Evidence | Disposition | Reason / Proportionate Response |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-CAND-034` | IR-014 retirement could weaken strict live-event admission. | `CR-SCN-027` | normal committed task settlement | exact lease begins only after durable write, suppresses only the exact committed teardown status during awaited local teardown, then releases | current source and focused regressions | `Reject` | Resolved/acceptable: lifecycle-bounded and identity-exact; no broader suppression or second authority. |
| `CR-CAND-035` | IR-014 readiness could expose a partial generation. | `CR-SCN-028` | first mixed history query after restart | candidate builds off-state, retries admission revision changes, swaps complete Team/Org/diagnostics together, and Team history awaits it | readiness/catalog source and focused regression | `Reject` | Resolved/acceptable without request serialization or a second cache. |
| `CR-CAND-036` | A valid server `ERROR` might still publish an exhaustion notice on its first frame. | `CR-SCN-031` | production server error | IR-016 now routes `ERROR` -> throw -> `failClosed` -> single scheduler; `reportError` exists only at exhausted attempt count | source trace; exact `13/13`; `rg` finds one caller at the exhaustion branch | `Reject` | `CR-FIND-017` is resolved. Preserve strict fail-close and the sole visible exhaustion exit. |
| `CR-CAND-037` | Removed UI actions might leave a public manual-reopen chain. | `CR-CONTRACT-004` | automatic-only recovery contract | usage graph now contains only private `reopenOwned`; public service/store/active-context reopen methods are deleted | IR-016 diff and repository-wide `rg` | `Reject` | `CR-FIND-018` is resolved; no manual fallback or duplicate recovery owner remains. |
| `CR-CAND-038` | Repeatedly invoke actions during retry and require global user-action serialization. | `CR-SCN-031` | no independent supported contradictory multi-action goal | artificial timing would add coordination unrelated to the observed contract | Example 9; no Product/operational contract | `Reject` | Technically possible but unsupported/contrived; do not add machinery. |
| `CR-CAND-039` | Treat all server errors as permissive/recoverable or weaken schema/root/sequence/ACK admission. | `CR-SCN-031` | none | would blur command/protocol identity and current-generation strictness | DS-017/018 and current strict handlers | `Reject` | IR-016 changes visibility timing only; strict admission remains required. |
| `CR-CAND-040` | Unchanged unused locale/type-generation strings and product docs still describe the older nested-Team model. | delivery docs/generated-artifact sync | no current production caller; files are unchanged from the implementation baseline | current Team UI/operations/server schema are Agent-only; repository usage search finds no production caller for the old locale/type declarations | baseline diff and `rg` usage audit | `Reject` | Not a reachable current product behavior or changed-source defect, so it cannot drive a finding or score deduction. Record product-document/generated-artifact sync for Delivery instead. |

## Structural / Design Checks

| Check | Result | Evidence | Required Action |
| --- | --- | --- | --- |
| Task design health assessment is present, evidence-backed, and preserved | `Pass` | Large/High assessment, AD-REV-011, ARCH-REV-009, and cumulative implementation validation are present. | None. |
| Implementation matches approved behavior-defining supplemental artifacts | `Pass` | Exact Team/Org, Product RV-012/status, automatic recovery, and terminal-history behavior align. | None. |
| Data-flow spine inventory clarity and preservation | `Pass` | Definition, migration, launch, task, persistence, history, presentation, recovery, and shutdown spines have explicit owners. | None. |
| Ownership boundary preservation and clarity | `Pass` | One AgentOrg stream service owns generation/recovery; existing Org/readiness/lifecycle owners retain their responsibilities. | None. |
| Off-spine concern clarity | `Pass` | Snapshot hydration, projection, persistence, notices, and catalogs remain subordinate to explicit roots. | None. |
| Existing capability/subsystem reuse check | `Pass` | IR-014–016 extend existing settlement, readiness, checkpoint, store, and accepted-surface owners. | None. |
| Reusable owned structures check | `Pass` | Shared notice, five-state fold, exact identities, and strict package models are reused. | None. |
| Shared-structure/data-model tightness check | `Pass` | Team V2 and Org V1 are specialized, exact, and non-overlapping. | None. |
| Repeated coordination ownership check | `Pass` | One readiness generation and one stream recovery service own their coordination. | None. |
| Empty indirection check | `Pass` | Remaining adapters translate real identity, persistence, or presentation boundaries. | None. |
| Scope-appropriate separation of concerns and file responsibility clarity | `Pass` | No bespoke Org dashboard, parallel context, second recovery subsystem, or mixed persistence authority remains. | None. |
| Ownership-driven dependency check | `Pass` | No forbidden shortcut or unjustified cycle was found. | None. |
| Authoritative Boundary Rule check | `Pass` | Callers use subject services/stores rather than coupling outer owners to internal managers/repositories. | None. |
| File placement check | `Pass` | Recovery, history, readiness, task, and lifecycle code reside in their owning subsystems. | None. |
| Flat-vs-over-split layout judgment | `Pass` | Layout is proportionate; the shared notice is a real reusable concern. | None. |
| Interface/API/query/command/service boundary clarity | `Pass` | Exact identity shapes remain explicit; IR-016 removed the obsolete public manual-reopen chain. | None. |
| Naming quality and responsibility alignment | `Pass` | Current types/methods accurately name recovery, retirement, readiness, and history roles. | None. |
| No unjustified duplication / repeated structures | `Pass` | No parallel recovery, readiness, topology, or persistence shape was introduced. | None. |
| Patch-on-patch complexity control | `Pass` | Fresh cumulative audit confirms IR-016 collapses duplicate visible-error/manual entry paths rather than layering another patch. | None. |
| Dead/obsolete code cleanup completeness | `Pass` | Public `reopenAgentOrg -> reopen -> reopen` chain is absent; private `reopenOwned` is called only by the automatic owner. | None. |
| Relevant test scenarios and assertions are requirement-aligned | `Pass` | Deterministic tests cover first ERROR privacy, five retries, one exhausted notice, later verified publication/error clear, release/generation, focus, and strict correlation. | None. |
| Test fixtures/helpers are reasonably reusable | `Pass` | Context/socket/root builders remain coherent and reused. | None. |
| No stale/duplicated/compatibility-only tests retained | `Pass` | No tests were removed to obtain the result; no compatibility-only runtime path was added. | None. |
| API/E2E readiness | `Pass` | Focused server/web cohorts and both production builds pass; prior real-system defects have production-shaped regressions. | Resume cumulative API/E2E. |

## Source File Size And Structure Audit

`621` cumulative changed paths retain the established `367` production-source inventory. All `63` files over the `>220` review signal were reassessed; none exceeds `500` effective non-empty lines. Current IR-014–016 high-signal production files:

| Source File | Effective Non-Empty Lines | `>500` | `>220` | SoC / Ownership | Placement | Classification | Required Action |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| `agent-org-run.ts` | 444 | Pass | Signal assessed | Cohesive Org aggregate; retirement remains exact/private | Pass | Accept | None. |
| `agent-org-task-lifecycle-adapter.ts` | 256 | Pass | Signal assessed | Persistence/settlement adapter is coherent | Pass | Accept | None. |
| `root-run-package-readiness-index.ts` | 308 | Pass | Signal assessed | One shared atomic readiness generation | Pass | Accept | None. |
| `team-run-history-catalog-service.ts` | 269 | Pass | Signal assessed | Team history/cache owner | Pass | Accept | None. |
| `WorkspaceAdaptiveLayout.vue` | 280 | Pass | Signal assessed | Existing layout owner | Pass | Accept | None. |
| `AgentWorkspaceSurface.vue` | 87 | Pass | Pass | Accepted Agent surface | Pass | Accept | None. |
| `WorkspaceRecoveryNotice.vue` | 8 | Pass | Pass | Shared message-only notice | Pass | Accept | None. |
| `AgentOrgRunHistoryPanel.vue` | 297 | Pass | Signal assessed | History/focus/lifecycle presentation | Pass | Accept | None. |
| `AgentOrgWorkspaceView.vue` | 99 | Pass | Pass | Org route/context composition | Pass | Accept | None. |
| `TeamWorkspaceSurface.vue` | 87 | Pass | Pass | Accepted Team-member surface | Pass | Accept | None. |
| `en/workspace.ts` / `zh-CN/workspace.ts` | 338 / 337 | Pass | Signal assessed | Localization catalogs | Pass | Accept | None. |
| `agentOrgStreamingService.ts` | 392 | Pass | Signal assessed | Sole strict transport/recovery owner; one visible exhaustion exit | Pass | Accept | None. |
| `activeContextStore.ts` | 254 | Pass | Signal assessed | Workspace target/context owner; manual reopen removed | Pass | Accept | None. |
| `agentOrgContextsStore.ts` | 54 | Pass | Pass | Minimal Org service/context/error registry | Pass | Accept | None. |

## Legacy / Backward-Compatibility Verdict

| Check | Result | Notes |
| --- | --- | --- |
| No backward-compatibility mechanisms in changed scope | `Pass` | Normal runtime is strict Team V2/Org V1. |
| No legacy old-behavior retention in changed scope | `Pass` | No nested configured-Team runtime, bespoke Org dashboard, raw envelope, or visible/manual Reconnect behavior remains. |
| Dead/obsolete code cleanup completeness | `Pass` | The changed public manual-reopen chain is removed. |
| Approved persisted-data transition decision followed | `Pass` | Required migration remains startup-only and isolated; IR-016 does not affect persisted data. |
| No version-specific dual reads/writes or request-time old-shape fallback | `Pass` | None found. |
| Transition mechanics match reviewed design | `Pass` | Migration remains preflighted, rerunnable under its approved interruption cases, and isolated from runtime. |

## Dead / Obsolete / Legacy Items Requiring Removal

`None in changed implementation source.` The former public manual-reopen chain is removed. Unchanged no-caller generated/localization remnants are not a production finding under `CR-CAND-040`; product documentation/generated-artifact synchronization is recorded for Delivery.

## Docs-Impact Verdict

- Docs impact: `Yes — delivery-stage synchronization`
- Why: ticket implementation/revision artifacts are current through IR-016. Existing product documentation such as `autobyteus-web/docs/agent_teams.md` and related README/generated descriptions still contain older nested-Team language and should be reconciled with the strict Agent-only Team V2 / fixed-depth Org V1 model during Delivery. This does not change runtime behavior or block the source Pass.
- Files or areas likely affected: Agent Teams/Agent Org product documentation, README references, and generated GraphQL/localization cleanup if the Delivery regeneration/audit confirms they remain obsolete.

## Additional Material Premise Validation

- Upstream `AR-PREM-004`–`AR-PREM-006`: `Confirmed`; IR-014 preserves the approved supported settlement/shutdown/readiness paths.
- New or reclassified premise outside the scenario/candidate tables: `None`.

## Independent Validation Evidence

- Exact AgentOrg stream service: `1 file / 13 tests passed` — `/tmp/aorg-crr017-stream-focused.log`.
- Current focused web cohort: `8 files / 75 tests passed` — `/tmp/aorg-crr017-web-focused.log`.
- Cumulative high-signal server cohort: `15 files / 110 tests passed` — `/tmp/aorg-crr017-server-cumulative-focused.log`.
- Current web production build and `16`-route prerender: `passed` — `/tmp/aorg-crr017-web-build.log`.
- Server production build and sanitized built-in-agent bootstrap: `passed`; server source is unchanged from the independently built CRR-016 state — `/tmp/aorg-crr016-server-build.log`.
- Implementation web/localization guards and exact IR-016 evidence: passed in `/tmp/aorg-ir016-web-guards.log`, `/tmp/aorg-ir016-stream-focused.log`, and `/tmp/aorg-ir016-web-focused.log`.
- Repository-wide dead-chain audit: no `reopenAgentOrg`, store public `reopen`, or service public `reopen`; only private `reopenOwned` remains.
- Cumulative `git diff --check`: `passed`; production-source size audit: `0 >500`.
- No full web-suite pass is claimed from an accidentally started watch-mode run; only the exact completed commands above are evidence.

## Review Scorecard

- Overall score: `9.2/10`
- Overall score: `91.6/100`
- Decision note: every category meets the `>=9.0` clean-pass target; the average does not replace the finding/behavior gates.

| Priority | Category | Score | Why | Weakness / Holding It Down | Improvement |
| --- | --- | ---: | --- | --- | --- |
| 1 | Data-Flow Spine Inventory and Clarity | 9.2 | Definition, migration, execution, task, history, presentation, recovery, and shutdown spines are explicit and independently traced. | The legitimately broad lifecycle still requires cross-subsystem evidence. | Preserve production-shaped end-to-end regressions. |
| 2 | Ownership Clarity and Boundary Encapsulation | 9.2 | One owner exists for recovery, readiness, root lifecycle, and persistence publication. | Breadth makes owner drift a continuing review risk, not a current defect. | Keep new behavior inside these owners. |
| 3 | API / Interface / Query / Command Clarity | 9.1 | Exact root/member/run identities and strict family/version boundaries are clear; dead manual API is gone. | Identity-rich interfaces remain necessarily detailed. | Preserve exact discriminants and avoid compatibility facades. |
| 4 | Separation of Concerns and File Placement | 9.2 | Runtime, persistence, history, projection, store, and presentation responsibilities are well placed. | Several cohesive files remain above the review signal due domain breadth. | Continue extracting only when a distinct owner emerges. |
| 5 | Shared-Structure / Data-Model Tightness | 9.2 | Team V2 and Org V1 remain tight specializations with reusable exact identities. | No material current gap. | Preserve strict package families. |
| 6 | Naming Quality and Local Readability | 9.1 | Recovery, readiness, retirement, generation, and focus names reflect responsibility. | Complex lifecycle sequencing still demands careful local reading. | Keep ordering invariants explicit in tests and handoffs. |
| 7 | API/E2E Readiness | 9.1 | Focused cohorts/builds pass and every prior real-system defect has a production-shaped correction. | Renewed cumulative real-system execution has not yet run against IR-016. | Resume API/E2E with the listed supported scenarios. |
| 8 | Runtime Correctness And Behavioral Fidelity | 9.2 | Server errors are now silent during bounded recovery, terminal only at exhaustion, and cleared by verified publication; prior task/history fixes remain intact. | Final confidence still depends on downstream cumulative execution. | Retain strict error/identity/restart coverage. |
| 9 | No Backward-Compatibility / No Legacy Retention | 9.2 | Current runtime is strict; historical knowledge remains migration-only. | Approved migration remains a necessarily sensitive operational path. | Keep it startup-only and fail according to the established convention. |
| 10 | Cleanup Completeness | 9.1 | The changed manual-reopen chain and retired UI/runtime paths are removed. | Delivery still must synchronize unchanged documentation/generated descriptions. | Complete docs/generated-artifact audit during Delivery. |

## Findings

### Current Findings

`None.`

### Prior Finding Resolution

- `CR-FIND-001`–`CR-FIND-014`: remain `Resolved` after the fresh cumulative behavior/source/legacy/size review and preserved evidence.
- `CR-FIND-015`: remains `Resolved` by IR-014 exact committed teardown-event retirement; cumulative server evidence passes.
- `CR-FIND-016`: remains `Resolved` by IR-014 complete-generation readiness and awaited Team-history filtering; cumulative server evidence passes.
- `CR-FIND-017`: `Resolved` by IR-016. Valid server `ERROR` is a strict current-generation failure; only exhausted bounded recovery publishes the visible error, and verified later publication clears it.
- `CR-FIND-018`: `Resolved` by IR-016. The zero-caller public reopen chain is removed; private `reopenOwned` remains the sole checkpointed automatic recovery operation.

## Classification

- Review outcome: `Pass`
- Failure classification: `N/A`
- Design Impact: `None`
- Requirement Gap: `None`
- Product UI gap: `None`
- API/E2E readiness: `Yes — resume cumulative validation`
- Delivery readiness: `No — API/E2E has not yet passed and delivery docs sync remains pending`

## Recommended Recipient

- Apply the exact dynamic handoff rule for a passed Large/High implementation source review; expected primary next stage is `/software_engineering_team/api_e2e_engineer`.

## Residual Risks

- API/E2E should repeat the real mounted-Team settlement, first mixed post-restart Team history, valid server-error automatic recovery/exhaustion/error clearing, stopped/history member continuation, strict identity negatives, migration/startup, shutdown, Codex, standalone Team, and responsive focus paths.
- Preserve IR-013's one-FIFO/null-deferral/root-fence guarantees, IR-014's exact retirement/atomic readiness guarantees, and IR-015/016's automatic-only recovery ownership.
- No API/E2E, delivery, release, deployment, or external-repository completion is claimed.

## Latest Authoritative Result

- Review Decision: `Pass`
- Review Entry Point: `Implementation Review — skill-reloaded full cumulative re-review`
- Supported Product Scenario Gate: `Pass`
- Material-Premise Gate: `Pass`
- Score Summary: `9.2/10 (91.6/100)`; every category is at least `9.0`
- Open Findings: `None`
- Recommended Recipient: dynamic pass handoff, expected `/software_engineering_team/api_e2e_engineer`
- Notes: This is a fresh cumulative whole-ticket review, not a delta-only review. The automatic recovery behavior is confirmed: users do not click Reconnect; only private bounded recovery remains, and a visible notice appears only after all five automatic attempts fail.
