# API/E2E Test-Case Ledger

**Current completed disposition: API-REV-003 ticket Pass95%, reporting-only CRF-002 correction.** Prior observations/results below remain historical. API-F001/C16 is a separate unresolved observation; C16 is not relabelled Pass.

## Ledger Meta
- Round: 1, triggered by Code Reviewer CRR-002 Pass following IR-002 correction; prior API/E2E result/confidence: N/A (no prior record).
- Authority: requirements-doc.md / investigation-notes.md / requirements-revision-record.md (Approved RER-004); design-spec.md / architecture-design-revision-record.md (AD-REV-001); design-review-report.md / architecture-review-revision-record.md (ARCH-REV-002 Pass); implementation-handoff.md / implementation-revision-record.md (IR-002); code-review-report.md / code-review-revision-record.md (CRR-002 Pass, CRF-001 resolved). All paths are in this ticket directory.
- Supplements: evidence/context-budget-probe*, architecture-runtime-capacity-probe*, implementation-capacity-probe*, implementation-source-size-check.json, implementation-render-inspection.mjs, rendered/, local-checks/, code-review/, code-review-CRR-002/, IR-002/. These remain attributed prior evidence, not current execution. Original user screenshot path is indexed by investigation-notes.md. Prototype/UI-UX and Delivery/DR: N/A — not applicable/not yet performed.
- Canonical workspace: /home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model; branch requirements/stopped-run-compatible-model; intake HEAD 5f7a9b47e228e25529f5bd0acf80ea3a2142d303. Reviewed production 88afb0512964b59d4734117c01ee0cb6925c2e81; approved base a32b53f6320222c9bf3c7f3a4a3c50fbd1e44f27.
- Classification: task_size=Medium; architectural_risk=High; Reviewed input route. Success requires proportional test-code review by Code Reviewer (Required if durable tests changed); no fixed successful-delivery assumption. No API-REV yet until completed result.

Canonical investigation: api-e2e-coverage-investigation.md. Authoritative round result: api-e2e-execution-coverage-report.md (pending). Cross-round record: api-e2e-revision-record.md (after completion). Required for multi-case/provider/browser execution. Initialized 2026-09-09 before execution.

## Planned Cases
| Case ID | Journey | AC / requirement | Surface / entry | Order |
| --- | --- | --- | --- | --- |
| API-C01 | Selection/capacity/commit/Team uncertainty and lifecycle units | AC-002–008/011–013 | Vitest focused server | 1 |
| API-C02 | Web pair/planner/schema/canonical recovery units | AC-001/003/004/007/008/011 | Vitest Nuxt | 2 |
| API-C03 | Fresh production server build | AC-004–009 | documented pnpm server build | 3 |
| API-C04 | Application ownership integration | AC-006 | Vitest integration | 4 |
| API-C05 | Real network GraphQL stopped Agent/Team persistence/restart and required pair | AC-004–008/011 | built isolated server E2E | 5 |
| API-C06 | Browser settings-only and replacement/Retry journeys | AC-001/003–008/011 | Nuxt renderer + Chromium | 6 |
| API-C07 | Real Codex Settings Save / normal same-conversation model replacement | AC-001/005/009; REQ-008 | isolated built server + browser + provider | 7 |
| API-C08 | Configured member/nested continuation | AC-008/009 | live configured Team | 8 |
| API-C09 | Already-compacted continuation and no Save-time history rewrite | AC-009/010/013 | owned retained history + supported Save/resume | 9 |

## Execution Events
No started cases yet.

## Re-entry And Reconciliation
Not reconciled; initial plan. No completed round/result inferred.

### API-C01 Started — 2026-09-09T14:16:03Z
Focused current server selection/capacity/persistence/lifecycle checks; expected all pass.

### API-C01 Completed — 2026-09-09T14:16:15Z
Exit 0; evidence/api-e2e/server-focused.log.

API-C01 Result: Pass — 8 files / 68 tests.

### API-C02 Started — 2026-09-09T14:16:35Z
Web pair/defaults/planner/recovery; expected all pass.

