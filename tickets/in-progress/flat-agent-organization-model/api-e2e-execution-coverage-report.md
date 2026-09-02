# API/E2E Execution Coverage Report

## Execution Round Meta

- Requirements / investigation: `requirements-doc.md`; `investigation-notes.md`; `requirements-revision-record.md` (`RER-021`)
- Architecture / contract: `design-spec.md`; `agent-org-contract.md`; `architecture-design-revision-record.md` (`AD-REV-011`, AD-REV-009/010 mechanism); `design-review-report.md`; `architecture-review-revision-record.md` (`ARCH-REV-009 Pass`)
- Implementation: `implementation-handoff.md`; `implementation-revision-record.md` (`IR-016`, source `394fc27f896dac4121ef166cc0972b60e8b89ce4`)
- Code Review: `code-review-report.md`; `code-review-revision-record.md` (`CRR-017` cumulative Pass, 9.2/10)
- Supplemental artifacts: approved Product AORG-FLAT-TEAM-001 and AORG-FLAT-TEAM-STATUS-001 packages; `production_data_migration_conventions.md`
- Delivery re-entry: N/A
- Coverage Investigation / Revision Record: `api-e2e-coverage-investigation.md`; `api-e2e-revision-record.md`
- Current Revision / Round: `API-REV-004` / round 5
- Tested artifact: `b19c41e68c119f9a9590c5b04839454dae5f64b8`
- Prior Round Reviewed: Yes — API-REV-003 `Fail / 92.9%`
- Latest Authoritative Round: this report; `Pass / 98.1%`

## Routing Classification

- Task size / architectural risk: `Large / High`
- Input route: `Reviewed`
- Successful-output route: `Code Review`
- Proportional test-code review: `Required`
- Required next route: Code Reviewer reviews only the five cumulative API-owned durable test changes before Delivery.

## Investigation And Execution Basis

- Coverage investigation completed before durable changes/final execution: `Yes`.
- Ordered plan: `api-e2e-evidence/API-REV-004/execution-plan.md`.
- Per-case execution ledger, updated after each completed live case: `api-e2e-evidence/API-REV-004/live/test-case-ledger.md`.
- Plan followed: `Yes`, with two explicitly excluded harness corrections. The canonical backend was restarted with `env -i`, and the first post-restart API read occurred before a new browser tab opened.
- Existing coverage decision revised: the API-owned AgentTeamRunManager termination fake required the current `fenceAgentRunsForRootShutdown` and staged no-conversation binding fields. No production contract was weakened.
- Reroute required during execution: `No`.

## Compatibility / Legacy Scope Check

- Invalid backward compatibility introduced or required: `No`.
- Compatibility-only/legacy-retention runtime observed: `No`.
- Approved persisted-data transition followed without normal-runtime fallback: `Yes`.
- Durable coverage retained only for invalid compatibility: `No`.
- Retired/unversioned/family-mismatched definitions remain strict negative cases; valid Team V2 and Org V1 are the only normal path.

## Changed Boundary And Evidence Matrix

