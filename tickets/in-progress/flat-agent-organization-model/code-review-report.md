# Code Review Report

## Review Round Meta

- Review Entry Point: `Implementation Review`
- Requirements Doc Reviewed As Context: `requirements-doc.md` (`RER-018` approved behavior authority; document history currently includes `RER-019`)
- Investigation Notes Reviewed As Context: `investigation-notes.md`
- Requirements Revision Record Reviewed As Context: `requirements-revision-record.md`
- Design Spec Reviewed As Context: `design-spec.md`
- Supplemental Task Artifacts Reviewed As Context: `agent-org-contract.md`; approved `RV-012` product artifacts and `VIS-001`–`VIS-020`; `production_data_migration_conventions.md`
- Architecture Design Revision Record Reviewed As Context: `architecture-design-revision-record.md`
- Relevant Architecture Design Revision IDs: `AD-REV-005`
- Design Review Report Reviewed As Context: `design-review-report.md`
- Architecture Review Revision Record Reviewed As Context: `architecture-review-revision-record.md`
- Relevant Architecture Review Revision IDs: `ARCH-REV-003 / Pass`
- Implementation Handoff Reviewed As Context: `implementation-handoff.md`
- Implementation Revision Record Reviewed As Context: `implementation-revision-record.md`
- Relevant Implementation Revision IDs: `IR-002` (with `IR-001` / `IDI-001` recovery context)
- Code Review Revision Record: `code-review-revision-record.md`
- Current Code Review Revision ID: `CRR-002`
- Current Review Round: `2`
- Trigger: User requested reconsideration of the migration findings against the authoritative no-deep-data precondition, a fresh production-data inventory, and the canonical migration convention.
- Prior Review Round Reviewed: `CRR-001 / round 1 / Fail — Local Fix`
- Latest Authoritative Round: `2`
- Coverage Investigation Reviewed (failure-origin entry point): `N/A`
- Execution Coverage Report Reviewed (failure-origin entry point): `N/A`
- API/E2E Revision Record Reviewed (failure-origin entry point): `N/A`
- Relevant API/E2E Revision IDs: `N/A — pending`
- Delivery Revision Record Reviewed (delivery re-entry only): `N/A`
- Relevant Delivery Revision IDs: `N/A — pending`
- Failing Scenario IDs: `CR-SCN-001`, `CR-SCN-002`, `CR-SCN-003`
- Exact Failing Commands / Execution Mode: reviewer probes documented under Findings; existing focused migration tests `7/7` and Org-experience component tests `4/4` pass but do not cover the promoted scenarios.
- Failure Evidence Paths: `/tmp/aorg-review-migration-probe.log`; `/tmp/aorg-review-interruption-probe.log`; source locations cited below.

## Routing Classification Review

- Task size (`Small`/`Medium`/`Large`): `Large`
- Architectural risk (`Low`/`High`): `High`
- Selected route (`Implementation Review`/`API/E2E Failure-Origin Review`): `Implementation Review`
- Independent source review required by the classification: `Yes`
- Classification evidence or correction required: Confirmed. The cumulative change crosses definitions, execution, persistence, migration, GraphQL/streaming, and web product surfaces. No classification correction is required.

## Review Scope

- Changed implementation and behavior reviewed: cumulative `HEAD^..HEAD` implementation delta at `37d05c7`, with particular tracing of strict Team/Org definitions, definition admission, root-neutral execution, task/message/persistence ownership, startup migration, API projections, Org authoring/configuration, and tests relevant to those paths. Round 2 rechecked the migration findings only; source is unchanged.
- Files / areas reviewed: 468-file commit delta; 293 changed production source files in the local source audit; all 44 `>220` effective-non-empty-line signals; focused deep review of migration, Org definition service/store/UI, definition codecs/providers/admission, configured execution, Org runtime/index/state validation/task lifecycle/persistence, history/readiness/stream family tagging, GraphQL, and relevant tests.
- Explicit exclusions: external `autobyteus-agents` and `autobyteus-private-agents` repositories are read-only/out of ticket migration scope; unrelated full-suite baseline failures documented by IR-002 were not re-attributed; API/E2E and delivery results are pending.

## Upstream Behavior And Production-Path Basis Confirmation

