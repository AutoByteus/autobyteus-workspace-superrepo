# Architecture Design Revision Record

The approved requirements package and latest `design-spec.md` remain
authoritative. This record is a navigation and architecture-rationale index; it
does not revise intended behavior.

## Revision Index

| Revision ID | Triggering Role / Report / Round | Finding IDs | Classification | Result |
| --- | --- | --- | --- | --- |
| AD-REV-001 | Requirements Engineer handoff, approved package `AORG-FLAT-TEAM-001` / initial architecture round | N/A | `Initial Architecture Baseline` | `Architecture Design Complete`; `task_size=Large`; `architectural_risk=High`; Architecture Review selected |
| AD-REV-002 | Requirements Engineer re-entry, approved `RER-016` plus Product `RV-012` / Product-and-durable-impact architecture round | `RIF-AORG-001`, `RIF-AORG-002`, `ADI-001`-`ADI-005`, prior `Requirement Gap` on superseded RER-014 V3 | `Architecture Revision — Product, Launch, Handoff, And Split-Run-Family Impact` | `Architecture Design Complete`; `task_size=Large`; `architectural_risk=High`; Architecture Review selected |
| AD-REV-003 | Architecture Reviewer `ARCH-REV-001` plus Requirements Engineer approved `RER-018` / architecture-review recovery round | `AR-FIND-001`, `AR-FIND-002` | `Architecture Revision — Target Definition Admission, External Ownership, And Handoff Order` | `Architecture Design Complete`; both findings resolved; `task_size=Large`; `architectural_risk=High`; another Architecture Review selected |
| AD-REV-004 | User identification of the canonical server migration convention / architecture-impact correction round | `ADI-006` | `Architecture Revision — Forward-Only Convention-Compliant Migration Mechanics` | `Architecture Design Complete`; migration mechanics corrected without requirements/Product change; `task_size=Large`; `architectural_risk=High`; another Architecture Review selected |
| AD-REV-005 | Implementation Engineer `IR-001` / `IDI-001` after `ARCH-REV-002` Pass / implementation-impact recovery round | `IDI-001` | `Architecture Revision — Root-Neutral Configured Execution And AgentOrg Production Composition` | `Architecture Design Complete`; production extraction/composition boundary and self-validation added; `task_size=Large`; `architectural_risk=High`; another Architecture Review selected |
| AD-REV-006 | API/E2E Engineer real imported-package/browser validation after `IR-003` and `CRR-003` Pass / downstream design-impact recovery round | `ADI-007` | `Architecture Revision — Accepted Agent/Team Workspace Reuse And Strict AgentOrg Presentation` | `Architecture Design Complete`; raw Org runtime dashboard path removed by design; self-validation expanded to 22 cases; `task_size=Large`; `architectural_risk=High`; another Architecture Review selected |
| AD-REV-007 | API/E2E `API-FIND-007`, Code Review `CRR-009` / `CR-FIND-011`, and Requirements Engineer approved `RER-021` with focused Product `AORG-FLAT-TEAM-STATUS-001` / Product-baseline-impact recovery round | `API-FIND-007`, `CR-FIND-011` | `Architecture Revision — Mounted-Team Aggregate Status Projection` | `Architecture Design Complete`; focused Product gap mapped to an exact presentation-only Team-branch projection; self-validation expanded to 25 cases; focused delta `Medium/Low`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |
| AD-REV-008 | Code Review `CRR-012/013` and API/E2E `API-FIND-008` exact correlated settlement probe / architecture-held Unclear recovery round | `API-FIND-008`, `CR-CAND-020` | `Architecture Revision — Non-Blocking Terminal Task Settlement And Interrupt-Before-Drain Shutdown` | `Architecture Design Complete`; exact liveness cycle classified and resolved at design boundary; self-validation expanded to 29 cases; focused delta `Medium/High`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |
| AD-REV-009 | Architecture Reviewer `ARCH-REV-006` / `AR-FIND-003` supported-reachability review of AD-REV-008 | `AR-FIND-003`, `AR-PREM-004`, `AR-PREM-005`, retained `API-FIND-008` / `CR-CAND-020` | `Architecture Revision — Supported Quiescence Deferral And Interrupt-Before-Drain Shutdown` | `Architecture Design Complete`; AD-REV-008 coordinator/token machinery withdrawn; supported production reachability and proportional correction self-validated across 29 cases; focused delta `Medium/High`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |
| AD-REV-010 | Architecture Reviewer `ARCH-REV-007` / `AR-FIND-004` supported shutdown-race review of AD-REV-009 | `AR-FIND-004`, retained `API-FIND-008` / `CR-CAND-020` | `Architecture Revision — AgentRun Root-Shutdown Admission And Provider-Start Fence` | `Architecture Design Complete`; supported pre-`TURN_STARTED` race receives one AgentRun-owned fence over stable recursive Team/Org scopes; focused delta `Medium/High`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |
| AD-REV-011 | Architecture Reviewer `ARCH-REV-008` / `AR-FIND-005` cumulative coherence review of AD-REV-010 | `AR-FIND-005`; prior `AR-FIND-004` verified resolved | `Architecture Revision — One-FIFO Recursive Task-Team Validation Coherence` | `Architecture Design Complete`; stale withdrawn cleanup-job/concurrent-outside-FIFO language removed from VAL-006; focused delta `Small/Low`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |
| AD-REV-012 | Code Review `CRR-021` / `CR-FIND-020` plus Requirements Engineer approved `RER-023` and focused Product `AORG-TEAM-OVERRIDES-001` | `CR-FIND-020`; separate `CR-FIND-019` retained as Implementation Local Fix | `Architecture Revision — Established AgentTeam Launch-Hierarchy Reuse For AgentOrg` | `Architecture Design Complete`; bespoke Org mounted-Team editor replaced at design boundary by strict Org projection into accepted Team presentation; self-validation expanded to 30 cases; focused delta `Medium/Low`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |
| AD-REV-013 | User Electron production-path findings plus Requirements Engineer approved `RER-024` | `BEH-013`-`BEH-015`; `REQ-030`-`REQ-032`; `AC-025`-`AC-027`; `SCN-014`-`SCN-016` | `Architecture Revision — Effective Launch Equality, Unified Workspace History, And Root Workspace Default` | `Architecture Design Complete`; one canonical Org patch, one route-stable Workspace/history surface with distinct read/presentation owners, and established root default/inheritance; self-validation expanded to 33 cases; focused delta `Medium/High`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |
| AD-REV-014 | Architecture Reviewer `ARCH-REV-011` / ownership-coherence recovery round | `AR-FIND-006` | `Architecture Revision — Unified History Data Versus Presentation-State Ownership` | `Architecture Design Complete`; DS-025 assigns history data/grouping/order to the mixed read owner and expansion/reveal/highlight/scroll continuity to one always-mounted panel/tree-state owner; focused delta `Small/Low`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |
| AD-REV-015 | Requirements Engineer approved `RER-025` after user Electron AgentOrg-versus-Team history-title comparison | `BEH-016`; `REQ-033`; `AC-028`; `SCN-017`; `QR-011`; `DEC-020` | `Architecture Revision — First Accepted AgentOrg Message History Summary` | `Architecture Design Complete`; accepted-message first-write filtered by exact execution kind, authoritative live refresh, and conservative registered recovery migration; self-validation expanded to 37 cases; focused delta `Medium/High`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |
| AD-REV-016 | Architecture Reviewer `ARCH-REV-013` / migration-status coherence recovery round | `AR-FIND-007`; `BEH-016`; `REQ-033`; `AC-028`; `DEC-020` | `Architecture Revision — Migration-Specific Terminal Status Authority` | `Architecture Design Complete`; family migration retains no-warning failure rules while summary migration retains bounded valid-empty warnings; no mechanism or behavior change; focused delta `Small/Low`, cumulative `task_size=Large` / `architectural_risk=High`; another Architecture Review selected |

## Revision Entries

### AD-REV-001 — AgentOrg / Flat AgentTeam Clean-Cut Architecture Baseline

- Triggering role, report path, and round: Requirements Engineer; approved
  requirements revision `RER-009`; initial Architecture Design round. Canonical
  input:
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`.
- Triggering finding IDs: `N/A — initial architecture baseline`.
- Prior authoritative design result: `N/A`.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`.
- Why this baseline or revision is recorded: It converts the approved exclusive
  AgentOrg/flat-AgentTeam model and minimal-delta V3 contract into one actionable
  definition, runtime, persistence, migration, API/stream, application, history,
  and web design grounded in the current repository and representative stored
  state.
- Approved behavior or requirement IDs affected: `BEH-001`-`BEH-009`,
  `REQ-001`-`REQ-018`, `AC-001`-`AC-013`, `PRE-001`-`PRE-005`, and
  `ORG-CASE-001`-`ORG-CASE-031`.
- Design-spec sections updated: All sections; especially current-state evidence,
  behavior/production-path map, V3 migration decision, spine/ownership maps,
  clean-cut removals, interface boundaries, target paths, sequencing, and final
  Large/High classification.
- Architecture supplements updated, added, or removed: None. The normative
  `agent-org-contract.md` remains Requirements Engineering-owned and unchanged.
- Downstream and architecture-review impact: `Large` or `High` requires
  independent Architecture Review before implementation. Review must focus on
  the one V3 root union, root/Team ownership split, fixed-depth compiler/runtime,
  definition/run migration atomicity, task-host preservation, explicit Org
  entry, progressive Team reuse, and removal of compatibility paths.
- Next recipient or routing: Dynamic handoff rules determine the exact
  recipient. Expected next action is independent Architecture Review of the
  cumulative package; no implementation handoff is sent directly by Architecture
  Designer when the review route is selected.
- Remaining gaps or risks: No product requirement gap. High structural risk
  remains around coordinated contract cutover, filesystem/package migration,
  task lineage preservation, external package-root writability, and concurrent
  dynamic-Team work; controls are specified in `design-spec.md`.

### AD-REV-002 — Approved Product UI, Configuration-First Launch, Atomic Handoff Save, And Split Run Families

- Triggering role, report path, and round: Requirements Engineer re-entry;
  approved cumulative requirements
  `RER-016@4ffc9fe3c119cf11bfcedb6b3fd1cb093a1edb81`; approved Product UI
  `RV-012`; architecture Product/durable-impact round. Canonical inputs are
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`,
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md`,
  and
  `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/ui-ux-spec.md`.
- Triggering finding IDs: Requirements/Product findings `RIF-AORG-001` and
  `RIF-AORG-002`; architecture impact decisions `ADI-001`-`ADI-005`; the
  Architecture Designer's intervening Requirement Gap that identified the
  conflict between the user's split-file direction and superseded RER-014's
  generic V3 root contract. `RER-016` resolves that gap with explicit approval.
- Prior authoritative design result: `AD-REV-001`, Architecture Design Complete,
  at commit `36bc02deca363798b6eda878e5eb4850e624da6f`.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place for RER-016 and Product RV-012.
