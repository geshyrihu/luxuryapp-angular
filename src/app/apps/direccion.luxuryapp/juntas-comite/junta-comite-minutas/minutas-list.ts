import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { ROUTES } from "src/app/routing/route-paths";

import { LxAccordion } from "@ui/adaptive/accordion/accordion";
import { MobileButtonLabelConfirm } from "@ui/buttons/mobile-label/button-confirm";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import {
  WebButtonLabelConfirm,
  WebButtonLabelDelete,
  WebButtonLabelEdit,
  WebButtonLabelItem,
} from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { MeetingIndex } from "src/app/core/interfaces/meeting-index.interface";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ReportService } from "src/app/core/services/report.service";
import {
  AreaDetailsTable,
  DetailEvent,
  SeguimientoEvent,
} from "./meeting-area-table/meeting-area-table";
import { MeetingDetailForm } from "./meeting-detail-form";
import { MeetingForm } from "./meeting-form";
import { MeetingSeguimientoEdit } from "./meeting-seguimiento-edit";
import { MinutaDetalleForm } from "./minuta-detalle-form";
import { MinutaPdfService } from "./minuta-pdf.service";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-minutas-list",
  templateUrl: "./minutas-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelConfirm,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonLabel,
    ButtonModule,
    NgbTooltipModule,
    LxTooltipDirective,
    LxAccordion,
    ActionMenu,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    AreaDetailsTable,
    RouterModule,
    WebButtonLabelConfirm,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    MobileListItem,
    AppIcon,
  ],
})
export class MinutasList {
  // --- Inyección de Dependencias ---
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  reportService = inject(ReportService);
  minutaPdfS = inject(MinutaPdfService);
  customToastS = inject(CustomToastService);
  route = inject(Router);
  readonly ROUTES = ROUTES;
  // --- Propiedades del Componente ---
  dataSignal = signal<MeetingIndex[]>([]);
  ref: DynamicDialogRef;
  public AspRole = ApplicationRole;

  /** Tipo de junta actual que se está mostrando ('Comité', 'Asamblea', etc.). */
  tipoJunta: number = 1;

  /** Opciones de configuración para la tabla PrimeNG. */
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight: string = "calc(100vh - 300px)";

  /**
   * Campos utilizados por el filtro global de la tabla PrimeNG.
   * Optimizado: Solo campos de primer nivel para evitar lag de procesamiento.
   */
  globalFilterFields: string[] = ["dateFormat", "eTypeMeeting"];

