// IR-002 local regression of CRF-001 / approved SCN-005 / AC-007 / AD-D02.
// Real current-schema Team writer + manager + Studio service + resolver method.
// Inject only a post-write canonical read error (and, in case 2, directory sync error).
// No product run, provider inference or API networking. Assertions require the corrected outcome.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = new URL('../../../../../', import.meta.url);
const server = new URL('autobyteus-server-ts/', root);
const require = createRequire(new URL('package.json', server));
require('reflect-metadata');
const get = (p) => import(new URL(`dist/${p}.js`, server));
const { AgentTeamRunManager } = await get('agent-team-execution/services/agent-team-run-manager');
const { createTaskExecutionIdentityCapabilities } = await get('agent-team-execution/task-delegation/task-execution-identity-capabilities');
const { TeamRunExecutionTreeStore } = await get('run-history/store/team-run-execution-tree-store');
const { TeamRunFileCommitWriter } = await get('run-history/store/team-run-file-commit-writer');
const { StudioRunModelConfigService } = await get('run-history/services/studio-run-model-config-service');
const { AgentTeamRunResolver } = await get('api/graphql/types/agent-team-run');
const observations = [];
for (const finalization of ['committed', 'renamed_finalization_indeterminate']) {
  const memoryDir = await fs.mkdtemp(path.join(os.tmpdir(), 'crr-team-readback-'));
  const teamDir = path.join(memoryDir, 'agent_teams', 'review-root');
  const launch = { runtimeKind: 'codex_app_server', llmModelIdentifier: 'old', llmConfig: null,
    workspaceRootPath: memoryDir, autoExecuteTools: true, skillAccessMode: 'PRELOADED_ONLY' };
  const tree = { schemaVersion: 2, createdAt: '2026-09-08T00:00:00.000Z', archivedAt: null,
    applicationBinding: null, handoffs: [], rootTeam: { address: '/', teamDefinitionId: 'review-definition',
      teamDefinitionName: 'Review fixture', teamRunId: 'review-root', coordinatorAddress: '/member',
      defaultLaunchConfiguration: launch, taskExecutions: [], members: [{ address: '/member',
        agentDefinitionId: 'review-agent', role: null, description: null, agentRunId: 'review-member',
        platformAgentRunId: 'retained-provider-id', launchConfiguration: launch }] } };
  try {
    const normalStore = new TeamRunExecutionTreeStore();
    await normalStore.write(teamDir, tree);
    const writer = finalization === 'committed' ? new TeamRunFileCommitWriter() : new TeamRunFileCommitWriter({ operations: {
      ...fs, open: async (p, flags) => flags === 'r' ? { sync: async () => { throw new Error('injected directory sync EIO'); }, close: async () => {} } : fs.open(p, flags),
    } });
    const writerStore = new TeamRunExecutionTreeStore(writer);
    let afterWrite = false; let physicalOutcome; let writes = 0;
    const executionTreeStore = {
      read: async (dir, id) => { if (afterWrite) throw new Error('injected post-write canonical read EIO'); return normalStore.read(dir, id); },
      write: async (dir, value) => { writes++; const result = await writerStore.write(dir, value); physicalOutcome = result.outcome; afterWrite = true; return result; },
    };
    const manager = new AgentTeamRunManager({ memoryDir, mixedTeamRunBackendFactory: {},
      taskExecutionIdentity: createTaskExecutionIdentityCapabilities({ allocateForAgentDefinition: async () => 'unused' }),
      executionTreeStore, modelSelectionValidator: { validate: async ({ selection }) => ({ kind: 'valid', selection }),
        validateMany: async (inputs) => inputs.map(({ selection }) => ({ kind: 'valid', selection })) } });
    const service = new StudioRunModelConfigService({ applicationRunOwnership: { hasLiveRunOwnership: async () => false },
      teamResumeConfigService: { getTeamRunResumeConfig: async () => ({ teamRunId: 'review-root', executionTree: tree }) },
      teamRunService: { updateStoppedModelConfigs: (input) => manager.updateStoppedModelConfigs(input) } });
    const response = await AgentTeamRunResolver.prototype.updateStoppedTeamRunModelConfigs.call({ runModelConfigService: service },
      { teamRunId: 'review-root', patches: [{ scopeKind: 'CONFIGURED_TEAM', scopeAddress: '/', llmModelIdentifier: 'new', llmConfig: null }] });
    const persisted = await normalStore.read(teamDir, 'review-root');
    assert.equal(physicalOutcome, finalization);
    assert.equal(writes, 1);
    assert.equal(persisted.rootTeam.defaultLaunchConfiguration.llmModelIdentifier, 'new');
    assert.equal(response.outcome, 'PERSISTENCE_INDETERMINATE');
    assert.equal(response.success, false);
    assert.equal(response.editability.editable, true);
    assert.equal(response.canonicalExecutionTree.root_team.default_launch_configuration.llm_model_identifier, 'old');
    observations.push({ finalization, physicalOutcome, writes, persistedModel: persisted.rootTeam.defaultLaunchConfiguration.llmModelIdentifier,
      response, expectedOutcome: 'PERSISTENCE_INDETERMINATE', expectedCanonicalVerification: true,
      storeWillReconcile: response.outcome === 'PERSISTENCE_INDETERMINATE', regressionAssertions: 'Pass',
      note: 'Freshly built owner/Studio/resolver method plus physical writer; Web store and renderer checks are separate local evidence.' });
  } finally { await fs.rm(memoryDir, { recursive: true, force: true }); }
}
await fs.writeFile(new URL('team-readback-probe-result.json', import.meta.url), JSON.stringify({ observedAt: new Date().toISOString(), observations }, null, 2) + '\n');
console.log(JSON.stringify(observations, null, 2));
