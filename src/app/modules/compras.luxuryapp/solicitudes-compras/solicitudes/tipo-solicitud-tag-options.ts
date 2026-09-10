import { TagSeverity } from "@ui/base/tag.base";

export interface TipoSolicitudTagOption {
  value: number;
  label: string;
  severity: TagSeverity;
}

// Valores según enum backend TipoSolicitudCompra (ComprasLuxuryApp.SolicitudesCompra.Shared.Enums)
export const TIPO_SOLICITUD_TAG_OPTIONS: TipoSolicitudTagOption[] = [
  { value: 1, label: "Operativa", severity: "info" },
  { value: 2, label: "Mejora", severity: "success" },
  { value: 3, label: "Mtto. Correctivo", severity: "warn" },
  { value: 4, label: "Mtto. Preventivo", severity: "secondary" },
  { value: 5, label: "Inversión", severity: "contrast" },
];
