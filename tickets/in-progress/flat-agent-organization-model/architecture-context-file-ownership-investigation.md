# Architecture Context-File Ownership Investigation

## Status and scope

- Package AORG-FLAT-TEAM-001; Architecture recovery IR048-DI-001 / AD-REV-025.
- Approved authority RER-033@f84c5299f10898f49acff6a0e481d1cd61c769a9.
- Source checkpoint 6d77b3c8b2d3deeddd5c3392dc2ce69bc63b7982;
  incoming result 5636a1f3a7978cd280a85f7f4602c8db5c63b6ab.
- Last completed independent review ARCH-REV-021@93aafae8f13a239b382a5f3f246f10b661f90733
  on AD-REV-024@b26c90787cf5ded1da6364ca52e7ae1e6b635cba.
- Read-only Architecture investigation 2026-09-12. No source/test changes,
  migration execution, user-data mutation or browser/provider rerun.
- This evidence map supplements the canonical design. It is not a competing
  requirement or an executable pass. DS-041–043 own the proposed correction.

## Supported scenario and root cause

A user uploads to an exact configured Agent, sends, delegates supported work to
an Agent/Team at the same configured source address, and later opens a retained
attachment. A temporary execution has a distinct AgentRun ID even when its address
matches the configured source. The same collision applies across direct Org and
mounted/fresh-Team contexts. Task settlement preserves the indexed execution.
These are approved user/task/history paths, not scenarios justified merely by
constructing a synthetic tree.

IR-048's probe reproduces that supported state using actual strict tree/store,
location and owner resolver implementations. It does not exercise file upload or
write bytes. Its one passing observation asserts the broken rejection; it is not
a successful product test. It correctly returns the new API/identity issue to
Architecture rather than guessing at a Local Fix.

| Evidence | Observed current responsibility / defect |
| --- | --- |
| `autobyteus-server-ts/src/context-files/domain/context-file-owner-types.ts` | Org draft has orgDraftId/address; final has orgRunId/address. Locator builders omit exact AgentRun ID. |
| `.../context-files/services/context-file-owner-resolver.ts` | Both async finalization and sync file-location paths pass root/address without agentRunId. Returned location includes agentRunId, but only after an ambiguous lookup. |
| `.../agent-org-execution/services/agent-org-execution-tree-location-service.ts` | Already accepts agentRunId and validates exactly one matching indexed execution across retained configured/task nodes. STORED_ONLY default does not activate a runtime. |
| `.../agent-collaboration/execution/services/collaboration-execution-location-service.ts` | Explicit family/root/AgentRun selection already composes existing strict readers. No new index needed. |
| `.../agent-memory/store/agent-memory-layout.ts` | Existing final physical path includes exact AgentRun ID and genuine Team ancestry. File bytes do not need re-keying for the new final locator. |
| `.../context-files/store/context-file-layout.ts` | Org draft directory is address-shared, unlike final exact physical storage. |
| `.../context-files/services/context-file-finalization-service.ts` | Resolve final owner, ensure directory, move/reuse each filename, emit final locators, prune draft. Needs matching exact Org owner-pair validation before mutation. |
| `.../context-files/services/context-file-upload-service.ts`, `context-file-read-service.ts` | Existing MIME/filename/TTL/read/delete owners are reusable. Draft admission must retain exact Org execution identity. |
| `.../api/rest/context-files.ts` | Org draft/final GET routes are address-only; Org draft DELETE is missing. Existing POST/delete errors400 and missing files404 provide current error grammar. |
| `.../context-files/services/context-file-local-path-resolver.ts` | Current regexes reconstruct address-only descriptors before provider normalization. Must change in lockstep with REST/builders. |
| `.../agent-execution/input/agent-run-provider-input-normalizer.ts` and `domain/agent-run.ts` | Provider dispatch uses a copied/normalized message; attachment owner correction must preserve original accepted URI and exact local file resolution, not mutate admission/ack policy. |
| `.../agent-memory/services/runtime-memory-event-payload.ts`, `runtime-memory-event-accumulator.ts` | Forwarded image/audio/video URIs persist in raw-trace media fields. |
| `.../run-history/projection/event-monitor-active-trace-page-projection.ts` and raw-trace transformer | Normal retained media projection carries saved URIs through to user attachment rendering. No current old-to-new URL transform exists. |
| `autobyteus-web/components/agentInput/ContextFilePathInputArea.vue` | IR-048 connects Org chooser to existing draft upload but drops the captured AgentRun when building owner. Exact active target is already available. |
| `autobyteus-web/stores/agentOrgContextsStore.ts` | submitPreparedAgentMessage captures org ID, AgentRun, address and context; finalization builders currently discard AgentRun. Deliberate continuation and local-submission guards already exist. |
| `autobyteus-web/utils/contextFiles/contextFileOwner.ts`, `contextAttachmentModel.ts`, `composables/useContextAttachmentComposer.ts`, `stores/contextFileUploadStore.ts` | Builders, locator recognizers, owner equality, remove/clear and result hydration must agree. No durable Org draft-owner browser registry was found in these stores/composer. |

