# API/E2E Coverage Investigation — AORG-FLAT-TEAM-001

## Investigation Meta

- Authority: `RER-025`; `AD-REV-016 / DS-027`; `ARCH-REV-014 / Pass`; `IR-029`; `CRR-038 / Pass`.
- Current source/artifact: `0d7b6e7e7bc1050a43d3681eb83b09a342537ef7` / `54716ad0ffd4c4be7aab389a84d3d7e41f72ecb5`.
- Current API/E2E revision / round: `API-REV-011` / 12.
- Prior authority: `API-REV-010 / Pass / 98.3%` on IR-028.
- Classification: `Large / High / Reviewed`; successful route is Code Review with proportional review required for any durable test change.
- Canonical ledger: `api-e2e-test-case-ledger.md`; plan: `api-e2e-evidence/API-REV-011/execution-plan.md`.

## Requirement And Boundary Mapping

`REQ-033 / AC-028 / SCN-017 / QR-011 / DS-027` adds a derived AgentOrg history summary only. The first successfully accepted external user `SEND_MESSAGE` with non-empty Team-identical compaction sets one stable summary when the exact recipient is a configured direct Org Agent or configured Agent inside a directly mounted Team. Task-scoped, internal/system/task/approval/interrupt, rejected/failed, empty and later messages do not qualify. The durable first winner must appear in the already-rendered row after authoritative history refresh, survive Stop/Restore/restart/rebuild, and never be optimistically sourced from the submitted text.

A required startup-only migration must preserve existing summaries, recover only a uniquely earliest provenance-qualified configured-member trace, leave no-evidence/ambiguous rows empty with the `New` fallback and warning status, treat required structure or selected write/reread failures as failed, preserve Team summaries/current schemas, and be idempotent on restart.

Changed surfaces: AgentOrg command qualification, WebSocket ACK ordering, Org history catalog/writer, client accepted-message invalidation and monotonic refresh, startup migration/classifier/evidence reader. Preserved critical surfaces: Team V2/Org V1, IR-028 routing/config, task/message routing, recovery, restart/Restore and shutdown.

## Existing Coverage Decisions

| Coverage | Decision | Rationale / required renewal |
| --- | --- | --- |
| nine new IR-029 server/web test files | Still Valid; rerun | direct/mounted/task qualification, first-write, ACK failure, refresh generation and migration matrix are boundary-direct but mostly isolated |
| IR-028 route/config cohorts | Still Valid; proportionately rerun | summary refresh changes shared history ownership |
| API-owned `runHistoryNavigationProjection.spec.ts` update | Still Valid; retain | reviewed stable mixed-history fixture; no new edit planned |
| API-REV-010 real provider/task/restart/recovery | Historical only | materially relevant paths will be renewed on the current artifact |
| live summary and migration evidence | Add temporary executable probes | real browser/API/process/filesystem boundary is not covered by component mocks |

No stale test is removed. No compatibility-only coverage is authorized.

## Environment And Fixture Plan

Use the current built server on owned port 8590, production renderer on 3590, an isolated copy of retained current Team/Org data plus fresh imported-package runs, and a real persistent AutoByteus `open_tab` Chromium tab. Provider execution uses Codex App Server / `gpt-5.6-sol`. The retained package at `api-e2e-fixtures/aorg-api-rev-002-agent-package` contains four Agents, two flat Teams and two AgentOrgs with explicit submit/review tools. Use a separately copied/mutated migration corpus so failure and ambiguity probes cannot affect the normal live run.

## Repository Plan And Broader-Validation Gate

Run exact preflight, focused new server/web tests, builds/guards, then retained task/stream/history/migration/routing cohorts. Repository evidence alone cannot prove no-reload same-row update, real accepted ACK ordering, real provider/task exclusions, same-data Stop/Restore, or application startup migration results. Broader validation is therefore **Required**.

Initial post-repository confidence is pending. Default Pass requires >=95% overall, every category >=90%, every critical criterion directly proven, no unresolved failure, and complete cleanup.

## Repository Execution Checkpoint

