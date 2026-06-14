import { validateReassignment } from "./org-chart-validation";
import { IWorkPositionOrgChartNode } from "../models/org-chart.interfaces";

describe("org-chart-validation", () => {
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

  it("allows moving a node to the virtual root", () => {
    const dragged = createNode({ workPositionId: "A" });
    const target = createNode({ workPositionId: "0" });

    expect(validateReassignment(dragged, target)).toEqual({ valid: true });
  });

  it("prevents self assignment", () => {
    const node = createNode({ workPositionId: "A" });

    expect(validateReassignment(node, node)).toEqual({
      valid: false,
      reason: "No puedes asignar un puesto como su propio jefe",
    });
  });

  it("prevents assigning a node under a deep descendant", () => {
    const dragged = createNode({
      workPositionId: "A",
      children: [
        createNode({
          workPositionId: "B",
          reportsToWorkPositionId: "A",
          children: [
            createNode({
              workPositionId: "C",
              reportsToWorkPositionId: "B",
            }),
          ],
        }),
      ],
    });

    const deepDescendant = dragged.children[0].children[0];

    expect(validateReassignment(dragged, deepDescendant)).toEqual({
      valid: false,
      reason: "No puedes reportar a uno de tus subordinados actuales (ciclo)",
    });
  });

  it("allows moving a node under a different branch", () => {
    const dragged = createNode({
      workPositionId: "A",
      children: [createNode({ workPositionId: "B" })],
    });
    const target = createNode({
      workPositionId: "X",
      children: [createNode({ workPositionId: "Y" })],
    });

    expect(validateReassignment(dragged, target)).toEqual({ valid: true });
  });
});