- Why this revision is recorded: It (1) replaces pre-launch exact entry with one
  configuration-first full-scope activation that begins unfocused; (2) adds
  fixed-depth root/Team/Agent configuration precedence; (3) completes
  From/To/When authoring, ownership, ordering, validation, optimistic
  concurrency, and crash-safe parent-definition save; (4) makes RV-012 and
  VIS-001-VIS-020 normative frontend evidence; and (5) supersedes AD-REV-001's
  generic V3 durable design with the user-approved exact native Team V2 plus
  separate AgentOrg V1 stores/paths and explicit mixed projection discriminator.
- Approved behavior/requirement IDs affected: `BEH-001`-`BEH-009`;
  `REQ-001`-`REQ-025`; `AC-001`-`AC-020`; `SCN-001`-`SCN-009`;
  `PRE-001`-`PRE-005`; and `ORG-CASE-001`-`ORG-CASE-048`.
- Design-spec sections updated: all current-state/evidence and intended-change
  sections; target definition/run contracts; behavior/scenario/spines;
  persisted-data cohort decisions and atomic transition; Product mapping;
  ownership/interfaces/dependencies; file/folder mapping/removals; sequencing;
  examples; compatibility rejection; tradeoffs/risks/guidance; final Large/High
  classification.
- Architecture supplements updated, added, or removed: None created by
  Architecture Designer. Requirements-owned `agent-org-contract.md` is current
  through RER-016. Product-owned UI/UX specification, decision record, manifest,
  and VIS-001-VIS-020 remain approved inputs.
- Downstream and Architecture Review impact: classification remains `Large` /
  `High`; independent Architecture Review is mandatory. Review must verify exact
  Team V2 preservation/no-op behavior, strict Org V1 root/file/path, separate
  subject aggregate/store ownership, tight shared record reuse without a
  generic persisted root, failure-closed tagged mixed projections, one-family
  atomic migration, task-host preservation, no-entry/no-focus Org activation,
  configuration precedence, definition transaction integrity, and RV-012
  production mapping.
- Next recipient/routing: dynamic handoff rules determine the exact recipient.
  Expected next action is independent Architecture Review of the cumulative
  `RER-016` / `RV-012` / `AD-REV-002` package.
- Remaining gaps/risks: No requirements or Product UI gap. High structural risk
  remains around no-op Team preservation, family classification/cutover,
  definition package crash recovery, Org composition over Team execution
  primitives, tagged projection mismatch handling, task lineage, config parity,
  focus fallback removal, external package writability, and exact desktop/narrow
  Product reproduction.

### AD-REV-003 — Exact Target Definition Admission, External Read-Only Scope, And Root-First Handoff Order

- Triggering role, report path, and round: Architecture Reviewer
  `ARCH-REV-001` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md`
  and
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`;
  followed by Requirements Engineer re-entry with approved
  `RER-018@e1f26fbe128a33ef863a3735607b1b3857f161e6`. This is the first
  architecture-review recovery round.
- Triggering finding IDs: `AR-FIND-001` and `AR-FIND-002`. The reviewer later
  withdrew the external-file migration prescription after the user's source-
  ownership clarification; the resulting conflict returned to Requirements
  Engineering and was resolved by approved `RER-018`.
- Prior authoritative design result: `AD-REV-002`, Architecture Design Complete,
  at commit `46552576270b3641d7a0e35e3d8cd0da75dad10e`; independent review result
  `ARCH-REV-001@899c60a70c4da1ff779537a5c1d2f503ebcb3319` was Fail / Design
  Impact.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as `AD-REV-003` for approved `RER-018`.
- Why this revision is recorded: it closes the Team-definition format gap with
  exact Team Definition Config V2 and Org Definition Config V1, source-classed
  target-only admission, migration-only server-owned legacy decoding, explicit
  non-blocking external/dependent-definition diagnostics, and a cutover that
  keeps all server memory runtime packages in scope. It also preserves current
  effective handoff behavior by specifying Org/root-owned saved order first,
  followed by direct Team-local saved lists in stable Org member order, with
  stable rules and no later regrouping.
- Approved behavior or requirement IDs affected: `BEH-001`, `BEH-003`,
  `BEH-005`-`BEH-007`, `BEH-010`; `REQ-002`, `REQ-006`, `REQ-009`-`REQ-013`,
  `REQ-026`-`REQ-027`; `AC-003`, `AC-004`, `AC-006`-`AC-008`,
  `AC-015`-`AC-018`, `AC-021`-`AC-022`; `SCN-003`-`SCN-006`, `SCN-008`,
  `SCN-010`-`SCN-011`; `PRE-001`-`PRE-005`; and
  `ORG-CASE-049`-`ORG-CASE-055` / `ORG-VERIFY-010`. Earlier approved
  Team/Org runtime and Product behavior remain unchanged.
- Design-spec sections updated: status/current-state/evidence/classification;
  intended change and recovery decisions; exact definition/source/admission
  contracts; effective handoff ordering; behavior/Product/scenario maps;
  persisted-data cohorts and migration; DS-000/DS-001/DS-007/DS-009 spines;
  ownership/interfaces/dependency rules; removal and file/folder mappings;
  compatibility rejection; sequence, tradeoffs, risks, and implementation
  guidance. `SCN-010` and new `SCN-011` are now explicit navigation witnesses.
- Architecture supplements updated, added, or removed: none. Requirements-owned
  `AORG-CONTRACT-001` is approved through RER-018; Product-owned `RV-012`,
  `ui-ux-spec.md`, and VIS-001-VIS-020 remain unchanged and authoritative.
- Downstream and architecture-review impact: classification remains `Large` /
  `High`; another independent Architecture Review is mandatory. Re-review must
  verify (1) one strict normal codec per target definition family, (2) no write
  or completion claim for the two external repositories, (3) capability-safe
  server-owned definition/runtime cutover plus non-blocking external
  availability and snapshot history, (4) 43-package cutover-inventory handling
  with native flat Team Run V2 zero-write behavior, and (5) root-first handoff
  order through compile, stored/migrated snapshots, `get_handoff_rules`,
  effective projections, and tests.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is another independent Architecture Review of
  the cumulative `RER-018` / `RV-012` / `AD-REV-003` package; do not route to
  implementation while `ARCH-REV-001` Fail remains the latest review result.
- Remaining gaps or risks: no Requirement Gap or Product UI gap. High structural
  risks remain around source misclassification, target-admission fallback,
  dependent-definition availability, server-data transaction recovery, runtime
  family promotion, handoff order drift, task lineage, mixed projection family
  mismatch, configuration/focus parity, and exact RV-012 reproduction. The
  design specifies controls; independent review remains open.

### AD-REV-004 — Canonical Forward-Only Production Migration Correction

