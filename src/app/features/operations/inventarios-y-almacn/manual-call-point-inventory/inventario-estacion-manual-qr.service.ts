import { Injectable, inject } from "@angular/core";
import QRCode from "qrcode";
import { IInventarioEstacionManual } from "src/app/core/interfaces/inventario-estacion-manual.interface";
import { HtmlPrintService } from "src/app/core/services/html-print.service";

@Injectable({ providedIn: "root" })
export class InventarioEstacionManualQrService {
  private htmlPrintS = inject(HtmlPrintService);

  async downloadQr(item: IInventarioEstacionManual): Promise<void> {
    const qrDataUrl = await QRCode.toDataURL(`luxuryapp://inspect/ManualCallPoint/${item.id}`, {
      width: 200,
      margin: 1,
    });
    const html = this.buildPageHtml([this.buildLabelBlock(qrDataUrl, item)]);
    this.htmlPrintS.printHtml(html, `QR-EST-${item.localCode ?? item.location}`);
  }

  async downloadAllQr(items: IInventarioEstacionManual[]): Promise<void> {
    const blocks = await Promise.all(
      items.map(async (item) => {
        const qrDataUrl = await QRCode.toDataURL(`luxuryapp://inspect/ManualCallPoint/${item.id}`, {
          width: 200,
          margin: 1,
        });
        return this.buildLabelBlock(qrDataUrl, item);
      }),
    );
    const html = this.buildPageHtml(blocks);
    this.htmlPrintS.printHtml(html, "QR-EstacionesManuales");
  }

  private buildPageHtml(labelBlocks: string[]): string {
    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "DM Sans", sans-serif; background: #fff; }
    .labels-grid { display: flex; flex-wrap: wrap; gap: 4mm; padding: 4mm; }
    .label {
      width: 63.5mm; min-height: 38mm; padding: 4mm; border: 1px solid #ccc;
      display: flex; flex-direction: column; align-items: center; page-break-inside: avoid;
    }
    .yellow-stripe { height: 3px; background: #ca8a04; width: 100%; margin-bottom: 2mm; }
    .label-code { font-size: 11pt; font-weight: 800; color: #ca8a04; text-align: center; letter-spacing: 0.5px; margin-bottom: 1mm; }
    .label-title { font-size: 9pt; font-weight: 700; color: #0B3164; text-align: center; line-height: 1.3; }
    .label-location { font-size: 7.5pt; color: #374151; text-align: center; margin: 1mm 0; }
    .label-qr img { width: 28mm; height: 28mm; }
    .label-footer { font-size: 6.5pt; color: #6b7280; text-align: center; margin-top: 1mm; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page { margin: 4mm; }
    }
  </style>
</head>
<body>
  <div class="labels-grid">${labelBlocks.join("")}</div>
</body>
</html>`;
  }

  private buildLabelBlock(qrDataUrl: string, item: IInventarioEstacionManual): string {
    const code = item.localCode
      ? `<div class="label-code">${this.htmlPrintS.esc(item.localCode)}</div>`
      : "";
    return `<div class="label">
    <div class="yellow-stripe"></div>
    ${code}
    <div class="label-title">ESTACIÓN MANUAL<br>${this.htmlPrintS.esc(item.stationType)}</div>
    <div class="label-location">${this.htmlPrintS.esc(item.location)}</div>
    <div class="label-qr"><img src="${qrDataUrl}" alt="QR"/></div>
    <div class="label-footer">Escanear para registrar inspección</div>
  </div>`;
  }
}
