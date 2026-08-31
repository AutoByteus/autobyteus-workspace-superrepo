# Requirements Revision Record

The latest `requirements-doc.md` and `investigation-notes.md` remain authoritative.

## Revision Index

| Revision ID | Trigger / Round | Prior Status | Current Status | Affected Requirement / Behavior IDs | Result |
| --- | --- | --- | --- | --- | --- |
| RER-001 | Initial contract-first baseline plus integration of the user-identified remote bootstrap branch | N/A | Ready for Approval | BEH-001–BEH-009; REQ-001–REQ-017; AC-001–AC-012 | One coherent AgentOrg/flat-Team requirements and persistence contract is ready for explicit user approval. |

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
