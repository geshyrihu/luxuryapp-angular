import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DateRangeStorageService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/date-range-storage.service";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";

@Component({
  selector: "app-task-weekly-report-preview",
  templateUrl: "./task-weekly-report-preview.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WebButtonLabel],
})
export class TaskWeeklyReportPreview implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateRangeStorageService = inject(DateRangeStorageService);
  TaskGroupService = inject(TaskGroupService);
  htmlPrintS = inject(HtmlPrintService);
  // Declaración e inicialización de variables
  data = signal<any>(null);
  exportingPdf = signal(false);
  // Modificamos la declaración de dateRange para que use un objeto con from y to
  year: any = this.TaskGroupService.year || 0;
  numeroSemana: any = this.TaskGroupService.numeroSemana || 0;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.TaskReports.weeklyPreview(
          this.customerIdS.customerId(),
          this.year,
          this.numeroSemana,
        ),
      )
      .then((result: any) => {
        this.data.set(result);
      });
  }

  async exportPdf(): Promise<void> {
    const report = this.data();
    if (!report) return;

    this.exportingPdf.set(true);
    try {
      const logo = report.customerLogo
        ? await this.toDataUrl(report.customerLogo)
        : null;

      const imageMap = new Map<string, string>();
      await Promise.all(
        report.tickets
          .flatMap((t: any) => [t.beforeWork, t.afterWork])
          .filter((url: string | null): url is string => !!url)
          .map(async (url) => {
            try {
              const blob = await this.apiResponseS.getBlobFileFromFullUrl(url);
              if (blob) imageMap.set(url, await this.blobToBase64(blob));
            } catch {
              // Omitir imagenes que no se puedan cargar
            }
          }),
      );

      let ticketsHtml = "";
      for (const ticket of report.tickets) {
        const before = ticket.beforeWork
          ? imageMap.get(ticket.beforeWork)
          : null;
        const after = ticket.afterWork ? imageMap.get(ticket.afterWork) : null;
        ticketsHtml += `
          <div class="ticket-card">
            <div class="ticket-title">${this.htmlPrintS.esc(ticket.title)}</div>
            <div class="ticket-desc">${this.htmlPrintS.esc(ticket.description)}</div>
            <div class="ticket-images">
              <div class="ticket-image">
                ${before ? `<img src="${before}" alt="Antes" />` : `<div class="no-image">Sin imagen antes</div>`}
                <div class="ticket-image-label">Antes</div>
              </div>
              <div class="ticket-image">
                ${after ? `<img src="${after}" alt="Después" />` : `<div class="no-image">Sin imagen después</div>`}
                <div class="ticket-image-label">Después</div>
              </div>
            </div>
          </div>
        `;
      }

      const generatedAt = new Date();
      const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 1000px; margin: auto; }
  .ticket-card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin-bottom: 16px; break-inside: avoid; page-break-inside: avoid; }
  .ticket-title { font-size: 14px; font-weight: 700; color: #0B3164; margin-bottom: 6px; }
  .ticket-desc { font-size: 11px; color: #4b5563; margin-bottom: 12px; }
  .ticket-images { display: flex; gap: 16px; }
  .ticket-image { flex: 1; }
  .ticket-image img { width: 100%; border-radius: 4px; border: 1px solid #e5e7eb; }
  .ticket-image-label { font-size: 9px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-top: 4px; }
  .no-image { display: flex; align-items: center; justify-content: center; min-height: 120px; border: 1px dashed #d1d5db; border-radius: 4px; color: #9ca3af; font-size: 10px; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, report.customer, report.periodReport, generatedAt, "REPORTE SEMANAL")}
  <div class="body-doc">
    ${ticketsHtml}
  </div>
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

      const slug = String(report.customer).replace(/\s+/g, "-").toLowerCase();
      this.htmlPrintS.printHtml(html, `reporte-semanal-${slug}`);
    } finally {
      this.exportingPdf.set(false);
    }
  }

  private async toDataUrl(url: string): Promise<string | null> {
    try {
      const blob = await this.apiResponseS.getBlobFileFromFullUrl(url);
      if (blob) return await this.blobToBase64(blob);
    } catch {
      // Omitir si no se puede cargar
    }
    return null;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
