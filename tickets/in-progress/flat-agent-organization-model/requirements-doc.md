# Requirements Document

## Document Status

- Status: `Ready for Approval — Product Design Requirement Impact`
- Current requirements revision ID: `RER-011`
- Request / ticket: `AORG-FLAT-TEAM-001`
- Requirements owner: Requirements Engineer
- Date: 2026-08-31
- Approval state and reference: The intended AgentOrg/AgentTeam behavior approved under `RER-009` remains authoritative. During review of Product Design revision `RV-006`, the user identified `RIF-AORG-001`: handoffs need explicit `From`, `To`, and `When` presentation plus real authoring behavior. `RER-011` records the evidence-backed proposed clarification below; this new handoff UI behavior and all future-state visual references require explicit user approval before Product Design resumes.

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
| BEH-003 | Contract | A handoff is an ordered directional record with one Agent `from`, one Agent-or-Team `to`, and one or more ordered natural-language `rules`; compilation rejects duplicate effective endpoint pairs and self-resolving delivery, and `recipient_address` resolves only within the active root run. Current web authoring does not expose these fields. | AgentOrg/AgentTeam definition surfaces expose one reviewable handoff model with labeled `From`, `To`, and `When` conditions, valid scope-specific endpoint choices, stable ordering, and atomic authoring. | Canonical rooted addresses, Agent-only sources, Agent-or-Team Org destinations, natural-language non-executable conditions, Team coordinator ingress, ordered output, Team-local scope, and failure-closed resolution remain. | Handoff domain/normalizer/compiler, `get_handoff_rules`, package examples, current web absence, and `RIF-AORG-001`. |
| BEH-004 | Contract | Every AgentTeam, including an organization-like root, requires one direct Agent coordinator. | Every flat Team remains coordinator-led; AgentOrg has no coordinator. A caller selects an exact Agent or Team entry target. | Targeting a Team still routes through its direct Agent coordinator. | Current resolver plus imported concept branch. |
| BEH-005 | System | Definition, run, memory, event, history, and frontend contracts preserve recursive configured Team topology. | Persistent configured composition has fixed depth: Org → Team → Agent, with optional independent Agents directly under Org. | Supported content, task results, memory, run identity, and history are preserved when conversion is unambiguous. | Source inventory and 41 stored run trees. |
| BEH-006 | User | Agent Teams UI authors and displays recursively nested Team membership. | Product/API surfaces distinguish AgentOrg from flat Team and prevent unsupported deeper composition. | Standalone flat Teams remain directly definable and launchable. | Web docs/components and existing packages. |
| BEH-007 | Operational | Of 23 inspected root packages, three are organization-like; of 41 stored run trees, 14 have one configured child-Team level. None is deeper. | Safe observed organization-like definitions/runs can transition to AgentOrg without arbitrary flattening. | Existing Software Development Department, Northstar, and standalone Team workflows remain representable. | Local package and stored-data inventories. |
| BEH-008 | Durable contract | `team_run_execution_tree.json` schema V2 already provides a generic root aggregate, direct Agent/Team records, Team coordinators, handoffs, host-owned tasks, and recursive task lineage, but names the root `rootTeam`, requires a root coordinator, and permits recursive configured Teams. | Reuse the V2 topology and child/task record shapes in one generic V3 execution tree; generalize the root to AgentOrg-or-AgentTeam and narrow configured-depth validation. | Envelope, member records, addresses, handoffs, launch state, run identities, and task records remain structurally unchanged. | Concrete Software Development Department V2 JSON, domain types, strict schema/validator, builder, stream DTO. |
| BEH-009 | System | Task delegation may create task-scoped Team executions that are structurally nested under the delegating run. | Removing configured Team-within-Team membership does not by itself remove task-scoped delegation to a flat Team. | Supported task creation, settlement, review, and history behavior remain. | Task execution models and imported branch analysis. |

## Stakeholders, Actors, And Outcomes

| Actor / Stakeholder | Required Outcome | Important Constraint |
| --- | --- | --- |
| Package author | Compose one Org from independent Agents and reusable flat Teams | Invalid deeper membership fails clearly and never silently flattens. |
| Team developer | Build, launch, and test one AgentTeam independently before adopting it into an Org | Org adoption references the same Team definition rather than requiring a copied or Org-specific Team variant. |
| End user / caller | Launch an Org, select an exact entry Agent or Team, and inspect/restore work | AgentOrg is not given a synthetic coordinator. |
| Org-bound Agent | Use explicit handoffs to reach peers and Teams deterministically | Logical addresses never discover unrelated runs. |
| Existing-data owner | Upgrade the known zero/one-level data without silent identity, content, memory, task, or history loss | Migration may assume there is no deeper configured topology in the relevant existing-data population. |
| Product reviewer | Review image-based future-state UI evidence before architecture review resumes | The prototype must express the approved Org/Team boundary and must not invent recursive Team authoring or an Org coordinator. |

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
- `UC-010`: Review an image-based product UI prototype covering AgentTeam authoring, AgentOrg authoring, exact Org entry selection, and truthful Org-versus-standalone-Team runtime/history presentation before architecture review resumes.
- `UC-011`: Inspect and author Org-owned or Team-local handoffs through explicit `From`, `To`, and `When` fields, including add, edit, delete, reorder, validation, cancel, and atomic definition save.

