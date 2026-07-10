export interface ModuleAppRolDto {
  roleId: string;
  roleName: string;
  modules: number;
  roleType: string;
}

export interface ModuleAppRolAssignedDto {
  moduleAppId: string;
  moduleAppName: string;
  roleName: string;
  roleId: string;
  isAssigned: boolean;
  pathParent?: string;
}

export interface ModuleGroupRolDto {
  groupTitle: string;
  items: ModuleAppRolAssignedDto[];
}

export interface UpdateModuleAppRolAssignedDto {
  roleId: string;
  moduleAppId: string;
  isAssigned: boolean;
}
