import { validateReassignment } from "./org-chart-validation";
import { IRoleOrgChartNode } from "../interfaces/org-chart.interfaces";

describe("org-chart-validation", () => {
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

  it("allows moving a node to the virtual root", () => {
    const dragged = createNode({ roleId: "A" });
    const target = createNode({ roleId: "0" });

    expect(validateReassignment(dragged, target)).toEqual({ valid: true });
  });

  it("prevents self assignment", () => {
    const node = createNode({ roleId: "A" });

    expect(validateReassignment(node, node)).toEqual({
      valid: false,
      reason: "No puedes asignar un rol como su propio superior",
    });
  });

  it("prevents assigning a node under a deep descendant", () => {
    const dragged = createNode({
      roleId: "A",
      children: [
        createNode({
          roleId: "B",
          children: [
            createNode({
              roleId: "C",
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
      roleId: "A",
      children: [createNode({ roleId: "B" })],
    });
    const target = createNode({
      roleId: "X",
      children: [createNode({ roleId: "Y" })],
    });

    expect(validateReassignment(dragged, target)).toEqual({ valid: true });
  });
});