- Triggering role, report path, and round: the user directly identified the
  repository's canonical data-migration convention after the AD-REV-003 review
  handoff. Architecture Designer inspected
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/autobyteus-server-ts/docs/design/production_data_migration_conventions.md`,
  its server README link, the existing app-data migration runner/registry/types,
  startup scheduling, and representative file migrations. This is an
  architecture-owned impact correction before the next review completes.
- Triggering finding IDs: `ADI-006`. No Requirement Gap or Product UI gap: the
  target Team Definition V2 / Org Definition V1 and Team Run V2 / Org Run V1
  contracts remain exactly as approved in RER-018; only rollout/recovery
  mechanics change.
- Prior authoritative design result: `AD-REV-003`, Architecture Design Complete,
  at commit `36e92c1e4ac3c09d3490a6dcab0b9720bd24b2d9`. The Architecture Designer
  asked the active reviewer not to finalize that package after discovering the
  convention mismatch.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as `AD-REV-004`.
- Why this revision is recorded: AD-REV-003 incorrectly introduced a custom
  migration plan/journal, backup/staging promotion, restoration state machine,
  blanket readiness gate, and exhaustive crash-boundary matrix. AD-REV-004 uses
  the existing registered `STARTUP_ONLY` runner, forward-only current codecs,
  migration-owned legacy decoders, atomic current-file replacement, one direct
  same-filesystem package rename, strict rereads/cleanup, bounded dispositions,
  capability-scoped exclusion, and ordinary restart/idempotence instead. No
  migration-specific ledger, runner API, manual retry, restore command, or
  warning-residue exception is added.
- Approved behavior or requirement IDs affected: rollout mechanics for
  `BEH-005`, `BEH-007`, and `BEH-010`; `REQ-012`, `REQ-013`, and `REQ-027`;
  `AC-008` and `AC-022`; `SCN-004` and `SCN-011`; and `PRE-001`-`PRE-005`.
  No intended behavior, Product UI state, schema version, logical file name,
  path, root discriminator, or external-project boundary changes.
- Design-spec sections updated: document status/current-state and evidence;
  AD-REV-004 impact decision; behavior and supplemental-artifact maps;
  persisted-data decision/convention application/migration plan/dispositions;
  supported operational scenarios; DS-007/DS-010 spines and readiness;
  ownership/dependency/file/folder mappings; clean-cut rejection; sequencing;
  migration tradeoffs/risks; and implementation guidance/tests.
- Architecture supplements updated, added, or removed: none. Requirements-owned
  `AORG-CONTRACT-001`, Product-owned `RV-012`, and the external repositories
  remain unchanged/read-only. The canonical migration convention is referenced
  as repository architecture authority, not copied into a competing artifact.
- Downstream and architecture-review impact: classification remains `Large` /
  `High`, so independent Architecture Review remains mandatory. Re-review must
  verify the original AR-FIND-001/002 resolutions plus forward-only current
  source, migration-only legacy knowledge, exact runner scheduling/recovery
  action, atomic direct rename/idempotent retry, narrow failure classification,
  bounded summary/log evidence, flat-Team zero-write behavior, and absence of
  custom migration journal/staging/backup/restoration machinery.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is another independent Architecture Review of
  cumulative `RER-018` / `RV-012` / `AD-REV-004`; do not route to implementation
  while `ARCH-REV-001` Fail remains the latest completed review result.
- Remaining gaps or risks: no Requirement Gap or Product UI gap. High structural
  risk remains because the release still changes definition/runtime families,
  history/stream/API/frontend boundaries, and server-memory ownership. The
  migration-specific residual risk is bounded to deterministic source
  classification, destination collision, cleanup, strict current catalog
  exclusion, and correct startup restart guidance; implementation must return a
  Design Impact rather than recreate custom recovery machinery.

### AD-REV-005 — Root-Neutral Configured Execution And AgentOrg Production Composition

- Triggering role, report path, and round: Implementation Engineer initial
  implementation `IR-001`, recorded in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-handoff.md`
  and
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/implementation-revision-record.md`,
  after Architecture Review `ARCH-REV-002@614f705ffee5ff40614a61bf56a58da12115b536`
  passed AD-REV-003/004. This is the first implementation-impact architecture
  recovery round.
- Triggering finding IDs: `IDI-001`. Implementation proved that the design's
  prior phrase “reuse lower-level Agent/Team runtime factories” did not name a
  constructible boundary: the candidate handle, member context, task resolver,
  memory locations, callbacks, sidecars, global routing, and process lifecycle
  were all statically Team-root-owned.
- Prior authoritative design result: `AD-REV-004`, Architecture Design Complete,
  at commit `05a41d1c32be4686065a68e29023ae508e393dae`; independent review
  `ARCH-REV-002` passed at
  `614f705ffee5ff40614a61bf56a58da12115b536` and routed to Implementation.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as `AD-REV-005` and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Why this revision is recorded: it replaces an underspecified injected Org
  activator/lower-level-reuse direction with an explicit internal production
  composition. The revised design extracts tagged root-neutral configured-Agent
  execution and a rootless flat-Team local runtime; binds Agent tools to narrow
  task commands instead of a `RootTeamRun` resolver; keeps task/message engines
  behind private Team/Org adapters; gives Org exact root task hosts, physical
  memory, sidecars, binding/event/fail-stop ownership, and compound active-root
  routing; and defines complete launch, restore, termination, construction, and
  shutdown order. Public Team V2 and Org V1 roots remain separate and exact.
- Approved behavior or requirement IDs affected: `BEH-002`, `BEH-004`,
  `BEH-005`, `BEH-008`, and `BEH-009`; `REQ-004`, `REQ-005`, `REQ-014`-`REQ-016`,
  and `REQ-024`; `AC-002`, `AC-009`, `AC-010`, `AC-019`, and `AC-020`;
  `SCN-002`, `SCN-004`, `SCN-006`, `SCN-009`, and `SCN-010`. No intended
  behavior, Product UI decision, or approved public/durable root-family contract
  changes.
- Design-spec sections updated: document/current-state/evidence/classification;
  AD-REV-005 impact decision; internal runtime composition; Org sidecars and
  memory placement; construction/activation/restore/fail-stop/termination;
  process/application composition; scenarios and DS-014/DS-015 spines;
  ownership, interfaces, dependencies, file/folder mapping, clean-cut removals,
  sequence, tradeoffs, risks, and implementation guidance.
- Architecture supplements updated, added, or removed: added
  `architecture-design-self-validation.md` at the canonical task path. It walks
  17 supported definition, Team, Org, task, message, binding, persistence,
  restore, shutdown, mixed-projection, migration, focus, authoring, and
  application cases through their data-flow spines, owners, boundaries,
  dependencies, persistence truth, failures, and forbidden shortcuts. It is
  design evidence, not executable-test evidence. Requirements/Product artifacts
  remain read-only and unchanged.
- Downstream and architecture-review impact: classification remains `Large` /
  `High`; another independent Architecture Review is mandatory before
  implementation resumes. Review must verify that the shared plane has no Team
  root/store/index/event imports, mounted Teams create no Team-family root,
  direct Org Agents/tasks have truthful Org hosts/paths, Org sidecars correlate
  strictly, initial publication/restore/fail-stop order prevents partial live
  roots, global routing uses compound identity, and shutdown preserves root
  ownership. The uncommitted IR-001 draft remains partial evidence and must be
  reconciled by Implementation only after a review Pass.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is independent Architecture Review of the
  cumulative `RER-018` / `RV-012` / `AD-REV-005` package; Implementation and
  Code Review must not treat the partial draft as ready while this revised design
  is unreviewed.
- Remaining gaps or risks: no Requirement Gap or Product UI gap and no material
  architecture question remains open after self-validation. Structural risk
  remains high because the clean extraction changes AgentRun/tool context,
  Team-local runtime, tasks/messages/events, memory/location, root sidecars,
  process composition, restore, and shutdown. Implementation must return a new
  Design Impact rather than introduce a synthetic root, standalone mounted Team
  or Org Agent, Team-envelope reinterpretation, public generic root, bare-ID
  inference, or boundary bypass.

### AD-REV-006 — Accepted Agent/Team Workspace Reuse And Strict AgentOrg Presentation

- Triggering role, report path, and round: API/E2E Engineer downstream
  validation after Implementation `IR-002/IR-003` at
  `8e680617cf3684de137ae318a7fa46133b695d4d` and Code Review
  `CRR-003` Pass. The real imported-package/full-stack/browser evidence is
  recorded in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-coverage-investigation.md`
  and
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-001/screenshots/03-org-live-raw-events-defect.png`.
  This is the first API/E2E-impact architecture recovery round.
- Triggering finding IDs: `ADI-007`. Configuration-first launch, initial null
  focus and exact `/concierge` focus succeeded, but a real prompt rendered
  low-level protocol envelopes through raw “AGENT RUN” JSON cards, a bespoke
  “MEMBER INPUT” card/composer and a focused-member `Stop Org` control. Source
  confirmed `AgentOrgWorkspaceView.vue` retained raw events and used
  `JSON.stringify`; the Org contract used `unknown` events and a send-only
  client command.
- Prior authoritative design result: `AD-REV-005`, Architecture Design Complete,
  at commit `9718fb36b68e0ffee554b9eb443c9e0bb9735aa1`; independent Architecture
  Review `ARCH-REV-003` passed at
  `ae61ecd38133d9db29eaf345acaf02a90e82e574`. Implementation and source-review
  results were `IR-003` and `CRR-003` Pass before API/E2E exposed the defect.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as `AD-REV-006` and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Why this revision is recorded: AD-REV-005 made runtime execution constructible
  but described the browser only as a tagged projection/focus path. It did not
  map the approved VIS-017/018 experience to the mature production AgentContext,
  event-monitor, composer, active-context, trace/tool/right-tab and Team
  presentation boundaries. That gap allowed a second AgentOrg dashboard to
  become authoritative. AD-REV-006 adds one strict root-neutral Agent
  presentation admission contract beneath subject envelopes; one checkpointed
  AgentOrg browser context with exact member hydration; four exact active-Agent
  target/interaction branches; store-neutral accepted Agent/Team workspace
  surfaces; Org command parity; Org-tagged trace/tool/token projections; and a
  root-history termination action. It explicitly removes the raw dashboard,
  JSON fallback, duplicate composer/header, send-only direct path and member-
  header root control.
- Approved behavior or requirement IDs affected: implementation path for
  `BEH-004`-`BEH-006`, `BEH-008`, and `BEH-009`; `REQ-004`, `REQ-016`,
  `REQ-019`, `REQ-024`, and `REQ-025`; `AC-009`, `AC-014`-`AC-020`; and
  `SCN-002`, `SCN-007`, `SCN-009`, and `SCN-010`. Product `RV-012`, especially
  VIS-016-VIS-018, remains the intended-behavior authority. RER-019 is only the
  approved baseline activation/provenance update and changes no behavior.
- Design-spec sections updated: current-state/evidence/classification and
  AD-REV-006 impact decision; strict running-workspace projection/reuse
  contract; Product-to-production mapping; scenarios and DS-016-DS-019 spines;
  owners/boundaries/dependencies/interfaces; reusable structures; exact
  file/folder/removal mapping; concrete/rejected shapes; sequencing; tradeoffs,
  risks, and implementation/validation guidance.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` was updated from AD-REV-005 to
  AD-REV-006. It retains the prior 17 cases and adds VAL-018-VAL-022 for a real
  Org Agent conversation, mounted Team workspace reuse, send/interrupt/tool
  parity, strict stream/hydration recovery, and root-stop ownership. Requirements,
  Product prototype artifacts and downstream implementation/API evidence remain
  read-only.
- Downstream and architecture-review impact: classification remains `Large` /
  `High`; another independent Architecture Review is mandatory before
  Implementation reconciles the correction or API/E2E resumes. Review must
  verify the strict presentation package/adapter is root-neutral, Team-only wire
  stays compatible, the Org event/command branch contains no opaque payload,
  Org hydration owns one correlated context, shared surfaces have no subject
  store/socket dependency, mounted Teams acquire no root authority, contextual
  trace/token/tool queries remain Org-tagged, and root stop is not attached to
  focused members.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is independent Architecture Review of the
  cumulative `RER-019` / `RV-012` / `AD-REV-006` package. Implementation and
  API/E2E remain stopped for this impacted path until review passes and the
  source is reconciled.
- Remaining gaps or risks: no Requirement Gap, Product UI gap, or material open
  architecture decision remains after self-validation. Structural risk remains
  high because the correction changes shared stream contracts/admission,
  member projections, browser hydration/stream ownership, active-context
  commands, accepted component extraction, contextual tools and root lifecycle
  placement. The real-browser defect is retained as failing evidence and is not
  claimed fixed by this architecture-only revision.

### AD-REV-007 — Mounted-Team Aggregate Status Projection

- Triggering role, report path, and round: API/E2E Engineer `API-FIND-007` and
  the user's original-personal Team-tree evidence identified the missing Team-
  level status signal on direct Teams mounted inside an AgentOrg. Code Review
  `CRR-009` / `CR-FIND-011` correctly classified the omission as a Requirement/
  Product baseline impact rather than a defect against the pre-RER-020 approved
  prototype. Requirements Engineer then returned the completed, approved
  `RER-021@ed236a63e8905432a6bb45e826c82856e620e7dc` package with the explicitly
  user-approved Product supplement
  `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-STATUS-001/ui-ux-spec.md`
  and normative `VIS-STATUS-001`-`VIS-STATUS-003`. This is the focused Product-
  baseline-impact architecture recovery round.
- Triggering finding IDs: `API-FIND-007` and `CR-FIND-011`. The approved behavior
  is `BEH-011` / `REQ-028` / `AC-023` / `SCN-012`, with supporting
  `ORG-CASE-056`-`ORG-CASE-058`.
- Prior authoritative design result: `AD-REV-006`, Architecture Design Complete,
  at commit `0d71c76ca52c1dab907b81b41702fa4e88fb7538`; independent Architecture
  Review `ARCH-REV-004` passed it at
  `2ae61a11f90cdf5e90786a6ff313af082a21cce8`. Current pre-gap Implementation
  `IR-009@d43042ce9` intentionally excludes REQ-028 while this upstream gate is
  open.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as `AD-REV-007` and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Why this revision is recorded: direct inspection of the original-personal
  implementation at `origin/personal@773bce779` confirms the user's assessment:
  the accepted Team hierarchy already has a
  five-state descendant-Agent aggregate and accessible Team status dot, while
  the AgentOrg Team row omits that aggregate and its Agent dots do not all
  reflect exact context status. AD-REV-007 extracts one pure shared normalizer/
  precedence fold, cleanly neutralizes the reusable Team aggregate dot, and
  adds a subject-shaped AgentOrg Team-branch adapter over the strict Org
  topology plus exact `AgentOrgExecutionContext` Agent status truth. The full
  configured and task-scoped Agent branch is folded before display/collapse
  filtering, so the Team signal remains reactive and visible while collapsed.
  Historical or terminal projection cannot retain `running` or `initializing`
  without live authority; missing, unknown, and empty inputs resolve to
  `offline`. This remains presentation-only and adds no Team root, status
  authority, persistence, transport, polling, lifecycle, stop, restore, focus,
  routing, readiness, command, or recipient-fallback behavior.
