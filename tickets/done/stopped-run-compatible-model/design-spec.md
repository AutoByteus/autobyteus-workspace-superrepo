# Design Spec — stopped-run-compatible-model

- Result: **Architecture Design Complete**; architecture revision **AD-REV-001**; 2026-09-08.
- Upstream authority: **Approved RER-004**. Read `requirements-doc.md`, `investigation-notes.md`, and `requirements-revision-record.md` in this ticket. Earlier strict-compatibility proposals are superseded, not implementation requirements.
- Canonical workspace: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model`.
- Branch/base: `requirements/stopped-run-compatible-model` / `a32b53f6320222c9bf3c7f3a4a3c50fbd1e44f27` (local `personal` at intake).
- Paths below are relative to that workspace unless absolute. Abbreviations: **S** = `autobyteus-server-ts/src`, **W** = `autobyteus-web`, **C** = `autobyteus-ts/src`, **T** = `tickets/in-progress/stopped-run-compatible-model`.
- Approved scope: SCN-001–006, BEH-001–006, REQ-001–008, AC-001–013. No intended-behavior revision. Prototype, approved UI/UX specification and Product review: **N/A — not applicable**.
- Architecture review: selected, pending. Implementation/source review/API-E2E/delivery results: **N/A — not yet performed**. No `implementation-handoff.md` is created by Architecture Designer.

## Current-State Read

Stopped editing is a real existing product path, not a new execution system. The frontend loads canonical resume configuration, edits a local settings draft, sends explicit Save, and reconciles uncertain writes. Studio's ownership boundary rejects live Application ownership. Standalone lifecycle and Team manager serialize Save with restoration. The metadata/tree already store both model identity and settings, but current commands, dirty checks and commits deliberately change settings only.

Standalone restore builds `AgentRunConfig` from saved metadata. Configured Team restoration reconstructs nodes from the saved V2 execution tree; lazy member activation builds its Agent config from those nodes. Both therefore already have the correct downstream location for a replacement model. External restoration carries the existing provider ID. Native restoration reads current working-context and lineage stores. None requires a Save-time history rewrite.

The technical gap is not compaction: external model catalog rows omit capacities; the existing schema validator and commit contract assume fixed model identity. Architecture investigation found runtime-owned metadata mechanisms that can supply actual context ceilings without model-name guesses. They are isolated behind LLM-management selection validation and do not alter compaction configuration.

Workspace verification: `git status --short`, `git branch --show-current`, `git rev-parse HEAD`, `git worktree list` confirmed the assigned isolated worktree/base. Intake had only the ticket directory untracked. No competing workspace, production edits, commits, merge, push, release, or delivery finalization is part of this round. Server/Web AGENTS.md and the architecture skill, shared design principles, and relevant scenario example were read.

## Task Size And Architectural Risk (Mandatory)

- `task_size`: **Medium**.
- Size evidence: bounded extension of existing stopped Agent and configured Team forms, draft planner, two mutation contracts, two persistence owners, and runtime metadata adapters. Composition-root wiring and focused tests accompany those changes. No new execution owner, history format, runtime, topology, or compression subsystem.
- `architectural_risk`: **High**.
- Risk evidence: previously immutable persisted model identity becomes mutable; Agent canonical response changes; Save/restore ordering and Team patch atomicity must cover the model/settings pair; runtime metadata authority and real changed-model continuation are material external-boundary concerns. The Codex cache adapter is a private provider-data dependency, deliberately isolated and fail-unknown.
- Selected route: **Architecture Review** (High risk independently selects it). Current `get_handoff_rules` initial completed-design Large-or-High rule resolves to `/software_engineering_team/architecture_reviewer`; only that matching outcome recipient is notified.
- Payload inventory: model identifiers and capacities, schema-backed values, translations, fixtures, evidence JSON/Markdown. Payload volume does not cause the classification.
- Structural inventory: GraphQL commands/queries, selection-validation boundary, runtime capacity readers, draft types/events, canonical state and commit semantics, dependency injection. These changes—not catalog row count—cause High risk.
- Escalation: new history conversion, runtime ownership change, undocumented replacement restriction, persistence schema transition, or materially different metadata mechanism is **Design Impact**; any intended-behavior expansion/restriction is **Requirement Gap**. Unavailable validation credentials/environment are reported factually, never converted into all-targets-disabled delivery success.

## Architecture Investigation Evidence

These AE IDs are additional architecture evidence, not edits to upstream E01–E12. Source observations are at the pinned base unless the row states runtime/package observation.

| ID | Exact source / command | Observation | Decision / remaining uncertainty |
| --- | --- | --- | --- |
| AE-01 | `S/agent-execution/services/standalone-agent-run-lifecycle-service.ts:84–170,217–239,261–300,387–404`; `S/run-history/services/studio-run-model-config-service.ts` | Studio guard precedes lifecycle command; Save and restore use one run transition; restore consumes saved model and binding. | Extend these owners, not an independent save service or runtime mutation. Preserve existing ownership contract. |
| AE-02 | `S/run-history/services/agent-run-model-config-commit.ts`; `agent-run-history-catalog-service.ts:227–241`; `S/run-history/store/agent-run-metadata-store.ts` | Atomic JSON metadata writer; no-op and read-back compare only llmConfig. | Compare/commit full model-settings pair; metadata field set already sufficient. |
| AE-03 | `S/agent-team-execution/services/agent-team-run-manager.ts:150–178,209–328`; `team-run-model-config-mutator.ts` | Root transition owns validation; configured targets resolved before one tree write; no task-node traversal. | Preserve exact target boundary and all-before-write validation. |
| AE-04 | `S/agent-team-execution/services/team-run-execution-tree-builder.ts:75–121`; `S/agent-team-execution/backends/mixed/members/mixed-agent-member-handle.ts:275–320,423–461` | Configured launches and platform IDs are reconstructed; member activation uses node.llmModelIdentifier and node.llmConfig. | No member metadata double-write or definition re-resolution. Test saved propagation into lazy restore. |
| AE-05 | `W/stores/existingRunModelConfigStore.ts:69–85,150–184,229–420`; `W/services/runConfigEditing/{existingTeamModelConfigDraft,existingTeamRunFormModel,existingRunModelConfigMutationClient}.ts` | Drafts, dirty, success and failure canonical paths are settings-only; Team link predicate already compares runtime/model/config at draft start. | Promote pair through entire path; retain original links and uncertainty state machine. |
| AE-06 | `W/components/launch-config/RuntimeModelConfigFields.vue:326–336`; `W/components/workspace/config/{ExistingRunConfigEditor,AgentRunConfigForm,TeamScopeConfigEditor,MemberOverrideItem,TeamRunConfigForm}.vue` | Model change emits model then null config; existing-run forms discard/lock model event; historical schema handling is distinct. | Wire a coherent selection change and reuse target schema/defaults; no cross-model transfer algorithm. |
| AE-07 | `S/llm-management/services/{model-catalog-service,model-config-validation-service,model-metadata-provisioning-service}.ts`; external normalizers referenced by E10 | Validator alone owns catalog lookup/schema validation; generic enrichment is not wired and is not runtime-specific. | Clean-cut selection-validation owner, retain schema rules; do not call generic enrichment as proof of Codex/Claude capacity. |
| AE-08 | `node T/evidence/architecture-runtime-capacity-probe.mjs --claude-sdk /tmp/stopped-model-sdk/package/sdk.mjs` (actual full command below) | Metadata-only execution succeeded. Codex 0.153.4 model/list exposes no capacity; same-home version-matched provider cache has exact context_window rows. gpt-5.5 and gpt-5.6-terra both 272000; spark row 128000. No context override in probe cwd. | A real catalog has positive equal/larger candidates. Cache numbers are runtime metadata, not universal API model specs. Not a live changed-model conversation test. |
| AE-09 | `npm pack @anthropic-ai/claude-agent-sdk@0.3.231 --pack-destination /tmp/stopped-model-sdk --silent`; extracted `package/sdk.d.ts:1224–1273,2488–2508,3228–3265`; same retained probe | Pinned SDK supportedModels has resolvedModel but no capacity; zero-turn query controls setModel/getContextUsage report model and rawMaxTokens before inference. Installed Claude 2.1.259 returned 1M/200k ceilings for locally remapped aliases. | Use resolved runtime response, not assumptions that opus/sonnet imply Anthropic model IDs or fixed sizes. Probe used host environment; production must use existing server SDK auth/environment resolution. |
| AE-10 | `codex app-server generate-ts --out /tmp/stopped-model-architecture-schema`; generated `v2/{Model,ThreadResumeParams,ConfigReadParams,ConfigReadResponse}.ts` | Generated current protocol confirms absence of capacity in Model, model override on resume, cwd-aware config/read. | Isolated cache adapter needed; no guessed new model/list fields. Temporary generated files are reproducible, not required handoff artifacts. |
| AE-11 | [Official Codex App Server](https://learn.chatgpt.com/docs/app-server), fetched 2026-09-08, thread/resume section | Documents same-thread resume with a different model and a next-turn model-switch instruction. | Provider contract supports reuse; actual installed integration and compacted-history positive test remain downstream gates. |
| AE-12 | [Official Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference), fetched 2026-09-08, model_context_window/model_catalog_json | Effective context configuration and a custom catalog can vary by runtime/profile. | Resolve metadata from the same launch environment/cwd; never read the architect's home in production or equate advertised maximum with active default. |
| AE-13 | `S/agent-execution/backends/autobyteus/autobyteus-agent-run-backend-factory.ts:232–268,426–472`; `C/memory/restore/working-context-snapshot-bootstrapper.ts`; `C/memory/memory-manager-compaction-coordinator.ts:96–109`; `C/agent/loop/llm-phase-compaction.ts` | Native restore uses same ID/memory, new LLM config, strict v5 snapshot and existing lineage checks. Pending request/threshold episode start as in-memory state; request-recovery capture/restore is not a new stopped-model persistence format. | No compression or pending-state migration. Ordinary restore may persist its normal protocol-safe snapshot; do not falsely test that resume itself performs zero writes. Save must perform zero memory/lineage writes. |
| AE-14 | Read-only structural sample of `/home/autobyteus/data/memory/agents/1c4809b6-7ee5-4f8d-ab6b-c1eab141b600/run_metadata.json`; `/home/autobyteus/data/memory/agent_teams/software_development_department_fc281441d1a2400d8fdf7f1813a7986d/team_run_execution_tree.json`; `S/run-history/store/{team-run-execution-tree-store,team-run-execution-tree-schema,team-run-file-commit-writer}.ts` | Current Agent sample has model/config/runtime/platform ID; current Team V2 has six-field launch configurations including model/config. Local inventory: 41 Agent metadata files, 27988 bytes; 50 Team trees, 620569 bytes. Inspected keys/counts, not conversation content; no writes. | Directly usable persisted shapes. Counts are this local environment only, not production estimates. |
| AE-15 | `rg -n 'ModelConfigValidationService|RunModelConfigValidator' autobyteus-server-ts/src` | Dependency injected through Studio, general-process supervisor, Application scope kernel and standalone Application host. | Update the type/wiring everywhere; changing only Studio construction would leave a broken dependency contract. |

Retained probe command (from workspace root):

```sh
node tickets/in-progress/stopped-run-compatible-model/evidence/architecture-runtime-capacity-probe.mjs \
  --claude-sdk /tmp/stopped-model-sdk/package/sdk.mjs \
  > tickets/in-progress/stopped-run-compatible-model/evidence/architecture-runtime-capacity-probe-result.json