### Out Of Scope

- Nested AgentOrg, Team-in-Team configured membership, or arbitrary department runtime hierarchy.
- Shared Agent runtime instances mounted in multiple placements.
- Implicit cross-process or unrelated-run routing by logical address.
- Live membership mutation, automatic file watching, or dynamic topology changes.
- A new workflow engine or framework evaluation of natural-language handoff conditions.
- Redesign of task submission/review semantics unrelated to the composition boundary.
- Product Design work unrelated to the AgentOrg/AgentTeam simplification or the four identified review journeys.

### Non-Goals

- Adding AgentOrg while retaining recursive AgentTeam composition as an equally supported model.
- Flattening every Agent into one undifferentiated Team and losing Team instructions, coordinator ingress, ownership, or launch scope.
- Renaming the current recursive root Team while keeping its mandatory coordinator and recursion invariants.
- Removing task-scoped Team execution solely because configured Teams become flat.
- Using the requested prototype to reintroduce Team-in-Team authoring, an AgentOrg coordinator, copied Org-specific Team variants, or unrelated visual redesign scope.

### Preserved Behavior Boundary

- Preserve canonical rooted addresses, exact mounted placement identity, Team-to-coordinator ingress, Agent-only handoff sources, and same-scope resolution.
- Preserve independently launchable flat Teams and supported Team lifecycle/task behavior.
- Preserve progressive composition: a proven standalone AgentTeam can be referenced directly by an AgentOrg and connected through Org-scoped handoffs without changing its standalone definition or prior runs.
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
| REQ-006 | A handoff MUST represent one ordered directional route with exactly one Agent `From`, exactly one valid `To`, and one or more ordered `When` conditions. `When` MUST remain trimmed natural-language guidance that the source Agent uses to decide whether the handoff applies; the product MUST NOT present it as executable policy, automatic scheduling, or delivery authorization. AgentOrg-scoped handoffs MUST support a mounted Agent source and a mounted Agent or Team destination, including cross-Team destinations. Team-local handoffs MUST remain scoped to that Team and may be rebased once when mounted. | BEH-003 | Critical | Preserves the existing record/tool semantics while making the user-requested From/To/When model explicit. |
| REQ-007 | Logical `recipient_address` resolution MUST remain within the caller's active AgentOrg or standalone Team scope and MUST fail closed for malformed, root-only, unknown, deeper, or out-of-scope addresses. | BEH-003 | Critical | Prevents accidental global/cross-run routing. |
| REQ-008 | Definition, import/sync, create/update, and launch validation MUST reject Team-in-Team and Org-in-Org input before partial persistence or activation and identify the offending placement. | BEH-001, BEH-006 | High | Makes fixed depth enforceable. |
| REQ-009 | The Software Development Department MUST remain representable as one AgentOrg with direct `requirements_engineer`, `product_design_prototyping_team`, and `software_engineering_team` members and equivalent effective handoffs. | BEH-007 | Critical | User-supplied primary example. |
| REQ-010 | Northstar Operating Company MUST remain representable as one AgentOrg with its independent executive Agents, six direct flat Teams, and equivalent effective handoffs. | BEH-007 | High | Largest inspected real organization example. |
| REQ-011 | Standalone flat Teams MUST remain directly definable, reusable in an AgentOrg, and independently launchable. | BEH-006 | High | Preserves ordinary Team use cases. |
| REQ-012 | Under `PRE-001`–`PRE-005`, migration MUST treat the relevant existing-data population as two exhaustive configured-topology cohorts: root Teams with direct Agents only remain standalone flat Teams; roots with direct Agents and exactly one level of flat child Teams convert to AgentOrg while preserving identities, coordinators, addresses, handoffs, content, tasks, memory, and history. | BEH-005, BEH-007 | Critical | Repository/data investigation plus explicit user confirmation establish that no deeper configured data exists. |
| REQ-013 | Migration MUST NOT implement a recursive flattening algorithm or legacy three-or-more-Team-level conversion/compatibility path. An unexpected violation of `PRE-002` MUST stop before mutation and be reported as a migration-invariant failure. After transition, deeper configured input through import/load/update MUST be rejected by ordinary flat-model validation. | BEH-001, BEH-007 | High | Keeps migration deterministic and avoids inventing ambiguous semantics for nonexistent data. |
| REQ-014 | Native AgentOrg and AgentTeam durable state MUST use the single minimal-delta `RunExecutionTreeFileV3` logical contract in `AORG-CONTRACT-001`. It MUST reuse current V2 envelope/member/handoff/task records, use a conditional AgentOrg-or-AgentTeam root, omit root `coordinatorAddress` only for AgentOrg, retain coordinator addresses for every Team, and enforce fixed configured depth. It MUST NOT introduce separate Org/Team topology families, duplicate child/task records, or a `FlatTeam` subtype. | BEH-008 | Critical | Reinspection confirms current V2 was intentionally generic and already models the target tree; only root semantics/naming and validation differ. |
| REQ-015 | A task Team created by an AgentOrg member MUST be a fresh task-scoped Team execution owned within that AgentOrg run and anchored to the exact delegating host scope. It MUST NOT become a configured Org member or configured child Team. Task delegation from a standalone Team remains owned by that standalone Team run. | BEH-009 | High | Task runtime ownership belongs under the active root scope, while configured membership stays flat. |
| REQ-016 | Affected GraphQL/transport, catalog/detail/launch/history, authoring, and workspace surfaces MUST distinguish AgentOrg from flat Team and MUST stop advertising or accepting configured Team members inside a Team. | BEH-006, BEH-008 | High | Product and external contracts must be truthful. |
| REQ-017 | Concurrent work MUST NOT introduce new recursive configured-Team mutation dependencies. Any future dynamic membership capability requires a separate approved contract and may operate only within the approved Org-direct-member or Team-direct-Agent boundaries. | BEH-001 | High | Reconciles the conflicting draft dynamic-Team branch. |
| REQ-018 | A user MUST be able to create, launch, configure, and test an AgentTeam independently, then add that same Team definition by reference as a direct AgentOrg member and add Org-scoped handoffs. Org adoption MUST NOT require copying the Team, changing its coordinator/internal handoffs, or invalidating its standalone launchability or prior run history. | BEH-001, BEH-006 | High | Enables incremental Team development and simple composition into an Org. |
| REQ-019 | Before `AD-REV-001` proceeds to independent architecture review, a Product Design-owned UI prototype package MUST provide image-based review evidence for the four approved journeys: (1) AgentTeam catalog/create-edit/detail with Agent-only membership, coordinator selection, and Team-local handoff inspection/authoring; (2) AgentOrg catalog/create-edit/detail with direct Agents, referenced reusable Teams, no Org coordinator, and Org-owned handoff inspection/authoring; (3) AgentOrg launch with an exact Agent-or-Team entry selector; and (4) shared runtime/history presentation that truthfully distinguishes AgentOrg from standalone AgentTeam. The package and its canonical artifact paths MUST receive explicit user approval before they become normative visual evidence. | BEH-001, BEH-003, BEH-004, BEH-006 | High | Explicit user request during review of `AD-REV-001` plus handoff gap `RIF-AORG-001`; validates the coordinated UI/API cutover without changing runtime handoff semantics. |
| REQ-020 | Every handoff detail row/card and editor MUST expose explicit labels for `From`, `To`, and `When`. Human-readable member names are primary, while the exact canonical source/destination addresses MUST remain visible as secondary, selectable/copyable text rather than being available only through a tooltip. A Team destination MUST visibly state that delivery enters through its named coordinator and MUST show that coordinator's canonical Agent address near the `To` value. | BEH-003, BEH-004, BEH-006 | High | Direct user feedback in `RIF-AORG-001`; mounted Agents can have similar labels, so exact identity must be inspectable. |
| REQ-021 | In an AgentOrg-owned handoff, `From` choices MUST include every configured Agent placement in that Org—direct Agents and Agents inside referenced Teams—and MUST exclude Team, Org, task-scoped, and out-of-scope subjects. `To` choices MUST include direct Agents, Agents inside referenced Teams, and direct referenced Teams, while excluding the Org root, task-scoped subjects, and out-of-scope subjects. In a Team-local handoff, both `From` and `To` choices MUST be direct Agent members of that Team; the Team root is not a destination. | BEH-003, BEH-004 | Critical | Makes fixed-depth endpoint eligibility reviewable without weakening root/address invariants. |
| REQ-022 | Handoff authoring MUST provide a truthful empty state and functional `Add handoff`, `Edit`, `Delete`, and reorder actions. One From/To pair MAY contain multiple ordered `When` conditions, with add/edit/delete/reorder for those conditions. The UI MUST use `handoff` for the directional pair and `When condition` for each natural-language rule, and MUST NOT label a count of endpoint pairs as “rules.” Draft actions MUST remain reversible until the parent definition is saved. | BEH-003, BEH-006 | High | Resolves the inert and ambiguous “Add rule” interaction identified by the user. |
| REQ-023 | The complete Org or Team definition draft MUST validate and save atomically. Save MUST be blocked with field- and handoff-specific feedback when From/To/When is missing, an address is invalid or no longer mounted, the source/destination is ineligible, delivery resolves back to the source Agent, or an effective From/To pair duplicates another handoff. Member removal or rename MUST NOT silently delete, retarget, or leave stale handoffs; the author must resolve every affected handoff before save. Cancel MUST discard the handoff draft, and save success/failure MUST be visible without losing a failed draft. Org create/edit MUST edit only Org-owned handoffs; Team-local handoffs MUST remain editable only from that Team's surface. Any compiled/effective view that combines scopes MUST label each handoff's owner and remain read-only. | BEH-001, BEH-003, BEH-006 | Critical | Preserves validate-before-write, Team reuse, and scope ownership while defining the requested complete authoring lifecycle. |

