# Requirements Document

## Document Status

- Status: `Ready for Approval`
- Current requirements revision ID: `RER-003`
- Request / ticket: `AORG-FLAT-TEAM-001`
- Requirements owner: Requirements Engineer
- Date: 2026-08-31
- Approval state and reference: Not yet approved; `RER-003` is presented for explicit user approval and includes the earlier baselines.

## Problem And Desired Outcome

- Problem: `AgentTeam` currently represents both an ordinary working Team and an arbitrarily recursive organization container. The overlap makes authoring, execution, persistence, handoffs, APIs, and UI harder to understand and maintain.
- Affected actors or systems: Package authors, users launching or inspecting collaborative work, Team-bound Agents, definition and execution services, persistence/history/memory, collaboration and task contracts, GraphQL/stream contracts, and the web client.
- Desired outcome: Introduce one distinct `AgentOrg` composition root containing independent Agents and flat, coordinator-led Teams. Each Team contains Agents only. Organization-scoped handoffs connect peer Teams and independent Agents without persistent Team-within-Team nesting.
- Observable success: The Software Development Department and Northstar structures remain representable with the same effective members, Team ingress, canonical destinations, and workflows, while new Team definitions cannot contain Teams.

The governing principle is: **containment expresses stable membership; handoff rules express workflow.** “Flat” does not mean unrestricted all-to-all communication.

## Relevant Current And Desired Behavior

| Behavior ID | Kind | Evidence-Backed Current Behavior | Desired Behavior | Intentionally Preserved Behavior | Investigation Evidence |
| --- | --- | --- | --- | --- | --- |
| BEH-001 | Contract | One AgentTeam definition may contain Agents or AgentTeams recursively. | `AgentOrg` is the only persistent multi-Team composition root; a Team contains Agents only. | Team names, instructions, ownership scopes, Agent refs, and direct Agent coordinators remain available. | Domain model, graph resolver/validator, package inventory. |
| BEH-002 | System | A launch resolves a recursive Team graph into one root TeamRun and child TeamRuns. | One AgentOrg launch owns one collaboration/address/lifecycle scope containing direct independent Agent executions and direct flat-Team executions. | Exact mounted placement identity, immutable run snapshots, launch validation, events, stop, and restore remain. | Topology planner, execution-tree model, runtime docs. |
| BEH-003 | Contract | Handoffs compile across a recursive root topology; `recipient_address` resolves only within that active root run. | AgentOrg-scoped handoffs connect any mounted source Agent to an Agent or Team destination in the same Org. | Rooted canonical addresses, Agent-only handoff sources, ordered rules, and failure-closed resolution remain. | Handoff compiler, context builder, dispatcher, recipient resolver. |
| BEH-004 | Contract | Every AgentTeam, including an organization-like root, requires one direct Agent coordinator. | Every flat Team remains coordinator-led; AgentOrg has no coordinator. A caller selects an exact Agent or Team entry target. | Targeting a Team still routes through its direct Agent coordinator. | Current resolver plus imported concept branch. |
| BEH-005 | System | Definition, run, memory, event, history, and frontend contracts preserve recursive configured Team topology. | Persistent configured composition has fixed depth: Org → Team → Agent, with optional independent Agents directly under Org. | Supported content, task results, memory, run identity, and history are preserved when conversion is unambiguous. | Source inventory and 41 stored run trees. |
| BEH-006 | User | Agent Teams UI authors and displays recursively nested Team membership. | Product/API surfaces distinguish AgentOrg from flat Team and prevent unsupported deeper composition. | Standalone flat Teams remain directly definable and launchable. | Web docs/components and existing packages. |
| BEH-007 | Operational | Of 23 inspected root packages, three are organization-like; of 41 stored run trees, 14 have one configured child-Team level. None is deeper. | Safe observed organization-like definitions/runs can transition to AgentOrg without arbitrary flattening. | Existing Software Development Department, Northstar, and standalone Team workflows remain representable. | Local package and stored-data inventories. |
| BEH-008 | Durable contract | `team_run_execution_tree.json` schema V2 requires `rootTeam`, a direct root coordinator, and recursive configured Team members. | Native AgentOrg execution is represented by an Org-root durable contract; unchanged V2 is not relabeled as AgentOrg. | V2 may remain a standalone flat-Team and/or legacy-read contract if architecture selects that transition. | Execution-tree domain, strict schema, builder, stream DTO. |
| BEH-009 | System | Task delegation may create task-scoped Team executions that are structurally nested under the delegating run. | Removing configured Team-within-Team membership does not by itself remove task-scoped delegation to a flat Team. | Supported task creation, settlement, review, and history behavior remain. | Task execution models and imported branch analysis. |

