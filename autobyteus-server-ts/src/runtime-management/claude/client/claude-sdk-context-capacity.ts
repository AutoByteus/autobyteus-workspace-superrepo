import {
  isContextCapacity, unknownCapacity, type RuntimeModelCapacities, type RuntimeModelCapacity,
} from "../../../llm-management/domain/runtime-model-capacity.js";

type Control = {
  close(): void;
  supportedModels?(): Promise<unknown>;
  setModel?(model: string): Promise<unknown>;
  getContextUsage?(): Promise<unknown>;
};
const object = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;

/** Zero-turn metadata operation: caller owns production spawn/auth/cwd; no session binding. */
export async function readClaudeContextCapacities(
  models: readonly string[], createControl: () => Promise<Control>, timeoutMs = 20_000,
): Promise<RuntimeModelCapacities> {
  const result: Record<string, RuntimeModelCapacity> = Object.fromEntries(models.map((model) =>
    [model, unknownCapacity("Claude runtime capacity lookup unavailable.")]));
  let control: Control | null = null;
  let expired = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { expired = true; reject(new Error("Metadata timeout")); }, timeoutMs);
  });
  const operation = async () => {
    const created = await createControl();
    if (expired) { created.close(); return; }
    control = created;
    if (!control.supportedModels || !control.setModel || !control.getContextUsage) return;
    const rows = await control.supportedModels();
    if (!Array.isArray(rows)) return;
    for (const model of models) {
      if (expired) return;
      const descriptor = rows.map(object).find((row) => row?.value === model);
      if (!descriptor) continue;
      await control.setModel(model);
      if (expired) return;
      const usage = object(await control.getContextUsage());
      const resolved = descriptor.resolvedModel;
      if (typeof resolved !== "string" || !resolved || usage?.model !== resolved ||
          !isContextCapacity(usage.rawMaxTokens)) continue;
      result[model] = { kind: "known", tokens: usage.rawMaxTokens, source: "claude-sdk:rawMaxTokens" };
    }
  };
  try { await Promise.race([operation(), timeout]); }
  catch { /* Unknown, never a guessed limit. */ }
  finally {
    expired = true;
    clearTimeout(timer);
    try { (control as Control | null)?.close(); } catch { /* best effort */ }
  }
  return result;
}
