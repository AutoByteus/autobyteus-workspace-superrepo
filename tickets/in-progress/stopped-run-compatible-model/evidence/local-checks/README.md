# IR-001 local implementation checks

These are implementation-scoped checks, not API/E2E acceptance or delivery sign-off. Commands ran from `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model` on 2026-09-08, Node 22.23.2, pnpm 10.28.2, Linux arm64.

## Passed
- `pnpm install --frozen-lockfile`; `pnpm -C autobyteus-server-ts prepare:shared`; Prisma generation; `pnpm -C autobyteus-web exec nuxi prepare`.
- `pnpm -C autobyteus-server-ts exec tsc -p tsconfig.build.json` (build for schema), and final `pnpm -C autobyteus-server-ts exec tsc -p tsconfig.build.json --noEmit`. Final typecheck log is intentionally empty (exit 0).
- `pnpm -C autobyteus-server-ts exec vitest run` with the ten paths listed in `server-focused.log`: 10 files / 62 tests. Includes live-owner/restore seam unit tests with fake providers, not inference.
- Final `vitest run tests/unit/agent-team-execution/team-run-model-selection-save.test.ts tests/unit/run-history/services/agent-run-model-selection-commit.test.ts`: 2 files / 7 tests. This reruns five earlier tests and adds two indeterminate-read cases; Team fixture now includes a retained settled task.
- Six composition/lifecycle unit files in `server-boundaries-initial.log`: 39 tests passed. The same command's architecture failures are not counted as passes.
- `pnpm -C autobyteus-web test:nuxt components/workspace/config/__tests__ components/agentTeams/__tests__/SearchableGroupedSelect.spec.ts components/launch-config/__tests__/RuntimeModelConfigFields.spec.ts services/runConfigEditing/__tests__ stores/__tests__/existingRunModelConfigStore.spec.ts --run`: 11 files / 122 tests.
- `pnpm -C autobyteus-web guard:web-boundary` and `guard:localization-boundary`; `git diff --check`; `node --check` of both implementation probes and the mechanically updated existing web E2E fixture script.
- GraphQL generation: print `buildGraphqlSchema()` to `/tmp/stopped-model-schema.graphql`, then `BACKEND_GRAPHQL_BASE_URL=/tmp/stopped-model-schema.graphql pnpm -C autobyteus-web codegen`. Generated types and operations validated together; no API was stood up.
- Production-capacity probe: `node tickets/in-progress/stopped-run-compatible-model/evidence/implementation-capacity-probe.mjs --claude --output=tickets/in-progress/stopped-run-compatible-model/evidence/implementation-capacity-probe-result.json`. Both actual production readers return positive evidence in this launch/auth environment. Codex 0.153.4. Output is metadata only, no saved run activation, inference, or changed-model acceptance. The optional output flag keeps a valid JSON result separate from imported-module console output.
- Rendered-result inspection: `node tickets/in-progress/stopped-run-compatible-model/evidence/implementation-render-inspection.mjs`; actual Nuxt Settings components with deterministic GraphQL/health transport, real Chromium at 1280x900 and 520x900. Final result Pass, no page errors/console errors, owned processes and temporary page cleaned up.

## Architecture guard comparison (not a blanket pass)
Final current command: `pnpm -C autobyteus-server-ts exec vitest run tests/architecture/agent-provider-composition-boundaries.test.ts tests/architecture/application-framework-boundaries.test.ts --testTimeout=60000`.
- Application framework: all 20 tests pass, including complete AFB-001–005 tree and root-bound task inventory.
- Agent provider composition: 11 pass, 3 fail. Identical three failures reproduce at pristine approved base `a32b53f6320222c9bf3c7f3a4a3c50fbd1e44f27` in a disposable `git archive` tree with linked installed dependencies; baseline log retained, temporary tree removed afterward.
- Existing failures: direct AgentRunManager test inventory omits two existing E2E paths; existing `run-projection-toolcalls-graphql.e2e.test.ts` initializer uses a disallowed cast; AgentRunService inventory omits existing standalone-error-termination E2E path. They are not new production-boundary violations. Do not infer broader review or executable acceptance from this comparison.
- Initial concurrent guard run had extra default-timeout failures and detected an implementation-local recursive validator construction; the latter was removed in favor of private request-local evidence, preserving exactly the two existing host assembly constructors. Final rerun eliminates these additional failures. Existing unrelated inventory guards were not relaxed.

## Local iteration and limitations
- Initial renderer transport omitted a GraphQL fragment typename, producing an empty options object. Corrected the fixture and made the options boundary reject malformed data; retained initial failure evidence is diagnostic only. Later assertion corrections matched actual model labels and localized copy; final screenshot waits for completed Save feedback rather than the temporary Saving state.
- Shared picker gained bounded keyboard/ARIA/focus behavior; current runs exercise search → ArrowDown → Enter and unit-test Escape/focus return.
- No full Nuxt typecheck (vue-tsc is not installed), full frontend build, electron shell validation, full server suite, API/E2E suite, real model-switch resume, configured-member inference, or already-compacted conversation was executed by Implementation.
- API/E2E and integration fixture edits are mechanical adaptations of required model+settings payloads and renamed validator dependencies, not newly claimed executable coverage. API/E2E owns their investigation and execution.

## Metadata provenance
The adapter uses configured-runtime evidence, not model-name capacities. The Codex private shape/freshness handling was checked against the installed protocol and the upstream `rust-v0.153.4` sources:
- https://raw.githubusercontent.com/openai/codex/rust-v0.153.4/codex-rs/models-manager/src/manager.rs
- https://raw.githubusercontent.com/openai/codex/rust-v0.153.4/codex-rs/models-manager/src/model_info.rs
These sources inform only the isolated metadata adapter; no provider compression logic was changed. Unknown/unattributable metadata does not create an extra model-pair rule and does not block same-model schema validation.
