# Code Review Report

## Review Round Meta

- Review Entry Point: `Implementation Review`
- Requirements Doc Reviewed As Context: `requirements-doc.md` (`RER-019`; behavior remains cumulative `RER-018`)
- Investigation / Requirements History: `investigation-notes.md`; `requirements-revision-record.md`
- Design Spec Reviewed As Context: `design-spec.md` (`AD-REV-006`)
- Supplemental Task Artifacts: `agent-org-contract.md`; approved `RV-012` / `VIS-001`–`VIS-020`; `BASELINE-PROMOTION-001`; `production_data_migration_conventions.md`
- Architecture Records: `architecture-design-revision-record.md`; `design-review-report.md`; `architecture-review-revision-record.md`
- Relevant Architecture Revisions: `AD-REV-006`; `ARCH-REV-004 / Pass` (cumulative prior revisions retained)
- Implementation Records: `implementation-handoff.md`; `implementation-revision-record.md`
- Relevant Implementation Revision: `IR-005` (cumulative `IR-001`–`IR-004` retained)
- Current Code Review Revision / Round: `CRR-005` / `5`
- Trigger: IR-005 source commit `dbc5f6f0a7` and artifact commit `f6e60dec0` returned after `CRR-004 / CR-FIND-004` Local Fix.
- Prior Review: `CRR-004 / Fail — Local Fix`
- Coverage Context: `api-e2e-coverage-investigation.md`; `API-REV-001 / stopped for ADI-007`; no API/E2E pass or canonical API/E2E revision record exists.
- Delivery Revision: `N/A — pending`
- Triggering Scenarios: `CR-SCN-005`, `CR-SCN-006`; current normal scenarios `CR-SCN-009`, `CR-SCN-010`
- Reviewer Evidence: `/tmp/aorg-crr005-contract-tests.log`; `/tmp/aorg-crr005-task-activation-probe.log`; `/tmp/aorg-crr005-web-focused.log`; `/tmp/aorg-crr005-team-focus-test.log`; implementation logs listed in `implementation-handoff.md`.

## Routing Classification Review

- Task size: `Large`
- Architectural risk: `High`
- Selected route: `Implementation Review`
- Independent source review required: `Yes`
- Classification evidence: Confirmed. The cumulative package changes shared contracts, Team/Org execution, persistence/migration, projection/stream/context/recovery, accepted workspace surfaces, and lifecycle behavior.

## Review Scope

- Cumulative package at `f6e60dec0`, with round-5 priority on `17c370e6e..dbc5f6f0a` and `CR-FIND-004`.
- Reviewed IR-005 contract/context/stream/test changes; AgentOrg task engine/adapter/projector; snapshot correlation; Org hydration; task/message/ACK handling; Team focus compatibility; prior findings; cumulative size/legacy/cleanup state.
- External definition repositories remain read-only/out of scope. Incoming API/E2E artifacts and generated application SDK/Brief Studio `dist` directories remain untracked and are not attributed to IR-005. Delivery is pending.

## Independent Validation Performed

- Rechecked `CR-FIND-004` through the current diff and forward production paths. Team coordinator admission/focus, communication identities, and pending ACK type/target correlation are corrected.
- Collaboration stream contract build/test: `5/5` passed (`/tmp/aorg-crr005-contract-tests.log`).
- Reviewer normal-task witness: `2/2` passed while intentionally asserting the current wrong behavior. An exact post-activation snapshot is rejected as duplicate-address state, and its fresh `activated` event enters `reopen_required` without sequence/task mutation (`/tmp/aorg-crr005-task-activation-probe.log`).
- Cross-checked IR-005 evidence: contract packages `1/1`, `5/5`, `2/2`; server stream `6/6`; focused web `6 files / 27 tests`; builds passed. Those tests do not cover a production-shaped fresh task execution.
- Reviewer full web run: `436` files passed, `2` failed, `2` skipped; `2406` tests passed, `3` failed, `2` skipped. One failure is the documented unrelated fixed-px audit. The other two are ticket-correlated `TeamFocusSendWorkflow` cases. An isolated rerun reproduced both because its IR-004-era harness omits the now-required store-neutral `team` prop.
- `git diff --check` passed. Cumulative source audit found `344` changed production files, `52` signals above 220 effective non-empty lines, and `0` above 500. The temporary reviewer test was deleted; the worktree returned to its incoming untracked-artifact state.

