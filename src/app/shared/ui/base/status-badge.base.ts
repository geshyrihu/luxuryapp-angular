import { Directive, input, output } from "@angular/core";

export enum EStatus {
  Pendiente = 0,
  Concluido = 1,
  noAutorizado = 2,
  Proceso = 3,
  Cancelado = 4,
}

export enum ETypeEmpresa {
  Cobranza = 0,
  Gastos = 1,
}

export interface StatusClickEvent {
  id: any;
  status: any;
}

export const STATUS_ICONS: Record<string, string> = {
  PENDIENTE: "mdi:clock-outline",
  CONCLUIDO: "mdi:check-circle",
  PROCESO: "mdi:progress-check",
  CANCELADO: "mdi:cancel",
  "NO AUTORIZADO": "mdi:block-helper",
  COBRANZA: "mdi:bank",
  GASTOS: "mdi:cash",
  INTERNO: "mdi:lock",
  EXTERNO: "mdi:earth",
  PÚBLICO: "mdi:eye",
  CONDÓMINO: "mdi:account-group",
  CONDOMINOS: "mdi:account-group",
  DESCONOCIDO: "mdi:help-circle",
};

export const STATUS_SEVERITY_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  success: { bg: "var(--ds-success-light)", text: "var(--ds-success)", border: "transparent" },
  info: { bg: "var(--ds-info-light)", text: "var(--ds-info)", border: "transparent" },
  warn: { bg: "var(--ds-warning-light)", text: "var(--ds-warning)", border: "transparent" },
  danger: { bg: "var(--ds-danger-light)", text: "var(--ds-danger)", border: "transparent" },
  secondary: { bg: "var(--ds-bg-sunken)", text: "var(--ds-text-secondary)", border: "var(--ds-border)" },
  contrast: { bg: "var(--ds-bg-page)", text: "var(--ds-text-primary)", border: "var(--ds-border-strong)" },
};

/**
 * Base compartida de StatusBadge (API + lógica de estatus/severidad).
 *  - web:     `app-status-badge` (span + pTooltip)
 *  - mobile:  `ili-status-badge` (span sin tooltip; touch no tiene hover)
 *  - wrapper: `lx-status-badge`  (auto runtime)
 */
@Directive()
export abstract class StatusBadgeBase {
  status = input.required<any>();
  itemId = input<any>(undefined);
  clickable = input<boolean>(true);
  tooltip = input<string>("Actualizar estatus");
  isEmpresa = input<boolean>(false);
  isVisibility = input<boolean>(false);
  showIcon = input<boolean>(true);

  statusClick = output<StatusClickEvent>();

  private statusConfig: Record<number, { text: string; severity: string }> = {
    [EStatus.Pendiente]: { text: "PENDIENTE", severity: "danger" },
    [EStatus.Concluido]: { text: "CONCLUIDO", severity: "success" },
    [EStatus.noAutorizado]: { text: "NO AUTORIZADO", severity: "secondary" },
    [EStatus.Proceso]: { text: "PROCESO", severity: "warn" },
    [EStatus.Cancelado]: { text: "CANCELADO", severity: "secondary" },
  };

  private empresaConfig: Record<number, { text: string; severity: string }> = {
    [ETypeEmpresa.Cobranza]: { text: "COBRANZA", severity: "info" },
    [ETypeEmpresa.Gastos]: { text: "GASTOS", severity: "warn" },
  };

  private visibilityConfig: Record<string, { text: string; severity: string }> = {
    interno: { text: "INTERNO", severity: "secondary" },
    externo: { text: "EXTERNO", severity: "warn" },
    público: { text: "PÚBLICO", severity: "success" },
    publico: { text: "PÚBLICO", severity: "success" },
    condominios: { text: "CONDOMINIOS", severity: "info" },
    condómino: { text: "CONDÓMINO", severity: "info" },
    condomino: { text: "CONDÓMINO", severity: "info" },
    condóminos: { text: "CONDÓMINOS", severity: "info" },
    condominos: { text: "CONDÓMINOS", severity: "info" },
  };

  getSeverity(): string {
    if (this.isVisibility()) {
      return (
        this.visibilityConfig[String(this.status()).toLowerCase()]?.severity ||
        "secondary"
      );
    }
    const config = this.isEmpresa() ? this.empresaConfig : this.statusConfig;
    return config[this.status() as number]?.severity || "secondary";
  }

  get styles(): { bg: string; text: string; border: string } {
    return STATUS_SEVERITY_STYLES[this.getSeverity()] || STATUS_SEVERITY_STYLES.secondary;
  }

  getStatusText(): string {
    if (this.isVisibility()) {
      return (
        this.visibilityConfig[String(this.status()).toLowerCase()]?.text ||
        String(this.status()).toUpperCase()
      );
    }
    const config = this.isEmpresa() ? this.empresaConfig : this.statusConfig;
    return config[this.status() as number]?.text || "DESCONOCIDO";
  }

  getIcon(): string {
    return STATUS_ICONS[this.getStatusText()] || STATUS_ICONS["DESCONOCIDO"];
  }

  onStatusClick(): void {
    if (this.clickable()) {
      this.statusClick.emit({ id: this.itemId(), status: this.status() });
    }
  }
}
