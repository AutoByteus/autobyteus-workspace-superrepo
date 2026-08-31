# Requirements Investigation Notes

## Investigation Meta

- Request / ticket: `AORG-FLAT-TEAM-001` — reconsider recursive nested AgentTeams in favor of one Agent Organization containing flat Teams and independent Agents
- Workspace root: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`
- Repository mode: `Git`
- Task worktree / branch: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model` / `requirements/flat-agent-organization-model`
- Base or reference revision: `personal@80e2bd195c42ea3ced778dbc051d4d00edaef16f`
- Bootstrap result: Dedicated clean requirements worktree created and verified.
- Bootstrap blocker: `N/A`
- Current requirements revision ID: `RER-009`
- Investigation status: Complete for approved requirements and architecture routing; the cumulative package is `Approved Architecture-Ready`.

## Initial Request And Clarifications

- Original request: The user questioned whether recursive/nested AgentTeams are unnecessarily complex. The proposed alternative is one Agent Organization containing many flat Teams plus optional independent Agents, with handoff rules connecting Teams.
- Clarifications received:
  - The user confirmed the intended concept is one top-level Agent Organization composition model.
  - The user confirmed each Team should be flat so persistent configured Team-within-Team nesting can be removed from the supported product model.
  - The user identified simplicity of the product, implementation, and handoff model as the main value, using flatter modern organizations as the conceptual analogy.
  - The user requested a contract-first package that lists supported cases and explicitly determines whether the current Agent execution JSON contract must change.
  - The user asked to inspect and integrate `origin/codex/flat-agent-team-domain-simplification`; commit `c3a318812` was cherry-picked into the task branch as `ca6d24dfa` and reconciled into the canonical package.
  - The user clarified that a task Team created by an Org member should exist under the AgentOrg. The requirements interpret this as runtime/durable ownership under the Org aggregate at the exact delegating host scope, not configured membership.
  - The user confirmed the migration may assume there is no deeply nested configured data, consistent with the completed local inventory.
  - The user requested that the no-deep-data fact be recorded explicitly as a preknown migration condition: all relevant definitions and derived live/historical data use only the current flat or one-level organization-like shapes, so future migration must not solve an unsupported three-level case.
  - The user stated the requirements are clear, asked work to continue, and requested one contract file containing both the configured structure and on-disk data structure so it can direct later design.
  - The user rejected `FlatTeam` as a type/file prefix because all target AgentTeams are flat by invariant; naming a flat subtype would imply a nonexistent non-flat alternative.
  - After requesting reinspection of the current execution tree, the user confirmed the intended persistence posture: reuse the deliberately generic current tree with minimal root naming/semantics changes; AgentOrg has no root coordinator, while every direct Team retains its own coordinator.
  - The user clarified the progressive composition journey: create and test an AgentTeam independently, then reference that same Team from AgentOrg and add Org-scoped handoffs without copying or redesigning the Team.
  - After the complete package was presented for approval, the user explicitly confirmed the governing requirements: AgentTeam is Agent-only with a coordinator, and AgentOrg contains multiple AgentTeams plus independent Agents. This approval is recorded in `RER-009`.
- User-supplied facts and constraints:
  - The supplied screenshot shows one Software Development Department run with one independent `requirements_engineer` placement and two mounted Teams: Product Design & Prototyping and Software Engineering.
  - The user experiences this as one organization rather than a Team recursively containing other Teams.
  - Handoff rules are expected to carry cross-Team workflow.
- Initial resolved posture was presented in `RER-001` and refined by `RER-002`/`RER-003`:
  - One AgentOrg owns one runtime/collaboration/lifecycle scope; current logical handoffs do not join unrelated root runs.
  - AgentOrg has no coordinator; a caller selects an exact Agent or Team target. Teams remain coordinator-led.
  - Flat-root data is preserved as Team and one-level organization-like data converts to AgentOrg. User confirmation establishes that these exhaust the migration population; no deep legacy path is needed.
  - Standalone flat Teams and task-scoped Team delegation remain supported.
  - UI/API truthfulness is in scope, but no separate Product Design prototype was requested.

## Product And Domain Understanding

