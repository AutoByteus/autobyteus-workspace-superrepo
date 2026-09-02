# Design Review Report

## Review Round Meta

- Upstream Requirements Doc: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md` (`RER-021`, approved commit `ed236a63e8905432a6bb45e826c82856e620e7dc`; cumulative runtime/durable authority remains `RER-018`)
- Upstream Investigation Notes: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`
- Upstream Requirements Revision Record: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md`
- Reviewed Design Spec: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md` (`AD-REV-010`, architecture commit `820b6d02f13e96874f10bf78eda92b1e8327fa82`)
- Supplemental Task Artifacts Reviewed: approved `AORG-CONTRACT-001`; Product `RV-012`, `VIS-001`-`VIS-020`, `BASELINE-PROMOTION-001`, and the approved mounted-Team-status supplement; repository `production_data_migration_conventions.md`; `architecture-design-self-validation.md`; source through `IR-012@73a2c06eb14e3c5a7d91322aae7f42dbc4de0e0a`; source-review history through `CRR-013`; retained API/E2E submit/accept, approval-wait, and shutdown evidence
- Architecture Design Revision Record Reviewed: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-revision-record.md`
- Relevant Architecture Design Revision IDs: `AD-REV-001`-`AD-REV-010`
- Architecture Review Revision Record: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`
- Current Architecture Review Revision ID: `ARCH-REV-008`
- Current Review Round: `8`
- Trigger: `AD-REV-010` responds to `ARCH-REV-007 / AR-FIND-004` with an AgentRun-owned root-shutdown admission/provider-start/interrupt fence, stable recursive Team/Org scopes, and a pre-`TURN_STARTED` supported validation path.
- Prior Review Round Reviewed: `ARCH-REV-007 / Fail — Design Impact`
- Latest Authoritative Round: `ARCH-REV-008 / Round 8`
- Current-State Evidence Basis: current and `origin/personal` AgentRun source/tests establish the claim-to-provider-start gap, ordinary FIFO-draining termination, the existing pre-forward cancellation lifecycle, and active-turn interrupt behavior. Current Team/Org root, operation-gate, task-release, and frozen-scope sources establish the supported SIGTERM path and required stable ownership. The AD-REV-010 diff changes only three Architecture-owned artifacts. Downstream dirty tests, reports, API/E2E evidence, fixtures, and generated outputs were read-only and were not edited, staged, reset, or claimed.

## Routing Classification Review

- Task size (`Small`/`Medium`/`Large`): `Large`
- Architectural risk (`Low`/`High`): `High`
- Classification rationale reviewed: `Confirmed`. The focused AD-REV-010 correction is `Medium / High` because it changes shared Agent input/turn synchronization and both root shutdown sequences. The cumulative package remains `Large / High` across definition, runtime, persistence, migration, API/stream/history, task, lifecycle, and frontend boundaries.
- Independent Architecture Review required by the classification: `Yes`
- Classification evidence or correction required: None.

## Upstream Behavior And Production-Path Basis Confirmation

- Overall Basis Status (`Confirmed`/`Contradicted`/`Blocked`): `Confirmed`
- Approved requirements / intended behavior understood: `Yes`. `BEH-009`, `REQ-015`, and `AC-010` preserve supported task activation, recursive task-Team lineage, settlement/review/history, exact host ownership, and graceful root shutdown. The other cumulative behavior and Product authorities remain unchanged.
- Relevant existing behavior and evidence confirmed: `Yes`. Normal task activation releases input asynchronously; AgentRun can start provider work before canonical `TURN_STARTED`; the existing input contract already distinguishes pre-forward cancellation from forwarded/interrupted work; ordinary non-root AgentRun termination drains admitted FIFO; task settlement uses one root FIFO and existing prepared settlement.
- Scope guardrail confirmed (`In-Scope Use Cases` / `Out of Scope` / `Preserved Behavior Boundary` / `Review Authority`): `Yes`. The design must not add self-review support, timeout/replay/force-kill, a second settlement owner, new persisted task state, or mounted-Team root authority.
- Approved change, preserved behavior, and outside scope understood: `Yes`
- Every prospective blocking `Design Impact` finding is traceable to an approved requirement, acceptance criterion, or preserved-behavior ID (`Yes`/`No`): `Yes — AR-FIND-005 protects BEH-009 / REQ-015 / AC-010 and the approved one-root task lineage/settlement behavior.`
- Remaining material ambiguity, if any: No requirements or Product ambiguity. One Architecture-owned self-validation statement contradicts the current core design.

