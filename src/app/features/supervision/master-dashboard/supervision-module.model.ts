export interface SupervisionModuleCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface SupervisionModuleGroup {
  label: string;
  icon: string;
  cards: SupervisionModuleCard[];
}
