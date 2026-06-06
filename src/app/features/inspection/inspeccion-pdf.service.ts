import { Injectable, inject } from "@angular/core";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";

@Injectable({ providedIn: "root" })
export class InspeccionPdfService {
  private readonly htmlPrintS = inject(HtmlPrintService);
  private readonly toastS = inject(CustomToastService);

  async generarReporte(data: any, nombre?: string): Promise<void> {
    if (!data) {
      this.toastS.showError("Sin datos", "No hay datos para generar el reporte.");
      return;
    }
    this.toastS.showInfo("Generando reporte", "Espere por favor...");

    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();
    const results: any[] = data.results ?? [];

    const resultsHtml = results.map((item: any) => `
      <tr>
        <td>${this.htmlPrintS.esc(item.inspectionDescription)}</td>
        <td style="text-align:center;">
          <span style="color:${item.state ? "#16a34a" : "#dc2626"}; font-weight:600;">
            ${item.state ? "Aprobado" : "Rechazado"}
          </span>
        </td>
        <td>${this.htmlPrintS.esc(item.observations)}</td>
      </tr>
    `).join("");

    const evidenciasHtml = results
      .filter((item: any) => item.images?.length > 0)
      .map((item: any) => {
        const imgsHtml = item.images.map((img: any) => `
          <td style="padding:4px; border:1px solid #e5e7eb; text-align:center;">
            <img src="${this.htmlPrintS.esc(img.photoPath)}"
                 style="max-width:120px; max-height:120px; object-fit:contain;"
                 onerror="this.style.display='none'" />
          </td>
        `).join("");

        return `
          <p style="margin:12px 0 4px; font-size:0.8rem; font-weight:600; color:#374151;">
            ${this.htmlPrintS.esc(item.inspectionDescription)}
          </p>
          <table style="border-collapse:collapse;"><tbody><tr>${imgsHtml}</tr></tbody></table>
        `;
      }).join("");

    const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  ${this.htmlPrintS.getStandardCss()}
  <style>
    .info-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:16px 0; font-size:0.85rem; }
    .info-item label { font-weight:700; color:#374151; display:block; font-size:0.75rem; margin-bottom:2px; }
    .items-table { width:100%; border-collapse:collapse; font-size:0.8rem; margin-top:16px; }
    .items-table th { background:#E8EEF8; color:#111827; font-weight:700; padding:8px; border:1px solid #D1D5DB; text-align:left; }
    .items-table td { padding:7px 8px; border:1px solid #D1D5DB; vertical-align:top; }
    .items-table tbody tr:nth-child(even) { background:#FAFAFA; }
    .evidencias { margin-top:24px; }
    .evidencias h3 { font-size:0.9rem; font-weight:700; color:#0B3164; margin-bottom:8px; border-bottom:1px solid #e5e7eb; padding-bottom:4px; }
  </style>
</head>
<body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "REPORTE DE INSPECCION", "", generatedAt, "INSPECCION")}
  <div class="body-doc">
    <div class="info-grid">
      <div class="info-item"><label>Inspeccion</label>${this.htmlPrintS.esc(data.name)}</div>
      <div class="info-item"><label>Departamento</label>${this.htmlPrintS.esc(data.departament)}</div>
      <div class="info-item"><label>Frecuencia</label>${this.htmlPrintS.esc(data.frequency)}</div>
      <div class="info-item"><label>Realizo</label>${this.htmlPrintS.esc(data.user)}</div>
    </div>
    <table class="items-table">
      <thead>
        <tr>
          <th style="width:45%">Criterio</th>
          <th style="width:15%; text-align:center">Estado</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        ${resultsHtml || '<tr><td colspan="3" style="text-align:center;color:#9ca3af;padding:12px;">Sin resultados registrados</td></tr>'}
      </tbody>
    </table>
    ${evidenciasHtml ? `<div class="evidencias"><h3>Evidencias</h3>${evidenciasHtml}</div>` : ""}
  </div>
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body>
</html>`;

    const titulo = nombre ?? `Inspeccion_${data.name ?? "reporte"}`.replace(/\s+/g, "_");
    this.htmlPrintS.printHtml(html, titulo);
  }
}
