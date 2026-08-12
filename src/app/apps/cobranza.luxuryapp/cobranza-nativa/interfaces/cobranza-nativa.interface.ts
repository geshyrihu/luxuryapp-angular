import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

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
  icon: AppIconName;
  bgColor: string;
  color?: string;
  roles: ProposedRole[];
  actions: ModuleAction[];
  endpoints: ModuleEndpoint[];
  states?: string[];
  notes?: string;
  pending?: boolean;
}

export interface CobranzaGroup {
  label: string;
  icon: AppIconName;
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
  icon: AppIconName;
  tone: string;
}
