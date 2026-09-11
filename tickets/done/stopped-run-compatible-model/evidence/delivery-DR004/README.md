# DR-004 — Stable v1.4.69 release evidence

Current outcome is `result-summary.json` and the canonical release/deployment report. Initial preflight and prior DR-003 snapshots remain historical. Exact helper/remote/version checks, public GitHub release and CI job results, downloaded metadata/package checks, anonymous Docker index verification and initial iOS failure/retry/scope exception are retained. Raw failure log bytes were not rewritten to remove compiler whitespace. No raw xcresult or release binaries are tracked.

The read-only monitor snapshots preserve actual progression; no success inferred from queued/in-progress. All four required release workflows ultimately passed; iOS was user-excluded and also passed on its already-started second attempt. No duplicate new-tag dispatch, source/test change, failure waiver disguised as a Pass, or production data mutation.

Full downloaded release files and final commit/push/clean-state receipt are under `/home/autobyteus/workspace/.codex/artifacts/stopped-run-compatible-model-DR004/`. The tagged SHA is immutable; a later evidence-only commit is not a new product release. Exact terminal dispatch success is established by the message tool receipt.
