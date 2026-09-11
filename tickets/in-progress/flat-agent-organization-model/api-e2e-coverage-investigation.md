# API/E2E Coverage Investigation — AORG-FLAT-TEAM-001

## Current Investigation And Result

- Ticket: `AORG-FLAT-TEAM-001`; completed revision **API-REV-019**, 2026-09-11.
- Authority: `RER-026 / cumulative AD-REV-018 (DS-028) / ARCH-REV-016 Pass / IR-034 / CRR-050 cumulative source Pass`.
- Exact reviewed source: `2221322710a6a1f5dae06a74135bca008aef88a6`.
- Exact artifact/current HEAD: `a5eae9ce3889e6100302a85da54e5b1a02c25176`.
- Classification: **Large / High / Reviewed**. Successful handoff: Code Reviewer, not direct Delivery.
- Prior completed result: **API-REV-018 / Fail / 87.4%**. It remains historical; no previous Pass substitutes for this run.
- Trigger: CRR-050/IR-034 and the user's complete fresh retest request; execution resumed after the user's container reboot.
- Evidence base: `api-e2e-evidence/API-REV-019/` (paths below are relative to this base unless stated otherwise).
- Canonical ledger: `api-e2e-test-case-ledger.md`, events **218–271**; plan: `execution-plan.md`.

**Latest authoritative result: Pass / 95.4%.** Broader validation was Required and completed. See the execution report for the final gate; this investigation owns validity decisions and coverage selection.

## Upstream And Discovery

The carried complete package is requirements-doc.md (including its Architecture Design Routing Assessment), investigation-notes.md, requirements-revision-record.md, agent-org-contract.md, design-spec.md, architecture-design-revision-record.md, architecture-design-self-validation.md, design-review-report.md, architecture-review-revision-record.md, implementation-handoff.md, implementation-revision-record.md, code-review-report.md and code-review-revision-record.md. Product RV-012, mounted-Team-status and AORG-TEAM-OVERRIDES-001 supplements remain applicable with RER-024 textual precedence; RER-025 summary and RER-026 communication requirements are cumulative. Prior delivery/test-review artifacts are history, not renewed execution authority.

Read root/server/web AGENTS.md, server/web README and package scripts, test runner configuration, migration conventions, normal package import and runtime startup instructions. The server is a built TypeScript process with Prisma/SQLite and app-data startup gates; web-equivalent Electron behavior uses the actual production browser renderer. IR-034 Legacy / Compatibility Removal Check is clean and its Persisted Data Transition Check is Not Affected. Cumulatively, approved legacy one-level Team→Org migration remains required; native Team V2 uses the current reader without mutation. No compatibility branch or dual runtime owner is validated or introduced.

## Requirement Mapping And Affected Boundaries

`case-reconciliation.md` maps the complete REQ-001–034 / AC-001–029 / SCN-001–018 / QR-001–012 matrix to current events and evidence. Boundaries are definition ownership/admission and authoring; root-neutral configuration/identity; GraphQL/WS/checkpoint; real provider/MCP/task queue; Team V2/Org V1 files; history/summary; browser state/messages/status/responsiveness; migration/startup/shutdown/restart; and Electron package/session boundaries. Authentication is unchanged and uses the existing local Codex account. Cross-node deployment is not claimed.

## Existing Durable Coverage Inventory And Decisions

| Coverage | Validity decision | Current evidence / action |
| --- | --- | --- |
| Server Team/Org definition, task, message, MCP, streaming, history, summary, migration and shutdown | Still Valid | 59 files/289 tests; exact file list repository/server-current-ticket-command.txt |
| Web authoring/Apollo, configuration, status, live projection, navigation, messages, recovery, localization and responsive contracts | Still Valid | 141 files/859 tests; exact list repository/web-current-ticket-command.txt; includes IR-034 settlement regression |
| Electron session/browser/server-env boundary tests | Still Valid | 9 files/39 tests |
| Real-filesystem migration/summary and startup gates | Still Valid | additional 3 files/28 tests; migration-negative/focused-matrix-corrected.log |
| Web/localization guards and literal audit; builds; Brief Studio packaging | Still Valid | current all pass; zero localization findings; 22-file real application pack |
| Prior temporary API probes | Needs Update where stale fixture/locator/assertion | Corrected only evidence scripts; raw attempts and their dispositions retained in case-reconciliation.md |
| Full unrelated Nuxt/fixed-px repository baselines, external definition publication | Out Of Scope for attribution | No weakening of strict admission or unrelated production fixes; selected current cohort remains authoritative |
| Account-dependent real Codex/browser/process journeys | Use Temporary Executable Probe Only | Actual runtime cost/state/approval/session ownership requires isolated evidence; existing deterministic repository regressions retained |
| New durable coverage / stale deletion | None required this round | No durable file added, updated or removed. No unresolved approved behavior is forced into a stale assertion. |

