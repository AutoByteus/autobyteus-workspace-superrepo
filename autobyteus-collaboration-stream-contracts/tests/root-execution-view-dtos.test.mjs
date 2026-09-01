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
        defaultLaunchConfiguration: {},
        members: [],
        taskExecutions: [],
      },
    },
    task_records: { schemaVersion: 1, subjectKind: "agent_org", orgRunId: "org-run-1", records: [] },
    communication_messages: { schemaVersion: 1, subjectKind: "agent_org", orgRunId: "org-run-1", messages: [] },
  },
});

test("requires explicit family and exact matching branch", () => {
  assert.equal(RootExecutionViewDtoSchema.parse({ root_subject_kind: "agent_team", root_run_id: "t", schema_version: 2, root_team: {} }).root_subject_kind, "agent_team");
  assert.equal(RootExecutionViewDtoSchema.parse(orgSnapshot()).root_subject_kind, "agent_org");
  assert.throws(() => RootExecutionViewDtoSchema.parse({ root_subject_kind: "agent_org", root_run_id: "o", schema_version: 2, root_team: {} }));
  assert.throws(() => RootExecutionViewDtoSchema.parse(orgSnapshot("another-org-run")), /root correlation mismatch/);
});

test("requires sequenced events and an exact Org-root client command", () => {
  assert.equal(RootExecutionEventDtoSchema.parse({ root_subject_kind: "agent_org", root_run_id: "org-run-1", change_sequence: 1, event: {} }).change_sequence, 1);
  assert.throws(() => RootExecutionEventDtoSchema.parse({ root_subject_kind: "agent_org", root_run_id: "org-run-1", event: {} }));
  assert.equal(CollaborationStreamClientMessageSchema.parse({
    type: "SEND_MESSAGE",
    payload: {
      root_subject_kind: "agent_org",
      root_run_id: "org-run-1",
      target_agent_run_id: "agent-run-1",
      content: "hello",
      context_file_paths: [],
      image_urls: [],
      message_id: "message-1",
      dedupe_key: "dedupe-1",
    },
  }).payload.root_run_id, "org-run-1");
});
