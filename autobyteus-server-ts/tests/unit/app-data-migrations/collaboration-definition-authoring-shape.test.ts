import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { AppConfig } from "../../../src/config/app-config.js";
import { AppDataMigrationRegistry } from "../../../src/app-data-migrations/app-data-migration-registry.js";
import { AppDataMigrationRunner } from "../../../src/app-data-migrations/app-data-migration-runner.js";
import { AppDataMigrationRecordRepository } from "../../../src/app-data-migrations/repositories/app-data-migration-record-repository.js";
import { CollaborationDefinitionAuthoringShapeAppDataMigration, COLLABORATION_DEFINITION_AUTHORING_SHAPE_MIGRATION_ID as AUTHORING } from "../../../src/app-data-migrations/migrations/collaboration-definition-authoring-shape-app-data-migration.js";
import { AgentOrgFlatTeamFamiliesV1AppDataMigration, AGENT_ORG_FLAT_TEAM_FAMILIES_V1_MIGRATION_ID as FAMILY } from "../../../src/app-data-migrations/migrations/agent-org-flat-team-families-v1/agent-org-flat-team-families-v1-app-data-migration.js";
import { TEAM_RUN_EXECUTION_TREE_V2_MIGRATION_ID as PREREQUISITE } from "../../../src/app-data-migrations/migrations/team-run-execution-tree-v2-app-data-migration.js";
import { AtomicRunPackageFileCommitWriter } from "../../../src/run-history/store/atomic-run-package-file-commit-writer.js";
import { selectOrgAuthoringCandidate, selectTeamAuthoringCandidate } from "../../../src/app-data-migrations/legacy/collaboration-definition-authoring-transition.js";

const roots: string[] = [], clients: PrismaClient[] = [];
afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(clients.splice(0).map((c) => c.$disconnect()));
  await Promise.all(roots.splice(0).map((p) => fs.rm(p, { recursive: true, force: true })));
});
const team = () => ({ coordinatorMemberName: "lead", members: [{ memberName: "lead", ref: "unchanged-agent", refScope: "shared" }],
  handoffs: [{ from: "/lead", to: "/lead", rules: ["Original prose"] }], avatarUrl: null,
  defaultLaunchConfig: { llmModelIdentifier: "model", runtimeKind: "codex_app_server", llmConfig: { temperature: 0, nested: [null, false, "exact"] } } });
const org = () => ({ members: [{ memberName: "team", ref: "unavailable-external-team", refType: "agent_team", refScope: "shared" }],
  handoffs: [], avatarUrl: null, defaultLaunchConfig: null });
