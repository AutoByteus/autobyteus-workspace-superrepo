# API/E2E Revision Record

The latest `api-e2e-coverage-investigation.md` and
`api-e2e-execution-coverage-report.md` remain authoritative.

## Revision Index

| Revision ID | Triggering Role / Report / Round | Related Upstream Revision IDs | Prior Result / Confidence | Current Result / Confidence |
| --- | --- | --- | --- | --- |
| API-REV-001 | Code Reviewer `CRR-008` Pass / first completed API/E2E round | `RER-019` cumulative requirements; `AD-REV-006`; `ARCH-REV-004`; `IR-008`; `CRR-008` | N/A | `Fail / 81.3%` |
| API-REV-002 | Code Reviewer `CRR-011` Pass / cumulative real-system rerun | `RER-021`; `AD-REV-007`; `ARCH-REV-005`; `IR-011`; `CRR-011` | `Fail / 81.3%` | `Fail / 92.3%` |
| API-REV-003 | Code Reviewer CRR-013/014 / cumulative real-system rerun | RER-021; AD-REV-007 / ARCH-REV-005 at execution gate; IR-012; CRR-013/014 | Fail / 92.3% | Fail / 92.9% |
| API-REV-004 | Code Reviewer CRR-017 / cumulative real-system rerun | RER-021; AD-REV-011; ARCH-REV-009; IR-016; CRR-017 | Fail / 92.9% | Pass / 98.1% |

## Revision Entries

### API-REV-001 — Real AgentTeam/AgentOrg/Codex/browser baseline

- Triggering role, report path, and round: Code Reviewer `CRR-008` cumulative Pass at `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/code-review-report.md`; first completed API/E2E round.
- Triggering finding or scenario IDs: user-required complete `PKG-*`, `TEAM-*`, `ORG-*`, `RST-*`, `API-*`, `PERSIST-*`, `MIG-*`, `UI-*`, and `CLEAN-*` plan; previous source finding `CR-FIND-007` resolved before entry.
- Related architecture-design, architecture-review, implementation, code-review, or delivery revision IDs: `AD-REV-006`, `ARCH-REV-004`, `IR-008`, `CRR-008`; Delivery `N/A`.
- Why this baseline or coverage/execution revision was recorded: this is the first completed result after the earlier browser discovery stopped for `ADI-007` architecture recovery. It establishes authoritative repository plus real-system evidence across standalone Team and AgentOrg rather than inferring a prior result from the stopped attempt.
- Coverage decisions or durable test paths changed:
  - Updated `autobyteus-server-ts/tests/integration/agent-team-execution/team-run-service.integration.test.ts` from obsolete recursive Team assertions to current flat Team V2 and current admission/readiness composition.
  - Updated `autobyteus-server-ts/tests/integration/agent-team-execution/team-conversation-target-websocket.integration.test.ts` to provide the explicit isolated Org handler dependency while preserving exact Team targeting assertions.
  - Added/updated the retained real-user fixture README and detailed `TEST-MANIFEST.md`.
- Scenarios added, changed, removed, or rechecked: no scenario was removed. The baseline added real package import, standalone Team, AgentOrg, ordinary message routing, formal tasks, two-family GraphQL/persistence, route release, shutdown/restart/history/restore/continue, migration, desktop/narrow UI, and cleanup scenarios. Critical failures stopped selected later steps, which are recorded `Not Tested` rather than passed.
- Commands, environment, fixture, or broader-validation delta: executed contract packages, focused/cumulative server and web suites, server/web/application builds, then an isolated built backend and production Nuxt bundle on owned ports with the retained package, AutoByteus Chromium `open_tab`, real Codex App Server, `gpt-5.6-sol`, low reasoning, same-data server restart, strict GraphQL/filesystem capture, and owned-resource cleanup.

#### Prior Failure Resolution

No prior completed API/E2E failure applies. The earlier stopped discovery's
architecture finding `ADI-007` was rechecked and is resolved: the current Org
uses accepted Agent/Team event monitor/composer surfaces, has no raw protocol
cards, scopes mounted Team controls correctly, and places Stop Org on the
history root.

