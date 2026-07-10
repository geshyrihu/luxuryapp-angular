/**
 * Interfaces para el módulo de asignación de módulos a clientes.
 */

export interface ModulePermissionDto {
  customerId: string;
  nameModule: string;
  label: string;
  routerLink: string;
  icon: string;
  pathParent: string | null;
  viewMobil: boolean;
}

export interface CustomerModulListDto {
  customerId: string;
  nameCustomer: string;
  moduleAppId: string;
  moduleAppName: string;
  isAssigned: boolean;
  photoPath: string;
  numeroCliente: string;
  register: string;
  pathParent: string;
}

export interface CustomerModulListForCustomerDto {
  moduleAppId: string;
  moduleAppName: string;
  customerId: string;
  pathParent: string | null;
  isAssigned: boolean;
}

export interface ModuleGroupDto {
  groupTitle: string;
  items: CustomerModulListForCustomerDto[];
}

export interface UpdateModuleStatusDto {
  customerId: string;
  moduleAppId: string;
  isAssigned: boolean;
}

export interface ActiveModulesForCustomerDto {
  customerId: string;
  moduleAppId: string;
  moduleAppName: string;
}
