import { Component, effect, inject, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
  IonButtonConfirm,
  IonButtonDelete,
  IonButtonEdit,
  IonButtonItem,
} from "src/app/core/components/buttons/mobile";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IMeetingIndex } from "src/app/core/interfaces/meeting-index.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
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
@Component({
  selector: "app-minutas-list",
  templateUrl: "./minutas-list.html",
  imports: [
    TableModule,
    CustomButton,
    ButtonModule,
    NgbTooltipModule,
    TooltipModule,
    AccordionModule,
    ActionMenu,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    AreaDetailsTable,
    RouterModule,
    CardModule,
    IonItem,
    IonLabel,
    IonButtonConfirm,
    IonButtonDelete,
    IonButtonEdit,
    IonButtonItem,
  ],
})
export class MinutasList {
  // --- InyecciÃ³n de Dependencias ---
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  reportService = inject(ReportService);
  minutaPdfS = inject(MinutaPdfService);
  customToastS = inject(CustomToastService);
  route = inject(Router);
  // --- Propiedades del Componente ---
  dataSignal = signal<IMeetingIndex[]>([]);
  ref: DynamicDialogRef;
  public AspRole = EApplicationRole;

  /** Tipo de junta actual que se estÃ³ mostrando ('ComitÃ©', 'Asamblea', etc.). */
  tipoJunta: number = 1;

  /** Opciones de configuraciÃ³n para la tabla PrimeNG. */
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
   * Carga la lista de minutas desde la API segÃ³n el tipo de junta.
   * @param tipoJunta El tipo de junta a cargar ('ComitÃ©', 'Asamblea', 'OperaciÃ³n').
   */
  onLoadData(tipoJuntaEnum: number): void {
    // console.log("ðŸš€ ~ MinutasList ~ onLoadData ~ tipoJunta:", tipoJunta);
    // // Se actualiza el tipo de junta ANTES de la llamada para evitar race conditions.
    // this.tipoJunta = tipoJunta;
    // console.log(
    //   "ðŸš€ ~ MinutasList ~ onLoadData ~ this.tipoJunta:",
    //   this.tipoJunta,
    // );

    // // Mapeo manual de string a valor numÃ©rico del enum ETypeMeeting (0: Comite, 1: Asamblea, 2: Operacion)
    // let tipoJuntaEnum = 0;
    // if (tipoJunta.includes("Asamblea")) tipoJuntaEnum = 1;
    // if (tipoJunta.includes("Operacion")) tipoJuntaEnum = 2;

    const urlApi = `Meetings/list/${this.customerIdS.customerId()}/${tipoJuntaEnum}`;
    this.apiResponseS.onGetList(urlApi).then((result: IMeetingIndex[]) => {
      this.dataSignal.set(result);
    });
  }

  /**
   * Exporta los pendientes de una minuta a un fichero Excel.
   * @param meetingId El ID de la minuta.
   */
  exportToExcel(meetingId: any): void {
    const urlApi = `MeetingDertailsSeguimiento/ExportSummaryToExcel/${meetingId}`;
    this.apiResponseS.exportToExcel(urlApi, "Pendientes Minuta");
  }

  /**
   * Elimina una minuta completa.
   * @param id El ID de la minuta a eliminar.
   */
  onDelete(id: string): void {
    this.apiResponseS.onDelete(`Meetings/${id}`).then((result: boolean) => {
      if (result) {
        // OptimizaciÃ³n: Eliminar el item del array local en lugar de recargar todo.
        this.dataSignal.update((data) =>
          data.filter((meeting) => meeting.id !== id),
        );
      }
    });
  }

  /**
   * EnvÃ³a la minuta por correo electrÃ³nico al ComitÃ©.
   * @param meetingId El ID de la minuta.
   */
  onSendEmailMeeting(meetingId: any): void {
    const urlApi = `sendemail/meeting/${meetingId}`;
    this.apiResponseS.onPost(urlApi).then(() => {});
  }

  /**
   * Abre el modal para agregar o editar una minuta.
   * @param data Objeto con el ID de la minuta (0 para nuevo) y el tÃ³tulo del modal.
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
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta); // Recargar es necesario al agregar/editar una minuta completa.
      });
  }

  /**
   * Abre un modal que muestra una lista filtrada de asuntos de una minuta.
   * @param id El ID de la minuta.
   * @param header El tÃ³tulo para el modal.
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
   * Este mÃ³todo es llamado por el evento del componente hijo.
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

  /** Alias usado en la vista mÃ³vil. */
  onGeneretePDF(id: any): void {
    this.onGenerarMinutaPdf(id);
  }

