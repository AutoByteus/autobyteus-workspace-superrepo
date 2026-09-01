import { SkillAccessMode } from "autobyteus-ts/agent/context/skill-access-mode.js";
import { GraphQLJSON } from "graphql-scalars";
import { Arg, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { getStudioAgentOrgRunService } from "../studio-application-api-services.js";

@InputType()
export class AgentOrgRootLaunchConfigurationInput {
  @Field(() => String) runtimeKind!: string;
  @Field(() => String) llmModelIdentifier!: string;
  @Field(() => GraphQLJSON, { nullable: true }) llmConfig?: Record<string, unknown> | null;
  @Field(() => Boolean) autoExecuteTools!: boolean;
  @Field(() => SkillAccessMode) skillAccessMode!: SkillAccessMode;
  @Field(() => String, { nullable: true }) workspaceRootPath?: string | null;
}

@InputType()
export class AgentOrgPlacementLaunchConfigurationInput {
  @Field(() => String, { nullable: true }) runtimeKind?: string;
  @Field(() => String, { nullable: true }) llmModelIdentifier?: string;
  @Field(() => GraphQLJSON, { nullable: true }) llmConfig?: Record<string, unknown> | null;
  @Field(() => Boolean, { nullable: true }) autoExecuteTools?: boolean;
  @Field(() => SkillAccessMode, { nullable: true }) skillAccessMode?: SkillAccessMode;
  @Field(() => String, { nullable: true }) workspaceRootPath?: string | null;
}

@InputType()
export class AgentOrgPlacementLaunchOverrideInput {
  @Field(() => String) address!: string;
  @Field(() => AgentOrgPlacementLaunchConfigurationInput)
  configuration!: AgentOrgPlacementLaunchConfigurationInput;
}

@InputType()
export class CreateAgentOrgRunInput {
  @Field(() => String) agentOrgDefinitionId!: string;
  @Field(() => AgentOrgRootLaunchConfigurationInput)
  rootConfiguration!: AgentOrgRootLaunchConfigurationInput;
  @Field(() => [AgentOrgPlacementLaunchOverrideInput], { nullable: true })
  teamOverrides?: AgentOrgPlacementLaunchOverrideInput[] | null;
  @Field(() => [AgentOrgPlacementLaunchOverrideInput], { nullable: true })
  agentOverrides?: AgentOrgPlacementLaunchOverrideInput[] | null;
}

@ObjectType()
export class AgentOrgRunMutationResult {
  @Field(() => Boolean) success!: boolean;
  @Field(() => String) message!: string;
  @Field(() => String, { nullable: true }) agentOrgRunId?: string | null;
}

@Resolver()
export class AgentOrgRunResolver {
  private readonly service = getStudioAgentOrgRunService();

  @Mutation(() => AgentOrgRunMutationResult)
  async createAgentOrgRun(
    @Arg("input", () => CreateAgentOrgRunInput) input: CreateAgentOrgRunInput,
  ): Promise<AgentOrgRunMutationResult> {
    try {
      const run = await this.service.create(input);
      return { success: true, message: "Agent organization run created successfully.", agentOrgRunId: run.orgRunId };
    } catch (error) {
      return { success: false, message: message(error), agentOrgRunId: null };
    }
  }

  @Mutation(() => AgentOrgRunMutationResult)
  async restoreAgentOrgRun(
    @Arg("agentOrgRunId", () => String) agentOrgRunId: string,
  ): Promise<AgentOrgRunMutationResult> {
    try {
      const run = await this.service.restore(agentOrgRunId);
      return { success: true, message: "Agent organization run restored successfully.", agentOrgRunId: run.orgRunId };
    } catch (error) {
      return { success: false, message: message(error), agentOrgRunId: null };
    }
  }

  @Mutation(() => AgentOrgRunMutationResult)
  async terminateAgentOrgRun(
    @Arg("agentOrgRunId", () => String) agentOrgRunId: string,
  ): Promise<AgentOrgRunMutationResult> {
    try {
      const success = await this.service.terminate(agentOrgRunId);
      return {
        success,
        message: success ? "Agent organization run terminated successfully." : "Agent organization run not found.",
        agentOrgRunId: success ? agentOrgRunId : null,
      };
    } catch (error) {
      return { success: false, message: message(error), agentOrgRunId: null };
    }
  }
}

const message = (error: unknown): string => error instanceof Error ? error.message : String(error);
