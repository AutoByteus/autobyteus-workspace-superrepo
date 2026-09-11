# API/E2E Execution Coverage Report — AORG-FLAT-TEAM-001

## Latest Authoritative Result

**Pass — API-REV-019, 95.4% validation confidence.** No current critical failure, blocked case or Not Tested remainder. This is executable validation, not Delivery completion.

- Ticket: `AORG-FLAT-TEAM-001`; completed revision **API-REV-019**, 2026-09-11.
- Authority: `RER-026 / cumulative AD-REV-018 (DS-028) / ARCH-REV-016 Pass / IR-034 / CRR-050 cumulative source Pass`.
- Exact reviewed source: `2221322710a6a1f5dae06a74135bca008aef88a6`.
- Exact artifact/current HEAD: `a5eae9ce3889e6100302a85da54e5b1a02c25176`.
- Classification: **Large / High / Reviewed**. Successful handoff: Code Reviewer, not direct Delivery.
- Prior completed result: **API-REV-018 / Fail / 87.4%**. It remains historical; no previous Pass substitutes for this run.
- Trigger: CRR-050/IR-034 and the user's complete fresh retest request; execution resumed after the user's container reboot.
- Evidence base: `api-e2e-evidence/API-REV-019/` (paths below are relative to this base unless stated otherwise).
- Canonical ledger: `api-e2e-test-case-ledger.md`, events **218–271**; plan: `execution-plan.md`.

## Package And Route

Requirements/investigation/revision/routing assessment, agent-org-contract, cumulative design/self-validation/design-review/architecture revision records, implementation and source-review reports/revisions, and applicable Product supplements were carried. Paths are canonical in this ticket; Product artifacts are under `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/`. Architecture/source-review artifacts are applicable, not N/A. Prior Delivery re-entry evidence DR-006 is retained and not used as source authority.

Successful route: **Code Review**. No repository-resident durable test added/updated/removed, so proportional test-code review is expected **Not Applicable**, to be recorded by its owner in api-e2e-test-review-report.md. Do not reopen the implementation scorecard solely to review temporary evidence scripts.

## Investigation / Ledger Reconciliation

The pre-execution plan and ledger were initialized before checks. Current source and immutable fixture were rechecked; all safe independent cases were renewed rather than substituting historical Passes. Completed events218–271 contain attempts, corrections and interruptions, not54 distinct tests. Raw files can contain superseded false harness assertions; `case-reconciliation.md` identifies the final authority for each. No case is still running. The user reboot was external interruption, not a test-induced product crash.

The in-progress canonical investigation accidentally retained much API18 body text; it is now replaced with API19-only results. The previous text is retained under prior-state. Numeric repository-only assessment is explicitly reconstructed, not backdated. This recording defect does not turn old execution into current evidence.

