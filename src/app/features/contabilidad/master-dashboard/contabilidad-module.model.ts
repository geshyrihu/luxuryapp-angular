export interface ContabilidadModuleCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface ContabilidadModuleGroup {
  label: string;
  icon: string;
  cards: ContabilidadModuleCard[];
}
