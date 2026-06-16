import { Injectable, inject } from "@angular/core";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

@Injectable({ providedIn: "root" })
export class OrdenesServicioListPdfService {
  private customToastS = inject(CustomToastService);
  private htmlPrintS = inject(HtmlPrintService);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  async downloadReporteTablaCategoria(data: any[], periodo: string, filterName: string): Promise<void> {
    if (!data || data.length === 0) {
      this.customToastS.showWarn("Sin Datos", "No hay órdenes de servicio para generar el reporte.");
      return;
    }

    this.customToastS.showInfo("Generando Reporte", "Preparando reporte por categoría...");
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();

    const grouped = new Map<string, any[]>();
    for (const item of data) {
      const cat = item.equipoClasificacion || "Sin Categoría";
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)!.push(item);
    }

    let tablesHtml = "";
    grouped.forEach((items, category) => {
      const rows = items
        .map(
          (item) => `
        <tr>
          <td>${this.htmlPrintS.esc(String(item.machineryId || "").slice(-5))}</td>
          <td>${this.htmlPrintS.esc(item.machinery || item.nameMachinery)}</td>
          <td>${this.htmlPrintS.esc(item.typeMaintanceFilter || item.typeMaintance)}</td>
          <td><span class="st-badge ${this.getStatusBadgeClass(item.status)}">${this.htmlPrintS.esc(this.getStatusLabel(item.status))}</span></td>
          <td class="col-obs">${this.htmlPrintS.esc(item.observations)}</td>
        </tr>`,
        )
        .join("");

      tablesHtml += `
        <div class="cat-title">${this.htmlPrintS.esc(category)} (${items.length})</div>
        <table class="data-table">
          <thead><tr>
            <th style="width:10%">ID Equipo</th>
            <th style="width:25%">Nombre del Equipo</th>
            <th style="width:15%">Tipo de Servicio</th>
            <th style="width:12%">Estatus</th>
            <th>Observaciones</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>`;
    });

