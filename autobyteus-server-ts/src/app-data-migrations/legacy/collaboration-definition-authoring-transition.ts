import { parseAgentTeamDefinitionConfig } from "../../agent-team-definition/providers/agent-team-definition-config.js";
import { parseAgentOrgDefinitionConfig } from "../../agent-org-definition/providers/agent-org-definition-config.js";

const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Definition config must be an object.");
  return value as Record<string, unknown>;
};
const withoutKnownVersion = (value: unknown, version: number): Record<string, unknown> => {
  const raw = object(value);
  if (Object.hasOwn(raw, "schemaVersion") && raw.schemaVersion !== version) {
    throw new Error(`Prior definition schemaVersion must be numeric ${version}.`);
  }
  const { schemaVersion: _version, ...candidate } = raw;
  return candidate;
};

/** Migration source-to-final candidate only; acceptance is not on-disk completion. */
export const selectTeamAuthoringCandidate = (value: unknown): Record<string, unknown> => {
  const candidate = withoutKnownVersion(value, 2);
  parseAgentTeamDefinitionConfig(candidate);
  return candidate;
};
export const selectOrgAuthoringCandidate = (value: unknown): Record<string, unknown> => {
  const candidate = withoutKnownVersion(value, 1);
  if (Array.isArray(candidate.members)) candidate.members = candidate.members.map((value) => {
    const member = object(value);
    return member.refScope === "agent_org_owned" ? { ...member, refScope: "org_local" } : member;
  });
  parseAgentOrgDefinitionConfig(candidate);
  // Preserve raw JSON values: the normal codec's normalized return is not the candidate.
  return candidate;
};
