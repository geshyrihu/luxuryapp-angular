import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";
import { AdminModuleCard } from "./admin-module-card.interface";

export interface AdminModuleGroup {
  label: string;
  icon: AppIconName;
  cards: AdminModuleCard[];
  roles?: ApplicationRole[];
}