    const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  .cat-title { font-size:1rem; font-weight:700; color:#0B3164; border-bottom:2px solid #c9a84c; padding-bottom:4px; margin:20px 0 8px; }
  .data-table { width:100%; border-collapse:collapse; font-size:0.75rem; margin-bottom:24px; }
  .data-table th { background:#E8EEF8; font-weight:700; color:#111827; padding:6px 8px; border:1px solid #D1D5DB; text-align:left; }
  .data-table td { padding:6px 8px; border:1px solid #D1D5DB; vertical-align:top; }
  .data-table tbody tr:nth-child(even) { background:#FAFAFA; }
  .col-obs { word-break:break-word; }
  .st-badge { display:inline-block; padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:600; }
  .st-success { background:#dcfce7; color:#166534; }
  .st-danger { background:#fee2e2; color:#991b1b; }
  .st-secondary { background:#f3f4f6; color:#374151; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Reporte de Órdenes de Servicio", periodo, generatedAt, filterName)}
  <div class="body-doc">${tablesHtml}</div>
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

    this.htmlPrintS.printHtml(html, `Reporte-Tabla-Ordenes-${filterName}-${periodo}`);
  }

  private getStatusLabel(status: number): string {
    switch (status) {
      case 0: return "Pendiente";
      case 1: return "Terminado";
      case 2: return "No Autorizado";
      case 4: return "Cancelado";
      default: return "-";
    }
  }

  private getStatusBadgeClass(status: number): string {
    switch (status) {
      case 1: return "st-success";
      case 0: return "st-danger";
      default: return "st-secondary";
    }
  }

  async downloadReporte(periodo: string, filterName: string) {
    this.customToastS.showInfo("Generando Reporte", "Descargando datos, espere por favor...");
    const customerId = this.customerIdS.customerId();
    const urlApi = Endpoints.ServiceOrders.reporte(customerId, periodo);

    const customerData: any = await this.apiResponseS.onGetItem(Endpoints.Customers.getByIdLegacy(customerId));
    const logoCustomer = customerData?.photoPath || null;
    const nameCustomer = customerData?.nameCustomer || 'Cliente';
    const address = customerData?.adreess || '';
    const phoneOne = customerData?.phoneOne || '';
    const phoneTwo = customerData?.phoneTwo || '';

    const data: any = await this.apiResponseS.onPost(urlApi);
    if (!data || data === true || data.length === 0) {
      this.customToastS.showWarn("Sin Datos", "No hay órdenes de servicio para este periodo.");
      return;
    }

    const generatedAt = new Date();
    
    let html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  ${this.htmlPrintS.getStandardCss()}
  <style>
  body { background-color: white !important; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .report-container { background: white; margin-bottom: 2rem; max-width: 210mm; margin: 0 auto; }
  .report-logo { max-height: 80px; max-width: 100%; object-fit: contain; }
  .signature-line { border-bottom: 1px solid #333; height: 1px; width: 80%; margin: 0 auto; }
  .page-break { page-break-after: always; break-after: page; min-height: 95vh; position: relative; }
  .break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
  .surface-50 { background-color: #f9fafb !important; }
  .surface-100 { background-color: #f3f4f6 !important; }
  .bg-primary { background-color: #3b82f6 !important; color: white !important; }
  .border-round { border-radius: 6px; }
  .border-1 { border: 1px solid #e5e7eb; }
  .p-3 { padding: 1rem; }
  .mb-4 { margin-bottom: 1.5rem; }
  .grid { display: flex; flex-wrap: wrap; }
  .col-6 { width: 50%; padding: 0.5rem; }
  .col-12 { width: 100%; padding: 0.5rem; }
  .col-3 { width: 25%; padding: 0.5rem; }
  .col-4 { width: 33.33%; padding: 0.5rem; }
  .col-5 { width: 41.66%; padding: 0.5rem; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-xs { font-size: 0.75rem; }
  .text-sm { font-size: 0.875rem; }
  .text-base { font-size: 1rem; }
  .text-lg { font-size: 1.125rem; }
  .font-bold { font-weight: 700; }
  .font-medium { font-weight: 500; }
  .text-500 { color: #6b7280; }
  .text-600 { color: #4b5563; }
  .text-700 { color: #374151; }
  .text-900 { color: #111827; }
  .text-primary { color: #3b82f6; }
  .uppercase { text-transform: uppercase; }
  .line-height-3 { line-height: 1.5; }
  .flex { display: flex; }
  .align-items-center { align-items: center; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 1rem; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-6 { margin-top: 3rem; }
  .pb-2 { padding-bottom: 0.5rem; }
  .pb-3 { padding-bottom: 1rem; }
  .border-bottom-1 { border-bottom: 1px solid #e5e7eb; }
  .border-round { border-radius: 0.5rem; }
  .w-full { width: 100%; }
  .h-full { height: 100%; }
  .mr-2 { margin-right: 0.5rem; }
  </style>
</head>
<body>
`;

    data.forEach((item, index) => {
      let imagesHtml = '';
      if (item.serviceOrderImg && item.serviceOrderImg.length > 0) {
        imagesHtml = `
          <div class="mb-4 break-inside-avoid">
            <h4 class="text-base font-bold text-900 border-bottom-1 pb-2 mb-3">Evidencia Fotográfica</h4>
            <div class="grid">
              ${item.serviceOrderImg.slice(0,4).map((img: string) => `
                <div class="col-3 text-center">
                  <div class="border-1 border-round p-1">
                    <img src="${this.htmlPrintS.esc(img)}" class="w-full border-round" style="aspect-ratio: 4/3; object-fit: cover" alt="Evidencia" />
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      html += `
        <div class="report-container page-break">
          <div class="grid align-items-center mb-4 pb-3 border-bottom-1">
            <div class="col-3 text-center">
              ${logoCustomer ? `<img src="${this.htmlPrintS.esc(logoCustomer)}" alt="Logo" class="report-logo" />` : ''}
            </div>
            <div class="col-5">
              <h2 class="text-lg font-bold text-900 mb-1">${this.htmlPrintS.esc(nameCustomer)}</h2>
              <p class="text-xs text-600 mb-1">${this.htmlPrintS.esc(address)}</p>
              <div class="flex text-xs text-700">
                ${phoneOne ? `<span class="mr-2">📞 ${this.htmlPrintS.esc(phoneOne)}</span>` : ''}
                ${phoneTwo ? `<span>📞 ${this.htmlPrintS.esc(phoneTwo)}</span>` : ''}
              </div>
            </div>
            <div class="col-4 text-right">
              <h3 class="text-lg font-bold text-primary mb-2">ORDEN DE SERVICIO</h3>
              <div class="text-xs">
                <div class="mb-1"><span class="font-bold">Folio:</span> #${this.htmlPrintS.esc(item.id || 'S/N')}</div>
                <div class="mb-1"><span class="font-bold">Solicitud:</span> ${this.htmlPrintS.esc(item.requestDate)}</div>
                <div class="mb-1"><span class="font-bold">Ejecución:</span> ${this.htmlPrintS.esc(item.executionDate)}</div>
                <div class="mt-2 text-xs uppercase font-medium bg-primary border-round" style="display:inline-block; padding: 2px 4px;">
                  ${this.htmlPrintS.esc(item.typeMaintance)} ${item.maintenanceCalendar ? '| ' + this.htmlPrintS.esc(item.recurrence) : ''}
                </div>
              </div>
            </div>
          </div>

          <div class="grid mb-4">
            <div class="col-6">
              <div class="p-3 surface-50 border-round border-1 h-full">
                <span class="block text-xs font-bold text-500 uppercase mb-1">Equipo / Maquinaria</span>
                <div class="text-base font-medium text-900">
                  <span class="text-primary font-bold mr-2">${this.htmlPrintS.esc(item.machineryId)}</span>
                  ${this.htmlPrintS.esc(item.nameMachinery)}
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="p-3 surface-50 border-round border-1 h-full">
                <span class="block text-xs font-bold text-500 uppercase mb-1">Proveedor de Servicio</span>
                <div class="text-base font-medium text-900">${this.htmlPrintS.esc(item.nameComercial)}</div>
              </div>
            </div>
          </div>

          <div class="grid mb-4">
            <div class="col-6">
              <h4 class="text-base font-bold text-900 border-bottom-1 pb-2 mb-2">Actividad Realizada</h4>
              <div class="text-xs line-height-3 text-700">${item.activity || ''}</div>
            </div>
            <div class="col-6">
              <h4 class="text-base font-bold text-900 border-bottom-1 pb-2 mb-2">Observaciones Técnicas</h4>
              <div class="text-xs line-height-3 text-700">${item.observations || ''}</div>
            </div>
          </div>

          ${imagesHtml}

          <div class="mb-4 break-inside-avoid">
            <h4 class="text-base font-bold text-900 border-bottom-1 pb-2 mb-3">Verificación de Calidad y Entrega</h4>
            <div class="grid text-xs">
              <div class="col-6">
                <div class="flex align-items-center mb-2">
                  <span class="mr-2 ${item.cumplimientoActividades ? 'text-green-600' : 'text-red-600'}">${item.cumplimientoActividades ? '✅' : '❌'}</span>
                  <span>Cumplimiento de actividades programadas</span>
                </div>
                <div class="flex align-items-center mb-2">
                  <span class="mr-2 ${item.equiposOperando ? 'text-green-600' : 'text-red-600'}">${item.equiposOperando ? '✅' : '❌'}</span>
                  <span>Equipos/áreas operando correctamente</span>
                </div>
              </div>
              <div class="col-6">
                <div class="flex align-items-center mb-2">
                  <span class="mr-2 ${!item.ocacionoDanos ? 'text-green-600' : 'text-orange-600'}">${!item.ocacionoDanos ? '✅' : '⚠️'}</span>
                  <span>Sin daños al área de trabajo</span>
                </div>
                <div class="flex align-items-center mb-2">
                  <span class="mr-2 ${item.calidadTrabajos ? 'text-green-600' : 'text-red-600'}">${item.calidadTrabajos ? '✅' : '❌'}</span>
                  <span>Calidad de trabajos satisfactoria</span>
                </div>
              </div>
            </div>
          </div>

          <div class="signature-section mt-6 break-inside-avoid">
            <div class="grid">
              <div class="col-6 text-center">
                <div class="signature-line mb-2"></div>
                <div class="text-sm font-bold text-900">${this.htmlPrintS.esc(item.fullName || 'Pendiente de Firma')}</div>
                <div class="text-xs text-500 uppercase mt-1">Revisado / Aceptado</div>
              </div>
              <div class="col-6 text-center">
                <div class="signature-line mb-2"></div>
                <div class="text-sm font-bold text-900">${this.htmlPrintS.esc(item.nameComercial || 'Proveedor')}</div>
                <div class="text-xs text-500 uppercase mt-1">Realizado por</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    html += `
</body>
</html>`;

    this.htmlPrintS.printHtml(html, `Reporte-Ordenes-${filterName}-${periodo}`);
  }
}
