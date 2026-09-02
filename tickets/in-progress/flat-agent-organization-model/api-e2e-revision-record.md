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
| API-REV-005 | Code Reviewer CRR-019 / integrated cumulative renewal | RER-021; AD-REV-011; ARCH-REV-009; IR-017; CRR-019; DR-001 integration recovery | Pass / 98.1% | Fail / 93.1% |
| API-REV-006 | Code Reviewer CRR-025 / cumulative IR-021 renewal | RER-023; AD-REV-012; ARCH-REV-010; IR-021; CRR-025 | Fail / 93.1% | Pass / 97.9% |
| API-REV-007 | Code Reviewer CRR-030 / localized cumulative IR-025 renewal | RER-023; AD-REV-012; ARCH-REV-010; IR-025; CRR-030 | Pass / 97.9% | Fail / 86.9% |
| API-REV-008 | Code Reviewer CRR-032 / browser-safe recovery and cumulative IR-026 renewal | RER-023; AD-REV-012; ARCH-REV-010; IR-026; CRR-032 | Fail / 86.9% | Pass / 98.4% |

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


### API-REV-005 — Integrated task-monitor renewal finds mounted-Team live projection failure

- Triggering role, report path, and round: Code Reviewer `CRR-019` cumulative
  integrated-source Pass; API/E2E round 6 at
  `api-e2e-execution-coverage-report.md`.
- Triggering scenario IDs: current artifact renewal `REPO-001`–`REPO-004` and
  `LIVE-001`–`LIVE-013`; latest-base task-monitor path; new `API-FIND-015`.
- Related revisions: `RER-021`; `AD-REV-011` with AD-REV-009/010 mechanism;
  `ARCH-REV-009 Pass`; `IR-017`; `CRR-019`; prior delivery conflict record
  `DR-001`; tested integrated artifact
  `b2c96d6b0eed5ffb3a0eaa503eb7f1cf353e9c9e`.
- Why recorded: API-REV-004 passed the pre-integration artifact. IR-017 merged
  latest-base task-Agent durability and monitor behavior into the flat AgentOrg
  package, so repository and real-system proof had to be renewed rather than
  inherited. The real mounted-Team task panel failed even though the same
  standalone Team path passed.
- Coverage decisions / durable paths changed: no repository-resident test or
  production path was changed by API/E2E in this round. Existing current tests
  remain valid but are insufficient to prove mounted-Team live task-panel
  convergence; a durable mounted scenario is a likely post-fix need, subject to
  focused origin review.
- Scenarios rechecked:
  - current server task/event/lifecycle/API/persistence/migration/negative/
    shutdown/MCP cohort: 31 files / 168 tests Pass;
  - current renderer task monitor/focus/hydration/activity and Team/Org cohort:
    41 files / 379 tests Pass;
  - production server build/bootstrap, web guards, 16-route Nuxt build and
    project-supported Chromium task probe 2/2 Pass;
  - real UI package import, standalone Team first prompt, exact selected task
    hydration/live updates, revision/resubmission/acceptance and settlement
    fallback Pass;
  - fresh mixed Org routing and durable mounted task lifecycle succeeded, but
    live selected Team task-panel convergence failed.
- Environment delta: isolated built backend on 8467, production renderer on
  3467, AutoByteus `open_tab`, UI-imported four-Agent/two-Team/two-Org package,
  real Codex App Server `gpt-5.6-sol` low, GraphQL/WebSocket/MCP/SQLite/files,
  provider traces, screenshots and direct SIGTERM cleanup.

#### Prior Failure Resolution

No unresolved API-REV-004 failure existed. Its `Pass / 98.1%` remains valid only
for the pre-integration artifact and is superseded as the current package result
by API-REV-005. Historical `API-FIND-008` remains Not Reproduced / invalidly
confounded with No Architecture Impact and was not reused as a failure basis.

- New finding: `API-FIND-015` — while a mounted research Team remained selected
  under an active AgentOrg, its task panel stayed `In progress` after the exact
  task durably submitted V1, received a revision and durably resubmitted V2.
  Focus-away/back hydrated the correct Awaiting review state. After durable
  acceptance and task-row settlement, the panel again remained Awaiting review
  until refocus. The standalone Team control advanced continuously in the same
  runtime.
- Preliminary classification: `Local Fix`, likely implementation-owned mounted
  event/projection application. Task lifecycle, provider/MCP, messages,
  persistence, notifications, task status and settlement succeeded; no design,
  LLM, policy, persistence or shutdown defect is inferred before focused review.
- Cumulative stop: `LIVE-005`–`LIVE-012` are Not Tested on the current artifact;
  `LIVE-013` completed only cleanup/immutability. No pass is inferred from
  API-REV-004 for those renewals.