## Original Team comparison (read-only)

`git rev-parse origin/personal` returned 5645b49d6f51faa60bd3545bc8e3f0e7e3f96793;
no fetch or branch switch. `git show origin/personal:<path>` read:

- `autobyteus-server-ts/src/context-files/domain/context-file-owner-types.ts`:
  standalone final owner is runId; Team final owner is containing teamRunId/address.
- `.../context-files/services/context-file-owner-resolver.ts`: passes containing
  TeamRun ID and address to the location service.
- `.../run-history/services/team-run-execution-tree-location-service.ts`:
  filters index candidates and requires exactly one; agentRunId input already exists.
- `.../agent-team-execution/services/team-execution-index.ts`: task Team members
  belong to their fresh TeamRun; direct task Agents retain their actual owner Team.

Therefore the older Team contract distinguishes members in different fresh task
Teams, but can still be ambiguous for same-host/address task Agents. No claim of
an observed baseline failure or new Team correction is made. Current Org owner
uses only root/address and loses even the containing-Team distinction. The target
uses exact AgentRun ID with root membership validation, not a fake Team parent.

## Read-only persisted-data samples and limits

Two Python read-only walks inspected JSON/JSONL under the named roots, excluding
symlinks and files above 20MB. Broad string matches were refined to structured
string fields; conversation prose mentioning routes was excluded. Counts are
observations, not a production-wide cutover inventory. No attachment content,
credentials or user conversation text was copied into this artifact.

| Sample root | Observation |
| --- | --- |
| `/home/autobyteus/data` | 1325 JSON/JSONL files in bounded first walk; 178 context-file paths; zero Org trees. Broad route mentions were not treated as actual locators. |
| `/home/autobyteus/data/memory/agent_teams` | 166 actual server-relative Team final URLs in raw-trace `media.images[]`; 97 nested-root, 69 flat-root. Every URL's filename maps to exactly one physical context file in its root; all 166 also match the trace owner's directory. This latter observation is not a general permission to infer owner from viewer/record. |
| `/root/.autobyteus/server-data` | 99 JSON/JSONL files in bounded walk; 4 Org trees; zero context-file paths and no matching structured attachment locator fields. |
| `/tmp/autobyteus-dr009-user-test-20260911/server-data` | 29 JSON/JSONL files in bounded walk; 2 Org trees; zero context-file paths and no matching structured attachment locator fields. |

The 166 URLs occur in 77 trace files totaling 92,559,674 bytes; largest file 7,852,024
bytes. These metadata counts support a per-file transformation, not loading or
rewriting the entire history corpus.

The 166 saved URLs prove a concrete continuity issue: the family migration renames
nested Team packages to agent_orgs while their structured attachment locators
still name the Team route. The current Team route correctly resolves only Team
family locations. Existing migration source converts tree/sidecar envelopes and
moves directories; it does not rewrite these media locators. Existing context-file
bytes are correctly exact-AgentRun located and should stay so.

The normal path through raw-trace media serialization and history projection
establishes why the URI fields matter. Required initial conversion must preserve
usable links, not just byte-preserve a string that points to the wrong family.
This is separate from removing authored schemaVersion or renaming org_local.

## Additional evidence-only Implementation response

Implementation confirmed no prior real user/deployed Org attachment inventory.
The preservation hash inventory is not a content inventory. API29's particular
Org chooser attempts emitted zero uploads, but that does not prove global absence.
The owner variants/builders were introduced at 37d05c7f71df925dd6f36a4fb1668ef8e1cee450
(2026-09-01), which is source lineage, not deployment proof. DR009 is documented
local user-test exposure, not a public rollout or proof about shared data.
Architecture requested only existing provenance from Delivery; no new mutation,
rebuild or implementation task was assigned.

## Decisions and non-decisions

- Exact Org owner/locator is DS-041; shared-surface and service ownership DS-042.
- DS-043 isolates known saved-locator transformation in the existing initial
  family migration. It preserves original file bytes and exact source ownership.
- Do not add a new migration merely because local test artifacts used an older
  branch shape. Conversely, never assume saved attachment data absent from the
  definition-authoring first-run premise.
- A real cutover must record actual data roots, affected structured locator/draft
  cohorts and migration status. Unknown draft ownership or already-completed
  migration plus old locators is a concrete return condition, not permission to
  discard, reset/replay or add a permanent address-only reader.
- Existing RER033/AD024 naming and first-run target remain; no new Product or
  Requirements decision is invented. No architecture-created implementation
  handoff, source/test modification, native runtime action or validation pass.
