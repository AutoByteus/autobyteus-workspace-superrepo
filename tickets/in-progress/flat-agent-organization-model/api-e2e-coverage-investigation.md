# API/E2E Coverage Investigation — AORG-FLAT-TEAM-001

## Investigation Meta

- Authority: `RER-026`; cumulative `AD-REV-018 / DS-028`; `ARCH-REV-016 / Pass`; `IR-032`; `CRR-044 / Pass`; focused failure-origin review `CRR-045`.
- Current source/artifact: `8f9f9ce3f7f4ab9312813de8faf5b651578a7310` / `43ef19f2de69b2c16133577dac40471f75ebd913`.
- Current API/E2E revision / round: `API-REV-016` / 17.
- Prior authority: `API-REV-015 / Fail / 92.0%`; `API-FIND-021` was classified by CRR-045 as an API/E2E execution/runtime Local Fix requiring same-artifact correlated rerun.
- Classification: `Large / High / Reviewed`; successful route is Code Review with proportional review required for any durable test change.
- Canonical ledger: `api-e2e-test-case-ledger.md`; plan: `api-e2e-evidence/API-REV-016/execution-plan.md`.
- Latest authoritative investigation: `API-REV-016 CRR-045 Correlated Runtime Rerun — Complete / Pass`; earlier sections preserve revision history only.

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


### Post-API-REV-013 User Verification — API-FIND-019 (Historical Trigger)

The user tested the latest Delivery-built Electron application and supplied direct Team-versus-Org screenshots. Standalone AgentTeam exposes inbound/outbound cross-Agent messages in the selected member experience and the right-side `Team > Messages` ledger. AgentOrg shows successful `send_message_to` delivery/reply on the sender but lacks the corresponding target-member event-monitor visibility and any root communication/messages tab. API-REV-013 did not assert these two observables.

- Coverage status: newly identified critical gap; the clean ticket-level Pass/readiness implication is withdrawn pending disposition.
- Preliminary classification: `Unclear / likely Design Impact or Requirement Gap`.
- Routed as explicitly requested to `/software_engineering_team/architecture_designer`.
- Evidence: `api-e2e-evidence/API-REV-013/post-pass-user-discovery/API-FIND-019-agentorg-communication-visibility-gap.md` and the four attached user screenshots.
- The approved RER-026/AD-REV-018/IR-031 correction returned for the completed API-REV-014 renewal below.

## API-REV-014 IR-031 Coverage Investigation — Complete / Fail

- Authority: `RER-026 / AD-REV-018 (DS-028) / ARCH-REV-016 Pass / IR-031 / CRR-042 Pass`.
- Source/artifact: `f519a2093c98f265df9ea958bb5be15d6a5b2494 / 3656220d2f7a1551aa54d8e7e9d3eb8d767b96f6`.
- Prior result: API-REV-013 historically passed its IR-030 executed scope at 98.4%, but the user's later Electron comparison opened critical `API-FIND-019`; that missing scenario cannot inherit the prior pass.
- Classification/route: `Large / High / reviewed`; a completed Pass returns to Code Reviewer for proportional test-code review, while a Fail returns for focused failure-origin review.
- Canonical plan: `api-e2e-evidence/API-REV-014/execution-plan.md`; the canonical ledger is mandatory and will be updated after every case/checkpoint.

### Requirement And Boundary Mapping

`REQ-034 / AC-029 / SCN-018 / QR-012 / DEC-021` requires one accepted, durable same-Org configured-to-configured message to create exactly one configured receiver `MEMBER_INPUT_MESSAGE` and truthful selected-Agent `sent`/`received` Messages perspectives across the complete Org. The four required configured placement directions are direct->direct, direct->mounted, mounted->direct, and mounted Team A->mounted Team B. Exact counterpart addresses, content, committed time, parent message identity and reference context must agree. New messages update the selected view without refocus and reproduce through reconnect/checkpoint/Stop/restart/Restore without omission or duplication. An unrelated selected Agent sees no row.

