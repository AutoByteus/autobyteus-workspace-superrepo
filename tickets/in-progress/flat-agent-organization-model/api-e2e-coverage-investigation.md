# API/E2E Coverage Investigation — AORG-FLAT-TEAM-001

## Investigation Meta

- Requirements Doc: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`
- Investigation Notes: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`
- Requirements Revision Record: `requirements-revision-record.md` (`RER-024`)
- Design Spec / contract: `design-spec.md` (`AD-REV-014`, `DS-024–026`); `agent-org-contract.md`
- Architecture review: `design-review-report.md`; `architecture-review-revision-record.md` (`ARCH-REV-012 / Pass`)
- Implementation: `implementation-handoff.md`; `implementation-revision-record.md` (`IR-028`)
- Code review: `code-review-report.md`; `code-review-revision-record.md` (`CRR-036 / Pass`)
- Delivery re-entry: `delivery-revision-record.md` / `DR-003` is superseded pre-validation material and was preserved, not treated as current authority.
- Supplemental authority: approved AORG-FLAT-TEAM-001, mounted-Team-status, AORG-TEAM-OVERRIDES-001, and task-agent-monitor artifacts referenced by the upstream package.
- API/E2E revision / round: `API-REV-010` / 11.
- Prior result: `API-REV-009 / Fail / 87.0% / API-FIND-017`.
- Canonical ledger: `api-e2e-test-case-ledger.md`.
- Execution plan: `api-e2e-evidence/API-REV-010/execution-plan.md`.
- Tested source / artifact: `4d378df9cba56bd1b9ebf20d9b055f964398f642` / `100e2c82cb948e1cbef4026ab6f74ab815285a34`.
- Latest authoritative investigation: this completed `API-REV-010` result.

## Routing Classification

- Task size: `Large`.
- Architectural risk: `High`.
- Input route: `Reviewed`.
- Successful-output route: `Code Review`.
- Proportional test-code review: `Required` for the retained API-owned update to `autobyteus-web/stores/__tests__/runHistoryNavigationProjection.spec.ts`; no production source was changed by API/E2E.

## Current Requirement And Design Basis

- `REQ-031 / AC-026 / SCN-015 / DS-025`: one unified Workspaces/history hierarchy must remain coherent across standalone Team and AgentOrg configuration, active, focus, stopped, restart and Restore states. Selecting one family retires the other family’s route/query/selection, leaves one current target, and retains family-scoped failure isolation.
- `DS-017 / IR-028`: direct and mounted-Team Agent gear opens the exact existing AgentRun configuration with runtime/model/workspace locked; Back returns to the same exact root/address/monitor; New remains a distinct no-run configuration action.
- Cumulative `REQ-001–032`: flat Team V2 and AgentOrg V1 definitions, exact addresses and identities, real task/message routing, durable-before-publication task lifecycle, streaming/recovery, migration, shutdown/restart/Restore/continuation, truthful statuses, responsive focus, localization, configuration equality and package admission remain active.
- `API-FIND-017` must be rechecked first. CRR-036 states the source fix retires stale AgentOrg query ownership when selecting standalone Team and performs the reverse mutual-exclusion clear when opening/selecting AgentOrg.

## Changed Behavior And Boundary Classification

