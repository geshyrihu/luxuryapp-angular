import { ApplicationRole } from "src/app/core/interfaces/asp-net-roles.enum";

export interface ContabilidadModuleCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  bgColor: string;
  roles?: ApplicationRole[];
}

export interface ContabilidadModuleGroup {
  label: string;
  icon: string;
  cards: ContabilidadModuleCard[];
  roles?: ApplicationRole[];
}