| Case group | Events | Requirement / acceptance basis | Result and current proof | Evidence |
| --- | --- | --- | --- | --- |
| `REPO-001–004` | 218–221,258,271 | REQ-001–034 / all affected ACs | **Pass** — Exact source, server 59/289, web 141/859, Electron 9/39, builds/guards/audit, Brief Studio 22 files and AppImage provenance. | `repository/; migration-negative/focused-matrix-corrected.log; final/integrity.log` |
| `PKG-001–005` | 222–223,271 | REQ-001–014,026–027 / AC-001–009,021–022 | **Pass** — Normal Settings import; 4 Agents, 2 flat Teams, 2 Orgs; detail/order/read-only/tool inventory; 18/18 source hashes. All possible assignees explicitly have submit_task_result and reviewers review_task_result. | `live/PKG-001-import.json; PKG-001-verify.json; PKG-003-details.json; PKG-004-readonly.json; PKG-005-tool-inventory.json` |
| `ADM-001–002` | 227 | REQ-001–014,026–027 / AC-001–009,021–022; QR-001–003,007 | **Pass** — Six exact current-package rejection diagnostics; valid families remain available; invalid/dependent definitions unavailable and source immutable. | `admission/admission-result.json; admission/server-current.log` |
| `AUTH-TEAM-001; AUTH-ORG-001–002` | 224 | REQ-009–011,020–023 / AC-004,006–007,015–018 | **Pass** — Normal Team/Org create/edit/reopen; Apollo metadata excluded by exact projection; hidden-field omission/preservation; en/zh-CN handoff authoring; exact user content/order. | `live/AUTH-TEAM-001.json; AUTH-ORG-001.json; AUTH-ORG-002.json; AUTH-HANDOFF-ZH.json` |
| `CFG-001–002` | 224,234 | REQ-018–019,024,029–032 / AC-013–014,019,024–027 | **Pass** — Temp default, no recipient auto-focus, root/Team inheritance, exact Agent pending/failure/Retry/default abandonment, truthful admission and request/tree equality; all-autoapprove fixture explicit. | `live/CFG-001-002.json; CFG-autoapprove-org-launch.json` |
| `TEAM-001–007` | 225,239,241,245–246,268–269 | REQ-001–003,005–008,015–017,025 / AC-001–003,005,010–012,020 | **Pass** — Fresh standalone launch/message/task activation; retained task monitor no-refocus; same-task revision/resubmit/accept; inactive-history lazy admission, continuation and exact Stop; all three members Offline, accepted records preserved. | `live/TEAM-001-launch.json; TEAM-006-revision-accept-two-tabs.json; CORR-001-passive-correlation.md; reboot-resume/RESTORE-team.json; CONTINUE-team.json; TEAM-007-current-adjudication.json` |
| `ORG-001–010` | 224,226,228–237,242–243,247–250,257,259,263,267 | REQ-003–008,015–019,024–025,028–034 / AC-002–003,005,010–014,019–020,023–029 | **Pass** — Direct/Mixed launches, no-focus/exact focus, configured and task traffic, whole-Org state, locked gear/Back/New, exact scoped Stop, stopped history and restored healthy stream. | `live/MSG-001-direct-to-direct.json; TASK-001-org-accept-live-status-adjudication.json; reboot-resume/UI-current.json; Stop-current-scoped.json; RECOVERY-clear-current.json; UI-New-distinct.json` |
| `MSG-001–003` | 225,228,235–236,241–243,250,263 | REQ-003,006–008,025,034 / AC-003,005,020,029; QR-012 | **Pass** — All four configured direct/mounted directions and references; one receiver center event, sent/received exact canonical counterparts, no-refocus. Configured/task, task/configured and task/task exact-ID delivery excluded from configured facet. Durable messages retained across restart/Restore and narrow view. | `live/MSG-001-current-directions-adjudication.json; MSG-001-direct-to-direct.json; TASK-004-auto-nested-create-adjudication.json; TASK-004-nested-submit-adjudication.json; reboot-resume/UI-current.json; RECOVERY-clear-current.json` |
| `TASK-001–005; LIVE-004` | 225–239 | REQ-005–008,015–017,025,028 / AC-003,005,010–012,020,023 | **Pass** — Direct task, mounted configured→task Team, root task Team and recursive task Team activate durably; status set unique; root reselect healthy. Real submission/acceptance, same-task revision, live terminal Offline/removal and exact monitor fallback. | `live/TASK-001-org-revision-adjudication.json; TASK-001-org-accept-live-status-adjudication.json; TASK-003-parent-mounted-current-adjudication.json; TASK-004-nested-submit-adjudication.json; TASK-004-parent-settle-adjudication.json; CORR-001-passive-correlation.json` |
| `API-001–002` | 244–245,262 | REQ-003,005–008,015–017,025 / AC-003,005,010–012,020; QR-001,004 | **Pass** — Team V2/Org V1 API/tree/checkpoint equality; independently calculated before/after hashes; exact wrong root/address/run rejection; stopped root no active snapshot; healthy valid stream unaffected. | `live/API-001-post-reboot.json; API-002-post-reboot.json; reboot-resume/API-stopped-negative.json` |
| `PERSIST-001–002` | 231,244,249,251,270 | REQ-012–017,025,033 / AC-008–012,020,028; QR-004,011 | **Pass** — Native sidecars and summary stable; real-process derived-index EISDIR yields accepted ACK without replay/relabel/crash, HTTP remains usable and later same-path persistence succeeds. | `live/API-001-post-reboot.json; derived-write/result.json; derived-write/server.log; final/shutdown-result.json` |
| `HIST-001; SUMMARY-001` | 231,241–250,263–266 | REQ-031–033 / AC-026–028; QR-010–011 | **Pass** — One workspace hierarchy per exact root, Team before Org, earlier runs retained; exact cross-family selection. Fresh direct and mounted first prompts update the same row without reload; compact first winner stable across later prompts and restart. Exclusion/concurrency/backfill details also exercised in repository cohort. | `reboot-resume/UI-current.json; SUMMARY-direct-adjudication.json; SUMMARY-mounted.json; CONTINUE-*.json; migration-negative/focused-matrix-corrected.log` |
| `RESTORE-001–004` | 231,241–248,260–261,263 | REQ-012–017,025 / AC-008–012,020; QR-004 | **Pass** — Normal inactive member Restore; conversed provider identities/content preserved; system-only members get new durable provider binding before complete publication. Missing binding/unreadable local history fail closed with memory unchanged. | `reboot-resume/RESTORE-team.json; RESTORE-direct.json; RESTORE-mixed.json; CONTINUE-*.json; restore-missing-current/result.json; restore-unreadable-current/result.json` |
| `RECOVERY-001; LIVE-005` | 259,263 | REQ-015–017,025 / AC-010–012,020 | **Pass** — Actual Chromium valid ERROR: initial plus five bounded attempts, six legal close(4000), no InvalidAccessError/early notice/permanent Connecting/manual Reconnect, one final notice. Normal history/Restore subsequently yields complete snapshot and no notice or duplicate messages. | `live/RECOVERY-001-current-mixed.jsonl; RECOVERY-001-current-mixed.log; reboot-resume/RECOVERY-clear-current.json` |
| `RST-001–010` | 230–231,238,240–248,257,263,269–270 | REQ-012–017,025,028,031,033–034 / AC-008–012,020,023,026,028–029 | **Pass** — Repeated direct SIGTERM including active task Team; durable interruption/settlement; exact scoped stops; same-data restart; user-container reboot recovery; all families history/Restore/continuation; no orphan server/provider descendants. | `restart-current/; restart-access-log/; reboot-resume/; final/shutdown-result.json` |
| `MIG-001–005` | 222,227,252–256,258 | REQ-012–014,026–027,033 / AC-008–009,021–022,028; QR-002–004,007,011 | **Pass** — Real fresh and prior-state startup, native Team zero-write, one-level conversion and summary/terminal preservation, deep preflight fails before writes through ordinary restart. Real-temp-filesystem runner covers interruption/exact prospective retry/collision and summary unique/ambiguous/failure matrix. | `migration-process-corrected/one-level/result.json; migration-process-corrected/deep/result.json; migration-negative/focused-matrix-corrected.log` |
| `UI-001–002; STATUS-001–003` | 224–229,232–237,250,257,267,269 | REQ-019,028–032,034 / AC-014,023–027,029; QR-006,008–010,012 | **Pass** — Desktop/390x844 semantic keyboard/disclosure/status/locked config and exact Back/New; strip→drawer→Org tree focus; narrow right Messages with reference; active/collapsed/settled/stopped status truth and no overflow. | `live/CFG-001-002.json; TASK-004-parent-settle-adjudication.json; reboot-resume/UI-current.json; UI-New-distinct.json; Stop-current-scoped.json; TEAM-007-current-adjudication.json` |
| `CLEAN-001` | 270–271 | All scopes / validation integrity | **Pass** — Actual tabs closed, owned ports/processes clear; secret copies/generated prerequisites removed; immutable fixture18/18, other-owner10/10, exact source/HEAD/no application or durable-test delta. | `final/shutdown-result.json; cleanup-result.json; integrity.log` |

