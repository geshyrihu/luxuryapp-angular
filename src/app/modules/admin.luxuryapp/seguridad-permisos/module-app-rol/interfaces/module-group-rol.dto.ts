import { ModuleAppRolAssignedDto } from "./module-app-rol-assigned.dto";

export interface ModuleGroupRolDto {
  groupTitle: string;
  items: ModuleAppRolAssignedDto[];
}
