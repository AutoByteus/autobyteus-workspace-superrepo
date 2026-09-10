# API-REV-001 executable evidence

Date: 2026-09-09 UTC. Worktree `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model` (W). Ticket `W/tickets/in-progress/stopped-run-compatible-model` (T). This directory is E. All commands below run from W. Current completed result: Pass, 95% validation confidence, not delivery approval. Canonical investigation/report/revision/ledger are at T. Reviewed production remains `88afb0512964b59d4734117c01ee0cb6925c2e81`; intake HEAD `5f7a9b47e228e25529f5bd0acf80ea3a2142d303`. Only three repository test files changed here; other changes at intake belong upstream.

## Reproduction commands and repository results

The commands use installed workspace dependencies and documented project test bootstrap, not ambient deployment state. Logs retained verbatim unless noted. Final repository results: 32 files / 248 tests passed (unique final runs, not doubled for retries), plus server production build and six durable browser scenarios. No blanket suite pass is claimed.

### C01 — `server-focused.log`: 8 files / 68 tests Pass
```bash
pnpm -C autobyteus-server-ts exec vitest run \
 tests/unit/llm-management/run-model-selection-service.test.ts \
 tests/unit/runtime-management/model-context-capacity.test.ts \
 tests/unit/run-history/services/agent-run-model-selection-commit.test.ts \
 tests/unit/run-history/services/studio-run-model-config-service.test.ts \
 tests/unit/agent-execution/standalone-agent-run-lifecycle-service.test.ts \
 tests/unit/agent-team-execution/team-run-model-config-mutator.test.ts \
 tests/unit/agent-team-execution/team-run-model-selection-save.test.ts \
 tests/unit/agent-team-execution/agent-team-run-manager-lifecycle.test.ts --no-watch
```
Capacity/catalog/provider edges are controlled at their adapters; persistence outcomes, domain/lifecycle/selection code real. Not live inference.

### C02 — `web-focused.log`: 11 files / 124 tests Pass
```bash
pnpm -C autobyteus-web test:nuxt components/workspace/config/__tests__ components/agentTeams/__tests__/SearchableGroupedSelect.spec.ts components/launch-config/__tests__/RuntimeModelConfigFields.spec.ts services/runConfigEditing/__tests__ stores/__tests__/existingRunModelConfigStore.spec.ts --run
```

### C03 — `server-build.log`: Pass
```bash
pnpm -C autobyteus-server-ts build
```
Shared builds, Prisma generation, production TypeScript/assets and sanitized bootstrap smoke all run. This is not full Web production build/typecheck.

### C04 — `ownership-integration.log`: 1 file / 3 tests Pass
```bash
pnpm -C autobyteus-server-ts exec vitest run tests/integration/run-history/application-owned-studio-run-model-config.integration.test.ts --no-watch
```
Real Application owner stores/re-entry; runtime provider mocked.

### C05/C13 — `graphql-e2e.log`, final `graphql-e2e-final.log`: 1 file / 2 tests Pass
```bash
pnpm -C autobyteus-server-ts exec vitest run tests/e2e/run-history/stopped-run-model-config-graphql.e2e.test.ts --no-watch
```
Actual built-server HTTP/GraphQL/coercion/Studio/filesystem/current reader/restart. Unique isolated DB/data, fake inference; current-shaped Agent/Team history fixtures. C13 adds Team required-pair omissions to earlier Agent schema/omission/unavailable checks. Same-model settings Save here, not live model replacement.

### C06a/b/c — preserved, replacement and Retry renderers: Pass
```bash
pnpm -C autobyteus-web test:e2e:existing-run-model-config --output-dir ../tickets/in-progress/stopped-run-compatible-model/evidence/api-e2e/browser-preserved
node tickets/in-progress/stopped-run-compatible-model/evidence/implementation-render-inspection.mjs --output-dir ../tickets/in-progress/stopped-run-compatible-model/evidence/api-e2e/browser-replacement
node tickets/in-progress/stopped-run-compatible-model/evidence/IR-002/team-verification-render-inspection.mjs --output-dir ../tickets/in-progress/stopped-run-compatible-model/evidence/api-e2e/browser-retry
```
New independent output in each named directory, prior evidence not overwritten. Actual Nuxt/Chromium and production components; deterministic GraphQL transport. JSON scenarios/operations/screenshots + same-named `.log` files. Retry pass: one mutation, initial canonical load plus two verification reads. Temporary upstream scripts reused only for evidence; new regressions consolidated into existing durable browser owner below.