| Behavior ID | Kind | Design Alignment With Approved Intent (`Pass`/`Fail`) | Approved Trigger / Contract And Current-State Evidence (`Pass`/`Fail`/`Unclear`) | Target Outcome / Path / Spine Coherence (`Pass`/`Fail`/`Unclear`) | Status (`Confirmed`/`Needs Correction`/`Unclear`) | Required Action |
| --- | --- | --- | --- | --- | --- | --- |
| BEH-001-BEH-008 | Cumulative contract/system/user/durable behavior | Pass | Pass | Pass | Confirmed | None; prior two-family, migration, presentation, and lifecycle decisions remain unchanged. |
| BEH-009 | Task and root-lifecycle behavior | Pass | Pass | Fail | Needs Correction | Keep the coherent AD-REV-009/010 one-FIFO target, but correct stale VAL-006 text that still directs independent concurrent cleanup outside that FIFO. |
| BEH-010-BEH-011 | Admission and mounted-Team presentation | Pass | Pass | Pass | Confirmed | None; AD-REV-010 changes neither area. |

## Supplemental Artifact Coherence Verdict

| Artifact | Purpose And Scope Are Clear? (`Pass`/`Fail`) | Linked To Relevant Core Artifacts? (`Pass`/`Fail`) | Internally Complete? (`Pass`/`Fail`) | Consistent With Related Core Artifacts? (`Pass`/`Fail`) | Status And Approval Applicability Are Clear? (`Pass`/`Fail`) | Required Action |
| --- | --- | --- | --- | --- | --- | --- |
| Requirements, investigation inventory, and `agent-org-contract.md` | Pass | Pass | Pass | Pass | Pass | None. No Requirement or Product gap is introduced. |
| Product authorities and migration convention | Pass | Pass | Pass | Pass | Pass | None; AD-REV-010 changes no Product or migration contract. |
| `design-spec.md` and `architecture-design-revision-record.md` (`AD-REV-010`) | Pass | Pass | Pass | Pass | Pass | None. The root fence, scope composition, state table, ownership, files, ordering, removals, and tests are actionable. |
| `architecture-design-self-validation.md` (`AD-REV-010`) | Pass | Pass | Fail | Fail | Pass | VAL-006 lines 276-278 retain AD-REV-008's independent cleanup-job/concurrent-outside-FIFO direction, contradicting VAL-026/029 and the current core design. Correct it before implementation. |
| Source and retained downstream evidence | Pass | Pass | Pass | Pass | Pass | Evidence establishes the supported path and current boundaries; it does not claim implementation of AD-REV-010. |

## Task Design Health Assessment Verdict

| Assessment Area | Result (`Pass`/`Fail`) | Evidence | Required Action |
| --- | --- | --- | --- |
| Assessment is present for the current task posture | Pass | Focused and cumulative classifications, supported trigger, root cause, bounded refactor, removals, file map, and validation plan are explicit. | None. |
| Root-cause classification is explicit and evidence-backed | Pass | Normal task release plus supported SIGTERM reaches the pre-turn window without self-review or hidden mutation. | None. |
| Refactor needed now / no refactor needed / deferred decision is explicit | Pass | A bounded AgentRun fence and root-scope composition are selected; AD-REV-008 machinery remains rejected. | None. |
| Refactor decision is supported by concrete design sections or residual-risk rationale | Pass | State transitions, authoritative owner, root sequence, files, removals, and deterministic coverage are specified. | None; only the contradictory supplemental walkthrough must be corrected. |

