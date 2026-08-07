import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { CustomerIdService } from "../auth/services/customer-id.service";

export interface TableColumn {
  header: string;
  field: string;
  isCurrency?: boolean;
  align?: "left" | "center" | "right";
}

export interface TablePrintOptions {
  title: string;
  code: string;
  badge: string;
  subtitle?: string;
  columns: TableColumn[];
  data: any[];
}

@Injectable({
  providedIn: "root",
})
export class HtmlPrintService {
  private readonly http = inject(HttpClient);
  private readonly customerIdS = inject(CustomerIdService);
  private logoDataUrl: string | null = null;
  private logoSource: string | null = null;

  private readonly currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  async printStandardTable(options: TablePrintOptions): Promise<void> {
    const logo = await this.getLogoDataUrl();
    const generatedAt = new Date();
    const headersHtml = options.columns
      .map(
        (c) => `
      <th style="text-align: ${c.align || "left"};">${this.esc(c.header)}</th>
    `,
      )
      .join("");

    const rowsHtml = options.data
      .map((row) => {
        const tds = options.columns
          .map((c) => {
            let val = row[c.field];
            if (c.isCurrency) {
              val = this.currencyFormatter.format(val || 0);
            }
            return `<td style="text-align: ${c.align || "left"};">${this.esc(String(val ?? "-"))}</td>`;
          })
          .join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");

    const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.getStandardCss()}
<style>
  .data-table { width:100%; border-collapse:collapse; margin-top:20px; font-size:0.8rem; }
  .data-table th, .data-table td { padding:6px 8px; border:1px solid #D1D5DB; }
  .data-table th { background:#E8EEF8; font-weight:700; color:#111827; }
  .data-table tbody tr:nth-child(even) { background:#FAFAFA; }
</style>
</head><body>
<div class="container">
  ${this.buildStandardHeader(logo, options.title, options.code, generatedAt, options.badge, options.subtitle)}
  <div class="body-doc">
    <table class="data-table">
      <thead><tr>${headersHtml}</tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>
  ${this.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

    const fileName = `${options.title.replace(/\s+/g, "_")}_${this.formatDateTime(generatedAt).replace(/[:\/,]/g, "")}`;
    this.printHtml(html, fileName);
  }

  printHtml(html: string, documentTitle: string): void {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    const originalTitle = document.title;
    document.title = documentTitle;
    let handled = false;

    const cleanup = () => {
      document.title = originalTitle;
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    };

    const triggerPrint = () => {
      if (handled) return;
      handled = true;

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        cleanup();
      }, 500);
    };

    iframe.onload = triggerPrint;
    document.body.appendChild(iframe);
    iframe.srcdoc = html;

    setTimeout(() => {
      triggerPrint();
    }, 1500);
  }

  buildStandardHeader(
    logo: string | null,
    title: string,
    code: string,
    generatedAt: Date,
    badge: string,
    subtitle?: string,
  ): string {
    const customerName = this.customerIdS.customerName() || "LuxuryApp";
    const shortName = this.customerIdS.nombreCorto() || customerName;
    const logoHtml = logo
      ? `<img src="${logo}" class="logo-img"/>`
      : `<div class="logo-fallback">LUX</div>`;

    return `
      <div class="gold-stripe"></div>
      <div class="header-premium">
        <div class="logo-area">
          ${logoHtml}
          <div>
            <div class="logo-text">${this.esc(customerName)}</div>
            <div class="logo-text">${this.esc(title)}</div>
            <div class="logo-sub">${this.esc(code)} | Generado ${this.formatDateTime(generatedAt)}</div>
            ${subtitle ? `<div class="logo-sub" style="margin-top:2px;">${this.esc(subtitle)}</div>` : ""}
          </div>
        </div>
        <div style="text-align:right;">
          <div class="badge-doc">${this.esc(badge)}</div>
          <div class="logo-sub" style="margin-top:8px;">${this.esc(shortName)}</div>
        </div>
      </div>
    `;
  }

  buildStandardFooter(generatedAt: Date): string {
    return `
      <div class="footer-doc">
        <span>Luxury Building Group SA de CV</span>
        <span style="text-align:right;">Generado ${this.formatDateTime(generatedAt)}</span>
      </div>
    `;
  }

  getStandardCss(): string {
    return `<style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family:var(--ds-font-family-document, "DM Sans", sans-serif); line-height:1.45; color:#1a1a1a; font-size:12px; }
      .container { max-width:1020px; margin:0 auto; background:#fff; padding: 20px; }

      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @page { margin: 10mm; }
        .container { padding: 0; max-width: 100%; }
      }

      .gold-stripe { height:6px; background:#c9a84c; width:100%; margin-bottom: 2px; }
      .header-premium { background:#f3f4f6; padding:12px 24px; display:flex; justify-content:space-between; align-items:flex-start; }
      .logo-area { display:flex; align-items:center; }
      .logo-img { height:48px; width:auto; margin-right:12px; object-fit: contain; }
      .logo-fallback { font-size:1.4rem; font-weight:bold; color:#0B3164; margin-right:12px; }
      .logo-text { font-weight:700; font-size:1.1rem; color:#111827; }
      .logo-text:nth-child(2) { color:#0B3164; }
      .logo-sub { font-size:0.75rem; color:#6b7280; }
      .badge-doc { background:#0B3164; padding:4px 10px; border-radius:4px; font-size:0.75rem; font-weight:700; color:#fff; display:inline-block; }

      .body-doc { padding: 24px 0; }
      .footer-doc { display:flex; justify-content:space-between; margin-top:30px; font-size:0.75rem; color:#6b7280; border-top: 1px solid #e5e7eb; padding-top: 12px; }
    </style>`;
  }

  async getLogoDataUrl(): Promise<string | null> {
    const nextSource = this.customerIdS.customerPhotoPath();
    if (!nextSource) return null;
    if (this.logoDataUrl && this.logoSource === nextSource)
      return this.logoDataUrl;

    try {
      const blob = await firstValueFrom(
        this.http.get(nextSource, { responseType: "blob" }),
      );
      const base64 = await this.blobToDataUrl(blob);
      this.logoSource = nextSource;
      this.logoDataUrl = base64;
      return base64;
    } catch {
      this.logoSource = nextSource;
      this.logoDataUrl = null;
      return null;
    }
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  esc(s: string | null | undefined): string {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