const markdown = "---\nname: Authored name\ndescription: Exact description\n---\n\nInstructions stay bytewise.\n";
const json = (data: unknown) => JSON.stringify(data, null, 2) + "\n";
const write = async (dir: string, family: "team" | "org", data: unknown) => {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${family}-config.json`), json(data));
  await fs.writeFile(path.join(dir, `${family}.md`), markdown);
  await fs.writeFile(path.join(dir, "asset.bin"), Buffer.from([0, 255, 4]));
  return path.join(dir, `${family}-config.json`);
};
const environment = async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "authoring-migration-")); roots.push(root);
  const teams = path.join(root, "data", "agent-teams"), orgs = path.join(root, "data", "agent-orgs"), memory = path.join(root, "memory");
  const config = { getAgentTeamsDir: () => teams, getAgentOrgsDir: () => orgs } as AppConfig;
  return { root, teams, orgs, memory, config, migration: (writer?: AtomicRunPackageFileCommitWriter) => new CollaborationDefinitionAuthoringShapeAppDataMigration(config, writer) };
};
const read = async (file: string) => JSON.parse(await fs.readFile(file, "utf8"));
const current = async (file: string) => { const value = await read(file); delete value.schemaVersion; await fs.writeFile(file, json(value)); };

it("removes only the key across both families and unreferenced owned Teams, with current zero-write and runtime/external preservation", async () => {
  const env = await environment();
  const teamDir = path.join(env.teams, "team"), orgDir = path.join(env.orgs, "org"), child = path.join(orgDir, "agent-teams", "unused");
  const files = [await write(teamDir, "team", { schemaVersion: 2, ...team() }), await write(orgDir, "org", { schemaVersion: 1, ...org() }), await write(child, "team", { schemaVersion: 2, ...team() })];
  const ready = await write(path.join(env.teams, "current"), "team", team());
  const readyBytes = await fs.readFile(ready), readyStat = await fs.stat(ready);
  const runtime = path.join(env.memory, "team.json"); await fs.mkdir(env.memory); await fs.writeFile(runtime, json({ schemaVersion: 2, rootTeam: "untouched" }));
  const external = await write(path.join(env.root, "linked-external"), "org", { schemaVersion: 1, ...org() });
  const externalBytes = await fs.readFile(external), runtimeBytes = await fs.readFile(runtime);
  const writer = new AtomicRunPackageFileCommitWriter(), spy = vi.spyOn(writer, "write");
  const result = await env.migration(writer).execute();
  expect(result).toMatchObject({ status: "SUCCEEDED", summary: { migratedCount: 3, skippedCount: 1, failedCount: 0 } });
  expect(spy.mock.calls.map(([value]) => value.filePath)).toEqual(files);
  expect(await read(files[0]!)).toEqual(team()); expect(await read(files[1]!)).toEqual(org()); expect(await read(files[2]!)).toEqual(team());
  for (const [dir, family] of [[teamDir, "team"], [orgDir, "org"], [child, "team"]]) {
    expect(await fs.readFile(path.join(dir!, `${family}.md`), "utf8")).toBe(markdown);
    expect(await fs.readFile(path.join(dir!, "asset.bin"))).toEqual(Buffer.from([0, 255, 4]));
  }
  expect(await fs.readFile(ready)).toEqual(readyBytes); expect((await fs.stat(ready)).mtimeMs).toBe(readyStat.mtimeMs);
  expect(await fs.readFile(external)).toEqual(externalBytes); expect(await fs.readFile(runtime)).toEqual(runtimeBytes);
  spy.mockClear(); expect((await env.migration(writer).execute()).status).toBe("SUCCEEDED"); expect(spy).not.toHaveBeenCalled();
});

it("does not hide physical children behind an invalid parent and bounds failure diagnostics", async () => {
  const env = await environment(), dir = path.join(env.orgs, "invalid");
  const parent = await write(dir, "org", { ...org(), schemaVersion: "1" });
  const child = await write(path.join(dir, "agent-teams", "unreferenced"), "team", { schemaVersion: 2, ...team() });
  const bytes = await fs.readFile(parent);
  for (let i = 0; i < 7; i++) await write(path.join(env.teams, `invalid-${i}`), "team", { ...team(), schemaVersion: 1 });
  const result = await env.migration().execute();
  expect(result).toMatchObject({ status: "FAILED", summary: { failedCount: 8, migratedCount: 1 } });
  expect(await read(child)).toEqual(team()); expect(await fs.readFile(parent)).toEqual(bytes);
  expect(result.summary.details.find((d) => d.itemId === "FAILED_DEFINITION")?.message.match(/(?:team|org)-config.json/g)).toHaveLength(5);
});

it("recovers ordinary-authoring canonical journals before classifying both root and owned-child definitions", async () => {
  const env = await environment(), canonical = path.join(env.orgs, "org");
  const stage = `${canonical}.stage.1.fixture`, backup = `${canonical}.backup.1.fixture`;
  await write(stage, "org", { schemaVersion: 1, ...org() });
  const child = path.join(stage, "agent-teams", "child");
  await write(`${child}.backup.1.fixture`, "team", { schemaVersion: 2, ...team() });
  // This child journal is relocated with the parent's publication; ordinary transactions
  // record canonical paths, never the parent's temporary path.
  const canonicalChild = path.join(canonical, "agent-teams", "child");
  await fs.writeFile(`${child}.definition-transaction.json`, json({ schemaVersion: 1, canonicalPath: canonicalChild,
    stagePath: `${canonicalChild}.stage.1.fixture`, backupPath: `${canonicalChild}.backup.1.fixture` }));
  await fs.writeFile(`${canonical}.definition-transaction.json`, json({ schemaVersion: 1, canonicalPath: canonical, stagePath: stage, backupPath: backup }));
  const result = await env.migration().execute();
  expect(result).toMatchObject({ status: "SUCCEEDED", summary: { migratedCount: 2 } });
  expect(await read(path.join(canonicalChild, "team-config.json"))).toEqual(team());
  expect(await fs.readdir(env.orgs)).toEqual(["org"]);
  expect(await fs.readdir(path.join(canonical, "agent-teams"))).toEqual(["child"]);
});

it("keeps linked sources read-only and reports a present unreadable inventory instead of empty success", async () => {
  const env = await environment(); await fs.mkdir(env.teams, { recursive: true });
  const outside = path.join(env.root, "external"), file = await write(outside, "team", { schemaVersion: 2, ...team() });
  await fs.symlink(outside, path.join(env.teams, "linked"));
  await fs.writeFile(env.orgs, "not a directory"); const before = await fs.readFile(file);
  const result = await env.migration().execute();
  expect(result).toMatchObject({ status: "FAILED", summary: { failedCount: 2, migratedCount: 0 } });
  expect(result.summary.details.map((d) => d.itemId)).toContain("FAILED_INVENTORY");
  expect(await fs.readFile(file)).toEqual(before);
});

it.each(["not_renamed", "indeterminate", "reread_mismatch", "after_commit"])("fails %s and resumes through an ordinary rerun without replaying successful files", async (failure) => {
  const env = await environment(), file = await write(path.join(env.teams, "team"), "team", { schemaVersion: 2, ...team() });
  const writer = new AtomicRunPackageFileCommitWriter(), physical = writer.write.bind(writer);
  vi.spyOn(writer, "write").mockImplementationOnce(async (input) => {
    if (failure === "not_renamed") return { outcome: "not_renamed", file: input.file, stage: "write_temp", cause: new Error("held write") };
    if (failure === "indeterminate") { await physical(input); return { outcome: "renamed_finalization_indeterminate", file: input.file, stage: "sync_directory", cause: new Error("uncertain sync") }; }
    if (failure === "after_commit") { await physical(input); throw new Error("interrupted after commit"); }
    const outcome = await physical(input); await fs.writeFile(input.filePath, json({ ...team(), avatarUrl: "changed" })); return outcome;
  });
  expect((await env.migration(writer).execute()).status).toBe("FAILED");
  if (failure === "reread_mismatch") await fs.writeFile(file, json({ schemaVersion: 2, ...team() }));
  const retryWriter = new AtomicRunPackageFileCommitWriter(), retrySpy = vi.spyOn(retryWriter, "write");
  expect((await env.migration(retryWriter).execute()).status).toBe("SUCCEEDED"); expect(await read(file)).toEqual(team());
  if (failure === "after_commit" || failure === "indeterminate") expect(retrySpy).not.toHaveBeenCalled();
});

const runnerFor = async (env: Awaited<ReturnType<typeof environment>>) => {
  const db = new PrismaClient({ datasources: { db: { url: `file:${path.join(env.root, "records.sqlite")}` } } }); clients.push(db);
  // Real current repository over an isolated SQLite database using the released record DDL.
  const ddl = (await fs.readFile(path.resolve("prisma/migrations/20260517090000_add_app_data_migration_records/migration.sql"), "utf8")).replaceAll('"summary_json"', '"summary"');
  for (const statement of ddl.split(";").filter((s) => s.trim())) await db.$executeRawUnsafe(statement);
  const repository = new AppDataMigrationRecordRepository(db);
  const prerequisite = { id: PREREQUISITE, displayName: "Current runtime prerequisite", description: "already current", requiredOnStartup: true,
    execute: async () => ({ status: "SUCCEEDED" as const, summary: { scannedCount: 0, migratedCount: 0, skippedCount: 0, failedCount: 0, details: [] }, errorMessage: null }) };
  const family = new AgentOrgFlatTeamFamiliesV1AppDataMigration(env.memory, env.config), authoring = env.migration();
  const registry = new AppDataMigrationRegistry([prerequisite, family, authoring]);
  const runner = new AppDataMigrationRunner(registry, repository, { logsDir: path.join(env.root, "logs") });
  return { runner, registry, repository, family };
};

it.each(["completed", "pending", "failed-runtime", "stale-running"])("uses real file/registry/runner ordering for %s family without an authoring prerequisite", async (state) => {
  const env = await environment(), file = await write(path.join(env.teams, "team"), "team", state === "pending"
    ? { ...team(), members: team().members.map((m) => ({ ...m, refType: "agent" })) }
    : { schemaVersion: 2, ...team() });
  const { runner, repository, family } = await runnerFor(env);
  let completed;
  if (state === "completed") {
    await repository.markRunning({ migrationId: FAMILY, displayName: family.displayName, startedAt: new Date() });
    completed = await repository.complete({ migrationId: FAMILY, displayName: family.displayName, status: "SUCCEEDED", completedAt: new Date(), summary: "Previously completed", errorMessage: null, logPath: null });
  }
  if (state === "failed-runtime") {
    const invalid = path.join(env.memory, "agent_teams", "invalid"); await fs.mkdir(invalid, { recursive: true });
    await fs.writeFile(path.join(invalid, "team_run_execution_tree.json"), "{}");
  }
  if (state === "stale-running") await repository.markRunning({ migrationId: AUTHORING, displayName: "Interrupted authoring",
    startedAt: new Date(Date.now() - 16 * 60 * 1000) });
  const familySpy = vi.spyOn(family, "execute"), statuses = await runner.runPending();
  expect(statuses.find((s) => s.migrationId === AUTHORING)).toMatchObject({ status: "SUCCEEDED" });
  expect(await read(file)).toEqual(team());
  if (completed) { expect(familySpy).not.toHaveBeenCalled(); expect(await repository.getRecord(FAMILY)).toEqual(completed); }
  else expect(familySpy).toHaveBeenCalledOnce();
  if (state === "failed-runtime") expect(statuses.find((s) => s.migrationId === FAMILY)).toMatchObject({ status: "FAILED" });
  const before = await fs.readFile(file); await runner.runPending(); expect(await fs.readFile(file)).toEqual(before);
  expect((await repository.getRecord(AUTHORING))?.attempts).toBe(state === "stale-running" ? 2 : 1);
  await expect(runner.runMigration(AUTHORING)).rejects.toThrow(/restart/i);
});

it("keeps prior validators migration-only and default registry order explicit", () => {
  expect(selectTeamAuthoringCandidate({ schemaVersion: 2, ...team() })).toEqual(team());
  expect(selectOrgAuthoringCandidate({ schemaVersion: 1, ...org() })).toEqual(org());
  expect(() => selectOrgAuthoringCandidate({ schemaVersion: "1", ...org() })).toThrow();
  const list = new AppDataMigrationRegistry().listDefinitions(), index = list.findIndex((d) => d.id === FAMILY);
  expect(list[index + 1]?.id).toBe(AUTHORING); expect(list[index + 1]?.prerequisiteMigrationIds).toBeUndefined();
});


it.each(["version-only", "scope-only", "both", "current"])("commits exactly the final authoring candidate for %s without normalizing other JSON", async (variant) => {
  const env = await environment();
  const value = { ...org(), members: [
    { memberName: "direct", ref: "agent-org-owned-agent-opaque", refType: "agent", refScope: variant === "scope-only" || variant === "both" ? "agent_org_owned" : "org_local" },
    { memberName: "team", ref: "agent-org-owned-team-opaque", refType: "agent_team", refScope: "org_local" },
  ], handoffs: [{ from: "/direct", to: "/team", rules: ["Exact  user prose", "Next"] }],
    defaultLaunchConfig: team().defaultLaunchConfig };
  const raw = variant === "version-only" || variant === "both" ? { schemaVersion: 1, ...value } : value;
  const original = structuredClone(raw), expected = { ...value, members: value.members.map((m) => ({ ...m, refScope: "org_local" })) };
  expect(selectOrgAuthoringCandidate(raw)).toEqual(expected); expect(raw).toEqual(original);
  const file = await write(path.join(env.orgs, "org"), "org", raw), before = await fs.readFile(file);
  const writer = new AtomicRunPackageFileCommitWriter(), spy = vi.spyOn(writer, "write");
  expect((await env.migration(writer).execute()).status).toBe("SUCCEEDED");
  expect(spy).toHaveBeenCalledTimes(variant === "current" ? 0 : 1);
  expect(await read(file)).toEqual(expected);
  if (variant === "current") expect(await fs.readFile(file)).toEqual(before);
  spy.mockClear(); expect((await env.migration(writer).execute()).status).toBe("SUCCEEDED"); expect(spy).not.toHaveBeenCalled();
});

it.each(["unknown", "team_local", "AGENT_ORG_OWNED", " org_local", null])("rejects non-authorized Org scope %j without writes", async (refScope) => {
  const env = await environment(), raw = { ...org(), members: [{ ...org().members[0], refScope }] };
  const file = await write(path.join(env.orgs, "invalid"), "org", raw), before = await fs.readFile(file);
  const writer = new AtomicRunPackageFileCommitWriter(), spy = vi.spyOn(writer, "write");
  expect((await env.migration(writer).execute()).status).toBe("FAILED"); expect(spy).not.toHaveBeenCalled(); expect(await fs.readFile(file)).toEqual(before);
});


it("runs the complete production registry on a fresh pre-ticket data root, directly producing final authored configs", async () => {
  const { appConfigProvider } = await import("../../../src/config/app-config-provider.js");
  const env = await environment();
  const config = new AppConfig({ appDataDir: env.root });
  // Production AppConfig getters create their owned roots before registry execution.
  await fs.mkdir(env.orgs, { recursive: true });
  vi.spyOn(config, "getAgentTeamsDir").mockReturnValue(env.teams);
  vi.spyOn(config, "getAgentOrgsDir").mockReturnValue(env.orgs);
  vi.spyOn(config, "getMemoryDir").mockReturnValue(env.memory);
  vi.spyOn(config, "getOperationalDatabaseUrl").mockReturnValue(process.env.DATABASE_URL!);
  vi.spyOn(config, "getAdditionalAgentPackageRoots").mockReturnValue([]);
  vi.spyOn(config, "getAdditionalApplicationPackageRoots").mockReturnValue([]);
  vi.spyOn(appConfigProvider, "config", "get").mockReturnValue(config);
  const legacyFlat = { ...team(), members: team().members.map((m) => ({ ...m, refType: "agent" })) };
  const flat = await write(path.join(env.teams, "flat"), "team", legacyFlat);
  const legacyOrg = { ...legacyFlat, coordinatorMemberName: "direct", members: [
    { memberName: "direct", ref: "original-agent", refType: "agent", refScope: "shared" },
    { memberName: "team", ref: "child", refType: "agent_team", refScope: "team_local" },
  ], handoffs: [] };
  const source = path.join(env.teams, "mixed"); await write(source, "team", legacyOrg);
  await write(path.join(source, "agent-teams", "child"), "team", legacyFlat);
  await write(path.join(source, "agent-teams", "unreferenced"), "team", legacyFlat);
  const external = await write(path.join(env.root, "external"), "org", { schemaVersion: 1, ...org() });
  const externalBytes = await fs.readFile(external);
  const { repository } = await runnerFor(env);
  const registry = new AppDataMigrationRegistry();
  const runner = new AppDataMigrationRunner(registry, repository, { logsDir: path.join(env.root, "production-logs") });
  const results = await runner.runPending();
  expect(results.map((result) => result.migrationId)).toEqual(registry.listDefinitions().map((definition) => definition.id));
  for (const id of [PREREQUISITE, FAMILY, AUTHORING]) { const result = results.find((result) => result.migrationId === id)!; expect(result, result.logPath ? await fs.readFile(result.logPath, "utf8") : result.errorMessage ?? "").toMatchObject({ status: "SUCCEEDED" }); }
  expect(await read(flat)).toEqual(team());
  const targetDir = path.join(env.orgs, "mixed"), target = await read(path.join(targetDir, "org-config.json"));
  expect(target).not.toHaveProperty("schemaVersion"); expect(target.members[1]).toMatchObject({ memberName: "team", refScope: "org_local" });
  expect(target.members[1].ref).toMatch(/^agent-org-owned-/);
  for (const child of ["child", "unreferenced"]) expect(await read(path.join(targetDir, "agent-teams", child, "team-config.json"))).toEqual(team());
  await expect(fs.access(source)).rejects.toMatchObject({ code: "ENOENT" });
  expect(await fs.readFile(external)).toEqual(externalBytes);
  const before = await repository.getRecord(FAMILY), finalBytes = await fs.readFile(path.join(targetDir, "org-config.json"));
  await runner.runPending(); expect(await repository.getRecord(FAMILY)).toEqual(before);
  expect(await fs.readFile(path.join(targetDir, "org-config.json"))).toEqual(finalBytes);
});
