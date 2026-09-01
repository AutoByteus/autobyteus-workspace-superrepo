# Implementation Handoff

## Upstream Artifact Package

- Upstream route: `Architecture Design -> Architecture Review -> Implementation -> Code Review -> API/E2E failure-origin recovery -> Product/Requirements/Architecture recovery -> Implementation -> Code Review Local Fix`.
- Requirements doc: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`.
- Investigation notes: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`.
- Requirements revision record: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md`.
- Requirements authority: `RER-021@ed236a63e8905432a6bb45e826c82856e620e7dc`, `Approved Architecture-Ready`; cumulative behavior remains RER-018 plus approved `REQ-028` / `AC-023` / `BEH-011`.
- Design spec: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md` (`AD-REV-007@53acd4a359d59762c7d0ecb6020c0e14a75666b2`, cumulative `AD-REV-005/006`).
- Supplemental contract: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md`.
- Architecture revision/self-validation: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-revision-record.md` and `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Architecture review: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md` and `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md` (`ARCH-REV-005 / Pass`).
- Triggering source review: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/code-review-report.md` and `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/code-review-revision-record.md` (`CRR-010 / Fail — Local Fix`; remaining `CR-FIND-009`).
- API/E2E report/investigation: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-execution-coverage-report.md` and `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md` (`API-REV-001 / Fail`; renewed validation remains stopped pending source pass).
- Product authority: `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/ui-ux-spec.md`, its user-decision record/manifest and `VIS-001`–`VIS-020`, plus `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-STATUS-001/ui-ux-spec.md`, its user-decision record/manifest and `VIS-STATUS-001`–`VIS-STATUS-003`.
- Clean-entry supplement: `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/BASELINE-PROMOTION-001/ui-ux-spec.md`.

## Current Implementation Summary

`IR-011` completes the remaining `CR-FIND-009` correction on top of cumulative `IR-009 + IR-010`.

1. `ConfiguredAgentActivationPlanner` now returns one discriminated provider-binding change. A real-conversation restore retains the exact prior binding; a strictly inspected no-conversation external restore returns a specialized replacement carrying the exact expected previous binding and the prepared new binding.
2. The root-neutral configured-Agent handle stages adoption/retention separately from no-conversation replacement. Flat Team preparation carries the same private transition without adding a root, registry, API, or second recovery authority.
3. AgentOrg scope construction validates the replacement against the exact root/member/run and persisted old binding, updates the in-memory strict Org V1 tree, and uses the existing `AgentOrgRunPersistenceCoordinator` tree-mutation lane before publishing any prepared Agent or activating the Org.
4. The same shared prepared transition is consumed by standalone Team materialization so retained Team behavior does not diverge. Normal adoption still refuses arbitrary non-null replacement; only the explicit no-conversation transition can replace an exact expected binding.
5. Real-conversation restore, unreadable activity, missing real-conversation binding, candidate abort, whole-scope fail-stop, and publish-after-durability ordering remain unchanged and strict.

- Implementation cycle: `Code Review Local Fix`.
- Current implementation revision ID: `IR-011`.
- Current source commit: `035f7a30217d65bace023dc7c506e47d61742b07` (`fix: persist idle restore binding replacement`).
- Prior implementation baselines: `IR-009@d43042ce98a8a9729c422e7e96c6eebc9b02058d`; `IR-010@772c69249c047225b953a521b231d40dbdbf80ea`.
- Related architecture design revision IDs: `AD-REV-007` (cumulative `AD-REV-005/006`).
- Related architecture-review revision IDs: `ARCH-REV-005 / Pass`.
- Related code-review revision IDs: `CRR-008 / Pass`; `CRR-009 / Fail — mixed-origin`; `CRR-010 / Fail — Local Fix`.
- Related API/E2E revision IDs: `API-REV-001 / Fail`; renewed validation pending.
- Related delivery revision IDs: `N/A — pending`.
- Triggering finding: `CR-FIND-009`, corrected in source and awaiting independent verification.

## Routing Classification

- Task size: `Large`.
- Architectural risk: `High`.
- Classification confirmed or changed: `Confirmed`.
- Evidence: this round is a bounded correction in already-approved planner/scope/current-tree persistence owners, but the cumulative package retains high-risk Team V2/Org V1 migration, runtime identity, restore, task, streaming, workspace, and lifecycle behavior.
- Selected route: dynamic rules; Large/High is expected to require independent Code Review.
- Lightweight self-review: `Not Applicable — Large/High independent-review route`.
- Design Impact / Requirement Gap / Product UI gap: `None`; CRR-010 explicitly classified this as an implementation-owned Local Fix within `DS-014`.

