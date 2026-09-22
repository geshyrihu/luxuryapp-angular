import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { ROUTES } from "src/app/routing/route-paths";

import { AspRoleService } from "@core/auth/services/asp-role.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { MeetingIndex } from "@core/interfaces/meeting-index.interface";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import {
  WebButtonLabelConfirm,
  WebButtonLabelDelete,
  WebButtonLabelEdit,
  WebButtonLabelItem,
} from "@ui/buttons/web-label";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { MeetingDetailForm } from "./meeting-detail-form";
import { MeetingForm } from "./meeting-form";
import { MinutaPdfService } from "./minuta-pdf.service";

/** Icono por tipo de junta (el acento de color vive en el SCSS del módulo). */
interface JuntaVisual {
  readonly icon: string;
}

@Component({
  selector: "app-minutas-list",
  templateUrl: "./minutas-list.html",
  styleUrl: "./minutas-list.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    WebButtonLabel,
    WebButtonLabelConfirm,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    ActionMenu,
    LxTooltipDirective,
    AppIcon,
  ],
})
export class MinutasList {
  // --- Inyección de Dependencias ---
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  customToastS = inject(CustomToastService);
  minutaPdfS = inject(MinutaPdfService);
  route = inject(Router);
  readonly ROUTES = ROUTES;
  public AspRole = ApplicationRole;

  // --- Estado ---
  dataSignal = signal<MeetingIndex[]>([]);

  /** Tipo de junta actual (enum TypeMeeting: Asamblea=0, Comite=1, Operacion=2). Por defecto Comité. */
  tipoJunta: number = 1;

  /** Icono y acento por tipo de junta (el color vive en el SCSS del módulo). */
  private readonly juntaVisuals: Record<number, JuntaVisual> = {
    0: { icon: "material-symbols-light:account-balance" },
    1: { icon: "material-symbols-light:groups" },
    2: { icon: "material-symbols-light:settings" },
  };

  private readonly juntaLabels: Record<number, string> = {
    0: "Asamblea",
    1: "Comité",
    2: "Operación",
  };

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData(this.tipoJunta);
      }
    });
  }

  get tipoJuntaVisual(): JuntaVisual {
    return this.juntaVisuals[this.tipoJunta] ?? this.juntaVisuals[0];
  }

  get tipoJuntaLabel(): string {
    return this.juntaLabels[this.tipoJunta] ?? "";
  }

  onLoadData(tipoJuntaEnum: number): void {
    this.tipoJunta = tipoJuntaEnum;
    this.apiResponseS
      .onGetList(
        Endpoints.Meetings.list(this.customerIdS.customerId(), tipoJuntaEnum),
      )
      .then((result: MeetingIndex[]) => {
        this.dataSignal.set(result ?? []);
      });
  }

  navigateToPendientes(): void {
    this.route.navigate(ROUTES.JUNTAS_COMITE.MINUTAS_PENDIENTES);
  }

  navigateToSeguimiento(): void {
    this.route.navigate(ROUTES.JUNTAS_COMITE.SEGUIMIENTO_MINUTAS("operaciones"));
  }

  navigateToGestionMinuta(id: string): void {
    this.route.navigate(ROUTES.JUNTAS_COMITE.GESTION_MINUTA(id));
  }

  resumenMinuta(id: string): void {
    this.route.navigate(ROUTES.JUNTAS_COMITE.RESUMEN_MINUTA(id));
  }

  exportToExcel(meetingId: string): void {
    this.apiResponseS.exportToExcel(
      Endpoints.MeetingDetailsTracking.exportSummaryToExcel(meetingId),
      "Pendientes Minuta",
    );
  }

  onDelete(id: string): void {
    this.apiResponseS
      .onDelete(Endpoints.Meetings.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((meeting) => meeting.id !== id),
          );
        }
      });
  }

  onSendEmailMeeting(meetingId: string): void {
    this.apiResponseS
      .onPost(Endpoints.SendEmail.meeting(meetingId))
      .then(() => {});
  }

  /**
   * Abre el modal de alta o edición de una minuta.
   * La administración de minutas es independiente del calendario/agenda.
   */
  showModalAddOrEditMeeting(data: { id: string; title: string }): void {
    this.dialogHandlerS
      .openDialog(
        MeetingForm,
        {
          id: data.id,
          customerId: this.customerIdS.customerId(),
        },
        data.title,
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta);
      });
  }

  /**
   * Abre una lista filtrada de asuntos de una minuta.
   * @param status 0=Pendiente, 1=Concluido, 2=No autorizado, 4=Todos.
   */
  showModalAddOrEditMeetingDetails(
    id: string,
    header: string,
    status: number,
  ): void {
    this.dialogHandlerS.openDialog(
      MeetingDetailForm,
      { id, status },
      header,
      this.dialogHandlerS.sizeFull,
    );
  }

  onNavigateMinutaPublico(id: string): void {
    this.onGenerarMinutaPdf(id);
  }

  private onGenerarMinutaPdf(meetingId: string): void {
    this.customToastS.showInfo(
      "Generando PDF",
      "Espere un momento por favor...",
    );
    this.apiResponseS
      .onGetList(Endpoints.Meetings.reportPdf(meetingId))
      .then((meetingData: any) => {
        if (!meetingData) {
          this.customToastS.showError(
            "Error",
            "No se encontraron datos para generar el PDF.",
          );
          return;
        }

        const dateLabel = meetingData.minuta?.date
          ? String(meetingData.minuta.date).split(" ")[0]
          : "N/A";
        const tipo = meetingData.minuta?.typeMeeting ?? "Junta";
        this.minutaPdfS.downloadMinuta(
          meetingData,
          `Minuta-${tipo}-${dateLabel}`,
        );
      })
      .catch((error) => {
        console.error("Error al obtener datos de la minuta:", error);
        this.customToastS.showError(
          "Error",
          "No se pudieron obtener los datos de la minuta.",
        );
      });
  }
}