## Spine Inventory Verdict

| Spine ID | Scope | Spine Is Readable? (`Pass`/`Fail`) | Narrative Is Clear? (`Pass`/`Fail`) | Facade Vs Governing Owner Is Clear? (`Pass`/`Fail`/`N/A`) | Main Domain Subject Naming Is Clear? (`Pass`/`Fail`) | Ownership Is Clear? (`Pass`/`Fail`) | Off-Spine Concerns Stay Off Main Line? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DS-000-DS-014, DS-016-DS-021 | Previously reviewed cumulative spines | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| DS-015 | Process/root shutdown through stable scope and AgentRun fence | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| DS-022 | One-FIFO terminal settlement through non-waiting quiescence preparation | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| VAL-006 | Recursive task-Team terminal lineage walkthrough | Pass | Fail | Pass | Pass | Fail | Fail | Fail |

## Boundary Encapsulation Verdict

| Boundary / Owner | Authoritative Public Entry Point Is Clear? (`Pass`/`Fail`) | Internal Owned Mechanisms Stay Internal? (`Pass`/`Fail`) | Caller Bypass Risk Is Controlled? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Previously reviewed subject services, roots, stores, migration, presentation, and web owners | Pass | Pass | Pass | Pass | Prior conclusions remain valid. |
| `AgentRun.fenceInputAndInterruptForRootShutdown()` | Pass | Pass | Pass | Pass | One exact AgentRun owner serializes admission, provider-start registration, canonical turn, interrupt, and terminal lifecycle. |
| Frozen Team/Org scopes and configured handles | Pass | Pass | Pass | Pass | Scopes enumerate immutable direct/mounted/task/prepared descendants and only forward the narrow fence. |
| Root task terminal settlement documentation | Pass | Fail | Pass | Fail | Core DS-022 is singular; VAL-006 incorrectly retains an independent cleanup-job/concurrency boundary. |

## Dependency Direction / Forbidden Shortcut Verdict

| Owner / Boundary | Allowed Dependencies Are Clear? (`Pass`/`Fail`) | Forbidden Shortcuts Are Explicit? (`Pass`/`Fail`) | Direction Is Coherent With Ownership? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Cumulative Team/Org definition/runtime/presentation boundaries | Pass | Pass | Pass | Pass | No public/durable root union, mounted-Team root, try-both reader, or subject-store bypass is reintroduced. |
| Root shutdown -> frozen local scope -> configured handle -> AgentRun | Pass | Pass | Pass | Pass | No caller inspects AgentRun input internals beside the authoritative fence. |
| Task engine -> subject adapter -> exact local execution | Pass | Fail | Fail | Fail | Core direction remains one FIFO; VAL-006's independent concurrent cleanup claim conflicts with that owner. |

## Interface Boundary Verdict