- Approved behavior or requirement IDs affected: `BEH-006`, `BEH-011`;
  `REQ-028`; `AC-023`; `SCN-012`; and `ORG-CASE-056`-`ORG-CASE-058`. The focused
  supplement supersedes only the previous mounted-Team status omission;
  RER-021 preserves every prior definition, durable, runtime, migration,
  handoff, launch/focus, and Product behavior.
- Design-spec sections updated: document status, chronology, classification,
  evidence, AD-REV-007 impact decision, behavior/Product mapping, scenario
  inventory, `DS-020`/`DS-021` spines, ownership and lifecycle boundaries,
  dependency and interface rules, shared projection structures, concrete file
  responsibilities, clean-cut renames/removals, sequencing, tradeoffs, risks,
  implementation guidance, and validation expectations.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` was updated from AD-REV-006 to
  AD-REV-007. It retains the prior 22 supported cases and adds `VAL-023`-
  `VAL-025` for active expanded Team aggregation including task descendants,
  collapsed branch-independent reactivity, and stopped/history terminal-state
  authority with no mounted-Team lifecycle. Requirements, Product, review,
  implementation, and API/E2E artifacts remain read-only.
- Downstream and architecture-review impact: the focused AD-REV-007 source
  correction alone is a bounded `Medium / Low` frontend projection/refactor,
  but the cumulative ticket remains `Large / High` because its previously
  reviewed domain, persistence, migration, lifecycle, API/stream, execution,
  and workspace boundaries remain part of the package. Independent Architecture
  Review is therefore mandatory before Implementation reconciles REQ-028 or
  API/E2E resumes API-FIND-007. Review must verify exact Team-branch membership,
  task-Agent inclusion, branch isolation, one shared precedence/a11y policy,
  collapse-independent derivation, truthful live-versus-history authority,
  exact Agent-signal coexistence, and absence of new backend/durable/transport/
  lifecycle ownership.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is independent Architecture Review of the
  cumulative `RER-021` / `RV-012` / focused Product status supplement /
  `AD-REV-007` package. Implementation and API/E2E must not claim
  API-FIND-007 resolved until that route passes and the reviewed design is
  reconciled in source.
- Remaining gaps or risks: no Requirement Gap, Product UI gap, or material open
  architecture decision remains after the 25-case self-validation. Focused
  residual risks are accidental visible-row-only folding, sibling/direct-Agent
  leakage, historical pulsing without live authority, duplicated precedence or
  localization, misuse of binary `TeamActivityDot`, and accidental mounted-Team
  lifecycle/transport expansion. The design contains explicit ownership,
  dependency, test, and forbidden-shortcut controls for each; no implementation
  or browser-fix claim is made by this architecture-only revision.

### AD-REV-008 — Non-Blocking Terminal Task Settlement And Interrupt-Before-Drain Shutdown

- Triggering role, report path, and round: Code Reviewer `CRR-012` first
  classified `API-FIND-008` as Unclear because the retained run showed a second
  provider tool start and a top-level shutdown AggregateError but did not prove
  MCP ingress, root-queue execution, persistence, or the close inner cause. Code
  Review `CRR-013` then passed cumulative `IR-012@73a2c06eb14e3c5a7d91322aae7f42dbc4de0e0a`
  while holding API/E2E for Architecture's disposition. API/E2E's first focused
  clean control proved one same-task revision/resubmission and application-owned
  SIGTERM can succeed. Its later exact two-task correlation at detached artifact
  `895665929213ddf7c276c9a89af19b975935f128` reproduced the failure with full
  boundary evidence in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/api-e2e-evidence/API-REV-002/followup-api-find008-settlement/settlement-correlation-observed-boundaries.md`.
  This is the architecture-held Unclear investigation and Design Impact recovery
  round.
- Triggering finding IDs: `API-FIND-008` / `CR-CAND-020`. The later evidence
  supersedes Architecture's interim clean-control `No Architecture Impact`
  disposition: an accepted verifier's settlement became root FIFO head and
  waited in `prepareTermination()` on its live `waitingOnApproval` provider
  turn; an unrelated analyst revision submission reached MCP and the exact root
  queue but never started; direct SIGTERM then waited in Team root shutdown
  because interruption occurred only after that task drain.
- Prior authoritative design result: `AD-REV-007`, Architecture Design Complete,
  at commit `53acd4a359d59762c7d0ecb6020c0e14a75666b2`; independent Architecture
  Review `ARCH-REV-005` passed it at `f366a3ce1`. The current source result is
  `IR-012`; Code Review `CRR-013` is Pass — cumulative source but explicitly
  holds validation on this architecture-owned disposition.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as `AD-REV-008` and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Why this revision is recorded: the shared root task FIFO currently owns both
  the durable `settledAt` mutation and provider-dependent execution preparation/
  teardown. The same Team/Org shutdown path drains task work before issuing the
  provider interrupt that could release it, creating a real ownership/dependency
  cycle and starving unrelated supported commands. AD-REV-008 splits one short
  task mutation FIFO from a root-owned, task-keyed terminal settlement
  coordinator; makes pre-durability settlement reservation passive; transfers
  the durably fenced exact handle to an idempotent committed cleanup token before
  releasing the FIFO; performs interrupt-first provider/backend/MCP/resource
  teardown outside that FIFO; deduplicates jobs and waits for child cleanup
  before parent cleanup; and makes both Team and Org close/freeze/interrupt their
  complete scope before command or settlement drains. Existing task records,
  statuses, `settledAt`, tools/results, notifications, Team V2/Org V1 schemas,
  sidecars, APIs and Product behavior remain unchanged.
- Approved behavior or requirement IDs affected: implementation/liveness path
  for `BEH-009`, `REQ-015`, and `AC-010`, plus the already-established normal
  Team/Org task lifecycle, fail-stop and graceful-shutdown contracts. No new
  intended behavior, Product UI decision, migration behavior, task recovery
  contract or support for self-review is introduced.
- Design-spec sections updated: document chronology, evidence, classification
  and AD-REV-008 impact decision; root-neutral task engine/settlement contract;
  scenario and behavior maps; `DS-005`, `DS-015`, and new `DS-022`; main owners,
  off-spine concerns, boundaries, dependencies, interfaces, file/folder mapping,
  clean-cut removals, sequence, tradeoffs, risks, implementation guidance and
  executable validation expectations.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` was updated from AD-REV-007 to
  AD-REV-008. It retains the prior 25 supported cases and adds `VAL-026`-
  `VAL-029` for concurrent terminal cleanup versus unrelated revision
  resubmission, Team/Org interrupt-before-drain shutdown, pre-/post-durability
  settlement failure boundaries, and recursive task-Team child/parent plus
  independent-leaf cleanup. It explicitly uses both the clean control and exact
  reproduced correlation; downstream source/API evidence remains read-only.
- Downstream and architecture-review impact: the focused correction is
  `Medium / High` because it is bounded to existing shared task/local-execution/
  root lifecycle files but changes concurrency, fail-stop, admission fencing and
  shutdown ordering. The cumulative ticket remains `Large / High`; independent
  Architecture Review is mandatory before Implementation changes this path or
  API/E2E resumes. Review must verify that no cleanup promise runs in the task
  mutation FIFO; passive reservation performs no irreversible work; terminal
  state/active-registry fencing precedes FIFO release; one task has at most one
  cleanup job; parent waits for child cleanup completion while independent leaves
  and commands progress; both roots interrupt before drains; and no timeout,
  replay, force-kill, new task state/schema/API or self-review support is added.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is independent Architecture Review of the
  cumulative `RER-021` / Product authorities / `AD-REV-008` package. Code Review
  source Pass does not bypass this new design-impact review, and API/E2E remains
  held until review passes and Implementation reconciles the reviewed design.
- Remaining gaps or risks: no Requirement Gap, Product UI gap, migration, schema
  or public-contract gap remains. High residual risk is in exact atomic
  tree/index/registry transfer, duplicate-job suppression, recursive child
  cleanup dependency, idempotent root-wide interrupt versus cleanup-token
  termination, pre-/post-durability failure handling, and shared Team/Org
  shutdown sequencing. These are specified and self-validated but require
  implementation, independent source review, and correlated executable
  validation; this architecture revision makes no fix claim.

### AD-REV-009 — Supported Quiescence Deferral And Interrupt-Before-Drain Shutdown

- Triggering role, report path, and round: Architecture Reviewer
  `ARCH-REV-006@2ad4bcc06` blocked AD-REV-008 under `AR-FIND-003` because the
  only complete long-stall witness used an unsupported verifier self-review and
  therefore could not establish a supported product premise for the proposed
  coordinator/token/dependency machinery. Canonical review inputs are
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md`
  and
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`.
  This is the architecture-review recovery and supported-reachability round.
- Triggering finding IDs: `AR-FIND-003`, with `AR-PREM-004` and `AR-PREM-005`
  Unclear. Retained downstream identifiers are `API-FIND-008` /
  `CR-CAND-020`; the finding introduces no Requirement Gap or Product UI gap.
- Prior authoritative design result: `AD-REV-007`, Architecture Design Complete,
  at commit `53acd4a359d59762c7d0ecb6020c0e14a75666b2`; independent Architecture
  Review `ARCH-REV-005` passed it at `f366a3ce1`. AD-REV-008 at `0bfe0b9da`
  remains recorded history but is blocked and not an approved implementation
  baseline.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as `AD-REV-009` and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Why this revision is recorded: source and retained traces establish two
  independently supported production paths. First, a normal task assignee's
  `submit_task_result` tool result returns before its canonical provider turn
  terminates, allowing a different authorized delegator to accept while that
  execution is temporarily non-quiescent. Second, with automatic tool approval
  disabled, a normal task Agent may wait on an approval-gated tool when the
  application receives supported SIGTERM. AD-REV-009 therefore adds one
  root-neutral `AgentRun.tryPrepareTerminationIfQuiescent` boundary: it
  atomically returns `null` without state change or waiting when input/provider
  work remains, or returns the existing prepared termination when quiescent.
  Team/Org task adapters defer and release the existing single FIFO on `null`;
  the existing idle/offline event resweeps. Recursive task-Team preparation is
  all-or-none. Team and Org roots close/freeze and interrupt their complete
  owned Agent scope before task drain. Existing FIFO, terminal sweep,
  `PreparedTaskSettlement`, `settledAt`, deepest-first ordering, durability,
  fail-stop, records, tools, APIs, schemas and Product behavior remain.
- Proportionality/removal decision: AD-REV-008's new
  `RootTaskSettlementCoordinator`, passive/committed token split, independent
  cleanup jobs, task-keyed deduplication and dependency graph are withdrawn.
  The invalid self-review run remains technical evidence of the current
  FIFO/prepareTermination coupling and negative coverage only; self-review,
  timeout, replay, force-kill, a persisted `settling` state and task recovery
  machinery remain rejected.
- Approved behavior or requirement IDs affected: implementation/liveness path
  for `BEH-009`, `REQ-015`, and `AC-010`, plus existing supported Team/Org task
  lifecycle, failure and graceful-shutdown behavior. No intended behavior,
  Product decision, migration behavior, durable contract, task state, tool
  result, API or support boundary changes.
- Design-spec sections updated: current-state chronology, classification,
  evidence, AD-REV-008 review disposition and AD-REV-009 decision, supported
  scenario classification, root-neutral task contract, `DS-005`, `DS-015`,
  `DS-022`, ownership/boundary/dependency/interface maps, target file
  responsibilities, clean-cut removals, sequencing, tradeoffs, risks,
  implementation guidance and executable validation expectations.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` was revised from AD-REV-008 to
  AD-REV-009. It retains all 29 cases while replacing VAL-026-VAL-029 with
  supported normal submit/independent-accept overlap, supported approval-wait
  application shutdown, existing prepared-settlement pre/post-durability
  failure, and recursive all-or-none quiescence/deepest-first settlement. The
  unsupported self-review witness is explicitly classified as
  `Unsupported/Contrived` and excluded from behavioral authority.
