import type { CollaborationExecutionLocationService, LocatedCollaborationAgentExecution } from "../../agent-collaboration/execution/services/collaboration-execution-location-service.js";
import type { LocatedTeamAgentExecution } from "../../run-history/services/team-run-execution-tree-location-service.js";
import type {
  ContextFileFinalOwnerDescriptor,
  ContextFileResolvedFinalOwnerDescriptor,
} from "../domain/context-file-owner-types.js";

export class ContextFileOwnerResolver {
  constructor(
    input: {
      locations: {
        findAgent(input: { rootSubjectKind?: "agent_org"; rootRunId?: string; containingTeamRunId?: string; memberAddress?: string }): Promise<LocatedCollaborationAgentExecution | LocatedTeamAgentExecution | null>;
        findAgentSync(input: { rootSubjectKind?: "agent_org"; rootRunId?: string; containingTeamRunId?: string; memberAddress?: string }): LocatedCollaborationAgentExecution | LocatedTeamAgentExecution | null;
      };
    },
  ) {
    if (
      !input?.locations
      || typeof input.locations.findAgent !== "function"
      || typeof input.locations.findAgentSync !== "function"
    ) {
      throw new Error("ContextFileOwnerResolver locations are required.");
    }
    this.locations = input.locations;
  }

  private readonly locations: {
    findAgent(input: { rootSubjectKind?: "agent_org"; rootRunId?: string; containingTeamRunId?: string; memberAddress?: string }): Promise<LocatedCollaborationAgentExecution | LocatedTeamAgentExecution | null>;
    findAgentSync(input: { rootSubjectKind?: "agent_org"; rootRunId?: string; containingTeamRunId?: string; memberAddress?: string }): LocatedCollaborationAgentExecution | LocatedTeamAgentExecution | null;
  };

  async resolveFinalOwner(
    owner: ContextFileFinalOwnerDescriptor,
  ): Promise<ContextFileResolvedFinalOwnerDescriptor> {
    if (owner.kind === "agent_final") return owner;
    const location = await this.locations.findAgent({
      rootSubjectKind: owner.kind === "org_member_final" ? "agent_org" : undefined,
      rootRunId: owner.kind === "org_member_final" ? owner.orgRunId : undefined,
      containingTeamRunId: owner.kind === "team_member_final" ? owner.teamRunId : undefined,
      memberAddress: owner.memberAddress,
    });
    const rootKind = location && "rootSubjectKind" in location ? location.rootSubjectKind : "agent_team";
    const rootRunId = location && "rootRunId" in location ? location.rootRunId : location?.rootTeamRunId;
    if (!location || owner.kind === "team_member_final" && rootKind !== "agent_team"
      || owner.kind === "org_member_final" && (rootKind !== "agent_org" || rootRunId !== owner.orgRunId)) {
      throw this.notFound(owner.kind === "team_member_final" ? owner.teamRunId : owner.orgRunId, owner.memberAddress);
    }
    return this.result(owner, location);
  }

  resolveFinalOwnerSync(
    owner: ContextFileFinalOwnerDescriptor,
  ): ContextFileResolvedFinalOwnerDescriptor {
    if (owner.kind === "agent_final") return owner;
    const location = this.locations.findAgentSync({
      rootSubjectKind: owner.kind === "org_member_final" ? "agent_org" : undefined,
      rootRunId: owner.kind === "org_member_final" ? owner.orgRunId : undefined,
      containingTeamRunId: owner.kind === "team_member_final" ? owner.teamRunId : undefined,
      memberAddress: owner.memberAddress,
    });
    const rootKind = location && "rootSubjectKind" in location ? location.rootSubjectKind : "agent_team";
    const rootRunId = location && "rootRunId" in location ? location.rootRunId : location?.rootTeamRunId;
    if (!location || owner.kind === "team_member_final" && rootKind !== "agent_team"
      || owner.kind === "org_member_final" && (rootKind !== "agent_org" || rootRunId !== owner.orgRunId)) {
      throw this.notFound(owner.kind === "team_member_final" ? owner.teamRunId : owner.orgRunId, owner.memberAddress);
    }
    return this.result(owner, location);
  }

  private result(
    owner: Exclude<ContextFileFinalOwnerDescriptor, { kind: "agent_final" }>,
    location: LocatedCollaborationAgentExecution | LocatedTeamAgentExecution,
  ): ContextFileResolvedFinalOwnerDescriptor {
    if (owner.kind === "org_member_final") return {
      ...owner,
      rootSubjectKind: "agent_org",
      rootRunId: "rootRunId" in location ? location.rootRunId : location.rootTeamRunId,
      ancestorTeamRunIds: [...location.ancestorTeamRunIds],
      agentRunId: location.agentRunId,
      memoryDir: location.memoryDir,
    };
    return {
      ...owner,
      rootTeamRunId: "rootRunId" in location ? location.rootRunId : location.rootTeamRunId,
      ancestorTeamRunIds: [...location.ancestorTeamRunIds],
      agentRunId: location.agentRunId,
      memoryDir: location.memoryDir,
    };
  }

  private notFound(rootRunId: string, memberAddress: string): Error {
    return new Error(
      `Unable to resolve context-file owner member '${memberAddress}' for collaboration root '${rootRunId}'.`,
    );
  }
}
