import { promises as fs } from "node:fs";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import { parseCanonicalApplicationOwnedTeamId } from "../../application-bundles/utils/application-bundle-identity.js";
type ApplicationOwnedTeamSourcePaths = {
  definitionId: string;
  teamDir: string;
  mdPath: string;
  configPath: string;
  rootPath: string;
  applicationId: string;
  applicationName: string;
  packageId: string;
  localApplicationId: string;
  localTeamId: string;
};
import type { AgentOrgOwnedDefinitionSourcePaths } from "../../agent-org-definition/providers/agent-org-owned-definition-source-index.js";

export type SharedTeamSourcePaths = {
  kind: "shared";
  definitionId: string;
  localTeamId: string;
  teamDir: string;
  mdPath: string;
  configPath: string;
  rootPath: string;
};

export type ResolvedTeamSourcePaths =
  | SharedTeamSourcePaths
  | ({ kind: "application_owned" } & ApplicationOwnedTeamSourcePaths)
  | (AgentOrgOwnedDefinitionSourcePaths & { subject: "agent_team"; teamDir: string; localTeamId: string });

type ApplicationOwnedTeamSourceLookup = {
  getApplicationOwnedTeamSourceById: (definitionId: string) => Promise<{
    definitionId: string;
    localDefinitionId: string;
    applicationRootPath: string;
    applicationId: string;
    applicationName: string;
    packageId: string;
    localApplicationId: string;
  } | null>;
};

export const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const isWritable = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath, fsConstants.W_OK);
    return true;
  } catch {
    return false;
  }
};

export const getCanonicalTeamDefinitionIdFromSourcePaths = (
  sourcePaths: ResolvedTeamSourcePaths,
): string => sourcePaths.definitionId;

export const getLocalTeamIdFromSourcePaths = (
  sourcePaths: ResolvedTeamSourcePaths,
): string => sourcePaths.localTeamId;

export const buildSharedTeamSourcePaths = (
  teamRoot: string,
  teamId: string,
): SharedTeamSourcePaths => {
  const teamDir = path.join(teamRoot, teamId);
  return {
    kind: "shared",
    definitionId: teamId,
    localTeamId: teamId,
    teamDir,
    mdPath: path.join(teamDir, "team.md"),
    configPath: path.join(teamDir, "team-config.json"),
    rootPath: teamRoot,
  };
};

export const buildApplicationOwnedTeamSourcePaths = (
  source: {
    definitionId: string;
    localDefinitionId: string;
    applicationRootPath: string;
    applicationId: string;
    applicationName: string;
    packageId: string;
    localApplicationId: string;
  },
): Extract<ResolvedTeamSourcePaths, { kind: "application_owned" }> => {
  const teamDir = path.join(source.applicationRootPath, "agent-teams", source.localDefinitionId);
  return {
    kind: "application_owned",
    definitionId: source.definitionId,
    teamDir,
    mdPath: path.join(teamDir, "team.md"),
    configPath: path.join(teamDir, "team-config.json"),
    rootPath: source.applicationRootPath,
    applicationId: source.applicationId,
    applicationName: source.applicationName,
    packageId: source.packageId,
    localApplicationId: source.localApplicationId,
    localTeamId: source.localDefinitionId,
  };
};

const findSharedTeamSourcePaths = async (
  readTeamRoots: string[],
  teamId: string,
): Promise<SharedTeamSourcePaths | null> => {
  for (const rootPath of readTeamRoots) {
    const sourcePaths = buildSharedTeamSourcePaths(rootPath, teamId);
    try {
      await fs.access(sourcePaths.mdPath);
      return sourcePaths;
    } catch {
      continue;
    }
  }
  return null;
};

const findApplicationOwnedTeamSourcePaths = async (
  applicationBundleService: ApplicationOwnedTeamSourceLookup,
  definitionId: string,
): Promise<ResolvedTeamSourcePaths | null> => {
  const source = await applicationBundleService.getApplicationOwnedTeamSourceById(definitionId);
  if (!source) {
    return null;
  }
  return buildApplicationOwnedTeamSourcePaths(source);
};

export const findTeamSourcePaths = async (
  teamId: string,
  readTeamRoots: string[],
  applicationBundleService: ApplicationOwnedTeamSourceLookup,
): Promise<ResolvedTeamSourcePaths | null> => {
  if (parseCanonicalApplicationOwnedTeamId(teamId)) {
    return findApplicationOwnedTeamSourcePaths(applicationBundleService, teamId);
  }
  return findSharedTeamSourcePaths(readTeamRoots, teamId);
};

export const ensureWritableTeamSourcePaths = async (
  sourcePaths: ResolvedTeamSourcePaths,
  teamId: string,
): Promise<void> => {
  if (!(await isWritable(sourcePaths.teamDir))) {
    throw new Error(`Team definition '${teamId}' is read-only at source path '${sourcePaths.rootPath}'.`);
  }
  if ((await pathExists(sourcePaths.mdPath)) && !(await isWritable(sourcePaths.mdPath))) {
    throw new Error(`Team definition '${teamId}' is read-only at source path '${sourcePaths.rootPath}'.`);
  }
  if ((await pathExists(sourcePaths.configPath)) && !(await isWritable(sourcePaths.configPath))) {
    throw new Error(`Team definition '${teamId}' is read-only at source path '${sourcePaths.rootPath}'.`);
  }
};