### API-C02 Completed — 2026-09-09T14:16:59Z
Exit 0; evidence/api-e2e/web-focused.log.

API-C02 Result: Pass — 11 files / 124 tests.

### API-C03 Started — 2026-09-09T14:17:20Z
Documented production build; expected build/assets/bootstrap smoke pass.

### API-C03 Completed — 2026-09-09T14:17:46Z
Exit 0; evidence/api-e2e/server-build.log.

API-C03 Result: Pass — documented production build and sanitized bootstrap smoke.

### API-C04 Started — 2026-09-09T14:18:01Z
Application-owned Studio update integration; expected lifecycle/ownership pass.

### API-C04 Completed — 2026-09-09T14:18:06Z
Exit 0; evidence/api-e2e/ownership-integration.log.

API-C04 Result: Pass — 1 file / 3 tests (real owner stores/reentry; provider fake).

### API-C05 Started — 2026-09-09T14:18:24Z
Built isolated server + network GraphQL + filesystem + restart; required pair negatives and retained settings lifecycle.

### API-C05 Completed — 2026-09-09T14:18:40Z
Exit 0; evidence/api-e2e/graphql-e2e.log.

API-C05 Result: Pass — 2 network GraphQL current-data/restart cases; replacement not inferred.

### API-C06a Started — 2026-09-09T14:19:17Z
Durable browser settings-only preservation; deterministic GraphQL, actual Nuxt/Chromium.

### API-C06a Completed — 2026-09-09T14:19:33Z
Exit 0; evidence/api-e2e/browser-preserved/.

API-C06a Result: Pass — 4 renderer scenarios, settings-only/save/discard/active lock.

### API-C06b Started — 2026-09-09T14:19:58Z
Replacement keyboard/schema and configured propagation rendered probe, independent rerun with new output.

### API-C06b Completed — 2026-09-09T14:20:14Z
Exit 0; evidence/api-e2e/browser-replacement/.

API-C06b Result: Pass — replacement/defaults/linked Team propagation and narrow layout; deterministic transport only.

### API-C06c Started — 2026-09-09T14:20:40Z
CRF-001 rendered indeterminate -> failed verification -> Retry; expected one mutation/clean canonical pair.

### API-C06c Completed — 2026-09-09T14:20:54Z
Exit 0; evidence/api-e2e/browser-retry/.

API-C06c Result: Pass — one mutation/three reads, Retry and verified pair/error cleared at 1280/520. API-C06 aggregate Pass for renderer-only scope.

### API-C07 Started — 2026-09-09T14:21:42Z
Real supported built server/Nuxt/Chromium/Codex. Initial model chosen from live catalog; expected actual new-model same-thread continuation.

### API-C07 Checkpoint — 2026-09-09T14:23:26Z
Real built server, unique DB/data, Nuxt and Chromium ready. Public API created owned Codex run; full Workspace route sent prior unique fact and actual provider replied Remembered. Initial catalog-selected gpt-5.3-codex-spark; provider identity recorded in owned metadata. Evidence live-{environment,open,send-first} files; continuation not yet proven.

### API-C07 Checkpoint — 2026-09-09T14:24:49Z
First Save probe did not submit mutation: harness refocused search before Enter, instead of following option focus. Corrected to keyboard Enter after ArrowDown; retained live-save-harness-error.log. Not a product failure or completed case.

### API-C07 Checkpoint — 2026-09-09T14:26:51Z
Real Settings Save from spark 128000 to luna 272000 committed and stayed stopped, same provider thread. Fresh options use luna baseline; attempted smaller spark rejected VALIDATION_FAILED with canonical luna retained. Probe mistakenly waited for mock success copy; actual production success copy differs. This is a harness assertion correction, not product Fail. Next equal-capacity Save to terra will checkpoint hashes/pair before mutation. Evidence live-first-save-verify.json, live-save-feedback-error.log.

### API-C07 Checkpoint — 2026-09-09T14:27:05Z
Equal-capacity luna -> terra Settings Save passed: exactly one mutation; unchanged all fixed metadata and all non-metadata run files; canonical stopped state. live-save-result.json and live-save.png.

