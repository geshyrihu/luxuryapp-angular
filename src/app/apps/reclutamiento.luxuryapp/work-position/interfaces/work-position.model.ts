export interface IWorkPosition {
  id: string;
  /** Null cuando el usuario autenticado no tiene canViewSensitiveData (motor de políticas RRHH). */
  folio: string | null;
  applicationRoleId: string;
  applicationRoleName: string;
  turno: string;
  /** Null cuando el usuario autenticado no tiene canViewSensitiveData (motor de políticas RRHH). */
  sueldoBase: string | null;
  /** Null cuando el usuario autenticado no tiene canViewSensitiveData (motor de políticas RRHH). */
  sueldo: string | null;
  /** ID del ApplicationUser asignado al puesto (Employee.UserId). */
  applicationUserId: string | null;
  applicationUser: string | null;
  applicationUserPhoto: string | null;
  /** ID del registro Employee (Employee.Id) é para navegar al formulario de edición. */
  employeeId: string | null;
  /** Departament como entero. Null si el puesto no tiene ApplicationRole asignado. */
  departament: number | null;
  jobDescriptionId: string | null;
  state: number;
  benefits: string | null;
  hasPendingDocuments?: boolean;
  isOverdueDocuments?: boolean;
  positionRequest: {
    id: string | null;
    status: number;
    folio: number | null;
  } | null;
  /** Solicitud de baja vigente (Pendiente/Proceso) asociada al puesto. Folio puede ser null cuando el usuario no puede ver datos confidenciales. */
  requestDismissal: {
    id: string;
    status: number;
    statusName: string;
    folio: number | null;
  } | null;
  /** Solicitud de modificación salarial vigente (Pendiente/Proceso) asociada al puesto. Folio puede ser null cuando el usuario no puede ver datos confidenciales. */
  requestSalaryModification: {
    id: string;
    status: number;
    statusName: string;
    folio: number | null;
  } | null;
  /** Backend-Driven UI (motor de políticas RRHH) — Angular solo obedece estos booleanos, nunca calcula permisos por rol. */
  canRequestDismissal: boolean;
  canRequestVacancy: boolean;
  canModifySalary: boolean;
  canViewSensitiveData: boolean;
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
  jobDescriptionId: string | null;
  workPositionScheduleId: string | null;
  workPositionScheduleName: string | null;
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
