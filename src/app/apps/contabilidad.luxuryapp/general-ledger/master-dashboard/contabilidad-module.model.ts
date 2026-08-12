import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

export interface ContabilidadModuleCard {
  title: string;
  description: string;
  route: string;
  icon: AppIconName;
  color: string;
  bgColor: string;
  roles?: ApplicationRole[];
}

export interface ContabilidadModuleGroup {
  label: string;
  icon: AppIconName;
  cards: ContabilidadModuleCard[];
  roles?: ApplicationRole[];
}
