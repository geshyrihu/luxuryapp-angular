export type EContractType =
  | 'Indeterminado'
  | 'Determinado'
  | 'Temporal'
  | 'ObraDeterminada'
  | 'Practicas'
  | 'Outsourcing'
  | 'Honorarios';

export type EContractStatus =
  | 'Borrador'
  | 'Activo'
  | 'Expirado'
  | 'Terminado'
  | 'Cancelado'
  | 'Suspendido'
  | 'PendienteFirma'
  | 'Firmado';

export interface EmployeeWorkContractListDTO {
  id: string;
  employeeId: string;
  employeeName: string;
  workPositionId: string;
  workPositionName: string;
  contractNumber: string;
  pdfFilePath: string;
  pdfUrl: string;
  contractType: EContractType;
  status: EContractStatus;
  startDate: string;
  endDate?: string;
  salaryAtContract: number;
  notes: string;
  createdAt: string;
}

export interface EmployeeWorkContractDetailDTO extends EmployeeWorkContractListDTO {}

export interface EmployeeWorkContractAddOrEditDTO {
  employeeId: string;
  workPositionId: string;
  contractNumber: string;
  contractType: EContractType;
  startDate: string;
  endDate?: string;
  salaryAtContract: number;
  notes?: string;
}

export interface EmployeeWorkContractTerminateDTO {
  terminationReason: string;
}