| Scenario | Requirements / ACs | Surface | Evidence | Result |
| --- | --- | --- | --- | --- |
| REPO-SRV-004 | AC-001/003/005/007–013/020–022 | durable server/domain/API/persistence | 29 files / 163 tests; build/bootstrap | Pass |
| REPO-WEB-004 | AC-002/011/014–020/023 | durable renderer/store/service | 18 files / 163 tests | Pass |
| REC-SVC-004 | stream recovery design | production service boundary | 1 file / 13 tests | Pass |
| PKG-004 / LIVE-001 | AC-001/005/021/022 | browser/import/files | UI import, 54 Agents / 2 Teams, 18 hashes | Pass |
| TEAM-FRESH/TASK-004 / LIVE-002 | AC-003/007/010/011/013 | browser/Codex/MCP/persistence | first prompt, message, same-task revision/acceptance | Pass |
| ORG-FRESH/TASK-004 / LIVE-003 | AC-002/003/007/010/013/019/023 | browser/Codex/MCP/persistence | no focus, status, mounted message/task, `settledAt` | Pass |
| API-MIXED-004 / LIVE-004 | AC-009/020 | GraphQL/files | exact active Team+Org discriminated roots | Pass |
| UI-NARROW-004 / LIVE-005 | AC-002/011/014/023 | 390x844 browser | strip -> drawer -> Org tree/focus; no overflow | Pass |
| RST-SIGTERM-004 / LIVE-006 | AC-009 | process lifecycle | active Team+Org direct SIGTERM | Pass |
| RST-MIXED-HISTORY-004 / LIVE-007 | AC-008/009/020–022 | restart/migration/API | same data, 54/2 caches, both roots inactive | Pass |
| TEAM-CONT-004 / LIVE-008 | AC-007/009/011/013/021 | browser/Codex | retained history, exact first continuation, same TeamRun | Pass |
| ORG-RESTORE-004 / LIVE-009 | AC-002/009/013/019/020/023 | browser/Codex/API/files | selection restore, provider identity, sidecar, continuation | Pass |
| ORG-STOP-004 / LIVE-010 | AC-009/014/023 | browser/API | terminal configuration; Org Offline; standalone Team unaffected | Pass |
| REC-LIVE-004 / LIVE-011 | recovery authority | service/browser | five private attempts/exhaustion/clear; no Reconnect | Pass |
| CLEAN-004 / LIVE-012 | quality/lifecycle | files/process/browser | immutability, second SIGTERM, closed ports/tabs | Pass |

AC-004 and AC-006 depend on separately owned external definition publication;
the in-ticket target-version admission/runtime capability is proven, and no
external repository was written.

## Repository Execution

| Order | Exact execution / mode | Result | Evidence |
| ---: | --- | --- | --- |
| 1 | fixture `sha256sum -c` / inventory | Pass | `repository/preflight-fixture.log` |
| 2 | initial 19-file server cohort | 16 files Pass; 3 setup/harness corrections required | `repository/server-exact-and-api-owned.log` |
| 3 | four application SDK builds and Brief Studio pack | Pass | `repository/application-sdk-build.log`; `repository/brief-studio-pack.log` |
| 4 | corrected API-owned server cohort | 3 files / 16 tests Pass | `repository/server-api-owned-corrections.log` |
| 5 | authoritative current server cohort | 29 files / 163 tests Pass | `repository/server-cumulative-current.log` |
| 6 | broad Nuxt invocation caused by script semantics | 440 files / 2444 tests Pass; one known unrelated audit failure | `repository/web-cumulative-current.log` |
| 7 | direct exact current web cohort | 18 files / 163 tests Pass | `repository/web-exact-current.log` |
| 8 | exact AgentOrg streaming service | 1 file / 13 tests Pass | `repository/web-stream-recovery-exact.log` |
| 9 | server production build/bootstrap smoke | Pass | `repository/server-build-corrected.log` |
| 10 | web boundary and localization guards | Pass | `repository/web-guards.log` |
| 11 | Nuxt production build/prerender | Pass; 16 routes | `repository/web-build.log` |
| 12 | `git diff --check`; API-owned test diff inventory | Pass; 5 paths, 54 insertions/64 deletions | `repository/git-diff-check.log`; `repository/api-owned-test-diff-stat.log` |

The known full-suite failure is
`tests/integration/app-font-size-fixed-px-audit.integration.test.ts`; it is the
pre-documented unrelated repository baseline and is not attributed to this
ticket. Counts overlap and are not summed as unique.

## Validation Confidence Scorecard

