# Code Review Report

## Review Round Meta

- Review Entry Point: `API/E2E Failure-Origin Review`
- Requirements Doc Reviewed As Context: `requirements-doc.md` (`RER-020`; prior runtime behavior remains cumulative `RER-018`, Product baseline provenance `RER-019`)
- Investigation Notes Reviewed As Context: `investigation-notes.md`
- Requirements Revision Record Reviewed As Context: `requirements-revision-record.md` through `RER-020`
- Design Spec Reviewed As Context: `design-spec.md` (`AD-REV-006`) only where an API failure depended on an existing lifecycle or identity contract
- Supplemental Task Artifacts Reviewed As Context: `agent-org-contract.md`; approved Product `RV-012` / `VIS-001`–`VIS-020`; `BASELINE-PROMOTION-001`; corrected task-fixture audit and user/current Team-status screenshots
- Architecture Design Revision Record Reviewed As Context: `architecture-design-revision-record.md`
- Relevant Architecture Design Revision IDs: `AD-REV-006`; `API-FIND-007` is later than this design
- Design Review Report Reviewed As Context: `design-review-report.md`
- Architecture Review Revision Record Reviewed As Context: `architecture-review-revision-record.md`
- Relevant Architecture Review Revision IDs: `ARCH-REV-004 / Pass`; no review yet covers `RER-020`
- Implementation Handoff Reviewed As Context: `implementation-handoff.md`
- Implementation Revision Record Reviewed As Context: `implementation-revision-record.md`
- Relevant Implementation Revision IDs: `IR-008` cumulative implementation
- Code Review Revision Record: `code-review-revision-record.md`
- Current Code Review Revision ID: `CRR-009`
- Current Review Round: `9`
- Trigger: corrected `API-REV-001 / Fail / 81.3%` after `CRR-008 / Pass`
- Prior Review Round Reviewed: `CRR-008 / Pass — ready for API/E2E`
- Latest Authoritative Round: `CRR-009`
- Coverage Investigation Reviewed: `api-e2e-coverage-investigation.md`
- Execution Coverage Report Reviewed: `api-e2e-execution-coverage-report.md`
- API/E2E Revision Record Reviewed: `api-e2e-revision-record.md`
- Relevant API/E2E Revision IDs: `API-REV-001`
- Delivery Revision Record / IDs: `N/A — pending`
- Failing Scenario IDs: `APP-001`, `APP-002`, `ORG-010`, `RST-002`, `RST-005`–`RST-007`, `UI-001`; `TEAM-004/005` and `ORG-005`–`ORG-007` are corrected to `Not Tested`
- Exact Failing Commands / Execution Mode: cumulative server Vitest execution (`99 files / 584 passed, 2 files / 2 failed`); real `pnpm build` / `autobyteus-app pack` in `applications/brief-studio`; built isolated backend and production Nuxt bundle with real Codex App Server, graceful shutdown/same-data restart, history/reconnect/restore, and production Chromium
- Failure Evidence Paths: `api-e2e-evidence/API-REV-001/resumed-crr008/repository/server-cumulative-changed.log`; `repository/brief-studio-build.log`; `live/restart-failure-excerpts.log`; `live/browser-journey-transcript.md`; `api/post-run-task-tool-fixture-audit.md`; screenshots `RST-002-org-fail-closed.png`, `RST-007-org-restore-provider-failure.png`, and `ORG-005-direct-agent-conversation.png`; user screenshot `ctx_8cd213e66142__image.png`

## Routing Classification Review

- Task size: `Large`
- Architectural risk: `High`
- Selected route: `API/E2E Failure-Origin Review`
- Independent source review required by the classification: `Failure-origin exception after reviewed source`
- Classification evidence or correction required: The Large/High classification remains correct. This round is intentionally focused: it classifies the seven reported API findings without repeating the `CRR-008` full source audit or scorecard.

## Review Scope

