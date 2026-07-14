import { Roles } from "src/app/core/interfaces/roles.interface";

export interface GroupedRole {
  groupName: string;
  roles: Roles[];
}