- Product area: AgentTeam definition, execution topology, collaboration handoffs, logical addressing, persistence/history, memory layout, task delegation, and AgentTeam frontend surfaces.
- Affected actors or systems: Agent package authors, end users launching and inspecting collaborative runs, Team-bound Agents using collaboration tools, backend definition/run services, and the web client.
- Existing user or operational purpose: Define reusable coordinator-led Teams, mount Teams recursively, launch one rooted collaboration tree, address mounted Agents/Teams with canonical `/...` addresses, and compile definition-local handoffs into the run snapshot.
- Relevant terminology:
  - **AgentTeam (current):** A coordinator-led definition whose direct members may be Agents or AgentTeams.
  - **Nested AgentTeam (current):** A Team definition mounted as a member of another Team definition.
  - **Agent Organization (proposed):** A top-level collaboration container that would contain flat Teams and independent Agents.
  - **Flat Team (proposed):** A coordinator-led Team whose direct members are Agents only.
  - **Organization handoff (proposed):** An edge between mounted Agent or Team placements inside one Organization.

## Source Log

| Date | Source Type | Exact Source / Command / Query | Why Consulted | Relevant Finding | Follow-Up |
| --- | --- | --- | --- | --- | --- |
| 2026-08-31 | User / Image | User request and `/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/requirements_engineer_6568eac682114f2cb3ddb8f1d91d3c34/context_files/ctx_4cc02361f417__image.png` | Establish the perceived product problem and representative structure | The visible root behaves conceptually like an organization: one independent Agent plus two Teams. | Clarify the intended Organization runtime and coordinator semantics. |
| 2026-08-31 | User | Follow-up clarification: one AgentOrg concept and flat Teams | Confirm the desired persistent composition depth | The user wants AgentOrg as the sole top-level composition concept and wants Teams to contain Agents only, eliminating supported persistent nested Team composition. | Resolve Organization entrypoint and existing-data continuity. |
| 2026-08-31 | User | Follow-up rationale: simpler product/code/handoffs and flatter organizational structure | Record the governing product rationale | Containment should express stable membership boundaries; explicit handoffs should express cross-Team workflow among peer Teams rather than requiring recursive structural placement. | Preserve explicit routing rather than interpreting “flat” as unrestricted all-to-all communication. |
| 2026-08-31 | User | Contract-first direction and request to assess the current Agent execution JSON | Establish the required supplemental artifact and persistence decision | A behavior/persistence case contract is required before downstream design; unchanged JSON semantics must be evaluated rather than assumed reusable. | Created `agent-org-contract.md`; inspected strict V2 execution-tree authority. |
| 2026-08-31 | User | Clarification: a created task Team exists under AgentOrg | Fix task runtime ownership without recreating configured nesting | An Org-originated task Team belongs within the AgentOrg execution aggregate and is anchored to the delegating host scope; it is not inserted into configured Org/Team membership. | Updated REQ-015, AC-010, DEC-005, and ORG-CASE-028 in `RER-002`. |
| 2026-08-31 | User | Migration assumption clarification: there is no deeply nested configured data | Convert the measured data fact into an explicit migration boundary | The relevant migration population is exhausted by flat roots and one-level organization-like roots; a deep legacy migration/compatibility path is unnecessary. | Updated REQ-012, REQ-013, AC-008, DEC-003, and the Existing Data Contract in `RER-003`. |
| 2026-08-31 | User | Direction to record the data fact as a migration prerequisite/preknown condition | Prevent downstream design from reintroducing hypothetical recursive migration complexity | All relevant data derives from current definitions; configured depth is at most root Team → direct flat Team → Agents. Task execution lineage remains a separate runtime concern. | Added `PRE-001`–`PRE-005` and contract migration preconditions in `RER-004`. |
| 2026-08-31 | User | Direction to keep one contract file with structure and on-disk data shape | Make the approved domain boundary concrete enough to govern Architecture Design | The contract must include fixed configured composition, native AgentOrg/flat-Team durable structures, task anchoring, and V2 migration mapping. | Expanded `agent-org-contract.md` as the single normative supplement in `RER-005`. |
| 2026-08-31 | User | Naming correction: remove `Flat` from Team execution/type prefixes | Ensure simplification is reflected in the ubiquitous domain language | There is one AgentTeam model and it is Agent-only by invariant; `FlatTeam` would incorrectly imply a second non-flat Team kind. | Renamed the logical record to `TeamRunExecutionTreeFileV3` and the definition to `AgentTeamDefinition` in `RER-006`. |
| 2026-08-31 | User | Persistence correction: current execution tree was intentionally generic and should be minimally reused | Avoid inventing parallel Org/Team schemas and unnecessary migration | Root already owns Agent/Team members, handoffs, addresses, launch state, and host-anchored tasks. AgentOrg removes only root coordinator semantics; child Teams keep coordinators. | Replaced separate schema-family proposal with one minimal-delta generic V3 contract in `RER-007`. |
| 2026-08-31 | User | Progressive Team-to-Org workflow clarification | Preserve the practical workflow of testing a Team before composing an Org | The same standalone AgentTeam definition must be directly reusable as an Org member; Org-scoped handoffs are the only additional workflow configuration required. | Added REQ-018, AC-013, SCN-006, and ORG-CASE-031 in `RER-008`. |
| 2026-08-31 | User | Final requirements confirmation following explicit approval request | Close the requirements approval gate | The user confirmed AgentTeam is Agent-only and coordinator-led and AgentOrg contains multiple AgentTeams and independent Agents; prior reviewed persistence, task, handoff, reuse, and migration decisions remain part of the cumulative package. | Marked `RER-009` and `AORG-CONTRACT-001` Approved and completed architecture routing. |
| 2026-08-31 | Git branch | `origin/codex/flat-agent-team-domain-simplification@c3a318812`, cherry-picked as `ca6d24dfa` | Reuse the user-identified bootstrap work | The branch supports flat Agent-only Teams, a coordinator-free AgentOrg, exact caller-selected entry, preserved rooted addresses, and separation of configured nesting from task-scoped Team execution. | Integrated supported semantics into `RER-001`; removed the duplicate imported ticket files from the current tree so this package remains canonical while preserving their commit in history. |
| 2026-08-31 | Git branch | `origin/codex/dynamic-agent-team-runtime@7d9b4ba69` | Check the concurrent-work warning in the imported branch | This draft proposes dynamic reconciliation of recursive configured Team topology and therefore conflicts with the flat target if implemented as written. It contains documentation only on the inspected commit. | Do not merge it into this requirements basis; prevent new recursive configured-Team dependencies. |
| 2026-08-31 | Doc | `autobyteus-server-ts/docs/modules/agent_team_definition.md` | Verify definition and handoff contracts | Teams support `agent` and `agent_team` members, shared/team-local/application-owned scopes, recursive graph validation, and recursive handoff compilation. | Treat removal of recursive Team membership as a contract change. |
| 2026-08-31 | Doc | `autobyteus-server-ts/docs/modules/agent_team_execution.md` | Verify runtime, addressing, memory, restore, and task behavior | Launch resolves one immutable rooted topology; nested Teams own child TeamRuns; canonical addresses, persistence, memory scope, task execution, and UI projections preserve hierarchy. | Preserve required execution semantics if the model becomes fixed-depth. |
| 2026-08-31 | Code | `autobyteus-server-ts/src/agent-team-definition/domain/models.ts` | Inspect current schema | `TeamMember.refType` is `agent | agent_team`; every Team has `coordinatorMemberName`. | Proposed flat Team changes the member contract; proposed Organization may need a distinct coordinator rule. |
| 2026-08-31 | Code | `autobyteus-server-ts/src/agent-team-definition/services/team-definition-graph-resolver.ts` and `team-handoff-compiler.ts` | Verify recursive definition mounting and handoff behavior | The resolver recursively mounts Team definitions. Handoffs authored in child definitions are rebased; root-authored handoffs can resolve cross-branch Agents/Teams. | Organization-level handoffs can model cross-Team workflow, but only inside one resolved root topology today. |
| 2026-08-31 | Code | `autobyteus-server-ts/src/agent-team-execution/services/team-definition-topology-planner.ts` | Verify run planning | Every Team and Agent placement receives exact launch settings and IDs; recursive Teams become child Team nodes. | Fixed two-level scope still requires Team placements and leaf Agents, but arbitrary recursion could be removed. |
| 2026-08-31 | Code | `autobyteus-server-ts/src/agent-team-execution/services/member-team-context-builder.ts`, `inter-agent-message-delivery-handler-builder.ts`, `team-recipient-resolver.ts` | Determine handoff/runtime boundary | `recipient_address` delivery resolves within the caller's active root TeamRun. `get_handoff_rules` returns edges already bound to that run. | Separate independently launched Teams cannot be connected merely by reusing current address handoff rules. |
| 2026-08-31 | Code | `autobyteus-server-ts/src/agent-communication/services/send-message-to-dispatcher.ts` and `global-agent-run-message-router.ts` | Check cross-run messaging | Cross-run messaging exists only through exact `target_agent_run_id` and grant-aware global routing; logical `recipient_address` requires the same Team collaboration context. | A “many independent Team runs” Organization would add cross-run discovery, lifecycle, identity, and authorization complexity rather than remove it. |
| 2026-08-31 | Doc | `autobyteus-server-ts/docs/features/shared_member_multi_team_membership_future.md` | Check adjacent planned organization behavior | Current identity deliberately equates placement, runtime ownership, event source, and metadata path. Shared membership across Teams is explicitly a larger future refactor. | Exclude shared runtime instances/multiple placements unless separately approved. |
| 2026-08-31 | Historical requirements | `tickets/done/mixed-team-nested-agent-team/requirements-doc.md`, `tickets/done/team-local-subteams/requirements.md`, `tickets/in-progress/agent-team-hierarchical-handoffs/requirements.md` | Understand why nesting exists and prior AgentOrg intent | Nesting was added for department/company structures; later handoff work explicitly reserved a separate coordinator-free AgentOrg concept. | Reconcile the new simplification request with previously approved nested/deeper-Team behavior. |
| 2026-08-31 | Data | `/home/autobyteus/workspace/autobyteus-agents/agent-teams/**/team-config.json` and `/home/autobyteus/workspace/autobyteus-private-agents/agent-teams/**/team-config.json` | Measure actual authored topology depth | Across 23 root Team packages, only 3 roots contain Team members; all locally owned child Team definitions are one level below the root, with no depth-2 child Team config. | Combined with user confirmation, this establishes the migration assumption that no deep configured-definition cohort needs support. |
| 2026-08-31 | Data | `/home/autobyteus/data/memory/agent_teams/*/team_run_execution_tree.json` | Measure persisted runtime topology depth | 41 readable run trees: 27 have no nested Team and 14 have exactly one nested-Team level; none has deeper persistent Team nesting. | Combined with user confirmation, these are the two exhaustive stored-run migration cohorts. |
| 2026-08-31 | Data | `/home/autobyteus/workspace/autobyteus-agents/agent-teams/software-development-department/team-config.json` | Validate the supplied structure and handoffs | The root has direct `requirements_engineer`, two shared Team members, and root-authored cross-Team handoffs. Child Team handoffs are recursively compiled into the root run. | This is a direct candidate for Organization + flat Team representation. |
| 2026-08-31 | Data | `/home/autobyteus/workspace/autobyteus-agents/agent-teams/northstar-operating-company/team-config.json` | Check the largest real organization example | The root contains nine independent executive Agents plus six one-level local Teams and many cross-Team handoffs; child Teams do not contain further Teams. | This also aligns with Organization + flat Teams, but migration and authoring semantics must be explicit. |
| 2026-08-31 | Code | `autobyteus-server-ts/src/agent-team-execution/domain/team-run-execution-tree.ts`, `src/run-history/store/team-run-execution-tree-schema.ts`, `src/agent-team-execution/services/team-run-execution-tree-builder.ts`, and `autobyteus-team-stream-contracts/src/team-execution-view-dtos.ts` | Determine whether native AgentOrg can reuse stored TeamRun JSON | Exact V2 root bytes require `rootTeam` and a root coordinator, but its envelope, member union, handoffs, launch state, and task lineage are already generic. | Use a minimal root naming/variant projection and narrowed validation; do not replace the tree topology. |
| 2026-08-31 | Concrete data + code reinspection | Software Development Department `team_run_execution_tree.json`, V2 domain types, root/member/task validators | Test the user's hypothesis that the current tree is already generic enough | The topology exactly matches AgentOrg: root aggregate, independent Agent, direct Team nodes with coordinators, global handoffs, and tasks at each host. Exact V2 bytes still name/require a root Team coordinator, but all nested record shapes are reusable. | Define one generic V3 root union and reuse V2 envelope/member/task records; migration is not topology reconstruction. |