- Canonical artifacts and sections updated:
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-revision-record.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-001/resumed-crr008/`
- Prior result and confidence: `N/A`
- Current result and confidence: `Fail / 81.3%`
- New or remaining failure IDs:
  - `API-FIND-001` — Brief Studio validator/package build lacks the current AgentOrg directory composition.
  - `API-FIND-002` — corrected after `CRR-009`: stale test used obsolete `owner.teamIdentity` and retired root expectation; current `collaborationIdentity`/discriminated-root test passes `1/1`, with production admission unchanged.
  - `API-FIND-003` — corrected after user query: fixture omitted `agent-config.json` and task lifecycle `toolNames`; formal task transitions are `Not Tested`, and this is an API/E2E-owned fixture validity issue rather than an implementation defect.
  - `API-FIND-004` — corrected after `CRR-009`: graceful shutdown makes the Org inactive, so stale-stream Reconnect correctly fails closed; the supported path is Refresh history -> inactive row -> explicit Restore. Only Restore remains failed under `API-FIND-005` / `CR-FIND-009`.
  - `API-FIND-005` — clean Org restore fails for a never-messaged idle member because its persisted Codex thread has no rollout.
  - `API-FIND-006` — successful Org launch does not expose/expand the new active history tree without manual multi-level expansion.
  - `API-FIND-007` — user clarified that each mounted Team row inside an Org must retain its aggregate status indicator from the original Team tree; current implementation and approved prototype omit it.
- Recommended recipient: `/software_engineering_team/code_reviewer` for focused failure-origin review; dynamic handoff rules remain authoritative.
- Remaining risks, blocked evidence, or untested scope: corrected-fixture Team/Org formal submission, fresh task-Team, and formal revision/acceptance; live create/edit and all controlled invalid-admission/degraded-startup cohorts; every nontrivial separate process migration cohort; and true `390x844` browser execution. These were stopped after critical failures and are not inferred from durable coverage.


#### Post-Result Factual Correction — Task Tool Configuration And Team Status

- The user asked whether the API/E2E Agents had actually been configured with
  `submit_task_result`. Audit proved they had not: the fixture had no
  `agent-config.json`, while automatic member exposure adds only handoff,
  message, and delegation tools. `API-FIND-003` is therefore corrected from a
  claimed production defect to an API/E2E-owned invalid fixture / Not Tested
  result. This correction does not create `API-REV-002` because no new execution
  round has completed.
- The user also supplied original-branch visual evidence that a Team row has an
  aggregate status dot in addition to its child Agent dots, and explicitly
  requires that affordance on mounted Team rows inside AgentOrg. The current
  production screenshot lacks it, and the approved prototype/spec did not make
  it explicit. This is recorded as `API-FIND-007` for Product/architecture
  incorporation.
- Evidence: `api-e2e-evidence/API-REV-001/resumed-crr008/api/post-run-task-tool-fixture-audit.md`, user screenshot `ctx_8cd213e66142__image.png`, and current screenshot `ORG-005-direct-agent-conversation.png`.


#### CRR-009 API/E2E-Owned Correction Delta (No API-REV-002 Yet)

- Trigger: Code Reviewer `CRR-009 / Fail — mixed origin`.
- Updated durable test:
  `autobyteus-server-ts/tests/integration/application-backend/brief-studio-agent-tool-mcp.integration.test.ts`.
  It now supplies `owner.collaborationIdentity` and asserts the current
  discriminated root identity. Focused result: `1 file / 1 test passed`.
- Prepared but did not execute
  `api-e2e-fixtures/aorg-api-rev-002-agent-package`; all four Agents explicitly
  request `submit_task_result` and `review_task_result`, and `PACKAGE.sha256`
  verifies.
- Corrected `API-FIND-004` and the browser transcript to require Refresh ->
  inactive row -> explicit Restore, not automatic reactivation through
  Reconnect. The observed fail-closed Reconnect is expected; `CR-FIND-009`
  remains the independent supported Restore failure.
- No `API-REV-002` entry is created because no new completed validation round
  occurred. Cumulative rerun is gated on implementation source re-review and
  `RER-020` Product/architecture permission. All stopped scopes remain
  `Not Tested`.


### API-REV-002 — Corrected package, real Team/Org tasks, restore, status, and narrow browser

- Triggering role, report path, and round: Code Reviewer `CRR-011 / Pass` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/code-review-report.md`;
  third investigation / second completed result.
