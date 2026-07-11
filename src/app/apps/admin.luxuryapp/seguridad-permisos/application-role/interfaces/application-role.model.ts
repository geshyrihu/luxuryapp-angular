import { Department } from "./application-role.enum";

export interface ApplicationRole {
  id: string;
  name: string;
  normalizedName: string;
  sortOrder: number;
  isActive: boolean;
  roleType: any;
  departament: Department;
}
