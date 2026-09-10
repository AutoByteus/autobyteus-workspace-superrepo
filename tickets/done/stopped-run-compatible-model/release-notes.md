# Release Notes — stopped-run-compatible-model

Status: candidate notes prepared before user verification; **not published or released**. No version/tag assigned.

## Changed
- Stopped Agent and configured Team Settings support explicit model + settings Save within the existing runtime when the replacement has verified equal-or-larger context capacity.
- Target model settings/defaults are shown before Save. Team parent edits retain bounded original-link propagation and preserve divergent/directly edited scopes.
- Normal continuation uses the saved pair in the same conversation; Save leaves history and retained compaction state intact.
- Ambiguous Team persistence/readback requires canonical verification/Retry before another Save, without a duplicate mutation or rollback write.

## Boundaries
- Runtime, identity, policy/workspace, topology and task records stay fixed. Active/archived/Application-owned runs retain existing locks.
- Smaller or unknown-capacity replacements are rejected. Same-model settings retain normal schema validation without an additional capacity gate.
- No new budget/tokenizer/compaction-threshold restriction, history conversion/reset, migration or cross-runtime fallback. Future ordinary compaction timing may differ by model.
- Frontend/backend stopped Save API requires the model identifier and explicitly present nullable settings together; no old-client adapter.

## Verification
API-REV-001: selected 32 files/248 tests, full server build and final six durable browser cases Pass, with actual Codex same-conversation, configured Team and pre-compacted-history acceptance. No full-suite, universal provider-matrix, Electron/package or deployment claim. See `api-e2e-execution-coverage-report.md` for limits.

## Local Test Build — DR-002
The README Linux ARM64 Electron build completed for user testing with existing package version 1.4.68 / Electron 42.4.1. Architecture/updater metadata and bundled-server startup checks Pass. This is not a new version assignment, public release, graphical desktop acceptance or finalization. Artifact and checksum: `evidence/delivery-electron/build-result.json`.

## Accepted Ticket Scope — DR-003
User confirmed the model-switch ticket after the requested imported Classroom Luna -> Stop -> Astra -> normal continuation. Current API-REV-003 ticket Pass95% and CRR-005 no-new-delta review gate retain all earlier passing coverage. API-F001 remains a separately documented unresolved pre-switch approval/handoff observation; C16 Fail and C19 control remain historical evidence, not a claimed fix. No new release/version/deployment requested.
