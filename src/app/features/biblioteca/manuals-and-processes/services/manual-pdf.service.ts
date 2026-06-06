import { Injectable } from "@angular/core";
import html2pdf from "html2pdf.js/dist/html2pdf.bundle.min.js";
import type { IManualTemplateDetalleDTO } from "../models/manuals-and-processes.dto";
import type { IManualPasoDTO } from "../models/manuals-and-processes.dto";

@Injectable({ providedIn: "root" })
export class ManualPdfService {

  async descargar(manual: IManualTemplateDetalleDTO): Promise<void> {
    const html = this.buildHtml(manual);
    const container = document.createElement("div");
    container.style.width = "1020px";
    container.style.background = "#fff";
    container.style.fontFamily = "Inter, system-ui, -apple-system, sans-serif";
    container.innerHTML = html;

    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2] as [number, number, number, number],
      filename: `${manual.folio}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false, letterRendering: true },
      jsPDF: { unit: "in" as const, format: "letter" as const, orientation: "portrait" as const },
      pagebreak: { mode: "avoid-all" as const, before: ".page-break" },
    };

    await html2pdf().set(opt).from(container).save();
  }

  private buildHtml(m: IManualTemplateDetalleDTO): string {
    const logo = "assets/images/LBG-negro.png";
    const fecha = new Date().toLocaleDateString("es-MX", {
      year: "numeric", month: "long", day: "numeric",
    });

    const labelTipo = (t: number) =>
      t === 1 ? "Nota" : t === 2 ? "Advertencia" : t === 3 ? "Buenas Practicas" : "Paso";

    const pasosHtml = (m.pasos ?? []).map((p, i) => this.pasoHtml(p, i, labelTipo)).join("\n");

    const adjuntosHtml = (m.adjuntos ?? []).map((a) => `
      <div style="padding:0.4rem 0;border-bottom:1px solid #eee;page-break-inside:avoid;">
        <strong style="font-size:9pt;color:#1a1a1a;">${this.esc(a.nombre)}</strong>
        <span style="font-size:7pt;color:#999;margin-left:0.5rem;">${this.esc(a.fileExtension)}</span>
      </div>`).join("");

    const versionesHtml = (m.versiones ?? []).map((v) => `
      <div style="padding:0.4rem 0;border-bottom:1px solid #eee;page-break-inside:avoid;">
        <span style="display:inline-block;background:#0b3164;color:#fff;padding:0.15rem 0.5rem;font-size:7pt;border-radius:3px;font-weight:700;">v${this.esc(v.version)}</span>
        <span style="font-size:7pt;color:#666;margin-left:0.5rem;">${this.esc(v.fechaCambio)} &middot; ${this.esc(v.autor)}</span>
        ${v.descripcionCambio ? `<p style="font-size:8pt;color:#333;margin:0.15rem 0 0 0;">${this.esc(v.descripcionCambio)}</p>` : ""}
      </div>`).join("");

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:"Inter",system-ui,-apple-system,sans-serif; line-height:1.45; color:#1a1a1a; }
  .container { max-width:1020px; margin:0 auto; background:#fff; }
  .gold-stripe { height:6px; background:#c9a84c; width:100%; }
  .header-premium { padding:24px 36px 16px 36px; border-bottom:1px solid #f0f0f0; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:16px; }
  .logo-area { display:flex; align-items:center; gap:12px; }
  .logo-img { height:48px; width:auto; }
  .logo-text { font-weight:700; font-size:1.4rem; color:#0b3164; }
  .logo-sub { font-size:0.65rem; color:#6b7280; letter-spacing:0.5px; }
  .badge-doc { background:#f3f4f6; padding:5px 12px; border-radius:100px; font-size:0.7rem; font-weight:500; color:#1a1a1a; border:0.5px solid #e5e7eb; }
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
  .footer-doc { border-top:1px solid #e5e7eb; padding:0.75rem 36px; font-size:0.6rem; color:#999; text-align:right; }
</style></head><body>
<div class="container">
  <div class="gold-stripe"></div>
  <div class="header-premium">
    <div class="logo-area">
      <img class="logo-img" src="${logo}" alt="LBG" onerror="this.style.display='none'" />
      <div><div class="logo-text">LuxuryApp</div><div class="logo-sub">ERP &middot; Biblioteca Operativa</div></div>
    </div>
    <div class="badge-doc">${this.esc(m.folio)}</div>
  </div>
  <div class="body-doc">
    <div class="meta">${this.esc(m.folio)}</div>
    <div class="titulo">${this.esc(m.description || m.folio)}</div>
    <div class="dept-line">${this.esc(m.departament)} &mdash; v${this.esc(m.currentVersion)}</div>
    <div class="info-grid">
      <span>Frecuencia: ${this.periodicidad(m)}</span>
      <span>Versi&oacute;n: ${this.esc(m.currentVersion)}</span>
      <span>Estado: ${m.isActive ? "Vigente" : "Inactivo"}</span>
      <span>Alcance: ${m.isGlobal ? "Global" : "Segmentado"}</span>
      <span>Pasos: ${(m.pasos ?? []).length}</span>
    </div>

    ${m.objetivo ? `<div class="section"><div class="section-title">Objetivo</div><div class="section-content">${this.esc(m.objetivo)}</div></div>` : ""}
    ${m.marcoLegal ? `<div class="section"><div class="section-title">Marco Legal y Referencias</div><div class="section-content">${this.esc(m.marcoLegal)}</div></div>` : ""}

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
  <div class="gold-stripe" style="height:4px;"></div>
  <div class="footer-doc">Documento generado el ${fecha} desde LuxuryApp &mdash; ${this.esc(m.folio)} v${this.esc(m.currentVersion)}</div>
</div>
</body></html>`;
  }

  private pasoHtml(
    p: IManualPasoDTO,
    i: number,
    labelTipo: (t: number) => string,
  ): string {
    const cls = p.tipoNota === 1 ? "nota" : p.tipoNota === 2 ? "advertencia" : p.tipoNota === 3 ? "buena" : "";
    const roleNames = (p.responsableRoleNombres ?? []).map((r) => `<span class="paso-tag">${this.esc(r)}</span>`).join("");

    const imgs = (p.imagenes ?? []).map((img) =>
      `<img src="${this.esc(img.url)}" alt="Imagen" />`).join("");
    const imgsHtml = imgs ? `<div class="img-grid">${imgs}</div>` : "";

    const enlaces = (p.enlaces ?? []).map((e) =>
      `<div class="enlace-line">&rarr; <a href="${this.esc(e.urlEnlace)}" target="_blank">${this.esc(e.urlEnlace)}</a></div>`).join("");

    const diagrama = p.diagramaXml
      ? `<div class="diagram-box"><em style="font-size:0.65rem;color:#999;">Diagrama de flujo vinculado a este paso.</em></div>`
      : "";

    return `
    <div class="paso-box${cls ? " " + cls : ""}">
      <div class="paso-header">
        <span class="paso-numero">${p.tipoNota === 0 ? i + 1 : "&bull;"}</span>
        <span class="paso-titulo">${this.esc(p.titulo)}</span>
        ${p.tipoNota !== 0 ? `<span class="paso-label">${labelTipo(p.tipoNota)}</span>` : ""}
        ${roleNames}
      </div>
      ${p.descripcion ? `<div class="paso-desc">${this.esc(p.descripcion)}</div>` : ""}
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

  private esc(s: string | null | undefined): string {
    if (!s) return "";
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
}
