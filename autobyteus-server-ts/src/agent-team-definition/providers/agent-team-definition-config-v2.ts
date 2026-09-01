import type {
  AgentTeamDefinition,
  TeamMemberRefScope,
} from "../domain/agent-team-definition.js";
import type { DefaultLaunchConfig } from "../../launch-preferences/default-launch-config.js";
import {
  cloneCollaborationHandoffs,
  normalizeCollaborationHandoffs,
  type CollaborationHandoff,
} from "../../agent-collaboration/domain/collaboration-handoff.js";

export const AGENT_TEAM_DEFINITION_CONFIG_SCHEMA_VERSION = 2 as const;

export type AgentTeamDefinitionConfigMemberV2 = Readonly<{
  memberName: string;
  ref: string;
  refScope: TeamMemberRefScope;
}>;

export type AgentTeamDefinitionConfigFileV2 = Readonly<{
  schemaVersion: 2;
  coordinatorMemberName: string;
  members: readonly AgentTeamDefinitionConfigMemberV2[];
  handoffs: readonly CollaborationHandoff[];
  avatarUrl: string | null;
  defaultLaunchConfig: DefaultLaunchConfig | null;
}>;

export class AgentTeamDefinitionConfigV2ParseError extends Error {
  readonly code = "DEFINITION_CONTRACT_INVALID";

  constructor(message: string) {
    super(message);
    this.name = "AgentTeamDefinitionConfigV2ParseError";
  }
}

const fail = (message: string): never => {
  throw new AgentTeamDefinitionConfigV2ParseError(message);
};

const asRecord = (value: unknown, label: string): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fail(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
};

const assertExactKeys = (
  value: Record<string, unknown>,
  expected: readonly string[],
  label: string,
): void => {
  const actual = Object.keys(value).sort();
  const target = [...expected].sort();
  if (actual.length !== target.length || actual.some((key, index) => key !== target[index])) {
    fail(`${label} must contain exactly ${target.join(", ")}.`);
  }
};

const requiredString = (value: unknown, label: string): string => {
  if (typeof value !== "string" || value.length === 0 || value !== value.trim()) {
    return fail(`${label} must be a non-empty trimmed string.`);
  }
  return value;
};

const parseDefaultLaunchConfig = (value: unknown): DefaultLaunchConfig | null => {
  if (value === null) return null;
  const candidate = asRecord(value, "defaultLaunchConfig");
  assertExactKeys(
    candidate,
    ["llmModelIdentifier", "runtimeKind", "llmConfig"],
    "defaultLaunchConfig",
  );
  const optionalString = (field: "llmModelIdentifier" | "runtimeKind"): string | null => {
    if (candidate[field] === null) return null;
    return requiredString(candidate[field], `defaultLaunchConfig.${field}`);
  };
  if (
    candidate.llmConfig !== null
    && (!candidate.llmConfig || typeof candidate.llmConfig !== "object" || Array.isArray(candidate.llmConfig))
  ) {
    return fail("defaultLaunchConfig.llmConfig must be an object or null.");
  }
  return {
    llmModelIdentifier: optionalString("llmModelIdentifier"),
    runtimeKind: optionalString("runtimeKind"),
    llmConfig: candidate.llmConfig === null
      ? null
      : structuredClone(candidate.llmConfig as Record<string, unknown>),
  };
};

const parseMember = (value: unknown, index: number): AgentTeamDefinitionConfigMemberV2 => {
  const label = `members[${index}]`;
  const candidate = asRecord(value, label);
  assertExactKeys(candidate, ["memberName", "ref", "refScope"], label);
  const refScope = candidate.refScope;
  if (refScope !== "shared" && refScope !== "team_local" && refScope !== "application_owned") {
    return fail(`${label}.refScope must be 'shared', 'team_local', or 'application_owned'.`);
  }
  return Object.freeze({
    memberName: requiredString(candidate.memberName, `${label}.memberName`),
    ref: requiredString(candidate.ref, `${label}.ref`),
    refScope,
  });
};

export const parseAgentTeamDefinitionConfigV2 = (
  value: unknown,
): AgentTeamDefinitionConfigFileV2 => {
  const candidate = asRecord(value, "AgentTeam Definition Config V2");
  assertExactKeys(candidate, [
    "schemaVersion",
    "coordinatorMemberName",
    "members",
    "handoffs",
    "avatarUrl",
    "defaultLaunchConfig",
  ], "AgentTeam Definition Config V2");
  if (candidate.schemaVersion !== AGENT_TEAM_DEFINITION_CONFIG_SCHEMA_VERSION) {
    fail("AgentTeam Definition Config schemaVersion must be numeric 2.");
  }
  if (!Array.isArray(candidate.members)) fail("members must be an array.");
  const candidateMembers = candidate.members as unknown[];
  if (candidate.avatarUrl !== null) requiredString(candidate.avatarUrl, "avatarUrl");
  const parsed: AgentTeamDefinitionConfigFileV2 = {
    schemaVersion: 2,
    coordinatorMemberName: requiredString(candidate.coordinatorMemberName, "coordinatorMemberName"),
    members: candidateMembers.map(parseMember),
    handoffs: normalizeCollaborationHandoffs(candidate.handoffs),
    avatarUrl: candidate.avatarUrl as string | null,
    defaultLaunchConfig: parseDefaultLaunchConfig(candidate.defaultLaunchConfig),
  };
  const coordinatorMatches = parsed.members.filter(
    (member) => member.memberName === parsed.coordinatorMemberName,
  );
  if (coordinatorMatches.length !== 1) {
    fail("coordinatorMemberName must resolve to exactly one direct Agent member.");
  }
  const foldedNames = new Set<string>();
  for (const member of parsed.members) {
    const folded = member.memberName.toLocaleLowerCase("en-US");
    if (foldedNames.has(folded)) fail(`Duplicate Team member placement '${member.memberName}'.`);
    foldedNames.add(folded);
  }
  return Object.freeze({
    ...parsed,
    members: Object.freeze([...parsed.members]),
    handoffs: Object.freeze(cloneCollaborationHandoffs(parsed.handoffs)),
  });
};

export const buildAgentTeamDefinitionConfigV2 = (
  definition: AgentTeamDefinition,
): AgentTeamDefinitionConfigFileV2 => parseAgentTeamDefinitionConfigV2({
  schemaVersion: 2,
  coordinatorMemberName: definition.coordinatorMemberName,
  members: definition.nodes.map((member) => ({
    memberName: member.memberName,
    ref: member.ref,
    refScope: member.refScope,
  })),
  handoffs: cloneCollaborationHandoffs(definition.handoffs),
  avatarUrl: definition.avatarUrl ?? null,
  defaultLaunchConfig: definition.defaultLaunchConfig
    ? {
        llmModelIdentifier: definition.defaultLaunchConfig.llmModelIdentifier,
        runtimeKind: definition.defaultLaunchConfig.runtimeKind,
        llmConfig: definition.defaultLaunchConfig.llmConfig
          ? structuredClone(definition.defaultLaunchConfig.llmConfig)
          : null,
      }
    : null,
});
