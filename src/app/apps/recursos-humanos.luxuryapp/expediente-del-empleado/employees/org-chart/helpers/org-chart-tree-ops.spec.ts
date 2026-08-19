import {
  flattenOrgChartEditorRows,
  findOrgNodeById,
  findOrgParentNode,
  getReorderInstruction,
  getOrgSiblingContext,
} from "./org-chart-tree-ops";
import { IWorkPositionOrgChartNode } from "../interfaces/org-chart.interfaces";

describe("org-chart-tree-ops", () => {
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

  const tree = [
    createNode({
      workPositionId: "A",
      children: [
        createNode({ workPositionId: "B" }),
        createNode({
          workPositionId: "C",
          children: [
            createNode({ workPositionId: "D" }),
            createNode({ workPositionId: "E" }),
          ],
        }),
      ],
    }),
    createNode({ workPositionId: "X" }),
  ];

  it("finds a node by id in deep trees", () => {
    expect(findOrgNodeById(tree, "D")?.workPositionId).toBe("D");
    expect(findOrgNodeById(tree, "ZZ")).toBeNull();
  });

  it("finds the parent of a deep node", () => {
    expect(findOrgParentNode(tree, "D")?.workPositionId).toBe("C");
    expect(findOrgParentNode(tree, "A")).toBeNull();
  });

  it("returns sibling context for nested nodes", () => {
    const context = getOrgSiblingContext(tree, "D");

    expect(context?.parent?.workPositionId).toBe("C");
    expect(context?.siblings.map((node) => node.workPositionId)).toEqual([
      "D",
      "E",
    ]);
    expect(context?.index).toBe(0);
  });

  it("returns root-level siblings when the node has no parent", () => {
    const context = getOrgSiblingContext(tree, "X");

    expect(context?.parent).toBeNull();
    expect(context?.siblings.map((node) => node.workPositionId)).toEqual([
      "A",
      "X",
    ]);
    expect(context?.index).toBe(1);
  });

  it("computes reorder target inside the same sibling collection", () => {
    const origin = getOrgSiblingContext(tree, "D");
    const target = getOrgSiblingContext(tree, "E");

    expect(origin).not.toBeNull();
    expect(target).not.toBeNull();

    const result = getReorderInstruction(
      origin!,
      target!,
      "after",
    );

    expect(result).toEqual({
      newParentId: "C",
      newSortOrder: 1,
    });
  });

  it("computes reorder target across different parents", () => {
    const origin = getOrgSiblingContext(tree, "B");
    const target = getOrgSiblingContext(tree, "X");

    expect(origin).not.toBeNull();
    expect(target).not.toBeNull();

    const result = getReorderInstruction(
      origin!,
      target!,
      "before",
    );

    expect(result).toEqual({
      newParentId: null,
      newSortOrder: 1,
    });
  });

  it("flattens the tree into editor rows preserving hierarchy and sibling order", () => {
    const rows = flattenOrgChartEditorRows(tree);

    expect(rows.map((row) => row.node.workPositionId)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "X",
    ]);
    expect(rows[0]).toMatchObject({
      depth: 0,
      siblingIndex: 0,
      siblingCount: 2,
    });
    expect(rows[3]).toMatchObject({
      depth: 2,
      siblingIndex: 0,
      siblingCount: 2,
    });
    expect(rows[3].parent?.workPositionId).toBe("C");
  });
});
