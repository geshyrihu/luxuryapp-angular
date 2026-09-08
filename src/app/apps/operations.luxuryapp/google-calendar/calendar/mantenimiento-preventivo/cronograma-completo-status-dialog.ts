import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { CronogramaAnualPdfStatusService } from "src/app/core/services/cronograma-anual-pdf-status.service";
import { PrimeNgCustomCaption } from "src/app/shared/ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "src/app/shared/ui/web/primeng-table/primeng-table";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { WebButtonLabel } from "src/app/shared/ui/buttons/web-label/button";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import {
  CronogramaAnualPdfStatus,
} from "./interfaces/CronogramaAnualPdfStatus";

@Component({
  selector: "app-cronograma-completo-status-dialog",
  templateUrl: "./cronograma-completo-status-dialog.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PrimeNgCustomCaption,
    AppIcon,
    WebButtonLabel,
  ],
  providers: [CronogramaAnualPdfStatusService, HtmlPrintService],
})
export class CronogramaCompletoStatusDialog {
  private service = inject(CronogramaAnualPdfStatusService);
  private customerIdS = inject(CustomerIdService);
  private config = inject(DynamicDialogConfig);
  private htmlPrintS = inject(HtmlPrintService);

  data = signal<CronogramaAnualPdfStatus[]>([]);
  loading = signal(false);
  selectedYear = new Date().getFullYear();
  availableYears = [
    this.selectedYear - 3,
    this.selectedYear - 2,
    this.selectedYear - 1,
    this.selectedYear,
  ];
  meses: string[] = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];

  constructor() {
    this.loadData();
  }

  async loadData(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    const filterId = this.config.data?.filterId;
    this.loading.set(true);
    const result = await this.service.getPdfStatus(
      customerId,
      filterId,
      this.selectedYear,
    );
    if (result) {
      this.data.set(result.sort((a, b) => a.sistema.localeCompare(b.sistema)));
    }
    this.loading.set(false);
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadData();
  }

  getFilterLabel(): string {
    const filterId = this.config.data?.filterId;
    if (filterId === 9) return "Pintura";
    if (filterId === 11) return "Carpinteria";
    if (filterId === 2) return "Amenidades";
    if (filterId === 8) return "AComunes";
    if (filterId === 7) return "Bodegas";
    if (filterId === 1) return "Equipos";
    if (filterId === 5) return "Gimnasio";
    if (filterId === 6) return "Sistemas";
    return "Todos";
  }

  getStatusInfo(item: CronogramaAnualPdfStatus, monthName: string): { hasService: boolean; status: string; color: string } {
    const monthNumber = this.meses.indexOf(monthName) + 1;
    const service = item.items.find(s => s.month === monthNumber);
    const status = service?.serviceOrderStatus || "";
    const s = status.toLowerCase();
    
    let color = "#0b3164";
    if (!status) color = "#e5e7eb";
    else if (s.includes("concluido")) color = "#16a34a";
    else if (s.includes("pendiente")) color = "#dc2626";
    else if (s.includes("proceso")) color = "#f59e0b";
    else if (s.includes("noautorizado")) color = "#f97316";
    else if (s.includes("cancelado")) color = "#6b7280";

    return {
      hasService: !!service,
      status: status || "Sin Orden",
      color,
    };
  }

  getStatusEmoji(status: string): string {
    if (!status) return "⬜";
    const s = status.toLowerCase();
    if (s.includes("concluido")) return "✅";
    if (s.includes("pendiente")) return "⏳";
    if (s.includes("proceso")) return "🔄";
    if (s.includes("noautorizado")) return "🚫";
    if (s.includes("cancelado")) return "❌";
    return "🔵";
  }

  async exportPdf(): Promise<void> {
    const data = this.data();
    if (!data || data.length === 0) return;

    const groups: { [sistema: string]: CronogramaAnualPdfStatus[] } = {};
    data.forEach((item) => {
      if (!groups[item.sistema]) groups[item.sistema] = [];
      groups[item.sistema].push(item);
    });

    let tableHtml = "";

    Object.keys(groups).forEach((sistema) => {
      tableHtml += `
        <tr>
          <td colspan="13" class="sistema-header">${this.htmlPrintS.esc(sistema.toUpperCase())}</td>
        </tr>
      `;

      groups[sistema].forEach((item, idx) => {
        const bg = idx % 2 === 0 ? "#ffffff" : "#f9fafb";
        let tds = "";
        this.meses.forEach((mes) => {
          const info = this.getStatusInfo(item, mes);
          const emoji = this.getStatusEmoji(info.status);
          
          tds += `<td style="background-color: ${bg}; text-align: center; vertical-align: middle;">
            ${info.hasService ? `<div style="font-size: 14px; line-height: 1;">${emoji}</div>` : ""}
            <div style="font-size: 7px; color: #6b7280; margin-top: 2px;">${info.status || ''}</div>
          </td>`;
        });

        tableHtml += `
          <tr>
            <td style="background-color: ${bg}; font-size: 9px; padding: 4px 6px;">${this.htmlPrintS.esc(item.nameMachinery)}</td>
            ${tds}
          </tr>
        `;
      });
    });

    const monthsHeaders = this.meses.map((m) => `<th>${m}</th>`).join("");
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();

    const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { size: landscape; margin: 10mm; }
  .container { max-width: 1400px; }
  th { background-color: #1E3A8A !important; color: #FFFFFF !important; }

  .sistema-header { background-color: #c9a84c !important; color: #ffffff !important; }

  .title { font-size: 16px; font-weight: bold; color: #0b3164; margin-bottom: 16px; }

  .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  .data-table th, .data-table td { padding:4px 2px; border:1px solid #e5e7eb; }
  .data-table th { background:#1E3A8A; color: #ffffff; font-weight:700; text-align:center; font-size: 9px; }

  .sistema-header { background:#c9a84c; color: #ffffff; font-weight:700; font-size: 10px; padding: 4px 6px !important; }

  .legend { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 10px; }
  .legend-item { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; color: #374151; }
  .legend-emoji { font-size: 14px; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Cronograma Anual - Estado de Servicios", `TIPO: ${this.getFilterLabel()} | AÑO: ${this.selectedYear}`, generatedAt, "MANTENIMIENTO")}

  <div class="legend">
    <span class="legend-item"><span class="legend-emoji">✅</span> Concluido</span>
    <span class="legend-item"><span class="legend-emoji">⏳</span> Pendiente</span>
    <span class="legend-item"><span class="legend-emoji">🔵</span> En espera / programado</span>
    <span class="legend-item"><span class="legend-emoji">🔄</span> Proceso</span>
    <span class="legend-item"><span class="legend-emoji">🚫</span> No autorizado</span>
    <span class="legend-item"><span class="legend-emoji">❌</span> Cancelado</span>
  </div>

  <div class="body-doc">
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 25%;">DESCRIPCIÓN</th>
          ${monthsHeaders}
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

    this.htmlPrintS.printHtml(
      html,
      `Cronograma_Completo_${this.getFilterLabel()}_${this.selectedYear}`,
    );
  }
}
