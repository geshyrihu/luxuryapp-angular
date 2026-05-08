import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { alertCircleOutline } from "ionicons/icons";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { CustomButton } from "../../../core/components/buttons/web";
import { MeetingSeguimientoEdit } from "../../juntas-comite/junta-comite-minutas/meeting-seguimiento-edit";
import { MinutaDetalleForm } from "../../juntas-comite/junta-comite-minutas/minuta-detalle-form";
import { ContMinutaSeguimientos } from "./cont-minuta-seguimientos";
@Component({
  selector: "app-cont-list-minuta-pendientes",
  templateUrl: "./minuta-pendientes-list.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    TagModule,
    CustomButtonEdit,
    CustomButtonItem,
    CustomButton,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    SanitizeHtmlPipe,
    DataViewMobile,
    ActionMenu,
    IonButtonEdit,
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class ContListMinutaPendientes implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  dialogS = inject(DialogService);
  messageS = inject(MessageService);
  pdfS = inject(PdfGeneratorService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;
  statusFiltroControl = new FormControl<number>(0);

  constructor() {
    addIcons({ alertCircleOutline });
  }

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        `ContabilidadMinuta/ListaMinuta/${this.authS.userToken.infoUserAuthDTO.applicationUserId}/${this.statusFiltroControl.value}`,
      )
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  onFiltrarData() {
    this.onLoadData();
  }

  onModalFormSeguimiento(meetingDetailsId: any, idMeetingSeguimiento: any) {
    this.dialogHandlerS
      .openDialog(
        MeetingSeguimientoEdit,
        {
          meetingDetailsId,
          idMeetingSeguimiento,
        },
        "Seguimiento",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalTodosSeguimientos(idItem: number) {
    this.dialogHandlerS
      .openDialog(
        ContMinutaSeguimientos,
        {
          idItem,
        },
        "Seguimientos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalFormMinutaDetalle(data: any) {
    this.dialogHandlerS
      .openDialog(
        MinutaDetalleForm,
        data,
        data.header,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDownloadPdf() {
    const pendientes = await this.apiResponseS.onGetList<any[]>(
      "ContabilidadMinuta/Pendientes/0",
    );

    if (!pendientes || pendientes.length === 0) {
      this.messageS.add({
        severity: "warn",
        summary: "Advertencia",
        detail: "No hay pendientes para generar el PDF",
      });
      return;
    }

    const bodyData = pendientes.map((p: any, index: number) => [
      { text: (index + 1).toString(), fontSize: 9 },
      { text: p.nombreCorto, fontSize: 9 },
      { text: p.date, fontSize: 9 },
      {
        stack: [
          { text: p.title, fontSize: 10, bold: true },
          { text: this.stripHtml(p.pendiente), fontSize: 9 },
        ],
      },
      p.seguimientos.length > 0
        ? {
            ul: p.seguimientos.map((s: any) => ({
              text: `${s.fecha}: ${s.seguimiento}`,
              fontSize: 9,
            })),
          }
        : { text: "-", fontSize: 9 },
    ]);

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: "Reporte de Pendientes en Minutas",
          style: "header",
        },
        {
          text: `Fecha de generación: ${new Date().toLocaleDateString()}`,
          style: "subheader",
        },
        {
          text: `Total de pendientes: ${pendientes.length}`,
          style: "subheader",
        },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "*", "*"] as any,
            body: [
              [
                { text: "#", style: "tableHeader" },
                { text: "Cliente", style: "tableHeader" },
                { text: "Fecha", style: "tableHeader" },
                { text: "Asunto", style: "tableHeader" },
                { text: "Seguimiento", style: "tableHeader" },
              ],
              ...(bodyData as any),
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 20, 0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 11,
          color: "#666666",
          margin: [0, 5, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "#FFFFFF",
          fillColor: "#4a5568",
        },
      },
      defaultStyle: {
        font: "Roboto",
        fontSize: 9,
      },
    };

    await this.pdfS.generatePdf(
      docDefinition,
      "Pendientes_Minutas_Contabilidad",
    );
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
}
