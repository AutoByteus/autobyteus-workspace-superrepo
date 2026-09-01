import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { AppConfig } from "../../../config/app-config.js";
import { appConfigProvider } from "../../../config/app-config-provider.js";
import { AgentMemoryLayout } from "../../../agent-memory/store/agent-memory-layout.js";
import type { AppDataMigrationDefinition, AppDataMigrationExecutionResult, AppDataMigrationItemDetail } from "../../domain/app-data-migration-types.js";
import { TEAM_RUN_EXECUTION_TREE_V2_MIGRATION_ID } from "../team-run-execution-tree-v2-app-data-migration.js";
import { parseAgentTeamDefinitionConfigV2 } from "../../../agent-team-definition/providers/agent-team-definition-config-v2.js";
import { parseAgentOrgDefinitionConfigV1 } from "../../../agent-org-definition/providers/agent-org-definition-config-v1.js";
import { validateTeamRunExecutionTreePayload } from "../../../run-history/store/team-run-execution-tree-schema.js";
import { validateAgentOrgRunExecutionTreePayload } from "../../../run-history/store/agent-org-run-execution-tree-schema.js";
import { getTeamRunExecutionTreePath } from "../../../run-history/store/team-run-execution-tree-path.js";
import { getAgentOrgRunExecutionTreePath } from "../../../run-history/store/agent-org-run-execution-tree-path.js";
import { getAtomicRunPackageFileCommitWriter, type AtomicRunPackageFileCommitWriter } from "../../../run-history/store/atomic-run-package-file-commit-writer.js";
import { getTaskDelegationRecordsV1Path } from "../../../agent-team-execution/task-delegation/records/task-delegation-records-v1-store.js";
import { validateTaskDelegationRecordsV1Payload } from "../../../agent-team-execution/task-delegation/records/task-delegation-records-v1-schema.js";
import { getTeamCommunicationMessagesV1Path } from "../../../services/team-communication/team-communication-v1-store.js";
import { validateTeamCommunicationMessagesV1Payload } from "../../../services/team-communication/team-communication-v1-schema.js";
import { getAgentOrgTaskDelegationRecordsV1Path } from "../../../agent-org-execution/persistence/agent-org-task-delegation-records-v1-store.js";
import { validateAgentOrgTaskDelegationRecordsV1 } from "../../../agent-org-execution/persistence/agent-org-task-delegation-records-v1-schema.js";
import { getAgentOrgCommunicationMessagesV1Path } from "../../../agent-org-execution/persistence/agent-org-communication-messages-v1-store.js";
import { validateAgentOrgCommunicationMessagesV1 } from "../../../agent-org-execution/persistence/agent-org-communication-messages-v1-schema.js";
import { buildAgentOrgOwnedDefinitionId } from "../../../agent-org-definition/utils/agent-org-owned-definition-id.js";
import { TeamRunHistoryIndexStore } from "../../../run-history/store/team-run-history-index-store.js";
import { AgentOrgRunHistoryIndexStore } from "../../../run-history/store/agent-org-run-history-index-store.js";
import type { AgentOrgRunIndexRowRecord } from "../../../run-history/store/agent-org-run-history-index-record-types.js";
import { validateReleasedTeamRunV2, type ReleasedTeamRunV2 } from "./released-team-run-v2-schema.js";

export const AGENT_ORG_FLAT_TEAM_FAMILIES_V1_MIGRATION_ID = "20260901_agent_org_flat_team_families_v1";

type Disposition =
  | "MIGRATED_FLAT_TEAM_DEFINITION" | "MIGRATED_ORG_DEFINITION" | "SKIPPED_CURRENT_DEFINITION"
  | "SKIPPED_FLAT_TEAM_RUN_ZERO_WRITE" | "MIGRATED_ORG_RUN" | "CLEANED_CURRENT_ORG"
  | "MIGRATED_ORG_HISTORY" | "FAILED_DEFINITION" | "FAILED_RUNTIME" | "FAILED_HISTORY" | "FAILED_FAMILY_CONFLICT";