## Acceptance Criteria

| AC ID | Related Requirements | Trigger | Observable Expected Outcome | Important Failure / Alternate Outcome |
| --- | --- | --- | --- | --- |
| AC-001 | REQ-001–REQ-003 | Author an Org with one independent Agent and two flat Teams | Definition is valid; each Team contains Agents only and has one direct Agent coordinator | A Team containing a Team/Org is rejected before persistence. |
| AC-002 | REQ-004 | Launch or open an Org | The caller can select an exact Agent or Team; Team selection routes through its coordinator | No Org coordinator, first-member, name, or synthetic fallback is created. |
| AC-003 | REQ-005–REQ-007 | An Org-bound Agent uses collaboration tools | That Agent receives its outgoing `When` conditions in persisted order; `/agent`, `/team`, and `/team/agent` resolve exactly in the active Org; `/team` targets its coordinator | The framework does not execute/evaluate condition prose, and `/`, malformed/deeper/unknown/out-of-scope destinations fail closed. |
| AC-004 | REQ-006, REQ-009 | Convert and run Software Development Department | Existing Requirements ↔ Product Design/Engineering/Delivery workflow reaches the same effective recipients | No Team-inside-Team definition is required. |
| AC-005 | REQ-002, REQ-008 | Import/edit a Team containing `refType=agent_team` or Org | The operation identifies the invalid member and performs no partial save/activation | It does not silently flatten or mount the member elsewhere. |
| AC-006 | REQ-010 | Represent and run Northstar under the fixed-depth model | All direct executives, six Teams, and current cross-Team destinations fit addresses no deeper than `/team/agent` | Unsupported later deeper input follows AC-005 validation rather than migration compatibility. |
| AC-007 | REQ-011 | Define and launch a flat Team without an Org, then reuse it in an Org | Standalone coordinator-led collaboration works; the same definition can be mounted as a direct Org Team | Org membership is not mandatory for ordinary Team work. |
| AC-008 | REQ-012, REQ-013 | Under `PRE-001`–`PRE-005`, transition the complete relevant definition/run population | Every configured root classifies as either a flat standalone Team or a one-level organization-like root; the former remains a Team and the latter converts to AgentOrg with preserved supported state, while task executions remain attached to their runtime host | The migration reports a precondition violation before writes rather than guessing if deeper configured topology is unexpectedly encountered; no deeply nested legacy compatibility path is required. |
| AC-009 | REQ-014 | Migrate, persist, and restore the single V3 execution-tree record | V2 envelope, configured Agent/Team nodes, handoffs, launch state, IDs, and host-anchored task records remain structurally equivalent; `root.subjectKind` selects AgentOrg (no root coordinator, Agent/Team members) or AgentTeam (required coordinator, Agent members only) | Strict validation rejects a coordinator on Org root, missing Team coordinator, configured Team below Team, wrong root variant, or precondition-violating depth. |
| AC-010 | REQ-015 | An Org member delegates a task to a flat Team | A fresh task TeamRun starts through that Team's coordinator, is recorded under the same AgentOrg execution aggregate at the delegating host scope, and settles/reports under supported task semantics | It is not added to the Org definition/member list and receives no new permanent Org member address. A task delegated from a standalone Team remains under that Team run. |
| AC-011 | REQ-016 | Use affected API and web authoring/launch/history flows | Org and Team roles are distinguishable; Team authoring offers Agent members only; existing flat-Team flows remain usable | Nested-Team selectors/counts/warnings are absent from flat-Team authoring. |
| AC-012 | REQ-017 | Reconcile the dynamic-AgentTeam draft work | No new production path can add/remove a configured Team beneath a Team | Reusable dynamic ideas, if any, require a separately approved fixed-depth contract. |
| AC-013 | REQ-018 | A tested standalone AgentTeam is added by reference to an AgentOrg and Org-level handoffs are authored to/from it | The Org validates and launches using the same Team definition identity, coordinator, Agent membership, and Team-local handoffs; Org handoffs reach the Team/coordinator or its Agents; the Team remains independently launchable and its earlier runs remain intact | No copied Team definition, Org-specific Team subtype, or configured Team nesting is introduced. |
| AC-014 | REQ-019 | The Product Design package is presented for user review before architecture review resumes | Final image references and the Product Design-owned specification/review record cover all four journeys, agree on the same accepted revision and durable paths, visibly preserve Agent-only Team membership, Team coordinator selection, referenced reusable Teams, a coordinator-free Org, exact Org entry selection, truthful handoff detail/authoring, and truthful root-kind runtime/history presentation, and carry an explicit user-approval reference | Missing journey/handoff images, disagreement between artifacts, recursive Team authoring, an Org coordinator, an implicit entry fallback, an inert authoring control, or absent user approval keeps architecture review on hold and returns the package for Product Design/requirements reconciliation. |
| AC-015 | REQ-006, REQ-020 | Inspect a Team-local or Org-owned handoff on a detail surface | The exact `From`, `To`, and every `When` condition are explicitly labeled; member names and canonical addresses are visible; a Team `To` shows “via coordinator” with the named coordinator and its Agent address | A generic “Agent → coordinator” summary, hidden-only address, condition nickname that omits the actual guidance, or ambiguous “N rules” count does not satisfy the requirement. |
| AC-016 | REQ-021 | Add or edit an Org-owned handoff | `From` offers the Org's direct Agents and mounted Team Agents only; `To` offers direct Agents, mounted Team Agents, and direct Teams; choices are grouped or otherwise distinguish scope and show exact addresses | Org/Team roots as sources, Org root as destination, task executions, unrelated subjects, direct Team-as-source, and self-resolving or duplicate effective endpoints are unavailable or produce blocking inline validation. |
| AC-017 | REQ-022, REQ-023 | Starting from zero or existing handoffs, add one route with two When conditions, edit it, reorder both conditions and handoffs, delete another route, then save | The empty/add/edit/delete/reorder controls are functional and keyboard reachable; the saved definition preserves endpoint and condition order exactly; success is announced; reopening shows the saved order | Cancel leaves the persisted definition unchanged; invalid or failed save identifies affected fields/handoffs, preserves the draft, and performs no partial mutation. |
| AC-018 | REQ-018, REQ-023 | Edit Org handoffs involving an Agent inside a referenced Team, then open that Team's handoff editor | Org editing changes only Org-owned routes; the referenced Team retains the same definition and Team-local handoffs; Team-local `From`/`To` choices contain only that Team's direct Agents | Org editing never mutates Team-local rules. A combined effective/runtime view, if supplied, is owner-labeled and read-only rather than a second editing authority. |