- Downstream and architecture-review impact: the focused correction is
  `Medium / High` because it is bounded to AgentRun input/lifecycle authority,
  shared task/local-registry adapters and Team/Org shutdown sequencing, but is
  material to concurrency, durability/fail-stop and process shutdown. The
  cumulative package remains `Large / High`; another independent Architecture
  Review is mandatory. Review must verify the supported traces/source path,
  atomic non-waiting quiescence check, no partial state on deferral, existing
  idle/offline retry, all-or-none recursive preparation, pre/post-durability
  failure boundary, interrupt-before-drain ordering for both roots, and removal
  of all AD-REV-008 coordinator/token/dependency machinery.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is independent Architecture Review of the
  cumulative `RER-021` / Product authorities / `AD-REV-009` package.
  Implementation and API/E2E remain held on the impacted path until review
  passes and the reviewed design is reconciled in source.
- Remaining gaps or risks: no Requirement Gap, Product UI gap, schema, migration
  or public-contract gap remains. Residual risk is concentrated in making the
  quiescence check atomic with Agent input admission, canceling recursive
  preparation completely on a later non-quiescent descendant, retaining one
  durable FIFO/sweep authority, guaranteeing idle-event retry, and interrupting
  every configured/mounted/task Agent before root task drain. These boundaries
  are specified and self-validated but still require independent Architecture
  Review, implementation, source review and correlated executable validation;
  this architecture-only revision claims no runtime fix.

### AD-REV-010 — AgentRun Root-Shutdown Admission And Provider-Start Fence

- Triggering role, report path, and round: Architecture Reviewer
  `ARCH-REV-007@6cec1ee1b` failed AD-REV-009 under `AR-FIND-004`. The reviewer
  accepted AD-REV-009's supported normal submit/independent-accept overlap,
  non-waiting prepared-or-null settlement, and interrupt-before-task-drain
  direction, but identified a supported gap before canonical `TURN_STARTED`.
  Canonical review inputs are
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md`
  and
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`.
  This is the architecture-review recovery round for the Agent input/provider-
  start shutdown race.
- Triggering finding IDs: `AR-FIND-004`, with retained downstream identifiers
  `API-FIND-008` / `CR-CAND-020`. `AR-FIND-003` is resolved. The finding
  introduces no Requirement Gap, Product UI gap, migration, schema, API, task-
  state, or provider-policy change.
- Prior authoritative design result: `AD-REV-009`, Architecture Design
  Complete, at commit `cd75bcdbfb97fd1707c5954db43dbbac65844da6`;
  independent Architecture Review `ARCH-REV-007` is `Fail — Design Impact` only
  for `AR-FIND-004`. `AD-REV-007` remains the latest fully passed cumulative
  design baseline until this revision passes another independent review.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as `AD-REV-010` and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Supported reachability and current-state evidence: normal task activation
  durably commits and asynchronously releases its initial input. Current
  `AgentRun.postUserMessage()` claims input under its dispatch queue, then calls
  provider dispatch after the queue closure; canonical `TURN_STARTED` can arrive
  later. Application SIGTERM is an established supported operational input. The
  current root wrapper can therefore call active-turn interruption in that
  interval, receive `NO_ACTIVE_TURN`, treat the phase as complete, and permit
  provider work to start afterward. Inspection of
  `origin/personal@773bce779` shows the same latent claim/start versus active-turn
  gap: prior tests covered already-active approval waits or mocked root
  interruption, but did not place a shutdown barrier between provider dispatch
  and `TURN_STARTED`. Its AgentRun FIFO-drain test also establishes that ordinary
  non-root termination must continue draining admitted input rather than adopt
  shutdown cancellation semantics.
- Why this revision is recorded: AD-REV-010 adds exactly one irreversible,
  idempotent, root-shutdown-only AgentRun boundary,
  `fenceInputAndInterruptForRootShutdown()`. The AgentRun dispatch owner orders
  input claim/provider-start registration and the fence. If the fence wins, a
  never-admitted reservation is invalidated without a lifecycle fact and an
  admitted but never-forwarded entry emits the existing
  `AGENT_RUN_TERMINATED_BEFORE_INPUT_FORWARD` cancellation exactly once; no
  backend call may follow. If provider start wins, AgentRun retains a tracked
  dispatch slot, arms shutdown intent, and resolves only after the existing
  canonical start/interrupt/failure/terminal path. Active turns and approval
  waits join the same existing interrupt result. The method neither invents a
  turn nor treats `NO_ACTIVE_TURN` as success while admitted/provider-start-
  pending work exists.
- Root composition and ownership decision: Team's existing operation/
  materialization gate and frozen local scope stabilize configured, task,
  prepared, and recursive task-Team handles. AgentOrg adds private equivalents
  that compose direct configured/task/prepared Agent handles with every mounted
  or root-task Team frozen scope without creating a generic root or mounted-Team
  lifecycle. Each Team/Org root closes external admission, drains only already-
  admitted handle/input-publication work needed for a stable scope, freezes that
  exact scope, completes every per-Agent fence, and only then drains task
  commands/settlement, persists interruption, performs existing deepest-first
  prepared-or-null cleanup, drains persistence, and unregisters. The frozen
  scopes own enumeration only; configured handles forward the capability;
  AgentRun alone owns admission, provider-start, turn, interrupt, and lifecycle
  facts.
- Proportionality and compatibility decision: ordinary
  `AgentRun.prepareTermination()` retains its FIFO-draining behavior, and
  `tryPrepareTerminationIfQuiescent()` retains AD-REV-009's non-waiting
  settlement behavior. A later prepared-settlement cancel cannot reopen a run
  whose root-shutdown latch is set. No coordinator, token, job, second queue,
  timeout, replay, force-kill, self-review support, persisted shutdown state,
  new task record/status, provider contract, schema, sidecar, API, Product or
  migration mechanism is introduced.
- Approved behavior or requirement IDs affected: implementation/liveness path
  for `BEH-009`, `REQ-015`, and `AC-010`, plus the established normal Team/Org
  task lifecycle and graceful application-shutdown behavior. Intended behavior,
  durable contracts, task tools/results, Product experience, and migration
  remain unchanged.
- Design-spec sections updated: document status and chronology; classification;
  evidence; supported shutdown scenario; AD-REV-010 AgentRun fence; root phase
  sequence; `DS-015` and `DS-022`; ownership, interface, dependency, file and
  removal maps; change sequence; tradeoffs; risks; implementation guidance; and
  deterministic validation expectations.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` was revised from AD-REV-009 to
  AD-REV-010. It retains the same 29 supported cases and expands `VAL-027` into
  two independent supported subcases: normal task activation with application
  SIGTERM before `TURN_STARTED`, and an already-active legitimate approval wait.
  It checks the exact Agent input-state dispositions, provider-start/fence
  ordering, stable recursive Team/Org scope, cancellation versus canonical
  terminal facts, no reopen, no post-fence provider call, and preservation of
  ordinary FIFO-draining termination. Requirements, Product, review,
  implementation, Code Review, and API/E2E artifacts remain read-only.
- Downstream and architecture-review impact: the focused AD-REV-010 correction
  is `Medium / High` because it is bounded to AgentRun admission/dispatch/
  interrupt state, root-neutral configured handles, frozen Team/Org scope and
  root shutdown phase ordering, while remaining material to concurrency,
  fail-stop and shutdown. The cumulative ticket remains `Large / High`;
  independent Architecture Review is mandatory. Review must verify that every
  configured/task/prepared/recursive AgentRun is in the stable scope, the same
  AgentRun owner serializes provider-start registration against the fence, each
  input state produces only an existing valid fact, no provider work starts
  after fence completion, task/settlement drain follows the fence, and ordinary
  termination behavior is unchanged.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is independent Architecture Review of the
  cumulative `RER-021` / Product authorities / `AD-REV-010` package.
  Implementation and API/E2E remain held on the impacted path until review
  passes and the reviewed design is reconciled in source.
- Remaining gaps or risks: no Requirement Gap, Product UI gap, schema, migration
  or public-contract gap remains. Residual risk is concentrated in atomic
  claim/provider-start/fence ordering, lifecycle-fact uniqueness, publication-
  gate completeness, immutable recursive scope enumeration, root-fence versus
  prepared-cancel interaction, and both Team/Org phase orderings. The design and
  29-case self-validation specify controls and executable witnesses, but this
  architecture-only revision claims no runtime fix, source validation, or
  delivery readiness.

### AD-REV-011 — One-FIFO Recursive Task-Team Validation Coherence

- Triggering role, report path, and round: Architecture Reviewer
  `ARCH-REV-008@a6f712265e57166469f68cce4d53083519d43dcf` reviewed cumulative
  AD-REV-010 and returned `Fail — Design Impact` only for `AR-FIND-005`.
  Canonical review inputs are
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md`
  and
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`.
  This is a narrow Architecture-artifact coherence recovery round.
- Triggering finding IDs: `AR-FIND-005`. The review independently verified
  `AR-FIND-004` resolved by AD-REV-010 and found no Requirement Gap, Product UI
  gap, or defect in the AD-REV-009/010 core design.
- Prior authoritative design result: `AD-REV-010`, Architecture Design Complete,
  at commit `820b6d02f13e96874f10bf78eda92b1e8327fa82`;
  `ARCH-REV-008` is `Fail — Design Impact` because the supplemental
  self-validation retained one contradictory sentence from withdrawn AD-REV-008.
  `AD-REV-007` remains the latest fully passed cumulative design baseline until
  this correction passes independent review.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as `AD-REV-011`; the corrected supplemental validation is
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Why this revision is recorded: VAL-006 previously said a recursive task-Team
  parent waited for child cleanup jobs while independent terminal leaves cleaned
  up concurrently outside the root mutation FIFO. That was AD-REV-008's
  withdrawn coordinator/job direction and contradicted the authoritative
  AD-REV-009/010 one-FIFO, prepared-or-null design, VAL-026, VAL-029, and DS-022.
  The statement could have caused Implementation to recreate a forbidden second
  settlement lane even though the core design rejected it.
- Exact correction: VAL-006 now states that the existing deepest-first terminal
  sweep selects an eligible leaf through the one
  `RootTaskLifecycleCommandQueue`. The exact local registry invokes
  `tryPrepareTerminationIfQuiescent()`. A `null` result returns deferred and
  releases the FIFO for the existing idle/offline-event retry. A quiescent leaf
  returns the existing prepared settlement, commits `settledAt`, and performs
  existing finish/unregister through the same serialized mutation path. A task-
  Team parent becomes eligible only after its children are durably settled. No
  independent cleanup job, second lane, concurrent task mutation path, token, or
  dependency graph exists.
- AD-REV-008 reference audit: every remaining AD-REV-008 reference in the
  current `design-spec.md` is historical or explicitly withdraws/rejects its
  coordinator/token/job/dependency/outside-FIFO direction. Every remaining
  reference in `architecture-design-self-validation.md` is an explicit
  withdrawal/rejection or historical explanation. The AD-REV-008 revision-record
  entry remains unchanged historical record as required; later AD-REV-009-011
  entries explicitly supersede its mechanism.
- Approved behavior or requirement IDs affected: architecture-description
  coherence for `BEH-009`, `REQ-015`, and `AC-010`, especially recursive task-
  Team lineage and deepest-first settlement. No intended behavior, lifecycle,
  durability, API, Product, migration, source, or validation-execution contract
  changes.
- Design-spec sections updated: document revision/status, current-state review
  chronology, classification delta, evidence/review table, cumulative artifact
  status, escalation/routing statements, and implementation sequencing only.
  AD-REV-009/010's mechanisms, ownership, interfaces, file responsibilities,
  state tables, root ordering, removal plan, and validation requirements remain
  unchanged.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` advances to AD-REV-011, rewrites only
  VAL-006's terminal path, records the negative AD-REV-008 reference audit, and
  preserves all 29 supported cases. No new supplement is created.