- Cleanup: direct backend SIGTERM exited in 200 ms with `Server closed cleanly`
  and no AggregateError; web/backend stopped, owned ports closed, browser tabs
  were `[]`, fixture hashes passed 18/18, generated setup outputs were removed,
  and `git diff --check` passed.
- Canonical artifacts updated:
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-revision-record.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-005/live/test-case-ledger.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-005/`
- Prior result/confidence: `Pass / 98.1%`.
- Current result/confidence: `Fail / 93.1%`.
- New or remaining failure IDs: `API-FIND-015`.
- Recommended recipient: `/software_engineering_team/code_reviewer` for focused
  failure-origin review.
- Remaining untested current-artifact scope: active two-family snapshot, exact
  390x844 focus, planned active-root shutdown state, same-data restart/first
  history, Team continuation, Org restore/provider identity/continuation,
  explicit Stop Org, and live recovery/strict negatives. External definition
  publication and unchanged Electron-shell-only behavior remain bounded scope.


### API-REV-006 — Cumulative real package, Team, AgentOrg and lifecycle validation passes

- Triggering role, report path, and round: Code Reviewer `CRR-025` cumulative
  source Pass; API/E2E round 7 at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md`.
- Triggering scenarios: REPO-001–005 and LIVE-001–014; mandatory recheck of
  `API-FIND-015`; IR-021 exact-Agent runtime failure/Retry/default abandonment;
  all previously stopped current-artifact lifecycle scopes.
- Related revisions: `RER-023`; `AD-REV-012`; `ARCH-REV-010 Pass`; cumulative
  `IR-001–021`; `CRR-025 Pass`; tested source
  `ee6b793599d57cffed1ee0c900abbc07b552ac6b`; tested artifact
  `c969b480a2aaabf7ae68cd2b576110f2de513ad6`.
- Why recorded: API-REV-005 failed the integrated artifact at mounted-Team live
  task projection and stopped later current-artifact journeys. CR-FIND-022 and
  prior implementation findings were resolved and source-reviewed, requiring a
  full cumulative repository and real-system renewal rather than a delta probe.
- Coverage decisions / durable paths changed: none. Existing current coverage
  remained valid; API/E2E changed no repository test or production source.
- Repository execution: exact runtime/config/hierarchy 17 files / 119 tests;
  cumulative server 31 files / 168 tests; cumulative web 52 files / 467 tests;
  server/web production builds, Brief Studio pack/validate, two guards, Nuxt
  prerender of 16 routes, and the project Chromium task-monitor probe all Pass.
- Real execution: exact package import; desktop/narrow override UI; runtime
  failure/Retry/default/no-stale launch; root/Team/Agent admission; standalone
  Team and mounted-Team message/task revision/acceptance; two-family API;
  390x844 focus/status; clean active SIGTERM/restart; stopped Team continuation;
  whole-Org Restore with provider identity policy and byte-identical task
  sidecar; terminal Stop Org; strict identity negatives; recovery/migration;
  final immutability and cleanup all Pass.
- Environment: isolated built backend on 8487, production renderer on 3487,
  AutoByteus persistent Chromium `open_tab`, UI-imported 18-file four-Agent/
  two-Team/two-Org package, real Codex App Server `gpt-5.6-sol`, GraphQL,
  WebSocket, MCP, SQLite, filesystem and direct process lifecycle.

#### Prior Failure Resolution

| Prior finding | Previous classification | Current resolution | Evidence |
| --- | --- | --- | --- |
| `API-FIND-015` | implementation-owned mounted-Team selected-panel convergence failure | Resolved/not reproduced. With `/research-team` continuously selected, the same task panel advanced 0 -> V1 -> revision/V2 -> accepted Result 2 without focus-away/back; the durable sidecar and settlement fallback were exact. | `API-REV-006/live/mounted-team-observations.json`; `LIVE-007-mounted-team-v1-no-refocus.png`; `LIVE-007-mounted-team-v2-no-refocus.png`; `LIVE-007-mounted-team-accepted-no-refocus.png` |
| API-REV-005 stopped LIVE-005–012 scope | Not Tested on prior artifact | Fully executed in LIVE-005–013: admission, two families, responsive focus, shutdown/restart, Team continuation, Org Restore/identity/task/message, terminal Stop, recovery, strict negatives and migration all Pass. | `API-REV-006/live/test-case-ledger.md`; case-specific observation JSON/API/process evidence |

