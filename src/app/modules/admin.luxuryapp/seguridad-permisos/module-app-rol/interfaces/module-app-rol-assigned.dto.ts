export interface ModuleAppRolAssignedDto {
  moduleAppId: string;
  moduleAppName: string;
  roleName: string;
  roleId: string;
  isAssigned: boolean;
  pathParent?: string;
}