- Approved requirements basis understood: Yes — `RER-018`, `REQ-001`–`REQ-027`, `AC-001`–`AC-022`, and the approved product/migration supplements were used as authority.
- Design-spec behavior map verified against the implementation: Partially. Most fixed-depth ownership and runtime paths match `AD-REV-005`, but the definition migration and Org edit paths contradict supported behavior.
- Design review report and round confirmed: `ARCH-REV-003 / Pass` over `AD-REV-005`.
- Behavior-basis status: `Contradicted`
- Changed or newly discovered behavior, if any: None. The issues are bounded implementation defects against already-approved behavior, not new intended behavior.
- Remaining material ambiguity, if any: None. The current inventory satisfies `PRE-002`; the separately written `REQ-013`/`QR-003` contract still requires an unexpected violation to fail before mutation rather than be converted.

| Behavior ID | Current Status | Current Implementation Path And Lifecycle Evidence | Contradicting Or Newly Discovered Supported Behavior Evidence |
| --- | --- | --- | --- |
| `BEH-001` | `Contradicted` | Strict Team V2/Org V1 codecs, services, endpoint validation, optimistic revision checks, and definition-package transaction exist. | The supported Org edit surface sends destructive values for durable fields it does not expose (`CR-FIND-003`), so the complete candidate is not faithful to the loaded definition. |
| `BEH-002` | `Contradicted` | Root-neutral configured execution, complete Org activation, and configuration resolver are present. | A normal prior Org edit nulls `defaultLaunchConfig`, defeating the approved root-default seed before the launch path (`CR-FIND-003`). |
| `BEH-003` | `Confirmed` | Compiler and UI preserve root-first/Team-member order, endpoint ownership, and ordered `rules[]`; sender-bound runtime routes through the owning root. | N/A |
| `BEH-004` | `Confirmed` | Org launch is unfocused; exact Agent and Team-coordinator focus paths are distinct and evidenced by IR-002 rendered validation. | N/A |
| `BEH-005` | `Confirmed` | Team V2 and Org V1 tree/task/message packages, state correlation, history tagging, restore, fail-stop, and shutdown owners are family-specific. | N/A — migration transition defects are recorded under `BEH-007`. |
| `BEH-006` | `Contradicted` | Distinct Team/Org GraphQL, stores, catalog, detail, builder, config, history, and workspace surfaces exist. | The Org builder's supported update action clears hidden definition state (`CR-FIND-003`). |
| `BEH-007` | `Contradicted` | Required `STARTUP_ONLY` migration uses the existing runner and isolates retired codecs. | The writable-definition path mutates before complete preflight and cannot resume an explicit prospective state after restart (`CR-FIND-001`, `CR-FIND-002`). |
| `BEH-008` | `Confirmed` | Native Team V2 remains separate from Org V1; mixed projections require a subject tag and reject family mismatch. | N/A |
| `BEH-009` | `Confirmed` | Fresh task Agent/Team execution remains task-scoped under exact Team/Org host identities. | N/A |
| `BEH-010` | `Confirmed` | Normal admission is target-only; migration-only legacy decoders are not imported by runtime providers. | N/A |

## Supported Product Scenario And Reachability Gate (Mandatory)

