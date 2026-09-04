# Agent Orgs - Frontend

## Scope

The `/agent-orgs` experience authors and runs coordinator-free organizations
made from direct Agents and reusable flat Teams. Configured composition is fixed
depth: Org -> Team -> Agent, with optional direct Org Agents. Teams remain
independently launchable and keep their own coordinator and Team-local handoffs.

## Catalog, Detail, And Authoring

`AgentOrgExperience.vue` provides list, detail, create, and edit views.

- Member selection has separate Agent and Team tabs.
- A referenced Team remains a reference to the admitted Team definition; the Org
  editor does not copy or mutate it.
- Detail shows direct Agents and mounted Teams, including each Team coordinator.
- Org-owned handoffs use explicit **From**, **To**, and ordered **When**
  conditions.
- Handoff sources are exact Agents. Destinations may be an Agent or a mounted
  Team; a Team destination resolves through its direct coordinator.
- Save is atomic and retains a failed draft for correction.

AgentOrg has no coordinator field, initial recipient, or implicit first member.

## Run Configuration

Running an Org opens one configuration panel for the complete mounted scope.
`agentOrgRunConfigStore` owns:

- required Org-root runtime/model/model-config/tool/skill/workspace choices;
- sparse Team-placement overrides;
- sparse exact-Agent-placement overrides;
- exact runtime/model schema readiness;
- the immutable launch snapshot and admission guard.

Effective values resolve as:

```text
direct Agent: Agent override -> Org root
Team Agent:   Agent override -> Team override -> Org root
```

Referenced Agent/Team definition defaults remain standalone defaults and do not
silently override Org choices.

### Member Overrides

**Member overrides (N)** starts collapsed, where `N` is the exact number of
configurable Agent placements. Opening it keeps every mounted Team independently
collapsed.

A Team row shows readable name, `TEAM`, exact mounted address, explicit
**Inherited** or **Customized** state, and an accessible disclosure control.
Expanding one Team exposes its Team-placement controls and exact direct-Agent
rows; sibling Teams stay collapsed. Coordinator identity appears only on the
exact coordinator Agent row. Team state changes only for a Team-level override;
an Agent-only change does not relabel the Team.

Valid drafts survive collapse/reopen. The editor never mutates the referenced
definition or selects a runtime recipient.

### Readiness And Runtime Catalog Failure

Run is disabled until every root, Team, and Agent scope is ready. Loading,
invalid, or unavailable runtime/model schema state is shown at the exact scope
and blocks admission.

When an exact Agent runtime catalog request fails:

- the requested runtime remains visible;
- the durable/effective override is not committed;
- an accessible error and **Retry** action are shown;
- Retry replays the retained request through the same bounded path;
- selecting the real committed or Global default abandons the failed request,
  clears its error, restores readiness, and produces no stale launch override.

Server launch validation remains authoritative after the UI readiness check.

## Launch And Focus

`agentOrgRunStore` creates one full Org run and hydrates its AgentOrg V1
execution tree. Launch intentionally has no focused recipient. The workspace
asks the user to choose an exact Agent or Team before using the composer.

- Selecting a direct Agent focuses that exact Agent.
- Selecting a Team focuses its direct coordinator.
- Missing or stale focus fails closed; there is no first-member fallback.
- Desktop and narrow layouts preserve exact Team/Agent focus and avoid horizontal
  overflow.

## Workspace, Streaming, And Commands

`agentOrgContextsStore` owns hydrated contexts.
`agentOrgStreamingService` owns the root WebSocket and applies strict shared
collaboration frames. Each command carries the exact root and member execution
identity.

Supported commands are message, interrupt, tool approval, and tool denial.
Context attachments and task reference files use AgentOrg-rooted content URLs.
Unknown roots, stale AgentRun IDs, wrong member addresses, and cross-root
targets are rejected rather than guessed.

If a valid current stream fails strict admission, the workspace retires that
exact connection generation and recovers automatically. Recovery preserves the
exact selected Team or Agent, verifies the replacement snapshot against durable
checkpoints, and prevents the stale socket from regaining ownership. There is
no manual **Reconnect** action. The client makes at most five recovery attempts;
if none succeeds, it leaves the Org offline and presents exactly one localized
notice instead of remaining indefinitely in **Connecting**.

A mounted Team uses the same Team workspace panel and task/communication
presentation as a standalone Team. Its live task monitor continues to update
without requiring focus-away/refocus.

## Status And Hierarchy

Each Agent row shows its exact runtime status. Every direct mounted Team row also
shows a presentation-only aggregate over the Agent rows in that Team branch:

```text
running > initializing > error > idle > offline
```

Configured and task-scoped descendant Agents contribute. Direct Org Agents,
sibling Teams, ancestors, and the Team container itself do not. Empty/unknown
input is offline. The aggregate remains visible while the Team is collapsed and
does not own polling, lifecycle, focus, readiness, or command authority.

Task Agents and task Teams are transient execution projections. They can be
nested by task delegation without changing the fixed configured Org topology.

## History, Restore, And Stop

AgentOrg history is a distinct root family. The workspace lists AgentTeam and
AgentOrg roots through their explicit root kinds while using family-specific
trees and loaders.

- Stopped history retains the AgentOrg V1 execution tree, messages, task records,
  member memory, and provider bindings.
- Restore rebuilds the same logical placements and preserves supported provider
  conversation identity.
- A stopped Team can restore independently through its own Team root journey.
- **Stop Org** terminates only the selected Org root and all materialized
  descendants; another standalone Team root remains unaffected.
- Terminal Agent rows become offline and no reconnect control is synthesized.
- Migration/recovery errors are surfaced explicitly; clearing recovery state
  requires a verified successful restore.

## Store And Component Ownership

- `agentOrgDefinitionStore.ts`: admitted catalog and definition CRUD.
- `agentOrgRunConfigStore.ts`: launch draft, sparse overrides, readiness, and
  admission.
- `agentOrgRunStore.ts`: create/restore/terminate and selected Org.
- `agentOrgContextsStore.ts`: hydrated execution contexts.
- `services/agentOrgExecution/agentOrgStreamingService.ts`: stream protocol.
- `services/agentOrgExecution/agentOrgContextHydration.ts`: initial/reopen
  hydration.
- `components/agentOrgs/AgentOrgExperience.vue`: catalog/detail/authoring.
- `components/workspace/config/AgentOrgRunConfigPanel.vue`: launch form.
- `components/workspace/history/AgentOrgRunHistoryPanel.vue`: root/tree
  history and exact focus.
- `components/workspace/org/AgentOrgWorkspaceView.vue`: focused/unfocused and
  stopped workspace states.

Backend contract details are in
[`autobyteus-server-ts/docs/modules/agent_orgs.md`](../../autobyteus-server-ts/docs/modules/agent_orgs.md).
