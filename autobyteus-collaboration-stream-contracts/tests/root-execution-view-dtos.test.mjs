import test from "node:test";
import assert from "node:assert/strict";
import {
  CollaborationStreamClientMessageSchema,
  RootExecutionEventDtoSchema,
  RootExecutionViewDtoSchema,
} from "../dist/index.js";

const orgSnapshot = (orgRunId = "org-run-1") => ({
  root_subject_kind: "agent_org",
  root_run_id: "org-run-1",
  schema_version: 1,
  root_org: {
    base_change_sequence: 0,
    is_active: true,
    execution_tree: {
      schemaVersion: 1,
      subjectKind: "agent_org",
      createdAt: "2026-09-01T00:00:00.000Z",
      archivedAt: null,
      applicationBinding: null,
      handoffs: [],
      rootOrg: {
        address: "/",
        orgDefinitionId: "org-definition-1",
        orgDefinitionName: "Org",
        orgRunId,
        defaultLaunchConfiguration: {
          runtimeKind: "codex_app_server",
          llmModelIdentifier: "gpt-5.6-sol",
          llmConfig: null,
          autoExecuteTools: false,
          skillAccessMode: "PRELOADED_ONLY",
          workspaceRootPath: null,
        },
        members: [],
        taskExecutions: [],
      },
    },
    task_records: { schemaVersion: 1, subjectKind: "agent_org", orgRunId: "org-run-1", records: [] },
    communication_messages: { schemaVersion: 1, subjectKind: "agent_org", orgRunId: "org-run-1", messages: [] },
    agent_statuses: [],
  },
});

const launchConfiguration = {
  runtimeKind: "codex_app_server",
  llmModelIdentifier: "gpt-5.6-sol",
  llmConfig: null,
  autoExecuteTools: false,
  skillAccessMode: "PRELOADED_ONLY",
  workspaceRootPath: null,
};

const configuredAgent = (address, agentRunId) => ({
  address,
  agentDefinitionId: `definition-${agentRunId}`,
  role: null,
  description: null,
  agentRunId,
  platformAgentRunId: null,
  launchConfiguration,
});

const status = (member_address, agent_run_id) => ({
  member_address,
  agent_run_id,
  status: "idle",
  trigger: null,
  tool_name: null,
  error_message: null,
  error_details: null,
});

test("requires explicit family and exact matching branch", () => {
  assert.equal(RootExecutionViewDtoSchema.parse({ root_subject_kind: "agent_team", root_run_id: "t", schema_version: 2, root_team: {} }).root_subject_kind, "agent_team");
  assert.equal(RootExecutionViewDtoSchema.parse(orgSnapshot()).root_subject_kind, "agent_org");
  assert.throws(() => RootExecutionViewDtoSchema.parse({ root_subject_kind: "agent_org", root_run_id: "o", schema_version: 2, root_team: {} }));
  assert.throws(() => RootExecutionViewDtoSchema.parse(orgSnapshot("another-org-run")), /root correlation mismatch/);
});

test("requires sequenced events and an exact Org-root client command", () => {
  const event = {
    kind: "communication",
    message: {
      messageId: "message-1",
      senderAgentRunId: "agent-1",
      receiverAgentRunId: "agent-2",
      content: "hello",
      messageType: "agent_message",
      referenceFiles: [],
      createdAt: "2026-09-01T00:00:00.000Z",
    },
  };
  assert.equal(RootExecutionEventDtoSchema.parse({ root_subject_kind: "agent_org", root_run_id: "org-run-1", change_sequence: 1, event }).change_sequence, 1);
  assert.throws(() => RootExecutionEventDtoSchema.parse({ root_subject_kind: "agent_org", root_run_id: "org-run-1", event: {} }));
  assert.equal(CollaborationStreamClientMessageSchema.parse({
    type: "SEND_MESSAGE",
    payload: {
      root_subject_kind: "agent_org",
      root_run_id: "org-run-1",
      target_agent_run_id: "agent-run-1",
      command_id: "command-1",
      content: "hello",
      context_file_paths: [],
      image_urls: [],
      message_id: "message-1",
      dedupe_key: "dedupe-1",
    },
  }).payload.root_run_id, "org-run-1");
});

test("requires one correlated status for every live Agent execution", () => {
  const snapshot = orgSnapshot();
  snapshot.root_org.execution_tree.rootOrg.members.push(configuredAgent("/lead", "agent-run-lead"));
  snapshot.root_org.execution_tree.rootOrg.taskExecutions.push({
    address: "/task-active",
    agentRunId: "agent-run-task-active",
    platformAgentRunId: null,
    startedAt: "2026-09-01T00:00:00.000Z",
    settledAt: null,
  }, {
    address: "/task-settled",
    agentRunId: "agent-run-task-settled",
    platformAgentRunId: null,
    startedAt: "2026-09-01T00:00:00.000Z",
    settledAt: "2026-09-01T00:01:00.000Z",
  });
  snapshot.root_org.agent_statuses.push(
    status("/lead", "agent-run-lead"),
    status("/task-active", "agent-run-task-active"),
  );
  assert.equal(RootExecutionViewDtoSchema.parse(snapshot).root_org.agent_statuses.length, 2);

  const missing = structuredClone(snapshot);
  missing.root_org.agent_statuses.pop();
  assert.throws(() => RootExecutionViewDtoSchema.parse(missing), /has no status record/);

  const duplicate = structuredClone(snapshot);
  duplicate.root_org.agent_statuses.push(status("/lead", "agent-run-lead"));
  assert.throws(() => RootExecutionViewDtoSchema.parse(duplicate), /is duplicated/);

  const settledStatus = structuredClone(snapshot);
  settledStatus.root_org.agent_statuses.push(status("/task-settled", "agent-run-task-settled"));
  assert.throws(() => RootExecutionViewDtoSchema.parse(settledStatus), /status identity mismatch/);
});

test("rejects duplicate and sidecar AgentOrg member identities", () => {
  const duplicate = orgSnapshot();
  duplicate.root_org.execution_tree.rootOrg.members.push(
    configuredAgent("/lead", "agent-run-lead"),
    configuredAgent("/other", "agent-run-lead"),
  );
  duplicate.root_org.agent_statuses.push(status("/lead", "agent-run-lead"));
  assert.throws(() => RootExecutionViewDtoSchema.parse(duplicate), /AgentRun identity.*duplicated/);

  const sidecars = orgSnapshot();
  sidecars.root_org.execution_tree.rootOrg.members.push(
    configuredAgent("/lead", "agent-run-lead"),
    configuredAgent("/reviewer", "agent-run-reviewer"),
  );
  sidecars.root_org.agent_statuses.push(
    status("/lead", "agent-run-lead"),
    status("/reviewer", "agent-run-reviewer"),
  );
  sidecars.root_org.communication_messages.messages.push({
    messageId: "message-1",
    senderAgentRunId: "agent-run-lead",
    receiverAgentRunId: "agent-run-missing",
    content: "hello",
    messageType: "agent_message",
    referenceFiles: [],
    createdAt: "2026-09-01T00:00:00.000Z",
  });
  assert.throws(() => RootExecutionViewDtoSchema.parse(sidecars), /communication message.*identity mismatch/);
});
