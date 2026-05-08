export type EContractType = 'Indeterminado' | 'Determinado' | 'Temporal' | 'ObraDeterminada' | 'Practicas' | 'Outsourcing' | 'Honorarios';
export type EContractStatus = 'Borrador' | 'Activo' | 'Expirado' | 'Terminado' | 'Cancelado' | 'Suspendido';

export interface WorkContractListDTO {
  id: string;
  contractNumber: string;
  employeeName: string;
  contractType: EContractType;
  contractStatus: EContractStatus;
  startDate: string;
  endDate?: string;
  contractSalary: number;
  createdAt: string;
}

export interface WorkContractDetailDTO extends WorkContractListDTO {
  employeeId: string;
  probationEndDate?: string;
  terminationDate?: string;
  terminationReason?: string;
  lftArticle?: string;
  contractTemplateId?: string;
  contractTemplateName?: string;
  documentContent?: string;
  notes?: string;
}

export interface WorkContractExpiringDTO extends WorkContractListDTO {
  daysRemaining: number;
}

export interface WorkContractAddOrEditDTO {
  employeeId: string;
  contractType: EContractType;
  startDate: string;
  endDate?: string;
  probationEndDate?: string;
  contractSalary: number;
  contractTemplateId?: string;
  notes?: string;
}

export interface WorkContractTerminateDTO {
  terminationDate: string;
  terminationReason: string;
  lftArticle?: string;
}
