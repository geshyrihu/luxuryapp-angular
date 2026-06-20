import { Component, input, output } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { TagModule } from "primeng/tag";

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

/**
 * 🏷️ STATUS BADGE
 * -------------------------------------------------------------------------
 * Badge de estado con colores codificados.
 * Clickable y con tooltip, estilizado para mostrar el ciclo de vida.
 */
@Component({
  selector: "app-status-badge",
  imports: [TooltipModule, TagModule],
  template: `
    <p-tag
      (click)="onStatusClick()"
      [value]="getStatusText()"
      [severity]="getSeverity()"
      [rounded]="true"
      [pTooltip]="tooltip()"
      [style.cursor]="clickable() ? 'pointer' : 'default'"
    ></p-tag>
  `,
  styles: [``],
})
export class StatusBadge {
  // <--- Inputs --->
  status = input.required<any>();
  itemId = input<any>(undefined);
  clickable = input<boolean>(true);
  tooltip = input<string>("Actualizar estatus");
  isEmpresa = input<boolean>(false);
  isVisibility = input<boolean>(false);

  // <--- Outputs --->
  statusClick = output<StatusClickEvent>();

  private statusConfig: Record<number, { text: string; severity: "success" | "info" | "warn" | "danger" | "secondary" | "contrast" }> = {
    [EStatus.Pendiente]: { text: "PENDIENTE", severity: "danger" },
    [EStatus.Concluido]: { text: "CONCLUIDO", severity: "success" },
    [EStatus.noAutorizado]: {
      text: "NO AUTORIZADO",
      severity: "secondary",
    },
    [EStatus.Proceso]: { text: "PROCESO", severity: "warn" },
    [EStatus.Cancelado]: { text: "CANCELADO", severity: "secondary" },
  };

  private empresaConfig: Record<number, { text: string; severity: "success" | "info" | "warn" | "danger" | "secondary" | "contrast" }> = {
    [ETypeEmpresa.Cobranza]: { text: "COBRANZA", severity: "info" },
    [ETypeEmpresa.Gastos]: { text: "GASTOS", severity: "warn" },
  };

  private visibilityConfig: Record<string, { text: string; severity: "success" | "info" | "warn" | "danger" | "secondary" | "contrast" }> = {
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

  getSeverity(): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    if (this.isVisibility()) {
      return (
        this.visibilityConfig[String(this.status()).toLowerCase()]?.severity ||
        "secondary"
      );
    }
    const config = this.isEmpresa() ? this.empresaConfig : this.statusConfig;
    return config[this.status() as number]?.severity || "secondary";
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

  onStatusClick(): void {
    if (this.clickable()) {
      this.statusClick.emit({
        id: this.itemId(),
        status: this.status(),
      });
    }
  }
}
