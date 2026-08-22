import { IRoleOrgChartNode, ORG_CHART_VIRTUAL_ROOT_ID, ReassignmentValidation } from '../interfaces/org-chart.interfaces';

/**
 * Valida si una reasignación de jerarquía de roles es segura (client-side).
 *
 * Reglas:
 *  1. No auto-asignación (A -> A)
 *  2. No ciclos (A reporta a B, B no puede reportar a A)
 *  3. No reasignar a descendiente
 *
 * @param dragged Rol que está siendo movido
 * @param target  Rol destino (null = convertir en raíz)
 * @returns Objeto con valid y reason si es inválido
 */
export function validateReassignment(
  dragged: IRoleOrgChartNode,
  target: IRoleOrgChartNode | null
): ReassignmentValidation {
  // Destino es el nodo raíz virtual o nulo.
  if (!target || target.roleId === ORG_CHART_VIRTUAL_ROOT_ID) return { valid: true };

  if (dragged.roleId === target.roleId) {
    return { valid: false, reason: "No puedes asignar un rol como su propio superior" };
  }

  const hasNodeInSubtree = (
    node: IRoleOrgChartNode,
    targetRoleId: string,
  ): boolean => {
    if (node.roleId === targetRoleId) {
      return true;
    }

    return node.children.some((child) =>
      hasNodeInSubtree(child, targetRoleId),
    );
  };

  if (hasNodeInSubtree(dragged, target.roleId)) {
    return { valid: false, reason: "No puedes reportar a uno de tus subordinados actuales (ciclo)" };
  }

  return { valid: true };
}
