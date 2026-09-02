# API/E2E Coverage Investigation

## Investigation Meta

- Requirements Doc: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`
- Investigation Notes: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`
- Requirements Revision Record: `requirements-revision-record.md` (`RER-021`)
- Design Spec / Contract: `design-spec.md`; `agent-org-contract.md`
- Supplemental Task Artifacts: approved AORG-FLAT-TEAM-001 and AORG-FLAT-TEAM-STATUS-001 UI/UX packages, user decision record, visual manifest, and `production_data_migration_conventions.md`
- Architecture Revision / Review: `architecture-design-revision-record.md` (`AD-REV-011`, AD-REV-009/010 mechanism); `design-review-report.md`; `architecture-review-revision-record.md` (`ARCH-REV-009 Pass`)
- Implementation: `implementation-handoff.md`; `implementation-revision-record.md` (`IR-016`, source `394fc27f896dac4121ef166cc0972b60e8b89ce4`)
- Code Review: `code-review-report.md`; `code-review-revision-record.md` (`CRR-017` cumulative Pass, 9.2/10)
- Delivery Revision Record: N/A — no delivery re-entry
- API/E2E Revision Record: `api-e2e-revision-record.md`
- Current API/E2E Revision ID / Investigation Round: `API-REV-004` / round 5
- Tested artifact: `b19c41e68c119f9a9590c5b04839454dae5f64b8`
- Prior Investigation Reviewed: Yes — API-REV-003 was `Fail / 92.9%`; no prior Pass was inferred.
- Latest Authoritative Investigation: this completed API-REV-004 investigation.

## Routing Classification

- Task size: `Large`
- Architectural risk: `High`
- Input route: `Reviewed`
- Successful-output route: `Code Review`
- Proportional test-code review decision: `Required` for five cumulative API-owned durable integration-test changes.

## Current Requirement And Design Basis

The cumulative result must prove strict current-only Team Definition V2 and
AgentOrg Definition V1 admission; flat standalone Team compatibility; reusable
Teams mounted directly under a coordinator-free Org; exact `/agent`, `/team`,
and `/team/agent` message/task/handoff routing; complete task submission,
revision, acceptance and settlement; two-family GraphQL/history/stream and
persistence; configuration-first whole-Org launch with no implicit focus;
truthful stopped history and exact selection-driven continuation; strict
identity/reference ownership; five-attempt private automatic stream recovery
with one exhaustion notice and later clear; root-only Stop/shutdown; migration
preflight/relaunch; and accessible mounted-Team aggregate status.

The user additionally required a real validation package, imported through the
real UI with `open_tab`, real Codex `gpt-5.6-sol`, profound standalone Team and
AgentOrg task/message execution, same-data server restart, history reload and
continuation, and desktop/narrow browser journeys. The retained package contains
four Agents, two flat Teams and two Orgs, explicitly exposes
`submit_task_result` and `review_task_result`, and has an 18-file hash contract.

External public/private definition publication remains separately owned under
AC-004/AC-006. This ticket proves the target-version admission/runtime boundary
without writing those repositories.

## Changed Behavior Summary

| Boundary | Change / preserved outcome | Upstream basis | Coverage consequence |
| --- | --- | --- | --- |
| Mounted-Team settlement | accepted task settles under Org ownership without fail-stopping the Org | IR-016 / CRR-017 | real Codex same-task lifecycle plus durable tree/sidecar |
| Mixed restart history | first post-restart read contains both Team and Org families | AC-009/020 | query before opening a new browser tab |
| Imported package reuse | UI-imported target definitions survive same-data restart and remain executable | AC-007/013/021 | UI import, isolated `.env`/registry, cache counts, Team continuation |
| Org restore identity | conversed providers retain exact identity; system-only members receive durable new bindings; incomplete cases fail closed | AD-REV-009/010/011 | pre/post provider comparison and strict durable negatives |
| Stream failure recovery | valid ERROR is private during five automatic attempts, published once after exhaustion, cleared by complete snapshot; no manual reopen | IR-016 / CRR-017 | exact production service tests and live control absence |
| Stopped/terminal UI | Team first continuation is admitted; Org history is terminal until exact member selection; Stop returns to configuration | AC-002/009/023 | desktop and 390x844 production browser |
| Migration/admission | complete preflight before writes; strict current-family availability with degraded startup | AC-005/008/021/022 | current server migration/startup/negative cohort and real restart |

## Changed Surface And Boundary Classification