## Mandatory Confidence Scorecard

| Mandatory category | Repository-only assessment | Final | Evidence and residual limitation |
| --- | ---: | ---: | --- |
| Requirement / acceptance proof | 91% | 96% | All critical planned groups renewed; authoring, identity, tasks, communications and terminal presentation directly exercised. No open critical case. |
| Changed-boundary directness | 92% | 95% | Actual Apollo/GraphQL/WS/provider/files/process; local MCP completion correlated. Individual internal FIFO/executor logpoints were not separately captured. |
| Integration realism / mock gap | 89% | 96% | Real imported definitions, production renderer/server and Codex App Server `gpt-5.6-sol`; no provider response fabricated. External-provider timing is nondeterministic. |
| Environment / configuration / identity / fixture | 93% | 96% | Exact artifact, owned SQLite/workspaces, exact references and AgentRun IDs, 18/18 immutable fixture hashes. One local Linux arm64 environment, not distributed deployment. |
| Failures / edges / lifecycle / recovery | 82% | 95% | Real-process write failure, migration and fail-closed Restore, strict active/stopped negatives, legal browser-close exhaustion, repeated SIGTERM/restart. Selected rare permutations use real-filesystem repository tests. |
| User surface / browser / desktop shell | 83% | 95% | Desktop and 390x844 actual browser, normal import/config/history/locked Back/New, message perspectives and live settlement; Electron 9/39 and AppImage provenance. No separate native desktop-shell launch. |
| Durable regression quality / relevance | 94% | 95% | Current server 59/289, web 141/859, Electron 9/39; 3/28 focused migration/summary/gate rerun. Existing IR-034 regressions exercised; external-account journeys remain evidence probes. |

