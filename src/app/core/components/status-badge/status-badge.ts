import { Component, input, output } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";

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
  imports: [TooltipModule],
  template: `
    <span
      (click)="onStatusClick()"
      [class]="getBadgeClass()"
      [class.cursor-pointer]="clickable()"
      [pTooltip]="tooltip()"
      >{{ getStatusText() }}</span
    >
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

  private statusConfig: Record<number, { text: string; class: string }> = {
    [EStatus.Pendiente]: { text: "PENDIENTE", class: "badge badge-danger" },
    [EStatus.Concluido]: { text: "CONCLUIDO", class: "badge badge-success" },
    [EStatus.noAutorizado]: {
      text: "NO AUTORIZADO",
      class: "badge badge-neutral",
    },
    [EStatus.Proceso]: { text: "PROCESO", class: "badge badge-warning" },
    [EStatus.Cancelado]: { text: "CANCELADO", class: "badge badge-neutral" },
  };

  private empresaConfig: Record<number, { text: string; class: string }> = {
    [ETypeEmpresa.Cobranza]: { text: "COBRANZA", class: "badge badge-primary" },
    [ETypeEmpresa.Gastos]: { text: "GASTOS", class: "badge badge-info" },
  };

  private visibilityConfig: Record<string, { text: string; class: string }> = {
    interno: { text: "INTERNO", class: "badge badge-secondary" },
    externo: { text: "EXTERNO", class: "badge badge-warning" },
    público: { text: "PÚBLICO", class: "badge badge-success" },
    publico: { text: "PÚBLICO", class: "badge badge-success" },
    condominios: { text: "CONDOMINIOS", class: "badge badge-info" },
    condómino: { text: "CONDÓMINO", class: "badge badge-info" },
    condomino: { text: "CONDÓMINO", class: "badge badge-info" },
    condóminos: { text: "CONDÓMINOS", class: "badge badge-info" },
    condominos: { text: "CONDÓMINOS", class: "badge badge-info" },
  };

  getBadgeClass(): string {
    if (this.isVisibility()) {
      return (
        this.visibilityConfig[String(this.status()).toLowerCase()]?.class ||
        "badge badge-neutral"
      );
    }
    const config = this.isEmpresa() ? this.empresaConfig : this.statusConfig;
    return config[this.status() as number]?.class || "badge badge-neutral";
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
