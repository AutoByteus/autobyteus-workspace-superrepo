import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { getCodexAppServerClientManager } from "./codex-app-server-client-manager.js";
import type { CodexAppServerClientManager } from "./codex-app-server-client-manager.js";
import {
  isContextCapacity, unknownCapacity, type RuntimeModelCapacities, type RuntimeModelCapacity,
} from "../../../llm-management/domain/runtime-model-capacity.js";

const object = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
const execute = promisify(execFile);
const METADATA_TIMEOUT_MS = 20_000;
// Codex's provider catalog cache is fresh for five minutes. Never accept an old offline snapshot.
const CACHE_MAX_AGE_MS = 300_000;

export function decodeCodexContextCapacity(input: {
  catalog: unknown; model: string; version: string; custom: boolean;
  override: unknown; now: number;
}): RuntimeModelCapacity {
  const catalog = object(input.catalog);
  if (!catalog || !Array.isArray(catalog.models)) return unknownCapacity("Codex catalog shape unavailable.");
  if (!input.custom) {
    const fetchedAt = typeof catalog.fetched_at === "string" ? Date.parse(catalog.fetched_at) : NaN;
    if (catalog.client_version !== input.version || !Number.isFinite(fetchedAt) ||
        fetchedAt > input.now || input.now - fetchedAt > CACHE_MAX_AGE_MS) {
      return unknownCapacity("Codex catalog version or freshness could not be verified.");
    }
  }
  const rows = catalog.models.map(object).filter((row) => row?.slug === input.model);
  if (rows.length !== 1 || !isContextCapacity(rows[0]?.context_window)) {
    return unknownCapacity("Exact Codex model context unavailable.");
  }
  const row = rows[0]!;
  const defaultCapacity = row.context_window as number;
  if (input.override != null) {
    // An override cannot itself prove model capability. Only catalog-evidenced ceilings qualify.
    const ceiling = isContextCapacity(row.max_context_window) ? row.max_context_window : defaultCapacity;
    if (!isContextCapacity(input.override) || input.override > ceiling) {
      return unknownCapacity("Configured Codex context is not covered by model metadata.");
    }
    return { kind: "known", tokens: input.override, source: "codex-runtime-catalog:configured-context" };
  }
  return { kind: "known", tokens: defaultCapacity, source: "codex-runtime-catalog:context_window" };
}

/** Isolates the current private Codex catalog shape from product selection policy. */
export class CodexModelCapacityReader {
  constructor(private readonly clients: Pick<CodexAppServerClientManager, "acquireClient" | "releaseClient"> =
    getCodexAppServerClientManager()) {}

  async resolveMany(cwd: string, models: readonly string[]): Promise<RuntimeModelCapacities> {
    const unavailable = () => Object.fromEntries(models.map((model) =>
      [model, unknownCapacity("Codex runtime capacity lookup unavailable.")]));
    let acquired = false;
    try {
      const client = await this.clients.acquireClient(cwd);
      acquired = true;
      const launch = client.getLaunchContext();
      const available = new Set<string>();
      let cursor: unknown = null;
      do {
        const response = object(await client.request("model/list", { cursor, includeHidden: false }, METADATA_TIMEOUT_MS));
        if (!Array.isArray(response?.data)) return unavailable();
        for (const row of response.data) {
          const model = object(row)?.model;
          if (typeof model === "string") available.add(model);
        }
        cursor = response.nextCursor;
      } while (typeof cursor === "string" && cursor.length > 0);
      const response = object(await client.request("config/read", { cwd, includeLayers: true }, METADATA_TIMEOUT_MS));
      const config = object(response?.config);
      if (!config) return unavailable();
      const home = path.resolve(launch.env?.CODEX_HOME || path.join(launch.env?.HOME || homedir(), ".codex"));
      // Runtime-reported user-layer location also catches wrappers that change CODEX_HOME.
      const userLayers = Array.isArray(response?.layers) ? response.layers
        .map((layer) => object(object(layer)?.name)).filter((name) => name?.type === "user") : [];
      if (!userLayers.length || userLayers.some((layer) =>
        typeof layer?.file !== "string" || path.dirname(layer.file) !== home)) return unavailable();
      const { stdout } = await execute(launch.command, ["--version"], {
        cwd: launch.cwd, env: launch.env, timeout: METADATA_TIMEOUT_MS,
      });
      const version = /^codex-cli (\S+)\s*$/.exec(stdout)?.[1];
      if (!version) return unavailable();
      const customPath = config.model_catalog_json;
      // The shared default cache has no provider provenance for a different endpoint.
      const provider = typeof config.model_provider === "string" ? config.model_provider : "openai";
      const customProvider = object(object(config.model_providers)?.[provider]);
      if (customPath == null && (provider !== "openai" || customProvider?.base_url != null)) return unavailable();
      if (customPath != null && (typeof customPath !== "string" || !path.isAbsolute(customPath))) return unavailable();
      const catalogPath = typeof customPath === "string" ? customPath : path.join(home, "models_cache.json");
      const catalog: unknown = JSON.parse(await readFile(catalogPath, "utf8"));
      return Object.fromEntries(models.map((model) => [model, available.has(model)
        ? decodeCodexContextCapacity({ catalog, model, version, custom: typeof customPath === "string",
            override: config.model_context_window, now: Date.now() })
        : unknownCapacity("Model is not in the current Codex runtime catalog.")]));
    } catch {
      return unavailable();
    } finally {
      if (acquired) await this.clients.releaseClient(cwd);
    }
  }
}
