# API-F001 — separate observation and ticket scope

CRR-004 focused failure-origin review, 2026-09-10. Original observation remains unresolved as a separate concern; no claim of a fix or proven preexisting runtime defect.

## User clarification

After the reviewer explained that the approval issue occurred before model change, the requested switch passed, and no causal link had been established, the user agreed to separate it and said: “yesss. so i think our ticket is fine”. This confirms ticket-scope separation; it is not authorization to erase failure evidence or claim release/finalization complete. Delivery owns remaining acceptance/finalization handling.

## Evidence and limits

- API-REV-002's actual imported Classroom Team Settings Luna→Astra Save and both original provider conversations' normal continuation passed. Save/continuation assertions and exact paths remain in `../api-e2e-classroom/README.md`.
- Original student call `call_XYnZdKnQnyfw523jfpi9D4QT` / invocation `exec-ec7b79eb-b998-484f-bbe1-29194da31ec4` began 22:54:05.224Z and was still unresolved at 22:56:46.526796Z, before Stop or model change. Correct duration161.3s, not sidebar age. Student view/reopen showed no approval action.
- Later invocation `exec-e61e788f-6cac-4338-946b-804cd96b8a0e` has recorded TOOL_APPROVAL_REQUESTED → exact UI approval → DELIVERED. Stop/new turn/model/focus differed; this neither resolves the original call nor identifies focus as its cause.
- Existing runtime trace sequencer records only the first call observation per tool identity. Both original and successful-control retained calls have source_event TOOL_EXECUTION_STARTED; only the control has a successful result. Absence of an approval row in raw traces cannot establish absence of runtime approval emission.
- Current Team view/stream dispatch is addressed by agentRunId, not restricted to the focused member. Executing→awaiting-approval is an allowed frontend status transition. Member inspection may hydrate a non-authoritative projection before focus. Without original WebSocket/request/projection state, this is not enough to attribute the symptom to runtime emission, event delivery, or hydration; no fix is prescribed.
- Eight relevant inspected approval/event/hydration files are unchanged versus approved base. This bounds changed-source attribution but is NOT a pristine-base behavioral reproduction.

## Disposition

Supported ordinary Classroom messaging observation; separate from this ticket's demonstrated model-selection behavior. Not unsupported/contrived, not proven resolved, not promoted to a model-switch source defect or deduction. Preserve API-F001 and its evidence for a separate issue; do not expand or block this ticket absent a demonstrated causal link.

API/E2E owns a bounded reporting correction: append the scope disposition, retain API-REV-002's honest historical observation, distinguish requested workflow Pass from separate approval symptom, and return an accurately scoped current validation result. No new implementation, source review score, costly rerun, migration, lock, retry, or workflow redesign is required by this review.
