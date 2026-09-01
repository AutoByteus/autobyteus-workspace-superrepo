import type { FlatTeamExecutionCallbacks } from "../local/flat-team-execution-callbacks.js";
import { buildDeliveryEndpointForParticipant, type InterAgentMessageDeliveryHandler } from "../domain/inter-agent-message-delivery.js";
import { createTeamAgentPlatformBinding, type TeamAgentPlatformBinding } from "../domain/team-agent-platform-binding.js";
import { createTeamAgentStatusEvent, createTeamAgentStatusSnapshot } from "../domain/team-agent-status.js";
import { TeamRunEventSourceType, type TeamRunEvent } from "../domain/team-run-event.js";
import type { TeamRunContext } from "../domain/team-run-context.js";
import { TeamAgentEventAdapter } from "./team-agent-event-adapter.js";
import { buildTeamMemberInputEventPayload } from "./team-member-input-event-builder.js";
import { MemberExecutionContextBuilder } from "./member-team-context-builder.js";
import type { MemberTaskCommandCapability } from "../../agent-collaboration/execution/task/member-task-command-capability.js";

/** Standalone-Team subject adapter for root-neutral local Agent callbacks. */
export const createTeamFlatExecutionCallbacks = (input: {
  teamContext: TeamRunContext<unknown>;
  memberExecutionContextBuilder: MemberExecutionContextBuilder;
  taskCommands: MemberTaskCommandCapability;
  publish(event: TeamRunEvent): void;
  deliverInterAgentMessage: InterAgentMessageDeliveryHandler;
  acceptPlatformBinding(binding: TeamAgentPlatformBinding): Promise<void>;
}): FlatTeamExecutionCallbacks => Object.freeze({
  buildMemberExecutionContext: ({ identity, sourceNode }) => input.memberExecutionContextBuilder.build({
    teamContext: input.teamContext,
    agentNode: sourceNode,
    deliverInterAgentMessage: input.deliverInterAgentMessage,
    taskCommands: input.taskCommands,
  }).then((context) => {
    if (context.identity.agentRunId !== identity.agentRunId || context.identity.memberAddress !== identity.memberAddress) {
      throw new Error("Team member context identity does not match the local execution.");
    }
    return context;
  }),
  publishAgentEvent: (identity, event) => {
    if (event.kind === "status_overlay") {
      input.publish(createTeamAgentStatusEvent(createTeamAgentStatusSnapshot({
        execution: identity,
        details: { ...event.snapshot.details, toolName: null, errorDetails: null },
      })));
      return;
    }
    if (event.kind === "member_input") {
      input.publish({
        eventSourceType: TeamRunEventSourceType.MEMBER_INPUT,
        agentRunId: identity.agentRunId,
        payload: buildTeamMemberInputEventPayload({
          rootTeamRunId: identity.root.rootRunId,
          recipientAgentRunId: identity.agentRunId,
          message: event.message,
        }),
      });
      return;
    }
    if (event.kind === "readiness_failure") {
      input.publish({
        eventSourceType: TeamRunEventSourceType.AGENT,
        execution: identity,
        payload: {
          eventType: "ERROR",
          details: Object.freeze({
            code: event.code,
            message: event.message,
            errorScope: "runtime",
            errorEffect: "terminal",
            turnId: null,
          }),
          statusHint: "ERROR",
        },
      });
      return;
    }
    const adapted = new TeamAgentEventAdapter((agentRunId) => agentRunId === identity.agentRunId ? identity : null).adapt(event.event);
    if (adapted.kind === "filtered_collaboration_duplicate") return;
    input.publish({
      eventSourceType: TeamRunEventSourceType.AGENT,
      execution: identity,
      payload: adapted.kind === "publish" ? adapted.event : {
        eventType: "ERROR",
        details: Object.freeze({
          code: adapted.code,
          message: adapted.message,
          errorScope: "runtime",
          errorEffect: "terminal",
          turnId: null,
        }),
        statusHint: "ERROR",
      },
    });
  },
  acceptPlatformBinding: (_identity, binding) => input.acceptPlatformBinding(createTeamAgentPlatformBinding(binding)),
  applicationExecutionContext: (identity) => input.teamContext.applicationBinding
    ? Object.freeze({
        applicationId: input.teamContext.applicationBinding.applicationId,
        bindingId: input.teamContext.applicationBinding.bindingId,
        producer: Object.freeze({
          agentRunId: identity.agentRunId,
          displayName: identity.memberAddress.split("/").at(-1) ?? identity.agentRunId,
        }),
      })
    : null,
});