- Canonical artifacts updated:
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-revision-record.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-006/live/test-case-ledger.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-006/`
- Prior result/confidence: `Fail / 93.1%`.
- Current result/confidence: `Pass / 97.9%`.
- New or remaining failure IDs: `None`.
- Recommended recipient: `/software_engineering_team/code_reviewer` under the
  reviewed Large/High route; proportional test-code review is not applicable
  because this round changed no durable test code.
- Remaining bounded scope: separately owned external definition publication
  and unchanged Electron IPC/preload/window behavior. Both are outside the
  changed ticket boundary and do not block the Pass.

### API-REV-007 — Localized current artifact passes presentation/runtime but fails real-browser valid-ERROR recovery

- Triggering role/result: Code Reviewer `CRR-030` cumulative source Pass,
  93.4/100; renewed API/E2E required for IR-025.
- Authority: `RER-023`; `AD-REV-012`; `ARCH-REV-010 Pass`; cumulative
  `IR-001–025`; source `5300fd7ac3c6061dfd6e88feb69edd9931ef326e`;
  artifact `5bfc54c11ef82e4fec217c84dc66887965cf98ac`.
- Classification: `Large / High / reviewed`.
- Prior result: `API-REV-006 / Pass / 97.9%` on pre-localization IR-021.
- Why recorded: current normal locale presentation could not be inferred from
  the prior artifact. User-required real Team/Org/Codex/task/restart validation
  also renewed the cumulative critical path and exposed a production browser
  defect missed by durable fake-WebSocket coverage.
- Durable coverage/source changes by API/E2E: none.

#### Executed coverage

- REPO-001–004:
  - exact artifact/source/fixture/resource preflight Pass;
  - localization and audit cohort 17 files / 60 tests Pass;
  - both guards and zero-finding localization audit Pass;
  - production Nuxt build/prerender 16 routes Pass;
  - reviewed AppImage size/SHA exact;
  - retained server 15 files / 61 tests and web 20 files / 202 tests Pass.
- LIVE-001–003:
  - exact 18-entry package imported through Settings;
  - normal Simplified Chinese/English switching;
  - real Agent Team Create/Edit with both native selector groups exactly
    `团队智能体` / `Team Agents`;
  - real AgentOrg shared handoff source/destination groups including exact Team
    root destination;
  - exact user-authored names, canonical addresses and mixed-language When prose
    preserved by GraphQL;
  - desktop and 390x844 geometry/accessibility Pass.
- LIVE-004:
  - real Codex App Server / `gpt-5.6-sol` standalone Team first prompt;
  - whole Org direct-Agent and mounted-Team prompts;
  - mounted Team delegate -> task Agent `submit_task_result` -> coordinator
    `review_task_result` acceptance; exact durable task sidecar and settlement.
- LIVE-005 passing substeps:
  - active SIGTERM exited cleanly;
  - first same-data post-restart API history returned Team and Org inactive;
  - same-ID Org rematerialized with exact real-conversation identity/content;
  - system-only provider was correctly renewed;
  - accepted task sidecar remained byte-identical;
  - continued conversation returned exact marker;
  - normal Stop Org terminal configuration appeared.
- LIVE-006: fixture/source immutability and all owned process/tab/port cleanup Pass.

#### New finding

`API-FIND-016` — valid AgentOrg server ERROR cannot enter approved browser
recovery:

- A production Chromium reload of an inactive exact Org active URL received the
  correlated server frame `ERROR / AGENT_ORG_NOT_ACTIVE`.
- `AgentOrgStreamingService.failClosed` called
  `generation.socket.close(1002, 'Invalid AgentOrg stream')`.
- Chromium threw `InvalidAccessError` because a browser caller may locally close
  only with 1000 or 3000–4999; reserved protocol code 1002 is rejected.
- The call precedes `scheduleTransparentRecovery(detail)`, so no bounded retry
  or exhaustion notice ran and the page remained `Connecting to Agent Org…`.
- Reproduced twice; correlated frame/exception/close and screenshot retained.
- Preliminary classification: implementation-owned frontend Local Fix. No
  Requirement Gap, Design Impact, server/provider/fixture/persistence/migration
  origin, or speculative recovery redesign is inferred.
- Remaining live strict-address negative renewal: Not Tested after the critical
  failure; retained current repository coverage passed.

#### Artifacts / result

- Canonical artifacts:
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-test-case-ledger.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-revision-record.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-007/`
- Finding evidence:
  - `API-REV-007/live/API-FIND-016-valid-error-recovery-failure.md`
  - `API-REV-007/live/LIVE-005-stopped-root-correlated-reload-cdp.jsonl`
  - `API-REV-007/live/screenshots/LIVE-005-correlated-error-stuck-connecting.png`
- Prior result/confidence: `Pass / 97.9%`.
- Current result/confidence: **Fail / 86.9%**.
- New/remaining finding: `API-FIND-016`.
- Broader validation: Required and executed.
- Cleanup: complete; ports 8587/3587 closed, tabs `[]`, fixture 18/18, HEAD
  unchanged, `git diff --check` Pass.
