import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CustomButtonAdd } from "src/app/core/components/buttons/web/custom-button-add";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButtonConfirm } from "src/app/core/components/buttons/web/custom-button-confirm";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
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

@Component({
  selector: "app-area-details-table",
  imports: [IonButtonItem, IonButtonEdit, IonButtonDelete, 
    CommonModule,
    TableModule,
    CustomButtonAdd,
    TagModule,
    TooltipModule,
    ActionMenu,
    CustomButtonConfirm,
    SanitizeHtmlPipe,
  ],
  templateUrl: "./meeting-area-table.html",
})
export class AreaDetailsTable {
  /** TÃ³tulo del Ã³rea (e.g., 'Contable', 'Operaciones'). */
  @Input() title: string = "";
  /** ID de la minuta padre. */
  @Input() meetingId: any = 0;
  /** Array de detalles para mostrar en la tabla. */
  @Input() details: any[] = [];
  // @Input() details: IMeetingDetail[] = [];
  /** Identificador numÃ³rico del Ã³rea (0: Contable, 1: Operaciones, 2: Legal). */
  @Input() areaResponsable: number = 0;
  /** Evento emitido para agregar un nuevo detalle. */
  @Output() addDetail = new EventEmitter<DetailEvent>();
  /** Evento emitido para editar un detalle existente. */
  @Output() editDetail = new EventEmitter<DetailEvent>();
  /** Evento emitido para eliminar un detalle. */
  @Output() deleteDetail = new EventEmitter<number>();
  /** Evento emitido para enviar un email al Ã³rea. */
  @Output() sendAreaEmail = new EventEmitter<void>();
  /** Evento emitido para agregar un nuevo seguimiento. */
  @Output() addSeguimiento = new EventEmitter<SeguimientoEvent>();
  /** Evento emitido para editar un seguimiento. */
  @Output() editSeguimiento = new EventEmitter<SeguimientoEvent>();
  /** Evento emitido para eliminar un seguimiento. */
  @Output() deleteSeguimiento = new EventEmitter<number>();

  // --- MÃ³todos para emitir eventos al componente padre ---

  onAddDetail(): void {
    this.addDetail.emit({
      meetingId: this.meetingId,
      id: 0,
      header: `Agregar a ${this.title}`,
      areaResponsable: this.areaResponsable,
    });
  }

  onEditDetail(detailId: any): void {
    this.editDetail.emit({
      meetingId: this.meetingId,
      id: detailId,
      header: `Editar Asunto de ${this.title}`,
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

  // --- MÃ³todos de ayuda para la vista (Helpers) ---

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

  // Elimina el mÃ³todo getStatusIcon ya que usamos emojis
}
