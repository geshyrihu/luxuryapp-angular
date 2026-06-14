export interface IModuleAppDTO {
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

export interface IModuleAppCreateOrUpdateDTO {
  nameModule: string;
  rolLevel: string | number;
  label: string;
  routerLink: string;
  icon: string;
  pathParent: string;
  viewMobil: boolean;
}

export interface IModuleAppRolDTO {
  roleId: string;
  roleName: string;
  modules: number;
  roleType: string;
}

export interface IModuleAppGetDTO {
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
  pathParent?: string;
  isAssigned: boolean;
}

export interface IModuleGroupDTO {
  groupTitle: string;
  items: ICustomerModulListForCustomerDTO[];
}

export interface IActiveModulesForCustomerDTO {
  customerId: string;
  moduleAppId: string;
  moduleAppName: string;
}

export interface IModulePermissionDTO {
  customerId: string;
  nameModule: string;
  label: string;
  routerLink: string;
  icon: string;
  pathParent?: string;
  viewMobil: boolean;
}

export interface IModuleAppRolAssignedDTO {
  moduleAppId: string;
  moduleAppName: string;
  roleName: string;
  roleId: string;
  isAssigned: boolean;
}

export interface IUpdateModuleAppRolAssignedDTO {
  roleId: string;
  moduleAppId: string;
  isAssigned: boolean;
}

export interface IUpdateModuleStatusDTO {
  customerId: string;
  moduleAppId: string;
  isAssigned: boolean;
}
