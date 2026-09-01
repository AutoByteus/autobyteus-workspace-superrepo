import { describe, expect, it, vi } from "vitest";
import { SkillAccessMode } from "autobyteus-ts/agent/context/skill-access-mode.js";
import { RuntimeKind } from "../../../src/runtime-management/runtime-kind-enum.js";
import { ConfiguredAgentExecutionHandle } from "../../../src/agent-collaboration/execution/backends/configured-agent-execution-handle.js";
import {
  createAgentOrgRootExecutionIdentity,
  createCollaborationMemberExecutionIdentity,
  createRootExecutionPhysicalScope,
  createTeamRootExecutionIdentity,
} from "../../../src/agent-collaboration/execution/domain/root-execution-identity.js";
import {
  MemberCollaborationContext,
  MemberExecutionContext,
} from "../../../src/agent-collaboration/execution/domain/member-execution-context.js";

const taskCommands = (root: ReturnType<typeof createTeamRootExecutionIdentity>) => ({
  root,
  delegateTask: vi.fn(),
  submitTaskResult: vi.fn(),
  reviewTaskResult: vi.fn(),
});

const build = (kind: "agent_team" | "agent_org") => {
  const root = kind === "agent_team"
    ? createTeamRootExecutionIdentity("root-run")
    : createAgentOrgRootExecutionIdentity("root-run");
  const identity = createCollaborationMemberExecutionIdentity({
    root,
    memberAddress: kind === "agent_team" ? "/Worker" : "/ReviewTeam/Worker",
    agentRunId: "agent-run",
  });
  const scope = createRootExecutionPhysicalScope({
    root,
    ancestorTeamRunIds: kind === "agent_team" ? [] : ["mounted-team-run"],
  });
  const memberExecutionContext = new MemberExecutionContext({
    identity,
    authoredEnclosingScopeInstruction: "Stay in scope.",
    collaboration: new MemberCollaborationContext({
      deliverLogicalMessage: async () => ({ accepted: true }),
    }),
    tasks: taskCommands(root),
  });
  const fakeRun = {
    runId: identity.agentRunId,
    isActive: () => true,
    getStatusSnapshot: () => ({ status: "idle" }),
    subscribeToEvents: vi.fn(() => () => undefined),
    reserveUserMessage: vi.fn(),
    postUserMessage: vi.fn(),
    approveToolInvocation: vi.fn(),
    interrupt: vi.fn(async () => ({ accepted: true as const })),
  };
  const abort = vi.fn(async () => ({ kind: "aborted" as const }));
  const prepareNewAgentRun = vi.fn(async ({ runId, config }) => ({
    runId,
    runtimeKind: config.runtimeKind,
    platformAgentRunId: null,
    commitPublication: () => fakeRun,
    abort,
  }));
  const publishAgentEvent = vi.fn();
  const acceptPlatformBinding = vi.fn();
  const handle = new ConfiguredAgentExecutionHandle({
    identity,
    physicalScope: scope,
    execution: {
      agentDefinitionId: "agent-definition",
      llmModelIdentifier: "model",
      llmConfig: null,
      autoExecuteTools: false,
      skillAccessMode: SkillAccessMode.PRELOADED_ONLY,
      runtimeKind: RuntimeKind.AUTOBYTEUS,
      workspaceRootPath: null,
      platformAgentRunId: null,
    },
    activationMode: "fresh",
    memberExecutionContext,
    callbacks: { publishAgentEvent, acceptPlatformBinding },
    agentRunManager: { prepareNewAgentRun } as never,
    memoryLocator: {
      getLocation: (physicalScope: typeof scope, agentRunId: string) => ({
        scope: physicalScope,
        agentRunId,
        memoryDir: `/memory/${physicalScope.root.rootSubjectKind}/${physicalScope.root.rootRunId}/${physicalScope.ancestorTeamRunIds.join("/")}/${agentRunId}`,
      }),
    } as never,
    activityInspector: { inspect: () => ({ kind: "none" as const }) } as never,
  });
  return { handle, root, identity, scope, memberExecutionContext, prepareNewAgentRun, fakeRun, abort };
};

describe("ConfiguredAgentExecutionHandle", () => {
  it.each(["agent_team", "agent_org"] as const)(
    "prepares and publishes one root-neutral configured Agent under %s",
    async (kind) => {
      const fixture = build(kind);
      const prepared = await fixture.handle.prepareConfiguredActivation();
      expect(prepared.stagedPlatformBindings).toEqual([]);
      expect(prepared.stagedNoConversationBindingReplacements).toEqual([]);
      expect(fixture.handle.isActive()).toBe(false);
      const preparedInput = fixture.prepareNewAgentRun.mock.calls[0]![0];
      expect(preparedInput.runId).toBe("agent-run");
      expect(preparedInput.config.memberExecutionContext).toBe(fixture.memberExecutionContext);
      expect(preparedInput.config.memoryDir).toContain(`/${kind}/root-run/`);
      prepared.commitAfterDurability();
      expect(fixture.handle.isActive()).toBe(true);
      await expect(fixture.handle.getOrCreateAgentRun()).resolves.toBe(fixture.fakeRun);
    },
  );

  it("aborts a prepared candidate without publishing it", async () => {
    const fixture = build("agent_org");
    const prepared = await fixture.handle.prepareConfiguredActivation();
    await prepared.abort();
    expect(fixture.abort).toHaveBeenCalledTimes(1);
    expect(fixture.handle.isActive()).toBe(false);
    expect(() => prepared.commitAfterDurability()).toThrow("is not publishable");
  });

  it("rejects identity, physical scope, and sender-bound context mismatches", () => {
    const fixture = build("agent_team");
    const otherRoot = createAgentOrgRootExecutionIdentity("root-run");
    expect(() => new ConfiguredAgentExecutionHandle({
      identity: fixture.identity,
      physicalScope: createRootExecutionPhysicalScope({ root: otherRoot, ancestorTeamRunIds: [] }),
      execution: {} as never,
      activationMode: "fresh",
      memberExecutionContext: fixture.memberExecutionContext,
      callbacks: { publishAgentEvent: vi.fn(), acceptPlatformBinding: vi.fn() },
    })).toThrow("same root");
  });
});
