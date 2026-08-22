import {
  buildOrgChartGraph,
  createVirtualRootNode,
  flattenOrgChartNodes,
  withVirtualRoot,
} from "./org-chart-graph-adapter";
import {
  IRoleOrgChartNode,
  ORG_CHART_VIRTUAL_ROOT_ID,
} from "../interfaces/org-chart.interfaces";

describe("org-chart-graph-adapter", () => {
  const createNode = (
    partial: Partial<IRoleOrgChartNode>,
  ): IRoleOrgChartNode => ({
    roleId: "",
    roleDisplayName: "",
    departmentName: "Operaciones",
    hierarchyLevel: 0,
    sortOrder: 0,
    members: [],
    children: [],
    ...partial,
  });

  it("wraps multiple roots with the virtual root", () => {
    const roots = withVirtualRoot([
      createNode({ roleId: "A", roleDisplayName: "Direccion" }),
      createNode({ roleId: "B", roleDisplayName: "Supervision" }),
    ]);

    expect(roots).toHaveLength(1);
    expect(roots[0].roleId).toBe(ORG_CHART_VIRTUAL_ROOT_ID);
    expect(roots[0].children.map((child) => child.roleId)).toEqual([
      "A",
      "B",
    ]);
  });

  it("does not add another virtual root when the tree already has one", () => {
    const existingRoot = createVirtualRootNode([
      createNode({ roleId: "A", roleDisplayName: "Direccion" }),
    ]);

    const result = withVirtualRoot([existingRoot]);

    expect(result).toEqual([existingRoot]);
  });

  it("flattens the org chart preserving every node", () => {
    const roots = [
      createNode({
        roleId: "A",
        children: [
          createNode({
            roleId: "B",
            children: [createNode({ roleId: "C" })],
          }),
        ],
      }),
    ];

    expect(flattenOrgChartNodes(roots).map((node) => node.roleId)).toEqual(
      ["A", "B", "C"],
    );
  });

  it("builds graph nodes and links with selection metadata", () => {
    const tree = withVirtualRoot([
      createNode({
        roleId: "A",
        members: [
          {
            workPositionId: "wp-1",
            folio: "DIR-01",
            employeeName: "Alice Doe",
            hasEmployee: true,
            state: "Activo",
          },
        ],
        departmentName: "Direcciones",
        children: [
          createNode({
            roleId: "B",
            roleDisplayName: "Supervisor",
            departmentName: "Operaciones",
            members: [
              {
                workPositionId: "wp-2",
                folio: "SUP-01",
                hasEmployee: false,
                state: "Activo",
              },
            ],
          }),
        ],
      }),
    ]);

    const result = buildOrgChartGraph(tree, {
      selectedOriginId: "A",
      selectedDestId: "B",
    });

    expect(result.nodes.map((node) => node.id)).toEqual(["0", "A", "B"]);
    expect(result.links).toEqual([
      {
        id: "0__A",
        source: "0",
        target: "A",
        data: { sourceId: "0", targetId: "A" },
      },
      {
        id: "A__B",
        source: "A",
        target: "B",
        data: { sourceId: "A", targetId: "B" },
      },
    ]);

    const origin = result.nodes.find((node) => node.id === "A");
    const destination = result.nodes.find((node) => node.id === "B");
    const virtualRoot = result.nodes.find((node) => node.id === "0");

    expect(origin?.data.selectionState).toBe("origin");
    expect(origin?.data.secondaryLabel).toBe("1 miembro · 0 vacantes");
    expect(destination?.data.selectionState).toBe("destination");
    expect(destination?.data.isVacant).toBe(true);
    expect(virtualRoot?.data.isVirtualRoot).toBe(true);
  });
});