## Relevant Scenarios And Journeys

| Scenario ID | Kind | Starting Condition / Sequence | Expected Outcome | Related IDs |
| --- | --- | --- | --- | --- |
| SCN-001 | Contract | Define Org members and Org-scoped handoffs; validate | One fixed-depth Org definition is accepted | REQ-001–REQ-008; AC-001–AC-003 |
| SCN-002 | System | Launch Org; caller selects Agent/Team; persist/restore | One Org-owned scope retains exact identities without an Org coordinator | REQ-004, REQ-005, REQ-014; AC-002, AC-009 |
| SCN-003 | Contract | An Agent reviews its ordered natural-language `When` conditions and applies a handoff that targets a peer Team | Destination resolves in the same Org and reaches the Team coordinator; the framework does not evaluate the prose | REQ-003, REQ-006, REQ-007; AC-003 |
| SCN-004 | Operational | Upgrade/open the exhaustive flat-root and one-level-org cohorts | Preserve the former as Teams and convert the latter to AgentOrg | REQ-012, REQ-013; AC-008 |
| SCN-005 | User | Launch a standalone Team and delegate work to a Team | Flat Team and task-scoped execution remain usable | REQ-011, REQ-015; AC-007, AC-010 |
| SCN-006 | User | Create and repeatedly test a standalone AgentTeam, then reference it from an AgentOrg and add Org-scoped handoffs | The same Team becomes a direct Org member without losing standalone behavior or history | REQ-011, REQ-018; AC-007, AC-013 |
| SCN-007 | User | Review the requested image-based prototype across Team catalog/authoring/detail, Org catalog/authoring/detail, exact Org launch entry, and shared runtime/history | The user can approve or revise one coherent UI model that visibly preserves the already-approved AgentOrg/AgentTeam semantics before architecture review resumes | REQ-019; AC-014; explicit request during `AD-REV-001` review |
| SCN-008 | User | Inspect, add, edit, delete, and reorder explicit From/To/When handoffs; change a referenced member; cancel once and atomically save once | Scope-eligible choices, canonical identities, Team coordinator ingress, condition order, member-impact validation, ownership separation, cancellation, and save feedback are all reviewable without mutating a referenced Team | REQ-006, REQ-020–REQ-023; AC-015–AC-018; `RIF-AORG-001` |

