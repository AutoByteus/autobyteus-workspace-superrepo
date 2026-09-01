import { describe, expect, it, vi } from "vitest";
import { createCollaborationMemberExecutionIdentity, createTeamRootExecutionIdentity } from "../../../src/agent-collaboration/execution/domain/root-execution-identity.js";
import type { RootTaskLifecycleAdapter } from "../../../src/agent-collaboration/execution/task/root-task-lifecycle-adapter.js";
import { RootTaskLifecycleEngine } from "../../../src/agent-collaboration/execution/task/root-task-lifecycle-engine.js";
import { buildTaskAssigneeWorkPacket } from "../../../src/agent-collaboration/execution/task/root-task-lifecycle-input.js";
import type { TaskDelegationRecordV1 } from "../../../src/agent-collaboration/execution/task/task-delegation-record-v1.js";
import { RootTaskPersistenceFinalizationIndeterminateError } from "../../../src/agent-collaboration/execution/task/task-lifecycle-command.js";

const root = createTeamRootExecutionIdentity("root-team-run");
const delegator = createCollaborationMemberExecutionIdentity({
  root,
  memberAddress: "/coordinator",
  agentRunId: "coordinator-run",
});
type Placement = Readonly<{ address: "/researcher" }>;

const createHarness = (input: {
  records?: readonly TaskDelegationRecordV1[];
  schemaError?: Error;
  activationError?: Error;
} = {}) => {
  let records = input.records ?? [];
  const settled = new Set<string>();
  const events: string[] = [];
  const settlementOrder: string[] = [];
  const abort = vi.fn(async () => undefined);
  const adapter: RootTaskLifecycleAdapter<Placement> = {
    initialRecords: records,
    isOpen: () => true,
    authorize: (identity) => {
      if (identity.root.rootRunId !== root.rootRunId) throw new Error("wrong root");
    },
    assertCurrentSchemaReady: () => { if (input.schemaError) throw input.schemaError; },
    prepareActivation: async (prepared) => ({
      recipientAddress: prepared.placement.address,
      taskExecution: Object.freeze({ agentRunId: `agent-${prepared.taskId}` }),
      targetAgentRunId: `agent-${prepared.taskId}`,
      commit: async (commit) => {
        if (input.activationError) throw input.activationError;
        commit.commitRecords();
        records = commit.nextRecords;
        events.push(commit.event.kind);
        return { committed: true as const };
      },
      abort,
    }),
    commitRecordTransition: async (transition) => {
      transition.commitRecords();
      records = transition.nextRecords;
      if (transition.event) events.push(transition.event.kind);
    },
    taskAssigneeAgentRunId: (task) => "agentRunId" in task.taskExecution
      ? task.taskExecution.agentRunId
      : `coordinator-${task.taskExecution.teamRunId}`,
    taskOwnsAgent: (task, agentRunId) => task.taskId === "parent" && agentRunId === "agent-child",
    isTaskExecutionSettled: (task) => settled.has(task.taskId),
    settleTaskExecution: async (command) => {
      if (command.remainsBlockedByOpenChild()) return false;
      settlementOrder.push(command.task.taskId);
      settled.add(command.task.taskId);
      events.push(command.event.kind);
      return true;
    },
    enterLifecycleFailStop: vi.fn(),
    deliverSystemMessage: async () => ({ accepted: true }),
  };
  const engine = new RootTaskLifecycleEngine(adapter);
  return { engine, abort, events, settlementOrder, records: () => records };
};

const terminal = (input: {
  taskId: string;
  agentRunId: string;
  delegatorAgentRunId?: string;
  status?: "active";
}): TaskDelegationRecordV1 => Object.freeze({
  taskId: input.taskId,
  delegatorAgentRunId: input.delegatorAgentRunId ?? delegator.agentRunId,
  recipientAddress: "/researcher",
  taskExecution: Object.freeze({ agentRunId: input.agentRunId }),
  description: input.taskId,
  referenceFiles: Object.freeze([]),
  status: input.status ?? "active",
  updates: Object.freeze([]),
  createdAt: "2026-09-01T00:00:00.000Z",
});

describe("root-neutral current task lifecycle invariants", () => {
  it("checks current-schema readiness before task preparation", async () => {
    const harness = createHarness({ schemaError: new Error("TOKEN_USAGE_CURRENT_SCHEMA_REQUIRED") });
    await expect(harness.engine.delegateTask(
      { identity: delegator },
      { recipient_address: "/researcher", description: "work" },
      { address: "/researcher" },
    )).rejects.toThrow("TOKEN_USAGE_CURRENT_SCHEMA_REQUIRED");
    expect(harness.records()).toEqual([]);
    expect(harness.abort).not.toHaveBeenCalled();
  });

  it("builds the bound assignee packet without exposing a task id", () => {
    const message = buildTaskAssigneeWorkPacket({
      delegator,
      description: "Investigate the failing scenario.",
      referenceFiles: ["/tmp/evidence.log"],
    });
    expect(message.content).toContain("Task delegator address: /coordinator");
    expect(message.content).toContain("Task delegator AgentRun ID: coordinator-run");
    expect(message.content).toContain("/tmp/evidence.log");
    expect(message.content).not.toContain("task_");
  });

  it("settles terminal descendants before their owning parent during shutdown", async () => {
    const parent = terminal({ taskId: "parent", agentRunId: "agent-parent" });
    const child = terminal({ taskId: "child", agentRunId: "agent-child", delegatorAgentRunId: "agent-child", status: "active" });
    const harness = createHarness({ records: [parent, child] });
    await harness.engine.shutdownAndSettle("root stopping");
    expect(harness.settlementOrder).toEqual(["child", "parent"]);
    expect(harness.records().find((task) => task.taskId === "child")?.status).toBe("interrupted");
  });

  it("does not abort prepared work after persistence finalization becomes indeterminate", async () => {
    const error = new RootTaskPersistenceFinalizationIndeterminateError(
      "agent_team",
      "task_records",
      "post_durability_publication",
    );
    const harness = createHarness({ activationError: error });
    await expect(harness.engine.delegateTask(
      { identity: delegator },
      { recipient_address: "/researcher", description: "work" },
      { address: "/researcher" },
    )).rejects.toBe(error);
    expect(harness.abort).not.toHaveBeenCalled();
  });
});
