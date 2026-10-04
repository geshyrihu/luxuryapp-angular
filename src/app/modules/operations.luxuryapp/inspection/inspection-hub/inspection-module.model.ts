import type { AppIconName } from "@ui/primitives/app-icon/app-icon.catalog";

export interface InspectionModuleCard {
  title: string;
  description: string;
  route: string;
  icon: AppIconName;
  color: string;
  bgColor: string;
}

export interface InspectionModuleGroup {
  label: string;
  icon: AppIconName;
  cards: InspectionModuleCard[];
}
