import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";

export interface ContabilidadModuleCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  bgColor: string;
  roles?: EApplicationRole[];
}

export interface ContabilidadModuleGroup {
  label: string;
  icon: string;
  cards: ContabilidadModuleCard[];
}
