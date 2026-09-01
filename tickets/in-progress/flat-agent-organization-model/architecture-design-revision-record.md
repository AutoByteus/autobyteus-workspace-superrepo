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
