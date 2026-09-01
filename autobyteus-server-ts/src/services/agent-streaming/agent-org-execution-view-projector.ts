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
  },
});

export const projectAgentOrgExecutionEvent = (
  run: AgentOrgRun,
  sequenced: SequencedRootEvent<AgentOrgRunEvent>,
): RootExecutionEventDto => RootExecutionEventDtoSchema.parse({
  root_subject_kind: "agent_org",
  root_run_id: run.orgRunId,
  change_sequence: sequenced.changeSequence,
  event: sequenced.event,
});
