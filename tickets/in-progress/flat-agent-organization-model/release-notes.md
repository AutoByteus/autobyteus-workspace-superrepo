# AORG-FLAT-TEAM-001 Release Notes (Draft)

## Agent Organizations And Flat Teams

- Agent Teams remain reusable flat groups of direct Agents with one direct-Agent coordinator; Agent Orgs combine direct Agents and reusable flat Teams without an Org coordinator.
- A durably accepted same-Org message between configured Agents now appears exactly once as inbound member input in the receiving Agent's center event monitor.
- Every selected configured Agent in an AgentOrg—direct or mounted-Team-hosted—has the shared right-side **Messages** experience over the owning Org, with truthful sent/received direction, exact complete-Org counterpart identity, content, time, and references.
- Direct-to-direct, direct-to-mounted, mounted-to-direct, and mounted-to-mounted configured communication is covered. Messages involving task-scoped endpoints remain excluded from configured-member center/Messages presentation.
- AgentOrg status snapshots traverse each structural Team root once and delegate recursive task descendants to that Team, preventing duplicate AgentRun status identities while preserving the flat directory for routing, settlement, and whole-Org shutdown.
- Existing first-message AgentOrg titles, unified **Workspaces**, exact focus/configuration, automatic-only recovery, Task review/acceptance, history/Restore/provider continuation, terminal Stop, and migration behavior remain intact.
- The historical standalone-Team `submit_task_result` stall was not reproduced on the unchanged artifact. Correlated validation crossed local MCP ingress, Team FIFO, durable commit, HTTP/provider completion, revision/resubmission/acceptance, clean restart/Restore, and provider continuation; no timeout, retry, replay, or product-source change was introduced.
- Existing supported fixed-depth data migrates to Team V2 and AgentOrg V1. Incompatible external packages require publication by their owning repositories.

## Validation

- Cumulative source review: `CRR-044 / Pass`, `9.4/10`.
- Focused runtime origin review: `CRR-045`; no source finding.
- API/E2E: `API-REV-016 / Pass`, `97.6%`; all planned and held paths completed, `API-FIND-021` resolved for validation, no current finding.
- Proportional durable test-code review: `CRR-046 / Not Applicable` because API-REV-016 changed no repository-resident durable test or production source.
- Delivery confirmed the latest base was already integrated and built the guarded ARM64 Electron package for actual user verification.

## User-Verification Build

- Package source/checkpoint: `6bca86cac41c3171b35eba3c38b7543da3fde62d` plus Delivery-owned documentation/evidence, which does not change the binary.
- AppImage: `AutoByteus_enterprise_linux-arm64-1.4.68.AppImage`.
- Size: `524007444` bytes; SHA-256: `85b082299b25b1c5279ca9e9bf433920cbe5fb1331b63685e6c2f02a175aaf5d`.
- Status: running for explicit user verification; this draft is not released.

## Compatibility Note

Definitions in separately maintained external packages remain unavailable until
their owners publish Team V2 / AgentOrg V1-compatible packages. Compatible
definitions and server/history functions remain available; there is no legacy
runtime fallback.
