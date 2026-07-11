export interface VacanteItemDto {
  folio: number;
  requestDate: string;
  diasPendiente: number;
  status: string;
}

export interface VacanteRoleGroupDto {
  roleName: string;
  count: number;
  items: VacanteItemDto[];
}

export interface VacanteCustomerGroupDto {
  customerName: string;
  total: number;
  roles: VacanteRoleGroupDto[];
}

export interface VacantesResumenDto {
  total: number;
  customers: VacanteCustomerGroupDto[];
}
