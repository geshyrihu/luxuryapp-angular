import { inject, Injectable } from "@angular/core";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import type { IManualTemplateDetalleDTO } from "../models/manuals-and-processes.dto";
import type { IManualPasoDTO } from "../models/manuals-and-processes.dto";

@Injectable({ providedIn: "root" })
export class ManualPdfService {
  private readonly htmlPrintS = inject(HtmlPrintService);

  async descargar(manual: IManualTemplateDetalleDTO): Promise<void> {
    const html = await this.buildHtml(manual);
    this.htmlPrintS.printHtml(html, manual.folio || "Manual");
  }

  private async buildHtml(m: IManualTemplateDetalleDTO): Promise<string> {
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();

    const labelTipo = (t: number) =>
      t === 1 ? "Nota" : t === 2 ? "Advertencia" : t === 3 ? "Buenas Practicas" : "Paso";

    const pasosHtml = (m.pasos ?? []).map((p, i) => this.pasoHtml(p, i, labelTipo)).join("\n");

    const adjuntosHtml = (m.adjuntos ?? []).map((a) => `
      <div style="padding:0.4rem 0;border-bottom:1px solid #eee;page-break-inside:avoid;">
        <strong style="font-size:9pt;color:#1a1a1a;">${this.htmlPrintS.esc(a.nombre)}</strong>
        <span style="font-size:7pt;color:#999;margin-left:0.5rem;">${this.htmlPrintS.esc(a.fileExtension)}</span>
      </div>`).join("");

    const versionesHtml = (m.versiones ?? []).map((v) => `
      <div style="padding:0.4rem 0;border-bottom:1px solid #eee;page-break-inside:avoid;">
        <span style="display:inline-block;background:#0b3164;color:#fff;padding:0.15rem 0.5rem;font-size:7pt;border-radius:3px;font-weight:700;">v${this.htmlPrintS.esc(v.version)}</span>
        <span style="font-size:7pt;color:#666;margin-left:0.5rem;">${this.htmlPrintS.esc(v.fechaCambio)} &middot; ${this.htmlPrintS.esc(v.autor)}</span>
        ${v.descripcionCambio ? `<p style="font-size:8pt;color:#333;margin:0.15rem 0 0 0;">${this.htmlPrintS.esc(v.descripcionCambio)}</p>` : ""}
      </div>`).join("");

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  .body-doc { padding:28px 36px 36px 36px; }
  .titulo { font-size:1.7rem; font-weight:700; color:#0b3164; margin-bottom:4px; }
  .meta { font-size:0.7rem; color:#6b7280; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:2px; }
  .dept-line { font-size:0.75rem; color:#555; margin-bottom:12px; }
  .info-grid { display:flex; flex-wrap:wrap; gap:0.25rem 1.25rem; font-size:0.7rem; color:#555; margin-bottom:1.25rem; }
  .section { margin-bottom:1.25rem; page-break-inside:avoid; }
  .section-title { font-size:1rem; font-weight:700; color:#0b3164; border-bottom:1px solid #e5e7eb; padding-bottom:0.25rem; margin-bottom:0.5rem; }
  .section-content { font-size:0.8rem; color:#333; line-height:1.55; white-space:pre-wrap; }
  .steps-section { page-break-before:always; }
  .paso-box { padding:0.5rem 0.75rem; margin-bottom:0.75rem; border-left:3px solid #0b3164; page-break-inside:avoid; }
  .paso-box.nota { border-left-color:#60a5fa; background:#f8faff; }
  .paso-box.advertencia { border-left-color:#f59e0b; background:#fffcf5; }
  .paso-box.buena { border-left-color:#4ade80; background:#f5fff7; }
  .paso-header { display:flex; align-items:center; gap:8px; margin-bottom:4px; }
  .paso-numero { display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border-radius:50%; background:#c9a84c; color:#fff; font-size:0.65rem; font-weight:700; flex-shrink:0; }
  .paso-titulo { font-size:0.8rem; font-weight:600; color:#111; }
  .paso-desc { font-size:0.75rem; color:#444; line-height:1.5; margin-top:2px; }
  .paso-tag { display:inline-block; border:1px solid #d1d5db; background:#f3f4f6; color:#374151; padding:0.1rem 0.4rem; font-size:0.55rem; border-radius:3px; }
  .paso-label { font-size:0.55rem; font-weight:600; color:#555; margin-left:4px; text-transform:uppercase; letter-spacing:0.5px; }
  .img-grid { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
  .img-grid img { max-width:45%; max-height:140px; border:1px solid #e5e7eb; border-radius:4px; }
  .enlace-line { margin-top:6px; font-size:0.7rem; }
  .enlace-line a { color:#0b3164; word-break:break-all; }
  .diagram-box { margin-top:8px; max-width:80%; }
</style></head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, m.description || m.folio || "Manual", m.folio || "", generatedAt, "MANUAL DE PROCESO", m.departament ? (m.departament + " - v" + m.currentVersion) : ("v" + m.currentVersion))}
  <div class="body-doc">
    <div class="info-grid">
      <span>Frecuencia: ${this.periodicidad(m)}</span>
      <span>Versi&oacute;n: ${this.htmlPrintS.esc(m.currentVersion)}</span>
      <span>Estado: ${m.isActive ? "Vigente" : "Inactivo"}</span>
      <span>Alcance: ${m.isGlobal ? "Global" : "Segmentado"}</span>
      <span>Pasos: ${(m.pasos ?? []).length}</span>
    </div>

    ${m.objetivo ? `<div class="section"><div class="section-title">Objetivo</div><div class="section-content">${this.htmlPrintS.esc(m.objetivo)}</div></div>` : ""}
    ${m.marcoLegal ? `<div class="section"><div class="section-title">Marco Legal y Referencias</div><div class="section-content">${this.htmlPrintS.esc(m.marcoLegal)}</div></div>` : ""}

    <div class="section steps-section">
      <div class="section-title">Pasos del Procedimiento (${(m.pasos ?? []).length})</div>
      ${(m.pasos ?? []).length ? pasosHtml : '<p style="font-size:0.8rem;color:#999;">Sin pasos definidos.</p>'}
    </div>

    ${m.adjuntos?.length ? `
    <div class="section">
      <div class="section-title">Archivos Auxiliares (${m.adjuntos.length})</div>
      ${adjuntosHtml}
    </div>` : ""}

    ${m.versiones?.length ? `
    <div class="section">
      <div class="section-title">Historial de Versiones (${m.versiones.length})</div>
      ${versionesHtml}
    </div>` : ""}
  </div>
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }

  private pasoHtml(
    p: IManualPasoDTO,
    i: number,
    labelTipo: (t: number) => string,
  ): string {
    const cls = p.tipoNota === 1 ? "nota" : p.tipoNota === 2 ? "advertencia" : p.tipoNota === 3 ? "buena" : "";
    const roleNames = (p.responsableRoleNombres ?? []).map((r) => `<span class="paso-tag">${this.htmlPrintS.esc(r)}</span>`).join("");

    const imgs = (p.imagenes ?? []).map((img) =>
      `<img src="${this.htmlPrintS.esc(img.url)}" alt="Imagen" />`).join("");
    const imgsHtml = imgs ? `<div class="img-grid">${imgs}</div>` : "";

    const enlaces = (p.enlaces ?? []).map((e) =>
      `<div class="enlace-line">&rarr; <a href="${this.htmlPrintS.esc(e.urlEnlace)}" target="_blank">${this.htmlPrintS.esc(e.urlEnlace)}</a></div>`).join("");

    const diagrama = p.diagramaXml
      ? `<div class="diagram-box"><em style="font-size:0.65rem;color:#999;">Diagrama de flujo vinculado a este paso.</em></div>`
      : "";

    return `
    <div class="paso-box${cls ? " " + cls : ""}">
      <div class="paso-header">
        <span class="paso-numero">${p.tipoNota === 0 ? i + 1 : "&bull;"}</span>
        <span class="paso-titulo">${this.htmlPrintS.esc(p.titulo)}</span>
        ${p.tipoNota !== 0 ? `<span class="paso-label">${labelTipo(p.tipoNota)}</span>` : ""}
        ${roleNames}
      </div>
      ${p.descripcion ? `<div class="paso-desc">${this.htmlPrintS.esc(p.descripcion)}</div>` : ""}
      ${diagrama}
      ${imgsHtml}
      ${enlaces}
    </div>`;
  }

  private periodicidad(m: IManualTemplateDetalleDTO): string {
    if (!m || m.periodicity === 0) return "A Demanda";
    if (m.periodicity === 1) return "Única Vez";
    if (m.periodicity === 2) return "Diario";
    if (m.periodicity === 3) {
      if (m.executionDaysOfWeek?.length) {
        const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        return `Semanal (${m.executionDaysOfWeek.map(d => days[d]).join(", ")})`;
      }
      return "Semanal";
    }
    if (m.periodicity === 4) {
      if (m.executionDayOfMonth) return `Mensual (Día ${m.executionDayOfMonth})`;
      if (m.executionWeekOfMonth && m.executionDaysOfWeek?.length) {
        const weeks = ["1ra", "2da", "3ra", "4ta", "Última"];
        const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        return `Mensual (${weeks[m.executionWeekOfMonth - 1] || "Semana"} semana, ${days[m.executionDaysOfWeek[0]]})`;
      }
      return "Mensual";
    }
    if (m.periodicity === 5) {
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const month = m.executionMonthOfYear ? months[m.executionMonthOfYear - 1] : "";
      if (m.executionDayOfMonth && month) return `Anual (Cada ${m.executionDayOfMonth} de ${month})`;
      if (month) return `Anual (En ${month})`;
      return "Anual";
    }
    return m.periodicityName || "A Demanda";
  }
}