## Upstream Behavior And Production-Path Basis Confirmation

- Requirements understood: `RER-019` / cumulative `RER-018`, especially `REQ-012`, `REQ-014`–`REQ-016`, `AC-008`–`AC-011`.
- Design map status: Partial. IR-005 fixes three strict-correlation branches, but the normal `DS-005 -> DS-008/DS-016–DS-018` fresh-task path is rejected by browser snapshot/event admission.
- Architecture review: `ARCH-REV-004 / Pass` over `AD-REV-006`.
- Behavior-basis status: `Contradicted by implementation`
- Newly discovered behavior or material ambiguity: None. Task executions intentionally reuse a configured recipient address while receiving fresh run identity and no permanent configured membership.

| Behavior ID | Status | Current Path / Evidence |
| --- | --- | --- |
| `BEH-001` | `Confirmed` | Exact Team V2/Org V1 definition admission and authoring remain. |
| `BEH-002` | `Confirmed` | Full Org activation and nullable focus remain. |
| `BEH-003` | `Confirmed` | Stable handoffs and same-root routing remain. |
| `BEH-004` | `Confirmed` | IR-005 admits only an in-Team direct-Agent coordinator and focuses that member. |
| `BEH-005` | `Contradicted` | A valid task-bearing Org snapshot is rejected before browser publication. |
| `BEH-006` | `Contradicted` | Accepted surfaces remain, but their live task view cannot consume a normal fresh activation/snapshot. |
| `BEH-007` | `Confirmed` | Startup migration and external read-only boundaries remain as verified in CRR-003. |
| `BEH-008` | `Contradicted` | Org projection treats task reuse of a configured address as duplicate configured identity. |
| `BEH-009` | `Contradicted` | The server creates the approved fresh task, but its event/snapshot cannot enter the browser context. |
| `BEH-010` | `Confirmed` | Target-only admission and migration-private decoding remain. |

## Supported Product Scenario And Reachability Gate (Mandatory)

| ID | Related Behavior / Contract | Initiator And Supported Surface | Forward Path / Expected Outcome | Evidence / Validity | Use |
| --- | --- | --- | --- | --- | --- |
| `CR-SCN-001` | `BEH-007`; `REQ-012`, `REQ-013`; migration convention | Registered startup migration encounters an unexpected later child. | Complete preflight -> byte-faithful failure with exact reason. | `Supported Explicit Edge Scenario`; CRR-003. | `Use` |
| `CR-SCN-002` | `BEH-007`; `AR-PREM-001` | Process terminates after prospective migration output; application later starts normally. | Retry recognition -> commit/cleanup. | `Supported Explicit Edge Scenario`; CRR-003. | `Use` |
| `CR-SCN-003` | `BEH-001/002/006` | User edits an existing nonempty Org on `/agent-orgs`. | Partial update preserves hidden durable fields. | `Supported Normal Scenario`; CRR-003. | `Use` |
| `CR-SCN-004` | `BEH-004`–`006`; `REQ-004/016/019`; `VIS-017` | User focuses a direct Agent and sends a real prompt. | Exact command/event -> accepted Agent workspace. | `Supported Normal Scenario`; API/IR-004 evidence. | `Use` |
| `CR-SCN-005` | `BEH-004/006`; `REQ-004`; `VIS-018`; `DS-017` | User selects a mounted Team/Agent. | Team row -> stored direct coordinator/member -> exact target. | `Supported Normal Scenario`. | `Use` |
| `CR-SCN-006` | `BEH-004`–`006/008`; `REQ-025`; `DS-016`–`018` | Strict Org stream receives an unknown/malformed/miscorrelated/gapped message. | Reject -> `reopen_required` -> checkpoint recovery; preserve committed context. | `Supported Explicit Edge Scenario`. | `Use` |
| `CR-SCN-007` | `BEH-005/006`; `REQ-016`; `DS-019` | Operator stops active Org from history root row. | Whole-root termination with pending/error parity. | `Supported Normal Scenario`. | `Use` |
| `CR-SCN-008` | `BEH-005/006`; history contract | First Org launch in a cold data root. | Initialize history before package publication. | `Supported Normal Scenario`; IR-004. | `Use` |
| `CR-SCN-009` | `BEH-005/006/008/009`; `REQ-015`, `AC-010`; `DS-005/008` | Live Org Agent invokes bound `delegate_task` to a configured Agent/Team. | Fresh run ID at configured recipient address -> tree/record commit -> `activated` event -> synchronized context/task view. | `Supported Normal Scenario`; requirement, contract, and production engine/adapter independently establish the path. | `Use` |
| `CR-SCN-010` | `BEH-006/009`; `REQ-011`, `REQ-015` | Standalone Team user selects delegated task details and then continues messaging the already focused configured Agent. | Team context -> `TeamOverviewPanel`/task details -> focus remains exact -> composer sends to current AgentRun. | `Supported Normal Scenario`; production Team workspace caller and durable test intent independently establish it. | `Use` |