- Triggering finding/scenario IDs: cumulative `PKG-*`, `ADM-*`, `AUTH-*`,
  `TEAM-*`, `ORG-*`, `RESTORE-*`, `RST-*`, `API-*`, `PERSIST-*`, `MIG-*`,
  `STATUS-*`, `UI-*`, `APP-*`, and `CLEAN-001`, with prior
  `API-FIND-001`–`API-FIND-007` rechecked first.
- Related revisions: `RER-021`, `AD-REV-007`, `ARCH-REV-005`, IR-009–011, and
  `CRR-011`; Delivery `N/A`.
- Why recorded: source review cleared the cumulative package and the user
  required a profound real-user rerun across standalone Team and AgentOrg,
  explicit task tools, real Codex, shutdown/restart/history/restore/continue,
  and desktop/narrow browser behavior.
- Coverage decisions/durable paths changed:
  - updated `autobyteus-server-ts/tests/integration/agent-team-execution/team-run-service.integration.test.ts` to current flat Team V2 and current admission/readiness;
  - updated `autobyteus-server-ts/tests/integration/agent-team-execution/team-conversation-target-websocket.integration.test.ts` for explicit two-family WebSocket composition;
  - updated `autobyteus-server-ts/tests/integration/application-backend/brief-studio-agent-tool-mcp.integration.test.ts` to strict `collaborationIdentity`/discriminated root;
  - added and executed `api-e2e-fixtures/aorg-api-rev-002-agent-package/` with four Agents, two Teams, two Orgs, explicit task tools, manifest, and hashes.
- Commands/environment delta: exact server `9/34`, cumulative server `60/239`,
  cumulative web `32/234`, server typecheck-build/build, web build, Brief Studio
  pack, then isolated built backend/production Nuxt, UI package import, real
  Codex App Server `gpt-5.6-sol` low, real GraphQL/WebSockets/files, same-data
  restart, strict provider-tree comparison, desktop and 390x844 Chromium, and
  cleanup.

#### Prior Failure Resolution

| Prior finding | Current resolution | Evidence |
| --- | --- | --- |
| `API-FIND-001` Brief Studio composition | Resolved; real pack succeeds. | `API-REV-002/repository/brief-studio-build.log` |
| `API-FIND-002` stale MCP test identity | Resolved by API-owned strict harness update; no production relaxation. | exact `34/34` log and changed test |
| `API-FIND-003` invalid task fixture | Resolved; all possible Agents explicitly expose submit/review tools; real tasks submit/accept. | `PKG-005-agent-task-tools.png`, task records |
| `API-FIND-004` wrong restart expectation | Resolved; Refresh -> inactive row -> Restore executed. | `RESTORE-001-inactive-row-after-restart.png` |
| `API-FIND-005` idle provider Restore | Resolved; durable new system-only binding and whole-Org activation; conversed binding/content retained. | strict before/after Org trees |
| `API-FIND-006` active history hierarchy | Resolved at desktop; exact focus executed. | browser transcript/screenshots |
| `API-FIND-007` mounted-Team status | Resolved expanded, collapsed-running, and stopped/offline. | `STATUS-001`–`003` screenshots |

