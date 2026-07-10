import { Department, RoleType } from "./application-role.enum";

export interface ApplicationRole {
  id: string;
  name: string;
  normalizedName: string;
  sortOrder: number;
  isActive: boolean;
  roleType: RoleType;
  departament: Department;
}
