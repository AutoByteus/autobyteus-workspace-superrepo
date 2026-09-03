# Design Review Report

## Review Round Meta

- Upstream Requirements Doc: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md` (`RER-024`, approved commit `d881d815a995af166074728c0e6a6431829ad52f`)
- Upstream Investigation Notes: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`
- Upstream Requirements Revision Record: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md`
- Reviewed Design Spec: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md` (`AD-REV-013`, architecture commit `7cfeecc277516cbe2355b4b1a97fb2bcf9fe0f08`)
- Supplemental Task Artifacts Reviewed: approved `agent-org-contract.md`; Product `RV-012`, `VIS-001`-`VIS-020`, `BASELINE-PROMOTION-001`, approved `AORG-FLAT-TEAM-STATUS-001`, and approved `AORG-TEAM-OVERRIDES-001`; `architecture-design-self-validation.md`; current downstream source/review evidence through `IR-026`, `CRR-032`, `API-REV-008`, and `DR-003`; existing frontend and server configuration/history/workspace sources; repository `production_data_migration_conventions.md`
- Architecture Design Revision Record Reviewed: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-revision-record.md`
- Relevant Architecture Design Revision IDs: `AD-REV-001`-`AD-REV-013`
- Architecture Review Revision Record: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`
- Current Architecture Review Revision ID: `ARCH-REV-011`
- Current Review Round: `11`
- Trigger: User Electron verification after the passed AD-REV-012 implementation exposed effective-configuration drift, route-selected history replacement, and an empty fresh AgentOrg root Workspace; approved `RER-024` and `AD-REV-013` define the recovery.
- Prior Review Round Reviewed: `ARCH-REV-010 / Pass`
- Latest Authoritative Round: `ARCH-REV-011 / Round 11`
- Current-State Evidence Basis: current source through `IR-026@3199ba081ad450be72fba239fe86e76c0c697a33`; `AppLeftPanel` route-selects two panels, `AgentOrgRunStore` owns a parallel history cache, the Org patch preview and serializer disagree with the server's omit/inherit versus null/clear contract, and the AgentOrg root disables the shared catalog-backed default selected by standalone Team. The existing GraphQL/service/resolver already carries and validates the required fields. Delivery-owned dirty files and DR-003 evidence remained read-only.

## Routing Classification Review

- Task size (`Small`/`Medium`/`Large`): `Large`
- Architectural risk (`Low`/`High`): `High`
- Classification rationale reviewed: `Confirmed`. AD-REV-013 is `Medium / High` in isolation because it changes a cross-layer launch semantic and a shell-wide history-state boundary. The cumulative package remains `Large / High` across definition, runtime, persistence, migration, task/lifecycle, API/stream/history, and frontend structures.
- Independent Architecture Review required by the classification: `Yes`
- Classification evidence or correction required: None.

## Upstream Behavior And Production-Path Basis Confirmation

- Overall Basis Status (`Confirmed`/`Contradicted`/`Blocked`): `Confirmed`
- Approved requirements / intended behavior understood: `Yes`. `REQ-030`-`REQ-032`, `AC-025`-`AC-027`, and `SCN-014`-`SCN-016` require effective launch equality, a route-stable unified Workspaces/history experience, and actual default Workspace selection/inheritance for a fresh AgentOrg draft.
- Relevant existing behavior and evidence confirmed: `Yes`. The Electron evidence and current frontend/server paths establish all three defects and the existing capabilities available for reuse.
- Scope guardrail confirmed (`In-Scope Use Cases` / `Out of Scope` / `Preserved Behavior Boundary` / `Review Authority`): `Yes`. The focused change is frontend launch/configuration/history/navigation plus tests. No new backend API/schema, durable format, migration, runtime/lifecycle, mounted-Team authority, focus behavior, or Product artifact is authorized.
- Approved change, preserved behavior, and outside scope understood: `Yes`
- Every prospective blocking `Design Impact` finding is traceable to an approved requirement, acceptance criterion, or preserved-behavior ID (`Yes`/`No`): `Yes — AR-FIND-006 protects REQ-031 / AC-026 / SCN-015 state continuity and the actionable ownership needed to implement it.`
- Remaining material ambiguity, if any: None in approved behavior. The remaining issue is an internal design-ownership contradiction.