- Repository-only assessment: **89.1%**; broader validation **Required**.
- Final assessment: **95.4%** (668 / 7, rounded to one decimal); no category below 90%.
- Recording correction: the in-progress investigation body retained API-REV-018's numerical score table. The repository-only column above is an explicitly **retrospective API-REV-019 evidence-limited assessment**, not a claim that a fresh numeric scorecard was persisted at sequence 221. The Required decision and runtime plan were recorded before execution. Final scores use only this round's evidence.
- Critical acceptance criteria lacking proof: **None in the approved matrix**. No score overrides a failure or missing case.

## Current Findings And Prior-Failure Resolution

| Finding | Current disposition | Proof |
| --- | --- | --- |
| API-FIND-023 / CR-FIND-030 | Resolved / Pass | Direct task and root/recursive task-Team settle durably, exact current live view changes to Offline without reload, remaining status scope stays healthy and unique. |
| API-FIND-025 | API/E2E locator correction resolved | Actual selected Mixed row mutation targets only that root; other roots unaffected. Terminal configuration/history and stopped presentation correct. |
| API-FIND-024 | Historical Not Reproduced / runtime-only | Valid all-autoapproved root/nested task-Team submits complete; standalone correlated initial/revision/resubmit/accept complete. No source attribution from approval-gated/uncorrelated attempts. |
| API-FIND-026 | Valid-reference rerun Pass; historical stall Not Reproduced / runtime-only | Configured/task, task/configured and task/task deliver once with exact IDs and references and remain excluded from configured presentation. |
| API-FIND-021 | Not Reproduced in current standalone control | Initial and same-task revised submit complete in14ms and16ms; durable awaiting_review and later acceptance recorded. |
| New production finding | None | API-owned stale locators, field names, path/setup and assertion corrections are disclosed separately, not relabeled product defects. |

### Provider / MCP / Queue Evidence Limit

`live/CORR-001-passive-correlation.md/json` correlates exact session/AgentRun, provider item/tool start, durable submission/review/settledAt, local HTTP200 and provider result. Four tool intervals were14ms,15ms,16ms,12ms. **There is no separately captured JSON-RPC ingress/request-ID or FIFO head/executor-start logpoint.** Successful local admission/queue passage is inferred from exact durable mutation inside the matching local HTTP interval. Root/nested Org controls have exact provider/durable evidence but predate successful-access logging. No stalled call occurred in the valid current controls. A future stall still requires full per-stage evidence before implementation attribution; no speculative recovery mechanism is authorized.

### Recovery Evidence Limit

Production Chromium directly rejected the old-invalid scenario by exercising the fixed legal-close path: six legal4000 closes across initial connection plus five automatic attempts, no InvalidAccessError, no early notice, one final notice, no permanent Connecting and no manual Reconnect. Later **normal history selection** retired the exhausted context; Restore then published a complete six-member view with retained messages/no duplicates/no notice. We do not claim this was an in-place automatic success of the exhausted instance. Current stream repository tests separately cover successful automatic hydration/publication and notice clearing.

## Runtime / Setup / Reproducibility

- Linux arm64; Node22.23.2; Nuxt3.21.1; Chromium151.0.7922.173; Playwright-core1.58.2 attaches to actual AutoByteus tabs. See final/platform.json.
- Main command from worktree: `node autobyteus-server-ts/dist/app.js --host 127.0.0.1 --port 8599 --data-dir <API19>/runtime/server-data`, with HOME=/root and owned PATH wrapper for Corepack pnpm; inherited DATABASE_URL/AUTOBYTEUS_SERVER_HOST/TEMP_WORKSPACE/MEMORY/PACKAGE_ROOTS unset so isolated configuration is authoritative. Secret values omitted.
- Renderer: endpoint-bound current production build (8599 HTTP/WS); `python3 -m http.server 3599 --bind 127.0.0.1 --directory autobyteus-web/dist/public`. Readiness from process logs and GraphQL200 precedes actions.
- Real account/runtime Codex App Server / gpt-5.6-sol; fixture task tools explicit. Auto-approve is configured deliberately for unattended task controls; normal mounted approvals also exercised.
- Auxiliary admission/derived-write/Restore/migration processes use their own owned data and ports; setup records under each case folder. Case scripts are retained but are evidence-specific, not a portable durable test suite or automatic credential bootstrap.
- Existing test package path: `<ticket>/api-e2e-fixtures/aorg-api-rev-002-agent-package`. It contains **both** agent-teams/ and agent-orgs/. It remains importable, unchanged18/18.

