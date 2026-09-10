# Requirements Revision Record

## Revision Index
| Revision | Trigger / round | Prior status | Current status | Affected IDs | Result |
| --- | --- | --- | --- | --- | --- |
| RER-001 | Initial investigation plus same-runtime clarification and compression concern | N/A | Draft | BEH-001–006; REQ-001–008; AC-001–012; SCN-001–006; DEC-001–003 | Evidence-backed compatible-only recommendation; policy approval pending |
| RER-002 | User proposes same-context-only eligibility and asks to define compatibility | Draft | Draft | REQ-002/007; BEH-005; SCN-006; AC-002/013; DEC-002 | Drop optional native budget/threshold matching; keep ordinary compression caveat |
| RER-003 | User explicitly allows larger context and prohibits smaller | Draft | Draft | REQ-002; BEH-005/006; SCN-006; AC-002/013; DEC-002/ASM-002 | Replace exact equality with target capacity >= currently saved capacity |
| RER-004 | User approves >= capacity, no compression changes, stopped Agents and Teams; asks to continue | Draft | Approved | REQ-001–008; SCN-001–006; DEC-001–003; readiness/routing | Approved Architecture-Ready; preliminary Medium/High |

## RER-001 — Compatible-only model switching analysis
- Date: 2026-09-06.
- Input: original request for stopped model changes with equal context, screenshot of Codex Team Settings; subsequent clarification that model itself should change within the same runtime; latest feedback that best approach is uncertain because compression is the major concern.
- Prior authoritative baseline: N/A. Template-only draft existed during investigation; no earlier approval or downstream package exists.
- Scenario basis: existing stopped Settings → Save → normal resume, extended to model replacement. Team screenshot is explicit; standalone parity and complete runtime coverage are proposals. Raw state mutation/task-record editing are excluded.
- Canonical sections created: behavior, scope, scenarios, requirements, acceptance, continuity, open decisions, readiness; investigation and reproducible counterexample.
- Material finding: equal native context capacity does not imply equal input budget or compression threshold. Codex/Claude catalog mappings currently leave context metadata null.
- Supplemental evidence added: pure current-code budget probe and JSON result; screenshot remains external user-owned evidence.
- Product Design artifacts: N/A — not requested.
- Approval impact: no approval. Strict compatibility recommendation is not yet authoritative.
- Routing impact: formal assessment deferred until approval/readiness; no engineering handoff.
- Remaining decisions: DEC-001 scope, DEC-002 context-only versus budget-preserving compatibility, DEC-003 settings adjustment experience; real initial-runtime model-pair feasibility evidence.
- Next action: return concise recommendation and resolve policy with the user. Preserve canonical paths on subsequent revision.

## RER-002 — Same-context-only eligibility
- Date: 2026-09-08.
- Trigger: user proposes allowing the model change as long as context size is equal and asks what earlier “compatible” meant.
- Prior/current authoritative status: Draft → Draft; same canonical paths and package identity.
- Changes: replace stricter native budget/threshold equality with same-runtime + verified equal context-window capacity. Added AC-013 to ensure extra matching conditions are not silently retained. Updated behavior, scenario/error basis, UI explanation, traceability and investigation conclusion.
- Preserved: fully stopped run, runtime identity, exact capacity equality, normal target settings validation, server enforcement, history continuity and ordinary compression. Algorithm preservation does not promise identical compression timing.
- Supplemental artifacts: unchanged pure-budget evidence; now caveat/evidence only, not grounds for a budget-compatibility gate.
- Approval impact: user preference recorded; full package remains unapproved. No Product Design request or downstream authorization inferred.
- Routing impact: assessment remains deferred until approval and readiness.
- Remaining: full-package approval, scope/settings confirmation, known external metadata and real model-pair validation gaps.
- Next action: explain the simpler recommendation to the user; no engineering handoff.

## RER-003 — Allow Equal Or Larger Context
- Date: 2026-09-08.
- Trigger: user corrects the earlier example: 128k → 200k allowed, 128k → 64k not allowed.
- Prior/current status: Draft → Draft; stable package identifier and cumulative canonical artifact paths unchanged.
- Confirmed behavior change: target context capacity must be >= the currently saved model capacity within the same runtime. Larger targets move into scope; smaller targets remain out of scope. No extra budget/threshold matching is reintroduced.
- Updated IDs/sections: REQ-002; BEH-005/006; SCN-006; AC-002/013; DEC-002/ASM-002; problem, scope, UI help and investigation conclusions. AC-002 includes equal/larger/smaller examples and comparison to the current saved model.
- Scenario validity: existing stopped Settings/Save/resume basis unchanged; larger-model replacement is now explicitly supported by the user's product policy. No internal or hypothetical path was promoted to scope.
- Preservation: no runtime switch, history reset or forced compression during Save. Existing compression continues normally and can use new model-derived budgets.
- Artifacts: no new supplemental files; earlier native-budget probe remains evidence only.
- Approval impact: capacity rule explicitly clarified, not full-package approval or implementation authorization.
- Routing: formal architecture assessment remains deferred; no matching engineering or Product Design handoff.
- Remaining: overall package approval, scope/settings confirmation and downstream runtime metadata/real-pair validation evidence.
- Next action: confirm the corrected concise rule to the user.

## RER-004 — Approved Stopped-Run Model Switching
- Date: 2026-09-08.
- Trigger/approval evidence: user confirms “New model context size ≥ current model context size”, “no compression changes”, “when the agent team or agent is stopped”, “just like how we update the model config parameters”, then requests continuation.
- Prior/current status: Draft → Approved; canonical artifact paths and stable package identifier unchanged.
- Approved scenario basis: SCN-001–006, existing stopped Settings → choose/review model/settings → explicit Save → normal same-conversation resume. SCN-X01 remains excluded.
- Scope resolved: both Agent and configured Team settings on current runtimes; no runtime change, capacity shrink, compression redesign, delegated-task editor or topology change.
- Settings decision: existing target-model schema/default controls and validation apply; no bespoke settings-transfer guarantee is introduced. Unknown metadata is not guessed.
- Canonical sections updated: approval, scope, scenario/requirement status, decisions, explicit no-compression-change boundary, readiness, post-approval routing assessment and cumulative artifact index.
- Supplement changes: none; original screenshot and synthetic current-budget probe remain evidence only. No Product Design request or final UI/UX supplement exists.
- Approval impact: full bounded intended behavior approved; superseded strict compatibility and exact-equality proposals remain non-authoritative historical records.
- Routing assessment: Complete; preliminary task size Medium; preliminary architectural risk High; API, persisted-model invariant and lifecycle integration triggers present. Selected Architecture Designer / Requirements-to-Architecture-Design. Final architectural classification remains downstream-owned.
- Remaining product blockers: none. Technical questions: authoritative runtime capacity metadata, saved model propagation and real-pair same-conversation validation, all within approved behavior.
- Next action: rule-based handoff of Approved Architecture-Ready package, then stop. Requirements Engineer made no production changes or downstream delivery claims.