## UI, Interaction, And Experience Requirements

- Applicable: `Yes`; current authoring, launch, detail, workspace, and history surfaces expose recursive Teams.
- Product Design & Prototyping request: `Explicit — the user requested a product UI prototype delivered as images before the architecture package proceeds to independent review`.
- User-supplied screenshot: current-state evidence only, not an approved future visual reference.
- Focused review decision: confirm one clear visual and interaction model for (a) reusable Agent-only, coordinator-led Teams; (b) coordinator-free Orgs that reference Agents and Teams; (c) exact Agent-or-Team Org entry; and (d) a shared runtime/history experience that distinguishes the root subject truthfully.
- Normative interaction constraints carried into Product Design: no Team-in-Team or Org-in-Org authoring; no Org coordinator or implicit entry fallback; a referenced Team retains its identity, Agent membership, coordinator, Team-local handoffs, standalone launchability, and prior history; task-scoped Team lineage must not be presented as configured nesting.
- Requested review coverage: AgentTeam catalog/create-edit/detail; AgentOrg catalog/create-edit/detail; Org launch entry selection; shared active-runtime and history presentation.
- Product Design requirement-impact finding: `RIF-AORG-001` at Product revision `RV-006` found that condensed handoff cards and an inert `Add rule` action do not make the handoff contract reviewable. Product Design is paused pending approval of `RER-011`.
- Proposed handoff detail model: one directional **Handoff** visibly groups labeled `From`, `To`, and one or more labeled **When conditions**. Names are primary; canonical addresses are always visible secondary identity. A Team destination shows its Team address plus `Via coordinator <name>` and the coordinator Agent address. Counts distinguish handoffs from When conditions.
- Proposed handoff editor model: use `Add handoff`; select scope-eligible From/To placements; enter at least one natural-language When condition; support condition and handoff add/edit/delete/reorder; apply changes to a reversible form draft; validate the complete definition; then save atomically with explicit success/failure feedback.
- Proposed scope model: Org pages inspect/edit only Org-owned handoffs. Team pages inspect/edit only that Team's local Agent-to-Agent handoffs. Org choices may reach mounted Team Agents and direct Teams, but editing the Org never edits the referenced Team. Any combined effective/runtime list is owner-labeled and read-only.
- Accessibility baseline for the handoff interaction: fields and errors have programmatic labels; add/edit/delete/reorder/cancel/save are keyboard reachable; reorder has a non-pointer equivalent; status/error feedback is announced; visual identity is not color-only.
- Future-state images and exact interaction/presentation details remain pending revised Product Design output and explicit user approval. Product Prototyper owns its workflow, artifact form, and repository choices.

