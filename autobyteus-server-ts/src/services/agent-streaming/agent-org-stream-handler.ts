import { randomUUID } from "node:crypto";
import {
  CollaborationStreamClientMessageSchema,
  CollaborationStreamServerMessageSchema,
  type CollaborationStreamServerMessage,
} from "@autobyteus/collaboration-stream-contracts";
import { AgentInputUserMessage, ContextFile, ContextFileType } from "autobyteus-ts";
import { AgentOrgRunManager } from "../../agent-org-execution/services/agent-org-run-manager.js";
import { projectAgentOrgExecutionEvent, projectAgentOrgExecutionView } from "./agent-org-execution-view-projector.js";
import type { WebSocketConnection } from "./agent-team-stream-handler.js";

const serialize = (message: CollaborationStreamServerMessage): string =>
  JSON.stringify(CollaborationStreamServerMessageSchema.parse(message));
const error = (code: string, message: string): CollaborationStreamServerMessage =>
  CollaborationStreamServerMessageSchema.parse({ type: "ERROR", payload: { code, message } });

/** Native AgentOrg stream. It does not reuse or reinterpret the Team envelope. */
export class AgentOrgStreamHandler {
  private readonly sessions = new Map<string, { connection: WebSocketConnection; orgRunId: string; close(): void }>();
  constructor(private readonly manager: Pick<AgentOrgRunManager, "getActive"> = AgentOrgRunManager.getInstance()) {}

  async connect(connection: WebSocketConnection, orgRunIdInput: string): Promise<string | null> {
    const orgRunId = orgRunIdInput.trim();
    const run = orgRunId ? this.manager.getActive(orgRunId) : null;
    if (!run) {
      connection.send(serialize(error("AGENT_ORG_NOT_ACTIVE", `AgentOrg run '${orgRunId}' is not active.`)));
      connection.close(4004);
      return null;
    }
    const sessionId = randomUUID();
    const barrier = await run.openPackageSnapshotConnection();
    try {
      connection.send(serialize(CollaborationStreamServerMessageSchema.parse({
        type: "CONNECTED",
        payload: { root_subject_kind: "agent_org", root_run_id: orgRunId, session_id: sessionId },
      })));
      connection.send(serialize(CollaborationStreamServerMessageSchema.parse({
        type: "ROOT_EXECUTION_VIEW_SNAPSHOT",
        payload: projectAgentOrgExecutionView(run, barrier.snapshot, barrier.baseChangeSequence),
      })));
      const unsubscribe = barrier.subscribe((event) => {
        connection.send(serialize(CollaborationStreamServerMessageSchema.parse({
          type: "ROOT_EXECUTION_EVENT",
          payload: projectAgentOrgExecutionEvent(run, event),
        })));
        if (event.event.kind === "lifecycle") {
          connection.send(serialize(CollaborationStreamServerMessageSchema.parse({
            type: "ROOT_LIFECYCLE",
            payload: { root_subject_kind: "agent_org", root_run_id: orgRunId, is_active: event.event.isActive },
          })));
          if (!event.event.isActive) {
            queueMicrotask(() => {
              this.disconnect(sessionId);
              connection.close(1000);
            });
          }
        }
      });
      connection.send(serialize(CollaborationStreamServerMessageSchema.parse({
        type: "ROOT_LIFECYCLE",
        payload: { root_subject_kind: "agent_org", root_run_id: orgRunId, is_active: true },
      })));
      this.sessions.set(sessionId, { connection, orgRunId, close: unsubscribe });
      return sessionId;
    } catch (cause) {
      barrier.close();
      connection.send(serialize(error("AGENT_ORG_STREAM_UNAVAILABLE", String(cause))));
      connection.close(1011);
      return null;
    }
  }

  async handleMessage(sessionId: string, raw: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    try {
      const message = CollaborationStreamClientMessageSchema.parse(JSON.parse(raw));
      if (message.payload.root_run_id !== session.orgRunId) throw new Error("AgentOrg command root correlation mismatch.");
      const run = this.manager.getActive(session.orgRunId);
      if (!run) throw new Error(`AgentOrg run '${session.orgRunId}' is not active.`);
      const contextFiles = [
        ...message.payload.context_file_paths.map((filePath) => new ContextFile(filePath)),
        ...message.payload.image_urls.map((url) => new ContextFile(url, ContextFileType.IMAGE)),
      ];
      const input = AgentInputUserMessage.fromDict({
        content: message.payload.content,
        context_files: contextFiles.length ? contextFiles.map((file) => file.toDict()) : null,
        metadata: { input_origin: "user_message", message_id: message.payload.message_id, dedupe_key: message.payload.dedupe_key },
      });
      const result = await run.executeAgentCommand(message.payload.target_agent_run_id, { kind: "post_message", message: input });
      if (!result.accepted) throw new Error(result.message ?? result.code ?? "AgentOrg message was rejected.");
    } catch (cause) {
      session.connection.send(serialize(error("AGENT_ORG_COMMAND_REJECTED", cause instanceof Error ? cause.message : String(cause))));
    }
  }

  disconnect(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.close();
    this.sessions.delete(sessionId);
  }
}

let cached: AgentOrgStreamHandler | null = null;
export const getAgentOrgStreamHandler = (): AgentOrgStreamHandler => cached ??= new AgentOrgStreamHandler();