  private onGenerarMinutaPdf(meetingId: any): void {
    this.customToastS.showInfo(
      "Generando PDF",
      "Espere un momento por favor...",
    );
    this.apiResponseS
      .onGetList(`Meetings/MeetingReportPdf/${meetingId}`)
      .then(async (meetingData: any) => {
        if (!meetingData) {
          this.customToastS.showError(
            "Error",
            "No se encontraron datos para generar el PDF.",
          );
          return;
        }
        if (meetingData.minutaCliente?.customerLogo) {
          meetingData.minutaCliente.customerLogo = await this.minutaPdfS
            .urlToBase64(meetingData.minutaCliente.customerLogo)
            .catch(() => null);
        }
        const docDefinition = this.buildMinutaPdfContent(meetingData);
        const dateLabel = this.pdfFormatDate(meetingData.minuta?.date);
        const tipo = meetingData.minuta?.eTypeMeeting ?? "Junta";
        this.minutaPdfS.download(docDefinition, `Minuta-${tipo}-${dateLabel}`);
      })
      .catch((error) => {
        console.error("Error al obtener datos de la minuta:", error);
        this.customToastS.showError(
          "Error",
          "No se pudieron obtener los datos de la minuta.",
        );
      });
  }

  private pdfParseMeetingDate(dateString: string): Date | null {
    const monthMap: { [key: string]: number } = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    };
    try {
      const [datePart, timePart] = dateString.split(" ");
      const [day, monthAbbr, yearAbbr] = datePart.split("-");
      const monthNum = monthMap[monthAbbr.toLowerCase().replace(".", "")];
      const fullYear = parseInt(yearAbbr) + 2000;
      const [hours, minutes] = (timePart ?? "0:0").split(":");
      if (monthNum !== undefined && !isNaN(fullYear) && !isNaN(parseInt(day))) {
        return new Date(
          fullYear,
          monthNum,
          parseInt(day),
          parseInt(hours ?? "0"),
          parseInt(minutes ?? "0"),
        );
      }
    } catch {
      /* ignorar */
    }
    return null;
  }

  private pdfFormatDate(dateValue: any): string {
    if (!dateValue) return "N/A";
    const d =
      dateValue instanceof Date
        ? dateValue
        : this.pdfParseMeetingDate(dateValue.toString());
    if (d) {
      return d.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return dateValue.toString();
  }

  private pdfStripHtml(html: string): string {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private buildMinutaPdfContent(data: any): TDocumentDefinitions {
    const headerColumns: any[] = [];
    if (data.minutaCliente?.customerLogo) {
      headerColumns.push({
        image: data.minutaCliente.customerLogo,
        width: 100,
      });
    }
    headerColumns.push({
      stack: [
        { text: "MINUTA DE JUNTA", style: "minutaHeader" },
        {
          text: data.minutaCliente?.customer ?? "",
          alignment: "right",
          fontSize: 11,
        },
        {
          text: `Tipo: ${data.minuta?.eTypeMeeting ?? ""}`,
          alignment: "right",
          fontSize: 10,
        },
        {
          text: `Fecha: ${this.pdfFormatDate(data.minuta?.date)}`,
          alignment: "right",
          fontSize: 10,
        },
      ],
    });

    const asistentesContent: any[] = [
      { text: "ASISTENTES", style: "minutaSubheader" },
    ];
    const asistentesColumns: any[] = [];

    if (data.comite?.length > 0) {
      const body = [
        [
          { text: "Cargo", style: "minutaTableHeader" },
          { text: "Nombre", style: "minutaTableHeader" },
        ],
        ...data.comite.map((i: any) => [
          { text: i.cargo, style: "minutaTableCell" },
          { text: i.nombre, style: "minutaTableCell" },
        ]),
      ];
      asistentesColumns.push({
        stack: [
          { text: "ComitÃ© de Vigilancia", style: "minutaSectionTitle" },
          {
            table: { widths: ["auto", "*"], body },
            layout: "lightHorizontalLines",
          },
        ],
      });
    }

    if (data.administracion?.length > 0) {
      const body = [
        [
          { text: "Cargo", style: "minutaTableHeader" },
          { text: "Nombre", style: "minutaTableHeader" },
        ],
        ...data.administracion.map((i: any) => [
          { text: i.cargo, style: "minutaTableCell" },
          { text: i.nombre, style: "minutaTableCell" },
        ]),
      ];
      asistentesColumns.push({
        stack: [
          { text: "Administración", style: "minutaSectionTitle" },
          {
            table: { widths: ["auto", "*"], body },
            layout: "lightHorizontalLines",
          },
        ],
      });
    }

    if (asistentesColumns.length > 0) {
      asistentesContent.push({ columns: asistentesColumns });
    }

    if (data.externos?.length > 0) {
      asistentesContent.push({
        text: "Invitados",
        style: "minutaSectionTitle",
        margin: [0, 8, 0, 3],
      });
      asistentesContent.push({
        table: {
          widths: ["*"],
          body: data.externos.map((i: any) => [
            { text: i.invitado, style: "minutaTableCell" },
          ]),
        },
        layout: "lightHorizontalLines",
      });
    }

    const asuntosContent: any[] = [];
    if (data.asuntos?.length > 0) {
      asuntosContent.push({
        text: "DETALLES DE LA JUNTA",
        style: "minutaSubheader",
      });
      data.asuntos.forEach((area: any) => {
        asuntosContent.push({
          text: area.responsibleArea,
          style: "minutaAreaTitle",
          margin: [0, 10, 0, 4],
        });
        area.items?.forEach((asunto: any, index: number) => {
          const descripcion = this.pdfStripHtml(asunto.requestService);
          const stackItems: any[] = [
            {
              text: `${index + 1}. ${asunto.title}`,
              bold: true,
              fontSize: 10,
              margin: [0, 4, 0, 2],
            },
          ];
          if (descripcion) {
            stackItems.push({
              text: descripcion,
              fontSize: 9,
              color: "#444444",
              margin: [12, 0, 0, 6],
            });
          }
          asuntosContent.push({ stack: stackItems, unbreakable: true });
        });
      });
    }

    return {
      content: [
        { columns: headerColumns },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 10,
              x2: 515,
              y2: 10,
              lineWidth: 1,
              lineColor: "#CCCCCC",
            },
          ],
        },
        { text: "", margin: [0, 0, 0, 10] },
        ...asistentesContent,
        { text: "", margin: [0, 0, 0, 10] },
        ...asuntosContent,
      ],
      styles: {
        minutaHeader: {
          fontSize: 16,
          bold: true,
          alignment: "right",
          color: "#003A62",
        },
        minutaSubheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5],
          color: "#003A62",
        },
        minutaSectionTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 5, 0, 3],
          color: "#444444",
        },
        minutaAreaTitle: {
          fontSize: 11,
          bold: true,
          color: "#003A62",
          fillColor: "#f2f2f2",
        },
        minutaTableHeader: { bold: true, fontSize: 9, color: "#003A62" },
        minutaTableCell: { fontSize: 9 },
      },
    };
  }

  /**
   * Navega a la pÃ³gina de resumen de una minuta.
   * @param id El ID de la minuta.
   */
  resumenMinuta(id: any): void {
    this.route.navigate(["/committee-meetings/resumen-minuta", id]);
  }

  /**
   * EnvÃ³a un correo electrÃ³nico a los responsables de un Ã³rea especÃ³fica de una minuta.
   * @param id El ID de la minuta.
   * @param eAreaMinutasDetalles El identificador numÃ³rico del Ã³rea.
   */
  onSendEmail(id: any, eAreaMinutasDetalles: number): void {
    const urlApi = `Meetings/SendEmailResponsible/${id}/${this.customerIdS.customerId()}/${eAreaMinutasDetalles}/${
      this.authS.infoUserAuth.applicationUserId
    }`;
    this.apiResponseS.onPost(urlApi).then(() => {});
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
    this.apiResponseS.onDelete(`MeetingDertailsSeguimiento/${id}`).then(() => {
      // OptimizaciÃ³n: Eliminar el seguimiento del array local.
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
    this.apiResponseS.onDelete(`MeetingsDetails/${id}`).then(() => {
      // OptimizaciÃ³n: Eliminar el detalle del array local.
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
      // PodrÃ³amos recalcular los totales (issues, pending, etc.) localmente o hacer una recarga si es mÃ³s simple.
      // Por simplicidad, una recarga puede ser aceptable aquÃ³ si los totales deben ser 100% precisos.
      this.onLoadData(this.tipoJunta);
    });
  }
}
