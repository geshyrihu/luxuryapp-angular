export interface IWorkPosition {
  id: string;
  folio: string;
  applicationRoleId: string;
  applicationRoleName: string;
  turno: string;
  sueldoBase: string;
  sueldo: string;
  /** ID del ApplicationUser asignado al puesto (Employee.UserId). */
  applicationUserId: string | null;
  applicationUser: string | null;
  applicationUserPhoto: string | null;
  /** ID del registro Employee (Employee.Id) é para navegar al formulario de edición. */
  employeeId: string | null;
  /** EDepartament como entero. Null si el puesto no tiene ApplicationRole asignado. */
  departament: number | null;
  jobDescriptionId: string | null;
  state: number;
  benefits: string | null;
  positionRequest: {
    id: string | null;
    status: number;
  } | null;
}

export interface IWorkPositionForm {
  id: string;
  customerId: string;
  folio: string;
  applicationRoleId: string;
  applicationRoleName: string | null;
  sueldo: number;
  sueldoBase: number;
  state: boolean | null;
  employeeId: string | null;
  employeeName: string | null;
  turnoTrabajo: number;
  lunesEntrada: string;
  lunesSalida: string;
  martesEntrada: string;
  martesSalida: string;
  miercolesEntrada: string;
  miercolesSalida: string;
  juevesEntrada: string;
  juevesSalida: string;
  viernesEntrada: string;
  viernesSalida: string;
  sabadoEntrada: string;
  sabadoSalida: string;
  domingoEntrada: string;
  domingoSalida: string;
  jobDescriptionId: string | null;
  workScheduleId: string | null;
  observationsWorkShift: string;
  benefits: string;
}

export interface IWorkPositionHours {
  turnoTrabajo: string;
  lunesEntrada: string | null;
  lunesSalida: string | null;
  martesEntrada: string | null;
  martesSalida: string | null;
  miercolesEntrada: string | null;
  miercolesSalida: string | null;
  juevesEntrada: string | null;
  juevesSalida: string | null;
  viernesEntrada: string | null;
  viernesSalida: string | null;
  sabadoEntrada: string | null;
  sabadoSalida: string | null;
  domingoEntrada: string | null;
  domingoSalida: string | null;
}
