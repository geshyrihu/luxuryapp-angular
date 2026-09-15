import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

export interface AdminModuleCard {
  title: string;
  description: string;
  route: string;
  icon: AppIconName;
  color: string;
  bgColor: string;
  roles?: ApplicationRole[];
}