| Surface / Boundary | Affected | Repository evidence | Material live risk | Selected broader mode |
| --- | --- | --- | --- | --- |
| Domain / backend | Yes | task, persistence, migration, manager/service cohorts | provider identity, settlement, restart | real Codex + same-data restart |
| API / transport | Yes | GraphQL, WebSocket, MCP integration | real provider/MCP/browser composition | live API/browser |
| Frontend state / UI | Yes | exact 18-file Nuxt cohort | focus, status, stop, responsive drawer | production Chromium |
| Browser / web-equivalent desktop | Yes | component/store coverage and build | user sequencing and streaming | `open_tab`, desktop + 390x844 |
| Process / lifecycle | Yes | shutdown/fence/restore tests | application-owned SIGTERM, provider teardown | direct SIGTERM/restart |
| Persistence / migration | Yes | Team V2/Org V1 and migration/preflight tests | actual files, registry, first restart read | isolated filesystem/API |
| Queue / task coordination | Yes | lifecycle/command queue coverage | real submit/revise/resubmit/accept/settle | Codex/MCP tasks |
| External integration | Yes — Codex/Brief Studio | SDK builds and Brief Studio pack/integration | actual provider tool loop | real Codex App Server |
| Electron shell | No changed IPC/preload/window boundary | N/A | none material | browser is sufficient for renderer behavior |

## Project Execution Discovery