### API-C07 Completed — 2026-09-09T14:27:40Z — Pass
Full /workspace Settings -> explicit Save -> normal next message; live model spark -> terra, provider turn_context records gpt-5.6-terra and task_complete returns unique earlier label absent from new input. Same local run/provider thread. Larger then equal saves accepted, fresh smaller reverse rejected. live-{save-result,resume,provider-after,first-save-verify} evidence. No provider self-identification used. Renderer harness corrections (focus, native option selector, production success copy) did not alter production and are retained separately.

### API-C09 Started — 2026-09-09T14:28:00Z
Execution reordered ahead of C08: previous normal resumed turn naturally generated provider `compacted` record retaining the earlier fact. Reuse this now genuinely already-compacted owned conversation rather than invent compaction fixture or lower thresholds. Will stop, change model through Settings, hash local history and exact provider transcript before/after Save, then normal continuation with new unique suffix. No compaction command/config/history conversion injected.

### API-C09 Completed — 2026-09-09T14:29:37Z — Pass
Naturally already-compacted Codex history continued after Settings terra -> sol Save. Same provider/local ID; original compacted payload hash retained; all local history and provider transcript hashes unchanged by Save. Provider turn_context gpt-5.6-sol and task_complete returns prior fact plus new suffix. No forced compaction or lowered thresholds. Evidence live-save-compacted-result.json, live-provider-compacted.json, live-resume-compacted.png.

### API-C08 Started — 2026-09-09T14:29:37Z
Configured nested Team/member continuation, public fixture creation and supported Settings/normal input paths.

### API-C08 Checkpoint — 2026-09-09T14:30:42Z
Owned root/nested Team created by GraphQL, normal Workspace direct member input seeded lead context with real luna response. Persisted tree has no domain kind discriminator; corrected only harness traversal and recovered the single already-created owned tree without re-launch. live-team.json / live-team-first-lead.*.

### API-C08 Checkpoint — 2026-09-09T14:32:08Z
Both nested members seeded prior private labels using live luna. One real Team Settings Save changes nested default+linked lead to sol and explicitly edited reviewer to terra; root/coordinator remain luna. Exactly intended three patches, runtime/provider IDs/topology/task records and all non-tree files unchanged; root stays stopped. live-team-save-result.json.

### Additional Planned Cases (before execution)
- API-C10: affected Team/Agent manager integrations, memory-layout/projection and preserved archive/lifecycle coverage; current pair fixture adaptations, real stores and fake providers. AC-005/006/008–010.
- API-C11: extended durable browser harness, preserved scenarios plus Agent replacement and Team indeterminate/Retry; AC-001/003/004/007/008/011. Adds durable current feature regression coverage after temporary and live evidence.

### API-C08 Completed — 2026-09-09T14:34:41Z — Pass
Both configured nested lead and directly edited reviewer resumed via normal full Workspace messages; exact old provider/local IDs retained, provider turn_context independently confirms luna -> sol and luna -> terra, completed responses recall distinct pre-stop facts. Root/coordinator/tree/task/files preservation confirmed by Save hashes. live-team-provider-evidence.json and live-team-resume-{lead,reviewer}.*.

### API-C12 Planned / Started — live active/archive guards before fixture cleanup
Expected both active subjects reject Save; stopped archived subjects reject Save; no rejected-write metadata/tree change. Public existing lifecycle/archive APIs on owned fixtures only.

### API-C12 Completed — 2026-09-09T14:35:50Z — Pass
Both live active saves refused RUN_ACTIVE; both normal stops and public archives succeeded; both archived saves refused RUN_ARCHIVED. Rejected saves leave exact metadata/tree bytes unchanged. live-guards-result.json.

### Live cleanup checkpoint — 2026-09-09T14:35:50Z
All owned Agent/Team runs terminated and local history archived through public APIs. Stop only the known live-environment process; it owns backend, Nuxt group, Chromium group and unique DB/data cleanup. Exact new provider transcripts are retained as evidence; shared CLI DB/auth/config not reset.

