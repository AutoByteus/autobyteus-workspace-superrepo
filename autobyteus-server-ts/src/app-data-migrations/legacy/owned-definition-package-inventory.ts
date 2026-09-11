import fs from "node:fs/promises";
import path from "node:path";
import { DefinitionPackageTransaction } from "../../collaboration-definition-admission/providers/definition-package-transaction.js";
import { parseTeamMd } from "../../agent-team-definition/utils/team-md-parser.js";
import { parseOrgMd } from "../../agent-org-definition/utils/org-md-parser.js";

const journalSuffix = ".definition-transaction.json";
const missing = (error: unknown): boolean => (error as NodeJS.ErrnoException)?.code === "ENOENT";

/** Migration-only physical ownership checks; never follow a linked external package. */
export const assertOwnedDefinitionPath = async (ownershipRoot: string, target: string): Promise<void> => {
  const root = path.resolve(ownershipRoot), resolved = path.resolve(target);
  const relative = path.relative(root, resolved);
  if (relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) throw new Error(`Definition path '${target}' escapes owned root.`);
  let current = root;
  for (const part of ["", ...relative.split(path.sep).filter(Boolean)]) {
    current = part ? path.join(current, part) : current;
    try {
      if ((await fs.lstat(current)).isSymbolicLink()) throw new Error(`Definition path '${current}' is a read-only link, not owned data.`);
    } catch (error) { if (!missing(error)) throw error; }
  }
};

/** Direct packages plus canonical names of ordinary interrupted authoring transactions. */
export const listOwnedDefinitionPackages = async (ownershipRoot: string, directory = ownershipRoot): Promise<readonly string[]> => {
  await assertOwnedDefinitionPath(ownershipRoot, directory);
  let entries;
  try { entries = await fs.readdir(directory, { withFileTypes: true }); }
  catch (error) { if (missing(error)) return []; throw error; }
  const names = new Set<string>();
  for (const entry of entries) {
    if (entry.name.endsWith(journalSuffix)) names.add(entry.name.slice(0, -journalSuffix.length));
    else if ((entry.isDirectory() || entry.isSymbolicLink()) && !/\.(stage|backup)\./.test(entry.name)) names.add(entry.name);
  }
  return [...names].sort().map((name) => path.join(directory, name));
};

/** Reuse ordinary-authoring recovery before migration classification, never its commit path. */
export const readOwnedDefinitionPackage = async (input: Readonly<{
  ownershipRoot: string;
  packagePath: string;
  family: "team" | "org";
  validateConfig(value: unknown): unknown;
}>): Promise<Readonly<{ config: unknown; markdown: string }>> => {
  const canonical = path.resolve(input.packagePath);
  await assertOwnedDefinitionPath(input.ownershipRoot, canonical);
  const journalPath = `${canonical}${journalSuffix}`;
  await assertOwnedDefinitionPath(input.ownershipRoot, journalPath);
  try {
    const journal = JSON.parse(await fs.readFile(journalPath, "utf8"));
    if (journal.canonicalPath !== canonical) throw new Error(`Definition transaction '${journalPath}' has a different canonical path.`);
    for (const [key, suffix] of [["stagePath", ".stage."], ["backupPath", ".backup."]] as const) {
      const value = journal[key];
      if (typeof value !== "string" || !value.startsWith(`${canonical}${suffix}`) || path.dirname(value) !== path.dirname(canonical)) {
        throw new Error(`Definition transaction '${journalPath}' has an invalid ${key}.`);
      }
      await assertOwnedDefinitionPath(input.ownershipRoot, value);
    }
  } catch (error) { if (!missing(error)) throw error; }
  const configName = `${input.family}-config.json`, mdName = `${input.family}.md`;
  const files = await new DefinitionPackageTransaction().read({
    packagePath: canonical, fileNames: [configName, mdName],
    validatePackage: async (directory) => {
      const configPath = path.join(directory, configName), mdPath = path.join(directory, mdName);
      await assertOwnedDefinitionPath(input.ownershipRoot, configPath);
      await assertOwnedDefinitionPath(input.ownershipRoot, mdPath);
      const markdown = await fs.readFile(mdPath, "utf8");
      if (input.family === "team") parseTeamMd(markdown, mdPath); else parseOrgMd(markdown, mdPath);
      input.validateConfig(JSON.parse(await fs.readFile(configPath, "utf8")));
    },
  });
  if (!files) throw new Error(`Owned ${input.family} definition '${canonical}' is unavailable.`);
  return Object.freeze({ config: JSON.parse(files.files[configName]!), markdown: files.files[mdName]! });
};
