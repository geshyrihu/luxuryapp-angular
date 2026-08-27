import { IRoleOrgChartNode } from '../interfaces/org-chart.interfaces';

export interface IOrgChartSiblingContext {
  node: IRoleOrgChartNode;
  parent: IRoleOrgChartNode | null;
  siblings: IRoleOrgChartNode[];
  index: number;
}

export interface IOrgChartReorderInstruction {
  newParentId: string | null;
  newSortOrder: number;
}

export function findOrgNodeById(
  nodes: IRoleOrgChartNode[],
  roleId: string,
): IRoleOrgChartNode | null {
  for (const node of nodes) {
    if (node.roleId === roleId) {
      return node;
    }

    const nested = findOrgNodeById(node.children, roleId);
    if (nested) {
      return nested;
    }
  }

  return null;
}

export function findOrgParentNode(
  nodes: IRoleOrgChartNode[],
  roleId: string,
): IRoleOrgChartNode | null {
  for (const node of nodes) {
    if (node.children.some((child) => child.roleId === roleId)) {
      return node;
    }

    const nested = findOrgParentNode(node.children, roleId);
    if (nested) {
      return nested;
    }
  }

  return null;
}

export function getOrgSiblingContext(
  nodes: IRoleOrgChartNode[],
  roleId: string,
): IOrgChartSiblingContext | null {
  const parent = findOrgParentNode(nodes, roleId);
  const siblings = parent ? parent.children : nodes;
  const index = siblings.findIndex((node) => node.roleId === roleId);

  if (index === -1) {
    return null;
  }

  return {
    node: siblings[index],
    parent,
    siblings,
    index,
  };
}

export function getReorderInstruction(
  origin: IOrgChartSiblingContext,
  target: IOrgChartSiblingContext,
  placement: "before" | "after",
): IOrgChartReorderInstruction {
  const newParentId = target.parent?.roleId ?? null;
  let newSortOrder = target.index + (placement === "after" ? 1 : 0);

  const sameSiblingCollection =
    (origin.parent?.roleId ?? null) ===
    (target.parent?.roleId ?? null);

  if (sameSiblingCollection && origin.index < newSortOrder) {
    newSortOrder -= 1;
  }

  return {
    newParentId,
    newSortOrder,
  };
}
