// ── Listado ───────────────────────────────────────────────────────────────────

export interface EmployeeFileSummaryDTO {
  id: string;
  userId: string;
  fullName: string;
  numberEmployee?: number;
  puesto: string;
  departamento: string;
  isActive: boolean;
  photoUrl?: string;
}

// ── Cabecera ──────────────────────────────────────────────────────────────────

export interface EmployeeFileHeaderDTO {
  id: string;
  userId: string;
  fullName: string;
  numberEmployee?: number;
  email: string;
  phoneNumber: string;
  puesto: string;
  departamento: string;
  dateAdmission?: string;
  isActive: boolean;
  photoUrl?: string;
}

// ── Tab 1: Datos personales ───────────────────────────────────────────────────

export interface EmployeeFilePersonalDataDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneNumberPrefix: string;
  localPhone?: string;
  birth?: string;
  curp?: string;
  rfc?: string;
  nss?: string;
  sex?: string;
  bloodType?: string;
  nationality?: string;
  maritalStatus?: string;
  educationLevel?: string;
  dateAdmission?: string;
  salary: number;
}

// ── Tab 2: Contactos de emergencia ────────────────────────────────────────────

export interface EmployeeFileEmergencyContactDTO {
  id: string;
  nameContact: string;
  phoneNumber: string;
  relation: string;
  contactOfBeneficiary: string;
}

// ── Tab 3: Datos clínicos ─────────────────────────────────────────────────────

export interface EmployeeFileClinicalDataDTO {
  id: string;
  name: string;
  description: string;
}

// ── Tab 4: Datos bancarios ────────────────────────────────────────────────────

export interface EmployeeFileBankDataDTO {
  id: string;
  bankName: string;
  bankAccount: string;
  bankKey: string;
  nameContact: string;
  phoneNumber: string;
  relacion?: string;
}

// ── Tab 5: Contratos ──────────────────────────────────────────────────────────

export interface EmployeeFileContractDTO {
  id: string;
  contractNumber: string;
  contractType: string;
  contractStatus: string;
  startDate: string;
  endDate?: string;
  probationEndDate?: string;
  contractSalary: number;
  terminationDate?: string;
  terminationReason?: string;
  notes?: string;
  createdAt: string;
}

// ── Tab 6: Posición y salario ─────────────────────────────────────────────────

export interface EmployeeFileSalaryModDTO {
  id: string;
  folio: number;
  puestoAnterior: string;
  puestoNuevo: string;
  salarioAnterior: number;
  salarioNuevo: number;
  retroactive: boolean;
  requestDate: string;
  executionDate: string;
  status: string;
}

export interface EmployeeFileWorkPositionDTO {
  puesto: string;
  departamento: string;
  folio?: string;
  sueldoBase: number;
  turnoTrabajo: string;
  state: string;
  salaryModifications: EmployeeFileSalaryModDTO[];
}

// ── Tab 7: Vacaciones y permisos ──────────────────────────────────────────────

export interface EmployeeFileVacationDTO {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  requestDate: string;
  reason?: string;
  paidVacationBonus: boolean;
}

export interface EmployeeFileLeaveDTO {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  requestDate: string;
  reason?: string;
  paidStatus: string;
}

export interface EmployeeFileVacationsLeavesDTO {
  vacations: EmployeeFileVacationDTO[];
  leaves: EmployeeFileLeaveDTO[];
}

// ── Tab 8: Incidencias ────────────────────────────────────────────────────────

export interface EmployeeFileIncidentSanctionDTO {
  sanctionTypeName: string;
  sanctionStatus: string;
  appliedDate: string;
  effectiveStartDate: string;
}

export interface EmployeeFileIncidentDTO {
  id: string;
  incidentTypeName: string;
  category: string;
  severityLevel: string;
  investigationStatus: string;
  incidentDateTime: string;
  sanctionApplied: boolean;
  isCancelled: boolean;
  isActGenerated: boolean;
  administrativeActPdfUrl?: string;
  sanction?: EmployeeFileIncidentSanctionDTO;
}

// ── Tab 9: Evaluaciones ───────────────────────────────────────────────────────

export interface EmployeeFileEvaluationDTO {
  id: string;
  templateName: string;
  evaluatorName: string;
  evaluationDate: string;
  status: string;
  finalScore?: number;
  finalComments?: string;
}

// ── Tab 10: Solicitudes ───────────────────────────────────────────────────────

export interface EmployeeFileRegisterRequestDTO {
  id: string;
  folio: number;
  typeContractRegister: string;
  status: string;
  requestDate: string;
  executionDate?: string;
  fuente: string;
  confirmationFinish: boolean;
}

export interface RequestDismissalFileDTO {
  id: string;
  fileName: string;
  fileUrl: string;
}

export interface EmployeeFileDismissalDTO {
  id: string;
  folio: number;
  reasonForLeaving: string;
  tipoBaja: string;
  requestDate: string;
  executionDate: string;
  lastDayOfWork?: string;
  status: string;
  lawyerAssistance: boolean;
  isAuthorizedByLegal: boolean;
  isAuthorizedByPayroll: boolean;
  legalAuthorizationDate?: string;
  payrollAuthorizationDate?: string;
  incidents: EmployeeFileIncidentDTO[];
  evaluations: EmployeeFileEvaluationDTO[];
  supportFiles: RequestDismissalFileDTO[];
}

export interface EmployeeFileRequestsDTO {
  registerRequest?: EmployeeFileRegisterRequestDTO;
  dismissalRequest?: EmployeeFileDismissalDTO;
}
