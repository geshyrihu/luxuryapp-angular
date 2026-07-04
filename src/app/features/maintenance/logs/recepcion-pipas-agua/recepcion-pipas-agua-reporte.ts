import { CommonModule, formatDate } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import FileSaver from "file-saver";
import { TableModule } from "primeng/table";
import { CustomInputDatepicker } from "@ui/inputs/web/custom-input-datepicker-signal";
import { WebButtonLabelDownload } from "@ui/buttons/web-label/button-download";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { IRecepcionPipaAgua } from "./recepcion-pipas-agua.interfaces";

import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";

@Component({
  selector: "app-recepcion-pipas-agua-reporte",
  templateUrl: "./recepcion-pipas-agua-reporte.html",
  imports: [
    WebButtonIconDownload,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    FormsModule,
    CustomInputDatepicker,
    TableModule,
    WebButtonLabelDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
  ],
})
export class RecepcionPipasAguaReporte implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  htmlPrintS = inject(HtmlPrintService);

  dataSignal = signal<IRecepcionPipaAgua[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();

  customerName = computed(
    () => this.customerIdS.customerName() || "Cliente activo",
  );
  customerLogo = computed(
    () =>
      this.customerIdS.customerPhotoPath() ||
      "assets/images/default-avatar.png",
  );

  private readonly _today = new Date();
  startDate: Date | null = new Date(
    this._today.getFullYear(),
    this._today.getMonth(),
    1,
    0,
    0,
    0,
  );
  endDate: Date | null = new Date(
    this._today.getFullYear(),
    this._today.getMonth() + 1,
    0,
    23,
    59,
    0,
  );

  private allData: IRecepcionPipaAgua[] = [];

  totalRecepciones = computed(() => this.dataSignal().length);

  totalM3 = computed(() =>
    this.dataSignal().reduce(
      (acc, x) =>
        acc + ((x.lecturaMedidorFinal ?? 0) - (x.lecturaMedidorInicial ?? 0)),
      0,
    ),
  );

  totalConIVA = computed(() =>
    this.dataSignal().reduce((acc, x) => {
      const m3 = (x.lecturaMedidorFinal ?? 0) - (x.lecturaMedidorInicial ?? 0);
      return acc + (x.costoMetroCubico ?? 0) * m3;
    }, 0),
  );

  subtotalSinIVA = computed(() => this.totalConIVA() / 1.16);
  ivaDesglosado = computed(() => this.totalConIVA() - this.subtotalSinIVA());
  retencion = computed(() => this.subtotalSinIVA() * 0.04);
  totalAPagar = computed(() => this.totalConIVA() - this.retencion());

  ngOnInit(): void {
    this.onLoadData();
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    let data = this.allData;
    if (this.startDate || this.endDate) {
      data = data.filter((x) => {
        const d = new Date(x.horaLlegada);
        if (this.startDate && d < this.startDate) return false;
        if (this.endDate && d > this.endDate) return false;
        return true;
      });
    }
    this.dataSignal.set(data);
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetList(`recepcion-pipas-agua/list/${this.customerIdS.customerId()}`)
      .then((result: IRecepcionPipaAgua[]) => {
        this.allData = result ?? [];
        this.applyFilter();
      });
  }

  async onDownloadPdf(): Promise<void> {
    const fmtMoney = (v: number) =>
      `$${v.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const fmtDate = (d: string | null) => {
      if (!d) return "En curso";
      const clean = d.replace(/Z$/, "").replace(/[+-]\d{2}:\d{2}$/, "");
      const [datePart, timePart] = clean.split("T");
      if (!datePart) return "-";
      const [y, mo, day] = datePart.split("-");
      return `${day}/${mo}/${y} ${(timePart || "00:00").slice(0, 5)}`;
    };

    const fmtDt = (d: Date | null) =>
      d ? formatDate(d, "dd/MM/yyyy HH:mm", "es-MX") : "N/A";
    const periodoLabel = `${fmtDt(this.startDate)} - ${fmtDt(this.endDate)}`;

    const data = this.dataSignal();

    let tableHtml = "";
    data.forEach((item, i) => {
      const m3 =
        (item.lecturaMedidorFinal ?? 0) - (item.lecturaMedidorInicial ?? 0);
      const importe = (item.costoMetroCubico ?? 0) * m3;
      const bg = i % 2 === 0 ? "#ffffff" : "#f8fafc";
      const cist = `${Math.round(item.nivelCisternaAntes ?? 0)}% ? ${Math.round(item.nivelCisternaDespues ?? 0)}%<br>(${Math.round((item.nivelCisternaDespues ?? 0) - (item.nivelCisternaAntes ?? 0))}%)`;
      const personal = [item.colaboradorMtto, item.guardiaSeguridad]
        .filter(Boolean)
        .join("<br>");

      tableHtml += `
        <tr>
          <td style="background-color: ${bg}; padding: 6px;">${this.htmlPrintS.esc(item.empresa ?? "")}</td>
          <td style="background-color: ${bg}; padding: 6px;">${this.htmlPrintS.esc(item.placasCamion)}<br>${(item.capacidadPipa ?? 0).toLocaleString("es-MX")} L</td>
          <td style="background-color: ${bg}; padding: 6px;">${fmtDate(item.horaLlegada)}<br>${fmtDate(item.horaTermino)}</td>
          <td style="background-color: ${bg}; padding: 6px; text-align: center;">${cist}</td>
          <td style="background-color: ${bg}; padding: 6px; text-align: center;">${Math.round(item.lecturaMedidorInicial ?? 0)} ? ${Math.round(item.lecturaMedidorFinal ?? 0)}</td>
          <td style="background-color: ${bg}; padding: 6px; text-align: right; font-weight: bold;">${Math.round(m3)}</td>
          <td style="background-color: ${bg}; padding: 6px; text-align: right;">${(item.costoMetroCubico ?? 0).toFixed(2)}<br>${fmtMoney(importe)}</td>
          <td style="background-color: ${bg}; padding: 6px;">${personal}</td>
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
  .kpi-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; margin-bottom: 20px; margin-top: 20px; }
  .kpi-cards { display: flex; flex-direction: column; gap: 10px; }
  .kpi-card { border: 1px solid #e2e8f0; padding: 10px; text-align: center; border-radius: 4px; }
  .kpi-title { font-size: 10px; color: #6b7280; margin-bottom: 5px; }
  .kpi-value { font-size: 24px; font-weight: bold; color: #003A62; }
  .kpi-value.blue { color: #1d4ed8; }
  .summary-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .summary-table th { background-color: #003A62; color: white; padding: 8px; text-align: left; font-weight: bold; }
  .summary-table td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; }
  .summary-table tr td:last-child { border-right: none; }
  .data-table { width: 100%; border-collapse: collapse; font-size: 10px; }
  .data-table th { background-color: #003A62; color: white; padding: 6px; text-align: left; font-weight: bold; }
  .data-table td { border-bottom: 1px solid #e2e8f0; vertical-align: top; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Recepción de Pipas de Agua é Reporte", periodoLabel, generatedAt, "MANTENIMIENTO")}

  <div class="body-doc">
    <div style="border-top: 2px solid #f59e0b; margin-bottom: 10px;"></div>

    <div class="kmdi:grid">
      <div class="kmdi:cards">
        <div class="kmdi:card">
          <div class="kmdi:format-title">Total recepciones</div>
          <div class="kmdi:percent">${this.totalRecepciones()}</div>
        </div>
        <div class="kmdi:card">
          <div class="kmdi:format-title">Total mí descargados</div>
          <div class="kmdi:percent blue">${Math.round(this.totalM3())}</div>
        </div>
      </div>
      <div>
        <table class="summary-table">
          <thead>
            <tr><th colspan="2">Resumen de costos del periodo</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Importe total (precio con IVA é mí)</td>
              <td style="text-align: right; font-weight: bold;">${fmtMoney(this.totalConIVA())}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding-left: 20px;">Subtotal base (sin IVA)</td>
              <td style="color: #6b7280; text-align: right;">${fmtMoney(this.subtotalSinIVA())}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding-left: 20px;">IVA 16%</td>
              <td style="color: #6b7280; text-align: right;">${fmtMoney(this.ivaDesglosado())}</td>
            </tr>
            <tr>
              <td style="color: #dc2626; font-weight: bold;">Retención 4%</td>
              <td style="color: #dc2626; text-align: right; font-weight: bold;">(${fmtMoney(this.retencion())})</td>
            </tr>
            <tr style="background-color: #003A62; color: white;">
              <td style="font-weight: bold; font-size: 14px;">TOTAL A PAGAR</td>
              <td style="text-align: right; font-weight: bold; font-size: 14px;">${fmtMoney(this.totalAPagar())}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div style="font-size: 12px; font-weight: bold; color: #003A62; margin-bottom: 10px;">Detalle del periodo</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Empresa</th>
          <th>Placas / Cap.</th>
          <th>Llegada / Túrmino</th>
          <th style="text-align: center;">Cisterna ant ? des</th>
          <th style="text-align: center;">Medidor ini ? fin</th>
          <th style="text-align: right;">mí</th>
          <th style="text-align: right;">Costo / Importe</th>
          <th>Personal</th>
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

    const slug = periodoLabel.replace(/\//g, "-").replace(/ - /g, "_");
    this.htmlPrintS.printHtml(html, `reporte-pipas-${slug}`);
  }

  exportExcel(): void {
    import("xlsx").then((xlsx) => {
      const rows = this.dataSignal().map((item) => {
        const m3 =
          (item.lecturaMedidorFinal ?? 0) - (item.lecturaMedidorInicial ?? 0);
        return {
          Empresa: item.empresa ?? "",
          Placas: item.placasCamion,
          "Cap. (L)": item.capacidadPipa,
          Llegada: item.horaLlegada
            ? formatDate(item.horaLlegada, "dd/MM/yyyy HH:mm", "es-MX")
            : "",
          Termino: item.horaTermino
            ? formatDate(item.horaTermino, "dd/MM/yyyy HH:mm", "es-MX")
            : "En curso",
          "Cisterna antes (%)": item.nivelCisternaAntes,
          "Cisterna despues (%)": item.nivelCisternaDespues,
          "Dif. cisterna (%)":
            (item.nivelCisternaDespues ?? 0) - (item.nivelCisternaAntes ?? 0),
          "Medidor inicial": item.lecturaMedidorInicial,
          "Medidor final": item.lecturaMedidorFinal,
          "mí ingresados": m3,
          "Costo mí": item.costoMetroCubico,
          "Importe (c/IVA)": (item.costoMetroCubico ?? 0) * m3,
          "Colaborador mtto": item.colaboradorMtto ?? "",
          "Guardia testigo": item.guardiaSeguridad ?? "",
        };
      });
      const ws = xlsx.utils.json_to_sheet(rows);
      const wb = { Sheets: { Reporte: ws }, SheetNames: ["Reporte"] };
      const buffer: any = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      FileSaver.saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }),
        `recepcion-pipas-reporte.xlsx`,
      );
    });
  }
}