### Candidate Finding And Mechanism Gate

| Candidate | Observation | Scenario | Evidence / Lifecycle | Disposition / Response |
| --- | --- | --- | --- | --- |
| `CR-CAND-001` | Prior migration wrote before complete preflight. | `CR-SCN-001` | IR-003 source unchanged; prior probes/tests. | `Promote` — verified resolved. |
| `CR-CAND-002` | Prior migration could not resume prospective output. | `CR-SCN-002` | IR-003 source unchanged; subprocess/tests. | `Promote` — verified resolved. |
| `CR-CAND-003` | Prior Org edit cleared hidden fields. | `CR-SCN-003` | Edit still sends visible fields only. | `Promote` — verified resolved. |
| `CR-CAND-004` | Raw dashboard/bespoke surface/member stop. | `CR-SCN-004/005/007` | Typed projection/shared surfaces/root stop remain. | `Promote` — verified resolved. |
| `CR-CAND-005` | CRR-004 cross-Team coordinator, uncorrelated communication, and ACK-by-ID gaps. | `CR-SCN-005/006` | IR-005 validates direct coordinator, message endpoints, and pending ACK type/target before mutation/completion. | `Promote` — these subparts are resolved. |
| `CR-CAND-006` | First-launch history ordering. | `CR-SCN-008` | Current source initializes history before publication. | `Promote` — verified resolved. |
| `CR-CAND-007` | Task correlation assumes execution preexists the snapshot; snapshot/hydration assume task addresses are globally unique. Actual task execution is fresh at the configured recipient address. | `CR-SCN-009` | Server commits fresh execution/record and publishes -> browser rejects event; exact later snapshot rejects reused address -> task view cannot synchronize. Source and reviewer `2/2` observation probe. | `Promote` — deterministic normal-workflow failure. Fix existing owners; no fallback/second topology authority. |
| `CR-CAND-008` | The store-neutral `TeamOverviewPanel` now requires `team`, but the preserved Team task/focus workflow harness still mounts it without that prop. | `CR-SCN-010`; repository validation contract | Full suite and isolated test fail before exercising the assertions; production callers pass the explicit view. | `Promote` — bounded stale durable-test correction; no production defect or design change is inferred. |

## Structural / Design Checks