| Behavior ID | Kind | Design Alignment With Approved Intent (`Pass`/`Fail`) | Approved Trigger / Contract And Current-State Evidence (`Pass`/`Fail`/`Unclear`) | Target Outcome / Path / Spine Coherence (`Pass`/`Fail`/`Unclear`) | Status (`Confirmed`/`Needs Correction`/`Unclear`) | Required Action |
| --- | --- | --- | --- | --- | --- | --- |
| BEH-001-BEH-012 | Cumulative contract/system/user/durable behavior | Pass | Pass | Pass | Confirmed | None; AD-REV-013 preserves the previously reviewed definition, runtime, persistence, task, migration, presentation, status, and launch-hierarchy contracts. |
| BEH-013 | Effective AgentOrg launch configuration | Pass | Pass | Pass | Confirmed | DS-024/VAL-031 define one canonical placement patch, exact null/omission semantics, unchanged server authority, and cross-layer equality. |
| BEH-014 | Unified Workspaces/history continuity | Pass | Pass | Fail | Needs Correction | Reconcile the conflicting owner of expansion, selection, and scroll continuity in DS-025/terminology with the ownership map and VAL-032. |
| BEH-015 | Fresh AgentOrg Workspace default | Pass | Pass | Pass | Confirmed | DS-026/VAL-033 define a catalog-backed root-only default, explicit draft epoch/provenance, exact inheritance, and fail-closed absence. |

## Supplemental Artifact Coherence Verdict

| Artifact | Purpose And Scope Are Clear? (`Pass`/`Fail`) | Linked To Relevant Core Artifacts? (`Pass`/`Fail`) | Internally Complete? (`Pass`/`Fail`) | Consistent With Related Core Artifacts? (`Pass`/`Fail`) | Status And Approval Applicability Are Clear? (`Pass`/`Fail`) | Required Action |
| --- | --- | --- | --- | --- | --- | --- |
| Requirements, investigation inventory, and `agent-org-contract.md` (`RER-024`) | Pass | Pass | Pass | Pass | Pass | None. Textual RER-024 authority explicitly governs the clarified shell/default behavior without another Product gate. |
| Product `RV-012`, status supplement, override supplement, and baseline promotion | Pass | Pass | Pass | Pass | Pass | None. Their supersession boundaries and continued approval applicability are explicit. |
| `design-spec.md` / `architecture-design-revision-record.md` (`AD-REV-013`) | Pass | Pass | Pass | Fail | Pass | Correct the DS-025/terminology UI-state ownership wording to agree with the focused revision's projector/panel boundary. |
| `architecture-design-self-validation.md` (`VAL-031`-`VAL-033`) | Pass | Pass | Pass | Fail | Pass | VAL-032 assigns expansion/selection/scroll to the panel, contradicting DS-025's assignment to the history read model; reconcile without changing approved behavior. |
| `IR-026`, `CRR-032`, `API-REV-008`, and DR-003 evidence | Pass | Pass | Pass | Pass | Pass | Retain as current-state and regression evidence; it is not implementation completion for AD-REV-013. |

## Task Design Health Assessment Verdict

| Assessment Area | Result (`Pass`/`Fail`) | Evidence | Required Action |
| --- | --- | --- | --- |
| Assessment is present for the current task posture | Pass | The cumulative/refactor posture, current defects, focused delta, preserved boundaries, and validation plan are explicit. | None. |
| Root-cause classification is explicit and evidence-backed | Pass | Current source establishes duplicated config policy, route-selected competing history owners, and the local root-default divergence. | None. |
| Refactor needed now / no refactor needed / deferred decision is explicit | Pass | Canonicalize Org patches, consolidate the left history surface, reuse the existing root Workspace policy, and remove the obsolete alternate panel/cache. | None. |
| Refactor decision is supported by concrete design sections or residual-risk rationale | Fail | DS-024/026 are concrete, but DS-025 assigns the presentation-state responsibility to two different owners. | Resolve AR-FIND-006 before implementation. |

## Spine Inventory Verdict

