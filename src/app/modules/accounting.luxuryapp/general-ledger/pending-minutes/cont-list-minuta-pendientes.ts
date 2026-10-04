import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { HtmlPrintService } from "@core/services/html-print.service";
import { MessageService } from "@core/services/message.service";
import { PlatformService } from "@core/services/platform.service";
import { MeetingSeguimientoEdit } from "@management.luxuryapp/monthly-meetings/meeting-minutes/meeting-seguimiento-edit";
import { MinutaDetalleForm } from "@management.luxuryapp/monthly-meetings/meeting-minutes/minuta-detalle-form";
import { ContMinutaSeguimientos } from "./cont-minuta-seguimientos";
import { MinutaPendientesListDesktop } from "./desktop/minuta-pendientes-list-desktop";
import { MinutaPendientesListMobile } from "./mobile/minuta-pendientes-list-mobile";

@Component({
  selector: "app-cont-list-minuta-pendientes",
  templateUrl: "./minuta-pendientes-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MinutaPendientesListDesktop, MinutaPendientesListMobile],
})
export class ContListMinutaPendientes implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  messageS = inject(MessageService);
  htmlPrintS = inject(HtmlPrintService);
  platformS = inject(PlatformService);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  statusFiltroControl = new FormControl<number>(0);

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.ContabilidadMinuta.pendingList(
          this.authS.userToken.infoUserAuthDTO.applicationUserId,
          this.statusFiltroControl.value,
        ),
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDownloadPdf() {
    const pendientes = await this.apiResponseS.onGetList<any[]>(
      Endpoints.ContabilidadMinuta.pendingPdf(0),
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
