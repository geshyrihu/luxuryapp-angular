import { IWorkPositionOrgChartNode } from "../interfaces/org-chart.interfaces";

/** A partir de cuántos hermanos con el mismo puesto se colapsan en un grupo. */
export const ORG_CHART_GROUP_THRESHOLD = 3;

const GROUP_ID_PREFIX = "GROUP__";
const ROOT_BUCKET_KEY = "__ROOT__";

export function buildOrgChartGroupId(
  parentBucketKey: string,
  roleDisplayName: string,
): string {
  return `${GROUP_ID_PREFIX}${parentBucketKey}__${roleDisplayName}`;
}

/**
 * Agrupa, en cada nivel del árbol, los puestos hermanos sin subordinados
 * propios que comparten el mismo puesto (roleDisplayName) bajo un mismo
 * jefe, cuando su cantidad alcanza el umbral. Los puestos con subordinados
 * nunca se agrupan: fusionarlos ocultaría a quién reporta cada subárbol.
 *
 * Recursiva: la regla se evalúa de forma independiente en cada nivel de la
 * jerarquía, no solo en la raíz.
 */
export function groupSiblingsByRole(
  nodes: IWorkPositionOrgChartNode[],
  expandedGroupIds: ReadonlySet<string>,
  parentBucketKey: string = ROOT_BUCKET_KEY,
  threshold: number = ORG_CHART_GROUP_THRESHOLD,
): IWorkPositionOrgChartNode[] {
  const leaves = nodes.filter((node) => node.children.length === 0);
  const branches = nodes.filter((node) => node.children.length > 0);

  const result: IWorkPositionOrgChartNode[] = branches.map((branch) => ({
    ...branch,
    children: groupSiblingsByRole(
      branch.children,
      expandedGroupIds,
      branch.workPositionId,
      threshold,
    ),
  }));

  const leavesByRole = new Map<string, IWorkPositionOrgChartNode[]>();
  for (const leaf of leaves) {
    const bucket = leavesByRole.get(leaf.roleDisplayName);
    if (bucket) {
      bucket.push(leaf);
    } else {
      leavesByRole.set(leaf.roleDisplayName, [leaf]);
    }
  }

  for (const [roleDisplayName, members] of leavesByRole) {
    if (members.length < threshold) {
      result.push(...members);
      continue;
    }

    const groupId = buildOrgChartGroupId(parentBucketKey, roleDisplayName);
    const isExpanded = expandedGroupIds.has(groupId);
    const first = members[0];

    result.push({
      workPositionId: groupId,
      folio: isExpanded ? `▾ ${members.length} agrupados` : `× ${members.length}`,
      roleDisplayName,
      departmentName: first.departmentName,
      hierarchyLevel: first.hierarchyLevel,
      sortOrder: Math.min(...members.map((m) => m.sortOrder)),
      hasEmployee: false,
      state: first.state,
      children: [],
      isGroup: true,
      groupMemberCount: members.length,
      isGroupExpanded: isExpanded,
    });

    if (isExpanded) {
      result.push(...members);
    }
  }

  return result.sort((a, b) => a.sortOrder - b.sortOrder);
}