## Stakeholders, Actors, And Outcomes

| Actor / Stakeholder | Required Outcome | Important Constraint |
| --- | --- | --- |
| Package author | Compose one Org from independent Agents and reusable flat Teams | Invalid deeper membership fails clearly and never silently flattens. |
| End user / caller | Launch an Org, select an exact entry Agent or Team, and inspect/restore work | AgentOrg is not given a synthetic coordinator. |
| Org-bound Agent | Use explicit handoffs to reach peers and Teams deterministically | Logical addresses never discover unrelated runs. |
| Existing-data owner | Upgrade the known zero/one-level data without silent identity, content, memory, task, or history loss | Migration may assume there is no deeper configured topology in the relevant existing-data population. |

## Scope Guardrail (Mandatory)

### In-Scope Use Cases

- `UC-001`: Define and launch one AgentOrg whose direct members are independent Agents and flat Teams.
- `UC-002`: Define, reuse, and independently launch a flat Team containing Agents only and one direct Agent coordinator.
- `UC-003`: Select an exact mounted Agent or Team as the initial Org interaction target; an Org has no coordinator recipient.
- `UC-004`: Address `/agent`, `/team`, and `/team/agent` inside one Org scope and use explicit cross-Team handoffs.
- `UC-005`: Reject Team-in-Team and Org-in-Org configured composition through every supported definition boundary.
- `UC-006`: Convert observed Software Development Department and Northstar organization-like definitions/runs into the new model.
- `UC-007`: Transition the established migration population, which contains only flat roots or one level of flat child Teams.
- `UC-008`: Update affected API, durable execution, history, and UI contracts so Org and Team semantics are truthful.
- `UC-009`: Preserve supported task-scoped delegation to a flat Team as distinct from configured nesting.

### Out Of Scope

- Nested AgentOrg, Team-in-Team configured membership, or arbitrary department runtime hierarchy.
- Shared Agent runtime instances mounted in multiple placements.
- Implicit cross-process or unrelated-run routing by logical address.
- Live membership mutation, automatic file watching, or dynamic topology changes.
- A new workflow engine or framework evaluation of natural-language handoff conditions.
- Redesign of task submission/review semantics unrelated to the composition boundary.
- A Product Design prototype; no such request was made.

### Non-Goals

- Adding AgentOrg while retaining recursive AgentTeam composition as an equally supported model.
- Flattening every Agent into one undifferentiated Team and losing Team instructions, coordinator ingress, ownership, or launch scope.
- Renaming the current recursive root Team while keeping its mandatory coordinator and recursion invariants.
- Removing task-scoped Team execution solely because configured Teams become flat.

### Preserved Behavior Boundary

- Preserve canonical rooted addresses, exact mounted placement identity, Team-to-coordinator ingress, Agent-only handoff sources, and same-scope resolution.
- Preserve independently launchable flat Teams and supported Team lifecycle/task behavior.
- Preserve the effective workflows of inspected organization-like packages.
- Preserve content, memory, tasks, and history while transitioning the established zero/one-level migration cohorts.

### Review Authority

- Every blocking downstream `Design Impact` or correction must cite an approved requirement, acceptance criterion, or preserved-behavior ID.
- A proposed new product behavior, compatibility promise, migration obligation, or operational policy is a `Requirement Gap` and requires explicit user approval.
- Downstream comments do not amend this package; a scope-changing revision returns to Requirements Engineering and user approval.

## Requirements

