export interface AusentePersonaDTO {
  employeeName: string;
  roleName: string;
  tipoAusencia: 'Permiso' | 'Vacaciones';
  startDate: string;
  endDate: string;
  diasRestantes: number;
  esActual: boolean;
}

export interface AusenteCustomerGroupDTO {
  customerName: string;
  personas: AusentePersonaDTO[];
}

export interface PersonalAusenteResumenDTO {
  totalPermisos: number;
  totalVacaciones: number;
  customers: AusenteCustomerGroupDTO[];
}
