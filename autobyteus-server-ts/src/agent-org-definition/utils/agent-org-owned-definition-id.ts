const required = (value: string, label: string): string => {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} is required.`);
  return encodeURIComponent(normalized);
};

/** Creates a tagged opaque identity; consumers must resolve it through a source index. */
export const buildAgentOrgOwnedDefinitionId = (
  kind: "agent" | "agent_team",
  orgDefinitionId: string,
  localDefinitionId: string,
): string => {
  const prefix = kind === "agent" ? "agent-org-owned-agent" : "agent-org-owned-team";
  return `${prefix}:${required(orgDefinitionId, "orgDefinitionId")}:${required(localDefinitionId, "localDefinitionId")}`;
};
