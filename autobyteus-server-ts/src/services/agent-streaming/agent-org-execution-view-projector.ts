import {
  RootExecutionEventDtoSchema,
  RootExecutionViewDtoSchema,
  type RootExecutionEventDto,
  type RootExecutionViewDto,
} from "@autobyteus/collaboration-stream-contracts";
import type { AgentOrgRun, AgentOrgRunPackageSnapshot } from "../../agent-org-execution/domain/agent-org-run.js";
import type { AgentOrgRunEvent } from "../../agent-org-execution/domain/agent-org-run-event.js";
import type { SequencedRootEvent } from "../../agent-collaboration/execution/services/root-event-publisher.js";

export const projectAgentOrgExecutionView = (
  run: AgentOrgRun,
  snapshot: AgentOrgRunPackageSnapshot,
  baseChangeSequence: number,
): RootExecutionViewDto => RootExecutionViewDtoSchema.parse({
  root_subject_kind: "agent_org",
  root_run_id: run.orgRunId,
  schema_version: 1,
  root_org: {
    base_change_sequence: baseChangeSequence,
    is_active: run.isActive(),
    execution_tree: snapshot.tree,
    task_records: snapshot.tasks,
    communication_messages: snapshot.messages,
    agent_statuses: snapshot.statuses.map((status) => ({
      member_address: status.execution.memberAddress,
      agent_run_id: status.execution.agentRunId,
      status: status.details.status,
      trigger: status.details.trigger,
      tool_name: null,
      error_message: status.details.errorMessage,
      error_details: null,
    })),
  },
});

export const projectAgentOrgExecutionEvent = (
  run: AgentOrgRun,
  sequenced: SequencedRootEvent<AgentOrgRunEvent>,
): RootExecutionEventDto | null => {
  if (sequenced.event.kind === "lifecycle") return null;
  const event = sequenced.event.kind === "agent_presentation"
    ? {
        kind: "agent_presentation" as const,
        member_address: sequenced.event.execution.memberAddress,
        agent_run_id: sequenced.event.execution.agentRunId,
        message: sequenced.event.message,
      }
    : sequenced.event.kind === "task"
      ? { kind: "task" as const, event: sequenced.event.event }
      : { kind: "communication" as const, message: sequenced.event.message };
  return RootExecutionEventDtoSchema.parse({
    root_subject_kind: "agent_org",
    root_run_id: run.orgRunId,
    change_sequence: sequenced.changeSequence,
    event,
  });
};
