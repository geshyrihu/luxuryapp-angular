export interface VacanteItemDTO {
  folio: number;
  requestDate: string;
  diasPendiente: number;
  status: string;
}

export interface VacanteRoleGroupDTO {
  roleName: string;
  count: number;
  items: VacanteItemDTO[];
}

export interface VacanteCustomerGroupDTO {
  customerName: string;
  total: number;
  roles: VacanteRoleGroupDTO[];
}

export interface VacantesResumenDTO {
  total: number;
  customers: VacanteCustomerGroupDTO[];
}
