import { IWorkPositionOrgChartNode, ReassignmentValidation } from "../models/org-chart.interfaces";

/**
 * Valida si una reasignación de jerarquía de puestos es segura (client-side).
 *
 * Reglas:
 *  1. No auto-asignación (A ? A)
 *  2. No ciclos (A reporta a B, B no puede reportar a A)
 *  3. No reasignar a descendiente
 *
 * @param dragged Puesto que esté siendo movido
 * @param target  Puesto destino (null = convertir en root)
 * @returns Objeto con valid y reason si es invólido
 */
export function validateReassignment(
  dragged: IWorkPositionOrgChartNode,
  target: IWorkPositionOrgChartNode | null
): ReassignmentValidation {
  // Destino es el nodo raóz virtual o nulo
  if (!target || target.workPositionId === "0") return { valid: true };

  if (dragged.workPositionId === target.workPositionId) {
    return { valid: false, reason: "No puedes asignar un puesto como su propio jefe" };
  }

  const hasNodeInSubtree = (
    node: IWorkPositionOrgChartNode,
    targetWorkPositionId: string,
  ): boolean => {
    if (node.workPositionId === targetWorkPositionId) {
      return true;
    }

    return node.children.some((child) =>
      hasNodeInSubtree(child, targetWorkPositionId),
    );
  };

  if (hasNodeInSubtree(dragged, target.workPositionId)) {
    return { valid: false, reason: "No puedes reportar a uno de tus subordinados actuales (ciclo)" };
  }

  return { valid: true };
}
