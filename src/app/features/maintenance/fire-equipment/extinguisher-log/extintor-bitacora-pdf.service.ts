import { inject, Injectable } from "@angular/core";
import { HtmlPrintService } from "src/app/core/services/html-print.service";

@Injectable({ providedIn: "root" })
export class ExtintorBitacoraPdfService {
  private htmlPrintS = inject(HtmlPrintService);

  private readonly months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

  private fmtDate(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    return `${String(d).padStart(2,"0")}-${this.months[m - 1]}-${String(y).slice(-2)}`;
  }

  private toISO(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  private bool(v: boolean): string {
    return v
      ? `<span style="color:#16a34a;font-weight:bold;">&#10003;</span>`
      : `<span style="color:#dc2626;font-weight:bold;">&#10007;</span>`;
  }

  async downloadPdf(data: any[], from: Date | null, to: Date | null): Promise<void> {
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();
    const fromISO = from ? this.toISO(from) : null;
    const toISO = to ? this.toISO(to) : null;

    const filtered = data.filter((item) => {
      if (fromISO && item.date < fromISO) return false;
      if (toISO && item.date > toISO) return false;
      return true;
    });

    const period =
      fromISO || toISO
        ? `${fromISO ? this.fmtDate(fromISO) : "—"} al ${toISO ? this.fmtDate(toISO) : "—"}`
        : "Todo el período";

    const rows = filtered
      .map(
        (item) => `<tr>
        <td>${this.fmtDate(item.date)}</td>
        <td class="tc">${item.hour}</td>
        <td class="tc">${this.bool(item.adequatePressure)}</td>
        <td class="tc">${this.bool(item.safetyPinOk)}</td>
        <td class="tc">${this.bool(item.labelsOk)}</td>
        <td class="tc">${this.bool(item.noPhysicalDamage)}</td>
        <td>${this.htmlPrintS.esc(item.observations || "")}</td>
      </tr>`,
      )
      .join("");

    const html = `<!doctype html><html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  .data-table { width:100%; border-collapse:collapse; margin-top:20px; font-size:0.8rem; }
  .data-table th, .data-table td { padding:6px 8px; border:1px solid #D1D5DB; }
  .data-table th { background:#E8EEF8; font-weight:700; color:#111827; }
  .data-table tbody tr:nth-child(even) { background:#FAFAFA; }
  .tc { text-align:center; }
</style>
</head><body><div class="container">
${this.htmlPrintS.buildStandardHeader(logo, "BITÁCORA DE EXTINTORES", "", generatedAt, "EXTINTOR", period)}
<div class="body-doc">
  <table class="data-table">
    <thead><tr>
      <th>Fecha</th><th class="tc">Hora</th><th class="tc">Presión</th>
      <th class="tc">Seguro</th><th class="tc">Etiquetas</th>
      <th class="tc">Sin Daños</th><th>Observaciones</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>
${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div></body></html>`;

    this.htmlPrintS.printHtml(html, `Bitacora_Extintores_${generatedAt.getTime()}`);
  }
}
