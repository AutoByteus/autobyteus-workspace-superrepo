# Requirements Revision Record

The latest `requirements-doc.md` and `investigation-notes.md` remain authoritative.

## Revision Index

| Revision ID | Trigger / Round | Prior Status | Current Status | Affected Requirement / Behavior IDs | Result |
| --- | --- | --- | --- | --- | --- |
| RER-001 | Initial contract-first baseline plus integration of the user-identified remote bootstrap branch | N/A | Ready for Approval | BEH-001–BEH-009; REQ-001–REQ-017; AC-001–AC-012 | One coherent AgentOrg/flat-Team requirements and persistence contract is ready for explicit user approval. |
| RER-002 | User clarification of task-Team ownership under AgentOrg | Ready for Approval | Ready for Approval | REQ-015; AC-010; DEC-005; ORG-CASE-028 | Org-originated task Teams are explicitly owned under the AgentOrg execution aggregate without becoming configured members. |
| RER-003 | User-confirmed migration assumption that no deeply nested configured data exists | Ready for Approval | Ready for Approval | BEH-007; REQ-012–REQ-013; AC-008; DEC-003; Existing Data Contract | Migration is reduced to two exhaustive zero/one-level cohorts; no deep legacy compatibility path is required. |
| RER-004 | User direction to make fixed-depth data facts authoritative migration prerequisites | Ready for Approval | Ready for Approval | PRE-001–PRE-005; REQ-012–REQ-013; AC-008; Existing Data Contract | Downstream migration may rely on fixed-depth preknown conditions and must not design hypothetical recursive flattening. |
| RER-005 | User direction for one contract containing configured structure and on-disk data structure | Ready for Approval | Ready for Approval | REQ-014; AC-009; AORG-CONTRACT-001 | The single normative contract now defines AgentOrg V1, flat-Team V3, task anchoring, strict invariants, and V2 migration mapping. |
| RER-006 | User correction that `flat` is an AgentTeam invariant, not a type-name prefix | Ready for Approval | Ready for Approval | REQ-014; AC-009; AORG-CONTRACT-001 naming | Renamed the target Team record to `TeamRunExecutionTreeFileV3` and removed the redundant `FlatTeam` subtype terminology. |
| RER-007 | User correction to reuse the generic current execution tree with minimal root changes | Ready for Approval | Ready for Approval | BEH-008; REQ-014; AC-009; AORG-CONTRACT-001 | Replaced parallel AgentOrg/Team schema proposals with one generic V3 root union that reuses current V2 child/task records. |
| RER-008 | User clarification of progressive standalone-Team-to-AgentOrg reuse | Ready for Approval | Ready for Approval | REQ-018; AC-013; SCN-006; ORG-CASE-031 | The same independently tested AgentTeam definition can be referenced directly by AgentOrg and connected with Org-scoped handoffs. |
| RER-009 | User approval and Architecture Design Routing Assessment | Ready for Approval | Approved Architecture-Ready | All approved IDs; routing assessment | User approved the cumulative AgentTeam/AgentOrg model and contract; Large/High structural impact routes to Architecture Designer. |

## Revision Entries

### RER-001 — AgentOrg And Flat-Team Contract Baseline

- Triggering user feedback, prototype package, downstream feedback, or investigation evidence:
  - User confirmed one `AgentOrg` concept, flat Agent-only Teams, and removal of persistent configured nested Teams.
  - User requested a contract-first case inventory and an explicit decision about the current Agent execution JSON.
  - User requested inspection/integration of `origin/codex/flat-agent-team-domain-simplification@c3a318812`.
  - Code, package, and stored-run investigation found recursion across definition/runtime/API/UI contracts, while all 23 inspected root packages and 41 readable stored runs use at most one configured child-Team level.
