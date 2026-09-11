import { describe, expect, it, vi } from 'vitest';
import { decodeCodexContextCapacity } from '../../../src/runtime-management/codex/client/codex-model-capacity-reader.js';
import { readClaudeContextCapacities } from '../../../src/runtime-management/claude/client/claude-sdk-context-capacity.js';
import { nativeModelCapacity } from '../../../src/llm-management/services/runtime-model-capacity-service.js';
const now = Date.now();
const input = () => ({ catalog: { fetched_at: new Date(now).toISOString(), client_version: '0.153.4', models: [{ slug: 'model', context_window: 272000, max_context_window: 872000, effective_context_window_percent: 95 }] }, model: 'model', version: '0.153.4', custom: false, override: null as unknown, now });
describe('Codex capacity decoder', () => {
  it('uses raw default context, not advertised maximum or effective safety budget', () => {
    expect(decodeCodexContextCapacity(input())).toMatchObject({ kind: 'known', tokens: 272000 });
  });
  it('requires exact identity, current cache version/shape/freshness', () => {
    for (const change of [{ model: 'model-alias' }, { version: 'other' }, { catalog: {} }, { now: now + 300001 }]) {
      expect(decodeCodexContextCapacity({ ...input(), ...change }).kind).toBe('unknown');
    }
  });
  it('reads a selected custom catalog and a catalog-covered profile override', () => {
    expect(decodeCodexContextCapacity({ ...input(), custom: true, catalog: { models: input().catalog.models }, override: 872000 })).toMatchObject({ kind: 'known', tokens: 872000 });
    expect(decodeCodexContextCapacity({ ...input(), override: 900000 }).kind).toBe('unknown');
  });
});
describe('Claude zero-turn metadata control', () => {
  const control = () => ({ close: vi.fn(), supportedModels: vi.fn().mockResolvedValue([{ value: 'alias', resolvedModel: 'resolved' }]), setModel: vi.fn().mockResolvedValue(undefined), getContextUsage: vi.fn().mockResolvedValue({ model: 'resolved', rawMaxTokens: 200000, maxTokens: 160000 }) });
  it('matches resolved aliases, uses rawMaxTokens and always closes', async () => {
    const query = control();
    expect(await readClaudeContextCapacities(['alias'], async () => query)).toMatchObject({ alias: { kind: 'known', tokens: 200000 } });
    expect(query.setModel).toHaveBeenCalledWith('alias');
    expect(query.close).toHaveBeenCalledOnce();
  });
  it('returns unknown for inconsistent identity or missing APIs', async () => {
    const query = control(); query.getContextUsage.mockResolvedValue({ model: 'wrong', rawMaxTokens: 200000 });
    expect((await readClaudeContextCapacities(['alias'], async () => query)).alias.kind).toBe('unknown');
    expect((await readClaudeContextCapacities(['alias'], async () => ({ close: vi.fn() }))).alias.kind).toBe('unknown');
  });
  it('bounds a hung control and closes a late creation', async () => {
    const query = control(); query.getContextUsage.mockImplementation(() => new Promise(() => {}));
    expect((await readClaudeContextCapacities(['alias'], async () => query, 10)).alias.kind).toBe('unknown');
    expect(query.close).toHaveBeenCalledOnce();
    let release!: (value: ReturnType<typeof control>) => void;
    const result = readClaudeContextCapacities(['alias'], () => new Promise(resolve => { release = resolve; }), 10);
    await result;
    const late = control(); release(late); await Promise.resolve();
    expect(late.close).toHaveBeenCalledOnce();
  });
});
it('does not promote inferred native identity, input caps or compaction numbers', () => {
  expect(nativeModelCapacity({ max_context_tokens: 200000, max_input_tokens: 100000, resolved_model_metadata: null } as any).kind).toBe('unknown');
  expect(nativeModelCapacity({ active_context_tokens: 100000, resolved_model_metadata: { maxContextTokens: { value: 200000, source: { kind: 'live' } } } } as any)).toMatchObject({ kind: 'known', tokens: 100000 });
});

describe('Codex reader launch/home isolation', () => {
  it('reads only the current client home and refuses a wrong-home catalog', async () => {
    const fs = await import('node:fs/promises'); const os = await import('node:os'); const path = await import('node:path');
    const { CodexModelCapacityReader } = await import('../../../src/runtime-management/codex/client/codex-model-capacity-reader.js');
    const home = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-capacity-unit-'));
    try {
      const command = path.join(home, 'version'); await fs.writeFile(command, '#!/bin/sh\necho codex-cli 0.153.4\n', { mode: 0o700 });
      await fs.writeFile(path.join(home, 'models_cache.json'), JSON.stringify(input().catalog));
      let userHome = home;
      const client = { getLaunchContext: () => ({ command, cwd: home, args: ['app-server'], env: { CODEX_HOME: home } }),
        request: vi.fn(async (method) => method === 'model/list' ? { data: [{ model: 'model' }], nextCursor: null } : { config: {}, layers: [{ name: { type: 'user', file: path.join(userHome,'config.toml') } }] }) };
      const manager = { acquireClient: vi.fn(async () => client), releaseClient: vi.fn() };
      const reader = new CodexModelCapacityReader(manager as any);
      expect((await reader.resolveMany(home, ['model'])).model.kind).toBe('known');
      userHome = path.join(home, 'different');
      expect((await reader.resolveMany(home, ['model'])).model.kind).toBe('unknown');
      userHome = home; await fs.writeFile(path.join(home, 'models_cache.json'), 'malformed');
      expect((await reader.resolveMany(home, ['model'])).model.kind).toBe('unknown');
      await fs.unlink(path.join(home, 'models_cache.json'));
      expect((await reader.resolveMany(home, ['model'])).model.kind).toBe('unknown');
      expect(manager.releaseClient).toHaveBeenCalledTimes(4);
    } finally { await fs.rm(home, { recursive: true, force: true }); }
  });
});
