/**
 * Barrel export del módulo de organigrama jerárquico de roles.
 */

// Componentes
export { OrgChart } from "./org-chart";

// Modelos
export type {
  IOrgChartGraphLink,
  IOrgChartGraphNode,
  IOrgChartGraphNodeData,
  IRoleOrgChartMember,
  IRoleOrgChartNode,
  IRoleOrgChartReassignRequest,
  IWorkPositionReassignResponse,
  ReassignmentValidation,
} from './interfaces/org-chart.interfaces';

export {
  DEPTO_ACCENT_COLORS,
  ORG_CHART_VIRTUAL_ROOT_ID,
} from './interfaces/org-chart.interfaces';

// Helpers
export {
  buildOrgChartGraph,
  createVirtualRootNode,
  flattenOrgChartNodes,
  getDepartmentAccentColor,
  ORG_CHART_NODE_HEIGHT,
  ORG_CHART_NODE_WIDTH,
  withVirtualRoot,
} from "./helpers/org-chart-graph-adapter";
export { validateReassignment } from "./helpers/org-chart-validation";