| Spine ID | Scope | Spine Is Readable? (`Pass`/`Fail`) | Narrative Is Clear? (`Pass`/`Fail`) | Facade Vs Governing Owner Is Clear? (`Pass`/`Fail`/`N/A`) | Main Domain Subject Naming Is Clear? (`Pass`/`Fail`) | Ownership Is Clear? (`Pass`/`Fail`) | Off-Spine Concerns Stay Off Main Line? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DS-000-DS-023 | Previously reviewed cumulative spines | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| DS-024 / VAL-031 | Canonical effective configuration to stored Org snapshot | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| DS-025 / VAL-032 | Route-stable mixed history and root actions | Pass | Pass | Pass | Pass | Fail | Pass | Fail |
| DS-026 / VAL-033 | Fresh root Workspace default and exact inheritance | Pass | Pass | Pass | Pass | Pass | Pass | Pass |

## Boundary Encapsulation Verdict

| Boundary / Owner | Authoritative Public Entry Point Is Clear? (`Pass`/`Fail`) | Internal Owned Mechanisms Stay Internal? (`Pass`/`Fail`) | Caller Bypass Risk Is Controlled? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| AgentOrg config store / canonical patch / form projector | Pass | Pass | Pass | Pass | One canonical authored state feeds preview and serialization; server remains independently authoritative. |
| Mixed workspace-history projector and always-mounted panel | Fail | Pass | Pass | Fail | Grouping/order versus expansion/selection/scroll ownership is stated inconsistently. |
| Typed root history actions and exact subject stores | Pass | Pass | Pass | Pass | Explicit compound root kind/ID; mounted Teams receive no root action. |
| Shared Workspace catalog/default policy and AgentOrg config store | Pass | Pass | Pass | Pass | Catalog owns eligible records; Org draft owns root/Team selection state; focus remains separate. |

## Dependency Direction / Forbidden Shortcut Verdict

| Owner / Boundary | Allowed Dependencies Are Clear? (`Pass`/`Fail`) | Forbidden Shortcuts Are Explicit? (`Pass`/`Fail`) | Direction Is Coherent With Ownership? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Org config route -> canonical Org store/projector -> existing GraphQL/server resolver | Pass | Pass | Pass | Pass | No Team config-store/payload import and no client-owned resolved launch plan. |
| History queries -> mixed projector -> stable panel -> typed subject actions | Pass | Pass | Fail | Fail | Dependency direction is otherwise sound, but state placement cannot be judged coherent until its owner is singular. |
| Root Workspace selector -> Org draft -> inherited placement projection | Pass | Pass | Pass | Pass | No hard-coded path, descendant default, focus, or definition mutation. |
| Cumulative Team/Org runtime and durable boundaries | Pass | Pass | Pass | Pass | No synthetic Team root, generic persisted family, or mounted-Team lifecycle is reintroduced. |

## Interface Boundary Verdict

