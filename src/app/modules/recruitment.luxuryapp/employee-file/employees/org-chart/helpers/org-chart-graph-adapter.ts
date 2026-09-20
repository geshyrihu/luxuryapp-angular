import {
  DEPTO_ACCENT_COLORS,
  IOrgChartGraphLink,
  IOrgChartGraphNode,
  IRoleOrgChartNode,
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
  children: IRoleOrgChartNode[],
): IRoleOrgChartNode {
  return {
    roleId: ORG_CHART_VIRTUAL_ROOT_ID,
    roleDisplayName: "Estructura Organizacional",
    departmentName: "Direcciones",
    hierarchyLevel: -1,
    sortOrder: 0,
    members: [],
    children,
  };
}

export function withVirtualRoot(
  nodes: IRoleOrgChartNode[],
): IRoleOrgChartNode[] {
  if (
    nodes.length > 1 ||
    (nodes.length === 1 &&
      nodes[0].roleId !== ORG_CHART_VIRTUAL_ROOT_ID)
  ) {
    return [createVirtualRootNode(nodes)];
  }

  return nodes;
}

export function flattenOrgChartNodes(
  nodes: IRoleOrgChartNode[],
): IRoleOrgChartNode[] {
  return nodes.flatMap((node) => [node, ...flattenOrgChartNodes(node.children)]);
}

export function buildOrgChartGraph(
  nodes: IRoleOrgChartNode[],
  options: IOrgChartGraphBuildOptions = {},
): IOrgChartGraphBuildResult {
  const graphNodes: IOrgChartGraphNode[] = [];
  const graphLinks: IOrgChartGraphLink[] = [];

  const visit = (node: IRoleOrgChartNode): void => {
    const memberCount = node.members.length;
    const vacantCount = node.members.filter((member) => !member.hasEmployee).length;
    const selectionState =
      node.roleId === options.selectedOriginId
        ? "origin"
        : node.roleId === options.selectedDestId
          ? "destination"
          : "none";

    graphNodes.push({
      id: node.roleId,
      label: node.roleDisplayName,
      dimension: {
        width: ORG_CHART_NODE_WIDTH,
        height: ORG_CHART_NODE_HEIGHT,
      },
      data: {
        orgNode: node,
        accentColor: getDepartmentAccentColor(node.departmentName),
        secondaryLabel: `${memberCount} ${memberCount === 1 ? "miembro" : "miembros"} · ${vacantCount} vacantes`,
        isVacant: !node.members.some((member) => member.hasEmployee),
        isVirtualRoot: node.roleId === ORG_CHART_VIRTUAL_ROOT_ID,
        selectionState,
      },
    });

    for (const child of node.children) {
      graphLinks.push({
        id: `${node.roleId}__${child.roleId}`,
        source: node.roleId,
        target: child.roleId,
        data: {
          sourceId: node.roleId,
          targetId: child.roleId,
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

const DEPT_ACCENT_FALLBACK = "var(--ds-dept-default)";

export function getDepartmentAccentColor(departmentName?: string): string {
  if (!departmentName) {
    return DEPT_ACCENT_FALLBACK;
  }

  return DEPTO_ACCENT_COLORS[departmentName] ?? DEPT_ACCENT_FALLBACK;
}