| Interface / API / Query / Command / Method | Subject Is Clear? (`Pass`/`Fail`) | Responsibility Is Singular? (`Pass`/`Fail`) | Identity Shape Is Explicit? (`Pass`/`Fail`) | Generic Boundary Risk (`Low`/`Medium`/`High`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- | --- |
| Existing public Team/Org/Agent/task/message APIs | Pass | Pass | Pass | Low | Pass |
| `AgentRun.tryPrepareTerminationIfQuiescent()` | Pass | Pass | Pass | Low | Pass |
| `AgentRun.fenceInputAndInterruptForRootShutdown()` | Pass | Pass | Pass | Low | Pass |
| `ConfiguredAgentExecutionHandle.fenceForRootShutdown()` and `FrozenTeamRunTerminationScope.fenceAgentRunsForRootShutdown()` | Pass | Pass | Pass | Low | Pass |

## Existing Capability / Subsystem Reuse Verdict

| Need / Concern | Existing Capability Area Was Checked? (`Pass`/`Fail`) | Reuse / Extension Decision Is Sound? (`Pass`/`Fail`) | New Support Piece Is Justified? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Pre-forward versus provider-started shutdown truth | Pass | Pass | Pass | Pass | Reuses existing cancellation, failure, forwarded/association, interrupt, and terminal facts under AgentRun. |
| Stable complete Team/Org shutdown scope | Pass | Pass | Pass | Pass | Reuses Team's gate/frozen scope and adds private Org equivalents without mounted-Team root authority. |
| One-FIFO terminal settlement | Pass | Pass | N/A | Fail | The core reuse decision is sound, but VAL-006 still directs withdrawn independent cleanup concurrency. |
| Ordinary AgentRun termination | Pass | Pass | N/A | Pass | FIFO draining is explicitly preserved and regression-tested separately from root shutdown. |

## Subsystem / Capability-Area Allocation Verdict

| Subsystem / Capability Area | Ownership Allocation Is Clear? (`Pass`/`Fail`) | Reuse / Extend / Create-New Decision Is Sound? (`Pass`/`Fail`) | Supports The Right Spine Owners? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| AgentRun input/turn lifecycle | Pass | Pass | Pass | Pass | Owns both nullable preparation and irreversible root fence. |
| Shared collaboration task engine/queue | Pass | Pass | Fail | Fail | Core design is coherent; its Architecture-owned validation supplement gives a conflicting concurrency contract. |
| Team/Org roots and frozen scopes | Pass | Pass | Pass | Pass | Close/drain/freeze/fence precedes task drain for both families. |

## Reusable Owned Structures Verdict

| Repeated Structure / Logic | Extraction Need Was Evaluated? (`Pass`/`Fail`) | Shared File Choice Is Sound? (`Pass`/`Fail`/`N/A`) | Ownership Of Shared Structure Is Clear? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| AgentRun shutdown input-state transition | Pass | Pass | Pass | Pass | Singular owner; no root/task-specific duplicate. |
| Recursive frozen Team scope composed by Org | Pass | Pass | Pass | Pass | Composition avoids a public generic root and standalone mounted Team. |
| Terminal task settlement | Pass | Pass | Fail | Fail | The core says existing FIFO/sweep/prepared settlement; VAL-006 still names independent cleanup jobs. |
| Mounted-Team status fold/dot and accepted workspace surfaces | Pass | Pass | Pass | Pass | Prior reviewed reuse remains unchanged. |

## Shared Structure / Data Model Tightness Verdict

| Shared Structure / Type / Schema | One Clear Meaning Per Field? (`Pass`/`Fail`) | Redundant Attributes Removed? (`Pass`/`Fail`) | Overlapping Representation Risk Is Controlled? (`Pass`/`Fail`) | Shared Core Vs Specialized Variant / Composition Decision Is Sound? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| AgentRun input lifecycle facts | Pass | Pass | Pass | Pass | Pass | Existing cancellation is used only before provider start; provider-started work remains canonical failure/interrupt truth. |
| Prepared task settlement | Pass | Pass | Fail | Pass | Fail | No new persisted/job/token representation exists in the core design, but VAL-006 implies another runtime representation/owner. |
| Team V2 / AgentOrg V1 durable families | Pass | Pass | Pass | Pass | Pass | Prior exact separate-family boundary remains unchanged. |

## File Responsibility Mapping Verdict

| File | Responsibility Is Singular And Clear? (`Pass`/`Fail`) | Responsibility Matches The Intended Owner/Boundary? (`Pass`/`Fail`) | Responsibilities Were Re-Tightened After Shared-Structure Extraction? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| `agent-run.ts` / `agent-run-input-admission-state.ts` | Pass | Pass | Pass | Pass | Atomic fence, lifecycle truth, and ordinary-termination separation are explicit. |
| Configured/local Agent handles and frozen Team scope | Pass | Pass | Pass | Pass | Narrow forwarding and immutable enumeration only. |
| Team/Org roots, Org operation gate, Org frozen scope | Pass | Pass | Pass | Pass | Root phase ordering and private ownership are explicit. |
| Existing task queue/engine/adapters | Pass | Pass | Pass | Pass | No source file for a coordinator/job graph is authorized. |

## Subsystem / Folder / File Placement Verdict

| Path / Item | Target Placement Is Clear? (`Pass`/`Fail`) | Folder Matches Owning Boundary? (`Pass`/`Fail`) | Mixed-Layer Or Over-Split Risk (`Low`/`Medium`/`High`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| `agent-execution/{domain,input}` fence | Pass | Pass | Low | Pass | Exact lifecycle owner. |
| `agent-collaboration/execution/backends` forwarding | Pass | Pass | Low | Pass | Root-neutral capability only. |
| Team/Org local scope and root composition | Pass | Pass | Low | Pass | Org additions remain private and mounted Teams remain rootless. |
| `agent-collaboration/execution/task` | Pass | Pass | Low | Pass | Existing queue/sweep remains; no new file is required. |

## Removal / Decommission Completeness Verdict

| Item / Area | Redundant / Obsolete Piece To Remove Is Named? (`Pass`/`Fail`) | Replacement Owner / Structure Is Clear? (`Pass`/`Fail`/`N/A`) | Removal / Decommission Scope Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Active-turn-only root interruption wrapper | Pass | Pass | Pass | Pass | Clean-cut replaced by the recursive AgentRun fence; ordinary user interrupt stays unchanged. |
| AD-REV-008 coordinator/token/jobs/dependency graph | Pass | Pass | Fail | Fail | Core design and VAL-026/029 reject it, but VAL-006 still affirmatively describes cleanup jobs/concurrent leaves outside the FIFO. |
| Prior synthetic roots, raw Org UI, and runtime legacy readers | Pass | Pass | Pass | Pass | Remain removed/rejected. |

## Legacy / Backward-Compatibility Verdict

| Area | Compatibility Wrapper / Dual-Path / Legacy Retention Exists? (`Yes`/`No`) | Clean-Cut Removal Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- |
| AD-REV-010 Agent/task lifecycle path | No | Pass | Pass | No second shutdown, settlement, API, or persisted-state path. |
| Team V2 / Org V1 and registered migration | Yes | Pass | Pass | Migration-only historical codecs; prior reviewed boundary is unchanged. |

## Persisted-Data Transition Verdict (When Applicable)

| Area / Stored Subject | Approved Decision | Representative Reader / Semantic / Invariant Evidence Is Sufficient? (`Pass`/`Fail`) | Direct Use, Rebuild, Or Migration Choice Is Proportionate? (`Pass`/`Fail`) | Migration Safety Is Complete If Required? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| AD-REV-009/010 task records and AgentRun fence | `Directly Usable — No Migration` | Pass | Pass | N/A | Pass | Existing task states, `settledAt`, and input lifecycle facts remain exact; no shutdown state is persisted. |
| Cumulative Team/Org family transition | `Migration Required` for approved cohorts | Pass | Pass | Pass | Pass | AD-REV-004 convention-aligned decision remains unchanged. |

## Change / Refactor Safety Verdict

| Area | Sequence Is Realistic? (`Pass`/`Fail`) | Temporary Seams Are Explicit? (`Pass`/`Fail`) | Cleanup / Removal Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- |
| AgentRun fence and Team/Org root ordering | Pass | Pass | Pass | Pass |
| AD-REV-008 settlement machinery removal | Pass | Pass | Fail | Fail |
| Prior cumulative architecture through AD-REV-007 | Pass | Pass | Pass | Pass |

## Example Adequacy Verdict

| Topic / Area | Example Was Needed? (`Yes`/`No`) | Example Is Present And Clear? (`Pass`/`Fail`/`N/A`) | Bad / Avoided Shape Is Explained When Helpful? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Pre-`TURN_STARTED` SIGTERM ordering | Yes | Pass | Pass | Pass | State table and VAL-027 cover both serialization winners and active approval wait. |
| Ordinary versus root termination | Yes | Pass | Pass | Pass | FIFO drain remains ordinary behavior; root fence is irreversible and uses existing facts. |
| Recursive task-Team terminal settlement | Yes | Fail | Pass | Fail | VAL-006 conflicts with the one-FIFO VAL-026/029 and core DS-022 example. |
| Cumulative definition/runtime/persistence/presentation | Yes | Pass | Pass | Pass | Prior examples remain adequate. |

## Material Premise Validation (Only When Needed)

### `AR-PREM-001` — Process interruption during the registered migration

- Related approved requirement or established contract: repository `Production Data-Migration Conventions`; `REQ-012`, `REQ-013`, `REQ-027`
- Relevant behavior ID(s): `BEH-005`, `BEH-007`, `BEH-010`
- Initiating basis kind: `Operational` / `System`
- Independent product-supported initiating trigger or applicable governing contract: The canonical convention assigns later startup retry to the existing runner after an incomplete-attempt interruption.
- Support evidence: convention plus current runner/startup behavior.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: startup -> migration -> atomic write/direct rename -> interruption -> later startup -> runner reclassification/completion.
- Lifecycle preconditions and material consequence at the claimed point: deterministic old/prospective-target/target observations under ordinary filesystem guarantees.
- Reachability: `Reachable`
- Review consequence / proportionate response: Prior one-relaunch/idempotence design remains proportionate; AD-REV-010 does not change it.

### `AR-PREM-002` — Arbitrary corruption, hostile tampering, or adversarial concurrent writer

- Related approved requirement or established contract: repository migration-convention reachability gate
- Relevant behavior ID(s): `BEH-007`
- Initiating basis kind: `Contract`
- Independent product-supported initiating trigger or applicable governing contract: None.
- Support evidence: No approved product/security/operations contract initiates this premise.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: None.
- Lifecycle preconditions and material consequence at the claimed point: Unsupported external mutation/infrastructure failure.
- Reachability: `Not Reachable`
- Review consequence / proportionate response: It drives no finding or machinery.

### `AR-PREM-003` — Run-authority rename succeeds but directory finalization is indeterminate

- Related approved requirement or established contract: existing Team atomic-writer/fail-stop contract; `QR-004`
- Relevant behavior ID(s): `BEH-005`, `BEH-008`, `BEH-009`
- Initiating basis kind: `Contract` / `System`
- Independent product-supported initiating trigger or applicable governing contract: A supported mutation enters the established writer, whose result contract identifies renamed/finalization-indeterminate.
- Support evidence: committed writer/coordinator contracts and prior AD-REV-005 review.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: supported mutation -> coordinator -> rename -> finalization indeterminate -> root fail-stop.
- Lifecycle preconditions and material consequence at the claimed point: Durable content may change while live publication cannot be treated as ordinary retry.
- Reachability: `Reachable`
- Review consequence / proportionate response: Whole-root fail-stop remains proportionate; AD-REV-010 does not change it.

### `AR-PREM-004` — Independent accept overlaps the assignee's still-finishing normal provider turn

- Related approved requirement or established contract: `BEH-009`, `REQ-015`, `AC-010`; preserved task submission/review/settlement behavior
- Relevant behavior ID(s): `BEH-009`
- Initiating basis kind: `User` / `System`
- Independent product-supported initiating trigger or applicable governing contract: A normal task assignee submits, and the different authorized delegator independently accepts before the provider turn finishes.
- Support evidence: retained exact submit/accept trace prefix; invalid self-review tail excluded.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: submit tool -> durable awaiting-review -> independent accept -> terminal sweep while the assignee provider turn is still open.
- Lifecycle preconditions and material consequence at the claimed point: Waiting preparation at the FIFO head would starve an unrelated command.
- Reachability: `Reachable`
- Review consequence / proportionate response: AD-REV-009's nullable non-waiting preparation, FIFO release, and idle retry remain justified.

### `AR-PREM-005` — Application shutdown while a task Agent awaits legitimate tool approval

- Related approved requirement or established contract: application-owned graceful shutdown; `BEH-009`, `REQ-015`, `AC-010`
- Relevant behavior ID(s): `BEH-009`, `DS-015`
- Initiating basis kind: `Operational` / `System`
- Independent product-supported initiating trigger or applicable governing contract: Product supports disabling auto-approval, and the application supports SIGTERM shutdown.
- Support evidence: Product UI specification; `server-runtime.ts`; accepted runtime interrupt test.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: normal delegated task -> approval-gated tool wait -> SIGTERM -> process supervisor -> owning Team/Org root.
- Lifecycle preconditions and material consequence at the claimed point: Task drain before interruption can wait on the approval that interruption must release.
- Reachability: `Reachable`
- Review consequence / proportionate response: Fence/interrupt before task drain remains justified; no timeout/replay/force-kill is authorized.

### `AR-PREM-006` — A normal task input is admitted before canonical turn start during application shutdown

- Related approved requirement or established contract: normal task activation and application-owned graceful shutdown; `BEH-009`, `REQ-015`, `AC-010`
- Relevant behavior ID(s): `BEH-009`, `DS-015`
- Initiating basis kind: `System` / `Operational`
- Independent product-supported initiating trigger or applicable governing contract: A supported task activation releases initial work; independently, the application receives SIGTERM.
- Support evidence: Team/Org task activation `releaseWork`, task registry post, AgentRun claim/start source, SIGTERM handler, active-turn interrupt behavior.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: `delegate_task` -> durable activation -> initial post -> admitted/claimed/provider-start-pending input, concurrent with SIGTERM -> owning root.
- Lifecycle preconditions and material consequence at the claimed point: The signal arrives before canonical `TURN_STARTED`; without an AgentRun fence, a provider turn could start after the old active-turn-only phase.
- Reachability: `Reachable`
- Review consequence / proportionate response: `AD-REV-010` resolves `AR-FIND-004`. The same AgentRun dispatch owner now orders the fence against provider start, uses existing pre-forward cancellation, tracks provider-started work through canonical interruption, and prevents post-fence provider invocation across stable Team/Org scopes.

No new material premise is required for AR-FIND-005: recursive task-Team delegation and settlement are expressly supported by `BEH-009` / `REQ-015` / `AC-010`, and the finding is a direct contradiction between Architecture-owned artifacts rather than an inferred edge scenario.

## Unresolved Approved-Behavior Or Current-State Gaps

| Item | Why It Matters | Required Action | Status |
| --- | --- | --- | --- |
| VAL-006 retains withdrawn independent cleanup-job/concurrent-outside-FIFO semantics | It gives implementation two incompatible terminal-settlement ownership and ordering contracts for supported recursive task Teams. | Rewrite VAL-006 to the existing deepest-first sweep, one root FIFO, nullable quiescence attempt, existing prepared settlement, and no independent job/concurrency path; verify no affirmative AD-REV-008 machinery remains. | Open — Design Impact |

## Review Decision

`Fail` — AD-REV-010 substantively resolves AR-FIND-004: its singular AgentRun fence, exact input-state dispositions, stable recursive scope, and fence-before-task-drain ordering are coherent and proportionate. However, the authoritative self-validation still contains one material AD-REV-008 statement: VAL-006 says independent terminal leaves clean up concurrently through cleanup jobs outside the root FIFO, while the current design and VAL-026/029 require one existing FIFO and explicitly reject such jobs. Implementation remains held until the Architecture package gives one consistent task-settlement contract.

## Findings

### AR-FIND-005 — Recursive task-Team self-validation retains withdrawn independent cleanup concurrency

- Type: `Design Impact`
- Severity: `High`
- Approved requirement, acceptance criterion, or preserved-behavior ID protected: `BEH-009`, `REQ-015`, `AC-010`
- Scope status: `Within Approved Scope`
- Whether the required update changes approved behavior: `No — it removes a stale contradictory Architecture statement and restores the current approved one-root task-settlement direction.`
- Affected approved behavior, relevant existing behavior, journey, or established contract: normal recursive task Agent/Team delegation, deepest-first terminal eligibility, and exact Team/Org root task settlement
- Evidence: `architecture-design-self-validation.md` VAL-006 lines 276-278 states that a parent waits for child “cleanup job” completion while independent terminal leaves clean up concurrently and never occupy the root FIFO. That text was introduced in AD-REV-008 and survived AD-REV-009/010. The current `design-spec.md` withdraws the coordinator/token/independent-job/dependency-graph/outside-FIFO design, preserves one `RootTaskLifecycleCommandQueue`, and says final cleanup for a quiescent execution remains serialized by the existing FIFO. VAL-026 rejects concurrent task mutations/cleanup coordination, and VAL-029 rejects an independent cleanup job beside the task tree.
- Material-premise validation ID: `N/A — the contradiction applies directly to approved BEH-009 recursive task lineage and does not depend on an assumed production scenario.`
- Required update: revise VAL-006's terminal path to the authoritative current design: deepest-first leaf eligibility, the existing root FIFO, `tryPrepareTerminationIfQuiescent -> null` with FIFO release and idle retry, or existing prepared settlement/finish for a quiescent leaf; parent eligibility follows settled children. Remove the affirmative independent cleanup-job/concurrent-outside-FIFO statement and verify that remaining AD-REV-008 references are historical or explicit rejections only. Do not change the coherent AD-REV-009/010 core design or add any source/API/schema/Product behavior.
- Why the required update is proportionate to the verified consequence: it is a narrow Architecture-document correction that prevents implementation from recreating the withdrawn second settlement lane. It requires no behavior or production machinery change.
- Recommended recipient: `/software_engineering_team/architecture_designer`

## Classification

`Design Impact` — the core AD-REV-010 shutdown design is sound, but its authoritative self-validation must be made consistent before implementation proceeds.

## Recommended Recipient

`/software_engineering_team/architecture_designer`

## Residual Risks

- `AR-FIND-004` is resolved: AD-REV-010 closes input admission, serializes provider start, uses exact existing lifecycle facts, prevents post-fence provider invocation, covers direct/mounted/task/prepared/recursive Agent scopes, and places the fence before task drain for Team and Org roots.
- `AR-FIND-003` remains resolved; AD-REV-008's broad coordinator/token/job design remains unsupported and withdrawn.
- `AR-FIND-001`/`AR-FIND-002`, `ADI-006`, `IDI-001`, `ADI-007`, and `API-FIND-007`/`CR-FIND-011` remain resolved at the design boundary.
- After the documentation correction, implementation must still prove exact lifecycle-fact uniqueness, no provider start after fence completion, ordinary FIFO-draining Agent termination, immutable complete scope enumeration, no prepared-cancel reopen, one-FIFO recursive settlement, and both root phase orderings.
- Downstream dirty tests/evidence/reports remain owned by their current stages.

## Latest Authoritative Result

- Review Decision: `Fail`
- Material-Premise Gate (`Pass`/`Fail`/`Blocked`): `Pass`
- Notes: `ARCH-REV-008` verifies that `AD-REV-010` resolves `AR-FIND-004` without new public/durable behavior, but records `AR-FIND-005 / Design Impact` for the stale contradictory VAL-006 independent-cleanup statement. No Requirement Gap or Product UI gap exists, and no implementation handoff is authorized.
