import { describe, expect, it, vi } from "vitest";
import { AgentInputUserMessage } from "autobyteus-ts/agent/message/agent-input-user-message.js";
import { SenderType } from "autobyteus-ts/agent/sender-type.js";
import { AgentMemoryLayout } from "../../../src/agent-memory/store/agent-memory-layout.js";
import { appConfigProvider } from "../../../src/config/app-config-provider.js";
import { TaskAgentExecutionRegistry } from "../../../src/agent-team-execution/local/registries/task-agent-execution-registry.js";
import { FlatAgentExecutionContext, FlatTeamExecutionContext } from "../../../src/agent-team-execution/local/flat-team-execution-context.js";
import { TeamRunContext } from "../../../src/agent-team-execution/domain/team-run-context.js";
import {
  createRootExecutionPhysicalScope,
  createTeamRootExecutionIdentity,
} from "../../../src/agent-collaboration/execution/domain/root-execution-identity.js";
import { TeamBackendKind } from "../../../src/agent-team-execution/domain/team-backend-kind.js";
import { RuntimeKind } from "../../../src/runtime-management/runtime-kind-enum.js";
import {
  testAgentNode,
  testAgentTeamNode,
  testMemberExecutionContext,
  testTeamRunConfig,
} from "../../fixtures/current-team-run-fixtures.js";

describe("TaskAgentExecutionRegistry task-agent memory", () => {
  it("keeps a fresh task Agent as a leaf in its containing nested TeamRun scope and releases work only after commit", async () => {
    const workerNode = testAgentNode("/review/worker", {
      agentRunId: "worker-template-run",
      agentDefinitionId: "agent-worker",
      llmModelIdentifier: "model-1",
      runtimeKind: RuntimeKind.CODEX_APP_SERVER,
    });
    const reviewTeam = testAgentTeamNode({
      address: "/review",
      coordinatorAddress: workerNode.address,
      teamRunId: "review-team-run",
      children: [workerNode],
    });
    const config = testTeamRunConfig({
      rootTeamRunId: "owning-team-run",
      rootTeamDefinitionId: "team-def",
      coordinatorAddress: "/lead",
      children: [testAgentNode("/lead"), reviewTeam],
    });
    const physicalScope = createRootExecutionPhysicalScope({
      root: createTeamRootExecutionIdentity("owning-team-run"),
      ancestorTeamRunIds: [reviewTeam.teamRunId],
    });
    const teamContext = new TeamRunContext({
      physicalScope,
      teamRunId: reviewTeam.teamRunId,
      teamBackendKind: TeamBackendKind.MIXED,
      teamNode: reviewTeam,
      handoffs: config.handoffs,
      runtimeContext: new FlatTeamExecutionContext({
        memberContexts: [new FlatAgentExecutionContext({
          address: workerNode.address,
          agentRunId: "worker-template-run",
          runtimeKind: RuntimeKind.CODEX_APP_SERVER,
          platformAgentRunId: null,
        })],
        configuredMemberActivationMode: "fresh",
      }),
    });
    const postedMessages: AgentInputUserMessage[] = [];
    const createdConfigs: unknown[] = [];
    const prepareNewAgentRun = vi.fn(async ({ config: runConfig, runId }) => {
      createdConfigs.push(runConfig);
      const run = {
        runId,
        config: runConfig,
        isActive: () => true,
        getPlatformAgentRunId: () => null,
        getStatusSnapshot: () => ({ status: "idle" }),
        subscribeToEvents: () => () => undefined,
        postUserMessage: async (message: AgentInputUserMessage) => {
          postedMessages.push(message);
          return { accepted: true as const };
        },
        approveToolInvocation: async () => ({ accepted: true as const }),
        interrupt: async () => ({ accepted: true as const }),
        prepareTermination: async () => ({
          cancel: () => undefined,
          commit: () => ({ finish: async () => ({ accepted: true as const }) }),
        }),
      };
      return {
        runId,
        runtimeKind: runConfig.runtimeKind,
        platformAgentRunId: `platform-${runId}`,
        commitPublication: () => run,
        abort: async () => ({ kind: "aborted" as const }),
      };
    });
    const memoryRoot = appConfigProvider.config.getMemoryDir();
    const getRootedLocation = vi.fn((scope: typeof physicalScope, agentRunId: string) => ({
      scope,
      agentRunId,
      memoryDir: new AgentMemoryLayout(memoryRoot).getRootedAgentRunDirPath(scope, agentRunId),
    }));
    const taskAgentRunId = "worker_00000000000000000000000000000001";
    const registry = new TaskAgentExecutionRegistry({
      teamContext,
      agentRunManager: { prepareNewAgentRun } as never,
      memoryLocator: {
        getLocation: getRootedLocation,
      } as never,
      activityInspector: { inspect: vi.fn(() => ({ kind: "none" })) } as never,
      callbacks: {
        buildMemberExecutionContext: vi.fn(async () => testMemberExecutionContext({
          rootTeamRunId: config.rootTeam.teamRunId,
          memberAddress: workerNode.address,
          agentRunId: taskAgentRunId,
        })),
        publishAgentEvent: vi.fn(),
        acceptPlatformBinding: vi.fn(async () => undefined),
      },
    });
    const message = new AgentInputUserMessage("start task", SenderType.USER);

    const prepared = await registry.prepare({
      taskId: "task_0001",
      address: workerNode.address,
      agentRunId: taskAgentRunId,
      sourceNode: workerNode,
      message,
    });

    expect(prepared.binding).toEqual({
      kind: "agent",
      address: "/review/worker",
      agentRunId: taskAgentRunId,
    });
    expect(prepared.stagedPlatformBindings).toEqual([
      expect.objectContaining({
        platformAgentRunId: `platform-${taskAgentRunId}`,
      }),
    ]);
    expect(registry.get(taskAgentRunId)).toBeNull();
    expect(postedMessages).toEqual([]);
    prepared.sealForCommit();
    const committed = prepared.commitAfterDurability();
    expect(registry.get(taskAgentRunId)).not.toBeNull();
    committed.releaseWork();

    await vi.waitFor(() => expect(postedMessages).toEqual([message]));
    expect(prepareNewAgentRun).toHaveBeenCalledWith(
      expect.objectContaining({
        runId: taskAgentRunId,
        config: expect.objectContaining({
          memoryDir: new AgentMemoryLayout(memoryRoot)
            .getRootedAgentRunDirPath(physicalScope, taskAgentRunId),
        }),
      }),
    );
    expect(getRootedLocation).toHaveBeenCalledWith(physicalScope, taskAgentRunId);
    expect((createdConfigs[0] as { memoryDir?: string }).memoryDir).not.toBe("/tmp/template-member-memory-dir");
    registry.dispose();
  });
});
