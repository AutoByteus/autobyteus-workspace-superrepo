# API/E2E Execution Coverage Report — AORG-FLAT-TEAM-001

## Execution Round Meta

- Requirements: `requirements-doc.md`; `investigation-notes.md`; `requirements-revision-record.md` (`RER-024`).
- Contract/design: `agent-org-contract.md`; `design-spec.md`; `architecture-design-revision-record.md` (`AD-REV-014`, `DS-024–026`).
- Architecture review: `design-review-report.md`; `architecture-review-revision-record.md` (`ARCH-REV-012 / Pass`).
- Implementation: `implementation-handoff.md`; `implementation-revision-record.md` (`IR-028`).
- Code review: `code-review-report.md`; `code-review-revision-record.md` (`CRR-036 / Pass`).
- Coverage investigation / ledger / revisions: `api-e2e-coverage-investigation.md`; `api-e2e-test-case-ledger.md`; `api-e2e-revision-record.md`.
- Supplemental authority: approved AORG-FLAT-TEAM-001, mounted-Team-status, AORG-TEAM-OVERRIDES-001 and task-monitor artifacts referenced upstream.
- Current revision / execution round: `API-REV-010` / 11.
- Trigger: cumulative Large/High source Pass after IR-028 corrected mutually exclusive Team/AgentOrg navigation and exact existing-Agent config routing.
- Prior round: `API-REV-009 / Fail / 87.0% / API-FIND-017`.
- Tested source / artifact: `4d378df9cba56bd1b9ebf20d9b055f964398f642` / `100e2c82cb948e1cbef4026ab6f74ab815285a34`.
- Latest authoritative result: **`API-REV-010 / Pass / 98.3%`**.

## Routing Classification

- Task size: `Large`.
- Architectural risk: `High`.
- Input route: `Reviewed`.
- Successful-output route: `Code Review`.
- Proportional test-code review: `Required` for the retained API-owned update to `autobyteus-web/stores/__tests__/runHistoryNavigationProjection.spec.ts`.
- Delivery readiness: subject to proportional test-code review; API/E2E itself passes.

## Investigation And Ledger Reconciliation

- Investigation completed before execution: `Yes`.
- Plan followed: `Yes`; no material deviation.
- Canonical ledger: `api-e2e-test-case-ledger.md`; initialized before execution and updated after each case/checkpoint.
- Last event: sequence 17, `LIVE-006 / Pass`, owned cleanup and immutability.
- Running, interrupted or unstarted cases: none.
- Context-compression handling: all intermediate outcomes were persisted immediately in the ledger as requested by the user.

| Case | Result | Reconciled outcome |
| --- | --- | --- |
| REPO-001 | Pass | exact artifact/source/instructions/resources/package hashes/diff |
| REPO-002 | Pass | IR-028 focused route/config tests, guards/audit and production web build |
| REPO-003 | Pass | retained server/web task, history, stream, lifecycle, migration and build |
| LIVE-001 | Pass | active and inactive Org -> Team -> Org exact switching at desktop/narrow |
| LIVE-002 | Pass | direct/mounted Agent gear, locked exact config, same-monitor Back, distinct New |
| LIVE-003 | Pass | family-scoped history failure retains other/prior data and recovers |
| LIVE-004 | Pass | real Codex Team/Org prompts, formal task revision/acceptance, strict negatives and recovery exhaustion |
| LIVE-005 | Pass | SIGTERM, restart/migration, mixed inactive history, Restore, identity/content and continuation |
| LIVE-006 | Pass | browser/process cleanup and source/package immutability |

## Compatibility / Persisted-Data Scope

- Invalid backward compatibility in approved scope: `No`.
- Compatibility-only implementation or durable coverage observed: `No`.
- Approved cumulative persisted-data decision: `Migration Required`; IR-028 is `Not Affected`.
- Representative Team V2 and AgentOrg V1 data: directly exercised across same-data shutdown/restart/history/Restore/continuation.
- Startup found 24 Prisma migrations, none pending, and completed normally. No dual parser/read/write or request-time legacy fallback was observed.

## Changed Boundary And Evidence Matrix