## Relevant Existing Behavior And Production Paths

| Behavior ID | Kind | Supported Trigger Or Governing Contract | Current Production Path / Lifecycle | Current Outcome / Invariants | Evidence | Confidence / Unknown |
| --- | --- | --- | --- | --- | --- | --- |
| BEH-001 | Contract | Create/update/load an AgentTeam definition | Team config → source adapter → domain model → recursive graph validation | A Team may directly contain Agents and AgentTeams; cycles and invalid scoped refs are rejected. Every Team has one direct Agent coordinator. | Definition docs and domain/resolver code | High |
| BEH-002 | System | Launch an AgentTeam definition | Definition graph resolution → topology planning → root TeamRun plus child TeamRuns → immutable execution-tree snapshot | All mounted Agents and Teams share one rooted collaboration topology and canonical address space. | Execution docs and topology planner | High |
| BEH-003 | Contract | An Agent calls `get_handoff_rules` / `send_message_to(recipient_address)` | Member context filters compiled run-snapshot handoffs; recipient resolver traverses the active root TeamRun | Handoff addresses can cross nested branches inside the same root run. They do not identify a target in a separate independently launched Team run. | Handoff compiler, member context builder, dispatcher | High |
| BEH-004 | Contract | A caller targets a Team address | Team placement resolves through its configured direct Agent coordinator ingress | Coordinator-led Team targeting is deterministic; the structural root `/` is not a recipient. | Team recipient resolver and docs | High |
| BEH-005 | System | Persist, restore, stream, or inspect a Team run | Recursive execution tree and physical TeamRun ancestry govern storage, restore, events, commands, memory, task projections, and UI hierarchy | Nested placement identity is structural, not only display grouping. | Execution/memory docs, run-tree data | High |
| BEH-006 | User | Open Agent Teams catalog/detail/launch/history | Web stores and components load ownership metadata and recursively render/configure Team/Agent placements | Team-local nested Teams are hidden from the root catalog, discoverable under the owner, and shown in run hierarchy. | `autobyteus-web/docs/agent_teams.md` and related components/tests | High |
| BEH-007 | Operational | Author, run, and migrate the current supported data population | Root Team config mounts either direct Agents only or direct Agents plus one-level child Teams; root handoffs connect branches | No relevant existing definition/run has deeper configured topology; these two cohorts exhaust migration scope. | Package configs, 41 stored run trees, and explicit user confirmation | High |
| BEH-008 | Contract | Persist/restore current `team_run_execution_tree.json` V2 | Root aggregate already generically contains Agent/Team nodes, addresses, handoffs, launch state, and host-owned task lineage; strict schema names it `rootTeam`, requires root coordinator, and permits configured recursion. | Reuse topology and all child/task shapes in one generic V3 root union; Org root omits coordinator, Team roots/nodes retain it, and validation enforces fixed depth. | Concrete Software Development Department JSON, domain model, strict schema, builder, stream DTO | High |
| BEH-009 | System | Delegate a task to an AgentTeam | Task-scoped Team executions may appear structurally below the delegator but are not configured Team membership | Flat configured Teams must not accidentally remove supported Team delegation. | Task execution models and imported concept analysis | High |