- Changed implementation and behavior reviewed: only the smallest production/test/evidence paths needed to classify `API-FIND-001`–`API-FIND-007`.
- Files / areas reviewed:
  - standalone application-package validation and bundle-backed Agent/Team definition providers;
  - Agent Tools MCP owner identity, production activation callers, and the failing Brief Studio integration harness;
  - retained task fixture, automatic collaboration-tool exposure, task traces, and the post-run fixture audit;
  - process shutdown, active-only Org checkpoint recovery, history refresh, and explicit Org restore paths;
  - Codex thread create/restore behavior plus the persisted idle-member tree/trace;
  - AgentOrg launch, history expansion, focus, and Team-row rendering;
  - current `RER-020` / `REQ-028` / `AC-023` status requirement and both visual witnesses.
- Explicit exclusions: no full implementation scorecard, changed-source size audit, legacy audit, or successful-test-code review is repeated. API/E2E remains failed, so its two durable test edits are not proportionally reviewed here. No implementation or test fix was made by Code Review.

## Upstream Behavior And Production-Path Basis Confirmation

- Approved requirements basis understood: Yes. `AC-002`, `AC-009`–`AC-011`, and `AC-021`–`AC-022` govern the relevant launch/focus, restore, task, and packaged-definition behavior. `RER-020` now separately approves the Team-row aggregate semantics as `REQ-028` / `AC-023`, while holding Product/architecture re-entry.
- Design-spec behavior map verified against the relevant implementation paths: Yes for the pre-`RER-020` identity, restore, shutdown, hydration, focus, and history contracts. No design artifact yet covers `RER-020`.
- Design review report and round confirmed: `ARCH-REV-004 / Pass` for `AD-REV-006` only.
- Behavior-basis status: `Confirmed`, with one later approved requirement impact pending its Product/architecture route.
- Changed or newly discovered behavior: `BEH-011` / `REQ-028` / `AC-023` were added by Requirements Engineering in `RER-020` after the user's `API-FIND-007` clarification.
- Remaining material ambiguity: None for the seven origin classifications. Product visual authority and architecture impact for `RER-020` remain deliberately pending rather than being invented in this review.

| Behavior / Contract ID | Current Status | Current Implementation Path And Lifecycle Evidence | Contradicting Or Newly Discovered Supported Behavior Evidence |
| --- | --- | --- | --- |
| `AC-021/022` packaged definition admission | `Contradicted` | The real Brief Studio pack enters `validateStandaloneApplicationPackage`, whose read-only config lacks the Org directory method now required by the Agent/Team providers. | Real application build fails before packaging. |
| exact collaboration-member MCP identity (`AC-003/010`, current session contract) | `Confirmed` | Production Codex/Claude activation callers pass `collaborationIdentity`; the session service correctly rejects an absent/mismatched identity. | The failing integration passes obsolete `teamIdentity`; this contradicts the test harness, not production behavior. |
| `AC-010` formal task lifecycle | `Unclear — Not Tested by API-REV-001` | Fresh task runs were created, but the imported Agents had no configured submission/review tools. | Corrected fixture audit proves the original implementation attribution was invalid. |
| `AC-009` persist/restore | `Contradicted in explicit restore; not contradicted by stale Reconnect` | Controlled shutdown makes the old root inactive. The supported path is refreshed history followed by explicit Restore; the live Restore path then fails for an idle Codex member. | No approved behavior requires a stale pre-shutdown active-context `Reconnect` action to reactivate an inactive root. |
| `AC-002/011` post-launch exact focus | `Contradicted` | Launch refreshes history and routes active, but the already-mounted history panel initializes expansion only once on mount. | Two real launches required manual workspace → Org → run expansion before exact focus was exposed. |
| `REQ-028` / `AC-023` mounted-Team aggregate status | `Newly approved in RER-020; implementation pending` | Current Team rows render chevron/icon/name without an aggregate status; Agent rows retain dots. | User original-tree screenshot plus current production screenshot established the omission; `RER-020` now owns the semantic correction and Product gate. |

## Supported Product Scenario And Reachability Gate (Mandatory)