| Check | Result | Evidence / Action |
| --- | --- | --- |
| Task design health and classification | `Pass` | Large/High and selected recovery remain explicit. |
| Approved supplemental behavior match | `Fail` | Coordinator/message/ACK match; fresh task lifecycle does not. Resolve `CR-FIND-004`. |
| Data-flow spine preservation | `Fail` | `DS-005` server path reaches a committed result that `DS-008/016–018` rejects. |
| Ownership / off-spine / capability reuse | `Pass` | Contract, task engine/adapter, Org context/stream/hydration, and surfaces retain clear owners. Keep correction there. |
| Reusable structures | `Pass` | Shared task records and root-neutral presentation remain appropriately placed. |
| Shared-model tightness | `Fail` | Configured-placement address uniqueness is incorrectly applied to reusable task target addresses. |
| Repeated coordination / empty indirection | `Pass` | One Org context/stream authority; no pass-through abstraction. |
| Separation of concerns / dependencies / authoritative boundary / placement | `Pass` | Affected files remain cohesive and components use ports rather than internals. |
| Flat-vs-over-split judgment | `Pass` | Cumulative layout follows real owners. No size-driven split. |
| Interface/API/query/command clarity | `Fail` | ACK/focus are exact; task snapshot/event correlation implements the wrong identity lifecycle. |
| Naming / readability | `Pass` | Subject, identity, context, and lifecycle names remain explicit. |
| Duplication / patch complexity / cleanup | `Pass` | No second Org dashboard/recovery authority or compatibility fallback; retired paths stay removed. |
| Relevant test alignment | `Fail` | Task fixtures avoid fresh identity/address reuse, and `TeamFocusSendWorkflow` omits the required `team` prop after the store-neutral extraction. Add production-shaped task cases and repair the preserved Team workflow harness. |
| Test structure / stale tests | `Pass` | Fixtures are navigable; no obsolete presentation tests. |
| API/E2E readiness | `Fail` | `AC-010`/task-bearing restore cannot pass browser admission, and two ticket-correlated web tests are red beyond the known fixed-px baseline. Return to Implementation. |

## Source File Size And Structure Audit (If Applicable)

Method: cumulative production changes from `f3035a2d5..HEAD`; `.ts/.tsx/.js/.mjs/.vue`, excluding tests, fixtures, test support, and `dist`. Result: `344` files, `52` signals above 220 effective non-empty lines, `0` above 500. IR-005 adds no production file and no production delta above 220.

| File / Cohort | Effective Lines | Result |
| --- | ---: | --- |
| Largest cumulative files | `500`–`222` | `Pass` hard limit; signals remain cohesive existing/focused owners. |
| `agentOrgExecutionContext.ts` | `330` | Correct context owner; `Local Fix` for fresh task event lifecycle. |
| `agentOrgStreamingService.ts` | `271` | Correct stream/ACK owner; ACK fix verified; no split. |
| `agentOrgContextHydration.ts` | `220` | Correct hydration owner; fix false global task-address uniqueness. |
| `root-execution-view-dtos.ts`; `agent-org-execution-dtos.ts` | `141`; `142` | Correct contract owners; task identity scoping needs Local Fix; coordinator refinement passes. |

## Legacy / Backward-Compatibility Verdict

| Check | Result | Notes |
| --- | --- | --- |
| No backward-compatibility mechanisms | `Pass` | Shared current contracts; no dual runtime parser. |
| No retained old behavior / cleanup complete | `Pass` | Raw Org dashboard/direct path removed; migration decoder remains private. |
| Persisted-data transition and migration mechanics | `Pass` | IR-005 changes neither; IR-003 corrections remain resolved. |
| No version-specific dual reads/writes/fallback | `Pass` | Team/Org readers remain exact and family-specific. |

## Dead / Obsolete / Legacy Items Requiring Removal (Mandatory If Any Exist)

None.

## Docs-Impact Verdict

- Docs impact: `Yes` for the cumulative public Team/Org/runtime/stream/migration change; final delivery synchronization remains pending.
- Likely areas: AgentOrg/AgentTeam architecture and user docs, strict stream/command/query contracts, migration guidance, final ticket artifacts.

## Additional Material Premise Validation (When Required)

| Premise | Status | Evidence |
| --- | --- | --- |
| `AR-PREM-001` | `Confirmed` | Migration interruption/relaunch remains resolved. |
| `AR-PREM-002` | `Confirmed` | Arbitrary corruption remains unsupported and drives no finding. Current finding uses a normal approved task workflow. |
| `AR-PREM-003` | `Confirmed` | Subject fail-stop after indeterminate durability remains. |

No new premise is required. `CR-SCN-009` is authorized by `REQ-015` / `AC-010` and executed by the production task tool/engine/adapter.

