import { ERoleType } from "../enums/e-role-type";
export interface IRoles {
  roleId: string;
  roleName: string;
  isSelected: boolean;
  roleType: ERoleType;
  sortOrder: number;
}









