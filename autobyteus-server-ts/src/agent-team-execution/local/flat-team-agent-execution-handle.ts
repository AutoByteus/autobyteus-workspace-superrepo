import type { AgentInputUserMessage } from "autobyteus-ts/agent/message/agent-input-user-message.js";
import type { AgentOperationResult } from "../../agent-execution/domain/agent-operation-result.js";
import type { AgentRun } from "../../agent-execution/domain/agent-run.js";
import type { AgentRunInputOptions, AgentRunInputReservationResult } from "../../agent-execution/input/agent-run-input-contract.js";
import type { AgentRunManager } from "../../agent-execution/services/agent-run-manager.js";
import type { AgentConversationActivityInspector } from "../../agent-memory/services/agent-conversation-activity-inspector.js";
import type { WorkspaceManager } from "../../workspaces/workspace-manager.js";
import { ConfiguredAgentExecutionFactory } from "../../agent-collaboration/execution/backends/configured-agent-execution-factory.js";
import type {
  ConfiguredAgentExecutionHandle,
  PreparedConfiguredAgentActivation,
} from "../../agent-collaboration/execution/backends/configured-agent-execution-handle.js";
import type { RootedAgentMemoryLocator } from "../../agent-collaboration/execution/services/rooted-agent-memory-locator.js";
import {
  createCollaborationMemberExecutionIdentity,
  type CollaborationMemberExecutionIdentity,
} from "../../agent-collaboration/execution/domain/root-execution-identity.js";
import type { PreparedLocalExecutionTermination } from "../../agent-collaboration/execution/domain/prepared-local-execution-termination.js";
import { createTeamAgentStatusSnapshot } from "../domain/team-agent-status.js";
import type { TeamRunAgentNode } from "../domain/team-run-config.js";
import type { TeamRunContext } from "../domain/team-run-context.js";
import type { FlatAgentExecutionContext, ConfiguredMemberActivationMode, FlatTeamExecutionContext } from "../local/flat-team-execution-context.js";
import type { FlatTeamExecutionCallbacks } from "./flat-team-execution-callbacks.js";

/** Root-neutral local adapter for one Agent execution inside a concrete TeamRun. */
export class FlatTeamAgentExecutionHandle {
  readonly context: FlatAgentExecutionContext;
  private handle: ConfiguredAgentExecutionHandle | null = null;
  private construction: Promise<ConfiguredAgentExecutionHandle> | null = null;

  constructor(private readonly options: {
    teamContext: TeamRunContext<FlatTeamExecutionContext>;
    context: FlatAgentExecutionContext;
    config: TeamRunAgentNode;
    activationMode: ConfiguredMemberActivationMode;
    callbacks: FlatTeamExecutionCallbacks;
    agentRunManager?: AgentRunManager;
    memoryLocator?: RootedAgentMemoryLocator;
    activityInspector?: AgentConversationActivityInspector;
    workspaceManager?: Pick<WorkspaceManager, "ensureWorkspaceByRootPath">;
    executionFactory?: ConfiguredAgentExecutionFactory;
  }) { this.context = options.context; }

  isActive(): boolean { return this.handle?.isActive() ?? false; }
  hasOpenExecutionWork(): boolean { return this.handle?.hasOpenExecutionWork() ?? false; }
  getLeafAgentStatusSnapshots() {
    const status = this.handle?.getStatusSnapshot();
    return [createTeamAgentStatusSnapshot({
      execution: this.identity(),
      details: status ? { ...status.details, toolName: null, errorDetails: null } : {
        status: "offline", trigger: null, toolName: null, errorMessage: null, errorDetails: null,
      },
    })];
  }
  async getOrCreateAgentRun(): Promise<AgentRun> { return (await this.getHandle()).getOrCreateAgentRun(); }
  async reserveInput(message: AgentInputUserMessage, options: AgentRunInputOptions = {}): Promise<AgentRunInputReservationResult> {
    return (await this.getHandle()).reserveInput(message, options);
  }
  async postMessage(message: AgentInputUserMessage): Promise<AgentOperationResult> { return (await this.getHandle()).postMessage(message); }
  async approveToolInvocation(invocationId: string, approved: boolean, reason: string | null = null) {
    return (await this.getHandle()).approveToolInvocation(invocationId, approved, reason);
  }
  async interrupt() { return this.handle ? this.handle.interrupt() : { accepted: true as const }; }
  async interruptForRootTermination() {
    if (this.construction) await this.construction.catch(() => null);
    return this.handle ? this.handle.interruptForRootTermination() : { accepted: true as const };
  }
  async prepareConfiguredActivation(): Promise<PreparedConfiguredAgentActivation> {
    return (await this.getHandle()).prepareConfiguredActivation();
  }
  async prepareTermination(): Promise<PreparedLocalExecutionTermination> {
    if (this.construction) await this.construction.catch(() => null);
    if (this.handle) return this.handle.prepareTermination();
    return Object.freeze({
      cancel: () => undefined,
      commit: () => Object.freeze({ finish: async () => ({ accepted: true as const }) }),
    });
  }
  async terminate() { return this.handle ? this.handle.terminate() : { accepted: true as const }; }
  dispose(): void { this.handle?.dispose(); this.handle = null; }

  private getHandle(): Promise<ConfiguredAgentExecutionHandle> {
    if (this.handle) return Promise.resolve(this.handle);
    if (this.construction) return this.construction;
    const attempt = this.createHandle();
    this.construction = attempt;
    void attempt.finally(() => { if (this.construction === attempt) this.construction = null; }).catch(() => undefined);
    return attempt;
  }

  private async createHandle(): Promise<ConfiguredAgentExecutionHandle> {
    const identity = this.identity();
    const execution = this.executionSpec();
    const memberExecutionContext = await this.options.callbacks.buildMemberExecutionContext({
      identity,
      physicalScope: this.options.teamContext.physicalScope,
      execution,
      sourceNode: this.options.config,
    });
    const handle = (this.options.executionFactory ?? new ConfiguredAgentExecutionFactory()).create({
      identity,
      physicalScope: this.options.teamContext.physicalScope,
      execution,
      activationMode: this.options.activationMode,
      memberExecutionContext,
      applicationExecutionContext: this.options.callbacks.applicationExecutionContext?.(identity) ?? null,
      callbacks: {
        publishAgentEvent: (member, event) => this.options.callbacks.publishAgentEvent(member, event),
        acceptPlatformBinding: async (member, binding) => {
          await this.options.callbacks.acceptPlatformBinding(member, binding);
          this.context.adoptPlatformAgentRunId(binding.platformAgentRunId);
        },
      },
      agentRunManager: this.options.agentRunManager,
      memoryLocator: this.options.memoryLocator,
      activityInspector: this.options.activityInspector,
      workspaceManager: this.options.workspaceManager,
    });
    this.handle = handle;
    return handle;
  }

  private identity(): CollaborationMemberExecutionIdentity {
    return createCollaborationMemberExecutionIdentity({
      root: this.options.teamContext.rootIdentity,
      memberAddress: this.context.address,
      agentRunId: this.context.agentRunId,
    });
  }
  private executionSpec() {
    return Object.freeze({
      agentDefinitionId: this.options.config.agentDefinitionId,
      llmModelIdentifier: this.options.config.llmModelIdentifier,
      llmConfig: this.options.config.llmConfig,
      autoExecuteTools: this.options.config.autoExecuteTools,
      skillAccessMode: this.options.config.skillAccessMode,
      runtimeKind: this.options.config.runtimeKind,
      workspaceRootPath: this.options.config.workspaceRootPath,
      platformAgentRunId: this.options.config.platformAgentRunId,
    });
  }
}
