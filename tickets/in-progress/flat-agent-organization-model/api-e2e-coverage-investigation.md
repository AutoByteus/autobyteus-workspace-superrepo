# API/E2E Coverage Investigation — AORG-FLAT-TEAM-001

## Investigation Meta

- Requirements Doc: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`
- Investigation Notes: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`
- Requirements Revision Record: `requirements-revision-record.md` (`RER-023`)
- Design Spec / contract: `design-spec.md`; `agent-org-contract.md` (`AD-REV-012`)
- Supplemental Product Artifacts: approved AORG-FLAT-TEAM-001 `RV-012`, AORG-FLAT-TEAM-STATUS-001, AORG-TEAM-OVERRIDES-001, and task-Agent monitor visibility artifacts
- Architecture Design Revision Record: `architecture-design-revision-record.md`
- Design Review Report: `design-review-report.md`
- Architecture Review Revision Record: `architecture-review-revision-record.md` (`ARCH-REV-010 / Pass`)
- Implementation Handoff / Revision Record: `implementation-handoff.md`; `implementation-revision-record.md` (cumulative `IR-001–026`)
- Code Review Report / Revision Record: `code-review-report.md`; `code-review-revision-record.md` (`CRR-032 / Pass`)
- API/E2E Revision Record: `api-e2e-revision-record.md`
- Current API/E2E Revision ID: `API-REV-008`
- API/E2E Test-Case Ledger: `api-e2e-test-case-ledger.md`
- Current Investigation Round: 9
- Trigger: current reviewed recovery correction for `API-FIND-016`, plus cumulative renewal of the Large/High package
- Prior Investigation Reviewed: `API-REV-007 / Fail / 86.9%`
- Latest Authoritative Investigation: this document

## Routing Classification

- Task size: `Large`
- Architectural risk: `High`
- Input route: `Reviewed`
- Successful-output route: `Code Review`
- Proportional test-code review decision: `Required`; no durable test file changed during API-REV-008, so Code Reviewer may record the changed-test review as `Not Applicable`

## Current Requirement And Design Basis

The cumulative package must preserve the fixed-depth model: one AgentOrg may
contain direct Agents and reusable flat Teams; a Team contains Agents only and
remains independently runnable. Exact contextual addresses, coordinator ingress,
handoffs, task ownership, Team V2 and AgentOrg V1 persistence, strict two-family
history/stream contracts, migration, shutdown and Restore must fail closed rather
than guess identity or retain a compatibility path. Current Product supplements
also require original-Team-like configuration hierarchy, mounted-Team aggregate
status, task-monitor continuity/fallback, localized handoff authoring and truthful
desktop/narrow presentation.

`IR-026` changes only the browser AgentOrg recovery boundary that caused
`API-FIND-016`: current-generation retirement still occurs first, automatic
recovery is scheduled before the retired socket is closed, and the client uses
legal application close code `4000` instead of reserved protocol code `1002`.
The user never clicks Reconnect. A valid ERROR must lead to a complete verified
replacement snapshot or exactly one notice after five failed attempts.

## Changed Behavior And Boundary Summary

| Boundary | Change / preservation | Upstream evidence | Coverage consequence |
| --- | --- | --- | --- |
| WebSocket client close | Changed from browser-invalid `1002` to legal application code `4000` | IR-026 / CRR-032 / DS-016/018 | Native Chromium and real production-browser execution required |
| Automatic Org recovery ordering | Changed: schedule after strict retirement, before retired-socket close | IR-026 / CRR-032 | Exercise valid correlated ERROR, replacement generations and exhaustion |
| Recovery ownership | Preserved: one private automatic owner; no manual/public Reconnect | AD-REV-012 / CRR-032 | Assert absence of Reconnect and no second recovery path |
| Team/Org/task/persistence/migration/localization | Preserved cumulatively | RER-023 / IR-026 / CRR-032 | Revalidate material repository and real-system paths proportionately |

## Changed Surface And Boundary Classification

| Surface / Boundary | Affected? | Actual changed boundary | Repository evidence | Material risk remaining after repository checks | Broader validation |
| --- | --- | --- | --- | --- | --- |
| Domain/backend logic | Preserved | none in IR-026 | retained server 15 files / 61 tests | live cross-root regression | real Team/Org runtime |
| API/transport | Yes | browser WebSocket close and recovery sequencing | focused 5 files / 25 tests | real browser API enforcement and server-frame correlation | Chromium/CDP + server |
| Frontend state | Yes | AgentOrg stream generation recovery | focused stream/context/workspace tests | permanent Connecting or stale publication | production renderer |
| Browser/user journey | Yes | ERROR -> automatic retry/exhaustion | native close-code probe | real route, notice and control state | AutoByteus `open_tab` |
| Authentication/session | No | local validation has no auth change | N/A | none | none |
| Desktop renderer/web-equivalent UI | Yes | production renderer uses same browser WebSocket API | production Nuxt build | responsive/runtime integration | desktop and 390x844 browser |
| Electron shell | No | no preload/IPC/window delta | exact AppImage provenance | negligible unchanged shell uncertainty | no actual shell launch |
| Process/lifecycle | Preserved and material | shutdown/restart/recovery/Stop | lifecycle suites | real active-root shutdown and same-data restart | SIGTERM + restart |
| Persisted-data transition | Preserved and material | Migration Required cumulative package; IR-026 not affected | migration suites | current data/log/Restore confirmation | live SQLite/filesystem |
| Worker/queue/task | Preserved and material | root task queue and task-agent settlement | task suites | real provider/MCP/task path | real Codex task lifecycle |
| External integration | Preserved and material | Codex App Server | repository tests are not real provider proof | provider/tool dispatch realism | real `gpt-5.6-sol` |

