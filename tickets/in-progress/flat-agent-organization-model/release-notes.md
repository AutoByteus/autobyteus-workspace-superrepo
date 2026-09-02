# AORG-FLAT-TEAM-001 Release Notes (Draft)

## Agent Organizations And Flat Teams

- Agent Teams are now reusable flat groups of Agents with one direct Agent coordinator.
- Agent Orgs can combine direct Agents with reusable Teams without inventing an Org coordinator.
- Running an Org configures the whole organization first; you then choose the exact Agent or Team to work with.
- Member overrides show the approved collapsed Team hierarchy, exact inheritance/customization state, and coordinator identity.
- Runtime/model readiness is checked for every root, Team, and Agent scope. Failed Agent runtime choices stay retryable and can be safely abandoned without leaking a stale override.
- Standalone Teams and Agent Orgs keep separate durable history, restore, Stop, task, messaging, and provider-identity behavior.
- Existing supported fixed-depth data is migrated at startup to the flat Team V2 and AgentOrg V1 families; incompatible external definition packages must be republished by their owning repositories.

## Validation

The reviewed current artifact passed the full repository and real-system API/E2E plan at 97.9% confidence (REPO-001–005 and LIVE-001–014).

## Current Delivery Blocker

This draft is not released. The standard ARM64 Electron package build is blocked by unresolved localization literals in ticket UI files.