## Persistence / Migration / Failure Checks

Cumulative decision: Migration Required only for approved legacy one-level organization-like Team data. Native flat Team V2 remains directly usable and zero-write. IR-034 itself changes no file/schema or migration. Real-process corrected predecessor-state runs preserve opaque member content, summary and terminal state, move legacy source to Org V1 once, and remain stable through ordinary restart. Deeper legacy input records a bounded family-migration failure before source/target writes; unrelated GraphQL remains healthy. Real-temp-filesystem3/28 covers interruption/exact prospective retry/collision, unique/ambiguous summary recovery, failed-write restart and startup-gate behavior. No dual runtime reader, compatibility shim, speculative replay or second lifecycle authority was introduced.

Real-process derived-index failure: accepted message ACK remained truthful; no relabel/replay or unhandled process exit; subsequent HTTP/GraphQL200; later successful same-path write persisted. Missing provider binding and unreadable conversation Restore independently reject with all owned memory hashes unchanged and inactive root.

## Desktop / Responsive / Accessibility

Browser validation covers web-equivalent desktop renderer only. Actual normal import, authoring, native handoff selectors, exact locked Agent settings/Back/New, desktop and390x844 strip/drawer focus, right-side Org Messages/reference, keyboard/expanded/accessible status semantics and no-overflow checks passed. Electron9/39 covers relevant shell/session/server-env boundaries; current arm64 AppImage is524,007,664 bytes, executable, SHA256 `dfceecd28aa4902865ba3559b5a2193a09d290b272562ac0ac33f734638aa9c3`; packaged server entry is byte-identical to repository build. No new native desktop instance launched or user desktop process disturbed. Full assistive-technology certification, other OS/native shell manual journeys and distributed deployments are not claimed.

## Durable Coverage / Scaffolding / Dependencies

- Durable tests Added: **None**. Updated: **None**. Removed: **None**. Current existing regressions remain Still Valid; no compatibility-only test retained by this round.
- Temporary: browser scripts, API/WS and process probes, owned fixtures/reference files, logs, DOM/screenshots, provider traces and hash manifests under API19. They supplement, not replace, repository tests.
- Live provider/account and local MCP used. Selected config error probes control a lookup response; filesystem faults use owned directories only. These bounded edge controls are disclosed in scripts; normal launches/messages/tasks are not mocked.
- Broad unrelated Nuxt/fixed-px baselines and separate external-definition publication remain outside ticket attribution. The accidental broader web invocation was stopped; corrected exact141/859 is the current result. No general full-repository green claim.
- Full correction list and raw-versus-adjudicated artifact precedence: case-reconciliation.md. Unexecuted copied scripts are not proof.

## Cleanup And Integrity

- Repeated normal SIGTERM (including active task scope) and final exact PID4786 shutdown passed; final process0, no AggregateError/unhandled rejection, all4 owned descendants gone; all21 task/message/tree sidecar hashes unchanged on final idle shutdown.
- Actual tabs1/2 closed; list_tabs empty. Renderer4814 stopped. Ports3599,8599,8710–8715,9241 clear; shared9222 browser process untouched.
-15 copied .env/secret-key files removed;5 generated untracked prerequisites removed. Isolated test DB/history/raw evidence retained for audit, not deleted or promoted to shared data.
- Fixture18/18, other-owner10/10 hashes, exact artifact/source ancestry, no application/durable-test delta, AppImage size/SHA and git diff --check pass. Prior API17/API18 and Delivery DR006 evidence untouched.
- Evidence: final/shutdown-before.json, shutdown-result.json, shutdown-server-tail.log, cleanup-result.json, integrity.log.

## Final Gate / Recommendation

Result **Pass /95.4%**. Broader validation **Required and completed**. All planned critical groups pass on the exact current artifact; no unresolved production finding or critical Not Tested remainder. Confidence limits are bounded to external timing, absent per-internal-stage logpoints, one local platform and browser-equivalent rather than new native-shell launch.

Apply the dynamic reviewed-route Pass rule; send the full cumulative package to Code Reviewer for proportional durable-test review (expected Not Applicable, no changed durable tests). Delivery docs sync/integration/finalization/user verification remain owned downstream and are not claimed complete.
