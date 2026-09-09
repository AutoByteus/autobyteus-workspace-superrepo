# Code Review Report — stopped-run-compatible-model

## Review Round Meta

- Review Entry Point: **Implementation Review**, initial full source/structural review, 2026-09-08.
- Current Code Review Revision ID / round / latest authoritative round: **CRR-001 / 1 / 1**.
- Prior review: **N/A — no prior code-review result or record; no Pass inferred**.
- Trigger: Implementation Engineer's initial completed Medium/High package, **IR-001**.
- Canonical worktree: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model`.
- Branch/base: `requirements/stopped-run-compatible-model` / `a32b53f6320222c9bf3c7f3a4a3c50fbd1e44f27`.
- Reviewed production/test commit: `083387598db6e470078f5637f2f95b666fabe9e5`; handoff HEAD: `571069feaa66d1a6ed5a8bf4a26a92826e910827`.
- Requirements, investigation and requirements revisions reviewed: `requirements-doc.md`, `investigation-notes.md`, `requirements-revision-record.md`; **Approved RER-004**.
- Design/revision reviewed: `design-spec.md`, `architecture-design-revision-record.md`; **AD-REV-001**.
- Architecture review/revision reviewed: `design-review-report.md`, `architecture-review-revision-record.md`; initial **ARCH-REV-001**, latest **ARCH-REV-002 Pass**. AR-N01 is resolved; the stale initial handoff wording does not supersede the canonical architecture report or IR-001 informational annotation.
- Implementation handoff/revision reviewed: `implementation-handoff.md`, `implementation-revision-record.md`; **IR-001** including its ARCH-REV-002 annotation.
- Code Review Revision Record: `code-review-revision-record.md` (created with CRR-001).
- Supplements reviewed: retained native-budget and architecture-runtime-capacity source/result pairs; implementation capacity source/result; source-size inventory; local-check README and logs; render inspection source/result, Agent saved and narrow Team screenshots. All are evidence, not normative target mockups or live feature acceptance.
- Original user screenshot: retained absolute reference in requirements/investigation; upstream existing-surface evidence, not a target visual specification.
- Prototype/Product Design/UI-UX specification: **N/A — not applicable**.
- Coverage investigation, execution coverage report, API/E2E revision, delivery revision and triggering downstream failure: **N/A — not yet performed**. This is not an API/E2E failure-origin review or successful-test review.
- Focused failing approved scenario: **SCN-005**. Reproduction command/evidence: `evidence/code-review/README.md`, `team-readback-probe.mjs`, `team-readback-probe-result.json`, `team-readback-probe.log` in that directory.

Ticket-relative artifact paths above share this report's directory. Source abbreviations below: **S** = `autobyteus-server-ts/src`, **W** = `autobyteus-web`, **C** = `autobyteus-ts/src`, all relative to the worktree. Review authority: code-reviewer skill, full report template, shared design principles and scenario Examples 9/10; Server/Web AGENTS.md read.

## Routing Classification Review

- Task size: **Medium — confirmed**.
- Architectural risk: **High — confirmed**.
- Selected route: **Implementation Review**; independent source review required: **Yes**.
- Basis: bounded existing-surface extension, but newly mutable persisted model, required API/canonical-pair change, shared Save/restore transitions and external metadata authority. No local downgrade or new architectural classification is needed.

## Review Scope

Reviewed the complete Settings → coherent draft → subject GraphQL → Studio ownership → lifecycle/Team manager → selection/schema/capacity → pair/tree commit → canonical UI path, plus normal saved-config restore into native/Codex/Claude and configured members. Audited the changed assembly roots, domain values, metadata adapters, forms, shared picker, projection/draft/store/client contracts, generated GraphQL delta, translations, removed validator and relevant test adaptations.

Excluded: requirements reapproval, new runtime/scope/compatibility rules, compaction redesign, migration, raw metadata/task editing, multi-browser merge protocols, full provider acceptance and delivery. No implementation or durable-test fix was made by the reviewer. Reviewer changes are this report/record and bounded evidence only.

### Independent verification

- Server TypeScript build: **Pass**; rebuilt current source before the diagnostic probe.
- Focused server: **49/49 tests**, 6 files; focused Web: **22/22 tests**, 4 files.
- Current Team writer/manager/Studio/resolver-method probe: **CRF-001 reproduced in two separately identified post-write cases**. The script succeeds when it records the expected defect; this is not a passed product scenario.
- Changed source audit: **47 manual source files**, no >500 nonempty lines or >220 total line delta; one regenerated GraphQL output separately excepted. Diff hygiene and removed-contract search passed.
- Retained implementation tests/render/metadata results are not relabelled reviewer execution. Three static architecture failures are evidenced at both current and pristine approved base; no blanket suite pass and no new source defect attributed to those failures.
- Exact commands, limits and logs: `evidence/code-review/README.md`.

## Upstream Behavior And Production-Path Basis Confirmation

Approved intent remains clear: fixed runtime, verified positive replacement context >= freshly saved current context per scope, explicit stopped Save, then same-conversation normal resume. Existing schema/defaults, original Team links, ownership/lifecycle and canonical verification are contractual, not new reviewer policies. No new behavior ID or intended-behavior gap is introduced.

**Behavior-basis status: Confirmed as authority; implementation fidelity is Contradicted for BEH-002's Team uncertainty return path.** Other source paths are confirmed within the source-review boundary; provider execution remains unproven here.

| Behavior ID | Current Status | Current Implementation Path / Lifecycle Evidence | Contradiction |
| --- | --- | --- | --- |
| BEH-001 | Confirmed | ExistingRunConfigEditor → Agent/Team forms → RuntimeModelConfigFields; runtime fixed, pair events, model-only dirtiness, stopped/root eligibility and explicit Save/discard | None |
| BEH-002 | Contradicted (bounded recovery branch) | Resolvers → StudioRunModelConfigService → standalone lifecycle / Team manager → RunModelSelectionService → Agent commit / Team tree write. Required pair, target schema, fresh baseline, no-op/read-back otherwise present | Team post-write read throws before outcome handling; canonical verification is skipped, CRF-001 |
| BEH-003 | Confirmed | existingTeamModelConfigDraft retains original runtime/model/config links and sticky direct edits; configured target resolver excludes tasks; validateMany completes before one tree write | No propagation/topology contract gap found |
| BEH-004 | Confirmed at source boundary | standalone restoreStarted/buildConfig and tree reconstruction → mixed member buildAgentRunConfig → existing backend restore with saved pair/provider binding; Codex thread/resume includes old threadId and new model | Live replacement continuation not yet acceptance-tested |
| BEH-005 | Confirmed at source boundary | No Save imports/calls into memory/compaction; pair-only metadata/tree replacement; ordinary native restore/compaction and external binding paths remain unchanged | Already-compacted execution remains downstream |
| BEH-006 | Confirmed | Subject options → one selection owner → runtime capacity adapters; exact positive capacities, current baseline, no output/input/threshold/tokenizer gate, same-model capacity bypass | Private/runtime metadata drift remains a named validation risk, not a new defect |

### Spine inventory confirmed against code

| Spine | Forward production path / owner / meaningful outcome |
| --- | --- |
| DS-01 choices | Settings → subject options query → Studio canonical reader → selection owner → catalog/runtime evidence → per-scope eligible choices |
| DS-02 Agent Save | Agent form → draft/client/GraphQL → Studio → standalone transition → selection validation → metadata pair commit → canonical result |
| DS-03 Team Save | Configured form → original-link planner/patches → GraphQL/Studio → root transition → all scope validation → one tree write → canonical tree |
| DS-04 Agent continuation | Normal message/restore → standalone lifecycle → saved metadata/buildConfig → backend/provider or native restore → same-run next turn |
| DS-05 configured continuation | Normal Team resume → saved tree reconstruction → lazy configured member → saved pair/backend restore → configured-member conversation |
| DS-06 return/recovery | Owner result → GraphQL → mutation client/store → canonical history/config projection → visible pair; indeterminate outcome → refresh/retry. CRF-001 breaks this outcome path on Team read-back error |
| DS-07 transition (local) | Existing per-run/per-root lane → fresh saved state → guards → validation → write/read-back → release; no new lock owner |
| DS-08 propagation (local) | Original links → explicit pair update → bounded linked-child traversal → changed-pair patches; automatic defaults do not create explicit edits |
| DS-09 compaction (local) | Existing restored memory → ordinary model-derived budget/usage → runtime-owned compaction/lineage; not on Save spine |
| DS-10 metadata (local) | Runtime/workspace launch → exact catalog/control evidence → capacity normalization → cleanup; request-local coalescing, not cross-Save evidence reuse |

## Supported Product Scenario And Reachability Gate

| Scenario ID | Behavior / contract | Kind / initiator | Coherent goal / independent entry | Shape | Forward path / lifecycle / expected consequence | Independent evidence | Validity / use |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCN-001 | BEH-001/002/004; REQ-001–004/006 | User / Studio user | Change a stopped Agent's model in existing Settings, Save, send normal next message | Normal | DS-01/02/04/06/07; present unarchived stopped run → coherent saved pair, still stopped → same identity/context on resume | RER-004; Settings editor, lifecycle, commit and backend sources | Supported Normal Scenario / Use |
| SCN-002 | BEH-003; REQ-005 | User / Team operator | Change root, nested or configured-member model in Team Settings | Normal | DS-03/05/08; original linked scopes follow, explicit/divergent/mixed-runtime branches remain; all validate before tree write | RER-004, configured UI/planner/target resolver/tree builder | Supported Normal Scenario / Use |
| SCN-003 | BEH-004/005; REQ-007 | System / ordinary continuation | Resume an already-compacted saved conversation after model Save | Normal | DS-04/05/09; retained provider binding/native context → existing restore and future compaction, no Save-time history reset | RER-004, saved-pair restore and unchanged memory/compaction code, upstream native budget evidence | Supported Normal Scenario / Use; live validation pending |
| SCN-004 | REQ-001/006; AC-006 | Contract / activation or ownership event | Enforce explicitly approved stop-only Save versus normal activation/live ownership | Explicit Edge | Studio guard and DS-07 lanes → activation-first refuses Save; Save-first restore reads commit; archive stays locked | RER-004's explicit concurrency/ownership contract, lifecycle/manager and Studio guard | Supported Explicit Edge Scenario / Use; no invented multi-tab merge |
| SCN-005 | BEH-002; REQ-006; AC-007; AD-D02 | Contract / Save outcome verification | User saves reviewed selection; committedness/canonical outcome is uncertain and must be verified before further Save | Explicit Edge | DS-03/06/07; post-write uncertainty → indeterminate outcome → canonical network refresh and Retry if needed | Explicit approved scenario/AC, design's write/read-back recovery contract; current writer and store error contracts | Supported Explicit Edge Scenario / Use; CAND-001/002 |
| SCN-006 | BEH-006; REQ-002/003/008 | User / picker | Find a verified eligible replacement without losing current-model settings editing | Explicit Edge | Runtime-scoped options/evidence → exact comparison; unknown not guessed; same-model schema path independent of capacities | RER-004, nullable catalog evidence, selection/capacity/control source | Supported Explicit Edge Scenario / Use |
| SCN-X01 | Excluded scope | Internal caller, no approved actor goal | Raw metadata/task-history mutation is not a Settings action | Excluded | Current configured-only UI/planner/target resolver does not expose it | Approved exclusion; configured tree traversal never edits taskExecutions | Technically Possible but Unsupported/Contrived; Not Reachable in approved workflow / Reject |

### Candidate Finding And Mechanism Gate

| Candidate ID | Observation / mechanism | Scenario / contract | Independent trigger | Forward lifecycle / consequence | Evidence | Disposition / proportionate response |
| --- | --- | --- | --- | --- | --- | --- |
| CAND-001 | Team post-commit read error loses uncertainty classification | SCN-005; REQ-006, AC-007; AD-D02/DS-06 | Explicit Save canonical-verification contract applies when the post-write read fails; no user concurrency or arbitrary file deletion required | Actual committed write → read throws → resolver INTERNAL_ERROR/null tree → Web skips reconciliation; updated pair remains unverified in UI | Manager:290–301; resolver:249–282; store:35,431–442; current store propagates non-ENOENT reads; probe case `committed` | Promote → CRF-001. Return through existing indeterminate/verification path for post-write uncertainty |
| CAND-002 | Known post-rename uncertainty can also be erased by read error | SCN-005; same explicit contract | Existing physical writer's post-rename finalization outcome requires canonical verification; subsequent read is unavailable | Writer returns renamed_finalization_indeterminate → unconditional read throws before outcome branch → same INTERNAL_ERROR and missed verification | TeamRunFileCommitWriter finalization contract; Manager:290–299; probe case `renamed_finalization_indeterminate` | Promote → same CRF-001. Preserve the known uncertain outcome even if read-back fails; no new recovery protocol |
| MECH-001 | Fail-unknown capacity and same-model bypass | SCN-006; AD-D01 | Approved verified-capacity rule and observed nullable/runtime-specific catalogs | Saved scope → exact availability + runtime provenance → known positive comparison or unavailable options; unchanged identifier skips capacity lookup | RunModelSelectionService, runtime capacity service, Codex/Claude adapters, focused tests and retained metadata evidence | Promote — appropriate existing-design mechanism; no finding |
| MECH-002 | Existing transition lanes and Studio owner guards | SCN-004; AC-006 | Explicit Save/activation and live-owner contract | Existing per-run/root authority serializes Save/restore; Studio refuses live/uncertain ownership | Lifecycle/manager, Studio service, composition wiring and lifecycle tests | Promote — preserved, not a new distributed lock requirement |
| MECH-003 | Existing canonical refresh/retry | SCN-005; AC-007 | Approved indeterminate Save outcome | Store locks duplicate Save → refresh canonical subject → install pair/tree or expose retry | Store:418–451, editor retry visibility, Agent uncertain-commit tests | Promote — keep this mechanism; fix Team outcome delivery per CRF-001 |
| MECH-004 | Sticky explicit edits versus automatic target defaults | SCN-002; REQ-004/005 | Team user changes parent target then reviews/edits configured descendants | Pair reset/default events → original-link planner; automatic defaults do not detach branch, explicit changes do | ModelConfigSection tracking, pair-only form handlers, planner; retained render evidence and focused tests | Promote — bounded implementation of approved semantics |
| CAND-X01 | New task/history editor, migration, or arbitrary-file recovery | SCN-X01 / explicit non-goals | No approved initiating action or governing contract | Not reachable through configured Settings; tests/internal methods cannot authorize it | Scope guard and production traversal | Reject — no finding, deduction or machinery |

No held candidate or unresolved material scenario basis. CAND-001 and CAND-002 are distinct read-back conditions under the **explicit existing uncertainty contract**; neither claims all infrastructure faults are newly in scope. The probe reproduces that contract and confirms the branch; it does not establish scenario validity by itself.

## Structural / Design Checks

| Check | Result | Evidence | Required Action |
| --- | --- | --- | --- |
| Task design health assessment present, evidence-backed, preserved | Pass | Bounded missing-invariant/pair refactor matches AD-REV-001; local recovery defect does not require changing ownership | CRF-001 local outcome correction only |
| Matches approved behavior-defining supplements | Pass | Budget probe retained as caveat, not gate; no normative target UI supplement | None |
| Data-flow spine inventory clarity and structural preservation | Pass | DS-01–10 remain recognizable; DS-06 behavioral exception separately recorded | CRF-001; no spine redesign |
| Ownership boundary preservation and clarity | Pass | Studio, lifecycle/root manager, selection owner, stores and draft owner remain distinct | None |
| Off-spine concern clarity | Pass | Schema/capacity/target mutation serve named owners, do not become execution owners | None |
| Existing subsystem reuse | Pass | Reuses catalog, runtime clients/auth, lanes, stores and controls | None |
| Reusable owned structures | Pass | Selection/capacity domain types, Web pair clone/equality, one planner | None |
| Shared structure/data-model tightness | Pass | Required pair; explicit subject identities; canonical absence distinct from null settings | None |
| Repeated coordination ownership | Pass | One selection policy; request-local context coalescing; one Team propagation planner | None |
| Empty indirection | Pass | New service validates/composes evidence; new adapters own concrete protocols; no new pass-through facade | None |
| Scope-appropriate SoC/file responsibility | Pass | Selection, schema, evidence and UI planning remain separate; changed manual sources below limits | None |
| Ownership-driven dependency | Pass | Subject transport → Studio → execution; selection → metadata/schema, no compaction/persistence shortcut | None |
| Authoritative Boundary Rule | Pass | Resolvers do not also reach Studio internals; lifecycle does not read runtime caches alongside validator; forms use draft authority | None |
| File placement | Pass | Existing llm-management, provider client, run-history, execution and Web feature folders | None |
| Flat versus over-split layout | Pass | Small pair/evidence value files and concrete readers; no folder-per-step architecture | None |
| API/query/command/service-method clarity | Pass | Required Agent pair; configured Team kind/address pair; subject-specific option queries | None |
| Naming/readability | Pass | Concrete selection/capacity/commit/draft names; normalized fields remain explicit | None |
| No unjustified duplication | Pass | Shared comparison/schema and pair utilities; provider-specific extraction is meaningfully different | None |
| Patch-on-patch complexity | Pass | Old fixed-model validator replaced, not wrapped; no second switch endpoint | None |
| Dead/obsolete in-scope path cleanup | Pass | Old validation module/contract and canonicalLlmConfig removed from executable paths; docs deferred explicitly | None |
| Relevant tests/assertions requirement-aligned | Pass | Capacity, schema, pair, links, lifecycle and keyboard cases confirm approved behavior | Add CRF-001 regression; no large-test splitting |
| Fixtures/helpers reasonably reusable; coherent structure | Pass | Existing configured-tree fixtures and bounded fake catalog/store seams; scenario-scoped files | None |
| No stale/duplicated/compatibility-only test paths | Pass | Old-validator test removed/replaced; integration/E2E deltas are current-contract adaptations, not acceptance evidence | API/E2E must execute and extend coverage after source pass |
| API/E2E readiness | **Fail** | CRF-001 evidenced in approved SCN-005 before independent acceptance | Correct locally, source re-review, then API/E2E |

## Source File Size And Structure Audit

Independent full inventory: `evidence/code-review/source-audit.json`. Effective size = nonempty physical lines; delta = additions + removals versus approved base (schema extraction conservatively counted as new path). Tests, fixtures and reviewer probes excluded. Generated GraphQL is a repository-wide regenerated output, not a manual source to split. For each manual row, SoC/placement Pass refers to its named owner in the structural review above; CRF-001 is a behavior defect, not size pressure.

| Source File | Nonempty | >500 | Delta / >220 | SoC / Placement | Classification / Action |
| --- | ---: | --- | --- | --- | --- |
| `S/agent-execution/runtime/general-process-run-supervisor.ts` | 300 | Pass | 12 / Pass | Pass / Pass | N/A; none |
| `S/agent-execution/services/agent-run-service.ts` | 273 | Pass | 1 / Pass | Pass / Pass | N/A; none |
| `S/agent-execution/services/standalone-agent-run-lifecycle-service.ts` | 391 | Pass | 25 / Pass | Pass / Pass | N/A; none |
| `S/agent-team-execution/services/agent-team-run-manager.ts` | 472 | Pass | 32 / Pass | Pass / Pass | Local Fix CRF-001; not size-driven |
| `S/agent-team-execution/services/team-run-model-config-mutator.ts` | 99 | Pass | 12 / Pass | Pass / Pass | N/A; none |
| `S/api/graphql/types/agent-run.ts` | 339 | Pass | 19 / Pass | Pass / Pass | N/A; none |
| `S/api/graphql/types/agent-team-run.ts` | 237 | Pass | 10 / Pass | Pass / Pass | N/A; none |
| `S/api/graphql/types/run-model-config.ts` | 48 | Pass | 36 / Pass | Pass / Pass | N/A; none |
| `S/application-platform/execution/application-execution-scope-contracts.ts` | 131 | Pass | 4 / Pass | Pass / Pass | N/A; none |
| `S/application-platform/execution/application-execution-scope-kernel-builder.ts` | 325 | Pass | 6 / Pass | Pass / Pass | N/A; none |
| `S/application-platform/runtime/build-application-platform-runtime.ts` | 302 | Pass | 6 / Pass | Pass / Pass | N/A; none |
| `S/compositions/build-studio-server.ts` | 328 | Pass | 17 / Pass | Pass / Pass | N/A; none |
| `S/llm-management/domain/run-model-selection.ts` | 17 | Pass | 17 / Pass | Pass / Pass | N/A; none |
| `S/llm-management/domain/runtime-model-capacity.ts` | 8 | Pass | 8 / Pass | Pass / Pass | N/A; none |
| `S/llm-management/services/model-catalog-service.ts` | 440 | Pass | 4 / Pass | Pass / Pass | N/A; none |
| `S/llm-management/services/model-config-schema-validation.ts` | 133 | Pass | 142 / Pass | Pass / Pass | N/A; none |
| `S/llm-management/services/run-model-selection-service.ts` | 116 | Pass | 121 / Pass | Pass / Pass | N/A; none |
| `S/llm-management/services/runtime-model-capacity-service.ts` | 29 | Pass | 31 / Pass | Pass / Pass | N/A; none |
| `S/run-history/services/agent-run-history-catalog-service.ts` | 474 | Pass | 2 / Pass | Pass / Pass | N/A; none |
| `S/run-history/services/agent-run-model-config-commit.ts` | 45 | Pass | 13 / Pass | Pass / Pass | N/A; none |
| `S/run-history/services/studio-run-model-config-service.ts` | 162 | Pass | 36 / Pass | Pass / Pass | N/A; none |
| `S/runtime-management/claude/client/claude-sdk-client.ts` | 477 | Pass | 17 / Pass | Pass / Pass | N/A; none |
| `S/runtime-management/claude/client/claude-sdk-context-capacity.ts` | 53 | Pass | 55 / Pass | Pass / Pass | N/A; none |
| `S/runtime-management/codex/client/codex-app-server-client.ts` | 345 | Pass | 10 / Pass | Pass / Pass | N/A; none |
| `S/runtime-management/codex/client/codex-model-capacity-reader.ts` | 102 | Pass | 106 / Pass | Pass / Pass | N/A; none |
| `S/standalone-application-host/start-standalone-application-host.ts` | 366 | Pass | 8 / Pass | Pass / Pass | N/A; none |
| `W/components/agentTeams/SearchableGroupedSelect.vue` | 239 | Pass | 34 / Pass | Pass / Pass | N/A; none |
| `W/components/launch-config/RuntimeModelConfigFields.vue` | 349 | Pass | 37 / Pass | Pass / Pass | N/A; none |
| `W/components/workspace/config/AgentRunConfigForm.vue` | 166 | Pass | 23 / Pass | Pass / Pass | N/A; none |
| `W/components/workspace/config/ExistingRunConfigEditor.vue` | 186 | Pass | 8 / Pass | Pass / Pass | N/A; none |
| `W/components/workspace/config/MemberOverrideItem.vue` | 338 | Pass | 11 / Pass | Pass / Pass | N/A; none |
| `W/components/workspace/config/ModelConfigSection.vue` | 300 | Pass | 12 / Pass | Pass / Pass | N/A; none |
| `W/components/workspace/config/TeamMemberConfigTree.vue` | 88 | Pass | 7 / Pass | Pass / Pass | N/A; none |
| `W/components/workspace/config/TeamRunConfigForm.vue` | 150 | Pass | 7 / Pass | Pass / Pass | N/A; none |
| `W/components/workspace/config/TeamScopeConfigEditor.vue` | 333 | Pass | 37 / Pass | Pass / Pass | N/A; none |
| `W/generated/graphql.ts` | 9200 | N/A generated | 154 / N/A generated | N/A regenerated output | Generated exception; no split |
| `W/graphql/mutations/runHistoryMutations.ts` | 52 | Pass | 2 / Pass | Pass / Pass | N/A; none |
| `W/graphql/queries/runModelOptionsQueries.ts` | 14 | Pass | 14 / Pass | Pass / Pass | N/A; none |
| `W/localization/messages/en/workspace.ts` | 354 | Pass | 6 / Pass | Pass / Pass | N/A; none |
| `W/localization/messages/zh-CN/workspace.ts` | 353 | Pass | 6 / Pass | Pass / Pass | N/A; none |
| `W/services/runConfigEditing/existingAgentModelConfigDraft.ts` | 35 | Pass | 12 / Pass | Pass / Pass | N/A; none |
| `W/services/runConfigEditing/existingRunModelConfigMutationClient.ts` | 50 | Pass | 5 / Pass | Pass / Pass | N/A; none |
| `W/services/runConfigEditing/existingRunModelOptionsClient.ts` | 15 | Pass | 15 / Pass | Pass / Pass | N/A; none |
| `W/services/runConfigEditing/existingTeamModelConfigDraft.ts` | 106 | Pass | 29 / Pass | Pass / Pass | N/A; none |
| `W/services/runConfigEditing/existingTeamRunFormModel.ts` | 101 | Pass | 15 / Pass | Pass / Pass | N/A; none |
| `W/stores/existingRunModelConfigStore.ts` | 453 | Pass | 68 / Pass | Pass / Pass | N/A; none |
| `W/types/agent/ExistingRunModelConfigDraft.ts` | 42 | Pass | 18 / Pass | Pass / Pass | N/A; none |
| `W/types/agent/ExistingTeamRunFormModel.ts` | 41 | Pass | 5 / Pass | Pass / Pass | N/A; none |

Deleted implementation: `S/llm-management/services/model-config-validation-service.ts`; pure schema logic preserved in `model-config-schema-validation.ts`, fixed-model entry replaced. No source-file threshold failure.

## Legacy / Backward-Compatibility Verdict

| Check | Result | Notes |
| --- | --- | --- |
| No backward-compatibility mechanisms in changed scope | Pass | Required model+explicit nullable config cutover; no old-client fallback |
| No legacy old-behavior retention | Pass | One selection validator; no fixed-model-only stopped command/response |
| Dead/obsolete path cleanup | Pass | Old validator and old-only test removed; current executable references updated |
| Approved persisted-data transition followed | Pass | Directly Usable — No Migration; Agent metadata and Team V2 already have both fields |
| No version-specific dual read/write/request fallback | Pass | Existing current-schema readers and writes used; no format branch added |
| Approved transition mechanics | Pass | Pair-only updates retain fixed identities/topology/tasks; no memory rewrite or migration boundary needed |

### Dead / Obsolete / Legacy Items Requiring Removal

No remaining material executable legacy path identified. Documentation's fixed-model description is a Delivery-owned synchronization item, not a runtime compatibility path.

## Docs-Impact Verdict

- **Yes.** Fixed-model language must describe the coherent selection, fixed runtime, verified non-decreasing context and same-model settings exception.
- Areas: `autobyteus-server-ts/docs/modules/llm_management.md`, relevant agent/team execution/stopped-settings docs, Web settings docs as applicable. Delivery owns synchronization/finalization; no claim that these are complete.

## Additional Material Premise Validation

### Upstream design-review decisions

| Premise / basis | Status | Reason |
| --- | --- | --- |
| ARCH-REV-002 confirmed SCN-001–006 and excluded SCN-X01 | Confirmed | Current product surfaces/owners and RER-004 unchanged; no new scenario invented |
| SCN-004 / existing ownership and Save/restore lane | Confirmed | No new concurrency protocol or contradictory-user workflow required |
| SCN-005 / canonical uncertainty | Confirmed as governing contract | CAND-001/002 expose incomplete implementation of the existing contract, not a changed premise |
| SCN-006 / attributable runtime metadata | Confirmed | Same-runtime evidence adapters, unknown-state handling, same-model bypass; retained production probe is feasibility, not resume acceptance |
| AR-N01 navigation observation | No Longer Relevant as an open note | ARCH-REV-002 explicitly resolves it; architecture-owned supplemental indexes suffice |

**No additional or reclassified product premise.** New technical evidence under already-approved SCN-005 is fully recorded in CAND-001/002. No raw-file deletion, corruption, task editing, migration or multi-browser merge machinery is requested.

## Review Scorecard

Overall: **9.6/10 — 96/100** (simple average; **not a Pass**). Ten-point scores indicate no evidenced material gap within this source-review scope, not universal correctness. The two deductions cite the single promoted recovery finding; no pending live acceptance or rejected scenario is scored as a defect.

| Priority | Category | Score | Why | Concrete weakness / drag | Expected improvement |
| --- | --- | ---: | --- | --- | --- |
| 1 | Data-Flow Spine Inventory and Clarity | 10.0 | All primary, return and local spines traceable to concrete owners | None in structural clarity; DS-06 runtime exception scored below | Preserve inventory |
| 2 | Ownership Clarity and Boundary Encapsulation | 10.0 | Authoritative boundaries preserved; no mixed-level dependency | None found | Preserve owners |
| 3 | API / Interface / Query / Command Clarity | 10.0 | Required pair and explicit Agent/Team scope identities | None in interface shape | Preserve clean cutover |
| 4 | Separation of Concerns and File Placement | 10.0 | Domain selection versus schema versus provider evidence is clear | No material placement/size gap | Keep bounded local correction |
| 5 | Shared-Structure / Data-Model Tightness and Reusable Owned Structures | 10.0 | Tight pair/capacity types; original and draft state have distinct meaning | None found | Preserve shared invariant |
| 6 | Naming Quality and Local Readability | 10.0 | Concrete concerns and explicit selection/canonical fields | No material readability defect | No refactor prescribed |
| 7 | API/E2E Readiness | **8.0** | Useful focused evidence and clear pending acceptance gates | CAND-001/002: known SCN-005 defect must not advance as ready | Add bounded regression and correct CRF-001 before source pass |
| 8 | Runtime Correctness And Behavioral Fidelity | **8.0** | Normal pair/capacity/propagation paths align with approved behavior | CAND-001/002: Team read-back error masks indeterminate outcome and misses canonical verification | Preserve uncertain outcome through existing owner/result/reconciliation path |
| 9 | No Backward-Compatibility / No Legacy Retention | 10.0 | Old validator/response removed, no runtime version branch or migration | None found | Preserve clean current contract |
| 10 | Cleanup Completeness | 10.0 | Required obsolete executable paths removed; generated outputs/test adaptations accounted for | No material in-scope cleanup defect; docs explicitly Delivery-owned | Delivery docs sync after validation |

## Findings

### CRF-001 — Preserve Team post-write uncertainty when canonical read-back fails

- **Severity:** Medium; **blocking source-review finding**. **Classification: Local Fix — implementation-owned.** Candidate basis: CAND-001/002; approved **SCN-005, BEH-002, REQ-006, AC-007**, reviewed **AD-D02 / DS-06/07**.
- **Location:** `S/agent-team-execution/services/agent-team-run-manager.ts:290–301` (unconditional read at line 291 before physical-outcome handling). Downstream evidence: `S/api/graphql/types/agent-team-run.ts:249–282`; `W/stores/existingRunModelConfigStore.ts:35,431–442`; `W/components/workspace/config/ExistingRunConfigEditor.vue` Retry condition.
- **Supported trigger:** a user saves a valid model/settings pair on a stopped configured Team; the explicitly supported Save uncertainty contract applies when post-write canonical verification fails. This is not inferred from raw-file mutability or a contradictory concurrent action.
- **Observed path:** after an actual committed write, a read-back error escapes the Team manager. It also escapes after the writer explicitly reports `renamed_finalization_indeterminate`, before that outcome is handled. The resolver returns `INTERNAL_ERROR` and null canonical tree. Web reconciliation is entered only for `PERSISTENCE_INDETERMINATE`; thus no canonical refresh or in-place verification Retry is requested, though the stored model has changed.
- **Evidence:** rebuilt current-source probe records one actual tree write and persisted model `new` in both distinct cases, with `INTERNAL_ERROR`, `editable:false`, null canonical tree and `storeWillReconcile:false`. Source and JSON/log are in `evidence/code-review/`. Physical writer/current schema/manager/Studio/resolver method are real; valid selection and ownership are fake boundaries; no browser/network/provider acceptance is claimed.
- **Material consequence:** the UI is locked on a generic error without the approved outcome-verification path and continues displaying the unverified draft/canonical basis. Closing/reopening may recover, but it is not the specified explicit uncertainty refresh/retry behavior. **No duplicate Save, data loss or new conversation is claimed** for the reproduced error cases.
- **Proportionate correction:** handle post-write read-back failure within the existing Team Save owner; preserve known post-rename uncertainty and emit the existing indeterminate outcome when canonical committedness cannot be verified. Keep existing canonical refresh/retry and duplicate-Save lock; do not introduce rollback writes, new locks, revision protocols or global infrastructure recovery. Add regression coverage for the manager/transport outcome and Web verification/retry path.
- **Attribution/fairness:** the unguarded Team read-back branch existed at the approved base. This is an inherited gap in an explicitly preserved in-scope contract, not a newly introduced line-level regression, new requirement, or presumed failure of a prior code review. Agent commit already handles analogous read-back uncertainty. The reviewed design is adequate; no architecture/requirements revision is needed for this bounded correction.

## Classification

**Local Fix — implementation-owned**, CRF-001. No Design Impact, Requirement Gap, or Unclear issue; task size Medium and architectural risk High remain unchanged. Pass is an outcome, not a failure classification.

## Recommended Recipient

**`/software_engineering_team/implementation_engineer`**, confirmed by `get_handoff_rules`: “When source review identifies an implementation-owned Local Fix or packaging defect that must be corrected before executable coverage.” This is the single most-specific applicable rule. Do not advance to API/E2E. After correction: updated implementation record/handoff → independent source re-review (CRF-001 first) → API/E2E → proportional test-code review → delivery according to each stage's completed-result rules.

## Residual Risks

1. Mandatory real supported Settings → Save → normal Codex resume must prove actual changed-model use, unchanged local run/provider conversation ID and retained prior context. Metadata-only observations and self-reported model names are insufficient.
2. Configured-member/nested continuation and already-compacted history remain mandatory; no Save-time history/compaction reset or fallback conversation. Ordinary later budgets/compaction may differ.
3. Runtime capacity adapters depend on exact launch/auth/profile and current provider metadata. Retained positive Codex/Claude metadata observations are timestamped environment evidence only; universal metadata coverage is not required, and all-targets-disabled delivery is not acceptable.
4. API/E2E must execute required-pair/schema/canonical/ownership/archive/Save–resume ordering and negative capacity cases, not count mechanical fixture updates as execution.
5. Full Web typecheck/build, broad API/E2E and desktop shell were not performed here. Retained three pre-existing architecture inventory/cast failures and two untracked local SDK dist directories remain visible; neither is hidden as a pass nor swept into this finding.
6. Delivery owns documentation sync, integration, finalization and terminal handoff. No delivery approval is given.

## Latest Authoritative Result

- Review Decision: **Fail — bounded Local Fix CRF-001**.
- Review Entry Point: **Implementation Review**, **CRR-001**.
- Supported Product Scenario Gate: **Pass** — all scored/promoted candidates have approved independent basis; no held/contrived candidate drives the result.
- Material-Premise Gate: **Pass** — no new or reclassified premise.
- Score Summary: **9.6/10 (96/100)**; API/E2E Readiness and Runtime Correctness are each **8.0**, so overall average cannot authorize Pass.
- Failure Origin: **N/A — not an API/E2E failure-origin entry point**. One independently reproduced implementation-owned recovery gap.
- Recommended Recipient: **`/software_engineering_team/implementation_engineer`** via the confirmed source-review Local Fix rule; no API/E2E advancement.
- Notes: approved RER-004, AD-REV-001, latest ARCH-REV-002 and IR-001 preserved; source fixes/re-review and all independent acceptance gates remain required.
