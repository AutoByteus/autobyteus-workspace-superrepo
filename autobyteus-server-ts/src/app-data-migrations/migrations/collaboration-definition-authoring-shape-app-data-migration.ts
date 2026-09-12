import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import type { AppConfig } from "../../config/app-config.js";
import { appConfigProvider } from "../../config/app-config-provider.js";
import type { AppDataMigrationDefinition, AppDataMigrationExecutionResult, AppDataMigrationItemDetail } from "../domain/app-data-migration-types.js";
import { parseAgentTeamDefinitionConfig } from "../../agent-team-definition/providers/agent-team-definition-config.js";
import { parseAgentOrgDefinitionConfig } from "../../agent-org-definition/providers/agent-org-definition-config.js";
import { selectTeamAuthoringCandidate, selectOrgAuthoringCandidate } from "../legacy/collaboration-definition-authoring-transition.js";
import { listOwnedDefinitionPackages, readOwnedDefinitionPackage } from "../legacy/owned-definition-package-inventory.js";
import { getAtomicRunPackageFileCommitWriter, type AtomicRunPackageFileCommitWriter } from "../../run-history/store/atomic-run-package-file-commit-writer.js";

export const COLLABORATION_DEFINITION_AUTHORING_SHAPE_MIGRATION_ID = "20260911_collaboration_definition_authoring_shape";
type Disposition = "MIGRATED_AUTHORING_CONFIG" | "SKIPPED_CURRENT_DEFINITION" | "FAILED_DEFINITION" | "FAILED_INVENTORY";
type Count = { count: number; examples: string[] };

/** Definition-only transition. No memory roots, external packages, or runtime prerequisites. */
export class CollaborationDefinitionAuthoringShapeAppDataMigration implements AppDataMigrationDefinition {
  readonly id = COLLABORATION_DEFINITION_AUTHORING_SHAPE_MIGRATION_ID;
  readonly displayName = "Update Team and Org definition authoring shape";
  readonly description = "Converts owned current-family definitions to unversioned Team and org_local Org authoring.";
  readonly requiredOnStartup = true;
  readonly executionPolicy = "STARTUP_ONLY" as const;
  private readonly counts = new Map<Disposition, Count>();
  private readonly visited = new Set<string>();
  constructor(private readonly config: Pick<AppConfig, "getAgentTeamsDir" | "getAgentOrgsDir"> = appConfigProvider.config,
    private readonly writer: AtomicRunPackageFileCommitWriter = getAtomicRunPackageFileCommitWriter()) {}

  async execute(): Promise<AppDataMigrationExecutionResult> {
    this.counts.clear(); this.visited.clear();
    const teamRoot = this.config.getAgentTeamsDir(), orgRoot = this.config.getAgentOrgsDir();
    for (const dir of await this.inventory(teamRoot)) await this.convert(teamRoot, dir, "team");
    for (const dir of await this.inventory(orgRoot)) {
      // Inspect physical owned children even when the parent's normal config is invalid.
      // Ordinary package recovery happens first, so a recovered canonical parent is discoverable.
      await this.convert(orgRoot, dir, "org");
      for (const child of await this.inventory(orgRoot, path.join(dir, "agent-teams"))) await this.convert(orgRoot, child, "team");
    }
    return this.result();
  }
  private async inventory(root: string, directory = root): Promise<readonly string[]> {
    try { return await listOwnedDefinitionPackages(root, directory); }
    catch (error) { this.add("FAILED_INVENTORY", directory, error); return []; }
  }
  private async convert(root: string, directory: string, family: "team" | "org"): Promise<void> {
    const configPath = path.resolve(directory, `${family}-config.json`);
    if (this.visited.has(configPath)) return;
    this.visited.add(configPath);
    try {
      const validate = family === "team" ? parseAgentTeamDefinitionConfig : parseAgentOrgDefinitionConfig;
      const migrate = family === "team" ? selectTeamAuthoringCandidate : selectOrgAuthoringCandidate;
      const source = await readOwnedDefinitionPackage({ ownershipRoot: root, packagePath: directory, family, validateConfig: migrate });
      const target = migrate(source.config);
      if (isDeepStrictEqual(source.config, target)) {
        this.add("SKIPPED_CURRENT_DEFINITION", configPath); return;
      }
      const outcome = await this.writer.write({ file: "definition", filePath: configPath, payload: target });
      if (outcome.outcome !== "committed") throw new Error(`Definition write did not commit (${outcome.outcome}:${outcome.stage}).`);
      const actual = JSON.parse(await fs.readFile(configPath, "utf8"));
      validate(actual);
      if (!isDeepStrictEqual(actual, target)) throw new Error("Definition reread differs from the selected authoring target.");
      this.add("MIGRATED_AUTHORING_CONFIG", configPath);
    } catch (error) { this.add("FAILED_DEFINITION", configPath, error); }
  }
  private add(kind: Disposition, file: string, error?: unknown): void {
    const entry = this.counts.get(kind) ?? { count: 0, examples: [] };
    entry.count++;
    entry.examples.push(`${file}${error ? `: ${error instanceof Error ? error.message : String(error)}` : ""}`);
    entry.examples.sort(); entry.examples.splice(5);
    this.counts.set(kind, entry);
  }
  private result(): AppDataMigrationExecutionResult {
    let migratedCount = 0, skippedCount = 0, failedCount = 0;
    const details: AppDataMigrationItemDetail[] = [];
    for (const [kind, entry] of this.counts) {
      const status = kind.startsWith("FAILED") ? "FAILED" : kind.startsWith("SKIPPED") ? "SKIPPED" : "MIGRATED";
      if (status === "FAILED") failedCount += entry.count; else if (status === "SKIPPED") skippedCount += entry.count; else migratedCount += entry.count;
      details.push({ itemId: kind, status, message: `Count: ${entry.count}. Examples: ${entry.examples.join(" | ")}` });
    }
    return { status: failedCount ? "FAILED" : "SUCCEEDED", summary: {
      scannedCount: migratedCount + skippedCount + failedCount, migratedCount, skippedCount, failedCount, details,
    }, errorMessage: failedCount ? `${failedCount} owned definition item(s) require correction and restart.` : null };
  }
}
