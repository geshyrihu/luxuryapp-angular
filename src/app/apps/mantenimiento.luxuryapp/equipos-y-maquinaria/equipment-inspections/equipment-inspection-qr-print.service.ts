import { Injectable, inject } from "@angular/core";
import QRCode from "qrcode";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { EquipmentQrDownloadItemDTO } from "./equipment-inspection.models";

@Injectable({
  providedIn: "root",
})
export class EquipmentInspectionQrPrintService {
  private htmlPrintS = inject(HtmlPrintService);

  async printOne(item: EquipmentQrDownloadItemDTO): Promise<void> {
    await this.printMany([item], `QR-${item.code}`);
  }

  async printMany(
    items: EquipmentQrDownloadItemDTO[],
    title: string = "QR-Equipos",
  ): Promise<void> {
    const blocks = await Promise.all(
      items.map(async (item) => {
        const qrDataUrl = await QRCode.toDataURL(item.qrText, {
          width: 220,
          margin: 1,
        });
        return this.buildLabelBlock(qrDataUrl, item);
      }),
    );

    const html = this.buildPageHtml(blocks);
    this.htmlPrintS.printHtml(html, title);
  }

  private buildPageHtml(labelBlocks: string[]): string {
    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "DM Sans", sans-serif; background: #fff; }
    .labels-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 4mm;
      padding: 4mm;
    }
    .label {
      width: 63.5mm;
      min-height: 38mm;
      padding: 4mm;
      border: 1px solid #d1d5db;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      page-break-inside: avoid;
      background: #fff;
    }
    .gold-stripe { height: 3px; background: #c9a84c; width: 100%; margin-bottom: 2mm; }
    .label-code { font-size: 10pt; font-weight: 800; color: #c9a84c; text-align: center; margin-bottom: 1mm; }
    .label-title { font-size: 8.5pt; font-weight: 700; color: #0B3164; text-align: center; line-height: 1.25; }
    .label-location { font-size: 7pt; color: #4b5563; text-align: center; margin: 1mm 0; min-height: 7mm; }
    .label-qr img { width: 26mm; height: 26mm; }
    .label-footer { font-size: 6.5pt; color: #6b7280; text-align: center; margin-top: 1mm; }
    .label-type { font-size: 6.5pt; color: #0B3164; text-align: center; margin-top: 1mm; font-weight: 700; }
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

  private buildLabelBlock(
    qrDataUrl: string,
    item: EquipmentQrDownloadItemDTO,
  ): string {
    return `<div class="label">
    <div class="gold-stripe"></div>
    <div class="label-code">${this.htmlPrintS.esc(item.code)}</div>
    <div class="label-title">${this.htmlPrintS.esc(item.labelName)}</div>
    <div class="label-location">${this.htmlPrintS.esc(item.machineryName)}<br>${this.htmlPrintS.esc(item.machineryLocation || "")}</div>
    <div class="label-qr"><img src="${qrDataUrl}" alt="QR"/></div>
    <div class="label-type">${this.htmlPrintS.esc(item.qrTypeName)}</div>
    <div class="label-footer">Escanear para abrir el flujo del equipo</div>
  </div>`;
  }
}