- Worktree: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`
- Stack: Node 22.23.1, pnpm 10.28.2, TypeScript/Vitest/Fastify/GraphQL/SQLite, Nuxt 3.21.1, Nitro 2.13.1, Vue 3.5.28, Vite 7.3.1, Chromium 149, Codex App Server.
- Authority read: applicable repository `AGENTS.md`/READMEs/package scripts and Vitest configs; requirements/design/review artifacts; production migration conventions; API/E2E skill.
- Secrets/accounts: no new remote account; the locally authenticated Codex runtime was used.

| Component | Setup / readiness | Owned cleanup |
| --- | --- | --- |
| Server repository | focused/cumulative Vitest, SDK prerequisites, production build/bootstrap | command exit |
| Web repository | exact Nuxt/Vitest, guards, production build | command exit |
| Live backend | built app at `127.0.0.1:8457`; `env -i`; isolated `API-REV-004/live/server-data` | direct application-owned SIGTERM |
| Production web | built `dist/public` at `127.0.0.1:3457`, endpoints to 8457 | terminate owned HTTP server |
| Browser | AutoByteus persistent Chromium `open_tab` | `close_tab`; verify zero tabs |
| Fixture | import retained absolute path through Settings > Agent Packages; validate `PACKAGE.sha256` | source retained unchanged; isolated imported data retained as evidence |

### Setup / Harness Validity Decisions

- The initial 19-file server command had 16 passing files and three setup
  failures: an API-owned frozen termination fake lacked the new fence callback,
  and Brief Studio generated outputs were absent. The fake was corrected, SDK
  and Brief Studio builds ran, and the affected 3 files / 16 tests plus the
  authoritative 29 files / 163 tests passed. Production source was not relaxed.
- A missing shell `pnpm` PATH produced non-product build command failures. The
  evidence-local executable path was corrected and production build/bootstrap
  passed.
- `pnpm test:nuxt -- --run <paths>` invoked the full Nuxt suite due script
  semantics: 440 files / 2444 tests passed; only the pre-documented unrelated
  fixed-px typography audit failed. The intended direct exact cohort then passed
  18 files / 163 tests. The unrelated baseline remains out of attribution.
- A first live setup inherited a parent production `DATABASE_URL` and
  `AUTOBYTEUS_AGENT_PACKAGE_ROOTS`; because dotenv correctly does not override
  inherited variables, that attempt was invalid. It was isolated under
  `setup-invalid-inherited-env/`. The canonical run started every backend with
  `env -i` and proved the owned database/package paths.
- A short `nohup` restart was reaped by the command runner while the old browser
  attempted reconnect. It is isolated under `live/setup-harness-not-product/`.
  The canonical restart closed the tab, used an owned persistent PTY, and made
  the first mixed-history query before opening a new tab.
- Therefore the prematurely suspected `API-FIND-014` was an invalid environment
  observation, not a product finding. It is absent from the final result.

## Persisted Data Transition Coverage Basis

- Approved decision: cumulative `Migration Required`; IR-016 delta `Not Affected`.
- Implementation handoff reports no legacy fallback, request-time upgrade, dual recovery authority, or public/manual reopen.
- Evidence: exact migration/preflight/relaunch/strict-family tests in the 29-file server cohort; real Team V2 and Org V1 files; first same-data mixed history read; restored identity/task sidecars; 18/18 fixture immutability.
- External repositories remained read-only.

## Durable Coverage Inventory And Decisions

| Coverage | Decision | Current evidence / action |
| --- | --- | --- |
| `agent-team-run-manager.integration.test.ts` | Needs Update — completed | added current shutdown fence and staged no-conversation binding fake; passes targeted/current cohorts |
| `team-run-service.integration.test.ts` | Still Valid after prior update | current flat Team V2/admission/readiness coverage; passes |
| `team-conversation-target-websocket.integration.test.ts` | Still Valid after prior update | current two-family registration signature; passes |
| Brief Studio MCP/config integrations | Still Valid after prior updates | strict collaboration identity and exact `llmConfig:null`; pack and tests pass |
| Mounted task lifecycle/settlement | Still Valid | durable server coverage plus real Codex accepted and `settledAt`; API-FIND-012 resolved |
| Atomic mixed history/startup | Still Valid | repository plus first post-restart query; API-FIND-013 resolved |
| AgentOrg stream recovery | Still Valid | exact production service 13/13, no public/manual reopen |
| Team V2 / Org V1 persistence, migration/admission | Still Valid | current server cohort, build/bootstrap, real isolated restart |
| Responsive focus/status/Stop | Still Valid and renewed live | exact tests plus desktop/390x844 browser |
| Obsolete recursive Team assertions | Stale — replaced previously | current flat Team V2 coverage; no legacy runtime behavior protected |

No durable coverage was removed.

## Durable Coverage Changed

| Path | Change | Result |
| --- | --- | --- |
| `autobyteus-server-ts/tests/integration/agent-team-execution/agent-team-run-manager.integration.test.ts` | current root-shutdown fence and staged-binding fake | Pass |
| `autobyteus-server-ts/tests/integration/agent-team-execution/team-conversation-target-websocket.integration.test.ts` | retained current registration dependency | Pass |
| `autobyteus-server-ts/tests/integration/agent-team-execution/team-run-service.integration.test.ts` | retained flat Team V2/admission/readiness replacement | Pass |
| `autobyteus-server-ts/tests/integration/application-backend/brief-studio-agent-tool-mcp.integration.test.ts` | retained strict `collaborationIdentity`/root union | Pass |
| `autobyteus-server-ts/tests/integration/application-backend/brief-studio-team-config.integration.test.ts` | retained exact Team config serialization | Pass |
| `api-e2e-fixtures/aorg-api-rev-002-agent-package/` | deterministic real Team/Org/tools package with manifest/hashes | imported and 18/18 immutable |

## Repository Coverage Execution Results

| Order | Execution | Result | Evidence |
| ---: | --- | --- | --- |
| 1 | fixture hash/inventory | Pass | `API-REV-004/repository/preflight-fixture.log` |
| 2 | initial exact/API-owned server 19 files | 16 pass; 3 setup/harness failures corrected | `server-exact-and-api-owned.log` |
| 3 | application SDK builds and Brief Studio pack | Pass | `application-sdk-build.log`; `brief-studio-pack.log` |
| 4 | corrected affected server cohort | 3 files / 16 tests Pass | `server-api-owned-corrections.log` |
| 5 | authoritative current server cohort | 29 files / 163 tests Pass | `server-cumulative-current.log` |
| 6 | accidental full Nuxt suite | 440 files / 2444 tests Pass; one known unrelated audit fail | `web-cumulative-current.log` |
| 7 | intended exact web cohort | 18 files / 163 tests Pass | `web-exact-current.log` |
| 8 | exact AgentOrg stream-recovery service | 1 file / 13 tests Pass | `web-stream-recovery-exact.log` |
| 9 | server production build/bootstrap smoke | Pass | `server-build-corrected.log` |
| 10 | web boundary/localization guards | Pass | `web-guards.log` |
| 11 | production web build | Pass; 16 routes | `web-build.log` |
| 12 | API-owned diff check/stat | Pass; 5 tests, 54 insertions/64 deletions | `git-diff-check.log`; `api-owned-test-diff-stat.log` |

Counts overlap and are not summed as unique.

## Post-Repository Confidence Scorecard

| Category | Score | Support | Remaining uncertainty / selected improvement |
| --- | ---: | --- | --- |
| Requirement/AC proof | 95% | migration/task/history/recovery/UI cohorts | real cumulative Team/Org lifecycle |
| Changed-boundary directness | 96% | direct services/stores/APIs/components/builds | provider/process composition |
| Cross-boundary realism/mock gap | 89% | integration-rich repository checks | real Codex/MCP/browser/restart |
| Environment/config/identity/fixture fidelity | 97% | hashed current fixture and built artifacts | UI-imported same-data run |
| Failure/edge/lifecycle/recovery | 94% | strict negatives, recovery and shutdown suites | real shutdown/restore/settle |
| User surface/browser/shell | 88% | components/stores/build | desktop and narrow user journeys |
| Durable regression quality | 96% | current server/web cohorts | proportional review of changed tests |

- Overall post-repository confidence: `93.6%` (655/7).
- Every critical acceptance criterion directly proven at this checkpoint: `No`.
- Categories below 90%: cross-boundary realism; user surface.
- Default 95% target met: `No`.
- Broader validation: `Required` — real UI import, Codex tasks, API/files,
  SIGTERM/restart/history/continuation and responsive browser execution.

## Broader Validation Outcome

The detailed, incrementally maintained record is
`api-e2e-evidence/API-REV-004/live/test-case-ledger.md`.

| Live scenario | Result | Direct evidence |
| --- | --- | --- |
| LIVE-001 UI package import/registry | Pass | production Settings UI; 54 Agents / 2 Teams; screenshot/log |
| LIVE-002 standalone Team first prompt/message/full task lifecycle | Pass | real Codex; same task revise/resubmit/accept; screenshot/history |
| LIVE-003 AgentOrg launch/status/routing/mounted task settlement | Pass | real Codex/MCP; accepted sidecar; terminal `settledAt`; Org usable |
| LIVE-004 pre-shutdown two-family GraphQL | Pass | exact active Team + Org root union and identities |
| LIVE-005 390x844 strip -> drawer -> exact Org focus | Pass | direct Agent, Team coordinator, nested Agent; no horizontal overflow |
| LIVE-006 active Team+Org SIGTERM | Pass | `Server closed cleanly`; no AggregateError |
| LIVE-007 isolated restart/migration/first mixed inactive history | Pass | 54/2 cache; exact inactive roots; Team Offline |
| LIVE-008 standalone Team history/first continuation | Pass | prior task/message history; exact `AORG4C-TEAM-RESUME-001`; same TeamRun active |
| LIVE-009 Org stopped history/selection restore/identity/continuation | Pass | exact provider policy, byte-identical task sidecar, exact `AORG4C-ORG-RESUME-001` |
| LIVE-010 explicit Stop Org terminal presentation | Pass | configuration route; all Org rows Offline; no Reconnect |
| LIVE-011 automatic ERROR recovery authority | Pass | exact 13/13 service boundary plus live absence of manual control |
| LIVE-012 immutability/final shutdown/cleanup | Pass | 18/18 hashes; clean SIGTERM; ports closed; zero tabs |

## Final Confidence Scorecard

| Category | Final | Rationale |
| --- | ---: | --- |
| Requirement/AC proof | 98% | every in-scope critical runtime AC has current durable or direct live proof; external publication remains separately owned |
| Changed-boundary directness | 99% | built production server/renderer, public APIs/files/processes and real provider exercised |
| Cross-boundary realism/mock gap | 99% | real Chromium, Codex, MCP, GraphQL, WebSocket, SQLite and SIGTERM |
| Environment/config/identity/fixture fidelity | 99% | isolated `env -i` data, UI import, exact model/tools, pre/post identities and immutable hashes |
| Failure/edge/lifecycle/recovery | 98% | strict negatives, five-attempt recovery tests, task settlement, two clean SIGTERMs, restart/restore/stop |
| User surface/browser/shell | 97% | desktop and 390x844 real browser; Electron shell not affected |
| Durable regression quality | 97% | strong current cohorts and narrow five-test delta; proportional review still required |

- Overall final confidence: `98.1%` (687/7).
- Every in-scope critical acceptance criterion directly proven: `Yes`.
- Any final category below 90%: `No`.
- Default 95% clean target met: `Yes`.
- Broader validation: `Required and completed — Pass`.

## Not Tested / Out Of Scope

| Boundary | Status / risk |
| --- | --- |
| External public/private target-definition publication | Out of scope and separate owner under AC-004/006; target admission/runtime capability is proven |
| Electron-specific IPC/preload/window behavior | No changed shell boundary; web-equivalent renderer was browser-tested |
| Destructive corruption of retained live data | Not injected into the evidence store; strict current-family/missing-binding negatives pass directly in durable cohorts |
| Unrelated full-suite fixed-px typography audit | Known repository baseline, out of ticket attribution |

## Ambiguities Or Reroute Triggers

None. `API-FIND-012` and `API-FIND-013` are resolved. The premature
`API-FIND-014` observation was an invalid inherited-environment setup and is
retained only under excluded setup evidence, with no production attribution.

## Investigation Decision

- Proceeded to API/E2E execution: `Yes`.
- Repository durable coverage changed: `Yes` — five cumulative API-owned integration tests; no production source/test removal.
- Post-repository confidence: `93.6%`.
- Broader validation: `Required and completed — Pass`.
- Current result/confidence: `Pass / 98.1%`.
- Reroute required: `No failure reroute`; reviewed-route successful test-code review is required.
- Recommended recipient: `/software_engineering_team/code_reviewer` for proportional review of the five changed durable test files.
- Delivery readiness: pending successful proportional test-code review and downstream delivery; not claimed here.
