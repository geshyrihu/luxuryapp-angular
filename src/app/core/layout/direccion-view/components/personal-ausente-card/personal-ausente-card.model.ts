export interface AusentePersonaDto {
  employeeName: string;
  roleName: string;
  tipoAusencia: 'Permiso' | 'Vacaciones';
  startDate: string;
  endDate: string;
  diasRestantes: number;
  esActual: boolean;
}

export interface AusenteCustomerGroupDto {
  customerName: string;
  personas: AusentePersonaDto[];
}

export interface PersonalAusenteResumenDto {
  totalPermisos: number;
  totalVacaciones: number;
  customers: AusenteCustomerGroupDto[];
}