type Count = { count: number; examples: string[] };
type LegacyMember = { memberName: string; ref: string; refType: "agent" | "agent_team"; refScope: "shared" | "team_local" | "application_owned" };
type LegacyTeamConfig = { coordinatorMemberName: string; members: LegacyMember[]; handoffs: unknown[]; avatarUrl: string | null; defaultLaunchConfig: unknown };

const record = (value: unknown, label: string): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
};
const exact = (value: Record<string, unknown>, allowed: readonly string[], required: readonly string[], label: string): void => {
  const keys = Object.keys(value);
  if (keys.some((key) => !allowed.includes(key)) || required.some((key) => !keys.includes(key))) throw new Error(`${label} has unsupported or missing fields.`);
};
const string = (value: unknown, label: string): string => {
  if (typeof value !== "string" || !value.trim() || value !== value.trim()) throw new Error(`${label} must be a non-empty trimmed string.`);
  return value;
};
const legacyConfig = (value: unknown): LegacyTeamConfig => {
  const root = record(value, "released Team definition config");
  exact(root, ["coordinatorMemberName", "members", "handoffs", "avatarUrl", "defaultLaunchConfig"], ["coordinatorMemberName", "members"], "released Team definition config");
  if (!Array.isArray(root.members)) throw new Error("members must be an array.");
  const members = root.members.map((item, index) => {
    const member = record(item, `members[${index}]`);
    exact(member, ["memberName", "ref", "refType", "refScope"], ["memberName", "ref", "refType", "refScope"], `members[${index}]`);
    if (member.refType !== "agent" && member.refType !== "agent_team") throw new Error(`members[${index}].refType is unsupported.`);
    if (member.refScope !== "shared" && member.refScope !== "team_local" && member.refScope !== "application_owned") throw new Error(`members[${index}].refScope is unsupported.`);
    return { memberName: string(member.memberName, `members[${index}].memberName`), ref: string(member.ref, `members[${index}].ref`), refType: member.refType as LegacyMember["refType"], refScope: member.refScope as LegacyMember["refScope"] };
  });
  const handoffs = root.handoffs === undefined ? [] : root.handoffs;
  if (!Array.isArray(handoffs)) throw new Error("handoffs must be an array.");
  const avatarUrl = root.avatarUrl === undefined || root.avatarUrl === null ? null : string(root.avatarUrl, "avatarUrl");
  const defaults = root.defaultLaunchConfig === undefined || root.defaultLaunchConfig === null ? null : record(root.defaultLaunchConfig, "defaultLaunchConfig");
  const defaultLaunchConfig = defaults === null ? null : {
    llmModelIdentifier: defaults.llmModelIdentifier ?? null,
    runtimeKind: defaults.runtimeKind ?? null,
    llmConfig: defaults.llmConfig ?? null,
  };
  return { coordinatorMemberName: string(root.coordinatorMemberName, "coordinatorMemberName"), members, handoffs, avatarUrl, defaultLaunchConfig };
};
const teamTarget = (legacy: LegacyTeamConfig): unknown => ({
  schemaVersion: 2, coordinatorMemberName: legacy.coordinatorMemberName,
  members: legacy.members.map(({ memberName, ref, refScope }) => ({ memberName, ref, refScope })),
  handoffs: legacy.handoffs, avatarUrl: legacy.avatarUrl, defaultLaunchConfig: legacy.defaultLaunchConfig,
});
const orgTarget = (legacy: LegacyTeamConfig, legacyRootDefinitionId: string): unknown => ({
  schemaVersion: 1,
  members: legacy.members.map((member) => ({
    memberName: member.memberName,
    ref: member.refScope === "team_local"
      ? buildAgentOrgOwnedDefinitionId(member.refType, legacyRootDefinitionId, member.ref)
      : member.ref,
    refType: member.refType,
    refScope: member.refScope === "team_local" ? "agent_org_owned" : member.refScope,
  })),
  handoffs: legacy.handoffs, avatarUrl: legacy.avatarUrl, defaultLaunchConfig: legacy.defaultLaunchConfig,
});
const exists = (target: string): Promise<boolean> => fs.access(target).then(() => true).catch(() => false);
const atomicText = async (target: string, content: string): Promise<void> => {
  await fs.mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.${process.pid}.${randomUUID()}.tmp`;
  await fs.writeFile(temp, content, "utf8");
  await fs.rename(temp, target);
};

const orgTreeTarget = (released: ReleasedTeamRunV2): unknown => {
  const root = released.root as Record<string, unknown>;
  const team = released.rootTeam as Record<string, unknown>;
  return {
    schemaVersion: 1, subjectKind: "agent_org", createdAt: root.createdAt, archivedAt: root.archivedAt,
    applicationBinding: root.applicationBinding, handoffs: root.handoffs,
    rootOrg: { address: "/", orgDefinitionId: team.teamDefinitionId, orgDefinitionName: team.teamDefinitionName,
      orgRunId: team.teamRunId, defaultLaunchConfiguration: team.defaultLaunchConfiguration,
      members: team.members, taskExecutions: team.taskExecutions },
  };
};

export class AgentOrgFlatTeamFamiliesV1AppDataMigration implements AppDataMigrationDefinition {
  readonly id = AGENT_ORG_FLAT_TEAM_FAMILIES_V1_MIGRATION_ID;
  readonly displayName = "Cut over flat Team and AgentOrg definition/run families";
  readonly description = "Converts server-owned released definitions and one-level organization-like Team runs while preserving native flat Team runs byte-for-byte.";
  readonly requiredOnStartup = true;
  readonly executionPolicy = "STARTUP_ONLY" as const;
  readonly prerequisiteMigrationIds = [TEAM_RUN_EXECUTION_TREE_V2_MIGRATION_ID] as const;
  private counts = new Map<Disposition, Count>();
  private scanned = 0;
  private readonly layout: AgentMemoryLayout;
  constructor(
    private readonly memoryDir: string,
    private readonly config: AppConfig = appConfigProvider.config,
    private readonly writer: AtomicRunPackageFileCommitWriter = getAtomicRunPackageFileCommitWriter(),
  ) { this.layout = new AgentMemoryLayout(memoryDir); }

  async execute(): Promise<AppDataMigrationExecutionResult> {
    this.counts.clear(); this.scanned = 0;
    await this.migrateDefinitions();
    await this.cleanupDefinitionTargets();
    await this.migrateRuntimeRoots();
    await this.cleanupOrgTargets();
    await this.migrateHistoryIndexes();
    return this.result();
  }
  private async migrateDefinitions(): Promise<void> {
    const teamRoot = this.config.getAgentTeamsDir();
    const orgRoot = this.config.getAgentOrgsDir();
    const entries = await fs.readdir(teamRoot, { withFileTypes: true }).catch(() => []);
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!entry.isDirectory()) continue;
      this.scanned += 1;
      const source = path.join(teamRoot, entry.name);
      const configPath = path.join(source, "team-config.json");
      let raw: unknown;
      try { raw = JSON.parse(await fs.readFile(configPath, "utf8")); }
      catch { this.add("FAILED_DEFINITION", configPath); continue; }
      try { parseAgentTeamDefinitionConfigV2(raw); this.add("SKIPPED_CURRENT_DEFINITION", configPath); continue; }
      catch { /* isolated released decoder follows */ }
      try {
        const legacy = legacyConfig(raw);
        const organizationLike = legacy.members.some((member) => member.refType === "agent_team");
        if (!organizationLike) {
          const target = teamTarget(legacy); parseAgentTeamDefinitionConfigV2(target);
          await this.writeJson(configPath, target); parseAgentTeamDefinitionConfigV2(JSON.parse(await fs.readFile(configPath, "utf8")));
          this.add("MIGRATED_FLAT_TEAM_DEFINITION", configPath); continue;
        }
        const destination = path.join(orgRoot, entry.name);
        if (await exists(destination)) { this.add("FAILED_FAMILY_CONFLICT", destination); continue; }
        for (const member of legacy.members.filter((item) => item.refType === "agent_team" && item.refScope === "team_local")) {
          const childPath = path.join(source, "agent-teams", member.ref, "team-config.json");
          const child = legacyConfig(JSON.parse(await fs.readFile(childPath, "utf8")));
          if (child.members.some((item) => item.refType !== "agent")) throw new Error("owned Team is not flat.");
          const target = teamTarget(child); parseAgentTeamDefinitionConfigV2(target); await this.writeJson(childPath, target);
        }
        const target = orgTarget(legacy, entry.name); parseAgentOrgDefinitionConfigV1(target);
        await this.writeJson(path.join(source, "org-config.json"), target);
        await atomicText(path.join(source, "org.md"), await fs.readFile(path.join(source, "team.md"), "utf8"));
        await fs.rename(source, destination);
        await fs.rm(path.join(destination, "team-config.json"), { force: true });
        await fs.rm(path.join(destination, "team.md"), { force: true });
        parseAgentOrgDefinitionConfigV1(JSON.parse(await fs.readFile(path.join(destination, "org-config.json"), "utf8")));
        this.add("MIGRATED_ORG_DEFINITION", destination);
      } catch { this.add("FAILED_DEFINITION", configPath); }
    }
  }
  private async migrateRuntimeRoots(): Promise<void> {
    const sourceRoot = this.layout.getTeamRootDirPath();
    const targetRoot = this.layout.getOrgRootDirPath();
    const entries = await fs.readdir(sourceRoot, { withFileTypes: true }).catch(() => []);
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!entry.isDirectory()) continue;
      this.scanned += 1;
      const source = path.join(sourceRoot, entry.name);
      const filePath = getTeamRunExecutionTreePath(source);
      let raw: unknown;
      try { raw = JSON.parse(await fs.readFile(filePath, "utf8")); }
      catch { this.add("FAILED_RUNTIME", filePath); continue; }
      try {
        validateTeamRunExecutionTreePayload(raw, entry.name);
        this.add("SKIPPED_FLAT_TEAM_RUN_ZERO_WRITE", filePath);
        continue;
      } catch { /* migration-only released V2 classifier follows */ }
      try {
        const released = validateReleasedTeamRunV2(raw, entry.name);
        if (released.teamCount < 1) throw new Error("non-flat root is not organization-like.");
        const targetDir = path.join(targetRoot, entry.name);
        if (await exists(targetDir)) { this.add("FAILED_FAMILY_CONFLICT", targetDir); continue; }
        const teamTasks = validateTaskDelegationRecordsV1Payload(
          JSON.parse(await fs.readFile(getTaskDelegationRecordsV1Path(source), "utf8")),
          entry.name,
        );
        const teamMessages = validateTeamCommunicationMessagesV1Payload(
          JSON.parse(await fs.readFile(getTeamCommunicationMessagesV1Path(source), "utf8")),
          entry.name,
        );
        const target = orgTreeTarget(released);
        validateAgentOrgRunExecutionTreePayload(target, entry.name);
        const orgTasks = validateAgentOrgTaskDelegationRecordsV1({
          schemaVersion: 1,
          subjectKind: "agent_org",
          orgRunId: entry.name,
          records: teamTasks.records,
        }, entry.name);
        const orgMessages = validateAgentOrgCommunicationMessagesV1({
          schemaVersion: 1,
          subjectKind: "agent_org",
          orgRunId: entry.name,
          messages: teamMessages.messages,
        }, entry.name);
        await this.writeJson(getAgentOrgRunExecutionTreePath(source), target, "execution_tree");
        await this.writeJson(getAgentOrgTaskDelegationRecordsV1Path(source), orgTasks, "org_task_records");
        await this.writeJson(getAgentOrgCommunicationMessagesV1Path(source), orgMessages, "org_communication_messages");
        validateAgentOrgRunExecutionTreePayload(JSON.parse(await fs.readFile(getAgentOrgRunExecutionTreePath(source), "utf8")), entry.name);
        validateAgentOrgTaskDelegationRecordsV1(JSON.parse(await fs.readFile(getAgentOrgTaskDelegationRecordsV1Path(source), "utf8")), entry.name);
        validateAgentOrgCommunicationMessagesV1(JSON.parse(await fs.readFile(getAgentOrgCommunicationMessagesV1Path(source), "utf8")), entry.name);
        await fs.mkdir(targetRoot, { recursive: true });
        await fs.rename(source, targetDir);
        await this.validateCompleteOrgRunPackage(targetDir, entry.name);
        await fs.rm(getTeamRunExecutionTreePath(targetDir), { force: true });
        await fs.rm(getTaskDelegationRecordsV1Path(targetDir), { force: true });
        await fs.rm(getTeamCommunicationMessagesV1Path(targetDir), { force: true });
        if (await exists(getTeamRunExecutionTreePath(targetDir))
          || await exists(getTaskDelegationRecordsV1Path(targetDir))
          || await exists(getTeamCommunicationMessagesV1Path(targetDir))) {
          throw new Error("retired Team run authorities cleanup failed.");
        }
        await this.validateCompleteOrgRunPackage(targetDir, entry.name);
        this.add("MIGRATED_ORG_RUN", targetDir);
      } catch { this.add("FAILED_RUNTIME", filePath); }
    }
  }
  private async cleanupDefinitionTargets(): Promise<void> {
    const root = this.config.getAgentOrgsDir();
    const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(root, entry.name);
      const retiredConfig = path.join(dir, "team-config.json");
      const retiredMarkdown = path.join(dir, "team.md");
      if (!(await exists(retiredConfig)) && !(await exists(retiredMarkdown))) continue;
      this.scanned += 1;
      try {
        parseAgentOrgDefinitionConfigV1(JSON.parse(await fs.readFile(path.join(dir, "org-config.json"), "utf8")));
        await fs.readFile(path.join(dir, "org.md"), "utf8");
        await fs.rm(retiredConfig, { force: true });
        await fs.rm(retiredMarkdown, { force: true });
        if (await exists(retiredConfig) || await exists(retiredMarkdown)) throw new Error("retired definition cleanup failed.");
        this.add("CLEANED_CURRENT_ORG", dir);
      } catch { this.add("FAILED_DEFINITION", dir); }
    }
  }
  private async cleanupOrgTargets(): Promise<void> {
    const root = this.layout.getOrgRootDirPath();
    const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(root, entry.name);
      const retired = [
        getTeamRunExecutionTreePath(dir),
        getTaskDelegationRecordsV1Path(dir),
        getTeamCommunicationMessagesV1Path(dir),
      ];
      if (!(await Promise.all(retired.map(exists))).some(Boolean)) continue;
      this.scanned += 1;
      try {
        await this.validateCompleteOrgRunPackage(dir, entry.name);
        for (const filePath of retired) await fs.rm(filePath, { force: true });
        if ((await Promise.all(retired.map(exists))).some(Boolean)) throw new Error("retired Team run authorities cleanup failed.");
        await this.validateCompleteOrgRunPackage(dir, entry.name);
        this.add("CLEANED_CURRENT_ORG", dir);
      } catch { this.add("FAILED_RUNTIME", dir); }
    }
  }
  private async migrateHistoryIndexes(): Promise<void> {
    const teamIndex = new TeamRunHistoryIndexStore(this.memoryDir);
    const orgIndex = new AgentOrgRunHistoryIndexStore(this.memoryDir);
    this.scanned += 1;
    try {
      const [teamSnapshot, existingOrgRows] = await Promise.all([
        teamIndex.readIndexStrict(),
        orgIndex.readIndex(),
      ]);
      const teamRows = new Map(teamSnapshot.rows.map((row) => [row.teamRunId, row]));
      const orgRows = new Map(existingOrgRows.map((row) => [row.orgRunId, row]));
      const orgRunIds = new Set<string>();
      const entries = await fs.readdir(this.layout.getOrgRootDirPath(), { withFileTypes: true }).catch(() => []);
      for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
        if (!entry.isDirectory()) continue;
        const orgDir = this.layout.getOrgDirPath(entry.name);
        await this.validateCompleteOrgRunPackage(orgDir, entry.name);
        const tree = validateAgentOrgRunExecutionTreePayload(
          JSON.parse(await fs.readFile(getAgentOrgRunExecutionTreePath(orgDir), "utf8")),
          entry.name,
        );
        orgRunIds.add(entry.name);
        const orgRow = orgRows.get(entry.name);
        const retiredTeamRow = teamRows.get(entry.name);
        const preserved = orgRow ?? retiredTeamRow;
        const next: AgentOrgRunIndexRowRecord = Object.freeze({
          orgRunId: entry.name,
          orgDefinitionId: tree.rootOrg.orgDefinitionId,
          orgDefinitionName: tree.rootOrg.orgDefinitionName,
          workspaceRootPath: tree.rootOrg.defaultLaunchConfiguration.workspaceRootPath,
          summary: preserved?.summary ?? "",
          createdAt: tree.createdAt,
          archivedAt: tree.archivedAt,
          terminatedAt: preserved?.terminatedAt ?? null,
        });
        orgRows.set(entry.name, next);
      }
      const nextOrgRows = [...orgRows.values()].filter((row) => orgRunIds.has(row.orgRunId));
      await orgIndex.writeIndex(nextOrgRows);
      const nextTeamRows = teamSnapshot.rows.filter((row) => !orgRunIds.has(row.teamRunId));
      if (teamSnapshot.sourceExists && nextTeamRows.length !== teamSnapshot.rows.length) {
        await teamIndex.writeIndex(nextTeamRows);
      }
      const convertedCount = teamSnapshot.rows.length - nextTeamRows.length;
      if (convertedCount > 0) this.add("MIGRATED_ORG_HISTORY", teamSnapshot.sourcePath);
    } catch (error) {
      this.add("FAILED_HISTORY", error instanceof Error ? error.message : String(error));
    }
  }
  private async validateCompleteOrgRunPackage(dir: string, orgRunId: string): Promise<void> {
    validateAgentOrgRunExecutionTreePayload(
      JSON.parse(await fs.readFile(getAgentOrgRunExecutionTreePath(dir), "utf8")),
      orgRunId,
    );
    validateAgentOrgTaskDelegationRecordsV1(
      JSON.parse(await fs.readFile(getAgentOrgTaskDelegationRecordsV1Path(dir), "utf8")),
      orgRunId,
    );
    validateAgentOrgCommunicationMessagesV1(
      JSON.parse(await fs.readFile(getAgentOrgCommunicationMessagesV1Path(dir), "utf8")),
      orgRunId,
    );
  }
  private async writeJson(filePath: string, payload: unknown, file = "definition"): Promise<void> {
    const outcome = await this.writer.write({ file, filePath, payload });
    if (outcome.outcome !== "committed") {
      throw new Error(`Atomic write did not finalize for '${filePath}' (${outcome.outcome}:${outcome.stage}).`);
    }
  }
  private add(disposition: Disposition, example: string): void {
    const current = this.counts.get(disposition) ?? { count: 0, examples: [] };
    current.count += 1;
    current.examples.push(path.relative(this.memoryDir, example).split(path.sep).join("/"));
    current.examples.sort(); current.examples.splice(5); this.counts.set(disposition, current);
  }
  private result(): AppDataMigrationExecutionResult {
    let migratedCount = 0, skippedCount = 0, failedCount = 0;
    const details: AppDataMigrationItemDetail[] = [];
    for (const [name, value] of [...this.counts].sort(([a], [b]) => a.localeCompare(b))) {
      const failed = name.startsWith("FAILED_");
      const skipped = name.startsWith("SKIPPED_");
      if (failed) failedCount += value.count; else if (skipped) skippedCount += value.count; else migratedCount += value.count;
      details.push({ itemId: name, status: failed ? "FAILED" : skipped ? "SKIPPED" : "MIGRATED", message: `Count: ${value.count}.${value.examples.length ? ` Examples: ${value.examples.join(", ")}.` : ""}` });
    }
    return { status: failedCount ? "FAILED" : "SUCCEEDED", summary: { scannedCount: this.scanned, migratedCount, skippedCount, failedCount, details }, errorMessage: failedCount ? `${failedCount} flat-Team/AgentOrg family item(s) require correction and restart.` : null };
  }
}