### API-C10 Started — 2026-09-09T14:35:50Z
Affected integration fixtures, Team changed-model Save/restore ordering, native physical memory and projection; expected Pass with provider fakes clearly bounded.

### API-C10 Completed — 2026-09-09T14:36:07Z
Exit 1; evidence/api-e2e/affected-integration.log.

API-C10 initial result: Fail — 30 tests passed, 1 stale flat-validator argument assertion. Validity checked against AD-D02/current selection contract; bounded API/E2E-owned test correction, not production failure. Initial affected-integration.log retained.

### API-C10 Rerun Started — 2026-09-09T14:36:45Z
Same six integration files after stale assertion correction.

### API-C10 Rerun Completed — 2026-09-09T14:37:00Z
Exit 0; evidence/api-e2e/affected-integration-final.log.

API-C10 final Result: Pass — all 6 files / 31 tests after approved-contract stale assertion update. Initial failure preserved; no production change.

### API-C11 Started — 2026-09-09T14:37:22Z
Extended durable browser probe: original four preservation cases + changed-model Agent and Team linked/indeterminate/Retry cases.

### API-C11 Completed — 2026-09-09T14:38:08Z
Exit 1; evidence/api-e2e/browser-durable/.

API-C11 initial result: Fail — A–D/F Pass, E reused prior explicit RUN_ACTIVE UI lock. Harness isolation correction, not an implementation failure; initial output preserved.

### API-C13 Planned / Started
Rerun network GraphQL/current persisted-data tests after Team missing-pair rejection additions.

### API-C14 Planned
Native unchanged token-budget, compaction policy/configuration and actual agent runtime compaction algorithms with dummy provider; no live native-model replacement assertion.

### API-C13 Completed — 2026-09-09T14:42:22Z
Exit 0; evidence/api-e2e/graphql-e2e-final.log.

### API-C11 Rerun Started — 2026-09-09T14:42:39Z
All six scenarios, fresh page isolation after active-lock case.

API-C13 final Result: Pass — 2 built-server network scenarios including Agent/Team required-pair omission rejection and unchanged files.

### API-C14 Started — 2026-09-09T14:42:52Z
Native budget/compaction unchanged algorithm regressions; credential-free dummy provider and isolated physical memory.

### API-C14 Completed — 2026-09-09T14:42:55Z
Exit 0; evidence/api-e2e/native-compaction.log.

### API-C11 Rerun Completed — 2026-09-09T14:42:56Z
Exit 0; evidence/api-e2e/browser-durable-final/.

API-C11 final Result: Pass — all six durable renderer scenarios, no browser page errors; exact single replacement mutation and failed-read/Retry canonical recovery retained. Fresh page isolation after explicit active lock resolves only fixture assumption.

API-C14 final Result: Pass — 5 files / 20 unchanged native token-budget/compaction tests including 4 agent-runtime integration scenarios. Dummy provider, not native live-inference acceptance.

### Final reconciliation / cleanup and source audit — 2026-09-09T14:49:33.657149+00:00
All planned API-C01–C14 final Pass, C06a–c all Pass; no running/unstarted/interrupted cases. C10/C11 initial failures retained and resolved by test-only corrections. Source/browser syntax/diff checks and result correlation assertions Pass. Owned live PIDs exited, DB/data removed; renderer process/page cleanup Pass. Provider transcripts and ticket evidence retained deliberately. Completed authoritative round API-REV-001 Pass at95%; canonical report/revision persisted before handoff. E/result-summary.json, cleanup-and-evidence-audit.json and durable-test-source-audit.json.

## Round 2 supplemental live classroom request — 2026-09-10
Prior API-REV-001 Pass95%, no unresolved API failures. New user request, not inferred user acceptance/final delivery. Prior cases retained, not rerun.
- API-C15 Planned: owned services/open_tab, public UI import original agent repository, choose classroom team/Codex/gpt-5.6-luna/owned workspace, launch.
- API-C16 Planned: first normal classroom message and professor/student exchange on Luna, retain conversation-only label, stop entire Team.
- API-C17 Planned: Settings root selection Astra, linked changes/Save stopped and history+identity preservation, normal resumed classroom message with actual new provider model and context retention.