| Scenario ID | Related Behavior / Contract IDs | Kind | Actor / Initiator | Coherent Goal Or Governing Event | Supported Entry Surface / Event | Scenario Shape | Forward Production Path / Lifecycle | Expected Outcome / Consequence | Independent Evidence | Scenario Validity | Review Use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-SCN-001` | `BEH-007`; `PRE-002`; `REQ-012`, `REQ-013`; `AC-008`; `QR-003`; migration convention | `System` / `Contract` | Required startup migration | Cut over only the approved fixed-depth population while rejecting an unexpected precondition violation safely, without attempting deep conversion. | Registered required startup migration over the writable server Team-definition root. | `Explicit Edge` | startup -> runner `runPending()` -> `migrateDefinitions()` -> decode root/direct owned Teams -> fixed-depth preflight -> target writes or failed disposition | Valid zero/one-level items convert deterministically. An unexpected deeper item remains byte-faithful and unmutated, its invariant/path is reported, and no recursive compatibility path is admitted. | Fresh read-only inventory found 45 readable runtime roots (`27` flat, `18` one-level, `0` deeper), one writable server definition root with no child, and 23 external roots with seven direct children and no grandchildren. `REQ-013`, `QR-003`, RER-004, and `design-spec.md:1358` nevertheless explicitly define the unexpected-violation zero-write disposition. | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-002` | `BEH-007`; `REQ-012`, `REQ-013`, `REQ-027`; `AR-PREM-001`; migration convention | `Operational` | Ordinary process interruption and later application startup | Resume the one approved incomplete-attempt category through the existing runner. | Process termination during the registered migration, followed by ordinary startup/stale-attempt retry. | `Explicit Edge` | first startup -> child/current prospective writes -> termination before rename -> later startup -> same migration classifies old/prospective/target state -> completes or truthfully fails the corrected item | Exact prospective output is recognized and completed idempotently without a second recovery system. | `design-review-report.md` `AR-PREM-001`; `design-spec.md` lines/sections “Abrupt termination” and “Ordinary relaunch/idempotence.” | `Supported Explicit Edge Scenario` | `Use` |
| `CR-SCN-003` | `BEH-001`, `BEH-002`, `BEH-006`; `REQ-012`, `REQ-023`, `REQ-024`; `AC-017`–`AC-019`; `SCN-008`, `SCN-009` | `User` | AgentOrg author | Edit a loaded Org's name, members, or Org-owned handoffs without changing unexposed durable definition state. | `/agent-orgs?view=org-edit&id=...` form save. | `Normal` | `AgentOrgExperience.saveOrg()` -> Pinia `update()` -> GraphQL update -> `AgentOrgDefinitionService.updateDefinition()` -> atomic provider transaction -> later Org launch | The complete update remains atomic and preserves loaded instructions, metadata, and definition launch defaults unless the author explicitly changes them. | Approved Org authoring/configuration journeys; current backend update API explicitly preserves omitted fields. | `Supported Normal Scenario` | `Use` |

### Candidate Finding And Mechanism Gate

