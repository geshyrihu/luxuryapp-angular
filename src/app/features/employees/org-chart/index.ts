/**
 * Barrel export del módulo de organigrama jerárquico de puestos.
 */

// Componentes
export { OrgChart } from "./components/org-chart/org-chart";

// Modelos
export type {
  IWorkPositionOrgChartNode,
  IOrgChartTreeNode,
  IWorkPositionReassignRequest,
  IWorkPositionReassignResponse,
  ReassignmentValidation,
} from "./models/org-chart.interfaces";

export { DEPTO_BORDER_COLORS } from "./models/org-chart.interfaces";

// Helpers
export { validateReassignment } from "./helpers/org-chart-validation";
