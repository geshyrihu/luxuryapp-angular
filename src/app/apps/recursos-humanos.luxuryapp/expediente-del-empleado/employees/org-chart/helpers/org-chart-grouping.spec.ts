import {
  buildOrgChartGroupId,
  groupSiblingsByRole,
  ORG_CHART_GROUP_THRESHOLD,
} from "./org-chart-grouping";
import { IWorkPositionOrgChartNode } from "../interfaces/org-chart.interfaces";

describe("org-chart-grouping", () => {
  const createNode = (
    partial: Partial<IWorkPositionOrgChartNode>,
  ): IWorkPositionOrgChartNode => ({
    workPositionId: "",
    folio: "",
    roleDisplayName: "",
    departmentName: "Operaciones",
    hierarchyLevel: 0,
    sortOrder: 0,
    hasEmployee: false,
    state: "Activo",
    children: [],
    ...partial,
  });

  const noExpanded = new Set<string>();

  it("does not group when siblings are below the threshold", () => {
    const nodes = [
      createNode({ workPositionId: "A", roleDisplayName: "Mesero", sortOrder: 0 }),
      createNode({ workPositionId: "B", roleDisplayName: "Mesero", sortOrder: 1 }),
    ];

    const result = groupSiblingsByRole(nodes, noExpanded);

    expect(result.map((n) => n.workPositionId)).toEqual(["A", "B"]);
    expect(result.every((n) => !n.isGroup)).toBe(true);
  });

  it("groups leaf siblings sharing the same role once the threshold is reached", () => {
    const nodes = Array.from({ length: ORG_CHART_GROUP_THRESHOLD }, (_, i) =>
      createNode({
        workPositionId: `W${i}`,
        roleDisplayName: "Mesero",
        sortOrder: i,
      }),
    );

    const result = groupSiblingsByRole(nodes, noExpanded);

    expect(result).toHaveLength(1);
    expect(result[0].isGroup).toBe(true);
    expect(result[0].groupMemberCount).toBe(ORG_CHART_GROUP_THRESHOLD);
    expect(result[0].isGroupExpanded).toBe(false);
    expect(result[0].children).toEqual([]);
  });

  it("never groups nodes that have their own subordinates, even sharing role", () => {
    const nodes = [
      createNode({
        workPositionId: "A",
        roleDisplayName: "Supervisor",
        sortOrder: 0,
        children: [createNode({ workPositionId: "A1", sortOrder: 0 })],
      }),
      createNode({
        workPositionId: "B",
        roleDisplayName: "Supervisor",
        sortOrder: 1,
        children: [createNode({ workPositionId: "B1", sortOrder: 0 })],
      }),
      createNode({
        workPositionId: "C",
        roleDisplayName: "Supervisor",
        sortOrder: 2,
        children: [createNode({ workPositionId: "C1", sortOrder: 0 })],
      }),
    ];

    const result = groupSiblingsByRole(nodes, noExpanded);

    expect(result.map((n) => n.workPositionId)).toEqual(["A", "B", "C"]);
    expect(result.every((n) => !n.isGroup)).toBe(true);
  });

  it("expands a group into its real members when its id is in expandedGroupIds", () => {
    const nodes = Array.from({ length: ORG_CHART_GROUP_THRESHOLD }, (_, i) =>
      createNode({
        workPositionId: `W${i}`,
        roleDisplayName: "Mesero",
        sortOrder: i,
      }),
    );

    const groupId = buildOrgChartGroupId("__ROOT__", "Mesero");
    const result = groupSiblingsByRole(nodes, new Set([groupId]));

    expect(result).toHaveLength(ORG_CHART_GROUP_THRESHOLD + 1);
    const header = result.find((n) => n.isGroup);
    expect(header?.isGroupExpanded).toBe(true);
    expect(result.filter((n) => !n.isGroup).map((n) => n.workPositionId)).toEqual(
      ["W0", "W1", "W2"],
    );
  });

  it("applies the grouping rule recursively at nested levels, not only the root", () => {
    const nodes = [
      createNode({
        workPositionId: "BOSS",
        roleDisplayName: "Gerente",
        sortOrder: 0,
        children: Array.from({ length: ORG_CHART_GROUP_THRESHOLD }, (_, i) =>
          createNode({
            workPositionId: `M${i}`,
            roleDisplayName: "Mesero",
            sortOrder: i,
          }),
        ),
      }),
    ];

    const result = groupSiblingsByRole(nodes, noExpanded);

    expect(result).toHaveLength(1);
    expect(result[0].isGroup).toBeFalsy();
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children[0].isGroup).toBe(true);
    expect(result[0].children[0].groupMemberCount).toBe(ORG_CHART_GROUP_THRESHOLD);
  });

  it("keeps stable sort order between branches, ungrouped leaves and groups", () => {
    const nodes = [
      createNode({
        workPositionId: "BRANCH",
        roleDisplayName: "Supervisor",
        sortOrder: 2,
        children: [createNode({ workPositionId: "SUB", sortOrder: 0 })],
      }),
      createNode({ workPositionId: "SOLO", roleDisplayName: "Chef", sortOrder: 0 }),
      ...Array.from({ length: ORG_CHART_GROUP_THRESHOLD }, (_, i) =>
        createNode({
          workPositionId: `M${i}`,
          roleDisplayName: "Mesero",
          sortOrder: 1,
        }),
      ),
    ];

    const result = groupSiblingsByRole(nodes, noExpanded);

    expect(result.map((n) => n.workPositionId)).toEqual([
      "SOLO",
      buildOrgChartGroupId("__ROOT__", "Mesero"),
      "BRANCH",
    ]);
  });

  it("keeps different parents' same-role leaves in separate groups", () => {
    const nodes = [
      createNode({
        workPositionId: "P1",
        roleDisplayName: "Gerente",
        sortOrder: 0,
        children: Array.from({ length: ORG_CHART_GROUP_THRESHOLD }, (_, i) =>
          createNode({
            workPositionId: `A${i}`,
            roleDisplayName: "Mesero",
            sortOrder: i,
          }),
        ),
      }),
      createNode({
        workPositionId: "P2",
        roleDisplayName: "Gerente",
        sortOrder: 1,
        children: Array.from({ length: ORG_CHART_GROUP_THRESHOLD }, (_, i) =>
          createNode({
            workPositionId: `B${i}`,
            roleDisplayName: "Mesero",
            sortOrder: i,
          }),
        ),
      }),
    ];

    const result = groupSiblingsByRole(nodes, noExpanded);

    const groupIdsUnderP1 = result[0].children.map((n) => n.workPositionId);
    const groupIdsUnderP2 = result[1].children.map((n) => n.workPositionId);

    expect(groupIdsUnderP1).toEqual([buildOrgChartGroupId("P1", "Mesero")]);
    expect(groupIdsUnderP2).toEqual([buildOrgChartGroupId("P2", "Mesero")]);
    expect(groupIdsUnderP1[0]).not.toEqual(groupIdsUnderP2[0]);
  });
});
