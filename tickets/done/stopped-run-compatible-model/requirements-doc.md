# Requirements — Stopped-run model switching without reducing context size

## Document Status
- Package ID / ticket: `stopped-run-compatible-model`
- Status: `Approved` — user-confirmed stopped Agent/Team model switching; requirements readiness passed.
- Current requirements revision ID: `RER-004`
- Owner: Requirements Engineer; updated: 2026-09-08.
- Approval: Explicit confirmation on 2026-09-08 of the presented rule, no compression changes, and both stopped Agents and Teams through the existing model-settings workflow. Exact evidence: “yes. basically no compression changes, as long as New model context size ≥ current model context size. and when the agent team or agent is stopped. just like how we update the model config parameters.” User subsequently asked “continue please”. This approves the bounded behavior below; it does not authorize unrelated changes or the superseded strict compatibility proposal.
- Task workspace: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model`
- Branch: `requirements/stopped-run-compatible-model`; base: `a32b53f6320222c9bf3c7f3a4a3c50fbd1e44f27` (`personal`).

## Problem And Desired Outcome
Users can change thinking and other model settings on stopped runs but cannot change the model itself. The user wants another model in the **same runtime**, initially constrained to the **same context size**, without taking on compression redesign. On 2026-09-08 the user clarified that **equal or larger context size is allowed; smaller context size is not**. This supersedes the earlier exact-equality boundary.

Recommended first-version boundary: same-runtime model replacement with no decrease in context-window size on a fully stopped run, saved for the next normal resume. Runtime, conversation identity, history and existing compression behavior remain intact. This is not live hot-swapping and not a new conversation.

**Simplified eligibility:** same runtime, with known positive capacities and `target context-window tokens >= currently saved model context-window tokens`. Equal and larger qualify; smaller does not. Compare against the currently saved model for each affected scope, not the initial launch model or a temporary picker selection. Here context means the capacity applicable to that model in the selected runtime, before output reservation—not remaining tokens, usable input budget, or a compression trigger. Do not additionally require equal input/output limits, reasoning options, tokenizer or compression thresholds. Existing target-model settings validation still applies.

**Preservation caveat:** the compression algorithm and saved conversation remain unchanged; ordinary compression may occur at a different point under the new model. The previous equal-budget/equal-trigger suggestion was a conservative restriction, not a prerequisite. It was superseded by RER-002 and remains excluded in RER-003; it must not become an implementation gate.

## Relevant Current And Desired Behavior
| ID | Kind | Scenarios | Evidence-backed current behavior | Approved desired behavior | Preserved behavior | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| BEH-001 | User | SCN-001, SCN-004 | Existing-run settings lock runtime and model; stopped runs may edit llmConfig. | Allow a compatible model selection while runtime stays fixed. | Stop/ownership/archive eligibility, inspectability and explicit Save. | E01–E05 |
| BEH-002 | Contract | SCN-001, SCN-005 | Save accepts llmConfig only and validates against the persisted model. | Validate the proposed model plus its settings and compatibility before committing. | Server authority, rejected saves leave durable config unchanged, canonical reconciliation. | E04–E06 |
| BEH-003 | User | SCN-002 | Configured Team/root/nested/member settings can be saved; parent propagation respects draft-start equality and direct edits. | Extend those existing configured scopes to compatible model selection; evaluate every affected scope against its own original runtime/model. | Divergent/directly edited branches, topology, task records and unaffected scopes. | E03, E05, E07 |
| BEH-004 | System | SCN-001, SCN-002, SCN-003 | Resume reads saved runtime/model/settings and preserves durable run/provider identity. | Resume the same identity using the saved replacement model. | Prior conversation, memory/compaction records and ordinary lifecycle. | E05, E08 |
| BEH-005 | System | SCN-003, SCN-006 | Native compression budget depends on context, input cap, output reservation, margin and ratio; external-runtime compaction is reported separately. | No special compression/reset on model Save. Equal-or-larger-context replacements may have different derived input budgets or thresholds; existing runtime rules continue normally. | Existing compression strategy and normal future operation; no promise of identical token counts. | E09–E12 |
| BEH-006 | User | SCN-006 | Catalog exposes nullable capacity metadata; Codex/Claude catalog normalizers emit null capacity values. | Only verified compatible replacements are selectable; unknown capacity is explained, never treated as satisfying the capacity comparison. | Current model remains visible; model-settings-only editing is not newly blocked by missing replacement metadata. | E02, E10 |

## Stakeholders, Actors, And Outcomes
| Actor | Goal | Outcome | Constraint |
| --- | --- | --- | --- |
| Studio user | Continue an existing conversation with another model | Explicit model Save, then normal resume | Same runtime; safe capacity; no lost history |
| Team operator | Retune configured team scopes | Bounded, visible changes | No cross-runtime propagation or task-instance edits |
| Runtime/system | Restore saved execution | Correct model and settings on same identity | Retain lifecycle/ownership guards and compression ownership |

## Scope Guardrail (Mandatory)
### In-Scope Use Cases
- UC-001: Stopped standalone run model/settings Save and resume (SCN-001).
- UC-002: Stopped Team root, configured nested Team and configured member model/settings editing in the current Settings surface (SCN-002). The supplied screenshot establishes Team relevance; the latest approval explicitly includes both standalone Agents and Teams.
- UC-003: Preserve conversation/compression behavior across an eligible switch (SCN-003).
- UC-004: Explain/reject unavailable or incompatible targets and save/lifecycle failures (SCN-004–006).
- Runtime scope: the existing stopped-model-settings surfaces for AutoByteus, Codex and Claude; no runtime migration or new runtime. Model replacements must meet REQ-002. Codex is explicitly relevant to the supplied screenshot. Establishing authoritative capacity evidence and demonstrating actual resume are downstream technical work, not extra product eligibility conditions.

### Out Of Scope
- Runtime changes, live hot-swaps, changing an idle-but-still-active run, or switching to a smaller context capacity.
- Compression redesign, new compression strategies, proactive recompression as part of Save, summary regeneration, deleting/truncating history, or moving state between runtimes.
- New provider/runtime support, universal metadata coverage, tokenizer conversion, new history conversion layers, and new compaction controls.
- Changing launch defaults/definitions, workspace/tool policy, Team hierarchy, configured addresses, provider conversation bindings, or archived/delegated-task editing.
- New multi-browser merge/revision protocol, unrelated reliability/security policies, deployment or data migrations without an approved requirement.

### Non-Goals
- Promise identical outputs, tokenization, token counts, price, or compaction timing across models.
- Treat two unknown capacities, common names, rounded labels or remaining-token values as proof of sufficient context capacity; modify context overrides merely to force eligibility.
- Deliver a vacuously successful selector with no demonstrated usable replacement on the agreed initial runtime.

### Preserved Behavior Boundary
BEH-001–006, REQ-001/004/006/007, AC-005–013 govern preserved behavior. Settings-only edits must remain supported as before; new eligibility restrictions apply to actual model replacement, not to reselecting the existing model.

### Review Authority
Every blocking Design Impact or implementation correction must cite an **approved** requirement, AC or preserved behavior. New behavior/policy, compatibility guarantees, migrations or operational obligations are Requirement Gaps requiring user approval. Adjacent concerns can be nonblocking recommendations or separate tickets. A downstream comment cannot amend this requirements basis.

## Relevant Scenarios And Journeys
SCN-001–006 are the approved product scenario basis. New model switching has no current supported Settings path; the user approves extending the existing stopped Settings → Save → normal resume flow. SCN-X01 remains excluded.

| ID | Kind / actor | Goal / trigger | Starting condition | Product-level sequence and expected outcome | Alternate / error | Validity and independent basis | Requirements / AC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCN-001 | User / Studio user | Change model through existing-run Settings | Fully stopped, present, unarchived standalone run | Open Settings → inspect compatible models → select another → review settings → Save → normal next message/resume continues same conversation on replacement | Invalid/unknown target cannot save; exiting unsaved leaves original | Supported Normal Scenario, approved extension of existing Save/resume; user request, E01/E04/E08 | REQ-001–004,006; AC-001–005,009 |
| SCN-002 | User / Team operator | Change configured Team or member model through shown Team Settings | Entire root run editable, configured scopes have saved launch settings | Open appropriate scope → choose replacement → see affected linked descendants → Save all intended patches → normal resume applies each changed scope | Divergent/direct-edit branches remain unchanged; any invalid affected patch prevents partial validation save | Supported Normal Scenario, approved extension; screenshot, E03/E05/E07 | REQ-001–006; AC-004,005,008,009 |
| SCN-003 | System / existing resume and compaction lifecycle | Continue an already compacted conversation | Compatible switch saved; existing memory/summary and provider identity present | Resume same run → use existing retained history/summary → process next input → existing compression continues if ordinarily needed | Runtime cannot preserve conversation with target: do not silently start over or convert history | Supported Normal Scenario; user preservation intent, E08/E09/E12 | REQ-002,004,007; AC-002,009,010,013 |
| SCN-004 | User/system / run owner | Stop-only contract at Save | View became active through normal resume/message or ownership changed | Save attempt is refused/relocked if activation won; if Save won, resume uses committed config | Active, archived or uncertain ownership never becomes editable from stale UI | Supported Explicit Edge Scenario; documented existing lifecycle/owner contract E04/E05 | REQ-001,006; AC-005,006 |
| SCN-005 | User/system / save and refresh | Recover from rejected/uncertain update | Changed draft; validation failure or unknown persistence outcome | Explain field/scope failure; unchanged state on precommit rejection; verify canonical outcome when persistence is uncertain before another Save | Do not claim success or silently reset values on an ambiguous response | Supported Explicit Edge Scenario; existing save reconciliation E02/E04/E05 | REQ-003,006; AC-004,007 |
| SCN-006 | User / model picker | Find an eligible replacement | Catalog missing capacities, unavailable target, a smaller context-window size, or no alternatives | Keep current model visible; exclude incompatible replacements; explain reason; retain existing settings-only pathway | Unknown is not sufficient; rounded labels are not comparison values; catalog changes are rechecked at Save | Supported Explicit Edge Scenario; user non-decreasing-capacity contract and observed nullable metadata E10/E11 | REQ-002,003,008; AC-002,003,011,012 |
| SCN-X01 | Internal caller | Mutate raw metadata or a delegated historical task node | Mechanically writable files/constructible internal targets | No approved workflow; excluded | Must not be used to expand editing scope | Technically Possible but Unsupported/Contrived; configured-only product contract E05/E07 | N/A — excluded |

## Requirements — Approved Baseline
| ID | Requirement | Behavior | Criticality / rationale | Source |
| --- | --- | --- | --- | --- |
| REQ-001 | Permit changing the model only on the existing fully stopped/editable run surface; retain the saved runtime and all other fixed identities. A team-member idle state does not make an active root editable. | BEH-001–003 | Must / explicit runtime constraint | User, E01/E04/E05 |
| REQ-002 | For an actual replacement, require the same saved runtime and positive, verified **model context-window capacities applicable to that runtime**, measured in tokens before output reservation, with the target capacity **greater than or equal to the currently saved model capacity** for each affected scope. Equal and larger capacities qualify; smaller capacities do not. Do not require matching derived usable input budgets, input/output limits, reasoning options, tokenizers or compaction thresholds. Unknown context size is not evidence that the target has sufficient capacity. Normal target availability and settings validation still apply. Same-conversation resume remains a required outcome, not an undefined additional compatibility checklist. | BEH-005/006 | Must / user-approved simple rule | User 2026-09-08; E09–E12; DEC-002 |
| REQ-003 | Present only eligible replacement choices within the saved runtime. Revalidate eligibility, current runtime and target settings on Save using authoritative evidence, not user-supplied context numbers or display names. Preserve visible loading, empty, unavailable and field-error states. | BEH-001/002/006 | Must / enforce actual constraint | User, E02/E04/E10 |
| REQ-004 | Save the intended model and validated settings as one coherent update; do not activate the run. On normal resume use that saved model in the same run/conversation. No fallback to a new conversation or replacement runtime. Present the selected model’s normal schema-backed settings/defaults for review before Save using the existing model-selection/settings experience; never send unsupported old-model settings silently. No new cross-model settings-transfer policy is required. | BEH-002/004 | Must / user intent and continuity | User, E06/E08 |
| REQ-005 | Within a stopped Team, validate each changed configured scope against its own original runtime/model. Preserve existing bounded propagation: draft-start linked descendants can follow parent changes; divergent or directly edited branches remain unchanged. All intended target scopes must validate before persistence; no task-instance targets or cross-runtime inheritance. | BEH-003 | Must / existing Team editing semantics | User 2026-09-08; E03/E05/E07; DEC-001 |
| REQ-006 | Preserve explicit Save, no-op behavior, unsaved-draft discard, server lifecycle/ownership/archive guards, save/resume ordering and canonical uncertainty recovery. Actual model changes count as dirty even if llmConfig is unchanged. | BEH-001–004 | Must / existing contract | E02/E04–E06 |
| REQ-007 | Do not rewrite, discard, reset or recompress conversation history, retained memory, compaction lineage or provider binding as part of model Save. Do not change the compression algorithm, strategy or configuration as part of this feature. Existing compression remains owned by its current runtime and continues normally after resume. Do not promise identical tokenization or that no future compaction can occur. | BEH-004/005 | Must / explicit preservation intent | User, E08/E09/E12 |
| REQ-008 | Unknown replacement capacity must not create a new restriction on existing same-model configuration editing. The unchanged current model remains displayable and existing model/schema/lifecycle validation still applies. Prove at least one real eligible switch on the agreed initial runtime before declaring the feature delivered. | BEH-001/006 | Must / avoid regression and empty feature | Existing contract; observable success of the approved feature |

## Acceptance Criteria
| ID | Requirements | Scenario / behavior | Preconditions / trigger | Observable expected outcome / alternate | Verification intent |
| --- | --- | --- | --- | --- | --- |
| AC-001 | REQ-001/003/006 | SCN-001; BEH-001/002 | Eligible stopped run, select different compatible model | Runtime stays locked; model selector usable; Save becomes enabled even with identical settings JSON | Rendered UI plus server response |
| AC-002 | REQ-002/003 | SCN-003/006; BEH-005/006 | Same runtime; compare target capacity with the currently saved model | 128k → 128k and 128k → 200k satisfy capacity eligibility; 128k → 64k is rejected. After saving 200k, returning to 128k is a decrease and is rejected. A differing derived input budget or compression threshold is not an additional rejection reason | Equal/larger/smaller and current-saved-baseline cases, plus AC-013 |
| AC-003 | REQ-002/003/008 | SCN-006; BEH-006 | Null/invalid capacity on either side, rounded equal labels, or only current model | No guessed eligibility; explicit unavailable/no-alternative explanation; current model retained | Metadata/error UI and backend negative cases |
| AC-004 | REQ-003/004/006 | SCN-001/002/005; BEH-002 | Target lacks an old reasoning effort/setting | Target controls and required adjustments are visible; invalid proposed config blocks Save with meaningful error; model/config cannot partially validate-save | Settings/schema scenarios |
| AC-005 | REQ-001/004/006 | SCN-001/002/004; BEH-001–004 | Save accepted on stopped agent/team | Stays stopped, canonical refresh shows replacement, runtime/workspace/tool policy/run and provider IDs unchanged | Save and reopen evidence |
| AC-006 | REQ-001/006 | SCN-004; BEH-001/002 | Normal resume competes with Save or live ownership exists | Resume-first refuses Save; Save-first resumes committed model; active/archived/owner-uncertain state never bypassed | Existing lifecycle ordering and owner tests extended |
| AC-007 | REQ-006 | SCN-005; BEH-002 | Validation rejection or persistence uncertainty | Rejected candidate changes no durable config; uncertain result requests canonical verification and blocks duplicate Save until resolved | Determinate/indeterminate response coverage |
| AC-008 | REQ-005 | SCN-002; BEH-003 | Parent edit with linked, divergent, direct-edited and mixed-runtime branches | Only intended compatible configured scopes change; invalid affected scope prevents partial validation-save; task records unchanged | Nested Team scenario |
| AC-009 | REQ-004/007 | SCN-001–003; BEH-004 | Accepted switch then normal message/resume | Same conversation and run/provider identity, new model actually used; existing retained context survives | Real supported runtime positive pair, not only metadata test |
| AC-010 | REQ-007 | SCN-003; BEH-005 | Conversation already compacted, then compatible Save/resume | Save does not trigger compaction or rewrite memory; previous summaries/lineage retained; ordinary later compression remains functional | History preservation and normal compression regression |
| AC-011 | REQ-006/008 | SCN-006; BEH-001/006 | Same-model thinking edit with missing replacement capacities; no-change Save; leave draft | Existing allowed settings edit still works; no-op does not write; unsaved selection discarded | Regression against existing settings flow |
| AC-012 | REQ-002/003 | SCN-006; BEH-006 | Catalog/capacity changed after picker load or direct supported API submission violates rule | Save rechecks current facts and rejects incompatibility, preserving canonical state | Server authority, not UI-only filtering |
| AC-013 | REQ-002/007 | SCN-003; BEH-005 | Available target in the same runtime has equal or larger known context capacity, valid settings, but different derived input budget, output limit or compaction threshold | Model replacement is not rejected for those differences. Save does not recompress/reset history; normal resumed compression may use different derived budget values | Positive regression proving no hidden strict-compatibility gate |

## UI, Interaction, And Experience Requirements
- Applicable: Yes; current Settings and existing model picker, no full redesign requested.
- Runtime help: runtime remains fixed. Model help must no longer say all model changes are permanently forbidden; explain “Only models with the same or larger context size are available.” Avoid an unexplained “compatible” label.
- Current value stays visible even when replacement metadata cannot be resolved. Explain whether no candidates exist or verification failed.
- Before Save show the selected model, target-supported settings and affected Team scopes through existing forms.
- Preserve existing keyboard interaction, inspectable disclosures and accessible status/error announcements.
- Product Design request: Not stated. Screenshot is current-behavior evidence, not an approved future visual specification.
- Prototype repository/ticket/revision/UI-UX spec/final reference approval: N/A — not applicable.
- Product decisions: DEC-001–003 below are resolved within the confirmed simple feature and existing-behavior boundary. No separate prototype or new settings-transfer experience is required.

## Quality And Non-Functional Requirements
| ID | Area | Constraint | Scope / verification |
| --- | --- | --- | --- |
| QR-001 | Reliability | Zero run/history/summary/provider-identity loss attributable to model Save | REQ-004/007; preserve-and-resume evidence |
| QR-002 | Compatibility | No acceptance based solely on UI filtering, equal nulls or rounded labels; use verified context-window capacity applicable to that runtime | REQ-002/003; authoritative eligibility cases |
| QR-003 | Accessibility | Preserve keyboard-reachable model control and existing announced save/loading/error feedback | Existing Settings interaction; rendered check |
No new latency SLO, operational policy or deployment obligation is proposed.

## Data Continuity And Acceptable Loss
- Affected: persisted standalone launch metadata and configured Team launch configurations.
- Preserve: run IDs, provider conversation bindings, workspace, tool policy, topology, configured/task history, chat traces, compacted memory, lineage and existing usage history.
- Accepted change: intended model identifier and reviewed target settings in affected scopes only.
- Acceptable loss/reset: none from Save. Existing unsaved-draft discard on leaving Settings remains allowed.
- Unknowns for engineering: current compaction/resume state behavior across actual model pairs; metadata evidence accuracy; native history projection compatibility. No migration is prescribed.

## External Contracts And Dependencies
| Contract | Constraint | Evidence | Uncertainty |
| --- | --- | --- | --- |
| Studio stopped editing | Existing ownership/restore serialization and canonical outcomes preserved while model mutability changes | E04/E05 | API/persistence invariant expansion requires downstream architecture judgment |
| Native request/compaction budget | Current runtime rules, not total capacity alone | E09/E11 | Model-specific defaults and tokenizer/provider differences |
| Codex/Claude resume | Same provider conversation with replacement model must be verified | E08/E10/E12 | Local requests carry model but no positive live switch has been demonstrated; metadata missing |

## Supplemental Artifacts
- `investigation-notes.md`: canonical local evidence, non-normative except cited facts.
- `requirements-revision-record.md`: cumulative round history.
- `evidence/context-budget-probe.mjs` and `evidence/context-budget-probe-result.json`: current native budget counterexample. Synthetic evidence, not an approved user scenario or production test.
- Original screenshot: absolute external user attachment path in investigation notes; current behavior only.
No separate behavior-defining supplement exists. User approval covers this document’s bounded intended behavior; the probe and screenshot are supporting evidence, not additional product obligations.

## Assumptions / Open Decisions
| ID | Question / assumption | Evidence and recommendation | Owner / status |
| --- | --- | --- | --- |
| DEC-001 | Initial product/runtime scope? | Latest user approval explicitly says “agent team or agent” and “just like how we update the model config parameters”. Cover those existing stopped editing surfaces and configured scopes; retain their runtime/ownership boundaries. No new runtimes. | Resolved — user 2026-09-08 |
| DEC-002 | What does model-switch “compatibility” mean? | User explicitly clarifies on 2026-09-08: allow equal or larger model context windows within the same runtime; reject smaller. No native budget/threshold matching. Preserve algorithm, not identical compaction timing. | Resolved — user 2026-09-08 |
| DEC-003 | What happens to old-model settings? | Preserve the existing selected-model schema/default display and validation experience; display the target’s settings before Save. No bespoke transfer/retention guarantee or new settings redesign is part of the request. E02 confirms current generic model change clears the old explicit config and displays target controls/defaults. | Resolved by existing-behavior boundary; no additional product policy |
| ASM-001 | “same model” in initial speech meant another model, not only thinking parameters | Explicit later clarification: “change the model for the same runtime”. | Resolved |
| ASM-002 | Exact-equality restriction remains intended | Superseded by latest user clarification: equal or larger is allowed; smaller is rejected. | Resolved — non-decreasing context size |

## Traceability
| Requirement | Behaviors | ACs | Scenarios | Scope |
| --- | --- | --- | --- | --- |
| REQ-001 | BEH-001–003 | AC-001/005/006 | SCN-001/002/004 | UC-001/002/004 |
| REQ-002 | BEH-005/006 | AC-002/003/012/013 | SCN-003/006 | UC-003/004 |
| REQ-003 | BEH-001/002/006 | AC-001/002/003/004/012 | SCN-001/002/005/006 | UC-001/002/004 |
| REQ-004 | BEH-002/004 | AC-004/005/009 | SCN-001/002/003 | UC-001/002/003 |
| REQ-005 | BEH-003 | AC-008 | SCN-002 | UC-002 |
| REQ-006 | BEH-001–004 | AC-001/004/005/006/007/011 | SCN-001/002/004/005/006 | UC-001/002/004 |
| REQ-007 | BEH-004/005 | AC-009/010/013 | SCN-001/002/003 | UC-003 |
| REQ-008 | BEH-001/006 | AC-003/011 and real-pair AC-009 | SCN-001/006 | UC-001/004 |

## Downstream Architecture Input
- Approved scenarios: SCN-001–006. Map their stopped Settings → review model/settings → Save → normal resume sequences, with existing error/ownership paths, not internal hypothetical mutation paths.
- Deferred technical decisions: authority for runtime-specific model context-window evidence (not a budget-equality gate); how model+settings Save integrates with existing lifecycle and canonical responses; provider resume verification; configured-scope propagation with newly mutable models.
- Facts to verify: external catalog nulls, schema changes on model change, existing effective-budget calculations, native retained/pending compaction state and runtime/provider history compatibility.
- No target software architecture, implementation plan or final architecture-risk classification is supplied here.

## Readiness Check
- Relevant current behavior is evidence-backed: Yes — E01–E12 at the isolated base revision; selected contracts and catalog mappings rechecked on 2026-09-08.
- Desired and preserved behavior explicit: Yes — REQ-001–008; no runtime/compression redesign, no extra budget-matching gate.
- Scope/non-goals clear: Yes — both existing Agent and Team Settings workflows and configured scopes; no delegated-task or topology expansion.
- Requirements and acceptance criteria testable/traceable: Yes — stable IDs, AC-001–013 and traceability table.
- Applicable scenarios covered with validity/evidence: Yes — SCN-001–006; SCN-X01 explicitly excluded.
- Prototype/supplement consistency: Yes / prototype N/A. Current screenshot and pure-budget probe are evidence only.
- Applicable quality and data continuity constraints: Yes — existing state/identity retained, no Save-induced compression/history loss.
- Material product decisions: Resolved within the user-approved simple feature and existing behavior; DEC-001–003 recorded.
- Technical unknowns: Explicitly deferred — runtime-specific capacity authority and real model-pair resume validation. These do not justify inventing extra product compatibility rules or claiming delivery before validation.
- User approval received: Yes — exact 2026-09-08 confirmation in Document Status; continuation requested.
- Requirements package ready for downstream route: Yes.
- Requirements blocker: None.

## Architecture Design Routing Assessment
- Assessment status: `Complete`.
- Assessment owner/date: Requirements Engineer, 2026-09-08, after approval and readiness check.
- Preliminary task size: `Medium` — bounded feature, but existing standalone and configured Team UI/draft, API, persistence and runtime resume behavior are involved.
- Preliminary architectural risk: `High` — model identity is currently an explicitly immutable persisted/contract fact; changing it crosses save/restore lifecycle and authoritative metadata boundaries. This is a preliminary routing input, not the final architecture-owned classification.
- Structural surfaces reviewed: stopped Agent/Team GraphQL inputs/results; model-config mutation and canonical refresh; standalone metadata commit; configured Team tree mutation and root transition; runtime model catalogs; normal same-conversation resume.
- Payload/content surfaces reviewed: existing model identifiers/config schemas/capacity metadata, UI picker/help messages, per-scope settings values.
- Structural-impact triggers: `Present` — API mutability/response contract, persisted-model invariant, and lifecycle/resume integration. No compression algorithm change, new security policy, deployment topology or migration is authorized. Required transition mechanisms remain architecture-owned.
- Evidence paths: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model/tickets/in-progress/stopped-run-compatible-model/investigation-notes.md`, especially E02–E10 and Structural And Payload Surface Inventory; source references are pinned there.
- Decision rationale: A simple product rule is not a presentation-only change. The current server only saves llmConfig, while current external model catalogs lack capacity values. Architecture must establish a bounded way to enforce the approved comparison, save the model coherently and preserve same-run resume. No need to redesign compression or add matching thresholds/tokenizers/input budgets.
- Selected route: `Architecture Designer`.
- Route: `Requirements-to-Architecture-Design`.
- Outcome classification: `Approved Architecture-Ready`.
- Direct-route conditions all satisfied: `No` — structural-impact triggers are present.
- Architecture design/review/revision artifacts: Not yet produced; downstream Software Engineering ownership.
- Downstream re-entry trigger: Return Requirement Gap for any proposed smaller-context exception, new compatibility restriction, compression change, history reset/conversion, new runtime/scope or other scope-changing policy. Resolve technical production-path and final risk decisions in Architecture Design. Preserve non-requirement blockers rather than inventing requirements.