| Scenario ID | Related Behavior / Contract IDs | Kind | Actor / Initiator | Coherent Goal Or Governing Event | Supported Entry Surface / Event | Scenario Shape | Forward Production Path / Lifecycle | Expected Outcome / Consequence | Independent Evidence | Scenario Validity | Review Use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-SCN-013` | `AC-021/022`; application package contract | `Operational` | Application author/release build | Validate and pack shipped Brief Studio against current definition providers | `pnpm build` / `autobyteus-app pack` | `Normal` | pack → standalone validator → bundle-backed providers → package artifact | Build completes or reports a real package defect, not an incomplete host double | application package/scripts, requirements, real build log | `Supported Normal Scenario` | `Use` |
| `CR-SCN-014` | `AC-003/010`; Agent Tools MCP identity contract | `Contract` | Collaboration member runtime | Expose tools only under the exact owning root/member/run identity | production backend bootstrap | `Normal` | member context → session activation → strict identity check → tool capability | exact identity admitted; mismatch rejected | current session service and Codex/Claude callers | `Supported Normal Scenario` | `Use` |
| `CR-SCN-015` | `REQ-015`; `AC-010` | `User` | Configured task delegator/assignee | Complete formal task submission and review with configured lifecycle tools | `delegate_task`, `submit_task_result`, `review_task_result` | `Normal` | configured tools → fresh run → submit → review/settle | formal durable transitions occur | approved task behavior and tool contracts | `Supported Normal Scenario` | `Investigate` — API fixture did not reach it |
| `CR-SCN-016A` | `REQ-014`; `AC-009`; `DS-015/018/019` | `Operational` / `User` | Graceful process restart, then user | Reopen persisted work after the prior active root has been stopped | server stop/restart; history Refresh; inactive-row Restore | `Normal` | shutdown stops roots → restart reads history inactive → explicit Restore → hydrate active context | persisted Org restores or returns an exact restore failure | requirements, design lifecycle, current history/restore surfaces | `Supported Normal Scenario` | `Use` |
| `CR-SCN-016B` | none beyond a callable button | `User` | User on stale pre-shutdown route | Make `Reconnect` silently reactivate a root stopped by process shutdown | old active workspace's stream recovery action | `Explicit Edge` claimed by API report | stale context → active-only checkpoint query | proposed automatic reactivation | only the downstream button/error and failed query; no independent requirement | `Technically Possible but Unsupported/Contrived` | `Reject` |
| `CR-SCN-017` | `REQ-014`; `AC-009`; `SCN-002` | `User` | User of a cleanly stopped Org | Restore the entire persisted full-scope Org, including a member never messaged | inactive Org history `Restore` | `Normal` | GraphQL restore → Org manager/materialization → Agent backend restore → Codex thread restore | every member restores atomically with identities/content; no partial root | requirements, explicit Restore UI, real provider evidence | `Supported Normal Scenario` | `Use` |
| `CR-SCN-018` | `REQ-004`; `AC-002/011`; approved workspace UI | `User` | User who just launched an Org | Select an exact member immediately from the active sidebar | configuration `Run Agent Org` | `Normal` | launch → history refresh → active route → visible expanded run tree → exact focus | active hierarchy is discoverable without unrelated manual expansion | requirements/Product and two real browser launches | `Supported Normal Scenario` | `Use` |
| `CR-SCN-019` | `REQ-028`; `AC-023`; `SCN-012` | `User` | User inspecting mounted Team state | See Team aggregate status while retaining exact Agent statuses | active/stopped Org hierarchy, expanded or collapsed Team | `Normal` | exact Agent status projection → presentation-only Team fold → accessible Team-row indicator | truthful five-state aggregate without Team-root lifecycle | `RER-020`, user/current screenshots | `Supported Normal Scenario` | `Use` — upstream recovery only |

### Candidate Finding And Mechanism Gate

| Candidate ID | Observation Or Mechanism | Scenario / Contract ID | Independent Trigger | Forward Path / Lifecycle / Consequence | Evidence | Disposition | Reason / Proportionate Response |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-CAND-011` | The validator's `AppConfig` double omits `getAgentOrgsDir` after shared definition providers began scanning Org roots. | `CR-SCN-013` | ordinary shipped application pack | validator creates incomplete host config → provider call throws → no package | validator `:14-18`, Agent provider `:101-103`, Team provider `:60-68`, real build log | `Promote` | Bounded production packaging defect; complete the current provider composition and cover the real pack path. |
| `CR-CAND-012` | Strict MCP owner identity is broken in production. | `CR-SCN-014` | production collaboration-member bootstrap | production callers pass exact `collaborationIdentity`; only the integration supplies obsolete `teamIdentity` | session service `:81-108`, Codex bootstrapper `:307-314`, failing test `:334-350` | `Reject` | Production is correct and fail-closed. Correct the stale test harness; do not weaken identity admission. |
| `CR-CAND-013` | Missing formal task submission proves a runtime task-tool defect. | `CR-SCN-015` | intended configured task lifecycle | fixture lacks `agent-config.json` / lifecycle tools, so intended path never begins | post-run fixture audit and retained package | `Reject` | Correct the fixture and rerun; implementation behavior remains `Not Tested`. |
| `CR-CAND-014` | An inactive Org must be reactivated by the stale workspace `Reconnect` action after process restart. | `CR-SCN-016B` | old active route after controlled shutdown | active-only checkpoint correctly reports root absent; later history refresh reports inactive | requirements/design, transcript, restart log | `Reject` | No independent contract supports this reactivation shortcut. API/E2E must use Refresh → inactive-row Restore and correct the report. |
| `CR-CAND-015` | Explicit Org Restore cannot restore an idle never-messaged Codex member. | `CR-SCN-017` | ordinary history Restore | stored non-null thread ID → unconditional `thread/resume` → Codex `no rollout found` → whole Org remains inactive | persisted tree/trace, restore log, service/manager and Codex thread manager | `Promote` | Critical supported restore failure. Fix within existing provider/Agent restore ownership without broad error fallback or weakened atomicity. |
| `CR-CAND-016` | A newly launched Org remains hidden in collapsed history because expansion is initialized only on panel mount. | `CR-SCN-018` | normal config → launch transition | launch refreshes history and routes active; mounted panel has no route/history expansion watch; user must manually expand three levels | config panel `:88`, run store `:32-40`, history panel `:82-117`, browser transcript | `Promote` | Bounded reactive UI lifecycle correction and transition regression. |
| `CR-CAND-017` | Mounted Team row has no aggregate status. | `CR-SCN-019` | ordinary hierarchy inspection | Team row renders no status while Agent rows do; source cannot satisfy newly approved fold/accessibility semantics | history panel `:57-64`, screenshots, `RER-020` | `Promote` | This was an upstream Product/requirement omission at API time. `RER-020` now defines behavior, but Product evidence and architecture impact must complete before source work. |