| Category | Post-repository | Final | New/final evidence | Residual uncertainty |
| --- | ---: | ---: | --- | --- |
| Requirement/AC proof | 95% | 98% | all in-scope critical runtime flows direct; remaining authoring/negative permutations durable | external publication separate owner |
| Changed-boundary directness | 96% | 99% | built server/renderer, public APIs/files/process, real provider | negligible |
| Cross-boundary realism/mock gap | 89% | 99% | real Chromium, Codex, MCP, GraphQL, WebSocket, SQLite, SIGTERM | none material |
| Environment/config/identity/fixture fidelity | 97% | 99% | `env -i`, UI import, exact model/tools, identity comparison, hashes | none material |
| Failure/edge/lifecycle/recovery | 94% | 98% | strict negatives, task settle, five-attempt recovery tests, two SIGTERMs, restart/restore/stop | destructive corrupt live copy not injected |
| User-surface/browser/shell | 88% | 97% | desktop and 390x844 browser journeys | Electron shell unchanged/not run |
| Durable regression quality | 96% | 97% | focused/current cohorts and narrow five-test delta | proportional review pending |

- Overall post-repository confidence: `93.6%`.
- Overall final confidence: `98.1%` (unweighted 687/7).
- Confidence gain: `+4.5 percentage points` from real UI/Codex/API/process/restart evidence.
- Every in-scope critical acceptance criterion directly proven: `Yes`.
- Any final category below 90%: `No`.
- Default 95% target met: `Yes`.

## Broader Validation Decision And Execution

- Decision: `Required`.
- Modes: production browser, live API/GraphQL/WebSocket, real Codex App Server/MCP, filesystem persistence, direct process lifecycle.
- Gap addressed: repository mocks alone could not establish the user's real import, task, restart, history, restore, responsive focus and shutdown journeys.
- Material deviation: no unsafe live server ERROR was manufactured. The exact production streaming service provides deterministic recovery/exhaustion/clear proof, while real browser journeys prove absence of a manual Reconnect control.

### Environment

- Built backend on `127.0.0.1:8457`; built production static Nuxt renderer on `127.0.0.1:3457`.
- Isolated data/workspace at `API-REV-004/live/server-data`.
- Every canonical backend start used `env -i` so inherited production database/package-root variables could not override the owned `.env`.
- AutoByteus persistent Chromium through `open_tab` and browser page tools.
- Codex App Server, OpenAI `gpt-5.6-sol`, low reasoning, automatic tool approval.
- UI-imported package: four Agents, two flat Teams, two Orgs, explicit submit/review task tools.

### Real Journey Results

| Case | Expected | Observed | Evidence | Result |
| --- | --- | --- | --- | --- |
| LIVE-001 | UI import current package | UI imported exact path; backend refreshed to 54 Agents / 2 Teams | package screenshot/log/registry | Pass |
| LIVE-002 | standalone Team message and formal task | exact first/message markers; task `task_f9da5f6543574dcbb1dbe5f48b2c1943` revised once and accepted | Team screenshot/history/files | Pass |
| LIVE-003 | complete Org/no focus/status/mounted task | exact addresses and aggregate status; task `task_89edbace8d704e8d9d2a0096cbf4099b` revised once, accepted and settled | Org screenshot, sidecar/tree | Pass |
| LIVE-004 | both active history families | one GraphQL response returned exact discriminated Team and Org roots | `api/pre-shutdown-*` | Pass |
| LIVE-005 | supported narrow focus path | 390x844 strip opened drawer; Team expanded; analyst and concierge focused; `scrollWidth=390` | three narrow screenshots/CDP log | Pass |
| LIVE-006 | active roots stop cleanly | SIGTERM logged `Server closed cleanly`; no AggregateError | `graceful-shutdown-1.log` | Pass |
| LIVE-007 | same-data restart/migration/first history | 24 migrations/no pending; 54/2 cache; Team and Org both inactive; Team members Offline | backend + first query | Pass |
| LIVE-008 | stopped Team retains and continues | prior task/message rendered; exact `AORG4C-TEAM-RESUME-001` + five-word reply; same TeamRun active | screenshot + post query | Pass |
| LIVE-009 | Org terminal history and exact selection restore | all historical rows Offline; selecting concierge restored same Org; provider policy exact; task sidecar byte-identical; exact continuation | screenshots/API/provider/hash files | Pass |
| LIVE-010 | explicit Stop Org is terminal/configuration | route changed to configuration; all Org rows Offline; no Connecting/Reconnect; standalone Team stayed active | screenshot + post-stop query | Pass |
| LIVE-011 | only bounded automatic recovery authority | 13/13 exact recovery tests; no manual Reconnect on any real state | recovery log + browser DOM | Pass |
| LIVE-012 | immutable fixture and clean cleanup | 18/18 hashes; second SIGTERM clean; ports closed; zero tabs | hashes/shutdown/cleanup logs | Pass |