## Cumulative Requirements Outcome
- Package ID: `stopped-run-compatible-model`; revision `RER-004`; status `Approved Architecture-Ready`.
- Approval/readiness: Confirmed above. Product Design request and prototype artifacts: N/A — not requested.
- Task worktree: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model`; branch `requirements/stopped-run-compatible-model`; base `a32b53f6320222c9bf3c7f3a4a3c50fbd1e44f27`.
- Canonical requirements: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model/tickets/in-progress/stopped-run-compatible-model/requirements-doc.md`.
- Canonical investigation: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model/tickets/in-progress/stopped-run-compatible-model/investigation-notes.md`.
- Revision record: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model/tickets/in-progress/stopped-run-compatible-model/requirements-revision-record.md`.
- Probe source: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model/tickets/in-progress/stopped-run-compatible-model/evidence/context-budget-probe.mjs`.
- Probe result: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model/tickets/in-progress/stopped-run-compatible-model/evidence/context-budget-probe-result.json`.
- Original user screenshot: `/home/autobyteus/data/memory/agent_teams/software_development_department_fc281441d1a2400d8fdf7f1813a7986d/requirements_engineer_7b3a3989359d44b5bd614b7b8140527e/context_files/ctx_0ab58212a636__image.png`.
- Requirements-owned production changes: None. Native probe is synthetic current-code evidence; no provider switch or product acceptance test has been claimed. No delivery/finalization work has been performed.