- Canonical artifacts updated:
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-revision-record.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/`
- Prior result/confidence: `Fail / 81.3%`
- Current result/confidence: `Fail / 92.3%`
- Findings at completion, including later factual dispositions:
  - `API-FIND-008`: withdrawn after Architecture classification. The original
    observation mixed in an invalid separate task whose assignee was told to
    review its own result. The isolated supported revision/resubmit completed
    end to end and supported direct shutdown exited 0. Final status:
    `Not Reproduced / invalidly confounded validation evidence`; `No
    Architecture Impact`; no production-owner attribution.
  - `API-FIND-009`: inactive standalone Team lazy restore succeeds but drops the
    triggering user input; immediate retry works.
  - `API-FIND-010`: normal Stop Org leaves the selected main pane indefinitely
    `Connecting to Agent Org...` while history is inactive/Restore.
  - `API-FIND-011`: withdrawn after `CRR-012 / CR-FIND-014`. API/E2E used the wrong narrow interaction; the approved visible strip -> transient drawer -> Org history tree path was not activated. Correct result: `Not Tested`, with no implementation/design attribution.
- Recommended recipient: `/software_engineering_team/code_reviewer` for the mixed-origin package and acknowledgement of the API/E2E factual correction.
- Remaining untested scope: live Org task-Agent and Org task revision/reference
  variants not completed in the cumulative run; live server-owned create/edit
  hidden-field journey; destructive live corrupt-binding copies; distinct
  OS-process repeats for every migration variant; external definition
  publication; Electron shell. Repository coverage is recorded separately and
  no direct live pass is inferred.


#### CRR-012 Factual Correction — Narrow Collapsed Navigation (No New API Revision)

- `CR-FIND-014` is accepted as an API/E2E-owned Local Fix. The retained narrow
  screenshot contains the approved accessible primary-navigation strip. At
  390x844 its buttons open the transient left drawer, and the active AgentOrg
  route mounts `AgentOrgRunHistoryPanel` there.
- API-REV-002 checked the focused-member header and `New Agent` plus while the
  drawer was closed; it did not exercise strip -> drawer -> Org tree. The former
  `API-FIND-011` implementation/design attribution is withdrawn.
- Correct result: `UI-002` exact narrow focus switching is `Not Tested`; no
  dedicated member picker is required. The next permitted cumulative rerun must
  activate the strip, open the drawer, and select an exact different Agent and
  Team through the Org history tree.
- API-REV-002 remains `Fail / 92.3%` because `API-FIND-009/010` are confirmed as
  implementation-owned `CR-FIND-012/013`; at this CRR-012 checkpoint,
  `API-FIND-008` remained Unclear. The later Architecture Final Disposition
  below supersedes that interim state. No new execution occurred, so no
  `API-REV-003` entry is created.

#### Architecture Evidence Probe — `API-FIND-008` Correlated Non-Reproduction (No New API Revision)

- Architecture Designer requested one evidence-only same-task revision/
  resubmission rerun with provider, MCP, task queue, persistence, notification,
  and shutdown correlation. This was not a cumulative API/E2E validation round,
  so `API-REV-002 / Fail / 92.3%` remains authoritative and no `API-REV-003`
  entry is created.
- Exact source: detached artifact HEAD
  `895665929213ddf7c276c9a89af19b975935f128`; observation-only instrumentation
  compiled and built cleanly and was removed after execution.
- Exact task `task_3110f35c97b54ee3b3ae8fddb0f6103e` received a revision and
  successfully resubmitted on the same fresh task AgentRun. The second call
  reached MCP ingress, entered and started the root queue, durably committed,
  published, notified the delegator, returned HTTP `200`, and produced a
  provider tool-success result. The retained task sidecar contains both
  submission records and the intervening review.
- A valid direct `SIGTERM` shutdown after same-data restart/Restore completed all
  supervisor phases and exited `0`; no AggregateError/error tree existed. The
  earlier PTY pipeline Ctrl-C bypassed the application shutdown handler and is
  excluded. Restore's later `interrupted` task transition is retained separately
  and did not occur during second-submit commit.
- Factual disposition: `API-FIND-008` was not reproduced in one fully correlated
  rerun. This does not explain the retained API-REV-002 stall, assign an owner,
  or justify recovery machinery; Architecture retains classification ownership.
- Canonical evidence:
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/followup-api-find008/correlated-rerun-observed-boundaries.md`.

#### Architecture Follow-Up — Exact Confounding Settlement Reproduction (No New API Revision)

- Architecture identified the original run's separate accepted verifier task as
  a confound: its task-assignee prompt incorrectly instructed that assignee to
  review its own result. A second observation-only probe reproduced the exact
  two-task shape while retaining the clean same-task success above as control.
- The verifier submitted, then its same provider turn emitted the invalid self
  `review_task_result` and remained `waitingOnApproval`. Lead acceptance of the
  verifier task durably committed. Terminal settlement became root FIFO head
  and blocked in provider-turn termination preparation; no backend termination,
  MCP-session deactivation, durable settlement, teardown completion, or head
  release followed.
- The analyst's supported same-task revised `submit_task_result` reached MCP
  ingress, executor, exact Team capability, materialization gate, root task
  engine, and FIFO admission. It did not start because the verifier settlement
  remained head, so analyst persistence did not begin and its durable sidecar
  stayed unchanged for more than 178 seconds.
- Direct `SIGTERM` hung in supervisor `agent_team_runs` for more than 60 seconds
  and required `SIGKILL`. It emitted no AggregateError because the phase never
  rejected; this distinguishes an unresolved close from a separate captured
  provider teardown error.
