import {
  DEPTO_ACCENT_COLORS,
  IOrgChartGraphLink,
  IOrgChartGraphNode,
  IWorkPositionOrgChartNode,
  ORG_CHART_VIRTUAL_ROOT_ID,
} from '../interfaces/org-chart.interfaces';

export const ORG_CHART_NODE_WIDTH = 260;
export const ORG_CHART_NODE_HEIGHT = 146;

export interface IOrgChartGraphBuildOptions {
  selectedOriginId?: string | null;
  selectedDestId?: string | null;
}

export interface IOrgChartGraphBuildResult {
  nodes: IOrgChartGraphNode[];
  links: IOrgChartGraphLink[];
}

export function createVirtualRootNode(
  children: IWorkPositionOrgChartNode[],
): IWorkPositionOrgChartNode {
  return {
    workPositionId: ORG_CHART_VIRTUAL_ROOT_ID,
    folio: "ROOT",
    roleDisplayName: "Estructura Organizacional",
    departmentName: "Direcciones",
    hierarchyLevel: -1,
    sortOrder: 0,
    hasEmployee: false,
    employeeName: "Luxury App",
    state: "Activo",
    children,
  };
}

export function withVirtualRoot(
  nodes: IWorkPositionOrgChartNode[],
): IWorkPositionOrgChartNode[] {
  if (
    nodes.length > 1 ||
    (nodes.length === 1 &&
      nodes[0].workPositionId !== ORG_CHART_VIRTUAL_ROOT_ID)
  ) {
    return [createVirtualRootNode(nodes)];
  }

  return nodes;
}

export function flattenOrgChartNodes(
  nodes: IWorkPositionOrgChartNode[],
): IWorkPositionOrgChartNode[] {
  return nodes.flatMap((node) => [node, ...flattenOrgChartNodes(node.children)]);
}

export function buildOrgChartGraph(
  nodes: IWorkPositionOrgChartNode[],
  options: IOrgChartGraphBuildOptions = {},
): IOrgChartGraphBuildResult {
  const graphNodes: IOrgChartGraphNode[] = [];
  const graphLinks: IOrgChartGraphLink[] = [];

  const visit = (node: IWorkPositionOrgChartNode): void => {
    const selectionState =
      node.workPositionId === options.selectedOriginId
        ? "origin"
        : node.workPositionId === options.selectedDestId
          ? "destination"
          : "none";

    graphNodes.push({
      id: node.workPositionId,
      label: node.folio,
      dimension: {
        width: ORG_CHART_NODE_WIDTH,
        height: ORG_CHART_NODE_HEIGHT,
      },
      data: {
        orgNode: node,
        accentColor: getDepartmentAccentColor(node.departmentName),
        secondaryLabel: node.employeeName ?? "Vacante",
        isVacant: !node.hasEmployee,
        isVirtualRoot: node.workPositionId === ORG_CHART_VIRTUAL_ROOT_ID,
        selectionState,
      },
    });

    for (const child of node.children) {
      graphLinks.push({
        id: `${node.workPositionId}__${child.workPositionId}`,
        source: node.workPositionId,
        target: child.workPositionId,
        data: {
          sourceId: node.workPositionId,
          targetId: child.workPositionId,
        },
      });

      visit(child);
    }
  };

  for (const node of nodes) {
    visit(node);
  }

  return {
    nodes: graphNodes,
    links: graphLinks,
  };
}

export function getDepartmentAccentColor(departmentName?: string): string {
  if (!departmentName) {
    return "#94a3b8";
  }

  return DEPTO_ACCENT_COLORS[departmentName] ?? "#94a3b8";
}