- Prior authoritative status: `N/A`.
- Current authoritative status: `Ready for Approval`.
- IDs affected: `BEH-001`–`BEH-009`, `REQ-001`–`REQ-017`, `AC-001`–`AC-012`, `SCN-001`–`SCN-005`, `DEC-001`–`DEC-006`, and `JSON-DEC-001`.
- Why this baseline was recorded: It is the first coherent, evidence-backed product-review basis that resolves the Org/Team boundary, entry semantics, durable-state implications, existing-data cohorts, and task-delegation distinction without prescribing architecture.
- Canonical artifact sections changed: All sections in `requirements-doc.md`; source log, current behavior, data facts, decisions/risks, and implications in `investigation-notes.md`.
- Supplemental artifacts added, changed, or removed:
  - Added `agent-org-contract.md` as the normative behavior/persistence supplement.
  - Cherry-picked remote bootstrap commit `c3a318812` as local commit `ca6d24dfa`, integrated its supported concept decisions, and removed its duplicate ticket files from the current tree to preserve one canonical package; the imported commit remains in branch history.
- Prototype evidence or product decisions incorporated: No prototype was requested. Adopted the imported concept's coordinator-free AgentOrg, exact caller-selected entry, flat Team coordinator semantics, rooted addressing, and configured-versus-task nesting distinction.
- User approval impact: Explicit approval is required for the full `RER-001` requirements document and `AORG-CONTRACT-001` supplement. Verbal direction to proceed is treated as product intent, not as approval of this newly presented baseline.
- Downstream architecture or direct-implementation route impact: Structural contract, lifecycle, persistence, migration, API, and frontend triggers are present. Formal routing assessment remains gated on approval and is expected to select Architecture Designer.
- Remaining gaps, assumptions, or blocked decisions: External deeper-topology volume is unknown but does not change the retain-and-block behavior. Exact target schema, transition mechanism, and rollout sequence belong to Architecture Design.
- Next action or recipient: Present `RER-001` and `AORG-CONTRACT-001` to the user for explicit approval.

### RER-002 — Task Team Runtime Ownership Clarification

- Triggering user feedback, prototype package, downstream feedback, or investigation evidence: The user asked whether a task Team, when created, will exist under the AgentOrg.
- Prior authoritative status: `Ready for Approval` (`RER-001`).
- Current authoritative status: `Ready for Approval` (`RER-002`).
- IDs affected: `REQ-015`, `AC-010`, `DEC-005`, and `ORG-CASE-028`.
- Why this revision was recorded: “Task-scoped” previously distinguished the execution from configured nesting but did not state its top-level durable owner precisely enough.
- Canonical artifact sections changed: Requirements, Acceptance Criteria, Assumptions And Resolved Decisions, contract governing model, execution/lifecycle cases, and durable semantic shape.
- Supplemental artifacts added, changed, or removed: Updated `agent-org-contract.md`; no new supplement.
- Prototype evidence or product decisions incorporated: User clarification establishes that an Org-originated task Team belongs beneath the AgentOrg execution aggregate.
- User approval impact: Approval must now reference `RER-002`; it includes and supersedes the review state of `RER-001` without changing its other decisions.
- Downstream architecture or direct-implementation route impact: Architecture must preserve Org-root ownership while anchoring the task execution to the exact delegating host scope; no configured member/address-tree mutation is authorized.
- Remaining gaps, assumptions, or blocked decisions: Exact storage field/container and transient task addressing remain Architecture Design decisions.
- Next action or recipient: Present the clarified `RER-002` package and `AORG-CONTRACT-001` to the user for explicit approval.

### RER-003 — Zero/One-Level Migration Assumption

