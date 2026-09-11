# Architecture Assertion-Validity Record

## AAV-001 — Task-origin provider history versus configured communication presentation

- Date: 2026-09-11.
- Stable package: `AORG-FLAT-TEAM-001`.
- Trigger: API/E2E's bounded assertion-validity question during `API-REV-022`.
- Inspected artifact: `6ef456e0a3fd568e732bafbd79c5f9abb2aed1f4`, branch
  `requirements/flat-agent-organization-model`, isolated task worktree
  `/home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model`.
- Approved requirements: `RER-026@16b560f82c1edda24e17a1330edc5c820a1328b6`.
- Completed design/review: `AD-REV-018@36f76ebbdb23b7ee235f94ab38968cf2adefbe00`
  / `ARCH-REV-016@6ce3dbc3c1a38b7212f9dd77a12b7ef362e98577` Pass.
- Outcome: **Requirement Gap — bounded interpretation of an exclusion**.
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