## Reviewed Behavior Implementation Trace

| Behavior / finding | Required outcome | Implemented production path | Result |
| --- | --- | --- | --- |
| `CR-FIND-009`; `BEH-005`; `REQ-014`; `AC-009`; `DS-014`; `CR-SCN-017` | Explicit Restore of a retained external member with a non-null old provider ID but no real conversation prepares a new provider identity, durably replaces the old binding, then publishes the complete Org. | Activity inspector -> discriminated `ConfiguredAgentActivationPlanner.bindingChange` -> staged root-neutral handle/flat Team plan -> exact AgentOrg no-conversation mutator -> existing persistence coordinator -> candidate publication/Org activation. | Implemented. |
| Real-conversation continuation | Existing user/assistant activity requires the exact prior provider binding; missing binding fails closed. | Planner returns `adopt_or_retain` and invokes exact provider restore; unchanged binding adoption remains idempotent. | Preserved. |
| Unreadable activity | Classification uncertainty cannot start a new conversation. | Existing `COLLABORATION_AGENT_CONTINUATION_STATE_UNREADABLE` branch remains before candidate preparation. | Preserved. |
| Whole-scope atomicity | Pre-durability failure aborts candidates; publication occurs only after durable tree success; no partial root is exposed. | Existing scope-builder catch/reverse abort and persistence-coordinator lane retained. New scope regression gates the real atomic tree store and observes `durable -> published`. | Preserved and covered. |
| `BEH-011`; `REQ-028`; `AC-023` | Direct configured Team status remains exact, branch-only, collapse-independent, and live-authority-gated. | `IR-010` web fold/projector/dot/history implementation is unchanged. | Preserved. |
| `REQ-012`–`REQ-027`; `AC-008`–`AC-022` | Exact Team V2/Org V1 ownership, migration, task-host, stream, focus, external read-only and lifecycle contracts remain. | No schema, codec, migration, GraphQL, WebSocket, focus, command, or lifecycle source changed in IR-011. | Preserved. |

## Key Files Or Areas

- Transition authority: `autobyteus-server-ts/src/agent-collaboration/execution/backends/configured-agent-activation-planner.ts`.
- Strict replacement value: `autobyteus-server-ts/src/agent-collaboration/execution/domain/collaboration-agent-platform-binding.ts`.
- Root-neutral staging: `autobyteus-server-ts/src/agent-collaboration/execution/backends/configured-agent-execution-handle.ts`.
- Propagation through flat Team preparation: `autobyteus-server-ts/src/agent-team-execution/local/flat-team-execution-manager.ts` and `flat-team-execution-factory.ts`.
- AgentOrg prepare/durability/publish owner: `autobyteus-server-ts/src/agent-org-execution/services/agent-org-execution-scope-builder.ts`.
- Strict current-tree replacement: `autobyteus-server-ts/src/agent-org-execution/services/agent-org-run-execution-tree-mutator.ts`.
- Retained standalone Team parity: `autobyteus-server-ts/src/agent-team-execution/services/team-root-materializer.ts` and `team-run-execution-tree-mutator.ts`.
- Cross-boundary durability regression: `autobyteus-server-ts/tests/unit/agent-org-execution/agent-org-execution-scope-builder.test.ts`.

## Important Assumptions And Boundaries

- Only `mode=restore` plus external runtime plus strict activity result `none` can create `replace_without_conversation`.
- The replacement value requires non-empty, different old/new provider IDs and retains the exact compound root/member/run identity.
- Tree mutation rechecks the expected old provider ID at commit preparation. A root/identity miss, different current binding, or duplicate/missing node fails before durable write.
- User/assistant traces are real conversation activity. `system_instruction` and tool-only traces are not conversation activity; malformed/unreadable trace state is indeterminate and fails closed.
- The replacement is current Org/Team runtime state, not legacy decoding or a new migration.
- External Agent definition repositories remain read-only and were not edited, migrated, committed, released, or claimed complete.

## Known Risks

- Independent Code Review must verify `CR-FIND-009` against the cumulative source and confirm no new finding.
- API/E2E must rerun the real stopped-Org Restore with the retained system-instruction-only Codex member and a different prepared provider binding after source pass.
- This implementation round uses a production-shaped deterministic provider candidate and the real atomic Org execution-tree store; it is not a live Codex/provider API/E2E pass.
- API/E2E-owned dirty integration tests, generated package outputs, fixtures, reports, and evidence remain outside this implementation commit.

