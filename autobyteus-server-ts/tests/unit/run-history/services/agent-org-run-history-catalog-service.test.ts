import { describe, expect, it, vi } from "vitest";
import { AgentOrgRunHistoryCatalogService } from "../../../../src/run-history/services/agent-org-run-history-catalog-service.js";
import type { AgentOrgRunIndexRowRecord } from "../../../../src/run-history/store/agent-org-run-history-index-record-types.js";
import { testAgentOrgExecutionTree, testOrgAgentNode } from "../../../fixtures/current-agent-org-run-fixtures.js";

const tree = testAgentOrgExecutionTree({
  orgRunId: "org-run",
  members: [testOrgAgentNode("/director", "agent-run")],
});
const baseRow = (): AgentOrgRunIndexRowRecord => Object.freeze({
  orgRunId: "org-run",
  orgDefinitionId: tree.rootOrg.orgDefinitionId,
  orgDefinitionName: tree.rootOrg.orgDefinitionName,
  workspaceRootPath: tree.rootOrg.defaultLaunchConfiguration.workspaceRootPath,
  summary: "",
  createdAt: tree.createdAt,
  archivedAt: tree.archivedAt,
  terminatedAt: null,
});

const harness = () => {
  let persisted: readonly AgentOrgRunIndexRowRecord[] = [baseRow()];
  const index = {
    readIndex: vi.fn(async () => [...persisted]),
    writeIndex: vi.fn(async (rows: readonly AgentOrgRunIndexRowRecord[]) => { persisted = [...rows]; }),
  };
  const packages = { rebuild: vi.fn(async () => undefined), listAdmitted: vi.fn(() => ["org-run"]), exclude: vi.fn() };
  const trees = { read: vi.fn(async () => tree) };
  const catalog = new AgentOrgRunHistoryCatalogService("/unused", { getActive: () => null } as never, {
    indexStore: index as never,
    packageCatalog: packages as never,
    treeStore: trees as never,
  });
  return { catalog, index, get persisted() { return persisted; } };
};

describe("AgentOrgRunHistoryCatalogService summary sequencing", () => {
  it("serializes first-write attempts and keeps the first enqueued accepted completion", async () => {
    const test = harness();
    await test.catalog.initialize();
    const firstEnqueued = test.catalog.recordRunSummary({ orgRunId: "org-run", summary: "Second socket completed first" });
    const secondEnqueued = test.catalog.recordRunSummary({ orgRunId: "org-run", summary: "First socket completed later" });
    await Promise.all([firstEnqueued, secondEnqueued]);
    expect((await test.catalog.listRows())[0]?.summary).toBe("Second socket completed first");
    expect(test.persisted[0]?.summary).toBe("Second socket completed first");
  });

  it("preserves a committed summary through restore and rebuild projections", async () => {
    const test = harness();
    await test.catalog.recordRunSummary({ orgRunId: "org-run", summary: "Stable first message" });
    await test.catalog.recordRestored(tree);
    expect((await test.catalog.listRows())[0]?.summary).toBe("Stable first message");

    const rebuilt = new AgentOrgRunHistoryCatalogService("/unused", { getActive: () => null } as never, {
      indexStore: test.index as never,
      packageCatalog: { rebuild: vi.fn(async () => undefined), listAdmitted: () => ["org-run"], exclude: vi.fn() } as never,
      treeStore: { read: vi.fn(async () => tree) } as never,
    });
    expect((await rebuilt.listRows())[0]?.summary).toBe("Stable first message");
  });
});