## Relevant Codebase And Technical Facts

| Path / Component / Contract | Current Responsibility Or Behavior | Requirement Implication | Architecture Question Deferred Downstream |
| --- | --- | --- | --- |
| `src/agent-team-definition/domain/models.ts` | One recursive Team definition type represents both ordinary Teams and organization-like roots. | Desired semantics need a clear distinction between Organization composition and flat Team membership. | Whether to introduce a new domain subject or constrain/relabel the current subject. |
| `team-definition-graph-resolver.ts`, graph validator, scoped ref utilities, local discovery | Resolve arbitrarily recursive shared/team-local/application-owned Team graphs. | Deeper Team nesting would become invalid or legacy-only if flat Teams are adopted. | How to detect, convert, reject, or preserve old definitions. |
| `team-handoff-compiler.ts` | Recursively rebases child handoffs and validates root-relative endpoints. | Organization-level cross-Team handoffs are feasible within one shared root. | Whether Team-local handoffs remain locally authored and compiled by the Organization or move to one Organization-owned edge list. |
| `team-definition-topology-planner.ts`, `TeamRunConfig`, execution-tree models | Build and persist generic recursive Team/Agent nodes with exact per-scope launch settings, run IDs, handoffs, and tasks. | The execution tree is reused with a generalized root and narrowed configured-depth invariant; no parallel Org topology is required. | Exact target names/modules and physical file placement. |
| Mixed Team manager/subteam factory/member handles | Lazily materialize persistent child TeamRuns and route commands/events through the tree. | An Organization containing executable Teams likely still needs most child Team lifecycle behavior. | Whether flat Teams are executable sub-runs or only logical groups. |
| Memory and stored execution-tree contracts | Physical scope appends ancestor TeamRun IDs; current readers are canonical-only. | Persisted run/memory continuity is a material product decision. | Transition mechanism and compatibility window. |
| Web definition/launch/history hierarchy | Author, resolve, launch, and render recursive Team trees. | UI labels and constraints may need to distinguish Organizations from Teams, even if exact UX is later scoped. | Whether a product-design pass is needed once backend semantics are approved. |