### C10 — final `affected-integration-final.log`: 6 files / 31 tests Pass
```bash
pnpm -C autobyteus-server-ts exec vitest run \
 tests/integration/agent-team-execution/agent-team-run-manager.integration.test.ts \
 tests/integration/agent-team-execution/team-agent-tools-mcp-lifecycle.integration.test.ts \
 tests/integration/agent-execution/agent-run-manager.memory-layout.real.integration.test.ts \
 tests/integration/agent-execution/agent-run-prompt-fallback.integration.test.ts \
 tests/integration/agent-execution/agent-run-service.integration.test.ts \
 tests/integration/run-history/memory-layout-and-projection.integration.test.ts --no-watch
```
Initial `affected-integration.log`: 30 Pass / 1 stale flat validator assertion. Investigation updated before correcting test to approved context+selection shape; no production fix. Save-first and restore-first Team cases now use replacement identifier, asserting restored pair. Real owner/memory files, fake providers.

### C11 — final `browser-durable-final/`: six scenarios Pass
```bash
pnpm -C autobyteus-web test:e2e:existing-run-model-config --output-dir ../tickets/in-progress/stopped-run-compatible-model/evidence/api-e2e/browser-durable-final
```
`existing-run-model-config-evidence.json`: A–D retained, E Agent keyboard replacement/defaults/pair; F root-linked replacement with divergent reviewer and indeterminate -> failed read -> Retry, exactly one mutation/two verification reads, clean canonical pair/error clear. No page errors. Screenshots reviewed at 1280/520; retained original case C uses 390 width. Deterministic transport, not live inference. Initial `browser-durable/` preserved: A–D/F passed, E failed because it reused D's explicit active lock without a lifecycle stop observation. Correct test isolation by fresh page load. Production lock was not relaxed.

### C14 — `native-compaction.log`: 5 files / 20 tests Pass
```bash
pnpm -C autobyteus-ts exec vitest run tests/unit/agent/token-budget.test.ts tests/unit/memory/compaction-policy.test.ts tests/unit/memory/memory-compaction-configuration.test.ts tests/unit/agent/loop/llm-phase-memory-compaction-configuration.test.ts tests/integration/agent/runtime/agent-runtime-compaction.test.ts --no-watch
```
Unchanged native algorithms and physical runtime memory, DummyLLM; no real native replacement inference claim.

## C07/C09/C08/C12 — actual supported full-system acceptance

`live-environment.mjs` starts project `startBuiltTestServer` with unique DB/data/runtime key, public GraphQL fixture creation, documented `pnpm dev --port` Nuxt and headless Chromium. Existing CLI HOME authentication continuity retained by supported test environment; no provider-secret import/copy. Environment explicitly enables Codex, does not inject model capacities. Runtime: Codex CLI 0.153.4, actual launch workspace. Actual browser `/workspace` Settings, GraphQL proxy, persistence and normal next-message WebSocket/provider path. No route interception/source seam/metadata rewrite to select a model.

This is **temporary, sequence-dependent acceptance scaffolding**, not a repeatable credential-free CI test. Sources and every phase result are retained for audit. It requires a fresh owned environment and available positive runtime catalog. Do not blindly rerun into this evidence directory: it contains final observations, and its original unique local fixture has been cleaned. Copy to a new ticket evidence location with relative imports preserved or parameterize output before repeating. External provider catalog/auth/compaction behavior is environment-dependent; absence on a rerun must not be called Pass.