## Review Scorecard (Mandatory)

- Overall: `8.8/10` (`87.5/100`), simple average. `Fail`: five categories are below the `9.0` clean-pass target and `CR-FIND-004` / `CR-FIND-005` remain open.

| Priority | Category | Score | Rationale / Improvement |
| --- | --- | ---: | --- |
| 1 | Data-Flow Spine Inventory and Clarity | `8.5` | Documented owners, but normal fresh-task join is broken. Trace exact post-snapshot activation. |
| 2 | Ownership Clarity and Boundary Encapsulation | `9.2` | One Org aggregate/context and accepted surfaces retain authority. Preserve owners. |
| 3 | API / Interface / Query / Command Clarity | `8.6` | Focus/message/ACK/browse are explicit; task identity rules contradict fresh execution semantics. |
| 4 | Separation of Concerns and File Placement | `9.1` | Responsibilities remain coherent. Keep fix local. |
| 5 | Shared-Structure / Data-Model Tightness | `8.5` | Configured address uniqueness is conflated with task target reuse. Separate placement and task-run identity. |
| 6 | Naming Quality and Local Readability | `9.0` | Explicit domain-aligned names; dense contract declarations are a minor scan cost. |
| 7 | API/E2E Readiness | `8.0` | Builds/focused negatives pass, but normal `AC-010`/task snapshots fail and two ticket-correlated Team workflow tests remain red. |
| 8 | Runtime Correctness And Behavioral Fidelity | `8.0` | Coordinator/message/ACK are fixed; normal fresh tasks cannot stay in or reopen context. |
| 9 | No Backward-Compatibility / No Legacy Retention | `9.3` | Current-only families and isolated migration knowledge remain. |
| 10 | Cleanup Completeness | `9.3` | Retired Org presentation/direct paths remain removed. |

## Findings

### `CR-FIND-004` — High — Strict AgentOrg task correlation rejects the supported fresh task lifecycle

- Candidate gate: `CR-CAND-007 / Promote`; `CR-CAND-005` confirms the coordinator, communication, and ACK subparts are resolved.
- Affected authority: `BEH-005/006/008/009`; `REQ-012`, `REQ-014`–`REQ-016`; `AC-008`–`AC-011`; `DS-005`, `DS-008`, `DS-016`–`DS-018`; `CR-SCN-009`.
- Supported trigger/path: A live Org Agent invokes `delegate_task` to a configured Agent/Team. The task engine allocates a fresh run, the Org adapter retains the configured recipient address, commits tree/sidecar, and publishes `activated`. The browser must synchronize that current state and expose task lifecycle.
- Evidence:
  1. `agent-org-contract.md` says task records preserve target address and add no configured membership/permanent address; `REQ-015` / `AC-010` require a fresh run.
  2. `agent-org-task-lifecycle-adapter.ts:61-103,204-235` allocates the fresh identity at `input.placement.address`, commits, and publishes. `root-task-lifecycle-engine.ts:142-172` builds the event with that fresh reference.
  3. `root-execution-view-dtos.ts:39-88` applies global address uniqueness across configured and task nodes, rejecting the exact task node at its configured recipient even though run IDs differ. `agentOrgContextHydration.ts:82-108` repeats that assumption.
  4. `agentOrgExecutionContext.ts:282-296` requires an `activated` task's fresh execution ID to already exist in maps built from the pre-activation snapshot. It cannot, so the valid event fails before mutation.
  5. `/tmp/aorg-crr005-task-activation-probe.log` shows `AgentOrg Agent address '/worker' is duplicated` for the exact later snapshot and `reopen_required`, sequence `0`, zero task records for the valid event.
  6. The passing context fixture (`rootExecutionViewState.spec.ts:95-100`) uses configured `agent-member` as `taskExecution`; the contract fixture uses `/task-active` rather than a configured recipient. Neither proves the production path.
