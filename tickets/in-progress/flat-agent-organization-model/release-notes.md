# AORG-FLAT-TEAM-001 Release Notes (Draft)

## Agent Organizations And Flat Teams

- Agent Teams are reusable flat groups of direct Agents with one direct Agent coordinator.
- Agent Orgs combine direct Agents with reusable flat Teams without inventing an Org coordinator.
- A new AgentOrg run shows `New - <AgentOrg name>` until its first accepted non-empty user message reaches an exact configured direct Agent or an Agent inside a mounted Team.
- That first message becomes the stable history title using the same whitespace compaction and 100-character limit as Team history. Later messages, task-scoped recipients, internal/task/system/control traffic, and rejected or failed sends do not replace it.
- The active Workspaces row refreshes from authoritative persisted history after acceptance without page reload or optimistic submitted-text projection.
- Existing empty AgentOrg titles are recovered at startup only when one uniquely earliest qualifying configured-member trace can be proven; ambiguous or absent evidence safely keeps the `New` fallback.
- A failed derived history-index write no longer risks an unhandled promise rejection or server termination. The accepted Agent message remains accepted, later same-path persistence remains available, and no replay/relabel is introduced.
- The familiar **Workspaces** hierarchy remains available throughout AgentOrg configuration, active work, focus changes, Restore, and stopped history. **Agent Orgs** remains a distinct sibling directly below **Teams**.
- Fresh AgentOrg configurations select the real **Temp Workspace (Default)** when available; exact URL/center/highlight, locked member configuration, same-monitor **Back**, and distinct **New** behavior remain intact.
- Member overrides retain the approved collapsed Team hierarchy, exact inheritance/customization state, and coordinator identity.
- AgentOrg recovery remains automatic-only and bounded; standalone Teams and Agent Orgs retain separate durable families for history, Restore, Stop, tasks, messaging, and provider identity.
- Existing supported fixed-depth data migrates to Team V2 and AgentOrg V1. Incompatible external packages require publication by their owning repositories.

## Validation

- Cumulative source review: `CRR-040 / Pass`.
- API/E2E: `API-REV-013 / Pass`, `98.4%`; broader validation completed and no current finding remains.
- Proportional durable test-code review: `CRR-041 / Not Applicable` because API/E2E changed no durable test or production source.
- Delivery confirmed the latest base was already integrated, passed the exact atomic-writer/AgentOrg stream regression (`2` files / `11` tests), completed the guarded ARM64 Electron build, and launched the actual package with a healthy embedded server and visible window.

## User-Verification Build

- Package source/checkpoint: `759a2b470f4826db4bb4bb6c9788f4c490cf97b2`.
- AppImage: `AutoByteus_enterprise_linux-arm64-1.4.68.AppImage`.
- SHA-256: `2e23ff1a10d74b0743620d311a36a095c77d14ad82670099fe0fa53564c834aa`.
- Status: running for renewed explicit user verification; this draft is not released.

## Compatibility Note

Definitions in separately maintained external packages remain unavailable until their owners publish Team V2 / AgentOrg V1-compatible packages. Compatible definitions and server/history functions remain available; there is no legacy runtime fallback.
