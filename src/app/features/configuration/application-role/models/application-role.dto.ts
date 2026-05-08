export interface IApplicationRoleDTO {
  id: string;
  name: string;
  normalizedName: string;
  sortOrder: number;
  displayName: string;
  isActive: boolean;
  roleType: string;
  roleTypeOrder: number;
  departament: string;
}

export interface IApplicationRoleAddOrEditDTO {
  id?: string;
  name: string;
  sortOrder: number;
  displayName: string;
  isActive: boolean;
  roleType: number;
  departament: number;
}