- Triggering user feedback, prototype package, downstream feedback, or investigation evidence: The user confirmed that migration may assume there is no deeply nested configured data and referenced the completed data investigation.
- Prior authoritative status: `Ready for Approval` (`RER-002`).
- Current authoritative status: `Ready for Approval` (`RER-003`).
- IDs affected: `BEH-007`, `REQ-012`, `REQ-013`, `AC-008`, `DEC-003`, `SCN-004`, `QR-002`, `QR-003`, and the contract Existing Data Contract/approval basis.
- Why this revision was recorded: The earlier conservative external/deeper-data recovery posture would add migration complexity despite evidence and user confirmation that the relevant data population has no deep configured topology.
- Canonical artifact sections changed: Stakeholder outcomes, preserved behavior, requirements, acceptance criteria, operational scenario, quality constraints, data continuity, decisions, investigation data facts, and the contract migration matrix.
- Supplemental artifacts added, changed, or removed: Updated `agent-org-contract.md`; no new supplement.
- Prototype evidence or product decisions incorporated: No prototype. Promoted the inventory result—23 root packages and 41 readable stored trees, with maximum configured child-Team depth one—into a user-confirmed migration assumption.
- User approval impact: Approval must reference `RER-003`; it includes `RER-001` and `RER-002` while replacing their conservative deep-legacy migration posture.
- Downstream architecture or direct-implementation route impact: Architecture must handle only flat-root preservation and one-level organization-like conversion. It must not design a deep legacy migration/compatibility branch; permanent validators still reject unsupported deeper input.
- Remaining gaps, assumptions, or blocked decisions: Exact transition mechanics remain Architecture Design-owned. No material product decision remains open.
- Next action or recipient: Present `RER-003` and `AORG-CONTRACT-001` to the user for explicit approval.

### RER-004 — Authoritative Fixed-Depth Migration Preconditions

- Triggering user feedback, prototype package, downstream feedback, or investigation evidence: The user directed that the known data shape be recorded explicitly as migration prerequisites so future work does not attempt to solve nonexistent three-level nesting.
- Prior authoritative status: `Ready for Approval` (`RER-003`).
- Current authoritative status: `Ready for Approval` (`RER-004`).
- IDs affected: Added `PRE-001`–`PRE-005`; refined `REQ-012`, `REQ-013`, and `AC-008`; updated the contract Existing Data Contract and downstream architecture input.
- Why this revision was recorded: A migration assumption stated only in prose could be reopened downstream. Stable precondition IDs make the fixed-depth input authoritative and testable.
- Canonical artifact sections changed: Requirements, Acceptance Criteria, Data Continuity, new Migration Preconditions / Preknown Conditions, Downstream Architecture Input, investigation source/decision log, and contract migration preconditions.
- Supplemental artifacts added, changed, or removed: Updated `agent-org-contract.md`; no new supplement.
- Prototype evidence or product decisions incorporated: No prototype. Incorporated the user's operational fact that all relevant live/historical data derives from current zero/one-level configured Team definitions.
- User approval impact: Approval must reference `RER-004`; it includes all earlier revisions and makes `PRE-001`–`PRE-005` authoritative.
- Downstream architecture or direct-implementation route impact: Migration design is explicitly fixed-depth. It must preserve task-scoped runtime lineage separately and must stop before writes on an unexpected precondition violation rather than implement recursive flattening.
- Remaining gaps, assumptions, or blocked decisions: Exact migration mechanism remains Architecture Design-owned. No product decision remains open.
- Next action or recipient: Present `RER-004` and `AORG-CONTRACT-001` to the user for explicit approval.

### RER-005 — Unified Structure And On-Disk Contract

- Triggering user feedback, prototype package, downstream feedback, or investigation evidence: The user stated the requirements are clear, asked work to continue, and requested one contract file containing both the structure and on-disk data structure to direct later design.
- Prior authoritative status: `Ready for Approval` (`RER-004`).
- Current authoritative status: `Ready for Approval` (`RER-005`).
- IDs affected: `REQ-014`, `AC-009`, the supplemental artifact description, Downstream Architecture Input, and `AORG-CONTRACT-001`.
- Why this revision was recorded: The earlier contract defined durable semantics but deliberately left the target record shape abstract. The user's direction makes the logical versioned record structures part of the requirements contract.
- Canonical artifact sections changed: Durable execution requirement/acceptance criterion, supplemental inventory, downstream architecture input, investigation source log, and the contract configured/on-disk/migration sections.
- Supplemental artifacts added, changed, or removed: Expanded the existing single `agent-org-contract.md`; no competing contract file was created.
- Prototype evidence or product decisions incorporated: No prototype. Added logical `AgentOrgRunExecutionTreeFileV1`, `FlatTeamRunExecutionTreeFileV3`, explicit member/task discriminators, task-host anchoring, strict invariants, and TeamRun V2 field mapping.
- User approval impact: Approval must reference `RER-005` and `AORG-CONTRACT-001`; all earlier decisions and preconditions remain included.
- Downstream architecture or direct-implementation route impact: Architecture Design is constrained by the logical durable structures while retaining ownership of physical file names, storage partitioning, target modules, and rollout mechanics.
- Remaining gaps, assumptions, or blocked decisions: None at the product/contract level. Physical serialization placement and implementation mechanics remain downstream design decisions.
- Next action or recipient: Present the unified `RER-005` contract for explicit approval, then complete the Architecture Design Routing Assessment.

