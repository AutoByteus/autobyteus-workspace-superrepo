# Task Detail And History Heading Cleanup

- Package: AORG-FLAT-TEAM-001; date: 2026-09-11.
- Inquiry: UI-CLEAN-001; not a completed AD revision.
- Workspace: /home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model
- Branch: requirements/flat-agent-organization-model.
- Current requirements: RER-029@0f5014405eb028123afb37013b722acb2d12fe22.
- Last completed design: AD-REV-020@a83fa7541e8648a5472493f214a3ba8ed14af6b6;
  ARCH-REV-018 Pass. Inspected source HEAD: 932c81b2261ffcc21ac540b0f25522ecfa1cb29a.

## User-Approved Presentation Direction

1. Remove the always-visible participant name/ID strip above task detail.
   Keep the familiar task heading, status, direction, timestamp and content.
   Preserve exact execution navigation through participant names; identity
   detail need not be permanently displayed. The user accepted this proposal:
   "yesss. i believe its simple change".
2. Change only the left Workspaces/history category heading from `Agent Orgs`
   to the user's exact requested `Org`, directly beneath `Teams`. The request
   and screenshot identify this heading, not the main navigation, domain/API
   names, category membership or run titles. Do not silently pluralize to `Orgs`.

## Read-Only Evidence And Responsibility

- `autobyteus-web/components/workspace/collaboration/CollaborationDelegatedTasksSection.vue:75–83`
  adds a nav before the shared detail pane, displaying participant label plus
  `agentRunId.slice(-6)`. Lines 129–139 route the exact execution on click.
- The earlier `TeamDelegatedTasksSection.vue` at immutable baseline
  5fb16658e7bd2aefd750f99eb596a17382e161ac renders the detail pane directly
  without that nav. This baseline and local origin/personal 5645b49d6 are
  identical for the compared section and item-detail files.
- `TeamDelegatedTaskItemDetail.vue` retains the original header/body template;
  only its type import differs from the earlier baseline. The extra strip is
  an Architecture/Implementation presentation choice, not task message content.
- DS-029 must retain exact task-Agent/task-Team selection and historical access
  when moving the controls. Labels alone are not identity. This needs no new
  backend, persistence, lifecycle, task policy, or Product prototype.
- `WorkspaceHistoryWorkspaceSection.vue` renders
  `WorkspaceAgentOrgHistoryCollection` below the Team collection. Its existing
  test asserts the `Agent Orgs` heading follows `Teams`.
- Canonical BEH-014, UC-016, REQ-031, AC-026, SCN-015 and DEC-017 expressly
  name `Agent Orgs`. The new literal copy requires Requirements-owned
  synchronization; this is not a missing user decision or an invitation to
  redesign the history surface.

## Disposition And Next Action

Bounded Requirement Gap: canonical heading copy conflicts with the user's
already-approved replacement. Requirements Engineering should reconcile that
literal and its investigation/revision references, retaining all ordering,
history, category and identity behavior. Approval is supplied above; no new
Product gate is requested. Task-strip cleanup remains Architecture-owned under
the existing familiar-task-detail requirements and direct user confirmation.

After synchronization, combine these presentation-only adjustments in the next
architecture impact revision, with focused validation of uncluttered detail,
exact live/retained navigation, Team regression, and unchanged history order.
Expected focused scope is Small/Low; final classification/routing follows the
completed design. AD-REV-020's authoring transition is unaffected. No source,
test, upstream artifact, runtime or other-owner evidence was changed by this
inquiry. No implementation or delivery pass is claimed.

## User Evidence

- Task-strip screenshot: /home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/software_engineering_team_570be46d520142849ac61785be03dca1/architecture_designer_6b8b3019214246e086957b3f395901bb/context_files/ctx_1b892b545fae__image.png
- Heading screenshot: /home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/software_engineering_team_570be46d520142849ac61785be03dca1/architecture_designer_6b8b3019214246e086957b3f395901bb/context_files/ctx_5c796264f166__image.png