A test passing is not treated as proof of boundaries it mocks. Prior runtime stalls and the UI projection failure required direct execution even with repository Pass. No isolated implementation fixture is substituted for user-surface acceptance.

## Repository Execution

Working root is the assigned worktree. pnpm is invoked through Corepack (or owned runtime/bin/pnpm wrapper after reboot).

| Order / working directory | Command / selection | Result / evidence |
| --- | --- | --- |
| server | pnpm build | build/bootstrap Pass; repository/server-build.log |
| server | pnpm exec vitest run <59 paths in server-current-ticket-command.txt> | 59/289; server-current-ticket.log |
| web | pnpm exec vitest run <141 paths in web-current-ticket-command.txt> | 141/859; web-current-ticket-exact.log |
| web | focused Electron cohort | 9/39; web-electron-relevant.log |
| web | guard:web-boundary; guard:localization-boundary; audit:localization-literals | guards Pass; zero findings; web-guards-audit.log |
| web | pnpm build | production renderer,16 prerendered routes; web-build.log |
| workspace/app devkit | Brief Studio pack + validate | 22 files; brief-studio-pack.log; brief-studio-validate.log |
| web | build:electron:linux:arm64 | AppImage Pass; electron-linux-arm64-build.log; electron-linux-arm64-artifact.txt |
| server after live cases | exact family migration, summary migration, app-data startup gate Vitest files | 3/28; migration-negative/focused-matrix-corrected.log |

## Fixture, Environment And Broader Plan

- Immutable package: `api-e2e-fixtures/aorg-api-rev-002-agent-package` (relative to ticket), four Agents/two flat Teams/two Orgs; explicit task submit/review tools. Normal Settings import, no direct DB insertion in lieu of UI authoring.
- Owned production server `8599`, renderer `3599`, auxiliary `8710–8715`; isolated SQLite/memory/workspaces under API-REV-019. Real provider Codex App Server / gpt-5.6-sol. Source `.env` secrets not published; copied keys removed after use.
- Actual AutoByteus open_tab plus attached CDP on the same pages; semantic actions/DOM and screenshots; desktop1502x844/narrow390x844; en/zh-CN. No duplicate independent desktop instance.
- Normal user messaging/task/lifecycle correlated with exact durable identity and provider traces; real-process write/migration/Restore faults operate only in owned directories. Rare permutations retain real-temp-filesystem tests rather than claiming every permutation ran as an external server.
- User reboot removed processes/tabs, not evidence. Exact artifact, hashes and persisted records were rechecked before owned setup was restored; normal history→Restore and real conversation continuation repeated for Team, Direct Org and Mixed Org.
- Continue safe independent cases; never replay a possibly live provider tool call. No implementation source modified.

## Post-Repository And Final Confidence

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

## Execution-Informed Decisions And Cleanup

Prior API-FIND-023 now has direct live terminal projection proof; API-FIND-025 was a locator correction, not an implementation defect. API-FIND-024/026 are not reproduced on clean valid paths; no current source owner is assigned from the historical incomplete traces. See case-reconciliation.md for exact boundaries and all harness corrections. These corrections do not hide raw failures or claim internal FIFO logpoints that were not captured.

Cleanup completed at event271: all owned server/renderer/auxiliary ports clear, actual tabs empty, no owned provider descendants,15 copied secret/config files and5 generated untracked prerequisites removed;18/18 fixture,10/10 other-owner hashes, exact source/artifact and no application/durable-test changes. Test data and traces remain isolated for audit. No production/user data or shared browser process was removed.

Next: apply dynamic Pass handoff for Large/High to Code Reviewer; request proportional durable test review (no changed durable tests, expected Not Applicable). Delivery documentation sync/finalization remains downstream-owned.
