import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { CardModule } from "primeng/card";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IMeetingIndex } from "src/app/core/interfaces/meeting-index.interface";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  AreaDetailsTable,
  DetailEvent,
  SeguimientoEvent,
} from "./meeting-area-table/meeting-area-table";
import { MeetingSeguimientoEdit } from "./meeting-seguimiento-edit";
import { MinutaDetalleForm } from "./minuta-detalle-form";

@Component({
  selector: "app-meeting-management",
  imports: [CommonModule, RouterModule, CardModule, AreaDetailsTable],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./meeting-management.html",
})
export class MeetingManagement implements OnInit {
  private route = inject(ActivatedRoute);
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);

  meetingId: string | null = null;
  meetingData = signal<IMeetingIndex | null>(null);

  ngOnInit(): void {
    this.meetingId = this.route.snapshot.paramMap.get("id");
    if (this.meetingId) {
      this.onLoadDetails();
    }
  }

  onLoadDetails(): void {
    this.apiResponseS
      .onGetItem<IMeetingIndex>(Endpoints.Meetings.getDetails(this.meetingId))
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