| Scenario | Requirement / boundary | Mode | Result | Evidence |
| --- | --- | --- | --- | --- |
| REPO-001 | reviewed artifact, fixture and environment identity | git/files/process | Pass | `API-REV-010/repository/preflight.log`; `preflight-tabs.json` |
| REPO-002 | AC-026; DS-017/025; API-FIND-017 | Vitest/static/build | Pass | `repository/web-focused.log`; `web-guards-audit.log`; `web-build.log` |
| REPO-003 | cumulative Team/Org/task/stream/history/migration | Vitest/build | Pass | `repository/server-retained.log`; `web-retained.log`; `server-build.log` |
| LIVE-001 | REQ-031 / AC-026 / SCN-015 | production browser/API | Pass | `live/LIVE-001-active-switch.json`; `LIVE-001-inactive-org-switch.json`; screenshots |
| LIVE-002 | DS-017 exact existing-Agent config | production browser/API | Pass | `live/LIVE-002-direct-gear.json`; `LIVE-002-mounted-gear.json`; `LIVE-002-new-distinct.json` |
| LIVE-003 | unified history family isolation | browser/network | Pass | `live/LIVE-003-family-failure.json`; screenshot |
| LIVE-004 | real provider/task/strict/recovery | browser/Codex/MCP/API/files | Pass | `live/LIVE-004-*.json`; task sidecar; recovery CDP corpus |
| LIVE-005 | lifecycle/persistence/migration/Restore | process/browser/API/files | Pass | `live/LIVE-005-*`; restart and shutdown logs |
| LIVE-006 | cleanup/immutability | browser/process/files | Pass | `live/cleanup.log`; `cleanup-tabs.json`; `final-shutdown-tail.log` |

## Repository Execution

1. Exact current artifact/source preflight, applicable instructions, owned ports/tabs, 18/18 package hashes and `git diff --check`: Pass.
2. Focused current web cohort: 14 files / 177 tests Pass; both web/localization guards and zero-finding literal audit Pass; production Nuxt build/prerender 16 routes Pass.
3. Retained server cohort: 15 files / 61 tests Pass; retained web cohort: 27 files / 195 tests Pass; current server TypeScript build/bootstrap Pass.

Evidence root: `api-e2e-evidence/API-REV-010/repository/`.

## Broader Validation Decision And Execution

- Decision: **Required and completed**.
- Mode: current production Nuxt renderer in a real persistent AutoByteus `open_tab` Chromium tab; current built Fastify/GraphQL/WebSocket server; isolated copied data; real Codex App Server / `gpt-5.6-sol`; SQLite/filesystem and application process correlation.
- Environment: owned server `127.0.0.1:8589`, renderer `127.0.0.1:3589`, browser tab 13; all closed after execution.
- Fixture: `api-e2e-fixtures/aorg-api-rev-002-agent-package`, containing 4 Agents, 2 flat Teams and 2 AgentOrgs with explicit submit/review tools; 18/18 hashes before and after.
- Authentication/permissions: local product configuration; no external account or permission boundary changed.

### Current Browser And Real-System Results

1. **Navigation and focus:** Active and inactive AgentOrg -> standalone Team -> same AgentOrg switching produced exact destination URL/center and one current selection. The 390x844 path used the approved primary strip -> drawer -> unified hierarchy.
2. **Exact Agent configuration:** Direct concierge and mounted analyst gear opened exact run/address configuration with runtime/model/workspace locked. Back returned to the same monitor; New used configuration mode without `orgRunId`.
3. **Family failure isolation:** Forced exact Org-history and workspace-history HTTP 500s retained prior good slices and the other family, displayed only the relevant error, then recovered without duplication.
4. **Provider and task:** A previously inactive standalone Team activated on its first real prompt. Direct Org and mounted-Team members returned exact markers. Fresh task `task_e8ac5ad7530e4a68abde501aed8d27cf` completed delegate -> initial submit -> request revision -> same-task revised submit -> accept, matching the durable sidecar and UI.
5. **Strict identity:** Wrong address and wrong AgentRun projections failed closed; an immediate valid projection succeeded without poisoning context.
6. **Stream recovery:** A stopped root produced six correlated current-generation ERROR attempts. All browser closes used legal application code 4000; there was no `InvalidAccessError`, unhandled rejection, permanent Connecting state or Reconnect control, and exactly one notice after five failed recovery attempts.
7. **Lifecycle and durability:** Application SIGTERM closed cleanly with Team and Org active. Same-data restart completed migration preflight, returned both families inactive and preserved the accepted task sidecar. Inactive-row selection performed supported whole-Org Restore.
8. **Restore semantics:** Conversation-bearing concierge/lead retained exact AgentRun/provider identity and content; a system-instruction-only member received a renewed durable provider ID. Direct/mounted Org and standalone Team conversations continued with new exact markers.
9. **Terminal state:** Stop Agent Org terminated the whole root and routed to configuration without `orgRunId` or a live Stop control; inactive history showed `Stopped Agent Org`.

Evidence root: `api-e2e-evidence/API-REV-010/live/`.

## Observed Errors And Disposition

The run did encounter errors, but none remained a confirmed production failure:

1. Two browser automation waits lost locators during the five-second history refresh. Repeating the same supported clicks passed; classified as harness timing.
2. One rapid scripted inactive-Team selection transiently showed `Couldn't load task activity. Retry`. A paced exact reprobe after Team termination/reload returned retained history, authoritative `0 tasks`, no alert, and only HTTP 200/no-GraphQL-error requests; not reproduced as supported product behavior.
3. Codex model-catalog refresh intermittently logged a child-process exit timeout. Actual AgentRuns published and every required prompt/tool call succeeded; classified as non-blocking provider-catalog environment stderr.
4. The only browser 404 was the existing `/health` capability probe.
5. Two manually constructed task-record probes used non-root-neutral IDs and correctly returned not-found. The authoritative Org task was verified through its sidecar and UI; these were API-owned probe mistakes.

No current `API-FIND-*` was opened from these observations.

## Desktop / Platform Targets

- Linux ARM64; current Chrome 151 persistent AutoByteus browser.
- Desktop web-equivalent behavior exercised at approximately 1502x797 and narrow 390x844.
- Actual Electron shell not launched because IR-028 changes no preload/IPC/window/native boundary. This bounded unchanged-shell uncertainty is reflected in the score.

## Durable Coverage Changed

- Updated path retained from API-REV-009: `autobyteus-web/stores/__tests__/runHistoryNavigationProjection.spec.ts`.
- Change: add the required empty `agentOrgHistory` slice to two builders and use approved stable workspace key `workspace:/workspace-a`.
- Current execution: included in focused 14/177 and retained 27/195 passing cohorts.
- Removed tests: none. Production source changed by API/E2E: none.
- Proportional test-code review attachment: required.

## Temporary Execution Methods / Mocking

- Playwright/CDP attached to the exact persistent `open_tab` for semantic DOM, network, console and WebSocket correlation. Scripts and captures are retained under `API-REV-010/live/`; no production test hook was added.
- Real browser, server, GraphQL, WebSocket, SQLite/files, Team/Org runtimes and Codex provider were used. No material dependency was mocked in live execution.

## Validation Confidence Scorecard

| Category | Post-repository | Final | Final basis / residual |
| --- | ---: | ---: | --- |
| Requirement and acceptance-criteria proof | 94% | 99% | all critical current and retained cumulative scenarios directly pass |
| Changed-boundary execution directness | 96% | 99% | exact active/inactive route/config behavior in current production browser |
| Cross-boundary integration realism/mock gap | 92% | 99% | real browser/server/provider/MCP/SQLite/process; no material live mock gap |
| Environment/configuration/identity/fixture fidelity | 95% | 99% | exact artifact, imported Team+Org package, hashes, identities and same-data restart |
| Failure/edge/lifecycle/recovery evidence | 93% | 99% | family faults, strict negatives, legal-close exhaustion, SIGTERM/restart/Restore |
| User-surface/browser/desktop-shell confidence | 92% | 96% | desktop+narrow real renderer; unchanged Electron shell not launched |
| Durable regression coverage quality/relevance | 96% | 97% | broad current suites; one narrow API-owned fixture update awaits review |

- Overall post-repository confidence: `94.0%`.
- Overall final confidence: **`98.3%`** (`688 / 7`, rounded).
- Every critical acceptance criterion directly proven: `Yes`.
- Applicable category below 90%: `No`.
- Default 95% target met: `Yes`.
- Residuals: unchanged Electron shell, separately owned external definition publication and destructive corruption of a live copied store were not exercised; none intersects the changed IR-028 boundary or blocks Pass.

## Result Summary And Cleanup

| Result | Scenarios | Summary |
| --- | --- | --- |
| Pass | REPO-001–003; LIVE-001–006 | all planned current and cumulative cases completed |
| Fail | none | no confirmed product failure |
| Blocked / Not Tested | none | no planned case left incomplete |

Cleanup completed: tab 13 closed and tab list empty; server accepted application-owned SIGTERM and logged clean closure; renderer stopped; ports 8589/3589 closed; fixture hashes remained 18/18; exact HEAD/source ancestry and `git diff --check` pass. Isolated live data is retained as evidence rather than reused.

## Preliminary Classification / Recommended Recipient

- Result classification: **Pass**.
- `API-FIND-017`: resolved on the current reviewed artifact.
- Requirement Gap / Design Impact / implementation failure: none.
- Recommended recipient: `/software_engineering_team/code_reviewer` for proportional review of the retained durable test update.

## Latest Authoritative Result

- Result: **Pass**.
- Revision/confidence: **`API-REV-010 / 98.3%`**.
- Broader validation: **Required and completed**.
- Critical acceptance criteria lacking direct proof: none.
- Next recipient: Code Reviewer for proportional test-code review.