- At this evidence checkpoint the factual disposition remained
  `Unclear`/Architecture-held. This probe narrowed the boundary without
  assigning implementation/design origin or prescribing recovery machinery;
  the later Architecture Final Disposition below supersedes the interim state.
  API-REV-002 remains `Fail / 92.3%`; no `API-REV-003` is created.
- Canonical evidence:
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/followup-api-find008-settlement/settlement-correlation-observed-boundaries.md`.

#### Architecture Final Disposition — No Architecture Impact (No New API Revision)

- Architecture classified `API-FIND-008` as a confounded, non-reproduced
  API/E2E validation finding. It establishes no Requirement Gap, Design Impact,
  implementation source defect, or shutdown-design defect.
- Controlling supported-flow evidence: the same task Agent received
  `request_revision`, resubmitted through provider -> exact MCP ingress -> root
  FIFO -> durable sidecar -> in-memory/event -> delegator notification ->
  provider success in about 14 ms. After supported Restore, direct `SIGTERM`
  completed ordered Org -> Team -> Agent shutdown and exited `0` with no
  AggregateError.
- The exact two-task follow-up proves only the confound: the invalid second task
  kept its provider turn live with an unauthorized self-review while terminal
  settlement occupied the root FIFO. Its blocked shutdown is not attributable
  to the supported same-task revision path.
- Final corrected status: `API-FIND-008 = Not Reproduced / invalidly confounded
  validation evidence`; `No Architecture Impact`; no production owner. Future
  recurrence requires a clean supported scenario with retained provider/MCP/
  queue/commit and nested-shutdown correlation.
- `AD-REV-007` and `ARCH-REV-005` remain authoritative; no design artifact or
  architecture revision changed. API-REV-002 remains `Fail / 92.3%` because
  implementation-owned `API-FIND-009/010` (`CR-FIND-012/013`) remain and narrow
  supported focus is still `Not Tested`. No `API-REV-003` is created.
- Consolidated disposition evidence:
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/api-find008-final-disposition.md`.

### API-REV-003 — Cumulative real Team/Org/Codex/restart validation

- Triggering role, report path, and round: Code Reviewer CRR-013 cumulative
  source Pass and CRR-014 held-origin clearance; API/E2E round 4 at
  api-e2e-execution-coverage-report.md.
- Triggering finding/scenario IDs: prior API-FIND-009/010 and CR-FIND-014
  rechecks; cumulative PKG, TEAM, ORG, RST, API, PERSIST, MIG, UI and CLEAN
  scenarios; new API-FIND-012/013.
- Related revisions: RER-021; execution began against then-authoritative
  AD-REV-007 / ARCH-REV-005; IR-012 source
  3e38be96596432df8e3f459056d908786b5371bd; CRR-013/014; tested artifact
  73a2c06eb14e3c5a7d91322aae7f42dbc4de0e0a.
- Why recorded: this is the completed cumulative real-system rerun requested by
  the user, including a UI-imported deterministic package, standalone Team and
  mounted-Team-under-Org tasks, ordinary messages, real Codex gpt-5.6-sol,
  desktop/narrow UI, real process restart, history, restore, continuation, and
  cleanup. It supersedes API-REV-002 as the current API result.
- Coverage changes:
  - updated team-run-service.integration.test.ts from obsolete recursive Team
    setup to current flat Team V2 and current admission/readiness composition;
  - updated team-conversation-target-websocket.integration.test.ts for the
    current registration signature;
  - updated agent-team-run-manager.integration.test.ts for the current staged
    no-conversation binding result;
  - updated brief-studio-agent-tool-mcp.integration.test.ts for strict
    collaborationIdentity and discriminated root;
  - updated brief-studio-team-config.integration.test.ts for exact
    llmConfig:null serialization;
  - no durable test file or production source was removed/changed.
- Repository evidence: exact server 4 files / 16 tests; focused web 5 / 77;
  corrected stale-harness server 3 / 25; current cumulative server 61 / 270;
  current cumulative web 38 / 281; server build, corrected production web build
  with 16 routes, Brief Studio pack, and pre/post fixture hashes all pass.
- Broader environment: built backend 8437, production Nuxt 3437, isolated data,
  AutoByteus Chromium open_tab, real Codex App Server, gpt-5.6-sol low,
  390x844 narrow pass, application-owned SIGTERM and same-data restart.
- Setup/harness deviations are excluded and retained in
  API-REV-003/live/setup-isolation-note.md and the canonical reports.

#### Prior Failure Resolution

