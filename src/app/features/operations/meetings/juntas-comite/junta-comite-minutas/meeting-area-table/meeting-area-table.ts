import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabelAdd } from "src/app/core/components/buttons/web-label/button-add";
import { WebButtonLabelConfirm } from "src/app/core/components/buttons/web-label/button-confirm";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label/button-item";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
// Definimos interfaces para los eventos de salida para mayor claridad y tipado
export interface DetailEvent {
  meetingId: any;
  id: any;
  header: string;
  areaResponsable?: number;
}

export interface SeguimientoEvent {
  meetingDetailsId: any;
  idMeetingSeguimiento: number;
}

import { WebButtonIconAdd } from "src/app/core/components/buttons/web-icon/button-add";
import { WebButtonIconConfirm } from "src/app/core/components/buttons/web-icon/button-confirm";

@Component({
  selector: "app-area-details-table",
  imports: [
    WebButtonIconAdd,
    WebButtonIconConfirm,
    PrimeNgCustomTableEmptyMessage,
    WebButtonLabelItem,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    CommonModule,
    TableModule,
    WebButtonLabelAdd,
    TagModule,
    TooltipModule,
    ActionMenu,
    WebButtonLabelConfirm,
    SanitizeHtmlPipe,
  ],
  templateUrl: "./meeting-area-table.html",
})
export class AreaDetailsTable {
  title = input<string>("");
  meetingId = input<any>(0);
  details = input<any[]>([]);
  areaResponsable = input<number>(0);

  addDetail = output<DetailEvent>();
  editDetail = output<DetailEvent>();
  deleteDetail = output<number>();
  sendAreaEmail = output<void>();
  addSeguimiento = output<SeguimientoEvent>();
  editSeguimiento = output<SeguimientoEvent>();
  deleteSeguimiento = output<number>();

  // --- métodos para emitir eventos al componente padre ---

  onAddDetail(): void {
    this.addDetail.emit({
      meetingId: this.meetingId(),
      id: 0,
      header: `Agregar a ${this.title()}`,
      areaResponsable: this.areaResponsable(),
    });
  }

  onEditDetail(detailId: any): void {
    this.editDetail.emit({
      meetingId: this.meetingId(),
      id: detailId,
      header: `Editar Asunto de ${this.title()}`,
    });
  }

  onDeleteDetail(detailId: any): void {
    this.deleteDetail.emit(detailId);
  }

  onSendAreaEmail(): void {
    this.sendAreaEmail.emit();
  }

  onAddSeguimiento(detailId: any): void {
    this.addSeguimiento.emit({
      meetingDetailsId: detailId,
      idMeetingSeguimiento: 0,
    });
  }

  onEditSeguimiento(detailId: any, seguimientoId: any): void {
    this.editSeguimiento.emit({
      meetingDetailsId: detailId,
      idMeetingSeguimiento: seguimientoId,
    });
  }

  onDeleteSeguimiento(seguimientoId: any): void {
    this.deleteSeguimiento.emit(seguimientoId);
  }

  // --- métodos de ayuda para la vista (Helpers) ---

  /** Devuelve la clase CSS para el badge de estatus. */
  /** Devuelve el severity de PrimeNG para el estatus. */
  getStatusSeverity(
    status: number,
  ): "danger" | "success" | "secondary" | "info" {
    switch (status) {
      case 0:
        return "danger"; // Rojo
      case 1:
        return "success"; // Verde
      case 2:
        return "secondary"; // Gris
      default:
        return "info"; // Azul claro
    }
  }

  /** Devuelve el emoji para el estatus. */
  getStatusEmoji(status: number): string {
    switch (status) {
      case 0:
        return "?"; // Cancelado/Rechazado
      case 1:
        return "?"; // Completado/Aprobado
      case 2:
        return "??"; // Bloqueado/Prohibido
      default:
        return "?"; // Desconocido
    }
  }

  // Elimina el método getStatusIcon ya que usamos emojis
}