- REPO-001: Pass — exact artifact/source, instructions, owned resources, 18/18 package hashes and diff integrity.
- REPO-002: Pass — new server 6 files/28 tests; new web 3 files/58 tests; documented server build/bootstrap; guards/audit; Nuxt production build/prerender 16 routes.
- REPO-003: Pass — retained server 15 files/64 tests; retained web 27 files/196 tests.
- One initial direct `build:full` attempt bypassed the package `prebuild` shared-contract preparation after an interruption removed output. The documented `pnpm build` path rebuilt all shared contracts and passed; this is recorded as an API/E2E setup correction, not product failure.
- Post-repository confidence: **94.1%**. Strong owner-level and integration coverage exists, but live same-row refresh, real provider qualification, current-data migration, Stop/Restore preservation and application restart remain material.
- Broader validation remains **Required** using the planned real browser/API/provider/process/filesystem surfaces.

## API-REV-011 Broader-Execution Update

The required realistic execution ran on the exact reviewed artifact with the production-built server/renderer, persistent `open_tab` Chromium, real Codex App Server / `gpt-5.6-sol`, registered four-Agent/two-Team/two-Org fixture, GraphQL/WebSocket, filesystem/SQLite, and separately copied migration corpora.

- LIVE-001 Pass: fresh direct configured-Agent first message durably produced the exact same-row normalized/truncated summary without reload; later messages did not overwrite.
- LIVE-002 Pass: fresh mounted-Team configured-Agent parity, later-message stability, real delegate/submit task exclusion and exact durable sidecar.
- LIVE-003 partial Pass: whitespace/invalid exact target excluded; both real accepted A→B and B→A orders selected their first ACK winner.
- MIG-001/002 Pass: unique direct/mounted, existing, no-evidence, ambiguous, Team preservation, warning, idempotent restart and invalid-current `FAILED` outcomes.
- LIVE-003 **Fail / API-FIND-018**: deterministic isolated derived-index `EISDIR` was caught/logged by the AgentOrg handler and an accepted ACK was returned, but the same rejection escaped the shared atomic writer's stored `finally` promise, causing abnormal socket close `1006`, unavailable health and Node exit `1`. Reproduced twice with exact process evidence.
- LIVE-004 and the validation portion of LIVE-005 are Not Tested under the critical fail-fast rule; cleanup completed.

This evidence revises the new durable write-failure coverage decision: its handler-level assertion is necessary but insufficient to prove process-level rejection consumption. API/E2E adds no source test in a failing implementation round; Code Review should confirm origin before implementation rework and later durable regression coverage.

## Final Confidence And Reroute Decision

| Confidence category | Final |
| --- | ---: |
| Requirement and acceptance-criteria proof | 92% |
| Changed-boundary execution directness | 99% |
| Cross-boundary integration realism and mock gap | 99% |
| Environment/configuration/identity/fixture fidelity | 99% |
| Failure/edge/lifecycle/recovery evidence | 96% |
| User-surface/browser/desktop-shell confidence | 90% |
| Durable regression coverage quality/relevance | 95% |

Overall final confidence is **95.7%**. This is high confidence in a `Fail`, not a Pass: a critical DS-027/QR-011 failure-isolation criterion is contradicted by exact real-process evidence. Broader validation is complete only through fail-fast. Reroute is required to `/software_engineering_team/code_reviewer` for focused failure-origin review of `API-FIND-018`. Canonical details are in `api-e2e-execution-coverage-report.md` and `api-e2e-evidence/API-REV-011/live/metadata-failure-v2/API-FIND-018-accepted-summary-write-crashes-server.md`.

## API-REV-012 User-Requested Same-Artifact Recheck

The user requested a further local test to rule out transient server instability. Source and artifact remained exact and unchanged. A new isolated data copy and port 8696 were used.

- Intact control: **Pass** — normal startup, accepted ACK, exact durable summary, next GraphQL request HTTP 200.
- Exact derived-index failure: **Fail** — accepted ACK followed by caught/logged `EISDIR`, the same unhandled rejection, WebSocket close 1006, unavailable GraphQL and Node exit 1.
- Cleanup: complete; copied sensitive files absent, generated build outputs removed, port/process absent and index restored byte-identically.

