import { Injectable, inject } from "@angular/core";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import {
  AspelCobranzaDetalleConcepto,
  AspelCobranzaDetalleResponse,
  AspelEstadoCuentaResponse,
  AspelMovimiento,
} from "./aspel-cobranza-haus.models";

@Injectable({ providedIn: "root" })
export class AspelCobranzaHausPdfService {
  private readonly htmlPrintS = inject(HtmlPrintService);
  private readonly currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  async downloadAvisoCobroAspel(data: AspelCobranzaDetalleResponse, generatedAt: Date): Promise<void> {
    await this.downloadAvisoCobro(data, generatedAt, { showAspelAccounts: true });
  }

  async downloadEstadoCuentaAspel(data: AspelEstadoCuentaResponse, generatedAt: Date): Promise<void> {
    await this.downloadEstadoCuenta(data, generatedAt, { showAspelAccounts: true });
  }

  async downloadAvisoCobro(
    data: AspelCobranzaDetalleResponse,
    generatedAt: Date,
    options?: { showAspelAccounts?: boolean },
  ): Promise<void> {
    const showAspelAccounts = options?.showAspelAccounts === true;
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const html = this.buildAvisoCobroHtml(data, generatedAt, logo, showAspelAccounts);
    
    const fileName = `Aviso-Cobro${showAspelAccounts ? "-Aspel" : ""}-${data.numCtaBase || "cuenta"}-${data.fechaFin || "corte"}`;
    this.htmlPrintS.printHtml(html, fileName);
  }

  async downloadEstadoCuenta(
    data: AspelEstadoCuentaResponse,
    generatedAt: Date,
    options?: { showAspelAccounts?: boolean },
  ): Promise<void> {
    const showAspelAccounts = options?.showAspelAccounts === true;
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const html = this.buildEstadoCuentaHtml(data, generatedAt, logo, showAspelAccounts);
    
    const fileName = `Estado-Cuenta${showAspelAccounts ? "-Aspel" : ""}-${data.numCta || "cuenta"}-${data.fechaFin || "corte"}`;
    this.htmlPrintS.printHtml(html, fileName);
  }

