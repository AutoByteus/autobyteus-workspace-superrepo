# Implementation Handoff — AORG-FLAT-TEAM-001 / IR-048

## Result / classification
**Blocked — Design Impact IR048-DI-001. Not ready for source review, renewed API/E2E or Delivery.**
- Cycle: Rework; cumulative IR001–048. `implementation-revision-record.md` retains IR001 baseline and all prior rounds. Current code and this document are authoritative.
- Source/test checkpoint: **6d77b3c8b2d3deeddd5c3392dc2ce69bc63b7982** (20explicit owned paths). Entry HEAD93aafae8f13a239b382a5f3f246f10b661f90733. This is a development checkpoint, not a completed fix or validated release artifact.
- **task_size=Large / architectural_risk=High — Confirmed / Reviewed**, not downgraded. Focused authoring Medium/High plus frontend Local Fix. New demonstrated file ownership/API decision requires **Architecture Designer**, not a source/API bypass. Lightweight direct-route self-review N/A.

## Upstream cumulative package
- Route Architecture Design; **RER033@f84c5299f10898f49acff6a0e481d1cd61c769a9 / AD024@b26c90787cf5ded1da6364ca52e7ae1e6b635cba / ARCH021 Pass@93aafae8f13a239b382a5f3f246f10b661f90733**, retaining RER032/AD023/ARCH020 and all still-applicable earlier approvals.
- Canonical requirements-doc.md, investigation-notes.md, requirements-revision-record.md, agent-org-contract.md; routing assessment remains in requirements/investigation/design. design-spec.md, architecture-design-revision-record.md, architecture-design-self-validation.md, design-review-report.md, architecture-review-revision-record.md remain upstream authority.
- Triggering rework **CRR072 / CR-FIND037 / API29 / API-FIND031 / VAL055** plus user/Architecture clarification to validate upload AND click/open, draft/sent/retained/remove/clear/send. User asked to combine the additional approved PKG-AUTH002 request before one review. Original frontend omission remains implementation-owned; new exact-file-owner impact is separate.
- Product authority remains RV012 core, status, Team-overrides VIS-OVR001–006 and baseline promotion; historical VIS015 is not current override authority. Heading remains **Orgs**, below Teams. No new Product change.
- Still-relevant investigations: package-authoring, task-parity, UI-cleanup, assertion-validity, history-inspection, composer-submission, Team-stream-warning. Prior stopped-run-model/task-monitor requirements and production_data_migration_conventions.md remain applicable. No authoring-only first-run premise is applied to attachment data.

## Current implementation trace
| Behavior/design boundary | Current code | Outcome |
| --- | --- | --- |
| DS038 / PKG-AUTH002 normal family | Org domain scope, strict codec, owned source index, exhaustive GraphQL converters | Normal authored scope `org_local`; internal `agent_org_owned` source/ownership and opaque refs retained; GraphQL AGENT_ORG_OWNED unchanged; unknown no fallthrough. Locally checked, not reviewed. |
| DS039–040 and updatedDS032/033 | migration-only `collaboration-definition-authoring-transition.ts`, existing20260901 family and20260911 authoring pass | Pure prior-to-final candidate strips only approved numeric version and replaces exact old Org scope, preserves other raw values; final unversioned/org_local generated directly. Committed writer + strict final reread/equality, physical owned children/journal recovery, current zero-write, cleanup gates. No new migration ID/registry/reset/runtime replay. Locally checked, not reviewed. |
| Input/file parity / CR-FIND037 | ContextFilePathInputArea -> active target; frontend Org owner variants/locator hydration/composer comparison; agentOrgContextsStore captured attachment finalization | Actual selected direct/mounted Org uploads through existing backend draft contract; exact-context pending/focus/newer edit behavior retained. Finalize only on deliberate Send after existing continuation readiness, before one prepared command. **Partial: real final owner is ambiguous after retained same-address tasks.** |
| DS035–037 / CR-FIND035/036 | Existing context store/strict publication/composer/Team view | Preserved; no owner relocation, runtime/lifecycle/cache/retry/poll/replay change. Existing focused regression cohort passed. CR-FIND036 was already execution-resolved by API29, not reopened. |

## Design health / blocker
See **implementation-evidence/IR-048/design-impact.md** and exact actual-owner probe/log. The normal stored tree accepts retained tasks sharing a configured address; location lookup with exact AgentRun succeeds, but the existing final-file descriptor and URL omit that identity. Both finalization and later GET require a unique address match and reject. Choosing configured/first/live or faking standalone ownership is unauthorized. Architecture must settle exact file ownership/locator/data implications before implementation continues. This is not a Requirement Gap, a new provider/runtime stall, or a new browser failure claim.

## Local validation and scope
- Web87files/717tests; server31files/184tests; server full build/bootstrap smoke; web/localization guards and literal audit0. Separate real resolver observation passes expected-rejection assertions, proving the blocker, not functionality.
- Native Chromium renderer16observations at1440x900/390x844: actual chooser, exact client owner, uploaded text popup content, remove/clear, prepared send/echo, retained PNG opening; no overflow/pageerrors. **External I/O doubled**; these successes do not prove the backend owner on repeated addresses. No provider/API/native-shell/deployment/user approval.
- Full logs, path lists, source inventory, intermediate setup errors and renderer sources/screenshots retained in implementation-evidence/IR-048. Production web build and AppImage not run after the impact was established; further validation held.
- Source implementation maximum494nonempty lines; largest changed production delta96lines. No in-scope normal compatibility alias, retired numeric helper/export or default-to-application mapping retained. Migration-only source knowledge stays isolated. New frontend variants match the existing backend union; no new file storage family added.
- Persisted transition: approved existing startup-only definition migrations updated; runtime generators/versions and registry unchanged. Attachment contract transition **not implemented—Design Impact**.

## Preservation / downstream requirements
- All17090 starting other-owner hashes unchanged; explicit20path source checkpoint only. API-owned registered model probe +13/-2, dirty source-bound docs/Code Review/API/Delivery records and raw evidence retained. Own renderer route/process and three initially absent SDK outputs removed. Existing DR009 app untouched.
- API29 remains Fail78.9/incomplete; nine formal cycles36calls retain their recorded scope. Held files/readiness/newer drafts/discard/focus-root, full Stop/final-read/negative/stale-generation, actual Team replacement/reconnect, second restart/finalUIStop still require complete renewed current-artifact API/E2E after source Pass. No historical substitution.
- Preserve CRR059/CRR067/IR041/DR007/DR009 and API27 limits, pending proportional model-probe review, and unknown historical stalls/API20 first guard/delay. No reassignment or invented cause.
- Selected result route: Architecture Designer for the demonstrated exact-file-owner decision. Once reviewed guidance returns, reconcile this checkpoint and complete **one cumulative implementation/source-review package**; no partial advancement requested now.
