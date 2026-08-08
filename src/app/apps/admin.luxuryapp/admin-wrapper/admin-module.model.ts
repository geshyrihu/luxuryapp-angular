import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";

export interface AdminModuleCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  bgColor: string;
  roles?: ApplicationRole[];
}

export interface AdminModuleGroup {
  label: string;
  icon: string;
  cards: AdminModuleCard[];
  roles?: ApplicationRole[];
}