## Project Execution Discovery

- Assigned worktree: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`
- Stack: TypeScript Fastify/GraphQL/WebSocket backend, SQLite/filesystem persistence,
  Nuxt/Vue renderer and Electron packaging, Vitest, Chromium, Codex App Server.
- Required secrets: available through the existing local Codex provider setup;
  secret values were not recorded.
- Conflicting instructions: none. The initial server cohort exposed its generated
  SDK build prerequisite; the prerequisite was built and the unchanged cohort was
  rerun. The first short-lived live process was reaped before product mutation;
  owned foreground PTYs replaced it.

| Instruction / configuration | Learned constraint |
| --- | --- |
| repository `AGENTS.md` / project READMEs / package scripts | run from the owning package; use project scripts and generated SDK prerequisites |
| `autobyteus-server-ts/package.json` and Vitest config | build shared application contracts before affected server suites when `dist` is absent |
| `autobyteus-web/package.json`, Nuxt config and localization docs | use production build for web-equivalent renderer; validate both boundary guards and localization audit |
| implementation handoff Legacy check | no compatibility mechanism; invalid `close(1002)` is removed |
| implementation handoff Persisted Data check | cumulative decision is Migration Required; IR-026 itself does not alter persistence |

| Component | Setup / resource | Readiness | Cleanup |
| --- | --- | --- | --- |
| Backend | built server on owned `127.0.0.1:8588`, isolated `.env`/SQLite/data/memory/log roots | `/rest/health` | SIGTERM exact owned PID |
| Renderer | production Nuxt renderer on owned `127.0.0.1:3588` | HTTP root | stop exact owned PTY |
| Browser | AutoByteus Chromium `open_tab`; CDP only on the same owned tab | semantic DOM + network/runtime events | close owned tabs |
| Provider | Codex App Server, `gpt-5.6-sol`, tool auto-execution | observable model/tool results | root Stop + server shutdown |

| Fixture / identity need | Creation method | Safety / cleanup |
| --- | --- | --- |
| imported Agents/Teams/Orgs | immutable 18-entry package with `PACKAGE.sha256` | verify 18/18 before and after; do not mutate source package |
| fresh authored Team/Org | create through real browser UI, then verify GraphQL bytes | isolated data root; Stop created runs |
| Team/Org/task identities | exact live run IDs, canonical addresses and durable sidecars | copy evidence only; remove no unrelated data |

## Persisted Data Transition Coverage Basis

- Approved decision: `Migration Required` for the cumulative ticket; IR-026 is
  `Not Affected`.
- Required result: retain native Team V2 and AgentOrg V1 family/path separation,
  fixed-depth migration-only legacy conversion, strict current codecs and no
  request-time fallback.
- Planned evidence: focused migration suites, fresh migration logs, same-data
  restart, exact history/Restore, provider-identity rules and task-sidecar
  preservation.
- Upstream ambiguity: none.

## Existing Durable Coverage Inventory And Decisions

| Coverage | Decision | Evidence / action |
| --- | --- | --- |
| `agentOrgStreamingService.spec.ts` recovery success/exhaustion | Still Valid | rerun exact current tests; double now rejects invalid client codes |
| context hydration/reference projection/workspace view/status suites | Still Valid | rerun with exact recovery cohort |
| server Team/Org tasks, stream, history, shutdown, migration suites | Still Valid | rerun retained 15-file cohort after generated prerequisite |
| web localization, authoring, history/focus/task monitor suites | Still Valid | rerun retained 37-file cohort and guards/audit |
| API-REV-007 real Team/Org/localization/task/history evidence | Historical; revalidate proportionately | create new data and execute on exact current artifact |
| API-REV-007 ERROR trace using `1002` | Replace as result evidence | retain as historical defect; generate current-artifact correlated trace |
| API-REV-007 strict address scenario | Still Valid but Not Tested there | execute current live negative now |
| Electron shell IPC/window checks | Out Of Scope for delta | AppImage size/SHA plus renderer evidence; no shell-specific source change |

No coverage was stale enough to delete. No durable API/E2E test addition was
needed after CRR-032's reviewed production/service-spec pair directly protected
the regression; a temporary CDP correlation was appropriate for the exact live
browser/server boundary.

## Repository Coverage Execution Plan And Results

| Order | Boundary | Result | Evidence |
| ---: | --- | --- | --- |
| 1 | artifact/source/fixture/ports/tabs/diff preflight | Pass | `api-e2e-evidence/API-REV-008/repository/preflight.log` |
| 2 | recovery/context/workspace: 5 files / 25 tests | Pass | `repository/web-recovery-focused.log` |
| 3 | native Chromium: `1002` rejected, `4000` accepted | Pass | `repository/browser-close-contract.log` |
| 4 | web/localization guards and zero-finding audit | Pass | `repository/web-guards-audit.log` |
| 5 | retained server: 15 files / 61 tests | Pass after generated prerequisite | `repository/server-retained-after-prereq.log`; initial setup log retained |
| 6 | retained web/localization: 37 files / 263 tests | Pass | `repository/web-retained-localization.log` |
| 7 | production Nuxt build, 16 routes | Pass | `repository/web-production-build.log` |
| 8 | AppImage size/SHA provenance | Pass | `repository/appimage-provenance.log` |

## Test-Case Ledger Plan

- Ledger required: `Yes` — six live cases, lifecycle restarts and credible
  interruption/compression risk.
- Canonical ledger: `api-e2e-test-case-ledger.md`
- Initialized before execution: `Yes`
- Cases: `REPO-001–003`, `LIVE-001–006`; checkpoints were recorded during
  repository prerequisite correction, environment startup, shutdown and recovery.

## Post-Repository Confidence Scorecard

| Category | Score | Support | Remaining uncertainty / improvement |
| --- | ---: | --- | --- |
| Requirement and acceptance-criteria proof | 96% | direct current recovery, retained cumulative suites | renew critical real journeys |
| Changed-boundary execution directness | 97% | exact current spec plus native Chromium contract | correlate real server frame/current UI |
| Cross-boundary integration realism and mock gap | 93% | broad server/web suites and production build | real provider/browser/process path |
| Environment/configuration/identity/fixture fidelity | 94% | exact artifact, hashed package, isolated roots | create and restore fresh live identities |
| Failure/edge/lifecycle/recovery evidence | 94% | success/exhaustion specs and retained lifecycle | exact active shutdown/restart and live exhaustion |
| User-surface/browser/desktop-shell confidence | 92% | native Chromium and renderer build | desktop/narrow real UI; unchanged shell remains indirect |
| Durable regression coverage quality/relevance | 97% | focused contract-faithful test double and retained suites | no material gap; live correlation improves confidence, not durability |

- Overall post-repository confidence: `94.7%` (simple mean)
- Every critical acceptance criterion directly proven at this point: `No` — live
  browser recovery and renewed strict negative remained outstanding.
- Any category below 90%: `No`
- Default clean-confidence target met: `No`
- Material residual risk: the exact API-FIND-016 browser/server sequence could
  still fail despite mocked recovery and the isolated browser API probe.

## Broader Validation Decision And Completed Plan

- Decision: `Required`
- Modes: real Browser + Live API + Lifecycle + filesystem persistence + provider
- Rationale: only the real production renderer, server ERROR, native WebSocket,
  same-data restart and Codex/MCP execution could close the material gap.
- Desktop decision: browser-preferred web-equivalent validation was sufficient;
  actual Electron shell execution was not justified because IR-026 changed no
  IPC/preload/window/package lifecycle. Exact AppImage provenance was retained.
- Temporary executable method: `LIVE-004-recovery-cdp-probe.mjs`, attached to
  the same AutoByteus tab solely to correlate valid frames, browser close calls,
  runtime exceptions, retries, notice and final state. It is evidence, not a
  repository-resident durable test.

## Final Coverage Decisions

- `API-FIND-016`: **Resolved**. Real production Chromium used close `4000` on
  all six valid-ERROR generations, raised no `InvalidAccessError`, did not remain
  Connecting, and converged to exactly one exhaustion notice without Reconnect.
  Repository success coverage proves complete verified publication/notice clear.
- Strict wrong-address and wrong-AgentRun scenarios: **Pass**, followed by an
  exact valid projection/checkpoint proving the active context remained usable.
- All planned Team, Org, task, localization, migration, restart, Restore, Stop,
  responsive and cleanup cases: **Pass**.
- Not Tested / blocked / deferred critical scope: **None**.
- Ambiguity or reroute before execution: **None**.
- Repository-resident durable coverage changed by API/E2E: **No**.
- Final broader-validation result: **Pass**.
- Final confidence: **98.4%**; no category below 90%; all critical acceptance
  criteria in the selected cumulative scope have direct evidence.
- Proceed to handoff: `Yes`, reviewed-route Code Reviewer for proportional
  test-code review (`Not Applicable` is expected because no durable test changed).
