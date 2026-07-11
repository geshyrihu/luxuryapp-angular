export interface ApplicationRoleAddOrEditDto {
  id?: string;
  name: string;
  sortOrder: number;
  displayName: string;
  isActive: boolean;
  roleType: number;
  departament: number;
}