- Consequence: Every normal new task activation encounters the pre-snapshot fresh-ID mismatch, and the subsequent exact checkpoint/history snapshot encounters the false duplicate-address rule. Accepted task presentation and task-bearing migrated/restored Org hydration cannot work.
- Required action: Within the existing contract/hydration/context owners, preserve configured-placement address uniqueness while allowing task executions to reuse their configured recipient address; keep run identities unique and correlate each task record to an exact configured recipient plus its fresh execution. Handle normal fresh `activated` without requiring it to preexist in the stale snapshot, using existing context/checkpoint ownership rather than a second topology/compatibility path. Add production-shaped fresh Agent and Team event/snapshot/hydration regressions, including an existing task-bearing package. If the reviewed event/checkpoint contract proves insufficient, report Design Impact rather than inventing a parallel path.
- Classification: `Local Fix` — the owning boundaries and checkpoint/context capabilities remain appropriate; current identity assumptions/fixtures are wrong.
- Review accountability: CRR-004 correctly required task correlation but its prescription/witness failed to trace that the task run is allocated after the current browser snapshot. CRR-005 corrects that review gap instead of treating IR-005's literal implementation as sufficient.

`CR-FIND-001`, `CR-FIND-002`, and `CR-FIND-003` remain resolved.

### `CR-FIND-005` — Medium — Store-neutral Team workspace extraction left a supported workflow test stale

- Candidate gate: `CR-CAND-008 / Promote`
- Affected authority: preserved standalone Team behavior (`BEH-006`, `BEH-009`; `REQ-011`, `REQ-015`), source-review API/E2E readiness, and `CR-SCN-010`.
- Evidence: `TeamOverviewPanel.vue:73-75` requires `team: TeamWorkspaceContextView`, but `TeamFocusSendWorkflow.spec.ts:37-40` still renders `<TeamOverviewPanel />`. `/tmp/aorg-crr005-web-focused.log` records the current full run at `436` passed / `2` failed files with three failed tests: one established fixed-px audit plus both workflow cases. `/tmp/aorg-crr005-team-focus-test.log` independently reproduces the two ticket-correlated failures and the exact missing-prop warning.
- Consequence: The durable regression for selecting task-Agent/task-Team details while preserving the exact send target never reaches its assertions. The cumulative package therefore adds two failures beyond the documented unrelated web-test baseline and is not cleanly ready for downstream validation. Current production callers supplying the explicit view mean this evidence does not establish a production defect.
- Required action: Update the durable workflow harness/stubs to the reviewed store-neutral `TeamWorkspaceContextView` interface and rerun the exact test plus the relevant Team surface suite. Do not weaken or remove its focus/send assertions.
- Classification: `Local Fix` — bounded implementation-owned test maintenance.

## Classification

- `Local Fix`

## Recommended Recipient

- `implementation_engineer`
- API/E2E must not resume until both corrections return through source review and pass.

## Residual Risks

- API/E2E remains stopped at `API-REV-001`; after fix/pass it must repeat real imported-package/Codex/browser, fresh task activation/checkpoint, contextual identity, lifecycle, Team compatibility, and migration/persistence evidence.
- Team outer-wire preservation is strongly supported; broader golden validation remains downstream-relevant.
- Repository Nuxt typecheck remains broadly red with no IR-005 changed-path diagnostic per the handoff; it is not this finding's basis.
- External definition publication remains separately owned.

## Latest Authoritative Result

- Review Decision: `Fail`
- Review Entry Point: `Implementation Review`
- Supported Product Scenario Gate: `Pass`
- Material-Premise Gate: `Pass`
- Score: `8.8/10 (87.5/100)`; Data-Flow, API/Interface, Shared-Model, API/E2E Readiness, and Runtime Correctness are below target.
- Failure Origin: `Implementation defect in AgentOrg browser task identity correlation, a stale implementation-owned Team workflow test, and a CRR-004 review gap that did not account for post-snapshot fresh task identity allocation.`
- Recommended Recipient: `implementation_engineer`
- Notes: IR-005 resolves coordinator, communication, and ACK correlation. Source review remains failed because the task correction rejects the approved fresh-task event/snapshot and the cumulative store-neutral Team extraction leaves two durable Team workflow tests red.