| Prior finding | Prior classification | Current resolution | Evidence |
| --- | --- | --- | --- |
| API-FIND-008 | Not Reproduced / invalidly confounded; No Architecture Impact at CRR-014 gate | Not used as a failure basis. The new API-FIND-012 is a different clean one-task supported mounted-Team case. | API-REV-002 disposition plus API-FIND-012 correlation |
| API-FIND-009 | Implementation Team inactive restore/send ordering | Resolved. One unique inactive first prompt was admitted and answered without retry. | TEAM-INACTIVE-FIRST-PROMPT.png; browser transcript |
| API-FIND-010 | Implementation Org route/context release | Resolved. Stop Org changed to configuration, with no Connecting/Reconnect state. | NARROW-STOP-ORG-CONFIGURATION-390x844.png |
| CR-FIND-014 / withdrawn API-FIND-011 | API/E2E used wrong narrow interaction | Resolved. Exact 390x844 strip -> drawer -> Org tree selected direct Agent, Team coordinator, and nested Agent with no overflow. | NARROW-ORG-DRAWER-VERIFIER-390x844.png; NARROW-ORG-VERIFIER-FOCUS-390x844.png |

- Material successful scenarios:
  - UI package import and explicit lifecycle tools;
  - standalone Team first prompt, ordinary message, same-task revision and
    acceptance;
  - corrected inactive Team first input;
  - Org no-focus, exact direct/Team/nested focus, mounted message, status;
  - browser reload and real-process Org Restore with exact task/history and
    continued conversation;
  - corrected narrow focus and terminal Stop Org;
  - final clean shutdown and source immutability.
- New/remaining failures:
  - API-FIND-012: one supported mounted-Team task durably submitted, revised,
    resubmitted and was accepted; the legitimate task Agent then completed its
    required handoff, after which settlement rejected its exact AgentRun/member
    identity and fail-stopped root task persistence authority. Preliminary
    classification Unclear, likely implementation runtime identity/settlement.
  - API-FIND-013: after same-data restart, both standalone Team V2 packages,
    Team index rows and generic root history remained, but workspaceRunHistory
    returned no Team definitions and the UI exposed no inactive row to Restore.
    Preliminary classification Unclear, likely Team history projection/read
    model/startup.
- Current result/confidence: Fail / 92.9%. This confidence expresses high
  certainty in the evidence and Fail outcome, not release readiness.
- Canonical artifacts:
  - api-e2e-coverage-investigation.md
  - api-e2e-execution-coverage-report.md
  - api-e2e-revision-record.md
  - api-e2e-evidence/API-REV-003/
- Post-execution upstream note: workspace HEAD later advanced to cd75bcdb through
  architecture documents only; production source is unchanged. AD-REV-009 is
  not implemented or independently passed. See post-execution-head-audit.log.
- Recommended recipient: /software_engineering_team/code_reviewer for focused
  failure-origin review of API-FIND-012 and API-FIND-013.
- Remaining/untested scope: full live Org authoring/hidden-field journey,
  destructive binding corruption, direct-Agents-only Org live rerun, every
  migration case as a separate process, external publication, and Electron
  shell. No delivery readiness is claimed.


### API-REV-004 — Cumulative real Team/Org/Codex/restart Pass

- Triggering role, report path, and round: Code Reviewer `CRR-017` cumulative
  source Pass; API/E2E round 5 at `api-e2e-execution-coverage-report.md`.
- Triggering scenario IDs: prior `API-FIND-012` mounted-Team settlement and
  `API-FIND-013` first mixed post-restart history; cumulative repository,
  package, Team, Org, task/message, stream recovery, identity, migration,
  browser, responsive, Stop and cleanup scenarios `LIVE-001`–`LIVE-012`.
- Related revisions: `RER-021`; `AD-REV-011` (AD-REV-009/010 mechanism);
  `ARCH-REV-009 Pass`; `IR-016` source
  `394fc27f896dac4121ef166cc0972b60e8b89ce4`; `CRR-017`; tested artifact
  `b19c41e68c119f9a9590c5b04839454dae5f64b8`.
- Why recorded: this completed cumulative real-system rerun renews the current
  package from repository checks through a UI-imported deterministic package,
  real Codex standalone Team and mounted-Team tasks, two-family API/persistence,
  clean shutdown/restart/history/continuation, provider identity, responsive
  focus/status, explicit Stop Org and cleanup.