| Requirement ID | Requirement | Related Behaviors | Priority | Source / Rationale |
| --- | --- | --- | --- | --- |
| REQ-001 | The product MUST expose `AgentOrg` as the sole persistent composition root that may directly contain independent Agents and flat Teams. | BEH-001, BEH-006 | Critical | User direction; separates organization from Team. |
| REQ-002 | A configured Team MUST contain Agents only and MUST NOT contain a Team or AgentOrg. | BEH-001, BEH-007 | Critical | User direction; removes recursive Team composition. |
| REQ-003 | Every flat Team MUST identify exactly one direct Agent coordinator; targeting the Team MUST deliver through that coordinator. | BEH-004 | Critical | Preserves Team accountability and ingress. |
| REQ-004 | AgentOrg MUST NOT require or invent an Organization coordinator. On launch or interaction, the caller MUST select an exact mounted Agent or Team target; a selected Team uses its Team coordinator. | BEH-004 | Critical | Integrated remote concept; avoids synthetic root Team semantics. |
| REQ-005 | One AgentOrg run MUST own one logical collaboration/address/lifecycle scope whose persistent member addresses are `/agent`, `/team`, and `/team/agent`; `/` is structural and not a recipient. | BEH-002, BEH-003 | Critical | Reuses current simple same-root routing boundary. |
| REQ-006 | AgentOrg-scoped handoffs MUST support a mounted Agent source and a mounted Agent or Team destination, including cross-Team destinations. Team-local handoffs MUST remain scoped to that Team and may be rebased once when mounted. | BEH-003 | Critical | Handoffs connect peer Teams without structural nesting. |
| REQ-007 | Logical `recipient_address` resolution MUST remain within the caller's active AgentOrg or standalone Team scope and MUST fail closed for malformed, root-only, unknown, deeper, or out-of-scope addresses. | BEH-003 | Critical | Prevents accidental global/cross-run routing. |
| REQ-008 | Definition, import/sync, create/update, and launch validation MUST reject Team-in-Team and Org-in-Org input before partial persistence or activation and identify the offending placement. | BEH-001, BEH-006 | High | Makes fixed depth enforceable. |
| REQ-009 | The Software Development Department MUST remain representable as one AgentOrg with direct `requirements_engineer`, `product_design_prototyping_team`, and `software_engineering_team` members and equivalent effective handoffs. | BEH-007 | Critical | User-supplied primary example. |
| REQ-010 | Northstar Operating Company MUST remain representable as one AgentOrg with its independent executive Agents, six direct flat Teams, and equivalent effective handoffs. | BEH-007 | High | Largest inspected real organization example. |
| REQ-011 | Standalone flat Teams MUST remain directly definable, reusable in an AgentOrg, and independently launchable. | BEH-006 | High | Preserves ordinary Team use cases. |
| REQ-012 | Migration MUST treat the relevant existing-data population as two exhaustive configured-topology cohorts: root Teams with direct Agents only remain standalone flat Teams; roots with direct Agents and exactly one level of flat child Teams convert to AgentOrg while preserving identities, coordinators, addresses, handoffs, content, tasks, memory, and history. | BEH-005, BEH-007 | Critical | Repository/data investigation plus explicit user confirmation establish that no deeper configured data exists. |
| REQ-013 | Migration MUST NOT implement a legacy deeply nested conversion or compatibility path. After transition, any deeper configured topology newly presented through import/load/update MUST be rejected by the flat-model validation contract before mutation or activation. | BEH-001, BEH-007 | High | Keeps the migration and permanent product model simple under the approved data assumption. |
| REQ-014 | Native AgentOrg durable execution state MUST use an Org-root semantic contract that distinguishes Org identity/run, direct independent Agents, direct flat Teams, selected interaction target where persisted, and Org-scoped handoffs. Unchanged TeamRun V2 MUST NOT be relabeled as AgentOrg. | BEH-008 | Critical | Current JSON requires `rootTeam`, root coordinator, and recursion. |
| REQ-015 | A task Team created by an AgentOrg member MUST be a fresh task-scoped Team execution owned within that AgentOrg run and anchored to the exact delegating host scope. It MUST NOT become a configured Org member or configured child Team. Task delegation from a standalone Team remains owned by that standalone Team run. | BEH-009 | High | Task runtime ownership belongs under the active root scope, while configured membership stays flat. |
| REQ-016 | Affected GraphQL/transport, catalog/detail/launch/history, authoring, and workspace surfaces MUST distinguish AgentOrg from flat Team and MUST stop advertising or accepting configured Team members inside a Team. | BEH-006, BEH-008 | High | Product and external contracts must be truthful. |
| REQ-017 | Concurrent work MUST NOT introduce new recursive configured-Team mutation dependencies. Any future dynamic membership capability requires a separate approved contract and may operate only within the approved Org-direct-member or Team-direct-Agent boundaries. | BEH-001 | High | Reconciles the conflicting draft dynamic-Team branch. |