Every task-involved endpoint pair is intentionally excluded only from the new configured-member presentation: configured->task, task->configured, task->task and `task_team_member` variants must preserve exact-ID delivery, one Org durable sidecar/root event, but add neither a configured receiver center event nor a configured Messages row. Rejected, failed, self, out-of-root and pre-durable sends likewise create no optimistic presentation. The existing Org sidecar remains the sole authority; there is no new schema or migration.

Changed surfaces are the server post-durable configured-pair presentation consequence, current execution-kind classification for both endpoint IDs, complete-root web perspective construction, stable active context facets, shared collaboration Messages UI, right-side tabs/strip, reference viewer, mobile/narrow layout, and Agent/Team workspace adapters. Preserved surfaces include standalone Team Messages/tasks, Team V2/Org V1 persistence, task lifecycle, strict identity, streaming recovery, history, Stop/Restore, migration and shutdown.

### Existing Coverage Decisions

| Coverage | Decision | Rationale / renewal |
| --- | --- | --- |
| `agent-org-communication-presentation.test.ts` | Still Valid; rerun | Directly covers durable-before-publish ordering, exact correlation, both-endpoint task exclusions and fail-stop behavior, but not the real provider/browser boundary. |
| IR-031 web communication/right-tab/workspace tests | Still Valid; rerun | Covers complete-root perspectives, reactivity, shared UI, reference and narrow semantics with constructed contexts. |
| standalone Team communication tests | Still Valid; rerun | Proves refactor did not regress the established behavior used as parity authority. |
| API-REV-013 browser/provider/process evidence | Historical only | It did not assert REQ-034 and targets IR-030. A proportionate cumulative critical subset must run on IR-031. |
| live all-direction configured/task/reconnect/restore proof | Add temporary executable probes | No repository suite crosses imported package -> real Codex/MCP -> durable sidecar -> socket -> production browser for this matrix. |

No stale coverage is removed and no compatibility-only coverage is authorized. No API/E2E-owned durable test edit is initially planned; a durable gap discovered during execution will be recorded and handled narrowly.

### Environment And Broader-Validation Decision

Use the exact reviewed built server on owned port 8594, production renderer on 3594, an isolated copied SQLite/data directory, normal UI package import from `api-e2e-fixtures/aorg-api-rev-002-agent-package`, and an actual AutoByteus `open_tab`. Attach browser automation only to that persistent tab. Use real Codex App Server / `gpt-5.6-sol`, Agent Tools MCP, GraphQL/WebSocket and durable sidecars. Create distinct reference files within the selected run workspace. Use a separate copied corpus/port 8700 for migration or controlled failure probes.

Broader validation is **Required** before repository execution: mocked/unit/render evidence cannot prove real provider dispatch, durable identity correlation, exact-once receiver presentation, live no-refocus behavior, or restart/Restore equivalence. The initial confidence score is pending. Pass requires >=95% overall, no category below 90%, direct proof of every critical acceptance criterion, and complete cleanup.

### API-REV-014 Repository Execution Checkpoint

- `REPO-001`: Pass — exact source/artifact ancestry, instructions, owned resource availability, 18/18 package hashes, four Agents/two Teams/two Orgs and clean diff check.
- `REPO-002`: Pass — server communication/presentation matrix 3 files/19 tests; web complete-root/shared UI/live-context matrix 14/96; documented server build/bootstrap; both web guards and zero-finding localization audit; production Nuxt build/prerender 16 routes.
- `REPO-003`: Pass — retained server 14/54 and retained web 21/147 across task lifecycle, stream/recovery, history writers/catalogs, migration, launch/config, workspace and navigation.
- Command setup: the non-interactive shell omitted the installed Corepack shim. The first test command exited before Vitest and the first build command exited before building. Adding the already-installed shim directory to PATH made the unmodified documented commands pass; no source/dependency change was made.
- Post-repository confidence: **93.1%**. Owner-level durable coverage and builds are strong, but real imported-package provider/MCP delivery, browser exact-once receiver presentation, all four placement directions, task exclusions and restart/Restore equivalence remain material.
- Broader validation remains **Required** using the planned isolated real process, production browser and Codex surfaces.