| Boundary | Current change / preserved behavior | Repository evidence | Real-boundary risk | Selected evidence |
| --- | --- | --- | --- | --- |
| Route/query and selection ownership | IR-028 resolves stale AgentOrg center/dual-highlight when selecting standalone Team, plus reverse direction | AppLeftPanel, layout, selection/history focused tests | browser routing and real store timing | active/inactive desktop and 390x844 switching |
| Exact Agent config | direct/mounted gear, exact locked form, same-monitor Back; New distinct | AgentOrgMemberRunConfigPanel and focused component tests | exact URL/run/address and responsive rendering | desktop direct plus narrow mounted browser |
| Unified history | one mixed Team/Org owner, family-scoped refresh errors | history store/action tests | real interval/network failure and recovery | production-browser GraphQL interception |
| Provider/task | preserved real Codex Team/Org task and monitor path | retained server/web cohorts | provider/MCP/queue/persistence/UI convergence | real GPT-5.6-Sol conversations and task revision/acceptance |
| Stream recovery | preserved browser-safe automatic recovery, no Reconnect | recovery service tests | native WebSocket close-code/error ordering | current Chromium stopped-root ERROR exhaustion |
| Lifecycle/persistence | preserved migration, clean shutdown, inactive history, Restore/continuation | server lifecycle/migration/history suites | real process and same-data durability | SIGTERM, restart, GraphQL/files, real browser continuation |
| Electron shell | no IR-028 shell/preload/IPC/window change | production renderer build | unchanged shell wrapper only | browser-preferred web-equivalent validation; shell not launched |

Authentication/permission changes, distributed coordination and external-service publication are not affected. The live provider boundary used the locally configured Codex App Server; no mock substituted for browser, GraphQL, WebSocket, persistence or task tools.

## Project Execution Discovery And Environment

- Worktree: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`.
- Instructions read: repository `README.md`, `autobyteus-server-ts/README.md`, `autobyteus-web/README.md`, and the closest server/web `AGENTS.md` files. Vitest must use one-shot execution; selected builds require generated application SDK artifacts.
- Repository stack: pnpm monorepo, TypeScript/Fastify/GraphQL/WebSocket/Prisma/SQLite backend, Nuxt/Vue frontend, Electron wrapper, Vitest and Playwright/Chromium.
- Live server: current built server at owned `127.0.0.1:8589`, isolated copied data, started with a clean `env -i` and stopped only by application-owned SIGTERM.
- Live renderer: current production Nuxt static output at owned `127.0.0.1:3589`.
- Browser: persistent AutoByteus `open_tab` Chromium tab 13; Playwright attached to that exact tab for DOM/network/CDP correlation.
- Fixture: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-fixtures/aorg-api-rev-002-agent-package`; four Agents, two flat Teams and two AgentOrgs; explicit submit/review tools; 18/18 hashes before and after.
- Identity: actual retained standalone Team and AgentOrg runs used exact member addresses/AgentRun IDs; Codex App Server / `gpt-5.6-sol` performed current prompts and formal task calls.
- Safety: pre-existing Delivery/docs/code-review changes were preserved; only owned processes/tab were stopped; live data remains retained evidence.

## Persisted Data Transition Coverage Basis

- Approved cumulative decision: `Migration Required`; IR-028 itself is `Not Affected`.
- Representative current Team V2 and AgentOrg V1 packages were exercised through same-data SIGTERM/restart, history queries, exact durable task/tree reads, Restore and new continuation.
- Restart found 24 Prisma migrations and no pending migration, completed startup, and returned both root families inactive before any restore. Current flat-Team migration logs remain present and failure-free in the isolated data.
- No normal dual parser, request-time upgrade, generic-root compatibility fallback or legacy write path was observed or protected by API-owned coverage.

## Durable Coverage Inventory And Decisions

| Coverage | Decision | Current result / action |
| --- | --- | --- |
| IR-028 route/config focused cohort | Still Valid | rerun 14 files / 177 tests, Pass |
| current server task/stream/history/lifecycle/migration cohort | Still Valid | rerun 15 files / 61 tests, Pass |
| current retained web Team/Org/history/recovery cohort | Still Valid | rerun 27 files / 195 tests, Pass |
| `runHistoryNavigationProjection.spec.ts` API-owned fixture update | Needs proportional review | required AgentOrg history input plus approved stable workspace key; executed inside passing cohorts |
| API-REV-008 real Codex/recovery/lifecycle evidence | Historical, not current authority | proportionately renewed on current artifact through LIVE-004/005 |
| API-REV-009 API-FIND-017 evidence | Replace with current rerun | resolved by active/inactive desktop/narrow route switching |
| live family-failure and native WebSocket probes | Temporary executable probes | retained as evidence; no production test hook added |

