import { EventInput } from "@fullcalendar/core";
import { AvatarItem } from "src/app/core/components/shared/avatar-group/avatar-group";

export const CATALOG_DEMO_EVENTS: EventInput[] = [
  {
    title: "Junta Comite",
    start: "2026-06-10T19:00",
    backgroundColor: "var(--ds-primary, #3b82f6)",
    borderColor: "var(--ds-primary, #3b82f6)",
    textColor: "#ffffff",
  },
  {
    title: "Asamblea General",
    start: "2026-06-15T10:00",
    backgroundColor: "var(--ds-primary, #3b82f6)",
    borderColor: "var(--ds-primary, #3b82f6)",
    textColor: "#ffffff",
  },
  {
    title: "Reunion Proveedores",
    start: "2026-06-20T09:00",
    backgroundColor: "var(--ds-help, #8b5cf6)",
    borderColor: "var(--ds-help, #8b5cf6)",
    textColor: "#ffffff",
  },
];

export const CATALOG_DEMO_AVATARS: AvatarItem[] = [
  { label: "JG", color: "var(--ds-primary)", tooltip: "Juan García" },
  { label: "ML", color: "var(--ds-success)", tooltip: "María López" },
  { label: "CR", color: "var(--ds-warning)", tooltip: "Carlos Ruiz" },
  { label: "AM", color: "var(--ds-help)", tooltip: "Ana Martínez" },
  { label: "LT", color: "var(--ds-danger)", tooltip: "Luis Torres" },
  { label: "LS", color: "var(--ds-info)", tooltip: "Laura Sánchez" },
];

export const CATALOG_DEMO_EMAIL_HTML = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #1b365d;">Reporte de Cobertura</h2>
    <p>Estimado usuario,</p>
    <p>Adjunto encontrará el reporte semanal de cobertura operativa.</p>
    <br/>
    <p>Saludos cordiales,<br/><strong>Equipo ERP</strong></p>
  </div>
`;
