import { z } from "zod";
export declare const AgentTeamRootExecutionViewDtoSchema: z.ZodObject<{
    root_subject_kind: z.ZodLiteral<"agent_team">;
    root_run_id: z.ZodString;
    schema_version: z.ZodLiteral<2>;
    root_team: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strict>;
export declare const AgentOrgRootExecutionViewDtoSchema: z.ZodObject<{
    root_subject_kind: z.ZodLiteral<"agent_org">;
    root_run_id: z.ZodString;
    schema_version: z.ZodLiteral<1>;
    root_org: z.ZodObject<{
        base_change_sequence: z.ZodNumber;
        is_active: z.ZodBoolean;
        execution_tree: z.ZodObject<{
            schemaVersion: z.ZodLiteral<1>;
            subjectKind: z.ZodLiteral<"agent_org">;
            createdAt: z.ZodString;
            archivedAt: z.ZodNullable<z.ZodString>;
            applicationBinding: z.ZodNullable<z.ZodUnknown>;
            handoffs: z.ZodArray<z.ZodUnknown>;
            rootOrg: z.ZodObject<{
                address: z.ZodLiteral<"/">;
                orgDefinitionId: z.ZodString;
                orgDefinitionName: z.ZodString;
                orgRunId: z.ZodString;
                defaultLaunchConfiguration: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                members: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                taskExecutions: z.ZodArray<z.ZodUnknown>;
            }, z.core.$strict>;
        }, z.core.$strict>;
        task_records: z.ZodObject<{
            schemaVersion: z.ZodLiteral<1>;
            subjectKind: z.ZodLiteral<"agent_org">;
            orgRunId: z.ZodString;
            records: z.ZodArray<z.ZodUnknown>;
        }, z.core.$strict>;
        communication_messages: z.ZodObject<{
            schemaVersion: z.ZodLiteral<1>;
            subjectKind: z.ZodLiteral<"agent_org">;
            orgRunId: z.ZodString;
            messages: z.ZodArray<z.ZodUnknown>;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const RootExecutionViewDtoSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    root_subject_kind: z.ZodLiteral<"agent_team">;
    root_run_id: z.ZodString;
    schema_version: z.ZodLiteral<2>;
    root_team: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strict>, z.ZodObject<{
    root_subject_kind: z.ZodLiteral<"agent_org">;
    root_run_id: z.ZodString;
    schema_version: z.ZodLiteral<1>;
    root_org: z.ZodObject<{
        base_change_sequence: z.ZodNumber;
        is_active: z.ZodBoolean;
        execution_tree: z.ZodObject<{
            schemaVersion: z.ZodLiteral<1>;
            subjectKind: z.ZodLiteral<"agent_org">;
            createdAt: z.ZodString;
            archivedAt: z.ZodNullable<z.ZodString>;
            applicationBinding: z.ZodNullable<z.ZodUnknown>;
            handoffs: z.ZodArray<z.ZodUnknown>;
            rootOrg: z.ZodObject<{
                address: z.ZodLiteral<"/">;
                orgDefinitionId: z.ZodString;
                orgDefinitionName: z.ZodString;
                orgRunId: z.ZodString;
                defaultLaunchConfiguration: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                members: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                taskExecutions: z.ZodArray<z.ZodUnknown>;
            }, z.core.$strict>;
        }, z.core.$strict>;
        task_records: z.ZodObject<{
            schemaVersion: z.ZodLiteral<1>;
            subjectKind: z.ZodLiteral<"agent_org">;
            orgRunId: z.ZodString;
            records: z.ZodArray<z.ZodUnknown>;
        }, z.core.$strict>;
        communication_messages: z.ZodObject<{
            schemaVersion: z.ZodLiteral<1>;
            subjectKind: z.ZodLiteral<"agent_org">;
            orgRunId: z.ZodString;
            messages: z.ZodArray<z.ZodUnknown>;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>], "root_subject_kind">;
export type AgentTeamRootExecutionViewDto = z.infer<typeof AgentTeamRootExecutionViewDtoSchema>;
export type AgentOrgRootExecutionViewDto = z.infer<typeof AgentOrgRootExecutionViewDtoSchema>;
export type RootExecutionViewDto = z.infer<typeof RootExecutionViewDtoSchema>;
export declare const RootExecutionEventDtoSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    root_subject_kind: z.ZodLiteral<"agent_team">;
    root_run_id: z.ZodString;
    change_sequence: z.ZodNumber;
    event: z.ZodUnknown;
}, z.core.$strict>, z.ZodObject<{
    root_subject_kind: z.ZodLiteral<"agent_org">;
    root_run_id: z.ZodString;
    change_sequence: z.ZodNumber;
    event: z.ZodUnknown;
}, z.core.$strict>], "root_subject_kind">;
export type RootExecutionEventDto = z.infer<typeof RootExecutionEventDtoSchema>;
export declare const CollaborationStreamServerMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"CONNECTED">;
    payload: z.ZodObject<{
        root_subject_kind: z.ZodEnum<{
            agent_team: "agent_team";
            agent_org: "agent_org";
        }>;
        root_run_id: z.ZodString;
        session_id: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"ROOT_EXECUTION_VIEW_SNAPSHOT">;
    payload: z.ZodDiscriminatedUnion<[z.ZodObject<{
        root_subject_kind: z.ZodLiteral<"agent_team">;
        root_run_id: z.ZodString;
        schema_version: z.ZodLiteral<2>;
        root_team: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strict>, z.ZodObject<{
        root_subject_kind: z.ZodLiteral<"agent_org">;
        root_run_id: z.ZodString;
        schema_version: z.ZodLiteral<1>;
        root_org: z.ZodObject<{
            base_change_sequence: z.ZodNumber;
            is_active: z.ZodBoolean;
            execution_tree: z.ZodObject<{
                schemaVersion: z.ZodLiteral<1>;
                subjectKind: z.ZodLiteral<"agent_org">;
                createdAt: z.ZodString;
                archivedAt: z.ZodNullable<z.ZodString>;
                applicationBinding: z.ZodNullable<z.ZodUnknown>;
                handoffs: z.ZodArray<z.ZodUnknown>;
                rootOrg: z.ZodObject<{
                    address: z.ZodLiteral<"/">;
                    orgDefinitionId: z.ZodString;
                    orgDefinitionName: z.ZodString;
                    orgRunId: z.ZodString;
                    defaultLaunchConfiguration: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    members: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    taskExecutions: z.ZodArray<z.ZodUnknown>;
                }, z.core.$strict>;
            }, z.core.$strict>;
            task_records: z.ZodObject<{
                schemaVersion: z.ZodLiteral<1>;
                subjectKind: z.ZodLiteral<"agent_org">;
                orgRunId: z.ZodString;
                records: z.ZodArray<z.ZodUnknown>;
            }, z.core.$strict>;
            communication_messages: z.ZodObject<{
                schemaVersion: z.ZodLiteral<1>;
                subjectKind: z.ZodLiteral<"agent_org">;
                orgRunId: z.ZodString;
                messages: z.ZodArray<z.ZodUnknown>;
            }, z.core.$strict>;
        }, z.core.$strict>;
    }, z.core.$strict>], "root_subject_kind">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"ROOT_EXECUTION_EVENT">;
    payload: z.ZodDiscriminatedUnion<[z.ZodObject<{
        root_subject_kind: z.ZodLiteral<"agent_team">;
        root_run_id: z.ZodString;
        change_sequence: z.ZodNumber;
        event: z.ZodUnknown;
    }, z.core.$strict>, z.ZodObject<{
        root_subject_kind: z.ZodLiteral<"agent_org">;
        root_run_id: z.ZodString;
        change_sequence: z.ZodNumber;
        event: z.ZodUnknown;
    }, z.core.$strict>], "root_subject_kind">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"ROOT_LIFECYCLE">;
    payload: z.ZodObject<{
        root_subject_kind: z.ZodEnum<{
            agent_team: "agent_team";
            agent_org: "agent_org";
        }>;
        root_run_id: z.ZodString;
        is_active: z.ZodBoolean;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"ERROR">;
    payload: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>], "type">;
export type CollaborationStreamServerMessage = z.infer<typeof CollaborationStreamServerMessageSchema>;
export declare const CollaborationStreamClientMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"SEND_MESSAGE">;
    payload: z.ZodObject<{
        root_subject_kind: z.ZodLiteral<"agent_org">;
        root_run_id: z.ZodString;
        target_agent_run_id: z.ZodString;
        content: z.ZodString;
        context_file_paths: z.ZodArray<z.ZodString>;
        image_urls: z.ZodArray<z.ZodString>;
        message_id: z.ZodString;
        dedupe_key: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export type CollaborationStreamClientMessage = z.infer<typeof CollaborationStreamClientMessageSchema>;
//# sourceMappingURL=root-execution-view-dtos.d.ts.map