No stale coverage was removed. No new production source was edited.

## Repository Coverage Execution Results

| Order | Boundary | Result | Evidence |
| --- | --- | --- | --- |
| REPO-001 | exact source/artifact, instructions, ports/tabs, fixture hashes, diff | Pass | `API-REV-010/repository/preflight.log`; `preflight-tabs.json` |
| REPO-002 | route/query mutual exclusion; exact gear/locked form/Back/New; guards/audit; production build | Pass — 14 files/177 tests; 16 routes | `repository/web-focused.log`; `web-guards-audit.log`; `web-build.log` |
| REPO-003 | retained server/web task, streaming, history, migration, shutdown and build | Pass — server 15/61; web 27/195; server build | `repository/server-retained.log`; `web-retained.log`; `server-build.log` |

## Ledger And Broader Validation Decision

- Ledger required and initialized before execution: `Yes`; nine multi-boundary cases and interruption risk required immediate durable checkpoints.
- Every completed case/checkpoint was recorded before proceeding.
- Post-repository confidence: **94.0%**. Repository evidence was strong, but real route retirement, exact active-run config, provider/task convergence and process restart remained material.
- Broader validation: **Required** — current production browser, live API/provider, filesystem and process lifecycle.
- Expected confidence gain: direct proof across the browser/store/router/server/provider/persistence boundaries.

## Completed Investigation Outcome — API-REV-010

All planned repository and live cases passed. `API-FIND-017` is resolved on the current artifact: active and inactive AgentOrg -> standalone Team -> AgentOrg switching produced the exact destination URL/center and one current highlight at desktop and through the supported 390x844 strip/drawer hierarchy. Direct and mounted Agent gear, locked config, Back and distinct New all passed.

The real cumulative path also passed family-scoped failure retention/recovery, standalone Team lazy activation, direct and mounted Org prompts, a fresh formal delegate -> submit -> revision -> same-task resubmit -> accept lifecycle with exact durable sidecar, strict address/AgentRun negatives, application SIGTERM, first post-restart mixed inactive history, whole-Org Restore with provider-identity semantics, Team and Org continuation, terminal Stop, and production-Chromium automatic recovery exhaustion using six legal close-code-4000 generations and one notice.

Observed non-product errors were investigated rather than hidden:

1. Two locator/wait timeouts occurred when the five-second history refresh replaced DOM nodes; the same real supported clicks passed and are recorded as harness timing only.
2. One rapid scripted inactive-Team selection transiently showed `Couldn't load task activity. Retry`; a paced exact reprobe after terminating and reloading the same Team produced two successful member projections, authoritative `0 tasks`, and no alert. It is not reproduced as supported product behavior.
3. Codex model-catalog refresh emitted child-exit timeout stderr during some restore starts, but exact runtimes published and every required real prompt/tool call completed. The only browser 404 was the pre-existing `/health` capability probe.
4. Two manually constructed task-record queries used non-root-neutral IDs and correctly failed; the durable Org task was verified from its authoritative sidecar and real UI. Those probe mistakes are excluded from product results.

Final overall confidence is **98.3%** with no category below 90% and no unproven critical acceptance criterion. No current `API-FIND-*`, Requirement Gap, Design Impact or implementation failure remains. Bounded residual scope is the unchanged Electron shell, separately owned external definition publication and destructive corrupt-live-copy injection; none intersects the IR-028 changed boundary or blocks Pass.

## Investigation Decision

- Proceeded to API/E2E execution: `Yes`.
- Result: `Pass`.
- Repository-resident durable coverage changed in this round: `No new change`; one retained API-owned update from API-REV-009 remains pending proportional review.
- Broader validation: `Required and completed`.
- Reroute required: `No`.
- Required next recipient: Code Reviewer for proportional review of the retained durable test update.
