# AORG-FLAT-TEAM-001 Release Notes (Draft)

## Agent Organizations And Flat Teams

- Agent Teams are reusable flat groups of direct Agents with one direct Agent coordinator.
- Agent Orgs combine direct Agents with reusable flat Teams without inventing an Org coordinator.
- The familiar **Workspaces** hierarchy remains available throughout AgentOrg configuration, active work, focus changes, Restore, and stopped history. **Agent Orgs** appears as a distinct sibling directly below **Teams**.
- Switching between an AgentOrg member and a standalone Agent or Team now keeps one truthful URL, center surface, and highlighted history row.
- Fresh AgentOrg configurations select the real **Temp Workspace (Default)** when it is available, while explicit existing/new Workspace choices remain authoritative.
- A focused direct or mounted-Team Agent's gear opens that exact current AgentRun in the locked configuration view. **Back** returns to the same Event Monitor; **New** remains a separate fresh-Org action.
- Member overrides retain the approved collapsed Team hierarchy, exact inheritance/customization state, and coordinator identity.
- Failed Agent runtime choices remain retryable and can be safely abandoned without leaking stale configuration.
- AgentOrg stream recovery is automatic-only, exact-focus preserving, browser-contract safe, bounded to five attempts, and reports once instead of remaining indefinitely in Connecting.
- Standalone Teams and Agent Orgs retain separate durable root families for history, Restore, Stop, tasks, messaging, and provider identity.
- Existing supported fixed-depth data migrates at startup to Team V2 and AgentOrg V1. Incompatible external packages require publication by their owning repositories.

## Validation

- Cumulative source review: `CRR-036 / Pass`.
- API/E2E: `API-REV-010 / Pass`, `98.3%`; all REPO-001–003 and LIVE-001–006 passed.
- Proportional durable test-code review: `CRR-037 / Pass`.
- Delivery merged latest `origin/personal`, passed the current 15-file/189-test navigation/config/history cohort, completed the guarded ARM64 Electron build, and launched the actual package with a healthy embedded server and visible window.

## User-Verification Build

- Integrated commit: `fa7693e5210d306d8216a035e93e9dc11f8efe04`.
- AppImage: `AutoByteus_enterprise_linux-arm64-1.4.68.AppImage`.
- SHA-256: `661032b9c10f5cafefd2029d0a9ea63171b12911b5953c88f5af37ab636d5aa1`.
- Status: running for renewed explicit user verification; this draft is not released.

## Compatibility Note

Definitions in separately maintained external packages remain unavailable until their owners publish Team V2-compatible packages. Compatible definitions and server/history functions remain available; there is no legacy runtime fallback.