- Coverage changes:
  - updated
    `autobyteus-server-ts/tests/integration/agent-team-execution/agent-team-run-manager.integration.test.ts`
    so the API-owned frozen termination fake implements the current root fence
    and staged no-conversation binding contract;
  - retained the four other current API-owned Team/Brief Studio integration
    changes from earlier API revisions;
  - retained and re-hashed the four-Agent/two-Team/two-Org UI-import fixture;
  - no production source or test file was removed.
- Repository delta: corrected affected server cohort `3 files / 16 tests`;
  authoritative server `29 / 163`; exact web `18 / 163`; exact recovery service
  `1 / 13`; production server build/bootstrap, application SDK builds, Brief
  Studio pack, web guards, web production build/prerender of 16 routes and diff
  check passed. The accidental broad Nuxt command passed `440 files / 2444
  tests`; its sole failure is the pre-documented unrelated fixed-px audit.
- Environment delta: isolated ports 8457/3457 and data, `env -i` backend,
  production renderer, AutoByteus Chromium `open_tab`, real Codex App Server
  `gpt-5.6-sol` low, UI import, exact filesystem/API/DOM/process evidence,
  desktop and 390x844, and two direct SIGTERMs.

#### Prior Failure Resolution

| Prior finding | Previous classification | Current resolution | Evidence |
| --- | --- | --- | --- |
| `API-FIND-012` | supported mounted-Team terminal settlement identity failure | Resolved. One exact-address task durably submitted, received one revision, resubmitted on the same task, was accepted and terminally settled; Org remained usable. | `API-REV-004/live/persistence/org-task-record-before-restart.json`; `org-tree-before-restart.json`; mounted-task screenshot |
| `API-FIND-013` | first post-restart Team workspace history missing | Resolved. The first same-data query before browser open returned exact inactive Team and Org roots, Team definition/run and Offline members. | `API-REV-004/live/api/first-post-restart-mixed-history-*` |
| `CR-FIND-014` / withdrawn `API-FIND-011` | API/E2E used wrong narrow interaction | Resolved. Exact 390x844 primary strip -> drawer -> AgentOrg tree selected mounted Team, nested Agent and direct Agent with no overflow. | `NARROW-ORG-*.png`; `process/cdp-narrow-390x844.log` |
| `API-FIND-008` historical | Not Reproduced / invalidly confounded; No Architecture Impact | Not used as a failure basis; clean supported task revision/settlement and both direct shutdowns succeeded. | retained Architecture disposition plus current LIVE-002/003/006/012 |

- Material successful scenarios:
  - imported current package with explicit task tools and immutable sources;
  - standalone Team first prompt, ordinary message, same-task revision/acceptance;
  - AgentOrg no-focus launch, exact direct/Team/nested focus, message routing,
    mounted task settlement and collapsed Team status;
  - active-root SIGTERM, isolated same-data restart, first mixed history read;
  - stopped Team exact first continuation on the same TeamRun;
  - stopped Org terminal history, selection-driven whole-Org restore, exact
    provider-identity policy, byte-identical task sidecar and continuation;
  - exact 390x844 drawer focus, root-only Stop terminal configuration, private
    automatic ERROR recovery authority and final clean shutdown.
- Setup correction: a prematurely suspected `API-FIND-014` was caused by an
  invalid inherited environment (`DATABASE_URL` and package roots overrode the
  owned `.env`). The canonical `env -i` rerun loaded 54 Agents / 2 Teams after
  restart and completed Team/Org continuation. It is retained only under
  excluded setup evidence and is not a product finding.
- Canonical artifacts:
  - `api-e2e-coverage-investigation.md`
  - `api-e2e-execution-coverage-report.md`
  - `api-e2e-revision-record.md`
  - `api-e2e-evidence/API-REV-004/`, including `live/test-case-ledger.md`
- Prior result/confidence: `Fail / 92.9%`.
- Current result/confidence: `Pass / 98.1%`.
- New or remaining failure IDs: `None`.
- Recommended recipient: `/software_engineering_team/code_reviewer` for
  proportional review of the five cumulative API-owned durable test changes.
- Remaining bounded scope: separately owned external definition publication,
  unchanged Electron shell, and destructive corrupt-live-copy injection. Strict
  durable negatives, target admission, production renderer and actual lifecycle
  boundaries are current; these do not block the Pass.
