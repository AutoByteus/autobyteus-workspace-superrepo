# AgentTeam Definition

## Scope

Defines reusable **flat** Team blueprints. A Team contains Agent placements only
and has exactly one direct Agent coordinator. Persistent multi-Team composition
belongs to [AgentOrg](./agent_orgs.md), not to AgentTeam.

## Canonical Definition File

A normal Team definition uses
`agent-teams/<team-definition-id>/team-config.json` and exact
`schemaVersion: 2`:

```json
{
  "schemaVersion": 2,
  "coordinatorMemberName": "researcher",
  "members": [
    {
      "memberName": "researcher",
      "ref": "researcher",
      "refScope": "team_local"
    }
  ],
  "handoffs": [],
  "avatarUrl": null,
  "defaultLaunchConfig": null
}
```

The adjacent `team.md` owns authored name, description, category, and
instructions.

## Member And Coordinator Rules

- Every configured member is an Agent. Team V2 member records therefore have no
  `refType`.
- `memberName` is a unique path-safe address segment.
- `ref` identifies the referenced Agent definition.
- `refScope` is explicit and is one of `shared`, `team_local`, or
  `application_owned` when permitted by the owning source.
- `coordinatorMemberName` must resolve to exactly one direct Agent member.
- Team, AgentOrg, missing, ambiguous, cyclic, or unsupported member references
  fail admission. They are never silently flattened.

A Team-local Agent is stored below the Team's `agents/<agent-id>/` directory.
Application-owned Teams may reference valid same-application or Team-local Agent
sources, but they still cannot contain Teams.

## Ownership And Source Boundaries

| Definition source | Catalog behavior | Write boundary |
| --- | --- | --- |
| Shared `agent-teams/<id>/` | Standalone reusable Team | Shared Team provider |
| Application `applications/<app>/agent-teams/<id>/` | Application-owned Team, also inspectable in the Team UI | Owning writable application bundle |
| Registered external package root | Admitted only when already valid Team V2 | Read-only to this repository/process unless that package owner updates it |

Normal admission is target-only. Unversioned files, retired `refType` member
records, or wrong versions are rejected with the package root, definition
identity/path, expected version, and reason. Current runtime does not retry a
legacy parser or rewrite an external source.

## Team-Local Handoffs

`handoffs` is an ordered list of directional guidance records:

```json
{
  "from": "/researcher",
  "to": "/writer",
  "rules": [
    "Send verified evidence when the draft is ready."
  ]
}
```

For a flat Team, both endpoints resolve to direct Agent members of that Team.
`from` is always an Agent. Rules are ordered natural-language conditions, not
executable authorization. Duplicate effective endpoint pairs, direct
self-delivery, invalid addresses, empty rules, and stale references fail the
complete definition update atomically.

Organization-scoped handoffs are authored on AgentOrg. An AgentOrg handoff may
target a mounted Team address; delivery then enters through that Team's direct
coordinator without changing the Team definition.

## Default Launch Preferences

`defaultLaunchConfig` may seed a standalone Team draft with `runtimeKind`,
`llmModelIdentifier`, and `llmConfig`. Workspace, automatic-tool policy, and
skill access remain run-configuration concerns rather than definition-default
fields.

When a Team is mounted in an AgentOrg, its definition defaults do not silently
override the Org run configuration. Effective Org launch resolution is:

```text
exact Agent placement override -> mounted Team placement override -> Org root
```

## Runtime Relationship

A standalone Team persists as native Team execution-tree V2 under
`memory/agent_teams/<team-run-id>/`. Its configured root remains flat.
Task delegation may still create task-scoped Team executions beneath a run;
those transient execution relationships are not configured Team membership.

See [Agent Team Execution](./agent_team_execution.md),
[AgentOrg](./agent_orgs.md), and [Run History](./run_history.md).

## TS Source

- `src/agent-team-definition/domain/agent-team-definition.ts`
- `src/agent-team-definition/providers/agent-team-definition-config-v2.ts`
- `src/agent-team-definition/providers/file-agent-team-definition-provider.ts`
- `src/agent-team-definition/services/flat-team-definition-resolver.ts`
- `src/agent-team-definition/services/flat-team-definition-validator.ts`
- `src/api/graphql/types/agent-team-definition.ts`
- `src/agent-tools/agent-team-management`
