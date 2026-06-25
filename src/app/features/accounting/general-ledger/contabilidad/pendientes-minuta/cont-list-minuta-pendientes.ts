import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { alertCircleOutline } from "ionicons/icons";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButton } from "src/app/core/components/buttons/web";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { EmptyState } from "src/app/core/components/empty-state/empty-state";
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
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { MeetingSeguimientoEdit } from "src/app/features/operations/meetings/juntas-comite/junta-comite-minutas/meeting-seguimiento-edit";
import { MinutaDetalleForm } from "src/app/features/operations/meetings/juntas-comite/junta-comite-minutas/minuta-detalle-form";
import { ContMinutaSeguimientos } from "./cont-minuta-seguimientos";
@Component({
  selector: "app-cont-list-minuta-pendientes",
  templateUrl: "./minuta-pendientes-list.html",
  imports: [
    CommonModule,
    EmptyState,
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
    CustomButtonEdit,
    IonItem,
    IonLabel,
  ],
})
export class ContListMinutaPendientes implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  messageS = inject(MessageService);
  htmlPrintS = inject(HtmlPrintService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
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

    let tableHtml = "";
    pendientes.forEach((p: any, index: number) => {
      const bg = index % 2 === 0 ? "#ffffff" : "#f9fafb";

      let seguimientosHtml = "-";
      if (p.seguimientos && p.seguimientos.length > 0) {
        seguimientosHtml = `<ul style="margin: 0; padding-left: 15px; font-size: 11px;">`;
        p.seguimientos.forEach((s: any) => {
          seguimientosHtml += `<li><strong>${this.htmlPrintS.esc(s.fecha)}:</strong> ${this.htmlPrintS.esc(s.seguimiento)}</li>`;
        });
        seguimientosHtml += `</ul>`;
      }

      tableHtml += `
        <tr>
          <td style="background-color: ${bg}; padding: 8px; text-align: center;">${index + 1}</td>
          <td style="background-color: ${bg}; padding: 8px;">${this.htmlPrintS.esc(p.nombreCorto)}</td>
          <td style="background-color: ${bg}; padding: 8px; text-align: center;">${this.htmlPrintS.esc(p.date)}</td>
          <td style="background-color: ${bg}; padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 2px;">${this.htmlPrintS.esc(p.title)}</div>
            <div style="color: #555;">${this.htmlPrintS.esc(this.stripHtml(p.pendiente))}</div>
          </td>
          <td style="background-color: ${bg}; padding: 8px;">${seguimientosHtml}</td>
        </tr>
      `;
    });

    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();

    const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 1000px; margin: auto; }
  .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; font-size: 12px; }
  .data-table th, .data-table td { padding:8px; border-bottom:1px solid #EEEEEE; vertical-align: top; }
  .data-table th { background-color: #4a5568; color: #ffffff; font-weight: bold; text-align: left; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Reporte de Pendientes en Minutas", `Total de pendientes: ${pendientes.length}`, generatedAt, "CONTABILIDAD")}

  <div class="body-doc">
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 5%; text-align: center;">#</th>
          <th style="width: 15%;">Cliente</th>
          <th style="width: 15%; text-align: center;">Fecha</th>
          <th style="width: 35%;">Asunto</th>
          <th style="width: 30%;">Seguimiento</th>
        </tr>
      </thead>
      <tbody>
        ${tableHtml}
      </tbody>
    </table>
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

    this.htmlPrintS.printHtml(html, "Pendientes_Minutas_Contabilidad");
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
}
