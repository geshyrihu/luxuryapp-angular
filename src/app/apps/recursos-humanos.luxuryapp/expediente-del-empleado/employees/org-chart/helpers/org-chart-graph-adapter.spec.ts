import {
  buildOrgChartGraph,
  createVirtualRootNode,
  flattenOrgChartNodes,
  withVirtualRoot,
} from "./org-chart-graph-adapter";
import {
  IWorkPositionOrgChartNode,
  ORG_CHART_VIRTUAL_ROOT_ID,
} from "../interfaces/org-chart.interfaces";

describe("org-chart-graph-adapter", () => {
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

  it("wraps multiple roots with the virtual root", () => {
    const roots = withVirtualRoot([
      createNode({ workPositionId: "A", folio: "DIR-01" }),
      createNode({ workPositionId: "B", folio: "DIR-02" }),
    ]);

    expect(roots).toHaveLength(1);
    expect(roots[0].workPositionId).toBe(ORG_CHART_VIRTUAL_ROOT_ID);
    expect(roots[0].children.map((child) => child.workPositionId)).toEqual([
      "A",
      "B",
    ]);
  });

  it("does not add another virtual root when the tree already has one", () => {
    const existingRoot = createVirtualRootNode([
      createNode({ workPositionId: "A", folio: "DIR-01" }),
    ]);

    const result = withVirtualRoot([existingRoot]);

    expect(result).toEqual([existingRoot]);
  });

  it("flattens the org chart preserving every node", () => {
    const roots = [
      createNode({
        workPositionId: "A",
        children: [
          createNode({
            workPositionId: "B",
            children: [createNode({ workPositionId: "C" })],
          }),
        ],
      }),
    ];

    expect(flattenOrgChartNodes(roots).map((node) => node.workPositionId)).toEqual(
      ["A", "B", "C"],
    );
  });

  it("builds graph nodes and links with selection metadata", () => {
    const tree = withVirtualRoot([
      createNode({
        workPositionId: "A",
        folio: "DIR-01",
        employeeName: "Alice Doe",
        hasEmployee: true,
        departmentName: "Direcciones",
        children: [
          createNode({
            workPositionId: "B",
            folio: "SUP-01",
            roleDisplayName: "Supervisor",
            departmentName: "Operaciones",
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
    expect(destination?.data.selectionState).toBe("destination");
    expect(virtualRoot?.data.isVirtualRoot).toBe(true);
  });
});
