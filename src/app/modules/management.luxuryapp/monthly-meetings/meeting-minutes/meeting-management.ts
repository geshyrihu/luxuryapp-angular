import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { MeetingIndex } from "@core/interfaces/meeting-index.interface";
import { MeetingEmailDispatch } from "@core/interfaces/meeting-email-dispatch.interface";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import {
  AreaDetailsTable,
  DetailEvent,
  SeguimientoEvent,
} from "./meeting-area-table/meeting-area-table";
import { MeetingSeguimientoEdit } from "./meeting-seguimiento-edit";
import { MinutaDetalleForm } from "./minuta-detalle-form";

@Component({
  selector: "app-meeting-management",
  imports: [WebButtonLabel, AppIcon, RouterModule, AreaDetailsTable, ApiDatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./meeting-management.html",
  styleUrl: "./meeting-management.scss",
})
export class MeetingManagement implements OnInit {
  private route = inject(ActivatedRoute);
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private authS = inject(AuthService);

  meetingId: string | null = null;
  meetingData = signal<MeetingIndex | null>(null);
  emailDispatches = signal<MeetingEmailDispatch[]>([]);

  ngOnInit(): void {
    this.meetingId = this.route.snapshot.paramMap.get("id");
    if (this.meetingId) {
      this.onLoadDetails();
    }
  }

  /** Icono del tipo de junta a partir del nombre para mostrar del API. */
  get typeIcon(): string {
    switch (this.meetingData()?.typeMeeting) {
      case "Asamblea":
        return "material-symbols-light:account-balance";
      case "Operación":
        return "material-symbols-light:settings";
      default:
        return "material-symbols-light:groups";
    }
  }

  onLoadDetails(): void {
    this.apiResponseS
      .onGetItem<MeetingIndex>(Endpoints.Meetings.getDetails(this.meetingId))
      .then((result) => {
        this.meetingData.set(result);
      });
    this.onLoadDispatches();
  }

  onLoadDispatches(): void {
    if (!this.meetingId) {
      return;
    }

    this.apiResponseS
      .onGetList(Endpoints.Meetings.emailDispatches(this.meetingId))
      .then((result: MeetingEmailDispatch[]) => {
        this.emailDispatches.set(result ?? []);
      });
  }

  /** Convierte la lista 'a;b;c' en texto legible. */
  formatRecipients(value: string): string {
    return value ? value.split(";").join(", ") : "";
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
    const customerId = this.meetingData()?.customerId;
    this.apiResponseS
      .onPost(
        Endpoints.Meetings.sendEmailResponsible(
          this.meetingId,
          customerId,
          area,
          this.authS.applicationUserId,
        ),
      )
      .then(() => {});
  }
}