- Classification: focused AD-REV-011 is `Small / Low` because it changes only
  Architecture-owned documentation and introduces no implementation surface.
  The cumulative ticket remains `task_size=Large` and
  `architectural_risk=High` because its reviewed definition, persistence,
  migration, runtime, task, concurrency, API/stream, and frontend boundaries
  remain the downstream implementation/review package. The selected route
  remains independent Architecture Review.
- Downstream and architecture-review impact: another independent review is
  mandatory before Implementation reconciles the AD-REV-009/010 mechanism or
  API/E2E resumes. Re-review should verify VAL-006 agrees with DS-022 and
  VAL-026/029, all affirmative cleanup-job/concurrent-outside-FIFO language is
  gone, and no core design or production contract changed.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is another independent Architecture Review of
  cumulative `RER-021` / Product authorities / `AD-REV-011`. Implementation and
  API/E2E remain held until review passes and the reviewed mechanism is
  reconciled in source.
- Remaining gaps or risks: no Requirement Gap, Product UI gap, schema, migration,
  API, source-design, or public-contract gap remains. The focused documentation
  contradiction is resolved. Existing implementation risks remain those already
  stated by AD-REV-009/010: one-FIFO deferral/retry, exact lifecycle-fact
  uniqueness, complete frozen-scope enumeration, no post-fence provider start,
  prepared-cancel non-reopen, recursive deepest-first settlement, and Team/Org
  shutdown phase order. This revision claims no implementation or validation
  completion.

### AD-REV-012 — Established AgentTeam Launch-Hierarchy Reuse For AgentOrg

- Triggering role, report path, and round: Code Reviewer `CRR-021` returned
  `Fail — Product UI Baseline Impact / Design Impact` under `CR-FIND-020` after
  the user's explicit direction not to reinvent the AgentOrg launch experience.
  Requirements Engineering then completed approved Architecture-Ready
  `RER-023@c4f39b02e6b4bceb8219811e27491e2a66666396` with the explicitly
  user-approved focused Product package `AORG-TEAM-OVERRIDES-001` and
  `VIS-OVR-001`-`VIS-OVR-006`. Canonical inputs are
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`,
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/code-review-report.md`, and
  `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-TEAM-OVERRIDES-001/ui-ux-spec.md`.
- Triggering finding IDs: `CR-FIND-020`. `CR-FIND-019` remains an independent
  Implementation Local Fix and is carried into the later implementation/source-
  review package without an architecture redesign. No prior architecture
  finding is reopened.
- Prior authoritative design result: cumulative `AD-REV-011` at
  `31a19b592b27e9edb2ae9828a67ce7608a0b6314`, independently passed by
  `ARCH-REV-009@f9b7fff0d1673a5416038efb3956252f53ea4809`.
  Implementation was subsequently integrated through
  `IR-017@b2c96d6b0`. The current Code Review failure is limited to the newly
  approved launch-override presentation baseline.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as AD-REV-012 and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Current-state/root-cause evidence: production
  `AgentOrgRunConfigPanel -> AgentOrgPlacementOverrideRow` substantially follows
  superseded VIS-015: after opening the outer section it exposes every mounted
  Team's Agent children, leaves inherited state implicit, and fabricates an
  `EditableTeamFormAgentNode` even for a Team scope. The current
  `TeamRunConfigForm -> TeamMemberConfigTree -> TeamScopeConfigEditor ->
  MemberOverrideItem` files are byte-identical to `origin/personal@5fb16658e`
  and already own the accepted disclosure, Team fields, exact Agent rows,
  explicit state, coordinator-on-Agent identity, draft-preserving visibility,
  a11y and narrow behavior. The server/GraphQL Org placement input already has
  separate Team/Agent patches including Team `workspaceRootPath` and the server
  already resolves root -> Team -> Agent authoritatively.
- Why this revision is recorded: the correct solution is presentation reuse,
  not a new AgentOrg Team editor and not a generic Team/Org configuration
  system. AD-REV-012 keeps `agentOrgRunConfigStore` as the Org draft owner,
  splits its exact Team and Agent sparse maps, and adds one pure
  `projectEditableAgentOrgRunFormModel` that emits one real mounted-Team level
  into the existing Team presentation view models. It extracts the compact
  outer `MemberOverridesDisclosure` shell for both forms and routes Team/Agent
  typed edit events back to exact Org store commands and the unchanged Org
  GraphQL launch input. The old Team branch of
  `AgentOrgPlacementOverrideRow` is removed; the compact direct Org Agent row
  remains Agent-only.
- Exact behavior/state boundary: outer and each Team disclosure start collapsed;
  `N` counts exact configurable Agents only; Team `Inherited`/`Customized` and
  mounted-Team Agent `Inherited`/`Overridden` states depend only on their own
  patches while direct Org Agent behavior remains unchanged; Team reset retains
  child Agent patches;
  coordinator identity appears only on the exact Agent row; collapse changes
  visibility, not draft state; Team workspace maps through existing
  `workspaceRootPath`. Missing Team/member/coordinator/address correlation
  yields one exact blocking diagnostic and disabled Run—never silent omission,
  browser repair, or a launchable partial hierarchy.
- Approved behavior or requirement IDs affected: `BEH-012`, `REQ-029`,
  `AC-024`, `SCN-013`, `QR-009`, `DEC-016`, `ORG-CASE-059`-`ORG-CASE-061`,
  and `ORG-VERIFY-012`. RER-023 changes no configuration precedence, launch,
  focus, runtime, durable, handoff, status, migration, or lifecycle semantics.
