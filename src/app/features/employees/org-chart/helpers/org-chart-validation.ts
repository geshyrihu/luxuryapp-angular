import { IWorkPositionOrgChartNode, ReassignmentValidation } from "../models/org-chart.interfaces";

/**
 * Valida si una reasignación de jerarquía de puestos es segura (client-side).
 *
 * Reglas:
 *  1. No auto-asignación (A → A)
 *  2. No ciclos (A reporta a B, B no puede reportar a A)
 *  3. No reasignar a descendiente
 *
 * @param dragged Puesto que está siendo movido
 * @param target  Puesto destino (null = convertir en root)
 * @returns Objeto con valid y reason si es inválido
 */
export function validateReassignment(
  dragged: IWorkPositionOrgChartNode,
  target: IWorkPositionOrgChartNode | null
): ReassignmentValidation {
  // Destino es el nodo raíz virtual o nulo
  if (!target || target.workPositionId === "0") return { valid: true };

  if (dragged.workPositionId === target.workPositionId) {
    return { valid: false, reason: "No puedes asignar un puesto como su propio jefe" };
  }

  const hasInSubtree = (node: IWorkPositionOrgChartNode, ancestorId: string): boolean => {
    // Si el nodo actual es el virtual, no tiene hijos reales en el árbol original
    if (node.workPositionId === "0") return false;
    
    if (node.reportsToWorkPositionId === ancestorId) return true;
    return node.children.some((child) => hasInSubtree(child, ancestorId));
  };

  if (hasInSubtree(target, dragged.workPositionId)) {
    return { valid: false, reason: "No puedes reportar a uno de tus subordinados actuales (ciclo)" };
  }

  return { valid: true };
}