## Structural And Payload Surface Inventory

### Payload Or Content Surfaces

- Files, records, documents, catalogs, fixtures, or generated payloads:
  - Agent package `team-config.json` and `team.md` sources.
  - Stored `team_run_execution_tree.json`, handoff snapshots, Team communication/task records, memory directory lineage, and history/catalog projections.
  - GraphQL Team definition and launch DTOs and browser-side generated contracts.
- Existing readers, writers, or contracts that consume them:
  - File definition providers, application bundle validators/importers, GraphQL resolvers/converters, run persistence/history services, web definition/run stores, and sync/package services.
- Evidence paths:
  - `autobyteus-server-ts/src/agent-team-definition`
  - `autobyteus-server-ts/src/agent-team-execution`
  - `autobyteus-server-ts/src/api/graphql/types/agent-team-definition.ts`
  - `autobyteus-web/docs/agent_teams.md`

### Structural Surfaces

- Runtime modules, shared interfaces, routes, APIs, persistence boundaries, security/concurrency controls, deployment configuration, or ownership boundaries:
  - Definition schema and graph ownership.
  - Runtime root/child Team lifecycle and immutable topology.
  - Logical addressing and recipient resolution.
  - Handoff compilation and member collaboration contexts.
  - Task delegation eligibility and task Team activation.
  - Persistence/migration, memory physical scope, history, WebSocket/GraphQL contracts, and frontend execution projection.