The provider occasionally attempted a review before a task reached
`awaiting_review`; the server rejected it fail-closed. The same exact task then
completed its required revision and acceptance. No duplicate task or lifecycle
state was created.

## Desktop Application Validation

- Approach: browser execution of the web-equivalent renderer, per project and skill guidance.
- Directly proved: production renderer/API/stream/task/history/status/responsive behavior on desktop and 390x844.
- Shell-specific IPC/preload/window behavior: not changed; actual Electron execution was not needed.
- Effect on any existing desktop application: none; all ports/data/processes/tabs were owned and isolated.

## Platform / Runtime Targets

- Platform: Linux arm64 container.
- Node 22.23.1; pnpm 10.28.2; server/Nuxt production builds.
- Chromium 149; desktop 1510x777 and emulated 390x844; locale inherited as `C.UTF-8`; evidence timestamps UTC.
- Codex App Server with `gpt-5.6-sol`, low reasoning.

## Lifecycle / Upgrade / Restart / Persisted Data

- Approved persisted-data decision: cumulative `Migration Required`; IR-016 delta `Not Affected`.
- Data exercised: native standalone Team V2, AgentOrg V1, both history indexes, execution trees, communication and task sidecars, provider IDs, UI package registry.
- Migration result: production startup ran Prisma migrations and current application migration checks; 24 Prisma migrations were present with none pending; exact migration/preflight/relaunch tests passed.
- First post-restart query returned both exact roots inactive before browser interaction.
- Restore result: conversed `/concierge` and `/research-team/lead` retained exact provider IDs; system-instruction-only configured members retained AgentRun IDs and received new provider IDs; the complete Org became active; settled task identity/timestamp remained historical.
- Task sidecar hash before/after restore: identical `fc1669affad38f59c2755281399c4396fd5d08e8634d22ffcbc153910ba58302`.
- Version-specific runtime fallback/dual write observed: `No`.

## Tests Implemented Or Updated

| Path | Change | Boundary | Result |
| --- | --- | --- | --- |
| `autobyteus-server-ts/tests/integration/agent-team-execution/agent-team-run-manager.integration.test.ts` | Updated | current root-shutdown fence/staged binding fake | Pass |
| `autobyteus-server-ts/tests/integration/agent-team-execution/team-conversation-target-websocket.integration.test.ts` | Updated/retained | current two-family WebSocket registration | Pass |
| `autobyteus-server-ts/tests/integration/agent-team-execution/team-run-service.integration.test.ts` | Updated/retained | flat Team V2, admission/readiness | Pass |
| `autobyteus-server-ts/tests/integration/application-backend/brief-studio-agent-tool-mcp.integration.test.ts` | Updated/retained | strict collaboration identity/root kind | Pass |
| `autobyteus-server-ts/tests/integration/application-backend/brief-studio-team-config.integration.test.ts` | Updated/retained | exact current Team config serialization | Pass |
| `api-e2e-fixtures/aorg-api-rev-002-agent-package/` | Added/retained fixture | real Team/Org/task/browser runtime | imported; 18/18 immutable |

- No test was removed.
- No production source was changed by API/E2E.
- All five changed durable test paths must be attached for proportional review.

## Other Execution Artifacts