### RER-006 — AgentTeam Naming Simplification

- Triggering user feedback, prototype package, downstream feedback, or investigation evidence: The user questioned why the target uses `FlatTeamRunExecutionTreeFileV3` when the only supported AgentTeam model is already flat.
- Prior authoritative status: `Ready for Approval` (`RER-005`).
- Current authoritative status: `Ready for Approval` (`RER-006`).
- IDs affected: `REQ-014`, `AC-009`, Downstream Architecture Input, configured-structure names, on-disk Team record name, migration mapping, and contract approval basis.
- Why this revision was recorded: A `FlatTeam` name suggests a parallel non-flat Team type and weakens the simplification's ubiquitous language.
- Canonical artifact sections changed: Durable execution requirement/acceptance criterion, downstream architecture input, investigation source log, and `AORG-CONTRACT-001` configured/on-disk names.
- Supplemental artifacts added, changed, or removed: Updated the existing `agent-org-contract.md`; no new artifact.
- Prototype evidence or product decisions incorporated: No prototype. Adopted the user decision that flatness is enforced through `AgentTeam` membership invariants rather than type/file prefixes.
- User approval impact: Approval must reference `RER-006` and `AORG-CONTRACT-001`; all prior structure, persistence, task, and migration decisions remain unchanged.
- Downstream architecture or direct-implementation route impact: Target domain/schema names must use ordinary AgentTeam/TeamRun terminology and must not introduce `FlatTeam` as a public or persisted subtype.
- Remaining gaps, assumptions, or blocked decisions: None at the product/contract level.
- Next action or recipient: Present `RER-006` and the corrected contract for explicit approval.

### RER-007 — Minimal-Delta Generic Execution Tree

- Triggering user feedback, prototype package, downstream feedback, or investigation evidence: The user observed that the previously designed TeamRun execution tree was deliberately generic and should already represent AgentOrg with only minimal root/file naming changes; the user reaffirmed that AgentOrg has no coordinator while direct Teams retain theirs.
- Prior authoritative status: `Ready for Approval` (`RER-006`).
- Current authoritative status: `Ready for Approval` (`RER-007`).
- IDs affected: `BEH-008`, `REQ-014`, `AC-009`, External Contracts, Downstream Architecture Input, investigation persistence findings, and all on-disk/migration sections of `AORG-CONTRACT-001`.
- Why this revision was recorded: The prior two-schema proposal duplicated an already generic envelope/member/task topology and overstated the persistence change.
- Canonical artifact sections changed: Current-versus-desired durable behavior, durable requirement/acceptance criterion, dependency/routing input, investigation source/code findings, and the complete contract on-disk structure/migration mapping.
- Supplemental artifacts added, changed, or removed: Rewrote the existing single `agent-org-contract.md`; no new supplement.
- Prototype evidence or product decisions incorporated: No prototype. Concrete V2 reinspection confirmed reuse of envelope, configured Agent/Team nodes, addresses, handoffs, launch state, and task lineage. Only root subject/naming/coordinator semantics and configured-depth validation change.
- User approval impact: Approval must reference `RER-007` and `AORG-CONTRACT-001`; it supersedes the separate AgentOrg V1/TeamRun V3 schema proposal while preserving all domain, task, and migration preconditions.
- Downstream architecture or direct-implementation route impact: Architecture must design one generic V3 execution tree with an AgentOrg-or-AgentTeam root variant and must avoid parallel topology families or record duplication.
- Remaining gaps, assumptions, or blocked decisions: Physical generic filename/directory and exact target type/module names remain Architecture Design-owned; logical minimal-delta fields and invariants are fixed by the contract.
- Next action or recipient: Present `RER-007` and the revised single contract for explicit approval.

