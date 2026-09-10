import { describe, expect, it, vi } from 'vitest';
import { commitAgentRunModelConfig } from '../../../../src/run-history/services/agent-run-model-config-commit.js';
const metadata = () => ({ runId: 'same-run', llmModelIdentifier: 'old', llmConfig: null, platformAgentRunId: 'same-thread', runtimeKind: 'codex_app_server', workspaceRootPath: '/workspace' } as any);
describe('Agent model selection commit', () => {
  it('treats model-only edits as dirty and writes/read-backs the complete pair once', async () => {
    let saved = metadata();
    const store = { readMetadata: vi.fn(async () => saved), writeMetadata: vi.fn(async (_id, next) => { saved = next; }) };
    const input = { metadataStore: store, runId: 'same-run', cataloged: true, archived: false, llmModelIdentifier: 'new', llmConfig: null };
    expect((await commitAgentRunModelConfig(input)).kind).toBe('committed');
    expect(saved).toEqual({ ...metadata(), llmModelIdentifier: 'new' });
    expect((await commitAgentRunModelConfig(input)).kind).toBe('unchanged');
    expect(store.writeMetadata).toHaveBeenCalledTimes(1);
  });
  it('does not confirm a settings match with the wrong model identity', async () => {
    const store = { readMetadata: vi.fn(async () => metadata()), writeMetadata: vi.fn(async () => {}) };
    expect((await commitAgentRunModelConfig({ metadataStore: store, runId: 'same-run', cataloged: true, archived: false, llmModelIdentifier: 'new', llmConfig: null })).kind).toBe('failed');
  });
  it('recovers the canonical pair after a reported write failure', async () => {
    let saved = metadata();
    const store = { readMetadata: vi.fn(async () => saved), writeMetadata: vi.fn(async (_id, next) => { saved = next; throw new Error('uncertain response'); }) };
    const result = await commitAgentRunModelConfig({ metadataStore: store, runId: 'same-run', cataloged: true, archived: false, llmModelIdentifier: 'new', llmConfig: { effort: 'high' } });
    expect(result).toMatchObject({ kind: 'committed', metadata: { llmModelIdentifier: 'new', llmConfig: { effort: 'high' }, platformAgentRunId: 'same-thread' } });
  });
  it.each(['missing', 'throws'])('keeps a %s canonical read-back indeterminate rather than confirming old settings', async mode => {
    const original = metadata();
    const store = { readMetadata: vi.fn().mockResolvedValueOnce(original).mockImplementation(async () => {
      if (mode === 'throws') throw new Error('read unavailable');
      return null;
    }), writeMetadata: vi.fn(async () => {}) };
    const result = await commitAgentRunModelConfig({ metadataStore: store, runId: 'same-run', cataloged: true,
      archived: false, llmModelIdentifier: 'new', llmConfig: null });
    expect(result).toEqual({ kind: 'indeterminate', metadata: original });
    expect(store.writeMetadata).toHaveBeenCalledTimes(1);
  });

});
