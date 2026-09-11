## What's New

- Change the model for a stopped Agent or configured Team from Settings, then continue the same conversation with its existing history and context.
- Choose a replacement within the current runtime with verified equal-or-larger context capacity. Review the new model's settings and defaults before explicitly saving.

## Improvements

- Team model changes apply to originally linked scopes while preserving independently configured or directly edited members.
- Model and settings are saved together. Saving does not start a run, reset history, or alter retained compaction state.
- Settings-only edits for the same model remain available without a replacement-capacity comparison.

## Fixes

- If a Team Save cannot confirm its persisted result, Settings now requires canonical verification or Retry before another Save, preventing duplicate changes.

## Compatibility Notes

- Runtime changes and smaller or unknown-capacity replacement models are not supported. Existing active, archived, and Application-managed run restrictions remain in place.
- Keep frontend and backend versions aligned: stopped-run Save now requires the model identifier and settings together.

## Known Limitation

- A separately observed Team handoff approval issue remains unresolved; this release does not claim to fix it.