### API-REV-014 Real Execution Update — Fail

The required broader validation used the exact built server with isolated SQLite/data/workspace roots, the production renderer, an actual AutoByteus `open_tab`, normal UI package import, real Codex App Server / `gpt-5.6-sol`, Agent Tools MCP, GraphQL/WebSocket, and durable sidecars.

- `LIVE-001`: **Pass** — direct-to-direct configured messaging committed once, updated the selected sender live without refocus, produced exactly one receiver center input and truthful sent/received rows, and opened exact reference content.
- `LIVE-002`: **Pass** — direct-to-mounted, mounted-to-direct and mounted-to-mounted cross-Team configured directions all committed and presented exactly once with exact AgentRun IDs/full addresses/references. An unrelated configured Agent showed zero rows/input. Together with LIVE-001, all four configured placement directions passed.
- `LIVE-003` before task-Team activation: **Pass** for configured-to-task, task-to-configured and task-to-task exact-ID delivery plus exclusion from configured receiver center/Messages. Two task Agents stayed durably active.
- `LIVE-003 / API-FIND-020`: **Fail** after the supported configured member delegated to `/support-team`. The task Team was durably active and its coordinator returned the exact ready marker, but the current strict AgentOrg snapshot duplicated both task-Team member status records. Five supported automatic-recovery WebSockets each returned `CONNECTED` then `AGENT_ORG_STREAM_UNAVAILABLE` for the same two duplicate AgentRun IDs. No complete snapshot published; all visible statuses became/stayed offline, the browser retained only two of three durable tasks, and the task Team was absent.
- The server stayed reachable with zero correlated browser HTTP/page/console errors. Direct SIGTERM later completed cleanly, so the observed defect is current snapshot/status projection rather than a process crash or shutdown failure.
- `LIVE-004`, `LIVE-005`, `LIVE-006`, and `MIG-001`: **Not Tested — fail-fast** on IR-031. Prior revision passes remain historical evidence only.
- `CLEAN-001`: **Pass** — browser tab, renderer, server, ports and owned processes are closed; copied secrets and generated shared outputs are absent; package hashes pass 18/18; source ancestry and `git diff --check` pass.

The retained durable suites did not expose this composition failure even though the realistic task-Team scenario is an approved cumulative path. Future regression coverage must directly exercise a task Team delegated by a configured member inside a mounted Team and assert that every leaf AgentRun contributes exactly one status to the owning Org snapshot.

### Final Confidence And Reroute Decision

| Confidence category | Post-repository | Final |
| --- | ---: | ---: |
| Requirement and acceptance-criteria proof | 92% | 82% |
| Changed-boundary execution directness | 95% | 98% |
| Cross-boundary integration realism and mock gap | 94% | 98% |
| Environment/configuration/identity/fixture fidelity | 93% | 93% |
| Failure/edge/lifecycle/recovery evidence | 90% | 65% |
| User-surface/browser/desktop-shell confidence | 91% | 78% |
| Durable regression coverage quality/relevance | 97% | 95% |

Overall post-repository confidence was **93.1%**. Overall final ticket-wide validation confidence is **87.0%** (simple average). The failure itself is directly and deterministically proven, but a critical cumulative stream/task-Team path fails and the later responsive, restart/Restore, migration and retained runtime cases stopped under fail-fast. The 95% clean target is not met and applicable categories remain below 90%.

Broader validation was **Required and partially executed; stopped by critical failure**. `API-FIND-020` is preliminarily a server implementation `Local Fix`, subject to Code Review failure-origin confirmation. The completed API-REV-014 result must return to `/software_engineering_team/code_reviewer`; no delivery readiness is claimed.

