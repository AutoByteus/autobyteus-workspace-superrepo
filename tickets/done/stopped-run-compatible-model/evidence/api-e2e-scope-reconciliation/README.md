# API-REV-003 — reporting/scope reconciliation evidence

Completed 2026-09-10 UTC. Ticket result **Pass95%**; CRF-002 reporting-only Local Fix resolved. API-F001 remains separately unresolved, not this ticket's defect/blocker under user-confirmed CRR-004. Original API-REV-002 Fail84.3%, C16 Fail and C19 Pass control are unchanged. A successful retry is not an issue fix.

## Authority and user signal

Read current CRR-004 report/revision/separate-issue note/source audit, prior canonical API artifacts, current DR-002 and retained upstream authority. Requirements AC-001–013 and implementation legacy/removal/persisted-transition basis rechecked; no new requirements or source scope. RER-004 / AD-REV-001 / ARCH-REV-002 / IR-002 / CRR-002 / CRR-003 remain attributed authority. Prototype/UI-UX N/A. Medium/High/Reviewed unchanged.

Code Reviewer reports the user explicitly separated the approval issue and said **“yesss. so i think our ticket is fine”**. Preserve this exact signal for Delivery's user-verification/finalization handling. Neither this note nor that confirmation is a claim of a completed release.

## Proportionate checks actually performed

Working directory:
`/home/autobyteus/workspace/.codex/worktrees/stopped-run-compatible-model`

```sh
python3 tickets/in-progress/stopped-run-compatible-model/evidence/api-e2e-scope-reconciliation/check-retained-evidence.py
python3 tickets/in-progress/stopped-run-compatible-model/evidence/api-e2e-scope-reconciliation/check-retained-evidence.py --final
git diff --check
```

Both Python modes exit0; final mode also executes/asserts `git diff --check` exit0. These are **read-only retained-evidence/report checks, not a rerun of the live workflow or repository test suite**. Source retained next to results.

- `intake-integrity.json`: pre-edit SHA256 snapshot of214 evidence/upstream/AppImage files, four prior canonical artifact hashes, HEAD/tracked diff/index diff hashes. Taken after reading incoming scope but before canonical report edits.
- `retained-evidence-checks.json`:18 positive integrity/correlation assertions. Compares exact saved tree/selection and non-tree/workspace/provider history hashes, one stopped Save/exact three patches, same identities and both original Luna/Astra provider turn IDs/completed replies. Reads only the two previously owned provider transcripts; sends no inference request. Checks three durable source hashes against API-REV-001, original results and exact user signal, and DR-002 AppImage hash.
- `final-checks.json`: adds full historical API-REV-002 report byte preservation, four canonical revision markers/current scope consistency, and diff check.22 assertions are audit checks, not22 new product tests. No source/test/index/HEAD delta and no changed preserved file.
- `result-summary.json`: current scoped result and separate issue status. Historical E1/E2 result JSONs remain untouched.

The full old report is retained verbatim within the canonical current report's explicitly historical details section. Investigation/ledger chronology and revision1/2 entries remain, with round3 appended. This is not a parallel canonical report. Previous raw evidence/source/logs/screenshots were not edited.

## Evidence reuse, scope and limits

API-REV-001's248 selected tests, server build, six durable browser scenarios and actual standalone/configured nested/organically compacted Codex continuation remain prior execution, not rerun. API-REV-002's imported Classroom Luna→Stop→Astra→normal-message proof for both original members remains actual prior execution. Retained provider records corroborate model use independently of self-report. Earlier C16 approval symptom remains separately unresolved; no emission/hydration/focus-only/preexisting attribution or speculative fix.

Current95%=seven95% categories is the API owner's ticket-scope reassessment against retained direct proof, not a reviewer-prescribed score or confidence from user approval alone. See canonical report for category reasons and AC/case mapping. Further broader validation Not Required for a reporting-only delta with no changed runtime/source/test boundary. Full-suite, frontend-typecheck, provider/platform matrix and native GUI limits remain; no new such execution.

No production/durable edits, fixture/service/browser/database/account allocations, staging/commit/push/merge/archive/release. No cleanup of shared state or previous evidence. Delivery AppImage preserved and matches DR-002 SHA256 `9ee0b9d410554741d83c52fdc67b2de0c6ee96bc3c40ee04ca34a2edbe931881`. DR-002 build/package startup belongs to Delivery, not API.

## Routing

Use completed-result `get_handoff_rules`; send only the most-specific matching outcome recipient the cumulative packet. Reviewed High-risk Pass requires proportional handling by Code Reviewer; with no new durable delta, request Not Applicable and preservation of CRR-003. Carry the user's exact confirmation through the returned route to Delivery. Dispatch is successful only when `send_message_to` confirms it; no polling or duplicate Delivery outcome assignment.

Manifest preparation note: the first assembly command assumed the prior handoff index was a JSON array and stopped on an explicit assertion; it is an object with `reference_files`. Corrected only that extraction and verified every referenced path exists. No old evidence or product test result changed. The separate read-only audit still passed; no blanket claim that every helper command exited0.