- Existing structural surfaces that can support the approved behavior:
  - Rooted logical addresses already distinguish `/independent_agent`, `/team`, and `/team/agent`.
  - Root-authored handoffs already connect Agents and Teams across branches.
  - Current child Teams are coordinator-led and can remain flat in observed packages.
- Evidence paths: source/doc paths listed above.

### Potential Architecture-Design Triggers

- API or external-contract change: Present if Organization becomes a distinct definition/run/API subject or Team member kinds change.
- Persistence schema or invariant change: Present; recursive Team topology and stored root Team identity are current invariants.
- Security or privacy boundary change: Unknown; separate-run cross-Team messaging would require explicit discovery/grant/authorization decisions.
- Concurrency or lifecycle change: Present if Organization owns multiple Team run lifecycles or live membership.
- Deployment, migration, ownership-boundary, architectural-pattern, or structural-refactoring change: Present.
- Confirmed absent, present, or unknown: Structural architecture impact is confirmed present for the proposed clean model change.

## Runtime, Probe, Or Reproduction Findings

| Method / Command | Scenario | Observation | Requirement Implication | Artifact / Evidence Path |
| --- | --- | --- | --- | --- |
| Python inventory of package `team-config.json` files | Measure real authored persistent Team nesting | 23 roots inspected; 3 organization-like roots use child Teams; maximum local child-Team config depth is 1. | Fixed Organization → Team → Agent depth fits all inspected authored packages. | Commands recorded in shell history; source roots under `/home/autobyteus/workspace/autobyteus-agents` and `autobyteus-private-agents`. |
| Python inventory of stored execution trees | Measure real persisted Team nesting | 41 readable trees; 14 have one nested-Team level; none is deeper. | Observed history can be represented at fixed depth, subject to transition semantics. | `/home/autobyteus/data/memory/agent_teams/*/team_run_execution_tree.json` |
| Inspection of current `send_message_to` path | Test conceptual assumption that handoffs alone connect separate flat Team runs | Logical addresses resolve only within the active root TeamRun; exact cross-run IDs use a different global route. | The simplifying target should keep one Organization collaboration/run scope unless cross-run orchestration is explicitly desired. | Dispatcher/router/resolver source files listed in Source Log. |

## Stakeholder And User Evidence

| Source / Actor | Need, Problem, Or Constraint | Evidence Strength | Requirement Implication | Open Question |
| --- | --- | --- | --- | --- |
| User / package author | Wants a simpler mental model: one organization, many flat Teams, optional independent Agents, handoff-connected workflow. | Direct user statement | Treat conceptual simplicity and fixed Team depth as the primary outcome. | Resolved for approval as one Org scope. |
| Existing Agent/Team users | Existing standalone Teams should remain useful and coordinator-led. | Current product contract and package evidence | Preserve direct launch and ordinary Team behavior. | Resolved for approval: Teams remain reusable and launchable. |
| Operators with stored runs | Need simplification without silent history/memory/identity corruption. | Local persisted data and contract-first direction | Preserve flat roots and convert the one-level organization-like cohort while keeping supported state. | Exact transition mechanism belongs to Architecture Design. |