  constructor() {
    /**
     * Efecto que se ejecuta cuando el customerId cambia,
     * recargando los datos para el nuevo cliente.
     */
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData(this.tipoJunta);
      }
    });
  }

  /**
   * Carga la lista de minutas desde la API segón el tipo de junta.
   * @param tipoJunta El tipo de junta a cargar ('Comité', 'Asamblea', 'Operación').
   */
  get tipoJuntaLabel(): string {
    const labels: Record<number, string> = {
      0: "Comité",
      1: "Asamblea",
      2: "Operación",
    };
    return labels[this.tipoJunta] ?? "";
  }

  onLoadData(tipoJuntaEnum: number): void {
    this.tipoJunta = tipoJuntaEnum;
    this.apiResponseS
      .onGetList(
        Endpoints.Meetings.list(this.customerIdS.customerId(), tipoJuntaEnum),
      )
      .then((result: MeetingIndex[]) => {
        this.dataSignal.set(result);
      });
  }

  navigateToPendientes() {
    this.route.navigate(ROUTES.JUNTAS_COMITE.MINUTAS_PENDIENTES);
  }

  navigateToSeguimiento() {
    this.route.navigate(
      ROUTES.JUNTAS_COMITE.SEGUIMIENTO_MINUTAS("operaciones"),
    );
  }

  navigateToGestionMinuta(id: string) {
    this.route.navigate(ROUTES.JUNTAS_COMITE.GESTION_MINUTA(id));
  }

  /**
   * Exporta los pendientes de una minuta a un fichero Excel.
   * @param meetingId El ID de la minuta.
   */
  exportToExcel(meetingId: any): void {
    this.apiResponseS.exportToExcel(
      Endpoints.MeetingDetailsTracking.exportSummaryToExcel(meetingId),
      "Pendientes Minuta",
    );
  }

  /**
   * Elimina una minuta completa.
   * @param id El ID de la minuta a eliminar.
   */
  onDelete(id: string): void {
    this.apiResponseS
      .onDelete(Endpoints.Meetings.delete(id))
      .then((result: boolean) => {
        if (result) {
          // Optimización: Eliminar el item del array local en lugar de recargar todo.
          this.dataSignal.update((data) =>
            data.filter((meeting) => meeting.id !== id),
          );
        }
      });
  }

  /**
   * Envía la minuta por correo electrónico al Comité.
   * @param meetingId El ID de la minuta.
   */
  onSendEmailMeeting(meetingId: any): void {
    this.apiResponseS
      .onPost(Endpoints.SendEmail.meeting(meetingId))
      .then(() => {});
  }

  /**
   * Abre el modal para agregar o editar una minuta.
   * @param data Objeto con el ID de la minuta (0 para nuevo) y el título del modal.
   */
  showModalAddOrEditMeeting(data: { id: string; title: string }): void {
    if (!data.id && this.tipoJunta !== 2) {
      this.customToastS.showInfo(
        "Alta desde agenda",
        "Las minutas de comite y asamblea no pueden crearse directamente aqui. Primero registra la agenda de la junta para generar la sesion mensual y, desde ella, la minuta vinculada.",
      );
      return;
    }

    this.dialogHandlerS
      .openDialog(
        MeetingForm,
        {
          id: data.id,
          customerId: this.customerIdS.customerId(),
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta); // Recargar es necesario al agregar/editar una minuta completa.
      });
  }

  /**
   * Abre un modal que muestra una lista filtrada de asuntos de una minuta.
   * @param id El ID de la minuta.
   * @param header El título para el modal.
   * @param status El estatus por el cual filtrar los asuntos.
   */
  showModalAddOrEditMeetingDetails(
    id: any,
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

  /**
   * Abre el modal para agregar o editar un detalle (asunto) de una minuta.
   * Este método es llamado por el evento del componente hijo.
   * @param data El objeto de evento con los datos necesarios.
   */
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
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta); // Recargar al agregar/editar un seguimiento.
      });
  }

  /** Genera y descarga el PDF de una minuta sin navegar. */
  onNavigateMinutaPublico(id: any): void {
    this.onGenerarMinutaPdf(id);
  }

  /** Alias usado en la vista móvil. */
  onGeneretePDF(id: any): void {
    this.onGenerarMinutaPdf(id);
  }

  private onGenerarMinutaPdf(meetingId: any): void {
    this.customToastS.showInfo(
      "Generando PDF",
      "Espere un momento por favor...",
    );
    this.apiResponseS
      .onGetList(Endpoints.Meetings.reportPdf(meetingId))
      .then(async (meetingData: any) => {
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
        const tipo = meetingData.minuta?.eTypeMeeting ?? "Junta";
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

  /**
   * Navega a la pógina de resumen de una minuta.
   * @param id El ID de la minuta.
   */
  resumenMinuta(id: any): void {
    this.route.navigate(["/committee-meetings/resumen-minuta", id]);
  }

  /**
   * Envía un correo electrónico a los responsables de un área específica de una minuta.
   * @param id El ID de la minuta.
   * @param eAreaMinutasDetalles El identificador numérico del área.
   */
  onSendEmail(id: any, eAreaMinutasDetalles: number): void {
    this.apiResponseS
      .onPost(
        Endpoints.Meetings.sendEmailResponsible(
          id,
          this.customerIdS.customerId(),
          eAreaMinutasDetalles,
          this.authS.infoUserAuth.applicationUserId,
        ),
      )
      .then(() => {});
  }

  /**
   * Abre el modal para agregar o editar un seguimiento de un asunto.
   * @param event El objeto de evento con los IDs necesarios.
   */
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
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta); // Recargar al agregar/editar un seguimiento.
      });
  }

  /**
   * Elimina un seguimiento de un asunto.
   * @param id El ID del seguimiento a eliminar.
   */
  onDeleteSeguimiento(id: any): void {
    this.apiResponseS
      .onDelete(Endpoints.MeetingDetailsTracking.delete(id))
      .then(() => {
        // Optimización: Eliminar el seguimiento del array local.
        this.dataSignal.update((data) => {
          data.forEach((meeting) => {
            ["contable", "operaciones", "legal"].forEach((area) => {
              meeting[area]?.forEach((detail) => {
                if (detail.seguimiento) {
                  detail.seguimiento = detail.seguimiento.filter(
                    (seg) => seg.id !== id,
                  );
                }
              });
            });
          });
          return data;
        });
      });
  }

  /**
   * Elimina un detalle (asunto) completo de una minuta.
   * @param id El ID del detalle a eliminar.
   */
  onDeleteMeetingDetail(id: any): void {
    this.apiResponseS
      .onDelete(Endpoints.MeetingsDetails.delete(id))
      .then(() => {
        // Optimización: Eliminar el detalle del array local.
        this.dataSignal.update((data) => {
          data.forEach((meeting: any) => {
            meeting.contable =
              meeting.contable?.filter((detail) => detail.id !== id) || [];
            meeting.operaciones =
              meeting.operaciones?.filter((detail) => detail.id !== id) || [];
            meeting.legal =
              meeting.legal?.filter((detail) => detail.id !== id) || [];
          });
          return data;
        });
        // Podríamos recalcular los totales (issues, pending, etc.) localmente o hacer una recarga si es mós simple.
        // Por simplicidad, una recarga puede ser aceptable aquó si los totales deben ser 100% precisos.
        this.onLoadData(this.tipoJunta);
      });
  }
}
