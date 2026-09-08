import { isDeepStrictEqual } from "node:util";
import type { AgentRunMetadataStore } from "../store/agent-run-metadata-store.js";
import type { AgentRunMetadata } from "../store/agent-run-metadata-types.js";

export type AgentRunModelConfigCommitResult =
  | Readonly<{ kind: "committed" | "unchanged"; metadata: AgentRunMetadata }>
  | Readonly<{ kind: "not_found" | "archived" | "failed" | "indeterminate"; metadata: AgentRunMetadata | null }>;

export const commitAgentRunModelConfig = async (input: {
  metadataStore: Pick<AgentRunMetadataStore, "readMetadata" | "writeMetadata">;
  runId: string;
  cataloged: boolean;
  archived: boolean;
  llmModelIdentifier: string;
  llmConfig: Readonly<Record<string, unknown>> | null;
}): Promise<AgentRunModelConfigCommitResult> => {
  const metadata = await input.metadataStore.readMetadata(input.runId);
  if (!metadata || !input.cataloged) return { kind: "not_found", metadata };
  if (input.archived) return { kind: "archived", metadata };
  const nextLlmConfig = input.llmConfig ? structuredClone(input.llmConfig) : null;
  if (metadata.llmModelIdentifier === input.llmModelIdentifier && isDeepStrictEqual(metadata.llmConfig ?? null, nextLlmConfig)) {
    return { kind: "unchanged", metadata };
  }
  const nextMetadata: AgentRunMetadata = {
    ...metadata,
    llmModelIdentifier: input.llmModelIdentifier,
    llmConfig: nextLlmConfig,
  };
  try {
    await input.metadataStore.writeMetadata(input.runId, nextMetadata);
    const reread = await input.metadataStore.readMetadata(input.runId);
    if (!reread) return { kind: "indeterminate", metadata };
    if (reread.llmModelIdentifier !== input.llmModelIdentifier || !isDeepStrictEqual(reread.llmConfig ?? null, nextLlmConfig)) {
      return { kind: "failed", metadata: reread };
    }
    return { kind: "committed", metadata: reread };
  } catch {
    const reread = await input.metadataStore.readMetadata(input.runId).catch(() => null);
    if (reread && reread.llmModelIdentifier === input.llmModelIdentifier && isDeepStrictEqual(reread.llmConfig ?? null, nextLlmConfig)) {
      return { kind: "committed", metadata: reread };
    }
    return {
      kind: reread ? "failed" : "indeterminate",
      metadata: reread ?? metadata,
    };
  }
};
