# AgentOrg / Flat Team — Release Notes Draft

**DR-008 — local verification candidate, not a published release.**
Current authority: RER-028 / AD-REV-019 / IR-038 / CRR-058 / API-REV-024 /
CRR-059. The local package inherits version **1.4.69** from the integrated base;
this is not a new version/tag or a replacement of the existing public release.
Publication remains gated on explicit user verification, the newly approved RER029
design/implementation/validation route, and repository finalization. Approved RER029 removal of authored
`schemaVersion` fields is not included in this RER028 build. These notes supersede the DR-007 blocked integration draft.

## User-visible changes

- Reusable flat Agent Teams contain direct Agents with a coordinator; Agent Orgs
  compose direct Agents and flat Teams without an Org coordinator or configured
  Team nesting. Org launch starts without an implicit recipient.
- Team-like collapsed member overrides, exact inheritance and readiness, runtime
  Retry/default abandonment, Temp Workspace default, and strict edit/save
  projection preserve deliberate configuration choices.
- One Workspaces hierarchy keeps Teams and Agent Orgs distinct while exact
  selection controls the URL, center, and single highlighted row. Locked
  exact-Agent settings return to the same monitor; New is a separate journey.
- Shared Messages now include all accepted ordinary configured/task Agent and
  task-Team directions. Exact sender/receiver execution identity, receiver input,
  and references survive history and Restore without a duplicate message store.
- Familiar Tasks is available to direct and mounted Org participants as well as
  task Agents/Teams. Assignment, submission, revision, acceptance, interruption,
  and references remain tied to the exact relevant task and execution.
- Participant navigation distinguishes repeated same-address tasks. Settled and
  inactive executions retain read-only history, Messages, Tasks, configuration,
  and references without silently restarting the execution.
- Genuine accepted task-system inputs remain distinct from ordinary messages.
  Notification rejection is a warning, not a fabricated receipt or lost durable
  task update.
- Already-mounted task facets and status rows update without refocus. Settled
  executions converge offline and leave the live roster while retaining history.
  Mounted-Team summaries remain presentation-only aggregates.
- Automatic recovery preserves exact focus and bounded attempts, with separate
  successful recovery and one-notice exhaustion behavior; no manual Reconnect.
- AgentOrg history uses the first accepted non-empty external configured-member
  message as its stable summary. Task/system traffic never replaces the title.
  Derived metadata write failure does not replay accepted work or poison writes.
- Separate Team V2 and AgentOrg V1 persisted families preserve task/provider
  identity through supported migration, clean restart, Restore and terminal Stop.
  The integrated stopped compatible-model workflow remains available for its
  supported standalone Agent/flat Team scopes; it is not an Org model-edit grant.

## Validation and limits

Fresh full cumulative API-REV-024 passed at 95.9% reported confidence, with
1,698 repository tests in 287 distinct files and current live task/message,
notification, exact inspection, publication, recovery, migration and restart
coverage. CRR-059 passed all five durable test updates. Native package build and
launch evidence is recorded separately in the DR-008 delivery report, not
inferred from browser execution.

The recursive initial native-wait prompt needed ordinary clarification;
controlled notification/model probes are not real-provider failure evidence;
the second non-quiescent startup assertion was invalid and the third startup
provides the exact preservation proof. Historical stall causes remain unknown.
External definition repositories must publish compatible definitions separately.
No actual Brief Studio provider-user journey or distributed rollout is claimed.
See `delivery-evidence/dr-008/upstream-evidence-limits.md` and API24 reconciliation.

## Rollout / rollback

Use the repository's normal post-finalization release script only if publication
is selected. Back up server data before a supported legacy-family migration;
inspect migration outcomes and do not force incompatible definitions through
admission. Never run an older family reader against migrated data to simulate
rollback: retain a verified pre-migration backup and matching executable.
The isolated DR-008 desktop test root is not the normal production data root.
No target branch, public tag, external package, or deployment was changed by this
local verification preparation.
