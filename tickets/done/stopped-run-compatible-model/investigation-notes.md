# Requirements Investigation Notes

## Investigation Meta
- Package: `stopped-run-compatible-model`; current requirements revision: `RER-004`.
- Workspace root: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model`.
- Repository mode: Git; branch: `requirements/stopped-run-compatible-model`.
- Base/reference: `a32b53f6320222c9bf3c7f3a4a3c50fbd1e44f27`, current local `personal` HEAD at intake.
- Isolation: succeeded with `git worktree add -b requirements/stopped-run-compatible-model /home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model HEAD`. Main workspace was clean and was not switched or modified. No fetch/push/merge or production edit performed.
- Bootstrap blocker: None. Skill templates are local/untracked in main workspace, so they were copied using their absolute paths; initial relative template copy in the new worktree failed harmlessly before the successful copy.
- Investigation status: Requirements approved and architecture-routing assessment complete, 2026-09-08. No provider-session switch or production/browser validation performed. See RER-004 for current outcome; earlier dated entries preserve prior decisions.
- Instructions consulted: main workspace `.codex/skills/requirements-engineer/SKILL.md`, its three templates, `autobyteus-web/AGENTS.md`, `autobyteus-server-ts/AGENTS.md`.

## Initial Request And Clarifications
- User wants an existing stopped agent to switch to another model within the same runtime, restricted to the same context size, similarly to today's thinking/model-config update. Compression should not need special handling/redesign.
- Later clarification: “i actually want to be able to change the model for the same runtime you know.” This resolves the speech ambiguity about “same model”.
- Input on 2026-09-06: “but i am not sure what is the best approach. because the compression algorithm currently is the major block for us here”. This is a request for evidence-based recommendation, not approval or withdrawal of the original context constraint.
- Async scope question asked whether this covers standalone + configured Teams across all current runtimes where equal capacity is provable. No explicit answer received; do not infer an answer from “continue”.
- User screenshot: `/home/autobyteus/data/memory/agent_teams/software_development_department_fc281441d1a2400d8fdf7f1813a7986d/requirements_engineer_7b3a3989359d44b5bd614b7b8140527e/context_files/ctx_0ab58212a636__image.png`.
- Visible screenshot evidence: Team Configuration, Codex App Server runtime, locked global model, repeated runtime/model-fixed help, Thinking and Advanced settings, explicit Save. It does not independently prove current server lifecycle state or actual provider capacity.

## Product And Domain Understanding
- Product: AutoByteus Studio web/Electron, persisted Agent and Team settings.
- Actors: Studio user and Team operator; system restore, provider conversation and native/external compression lifecycle.
- “Stopped” means canonical stopped/editable, not merely no current generation. General-managed activity and Application ownership are independent guards. Root Team activity governs configured member editing.
- Runtime kind (`autobyteus`, `codex_app_server`, `claude_agent_sdk`) is not the same field as LLM provider or the catalog model's `runtime: api` transport label. Same-runtime eligibility must use the persisted execution runtime kind.
- Model identity is `llmModelIdentifier`; model options are `llmConfig`. They are currently distinct fixed-versus-mutable facts.
- Maximum advertised context, active/effective runtime context, usable input budget and compaction trigger are distinct concepts.

## Source Log
All paths below are relative to the isolated task workspace above and pinned to the base revision unless explicitly labeled new evidence. Code sources inspected on 2026-09-06; selected contract, model-picker and catalog mappings rechecked on 2026-09-08. No new runtime investigation is claimed.

| ID | Type | Exact source / symbols | Observation / requirement implication |
| --- | --- | --- | --- |
| E01 | Code/User | `autobyteus-web/components/workspace/config/{ExistingRunConfigEditor,AgentRunConfigForm,TeamScopeConfigEditor,MemberOverrideItem}.vue`; user screenshot | Existing-run runtime/model fields explicitly locked. Events only update llmConfig. Screenshot's Team surface is not just a standalone form. |
| E02 | Code | `autobyteus-web/stores/existingRunModelConfigStore.ts` (dirty/canSave/saveAgent/saveTeam); `types/agent/ExistingRunModelConfigDraft.ts`; `services/runConfigEditing/existingRunModelConfigMutationClient.ts`; `components/launch-config/RuntimeModelConfigFields.vue` | Draft/change detection and save only track llmConfig. Canonical refresh and uncertain-write reconciliation exist. Generic new-run model picker clears old settings on actual model change; blindly unlocking it is not enough for existing runs. |
| E03 | Code | `autobyteus-web/services/runConfigEditing/existingTeamModelConfigDraft.ts`; `existingTeamRunFormModel.ts`; `services/runConfigEditing/__tests__/existingTeamModelConfigDraft.spec.ts` | Linked-at-draft-start uses equality of runtime, model and config; direct edits stop propagation. Patches currently contain scope kind/address plus llmConfig only. Existing tests cover divergent and directly edited branches. |
| E04 | Code/Contract | `autobyteus-server-ts/src/api/graphql/types/{agent-run,agent-team-run,run-model-config}.ts`; `src/run-history/services/studio-run-model-config-service.ts`; `src/run-history/domain/run-model-config.ts` | Agent/team stopped mutations accept model settings but no model identifier. Studio ownership guard fails closed; canonical editability/outcomes returned. Agent response exposes canonicalLlmConfig, Team returns canonical tree. |
| E05 | Code/Doc | `autobyteus-server-ts/src/agent-execution/services/standalone-agent-run-lifecycle-service.ts` (`updateStoppedModelConfig`, `withTransition`, restore/buildConfig); `src/agent-team-execution/services/agent-team-run-manager.ts:209–328`; docs `modules/{run_history,agent_execution,agent_team_execution}.md` stopped configuration sections; `autobyteus-web/docs/settings.md:975–1034` | Save and restore share lifecycle transition lanes. Stopped/unarchived/cataloged state checked; all Team targets validate before write. Save does not activate runtime. Fixed runtime/model/provider identity is documented current contract. |
| E06 | Code | `autobyteus-server-ts/src/run-history/services/agent-run-model-config-commit.ts`; `src/llm-management/services/model-config-validation-service.ts` | Agent commit only changes settings, compares settings for no-op/read-back. Validator resolves fixed runtime/model and rejects unknown keys/types/enums/ranges; extending only UI cannot persist model changes. |
| E07 | Code | `autobyteus-server-ts/src/agent-team-execution/services/team-run-model-config-mutator.ts` | Configured root/team/agent scopes only; no task-node targeting. Existing persisted launch structures already have model identifiers, but model mutability is a new invariant. |
| E08 | Code | `autobyteus-server-ts/src/agent-execution/services/standalone-agent-run-lifecycle-service.ts` (`restoreStarted`, `buildConfig`); `backends/codex/thread/codex-thread-manager.ts:190–216`; `backends/codex/backend/codex-thread-bootstrapper.ts` (`buildCodexThreadConfig` call); `backends/claude/session/claude-session.ts:410–430` | Existing resume consumes metadata model and provider identity. Codex request includes existing threadId and configured model. Claude query includes current model and session binding. This is local feasibility evidence, not proof provider accepts a changed model with retained history. |
| E09 | Code/Tests | `autobyteus-ts/src/agent/token-budget.ts:42–119`; `src/agent/loop/llm-phase.ts:81–108`; `src/agent/loop/llm-phase-compaction.ts`; `src/memory/compaction/{compaction-runtime-settings,compaction-planning-budget}.ts`; `tests/unit/agent/token-budget.test.ts` | Native budget uses runtime override → active context → max context; output reservation and provider input cap constrain input, then margin and ratio determine trigger. Budget is resolved from active model/config at execution. Planning key/targets derive from input budget and trigger; equal total size alone is insufficient. Tests inspected, not run. |
| E10 | Code | `autobyteus-server-ts/src/llm-management/services/{model-catalog-service,codex-model-catalog,claude-model-catalog,model-metadata-provisioning-service}.ts`; `src/agent-execution/backends/codex/codex-app-server-model-normalizer.ts:116–153`; `src/runtime-management/claude/client/claude-sdk-model-normalizer.ts:76–100`; `src/api/graphql/types/{llm-provider-model-catalog,llm-provider}.ts`; `autobyteus-web/graphql/queries/llm_provider_queries.ts`; `stores/llmProviderConfigSupport.ts`; `composables/useRuntimeScopedModelSelection.ts` | Catalog/API/client types expose nullable maxContextTokens, activeContextTokens, maxInputTokens, maxOutputTokens. Codex and Claude normalizers explicitly set these null. Current catalog query directly maps snapshots; `enrichBestEffort` is defined but `rg -n enrichBestEffort autobyteus-server-ts/src` finds no call. Do not assume enrichment or frontend transport supplies usable Codex limits. |
| E11 | Probe | `evidence/context-budget-probe.mjs`; `evidence/context-budget-probe-result.json` | Synthetic execution of current pure native budget functions proves context equality does not establish budget/trigger equality. Exact command/results below. |
| E12 | Code | `autobyteus-server-ts/src/agent-execution/backends/codex/thread/codex-thread-token-usage.ts:114–125`; Codex `events/codex-provider-compaction-status-projector.ts`; Claude `session/claude-session-token-usage.ts:242–246`, `events/claude-session-event-converter.ts`; AutoByteus `backends/autobyteus/autobyteus-agent-run-backend-factory.ts` | External runtime usage may report effective capacity on an already used run, and external compaction boundaries are projected separately. This does not provide pre-switch candidate capacity. AutoByteus native backend supplies its own compaction runner; native budget equations cannot be assumed to control Codex/Claude compaction. |

## Relevant Existing Behavior And Supported Product Paths
| Behavior | Trigger | Current product sequence/outcome | Evidence / confidence |
| --- | --- | --- | --- |
| BEH-001 | Open Settings of selected existing run | Load fresh canonical configuration → inspect locked runtime/model → editable current-schema options only when stopped → explicit Save | E01/E02/E05, high static confidence |
| BEH-002 | Save changed thinking/config | Validate lifecycle/ownership/current model schema → persist llmConfig only → canonical result or clear error | E04–E06, high static confidence |
| BEH-003 | Edit stopped configured Team scope | Local bounded parent propagation → exact-scope patches → all targets validated before one tree update | E03/E05/E07, high static confidence |
| BEH-004 | Normal message/resume after Save | Restore same durable conversation using saved launch values; no new provider identity fallback | E05/E08; changed-model provider execution still unverified |
| BEH-005 | Native runtime evaluates context usage / external runtime reports compaction | Native budget/policy derives from model/config/current settings; external reports processed in own adapters | E09/E12; future cross-model tokenization not guaranteed |
| BEH-006 | Load runtime model catalog | Picker has nullable capacity metadata; external catalog mappings return null; no supported compatible replacement selector | E10, high static confidence |
Model replacement through stopped Settings has **no current supported behavior**. Proposed trigger is user-authored; synthetic functions or manual file changes are not approved journeys.

## Relevant Codebase And Technical Facts
- Existing UI → mutation → durable update is deliberately settings-only at multiple boundaries, not merely a disabled select. Source types, no-op detection, schema selection, canonical responses and projections all assume model identity is fixed.
- Existing native/adapter restore already consumes a model selection plus stored run/provider identity. This suggests reuse of the product Save/resume flow but does not settle architecture or external-provider support.
- Team editing uses configured snapshot equality, not retained override provenance. New “reset to definition” or task-instance model editing would invent scope.
- Native compaction runner fallback may use the parent launch model; replacing it can alter future generated summaries without changing the compaction algorithm. No claim of identical summary contents is appropriate.
- Current model capacity metadata describes model/catalog or observed run values. Future candidate runtime capability and current historical run capacity must not be conflated; live usage of the current model alone cannot prove the candidate's capacity.

## Structural And Payload Surface Inventory
### Payload/content surfaces
- Existing model metadata/catalog rows and schemas; UI help/errors; provider listings; persisted launch settings.
- Metadata is partly nullable and runtime-scoped. Current evidence does not qualify a real replacement pair in the user's Codex runtime.
### Structural surfaces
- GraphQL stopped Save inputs/results; draft/canonical state; Agent metadata/Team snapshot invariants; lifecycle Save-versus-resume and ownership guards; native and external resume behavior.
### Potential architecture-design triggers
- API/external contract change: present if model switching is approved (settings-only mutability expands).
- Persistence invariant: present (existing model becomes mutable even if shape already contains the field).
- Lifecycle interaction: present (saved replacement must be consumed consistently at resume, without activation on Save).
- Catalog/capacity authority: unresolved technical evidence needed.
- Security/ownership, deployment, migration, subsystem ownership or refactor: no newly authorized change. Preserve existing boundaries; unknown implementation implications remain for Architecture Designer.
- This inventory is evidence, not the post-approval routing assessment or final risk classification.

## Runtime, Probe, Or Reproduction Findings
Command from isolated root:
`node tickets/in-progress/stopped-run-compatible-model/evidence/context-budget-probe.mjs > tickets/in-progress/stopped-run-compatible-model/evidence/context-budget-probe-result.json`

Node `v22.23.2` executed successfully. The script reads the current `token-budget.ts`, removes import declarations and erases TypeScript types using `node:module.stripTypeScriptTypes`, then imports the unchanged pure function bodies. Synthetic model/config objects are supplied; no provider/network, secrets, production sessions or source modifications. Node emitted an experimental-feature warning; exit code was zero.

| Synthetic case | Effective context | Usable input budget | Trigger |
| --- | ---: | ---: | ---: |
| Baseline, 8k output reserve | 128000 | 119744 | 95795 |
| Same context, 16k output reserve | 128000 | 111744 | 89395 |
| Same context, 100k provider input cap | 128000 | 99744 | 79795 |
| Same context, model default ratio 0.7 vs 0.8 | 128000 | 119744 | 83820 |
| Missing context/input capacity | Unknown | No capacity result | N/A |

Conclusion: retaining the same algorithm is possible as a feature boundary; identical context size **does not** mathematically guarantee unchanged native thresholds. Equal usable input budget and trigger preserve native planning-budget dimensions under the inspected rules, but do not prove unchanged tokenization or provider-history compatibility.

Not run: full test suites, browser/Electron reproduction, live Codex/Claude model change or actual native conversation restore under a different model. No claim of executable feature acceptance. Reviewed tests include native budget coverage, standalone save/restore ordering and Team propagation. `pnpm` was not found on this shell PATH; no dependency installation attempted because production validation belongs downstream.

## Stakeholder And User Evidence
- High authority: same execution runtime must be retained; change model identity, not just thinking options; initially same context; avoid compression redesign.
- Explicit uncertainty: the user wants advice on compatibility/compression, not an assumed approved solution.
- Screenshot establishes Codex Team relevance, not a particular model's true context capacity. No model names/capacities have been inferred from branding.

## External Contracts, Standards, And Dependencies
Only checked local implementation and bundled documentation. No external provider API guarantee, current public model specifications, or web-derived claims are asserted. Runtime-specific same-conversation model switch and capacity evidence remain downstream feasibility questions. Unknown external compaction internals must not be replaced with native equations or guessed defaults.

## Persisted Data And State Facts
- Standalone: `run_metadata.json` with `llmModelIdentifier`, `llmConfig`, runtime and provider binding; current settings commit replaces llmConfig only.
- Team: current V2 execution tree; root/nested default and configured member launch configurations; concrete IDs, topology and task records coexist.
- Readers: resume services, lifecycle restore, Settings projection and history caches. Writers inspected: Agent model-config commit and configured Team mutator/atomic tree store.
- Volume: per selected run/configured scopes; no measured production counts. No need inferred for bulk history rewrite.
- Preserve history, retained compaction summaries/lineage and usage events; no reset/loss authorized by Save. No migration mechanism selected.
- Residual question: pending/native compaction state and provider-specific history compatibility on actual replacement pairs require verification before delivery.

## Product Design Request Context / Findings
- Product Design request: Not stated. User supplied screenshot to explain current behavior and asked for analysis.
- Separate prototype repo/ticket, visualizer, UI/UX specification, review URL, approved final references: N/A — not applicable.
- No Product team mode or repository work selected; no specialist handoff made.

## Supplemental Artifact Inventory
| Artifact | Owner | Purpose / scope | Status / approval |
| --- | --- | --- | --- |
| `evidence/context-budget-probe.mjs` | Requirements Engineer | Reproducible current pure-budget counterexample, REQ-002/007 | Executed; evidence only |
| `evidence/context-budget-probe-result.json` | Requirements Engineer | Retained probe results, REQ-002/007 | Successful synthetic run; not product validation |
| User attachment absolute path above | User | Current Team/Codex Settings evidence, BEH-001/003 | Not normative future UI approval |

## Assumptions, Unknowns, And Risks
| ID | Type | Finding | Resolution / owner |
| --- | --- | --- | --- |
| DEC-001 | Resolved | User explicitly confirms stopped Agent and Team editing like existing model settings | Existing-surface parity, configured scopes and existing runtime boundaries; approved 2026-09-08. |
| DEC-002 | Confirmed policy | User clarifies equal or larger context size is allowed on 2026-09-08 | Same runtime + known target capacity >= currently saved capacity per scope. Reject smaller/unknown, with no extra native budget/threshold matching. Approved 2026-09-08. |
| DEC-003 | Resolved boundary | Existing selected-model settings/default UI and schema validation apply | No new transfer/retention guarantee; current generic picker clears old explicit config on model change. Target settings remain reviewable before Save. |
| RISK-001 | Risk | Codex/Claude catalog capacities null; naive equality allows unknowns or produces empty feature | Engineering needs authoritative capacity and real eligible-pair evidence |
| RISK-002 | Risk | Equal capacities/budgets still do not prove equal tokenization or compatible retained provider history | Do not promise no future compaction; runtime-specific resume validation needed |
| RISK-003 | Risk | Blind reuse of generic picker resets llmConfig and existing dirty checks miss model-only change | Requirements cover reviewed settings and coherent model/config Save |
| RISK-004 | Risk | General scalar budget may not describe provider-native compaction | Preserve ownership, do not prescribe native policy to external runtimes |

## Requirement Implications / Downstream Notes
Recommend solving **same-runtime model replacement without reducing context-window size**, not redesigning compression. Keep stop → select → review → Save → normal resume. Require verified target model context-window capacity greater than or equal to the currently saved model capacity for that runtime, retain history and prohibit switch-induced reset/recompression. A larger model does not require rebuilding previously compacted history. Following the user's 2026-09-08 simplification, **do not add equal-input-budget or equal-trigger requirements**. Different output reservations/limits, reasoning options or native budget values are not independently disqualifying; normal schema validation still applies. The previous stricter proposal was conservative, not a necessary consequence of the code. It remains visible only in RER-001 history and evidence.

The current-code budget counterexample remains relevant as a caveat: preserving the algorithm does not mean identical compaction timing. It must not be used to reintroduce the removed eligibility restriction without user approval.

Product scenarios SCN-001–006 are now approved, with SCN-X01 excluded. Architecture Designer owns the technical production-path map and final technical decisions; Software Engineering owns implementation, validation and delivery. Outcome is Approved Architecture-Ready. No technical production path or delivery work has been performed by Requirements Engineer.

## RER-002 — User Simplification, 2026-09-08
- User: “as long as the model context size is the same ... then we allow it” and asks what “compatible” means.
- Decision treatment: adopt the simpler direction in the draft; explain that earlier “compatible” included optional budget/threshold checks. This is not full requirements approval or an implementation request.
- Capacity terminology: total context-window capacity applicable to the model/runtime, not derived input headroom or remaining tokens. Actual metadata authority remains an engineering question; unknown capacity cannot prove equality.
- Changes: REQ-002, BEH-005, SCN-006, AC-002, new AC-013, DEC-002 and corresponding scope/copy/traceability. No production changes or additional probes.
- Remaining: overall scope/settings confirmation and package approval. Runtime metadata gap and real-pair resume validation remain evidence gaps, not permission to add arbitrary compatibility conditions.

## RER-003 — Equal Or Larger Context, 2026-09-08
- User correction: “128k → 200k ... should be allowed ... 128 to 64K is not allowed ... when context size get bigger its allowed”.
- Confirmed capacity dimension: same runtime; known positive target context size >= known positive currently saved model context size. Each changed Team scope uses its own current saved model as the comparison baseline.
- Supersedes RER-002 exact equality. Earlier exact-equality text in dated history is historical, not governing policy. Extra input-budget/output-limit/compaction-threshold matching remains excluded.
- Examples: 128k → 128k allowed; 128k → 200k allowed; 128k → 64k rejected. After a successful 200k save, 200k → 128k is a decrease and is rejected under the same current-model rule.
- Preservation: keep existing history/summaries and compression algorithm; do not rebuild previously compressed context when increasing capacity. Ordinary compression may follow different model-derived budgets after resume.
- Updated REQ-002, BEH-005/006, SCN-006, AC-002/013, scope, UI copy, DEC-002/ASM-002 and current investigation conclusion. No production changes, new technical guarantees, probes or delivery claims.
- Requirements package remains Draft pending remaining scope/settings confirmation and overall approval. No engineering handoff applies to this clarification-only outcome.

## RER-004 — Approval And Routing, 2026-09-08
- Explicit approval evidence: “yes. basically no compression changes, as long as New model context size ≥ current model context size. and when the agent team or agent is stopped. just like how we update the model config parameters.” User subsequently requested continuation.
- Scope resolved: both existing stopped Agent and Team settings, same runtime, known target model context >= current saved model context. No input-budget/output-limit/threshold/tokenizer matching. No compression changes.
- Settings behavior remains existing schema/default display and validation; no bespoke transfer policy. Rechecked `RuntimeModelConfigFields.vue:326–336` confirms ordinary model selection clears the old explicit config, allowing target schema/default controls.
- Rechecked standalone/Team stopped configuration contracts in `docs/modules/{agent_execution,agent_team_execution}.md`, GraphQL Agent/Team inputs, and Codex/Claude model normalizers. Model identity remains currently fixed and external catalog capacities remain null at this source pin.
- Readiness passes: intended behavior is unambiguous, supported scenario basis established, preserved state/ownership and testable acceptance recorded, no outstanding material product decision. Capacity metadata authority and real-pair resume evidence are technical work for downstream ownership, not requirements blockers.
- Assessment: Complete; preliminary size Medium, risk High; present API mutability, persisted-model invariant and save/resume integration triggers. Select Architecture Designer, outcome Approved Architecture-Ready. Final size/risk/production-path decisions remain Architecture Designer-owned.
- No target architecture specified, no production source edits and no engineering execution claimed. Existing synthetic native-budget probe remains retained evidence only and cannot be used to reintroduce rejected compatibility gates.
