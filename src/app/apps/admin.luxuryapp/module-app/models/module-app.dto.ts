export interface ModuleAppDto {
  id: string;
  nameModule: string;
  rolLevel: string;
  label: string;
  routerLink: string;
  icon: string;
  pathParent: string;
  positionIndex: number;
  viewMobil: boolean;
}

export interface ModuleAppCreateOrUpdateDto {
  nameModule: string;
  rolLevel: string | number;
  label: string;
  routerLink: string;
  icon: string;
  pathParent: string;
  viewMobil: boolean;
}

export interface ModuleAppRolDto {
  roleId: string;
  roleName: string;
  modules: number;
  roleType: string;
}

export interface ModuleAppGetDto {
  id: string;
  nameModule: string;
  rolLevel: string | number;
  label: string;
  routerLink: string;
  icon: string;
  pathParent: string;
  positionIndex: number;
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
  pathParent?: string;
  isAssigned: boolean;
}

export interface ModuleGroupDto {
  groupTitle: string;
  items: CustomerModulListForCustomerDto[];
}

export interface ActiveModulesForCustomerDto {
  customerId: string;
  moduleAppId: string;
  moduleAppName: string;
}

export interface ModulePermissionDto {
  customerId: string;
  nameModule: string;
  label: string;
  routerLink: string;
  icon: string;
  pathParent?: string;
  viewMobil: boolean;
}

export interface ModuleAppRolAssignedDto {
  moduleAppId: string;
  moduleAppName: string;
  roleName: string;
  roleId: string;
  isAssigned: boolean;
}

export interface UpdateModuleAppRolAssignedDto {
  roleId: string;
  moduleAppId: string;
  isAssigned: boolean;
}

export interface UpdateModuleStatusDto {
  customerId: string;
  moduleAppId: string;
  isAssigned: boolean;
}