| Candidate ID | Observation Or Mechanism | Scenario / Contract ID | Independent Trigger | Forward Path / Lifecycle / Consequence | Evidence | Disposition | Reason / Proportionate Response |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CR-CAND-001` | The definition migration writes each earlier direct owned Team immediately, then validates later children/root; its catch also discards the invariant reason. | `CR-SCN-001` | Required startup sees a valid first owned Team and a later unexpected deeper child. | Earlier child becomes V2 -> later child throws -> root remains retired -> item is `FAILED_DEFINITION` -> retry rejects the already-current child as legacy; source is both mutated and stuck. | Migration lines 160–174 and 354–369; reviewer probe output records V2 child, retired root, and two consecutive failures. | `Promote` | Direct violation of validate-before-mutation and truthful bounded diagnostics. Fix inside the migration and add focused regression coverage. |
| `CR-CAND-002` | The migration does not classify a definition source containing an already-current owned child as prospective output. | `CR-SCN-002` / `AR-PREM-001` | Normal process termination after an atomic child write and before package rename. | Later startup decodes the legacy root, calls the retired decoder on the V2 child, records `FAILED_DEFINITION`, and never finishes the rename. | Migration lines 151–169; reviewer subprocess exited at the first committed child write and the later normal retry failed with source present/target absent. | `Promote` | The approved relaunch category is explicit. Recognize exact prospective state; do not add a bespoke recovery subsystem. |
| `CR-CAND-003` | Org edit always sends `instructions:''`, `category:null`, `avatarUrl:null`, and `defaultLaunchConfig:null`. | `CR-SCN-003` | Author saves an existing Org whose hidden fields are nonempty. | UI constructs explicit destructive values -> store/GraphQL forwards them -> service treats them as changes -> provider persists them -> instructions/default configuration are lost. | `AgentOrgExperience.vue` lines 302–314; store lines 52–57; service lines 57–74. Existing component fixture uses only empty/null values, so its passing test does not exercise preservation. | `Promote` | Normal supported authoring path with direct durable consequence. Separate create defaults from update preservation and add one component/mutation regression test. |

## Structural / Design Checks

| Check | Result | Evidence | Required Action |
| --- | --- | --- | --- |
| Task design health assessment is present, evidence-backed, and preserved by the implementation | `Pass` | IR-002 preserves Large/High, `Refactor Needed Now`, and the AD-REV-005 root-neutral boundary. | None. |
| Implementation matches approved behavior-defining supplemental artifacts | `Fail` | Runtime/UI layout substantially matches, but migration interruption/preflight and Org update preservation contradict the approved design/product contracts. | Resolve `CR-FIND-001`–`003`. |
| Data-flow spine inventory clarity and preservation under shared principles | `Fail` | Root-neutral execution and subject-private adapters are traceable; definition migration and Org update have evidenced mid-spine state loss. | Validate the whole migration item before write, resume prospective state, and preserve omitted edit fields. |
| Ownership boundary preservation and clarity | `Pass` | Team/Org definition, run, persistence, task/message/event, and provider owners remain separate; shared execution exposes narrow root-neutral capabilities. | None. |
| Off-spine concern clarity (off-spine concerns serve clear owners and stay off the main line) | `Pass` | Admission diagnostics, readiness indexing, history projection, and streaming adapters remain outside root execution aggregates. | None. |
| Existing capability/subsystem reuse check (no fresh helper where an existing subsystem should own it) | `Pass` | Existing app-data runner/atomic writer, definition transactions, configured Agent backend, Team execution, and run-history stores are reused. | None. |
| Reusable owned structures check (repeated structures extracted into the right owned file instead of copied across files) | `Pass` | Shared identity/task/tree records and flat-Team execution are extracted under their owning collaboration/Team modules. | None. |
| Shared-structure/data-model tightness check (no kitchen-sink base, no overlapping parallel shapes, specialization/composition used meaningfully) | `Pass` | Exact Team V2 and Org V1 roots remain distinct; shared records are limited to actual common child/task structures. | None. |
| Repeated coordination ownership check (shared policy has a clear owner instead of being repeated across callers) | `Pass` | `RootTaskLifecycleEngine`, handoff compiler, configuration resolver, and readiness index own repeated coordination policies. | None. |
| Empty indirection check (no pass-through-only boundary) | `Pass` | Reviewed adapters translate subject-specific tree/persistence/callback semantics rather than exposing empty wrappers. | None. |
| Scope-appropriate separation of concerns and file responsibility clarity | `Pass` | Large new files remain cohesive owners below the hard limit; the migration defects are ordering/state defects rather than missing subsystem ownership. | None beyond findings. |
| Ownership-driven dependency check (no forbidden shortcuts or unjustified cycles) | `Pass` | Source/import inspection supports subject owners depending inward on shared capabilities, not the reverse. | None. |
| Authoritative Boundary Rule check (callers do not depend on both an outer owner and that owner's internals) | `Pass` | No reviewed caller bypasses Team/Org aggregate/provider authority to reach internal repositories/managers in parallel. | None. |
| File placement check (file/folder path matches owning concern or explicitly justified shared boundary) | `Pass` | Migration, admission, Org definition/execution, Team local runtime, history, GraphQL, and web surface files are placed under their owning concerns. | None. |
| Flat-vs-over-split layout judgment (layout is readable for the scope and not artificially fragmented) | `Pass` | The Large/High change uses owned packages without a generic root family or excessive pass-through layers. | None. |
| Interface/API/query/command/service-method boundary clarity (one subject, one responsibility, explicit identity shape) | `Pass` | Team/Org GraphQL and runtime identities are subject-tagged; member/task commands carry exact run/address identity. | None. |
| Naming quality and naming-to-responsibility alignment check | `Pass` | New family, index, adapter, projection, and persistence names reflect their owners and version/family. | None. |
| No unjustified duplication of code / repeated structures in changed scope | `Pass` | Common task lifecycle/tree records are shared deliberately; strict family envelopes stay separate. | None. |
| Patch-on-patch complexity control | `Pass` | IR-001 coupling was recovered through AD-REV-005 extraction rather than a synthetic Team root or compatibility patch. | None. |
| Dead/obsolete code cleanup completeness in changed scope | `Pass` | Retired normal recursive model readers/owners are removed or migration-confined; no actionable dead item found. | None. |
| Relevant test scenarios and assertions are clear and requirement-aligned | `Fail` | Current migration tests cover runtime conversion/collision/target cleanup but no server-owned definition preflight/prospective retry. Org UI test uses empty/null hidden fields and only partial mutation matching. | Add the regression scenarios required by `CR-FIND-001`–`003`. |
| Test fixtures/helpers are reasonably reusable and test structure remains coherent | `Pass` | Focused fixtures and environment builders are coherent; no test-size policy issue applies. | None. |
| No stale, duplicated, or compatibility-only tests are retained in changed scope | `Pass` | Reviewed tests assert strict current families and migration-only predecessor inputs rather than runtime compatibility. | None. |
| API/E2E readiness for the next workflow stage | `Fail` | Three implementation-owned correctness gaps would make downstream executable validation consume a knowingly defective source package. | Return to Implementation Engineer before API/E2E. |

## Source File Size And Structure Audit (If Applicable)

Audit method: changed `.ts/.tsx/.js/.mjs/.vue` production files in `HEAD^..HEAD`, excluding tests, fixtures, and `dist`; effective lines are non-empty physical lines. Result: `293` files, `44` signals over 220, `0` over 500. `git diff --check HEAD^ HEAD` passed.

| Source File / Cohort | Effective Non-Empty Lines | `>500` Hard-Limit Check | `>220` Delta Check | SoC / Ownership Check | Placement Check | Preliminary Classification | Required Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/config/app-config.ts`; Agent backend factory/manager/Claude session | `500`, `498`, `498`, `492` | `Pass` | Signal | Existing owners with bounded deltas (`+23/-15` or smaller except ordinary line movement); no new concern conflation. | Pass | `Pass` | None. |
| `root-team-run.ts`; Team definition form; application-bundle/agent-definition providers; Team run manager | `478`, `455`, `453`, `443`, `424` | `Pass` | Signal | Existing cohesive owners; Team manager delta extracts materialization and removes recursive responsibilities. | Pass | `Pass` | None. |
| `flat-team-execution-manager.ts` | `381` | `Pass` | Signal | Cohesive rootless Team execution owner, extracted/renamed from prior local Team runtime. | Pass | `Pass` | None. |
| Standalone host; Codex bootstrapper; general process supervisor; Team event adapter | `373`, `371`, `364`, `357` | `Pass` | Signal | Existing lifecycle owners with bounded subject-registration/supervision changes. | Pass | `Pass` | None. |
| `agent-org-flat-team-families-v1-app-data-migration.ts` | `365` | `Pass` | Signal | Correct migration owner and cohesive inventory, but definition transition ordering/retry is incorrect. | Pass | `Local Fix` | `CR-FIND-001`, `CR-FIND-002`. |
| Team GraphQL; studio composition; application execution scope builder; predecessor Team-run migration; launch baseline builder | `349`, `338`, `325`, `318`, `313` | `Pass` | Signal | Existing API/composition/migration owners; deltas remain responsibility-aligned. | Pass | `Pass` | None. |
| `root-task-lifecycle-engine.ts` | `318` | `Pass` | Signal | Cohesive selector-free root task lifecycle policy shared through narrow adapters. | Pass | `Pass` | None. |
| `AgentOrgExperience.vue` | `305` | `Pass` | Signal | Correct product-surface placement; cohesive catalog/detail/create/edit controller, but its update payload loses durable fields. | Pass | `Local Fix` | `CR-FIND-003`. |
| `agent-org-run.ts`; configured Agent handle | `300`, `292` | `Pass` | Signal | Cohesive Org aggregate and root-neutral configured-Agent execution owner. | Pass | `Pass` | None. |
| Team definition store; server runtime; adaptive layout; Team run service; Agent GraphQL | `291`, `287`, `278`, `277`, `277` | `Pass` | Signal | Existing API/UI/composition owners with bounded flat-family changes. | Pass | `Pass` | None. |
| Root run readiness index; Handoff manager | `270`, `263` | `Pass` | Signal | Cohesive current-package readiness and owner-scoped authoring components. | Pass | `Pass` | None. |
| Team and Org task lifecycle adapters | `252`, `251` | `Pass` | Signal | Subject-private translations around the shared task engine; no generic persistence owner leaked. | Pass | `Pass` | None. |
| Team execution-view projector/index; Team definition service; Team memory explorer | `243`, `234`, `233`, `233` | `Pass` | Signal | Existing subject/query owners with bounded strict-family changes. | Pass | `Pass` | None. |
| Global message router; shared run-tree schemas; Team tree-location service | `230`, `229`, `228` | `Pass` | Signal | Exact family/identity routing and genuinely shared child schemas; placement is justified. | Pass | `Pass` | None. |
| Team persistence coordinator; Org root-Agent registry; memory classifier; team-local Agent discovery | `225`, `225`, `225`, `222` | `Pass` | Signal | Cohesive persistence/registry/location/discovery owners; bounded changes or focused new Org registry. | Pass | `Pass` | None. |

