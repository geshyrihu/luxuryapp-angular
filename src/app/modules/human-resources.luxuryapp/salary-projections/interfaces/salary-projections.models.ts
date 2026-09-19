// 🧮 Contratos del módulo de proyección de sueldos.

export interface IFederalVacationParameter {
  id: string;
  yearsOfService: number;
  vacationDays: number;
}

export interface IStateTaxParameter {
  id: string;
  state: number;
  employerPayrollTaxPercentage: number;
}

export interface ISalaryProjectionItem {
  id: string;
  salaryProjectionScenarioId: string;
  isNewPosition: boolean;
  workPositionId: string | null;
  employeeId: string | null;
  positionTitle: string;
  baseSalary: number;
  rcvEmployerFee: number;
  infonavitEmployerFee: number;
  imssEmployerFee: number;
  isTaxableForPayrollTax: boolean;
}

export interface ISalaryProjectionScenario {
  id: string;
  salaryProjectionId: string;
  name: string;
  description: string;
  items: ISalaryProjectionItem[];
}

export interface ISalaryProjection {
  id: string;
  customerId: string;
  folio: string;
  name: string;
  state: number;
  createdAt: string;
  scenarios: ISalaryProjectionScenario[];
}

export interface ISalaryProjectionItemSimulation {
  itemId: string;
  seniorityYears: number;
  vacationDays: number;
  dailySalary: number;
  monthlySalary: number;
  vacationPremium: number;
  sundayPremium: number;
  christmasBonus: number;
  monthlyPerceptions: number;
  employerPayrollTax: number;
  totalEmployerCost: number;
}

export interface ISimulateSalaryProjectionItem {
  itemId: string;
  isNewPosition: boolean;
  employeeId: string | null;
  baseSalary: number;
  rcvEmployerFee: number;
  infonavitEmployerFee: number;
  imssEmployerFee: number;
}

export interface ISimulateSalaryProjectionRequest {
  cutOffDate: string;
  items: ISimulateSalaryProjectionItem[];
}

export interface ISalaryProjectionItemInput {
  workPositionId: string | null;
  employeeId: string | null;
  isNewPosition: boolean;
  positionTitle: string;
  baseSalary: number;
  rcvEmployerFee: number;
  infonavitEmployerFee: number;
  imssEmployerFee: number;
  isTaxableForPayrollTax: boolean;
}

export interface ISalaryProjectionScenarioInput {
  name: string;
  description: string;
  items: ISalaryProjectionItemInput[];
}

export interface ICreateSalaryProjection {
  name: string;
  folio: string;
  scenarios: ISalaryProjectionScenarioInput[];
}

export interface IUpdateSalaryProjection {
  name: string;
  state: number;
  scenarios: ISalaryProjectionScenarioInput[];
}

/** Estados de la propuesta (espejo de ProposalStatus del backend). */
export const SALARY_PROJECTION_STATES = [
  { id: 0, text: "Borrador", severity: "secondary" },
  { id: 1, text: "Enviado", severity: "info" },
  { id: 2, text: "En revisión", severity: "warn" },
  { id: 3, text: "Aprobado", severity: "success" },
  { id: 4, text: "Rechazado", severity: "danger" },
  { id: 5, text: "Cancelado", severity: "secondary" },
] as const;

/** Entidades federativas (espejo de MexicanStateEnum del backend). */
export const MEXICAN_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
] as const;

export function salaryProjectionStateText(state: number): string {
  return SALARY_PROJECTION_STATES.find((item) => item.id === state)?.text ?? "—";
}

export function salaryProjectionStateSeverity(
  state: number,
): "success" | "info" | "warn" | "danger" | "secondary" {
  return SALARY_PROJECTION_STATES.find((item) => item.id === state)?.severity ?? "secondary";
}

export function mexicanStateText(state: number): string {
  return MEXICAN_STATES[state] ?? "—";
}

export interface ISalaryProjectionItemEdit {
  id: string;
  isNewPosition: boolean;
  employeeId: string | null;
  positionTitle: string;
  baseSalary: number;
  rcvEmployerFee: number;
  infonavitEmployerFee: number;
  imssEmployerFee: number;
  isTaxableForPayrollTax: boolean;
}
