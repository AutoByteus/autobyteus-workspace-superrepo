# Package Authoring — Explicit Version Field Inquiry

## PKG-AUTH-001 — User-requested simplification

- Date: 2026-09-11.
- Stable package: AORG-FLAT-TEAM-001.
- Outcome: Requirement Gap — requested authoring-contract change conflicts with
  an explicit approved field requirement; not a source defect against that requirement.
- Current requirements authority: RER-028, including REQ-026 / REQ-027 and
  AORG-CONTRACT-001's definition formats.
- Inspected worktree: `requirements/flat-agent-organization-model`, HEAD
  `14a94fc45de8bcab271e996eb7d6e8440f0d3ac5`.
- This is a bounded inquiry, not a completed architecture-design revision,
  implementation assignment, test result, or delivery decision.

## Supported authoring scenario and user direction

A package author brings an existing Agent-only Team into the current product.
After learning that its members no longer use `refType` and that its config now
requires `schemaVersion: 2`, the user requests removing the version attribute:
“we should remove the schemaVersion this attribute” because authors previously
did not have to supply it. The supplied article-writing-team screenshot shows
the earlier unversioned Team config with Agent member `refType` and handoffs.

User evidence:
`/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/software_engineering_team_570be46d520142849ac61785be03dca1/architecture_designer_6b8b3019214246e086957b3f395901bb/context_files/ctx_2ebad1bebd19__image.png`.

## Read-only source findings

1. At immutable earlier Team baseline
   `5fb16658e7bd2aefd750f99eb596a17382e161ac`,
   `autobyteus-server-ts/src/agent-team-definition/providers/file-agent-team-definition-provider.ts`
   reads the earlier config through `normalizeTeamConfigRecord`, including
   member `refType`, without the current explicit schema-version admission.
2. Current `agent-team-definition/providers/agent-team-definition-config-v2.ts`
   requires exact top-level keys including numeric `schemaVersion: 2` and exact
   member keys `memberName`, `ref`, `refScope`. Its provider uses that strict codec.
3. Current `agent-org-definition/providers/agent-org-definition-config-v1.ts`
   similarly declares numeric `schemaVersion: 1` for Org authoring. The Org
   member kind remains meaningful (`agent` versus `agent_team`), unlike Team.
4. REQ-026 explicitly requires both authored version fields and rejection of
   unversioned definitions. This is not merely an incidental implementation
   detail that Architecture can remove while claiming unchanged requirements.

## Technical assessment and bounded Requirements request

The explicit field supplies a format discriminator at definition admission.
It is a design/contract choice, not an intrinsic necessity for hand-authored
configuration. A single strict current-shape codec selected by the Team/Org
package family can be forward-only without a user-entered version field.
Removing the field must not be confused with accepting all retired shapes,
restoring Team member `refType`, or reintroducing configured nesting.

Requirements Engineering should reconcile the user's requested Team authoring
simplification with REQ-026 and the contract supplement. Applying the same
authoring simplification to `org-config.json` is Architecture's consistency
recommendation; the screenshot is a Team example, not separate explicit
approval of every related format decision. Do not expand this inquiry into
changes to other required/defaultable fields.

Preserve saved Team/Org execution-tree schema versions, root/file/path
boundaries, runtime migration ownership, and the two external repositories'
read-only status. No user direction here asks to remove versions from runtime
data. After approved re-entry, Architecture must assess current versioned
server-owned definitions, import/export and admission consumers, diagnostics,
and the bounded persisted-definition transition. No normal dual parser or
external-project rewrite is authorized by this inquiry.

## Result boundary

No requirements, contract, source, tests, or existing design artifacts changed.
Unrelated Delivery-owned dirty documentation/builds/evidence were preserved.
Only this Architecture-owned inquiry is persisted for the Requirements handoff.
The requested authoring correction is pending upstream reconciliation; no
change to the running product or expanded validation pass is claimed.
