import { Injectable, inject } from "@angular/core";
import { HtmlPrintService } from "src/app/core/services/html-print.service";

@Injectable({ providedIn: "root" })
export class MinutaPdfService {
  private readonly htmlPrintS = inject(HtmlPrintService);

  async downloadMinuta(data: any, fileName: string): Promise<void> {
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();
    const html = this.buildHtml(data, logo, generatedAt);
    this.htmlPrintS.printHtml(html, fileName);
  }

  private buildHtml(data: any, logo: string | null, generatedAt: Date): string {
    const dateLabel = this.formatDate(data.minuta?.date);
    const tipo = data.minuta?.eTypeMeeting || "Junta";

    let asistentesHtml = "";
    if (data.comite?.length > 0) {
      asistentesHtml += this.buildTableHtml("Comité de Vigilancia", ["Cargo", "Nombre"], data.comite.map((i: any) => [i.cargo, i.nombre]));
    }
    if (data.administracion?.length > 0) {
      asistentesHtml += this.buildTableHtml("Administración", ["Cargo", "Nombre"], data.administracion.map((i: any) => [i.cargo, i.nombre]));
    }
    if (data.externos?.length > 0) {
      asistentesHtml += this.buildTableHtml("Invitados", ["Nombre"], data.externos.map((i: any) => [i.invitado]));
    }

    let asuntosHtml = "";
    if (data.asuntos?.length > 0) {
      asuntosHtml += `<div class="subheader">DETALLES DE LA JUNTA</div>`;
      data.asuntos.forEach((area: any) => {
        asuntosHtml += `<div class="area-title">${this.htmlPrintS.esc(area.responsibleArea)}</div>`;
        area.items?.forEach((asunto: any, index: number) => {
          asuntosHtml += `<div class="asunto-title">${index + 1}. ${this.htmlPrintS.esc(asunto.title)}</div>`;
          const desc = this.stripHtml(asunto.requestService);
          if (desc) {
            asuntosHtml += `<div class="asunto-desc">${this.htmlPrintS.esc(desc)}</div>`;
          }
        });
      });
    }

    let firmasHtml = this.buildFirmasHtml(data.comite || []);

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  .subheader { font-size: 1.1rem; font-weight: bold; color: #111827; margin: 24px 0 12px 0; border-bottom: 2px solid #E8EEF8; padding-bottom: 4px; }
  .section-title { font-size: 0.9rem; font-weight: bold; color: #4B5563; margin: 10px 0 6px 0; }

  .data-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 0.8rem; }
  .data-table th, .data-table td { padding: 6px 8px; border: 1px solid #D1D5DB; text-align: left; }
  .data-table th { font-weight: bold; color: #111827; background-color: #E8EEF8; }
  .data-table tbody tr:nth-child(even) { background-color: #FAFAFA; }

  .asuntos-container { display: flex; flex-direction: column; gap: 10px; }
  .area-title { font-size: 0.95rem; font-weight: bold; color: #0B3164; background: #E8EEF8; padding: 6px 10px; margin: 16px 0 8px 0; border-radius: 4px; }
  .asunto-title { font-size: 0.85rem; font-weight: bold; margin-top: 10px; color: #111827; }
  .asunto-desc { font-size: 0.8rem; color: #4B5563; margin-left: 16px; margin-top: 4px; border-left: 2px solid #D1D5DB; padding-left: 8px; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "MINUTA DE JUNTA", `MINUTA-${tipo.toUpperCase()}`, generatedAt, "ADMINISTRACIÓN", `Fecha de junta: ${dateLabel}`)}

  <div class="body-doc">
    <div class="subheader" style="margin-top:0;">ASISTENTES</div>
    <div style="display:flex; gap:20px; flex-wrap: wrap;">
      ${asistentesHtml}
    </div>

    ${asuntosHtml}

    ${firmasHtml}
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }

  private buildTableHtml(title: string, headers: string[], rows: string[][]): string {
    const head = headers.map(h => `<th>${this.htmlPrintS.esc(h)}</th>`).join("");
    const body = rows.map(r => `<tr>${r.map(c => `<td>${this.htmlPrintS.esc(c)}</td>`).join("")}</tr>`).join("");
    return `
      <div style="flex:1; min-width: 250px;">
        <div class="section-title">${this.htmlPrintS.esc(title)}</div>
        <table class="data-table">
          <thead><tr>${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  }

  private formatDate(dateValue: any): string {
    if (!dateValue) return "N/A";
    const d = dateValue instanceof Date ? dateValue : this.parseMeetingDate(dateValue.toString());
    if (d) {
      return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    }
    return dateValue.toString();
  }

  private parseMeetingDate(dateString: string): Date | null {
    const monthMap: { [key: string]: number } = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
    try {
      const [datePart, timePart] = dateString.split(" ");
      const [day, monthAbbr, yearAbbr] = datePart.split("-");
      const monthNum = monthMap[monthAbbr.toLowerCase().replace(".", "")];
      const fullYear = parseInt(yearAbbr) + 2000;
      const [hours, minutes] = (timePart ?? "0:0").split(":");
      if (monthNum !== undefined && !isNaN(fullYear) && !isNaN(parseInt(day))) {
        return new Date(fullYear, monthNum, parseInt(day), parseInt(hours ?? "0"), parseInt(minutes ?? "0"));
      }
    } catch { }
    return null;
  }

  private stripHtml(html: string): string {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  }

  private buildFirmasHtml(comite: any[]): string {
    if (!comite || comite.length === 0) return "";

    // Ordenar por cargo: Presidente, Tesorero, Vocales
    const ordenCargo: { [key: string]: number } = {
      "Presidente": 1,
      "Tesorero": 2,
      "Vocal": 3,
      "Secretario": 4
    };

    const comiteOrdenado = [...comite].sort((a, b) => {
      const orderA = ordenCargo[a.cargo] || 999;
      const orderB = ordenCargo[b.cargo] || 999;
      return orderA - orderB;
    });

    // Agrupar en líneas de 3 firmas
    const lineas: any[][] = [];
    for (let i = 0; i < comiteOrdenado.length; i += 3) {
      lineas.push(comiteOrdenado.slice(i, i + 3));
    }

    let firmasHtml = `<div class="subheader" style="margin-top: 30px;">FIRMAS DEL COMITÉ</div>
    <div style="margin-top: 30px;">`;

    lineas.forEach((linea) => {
      firmasHtml += `<div style="display: flex; gap: 40px; margin-bottom: 50px; justify-content: space-around;">`;

      linea.forEach((miembro) => {
        firmasHtml += `
          <div style="text-align: center; flex: 1;">
            <div style="border-top: 1px solid #111827; width: 120px; margin: 0 auto; height: 40px;"></div>
            <div style="font-size: 0.75rem; font-weight: bold; color: #111827; margin-top: 4px;">
              ${this.htmlPrintS.esc(miembro.nombre)}
            </div>
            <div style="font-size: 0.7rem; color: #4B5563;">
              ${this.htmlPrintS.esc(miembro.cargo)}
            </div>
          </div>
        `;
      });

      firmasHtml += `</div>`;
    });

    firmasHtml += `</div>`;

    return firmasHtml;
  }
}