## Legacy / Backward-Compatibility Verdict

| Check | Result | Notes |
| --- | --- | --- |
| No backward-compatibility mechanisms in changed scope | `Pass` | Retired definition/runtime decoders are confined to the registered migration. |
| No legacy old-behavior retention in changed scope | `Pass` | Normal providers/admission require exact Team V2/Org V1; configured recursion is not retained. |
| Dead/obsolete code cleanup completeness in changed scope | `Pass` | No actionable dormant compatibility owner or stale recursive test found. |
| Approved persisted-data transition decision is followed without unnecessary migration work | `Fail` | The migration decision is correct, but definition conversion violates complete preflight and retry safety. |
| No version-specific dual reads/writes or request-time old-shape fallback exists | `Pass` | No normal runtime fallback found. |
| Approved transition mechanics match the reviewed design, including migration safety only when required | `Fail` | `CR-FIND-001` and `CR-FIND-002` contradict explicit migration mechanics. |

## Dead / Obsolete / Legacy Items Requiring Removal (Mandatory If Any Exist)

None.

## Docs-Impact Verdict

- Docs impact: `Yes`
- Why: This Large/High cutover changes public Team/Org definition, runtime, migration, GraphQL/stream, and product workflows; delivery documentation must describe strict flat Teams, AgentOrg configuration/focus, two-family persistence, and startup migration/restart behavior. Review artifacts must also be updated after fixes.
- Files or areas likely affected: server migration/architecture/README guidance, web Agent Team/Org product documentation (including stale recursive-Team descriptions), API/stream contract docs, and ticket handoff/revision artifacts. Delivery owns final docs sync.

