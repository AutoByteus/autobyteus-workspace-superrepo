import {
  cloneCollaborationMemberExecutionIdentity,
  type CollaborationMemberExecutionIdentity,
} from "./root-execution-identity.js";

export type CollaborationAgentPlatformBinding = Readonly<{
  execution: CollaborationMemberExecutionIdentity;
  platformAgentRunId: string;
}>;

export const createCollaborationAgentPlatformBinding = (input: {
  execution: CollaborationMemberExecutionIdentity;
  platformAgentRunId: string;
}): CollaborationAgentPlatformBinding => {
  const platformAgentRunId = input.platformAgentRunId?.trim();
  if (!platformAgentRunId) throw new Error("platformAgentRunId is required.");
  return Object.freeze({
    execution: cloneCollaborationMemberExecutionIdentity(input.execution),
    platformAgentRunId,
  });
};
