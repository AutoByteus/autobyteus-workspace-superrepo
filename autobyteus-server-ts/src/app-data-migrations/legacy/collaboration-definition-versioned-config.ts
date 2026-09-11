import { parseAgentTeamDefinitionConfig } from "../../agent-team-definition/providers/agent-team-definition-config.js";
import { parseAgentOrgDefinitionConfig } from "../../agent-org-definition/providers/agent-org-definition-config.js";

const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Definition config must be an object.");
  return value as Record<string, unknown>;
};
const prior = (value: unknown, version: number, validate: (input: unknown) => unknown): Record<string, unknown> => {
  const raw = object(value);
  if (!Object.hasOwn(raw, "schemaVersion") || raw.schemaVersion !== version) {
    throw new Error(`Prior definition schemaVersion must be numeric ${version}.`);
  }
  const { schemaVersion: _version, ...current } = raw;
  validate(current);
  // Preserve every non-version JSON value, not the normal codec's normalized return value.
  return current;
};
export const parsePriorTeamDefinitionConfig = (value: unknown): Record<string, unknown> =>
  prior(value, 2, parseAgentTeamDefinitionConfig);
export const parsePriorOrgDefinitionConfig = (value: unknown): Record<string, unknown> =>
  prior(value, 1, parseAgentOrgDefinitionConfig);

/** Migration terminal checks only: fixed historical targets or terminal current authoring. */
export const parseMigrationTeamDefinitionConfig = (value: unknown): Record<string, unknown> => {
  const raw = object(value);
  if (Object.hasOwn(raw, "schemaVersion")) return parsePriorTeamDefinitionConfig(raw);
  parseAgentTeamDefinitionConfig(raw);
  return raw;
};
export const parseMigrationOrgDefinitionConfig = (value: unknown): Record<string, unknown> => {
  const raw = object(value);
  if (Object.hasOwn(raw, "schemaVersion")) return parsePriorOrgDefinitionConfig(raw);
  parseAgentOrgDefinitionConfig(raw);
  return raw;
};
