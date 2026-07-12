import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { MeetingIndex } from "src/app/core/interfaces/meeting-index.interface";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  AreaDetailsTable,
  DetailEvent,
  SeguimientoEvent,
} from "./meeting-area-table/meeting-area-table";
import { MeetingSeguimientoEdit } from "./meeting-seguimiento-edit";
import { MinutaDetalleForm } from "./minuta-detalle-form";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";

@Component({
  selector: "app-meeting-management",
  imports: [LxTag, WebButtonLabel, AppIcon, RouterModule, AreaDetailsTable],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./meeting-management.html",
})
export class MeetingManagement implements OnInit {
  private route = inject(ActivatedRoute);
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);

  meetingId: string | null = null;
  meetingData = signal<MeetingIndex | null>(null);

  ngOnInit(): void {
    this.meetingId = this.route.snapshot.paramMap.get("id");
    if (this.meetingId) {
      this.onLoadDetails();
    }
  }

  onLoadDetails(): void {
    this.apiResponseS
      .onGetItem<MeetingIndex>(Endpoints.Meetings.getDetails(this.meetingId))
      .then((result) => {
        this.meetingData.set(result);
      });
  }

  onModalFormMinutaDetalle(data: DetailEvent): void {
    this.dialogHandlerS
      .openDialog(
        MinutaDetalleForm,
        {
          id: data.id,
          meetingId: data.meetingId,
          areaResponsable: data.areaResponsable,
        },
        data.header,
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) this.onLoadDetails();
      });
  }

  onModalFormSeguimiento(event: SeguimientoEvent): void {
    this.dialogHandlerS
      .openDialog(
        MeetingSeguimientoEdit,
        {
          meetingDetailsId: event.meetingDetailsId,
          idMeetingSeguimiento: event.idMeetingSeguimiento,
        },
        "Seguimiento",
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) this.onLoadDetails();
      });
  }

  onDeleteMeetingDetail(id: any): void {
    this.apiResponseS
      .onDelete(Endpoints.MeetingsDetails.delete(id))
      .then((result) => {
        if (result) this.onLoadDetails();
      });
  }

  onDeleteSeguimiento(id: any): void {
    this.apiResponseS
      .onDelete(Endpoints.MeetingDetailsTracking.delete(id))
      .then((result) => {
        if (result) this.onLoadDetails();
      });
  }

  onSendEmail(area: number): void {
    // Lígica de envío de email (reutilizando la del componente anterior)
    const customerId = this.meetingData()?.customerId;
    this.apiResponseS
      .onPost(
        Endpoints.Meetings.sendEmailResponsible(
          this.meetingId,
          customerId,
          area,
          "0",
        ),
      )
      .then(() => {});
  }
}
