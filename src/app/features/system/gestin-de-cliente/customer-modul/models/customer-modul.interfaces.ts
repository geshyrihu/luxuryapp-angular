/**
 * Interfaces para el módulo de asignación de módulos a clientes.
 */

export interface IModulePermissionDTO {
  customerId: string;
  nameModule: string;
  label: string;
  routerLink: string;
  icon: string;
  pathParent: string | null;
  viewMobil: boolean;
}

export interface ICustomerModulListDTO {
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

export interface ICustomerModulListForCustomerDTO {
  moduleAppId: string;
  moduleAppName: string;
  customerId: string;
  pathParent: string | null;
  isAssigned: boolean;
}

export interface IModuleGroupDTO {
  groupTitle: string;
  items: ICustomerModulListForCustomerDTO[];
}

export interface IUpdateModuleStatusDTO {
  customerId: string;
  moduleAppId: string;
  isAssigned: boolean;
}

export interface IActiveModulesForCustomerDTO {
  customerId: string;
  moduleAppId: string;
  moduleAppName: string;
}
