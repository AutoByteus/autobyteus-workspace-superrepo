# AgentOrg / Flat Team — Release Notes Draft

**DR-009: RER-032 local verification candidate, not a published release.**
Cumulative AD022 / IR001–043 / CRR066 / API27 / CRR067. Local version **1.4.69**
is inherited from the integrated base; no version bump, public tag or replacement
of an existing release is claimed. Publication remains gated on explicit user
verification and repository finalization.

## Changes

- Reusable Teams remain flat, coordinator-led Agent groups. Coordinator-free
  Agent Orgs combine direct Agents and reusable Teams without configured nesting
  or an implicit launch recipient.
- Authored `team-config.json` and `org-config.json` no longer contain
  `schemaVersion`. Current strict shapes are shared by save/reload/export/import;
  missing or retired fields are not silently accepted. Runtime Team V2 and Org V1
  execution-tree versions remain unchanged.
- A separate required startup transition removes only the prior authored numeric
  version from supported writable server-owned definitions, preserving all other
  values. Current definitions are zero-write skips; external package publication
  remains separately owned, and runtime memory is not part of this transition.
- The Workspaces/history heading is **Orgs** (**组织**) immediately after Teams.
  Main navigation still says Agent Orgs; run categories and domain/API names are
  unchanged.
- Messages keeps the familiar compact counterpart, direction, time, content and
  references. Exact address/run/task identity is available on demand rather than
  in permanent address and Task/ID badges. Task-origin messages remain included.
- Tasks retains its familiar heading, status, direction, time and content without
  an extra participant strip. Agent names navigate to exact executions; Team names
  disclose all assigned participant links, including non-coordinators. Exact
  identity details are optional and reset with item/reference/scope selection.
- Cold narrow Org links resolve through authoritative history before navigation.
  Back/Refresh preserves the exact task without requiring the history drawer or
  restoring/reactivating it.
- Normal standalone Team Tasks can inspect accepted/settled Agents while the
  Team is active or inactive. Authoritative projection loads before exact focus;
  repeated same-address assignments stay distinct. Conversation/Activity is
  read-only, with no composer or commands. Deliberate old-task inspection
  survives later task activation and verified reconnect snapshots; ordinary live
  task selection still repairs after settlement.
- Cumulative task-inclusive Messages/Tasks, genuine accepted system inputs,
  fresh no-refocus publication, exact locked settings, Team-like overrides,
  first-message history titles, automatic-only recovery, strict persistence,
  supported migration/Restore/provider continuity and terminal Stop remain.
- Integrated compatible-model editing remains limited to its supported stopped
  standalone Agent/flat Team scopes; this is not an Org model-edit permission.

## Validation and limits

Fresh full cumulative API-REV-027 passed at **95.6%**, with **1,981 tests in331
files** plus current realistic task/message/navigation/restart/migration checks.
CRR066 is the cumulative source Pass; CRR067 is Not Applicable because API27
changed no durable test. Historical CRR059 five-file review remains preserved.
Current Delivery package/native checks are separately recorded in the delivery
report and are not inferred from browser validation.

Nine formal cycles produced36 local durable updates; **35/36** outer native
provider pairs succeeded. One provider-generated script threw ReferenceError
after successfully awaiting local request_revision; local admission, durable
commit and later resubmit/accept/settlement are proven, not a successful outer
wrapper. No accepted request was replayed. Original nonzero receipts, controlled
adverse fixtures, passive overhead, historical unassigned stalls, deterministic
A–F and Brief pack-only scope remain explicit. No universal provider reliability,
actual Brief Studio provider-user journey or distributed rollout is claimed.

## Rollout and rollback

Use the documented post-finalization release helper only when publication is
selected, with archived release notes. Back up server data before supported
migration, inspect independent migration outcomes, and never force incompatible
external packages through normal admission. A rollback needs a matching
executable and verified pre-migration backup—not an older reader over migrated
files. The isolated DR009 native test root does not replace normal production
history. No target branch, public tag or deployment has been changed by this
local verification preparation.