```

The script uses Codex model/list + config/read and Claude zero-turn control queries, closes its processes, does not resume a Studio run or submit an inference turn. It is architecture feasibility evidence, **not executable feature acceptance**. No production suites/browser tests were run; worktree dependencies are absent and pnpm was not on PATH. The external SDK tarball was inspected in `/tmp`, not installed into the repository.

## Intended Change

One selection is `{ llmModelIdentifier, llmConfig }` under an immutable saved runtime. For an actual identifier change, server-side known positive context capacities must satisfy `target >= current saved` for each changed configured scope. Availability and normal target schema validation still apply. Equal-model settings edits bypass replacement-capacity discovery entirely.

Save changes only that pair, never activates or changes provider identity. Normal resume consumes the committed pair. No tokenizer, input/output-budget, threshold or strategy matching; no compaction-setting edits, recompression, reset, migration, model-pair allowlist, or new conversation fallback.

## Relevant Behavior And Production-Path Map (Mandatory)

| Behavior ID | Kind | Approved requirements / AC | Trigger / supported scenario | Existing evidence | Changed / preserved outcome | Target lifecycle / spines |
| --- | --- | --- | --- | --- | --- | --- |
| BEH-001 | User | REQ-001/003/006/008; AC-001/005/006/011 | Open stopped Agent or configured Team Settings; SCN-001/002/004 | E01–05; AE-01/03/05/06 | Runtime fixed; selection editable only at existing root/standalone eligibility; explicit Save and discard | DS-01/02/03/06/07 |
| BEH-002 | Contract | REQ-002/003/004/006; AC-002/004/007/012/013 | Save candidate; SCN-001/002/005/006 | E04–06; AE-01/02/03/07 | Revalidate authoritative saved baseline and target schema; coherent commit/no-op/canonical recovery | DS-02/03/06/07 |
| BEH-003 | User | REQ-005; AC-008 | Edit configured root/nested/member; SCN-002 | E03/07; AE-03/04/05 | Follow only original linked descendants; direct/divergent/mixed-runtime branches remain untouched; all patches valid before write | DS-03/05/08 |
| BEH-004 | System | REQ-004/007; AC-005/009/010 | Normal next message/resume after Save; SCN-001–003 | E08; AE-01/04/11/13 | Same run/provider identity, selected model, retained context; no new-history fallback | DS-04/05/06 |
| BEH-005 | System | REQ-002/007; AC-002/009/010/013 | Already compacted conversation resumes; SCN-003 | E09/11/12; AE-13 | Save does not call compaction; existing normal later compaction may have different model-derived budgets | DS-04/05/09 |
| BEH-006 | User | REQ-002/003/008; AC-003/011/012 | Inspect choices/unknown metadata; SCN-006 | E02/10; AE-07–10/12 | Exact eligible replacements only; current remains visible; metadata failure doesn't newly block same-model settings | DS-01/02/03/06/10 |

Scenario classification is unchanged: SCN-001–003 Supported Normal; SCN-004–006 Supported Explicit Edge by upstream contracts; SCN-X01 technically possible but unsupported. The metadata probe only reproduces an internal dependency of approved SCN-006; it does not create a new end-user workflow. Arbitrary file edits, historical task edits, new multi-tab merging, or fault-recovery redesign do not justify added machinery.

## Relevant Supplemental Task Artifacts

| Artifact | Purpose | Related IDs | Relationship / status |
| --- | --- | --- | --- |
| `T/evidence/context-budget-probe.mjs`, `context-budget-probe-result.json` | Upstream pure native-budget counterexample | BEH-005; AC-013 | Retained read-only; explains differing ordinary budgets, never an eligibility gate |
| `/home/autobyteus/data/memory/agent_teams/software_development_department_fc281441d1a2400d8fdf7f1813a7986d/requirements_engineer_7b3a3989359d44b5bd614b7b8140527e/context_files/ctx_0ab58212a636__image.png` | User's existing Team Settings screenshot | BEH-001/003 | Existing-behavior evidence only; not normative target mockup |
| `T/evidence/architecture-runtime-capacity-probe.mjs`, `architecture-runtime-capacity-probe-result.json` | Reproducible runtime metadata feasibility | BEH-006; AC-003/012 | Architecture-owned executed metadata probe; not inference/acceptance evidence |

## Task Design Health Assessment (Mandatory)

- Change posture: **Feature / Behavior Change**.
- Current design issue: **Yes, for direct addition of this feature**, not a claim that the current settings-only feature is defective.
- Root cause: **Missing Invariant**, with **Shared Structure Looseness** if model/config are carried independently through the new path. Current owners are correct, but their types and comparisons encode immutability of model.
- Refactor needed now: **Yes, bounded**. Replace the fixed-model validation entry with one run-selection owner, extract unchanged schema validation, and use a coherent pair in drafts/patches/canonical response. Remove fixed-model-only assumptions rather than add a second switch command.
- Evidence: AE-02/05/06/07/15; mere picker unlocking would not persist or reconcile the changed model and can attach old settings to a new model during event propagation.
- Refactor rationale: the same selection invariant is needed by Agent, Team, and option discovery. Single ownership prevents independent UI/server compatibility policies and lifecycle bypass.
- Deferred: broader catalog consolidation, Application ownership redesign, cross-process/multi-browser revision protocol, unsupported profile metadata coverage, and general persistence hardening. Existing boundaries remain; residual risk is unchanged concurrency scope plus external metadata adapter drift. These are not permission to weaken approved Save outcomes.

## Terminology

- **Selection**: the mutable model identifier + explicit nullable settings, not execution runtime or provider binding.
- **Capacity**: verified total context-window tokens applicable to the model/runtime environment, before output reserve. Not usage, remaining tokens, provider input-only limit, 95% safety budget, compaction trigger or an API marketing maximum in a different runtime.
- **Original selection**: canonical selection at draft creation; used for dirtiness and original Team links. **Current saved selection**: fresh authoritative storage inside Save transition; used for eligibility.
- **Configured scope**: root `/`, configured nested Team address, or configured Agent address in this root tree. Never a historical task instance.

## Design Reading Order

Evidence and behavior → state/transition decisions → DS spine inventory and ownership → interfaces and capacity contract → reusable structures/file responsibilities → sequence and validation. All mandatory sections are below; no greenfield runtime design is implied.

## Legacy Removal Policy (Mandatory)

**No backward compatibility; remove legacy code paths.** Replace the settings-only command shape at all in-repo callers with a required selection pair. Do not keep an optional model field defaulting to persisted model as an old-client compatibility route. Same-model editing is the *same* new command with the current identifier, not a second legacy command. Existing stored records already match the target data shape; preserving them requires no historical reader branch.

## Persisted Data / State Transition Decision (Mandatory When Persisted Data May Be Affected)

- Subjects: per-run `run_metadata.json`; per-root `team_run_execution_tree.json` V2. Representative keys and local volume in AE-14.
- Change: mutability of existing `llmModelIdentifier` and `llmConfig` values only; no added stored fields or schema-version change. Runtime capacities/options are transient, not persisted with runs.
- Normal readers: Agent metadata normalizer accepts nonempty identifiers; Team strict V2 validator accepts nonempty model and object/null config. Restore reconstructs these same fields; GraphQL and DTO projections already include them. Neither encodes an initial-model invariant in its stored shape.
- Writers: Agent catalog queue + atomic JSON writer; Team one validated tree + rename/finalization-aware writer. Extend commit equality/read-back to the whole pair, preserve all other fields.
- Invariants: immutable run, runtime, provider conversation, topology, workspace, skill/tool policy; only selected configured scopes changed. Task executions, delegation records, communication history, raw traces, working-context, compaction lineage and token-usage records stay untouched by Save.
- Decision: **Directly Usable — No Migration** for launch metadata/tree. **Not Affected** for history, current memory schemas and provider transcripts.
- Rationale: identical recognized fields and semantics remain valid under ordinary current-schema readers. Bulk rewriting would add I/O and corruption/recovery exposure without any correctness benefit. No acceptable data loss; no discard/rebuild.
- Constraints: per-run filesystem atomic update, no database DDL; no version-specific read branches, no duplicate model shadow field. Team old-schema migration infrastructure remains unchanged/out of scope. Frontend/backend ship the new API contract together; no old-client adapter.
- Supports REQ-004–007 / AC-005–010. Migration plan: **N/A — no transformation required**.

## Data-Flow Spine Inventory

| Spine | Scope | Behaviors | Start → end | Governing owner | Why |
| --- | --- | --- | --- | --- | --- |
| DS-01 | Primary End-to-End | 001/006 | Open Settings → bounded verified choices | Studio selection query boundary | Runtime/cwd-specific capacity without activating saved run |
| DS-02 | Primary End-to-End | 001/002 | Agent Save → canonical persisted pair shown, still stopped | Standalone lifecycle | Full command, guards and persistence |
| DS-03 | Primary End-to-End | 001/002/003 | Team Save → canonical configured scopes shown, still stopped | Team manager | All-scopes validation and one root-tree write |
| DS-04 | Primary End-to-End | 004/005 | Agent next message → answer with retained context/new model | Standalone lifecycle / AgentRun | Same conversation continuation |
| DS-05 | Primary End-to-End | 003/004/005 | Team next message → configured member answer | Team manager / member activation | Durable tree reaches lazy member restore |
| DS-06 | Return-Event | 001/002/004/006 | Save result / canonical refresh / lifecycle update → reconciled editor | Existing run draft store | No stale or false success, no duplicate uncertain Save |
| DS-07 | Bounded Local | 001/002 | Transition acquire → check/validate/commit → release | Lifecycle/Team manager | Save-versus-resume ordering |
| DS-08 | Bounded Local | 003 | Direct edit → linked descendant traversal → explicit patches | Existing Team draft planner | Preserve propagation boundaries |
| DS-09 | Bounded Local | 005 | Native normal LLM usage → existing compaction decision → normal next boundary | Native memory/LLM loop | Demonstrates deliberate no-change boundary |
| DS-10 | Bounded Local | 006 | Capacity lookup → exact metadata read/control → close → known/unknown | Runtime capacity adapters | Metadata-only discovery, bounded process lifecycle |

## Primary Execution Spine(s)

- DS-01: `Settings editor → options query client → subject GraphQL resolver → StudioRunModelConfigService (saved context) → RunModelSelectionService → RuntimeModelCapacityService/runtime adapter → verified choices → existing model control`.
- DS-02: `Agent editor → existing draft store/mutation client → Agent resolver → Studio ownership gate → AgentRunService → Standalone lifecycle transition → selection validation → history catalog commit → atomic metadata → canonical editor`.
- DS-03: `Team editor/planner → mutation client → Team resolver → Studio ownership gate → TeamRunService → Team manager root transition → resolve configured targets/validate all → mutate tree/write once → canonical editor`.
- DS-04: `Normal message → AgentRunService → standalone restore transition → buildConfig(saved metadata) → AgentRunManager/backend factory → same-ID native snapshot restore or external provider resume → normal turn/new-model answer`.
- DS-05: `Normal Team message → TeamRunService/Team manager restore → state-package loader → buildTeamRunConfigFromExecutionTree → mixed Team/member handle → AgentRunConfig(saved configured node) → same-ID backend restore → member answer`.

## Spine Narratives (Mandatory)

| Spine | Narrative | Main subjects / owner | Off-spine summary |
| --- | --- | --- | --- |
| DS-01 | Load canonical resume config independently of replacement availability. Request subject-specific choices derived from saved runtime/workspace/model, render only allowed replacement IDs alongside current. Error/unknown keeps same-model settings usable. | Editor; Studio selection facade; RunModelSelectionService | Catalog/schema and runtime metadata |
| DS-02 | Store submits a full candidate pair. Studio keeps ownership guard. Lifecycle reads fresh baseline under transition, validates selected model/settings, commits both fields in one metadata write, returns canonical pair without activation. | Draft store; lifecycle | Catalog/validator; history catalog writer |
| DS-03 | Planner emits explicit dirty configured-scope pairs. Manager resolves all against the original persisted tree in one root transition, validates every pair, then applies all and writes one tree. No first-patch-wins baseline or server inheritance expansion. | Planner; Team manager | Configured-target mutator; tree store |
| DS-04 | Normal resume reads new pair with unchanged identity/memory paths. Backend selects new model but restores the same native working context or provider conversation. | Lifecycle; AgentRun/backend | Existing snapshot/lineage/provider adapters |
| DS-05 | Team restore rebuilds launch config from the committed tree, including unmaterialized nodes. Later member activation uses those new values with original member/platform IDs. Existing task launch records are not revised. | Team manager; mixed member handle | State-package loader; backend |
| DS-06 | Success replaces canonical model and config together; rejection retains draft/errors; indeterminate response locks Save until normal canonical refresh establishes both values. Lifecycle updates still relock the editor. | Draft store | Existing resume-config refresh and history/context projections |
| DS-07 | A Save or restore operation acquires the current owner lane, completes its critical section, then releases. Save-first restore consumes new model; activation-first Save rejects. | Lifecycle / Team manager | Existing catalog write queue |
| DS-08 | Model or settings direct edit marks the configured node direct-edited and recursively propagates the coherent pair only through draft-start-linked, not-direct-edited edges. | Team draft planner | Pair clone/equality |
| DS-09 | The unchanged native loop derives its current normal budget from the resumed LLM, observes usage and follows existing threshold/compaction lifecycle. Save is not a caller. | Native loop / memory manager | Existing budget/policy/lineage |
| DS-10 | Runtime metadata adapter reads only required capacity facts and disposes control resources. It never uses the selected run's provider binding, submits a user turn, or writes context settings. | Runtime capacity adapters | Existing launch/auth environment |

## Spine Actors / Main-Line Nodes

User Settings editor; existing-run draft store; GraphQL subject resolvers; Studio model-config service; AgentRunService/TeamRunService; standalone lifecycle; Team manager; run-selection validation; existing history catalog/tree store; runtime restore owners. The native compaction coordinator is on DS-09 only, not the Save main line.

## Ownership Map

- Editor: visible controls/events, target schema/default experience; no authoritative comparison.
- Draft store/planner: unsaved pair, immutable original link facts, dirty set, Save/reconciliation state; no persistence or runtime activation.
- GraphQL resolvers and AgentRunService/TeamRunService: thin transport/domain entry delegation.
- StudioRunModelConfigService: **governs Studio/Application ownership guard**, and binds choice queries to canonical subject context; not owner of filesystem commits or lifecycle serialization.
- Lifecycle / Team manager: authoritative stopped/archive/admission/transition/target invariants and commit sequencing.
- RunModelSelectionService: authoritative selected-model availability, capacity comparison and target schema result for options/Save. No run access or lifecycle authority.
- RuntimeModelCapacityService/adapters: interpretation of runtime-specific metadata, not product compatibility policy.
- History catalog / stores: authoritative metadata writes and their existing physical outcome semantics.
- Backend/AgentRun/mixed member handle: normal execution and restoration. No switch-specific history layer.

## Thin Entry Facades / Public Wrappers (If Applicable)

| Facade | Governing owner | Purpose | Must not own |
| --- | --- | --- | --- |
| Agent/Team GraphQL resolvers | Studio service then lifecycle/Team manager | DTO mapping, required fields | Catalog comparisons, direct disk writes |
| AgentRunService / TeamRunService stopped update entry | Lifecycle / Team manager | Stable domain entry | A second Save lock or model policy |
| Mutation/options clients | Draft store / server boundaries | Transport typing | UI-side eligibility invention |

## Removal / Decommission Plan (Mandatory)

| Remove | Why | Replacement | Scope |
| --- | --- | --- | --- |
| Fixed-model-only `ModelConfigValidationService`/`RunModelConfigValidator` entry and old file | Stops short of new selection subject | `RunModelSelectionService`, `RunModelSelectionValidator`, extracted unchanged schema validator | In this change; all composition/type references |
| Settings-only stopped mutation payload and Agent canonicalLlmConfig response | Can lose model in success/uncertainty/no-op | Required model+config input; nullable canonicalSelection object | In this change; no optional-model legacy branch |
| Standalone/Team settings-only dirty and commit equality | Misses model-only changes | Pair equality | In this change |
| Existing-run unconditional model lock/help and discarded model events | Approved behavior replaces fixed-model contract | Root/standalone eligibility lock, constrained picker, pair-change event | In this change; runtime/other locks remain |
| Separate original model field plus new conflicting draft copies | Redundant authority | Original/draft pair at each scope; canonical metadata/tree remains raw server snapshot | In this change |
| Compatibility-budget/threshold policy candidates | Never approved | No such code or configuration added | Rejected; not a cleanup of native compression code |

## Return Or Event Spine(s) (If Applicable)

DS-06: `owner result(canonical pair/tree, outcome, editability, field errors) → GraphQL → mutation client → draft store → history/context projection → visible selected model/settings + feedback`.

On ambiguous transport/persistence: `result/exception → existing reconciliationRequired lock → network canonical resume-config refresh → pair/tree replacement → choices refresh → next explicit user action`. Do not infer canonical model from the submitted candidate or old draft metadata. Missing canonical selection is not the same as canonical selection with null config.

## Bounded Local / Internal Spines (If Applicable)

- DS-07, lifecycle/manager: acquire transition → fresh metadata/tree → guards → validation → one commit/read-back → result → release. No metadata/model query is performed outside and then trusted inside the lane.
- DS-08, planner: immutable links → direct pair edit → recursive linked-child pair copy → dirty pair projection. A direct-edited or divergent child stops traversal into that branch, matching current behavior.
- DS-09, existing native owner: restored context → normal LLM usage observation → current budget/threshold decision → existing pending executor/lineage commit. **No source changes prescribed in this loop.**
- DS-10, runtime reader: resolve same launch environment → enumerate exact IDs/read capacity → sanitize output → close control/process in finally. Query timeout returns unknown, never a default capacity.

## Off-Spine Concerns Around The Spine

| Concern | Spines | Serves owner | Responsibility / why | Risk if made main-line owner |
| --- | --- | --- | --- | --- |
| Runtime model catalog | 01/02/03 | RunModelSelectionService | Existing availability/identifier/schema facts | Catalog would acquire run lifecycle policy |
| Schema validation | 02/03 | RunModelSelectionService | Preserve key/type/enum/range/required checks | Competing settings transfer policy |
| Runtime capacity adapters | 01/02/03/10 | RuntimeModelCapacityService | Exact capacity evidence under saved runtime/cwd | Provider adapter would decide product eligibility |
| Configured target resolution/mutation | 03 | Team manager | Address/kind match, pure pair replacement | Mutator would perform partial writes/activation |
| Atomic stores | 02/03/06 | Existing commit owners | Existing write outcome and read-back | Repository would become validator/ownership checker |
| Pair clone/equality | 06/08 | Draft planner/store | Coherent values and deterministic no-op | Utility would become hidden propagation coordinator |
| Native memory/provider resume | 04/05/09 | Runtime owners | Current history representation/continuation | Save would touch snapshots or fork sessions |

## Ownership Boundaries

Preserve existing owner lanes. GraphQL uses Studio public boundary only; Studio delegates commands through AgentRunService/TeamRunService, never directly commits their stores. Read-only selection options reuse canonical resume services **inside Studio**, not additional GraphQL access to internal readers. LLM-management receives already authoritative runtime/model/workspace facts; it cannot read arbitrary run IDs or mutate runs. Runtime metadata readers receive server-owned context and return capacity evidence, not user-supplied paths. Application scope construction receives the same updated validation dependency without expanding Studio editing into Application-owned active runs.

## Boundary Encapsulation Map

| Authoritative boundary | Internals | Required callers | Forbidden bypass | API strengthening |
| --- | --- | --- | --- | --- |
| StudioRunModelConfigService | Ownership reader, canonical resume readers, Agent/Team entries | GraphQL | Resolver calls manager/store alongside Studio | Add subject-specific choice methods here |
| Standalone lifecycle / Team manager | Transition, target resolver, catalog/tree commit | AgentRunService / TeamRunService | Mutation resolver commits metadata/tree directly | Accept required selection pair |
| RunModelSelectionService | Catalog, capacity resolver, schema checker | Lifecycle/manager; Studio choice facade | Lifecycle imports runtime cache/SDK plus selection service | Return normalized selection/errors; expose listOptions |
| RuntimeModelCapacityService | Runtime-specific capacity adapters | RunModelSelectionService | UI/GraphQL reads cache or Claude control | Return known/unknown keyed exact identifier |
| Existing draft store | Pair state, Team planner, clients, reconciliation | Forms | Nested component mutates history/cache directly | Single pair-change action and choice state per scope |

## Dependency Rules

Allowed: transport → Studio → domain entry → lifecycle owner → selection validator and persistence owner; selection validator → catalog/capacity/schema; capacity service → runtime adapters → existing launch/client/auth boundary. Restore depends on saved launch data and existing runtime backend only. Forms → draft store → transport. Pair utilities do not import Pinia or network clients.

Forbidden: compaction imports from Save/eligibility; metadata numbers in mutation inputs; provider-family/name-prefix guesses; direct cache/SDK reads above LLM-management; locks in UI replacing server guards; patching active LLM instances; definition writes; duplicate standalone metadata writes for configured Team members; traversing taskExecutions for editing; new history fallback; old/new API compatibility wrapper; client-computed target capacity as server authority.

## Interface Boundary Mapping

| API / method | Subject / responsibility | Accepted identity | Contract |
| --- | --- | --- | --- |
| `updateStoppedAgentRunModelConfig(input)` | Persist one stopped standalone selection | `{agentRunId}` | Required nonblank `llmModelIdentifier`, explicitly present nullable `llmConfig`; no runtime/capacity input |
| `updateStoppedTeamRunModelConfigs(input)` | Persist configured selections | `{teamRunId, patches:[{scopeKind,scopeAddress,...selection}]}` | Existing scope enum; root `/` is CONFIGURED_TEAM; duplicate/unknown/kind-mismatch/task targets rejected; all validate before write |
| Agent mutation result | Canonical pair/result | Request Agent ID | Replace `canonicalLlmConfig` with nullable `canonicalSelection:{llmModelIdentifier,llmConfig}`; null means unavailable canonical subject, not default settings |
| Team mutation result | Canonical root tree/result | Request Team ID | Keep existing canonicalExecutionTree and outcome/editability/errors |
| `agentRunModelOptions(agentRunId)` | Choices for saved standalone context | Agent ID only | Studio derives context; return current identifier/capacity, eligible replacement IDs/capacities, availability reason |
| `teamRunModelOptions(teamRunId)` | Choices by configured scope | Root Team ID only | Return rows keyed `{scopeKind,scopeAddress}`; no task rows; each uses its own saved launch/cwd |
| `RunModelSelectionService.validate({context,selection})` | Validate one proposed selection | Internal `{runtimeKind,currentModelIdentifier,workspaceRootPath}` | Same-model: existing availability/schema path only. Replacement: fresh catalog/capacity then unchanged schema validation. Returns valid normalized pair or existing validation categories |
| `RunModelSelectionService.listOptions(context)` | Capacity-eligible replacement projection | Same internal context | Same comparator as Save; excludes current from replacement list, returns it separately; schema remains owned by existing catalog/control |
| `RuntimeModelCapacityService.resolveMany(context, models)` | Runtime capacity evidence | Exact model identifiers and saved runtime/cwd | `known {tokens,source}` or `unknown {reason}` per model; no run binding; no new public user metadata field |
| Form `selection-change` / store actions | Coherent unsaved pair edit | Agent current draft or configured scope address | Model change resets old config using current picker convention before normal defaults; settings change keeps selected model |

Use `VALIDATION_FAILED` with field path `llmModelIdentifier` for known decrease/unknown comparison; keep `MODEL_UNAVAILABLE`/`SCHEMA_UNAVAILABLE` for existing availability/schema failures. Prefix Team errors with `patches[<address>]`. No new lifecycle outcome or unbounded error protocol needed. List option state distinguishes loading, ready/no alternatives, current capacity unknown and lookup unavailable. Missing choice metadata never sets the same-model schema state to unavailable.

### Capacity Evidence Contract (Architecture Decision AD-D01)

1. All values must be positive finite safe integers. Current baseline is the freshly stored identifier for the same scope, not launch-time identity or previous picker choice.
2. **AutoByteus**: use exact available model metadata from the existing LLM factory/catalog: verified active context when supplied by the runtime model provider, otherwise verified max context. Trace the field to live/provider or explicit curated definition provenance. Do not promote an absent/unknown source, provider input cap, approximate name inference or global compaction override into verified model capacity. Existing compaction overrides are unchanged and are not model evidence.
3. **Codex**: isolate read-only decoding of the provider-produced model catalog in `runtime-management/codex/client`. Acquire the existing client for the saved workspace, use model/list for availability and config/read for effective runtime profile, and read the matching launch environment's catalog (default same `CODEX_HOME/models_cache.json`; configured model_catalog_json only when it is the actual selected runtime source). Match exact catalog identifier/slug and verify current shape and cache client-version against the configured executable. Read after catalog discovery, not from a process-global result captured when Settings opened.
   - Default-profile total is `context_window`, **not** `max_context_window` when the latter is only an opt-in maximum; **not** `context_window * effective_context_window_percent` (a safety budget). AE-08 proves the default-profile positive path.
   - A pre-existing effective `model_context_window` must be resolved as part of that same profile, never set by this feature. Its value is not independent proof of model support: require runtime catalog evidence that covers it. If a custom source/override/launcher cannot be associated with authoritative applicable capacity, return unknown for that metadata case, rather than guess or reuse another home/profile. No custom launcher ban or hard-coded pair allowlist.
   - Implementer must retain adapter contract tests for normal default, current custom-catalog shape, profile override within evidenced capability, missing/malformed cache, version mismatch and wrong-home isolation. Where an override's actual runtime semantics cannot be established, report the metadata uncertainty; do not add a budget-comparison rule. Universal metadata coverage is explicitly not required by REQ-008.
4. **Claude**: extend the existing SDK client with a bounded metadata-only control operation. Reuse production auth/env/executable and **runtime** setting sources/cwd (not catalog's user-only sources). Use `maxTurns:0`, no saved `resume`/`sessionId`, no user inference, select each exact candidate in the probe control and read `getContextUsage().rawMaxTokens` with the resolved model. Treat alias `resolvedModel`/returned model as runtime identity evidence; never infer capacities from `opus`/`sonnet` labels. `maxTokens`/percentage/used tokens are not the comparison source. Close controls in finally; missing APIs, timeout or inconsistent model response produce unknown, not 200k fallback. Existing allowed alias strings remain the persisted catalog identifier. This does not change a stopped run or expand supported providers.
5. Resolve current + target in one validation operation. Reuse reads within one request for identical runtime/workspace contexts, but Save must acquire fresh evidence rather than trust picker data. Choices are advisory snapshots; they are not revision tokens or a new multi-browser merge system.
6. Do **not** feed these lookup results into native token-budget/compaction configuration or amend catalog values globally as part of this change. Keeping selection-specific evidence separate avoids changing compression as an accidental side effect of filling nullable UI metadata.

### Save, Draft, And Propagation Contract (AD-D02–04)

- Both commands require the pair. Keep ordinary target schema validation exactly: nullable config, unknown keys, types, enum/range/required constraints. Model selection applies the existing reset-to-null/default UI experience; no transfer mapping or implicit old-key filtering on the server.
- Add a coherent `selection-change` emission for existing-run consumers of the shared model control. It fires `{newModel,null}` on model change and `{currentModel,newConfig}` on settings changes. Preserve launch consumers' current model/config events, but existing-run consumers subscribe to the pair only—never both routes. Re-render defaults/schema for the selected target; historical residual settings rendering applies to unchanged canonical model, not to an old model after replacement.
- Agent draft keeps canonical metadata and one draft selection; derive canonical selection from metadata rather than a redundant writable copy. Team planner keeps originalSelection/draftSelection and immutable runtime/address/link facts. Dirty is identifier difference OR semantic config difference.
- Existing Team link test remains draft-start runtime+model+config equality. Parent pair changes traverse only original linked and not-direct-edited children. Mark explicit edits sticky for this draft even if later equal. Preserve the stopped branch traversal rule. Config/settings changes use the same planner action. Mixed-runtime branches do not link.
- Do not silently remove an incompatible descendant from the intended patch set to make Save succeed. The affected scopes remain visible and invalid; no persistence until every intended patch passes its own saved-baseline comparison and schema validation.
- Metadata lookup/schema results are keyed to subject, scope, current saved identifier and draft target; discard stale asynchronous responses after selection/subject change. Reuse existing canonical-load request sequencing rather than introducing a global event bus.
- Agent commit constructs `{...metadata, llmModelIdentifier, llmConfig}` once. No-op compares both fields; read-back confirms both before reporting committed. If write/read-back is ambiguous, reuse indeterminate/reconciliation semantics, not a rollback write that could overwrite newer canonical state.
- Team mutator replaces only those two fields in configured launch configurations; taskExecutions are retained untouched. The original tree is the validation baseline for **all** patches; apply only normalized successful results, then the existing single write/read-back.
- Success updates Agent history resume-config and existing `agentContextsStore.patchConfigOnly` with both fields. Team success installs canonical tree/planner and refreshes existing visible configuration projections through their normal projection owner. Normal resume remains canonical-server driven; no client launch-config override is sent as a substitute.

## Interface Boundary Check

| Interface | Singular? | Explicit identity? | Selector risk | Action |
| --- | --- | --- | --- | --- |
| Agent commands/options | Yes | Yes, standalone Agent ID | Low | No generic run/team union selector |
| Team command/options | Yes | Yes, root ID + configured kind/address | Low | Keep configured-only resolver and duplicate checks |
| Selection validator | Yes | Yes, runtime + saved model + workspace context | Low | Caller supplies saved context, never transport-supplied runtime |
| Capacity resolver | Yes | Yes, exact runtime/cwd/model | Medium external aliases | Require observed alias resolution; no fuzzy matching |
| Canonical Agent result | Yes | Yes, pair scoped by request | Low | Null object != null llmConfig; no old-field fallback |

## Main Domain Subject Naming Check

| Subject | Name | Natural? | Drift risk / action |
| --- | --- | --- | --- |
| Model and settings together | RunModelSelection | Yes | Do not call it compression compatibility |
| Authoritative validation/options | RunModelSelectionService | Yes | Replace fixed-model-only class; not a runtime lifecycle manager |
| Capacity lookup | RuntimeModelCapacityService | Yes | No generic metadata platform or guessed ModelSupport helper |
| Configured scope patch | TeamRunModelConfigPatch | Yes | Existing operation name retained, explicit pair shape; never task patch |
| UI draft | ExistingRunModelConfigDraft | Yes | Existing feature name retained; selection has explicit pair semantics |

## Existing Capability / Subsystem Reuse Check

| Need | Existing area | Decision | Why |
| --- | --- | --- | --- |
| Saved config command/ownership | run-history + execution lifecycle | Extend | Already authoritative and serialized |
| Catalog/schema | llm-management | Extend | Selection invariant belongs with model facts |
| Runtime metadata | runtime-management Codex/Claude client | Extend | Same executable/auth/profile ownership; no credential reader in UI |
| Coherent Team patches | existing Team draft planner/mutator | Extend | Current configured scope/propagation boundary is correct |
| Atomic state | history catalog/tree stores | Reuse | Existing shapes and commit semantics suffice |
| Restore/history/compaction | existing backend and memory owners | Reuse unchanged | Current saved-config path already reaches normal execution |

## Subsystem / Capability-Area Allocation

| Area | Owns | Spines | Decision |
| --- | --- | --- | --- |
| Web existing-run configuration | local pair edits, constrained choices, canonical reconciliation | 01/02/03/06/08 | Extend |
| Studio run-history boundary | subject context and ownership protection | 01/02/03/06 | Extend |
| LLM-management | shared selection invariant and schema composition | 01/02/03 | Extend |
| Runtime-management clients | runtime-specific capacity interpretation/control cleanup | 10 | Extend |
| Standalone/Team execution | stopped transition, target semantics, persisted config use | 02–05/07 | Extend commands, preserve restore owners |
| Run-history persistence | coherent field update and canonical outcome | 02/03/06 | Extend pair equality, reuse format |
| Native memory/compaction | existing retained context/ordinary compaction | 09 | Reuse, no edits |

## Draft File Responsibility Mapping

| Candidate | Area / owner | Concern | One-file rationale / extraction |
| --- | --- | --- | --- |
| Current model-config validator | LLM-management | Catalog + candidate schema | Broaden owner to selection; extract unchanged schema algorithm before adding capacity orchestration |
| Current Agent draft utilities | Web configuration | Pair clone/equality | Existing JSON utilities already shared by Team; place new pair type in same feature, no global common module |
| Existing draft store | Web configuration | Commands/canonical state/options lifecycle | Keep coordination here; do not put persistence in components |
| Team planner/mutator | Web / Team execution respectively | Propagation plan / pure saved tree replacement | Different trust boundaries; do not share one mutable representation across network |
| Runtime metadata reader | Runtime-management | Provider-specific evidence | Codex cache schema and Claude controls must not enter lifecycle files |

## Reusable Owned Structures Check

| Repetition | Shared owner/file | Why shared | Redundancy removed? | Overlap removed? | Must not become |
| --- | --- | --- | --- | --- | --- |
| Model/settings value | `S/llm-management/domain/run-model-selection.ts`; Web feature type equivalent | Agent/Team/validator and draft flows need same pair | Yes | Yes | Full optional Agent/Team launch superset |
| Existing schema normalization/value checks | `S/llm-management/services/model-config-schema-validation.ts` | Selection validation uses existing rules on resolved target ModelInfo | Yes | Yes | A new policy/transfer engine |
| Pair equality/clone | `W/services/runConfigEditing/existingAgentModelConfigDraft.ts` | Agent and Team dirty/propagation need same semantics | Yes | Yes | A Pinia store or hidden inheritance owner |
| Known/unknown capacity result | `S/llm-management/domain/runtime-model-capacity.ts` | Normalize provider evidence without copying native budget type | Yes | Yes | New token-budget/threshold model |

Server and Web representations remain transport/domain projections under their respective owners; no new cross-package dependency solely to share a two-field type. Reuse existing Team DTOs unchanged; no overlapping durable selection shadow field.

## Shared Structure / Data Model Tightness Check

| Structure | Singular field meaning? | Redundant fields removed? | Overlap risk | Action |
| --- | --- | --- | --- | --- |
| RunModelSelection | Yes | Yes | Low | Identifier + nullable explicit settings only |
| Agent draft | Yes | Yes | Low | Canonical metadata + draft pair; derive original pair |
| Team scope draft | Yes | Yes | Low | Original/draft pairs; runtime and immutable links once |
| Capacity evidence | Yes | Yes | Low | Tokens + source or unknown reason; no available-input/threshold aliases |
| Options DTO | Yes | Yes | Low | Current baseline and replacement list; catalog remains schema source |

## Final File Responsibility Mapping

Concrete paths below expand S/W aliases from the header. Grouped brace names are the listed files, not a new directory proposal.

| Files | Area / boundary | Final responsibility | Shared structure |
| --- | --- | --- | --- |
| `S/llm-management/domain/{run-model-selection,runtime-model-capacity}.ts` (new) | LLM-management | Minimal pair and evidence contracts | Shared by existing owners |
| `S/llm-management/services/run-model-selection-service.ts` (new, replaces old validator) | Selection owner | Fresh catalog, same-model schema path, replacement comparison, listOptions | Pair/capacity/schema |
| `S/llm-management/services/model-config-schema-validation.ts` (new extraction) | Selection internal | Existing pure schema checks, behavior unchanged | ModelInfo/schema |
| `S/llm-management/services/runtime-model-capacity-service.ts` (new) | Metadata boundary | Select runtime reader, normalize known/unknown; no comparison policy | Capacity |
| `S/runtime-management/codex/client/codex-model-capacity-reader.ts` (new); `codex-app-server-launch-config.ts`, client manager as needed | Codex runtime | Same launch context/profile/catalog identification and capacity-only read | Existing client lifetime + capacity result |
| `S/runtime-management/claude/client/claude-sdk-client.ts` | Claude runtime | Metadata-only capacity control method using normal production environment | SDK controls, existing cleanup/auth |
| `S/run-history/services/studio-run-model-config-service.ts` | Studio boundary | Required pair forwarding; two subject choice methods | Existing resume readers/selection service |
| `S/agent-execution/services/{agent-run-service,standalone-agent-run-lifecycle-service}.ts` | Agent execution | Pair command, fresh baseline validation within transition | Run selection validator |
| `S/run-history/services/{agent-run-model-config-commit,agent-run-history-catalog-service}.ts` | Agent persistence | Pair write/no-op/read-back; no memory writes | Selection pair |
| `S/agent-team-execution/services/{team-run-service,agent-team-run-manager,team-run-model-config-mutator}.ts` | Team execution | Required pair patches, validate all saved scopes, one tree update | Selection pair; existing configured target |
| `S/api/graphql/types/{run-model-config,agent-run,agent-team-run}.ts` | Transport | Required model field, canonical pair, typed option objects and subject queries | Existing outcomes/errors |
| `S/compositions/build-studio-server.ts`; `S/agent-execution/runtime/general-process-run-supervisor.ts`; `S/application-platform/execution/{application-execution-scope-contracts,application-execution-scope-kernel-builder}.ts`; `S/application-platform/runtime/build-application-platform-runtime.ts`; `S/standalone-application-host/start-standalone-application-host.ts` | Composition | Rename/inject selection validator and capacity dependencies in all constructors | No runtime behavior expansion |
| `W/types/agent/ExistingRunModelConfigDraft.ts`; `W/services/runConfigEditing/{existingAgentModelConfigDraft,existingTeamModelConfigDraft,existingTeamRunFormModel}.ts` | Web draft | Pair type/state/equality/link traversal/form projection | Original/draft pair |
| `W/stores/existingRunModelConfigStore.ts` | Web owner | Pair updates, per-scope choices, dirty/canSave, requests and canonical reconciliation | Existing clients/planner |
| `W/services/runConfigEditing/existingRunModelConfigMutationClient.ts`; new `existingRunModelOptionsClient.ts`; `W/graphql/mutations/{runHistoryMutations,agentTeamRunMutations}.ts`; new `W/graphql/queries/runModelOptionsQueries.ts` | Web transport | Current contract only; no optional old-model fallback | Explicit subject DTOs |
| `W/components/launch-config/RuntimeModelConfigFields.vue`; `W/components/workspace/config/{ExistingRunConfigEditor,AgentRunConfigForm,TeamRunConfigForm,TeamScopeConfigEditor,MemberOverrideItem}.vue`; `W/types/agent/ExistingTeamRunFormModel.ts` as projection requires | Web controls | Capacity-constrained IDs, pair event, editable model/locked runtime, per-scope feedback, target schema/defaults | Existing generic picker/ModelConfigSection |
| Existing workspace localization catalogs containing `workspace.runModelConfig.fixedIdentity`; affected stopped-settings docs | Web language / docs | Fixed-runtime and non-decreasing-capacity help; remove obsolete fixed-model claim | Current localization ownership; Delivery sync owns final docs |
| Existing focused tests and new selection/capacity adapter tests | Respective owners | Validation matrix below | Runtime/provider fakes only at appropriate boundaries |

Preserve unchanged production restore files from AE-04/11/13 unless executable evidence finds lost propagation; such a change must stay bounded to consuming the saved pair and be reported as design impact if a new mechanism is needed.

## Applied Patterns (If Any)

Existing lifecycle transition/state machine, repositories and provider adapters are reused. New capacity readers are adapters, not extra run managers. Selection service is a real invariant owner, not a forwarding wrapper. Team patch planner remains pure bounded tree traversal, not a reactive graph system.

## Target Subsystem / Folder / File Mapping

| Path | Kind | Owner / purpose | Why here | Must not contain |
| --- | --- | --- | --- | --- |
| `S/api/graphql/types` listed files | Files / Transport | Subject DTOs and entrypoints | Existing GraphQL structure | Runtime cache parsing/commit logic |
| `S/run-history/services` listed files | Files / Domain-control | Studio boundary, catalog commit | Existing canonical state ownership | New history conversion |
| `S/agent-execution/services`, `S/agent-team-execution/services` listed files | Files / Domain-control | Existing lifecycle and target invariants | No owner relocation | A second model-switch runtime |
| `S/llm-management/domain` two new files | Files / Domain values | Selection and capacity | Tight LLM subject contracts | Run IDs/topology/compaction state |
| `S/llm-management/services` three new files, old validator removed | Files / LLM-control | Selection, schema internal, runtime capacity boundary | Same capability with distinct evidence interpretation | Disk run writes |
| `S/runtime-management/{codex,claude}/client` listed files | Files / Provider adaptation | Concrete capacity mechanisms | Launch/auth/client environment already here | Studio eligibility policy or saved run activation |
| `W/services/runConfigEditing`, `W/stores`, `W/types/agent` listed files | Files / Web feature | Pair planning, transport, state | Current feature layout | Generic compatibility framework |
| `W/components/launch-config`, `W/components/workspace/config` listed files | Files / Presentation | Existing controls and configured scopes | No new screen/prototype | Server-authoritative capacity inference |
| Composition roots listed above | Files / Composition | Dependency wiring | Existing owner construction points | Duplicated policy |

No files moved between subsystems except clean replacement/extraction inside LLM-management. Existing small flat feature directories remain clearer than one folder per DS step. The final file table is the complete create/change/delete inventory; additional paths require bounded justification.

## Folder Boundary Check

| Folder | Depth | Clear? | Risk | Justification |
| --- | --- | --- | --- | --- |
| GraphQL types | Transport | Yes | Low | Only mapping/delegation |
| Execution services | Main-Line Domain-Control | Yes | Low | Existing lifecycle owners retained |
| Run-history stores | Persistence-Provider | Yes | Low | Format unchanged, writer reused |
| LLM-management domain/services | Values / Off-Spine Concern | Yes | Low | Separate pair, validation and metadata interpretation |
| Runtime client folders | Persistence-Provider adaptation | Yes | Medium private Codex data | Isolated current-shape reader, explicit drift tests |
| Web runConfigEditing/stores/components | Mixed Justified across existing feature folders | Yes | Low | Planner/store/view remain separate; no over-split framework |

## Concrete Examples / Shape Guidance (Mandatory When Needed)

```ts
// Command is explicit even for settings-only edits.
{ agentRunId: 'existing-id', llmModelIdentifier: 'target-id', llmConfig: null }
// Unavailable canonical subject is null, not an invented default pair.
{ canonicalSelection: { llmModelIdentifier: 'target-id', llmConfig: null } }
// Team patch targets a configured subject, never a task instance.
{ teamRunId: 'root-id', patches: [
  { scopeKind: 'CONFIGURED_AGENT', scopeAddress: '/analysis/reviewer',
    llmModelIdentifier: 'target-id', llmConfig: { reasoning_effort: 'high' } }
] }
```

| Topic | Good | Avoid | Why |
| --- | --- | --- | --- |
| Capacity | Fresh saved 128000 → target 272000 qualifies; after commit reverse decreases | Compare every edit against original launch 128000 | Current saved model is baseline |
| Team | Linked `/a` follows `/`; divergent `/b` stays unchanged | Apply root model blindly to all nodes/tasks | Preserves approved configured propagation |
| Unknown | Current model config edit uses same-model schema path; replacement unavailable explained | Null equals null, or disable all settings after capacity lookup failure | AC-003/011 |
| Schema | New model event gives `{newId,null}`, then its ordinary defaults/config | Set newId with unsupported old reasoning settings | No hidden cross-model transfer |
| Compression | Save never imports token budget; resumed ordinary loop computes its own | Require equal input budget/threshold to accept equal-capacity model | AC-013 |
| Metadata | Codex default 272000 from current runtime catalog | Treat optional 872000 maximum or 258400 safety budget as default total | Capacity dimensions are not interchangeable |

## Backward-Compatibility Rejection Log (Mandatory)

| Candidate | Why considered | Decision | Replacement |
| --- | --- | --- | --- |
| Optional model in mutation, fallback to stored model | Old client convenience | Rejected | Required pair at every in-repo caller; coordinated API/frontend cutover |
| Second `switchModel` endpoint beside settings Save | Local implementation shortcut | Rejected | One selection Save through existing transition |
| Retain canonicalLlmConfig as fallback response | Avoid changing client | Rejected | One canonicalSelection object, null distinct from settings defaults |
| Duplicate old validator only for same-model Save | Avoid refactor | Rejected | Single validator with same-identity semantics; no compatibility wrapper |
| New/old metadata formats and migration | Model became mutable | N/A | Existing format directly usable, no version split |
| Resume by fork/new session on failure | Superficial successful answer | Rejected | Same binding or existing explicit restore failure |

## Derived Layering (If Useful)

View/draft → subject transport → Studio guard → execution lifecycle → selection/persistence boundaries. Selection → catalog/schema/runtime-capacity → runtime clients. Restore remains execution → backend → memory/provider. This is derived from the ownership map, not a new generic layered framework.

## Change / Refactor Sequence

1. **Evidence seam first**: implement/test runtime capacity readers against retained AE-08/09 observations using the actual server launch/auth environment. Demonstrate a nonempty Codex candidate set. No hard-coded capacities copied from this document. If the proposed same-environment reader is unavailable, return evidence/Design Impact rather than invent inference or a new restriction.
2. Create pair/capacity types and pure schema extraction. Replace old fixed-model validation owner with RunModelSelectionService; wire all composition roots. Keep schema behavior stable and same-model capacity bypass explicit.
3. Extend required Agent/Team commands, canonical Agent pair, two options queries, lifecycle validation and coherent commits. Preserve locks/guards/physical outcomes. Update all tests/callers; delete old validator and settings-only transport contract in the same implementation round.
4. Extend planner/draft state and projections first, then attach controls. Implement model-only dirtiness, full-pair propagation, per-scope metadata state, canonical response parsing and refresh. Do not ship an unlocked selector before server enforcement.
5. Add shared control pair event and constrained replacement IDs. Existing-run forms use only pair route, runtime remains locked. Show target defaults and errors; preserve current historical value and same-model settings while metadata is unavailable. Validate rendered Agent/root/nested/member surfaces.
6. Run implementation-scoped tests/typechecks plus durable API/browser/runtime validation through downstream ownership. At least one **real changed-model Codex same-thread product workflow** is a delivery gate (Codex is initial evidence/runtime focus, not an exclusion of other scoped runtimes). Test equal/larger and compacted-history preservation as specified below.
7. Synchronize settings/execution documentation through Delivery ownership, remove fixed-model language and obsolete fixtures/assertions, ensure no source imports old validator/no optional-model compatibility branch. No migration or compaction rollout phase.

## Key Tradeoffs

- Subject-specific options queries add a small read contract instead of global catalog enrichment or client-side comparison. This preserves per-scope runtime/cwd authority and keeps canonical recovery independent of external metadata availability.
- Runtime-private Codex catalog inspection is a bounded adapter risk because current model/list lacks capacities. Provider metadata/schema/version validation and source identity are required; a global hand-maintained list would be less authoritative and stale. A future supported capacity API can replace this adapter through normal design review, not a dual-reader compatibility stack.
- Claude zero-turn control discovery costs process startup, but avoids guessed names and expensive inference probes per selection. Coalesce within a request for shared runtime/workspace; do not introduce durable metadata service/cache infrastructure.
- Use a new coherent event for existing-run consumers while launch consumers keep their current contract. These are distinct supported UI subjects, not old/new stopped-save compatibility paths.
- Required pair/canonical object is a clean API cutover. Deploy server/frontend together; no historical stored-data migration needed.

## Risks

| ID | Risk / boundary | Mitigation / required evidence | Owner |
| --- | --- | --- | --- |
| AD-R01 | Codex private cache/custom profile drift or wrong home | Same configured launch context; exact fields/source/version; unknown instead of guess; adapter tests; positive default-profile evidence retained | Implementation, review |
| AD-R02 | Claude alias/environment is different in server vs architect shell | Reuse existing SDK production auth/env and cwd; verify returned resolved model/capacity; no blind API model table | Implementation/API-E2E |
| AD-R03 | Real changed-model same-conversation behavior not exercised in this round | Actual Settings→Save→normal resume on fresh test run with prior recognizable context, model/event evidence and unchanged ID; no self-reported model-name proof alone | API-E2E; Delivery gate |
| AD-R04 | Previously compacted native/external context | Zero Save memory/lineage writes; preserve existing snapshot/lineage on ordinary restore; validate already-compacted normal lifecycle. Ordinary different compaction timing is allowed | API-E2E |
| AD-R05 | Pair dropped by UI canonical/error/Team propagation path | Complete pair tests on success, no-op, rejection, uncertainty and reopen; sticky original links; visible target schema | Implementation/code review |
| AD-R06 | Existing concurrency boundary accidentally bypassed | Extend existing Save-first/resume-first and live-owner tests; no new independent lock | Implementation/API-E2E |
| AD-R07 | Worktree dependencies/real-runtime credentials not ready | Resolve normal engineering prerequisites and report truthfully; no suite or provider success claimed here | Downstream engineering |

No requirement gap at this architecture baseline. AD-R01/02 have concrete evidence-backed adapters, not permission for guessed values; AD-R03/04 are executable validation gates, not undocumented picker restrictions or assertions of completion.

## Guidance For Implementation

### Validation plan and acceptance traceability

| Layer / durable coverage | Required cases | Approved IDs |
| --- | --- | --- |
| Selection service unit tests (new under `autobyteus-server-ts/tests/unit/llm-management`) | Equal/larger/smaller, invalid/null/rounded capacity, fresh saved baseline, current→larger→old decrease, identical model skips capacity reader, catalog refresh between options/Save, different budgets/output/tokenizer/threshold not examined | AC-002/003/011/012/013 |
| Runtime adapter tests + metadata integration | Codex exact IDs/current profile/default vs opt-in maximum, stale/malformed/wrong home, no secret output; Claude zero-turn rawMaxTokens, aliases, no saved session passed, finally cleanup, timeout; actual production env reader returns real eligible Codex choices | AC-003/012; REQ-008 |
| `tests/unit/agent-execution/standalone-agent-run-lifecycle-service.test.ts`; history commit tests | Pair atomic/no-op/read-back; validation rejection no writes; current baseline read under lock; Save-first new model restore; resume-first rejection; canonical pair under write uncertainty | AC-004–007/011 |
| `tests/unit/agent-team-execution/team-run-model-config-mutator.test.ts`; manager tests | Root/nested/member pair-only patches; duplicate/kind/task rejection; every patch validates original saved scope; one invalid blocks entire write; unchanged topology/task records; root transition ordering | AC-005–008 |
| Existing mixed-agent-member native activation tests + execution-tree builder tests | Configured saved pair reaches lazy member and subteam restore, provider ID retained; no definition reload or per-member metadata shadow write | AC-008/009 |
| `tests/integration/run-history/application-owned-studio-run-model-config.integration.test.ts`; `tests/e2e/run-history/stopped-run-model-config-graphql.e2e.test.ts` | Contract requires model+explicit config; real GraphQL outcomes; ownership unknown/live guard; canonical model round-trip and eligibility recheck | AC-004–007/012 |
| Web colocated draft/planner/store/component tests | Model-only dirty, reset/defaults, selected schema, link/direct/divergent boundaries, per-scope metadata failure, failed/indeterminate response canonical pair, stale option response, no-change/unsaved discard | AC-001/003/004/007/008/011 |
| Browser product validation (web-equivalent first) | Stopped Agent + Team root/nested/member edits; active/archive lock; keyboard model picker/status/error; reopen saved config stays stopped; no alternatives/current value retained | AC-001/003–008/011 |
| Live runtime product validation | Codex actual eligible pair selected in Settings, Save, inspect canonical new model, send next normal message, retained unique prior fact/tool-result context, same run/thread ID, request/response model evidence. Repeat relevant configured member continuation; no restart/fork shortcut | AC-009; REQ-008 |
| Native/current compression regression + already-compacted run | Save leaves hashes/content of raw history/snapshot/lineage unchanged; normal restore retains semantic context and lineage, normal future compaction works. Do not use a lowered compaction threshold as feature behavior or compare budget equality. Fixtures may reproduce an already-approved lifecycle; record setup truthfully | AC-010/013 |

The architecture metadata probe is not a substitute for the last two rows. A provider test based solely on a manually changed metadata file is not the supported feature workflow. Do not claim Claude production capacity or resume validation from the host-only alias observation. Downstream validation should retain setup, runtime versions, model pair, canonical IDs and redacted evidence, not credentials or unrelated transcripts.

Implementation Engineer owns production changes and implementation-scoped tests; Code Reviewer owns selected source review; API/E2E owns executable coverage/validation; Delivery owns final documentation/user verification/finalization and terminal handoff to Requirements Engineering. Architecture's final routing for this round is independent review, not successful delivery.
