export type ProposedRole =
  | "SuperUsuario"
  | "Administrador"
  | "Cobranza"
  | "Contador"
  | "Legal";

export interface ModuleAction {
  label: string;
}

export interface ModuleEndpoint {
  method: string;
  path: string;
  description: string;
}

export interface CobranzaCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  bgColor: string;
  roles: ProposedRole[];
  actions: ModuleAction[];
  endpoints: ModuleEndpoint[];
  states?: string[];
  notes?: string;
  pending?: boolean;
}

export interface CobranzaGroup {
  label: string;
  icon: string;
  description: string;
  cards: CobranzaCard[];
}

export type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

export interface HeroMetric {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: string;
}
