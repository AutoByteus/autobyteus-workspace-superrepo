# Design Review Report

## Review Round Meta

- Upstream Requirements Doc: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-doc.md` (`RER-021`, approved commit `ed236a63e8905432a6bb45e826c82856e620e7dc`; cumulative runtime/durable authority remains `RER-018`)
- Upstream Investigation Notes: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/investigation-notes.md`
- Upstream Requirements Revision Record: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/requirements-revision-record.md`
- Reviewed Design Spec: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/design-spec.md` (`AD-REV-009`, architecture commit `cd75bcdbfb97fd1707c5954db43dbbac65844da6`)
- Supplemental Task Artifacts Reviewed: approved `AORG-CONTRACT-001`; Product `RV-012`, `VIS-001`-`VIS-020`, `BASELINE-PROMOTION-001`, and the approved mounted-Team-status supplement; repository `production_data_migration_conventions.md`; `architecture-design-self-validation.md`; source through `IR-012@73a2c06eb14e3c5a7d91322aae7f42dbc4de0e0a`; source-review history through `CRR-013`; API/E2E clean control, exact submit/independent-accept traces, two-task technical correlation, boundary assertion log, and accepted approval-interrupt runtime test
- Architecture Design Revision Record Reviewed: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-design-revision-record.md`
- Relevant Architecture Design Revision IDs: `AD-REV-001`-`AD-REV-009`
- Architecture Review Revision Record: `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model/tickets/in-progress/flat-agent-organization-model/architecture-review-revision-record.md`
- Current Architecture Review Revision ID: `ARCH-REV-007`
- Current Review Round: `7`
- Trigger: `AD-REV-009` resolves `ARCH-REV-006 / AR-FIND-003` by grounding normal submit/independent-accept overlap and supported approval-wait shutdown, withdrawing AD-REV-008's coordinator/token/job machinery, and replacing it with an AgentRun-owned non-waiting quiescence preparation plus interrupt-before-drain root shutdown.
- Prior Review Round Reviewed: `ARCH-REV-006 / Blocked — Unclear`
- Latest Authoritative Round: `ARCH-REV-007 / Round 7`
- Current-State Evidence Basis: the retained traces prove a valid task submission at `1788292703.598` and independent authorized delegator acceptance at `1788292706.652` while the assignee's same provider turn continued until at least `1788292709.931`; the later invalid self-review call is unnecessary to that valid overlap and remains excluded. Product exposes `Auto approve tools`, the server owns SIGTERM, and the accepted Agent runtime test proves interrupt terminalizes a legitimate pending tool approval. Current source also proves a separate supported shutdown race omitted by AD-REV-009: task activation's `releaseWork()` asynchronously posts the initial task input, AgentRun can have an admitted/provider-dispatch-pending input before a canonical active turn exists, root termination interrupts only active turns, and `NO_ACTIVE_TURN` is treated as successful interruption. Dirty downstream tests, reports, evidence, fixtures, and generated outputs were read-only and were not edited, staged, reset, or claimed.

## Routing Classification Review

- Task size (`Small`/`Medium`/`Large`): `Large`
- Architectural risk (`Low`/`High`): `High`
- Classification rationale reviewed: `Confirmed`. The focused AD-REV-009 delta remains `Medium / High` because it changes shared Agent input/lifecycle coordination, task settlement behavior, and both root shutdown sequences. The cumulative package remains `Large / High`.
- Independent Architecture Review required by the classification: `Yes`
- Classification evidence or correction required: None.

## Upstream Behavior And Production-Path Basis Confirmation

- Overall Basis Status (`Confirmed`/`Contradicted`/`Blocked`): `Confirmed`
- Approved requirements / intended behavior understood: `Yes`. `BEH-009`, `REQ-015`, and `AC-010` preserve supported task activation, submission/review/settlement, exact root/host ownership, recursive task lineage, and normal task tools. The existing application-owned graceful-shutdown contract is preserved; self-review, timeout, replay, force-kill, and new persisted task state remain unsupported.
- Relevant existing behavior and evidence confirmed: `Yes`. Normal submit/independent accept can overlap one provider turn; legitimate approval waits are interruptible; idle/offline events already reschedule the terminal sweep; AgentRun serializes input/lifecycle through its dispatch queue; and current roots can wait on task/local termination work.
- Scope guardrail confirmed (`In-Scope Use Cases` / `Out of Scope` / `Preserved Behavior Boundary` / `Review Authority`): `Yes`. The correction must preserve task APIs/records and graceful shutdown without speculative recovery machinery or new Product policy.
- Approved change, preserved behavior, and outside scope understood: `Yes`
- Every prospective blocking `Design Impact` finding is traceable to an approved requirement, acceptance criterion, or preserved-behavior ID (`Yes`/`No`): `Yes — AR-FIND-004 protects BEH-009 / REQ-015 / AC-010 and the established application graceful-shutdown contract.`
- Remaining material ambiguity, if any: None in approved behavior. The remaining issue is an actionable target-lifecycle omission.

| Behavior ID | Kind | Design Alignment With Approved Intent (`Pass`/`Fail`) | Approved Trigger / Contract And Current-State Evidence (`Pass`/`Fail`/`Unclear`) | Target Outcome / Path / Spine Coherence (`Pass`/`Fail`/`Unclear`) | Status (`Confirmed`/`Needs Correction`/`Unclear`) | Required Action |
| --- | --- | --- | --- | --- | --- | --- |
| BEH-001-BEH-008 | Cumulative contract/system/user/durable behavior | Pass | Pass | Pass | Confirmed | None; prior two-family, migration, presentation, and lifecycle decisions remain unchanged. |
| BEH-009 | Task and root-lifecycle behavior | Pass | Pass | Fail | Needs Correction | Preserve AD-REV-009's non-waiting settlement correction, but make the shutdown fence cover admitted/pending provider starts as well as already-active turns. |
| BEH-010-BEH-011 | Admission and mounted-Team presentation | Pass | Pass | Pass | Confirmed | None; AD-REV-009 changes neither area. |

## Supplemental Artifact Coherence Verdict

| Artifact | Purpose And Scope Are Clear? (`Pass`/`Fail`) | Linked To Relevant Core Artifacts? (`Pass`/`Fail`) | Internally Complete? (`Pass`/`Fail`) | Consistent With Related Core Artifacts? (`Pass`/`Fail`) | Status And Approval Applicability Are Clear? (`Pass`/`Fail`) | Required Action |
| --- | --- | --- | --- | --- | --- | --- |
| Requirements, investigation inventory, and `agent-org-contract.md` | Pass | Pass | Pass | Pass | Pass | None. No Requirement or Product gap is introduced. |
| Product authorities and migration convention | Pass | Pass | Pass | Pass | Pass | None; AD-REV-009 changes no Product or migration contract. |
| `architecture-design-self-validation.md` (`AD-REV-009`) | Pass | Pass | Fail | Fail | Pass | VAL-026 correctly grounds normal overlap; VAL-027 covers an already-active approval wait but not the admitted/provider-start-pending race before the one-shot interrupt. Extend the shutdown walkthrough and negative boundary. |
| Valid submit/independent-accept traces | Pass | Pass | Pass | Pass | Pass | They resolve AR-PREM-004 without relying on the invalid self-review tail. |
| Approval-wait runtime and SIGTERM evidence | Pass | Pass | Pass | Pass | Pass | They resolve AR-PREM-005 and justify interrupt-before-drain. |
| Implementation/source-review artifacts through IR-012/CRR-013 | Pass | Pass | Pass | Pass | Pass | They establish the current lifecycle and queue boundaries; they do not claim the AD-REV-009 correction is implemented. |

## Task Design Health Assessment Verdict

| Assessment Area | Result (`Pass`/`Fail`) | Evidence | Required Action |
| --- | --- | --- | --- |
| Assessment is present for the current task posture | Pass | Focused `Medium / High`, cumulative `Large / High`, supported triggers, root cause, refactor choice, file map, removals, and validation plan are explicit. | None. |
| Root-cause classification is explicit and evidence-backed | Pass | The valid trace prefix establishes settlement overlap; the Product/SIGTERM/runtime contract establishes approval-wait shutdown; unsupported self-review is correctly demoted to technical-only evidence. | None. |
| Refactor needed now / no refactor needed / deferred decision is explicit | Pass | A narrow refactor using existing FIFO/sweep/prepared settlement is explicit. | None. |
| Refactor decision is supported by concrete design sections or residual-risk rationale | Fail | The settlement correction is supported, but DS-015 stops at `interrupt active turns` and does not fence a normal task input that is admitted or dispatching before canonical turn start. | Complete the root-to-AgentRun shutdown phase before implementation. |

## Spine Inventory Verdict

| Spine ID | Scope | Spine Is Readable? (`Pass`/`Fail`) | Narrative Is Clear? (`Pass`/`Fail`) | Facade Vs Governing Owner Is Clear? (`Pass`/`Fail`/`N/A`) | Main Domain Subject Naming Is Clear? (`Pass`/`Fail`) | Ownership Is Clear? (`Pass`/`Fail`) | Off-Spine Concerns Stay Off Main Line? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DS-000-DS-014, DS-016-DS-021 | Previously reviewed cumulative spines | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| DS-022 | Terminal settlement through non-waiting quiescence preparation and idle retry | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| DS-015 | Process/root shutdown | Pass | Fail | Pass | Pass | Fail | Pass | Fail |

## Boundary Encapsulation Verdict

| Boundary / Owner | Authoritative Public Entry Point Is Clear? (`Pass`/`Fail`) | Internal Owned Mechanisms Stay Internal? (`Pass`/`Fail`) | Caller Bypass Risk Is Controlled? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Previously reviewed subject services, roots, stores, migration, presentation, and web owners | Pass | Pass | Pass | Pass | ARCH-REV-005 conclusions remain valid. |
| `RootTaskLifecycleCommandQueue` / terminal sweep | Pass | Pass | Pass | Pass | One existing FIFO remains authoritative; no second job owner exists. |
| `AgentRun.tryPrepareTerminationIfQuiescent` | Pass | Pass | Pass | Pass | AgentRun is the correct atomic input/lifecycle owner; `null` is singular and non-waiting. |
| Team/Org settlement adapters and recursive local Team execution | Pass | Pass | Pass | Pass | Prepared-or-null preserves exact subject durability and all-or-none recursive cancellation. |
| Team/Org frozen root shutdown scope -> AgentRun | Fail | Fail | Pass | Fail | Root ownership is clear, but the target has no operative AgentRun admission/dispatch fence that makes “complete scope” true before the active-turn interrupt. |

## Dependency Direction / Forbidden Shortcut Verdict

| Owner / Boundary | Allowed Dependencies Are Clear? (`Pass`/`Fail`) | Forbidden Shortcuts Are Explicit? (`Pass`/`Fail`) | Direction Is Coherent With Ownership? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Cumulative Team/Org definition/runtime/presentation boundaries | Pass | Pass | Pass | Pass | No public/durable root union, mounted-Team root, try-both reader, or subject-store bypass is reintroduced. |
| Task engine -> subject adapter -> AgentRun/local execution | Pass | Pass | Pass | Pass | The engine does not infer UI status or wait on active work. |
| Root shutdown -> frozen local scope -> AgentRun | Fail | Pass | Pass | Fail | The direction is right, but the dependency exposes only active-turn interruption; already-admitted pending input can cross the phase boundary. |

## Interface Boundary Verdict

| Interface / API / Query / Command / Method | Subject Is Clear? (`Pass`/`Fail`) | Responsibility Is Singular? (`Pass`/`Fail`) | Identity Shape Is Explicit? (`Pass`/`Fail`) | Generic Boundary Risk (`Low`/`Medium`/`High`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- | --- |
| Existing public Team/Org/Agent/task/message APIs | Pass | Pass | Pass | Low | Pass |
| `AgentRun.tryPrepareTerminationIfQuiescent()` | Pass | Pass | Pass | Low | Pass |
| `RootTaskLifecycleEngine.settle/onExecutionBecameIdle` | Pass | Pass | Pass | Low | Pass |
| Frozen root-scope shutdown preparation/interruption boundary | Fail | Fail | Pass | High | Fail |

## Existing Capability / Subsystem Reuse Verdict

| Need / Concern | Existing Capability Area Was Checked? (`Pass`/`Fail`) | Reuse / Extension Decision Is Sound? (`Pass`/`Fail`) | New Support Piece Is Justified? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Preserve task record/tool/status semantics | Pass | Pass | N/A | Pass | Records, `settledAt`, tools, results, and fail-stop remain exact. |
| Non-waiting settlement and retry | Pass | Pass | N/A | Pass | Existing FIFO/sweep/idle event plus AgentRun ownership are proportionate. |
| Recursive task-Team preparation | Pass | Pass | N/A | Pass | Existing prepared cancellation is reused; no dependency graph is introduced. |
| Complete-scope graceful shutdown | Pass | Fail | N/A | Fail | Existing AgentRun dispatch/admission authority is the right capability, but AD-REV-009 does not extend it to fence pending starts before root interruption. |

## Subsystem / Capability-Area Allocation Verdict

| Subsystem / Capability Area | Ownership Allocation Is Clear? (`Pass`/`Fail`) | Reuse / Extend / Create-New Decision Is Sound? (`Pass`/`Fail`) | Supports The Right Spine Owners? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Shared collaboration task engine/queue | Pass | Pass | Pass | Pass | Root-neutral task policy and one FIFO remain coherent. |
| AgentRun input/lifecycle | Pass | Pass | Pass | Pass | Owns atomic quiescence and prepared termination. |
| Subject task adapters/registries | Pass | Pass | Pass | Pass | Exact subject durability and binding ownership remain private. |
| Team/Org roots and frozen local scopes | Pass | Fail | Fail | Fail | Shutdown ownership is correct; its per-Agent phase contract is incomplete. |

## Reusable Owned Structures Verdict

| Repeated Structure / Logic | Extraction Need Was Evaluated? (`Pass`/`Fail`) | Shared File Choice Is Sound? (`Pass`/`Fail`/`N/A`) | Ownership Of Shared Structure Is Clear? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Existing shared record/address/configuration/presentation structures | Pass | Pass | Pass | Pass | Prior decisions remain valid. |
| Prepared-or-null Agent/local termination | Pass | Pass | Pass | Pass | Reuses the existing prepared object without new state/token types. |
| Root shutdown input/interrupt phase | Pass | N/A | Pass | Fail | A new generic owner is not required, but the shared per-Agent contract is not specified. |

## Shared Structure / Data Model Tightness Verdict

| Shared Structure / Type / Schema | One Clear Meaning Per Field? (`Pass`/`Fail`) | Redundant Attributes Removed? (`Pass`/`Fail`) | Overlapping Representation Risk Is Controlled? (`Pass`/`Fail`) | Shared Core Vs Specialized Variant / Composition Decision Is Sound? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Team V2 / Org V1 persisted roots and task records | Pass | Pass | Pass | Pass | Pass | No AD-REV-009 schema/state change. |
| Non-waiting quiescence result | Pass | Pass | Pass | Pass | Pass | `null` or existing prepared termination only. |
| Withdrawn AD-REV-008 coordinator/token/job state | Pass | Pass | Pass | Pass | Pass | Explicitly absent; no dormant compatibility path. |

## File Responsibility Mapping Verdict

| File | Responsibility Is Singular And Clear? (`Pass`/`Fail`) | Responsibility Matches The Intended Owner/Boundary? (`Pass`/`Fail`) | Responsibilities Were Re-Tightened After Shared-Structure Extraction? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| `agent-run.ts` / `agent-run-input-admission-state.ts` | Pass | Pass | Pass | Pass | Non-waiting settlement preparation is actionable under canonical dispatch/input ownership. |
| Task engine/adapters/registries/local Team files | Pass | Pass | Pass | Pass | Deferred settlement and recursive cancellation remain singular. |
| `root-team-run.ts` / `agent-org-run.ts` | Fail | Pass | N/A | Fail | “Close/freeze and interrupt active turns” does not name how already-admitted provider starts are fenced; current frozen-scope internals are not mapped for change. |
| AD-REV-008-only coordinator/token files | Pass | Pass | Pass | Pass | Delete or leave unimplemented; no replacement owner required. |

## Subsystem / Folder / File Placement Verdict

| Path / Item | Target Placement Is Clear? (`Pass`/`Fail`) | Folder Matches Owning Boundary? (`Pass`/`Fail`) | Mixed-Layer Or Over-Split Risk (`Low`/`Medium`/`High`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| `agent-execution/` quiescence boundary | Pass | Pass | Low | Pass | Correct authoritative owner. |
| `agent-collaboration/execution/task/` existing queue/sweep | Pass | Pass | Low | Pass | No coordinator split. |
| Team/Org root and local frozen-scope shutdown path | Fail | Pass | Medium | Fail | Target root files are named, but the cross-boundary AgentRun phase is not. |

## Removal / Decommission Completeness Verdict

| Item / Area | Redundant / Obsolete Piece To Remove Is Named? (`Pass`/`Fail`) | Replacement Owner / Structure Is Clear? (`Pass`/`Fail`/`N/A`) | Removal / Decommission Scope Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| AD-REV-008 settlement coordinator/token/jobs/dependency graph | Pass | Pass | Pass | Pass | Withdrawn completely in design, file map, sequence, and forbidden shortcuts. |
| Waiting settlement preparation inside the FIFO | Pass | Pass | Pass | Pass | Replaced by prepared-or-null Agent/local capability. |
| Drain-before-interrupt root ordering | Pass | Pass | Pass | Fail | The order is removed, but the replacement interrupt phase is incomplete for pending provider starts. |
| Previously reviewed synthetic roots, raw Org UI, and runtime legacy readers | Pass | Pass | Pass | Pass | Remain removed/rejected. |

## Legacy / Backward-Compatibility Verdict

| Area | Compatibility Wrapper / Dual-Path / Legacy Retention Exists? (`Yes`/`No`) | Clean-Cut Removal Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- |
| AD-REV-009 task path | No | Pass | Pass | No task status/schema/API dual path. |
| Team V2 / Org V1 and registered migration | Yes | Pass | Pass | Migration-only historical codecs; prior reviewed boundary is unchanged. |

## Persisted-Data Transition Verdict (When Applicable)

| Area / Stored Subject | Approved Decision | Representative Reader / Semantic / Invariant Evidence Is Sufficient? (`Pass`/`Fail`) | Direct Use, Rebuild, Or Migration Choice Is Proportionate? (`Pass`/`Fail`) | Migration Safety Is Complete If Required? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| AD-REV-009 task records/trees/sidecars | `Directly Usable — No Migration` | Pass | Pass | N/A | Pass | Existing terminal states and `settledAt` remain exact; no persisted job/token. |
| Cumulative Team/Org family transition | `Migration Required` for approved cohorts | Pass | Pass | Pass | Pass | AD-REV-004 remains unchanged. |

## Change / Refactor Safety Verdict

| Area | Sequence Is Realistic? (`Pass`/`Fail`) | Temporary Seams Are Explicit? (`Pass`/`Fail`) | Cleanup / Removal Is Explicit? (`Pass`/`Fail`) | Verdict (`Pass`/`Fail`) |
| --- | --- | --- | --- | --- |
| Prior cumulative architecture through AD-REV-007 | Pass | Pass | Pass | Pass |
| Non-waiting settlement / AD-REV-008 removal | Pass | Pass | Pass | Pass |
| Team/Org complete-scope interrupt-before-drain shutdown | Fail | Pass | Pass | Fail |

## Example Adequacy Verdict

| Topic / Area | Example Was Needed? (`Yes`/`No`) | Example Is Present And Clear? (`Pass`/`Fail`/`N/A`) | Bad / Avoided Shape Is Explained When Helpful? (`Pass`/`Fail`/`N/A`) | Verdict (`Pass`/`Fail`) | Notes |
| --- | --- | --- | --- | --- | --- |
| Cumulative definition/runtime/persistence/presentation examples | Yes | Pass | Pass | Pass | Prior examples remain adequate. |
| Normal submit/independent accept overlap | Yes | Pass | Pass | Pass | Valid trace prefix is separated from invalid self-review. |
| Already-active approval wait during SIGTERM | Yes | Pass | Pass | Pass | Product control, signal path, and accepted interrupt semantics are explicit. |
| Input admitted before turn-start during SIGTERM | Yes | Fail | N/A | Fail | DS-015/VAL-027 omit this normal phase boundary. |
| Pre-/post-durable settlement failure and recursive cancellation | Yes | Pass | Pass | Pass | Existing prepared semantics are retained. |

## Material Premise Validation (Only When Needed)

### `AR-PREM-001` — Process interruption during the registered migration

- Related approved requirement or established contract: repository `Production Data-Migration Conventions`; `REQ-012`, `REQ-013`, `REQ-027`
- Relevant behavior ID(s): `BEH-005`, `BEH-007`, `BEH-010`
- Initiating basis kind: `Operational` / `System`
- Independent product-supported initiating trigger or applicable governing contract: The canonical convention assigns later startup retry to the existing runner after one incomplete-attempt interruption category.
- Support evidence: convention plus current runner/startup behavior.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: startup -> migration -> atomic write/direct rename -> interruption -> later startup -> runner reclassification/completion.
- Lifecycle preconditions and material consequence at the claimed point: deterministic old/prospective-target/target observations under normal filesystem guarantees.
- Reachability: `Reachable`
- Review consequence / proportionate response: Prior one-relaunch/idempotence design remains proportionate; AD-REV-009 does not change it.

### `AR-PREM-002` — Arbitrary corruption, hostile tampering, or adversarial concurrent writer

- Related approved requirement or established contract: repository migration-convention reachability gate
- Relevant behavior ID(s): `BEH-007`
- Initiating basis kind: `Contract`
- Independent product-supported initiating trigger or applicable governing contract: None.
- Support evidence: No approved product/security/operations contract initiates this premise.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: None.
- Lifecycle preconditions and material consequence at the claimed point: Unsupported external mutation/infrastructure failure.
- Reachability: `Not Reachable`
- Review consequence / proportionate response: It drives no finding or machinery; the prior fail-closed boundary remains.

### `AR-PREM-003` — Run-authority rename succeeds but directory finalization is indeterminate

- Related approved requirement or established contract: existing Team atomic-writer/fail-stop contract; `QR-004`
- Relevant behavior ID(s): `BEH-005`, `BEH-008`, `BEH-009`
- Initiating basis kind: `Contract` / `System`
- Independent product-supported initiating trigger or applicable governing contract: A supported mutation enters the established writer, whose result contract identifies renamed/finalization-indeterminate.
- Support evidence: committed writer/coordinator contracts and prior AD-REV-005 review.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: supported mutation -> coordinator -> rename -> finalization indeterminate -> root fail-stop.
- Lifecycle preconditions and material consequence at the claimed point: Durable content may change while live publication cannot be treated as ordinary retry.
- Reachability: `Reachable`
- Review consequence / proportionate response: Whole-root fail-stop remains proportionate; AD-REV-009 does not change it.

### `AR-PREM-004` — Independent accept overlaps the assignee's still-finishing normal provider turn

- Related approved requirement or established contract: `BEH-009`, `REQ-015`, `AC-010`; preserved task submission/review/settlement behavior
- Relevant behavior ID(s): `BEH-009`
- Initiating basis kind: `User` / `System`
- Independent product-supported initiating trigger or applicable governing contract: A normal task assignee calls `submit_task_result`; the different authorized delegator independently calls `review_task_result(accept)`.
- Support evidence: verifier trace records successful submit at `1788292703.598`; lead trace records successful acceptance at `1788292706.652`; the assignee's same provider turn continues to reasoning at `1788292709.931`. The invalid self-review begins later and is excluded.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: task Agent tool -> bound submit command -> durable awaiting-review transition -> independent delegator tool -> durable accepted transition -> terminal sweep while assignee provider turn has not emitted terminal lifecycle.
- Lifecycle preconditions and material consequence at the claimed point: A normal tool result does not terminate the provider turn. Waiting preparation at the root FIFO head can therefore starve an unrelated supported task command.
- Reachability: `Reachable`
- Review consequence / proportionate response: AR-FIND-003 is resolved. The narrow non-waiting `tryPrepareTerminationIfQuiescent`, FIFO release, and existing idle retry are justified; no coordinator/token/job machinery is justified.

### `AR-PREM-005` — Application shutdown while a task Agent awaits legitimate tool approval

- Related approved requirement or established contract: application-owned graceful shutdown; `BEH-009`, `REQ-015`, `AC-010`
- Relevant behavior ID(s): `BEH-009`, `DS-015`
- Initiating basis kind: `Operational` / `System`
- Independent product-supported initiating trigger or applicable governing contract: Product's approved `Auto approve tools` control permits approval-gated tools; the application supports SIGTERM shutdown.
- Support evidence: Product UI specification; `server-runtime.ts` SIGTERM handler; task execution carries `autoExecuteTools`; accepted `agent-runtime.test.ts` case proves interrupt terminalizes a pending approval and returns the Agent to idle.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: normal delegated task -> configured task Agent with auto-approve disabled -> legitimate tool invocation -> approval wait -> SIGTERM -> server runtime -> process supervisor -> owning Team/Org root.
- Lifecycle preconditions and material consequence at the claimed point: Current root ordering can wait on task settlement/local termination before issuing the Agent interrupt that releases approval.
- Reachability: `Reachable`
- Review consequence / proportionate response: Interrupt-before-drain is justified for both root families; no timeout, replay, force-kill, or new persisted state is authorized.

### `AR-PREM-006` — A normal task input is admitted before canonical turn start and begins provider work after the root's one-shot active-turn interrupt

- Related approved requirement or established contract: normal task activation and application-owned graceful shutdown; `BEH-009`, `REQ-015`, `AC-010`
- Relevant behavior ID(s): `BEH-009`, `DS-015`
- Initiating basis kind: `System` / `Operational`
- Independent product-supported initiating trigger or applicable governing contract: A supported member delegates a task. After the durable activation commit, the runtime releases the normal initial task work. Independently, the application receives supported SIGTERM.
- Support evidence: both Team and Org task activation call `committed.releaseWork()`; task-Agent/task-Team registries queue a microtask that calls `handle.postMessage(input.message)`. `AgentRun.postUserMessage` admits/claims input and begins asynchronous provider dispatch before a canonical turn-start event is guaranteed. `AgentRun.interrupt` rejects when `activeTurn` is `NONE`, and `ConfiguredAgentExecutionHandle.interruptForRootTermination` converts `NO_ACTIVE_TURN` to success. Existing frozen Team scope stops materialization but does not close AgentRun input admission; AD-REV-009's file map changes only the active-turn ordering and supplies no pending-start fence.
- Forward current or approved target production caller/event path that exercises the initiating basis and reaches the claimed state: normal `delegate_task` -> durable activation -> `releaseWork` -> `handle.postMessage` -> AgentRun input admitted/provider dispatch pending -> application SIGTERM -> process supervisor -> root close/freeze -> one-shot `interruptActiveTurns` -> `NO_ACTIVE_TURN` accepted as success -> provider turn starts afterward -> legitimate approval wait -> task settlement or remaining local termination cannot finish.
- Lifecycle preconditions and material consequence at the claimed point: No hidden-state mutation or unsupported task action is required. The signal only needs to arrive after input admission and before canonical `TURN_STARTED`; a later approval-gated tool can recreate the same shutdown stall after the interrupt phase has passed.
- Reachability: `Reachable`
- Review consequence / proportionate response: DS-015 must atomically fence owned AgentRun input/provider starts and coordinate already-admitted work with interruption so no provider work can begin after that Agent's shutdown interrupt phase. The exact disposition must preserve existing input lifecycle semantics; if a user-visible policy choice is required, route it rather than inventing it.

## Unresolved Approved-Behavior Or Current-State Gaps

| Item | Why It Matters | Required Action | Status |
| --- | --- | --- | --- |
| Shutdown phase does not cover admitted/provider-start-pending Agent input | It leaves a supported `delegate_task` + SIGTERM path able to start an approval-blocked turn after the one-shot interrupt and stall final task/local teardown. | Architecture Designer must extend DS-015, ownership/interfaces/file mapping, VAL-027, and implementation sequencing with an atomic root-to-AgentRun admission/dispatch/interrupt boundary and deterministic race validation. | Open — Design Impact |

## Review Decision

`Fail` — AD-REV-009 resolves AR-FIND-003 and its non-waiting settlement correction is proportionate, but its “complete-scope” shutdown is not complete. A supported normal task activation can have input admitted/provider dispatch pending before canonical turn start; the root's active-turn-only interrupt then succeeds as a no-op and a later approval-waiting turn can begin after the interrupt phase. Implementation and API/E2E remain held on this path.

## Findings

### AR-FIND-004 — Interrupt-before-drain does not fence admitted task input that has not yet published an active turn

- Type: `Design Impact`
- Severity: `Critical`
- Approved requirement, acceptance criterion, or preserved-behavior ID protected: `BEH-009`, `REQ-015`, `AC-010`, and the established application-owned graceful-shutdown contract
- Scope status: `Within Approved Scope`
- Whether the required update changes approved behavior: `No — it makes the designed complete-scope graceful shutdown true for an already-supported task activation phase. If the chosen disposition would change observable input semantics, that policy must be routed separately.`
- Affected approved behavior, relevant existing behavior, journey, or established contract: normal `delegate_task` activation/release, task Agent provider input, and Team/Org SIGTERM shutdown
- Evidence: current Team and Org activation commits invoke `releaseWork`; task registries asynchronously call `handle.postMessage`; AgentRun can be dispatching admitted input while canonical `activeTurn` is still `NONE`; root termination's interrupt wrapper treats `NO_ACTIVE_TURN` as success. AD-REV-009 says close/freeze then interrupt every **active** turn, but it maps no AgentRun shutdown admission/dispatch fence and VAL-027 starts only after approval is already active.
- Material-premise validation ID: `AR-PREM-006`
- Required update: specify one atomic per-Agent shutdown phase, owned by AgentRun and invoked by each frozen Team/Org scope, that closes input admission and coordinates already-reserved/committed/claimed/provider-start-pending input with interruption so no owned provider work can begin after that Agent's interrupt phase. Thread it through configured/task Agent and recursive task-Team scopes; define cancellation/finish semantics using existing input lifecycle contracts; update DS-015, the interface/dependency/file maps, root sequence, and VAL-027. Add a deterministic test using normal task activation (or another independently supported input), a barrier before canonical `TURN_STARTED`, application SIGTERM, and a legitimate approval-gated tool; prove shutdown cannot miss the turn or wait behind it. Do not add timeout, replay, force-kill, a new persisted state, or AD-REV-008 coordinator/token machinery.
- Why the required update is proportionate to the verified consequence: it closes one concrete race in the already-selected interrupt-before-drain correction at the existing AgentRun authority. It does not introduce a second settlement owner, new persistence, or unsupported recovery policy.
- Recommended recipient: `/software_engineering_team/architecture_designer`

## Classification

`Design Impact` — the supported behavior basis is established, but the target shutdown spine and AgentRun boundary need one bounded correction.

## Recommended Recipient

`/software_engineering_team/architecture_designer`

## Residual Risks

- AR-FIND-003 is resolved: AR-PREM-004/005 are now Reachable, the narrow prepared-or-null path is justified, and all AD-REV-008 coordinator/token/job/dependency machinery is withdrawn.
- AR-FIND-001/002, ADI-006, IDI-001, ADI-007, and API-FIND-007/CR-FIND-011 remain resolved at the design boundary.
- Implementation must still prove null has no side effect/wait, idle retry cannot be lost, recursive preparation fully cancels on deferral, pre-/post-durability failure remains exact, and both roots preserve interrupt-before-drain after the new pending-start fence.
- Downstream dirty tests/evidence/reports remain owned by their current stages.

## Latest Authoritative Result

- Review Decision: `Fail`
- Material-Premise Gate (`Pass`/`Fail`/`Blocked`): `Pass`
- Notes: `ARCH-REV-007` confirms AD-REV-009 resolved `AR-FIND-003` and validates the narrower settlement direction, but records new `AR-FIND-004 / Design Impact` over the reachable admitted-input-before-turn-start shutdown race. No Requirement Gap or Product UI gap is identified, and no implementation handoff is authorized.
