import { describe, expect, it, vi } from 'vitest';
import { AgentTeamRunManager } from '../../../src/agent-team-execution/services/agent-team-run-manager.js';
import { RunModelSelectionService } from '../../../src/llm-management/services/run-model-selection-service.js';
import { createTaskExecutionIdentityCapabilities } from '../../../src/agent-team-execution/task-delegation/task-execution-identity-capabilities.js';
import { testAgentNode, testExecutionTree } from '../../fixtures/current-team-run-fixtures.js';
const harness = () => {
  let saved: any = testExecutionTree({ rootTeamRunId: 'root', coordinatorAddress: '/member', children: [testAgentNode('/member')] });
  saved = structuredClone(saved);
  saved.rootTeam.taskExecutions = [{ address: '/task-run', agentRunId: 'retained-task', platformAgentRunId: 'platform-task',
    startedAt: '2026-09-01T00:00:00Z', settledAt: '2026-09-01T00:01:00Z' }];
  const root = saved.rootTeam.defaultLaunchConfiguration;
  root.runtimeKind = 'codex_app_server'; root.llmModelIdentifier = 'small'; root.workspaceRootPath = '/workspace'; root.llmConfig = null;
  const member = saved.rootTeam.members[0].launchConfiguration;
  Object.assign(member, root, { llmModelIdentifier: 'large' });
  const read = vi.fn(async () => saved);
  const write = vi.fn(async (_dir, next) => { saved = next; return { outcome: 'committed' }; });
  const catalog = { listLlmModels: vi.fn(async () => ['small','equal','large'].map(model_identifier => ({ model_identifier } as any))) };
  const capacity = { resolveMany: vi.fn(async () => Object.fromEntries([['small',128000],['equal',128000],['large',272000]].map(([id,tokens])=>[id,{ kind: 'known' as const, tokens: Number(tokens), source: 'provider' }]))) };
  const mixedTeamRunBackendFactory = {} as any;
  const manager = new AgentTeamRunManager({ memoryDir: '/tmp/model-save-unit-no-disk', mixedTeamRunBackendFactory,
    taskExecutionIdentity: createTaskExecutionIdentityCapabilities({ allocateForAgentDefinition: async () => 'task' }),
    executionTreeStore: { read, write } as any, modelSelectionValidator: new RunModelSelectionService(catalog, capacity) });
  return { manager, read, write, capacity, saved: () => saved };
};
describe('configured Team model selection Save', () => {
  it('validates every original baseline before writing and does not omit incompatible children', async () => {
    const h = harness(); const original = structuredClone(h.saved());
    const result = await h.manager.updateStoppedModelConfigs({ teamRunId: 'root', patches: [
      { scopeKind: 'CONFIGURED_TEAM', scopeAddress: '/', llmModelIdentifier: 'equal', llmConfig: null },
      { scopeKind: 'CONFIGURED_AGENT', scopeAddress: '/member', llmModelIdentifier: 'equal', llmConfig: null },
    ] });
    expect(result).toMatchObject({ outcome: 'VALIDATION_FAILED', fieldErrors: [{ path: 'patches[/member].llmModelIdentifier' }] });
    expect(h.write).not.toHaveBeenCalled(); expect(h.saved()).toEqual(original);
    expect(h.capacity.resolveMany).toHaveBeenCalledTimes(1);
  });
  it('commits one tree preserving configured identities and task records; later Save uses new baseline', async () => {
    const h = harness(); const original = structuredClone(h.saved());
    const patch = { scopeKind: 'CONFIGURED_TEAM' as const, scopeAddress: '/', llmModelIdentifier: 'large', llmConfig: null };
    expect((await h.manager.updateStoppedModelConfigs({ teamRunId: 'root', patches: [patch] })).outcome).toBe('UPDATED');
    expect(h.write).toHaveBeenCalledTimes(1);
    expect(h.saved()).toEqual({ ...original, rootTeam: { ...original.rootTeam, defaultLaunchConfiguration: { ...original.rootTeam.defaultLaunchConfiguration, llmModelIdentifier: 'large' } } });
    expect((await h.manager.updateStoppedModelConfigs({ teamRunId: 'root', patches: [{ ...patch, llmModelIdentifier: 'small' }] })).outcome).toBe('VALIDATION_FAILED');
    expect(h.write).toHaveBeenCalledTimes(1);
  });
});
