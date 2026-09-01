import { describe, expect, it, vi } from "vitest";
import { CollaborationStreamServerMessageSchema } from "@autobyteus/collaboration-stream-contracts";
import { AgentOrgStreamHandler } from "../../../../src/services/agent-streaming/agent-org-stream-handler.js";
import { RootEventPublisher } from "../../../../src/agent-collaboration/execution/services/root-event-publisher.js";
import { testAgentOrgExecutionTree, testOrgAgentNode } from "../../../fixtures/current-agent-org-run-fixtures.js";
import type { AgentOrgRunEvent } from "../../../../src/agent-org-execution/domain/agent-org-run-event.js";

const orgRunId = "org-run-1";
const agent = testOrgAgentNode("/director", "agent-run-1");
const tree = testAgentOrgExecutionTree({ orgRunId, members: [agent] });
const tasks = { schemaVersion: 1 as const, subjectKind: "agent_org" as const, orgRunId, records: [] };
const messages = { schemaVersion: 1 as const, subjectKind: "agent_org" as const, orgRunId, messages: [] };

const connection = () => {
  const sent: string[] = [];
  return { sent, socket: { send: (value: string) => sent.push(value), close: vi.fn() } };
};

const harness = () => {
  const publisher = new RootEventPublisher<AgentOrgRunEvent>();
  const executeAgentCommand = vi.fn(async () => ({ accepted: true }));
  const run = {
    orgRunId,
    isActive: () => true,
    openPackageSnapshotConnection: () => publisher.openSnapshotConnection(() => ({ tree, tasks, messages })),
    executeAgentCommand,
  };
  const manager = { getActive: vi.fn((id: string) => id === orgRunId ? run : null) };
  return { publisher, executeAgentCommand, manager, handler: new AgentOrgStreamHandler(manager as never) };
};

describe("AgentOrgStreamHandler", () => {
  it("opens one correlated native Org snapshot barrier and sequences events", async () => {
    const test = harness(); const client = connection(); const sessionId = await test.handler.connect(client.socket, orgRunId);
    expect(sessionId).toBeTruthy();
    const initial = client.sent.map((value) => CollaborationStreamServerMessageSchema.parse(JSON.parse(value)));
    expect(initial.map((message) => message.type)).toEqual(["CONNECTED", "ROOT_EXECUTION_VIEW_SNAPSHOT", "ROOT_LIFECYCLE"]);
    const snapshot = initial[1]; expect(snapshot.type).toBe("ROOT_EXECUTION_VIEW_SNAPSHOT");
    if (snapshot.type === "ROOT_EXECUTION_VIEW_SNAPSHOT") expect(snapshot.payload).toMatchObject({ root_subject_kind: "agent_org", root_run_id: orgRunId, root_org: { execution_tree: { rootOrg: { orgRunId } } } });
    test.publisher.publish({ kind: "lifecycle", isActive: false });
    const emitted = client.sent.slice(3).map((value) => CollaborationStreamServerMessageSchema.parse(JSON.parse(value)));
    expect(emitted.map((message) => message.type)).toEqual(["ROOT_EXECUTION_EVENT", "ROOT_LIFECYCLE"]);
    expect(emitted[0]).toMatchObject({ payload: { root_subject_kind: "agent_org", root_run_id: orgRunId, change_sequence: 1 } });
  });

  it("rejects wrong-root commands and routes a correlated command only to the exact AgentRun", async () => {
    const test = harness(); const client = connection(); const sessionId = await test.handler.connect(client.socket, orgRunId); expect(sessionId).toBeTruthy();
    const command = (rootRunId: string) => JSON.stringify({ type: "SEND_MESSAGE", payload: { root_subject_kind: "agent_org", root_run_id: rootRunId, target_agent_run_id: agent.agentRunId, content: "Hello", context_file_paths: ["/tmp/context.txt"], image_urls: [], message_id: "message-1", dedupe_key: "dedupe-1" } });
    await test.handler.handleMessage(sessionId!, command("another-org"));
    expect(test.executeAgentCommand).not.toHaveBeenCalled();
    expect(JSON.parse(client.sent.at(-1) ?? "{}")).toMatchObject({ type: "ERROR", payload: { code: "AGENT_ORG_COMMAND_REJECTED" } });
    await test.handler.handleMessage(sessionId!, command(orgRunId));
    expect(test.executeAgentCommand).toHaveBeenCalledTimes(1);
    expect(test.executeAgentCommand.mock.calls[0]?.[0]).toBe(agent.agentRunId);
    expect(test.executeAgentCommand.mock.calls[0]?.[1]).toMatchObject({ kind: "post_message", message: { content: "Hello", metadata: { message_id: "message-1", dedupe_key: "dedupe-1" } } });
  });

  it("fails closed when the requested Org root is not active", async () => {
    const client = connection(); const handler = new AgentOrgStreamHandler({ getActive: () => null } as never);
    expect(await handler.connect(client.socket, "missing")).toBeNull();
    expect(JSON.parse(client.sent[0] ?? "{}")).toMatchObject({ type: "ERROR", payload: { code: "AGENT_ORG_NOT_ACTIVE" } });
    expect(client.socket.close).toHaveBeenCalledWith(4004);
  });
});