## Focused Failure-Origin Analysis

| API Finding | Confirmed Origin | Source / Execution Evidence | Prior-Review Accountability | Classification / Owner |
| --- | --- | --- | --- | --- |
| `API-FIND-001` | Production implementation/packaging defect | `createReadOnlyDefinitionConfig` has Agents/Teams/additional roots only, while ticket-changed Agent/Team providers call `getAgentOrgsDir`; the real Brief Studio pack fails exactly there. | `CRR-008` should have caught the shared-provider caller contract and application pack path. This is a source-review readiness gap. | `CR-FIND-008`; `Local Fix` → Implementation Engineer |
| `API-FIND-002` | Invalid/stale integration test, not production source | Test passes `owner.teamIdentity`; current owner contract and production Codex/Claude callers use `collaborationIdentity`. Strict rejection is correct. | The stale line was introduced in the cumulative implementation (`37d05c7f7`) and should have been caught by the source review's test-readiness check. Do not weaken source behavior. | API/E2E test `Local Fix` → API/E2E Engineer |
| `API-FIND-003` | API/E2E fixture validity issue | Imported Agents had no `agent-config.json`/`toolNames`; automatic exposure omits submit/review tools. Fresh task creation passed, but formal lifecycle was unreachable. | Corrected promptly after the user's question; no implementation or source-review defect can be inferred from this trace. | Fixture/report `Local Fix`; formal lifecycle `Not Tested` → API/E2E Engineer |
| `API-FIND-004` | API/E2E expected-path/execution issue | Graceful shutdown intentionally stops roots. The clicked `Reconnect` path queries an active-only checkpoint and correctly reports the root absent. Approved recovery is refreshed inactive history plus explicit Restore. | `CRR-008` did not promise automatic stale-context reactivation. This finding must not create unsupported lifecycle machinery. | Execution/report `Local Fix`; supported restore still unproven/failing under `API-FIND-005` → API/E2E Engineer |
| `API-FIND-005` | Production runtime/provider restore defect | Explicit Restore reaches a persisted idle member whose Codex thread ID has no rollout; `CodexThreadManager.restoreThread` unconditionally resumes every non-null ID and the Org atomically remains inactive. | The provider's “thread ID exists but no rollout exists before first turn” behavior required a real Codex lifecycle and was not reasonably detectable from static source alone. API/E2E correctly found it. | `CR-FIND-009`; `Local Fix` → Implementation Engineer |
| `API-FIND-006` | Production frontend lifecycle defect | Launch refreshes history before routing, but the already-mounted history panel expands the active path only in `onMounted`; it never reacts to the new route/run. | `CRR-008` validated active target states but missed the live configuration-to-launch transition through the persistent sidebar. This is a source-review gap. | `CR-FIND-010`; `Local Fix` → Implementation Engineer |
| `API-FIND-007` | Requirement/Product baseline omission at API execution; upstream recovery now active | Original Team tree has a Team-row status signal; current Org tree and source omit it. `RER-020` now approves exact semantics and sets `Product Design Requested`; `AD-REV-006`/`ARCH-REV-004` predate it. | Not a defect against the pre-`RER-020` approved prototype. Do not implement from the screenshot alone. | `CR-FIND-011`; `Requirement Gap` now in `RER-020` Product/architecture recovery → Architecture Designer after Product/Requirements re-entry |