- Design-spec sections updated: status/current-state/evidence/classification;
  AD-REV-012 reuse boundary and exact state rules; behavior/Product/scenario
  map; DS-023 primary/return/local spines; ownership, dependency, interface,
  reusable structure, file/folder, removal and compatibility maps; sequencing;
  tradeoffs; risks; and implementation/validation guidance.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` advances to AD-REV-012 and 30
  supported cases. New VAL-030 walks the normal draft/edit/collapse/reopen/launch
  path from route through Org store, strict projector, accepted Team components,
  exact command adapter, existing GraphQL and server resolver; it also validates
  reset/state/address/failure rules and forbidden cross-owner dependencies. No
  new supplement is created.
- Classification: focused AD-REV-012 is `Medium / Low` because it changes a
  bounded set of existing frontend store, projection, presentation and tests,
  while changing no server API/schema, stream, persistence, migration,
  concurrency, lifecycle, definition, or runtime owner. The cumulative ticket
  remains `task_size=Large` and `architectural_risk=High` because the full
  reviewed two-family/runtime/migration/task/frontend package remains the
  downstream implementation and validation scope. Independent Architecture
  Review remains selected.
- Downstream and architecture-review impact: review must verify that the reused
  components are presentation-only, the AgentOrg draft and serializer remain
  separate, the projector is complete-or-diagnostic, the superseded Team branch
  is removed, standalone Team behavior is preserved, and no backend or Product
  contract is invented. After review passes, Implementation may reconcile this
  correction together with its separate CR-FIND-019 Local Fix and return for the
  user-requested fresh full source review before cumulative API/E2E.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is independent Architecture Review of
  cumulative `RER-023`, all still-relevant Product authorities, AD-REV-012 and
  the updated self-validation. Implementation and API/E2E remain held on
  CR-FIND-020 until that review passes and source is reconciled.
- Remaining gaps or risks: no Requirement Gap, Product UI gap, server contract,
  durable, migration, or runtime architecture gap remains. Residual focused
  risks are cross-store/payload leakage, silent projection omission, lost sparse
  draft state on collapse/reset, workspace-field omission, and standalone Team
  regression. The design names explicit controls/tests; this architecture-only
  revision claims no implementation or executable validation completion.

### AD-REV-013 — Effective Launch Equality, Unified Workspace History, And Root Workspace Default

- Triggering role, report path, and round: the user exercised the delivered
  Electron build after `ARCH-REV-010` passed AD-REV-012 and supplied five
  screenshots showing runtime/model launch failure, route-induced left-panel
  replacement, and an empty fresh root/inherited Team Workspace. Requirements
  Engineering recorded the behavior-level clarification as approved
  `RER-024@d881d815a995af166074728c0e6a6431829ad52f`. Canonical inputs are
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`
  and
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`.
- Triggering finding IDs: `BEH-013`-`BEH-015`, `UC-015`-`UC-017`,
  `REQ-030`-`REQ-032`, `AC-025`-`AC-027`, `SCN-014`-`SCN-016`, `QR-010`, and
  `DEC-017`-`DEC-019`. This is Architecture-owned Design Impact, not a new
  Product gate. The already implemented `CR-FIND-019` behavior remains a
  separate regression obligation rather than part of this architecture delta.
- Prior authoritative design result: cumulative `AD-REV-012` at
  `f8c1f463885d339d62bddb46ae9767391bf99617`, independently passed by
  `ARCH-REV-010@3ddff04d7009b0db2414d43c896fc41e27822d45`.
- Downstream baseline inspected: current source
  `IR-026@3199ba081ad450be72fba239fe86e76c0c697a33` passed `CRR-032` and
  `API-REV-008`; `CRR-033` found no durable test-code change. `DR-003` had
  entered explicit Electron user verification when this new Design Impact was
  observed.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as AD-REV-013 and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Current-state/root-cause evidence: frontend `resolveOverrideLlmConfig` clears
  model config when runtime/model is explicitly changed, while
  `MemberOverrideItem` plus `AgentOrgRunConfigPanel.serializeOverride` can omit
  that clear; server `CollaborationLaunchConfigurationResolver` correctly treats
  omission as inherit and explicit null as clear. `AppLeftPanel` selects
  `AgentOrgRunHistoryPanel` by route and otherwise selects the established
  `WorkspaceAgentRunsTreePanel`, creating two history/navigation owners. The
  Team root passes `auto-select-default=true` to the shared Workspace selector
  while AgentOrg root explicitly passes false; mounted Team correctly has no
  independent default and therefore inherits the empty root.
- Why this revision is recorded: the earlier design specified presentation reuse
  but did not self-validate semantic equality across client patch/request/server
  resolution/snapshot, stable shell ownership across routes, or root workspace
  default parity. Requirements cannot and should not prescribe object-spread,
  component mounting, or default-selector internals; Architecture must make the
  production ownership and data-flow invariants explicit.
- Exact design correction: add one pure idempotent
  `canonicalizeAgentOrgPlacementLaunchPatch` and retain only canonical Team/
  Agent maps. Owned runtime/model plus absent config materializes
  `llmConfig:null`; ordinary absent fields still inherit. Complete root
  runtime/model/config edits go through Org-store root commands and always
  serialize owned config/null. Preview and existing GraphQL serialization
  consume those same root/placement states and the unchanged server resolver
  independently validates them. Always mount one `WorkspaceAgentRunsTreePanel`;
  combine the existing Workspace Agent/Team query with only the strictly parsed
  AgentOrg branch of the existing collaboration-root history query; group tagged
  Org roots under `Agent Orgs` directly below `Teams`; move Org hierarchy/status/
  root-action presentation into the unified workspace section; remove the Org
  command store's parallel history cache and delete the route-selected Org-only
  panel. Reuse the existing catalog-backed Team root workspace-default policy at
  the fresh AgentOrg root; one explicit new-launch draft epoch (not definition-ID
  inequality) owns untouched/defaulted/explicit selection provenance;
  descendants inherit root or exact supported Team override and never default
  independently.
- Ownership and boundary result: `agentOrgRunConfigStore` owns canonical Org
  draft intent; server resolver owns effective runtime authority; the mixed
  workspace-history read owner owns loading/strict projection/grouping/order;
  the always-mounted panel plus its one tree-state composable owns
  expansion/reveal/highlight/scroll continuity; subject stores retain exact
  lifecycle; workspace catalog owns available records; Org config store owns
  workspace selection; communication focus remains independent/null. No new
  generic Team/Org config, history runtime, or lifecycle owner is created.
- Persisted-data decision: `Not Affected`. Existing Team V2/Org V1 run packages,
  sidecars, history schemas, indexes, and migration remain directly usable.
  The launch patch is pre-create state and the history projection is derived.
  Removing `AgentOrgRunHistoryPanel` is a source clean cut, not data migration.
- Approved behavior or requirement IDs affected: `BEH-002`, `BEH-005`,
  `BEH-006`, `BEH-012`-`BEH-015`, `REQ-024`, `REQ-029`-`REQ-032`,
  `AC-019`, `AC-024`-`AC-027`, and `SCN-013`-`SCN-016`. AgentOrg remains
  coordinator-free, AgentTeam remains flat/coordinator-led, and launch remains
  full-scope/unfocused.
- Design-spec sections updated: document authority/current-state/evidence;
  classification/design health; AD-REV-013 solution and failure tables;
  behavior/Product/scenario maps; DS-024-026 primary/return/local spines;
  ownership, dependency, interface, subsystem, file/folder/removal maps;
  persisted-state decision; sequence, tradeoffs, risks and implementation/
  validation guidance.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` advances to AD-REV-013 and 33
  supported cases. VAL-031 proves client/request/server/snapshot configuration
  equality; VAL-032 proves one route-stable history surface with separate read
  and presentation-state owners plus category/action truth; VAL-033 proves
  actual available-default selection, inheritance,
  explicit override, absent-default failure and no-focus. No new supplement is
  created.
- Classification: focused AD-REV-013 is `Medium / High`. Source scope is bounded
  to frontend configuration/history/navigation and tests, with no API or
  persistence change. High reflects one cross-layer effective-launch invariant
  and consolidation of the shell-wide history ownership boundary. The cumulative
  ticket remains `task_size=Large` and `architectural_risk=High`; independent
  Architecture Review remains selected.
- Downstream and architecture-review impact: review must verify one canonical
  patch/no raw duality, unchanged server semantics, exact category order and
  subject action ownership, route-stable panel/state, clean deletion of the
  alternate panel, actual root-only default selection, exact inheritance, and no
  API/persistence/focus/lifecycle expansion. After review passes, Implementation
  reconciles AD-REV-013, preserves/revalidates the separate CR-FIND-019
  behavior, and returns through the configured full-source/API route.
- Next recipient or routing: dynamic handoff rules determine the exact recipient.
  Selected next action is independent Architecture Review of cumulative
  `RER-024`, still-relevant Product authorities, AD-REV-013, and the updated
  self-validation. Implementation/API-E2E remain held until review passes.
- Remaining gaps or risks: no Requirement Gap or Product UI gap remains. Focused
  risks are omission/null drift, a parallel raw patch, history-state loss during
  extraction, wrong category/root action dispatch, Org runtime-state duplication,
  synthesized/default-overwriting workspace selection, and standalone Team
  regression. The design names exact controls and tests; this architecture-only
  revision claims no implementation or executable validation completion.

### AD-REV-014 — Unified History Data Versus Presentation-State Ownership

- Triggering role, report path, and round: Architecture Reviewer
  `ARCH-REV-011@be0e2ea08210238eb6f618007392c5b4ca9d9830` reviewed cumulative
  AD-REV-013 and returned the sole `AR-FIND-006` Design Impact. The canonical
  report is
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-review-report.md`.
- Triggering finding IDs: `AR-FIND-006`, protecting `BEH-014`, `REQ-031`,
  `AC-026`, and `SCN-015`.
- Prior authoritative design result: AD-REV-013 at
  `7cfeecc277516cbe2355b4b1a97fb2bcf9fe0f08`; its independent review passed
  DS-024 effective launch equality and DS-026 Workspace default/inheritance but
  failed on contradictory DS-025 presentation-state ownership wording.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as AD-REV-014 and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Current-state/root-cause evidence: the actual panel already instantiates
  `useWorkspaceHistoryTreeState`, which owns expansion and ancestor-reveal
  state, while `runHistoryStore` supplies history rows/selection signals. The
  canonical DS-025 paragraph and terminology incorrectly said the mixed read
  model also owned expansion, selected-row presentation, and scroll; later
  ownership/validation sections correctly assigned those concerns to the
  mounted presentation boundary.
- Why this revision is recorded: grouping/order and presentation continuity are
  different state categories. Leaving both under a vague “unified history
  owner” would let implementation put route-stable UI state in the refreshed
  read store or create another controller, undermining the exact continuity
  required by REQ-031.
- Exact design correction: the mixed history read owner now owns only the two
  existing query loads, strict subject decoding, family-scoped result/error
  slices, stable row keys, Workspace grouping, and category/row order. The
  always-mounted `WorkspaceAgentRunsTreePanel` creates exactly one
  `useWorkspaceHistoryTreeState` instance, which owns expansion, ancestor
  reveal, and selected-row highlight continuity; the persistent panel scroll
  container owns scroll position. The existing selection store remains the
  authority for selected subject identity and is injected as a signal. Neither
  owner acquires subject runtime or lifecycle authority.
- Design-spec sections updated: AD-REV-014 current-state/classification note;
  canonical DS-025 narrative; terminology; spine and owner maps; boundary and
  dependency rules; focused file/folder responsibility tables; risk control;
  implementation guidance; and current evidence references.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` advances to AD-REV-014 without
  inventing a new use case. VAL-032 and its ownership/dependency audits now
  explicitly validate the same data-owner versus presentation-state-owner
  split across the existing 33 supported walkthroughs. No supplement is added
  or removed.
- Persisted-data and interface impact: `Not Affected`. No source mechanism,
  query, API, schema, migration, stream, runtime, lifecycle, focus, action set,
  or Product behavior changes. DS-024, DS-026, the exact two-query merge,
  category order, partial-family failure behavior, typed actions, Org cache/panel
  removal, and root-only default selection remain unchanged.
- Classification: focused AD-REV-014 is `Small / Low` because it is an
  Architecture-document-only ownership correction. The cumulative ticket
  remains `task_size=Large` and `architectural_risk=High`, so another independent
  Architecture Review remains selected.
- Downstream and architecture-review impact: review must verify that every
  current DS-025 statement assigns loading/projection/grouping/order only to the
  read owner and expansion/reveal/highlight/scroll only to the one mounted
  panel/tree-state owner. Implementation and API/E2E remain held until that
  review passes.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is independent Architecture Review of
  cumulative RER-024 / AD-REV-014 and the updated self-validation.
- Remaining gaps or risks: no Requirement Gap or Product UI gap remains. The
  focused ambiguity is resolved. Residual implementation risk is accidentally
  storing presentation state in the refreshing read model, instantiating a
  route-specific second tree controller, or changing selected subject identity
  while trying to preserve its row highlight. The design prohibits all three;
  this architecture-only revision claims no implementation or executable
  validation completion.

### AD-REV-015 — First Accepted AgentOrg Message History Summary

