import { inject, Injectable } from "@angular/core";
import { CustomToastService } from "@core/services/custom-toast.service";
import { HtmlPrintService } from "@core/services/html-print.service";

@Injectable({ providedIn: "root" })
export class ElevatorLogsPdfService {
  private htmlPrintS = inject(HtmlPrintService);
  private toastS = inject(CustomToastService);

  async downloadEmergencyCalls(data: any[]): Promise<void> {
    await this.downloadList(
      data,
      "BITÁCORA DE LLAMADAS DE EMERGENCIA DE ELEVADORES",
      "Llamadas_Emergencia_Elevadores",
      [
        "Fecha",
        "Equipo",
        "Folio",
        "Reporte",
        "Respuesta",
        "Reportó",
        "Atendió",
      ],
      (item) => [
        item.requestDate,
        item.machinery,
        item.folio,
        item.report,
        item.request,
        item.personWhoReports,
        item.technicianWhoAttended,
      ],
    );
  }

  async downloadSpareParts(data: any[]): Promise<void> {
    await this.downloadList(
      data,
      "BITÁCORA DE CAMBIOS DE REFACCIONES DE ELEVADORES",
      "Cambios_Refacciones_Elevadores",
      [
        "Folio",
        "Fecha",
        "Equipo",
        "Falla",
        "Pieza",
        "Clave",
        "Costo",
        "Supervisó",
      ],
      (item) => [
        item.folio,
        item.changeDate,
        item.machinery,
        item.failure,
        item.partName,
        item.partKey,
        item.price,
        item.supervised,
      ],
    );
  }

  private async downloadList(
    data: any[],
    title: string,
    fileName: string,
    headers: string[],
    getValues: (item: any) => unknown[],
  ): Promise<void> {
    if (!data?.length) {
      this.toastS.showWarn(
        "Sin datos",
        "No hay registros para generar el PDF.",
      );
      return;
    }

    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();
    const rows = data
      .map(
        (item) =>
          `<tr>${getValues(item)
            .map(
              (value) => `<td>${this.htmlPrintS.esc(String(value ?? ""))}</td>`,
            )
            .join("")}</tr>`,
      )
      .join("");
    const headerHtml = headers.map((header) => `<th>${header}</th>`).join("");

    const html = `<!doctype html><html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  .data-table { width:100%; border-collapse:collapse; margin-top:20px; font-size:0.76rem; }
  .data-table th, .data-table td { padding:6px 7px; border:1px solid #D1D5DB; vertical-align:top; }
  .data-table th { background:#E8EEF8; font-weight:700; color:#111827; }
  .data-table tbody tr:nth-child(even) { background:#FAFAFA; }
</style>
</head><body><div class="container">
${this.htmlPrintS.buildStandardHeader(logo, title, "LISTADO", generatedAt, "MANTENIMIENTO")}
<div class="body-doc"><table class="data-table"><thead><tr>${headerHtml}</tr></thead><tbody>${rows}</tbody></table></div>
${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div></body></html>`;

    this.htmlPrintS.printHtml(html, `${fileName}_${generatedAt.getTime()}`);
  }
}
