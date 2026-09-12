import fs from "node:fs/promises";
import path from "node:path";

export type ContextFileRecordSource = Readonly<{ filePath: string; kind: "trace" | "tasks" | "messages" }>;
export type LocatorTransform = (locator: string, field: string) => Promise<string>;
const object = (value: unknown, field: string): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${field} must be an object.`);
  return value as Record<string, unknown>;
};
const array = (value: unknown, field: string): unknown[] => {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array.`);
  return value;
};
const entries = async (directory: string) => fs.readdir(directory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
  if (error.code === "ENOENT") return [];
  throw error;
});

/** Only app-owned raw media and formal sidecar reference fields, never prose or provider history. */
export async function listContextFileRecordSources(input: {
  rootDirectories: readonly string[];
  agentDirectories: readonly string[];
}): Promise<ContextFileRecordSource[]> {
  const sources: ContextFileRecordSource[] = [];
  for (const directory of new Set(input.rootDirectories)) {
    for (const entry of await entries(directory)) {
      const kind = /^(agent_org_)?task_delegation_records\.json$/.test(entry.name) ? "tasks"
        : /^(team|agent_org)_communication_messages\.json$/.test(entry.name) ? "messages" : null;
      if (kind && entry.isFile()) sources.push({ kind, filePath: path.join(directory, entry.name) });
    }
  }
  for (const directory of new Set(input.agentDirectories)) {
    for (const entry of await entries(directory)) {
      if (entry.isFile() && (entry.name === "raw_traces_active.jsonl" || /^raw_traces_\d{6,}\.jsonl$/.test(entry.name))) {
        sources.push({ kind: "trace", filePath: path.join(directory, entry.name) });
      }
    }
  }
  return sources.sort((a, b) => a.filePath.localeCompare(b.filePath));
}

/** File-bounded parsing. Unchanged JSONL lines and terminators retain their original bytes. */
export async function transformContextFileRecordLocators(
  source: ContextFileRecordSource, text: string, transform: LocatorTransform,
): Promise<string> {
  let changed = false;
  const strings = async (parent: Record<string, unknown>, key: string, field: string) => {
    const values = array(parent[key], field);
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (typeof value !== "string" || !value.trim()) throw new Error(`${field}[${i}] must be a locator string.`);
      const next = await transform(value, `${field}[${i}]`);
      if (value !== next) { values[i] = next; changed = true; }
    }
  };
  if (source.kind === "trace") {
    const lines = text.split(/(\r?\n)/);
    for (let i = 0; i < lines.length; i += 2) {
      const line = lines[i]!;
      if (!line.trim()) continue;
      const row = object(JSON.parse(line), `line ${i / 2 + 1}`);
      if (row["media"] === undefined || row["media"] === null) continue;
      const media = object(row["media"], `line ${i / 2 + 1}.media`);
      changed = false;
      for (const key of ["images", "audio", "video"]) {
        if (media[key] !== undefined) await strings(media, key, `line ${i / 2 + 1}.media.${key}`);
      }
      if (changed) lines[i] = JSON.stringify(row);
    }
    return lines.join("");
  }
  const root = object(JSON.parse(text), source.filePath);
  const key = source.kind === "tasks" ? "records" : "messages";
  for (const [i, value] of array(root[key], key).entries()) {
    const row = object(value, `${key}[${i}]`);
    await strings(row, "referenceFiles", `${key}[${i}].referenceFiles`);
    if (source.kind === "tasks") {
      for (const [j, update] of array(row["updates"], `${key}[${i}].updates`).entries()) {
        const row = object(update, `updates[${j}]`);
        if (row["referenceFiles"] !== undefined) await strings(row, "referenceFiles", `${key}[${i}].updates[${j}].referenceFiles`);
      }
    }
  }
  return changed ? `${JSON.stringify(root, null, 2)}\n` : text;
}
