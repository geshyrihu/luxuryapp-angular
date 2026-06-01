import { CommonModule, formatDate } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import FileSaver from "file-saver";
import { FormsModule } from "@angular/forms";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { DatePickerModule } from "primeng/datepicker";
import { TableModule } from "primeng/table";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { IRecepcionPipaAgua } from "./recepcion-pipas-agua.interfaces";

@Component({
  selector: "app-recepcion-pipas-agua-reporte",
  templateUrl: "./recepcion-pipas-agua-reporte.html",
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    TableModule,
    CustomButtonDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
  ],
})
export class RecepcionPipasAguaReporte implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  pdfGeneratorS = inject(PdfGeneratorService);

  dataSignal = signal<IRecepcionPipaAgua[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();

  customerName = computed(() => this.customerIdS.customerName() || "Cliente activo");
  customerLogo = computed(
    () => this.customerIdS.customerPhotoPath() || "assets/images/default-avatar.png",
  );

  private readonly _today = new Date();
  startDate: Date | null = new Date(this._today.getFullYear(), this._today.getMonth(), 1, 0, 0, 0);
  endDate: Date | null = new Date(this._today.getFullYear(), this._today.getMonth() + 1, 0, 23, 59, 0);

  private allData: IRecepcionPipaAgua[] = [];

  totalRecepciones = computed(() => this.dataSignal().length);

  totalM3 = computed(() =>
    this.dataSignal().reduce(
      (acc, x) => acc + ((x.lecturaMedidorFinal ?? 0) - (x.lecturaMedidorInicial ?? 0)),
      0,
    ),
  );

  totalConIVA = computed(() =>
    this.dataSignal().reduce((acc, x) => {
      const m3 = (x.lecturaMedidorFinal ?? 0) - (x.lecturaMedidorInicial ?? 0);
      return acc + (x.costoMetroCubico ?? 0) * m3;
    }, 0),
  );

  subtotalSinIVA = computed(() => this.totalConIVA() / 1.16);
  ivaDesglosado = computed(() => this.totalConIVA() - this.subtotalSinIVA());
  retencion = computed(() => this.subtotalSinIVA() * 0.04);
  totalAPagar = computed(() => this.totalConIVA() - this.retencion());

  ngOnInit(): void {
    this.onLoadData();
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    let data = this.allData;
    if (this.startDate || this.endDate) {
      data = data.filter((x) => {
        const d = new Date(x.horaLlegada);
        if (this.startDate && d < this.startDate) return false;
        if (this.endDate && d > this.endDate) return false;
        return true;
      });
    }
    this.dataSignal.set(data);
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetList(`recepcion-pipas-agua/list/${this.customerIdS.customerId()}`)
      .then((result: IRecepcionPipaAgua[]) => {
        this.allData = result ?? [];
        this.applyFilter();
      });
  }

  async onDownloadPdf(): Promise<void> {
    const BLUE = "#003A62";
    const YELLOW = "#f59e0b";
    const RED = "#dc2626";
    const GRAY = "#6b7280";
    const ROW_ALT = "#f8fafc";
    const BORDER = "#e2e8f0";
    // PdfGeneratorService overrides pageMargins to [40,80,40,40]
    // Portrait LETTER content width: 612 - 40 - 40 = 532pt
    const W = 532;

    const fmtMoney = (v: number) =>
      `$${v.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const fmtDate = (d: string | null) => {
      if (!d) return "En curso";
      const clean = d.replace(/Z$/, "").replace(/[+-]\d{2}:\d{2}$/, "");
      const [datePart, timePart] = clean.split("T");
      if (!datePart) return "-";
      const [y, mo, day] = datePart.split("-");
      return `${day}/${mo}/${y} ${(timePart || "00:00").slice(0, 5)}`;
    };

    const fmtDt = (d: Date | null) =>
      d ? formatDate(d, "dd/MM/yyyy HH:mm", "es-MX") : "N/A";
    const periodoLabel = `${fmtDt(this.startDate)} - ${fmtDt(this.endDate)}`;

    const data = this.dataSignal();

    // ── helpers ──────────────────────────────────────────────
    const thinBorder = {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => BORDER,
      vLineColor: () => BORDER,
    };

    const tableHeaderLayout = {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      hLineColor: () => BORDER,
    };

    const th = (text: string, align: "left" | "center" | "right" = "left"): any => ({
      text,
      bold: true,
      fontSize: 7,
      color: "#fff",
      fillColor: BLUE,
      alignment: align,
      margin: [3, 4, 3, 4],
    });

    const td = (text: string, opts: any = {}): any => ({
      text,
      fontSize: 7,
      margin: [3, 3, 3, 3],
      ...opts,
    });

    const bodyRows = data.map((item, i) => {
      const m3 = (item.lecturaMedidorFinal ?? 0) - (item.lecturaMedidorInicial ?? 0);
      const importe = (item.costoMetroCubico ?? 0) * m3;
      const fill = i % 2 !== 0 ? ROW_ALT : undefined;
      const cist = `${Math.round(item.nivelCisternaAntes ?? 0)}%→${Math.round(item.nivelCisternaDespues ?? 0)}%\n(${Math.round((item.nivelCisternaDespues ?? 0) - (item.nivelCisternaAntes ?? 0))}%)`;
      const personal = [item.colaboradorMtto, item.guardiaSeguridad].filter(Boolean).join("\n");
      return [
        td(item.empresa ?? "", { fillColor: fill }),
        td(`${item.placasCamion}\n${(item.capacidadPipa ?? 0).toLocaleString("es-MX")} L`, { fillColor: fill }),
        td(`${fmtDate(item.horaLlegada)}\n${fmtDate(item.horaTermino)}`, { fillColor: fill }),
        td(cist, { alignment: "center", fillColor: fill }),
        td(`${Math.round(item.lecturaMedidorInicial ?? 0)} → ${Math.round(item.lecturaMedidorFinal ?? 0)}`, { alignment: "center", fillColor: fill }),
        td(String(Math.round(m3)), { alignment: "right", bold: true, fillColor: fill }),
        td(`${(item.costoMetroCubico ?? 0).toFixed(2)}\n${fmtMoney(importe)}`, { alignment: "right", fillColor: fill }),
        td(personal, { fillColor: fill }),
      ];
    });

    // ── document ─────────────────────────────────────────────
    // NOTE: PdfGeneratorService injects its own page header (logo + company name)
    // and overrides pageMargins to [40,80,40,40] — do not add a custom header here.
    const docDef: TDocumentDefinitions = {
      pageSize: "LETTER",
      pageOrientation: "portrait",
      content: [

        // ─ Period subtitle (service header already shows title + logo) ─
        {
          columns: [
            { text: "Recepcion de Pipas de Agua — Reporte", fontSize: 11, bold: true, color: BLUE },
            { text: periodoLabel, fontSize: 9, color: GRAY, alignment: "right" },
          ],
          margin: [0, 0, 0, 4],
        } as any,
        { canvas: [{ type: "rect", x: 0, y: 0, w: W, h: 2, r: 0, color: YELLOW }], margin: [0, 0, 0, 10] } as any,

        // ─ KPI CARDS + COST SUMMARY ─
        {
          columns: [
            // Left: two KPI cards stacked
            {
              width: 148,
              stack: [
                {
                  table: {
                    widths: ["*"],
                    body: [[{
                      stack: [
                        { text: "Total recepciones", fontSize: 7, color: GRAY, alignment: "center", margin: [0, 0, 0, 2] },
                        { text: String(this.totalRecepciones()), fontSize: 22, bold: true, color: BLUE, alignment: "center" },
                      ],
                      margin: [8, 10, 8, 10],
                    }]],
                  },
                  layout: thinBorder,
                  margin: [0, 0, 0, 6],
                },
                {
                  table: {
                    widths: ["*"],
                    body: [[{
                      stack: [
                        { text: "Total m³ descargados", fontSize: 7, color: GRAY, alignment: "center", margin: [0, 0, 0, 2] },
                        { text: String(Math.round(this.totalM3())), fontSize: 22, bold: true, color: "#1d4ed8", alignment: "center" },
                      ],
                      margin: [8, 10, 8, 10],
                    }]],
                  },
                  layout: thinBorder,
                },
              ],
            },
            // Right: cost summary card
            {
              table: {
                widths: ["*", "auto"],
                body: [
                  [
                    {
                      text: "Resumen de costos del periodo",
                      bold: true, fontSize: 8, color: "#fff", fillColor: BLUE,
                      colSpan: 2, border: [false, false, false, false],
                      margin: [6, 6, 6, 6],
                    },
                    {},
                  ],
                  [
                    { text: "Importe total (precio con IVA × m³)", fontSize: 8, border: [false, false, false, true], borderColor: ["", "", "", BORDER], margin: [6, 4, 6, 4] },
                    { text: fmtMoney(this.totalConIVA()), fontSize: 8, bold: true, alignment: "right", border: [false, false, false, true], borderColor: ["", "", "", BORDER], margin: [6, 4, 6, 4] },
                  ],
                  [
                    { text: "     Subtotal base (sin IVA)", fontSize: 7, color: GRAY, border: [false, false, false, true], borderColor: ["", "", "", BORDER], margin: [14, 3, 6, 3] },
                    { text: fmtMoney(this.subtotalSinIVA()), fontSize: 7, color: GRAY, alignment: "right", border: [false, false, false, true], borderColor: ["", "", "", BORDER], margin: [6, 3, 6, 3] },
                  ],
                  [
                    { text: "     IVA 16%", fontSize: 7, color: GRAY, border: [false, false, false, true], borderColor: ["", "", "", BORDER], margin: [14, 3, 6, 3] },
                    { text: fmtMoney(this.ivaDesglosado()), fontSize: 7, color: GRAY, alignment: "right", border: [false, false, false, true], borderColor: ["", "", "", BORDER], margin: [6, 3, 6, 3] },
                  ],
                  [
                    { text: "Retención 4%", fontSize: 8, bold: true, color: RED, border: [false, false, false, true], borderColor: ["", "", "", BORDER], margin: [6, 4, 6, 4] },
                    { text: `(${fmtMoney(this.retencion())})`, fontSize: 8, bold: true, color: RED, alignment: "right", border: [false, false, false, true], borderColor: ["", "", "", BORDER], margin: [6, 4, 6, 4] },
                  ],
                  [
                    { text: "TOTAL A PAGAR", fontSize: 10, bold: true, color: "#fff", fillColor: BLUE, border: [false, false, false, false], margin: [6, 7, 6, 7] },
                    { text: fmtMoney(this.totalAPagar()), fontSize: 10, bold: true, color: "#fff", fillColor: BLUE, alignment: "right", border: [false, false, false, false], margin: [6, 7, 6, 7] },
                  ],
                ],
              },
              layout: {
                hLineWidth: () => 0,
                vLineWidth: () => 0,
              },
            },
          ],
          columnGap: 10,
          margin: [0, 0, 0, 12],
        } as any,

        // ─ DATA TABLE ─
        { text: "Detalle del periodo", fontSize: 9, bold: true, color: BLUE, margin: [0, 0, 0, 4] },
        {
          table: {
            widths: ["*", 55, 78, 63, 60, 25, 68, 75],
            headerRows: 1,
            body: [
              [
                th("Empresa"),
                th("Placas / Cap."),
                th("Llegada / Termino"),
                th("Cisterna ant → des"),
                th("Medidor ini → fin"),
                th("m³", "right"),
                th("Costo / Importe", "right"),
                th("Personal"),
              ],
              ...bodyRows,
            ],
          },
          layout: tableHeaderLayout,
        } as any,

      ],
    };

    await this.pdfGeneratorS.generatePdf(
      docDef,
      `reporte-pipas-${periodoLabel.replace(/\//g, "-").replace(/ - /g, "_")}`,
      { clientName: "Recepcion de Pipas de Agua" },
    );
  }

  exportExcel(): void {
    import("xlsx").then((xlsx) => {
      const rows = this.dataSignal().map((item) => {
        const m3 = (item.lecturaMedidorFinal ?? 0) - (item.lecturaMedidorInicial ?? 0);
        return {
          Empresa: item.empresa ?? "",
          Placas: item.placasCamion,
          "Cap. (L)": item.capacidadPipa,
          Llegada: item.horaLlegada
            ? formatDate(item.horaLlegada, "dd/MM/yyyy HH:mm", "es-MX")
            : "",
          Termino: item.horaTermino
            ? formatDate(item.horaTermino, "dd/MM/yyyy HH:mm", "es-MX")
            : "En curso",
          "Cisterna antes (%)": item.nivelCisternaAntes,
          "Cisterna despues (%)": item.nivelCisternaDespues,
          "Dif. cisterna (%)": (item.nivelCisternaDespues ?? 0) - (item.nivelCisternaAntes ?? 0),
          "Medidor inicial": item.lecturaMedidorInicial,
          "Medidor final": item.lecturaMedidorFinal,
          "m³ ingresados": m3,
          "Costo m³": item.costoMetroCubico,
          "Importe (c/IVA)": (item.costoMetroCubico ?? 0) * m3,
          "Colaborador mtto": item.colaboradorMtto ?? "",
          "Guardia testigo": item.guardiaSeguridad ?? "",
        };
      });
      const ws = xlsx.utils.json_to_sheet(rows);
      const wb = { Sheets: { Reporte: ws }, SheetNames: ["Reporte"] };
      const buffer: any = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      FileSaver.saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }),
        `recepcion-pipas-reporte.xlsx`,
      );
    });
  }

}