## API-REV-015 IR-032 Coverage Investigation — Complete / Fail

- Authority: `RER-026 / AD-REV-018 / ARCH-REV-016 Pass / IR-032 / CRR-044 Pass`.
- Source/artifact: `8f9f9ce3f7f4ab9312813de8faf5b651578a7310 / 43ef19f2de69b2c16133577dac40471f75ebd913`.
- Prior result: `API-REV-014 / Fail / 87.0%`; `API-FIND-020` was classified implementation-owned and is source-resolved by IR-032/CRR-044.
- Changed boundary: AgentOrg current status snapshot structural-root selection only. Flat Team directory lookup/routing/settlement/shutdown, recursive Team status ownership, strict DTO, recovery, persistence/API/schema/migration and IR-031 communication presentation remain unchanged.
- Existing coverage: the new production-shaped `agent-org-status-snapshot-traversal.test.ts` and exact strict stream/recursive/shutdown tests are `Still Valid; rerun`. Cumulative task/history/migration/communication/web coverage is `Still Valid; proportionately rerun`. API-REV-014 configured-direction and direct task-exclusion evidence is historical and must not stand in for current-artifact reconnect/restore/narrow or fixed task-Team proof.
- Durable coverage decision: no API/E2E test edit is initially planned. If real execution exposes a missing durable composition, record it before any test change.
- Broader validation: **Required**. Repository tests cannot prove real Codex delegation, current snapshot uniqueness through the built server, task-Team visibility/reselect, settlement/removal, real shutdown, or current-artifact browser reconnect/restore/narrow behavior.
- Environment: exact built server on 8596/37877, production renderer 3596, isolated copied data/workspace, normal UI package import, actual AutoByteus `open_tab`, real Codex App Server / `gpt-5.6-sol`, GraphQL/WebSocket/filesystem sidecars. Auxiliary migration port 8702.
- Canonical plan: `api-e2e-evidence/API-REV-015/execution-plan.md`; ledger updates are mandatory after every case/checkpoint.
- Pass gate: >=95% overall, no category below 90%, all critical criteria directly proven, no unresolved failure and complete cleanup.

### API-REV-015 Repository And Real-System Results

- `REPO-001`: **Pass** — exact source/artifact ancestry, current instructions, clear owned resources, `18/18` package hashes and diff integrity.
- `REPO-002`: **Pass** — exact structural status, strict stream, recursive routing and termination cohort passed `4 files / 19 tests`; the documented server production build/bootstrap passed.
- `REPO-003`: **Pass** — cumulative server cohort passed `16 / 71`; current IR-031 communication web cohort passed `14 / 96`; retained web cohort passed `21 / 147`; both guards, the zero-finding localization audit and the Nuxt production build/prerender of 16 routes passed.
- `LIVE-001`: **Pass** — a mounted configured Agent delegated a real Codex task Team; the durable task Team appeared without refocus and the exact-root current snapshot contained one complete unique status set through reselect/recovery.
- `LIVE-002`: **Pass** — root-hosted and recursively nested task Teams appeared exactly once; supported deepest-first submission/acceptance reduced the current snapshot `11 -> 8 -> 6` while retaining durable task lineage.
- `LIVE-003`: **Pass** — wrong address, AgentRun and root identities failed closed; exact controls remained healthy; whole-Org Stop froze the complete owned scope with terminal history and later application shutdown succeeded.
- `LIVE-004`: **Pass** — all four configured communication directions, exact references, receiver-center and sent/received perspectives, task exclusion, live no-refocus updates, byte-identical Stop/restart/Restore persistence and a real post-Restore Codex continuation passed.
- `LIVE-005`: **Pass** — the actual `open_tab` Chromium journey at `390x844` used the supported Agent Orgs strip -> unified drawer -> exact Org/member path; one message/reference and the restored continuation were accessible without overflow or browser error.
- `LIVE-006`: **Fail / API-FIND-021** — a clean standalone Team task Agent with explicit `submit_task_result` access emitted exactly one real provider tool call, but it never returned or durably entered `awaiting_review`; after more than six minutes the task stayed `active` with no updates while GraphQL remained reachable. Normal Team termination then interrupted the task, and only afterward a late provider completion was rejected as `CODEX_SEGMENT_TURN_INACTIVE`.
- `MIG-001`: **Pass, proportionate** — the repository migration cohort plus corrected same-data startup showed all 24 migrations current with none pending and current Team/Org sidecars readable. No new destructive migration matrix was needed for unchanged IR-032 migration code.
- `CLEAN-001`: **Pass** — both roots stopped, direct SIGTERM exited 0, the actual tab and renderer closed, owned ports/processes cleared, copied secrets/generated prerequisites were removed, and fixture/source/diff/shared-environment integrity passed.

