import { TagSeverity } from "@ui/base/tag.base";

export interface NivelPrioridadTagOption {
  value: number;
  label: string;
  severity: TagSeverity;
}

// Valores según enum backend NivelPrioridad (ComprasLuxuryApp.SolicitudesCompra.Shared.Enums)
export const NIVEL_PRIORIDAD_TAG_OPTIONS: NivelPrioridadTagOption[] = [
  { value: 1, label: "Baja", severity: "secondary" },
  { value: 2, label: "Media", severity: "info" },
  { value: 3, label: "Alta", severity: "warn" },
  { value: 4, label: "Crítica", severity: "danger" },
];