- Triggering role, report path, and round: the user compared the delivered
  AgentOrg Workspace history with the established AgentTeam behavior and showed
  that multiple active Org runs remained `New - <AgentOrg name>` after real
  external conversation. Requirements Engineering inspected the exact Team/Org
  paths and approved the parity boundary as
  `RER-025@58925d043b3d5d01dabb9cc111681541aa532a4b`. Canonical inputs are
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md`,
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`,
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md`,
  and the user screenshots referenced there.
- Triggering finding/behavior IDs: `BEH-016`, `UC-018`, `REQ-033`, `AC-028`,
  `SCN-017`, `QR-011`, and `DEC-020`. No Product gate or Product artifact change
  applies; the existing row and fallback remain the approved presentation.
- Prior authoritative design result: cumulative `AD-REV-014` at
  `eb03d3559a52e304e9b2cd6fe9b48507c44226c7`, independently passed by
  `ARCH-REV-012@613c38e19d8e42955be7d889205f72253491cdf5`.
- Current authoritative design result: `Architecture Design Complete` at
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md`,
  revised in place as AD-REV-015 and self-validated in
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-self-validation.md`.
- Current-state/root-cause evidence: established Team streaming records activity
  only after exact Agent command acceptance; `TeamRunHistoryCatalogService`
  imports shared `compactSummary` and serializes a first-non-empty atomic index
  mutation. The Org handler builds the same external user message and receives
  the same accepted result but never reaches an Org history mutation. The Org
  history index, mixed GraphQL projection, web decoder, and row already contain
  and render `summary`. The Org execution index also contains task Agents, so
  simply copying the Team handler without observing the returned execution kind
  would wrongly let task-scoped traffic seed the summary; rejecting such traffic
  would also violate the unchanged command-admission boundary. The web ACK path currently performs no
  authoritative history refresh.
- Why this revision is recorded: the visible parity defect is not a label-only
  UI patch. It requires one coherent production spine from exact configured
  command admission through serialized derived persistence and authoritative
  live read, plus a forward-only, conservative transition for current empty Org
  rows. Without explicit ownership and exclusions, implementation could title
  the Org from task/inter-Agent traffic, choose a race by socket order, or add a
  second optimistic browser authority.
- Exact design correction: DS-027 routes only external `SEND_MESSAGE` through a
  new internal `AgentOrgRun.executeAgentCommandWithExecutionKind` outcome. It
  preserves the existing direct/mounted/task command path and returns its exact
  indexed kind. After a direct or mounted configured Agent returns `accepted`, the handler immediately calls
  `AgentOrgRunService.recordRunActivity`; the Org history catalog serializes the
  attempt and invokes one stateless `AgentOrgRunHistorySummaryWriter` that
  compacts with the existing Team helper, atomically writes the first non-empty
  value, and strictly rereads the index.
  The accepted ACK then invokes an injected notification that asks the existing
  mixed history read owner for a network-only AgentOrg-family refresh. Full and
  focused history reads share one monotonic family request generation, so stale
  responses cannot overwrite the durable winner. No submitted prompt is
  optimistically written in the browser.
- Historical transition: add registered startup-only
  `20260905_agent_org_history_first_message_summary_v1` after the current
  AgentOrg-family and raw-trace-layout migrations. It preserves non-empty rows
  before trace reads; for an empty row it enumerates only configured Agents from
  the strict Org V1 tree, derives exact direct/mounted physical locations, reads
  complete archived-plus-active trace corpora, and writes only when one
  provenance-qualified candidate has a strictly earliest finite timestamp. Root
  communication/task records serve only as negative evidence against their
  deterministic nonqualifying envelopes; they never prove external origin or
  justify promoting a later trace. Equal earliest, nonqualifying earliest,
  absent, invalid, ambiguous, or unreadable required evidence produces the bounded
  `SKIPPED_NO_UNIQUE_QUALIFYING_TRACE` warning and retains the valid empty
  summary/fallback. It invokes the same stateless summary writer used by the
  normal catalog, before the supervisor/catalog is constructed, validates by
  strict reread, follows ordinary runner restart/idempotence, logs no message
  content, and is never imported by normal runtime/history reads.
- Ownership and boundary result: AgentOrgRun owns unchanged exact command admission/handle delegation and returns
  indexed kind/liveness; the stream handler owns command/result ordering;
  AgentOrgRunService is the application facade; the Org history catalog alone
  owns normal-runtime sequencing/current rows; the shared stateless writer owns
  compaction/first-write durability and strict reread; the mixed web history owner
  alone owns authoritative refresh/response ordering; the registered migration
  alone owns legacy trace inference. Production composition injects the
  supervisor's existing Org service through the WebSocket route; startup
  migration invokes the stateless writer before supervisor construction. No
  second manager/catalog is constructed.
- Persisted-data/interface impact: `Migration Required — derived metadata,
  schema unchanged`. The current AgentOrg history index shape is reused. No
  AgentOrg V1 tree, task/message/trace sidecar, GraphQL field, WebSocket DTO,
  command result, focus, routing, lifecycle, mounted-Team root, or Team history
  contract changes. Existing non-empty Org and every Team row/package are
  preserved.
- Approved behavior/requirement IDs affected: `BEH-005`, `BEH-006`, `BEH-016`,
  `REQ-016`, `REQ-025`, `REQ-033`, `AC-028`, `SCN-017`, `QR-011`, and
  `DEC-020`; all RER-024 behavior remains unchanged.
- Design-spec sections updated: document authority/current state and evidence;
  focused classification; DS-027 canonical live/read/recovery decision;
  behavior/scenario/spine maps; terminology; persisted-data transition;
  ownership, dependency and interfaces; focused file responsibilities;
  sequence, risks, removals and implementation guidance.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` advances to AD-REV-015 and 37 cases.
  VAL-034 covers direct configured acceptance/normalization/live projection;
  VAL-035 covers mounted configured symmetry and every exclusion; VAL-036 covers
  first-accept concurrency, durable restart/rebuild stability and stale web
  responses; VAL-037 covers unique/ambiguous legacy recovery and ordinary runner
  retry. No new supplement is created.
- Classification: focused AD-REV-015 is `Medium / High`. The visible component
  already exists, but implementation crosses the Org WebSocket command boundary,
  strict configured/task execution identity, serialized persisted history,
  cross-process live invalidation, and one registered migration over current
  packages/traces. High is due to first-writer concurrency and persisted-data
  inference, not UI/content volume. The cumulative ticket remains
  `task_size=Large` and `architectural_risk=High`; independent Architecture
  Review remains selected.
- Downstream and architecture-review impact: review must verify unchanged task/direct/mounted command admission plus exact
  direct/mounted configured summary eligibility and exhaustive exclusions, accepted-result
  ordering, one catalog authority, truthful ACK/error behavior, newest-generation
  authoritative refresh, no optimistic browser state, current-value preservation,
  unique-earliest migration classification, convention-compliant restart/
  warnings, and no schema/Team/runtime-inference leakage. Implementation and
  API/E2E remain held until that review passes.
- Next recipient or routing: dynamic handoff rules determine the exact recipient.
  Selected next action is independent Architecture Review of cumulative
  RER-025 / AD-REV-015 and the updated self-validation.
- Remaining gaps or risks: no Requirement Gap or Product UI gap remains. Residual
  risks are accidental task/inter-Agent qualification, concurrency-order drift,
  accepted Agent input being mislabeled by derived-index failure, stale web
  response overwrite, fabricated legacy chronology, migration-code leakage, or
  rewriting existing summaries/Team history. The design names exact controls and
  tests; this architecture-only revision claims no implementation or executable
  validation completion.

### AD-REV-016 — Migration-Specific Terminal Status Authority

- Triggering role, report path, and round: Architecture Reviewer
  `ARCH-REV-013@d9baab112` reviewed cumulative
  `AD-REV-015@9344e4ae8f16bf7571394bdcbab3a238bd6213d8` against approved
  `RER-025@58925d043b3d5d01dabb9cc111681541aa532a4b` and returned
  `Fail — Design Impact` for one Architecture-owned terminal-status wording
  contradiction.
- Triggering finding/behavior IDs: `AR-FIND-007`; protected `BEH-016`,
  `REQ-033`, `AC-028`, and `DEC-020`. No Requirement Gap or Product UI gap.
- Prior authoritative design/review result: AD-REV-015 defines the accepted
  configured-message first-write, authoritative web refresh, and conservative
  startup recovery. ARCH-REV-013 passed those mechanisms and found only that a
  combined convention table applied incompatible status prose to two migration
  IDs.
- Current authoritative design result: `Architecture Design Complete` at the
  canonical `design-spec.md`, revised in place as AD-REV-016 and self-validated
  in `architecture-design-self-validation.md`.
- Exact correction: the Production Migration Convention Application is split
  by migration ID. `20260901_agent_org_flat_team_families_v1` succeeds only
  when every supported item is current and required cleanup completes; it has
  no `SUCCEEDED_WITH_WARNINGS` state, and unsupported source, invalid target,
  family conflict, or cleanup residue remains `FAILED`.
  `20260905_agent_org_history_first_message_summary_v1` separately treats
  `SKIPPED_NO_UNIQUE_QUALIFYING_TRACE` as a bounded nonfatal item because the
  empty current summary and `New - <name>` fallback are independently valid;
  when present without a failed item it yields `SUCCEEDED_WITH_WARNINGS`.
  Required current package/index read or validation failure and selected-value
  atomic write/strict-reread failure remain `FAILED`, which takes precedence
  over warning skips. All-success and ordinary-skip-only attempts are
  `SUCCEEDED`.
- Transition/outcome alignment: the migration outcome table now identifies the
  owning migration for every disposition and states the terminal reduction
  order separately for each migration. DS-027, the AD-REV-015 transition, and
  VAL-037 use that same matrix. No warning rule crosses migration ownership.
- Current-source traceability correction: current downstream navigation now
  identifies `IR-028` source `4d378df9cba56bd1b9ebf20d9b055f964398f642`,
  artifact `100e2c82cb948e1cbef4026ab6f74ab815285a34`, `CRR-036`,
  `API-REV-010`, `CRR-037`, and latest Delivery evidence `DR-004`; older
  IR-026/DR-003 references remain only where they describe the historical
  discovery sequence.
- Design-spec sections updated: document status/current downstream navigation;
  focused classification; ARCH-REV-013 investigation evidence; explicit
  AD-REV-016 reconciliation; migration-specific convention tables; disposition
  and terminal-result table; supplemental-artifact navigation; validation and
  implementation guidance.
- Architecture supplements updated, added, or removed:
  `architecture-design-self-validation.md` advances to AD-REV-016 without a new
  supported use case. VAL-037 now validates the two migration-specific terminal
  matrices and failed-over-warning precedence. No supplement is added or
  removed.
- Persisted-data/interface impact: no change from AD-REV-015. The summary
  transition remains `Migration Required — derived metadata, schema unchanged`;
  the family transition remains its previously approved registered migration.
  No source mechanism, API, schema, durable field, runner state, retry path,
  lifecycle, Product surface, or current-reader fallback is added.
- Classification: focused AD-REV-016 is `Small / Low` because it is an
  Architecture-document coherence and traceability correction only. The
  cumulative package remains `task_size=Large` and
  `architectural_risk=High`, so independent Architecture Review remains
  mandatory.
- Downstream and architecture-review impact: Implementation and API/E2E remain
  held until independent review confirms one status authority per migration ID,
  the family migration's no-warning cleanup/unsupported-source contract, the
  summary migration's bounded valid-empty warning, and `FAILED` precedence for
  required current-structure or selected-value persistence failure. No source
  reconciliation is authorized from this document-only correction before that
  pass.
- Next recipient or routing: dynamic handoff rules determine the exact
  recipient. Selected next action is independent Architecture Review of
  cumulative RER-025 / AD-REV-016 and the updated self-validation.
- Remaining gaps or risks: no Requirement Gap, Product UI gap, or architecture
  mechanism question remains. Residual risk is only an implementer collapsing
  the two migration result policies back into one ambiguous rule; the design
  now forbids that explicitly. This architecture-only revision claims no
  implementation or executable validation completion.