## Additional Material Premise Validation (When Required)

### Upstream Design-Review Material-Premise Decisions

| Premise ID | Current Status | Changed Evidence / Reason |
| --- | --- | --- |
| `AR-PREM-001` | `Confirmed` | The operational interruption/restart category remains explicitly supported; implementation does not satisfy it for Org definitions with an owned Team (`CR-FIND-002`). |
| `AR-PREM-002` | `Confirmed` | No evidence requiring extra recovery machinery; the bounded fix is exact prospective-state recognition in the existing migration. |
| `AR-PREM-003` | `Confirmed` | External repositories remain read-only/out of ticket write scope; no contradictory implementation evidence found. |

No new or reclassified premise is required beyond the supported scenarios above.

## Review Scorecard (Mandatory)

- Overall score (`/10`): `8.7/10`
- Overall score (`/100`): `86.6/100`
- Score calculation note: Simple average of the ten mandatory categories. The fail decision follows the below-threshold categories/findings, not the average.

| Priority | Category | Score | Why This Score | What Is Weak / Holding It Down | What Should Improve |
| --- | --- | --- | --- | --- | --- |
| `1` | `Data-Flow Spine Inventory and Clarity` | `8.3` | Major definition/runtime spines are explicit and owned. | `CR-CAND-001`/`002` leave the definition migration mid-transition; `CR-CAND-003` loses loaded state between UI and service. | Make each path preserve a complete, valid state across its full lifecycle. |
| `2` | `Ownership Clarity and Boundary Encapsulation` | `9.3` | Team/Org owners and shared root-neutral capabilities are cleanly separated. | Minor complexity is inherent in the number of private adapters. | Preserve these boundaries while fixing local paths. |
| `3` | `API / Interface / Query / Command Clarity` | `9.1` | Subject tags, exact identity shapes, GraphQL families, and partial update semantics are explicit. | The UI misuses otherwise-correct partial update semantics. | Omit unchanged fields from the update payload. |
| `4` | `Separation of Concerns and File Placement` | `9.0` | New files are responsibility-aligned and below the hard size limit. | Migration/UI files carry dense lifecycle logic, though still cohesive. | Keep fixes within current owners and avoid adding recovery layers. |
| `5` | `Shared-Structure / Data-Model Tightness and Reusable Owned Structures` | `9.2` | Strict family roots are separate while actual common records/policies are shared. | No material model defect found. | Maintain exact-family specialization. |
| `6` | `Naming Quality and Local Readability` | `9.0` | Names generally identify subject, family, and responsibility precisely. | Some dense frontend/runtime files require careful tracing. | Keep regression fixes conventionally formatted and locally explicit. |
| `7` | `API/E2E Readiness` | `8.0` | Builds and broad focused tests passed at implementation scope. | Required definition-migration preflight/relaunch and hidden-field preservation scenarios are absent; current passing tests mask the defects. | Add targeted tests and return a corrected package before API/E2E. |
| `8` | `Runtime Correctness And Behavioral Fidelity` | `7.4` | Most strict family/runtime behavior matches the design. | Three promoted supported scenarios produce destructive or non-retryable outcomes. | Resolve `CR-FIND-001`–`003` and revalidate the forward paths. |
| `9` | `No Backward-Compatibility / No Legacy Retention` | `9.1` | Legacy decoding remains migration-only and no normal fallback was found. | Prospective-state retry must not be implemented as a legacy runtime reader. | Fix only the migration classifier, preserving the forward-only boundary. |
| `10` | `Cleanup Completeness` | `8.2` | Retired authorities are removed after successful migration and obsolete recursive code is largely gone. | Supported failed/interrupted definition paths leave a mixed retired/current source that ordinary retry cannot clean. | Complete preflight and exact prospective-state cleanup/retry. |