### API-C15 Started
Environment setup and public browser package import; no fixture success inferred yet.

API-C15 checkpoint: open_tab1 created at owned frontend42291; initial async-arrow run_script returned null without execution (no Import request recorded). Use supported synchronous function DOM actions; initial form screenshot renamed accurately, not an import Pass.

### API-C15 Completed — Pass
UI imported original local repository (8 shared agents,54 team-local agents,14 teams); Classroom Simulation Team selected, Codex/gpt-5.6-luna/unique classroom workspace, Run Team clicked once. Network create success and persisted current tree captured. team-created.json, launch-form.json, network.json,02-imported.png,03-luna-launch.png.

### API-C16 Started
First bounded professor/student file-handoff exercise, Luna. Conversation-only private label must not be put into files; normal UI message, no provider transport mocking.

API-C16 checkpoint: professor running on Luna; own-workspace homework created. Inspected exact provider tool call: send_message_to /student referencing only owned homework. Approved that bounded UI request; high-trust auto-approve remains false.

API-C16 checkpoint: professor FIRST_LESSON_DONE/56, student answer file present, conversation marker absent from files. Actual student return send_message_to pending ~161s (provider tool timestamp to before-stop snapshot) with no approval UI, unchanged after supported reopen; source/provenance in before-stop-state.json and screenshot04. First classroom exchange partial, not complete Pass. Stop entire owned Team through visible UI next.

### API-C16 Completed — Fail (classroom return handoff), Stop Pass
Professor actual Luna response FIRST_LESSON_DONE and student answer56 exist; professor->student communication accepted, student->professor remained pending before Stop and after normal UI reopen. No visible approval. Normal entire Team termination succeeded; UI Offline. This is a pre-switch classroom messaging observation, not yet attributed to changed-model source. API-C17 proceeds to test requested model-change path separately. Evidence before-stop-state.json, student-pending-before-reopen.json, network termination, screenshot04.

### API-C17 Started
Stopped original imported Team, unchanged local/provider IDs. Explicit root Settings Luna->live Astra, then normal messages; no private state or file edits.

API-C17 checkpoint: root and both originally linked members show GPT-6-Astra; eligible fresh capacity272000 equal to saved Luna272000. Explicit one Save updated exactly /,/professor,/student. Clean canonical success and still stopped; fixed tree and provider transcript/local history/workspace hashes identical. save-assertions.json and screenshot06. Normal professor continuation next.

### API-C17 Completed — Pass
Exact requested Stop -> Settings Luna to GPT-6-Astra -> Save -> normal professor message succeeded. Provider same conversation01a08d84-dd94-78d2-9eb5-dfec9449040d records Luna original completed turn then Astra resumed completed turn. Reply maple-orbit-7391 | 56 | SECOND_LESSON_DONE, marker absent from new question/workspace files, no tools on resumed turn. Same local/root/member IDs; one Save preserved nonselection tree/history/provider transcript hashes. professor-resumed-state.json, professor-resumed-dom.json, save-assertions.json, screenshot07. C16 earlier missing student reply remains separate unresolved observation, not hidden by core path Pass.

### API-C18 Planned / Started
Additional bounded student normal continuation under saved Astra after interrupted pending tool; observe same ID/model/earlier arithmetic retention. Separately preserve pre-switch missing-approval/handoff evidence for failure-origin review, not source modification. No unrelated team/data touched.

### API-C18 Completed — Pass
Student normal continuation used same provider/local ID on actual gpt-6-astra and recalled prior7×8=56, STUDENT_RESUMED. No tool/file reads in continuation. continuation-assertions.json and screenshot08. This does not resolve original interrupted return handoff.

### API-C19 Planned / Started
Bounded failure-origin probe before routing: request the student's existing answer-file handoff again while student is already focused, observe runtime WebSocket approval/result, approve only this known owned-file -> /professor message if visible. Determines whether current selected-member path can work; does not erase original background-member pending failure.

