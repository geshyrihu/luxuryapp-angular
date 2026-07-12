import { IWorkPositionOrgChartNode } from '../interfaces/org-chart.interfaces';

export interface IOrgChartSiblingContext {
  node: IWorkPositionOrgChartNode;
  parent: IWorkPositionOrgChartNode | null;
  siblings: IWorkPositionOrgChartNode[];
  index: number;
}

export interface IOrgChartEditorRow {
  node: IWorkPositionOrgChartNode;
  parent: IWorkPositionOrgChartNode | null;
  depth: number;
  siblingIndex: number;
  siblingCount: number;
}

export interface IOrgChartReorderInstruction {
  newParentId: string | null;
  newSortOrder: number;
}

export function flattenOrgChartEditorRows(
  nodes: IWorkPositionOrgChartNode[],
  parent: IWorkPositionOrgChartNode | null = null,
  depth = 0,
): IOrgChartEditorRow[] {
  return nodes.flatMap((node, index, siblings) => [
    {
      node,
      parent,
      depth,
      siblingIndex: index,
      siblingCount: siblings.length,
    },
    ...flattenOrgChartEditorRows(node.children, node, depth + 1),
  ]);
}

export function findOrgNodeById(
  nodes: IWorkPositionOrgChartNode[],
  workPositionId: string,
): IWorkPositionOrgChartNode | null {
  for (const node of nodes) {
    if (node.workPositionId === workPositionId) {
      return node;
    }

    const nested = findOrgNodeById(node.children, workPositionId);
    if (nested) {
      return nested;
    }
  }

  return null;
}

export function findOrgParentNode(
  nodes: IWorkPositionOrgChartNode[],
  workPositionId: string,
): IWorkPositionOrgChartNode | null {
  for (const node of nodes) {
    if (node.children.some((child) => child.workPositionId === workPositionId)) {
      return node;
    }

    const nested = findOrgParentNode(node.children, workPositionId);
    if (nested) {
      return nested;
    }
  }

  return null;
}

export function getOrgSiblingContext(
  nodes: IWorkPositionOrgChartNode[],
  workPositionId: string,
): IOrgChartSiblingContext | null {
  const parent = findOrgParentNode(nodes, workPositionId);
  const siblings = parent ? parent.children : nodes;
  const index = siblings.findIndex((node) => node.workPositionId === workPositionId);

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
  const newParentId = target.parent?.workPositionId ?? null;
  let newSortOrder = target.index + (placement === "after" ? 1 : 0);

  const sameSiblingCollection =
    (origin.parent?.workPositionId ?? null) ===
    (target.parent?.workPositionId ?? null);

  if (sameSiblingCollection && origin.index < newSortOrder) {
    newSortOrder -= 1;
  }

  return {
    newParentId,
    newSortOrder,
  };
}
