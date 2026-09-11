# Architecture Assertion-Validity Record

**Later authority note:** AAV-001's retained-provider-history answer below remains
resolved. RER-028 separately supersedes its RER-026/027 configured-only live
scope; AD-REV-019 now designs task-inclusive events/Tasks/Messages. The no-new-AD
statement in the completed assertion-only round is historical, not a restriction
on this later user-approved parity revision.

## AAV-001 — Task-origin provider history versus configured communication presentation

- Date: 2026-09-11.
- Stable package: `AORG-FLAT-TEAM-001`.
- Trigger: API/E2E's bounded assertion-validity question during `API-REV-022`.
- Inspected artifact: `6ef456e0a3fd568e732bafbd79c5f9abb2aed1f4`, branch
  `requirements/flat-agent-organization-model`, isolated task worktree
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`.
- Requirements at inquiry: `RER-026@16b560f82c1edda24e17a1330edc5c820a1328b6`.
- Current authority: user-confirmed
  `RER-027@c7d435ee661525e1e85fbd5b032817fc6703c8be`.
- Completed design/review: `AD-REV-018@36f76ebbdb23b7ee235f94ab38968cf2adefbe00`
  / `ARCH-REV-016@6ce3dbc3c1a38b7212f9dd77a12b7ef362e98577` Pass.
- Current outcome: **Resolved — assertion-validity clarification only**.
  The resolution below supersedes the original inquiry's pending decision and
  hold. The original inquiry is retained as evidence, not an open gap.
- Original outcome: **Requirement Gap — bounded interpretation of an exclusion**.
  This is not source-defect attribution, a proposed fix, an API/E2E result,
  or a completed architecture-design revision. AD-REV-018 remains unchanged.

### Observed facts and evidence

API/E2E reports successful durable task-Team-Agent to configured
`/research-team/analyst` communication, with an exact message/reference. Live
receiver presentation contains no task-origin `MEMBER_INPUT_MESSAGE` packet,
and configured Org Messages excludes the record. After supported restart and
Restore, the ordinary retained provider-history conversation displays the task
packet; the configured Messages facet still excludes it.

Evidence under the ticket:

- `api-e2e-evidence/API-REV-022/live/task-history-observation-pending.json`
- `api-e2e-evidence/API-REV-022/live/MSG-task-directions.json`
- `api-e2e-evidence/API-REV-022/live/POSTRESTART-narrow.json`

`MSG-task-directions.json` correlates durable message
`collabmsg_DOHTET5wWgRBp9A3xXtsO1saI04NiJpj` and marker
`API22-TASKTEAM-CFG` to a retained `trace_type: user` record from
`AgentRun.postUserMessage`. This is real accepted input, not evidence that the
new configured-pair event was emitted. Architecture inspected the supplied
evidence and current source; it did not rerun the browser or provider.

Current frontend source separately establishes the history path:

1. `autobyteus-web/services/agentOrgExecution/agentOrgContextHydration.ts`
   fetches the exact Org/member/run projection and applies its conversation via
   `buildConversationFromProjection`.
2. `autobyteus-web/services/runHydration/runProjectionConversation.ts` is the
   shared retained-conversation mapper, distinct from the live configured-pair
   member-input publication and Org Messages perspective filtering.

### What the completed design does and does not establish

DS-028, the AD-REV-018 both-endpoint classifier, and VAL-040 explicitly exclude
all task-involved endpoint pairs from the **new configured-member event and
configured Messages facet**, while preserving existing accepted task delivery,
sidecar/root event, and input release. They do not specify blanket removal of
accepted task input from retained provider conversation history.

Consequently, the reported observation does not by itself prove violation of
that two-endpoint event/facet mechanism. Nor does this establish a cumulative
pass: `requirements-doc.md` REQ-034 and the RER-026 revision narrative also say
task-scoped sends produce no inbound member-input presentation, alongside
live/reconnect/restore parity. VAL-040's general statement that excluded
attempts remain absent does not explicitly disambiguate a retained ordinary
provider-history entry from a new member-input event. The event-type distinction
cannot silently narrow an approved user-visible exclusion.

### Exact upstream decision requested

Requirements Engineering must clarify whether the task-scoped exclusion means:

1. No new configured-pair `MEMBER_INPUT_MESSAGE` or configured Messages row;
   ordinary truthful retained provider input history remains outside this
   exclusion; or
2. No task-origin inbound packet anywhere in the receiver center, including
   retained provider-history rendering after reconnect/Restore.

The first interpretation matches the mechanism explicitly documented in
AD-REV-018, but Architecture does not approve it as product intent merely
because current source behaves that way. The second would require an
architecture impact assessment; no filtering, data deletion, schema change, or
other implementation prescription is authorized by this record. Requirements
owns any canonical clarification and any approval required by a behavior change.
No new Product prototype is requested by this record.

### Scope and next action

- Keep only the disputed restored-center assertion unclassified pending that
  answer; independent API/E2E checks and owned cleanup may continue.
- Preserve the successful live-event/facet observations and the restored-history
  observation separately. Do not convert either into a source finding or a
  strengthened assertion pass without the authority clarification.
- Cumulative classification remains `task_size=Large` /
  `architectural_risk=High`; this inquiry adds no implementation scope.
- Route this bounded Requirement Gap to Requirements Engineering under the
  current handoff rule. Return the authoritative answer to Architecture for
  the API/E2E assertion disposition and any necessary design reconciliation.
- Requirements, design, source, tests, and downstream-owned dirty evidence are
  unchanged by this record. No AD-REV-019 is created because no architecture
  design round has been completed.

### Resolution — RER-027 authoritative answer (2026-09-11)

Requirements Engineering returned explicit user confirmation after a read-only
comparison with the earlier AgentTeam implementation. Canonical authority is
`requirements-doc.md` REQ-015/034, AC-010/029, SCN-005/018 and DEC-022;
`investigation-notes.md` records both the source comparison and the distinction
between ordinary task messages and task-result system notifications.

**AAV-001 option 1 is authoritative.** Truthful retained provider input history
is outside the configured-member event/Messages exclusion. Accepted task
messages/results remain in the original Agent's normal conversation/history
after settlement and Restore. Settled task executions leave the active tree;
showing their retained input does not reactivate them or create configured
membership or a mounted-Team root.

The scoped validation disposition is:

| Observation or proposed assertion | Disposition under RER-027 |
| --- | --- |
| Task-involved accepted delivery has no new configured-member `MEMBER_INPUT_MESSAGE` and no configured Org Messages row | Supported exclusion; preserve the existing live-event/facet evidence as such. |
| Genuine accepted task input is visible in the receiver's ordinary retained provider conversation after Restore | Permitted and required retained-history behavior; not evidence that a prohibited new configured-member event was emitted. |
| Every task-origin packet must be absent everywhere in the restored center | Unsupported assertion; do not count it as a source failure or convert it to a passing assertion. |
| Retained task messages/results remain inspectable after the task settles, without bringing it back into the active tree | Supported preserved behavior; API/E2E owns evidence and coverage, not this clarification record. |
| A stored task submission by itself proves its result notification reached the delegator | Unsupported inference; preserve actual accepted input, never fabricate a missing notification. |

Configured-to-configured exact-once event/row, identity/reference,
live/reconnect/Restore and unrelated-participant exclusions remain unchanged.
Rejected or uncommitted sends still cannot fabricate accepted messages. A
provider `user` role is not proof of external-human provenance and does not
make task input eligible for REQ-033's first-user-message history summary.

**Earlier Team comparison correction:** the immutable Team baseline
`5fb16658e7bd2aefd750f99eb596a17382e161ac` publishes accepted receiver input
without a configured-pair gate and resolves Messages identities using
task-inclusive execution locations, as documented by Requirements Engineering.
Do not describe Org's configured-only event/facet restriction as full Team
task-presentation parity. RER-027 confirms retained task history and settlement;
it does not expand Org's scoped live event/Messages population. The existing
shared presentation language and configured-pair parity remain valid.

**Architecture impact check:** DS-028's both-endpoint classifier, single root
sidecar and separate retained conversation hydration already accommodate this
answer. VAL-040's event/facet matrix is unchanged; its general exclusion and
live/restored equivalence language is scoped to those configured-member
consequences, not blanket equality with the entire provider conversation.
No new design mechanism, source/test edit, filter, migration, recovery,
retention/routing/command/schema change, or Product gate is authorized. This
record is the clarification supplement to AD-REV-018, not a new design round.
AD-REV-018 / ARCH-REV-016 remain the completed design/review authorities;
no AD-REV-019 or independent re-review is needed for this assertion-only return.

Cumulative `task_size=Large` / `architectural_risk=High` remains unchanged;
the bounded disposition adds zero implementation scope. Only the AAV-001
assertion hold is released. Return the answer to the requesting API/E2E owner
so independent validation and cleanup can continue under the clarified scope.
API/E2E retains ownership of report/coverage disposition. No source-defect
finding, strengthened assertion pass, cumulative execution pass, or delivery
readiness follows from this answer. All unrelated holds/findings remain with
their existing owners.
