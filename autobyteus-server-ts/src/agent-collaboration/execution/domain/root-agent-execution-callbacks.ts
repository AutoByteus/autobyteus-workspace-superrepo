import type { CollaborationAgentPlatformBinding } from "./collaboration-agent-platform-binding.js";
import type { CollaborationAgentExecutionEvent } from "./collaboration-agent-execution-event.js";
import type { CollaborationMemberExecutionIdentity } from "./root-execution-identity.js";

export type RootAgentExecutionCallbacks = Readonly<{
  publishAgentEvent(
    member: CollaborationMemberExecutionIdentity,
    event: CollaborationAgentExecutionEvent,
  ): void;
  acceptPlatformBinding(
    member: CollaborationMemberExecutionIdentity,
    binding: CollaborationAgentPlatformBinding,
  ): Promise<void>;
}>;