## Findings

### `CR-FIND-001` — Definition migration mutates an item before complete fixed-depth preflight and loses the invariant reason

- Status: `Open — blocking`
- Classification: `Local Fix`
- Promoted candidate / supported scenario: `CR-CAND-001` / `CR-SCN-001`
- Affected authority: `BEH-007`; `REQ-012`, `REQ-013`; `AC-008`; `QR-003`; design migration preflight contract.
- Evidence: `agent-org-flat-team-families-v1-app-data-migration.ts:160-174` decodes, target-validates, and immediately writes each child at line 164. Only later children and the parent Org target are validated. The catch records only `FAILED_DEFINITION`; `add()`/`result()` at lines 354–369 retain category/count/path but not the thrown invariant reason.
- Forward path and consequence: On required startup, a valid first owned Team becomes V2; a later deeper Team fails; the root stays legacy. The affected item was mutated despite `REQ-013`, and the next retry cannot pass the retired child decoder.
- Reviewer verification: `/tmp/aorg-review-migration-probe.mjs` created a legacy root with valid `child-a` and invalid deeper `child-b`, then ran the production migration twice. Both attempts returned `FAILED`; `child-a` had `schemaVersion:2`/no `refType`, the root remained unversioned and present. Output: `/tmp/aorg-review-migration-probe.log`.
- Required action: Decode the complete root and all direct owned child sources, transform and exact-target-validate the whole definition package in memory, and prove destination/fixed-depth constraints before the first write. On unsupported input, preserve the original item and record the bounded path plus actual invariant reason. Add a focused definition-migration test with a valid earlier child and invalid later child that asserts byte-faithful no mutation and an actionable failure disposition.

### `CR-FIND-002` — Org definition migration cannot resume its approved prospective state after process interruption

- Status: `Open — blocking`
- Classification: `Local Fix`
- Promoted candidate / supported scenario: `CR-CAND-002` / `CR-SCN-002`; `AR-PREM-001`
- Affected authority: `BEH-007`; `REQ-012`, `REQ-013`, `REQ-027`; canonical migration convention; design “Ordinary relaunch/idempotence.”
- Evidence: After line 164 commits an owned child as exact V2, the root remains legacy until the later direct rename at line 169. A later execution always invokes `legacyConfig()` on that child at line 162; it has no branch for the exact prospective V2 child explicitly required by the design.
- Forward path and consequence: A normal process termination after the atomic child write leaves a deterministic prospective source. Ordinary later startup marks the same item failed, leaves the source family in place, and never reaches rename/cleanup, so the required startup migration is not idempotently retryable.
- Reviewer verification: `/tmp/aorg-review-interruption-probe.mjs` ran the production migration in a subprocess with an atomic writer that exited `77` immediately after the first committed child write, then ran the ordinary production migration. Retry returned `FAILED`, source remained, target was absent, and the child was already V2. Output: `/tmp/aorg-review-interruption-probe.log`.
- Required action: In this migration only, recognize and exact-validate the approved prospective observation: legacy root plus already-current direct owned children and, when present, valid prospective Org files. Complete remaining writes, direct rename, target reread, and retired-file cleanup through the existing runner. Do not add a journal, backup, legacy runtime reader, or second recovery framework. Add one subprocess/interruption-or-equivalent relaunch test with an owned Team and assert the second ordinary run succeeds and cleans retired authorities.

