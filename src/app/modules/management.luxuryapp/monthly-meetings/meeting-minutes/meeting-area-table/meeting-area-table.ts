import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { ButtonWeb } from "@ui/buttons/web";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { SwalService } from "@core/services/swal.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { LxIcon } from '@ui/adaptive/icon/icon';
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
  imports: [LxIcon, ButtonWeb, LxTooltipDirective, SanitizeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./meeting-area-table.html",
  styleUrl: "./meeting-area-table.scss",
})
export class AreaDetailsTable {
  private readonly confirmS = inject(ConfirmService);
  private readonly swalS = inject(SwalService);

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

  async onDeleteDetail(detailId: any): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!ok) return;
    this.deleteDetail.emit(detailId);
  }

  async onSendAreaEmail(): Promise<void> {
    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: `Enviar por correo los pendientes de ${this.title()}`,
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
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

  async onDeleteSeguimiento(seguimientoId: any): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este seguimiento?",
    );
    if (!ok) return;
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