Execution sequence used:
1. `node E/live-environment.mjs` (owned long-lived process) -> ready record `live-environment.json`, correlated `live-server.log`, `live-nuxt.log`, `live-chrome.log`. Backend 38637, Nuxt 46063, CDP33153 were ephemeral ports, now closed.
2. `node E/live-browser-actions.mjs open`, `send-first`, `stop`, `settings`, `save`, `resume`. Provider evidence extraction `python3 E/live-provider-evidence.py before|after`. Sources use exact owned metadata to locate only the matching CLI session.
3. First larger Settings Save spark128000 -> luna272000 committed; driver incorrectly waited for deterministic fixture success copy, so captured canonical state and fresh reverse-shrink rejection in `live-first-save-verify.json`. Then complete equal-capacity luna->terra Save checkpoint (`live-save-result.json`) and normal resume (`live-resume.*`, `live-provider-after.json`). Earlier selector/focus/feedback errors retained separately; these are harness errors, not inferred product failures.
4. The normal terra turn naturally emitted provider `compacted` event. Reordered C09 before Team to use this genuinely already-compacted state: `stop`, `settings`, `save-compacted`, `resume-compacted`; `python3 E/live-provider-evidence.py compacted`. No forced compaction/threshold change. `live-save-compacted-result.json` asserts provider transcript and local nonmetadata hashes equal before/after Save. `live-provider-compacted.json` retains the same compaction payload SHA and exact new-model completed turn.
5. `node E/live-team-setup.mjs` creates configured root+nested tree through public APIs; initial traversal incorrectly expected in-memory kind discriminator in persisted JSON. Harness corrected to persisted agentRunId shape and recovered single already-created tree, no duplicate launch. `live-team.json` records fixture; initial setup log retained. `node E/live-team-browser.mjs first lead`, `first reviewer`, `stop`, `settings`, `save`, `resume lead`, `resume reviewer`. `python3 E/live-team-provider-evidence.py` asserts exact old/new model turns and recalled unique labels.
6. `node E/live-guards.mjs`: active Agent/Team Saves reject with unchanged bytes, normal stop/archive public APIs succeed, archived Saves reject with unchanged bytes. `live-guards-result.json` Pass.
7. SIGTERM only owned environment parent; it stops owned Nuxt/Chromium groups/server and removes owned unique local runtime/database/key. `cleanup-and-evidence-audit.json` additionally confirms exits and removals.

### Independent provider attribution (not model self-report)

| Scope | Local run / provider conversation | Completed old -> new provider turn models | Earlier-context evidence |
| --- | --- | --- | --- |
| Agent C07 | `api_model_live_1788963702207_b7ed67a6e51f442398c2ccd467aa3438` / `01a0868b-deac-7ec0-94ae-b93fb14b6753` | spark -> gpt-5.6-terra | `violet-otter-6842` recalled without label in next input |
| Same already-compacted Agent C09 | same IDs | terra -> gpt-5.6-sol | `violet-otter-6842 | compacted-continued`, previous compacted payload retained |
| `/Nested/lead` C08 | `api_model_live_1788963702207_f30a7a7132cf4fbd96a749eb5cc3e49a` / `01a08693-ac12-74c2-92a8-542827b4e0b5` | gpt-5.6-luna -> gpt-5.6-sol | `lead-amber-7291 | continued` |
| `/Nested/reviewer` C08 | `api_model_live_1788963702207_7785b295c4da435ca9966779fd4543ca` / `01a08694-0a65-79c3-9f3a-5811bcee1dda` | gpt-5.6-luna -> gpt-5.6-terra | `reviewer-amber-7291 | continued` |

Provider CLI's exact session `turn_context` model/turn IDs and corresponding `task_complete` are independently read after the UI journey, joined to unchanged persisted provider IDs. These are not only catalog lists, UI-selected values, or model-generated self-identification; no claim is made to inspect provider-internal model weights. Raw source paths/timestamps are in the filtered JSON. Exactly three newly created CLI session transcripts retained deliberately; no unrelated CLI history read/reset. Only filtered test-relevant evidence copied into E.

Live Team Save changes exactly `/Nested`, `/Nested/lead`, `/Nested/reviewer`; root/coordinator stay luna. `live-team-save-result.json` preserves all other tree fields/topology/task arrays/identities and non-tree hashes. Durable configured fixture also proves existing task records/divergence/mixed-runtime guards; live seed did not create delegated tasks.

## Limits and cleanup

- No live Claude/native model replacement, Electron shell, full Web typecheck/build, full monorepo suite, packaging/release/deployment or cross-platform claim. Initial mandated live Codex acceptance and each material shared path proven; live targets demonstrably not all disabled.
- Failure injection is controlled lower-level persistence and real renderer transport, not deliberately breaking a live provider's storage. Real network contract, real owner stores and actual provider inference tested separately with correlation.
- Prior architecture guard's three failures reproduced in pristine approved base are retained upstream only, not rerun or waived here.
- Renderer JSON cleanup shows browser/context closed, owned Nuxt process group exited and temporary page removed. API tests use owned runtime cleanup. Live audit confirms all known owned live PIDs exited and DB/data removed. Provider test transcripts and evidence intentionally retained. Shared auth/config untouched.
- `cleanup-and-evidence-audit.json`: heuristic scan found no potential common secret values in this evidence directory; not a universal secret guarantee.
- `durable-tests.diff` and `durable-test-source-audit.json` pin the exact three changed durable sources for proportional review. No production source edits or commits performed by this stage; SDK dist and reviewer worktree changes excluded.
