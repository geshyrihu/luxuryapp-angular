import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { WebButtonIconAdd } from "@ui/buttons/web-icon/button-add";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";

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
  imports: [
    AppIcon,
    WebButtonIconAdd,
    WebButtonIconConfirm,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonLabelItem,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    LxTooltipDirective,
    ActionMenu,
    SanitizeHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./meeting-area-table.html",
  styleUrl: "./meeting-area-table.scss",
})
export class AreaDetailsTable {
  title = input<string>("");
  icon = input<string>("material-symbols-light:article");
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
      areaResponsable: this.areaResponsable(),
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

  /** 0 = Pendiente, 1 = Concluido, 2 = No autorizado. */
  statusIcon(status: number): string {
    switch (status) {
      case 1:
        return "material-symbols-light:check-circle";
      case 2:
        return "material-symbols-light:block";
      default:
        return "material-symbols-light:schedule";
    }
  }

  statusLabel(status: number): string {
    switch (status) {
      case 1:
        return "Concluido";
      case 2:
        return "No autorizado";
      default:
        return "Pendiente";
    }
  }
}