## Quality And Non-Functional Requirements

| Quality ID | Area | Requirement | Verification Intent |
| --- | --- | --- | --- |
| QR-001 | Reliability | Invalid membership and addresses fail closed without name, coordinator, or flattening fallback. | Negative contract/runtime tests. |
| QR-002 | Compatibility | Both exhaustive existing-data cohorts have an explicit, repeatable, test-covered outcome. | Transition matrix and idempotency tests. |
| QR-003 | Operability | An unexpected deeper input fails as an invariant/validation error before mutation rather than activating a legacy compatibility path. | Negative migration and validation tests. |
| QR-004 | Integrity | Restore uses the durable run snapshot and preserves unambiguous placement, content, task, memory, and history identity. | Persistence/restore tests. |
| QR-005 | Simplicity | Supported configured composition depth is exactly Org → Team → Agent, with independent Agents directly under Org. | Schema/topology invariant tests. |
| QR-006 | Accessibility | Handoff fields, choices, validation, actions, ordering, and save status are operable and understandable without pointer-only input or color-only meaning. | Keyboard/screen-reader browser validation, including reorder and error recovery. |

## Data Continuity And Acceptable Loss

- Persisted or external data affected: `Yes`.
- Must preserve: unambiguously mapped definition identity, member placement, Team coordinator, handoff endpoint, Agent/Team run identity, communication/task content, memory reachability, and history.
- Acceptable rebuild: derived catalogs, indexes, UI caches, and regenerated projections.
- Not acceptable: silent deletion, endpoint truncation/rebasing, or identity/content/history loss during either established cohort transition.
- Observed volume: 23 local root packages and 41 readable stored TeamRun trees; all observed configured nesting is zero or one child-Team level.
- Approved migration assumption: the relevant existing-data population contains no deeper configured topology. Deep input encountered later is unsupported input, not a migration cohort.

## Migration Preconditions / Preknown Conditions

These conditions are authoritative inputs to future migration design and implementation, not questions that must be re-investigated unless contradictory data is actually produced.

| Precondition ID | Established Condition | Consequence For Migration | Evidence / Authority |
| --- | --- | --- | --- |
| PRE-001 | All relevant definitions and live/historical run data were created from the currently managed AgentTeam definitions. | Definition topology is the governing configured-topology boundary for corresponding data. | Explicit user confirmation and current persistence model. |
| PRE-002 | Configured Team nesting has a maximum of one Team-membership edge: current root Team → optional direct child flat Team → Agents. There is no root Team → child Team → grandchild Team data. | Migration may be fixed-depth and MUST NOT implement recursive/deep flattening logic. | Inventory of 23 root packages and 41 stored trees; explicit user confirmation. |
| PRE-003 | The migration population has exactly two configured cohorts: Agent-only roots and organization-like roots with direct flat child Teams. | Agent-only roots remain standalone Teams; organization-like roots convert directly to AgentOrg. | Same inventory and user confirmation. |
| PRE-004 | Northstar and Software Development Department are examples of the second cohort, not deeply nested structures. | Their synthetic root becomes AgentOrg while direct child Teams remain flat. | Package configs, screenshot, and user clarification. |
| PRE-005 | Task-scoped Team executions are runtime/task lineage, not configured Team membership depth. | Preserve and reattach task execution records under the correct Org/Team host scope; do not interpret them as a third configured composition level. | Current task execution contract and user task-Team clarification. |

If a migration probe unexpectedly contradicts `PRE-002`, the migration fails before writes and reports the violated invariant. That guard is not authorization to design a deep legacy conversion path.

## External Contracts And Dependencies

| Contract / Dependency | Required Outcome | Evidence / Risk |
| --- | --- | --- |
| Package definition format | Distinguish Org direct members from Team Agent-only members and reject unsupported depth | Current `team-config.json` permits recursion. |
| GraphQL/stream/web contracts | Expose truthful Org/Team identity and fixed-depth composition | Current types and UI recursively expose Teams. |
| Collaboration tools | Preserve canonical same-scope addresses, ordered Agent handoffs, and Team coordinator targeting | Current logical routing does not join independent runs. |
| Durable execution/history | Reuse the generic V2 topology in one minimal-delta V3 root union and preserve both established migration cohorts | Current strict V2 child/task records already fit; only root semantics/naming and configured-depth validation differ. |
| Remote flat-team bootstrap | Incorporated as evidence and concept input at commit `c3a318812` (cherry-picked as `ca6d24dfa`) | Its no-Org-coordinator and task-scope distinction are adopted; its duplicate draft is not canonical. |
| Dynamic-AgentTeam draft branch | Must not add recursive configured-Team mutation | `origin/codex/dynamic-agent-team-runtime@7d9b4ba69` conflicts with the target if implemented as drafted. |

## Supplemental Artifacts