The recheck raises final validation confidence in the failure from 95.7% to **96.6%**. `API-FIND-018` is confirmed for the third time and is not an ordinary startup or browser problem. The required route remains Code Reviewer focused failure-origin review; no source fix or design change was attempted by API/E2E.

## API-REV-013 IR-030 Coverage Investigation

- Authority: `RER-025 / AD-REV-016 / ARCH-REV-014 Pass / IR-030 / CRR-040 Pass`.
- Source/artifact: `d741874e9a35367d0c64b57a8e7e4cd15e0e93c5 / e3b3a840052cdb6cb8c552b3bf9d66ee233fc3bb`.
- Prior result: API-REV-012 Fail / 96.6%; `API-FIND-018` reproduced three times.
- Changed boundary: shared per-path atomic history writer Promise settlement and exact-owner cleanup. Public API/schema, handler, migration classifier, provider, frontend and persisted shapes are unchanged.
- Durable coverage decision: new writer regression and unchanged handler tests are Still Valid and must be rerun. Retained Agent/Team/Org history, migration, task, stream and web history/navigation tests remain valid. No API/E2E source edit is planned unless execution reveals a coverage-only gap.
- Broader validation: **Required**. Repository tests cannot prove process-level absence of `unhandledRejection`, server survival after the real derived-index failure, later same-path persistence, or complete held browser/provider/restart journeys.
- Live mode: exact built server, production renderer, persistent `open_tab` Chromium, isolated copied local data, registered 4-Agent/2-Team/2-Org package, real Codex App Server / `gpt-5.6-sol`, GraphQL/WebSocket/files/process correlation.
- Persisted-data decision remains Migration Required; run a proportionate real startup/idempotence/Team-preservation check because the migration shares the corrected writer.
- Fail-fast remains active for any critical current-artifact failure. Canonical case plan is `api-e2e-evidence/API-REV-013/execution-plan.md`.

### API-REV-013 Execution Update — Complete

- Repository evidence: documented server build Pass; corrected writer/handler `2 files / 11 tests`; affected cumulative server `14 / 54`; retained web `21 / 147`; production Nuxt build/prerender `16 routes`.
- `LIVE-003B / API-FIND-018`: **Resolved / Pass** on the exact real process. Accepted ACK remained truthful; the deterministic derived-index `EISDIR` was caught once; socket, GraphQL and Node stayed available; failed summary stayed empty; index restoration was byte-exact; a later write through the same path persisted; no unhandled/fatal marker occurred; SIGTERM exited 0.
- Held cumulative browser/provider scope: **Pass**. The actual AutoByteus `open_tab` production tab exercised stopped Team/Org history, Team↔Org switching, exact member Restore, direct/mounted locked config and Back, 390x844 strip/drawer focus, real Codex Team/Org continuation, mounted-Team same-task revision/resubmission/acceptance, active and stopped strict identity negatives, terminal Stop, same-data restart/Restore/post-restart continuation, and scoped two-family history-query recovery.
- Migration: **Pass**. The existing migration stayed `SUCCEEDED` at attempt 1; both Team and Org histories remained queryable and both physical indexes stayed SHA-identical.
- Cleanup: **Pass**. Owned tabs/processes/ports are absent; copied secrets/generated outputs were removed; fixture hashes pass `18/18`; exact source/artifact and diff integrity remain valid.
- Durable coverage decision after execution: no new repository-resident durable gap. No durable test was added, updated or removed by API/E2E in this round. Evidence-only probes remain under `api-e2e-evidence/API-REV-013/`.
- Post-repository confidence: `92.7%`. Final confidence after required real-process/browser/provider/lifecycle execution: **`98.4%`**; all categories are at least `95%` and every critical criterion is directly proven.
- Residual risk: the unchanged Electron shell itself was not relaunched and temporary browser probes are not a repository browser suite. Production renderer behavior, production builds and server lifecycle were directly exercised; this residual is non-material for the IR-030 server-writer change.
- Final broader-validation decision: **Required and completed**.
- Final result: **Pass**; no open API/E2E finding.