## Acceptance Criteria

| AC ID | Related Requirements | Trigger | Observable Expected Outcome | Important Failure / Alternate Outcome |
| --- | --- | --- | --- | --- |
| AC-001 | REQ-001–REQ-003 | Author an Org with one independent Agent and two flat Teams | Definition is valid; each Team contains Agents only and has one direct Agent coordinator | A Team containing a Team/Org is rejected before persistence. |
| AC-002 | REQ-004 | Launch or open an Org | The caller can select an exact Agent or Team; Team selection routes through its coordinator | No Org coordinator, first-member, name, or synthetic fallback is created. |
| AC-003 | REQ-005–REQ-007 | An Org-bound Agent uses collaboration tools | `/agent`, `/team`, and `/team/agent` resolve exactly in the active Org; `/team` targets its coordinator | `/`, malformed/deeper/unknown/out-of-scope destinations fail closed. |
| AC-004 | REQ-006, REQ-009 | Convert and run Software Development Department | Existing Requirements ↔ Product Design/Engineering/Delivery workflow reaches the same effective recipients | No Team-inside-Team definition is required. |
| AC-005 | REQ-002, REQ-008 | Import/edit a Team containing `refType=agent_team` or Org | The operation identifies the invalid member and performs no partial save/activation | It does not silently flatten or mount the member elsewhere. |
| AC-006 | REQ-010 | Represent and run Northstar under the fixed-depth model | All direct executives, six Teams, and current cross-Team destinations fit addresses no deeper than `/team/agent` | Unsupported later deeper input follows AC-005 validation rather than migration compatibility. |
| AC-007 | REQ-011 | Define and launch a flat Team without an Org, then reuse it in an Org | Standalone coordinator-led collaboration works; the same definition can be mounted as a direct Org Team | Org membership is not mandatory for ordinary Team work. |
| AC-008 | REQ-012, REQ-013 | Transition the complete relevant definition/run population | Every record classifies as either a flat standalone Team or a one-level organization-like root; the former remains a Team and the latter converts to AgentOrg with preserved supported state | The migration reports an invariant violation rather than guessing if deeper configured topology is unexpectedly encountered; no deeply nested legacy compatibility path is required. |
| AC-009 | REQ-014 | Persist and restore a native AgentOrg run | Durable state identifies an Org root, no Org coordinator, direct member kinds, exact fixed-depth addresses, and the stored run snapshot | Strict validation rejects recursive configured Team nodes or a Team-root alias masquerading as Org. |
| AC-010 | REQ-015 | An Org member delegates a task to a flat Team | A fresh task TeamRun starts through that Team's coordinator, is recorded under the same AgentOrg execution aggregate at the delegating host scope, and settles/reports under supported task semantics | It is not added to the Org definition/member list and receives no new permanent Org member address. A task delegated from a standalone Team remains under that Team run. |
| AC-011 | REQ-016 | Use affected API and web authoring/launch/history flows | Org and Team roles are distinguishable; Team authoring offers Agent members only; existing flat-Team flows remain usable | Nested-Team selectors/counts/warnings are absent from flat-Team authoring. |
| AC-012 | REQ-017 | Reconcile the dynamic-AgentTeam draft work | No new production path can add/remove a configured Team beneath a Team | Reusable dynamic ideas, if any, require a separately approved fixed-depth contract. |

## Relevant Scenarios And Journeys