| Artifact | Purpose |
| --- | --- |
| `API-REV-004/live/test-case-ledger.md` | authoritative per-case live result/evidence memory |
| `API-REV-004/live/api/*.json` | active, first-post-restart, post-restore, post-stop GraphQL evidence |
| `API-REV-004/live/persistence/provider-identity-restore-comparison.txt` | exact provider identity policy |
| `API-REV-004/live/persistence/org-restore-hashes.txt` | task-sidecar immutability/tree transition |
| `API-REV-004/live/screenshots/*.png` | UI import, Team/Org tasks, narrow focus, history, restore, Stop |
| `API-REV-004/live/graceful-shutdown-1.log`; `graceful-shutdown-final.log` | two application-owned clean SIGTERMs |
| `API-REV-004/live/web-cleanup.log` | closed ports/processes |
| `API-REV-004/setup-invalid-inherited-env/` | excluded inherited-environment attempt; not product evidence |
| `API-REV-004/live/setup-harness-not-product/` | excluded detached-restart runner artifact |

## Dependencies Mocked Or Emulated

| Dependency | Method | Confidence effect |
| --- | --- | --- |
| Browser viewport | CDP device metrics at exact 390x844 | no material gap; real production DOM/layout/interaction |
| Valid server ERROR sequence | exact production service with deterministic WebSocket test double | negligible; directly exercises retry/exhaustion/clear state machine; live UI separately proved no manual control |

Codex, MCP, backend, database, filesystem, GraphQL, WebSocket transport,
production renderer, tasks and OS signals were real.

## Cleanup

| Resource | Action | Result |
| --- | --- | --- |
| Browser | `close_tab` | zero persistent tabs |
| Initial backend | direct SIGTERM with Team+Org active | clean close; no AggregateError |
| Restarted backend | direct SIGTERM after continuation/Stop | clean close in ~240 ms |
| Production renderer | terminated owned HTTP server | port 3457 closed |
| Server port | lifecycle close | port 8457 closed |
| Isolated data | retained as evidence | shared production data untouched |
| Fixture | post-run `sha256sum -c` | 18/18 OK |
| Generated SDK/Brief Studio outputs | retained/disclosed build artifacts | untracked; not claimed as production source |

## Prior Failure Resolution

| Prior finding | Resolution | Evidence |
| --- | --- | --- |
| API-FIND-012 | Resolved: one correct mounted-Team task submitted, revised, resubmitted, accepted, settled and left Org usable | LIVE-003 sidecar/tree/screenshot |
| API-FIND-013 | Resolved: first same-data post-restart query returned both root families and exact Team definition/run/member history | LIVE-007 first-post-restart API |
| CR-FIND-014 / withdrawn API-FIND-011 | Resolved: correct 390x844 strip -> drawer -> Org tree path selected Team/nested/direct members | LIVE-005 screenshots/CDP |
| API-FIND-008 historical | Remains Not Reproduced / invalidly confounded with No Architecture Impact; not a current failure basis | retained architecture disposition |

A prematurely drafted `API-FIND-014` was not a completed product finding. It
came from an invalid backend environment that inherited production
`DATABASE_URL` and package roots. The canonical `env -i` rerun loaded 54 Agents
and 2 Teams after restart and completed Team/Org continuation; the excluded
attempt is retained only for transparency.

## Result Summary

| Result | Scenarios | Summary |
| --- | --- | --- |
| Pass | repository/build/guards; LIVE-001–LIVE-012 | all planned in-scope cumulative Team/Org/Codex/API/restart/responsive/cleanup checks passed |
| Fail | None | no current finding |
| Not Tested / Out of scope | external publication; unchanged Electron shell; destructive corrupt live copy | bounded and does not block in-scope critical proof |

## Recommended Recipient

`/software_engineering_team/code_reviewer` for proportional test-code review of
the five changed durable integration-test paths. This Pass does not itself claim
Delivery completion.

## Latest Authoritative Result

- Result: `Pass`
- Final validation confidence: `98.1%`
- Default 95% target met: `Yes`
- Any final category below 90%: `No`
- Broader validation: `Required and completed — Pass`
- Critical acceptance criteria lacking in-scope direct proof: `None`
- Required next recipient: `/software_engineering_team/code_reviewer`
