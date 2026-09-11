# History Selection Versus Runtime Restore — HIST-INSPECT-001

- Package: AORG-FLAT-TEAM-001; date: 2026-09-11.
- Outcome: confirmed Architecture-owned Design Impact in the configured Org
  member history-selection/continuation boundary, not a missing Product decision.
- Authority: approved RER-032; latest completed design remains AD-REV-022.
- This is an investigation, not a completed replacement design or AD revision.
- Workspace: /home/autobyteus/workspace/.codex/worktrees/flat-agent-organization-model
- Branch: requirements/flat-agent-organization-model.
- Initial inspected source: af2d6a046633edf8f98f83aca58e3697ee009197.
- Final source checkpoint: 25436ef4d3d0ed94e1389e9619d17f68e5126067.
  The concurrent composer correction changed none of the compared history
  action, Team hydration/open, Org status-row or Org manager files.
- Read-only comparison: local origin/personal at
  5645b49d6f51faa60bd3545bc8e3f0e7e3f96793 and immutable earlier Team baseline
  5fb16658e7bd2aefd750f99eb596a17382e161ac. No fetch was performed.

## Supported User Scenario

The user stops and restarts the server, then clicks a previously run Team Agent
to inspect its retained conversation. It remains Offline. Clicking a configured
Agent in an old Org instead makes that Org and its configured Agents green/Idle,
even though the user sends no new message and requests no resume. The supplied
DR-009 screenshots show this contrast. The user explicitly expects the earlier
nested-Team history-browsing behavior, not activation on focus.

## Evidence And Causal Path

All relative paths below are under the canonical worktree.

| Boundary | Evidence | Observed source behavior |
| --- | --- | --- |
| Earlier Team history open | `origin/personal:autobyteus-web/services/runOpen/teamRunOpenCoordinator.ts:34-79` | Hydrates the requested retained context. Connects a stream only if the root is already active; otherwise disconnects it. No restore mutation. |
| Earlier Team history hydration | `origin/personal:autobyteus-web/services/runHydration/teamRunContextHydrationService.ts:215-309`; `teamExecution/teamExecutionContextFactory.ts:71-78` | Queries resume configuration and member projections, preserves server isActive, and initializes Agent contexts Offline. Despite the helper name hydrateLiveTeamRunContext, this is not a runtime restore. Both open/hydration files are unchanged between the pinned earlier baseline and local origin/personal. |
| Earlier Team deliberate continuation | `origin/personal:autobyteus-web/stores/agentTeamRunStore.ts:250-264` | RestoreAgentTeamRun is called when sending to an inactive selected Team, followed by exact target hydration and submission. Clicking history and sending are separate triggers. |
| Org root-row history open | `autobyteus-web/composables/useWorkspaceHistorySubjectActions.ts:52-65` | Correctly uses inspect for inactive roots and navigates in history mode. |
| Org retained task inspection | Same action owner, lines 68-78 | Also uses inspection rather than restore for inactive roots. |
| Defective configured Org selection | Same action owner, lines 81-91 | For an inactive run, select explicitly awaits orgRunStore.restore, connects a stream, refreshes history, and navigates in active mode. Both configured Agent and mounted-Team row clicks enter this selection action. |
| Actual runtime consequence | `autobyteus-web/stores/agentOrgRunStore.ts:30-39`; server `agent-org-run-service.ts:133-141`; `agent-org-run-manager.ts:91-106,186-224` | Executes RestoreAgentOrgRun, materializes the root runtime and registers it active. This is not only loading display data. |
| Full-scope consequence | `autobyteus-server-ts/src/agent-org-execution/services/agent-org-execution-scope-builder.ts:119-139,164-179` | Prepares configured direct Agents and mounted flat Teams, commits the plans and activates the Org. Thus one row click can activate the complete configured Org. Green Idle is not proof of a new provider turn, but the root has actually been reactivated. |
| Status presentation | `autobyteus-web/utils/agentOrgHistoryRows.ts:44-75` | Reads exact Agent status only when history and matching context are active/live; otherwise projects historical Offline. The observed active/Idle signals follow the unwanted restore trigger, not merely a hard-coded green dot. |
| Existing read-only alternative | `autobyteus-web/stores/agentOrgContextsStore.ts:69-101`; server `agent-org-run-manager.ts:132-161` | Loads a strict inspection snapshot and member history without constructing a runtime; inactive inspection has no live status entries. |
| Test preserving the divergence | `autobyteus-web/composables/__tests__/useWorkspaceHistorySubjectActions.spec.ts:71-97` | Explicitly expects a stopped root to be restored when a member is selected. Passing this assertion would preserve the user's reported regression. |

## Architecture Responsibility And Recovery Boundary

Unlike COMPOSER-001's omitted existing submission step, this path was retained
in design: `design-spec.md:2258-2268` introduces historical read-only contexts but
expressly preserves the existing configured-Agent restore journey. It did not
separate ordinary configured-member inspection from deliberate continuation.
Architecture therefore owns removing that retained assumption; recoloring the
dots or changing only the test is not a sufficient correction.

