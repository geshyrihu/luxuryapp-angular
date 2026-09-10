import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

export interface SupervisionModuleCard {
  title: string;
  description: string;
  route: string;
  icon: AppIconName;
  color: string;
  bgColor: string;
}

export interface SupervisionModuleGroup {
  label: string;
  icon: AppIconName;
  cards: SupervisionModuleCard[];
}