### RER-008 — Progressive AgentTeam Composition Workflow

- Triggering user feedback, prototype package, downstream feedback, or investigation evidence: The user explained that users need to build and test an AgentTeam independently, then include the completed Team in AgentOrg and connect it using handoff rules.
- Prior authoritative status: `Ready for Approval` (`RER-007`).
- Current authoritative status: `Ready for Approval` (`RER-008`).
- IDs affected: Added `REQ-018`, `AC-013`, `SCN-006`, and `ORG-CASE-031`; updated stakeholders, preserved behavior, traceability, contract verification, and approval basis.
- Why this revision was recorded: Direct Team launch and Org membership were already individually required, but identity-preserving progressive reuse without copying or Team modification was not explicit enough.
- Canonical artifact sections changed: Stakeholders, preserved behavior, requirements, acceptance criteria, scenarios, traceability, investigation user evidence, and contract definition/reuse cases.
- Supplemental artifacts added, changed, or removed: Updated the existing `agent-org-contract.md`; no new supplement.
- Prototype evidence or product decisions incorporated: No prototype. Incorporated the explicit workflow that Org-scoped handoffs are sufficient additional configuration after a Team has been independently tested.
- User approval impact: Approval must reference `RER-008` and `AORG-CONTRACT-001`; all prior domain, persistence, task, and migration decisions remain included.
- Downstream architecture or direct-implementation route impact: Definition identity and standalone history must remain stable when a Team is referenced by Org; implementation must not create copied or Org-specific Team variants.
- Remaining gaps, assumptions, or blocked decisions: None at the product/contract level.
- Next action or recipient: Present `RER-008` and the updated contract for explicit approval.

### RER-009 — Approval And Architecture Routing

- Triggering user feedback, prototype package, downstream feedback, or investigation evidence: Following the explicit approval request and complete package review, the user confirmed the intended governing model: AgentTeam is Agent-only and coordinator-led; AgentOrg contains multiple AgentTeams and independent Agents.
- Prior authoritative status: `Ready for Approval` (`RER-008`).
- Current authoritative status: `Approved`; outcome `Approved Architecture-Ready`.
- IDs affected: Approval applies cumulatively to `BEH-001`–`BEH-009`, `REQ-001`–`REQ-018`, `AC-001`–`AC-013`, `SCN-001`–`SCN-006`, `PRE-001`–`PRE-005`, `DEC-001`–`DEC-006`, and `ORG-CASE-001`–`ORG-CASE-031`.
- Why this revision was recorded: It captures explicit user approval, closes the readiness gate, and records the required downstream routing decision.
- Canonical artifact sections changed: Document status, approval references, supplement status, readiness check, Architecture Design Routing Assessment, investigation status/evidence, and contract status.
- Supplemental artifacts added, changed, or removed: `agent-org-contract.md` marked Approved; no new supplement.
- Prototype evidence or product decisions incorporated: No prototype. Approval includes the minimal-delta generic execution tree, fixed-depth migration preconditions, task-Team ownership, and progressive standalone-Team reuse.
- User approval impact: Cumulative requirements and `AORG-CONTRACT-001` are approved as of 2026-08-31. Any material intended-behavior change requires a later revision and renewed approval.
- Downstream architecture or direct-implementation route impact: Assessment is Complete with preliminary `task_size=Large` and `architectural_risk=High`; selected route is Architecture Designer because contract, persisted-root invariant, lifecycle, migration, API/UI, ownership, and structural-refactoring triggers are present.
- Remaining gaps, assumptions, or blocked decisions: No product requirement gap. Architecture owns physical names/locations, target modules, rollout sequence, and final architecture risk/size classification.
- Next action or recipient: Classify the package as `Approved Architecture-Ready`, call dynamic handoff rules, and send the cumulative package to every returned recipient.