The first restart attempt inherited global database/package-root variables. It was stopped immediately before browser/API/run action; the corrected clean-environment restart targeted only the owned copied data. This is retained as an execution correction rather than product evidence.

### Coverage Decision Changed By Execution

The repository task tests remain valid but did not detect the clean real-provider standalone-Team submission stall. Because exact MCP-ingress and root task-queue correlation was not instrumented, `API-FIND-021` is preliminarily **Unclear** within provider dispatch -> Agent Tools MCP -> Team task queue/persistence. API/E2E adds no speculative durable test or implementation change in a failing round. Code Reviewer must perform focused failure-origin review and decide the correct durable regression boundary.

Standalone Team acceptance/completion and its post-settlement process restart/Restore continuation are **Not Tested** after the critical failure. No historical round is inferred for those held steps.

### Final Confidence And Reroute Decision

| Confidence category | Final |
| --- | ---: |
| Requirement and acceptance-criteria proof | 85% |
| Changed-boundary execution directness | 99% |
| Cross-boundary integration realism and mock gap | 99% |
| Environment/configuration/identity/fixture fidelity | 96% |
| Failure/edge/lifecycle/recovery evidence | 85% |
| User-surface/browser/desktop-shell confidence | 90% |
| Durable regression coverage quality/relevance | 90% |

Overall final confidence is **92.0%** by simple average. The score records broad, direct evidence but cannot override the failed supported standalone-Team task lifecycle. Broader validation was **Required and substantially executed through fail-fast**. The authoritative result is **Fail** and the package must route to `/software_engineering_team/code_reviewer` for focused origin review of `API-FIND-021`. No repository-resident durable test was added, updated or removed by API/E2E.

## API-REV-016 CRR-045 Correlated Runtime Rerun — Complete / Pass

- Trigger: `CRR-045 / Fail — API/E2E execution/runtime Local Fix`; no implementation source defect is established.
- Authority/source/artifact remain exact: `RER-026 / AD-REV-018 / ARCH-REV-016 / IR-032`; `8f9f9ce3f7f4ab9312813de8faf5b651578a7310 / 43ef19f2de69b2c16133577dac40471f75ebd913`.
- Prior result: `API-REV-015 / Fail / 92.0%`; the provider `TOOL_EXECUTION_STARTED` event did not prove local MCP ingress.
- Coverage decision: source and durable tests remain unchanged and valid. Add an evidence-only passive Node Inspector correlation probe plus standard HTTP access logging; no timeout, retry, replay, source or build-artifact mutation is authorized.
- Required path: one fresh standalone Team task, initial submit, one request_revision, same-task resubmit, acceptance/settlement, then Stop/SIGTERM/same-data restart/inactive-row Restore and real continuation.
- Boundary evidence required: provider item start -> MCP HTTP ingress/session/JSON-RPC ID -> dispatcher/executor -> task adapter/root FIFO admission/start -> durable commit/publication/notification -> route/HTTP result -> provider completion.
- Broader validation: **Required** because this is a runtime-only recheck and held real lifecycle continuation. Plan: `api-e2e-evidence/API-REV-016/execution-plan.md`.