### `CR-FIND-003` — Saving an existing Org clears durable fields that the edit UI does not expose

- Status: `Open — blocking`
- Classification: `Local Fix`
- Promoted candidate / supported scenario: `CR-CAND-003` / `CR-SCN-003`
- Affected authority: `BEH-001`, `BEH-002`, `BEH-006`; `REQ-012`, `REQ-023`, `REQ-024`; `AC-017`–`AC-019`.
- Evidence: `AgentOrgExperience.vue:302-314` uses one create/update object with `instructions:''`, `category:null`, `avatarUrl:null`, and `defaultLaunchConfig:null`. `agentOrgDefinitionStore.ts:52-57` forwards those values. `AgentOrgDefinitionService.updateDefinition()` at lines 64–71 preserves only omitted/`undefined` fields, so explicit empty/null values replace the loaded definition. The existing component test fixture initializes every affected field to the same empty/null value and therefore cannot detect loss.
- Forward path and consequence: A normal Org author opens edit, changes a name/member/handoff, and saves. Migrated `org.md` instructions and configured root launch defaults are cleared; category/avatar are also erased. Later execution no longer uses the preserved Org instruction/default seed.
- Required action: Separate create defaults from update semantics. For edit, either omit untouched fields (the existing backend contract already preserves them) or round-trip the exact loaded values; do not fabricate empty/null changes. Add a component/mutation test with nonempty instructions, category, avatar, and default launch config, save a supported visible edit, and assert the update preserves all hidden values and ordered handoffs.

## Classification

- Current classification: `Local Fix`
- Rationale: All three findings have approved behavior and a bounded implementation-owned correction in existing owners. No requirement or architecture artifact needs to change.

## Recommended Recipient

- `implementation_engineer`
- The corrected package must return through independent implementation review before API/E2E.

## Residual Risks

- This review sampled the Large/High cumulative delta by behavior spine, ownership boundary, all size signals, and high-risk migration/persistence/UI paths; API/E2E remains necessary after source correction.
- IR-002's unrelated repository-wide server and web typecheck baselines were not independently reclassified here.
- External definition repositories remain separately owned and unmodified; target publication/readiness remains a downstream external dependency.
- Round 2's fresh inventory confirms the user's production fact: all 45 readable TeamRun roots are flat or one-level and all inspected definition roots have no grandchild Team. `CR-FIND-001` does not require deep conversion; it enforces the separately approved fail-before-write disposition if `PRE-002` is unexpectedly false. `CR-FIND-002` uses an ordinary valid one-level source and is independent of deeper topology.

## Latest Authoritative Result

- Review Decision: `Fail`
- Review Entry Point: `Implementation Review`
- Supported Product Scenario Gate (`Pass`/`Fail`/`Blocked`): `Pass — every promoted candidate is grounded in a supported normal or explicit-edge scenario`
- Material-Premise Gate (`Pass`/`Fail`/`Blocked`): `Fail — confirmed AR-PREM-001 is not satisfied by the implementation`
- Score Summary: `8.7/10 (86.6/100)`; categories 1, 7, 8, and 10 remain below the clean-pass threshold.
- Failure Origin (when applicable): `N/A — implementation review`; defects are implementation-owned.
- Recommended Recipient (when applicable): `implementation_engineer`
- Notes: `CR-FIND-001`–`CR-FIND-003` remain blocking Local Fix findings after round-2 reconsideration. The fresh inventory confirms `PRE-002`; it does not supersede the explicit `REQ-013` zero-write invariant or the convention-required interruption/relaunch contract. Existing focused tests pass but omit these scenarios; do not route to API/E2E until correction and code-review re-entry.