## Task Design Health Assessment Implementation Check

- Change posture: `Bug fix / Local Fix`.
- Root-cause classification: `Missing invariant/semantic transition inside existing owners`.
- Refactor needed now: `Yes — bounded discriminated transition`; no new subsystem or authority.
- Why: IR-009 correctly classified activity and prepared a new binding, but the semantic permission to replace an exact no-conversation binding was lost before current-tree persistence.
- Implementation matched reviewed design: `Yes`; the existing prepare -> durability -> publish spine remains authoritative.
- New architecture impact: `None`.

## Legacy / Compatibility Removal Check

- Backward-compatibility mechanisms introduced: `None`.
- Blanket provider resume-error fallback introduced: `No`.
- Second recovery/persistence/migration authority introduced: `No`.
- Generic durable root or mounted-Team lifecycle introduced: `No`.
- Shared structure tightness: `Yes`; `bindingChange` is discriminated, and replacement carries its exact expected previous binding rather than an unvalidated boolean.
- Source guardrails: all changed production files remain below `500` effective non-empty lines (`385` maximum); every production file delta remains below `220` changed lines (`54` additions maximum).
- `git diff --check`: passed before source commit.

## Persisted Data Transition Check

- Cumulative approved decision: `Migration Required` for the original family cutover.
- IR-011 decision: `Current-schema runtime mutation; no migration change`.
- The strict Org V1 tree is updated through the existing `AgentOrgRunPersistenceCoordinator.commitTreeMutation`; no schema/version field, codec, sidecar, migration registration, retry system, or historical decoder changed.
- Existing Team V2/Org V1 ownership and startup migration guarantees remain unchanged.

## Environment Or Dependency Notes

- Worktree: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`.
- Branch: `requirements/flat-agent-organization-model`.
- Package manager: `pnpm`.
- Implementation-owned source commit contains exactly the 15 listed server source/unit-test files. It excludes the three API/E2E-owned tracked integration-test edits, code-review artifacts, generated SDK/Brief `dist` outputs, and untracked API/E2E artifacts.

## Local Implementation Checks Run

These are implementation-scoped checks, not API/E2E sign-off.

- Exact activity/planner/handle/scope/flat-Team/tree-mutation cohort: `6` files / `25` tests passed.
- Broader collaboration/activity/AgentOrg/AgentTeam unit cohort: `40` files / `142` tests passed.
- `pnpm exec tsc -p tsconfig.build.json --noEmit` in `autobyteus-server-ts`: passed.
- `pnpm build` in `autobyteus-server-ts`: passed, including shared builds, Prisma generation, built-in-agent bootstrap smoke, and sanitized no-`DATABASE_URL` smoke.
- Real-store scope regression: old Org V1 binding remained on disk while durability was held; after release the new binding was read back from disk, the Org was active, and observed order was exactly `durable`, then `published`.
- Existing planner negatives for missing real-conversation binding and indeterminate activity passed; exact real-conversation reuse passed.
- `git diff --check`: passed.

## Frontend Rendered-Result Check

- `Not Applicable` for IR-011: no frontend component, style, layout, text, interaction, or rendered state changed.
- The cumulative IR-010 rendered desktop/narrow evidence remains authoritative for the status presentation change; IR-011 is entirely below the server restore/persistence boundary.

## Downstream Coverage Hints / Suggested Scenarios

1. Restore a stopped strict Org V1 containing a Codex member with a non-null old thread ID and only `system_instruction` trace state; assert a different prepared thread ID is durably stored and the complete Org becomes active.
2. Hold/fail execution-tree durability and prove no Agent candidate or Org root publishes; confirm candidate abort and no partial active registry entry.
3. Restore a member with real user/assistant activity and prove exact old provider identity/content reuse; remove its binding and prove fail-closed behavior.
4. Make activity state unreadable and prove no new provider conversation is prepared.
5. Exercise the same no-conversation state in a configured member inside a direct mounted Team and retain standalone Team restore parity.
6. Resume cumulative API-REV-001 coverage: imported Brief package, formal task lifecycle, stream recovery/release, migration, configuration-to-launch expansion, active/collapsed/history Team status, focus, and standalone Team regressions.

## API / E2E / Executable Coverage Investigation And Execution Still Required

`Yes`. The cumulative Large/High package requires independent source review first. After a source pass, API/E2E must renew `API-REV-001`; this handoff claims no API/E2E or delivery pass.
