/** Total runtime model context, before output reservation or safety margins. */
export type RuntimeModelCapacity =
  | Readonly<{ kind: "known"; tokens: number; source: string }>
  | Readonly<{ kind: "unknown"; reason: string }>;
export type RuntimeModelCapacities = Readonly<Record<string, RuntimeModelCapacity>>;
export const isContextCapacity = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;
export const unknownCapacity = (reason: string): RuntimeModelCapacity => ({ kind: "unknown", reason });
