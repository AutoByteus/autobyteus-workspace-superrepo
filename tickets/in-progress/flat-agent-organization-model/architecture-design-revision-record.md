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