| Scenario ID | Kind | Starting Condition / Sequence | Expected Outcome | Related IDs |
| --- | --- | --- | --- | --- |
| SCN-001 | Contract | Define Org members and Org-scoped handoffs; validate | One fixed-depth Org definition is accepted | REQ-001–REQ-008; AC-001–AC-003 |
| SCN-002 | System | Launch Org; caller selects Agent/Team; persist/restore | One Org-owned scope retains exact identities without an Org coordinator | REQ-004, REQ-005, REQ-014; AC-002, AC-009 |
| SCN-003 | Contract | An applicable Agent handoff targets a peer Team | Destination resolves in the same Org and reaches Team coordinator | REQ-003, REQ-006, REQ-007; AC-003 |
| SCN-004 | Operational | Upgrade/open the exhaustive flat-root and one-level-org cohorts | Preserve the former as Teams and convert the latter to AgentOrg | REQ-012, REQ-013; AC-008 |
| SCN-005 | User | Launch a standalone Team and delegate work to a Team | Flat Team and task-scoped execution remain usable | REQ-011, REQ-015; AC-007, AC-010 |

## UI, Interaction, And Experience Requirements

- Applicable: `Yes`; current authoring, launch, detail, workspace, and history surfaces expose recursive Teams.
- Product Design & Prototyping request: `N/A — user did not request a prototype or separate design pass`.
- User-supplied screenshot: current-state evidence only, not an approved future visual reference.
- Normative interaction outcomes: distinguish Org from Team; let a caller choose an exact Agent or Team entry target; prevent Team-within-Team authoring; display fixed-depth run/history truthfully; provide actionable invalid/migration feedback.
- Exact terminology, layout, component structure, and styling remain implementation/design choices so long as the above outcomes are met.

## Quality And Non-Functional Requirements

| Quality ID | Area | Requirement | Verification Intent |
| --- | --- | --- | --- |
| QR-001 | Reliability | Invalid membership and addresses fail closed without name, coordinator, or flattening fallback. | Negative contract/runtime tests. |
| QR-002 | Compatibility | Both exhaustive existing-data cohorts have an explicit, repeatable, test-covered outcome. | Transition matrix and idempotency tests. |
| QR-003 | Operability | An unexpected deeper input fails as an invariant/validation error before mutation rather than activating a legacy compatibility path. | Negative migration and validation tests. |
| QR-004 | Integrity | Restore uses the durable run snapshot and preserves unambiguous placement, content, task, memory, and history identity. | Persistence/restore tests. |
| QR-005 | Simplicity | Supported configured composition depth is exactly Org → Team → Agent, with independent Agents directly under Org. | Schema/topology invariant tests. |

## Data Continuity And Acceptable Loss

- Persisted or external data affected: `Yes`.
- Must preserve: unambiguously mapped definition identity, member placement, Team coordinator, handoff endpoint, Agent/Team run identity, communication/task content, memory reachability, and history.
- Acceptable rebuild: derived catalogs, indexes, UI caches, and regenerated projections.
- Not acceptable: silent deletion, endpoint truncation/rebasing, or identity/content/history loss during either established cohort transition.
- Observed volume: 23 local root packages and 41 readable stored TeamRun trees; all observed configured nesting is zero or one child-Team level.
- Approved migration assumption: the relevant existing-data population contains no deeper configured topology. Deep input encountered later is unsupported input, not a migration cohort.

## External Contracts And Dependencies

| Contract / Dependency | Required Outcome | Evidence / Risk |
| --- | --- | --- |
| Package definition format | Distinguish Org direct members from Team Agent-only members and reject unsupported depth | Current `team-config.json` permits recursion. |
| GraphQL/stream/web contracts | Expose truthful Org/Team identity and fixed-depth composition | Current types and UI recursively expose Teams. |
| Collaboration tools | Preserve canonical same-scope addresses, ordered Agent handoffs, and Team coordinator targeting | Current logical routing does not join independent runs. |
| Durable execution/history | Represent native Org root semantics and preserve both established migration cohorts explicitly | Current strict V2 root is a recursive coordinator-led Team. |
| Remote flat-team bootstrap | Incorporated as evidence and concept input at commit `c3a318812` (cherry-picked as `ca6d24dfa`) | Its no-Org-coordinator and task-scope distinction are adopted; its duplicate draft is not canonical. |
| Dynamic-AgentTeam draft branch | Must not add recursive configured-Team mutation | `origin/codex/dynamic-agent-team-runtime@7d9b4ba69` conflicts with the target if implemented as drafted. |

## Supplemental Artifacts