## Findings

### `CR-FIND-008` — Brief Studio package validation omits the current AgentOrg definition root dependency

- Severity: `High`
- Affected supported scenario: `CR-SCN-013`; `APP-001`; `AC-021/022`
- Promoted candidate: `CR-CAND-011`
- Evidence: `autobyteus-server-ts/src/application-platform/launch-configuration/application-standalone-package-validator.ts:14-18,76-87`; `file-agent-definition-provider.ts:101-103`; `file-agent-team-definition-provider.ts:60-68`; real `brief-studio-build.log`.
- Consequence: a shipped application cannot complete its normal package build even though the server build passes.
- Required action: make the validator/application composition supply the complete current read-only definition-root contract and add a focused real package-validation/build regression. Keep external roots read-only and do not introduce a legacy parser.

### `CR-FIND-009` — A valid Org containing an idle Codex member cannot be restored

- Severity: `Critical`
- Affected supported scenario: `CR-SCN-017`; `ORG-010`; `RST-005`–`RST-007`; `AC-009`
- Promoted candidate: `CR-CAND-015`
- Evidence: `agent-org-run.ts:137-144`; `agent-org-run-service.ts:126-134`; `codex-agent-run-backend-factory.ts:52-68`; `codex-thread-manager.ts:54-62,103-162,189-212`; persisted `/verifier` tree/trace; `restart-failure-excerpts.log:237-245`.
- Consequence: the explicit whole-Org Restore action fails for an otherwise valid full-scope run merely because one member never received a first turn; the root correctly avoids partial activation but `AC-009` is unmet.
- Required action: resolve the provider-specific never-started persisted-thread state inside the existing Agent/Codex restore ownership, preserving exact identities/content for real conversations, atomic Org activation, and strict failure for unrelated resume errors. Do not add a blanket “any resume error starts fresh” fallback.

### `CR-FIND-010` — Post-launch history expansion does not expose the exact focus surface

- Severity: `Medium`
- Affected supported scenario: `CR-SCN-018`; `ORG-001/002`; `UI-001`; `AC-002/011`
- Promoted candidate: `CR-CAND-016`
- Evidence: `AgentOrgRunConfigPanel.vue:88`; `agentOrgRunStore.ts:32-40`; `AgentOrgRunHistoryPanel.vue:82-117`; two-launch browser transcript.
- Consequence: the workspace instructs the user to choose a member, but the newly launched active Org remains behind three collapsed levels until manual expansion.
- Required action: update the existing history-panel expansion owner to react to the supported launch/route/history transition and add a focused transition regression. Do not add a second navigation or context-state authority.

