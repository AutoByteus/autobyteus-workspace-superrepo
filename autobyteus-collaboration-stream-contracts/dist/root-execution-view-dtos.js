import { z } from "zod";
const requiredText = z.string().trim().min(1);
export const AgentTeamRootExecutionViewDtoSchema = z.object({
    root_subject_kind: z.literal("agent_team"),
    root_run_id: requiredText,
    schema_version: z.literal(2),
    root_team: z.record(z.string(), z.unknown()),
}).strict();
export const AgentOrgRootExecutionViewDtoSchema = z.object({
    root_subject_kind: z.literal("agent_org"),
    root_run_id: requiredText,
    schema_version: z.literal(1),
    root_org: z.object({
        base_change_sequence: z.number().int().nonnegative(),
        is_active: z.boolean(),
        execution_tree: z.object({
            schemaVersion: z.literal(1),
            subjectKind: z.literal("agent_org"),
            createdAt: requiredText,
            archivedAt: requiredText.nullable(),
            applicationBinding: z.unknown().nullable(),
            handoffs: z.array(z.unknown()),
            rootOrg: z.object({
                address: z.literal("/"),
                orgDefinitionId: requiredText,
                orgDefinitionName: requiredText,
                orgRunId: requiredText,
                defaultLaunchConfiguration: z.record(z.string(), z.unknown()),
                members: z.array(z.record(z.string(), z.unknown())),
                taskExecutions: z.array(z.unknown()),
            }).strict(),
        }).strict(),
        task_records: z.object({
            schemaVersion: z.literal(1),
            subjectKind: z.literal("agent_org"),
            orgRunId: requiredText,
            records: z.array(z.unknown()),
        }).strict(),
        communication_messages: z.object({
            schemaVersion: z.literal(1),
            subjectKind: z.literal("agent_org"),
            orgRunId: requiredText,
            messages: z.array(z.unknown()),
        }).strict(),
    }).strict(),
}).strict();
export const RootExecutionViewDtoSchema = z.discriminatedUnion("root_subject_kind", [
    AgentTeamRootExecutionViewDtoSchema,
    AgentOrgRootExecutionViewDtoSchema,
]).superRefine((value, context) => {
    if (value.root_subject_kind !== "agent_org")
        return;
    const correlated = [
        value.root_org.execution_tree.rootOrg.orgRunId,
        value.root_org.task_records.orgRunId,
        value.root_org.communication_messages.orgRunId,
    ];
    if (correlated.some((orgRunId) => orgRunId !== value.root_run_id)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: "AgentOrg snapshot root correlation mismatch." });
    }
});
export const RootExecutionEventDtoSchema = z.discriminatedUnion("root_subject_kind", [
    z.object({ root_subject_kind: z.literal("agent_team"), root_run_id: requiredText, change_sequence: z.number().int().nonnegative(), event: z.unknown() }).strict(),
    z.object({ root_subject_kind: z.literal("agent_org"), root_run_id: requiredText, change_sequence: z.number().int().nonnegative(), event: z.unknown() }).strict(),
]);
export const CollaborationStreamServerMessageSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("CONNECTED"), payload: z.object({ root_subject_kind: z.enum(["agent_team", "agent_org"]), root_run_id: requiredText, session_id: requiredText }).strict() }).strict(),
    z.object({ type: z.literal("ROOT_EXECUTION_VIEW_SNAPSHOT"), payload: RootExecutionViewDtoSchema }).strict(),
    z.object({ type: z.literal("ROOT_EXECUTION_EVENT"), payload: RootExecutionEventDtoSchema }).strict(),
    z.object({ type: z.literal("ROOT_LIFECYCLE"), payload: z.object({ root_subject_kind: z.enum(["agent_team", "agent_org"]), root_run_id: requiredText, is_active: z.boolean() }).strict() }).strict(),
    z.object({ type: z.literal("ERROR"), payload: z.object({ code: requiredText, message: requiredText }).strict() }).strict(),
]);
export const CollaborationStreamClientMessageSchema = z.object({
    type: z.literal("SEND_MESSAGE"),
    payload: z.object({
        root_subject_kind: z.literal("agent_org"),
        root_run_id: requiredText,
        target_agent_run_id: requiredText,
        content: z.string(),
        context_file_paths: z.array(z.string()),
        image_urls: z.array(z.string()),
        message_id: requiredText,
        dedupe_key: requiredText,
    }).strict(),
}).strict();
//# sourceMappingURL=root-execution-view-dtos.js.map