| Artifact | Purpose | Status / Approval Applicability |
| --- | --- | --- |
| `tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | Normative behavior/persistence cases and current JSON assessment | `Ready for Approval`; included in this approval basis. |
| `tickets/in-progress/flat-agent-organization-model/investigation-notes.md` | Canonical evidence base | Current; supports but does not independently define behavior. |
| User screenshot at the absolute path recorded in investigation notes | Current structure evidence | Evidence only. |

## Assumptions And Resolved Decisions

| ID | Decision | Status / Basis |
| --- | --- | --- |
| DEC-001 | One AgentOrg launch owns one shared runtime/address/lifecycle scope. | Proposed for approval; simplest model consistent with current handoff behavior. |
| DEC-002 | AgentOrg has no coordinator; caller selects an exact Agent or Team entry target. | Proposed for approval; integrated remote concept. |
| DEC-003 | The migration population contains no deeply nested configured data. Flat roots remain Teams; one-level organization-like roots convert to AgentOrg; no deep legacy migration/compatibility path is built. | User-confirmed assumption backed by the inventory of 23 root packages and 41 stored trees. |
| DEC-004 | Standalone flat Teams remain reusable and independently launchable. | Proposed for approval; preserves existing Team value. |
| DEC-005 | Configured nested Teams are removed. A task Team created inside an Org exists under that Org's execution aggregate at its delegating host scope, but not in configured membership; standalone-Team tasks remain under the standalone Team run. | Clarified by user before approval; preserves lifecycle ownership without restoring configured nesting. |
| DEC-006 | No Product Design handoff is requested for this package. | Resolved from user request. |

## Traceability

| Requirements | Behaviors | Acceptance Criteria | Scenarios / Evidence |
| --- | --- | --- | --- |
| REQ-001–REQ-004 | BEH-001, BEH-004, BEH-006 | AC-001, AC-002 | SCN-001, SCN-002; user direction and imported concept |
| REQ-005–REQ-008 | BEH-002, BEH-003 | AC-003, AC-005 | SCN-001–SCN-003; runtime/handoff sources |
| REQ-009–REQ-011 | BEH-006, BEH-007 | AC-004, AC-006, AC-007 | Real package configs and screenshot |
| REQ-012–REQ-014 | BEH-005, BEH-007, BEH-008 | AC-008, AC-009 | SCN-002, SCN-004; stored-run and schema inventory |
| REQ-015–REQ-017 | BEH-006, BEH-009 | AC-010–AC-012 | SCN-005; task models, UI, remote draft branch |

## Downstream Architecture Input

- Preserve fixed semantics: distinct AgentOrg and flat Team, no Org coordinator, exact addresses, Team coordinator ingress, same-Org handoffs, standalone Teams, explicit data cohorts, and task/configured-nesting distinction.
- Architecture Design owns target modules, schemas/file names, API shape, transition mechanics, lifecycle composition, and removal sequence.
- Architecture must verify all definition, execution, persistence, history/memory, task, stream/GraphQL, package, and frontend readers/writers before removing recursive configured-Team paths.
- Native AgentOrg replacement and recursive configured-Team retirement must be delivered in a capability-safe order; an intermediate product state must not strand organization-like configurations.

## Readiness Check

- Problem and desired outcome unambiguous: `Yes`
- Current behavior evidence-backed: `Yes`
- Desired/preserved behavior explicit: `Yes`
- Scope/non-goals clear: `Yes`
- Requirements and acceptance criteria stable, testable, and traceable: `Yes`
- Relevant user/system/operational/contract scenarios covered: `Yes`
- Behavior-defining supplement integrated: `Yes — agent-org-contract.md`
- Data preservation and acceptable loss explicit: `Yes`
- Target architecture avoided: `Yes`
- User approval received: `No — requested for RER-003`
- Package ready for downstream route: `No — approval gate only`

## Architecture Design Routing Assessment

- Assessment status: `Not performed — requirements await explicit approval`.
- Assessment owner/date: Requirements Engineer / pending approval.
- Structural surfaces already identified: definition contracts, runtime ownership/lifecycle, canonical routing, persistence/migration, GraphQL/stream APIs, tasks, memory/history, and frontend.
- Structural-impact triggers: confirmed present.
- Expected route after approval: Architecture Designer; final preliminary size/risk and outcome classification will be recorded only after the approval/readiness gate.