## External Contracts, Standards, And Dependencies

| Contract / Dependency | Version / Authority | Relevant Behavior Or Constraint | Evidence | Unknown / Risk |
| --- | --- | --- | --- | --- |
| GraphQL Team definition/run contracts | Current repository | Expose recursive Team member and run topology today. | GraphQL type and execution docs | New Organization contracts may be a clean break or additive transition. |
| Agent package file contract | Current repository and package sources | `team-config.json` may contain one-level `agent_team` members and ownership scopes in the established migration population. | Definition docs, real packages, and user-confirmed migration boundary | Deeper input after transition is unsupported and rejected, not a legacy compatibility cohort. |
| Team collaboration tool contract | Current repository | `recipient_address` is root-scoped; Team targets use coordinator ingress. | Collaboration code/docs | Cross-run Organizations would need new contract decisions. |

## Persisted Data And State Facts

- Affected stored or external subject: Team definitions, stored execution trees, Team run catalog/history, communication/task records, memory paths, external/application bindings, and frontend history state may be affected.
- Location and representative shape:
  - Definitions: `/home/autobyteus/workspace/autobyteus-agents/agent-teams/**/team-config.json`
  - Runtime state: `/home/autobyteus/data/memory/agent_teams/*/team_run_execution_tree.json`
- Approximate volume: 23 inspected authored root packages across two local package repositories and 41 current readable stored TeamRun trees; the user confirms these observed zero/one-level shapes establish the relevant migration assumption.
- Current readers and writers: Definition providers/services, topology planner, run persistence/history/memory services, sync/import, GraphQL, Team streaming, and web stores.
- Current unknown/extra-field behavior: Strict execution-tree V2 validation uses exact keys; native AgentOrg cannot be represented by an unchanged alias.
- Required semantics or data that must be preserved: Unambiguous Agent/Team placement meaning, coordinator mapping, handoff edges, run identity, content/task/history, and memory reachability.
- Acceptable loss, reset, rebuild, or regeneration: Derived catalogs, indexes, UI caches, and projections may be rebuilt; durable content in the two established cohorts may not be silently deleted or reinterpreted.
- Privacy, retention, compliance, downtime, or operational constraints: No new constraints stated.
- Remaining evidence gap: The architecture-owned transition mechanism. There is no approved requirement to inventory or support a deeper legacy cohort.

## Product Design Request Context

- Product Design request in the current input: `Not stated`
- User's requested outcome, in the user's own terms: Simplify the backend/team concept; no request for a prototype or visual design was made.
- Requirement / behavior IDs involved: `BEH-001`–`BEH-007`
- Product decision, uncertainty, or experience to understand or evolve: Backend/domain model and mental model; UI terminology may be affected later.
- Critical journey and states: Definition authoring, launch, handoff, history/restore.
- Known constraints and non-goals: Do not invent a prototype request.
- Relevant existing-product or frontend context supplied or established: The supplied hierarchy screenshot and current recursive UI behavior.
- Product Design request artifact / message reference: `N/A`
- Established separate prototype repository/root and ticket reference, when applicable: `N/A`

## Product Design Findings

- Product Design package path: `N/A — not requested`
- Visualizer or prototype source path: `N/A`
- Approved UI/UX specification path: `N/A`
- Review URL: `N/A`
- Explicit user-confirmation reference: `N/A`
- Journeys and scenarios validated: `N/A`
- Final visual-reference paths: `N/A`
- Product decisions supported by evidence: `N/A`
- Alternatives rejected or still open: See `Assumptions And Resolved Decisions` in `requirements-doc.md`; target behavior and migration cohorts are resolved for approval.
- Mocked boundaries and production gaps: `N/A`
- Requirements sections affected: `N/A`

## Supplemental Artifact Inventory

