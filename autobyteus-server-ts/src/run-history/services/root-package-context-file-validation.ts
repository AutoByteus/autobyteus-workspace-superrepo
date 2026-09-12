import fs from "node:fs/promises";
import path from "node:path";
import { AgentMemoryLayout } from "../../agent-memory/store/agent-memory-layout.js";
import { AgentOrgExecutionIndex } from "../../agent-org-execution/services/agent-org-execution-index.js";
import { TeamExecutionIndex } from "../../agent-team-execution/services/team-execution-index.js";
import { assertStoredFilename, parseFinalContextFileOwnerDescriptor } from "../../context-files/domain/context-file-owner-types.js";
import { listContextFileRecordSources, transformContextFileRecordLocators } from "../../context-files/services/context-file-record-locators.js";
import { validateAgentOrgRunExecutionTreePayload } from "../store/agent-org-run-execution-tree-schema.js";
import { validateTeamRunExecutionTreePayload } from "../store/team-run-execution-tree-schema.js";
import { getAgentOrgRunExecutionTreePath } from "../store/agent-org-run-execution-tree-path.js";
import { getTeamRunExecutionTreePath } from "../store/team-run-execution-tree-path.js";

type Family = "agent_team" | "agent_org";
const json = async (file: string) => JSON.parse(await fs.readFile(file, "utf8"));

/** Read-only current package check during readiness construction, before the catalog is published.
 * The supplied candidates are the same strict package candidates being validated, not a second cache.
 */
export class RootPackageContextFileValidation {
  private readonly layout: AgentMemoryLayout;
  constructor(memoryDir: string, private readonly candidates: { admittedTeams: Set<string>; admittedOrgs: Set<string> }, private readonly baseUrl: () => string) {
    this.layout = new AgentMemoryLayout(memoryDir);
  }
  async validate(family: Family, id: string): Promise<void> {
    const directory = this.rootDirectory(family, id);
    let agentDirectories: string[];
    if (family === "agent_org") {
      const index = await this.orgIndex(id);
      agentDirectories = index.listAgents().map((agent) => this.layout.getRootedAgentRunDirPath(index.getPhysicalScopeForAgent(agent.agentRunId), agent.agentRunId));
    } else {
      const index = await this.teamIndex(id);
      agentDirectories = this.teamAgents(index).map((agent) => this.layout.getRootedAgentRunDirPath(index.getTeamRunPhysicalScope(agent.containingTeamRunId), agent.agentRunId));
    }
    const files = await listContextFileRecordSources({ rootDirectories: [directory], agentDirectories });
    for (const source of files) {
      const text = await fs.readFile(source.filePath, "utf8");
      await transformContextFileRecordLocators(source, text, async (uri, field) => {
        try { await this.validateLocator(uri); }
        catch (error) { throw new Error(`${source.filePath}:${field}: ${error instanceof Error ? error.message : String(error)}`); }
        return uri;
      });
    }
  }
  private async validateLocator(uri: string): Promise<void> {
    let pathname = uri.startsWith("rest/") ? `/${uri}` : uri;
    if (/^https?:\/\//.test(uri)) {
      const url = new URL(uri);
      if (url.origin !== new URL(this.baseUrl()).origin && !["localhost", "127.0.0.1", "::1"].includes(url.hostname)) return;
      pathname = url.pathname;
    } else pathname = pathname.split(/[?#]/)[0]!;
    const org = pathname.match(/^\/rest\/agent-org-runs\/([^/]+)\/agent-runs\/([^/]+)\/context-files\/([^/]+)$/);
    const team = pathname.match(/^\/rest\/team-runs\/([^/]+)\/members\/([^/]+)\/context-files\/([^/]+)$/);
    if (!org && !team) {
      if (pathname.startsWith("/rest/agent-org-runs/") || pathname.startsWith("/rest/drafts/agent-org-runs/")) throw new Error("Not a current final Org attachment locator.");
      return;
    }
    const parts = (org ?? team)!.slice(1).map(decodeURIComponent);
    const filename = assertStoredFilename(parts[2]!);
    let directories: string[];
    if (org) {
      const owner = parseFinalContextFileOwnerDescriptor({ kind: "org_member_final", orgRunId: parts[0], agentRunId: parts[1] });
      if (owner.kind !== "org_member_final" || !this.candidates.admittedOrgs.has(owner.orgRunId)) throw new Error("Org attachment root is not current/admissible.");
      const index = await this.orgIndex(owner.orgRunId);
      directories = [this.layout.getRootedAgentRunDirPath(index.getPhysicalScopeForAgent(owner.agentRunId), owner.agentRunId)];
    } else {
      const owner = parseFinalContextFileOwnerDescriptor({ kind: "team_member_final", teamRunId: parts[0], memberAddress: parts[1] });
      if (owner.kind !== "team_member_final") throw new Error("Expected Team attachment owner.");
      // Team attachments retain their established contract. Only a family-miscorrelated
      // reference to a current Org is part of this cutover's readiness boundary.
      for (const id of this.candidates.admittedOrgs) {
        const index = await this.orgIndex(id);
        if (id === owner.teamRunId || index.getTeam(owner.teamRunId)) throw new Error("Team locator refers to an Org-owned execution.");
      }
      return;
    }
    if (directories.length !== 1) throw new Error("Attachment must resolve to one exact current execution.");
    if (!(await fs.stat(path.join(directories[0]!, "context_files", filename))).isFile()) throw new Error("Attachment bytes are unavailable.");
  }
  private rootDirectory(family: Family, id: string): string {
    return family === "agent_org" ? this.layout.getOrgDirPath(id) : this.layout.getTeamDirPath({ rootTeamRunId: id, ancestorTeamRunIds: [] });
  }
  private async orgIndex(id: string): Promise<AgentOrgExecutionIndex> {
    return new AgentOrgExecutionIndex(validateAgentOrgRunExecutionTreePayload(await json(getAgentOrgRunExecutionTreePath(this.rootDirectory("agent_org", id))), id));
  }
  private async teamIndex(id: string): Promise<TeamExecutionIndex> {
    return new TeamExecutionIndex(validateTeamRunExecutionTreePayload(await json(getTeamRunExecutionTreePath(this.rootDirectory("agent_team", id))), id));
  }
  private teamAgents(index: TeamExecutionIndex) {
    const output: ReturnType<TeamExecutionIndex["listDirectAgentExecutions"]>[number][] = [];
    const visit = (id: string) => { output.push(...index.listDirectAgentExecutions(id)); index.listDirectTeamExecutions(id).forEach((team) => visit(team.teamRunId)); };
    visit(index.rootTeamRunId);
    return output;
  }
}
