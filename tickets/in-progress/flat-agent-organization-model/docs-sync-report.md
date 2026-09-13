# Docs Sync Report — DR-009

## Scope / integrated authority

- Ticket: `AORG-FLAT-TEAM-001 / UI-CLEAN-001`; date 2026-09-11.
- Built/validated requirements: **RER-032**, cumulative **AD-REV-022**, parent
  **AD-REV-021 / ARCH-REV-019 Pass**, **IR-001–043**, **CRR-066 source Pass**,
  **API-REV-027 Pass**, **CRR-067 Not Applicable** (no current durable-test delta).
- Classification/route: **Large / High / Reviewed**. Additional architecture
  review for the one-word copy-only AD022 delta is **N/A — not applicable**;
  the cumulative architecture review remains applicable and passed.
- Bootstrap reference: `personal@80e2bd195c42ea3ced778dbc051d4d00edaef16f` in
  `investigation-notes.md`; finalization target `origin/personal`.
- Refreshed/integrated base: `5645b49d6f51faa60bd3545bc8e3f0e7e3f96793`.
- Reviewed artifact: `6da826f8c246c197a70cceb69e19e33fdbdfdf69`; source/test
  `4ffcdf733ff597a0d2ae94587eb91ec47f749501`.
- Local safety checkpoint/integrated HEAD:
  `0cf14f6f5371804fbadd2f34ac37fde250cbfd55`. Sixteen explicitly named tracked
  markdown files protected; no source/test staging. Raw evidence preserved locally.
- Integration: `git merge --no-edit origin/personal` → already current, zero
  new base-only commits. No extra merge-triggered executable rerun needed;
  fresh Electron packaging/native smoke is separately recorded in the delivery report.
- All docs edits followed integration. `delivery-evidence/dr-009/docs-validation.json`
  records **Pass** for source owners, field-free examples, retired concepts and diff check.

## Why documentation changed

DR008's pending authoring request is now implemented and cumulatively validated.
The normal Team/Org definition shapes no longer contain authored versions, but
runtime execution versions remain. UI cleanup removes permanent identity clutter
without removing exact task inspection. Cold Org navigation and deliberate
retained Team inspection have distinct read/selection contracts. These are
long-lived authoring, migration and runtime facts, not merely ticket notes.

## Long-lived documents reviewed / updated

| Document | Result | Current change / rationale |
| --- | --- | --- |
| `autobyteus-server-ts/docs/modules/agent_team_definition.md` | Updated | Field-free current JSON, strict rejection of numeric/retired shapes, expectedFamily diagnostic, definition-only transition, current codec path. |
| `autobyteus-server-ts/docs/modules/agent_orgs.md` | Updated | Field-free Org example and referenced Team contract; ordered independent authoring migration, owned scope/zero-write skip/equality/reread, external and runtime exclusions, retired codec names. |
| `autobyteus-web/docs/agent_teams.md` | Updated | Current authored shape; normal settled task inspection while Team active/inactive; exact hydration-before-focus, read-only authority, live/recovery retention and compact participant links. |
| `autobyteus-web/docs/agent_orgs.md` | Updated | Field-free authoring, history-only Orgs/组织 copy, compact Messages and Tasks identity disclosure, cold exact links independent of drawer mounting. |
| `autobyteus-web/docs/agent_execution_architecture.md` | Updated | Shared compact detail/disclosure/navigation ownership, exact retained Team inspection intent versus ordinary live repair, cold Org history read, current history heading. |
| `autobyteus-web/docs/agent_artifacts.md` | Updated | Exact participant link/disclosure ownership in task detail; no extra top strip or runtime selection owner in the detail component. |
| `autobyteus-server-ts/docs/modules/agent_team_execution.md`, `run_history.md` | No change | Current strict runtime Team V2/Org V1, sidecar/history and stopped-model contracts remain accurate; new authored transition is documented in definition/Org modules. |
| `autobyteus-server-ts/docs/design/production_data_migration_conventions.md` | No change | Current minimal known-source transition, independent status and no normal fallback conventions remain applicable; no migration-policy expansion. |
| `autobyteus-web/README.md`, `docs/electron_packaging.md` | No change | Existing guarded ARM64 build and explicit isolated packaged launch used; no new release or launch policy. |

## Durable knowledge promoted / retired concepts

| Topic / retired concept | Current truth | Supporting upstream authority |
| --- | --- | --- |
| Numeric authored Team/Org configs and version-suffixed normal codecs | One strict field-free family shape; normal reads never strip versions; old numeric decoders are migration-only. Execution-tree versions remain unchanged. | RER029, AD020/DS031–033, IR039, API27 |
| Implicit replay of family migration for authoring | Separate required startup-only `20260911_collaboration_definition_authoring_shape`; writable server-owned definitions only, independent result, exact non-version preservation. | Same chain and current registry/migration source |
| Agent Orgs / singular Org history heading | Plural Orgs, zh-CN组织, directly after Teams within each Workspace; main navigation and domain/API names unchanged. | RER030–032, AD021/022, IR040/041 |
| Permanent message address/Task-ID badge and task participant strip | Familiar compact content with exact on-demand identity and name links; all task-inclusive communication remains. | RER031, DS034, IR040/041 |
| Cold Org link depends on drawer-loaded history | Existing strict Org-family read resolves missing row before exact navigation; no live inference or Restore fallback. | IR042, API-FIND028 resolved in API26 and confirmed API27 |
| Settled task inspection requires a live Team row | Exact retained projection hydrates before view-owned deliberate inspection focus; read-only target; ordinary live selection remains distinct. | IR043, CRR066, API-FIND029 resolved API27 |

Current task-inclusive Messages/Tasks, true notification acceptance, first-message
configured-external title eligibility, automatic-only recovery, immutable source
identity and fixed configured topology remain unchanged. No Product/UI invention
or source fix was performed by Delivery.

## Continuation

Docs sync **Pass — Updated**. No documentation ambiguity or upstream gap remains
for the current RER032 package. Continue packaging/native checks and explicit
user-verification hold; current completion gates are authoritative in
`handoff-summary.md`, `release-deployment-report.md` and DR009. This is not
repository finalization, release or terminal Delivery completion.
