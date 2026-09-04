# AORG-FLAT-TEAM-001 Release Notes (Draft)

## Agent Organizations And Flat Teams

- Agent Teams are reusable flat groups of direct Agents with one direct Agent coordinator.
- Agent Orgs combine direct Agents with reusable flat Teams without inventing an Org coordinator.
- Running an Org configures the whole organization first; you then choose the exact Agent or Team to work with.
- Member overrides use the approved collapsed Team hierarchy, show exact inheritance/customization state and coordinator identity, and preserve exact root/Team/Agent readiness.
- Failed Agent runtime choices remain retryable and can be safely abandoned without leaking a stale override.
- Team and AgentOrg authoring and runtime surfaces use the current English and Simplified-Chinese localization catalogs.
- AgentOrg stream recovery is automatic-only and preserves exact focus through a verified replacement. It uses a browser-legal close code, makes at most five attempts, exposes no manual Reconnect action, and reports one localized notice rather than remaining indefinitely in Connecting.
- Standalone Teams and Agent Orgs keep separate durable history, Restore, Stop, task, messaging, and provider-identity behavior.
- Existing supported fixed-depth data migrates at startup to the flat Team V2 and AgentOrg V1 families. Incompatible external definition packages must be republished by their owning repositories.

## Validation

- Cumulative source review: `CRR-032 / Pass`, `9.4/10`.
- API/E2E: `API-REV-008 / Pass`, `98.4%`; REPO-001–003 and LIVE-001–006 passed.
- Production Chromium confirmed legal close code `4000`, no `InvalidAccessError`, no permanent Connecting state, no manual Reconnect, and exactly one notice after bounded exhaustion.
- Delivery merged the latest `origin/personal`, ran the full guarded ARM64 Electron build, and launched the packaged app with a healthy embedded server and visible window.

## User-Verification Build

- Integrated commit: `0fb57d902b63d2d927e34ead64a7fb62bf808c09`.
- AppImage: `AutoByteus_enterprise_linux-arm64-1.4.67.AppImage`.
- SHA-256: `111830cfd723d160d9d692e8860130979403daf7af9ea5bfe51bc4ae31daf1a5`.
- Status: running for explicit user verification; this draft is not yet released.

## Compatibility Note

Definitions in separately maintained external packages remain unavailable until their owners publish Team V2-compatible packages. Compatible definitions and server/history functions remain available; there is no legacy runtime fallback.
