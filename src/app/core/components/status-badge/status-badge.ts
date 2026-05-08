import { Component, EventEmitter, input, Output } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";

export enum EStatus {
  Pendiente = 0,
  Concluido = 1,
  noAutorizado = 2,
  Proceso = 3,
  Cancelado = 4,
}

export interface StatusClickEvent {
  id: any;
  status: EStatus;
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
  status = input.required<EStatus>();
  itemId = input<any>(undefined);
  clickable = input<boolean>(true);
  tooltip = input<string>("Actualizar estatus");

  // <--- Outputs --->
  @Output() statusClick = new EventEmitter<StatusClickEvent>();

  private statusConfig = {
    [EStatus.Pendiente]: { text: "PENDIENTE", class: "badge badge-danger" },
    [EStatus.Concluido]: { text: "CONCLUIDO", class: "badge badge-success" },
    [EStatus.noAutorizado]: {
      text: "NO AUTORIZADO",
      class: "badge badge-neutral",
    },
    [EStatus.Proceso]: { text: "PROCESO", class: "badge badge-warning" },
    [EStatus.Cancelado]: { text: "CANCELADO", class: "badge badge-neutral" },
  };

  getBadgeClass(): string {
    return this.statusConfig[this.status()]?.class || "bg-secondary";
  }

  getStatusText(): string {
    return this.statusConfig[this.status()]?.text || "DESCONOCIDO";
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