Required recovery direction is the established Team distinction: root/member/
mounted-Team history navigation reads and selects retained history without
activation; deliberate continuation restores through the existing Org root
owner and then submits to the exact intended Agent. Existing full-scope Org
activation, no initial fallback, settled-task read-only behavior, root identity,
message/task persistence and actual Agent status sources remain unchanged.

The completed correction must also specify continuation from an inactive
configured-Agent context. Current historical Org targets are read_only and have
no interaction port. Simply replacing restore with inspect in one click handler
would leave that continuation path incomplete. Keep retained settled tasks
non-resumable, preserve exact target/draft across hydration, and coordinate with
the separate COMPOSER-001 submission fix rather than reverting it. Do not create
a new lifecycle owner, fake Team root, auto-resume on mount/reconnect, or false
Offline display for a genuinely active runtime.

Validation must distinguish no-input inspection from explicit send: after a
supported server restart, click root/direct Agent/mounted Team/member and retained
task links; assert history is visible, no restore mutation/provider activation or
active-registry change occurs, and status remains truthful. Then deliberately
continue an eligible configured Agent and verify exact one-submission behavior,
real status changes, failure handling and focus-switch isolation. Repeat the
Team control. Existing root/task inspection-only checks do not cover configured
row selection. Broader independent design routing follows the completed impact
revision; this investigation is not an implementation assignment or new pass.

## Evidence Limits And Preservation

This round inspected code, existing test assertions and the user's screenshots.
It did not restart the live server, click the app, execute provider/browser tests,
change source/tests, modify Requirements, or verify a fix. Delivery-owned dirty
documents and the concurrent implementation work were preserved. The user has
provided the intended behavior; no new visual prototype is needed to explain it.

Screenshot directory:
/home/autobyteus/data/memory/agent_teams/software_development_department_d2b93633ad6b4d969e6e0d776dda7721/software_engineering_team_570be46d520142849ac61785be03dca1/architecture_designer_6b8b3019214246e086957b3f395901bb/context_files/

Files: ctx_6f27f0dafc4c__image.png; ctx_224155d0014a__image.png;
ctx_575becb8b204__image.png; ctx_f7211ebc5911__image.png.

## Related Terminate-To-Configuration Finding — HIST-INSPECT-002

The user additionally reports that terminating the selected Org replaces the
event monitor with the new-Org launch form, unlike Team termination. Read-only
source inspection at 00c3aeea7f6cb4fc22ee57e8c47c9a993f249aa4 confirms why:

- `autobyteus-web/composables/useWorkspaceHistorySubjectActions.ts:37-49`
  awaits successful root termination, disconnects/removes the Org context, then
  replaces the current matching active route with `mode: configuration`. The
  replacement keeps only the definition ID and drops the run/member identity.
- `autobyteus-web/stores/agentOrgContextsStore.ts:49-62` removes the disconnected
  run's context and pending focus. Thus retaining just the old center route
  without providing stopped history would not be sufficient either.
- `autobyteus-web/components/layout/WorkspaceAdaptiveLayout.vue:18-19,185-187`
  displays AgentOrgRunConfigPanel for that configuration route instead of the
  retained execution workspace.
- `autobyteus-web/components/workspace/config/AgentOrgRunConfigPanel.vue:109-113,343-394`
  calls launch only through runOrg, wired to the Run button. Mounting the form
  fetches definitions/workspaces and applies defaults; it does not create an Org
  runtime. The observed screen therefore suggests a new run but does not itself
  start one. This differs from HIST-INSPECT-001's actual restore-on-click.
- `autobyteus-web/stores/agentTeamRunStore.ts:200-218` terminates, disconnects,
  marks the existing context/history inactive and cleans up Agent runtime status
  without removing the selected Team context or navigating to launch. This method
  is byte-identical to local origin/personal at the pinned comparison revision.
  `useWorkspaceHistoryMutations.ts:59-75` adds pending/error handling, not a new
  route. The selected conversation is retained rather than replaced by a form.
- `useWorkspaceHistorySubjectActions.spec.ts:125-142` explicitly expects the
  Org stop-to-configuration redirect. This assertion protects the divergence;
  it is not independent evidence of intended Team-equivalent behavior.

Include this in the same history/lifecycle recovery: successful stop of the
selected Org should retain the same run and exact selected Agent's conversation
with truthful stopped/Offline status; stop of another root must not hijack the
current workspace. Terminate is not New Run. New configuration remains an
explicit user action; later deliberate continuation remains distinct from
history inspection. Preserve stop failure/pending handling and root ownership.
Provide the stopped inspection context safely rather than merely removing the
redirect and leaving the center without data, or retaining stale live ports.

This is another implementation divergence requiring coordinated presentation
boundary correction, not a request to alter backend termination, invent a new
Product screen, or restart the stopped Org. Add selected direct/mounted/task
conversation retention, no create/restore mutation, other-root selection, and
failed-stop checks to recovery validation. No source/test change or live
termination was performed in this investigation; no fix/pass is claimed.