### API-REV-016 Repository And Real-System Results

- `REPO-001`: **Pass** — exact unchanged artifact/source ancestry, 18/18 fixture hashes, owned-resource isolation, passive Inspector controller syntax, shared runtime prerequisites and diff integrity passed. All seven observed production `dist` files remained byte-identical after execution.
- `LIVE-006`: **Pass** — a fresh normal standalone Team using Codex App Server / `gpt-5.6-sol` delegated one valid task to `/analyst`. The initial `submit_task_result` crossed provider item start -> exact local MCP HTTP ingress/session/request -> dispatcher/executor/adapter -> idle Team root FIFO -> durable `active -> awaiting_review` commit -> notification -> HTTP 200 -> provider success in 12.17 ms. One revision request then durably returned the same task to active; the same task Agent resubmitted through the same complete chain in 9 ms; the delegator accepted it through the FIFO and durable sidecar before settlement. Browser state updated live without refocus and retained each lifecycle record exactly once.
- `LIVE-006R`: **Pass** — normal Team termination preserved accepted task/tree bytes; application SIGTERM logged clean shutdown; exact same-data startup reported no pending migration. With the original provider home restored, normal inactive first-send restored the same TeamRun, preserved the real-conversation lead AgentRun/provider thread and prior content, retained allowed fresh provider IDs for system-instruction-only members, did not revive the settled task Agent, and returned the exact continuation marker.
- `CLEAN-001`: **Pass** — restored Team stopped; server, renderer, Inspector, actual `open_tab`, ports and owned processes closed; copied secrets and generated shared prerequisites removed; fixture/source/dist/shared-environment integrity passed; other-owner PID 48 was preserved.

The initial Inspector launch installed passive breakpoints but did not resume the debugger and executed no product code. The first restart used `HOME=/home/autobyteus` while the original Codex rollout lives under `/root/.codex`; the first-send failed before prompt commit and durable bytes did not change. Both are retained as transparent API/E2E environment corrections and were corrected before the applicable product assertion.

### Prior Failure Resolution And Coverage Decision

`API-FIND-021` is **Not Reproduced / resolved for validation**. API-REV-015 proved only provider-side item start, not local MCP ingress. The unchanged-artifact rerun proved two successful submit calls end-to-end, including the exact local ingress, Team FIFO admission, durable commits, HTTP results and provider completion, then completed the formerly held review/acceptance/restart/Restore path. No product/source owner is assigned to the historical runtime-only observation. No timeout, retry, replay, queue, recovery or lifecycle change is justified.

No repository-resident durable test was added, updated or removed. The passive Inspector/logpoint controller and browser captures are evidence-only because the required question was whether a sporadic real provider item reached the local runtime boundary; existing reviewed durable task lifecycle coverage remains valid.

### Final Confidence And Route Decision

| Confidence category | Post-repository | Final |
| --- | ---: | ---: |
| Requirement and acceptance-criteria proof | 94% | 98% |
| Changed-boundary execution directness | 95% | 100% |
| Cross-boundary integration realism and mock gap | 94% | 100% |
| Environment/configuration/identity/fixture fidelity | 96% | 97% |
| Failure/edge/lifecycle/recovery evidence | 92% | 97% |
| User-surface/browser/desktop-shell confidence | 92% | 96% |
| Durable regression coverage quality/relevance | 96% | 95% |

Overall post-repository confidence remains **94.1%** from API-REV-015's exact unchanged-artifact repository run. Overall final confidence is **97.6%** by simple average. Every critical criterion is directly proven, no category is below 90%, no finding remains, and the 95% clean target is met.

Broader validation was **Required and completed** using the built server, production renderer, actual AutoByteus `open_tab`, real Codex/MCP, GraphQL/WebSocket, durable files and process lifecycle. The result is **Pass**. The reviewed route must return through the recipient selected by dynamic handoff rules; proportional test-code review is expected to be `Not Applicable` because API/E2E changed no repository-resident test.