  private buildAvisoCobroHtml(
    data: AspelCobranzaDetalleResponse,
    generatedAt: Date,
    logo: string | null,
    showAspelAccounts: boolean
  ): string {
    const conceptos = this.getVisibleConceptos(data.conceptos || []);
    const vencidos = conceptos
      .filter((item) => item.vencidos.some((v) => v.saldoPendiente > 0))
      .flatMap((item) => item.vencidos.filter((v) => v.saldoPendiente > 0).map(v => ({ concepto: item.concepto, numCta: item.numCta, ...v })));

    const totalCargos = conceptos.reduce((sum, item) => sum + item.cargos, 0);
    const totalAbonos = conceptos.reduce((sum, item) => sum + item.abonos, 0);
    const totalVencido = conceptos.reduce((sum, item) => sum + item.totalVencido, 0);
    const totalFinal = conceptos.reduce((sum, item) => sum + item.saldoFinal, 0);
    const totalAdelantos = conceptos.reduce((sum, item) => sum + item.adelanto, 0);

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
      .titulo { font-size:1.8rem; font-weight:700; color:#2563EB; margin-bottom:4px; }
      .meta { font-size:0.8rem; color:#6b7280; }
      .info-grid { display:flex; flex-wrap:wrap; gap:0.5rem 1.5rem; font-size:0.8rem; margin-top:6px; }
      
      .metric-card { background:#F3F4F6; padding:8px 12px; border-radius:4px; }
      .metric-card.highlight { background:#E0ECFF; }
      .metric-label { font-size:0.75rem; font-weight:700; color:#6b7280; }
      .metric-card.highlight .metric-label { color:#1D4ED8; }
      .metric-value { font-size:1.2rem; font-weight:700; color:#111827; margin-top:4px; }
      .metric-card.highlight .metric-value { color:#1D4ED8; }

      .section-title { font-size:1.1rem; font-weight:700; color:#111827; margin-bottom:4px; }
      .section-help { font-size:0.75rem; color:#6b7280; margin-bottom:12px; }

      .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; font-size:0.8rem; }
      .data-table th, .data-table td { padding:6px 8px; border:1px solid #D1D5DB; }
      .data-table th { background:#E8EEF8; font-weight:700; text-align:left; color:#111827; }
      .data-table tbody tr:nth-child(even) { background:#FAFAFA; }
      .data-table tfoot td { background:#F3F4F6; border-top:2px solid #D1D5DB; }
      
      .yellow-table th { background:#FEF3C7; }
      .yellow-table tbody tr:nth-child(even) { background:#FFFBEB; }
      
      .green-table th { background:#DCFCE7; }
      .green-table tbody tr:nth-child(even) { background:#F0FDF4; }

      .text-right { text-align:right !important; }
      .mono { font-family: monospace; font-size: 0.9em; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "AVISO DE COBRO", "COB-ASP-HAUS", generatedAt, "COBRANZA")}
  
  <div class="body-doc">
    <div class="titulo">AVISO DE COBRO</div>
    <div class="meta" style="margin-bottom:12px;">${showAspelAccounts ? "Resumen ejecutivo del adeudo por concepto con cuentas Aspel visibles" : "Resumen ejecutivo del adeudo por concepto"}</div>
    
    <div class="info-grid">
      <span><strong>Propiedad:</strong> ${this.htmlPrintS.esc(data.departamento || "-")}</span>
      <span><strong>Periodo consultado:</strong> ${this.htmlPrintS.esc(data.fechaInicio)} al ${this.htmlPrintS.esc(data.fechaFin)}</span>
      ${showAspelAccounts ? `<span><strong>Cuenta Aspel base:</strong> ${this.htmlPrintS.esc(data.numCtaBase || "-")}</span>` : ""}
    </div>
    
    <div style="border-top: 1px solid #2563EB; margin: 15px 0;"></div>
    
    <div class="summary-cards" style="display:flex; gap:16px; margin-bottom: 24px;">
      <div class="metric-card">
        <div class="metric-label">Cargos</div>
        <div class="metric-value">${this.formatCurrency(totalCargos)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Abonos</div>
        <div class="metric-value">${this.formatCurrency(totalAbonos)}</div>
      </div>
      <div class="metric-card highlight">
        <div class="metric-label">Vencido actual</div>
        <div class="metric-value">${this.formatCurrency(totalVencido)}</div>
      </div>
    </div>

    <div class="section-title">Desglose de la deuda</div>
    <div class="section-help">Solo aparecen conceptos que realmente forman parte del adeudo o que tienen adelantos aplicables.</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Concepto</th>
          ${showAspelAccounts ? `<th>Cuenta Aspel</th>` : ""}
          <th class="text-right">Cargos</th>
          <th class="text-right">Abonos</th>
          <th class="text-right">Vencido</th>
          <th class="text-right">Pendiente</th>
        </tr>
      </thead>
      <tbody>
        ${conceptos.map(item => `
          <tr>
            <td>
              <div style="font-weight:700; color:#111827;">${this.htmlPrintS.esc(item.concepto || "-")}</div>
              ${item.nombreCuenta && item.nombreCuenta.toUpperCase() !== item.concepto.toUpperCase() ? `<div style="font-size:0.75rem; color:#6B7280;">${this.htmlPrintS.esc(item.nombreCuenta)}</div>` : ""}
            </td>
            ${showAspelAccounts ? `<td class="mono">${this.htmlPrintS.esc(item.numCta || "-")}</td>` : ""}
            <td class="text-right mono">${this.formatCurrency(item.cargos)}</td>
            <td class="text-right mono">${this.formatCurrency(item.abonos)}</td>
            <td class="text-right mono" style="color: ${item.totalVencido > 0 ? '#B45309' : '#6B7280'}">${this.formatCurrency(item.totalVencido)}</td>
            <td class="text-right" style="font-weight:700; color: ${item.saldoFinal > 0 ? '#B91C1C' : item.saldoFinal < 0 ? '#047857' : '#111827'}">${this.formatCurrency(item.saldoFinal)}</td>
          </tr>
        `).join("")}
      </tbody>
      <tfoot>
        <tr>
          <td style="font-weight:bold;">Totales</td>
          ${showAspelAccounts ? `<td></td>` : ""}
          <td class="text-right" style="font-weight:bold;">${this.formatCurrency(totalCargos)}</td>
          <td class="text-right" style="font-weight:bold;">${this.formatCurrency(totalAbonos)}</td>
          <td class="text-right" style="font-weight:bold;">${this.formatCurrency(totalVencido)}</td>
          <td class="text-right" style="font-weight:bold;">${this.formatCurrency(totalFinal)}</td>
        </tr>
      </tfoot>
    </table>

    ${this.buildVencidosHtml(vencidos, showAspelAccounts)}
    ${totalAdelantos > 0 ? this.buildAdelantosHtml(conceptos, showAspelAccounts) : ""}
    
    <div style="font-size: 0.8rem; color: #6B7280; margin-top: 20px;">El saldo pendiente refleja la composición actual del adeudo en el rango consultado.</div>
  </div>
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }

  private buildEstadoCuentaHtml(
    data: AspelEstadoCuentaResponse,
    generatedAt: Date,
    logo: string | null,
    showAspelAccounts: boolean
  ): string {
    const movimientos = data.movimientos || [];
    const totalCargos = movimientos.filter(item => this.isCharge(item)).reduce((sum, item) => sum + (item.monto || 0), 0);
    const totalAbonos = movimientos.filter(item => !this.isCharge(item)).reduce((sum, item) => sum + (item.monto || 0), 0);

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
@page { size: landscape; margin: 10mm; } .container { max-width:1300px; }
      .titulo { font-size:1.8rem; font-weight:700; color:#2563EB; margin-bottom:4px; }
      .meta { font-size:0.8rem; color:#6b7280; }
      .info-grid { display:flex; flex-wrap:wrap; gap:0.5rem 1.5rem; font-size:0.8rem; margin-top:6px; }
      
      .metric-card { background:#F3F4F6; padding:8px 12px; border-radius:4px; }
      .metric-card.highlight { background:#E0ECFF; }
      .metric-label { font-size:0.75rem; font-weight:700; color:#6b7280; }
      .metric-card.highlight .metric-label { color:#1D4ED8; }
      .metric-value { font-size:1.2rem; font-weight:700; color:#111827; margin-top:4px; }
      .metric-card.highlight .metric-value { color:#1D4ED8; }

      .section-title { font-size:1.1rem; font-weight:700; color:#111827; margin-bottom:4px; }
      .section-help { font-size:0.75rem; color:#6b7280; margin-bottom:12px; }

      .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; font-size:0.8rem; }
      .data-table th, .data-table td { padding:6px 8px; border:1px solid #D1D5DB; }
      .data-table th { background:#E8EEF8; font-weight:700; text-align:left; color:#111827; }
      .data-table tbody tr:nth-child(even) { background:#FAFAFA; }
      .data-table tfoot td { background:#F3F4F6; border-top:2px solid #D1D5DB; }
      .text-right { text-align:right !important; }
      .mono { font-family: monospace; font-size: 0.9em; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "ESTADO DE CUENTA", "CONT-ASP-EST", generatedAt, "CONTABILIDAD")}
  
  <div class="body-doc">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <div class="titulo">ESTADO DE CUENTA</div>
        <div class="meta" style="margin-bottom:12px;">Detalle cronolígico de movimientos, cargos, abonos y saldo progresivo</div>
        
        <div class="info-grid">
          <span><strong>Cuenta:</strong> ${this.htmlPrintS.esc(data.numCta || "-")}</span>
          <span><strong>Propiedad:</strong> ${this.htmlPrintS.esc(data.departamento || "-")}</span>
        </div>
        <div class="info-grid">
          <span><strong>Periodo consultado:</strong> ${this.htmlPrintS.esc(data.fechaInicio || "-")} al ${this.htmlPrintS.esc(data.fechaFin || "-")}</span>
          ${showAspelAccounts ? `<span><strong>Cuenta Aspel base:</strong> ${this.htmlPrintS.esc(data.numCta || "-")}</span>` : ""}
        </div>
      </div>
      
      <div style="display:flex; gap:12px; flex-direction:column; width: 300px;">
        <div style="display:flex; gap:8px;">
          <div class="metric-card" style="flex:1;"><div class="metric-label">Saldo inicial</div><div class="metric-value">${this.formatCurrency(data.saldoInicial || 0)}</div></div>
          <div class="metric-card highlight" style="flex:1;"><div class="metric-label">Saldo final</div><div class="metric-value">${this.formatCurrency(data.saldoFinal || 0)}</div></div>
        </div>
        <div style="display:flex; gap:8px;">
          <div class="metric-card" style="flex:1;"><div class="metric-label">Cargos</div><div class="metric-value">${this.formatCurrency(totalCargos)}</div></div>
          <div class="metric-card" style="flex:1;"><div class="metric-label">Abonos</div><div class="metric-value">${this.formatCurrency(totalAbonos)}</div></div>
        </div>
      </div>
    </div>
    
    <div class="section-title" style="margin-top:20px;">Movimientos del periodo</div>
    <div class="section-help">${movimientos.length} movimientos aplicados en el rango consultado.${showAspelAccounts ? " Esta versión muestra la cuenta Aspel base para ejemplificar el origen contable." : ""}</div>
    
    <table class="data-table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Número</th>
          <th>Fecha</th>
          <th>Concepto del movimiento</th>
          ${showAspelAccounts ? `<th>Cuenta Aspel</th>` : ""}
          <th class="text-right">Saldo inicial</th>
          <th class="text-right">Cargos</th>
          <th class="text-right">Abonos</th>
          <th class="text-right">Saldo final</th>
        </tr>
      </thead>
      <tbody>
        ${movimientos.map((item, i) => `
          <tr>
            <td class="mono">${this.formatMovementType(item)}</td>
            <td class="mono">${this.htmlPrintS.esc(this.getMovementNumber(item, i))}</td>
            <td class="mono" style="white-space:nowrap;">${this.htmlPrintS.esc(item.fecha || "-")}</td>
            <td style="font-size:0.85rem; color:#374151;">${this.htmlPrintS.esc(item.concepto || "-")}</td>
            ${showAspelAccounts ? `<td class="mono">${this.htmlPrintS.esc(item.numCta || "-")}</td>` : ""}
            <td class="text-right mono">${this.formatCurrency(item.saldoAnterior || 0)}</td>
            <td class="text-right mono" style="color: ${this.isCharge(item) ? '#1D4ED8' : '#111827'}">${this.isCharge(item) ? this.formatCurrency(item.monto || 0) : ""}</td>
            <td class="text-right mono" style="color: ${!this.isCharge(item) ? '#047857' : '#111827'}">${!this.isCharge(item) ? this.formatCurrency(item.monto || 0) : ""}</td>
            <td class="text-right" style="font-weight:bold; color: ${(item.saldoPosterior || 0) < 0 ? '#B91C1C' : '#111827'}">${this.formatCurrency(item.saldoPosterior || 0)}</td>
          </tr>
        `).join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="${showAspelAccounts ? 6 : 5}" style="font-weight:bold;">Totales</td>
          <td class="text-right" style="font-weight:bold;">${this.formatCurrency(totalCargos)}</td>
          <td class="text-right" style="font-weight:bold;">${this.formatCurrency(totalAbonos)}</td>
          <td class="text-right" style="font-weight:bold;">${this.formatCurrency(data.saldoFinal || 0)}</td>
        </tr>
      </tfoot>
    </table>
  </div>
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }

  private buildVencidosHtml(vencidos: any[], showAspelAccounts: boolean): string {
    if (!vencidos.length) return "";
    
    // Agrupar por concepto
    const groups: { [key: string]: any[] } = {};
    vencidos.forEach(v => {
      if (!groups[v.concepto]) groups[v.concepto] = [];
      groups[v.concepto].push(v);
    });

    return `
      <div class="section-title" style="margin-top:24px;">Saldos vencidos que componen la deuda</div>
      ${Object.keys(groups).map((concepto) => `
        <div style="font-weight:bold; color:#9A3412; font-size:1.05rem; margin:12px 0 6px 0;">${this.htmlPrintS.esc(concepto)}</div>
        <table class="data-table yellow-table">
          <thead>
            <tr>
              <th>Fecha</th>
              ${showAspelAccounts ? `<th>Cuenta Aspel</th>` : ""}
              <th>Detalle</th>
              <th class="text-right">Pendiente</th>
            </tr>
          </thead>
          <tbody>
            ${groups[concepto].map(item => `
              <tr>
                <td class="mono">${this.htmlPrintS.esc(item.fechaCargo || "-")}</td>
                ${showAspelAccounts ? `<td class="mono">${this.htmlPrintS.esc(item.numCta || "-")}</td>` : ""}
                <td>${this.htmlPrintS.esc(item.conceptoDetalle || "-")}</td>
                <td class="text-right" style="font-weight:bold; color:#B45309;">${this.formatCurrency(item.saldoPendiente)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `).join("")}
    `;
  }

  private buildAdelantosHtml(conceptos: AspelCobranzaDetalleConcepto[], showAspelAccounts: boolean): string {
    const adelantos = conceptos.filter(item => item.adelanto > 0);
    if (!adelantos.length) return "";

    return `
      <div class="section-title" style="margin-top:24px;">Adelantos a favor</div>
      <div class="section-help">Los sobrepagos o pagos adelantados se muestran por separado para no inflar el adeudo pendiente.</div>
      <table class="data-table green-table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Cuenta</th>
            <th class="text-right">Monto</th>
          </tr>
        </thead>
        <tbody>
          ${adelantos.map(item => `
            <tr>
              <td style="font-weight:bold;">${this.htmlPrintS.esc(item.concepto)}</td>
              <td class="mono">${this.htmlPrintS.esc(item.numCta || "-")}</td>
              <td class="text-right" style="font-weight:bold; color:#047857;">${this.formatCurrency(item.adelanto)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  private getVisibleConceptos(conceptos: AspelCobranzaDetalleConcepto[]): AspelCobranzaDetalleConcepto[] {
    return conceptos
      .filter((item) => item.saldoInicial !== 0 || item.cargos !== 0 || item.abonos !== 0 || item.saldoFinal !== 0 || item.totalVencido !== 0 || item.adelanto !== 0 || item.vencidos.some((v) => v.saldoPendiente > 0))
      .sort((a, b) => b.saldoFinal - a.saldoFinal || a.concepto.localeCompare(b.concepto));
  }

  private formatCurrency(value: number): string {
    return this.currencyFormatter.format(value || 0);
  }

  private formatMovementType(item: AspelMovimiento): string {
    return this.isCharge(item) ? "CAR" : "ABO";
  }

  private getMovementNumber(item: AspelMovimiento, index: number): string {
    const id = (item.id || "").trim();
    if (!id) return String(index + 1);
    const parts = id.split("-");
    return parts[parts.length - 1] || id;
  }

  private isCharge(item: AspelMovimiento): boolean {
    return (item.tipo || "").toLowerCase() === "cargo";
  }
}
