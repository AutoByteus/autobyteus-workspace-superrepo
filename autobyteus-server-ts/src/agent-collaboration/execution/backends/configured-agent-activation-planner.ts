import { AgentRunConfig } from "../../../agent-execution/domain/agent-run-config.js";
import { AgentRunContext } from "../../../agent-execution/domain/agent-run-context.js";
import type { AgentRunActivationCandidate } from "../../../agent-execution/services/agent-run-activation-candidate.js";
import { AgentRunManager } from "../../../agent-execution/services/agent-run-manager.js";
import { AgentRunActivationError, isAgentRunActivationQuarantineError } from "../../../agent-execution/errors.js";
import { isExternalProviderRuntimeKind } from "../../../runtime-management/runtime-kind-enum.js";
import {
  getAgentConversationActivityInspector,
  type AgentConversationActivityInspector,
} from "../../../agent-memory/services/agent-conversation-activity-inspector.js";
import {
  CollaborationAgentActivationError,
  type ConfiguredAgentActivationMode,
} from "../domain/configured-agent-execution.js";
import {
  createCollaborationAgentPlatformBinding,
  type CollaborationAgentPlatformBinding,
} from "../domain/collaboration-agent-platform-binding.js";
import type { CollaborationMemberExecutionIdentity } from "../domain/root-execution-identity.js";

export class ConfiguredAgentActivationPlanner {
  constructor(private readonly input: {
    identity: CollaborationMemberExecutionIdentity;
    mode: ConfiguredAgentActivationMode;
    platformAgentRunId: string | null;
    manager?: AgentRunManager;
    activityInspector?: AgentConversationActivityInspector;
  }) {}

  async prepare(config: AgentRunConfig): Promise<Readonly<{
    candidate: AgentRunActivationCandidate;
    binding: CollaborationAgentPlatformBinding | null;
  }>> {
    const plan = this.resolvePlan(config);
    const candidate = await this.prepareCandidate(plan, config);
    return Object.freeze({ candidate, binding: this.createExternalBinding(candidate) });
  }

  isRetrySafe(error: unknown): boolean {
    return !(error instanceof CollaborationAgentActivationError && error.indeterminate)
      && !isAgentRunActivationQuarantineError(error);
  }

  private resolvePlan(config: AgentRunConfig): ActivationPlan {
    const external = isExternalProviderRuntimeKind(config.runtimeKind);
    if (this.input.mode === "fresh") {
      if (external) this.assertNoPriorConversationActivity(config);
      return Object.freeze({ kind: "new" });
    }
    if (external) {
      const platformAgentRunId = this.input.platformAgentRunId?.trim() || null;
      if (platformAgentRunId) return Object.freeze({ kind: "restore_external", platformAgentRunId });
      this.assertNoPriorConversationActivity(config);
      return Object.freeze({ kind: "new" });
    }
    const activity = this.inspectConversationActivity(config);
    if (activity.kind === "present") return Object.freeze({ kind: "restore_native" });
    if (activity.kind === "none") return Object.freeze({ kind: "new" });
    throw new CollaborationAgentActivationError(
      "COLLABORATION_AGENT_CONTINUATION_STATE_UNREADABLE",
      "The local conversation state cannot be inspected safely.",
      { cause: activity.error },
    );
  }

  private prepareCandidate(plan: ActivationPlan, config: AgentRunConfig): Promise<AgentRunActivationCandidate> {
    if (plan.kind === "new") return this.manager.prepareNewAgentRun({ runId: this.input.identity.agentRunId, config });
    if (plan.kind === "restore_external") {
      return this.manager.prepareRestoreAgentRunFromPlatformState({
        runId: this.input.identity.agentRunId,
        config,
        platformAgentRunId: plan.platformAgentRunId,
      });
    }
    return this.manager.prepareRestoreAgentRun(new AgentRunContext({
      runId: this.input.identity.agentRunId,
      config,
      runtimeContext: null,
    })).catch((error: unknown) => {
      if (isAgentRunActivationQuarantineError(error)) throw error;
      throw new CollaborationAgentActivationError(
        "COLLABORATION_AGENT_NATIVE_RESTORE_FAILED",
        "The prior native conversation context could not be restored.",
        { cause: error },
      );
    });
  }

  private assertNoPriorConversationActivity(config: AgentRunConfig): void {
    const activity = this.inspectConversationActivity(config);
    if (activity.kind === "present") {
      throw new CollaborationAgentActivationError(
        "COLLABORATION_AGENT_CONTINUATION_BINDING_MISSING",
        "This conversation has local history but no provider binding and cannot be continued safely.",
      );
    }
    if (activity.kind === "indeterminate") {
      throw new CollaborationAgentActivationError(
        "COLLABORATION_AGENT_CONTINUATION_STATE_UNREADABLE",
        "The local conversation state cannot be inspected safely.",
        { cause: activity.error },
      );
    }
  }

  private inspectConversationActivity(config: AgentRunConfig) {
    if (!config.memoryDir) {
      return { kind: "indeterminate" as const, error: new Error("AgentRun memory location is unavailable.") };
    }
    return (this.input.activityInspector ?? getAgentConversationActivityInspector()).inspect({
      agentRunId: this.input.identity.agentRunId,
      memoryDir: config.memoryDir,
    });
  }

  private createExternalBinding(candidate: AgentRunActivationCandidate): CollaborationAgentPlatformBinding | null {
    if (!isExternalProviderRuntimeKind(candidate.runtimeKind)) return null;
    if (!candidate.platformAgentRunId || candidate.platformAgentRunId === candidate.runId) {
      throw new AgentRunActivationError(
        "PLATFORM_AGENT_RUN_BINDING_INVALID",
        "The external runtime did not provide a valid provider conversation identity.",
      );
    }
    return createCollaborationAgentPlatformBinding({
      execution: this.input.identity,
      platformAgentRunId: candidate.platformAgentRunId,
    });
  }

  private get manager(): AgentRunManager { return this.input.manager ?? AgentRunManager.getInstance(); }
}

type ActivationPlan =
  | Readonly<{ kind: "new" }>
  | Readonly<{ kind: "restore_native" }>
  | Readonly<{ kind: "restore_external"; platformAgentRunId: string }>;