| Artifact | Purpose | Status / Approval Applicability |
| --- | --- | --- |
| `tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | Single normative configured-structure, handoff authoring/presentation, minimal-delta generic V3 execution tree, task anchoring, and V2 projection contract | Existing structure/persistence basis approved in `RER-009`; proposed handoff extension is `Ready for Approval` in `RER-011`. |
| `tickets/in-progress/flat-agent-organization-model/investigation-notes.md` | Canonical evidence base | Current; supports but does not independently define behavior. |
| User screenshot at the absolute path recorded in investigation notes | Current structure evidence | Evidence only. |
| Product Design-owned UI/UX specification, review record, and final image references | Future-state visual and interaction evidence for `REQ-019` / `AC-014` | `Pending Product Design and explicit user approval`; canonical paths will be linked here after return. |
| `tickets/in-progress/flat-agent-organization-model/design-spec.md` and `architecture-design-revision-record.md` | Architecture context for the held product review and later impact check | `AD-REV-001` committed at `36bc02deca363798b6eda878e5eb4850e624da6f`; independent architecture review held pending approved Product Design evidence. |
| `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/requirement-impact-findings.md` | Product Design finding `RIF-AORG-001` from user review of `RV-006` | `Requirement Impact`; authoritative trigger/evidence for `RER-011`, not an approved visual reference. |
| `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-FLAT-TEAM-001/tickets/in-progress/AORG-FLAT-TEAM-001/prototype-ticket.md` and `ui-ux-spec.md` | Product-owned ticket/prototype state and draft experience specification | `In Progress`; last committed review revision `RV-006` at `e1282e15e274f7a3654364f131aa91d5af4d3602`; no future-state approval. |

## Assumptions And Resolved Decisions

| ID | Decision | Status / Basis |
| --- | --- | --- |
| DEC-001 | One AgentOrg launch owns one shared runtime/address/lifecycle scope. | Approved; simplest model consistent with current handoff behavior. |
| DEC-002 | AgentOrg has no coordinator; caller selects an exact Agent or Team entry target. | Approved; integrated remote concept and user-confirmed governing model. |
| DEC-003 | The migration population contains no deeply nested configured data. Flat roots remain Teams; one-level organization-like roots convert to AgentOrg; no deep legacy migration/compatibility path is built. | User-confirmed assumption backed by the inventory of 23 root packages and 41 stored trees. |
| DEC-004 | Standalone flat Teams remain reusable and independently launchable. | Approved; preserves existing Team value and progressive composition workflow. |
| DEC-005 | Configured nested Teams are removed. A task Team created inside an Org exists under that Org's execution aggregate at its delegating host scope, but not in configured membership; standalone-Team tasks remain under the standalone Team run. | Clarified by user before approval; preserves lifecycle ownership without restoring configured nesting. |
| DEC-006 | After `AD-REV-001`, the user requested an image-based Product Design prototype and review before independent architecture review. | Product Design Requested in `RER-010`; artifact and user approval pending. |
| DEC-007 | User-facing `When` is the existing required natural-language guidance for the source Agent, not an executable expression, event subscription, scheduler, or authorization control. | Proposed in `RER-011` from current domain/tool contract and `RIF-AORG-001`; explicit user approval pending. |
| DEC-008 | A displayed/authored Handoff is one From/To endpoint pair with one or more ordered When conditions; duplicate effective endpoint pairs remain invalid and additional conditions belong on the existing handoff. | Proposed in `RER-011` from the current record/compiler invariant; explicit user approval pending. |
| DEC-009 | Org-owned handoffs and Team-local handoffs have separate editing authorities. Org endpoint choices include mounted Team Agents and direct Team destinations; Team-local endpoint choices include direct Team Agents only. | Proposed in `RER-011` from fixed-depth scope/reuse requirements; explicit user approval pending. |
| DEC-010 | Handoff and condition changes are draft operations committed only by an atomic parent-definition save; member changes cannot silently retarget or remove handoffs. | Proposed in `RER-011` from validate-before-write and identity-preservation requirements; explicit user approval pending. |

## Traceability

| Requirements | Behaviors | Acceptance Criteria | Scenarios / Evidence |
| --- | --- | --- | --- |
| REQ-001–REQ-004 | BEH-001, BEH-004, BEH-006 | AC-001, AC-002 | SCN-001, SCN-002; user direction and imported concept |
| REQ-005–REQ-008 | BEH-002, BEH-003 | AC-003, AC-005, AC-015–AC-018 | SCN-001–SCN-003, SCN-008; runtime/handoff sources and `RIF-AORG-001` |
| REQ-009–REQ-011 | BEH-006, BEH-007 | AC-004, AC-006, AC-007 | Real package configs and screenshot |
| REQ-012–REQ-014 | BEH-005, BEH-007, BEH-008 | AC-008, AC-009 | SCN-002, SCN-004; stored-run and schema inventory |
| REQ-015–REQ-017 | BEH-006, BEH-009 | AC-010–AC-012 | SCN-005; task models, UI, remote draft branch |
| REQ-018 | BEH-001, BEH-006 | AC-013 | SCN-006; explicit user workflow clarification |
| REQ-019 | BEH-001, BEH-003, BEH-004, BEH-006 | AC-014 | SCN-007; explicit user request during `AD-REV-001` review and `RIF-AORG-001` |
| REQ-020–REQ-023 | BEH-001, BEH-003, BEH-004, BEH-006 | AC-015–AC-018 | SCN-008; current handoff contract/compiler/tool evidence and direct user feedback in `RIF-AORG-001` |

## Downstream Architecture Input

- Preserve fixed semantics: distinct AgentOrg and flat Team, no Org coordinator, exact addresses, Team coordinator ingress, same-Org handoffs, standalone Teams, explicit data cohorts, and task/configured-nesting distinction.
- Treat `PRE-001`–`PRE-005` and the single minimal-delta `RunExecutionTreeFileV3` contract as authoritative design inputs: reuse current V2 child/task records, change only generic root semantics/naming and configured-depth validation, preserve task lineage, and do not create parallel Org/Team schema families or a `FlatTeam` subtype.
- Architecture Design owns target modules, schemas/file names, API shape, transition mechanics, lifecycle composition, and removal sequence.
- Architecture must verify all definition, execution, persistence, history/memory, task, stream/GraphQL, package, and frontend readers/writers before removing recursive configured-Team paths.
- Native AgentOrg replacement and recursive configured-Team retirement must be delivered in a capability-safe order; an intermediate product state must not strand organization-like configurations.
- Architecture revision `AD-REV-001` is committed but its independent review is held until the Product Design package is explicitly user-approved and integrated. Requirements Engineering will then return the cumulative package to Architecture Designer for an impact check and `AD-REV-002` if needed.
- If the `RER-011` handoff clarification is approved, Architecture Designer must reconcile explicit handoff CRUD/reordering, natural-language condition ordering, owner-separated Org/Team definition APIs, endpoint-option projection, member-impact validation, and atomic save/error contracts during the post-prototype impact check. Requirements Engineering does not prescribe the target component/API design.

## Readiness Check

- Problem and desired outcome unambiguous: `Yes`
- Current behavior evidence-backed: `Yes`
- Desired/preserved behavior explicit: `Yes`
- Scope/non-goals clear: `Yes`
- Requirements and acceptance criteria stable, testable, and traceable: `Yes — RER-011 proposal is ready for explicit user approval`
- Relevant user/system/operational/contract scenarios covered: `Yes`
- Behavior-defining supplement integrated: `Yes — existing contract approved; RER-011 handoff extension ready for approval`
- Requested Product Design evidence integrated and approved: `No — RV-006 produced RIF-AORG-001; revised Product Design package and explicit approval remain pending under REQ-019 / AC-014`
- Data preservation and acceptable loss explicit: `Yes`
- Target architecture avoided: `Yes`
- Existing AgentOrg/AgentTeam behavior approval received: `Yes — explicit 2026-08-31 confirmation recorded in RER-009`
- RER-011 handoff UI clarification approval received: `No — pending explicit user approval`
- Package ready for current downstream route: `No — present RER-011 for approval; Product Design and Architecture Review remain paused`.

## Architecture Design Routing Assessment

- Assessment status: `Complete`.
- Assessment owner/date: Requirements Engineer / 2026-08-31.
- Preliminary task size: `Large`.
- Preliminary architectural risk: `High`.
- Structural surfaces reviewed: AgentOrg/AgentTeam definition contracts, graph validation, launch planning, root lifecycle/ownership, canonical routing and handoff compilation, generic execution-tree persistence/restore, memory/history, task delegation, GraphQL/stream contracts, package discovery/import, and frontend authoring/launch/workspace/history.
- Payload/content surfaces reviewed: 23 root package configurations, the Software Development Department and Northstar definitions, 41 stored TeamRun execution trees, handoff snapshots, task execution records, and the current strict V2 JSON contract.
- Structural-impact triggers: `Present` — public/domain contract change, persisted root schema/invariant change, lifecycle/ownership distinction, deterministic data migration, API/transport change, and cross-subsystem structural refactoring.
- Evidence paths: `investigation-notes.md`, `agent-org-contract.md`, current definition/execution source paths listed there, package fixtures, and stored-run inventory.
- Decision rationale: Although the existing execution-tree topology is reusable with minimal persistence transformation, the overall product change introduces a distinct AgentOrg domain/root, removes recursive configured Team composition across definition/API/UI surfaces, changes root coordinator semantics, and requires coordinated migration and lifecycle updates. It is not safe for bounded direct implementation without architecture design.
- Selected ultimate engineering route: `Architecture Designer`; `AD-REV-001` is complete and requires a post-prototype impact check before independent Architecture Review.
- Current requirements-stage classification: `Ready for Approval — Product Design Requirement Impact`.
- Direct-route conditions all satisfied: `No` — task is Large/High and has confirmed contract, persistence, lifecycle, migration, ownership, and structural-refactoring impact.
- Architecture design, review, and design-revision artifacts: `AD-REV-001` is committed at `36bc02deca363798b6eda878e5eb4850e624da6f`; independent review is held pending the requested Product Design evidence.
- Downstream re-entry trigger: After explicit approval of `RER-011`, Requirements Engineering returns the approved handoff behavior to Product Prototyper for the next prototype revision and renewed user review. After Product Design returns a completed user-approved package, Requirements Engineering reconciles the visual evidence and returns the cumulative package to Architecture Designer for an impact check and `AD-REV-002` if needed. Any further material intended-behavior change still requires renewed requirements approval; target modules, physical file/directory names, type names, and rollout mechanics remain Architecture Design-owned.