- Recommended recipient: dynamic failure rule, expected
  `/software_engineering_team/code_reviewer` for focused failure-origin review.
- Delivery readiness: not claimed.


### API-REV-008 — Browser-safe recovery and cumulative real-system Pass

- Triggering role, report path, and round: Code Reviewer `CRR-032 / Pass`;
  API/E2E round 9 at `api-e2e-execution-coverage-report.md`.
- Triggering finding/scenario IDs: prior `API-FIND-016`; `REPO-001–003` and
  `LIVE-001–006`.
- Related revisions: `RER-023`; `AD-REV-012`; `ARCH-REV-010 / Pass`; cumulative
  `IR-001–026`; `CRR-032`; source
  `3199ba081ad450be72fba239fe86e76c0c697a33`; artifact
  `06a918c71fc192e0b4ed9c3ef6b4df7163aef530`.
- Why recorded: API-REV-007 directly found that production Chromium rejected
  client close code `1002` before automatic recovery could schedule. IR-026 and
  CRR-032 corrected and reviewed the exact ordering/code boundary. The Large/High
  cumulative package then required renewed real execution rather than inheriting
  the preceding artifact's material passes.
- Durable test/source paths changed by API/E2E: none. The implementation's
  reviewed service/spec pair was rerun; an evidence-only CDP observer was retained
  at `api-e2e-evidence/API-REV-008/live/LIVE-004-recovery-cdp-probe.mjs`.
- Coverage delta:
  - exact current recovery 5 files / 25 tests, native Chromium close-code probe,
    both web guards and zero-finding localization audit;
  - retained server 15 files / 61 tests and web 37 files / 263 tests;
  - production renderer build/prerender 16 routes and exact AppImage provenance;
  - actual `open_tab` package import, new Team and mixed Org creation, zh-CN/en
    handoff authoring and exact Unicode GraphQL persistence;
  - real Codex `gpt-5.6-sol` standalone Team and Org conversations, mounted-Team
    delegate/submit/review/accept task, live Team status and monitor fallback;
  - application SIGTERM, same-data restart, mixed history, Restore, provider
    identity semantics, task durability, three continuations and terminal Stop;
  - production-Chromium valid ERROR correlation and bounded exhaustion;
  - exact wrong-address/wrong-AgentRun negatives followed by valid context use,
    migration reconciliation and complete cleanup.
- Setup delta: a missing generated SDK prerequisite was built and the unchanged
  server cohort rerun. Short-lived processes reaped before product mutation were
  replaced by foreground owned PTYs. Both setup corrections and original logs
  are retained rather than hidden.

#### Prior Failure Resolution

| Prior failure | Previous classification | Current resolution | Evidence |
| --- | --- | --- | --- |
| `API-FIND-016` / LIVE-005 | implementation/frontend Local Fix; valid ERROR called reserved `close(1002)` before recovery scheduling, causing `InvalidAccessError` and permanent Connecting | **Resolved.** Real production Chromium saw six valid ERROR generations; every client close was legal code `4000`; no browser/runtime error or permanent Connecting occurred; exactly one notice remained after bounded exhaustion and there was no Reconnect control. Current direct success coverage proves complete verified replacement publication and notice clear. | `API-REV-008/live/LIVE-004-stopped-root-recovery-cdp.jsonl`; `LIVE-004-stopped-root-recovery-summary.json`; screenshot; `repository/web-recovery-focused.log`; `repository/browser-close-contract.log` |
| API-REV-007 strict current-address negative left Not Tested | execution stopped after the critical recovery failure | **Resolved / Pass.** Wrong address and wrong AgentRun each failed closed; immediately following exact projection and checkpoint succeeded. | `API-REV-008/live/LIVE-005-negative-and-migration-observations.json`; request/responses |

- Canonical artifacts updated:
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-test-case-ledger.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-revision-record.md`
  - `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-008/`
- Prior result/confidence: `Fail / 86.9%`.
- Current result/confidence: **Pass / 98.4%**.
- Broader validation: `Required and completed`.
- New or remaining finding IDs: `None`; `API-FIND-016` resolved.
- Recommended recipient: `/software_engineering_team/code_reviewer` for
  proportional test-code review. No durable test changed, so the changed-test
  review is expected to be recorded `Not Applicable`.
- Remaining bounded risk: the unchanged actual Electron shell was not launched;
  its exact AppImage provenance was verified. The live ERROR run selected bounded
  exhaustion, while direct current durable coverage proved the alternate complete
  snapshot publication branch. Neither is a material acceptance gap.