| Interface / API / Query / Command / Method | Subject Is Clear? (`Pass`/`Fail`) | Responsibility Is Singular? (`Pass`/`Fail`) | Identity Shape Is Explicit? (`Pass`/`Fail`) | Generic Boundary Risk (`Low`/`Medium`/`High`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- | --- |
| `canonicalizeAgentOrgPlacementLaunchPatch` | Pass | Pass | Pass | Low | Pass |
| Org root commands and `toAgentOrgRunLaunchInput` | Pass | Pass | Pass | Low | Pass |
| `projectWorkspaceHistoryByWorkspace` | Pass | Pass | Pass | Medium | Pass |
| `WorkspaceHistorySubjectActions.execute` | Pass | Pass | Pass | Medium | Pass |
| `selectDefaultWorkspaceForFreshRoot` | Pass | Pass | Pass | Low | Pass |
| Existing Org GraphQL/service/resolver | Pass | Pass | Pass | Low | Pass |

## Existing Capability / Subsystem Reuse Verdict

| Need / Concern | Existing Capability Area Was Checked? (`Pass`/`Fail`) | Reuse / Extension Decision Is Sound? (`Pass`/`Fail`) | New Support Piece Is Justified? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Effective configuration semantics | Pass | Pass | Pass | Pass | Canonical client intent plus the unchanged authoritative server resolver avoids a second resolver. |
| Unified Agent/Team/Org history shell | Pass | Pass | Pass | Pass | Extend the established panel/query model and extract Org row presentation; delete the competing panel/cache. |
| Fresh root Workspace default | Pass | Pass | N/A | Pass | Reuse the catalog-backed Team-root policy at the Org root only. |
| Org hierarchy/status and subject commands | Pass | Pass | N/A | Pass | Reuse passed AD-REV-006/007 projection/status and existing Org lifecycle commands without mounted-Team authority. |

## Subsystem / Capability-Area Allocation Verdict

| Subsystem / Capability Area | Ownership Allocation Is Clear? (`Pass`/`Fail`) | Reuse / Extend / Create-New Decision Is Sound? (`Pass`/`Fail`) | Supports The Right Spine Owners? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Web AgentOrg launch configuration | Pass | Pass | Pass | Pass | Owns canonical draft commands, projection, validation, and serialization. |
| Web workspace-history presentation | Fail | Pass | Fail | Fail | Read projection and always-mounted presentation are appropriate, but navigation-state ownership is contradictory. |
| Subject-specific Agent/Team/Org lifecycle | Pass | Pass | Pass | Pass | Typed action delegation preserves exact existing owners. |
| Server launch configuration | Pass | Pass | Pass | Pass | Existing fixed-depth resolver remains unchanged and authoritative. |
| Cumulative runtime/persistence/migration | Pass | Pass | Pass | Pass | AD-REV-013 allocates no new responsibility here. |

## Reusable Owned Structures Verdict

| Repeated Structure / Logic | Extraction Need Was Evaluated? (`Pass`/`Fail`) | Shared File Choice Is Sound? (`Pass`/`Fail`/`N/A`) | Ownership Of Shared Structure Is Clear? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Canonical AgentOrg placement patch | Pass | Pass | Pass | Pass | One pure/idempotent rule is consumed by preview and request mapping. |
| Tagged mixed history root projection | Pass | Pass | Pass | Pass | Strictly composes the existing Agent/Team query with the Org-only branch of collaboration history. |
| Existing Workspace root-default policy | Pass | Pass | Pass | Pass | Shared eligibility policy; draft provenance remains subject-owned. |
| Org row/hierarchy presentation | Pass | Pass | Pass | Pass | Extracted into the unified workspace path without copying runtime authority. |

## Shared Structure / Data Model Tightness Verdict

| Shared Structure / Type / Schema | One Clear Meaning Per Field? (`Pass`/`Fail`) | Redundant Attributes Removed? (`Pass`/`Fail`) | Overlapping Representation Risk Is Controlled? (`Pass`/`Fail`) | Shared Core Vs Specialized Variant / Composition Decision Is Sound? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Canonical Team/Agent sparse launch maps | Pass | Pass | Pass | Pass | Pass | Owned null and ordinary absence have distinct semantics; no parallel raw map. |
| Tagged mixed history rows/categories | Pass | Pass | Pass | Pass | Pass | Root kind stays explicit; collaboration Team rows are excluded from the second query. |
| Workspace selection provenance/epoch | Pass | Pass | Pass | Pass | Pass | `untouched/defaulted/explicit` and one explicit draft epoch prevent re-render or same-definition ambiguity. |
| Team V2 / AgentOrg V1 durable families | Pass | Pass | Pass | Pass | Pass | Unchanged by AD-REV-013. |

## File Responsibility Mapping Verdict

| File | Responsibility Is Singular And Clear? (`Pass`/`Fail`) | Responsibility Matches The Intended Owner/Boundary? (`Pass`/`Fail`) | Responsibilities Were Re-Tightened After Shared-Structure Extraction? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| `agentOrgLaunchPatch.ts`, Org config store, form projector, and config panel | Pass | Pass | Pass | Pass | Canonical intent, pure projection, and thin event/command composition stay separate. |
| Workspace-history store/types/projector | Pass | Fail | Pass | Fail | Data projection is clear, but the prose also assigns panel interaction state here. |
| `WorkspaceAgentRunsTreePanel.vue`, workspace section/tree-state composable | Pass | Fail | Pass | Fail | File map/VAL-032 place UI state here while DS-025/terminology place it in the read model. |
| Org row presentation and typed root action adapter | Pass | Pass | Pass | Pass | Read-only rendering and exact root command dispatch are separated. |
| Workspace selector and Org draft | Pass | Pass | Pass | Pass | Shared eligibility remains distinct from Org-owned selection/provenance. |

## Subsystem / Folder / File Placement Verdict

| Path / Item | Target Placement Is Clear? (`Pass`/`Fail`) | Folder Matches Owning Boundary? (`Pass`/`Fail`) | Mixed-Layer Or Over-Split Risk (`Low`/`Medium`/`High`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Web AgentOrg config files | Pass | Pass | Low | Pass | Subject draft/command and shared presentation boundaries remain explicit. |
| Web workspace-history store/projector/panel files | Pass | Pass | Medium | Pass | Physical placement is clear; AR-FIND-006 concerns ownership semantics, not folder choice. |
| Server/API/runtime folders | Pass | Pass | Low | Pass | No AD-REV-013 change belongs there. |

## Removal / Decommission Completeness Verdict

| Item / Area | Redundant / Obsolete Piece To Remove Is Named? (`Pass`/`Fail`) | Replacement Owner / Structure Is Clear? (`Pass`/`Fail`/`N/A`) | Removal / Decommission Scope Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Panel-local Org override serializer / noncanonical patch path | Pass | Pass | Pass | Pass | Canonical store/mapper replaces it with no fallback. |
| `AppLeftPanel` route predicate and `AgentOrgRunHistoryPanel` | Pass | Pass | Pass | Pass | Stable unified panel is the only replacement; old panel is deleted. |
| Org command-store history cache/fetch path | Pass | Pass | Pass | Pass | Unified history refresh replaces parallel state; subject commands remain. |
| Hard-coded or descendant Workspace default paths | Pass | Pass | Pass | Pass | Actual catalog selection at the root replaces divergence; no compatibility path. |

## Legacy / Backward-Compatibility Verdict

| Area | Compatibility Wrapper / Dual-Path / Legacy Retention Exists? (`Yes`/`No`) | Clean-Cut Removal Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- |
| Org launch canonicalization | No | Pass | Pass | No raw/canonical dual maps or server fallback semantics. |
| Route-specific history | No | Pass | Pass | No alternate panel, flag, wrapper, or cache remains. |
| Workspace default | No | Pass | Pass | No synthesized path or descendant fallback is retained. |
| Cumulative Team V2 / Org V1 migration | Yes | Pass | Pass | Historical codecs remain migration-only; normal runtime is still forward-only. |

## Persisted-Data Transition Verdict (When Applicable)

| Area / Stored Subject | Approved Decision | Representative Reader / Semantic / Invariant Evidence Is Sufficient? (`Pass`/`Fail`) | Direct Use, Rebuild, Or Migration Choice Is Proportionate? (`Pass`/`Fail`) | Migration Safety Is Complete If Required? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| AD-REV-013 frontend draft/history/default state | Not Affected | Pass | Pass | N/A | Pass | Canonicalization happens before create, history is derived, and future snapshots use the existing schema/API. Existing Team V2/Org V1 packages and indexes remain directly usable. |
| Cumulative Team V2 / Org V1 family transition | Migration Required | Pass | Pass | Pass | Pass | The prior reviewed startup migration/zero-write native Team boundary remains unchanged. |

## Change / Refactor Safety Verdict

| Area | Sequence Is Realistic? (`Pass`/`Fail`) | Temporary Seams Are Explicit? (`Pass`/`Fail`) | Cleanup / Removal Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- |
| Canonical launch patch and equality tests | Pass | Pass | Pass | Pass |
| Unified history extraction and panel/cache deletion | Fail | Pass | Pass | Fail |
| Fresh root default and inheritance tests | Pass | Pass | Pass | Pass |
| Cumulative source reconciliation | Pass | Pass | Pass | Pass |

## Example Adequacy Verdict

| Topic / Area | Example Was Needed? (`Yes`/`No`) | Example Is Present And Clear? (`Pass`/`Fail`/`N/A`) | Bad / Avoided Shape Is Explained When Helpful? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Null versus omission configuration semantics | Yes | Pass | Pass | Pass | Concrete Codex/GPT-config to AutoByteus/DeepSeek/null example and equality matrix are sufficient. |
| Unified history composition/actions | Yes | Pass | Pass | Pass | Query merge, category order, no-workspace case, per-family failure, and typed actions are concrete; only state ownership wording conflicts. |
| Workspace default epochs/inheritance | Yes | Pass | Pass | Pass | Fresh/same-definition/error/explicit-choice cases are explicit. |

## Material Premise Validation (Only When Needed)

None for AR-FIND-006. It is an internal ownership contradiction on the already-approved and directly supported SCN-015 route, not a finding dependent on an additional production/failure/lifecycle premise. Prior premise conclusions remain unchanged and no `Not Reachable` premise drives this result.

## Unresolved Approved-Behavior Or Current-State Gaps

None. The approved behavior and current production evidence are sufficient; the blocker is Architecture-artifact coherence.

## Review Decision

`Fail — Design Impact`. DS-024 and DS-026 are actionable and the cumulative boundaries remain sound. DS-025, however, gives expansion/selection/scroll continuity two owners: the canonical narrative and terminology assign it to the unified history read model, while the ownership boundary, AD-REV-013 record, file map, and VAL-032 assign it to the always-mounted panel/presentation state. Because REQ-031 explicitly requires those states to remain stable and AD-REV-013 is consolidating two prior history owners, implementation must not proceed from contradictory state authority.

## Findings

### AR-FIND-006 — Unified history presentation-state ownership is contradictory

- Type: `Design Impact`
- Severity: `Medium`
- Approved requirement, acceptance criterion, or preserved-behavior ID protected: `REQ-031`, `AC-026`, `SCN-015` (`BEH-014`)
- Scope status: `Within Approved Scope`
- Required update changes approved behavior: `No`
- Affected approved behavior, relevant existing behavior, journey, or established contract: The supported populated Workspaces/history -> AgentOrg config -> launch/focus -> subject switching -> stopped/history journey must keep expansion, selection, and scroll stable unless the user changes context. The existing defect is route-based replacement by a second panel/history owner.
- Evidence: `design-spec.md:1197-1198` says the unified history read model owns grouping, row ordering, expansion, scroll, and selected-row continuity; the terminology at `design-spec.md:2190-2193` likewise says that read model owns navigation presentation state. In contrast, `design-spec.md:2923-2929` assigns grouping/order to the mixed projector and left-tree presentation state to the always-mounted panel; `architecture-design-revision-record.md:1045-1049` repeats projector grouping/panel UI ownership; and `architecture-design-self-validation.md:981-984` assigns expansion/selection/scroll to the panel.
- Material-premise validation ID: `N/A`; this finding is grounded directly in the approved SCN-015 user journey and cross-artifact contradiction.
- Required update: Select one coherent owner and make DS-025, terminology, ownership/file mapping, revision rationale, and VAL-032 agree. The proportionate existing direction is to keep grouping/category ordering in the mixed read model/projector and keep expansion/selection/scroll continuity in the one always-mounted panel/tree-state presentation owner, unless Architecture explicitly chooses and consistently maps another single owner. Preserve the exact query merge, typed subject actions, category order, per-family failure behavior, and panel deletion.
- Why the required update is proportionate to the verified consequence: This is a documentation/ownership correction only. It requires no new state, API, Product behavior, persistence, or runtime mechanism, but it prevents implementation from recreating overlapping state authorities during the exact consolidation meant to remove them.
- Recommended recipient: `/software_engineering_team/architecture_designer`

## Classification

`Design Impact`. Focused correction should be `Small / Low` if it only reconciles Architecture-owned wording and maps; cumulative classification remains `Large / High`.

## Recommended Recipient

`/software_engineering_team/architecture_designer`

## Residual Risks

- After AR-FIND-006 is corrected, Implementation still must prove browser/request/server/snapshot configuration equality, including exact null/omission, workspace, and tool-approval cases.
- The unified history extraction must preserve existing Agent/Team rows and state, exact category order, Org hierarchy/status/task lineage, strict Org parsing, per-family partial-read behavior, and root-specific actions without mounted-Team lifecycle.
- Default selection must use the actual catalog record once per fresh untouched draft epoch, preserve explicit choices, keep descendant defaulting off, and fail closed when unavailable.
- Standalone Team behavior and the distinct already-implemented `CR-FIND-019` correction remain regression obligations. Delivery-owned dirty artifacts remain outside Architecture Review ownership.

## Latest Authoritative Result

- Review Decision: `Fail — Design Impact`
- Material-Premise Gate (`Pass`/`Fail`/`Blocked`): `Pass`
- Notes: `ARCH-REV-011` reviewed cumulative `AD-REV-013` against approved `RER-024`, still-relevant Product authority, current source, and downstream evidence. One narrow Architecture-document ownership contradiction remains as `AR-FIND-006`; implementation and API/E2E must remain held until it is corrected and independently re-reviewed.
