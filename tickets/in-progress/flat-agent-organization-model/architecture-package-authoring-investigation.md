# Package Authoring — Explicit Version Field Inquiry

**Current status:** Approved RER-029 closes the inquiry; see the AD-REV-020
resolution below. The original request remains chronological evidence.

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

## Approved Re-entry And AD-REV-020 Design Resolution

**Current disposition:** RER-029 at
`0f5014405eb028123afb37013b722acb2d12fe22` explicitly approves removal from
both files. PKG-AUTH-001's Requirements question is closed. The earlier
Team-only/open recommendation paragraphs above are retained historical inquiry
context, not current scope. AD-REV-020 / DS-031–033 specify the response, pending
independent Architecture Review. No engineering pass is implied.

### Additional read-only evidence, 2026-09-11

Source is the unchanged reviewed IR-038 artifact preserved at `14a94fc45`;
subsequent `7ef792130` and `0f5014405` are inquiry/Requirements-only commits.
Current workspace/branch confirmed with git status, log and rev-parse. Other
owners' dirty delivery docs/reports/evidence are present and not staged here.

- Normal `agent-team-definition-config-v2.ts` and
  `agent-org-definition-config-v1.ts` own exact key sets and build functions.
  Their file providers serialize all definitions through these builders.
- `agent-org-owned-definition-source-index.ts:43–52` parses the parent Org
  before enumerating its owned sources. A migration cannot rely on the new
  normal parser's source index to find Teams inside prior-version parents.
- `collaboration-definition-admission/services/definition-admission-service.ts`
  validates raw config before subject services and dependencies; its result and
  `api/graphql/types/definition-admission.ts` expose expectedSchemaVersion.
  These require a coherent field-free current-family diagnostic, not just a
  serializer edit. `file-application-bundle-provider.ts` directly validates Team
  configs and must use the same current codec.
- `agent-packages/services/agent-package-service.ts` imports linked local or
  GitHub source roots through registration/cache refresh. Its
  `utils/package-root-summary.ts` validates physical package structure; it is
  not a second semantic config parser. No separate export command is added by
  this design. Current provider bytes and existing supported file/package
  roundtrip paths must remain consistent.
- `app-data-migration-runner.ts:56–77` skips SUCCEEDED and warning-success
  migrations. Registry orders the family migration after Team Run V2.
  `agent-org-flat-team-families-v1-app-data-migration.ts:87–101` emits numeric
  definition versions; its later execution-tree envelope is separate. Old
  definition validation must be migration-local when the normal codec changes.
- Both executable startup compositions invoke runPending before exposing
  current services. They permit bounded failures and rely on strict current
  per-item admission; no blanket new capability gate is needed for this delta.
- `DefinitionPackageTransaction` already owns ordinary save journal recovery
  through read/commit, with a supplied package validator. The design reuses that
  recovery for any preexisting normal transaction before a migration file write;
  it creates no migration journal or new recovery state.

### Bounded physical/record inventory

Read-only Python Path/glob/JSON and sqlite3 `mode=ro` probes (no writes):

| Source | Observed facts | Interpretation |
| --- | --- | --- |
| `applications/brief-studio/agent-teams/brief-studio-team/team-config.json` | version 2, two members | Repository-owned source/build removal; not runtime mutation |
| `applications/socratic-math-teacher/agent-teams/socratic-math-team/team-config.json` | version 2, one member | Same source/build cohort |
| `/home/autobyteus/data/agent-teams/classroomsimulation/team-config.json` | no version; two refType:agent members; SHA256 prefix 3f246e7135ac | Older shape exists, not an otherwise-current unversioned config; no inference it is admitted/launchable |
| `/home/autobyteus/data` direct Team/Org/Org-owned Team definition globs | One config found | Bounded actual path sample, not a universal deployed cutover inventory |
| `/tmp/autobyteus-dr008-user-test-20260911/server-data` and `/root/.autobyteus/server-data` same globs | Zero configs found | Empty writable sample roots do not prove absence of registered external packages |
| DR-008 `agent-package` source root | Two Org configs version 1 and two Team configs version 2 | Registered test package evidence, not writable data-root migration authority; preserve other-owner fixtures |
| `/home/autobyteus/data/db/production.db` migration status | Team tree migrations and 20260901 family SUCCEEDED; 20260905 summary SUCCEEDED_WITH_WARNINGS | Distinct state records; no manual resets or assumption old family will rerun |
| DR-008 server-data `db/production.db` migration status | Team tree migrations, family and summary SUCCEEDED | Same completed-entry skip consequence; DB query does not validate a new authoring implementation |

No external public/private project was mutated or reclassified as server-owned.
The coexistence of an older data-root config and a completed family status does
not establish why that file is there or authorize status reset/runtime replay.
An unsupported source is reported intact by the new pass. Cutover enumerates
actual owned paths under the configured data root; captured counts are not a
hard-coded migration cohort. No secret data/provider traces were read for this
probe and no running Delivery app was stopped or reconfigured.

### Result and self-validation boundary

AD-REV-020 isolates exact prior version validation within migrations, keeps
20260901 historical outputs fixed, adds one ordered definition-only pass for
already-completed installations, and uses zero-write current-field-free skips.
Both current family codecs and diagnostics become version-free; runtime/schema
versions and task/UI behavior stay unchanged. Self-validation VAL-046–050 covers
actual authoring/roundtrip, strict rejections, migration ordering, owned child
inventory, external zero writes, retry/status and no runtime rewrite. Real
source/file/runner/browser tests and fresh Delivery remain downstream work.