### API-C19 Completed — Pass for focused reattempt; original C16 unresolved
Student already selected; passive WebSocket captured TOOL_APPROVAL_REQUESTED, visible UI Approve, APPROVE_TOOL for exact student invocation, TOOL_EXECUTION_SUCCEEDED/DELIVERED and actual Team communication record. Student completed on Astra. Original unselected/newly activated student approval/handoff remained unavailable before Stop; origin still Unclear. Do not relabel C16 Pass based on explicit retry. focused-handoff-assertions.json/WebSocket and after-focused-handoff-state.json. Evidence summarizer initially counted a separate later professor read-only rules approval; corrected filter to exact student before asserting, then corrected ledger append import typo. No production change. Professor read-only rules request inspected and approved for orderly finish.

### Round2 cleanup checkpoint
Second normal Team stop succeeded after core continuations and focused retry. Final stopped Astra Settings screenshot10. Owned tab1 closed (shared browser kept); server/Nuxt/observer PIDs exited; unique DB/runtime removed. Run history snapshots/classroom files and two exact new provider transcripts retained intentionally. WS observer wrote frames then exited1 on detach because tab already closed; cleanup-audit confirms no leak, not product error. Private-marker absent-from-workspace assertion retained. Initial >5min wording corrected to161.3s using provider timestamp; run-age sidebar was not pending duration. No repository test/production edits, unchanged hashes verified; git diff --check Pass.

### API-REV-002 Final reconciliation
C15/17/18/19Pass; C16initialFail retained asAPI-F001Unclear. Main requested importedTeamCodexLuna->AstraStop/Save/normalcontinuationPass for both originalIDs. Current overallFail84.3% due unresolved initial pending handoff, not failed model replacement. Reports andAPI-REV002appended; priorAPI-REV001Pass95preserved. No running/unstartedcase. Cleanup complete with explicit observedws-detachexit1note. E/result-summary.json final.


## Round 3 — CRR-004 / CRF-002 reporting/scope Local Fix
Prior API-REV-002 Fail84.3% retained. API-F001/C16 is a separate unresolved observation per user-confirmed CRR-004; C17/18 requested switch and both original conversations Pass. No live test rerun or product fix planned. API-C20 is a reporting/evidence-integrity check, not a new runtime scenario.

### API-C20 Planned / Started
Expected: preserve old observations and results byte-for-byte, verify current three durable hashes and original Save/continuation evidence, reconcile scope and all four canonical artifacts, carry exact user confirmation and DR-002 attribution. New evidence index: evidence/api-e2e-scope-reconciliation/. Snapshot captured before report edits. No production/test edit or additional resource allocation.


### API-C20 Completed — Pass (reporting/evidence integrity only)
Read-only retained-evidence checks exit0: exact old/new three-scope selections, fixed tree and local/provider history/workspace hashes, single stopped Save and both original provider turn/model/completion joins corroborated. Three durable files still match prior reviewed hashes;214 preserved evidence/authority/AppImage files unchanged. No live model, API, browser, suite or build rerun. Final report consistency and git diff checks are retained in evidence/api-e2e-scope-reconciliation/final-checks.json.

### API-REV-003 Final reconciliation
Current ticket **Pass95%**, CRF-002 **Resolved — reporting/scope Local Fix**. API-REV-002 Fail84.3% preserved, including C16 Fail pending161.3s before Stop/Save and C19 Pass control. Per CRR-004/user-confirmed scope, API-F001 remains separately unresolved, not a ticket defect/blocker or known preexisting/focus-only defect. C15/17/18 original requested workflow evidence Pass; no case reexecution claim. No unstarted/running case. Reports and revision append current disposition, full historical report retained unchanged. No resource started; AppImage intact. Carry user quote “yesss. so i think our ticket is fine” forward for Delivery handling; no release/finalization claim.

API-REV-003 completed-result rule: reviewed High-risk Pass, exact single recipient `/software_engineering_team/code_reviewer`; current proportional test-code disposition **Not Applicable — no new durable delta** requested, prior CRR-003 retained. User confirmation carried forward for Delivery handling, no duplicate Delivery outcome message. Rules/selection in evidence/api-e2e-scope-reconciliation/.
