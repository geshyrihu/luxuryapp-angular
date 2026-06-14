export interface IModuleAppRolDTO {
  roleId: string;
  roleName: string;
  modules: number;
  roleType: string;
}

export interface IModuleAppRolAssignedDTO {
  moduleAppId: string;
  moduleAppName: string;
  roleName: string;
  roleId: string;
  isAssigned: boolean;
  pathParent?: string;
}

export interface IModuleGroupRolDTO {
  groupTitle: string;
  items: IModuleAppRolAssignedDTO[];
}

export interface IUpdateModuleAppRolAssignedDTO {
  roleId: string;
  moduleAppId: string;
  isAssigned: boolean;
}