### `CR-FIND-011` — Mounted-Team aggregate status lacked upstream authority; `RER-020` recovery is not yet implementation-ready

- Severity: `Blocking upstream gate`, not a pre-`RER-020` source defect
- Affected supported scenario: `CR-SCN-019`; `REQ-028`; `AC-023`; `SCN-012`
- Promoted candidate: `CR-CAND-017`
- Evidence: user original-tree screenshot; current `ORG-005` screenshot; `AgentOrgRunHistoryPanel.vue:57-64`; `RER-020`.
- Consequence: current source lacks the now-approved presentation aggregate, but the Product supplement/user approval and architecture impact revision are still pending.
- Required action: complete the `RER-020` Product/Requirements/Architecture route before implementation. Preserve its negative boundary: presentation-only fold over exact descendant Agent status, no Team-root persistence, polling, lifecycle, or Stop/restore authority.

## Classification

- Overall: `Fail — mixed-origin API/E2E failure`
- `Local Fix / implementation`: `CR-FIND-008`, `CR-FIND-009`, `CR-FIND-010`
- `Local Fix / API/E2E`: `API-FIND-002` stale test, `API-FIND-003` invalid fixture/report, `API-FIND-004` unsupported expected action/report
- `Requirement Gap / upstream recovery`: `CR-FIND-011` was missing at API execution; `RER-020` now defines it and holds the package at `Product Design Requested` before architecture/source work
- Rejected production attributions: `API-FIND-002`, `API-FIND-003`, and the automatic-reactivation interpretation of `API-FIND-004` must not weaken strict identity, auto-expose unconfigured lifecycle tools, or add stale-context restore machinery.

## Recommended Recipient

- Implementation Engineer: correct only `CR-FIND-008`–`CR-FIND-010` within existing owners, subject to the active `RER-020` upstream gate and architecture sequencing; return through source review and API/E2E.
- API/E2E Engineer: correct the stale MCP test, task fixture/report, and restart expectation; do not rerun the cumulative pass attempt until implementation source re-review passes and the `RER-020` Product/architecture path permits validation.
- Architecture Designer: retain `CR-FIND-011` as the already-recorded `RER-020` Requirement Gap recovery; do not treat the old screenshot as direct implementation authority or bypass the focused Product gate.
- Exact recipients and order remain governed by `get_handoff_rules`.

## Residual Risks

- Formal standalone-Team and AgentOrg task submission/revision/acceptance remain `Not Tested` until a corrected, re-imported fixture explicitly supplies task lifecycle tools.
- Successful Org restore remains unproven for both idle and previously conversed members after `CR-FIND-009` correction.
- The correct post-restart Refresh → Restore browser journey remains unproven because the valid Restore currently fails downstream.
- Product-owned visual/accessibility evidence and the architecture impact for `REQ-028` / `AC-023` remain pending under `RER-020`.
- Other API-REV-001 stopped cohorts remain exactly as recorded; none are inferred to pass.

## Latest Authoritative Result

- Review Decision: `Fail`
- Review Entry Point: `API/E2E Failure-Origin Review`
- Supported Product Scenario Gate: `Pass` — every attribution was either promoted from an approved normal scenario/contract or explicitly rejected as unsupported/unreached
- Material-Premise Gate: `Pass`
- Score Summary: `N/A — failure-origin-only round; CRR-008's score is historical and is not reused as the current decision`
- Failure Origin: three implementation defects (`API-FIND-001/005/006`), three API/E2E test/fixture/execution corrections (`API-FIND-002/003/004`), and one upstream Requirement/Product gap now governed by `RER-020` (`API-FIND-007`)
- Recommended Recipient: Implementation Engineer, API/E2E Engineer, and Architecture Designer according to the exact dynamic handoff rules
- Notes: `CRR-008 / Pass` remains the historical pre-API source result, but `CRR-009 / Fail` is the latest authoritative review. No API/E2E pass or delivery readiness is claimed.
