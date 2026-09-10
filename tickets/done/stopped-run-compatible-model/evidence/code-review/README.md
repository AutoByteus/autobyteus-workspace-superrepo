# CRR-001 reviewer evidence

Date: 2026-09-08. Worktree: `/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model`.
Reviewed production commit: `083387598db6e470078f5637f2f95b666fabe9e5`; HEAD at review: `571069feaa66d1a6ed5a8bf4a26a92826e910827`; approved base: `a32b53f6320222c9bf3c7f3a4a3c50fbd1e44f27`.

## Independently executed

From worktree root:

1. `pnpm -C autobyteus-server-ts exec tsc -p tsconfig.build.json` — exit 0; rebuilt current source before the reproduction below. No stdout on success.
2. `node tickets/in-progress/stopped-run-compatible-model/evidence/code-review/team-readback-probe.mjs` — exit 0; two diagnostic cases confirmed the defect. Source, JSON result and log retained here. The probe prints observed behavior rather than failing its process for the expected defect.
3. `pnpm -C autobyteus-server-ts exec vitest run tests/unit/llm-management/run-model-selection-service.test.ts tests/unit/runtime-management/model-context-capacity.test.ts tests/unit/agent-team-execution/team-run-model-selection-save.test.ts tests/unit/run-history/services/agent-run-model-selection-commit.test.ts tests/unit/agent-execution/standalone-agent-run-lifecycle-service.test.ts tests/unit/agent-team-execution/team-run-model-config-mutator.test.ts --no-watch` — exit 0; 6 files / 49 tests; `server-focused.log`.
4. `pnpm -C autobyteus-web test:nuxt services/runConfigEditing/__tests__/existingTeamModelConfigDraft.spec.ts stores/__tests__/existingRunModelConfigStore.spec.ts components/launch-config/__tests__/RuntimeModelConfigFields.spec.ts components/agentTeams/__tests__/SearchableGroupedSelect.spec.ts --run` — exit 0; 4 files / 22 tests; `web-focused.log`.
5. `git diff --check a32b53f` — exit 0 before reviewer artifacts. Independent changed-source inventory in `source-audit.json`: 47 manual sources, one generated output; no manual >500 nonempty lines or >220 total added+removed lines. Schema extraction conservatively counted as a new path. No source/test/fixture/evidence size conflation.
6. Source search for removed fixed-model validator/dependency/canonical response names — no matches in current server implementation or Web files searched. Read original/current schema diff: schema rules preserved.

## Defect reproduction boundary

SCN-005 / REQ-006 / AC-007 and AD-D02, DS-06/07 explicitly govern ambiguous Save outcomes. The probe reproduces that already-approved contract, not a new infrastructure reliability scenario inferred from a test.

The probe uses the freshly built current Team manager, Studio service, resolver method, strict current-schema store and actual filesystem writer. It creates an isolated synthetic stopped Team, validates the schema through the normal writer, and submits a model/settings patch. No existing product data is modified. The selection validator and live ownership lookup are bounded fakes; this is not proof of capacity eligibility, browser behavior, API networking or provider continuation. A transient read error is injected only after the actual write. A second distinct case injects directory finalization failure through the existing writer operations interface before that read error. Temporary directories are removed in `finally`.

Both cases wrote the new model once but returned `INTERNAL_ERROR` with null canonical tree, instead of retaining indeterminate outcome and requesting verification. The current Web store only reconciles `PERSISTENCE_INDETERMINATE`; the editor only exposes Retry for the reconciliation/refresh-required state. Those Web consequences are source-derived, not a new browser execution claim. Current code locks editing on INTERNAL_ERROR: no duplicate Save, data loss, or conversation reset is claimed.

The underlying Team exception branch predates this feature; CRF-001 identifies an unfulfilled explicitly preserved in-scope recovery contract, not a newly introduced exception or an earlier code-review result. No raw-file deletion, arbitrary corruption, multi-tab race or historical task edit is part of this finding.

## Retained but not rerun

Implementation production metadata probe, full 122-test Web run, additional composition units, GraphQL generation, render inspection and base/current architecture-guard logs remain implementation-owned evidence. Inspected retained Agent saved and narrow Team images; did not recreate their browser run. The three static architecture inventory/cast failures match the retained pristine-base failures; no blanket architecture pass is asserted.

No full Web build/typecheck, API/E2E, external inference, actual Settings-to-Codex resume, configured-member continuation or compacted-history acceptance was run by Code Reviewer. Those independent gates remain mandatory after correction/source review.