| Artifact Path | Owner | Purpose | Scope | Related Requirement / AC IDs | Status | Approval Applicability / State |
| --- | --- | --- | --- | --- | --- | --- |
| `/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/requirements_engineer_6568eac682114f2cb3ddb8f1d91d3c34/context_files/ctx_4cc02361f417__image.png` | User | Representative current hierarchy | Evidence only | Draft model | Supplied | No separate approval required |
| `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/agent-org-contract.md` | Requirements Engineer | Single normative configured structure, progressive Team reuse, generic minimal-delta V3 tree, task anchoring, and V2 projection contract | AgentOrg/AgentTeam scope | REQ-001–REQ-018 / AC-001–AC-013 / PRE-001–PRE-005 | Approved | Included in `RER-009` approval basis |
| `origin/codex/flat-agent-team-domain-simplification@c3a318812` (local cherry-pick `ca6d24dfa`) | Prior bootstrap author | Imported concept and investigation evidence | Flat Team/AgentOrg distinction and task/configured nesting boundary | BEH-001, BEH-004, BEH-009 | Integrated / superseded by canonical package | Evidence only; duplicate imported drafts are not authoritative |

## Assumptions, Unknowns, And Risks

| ID | Type | Description | Why It Matters | Resolution / Owner | Status |
| --- | --- | --- | --- | --- | --- |
| ASM-001 | Assumption | The user's main goal is a simpler, fixed-depth composition model rather than distributed orchestration across separately running Teams. | The latter is structurally more complex and contradicts the stated simplification goal. | Included in `RER-009` approval basis. | Approved |
| DEC-001 | Decision | AgentOrg has no coordinator; a caller selects an exact Agent or Team entry target. | Avoids synthetic root-Team semantics while preserving Team coordinators. | Imported branch concept plus user confirmation. | Approved |
| DEC-002 | Decision | The relevant migration population contains only flat roots and one-level organization-like roots; no deep legacy compatibility path is required. | Keeps migration bounded while preserving all established data. | Data inventory plus explicit user confirmation. | Approved |
| RISK-001 | Risk | Introducing AgentOrg without removing Team recursion could produce two overlapping hierarchy models. | Product complexity would increase instead of decrease. | REQ-001, REQ-002, and REQ-008 make the boundary exclusive. | Controlled by requirements |
| RISK-002 | Risk | Treating flat Teams as separate root runs would require new cross-run discovery/lifecycle/security behavior. | This misses the simplification objective. | One AgentOrg run/scope is part of the approval basis. | Controlled by requirements |
| RISK-003 | Risk | Fixed depth still needs Team execution scope, exact addresses, lifecycle, handoffs, persistence, and UI hierarchy. | Simplification is not equivalent to deleting all hierarchy machinery. | Preserve observable semantics; Architecture Design owns structure. | Open downstream risk |
| RISK-004 | Risk | The dynamic-AgentTeam draft could add new recursive configured-Team mutation before this simplification lands. | It would deepen the dependency being removed. | REQ-017 forbids that dependency; reconcile the branch before implementation. | Controlled by requirements |

## Requirement Implications

1. The user's instinct is supported by observed usage: all inspected organization-like packages and stored runs use exactly Organization → Team → Agent depth, not arbitrary recursive Teams.
2. The current root Team already provides the shared address and handoff graph the proposed Organization needs. A fixed-depth Organization can preserve `/agent`, `/team`, and `/team/agent` placement semantics.
3. Current handoff rules do not connect independent root runs by logical address. Therefore one Organization run/collaboration scope is the simpler target; independent Team runs connected dynamically would be a different, larger capability.
4. Flat Teams remain coordinator-led, while AgentOrg is coordinator-free and requires exact caller-selected targeting.
5. The current V2 topology already is the target generic execution tree. Exact V2 root bytes need a minimal versioned projection because `rootTeam` requires a coordinator, but envelope/member/handoff/task records do not need redesign.
6. The established migration input has no deeply nested configured topology, so Architecture Design does not need a deep legacy conversion or compatibility branch.
7. Removing recursive nesting is a structural contract/persistence change, not a local cleanup. Architecture Design will be required after requirements approval.

## Notes For Downstream Architecture Design Or Direct Implementation

- Preserve the distinction between domain semantics and reused persistence topology. AgentOrg is a distinct root subject, but it must reuse the current generic execution tree rather than introduce a parallel tree architecture.
- Verify the complete definition/API/persistence/frontend transition surface for the two established migration cohorts and permanent rejection of deeper configured input.
- Preserve current root-scoped logical addressing and coordinator targeting unless requirements explicitly change them.
- Do not introduce cross-process or shared-member placement semantics under this simplification request without a separate approved requirement.
