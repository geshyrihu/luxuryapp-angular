import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import { firstValueFrom } from "rxjs";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  AspelCobranzaDetalleConcepto,
  AspelCobranzaDetalleResponse,
  AspelCobranzaDetalleVencido,
  AspelEstadoCuentaResponse,
  AspelMovimiento,
} from "./aspel-cobranza-haus.models";

@Injectable({ providedIn: "root" })
export class AspelCobranzaHausPdfService {
  private static readonly simulatedInteresesMoratorios = 1850;
  private static readonly simulatedDescuentoProntoPago = 2500;
  private readonly http = inject(HttpClient);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly pdfMakeInstance: any;
  private logoDataUrl: string | null = null;
  private logoSource: string | null = null;
  private readonly currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  constructor() {
    this.pdfMakeInstance = (pdfMake as any).default || pdfMake;
    if (this.pdfMakeInstance.vfs === undefined) {
      const fonts = pdfFonts as any;
      this.pdfMakeInstance.vfs = fonts.pdfMake?.vfs || fonts;
    }
  }

  async downloadAvisoCobro(
    data: AspelCobranzaDetalleResponse,
    generatedAt: Date,
  ): Promise<void> {
    const logo = await this.getLogoDataUrl();
    const conceptos = this.getVisibleConceptos(data.conceptos);
    const vencidos = conceptos
      .filter((item) => item.vencidos.some((vencido) => vencido.saldoPendiente > 0))
      .flatMap((item) =>
        item.vencidos
          .filter((vencido) => vencido.saldoPendiente > 0)
          .map((vencido) => ({ concepto: item.concepto, ...vencido })),
      );

    const totalCargos = conceptos.reduce((sum, item) => sum + item.cargos, 0);
    const totalAbonos = conceptos.reduce((sum, item) => sum + item.abonos, 0);
    const totalPendiente = conceptos.reduce((sum, item) => sum + item.saldoFinal, 0);
    const totalVencido = conceptos.reduce((sum, item) => sum + item.totalVencido, 0);
    const totalAdelantos = conceptos.reduce((sum, item) => sum + item.adelanto, 0);
    const totalSimuladoConAjustes =
      totalPendiente +
      AspelCobranzaHausPdfService.simulatedInteresesMoratorios -
      AspelCobranzaHausPdfService.simulatedDescuentoProntoPago;

    const docDefinition: TDocumentDefinitions = {
      pageSize: "LETTER",
      pageMargins: [32, 104, 32, 28],
      header: (currentPage: number) =>
        currentPage === 1
          ? this.buildDocumentHeader({
              title: "AVISO DE COBRO",
              documentCode: "COB-ASP-HAUS",
              badge: "COBRANZA",
              generatedAt,
              logo,
              compact: false,
              headerWidth: 548,
            })
          : { text: "" },
      footer: (currentPage, pageCount): Content => ({
        margin: [32, 8, 32, 0],
        columns: [
          {
            text: "Luxury Building Group SA de CV",
            color: "#6B7280",
            fontSize: 8,
          },
          {
            text: `Generado ${this.formatDateTime(generatedAt)}`,
            alignment: "center",
            color: "#6B7280",
            fontSize: 8,
          },
          {
            text: `Pagina ${currentPage} de ${pageCount}`,
            alignment: "right",
            color: "#6B7280",
            fontSize: 8,
          },
        ],
      }),
      defaultStyle: {
        font: "Roboto",
        fontSize: 9,
        color: "#111827",
      },
      styles: this.buildStyles(),
      content: [
        {
          stack: [
            {
              columns: [
                {
                  width: "*",
                  stack: [
                    { text: "AVISO DE COBRO", style: "title" },
                    { text: "Resumen ejecutivo del adeudo por concepto", style: "eyebrowSubtle" },
                  ],
                },
              ],
            },
            {
              stack: [
                {
                  text: [
                    { text: "Propiedad: ", bold: true },
                    data.departamento || "-",
                  ],
                },
                {
                  text: [
                    { text: "Periodo consultado: ", bold: true },
                    `${data.fechaInicio} al ${data.fechaFin}`,
                  ],
                  margin: [0, 2, 0, 0],
                },
              ],
            },
            {
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 0,
                  x2: 548,
                  y2: 0,
                  lineWidth: 1,
                  lineColor: "#2563EB",
                },
              ],
              margin: [0, 10, 0, 0],
            },
          ],
        },
        this.buildSummaryTable(
          totalCargos,
          totalAbonos,
          totalVencido,
          totalPendiente,
        ),
        this.buildConceptTable(
          conceptos,
          AspelCobranzaHausPdfService.simulatedInteresesMoratorios,
          AspelCobranzaHausPdfService.simulatedDescuentoProntoPago,
        ),
        ...this.buildVencidosSections(vencidos),
        ...(totalAdelantos > 0 ? [this.buildAdelantosSection(conceptos)] : []),
        {
          margin: [0, 14, 0, 0],
          text: "El saldo pendiente refleja la composicion actual del adeudo en el rango consultado.",
          style: "note",
        },
      ],
    };

    const fileName = `Aviso-Cobro-${data.numCtaBase || "cuenta"}-${data.fechaFin || "corte"}.pdf`;
    this.pdfMakeInstance.createPdf(docDefinition).download(fileName);
  }

  async downloadEstadoCuenta(
    data: AspelEstadoCuentaResponse,
    generatedAt: Date,
  ): Promise<void> {
    const logo = await this.getLogoDataUrl();
    const movimientos = data.movimientos ?? [];
    const totalCargos = movimientos
      .filter((item) => this.isCharge(item))
      .reduce((sum, item) => sum + (item.monto || 0), 0);
    const totalAbonos = movimientos
      .filter((item) => !this.isCharge(item))
      .reduce((sum, item) => sum + (item.monto || 0), 0);

    const body = [
      [
        this.tableHeader("Tipo"),
        this.tableHeader("Numero"),
        this.tableHeader("Fecha"),
        this.tableHeader("Concepto del movimiento"),
        this.tableHeader("Saldo inicial", "right"),
        this.tableHeader("Cargos", "right"),
        this.tableHeader("Abonos", "right"),
        this.tableHeader("Saldo final", "right"),
      ],
      ...movimientos.map((item, index) => [
        { text: this.formatMovementType(item), style: "monoTiny" },
        { text: this.getMovementNumber(item, index), style: "monoTiny" },
        { text: item.fecha || "-", style: "monoTiny" },
        { text: item.concepto || "-", style: "bodyText" },
        {
          text: this.formatCurrency(item.saldoAnterior || 0),
          alignment: "right",
          style: "monoTiny",
        },
        {
          text: this.isCharge(item) ? this.formatCurrency(item.monto || 0) : "",
          alignment: "right",
          style: "monoTiny",
          color: this.isCharge(item) ? "#1D4ED8" : "#111827",
        },
        {
          text: this.isCharge(item) ? "" : this.formatCurrency(item.monto || 0),
          alignment: "right",
          style: "monoTiny",
          color: !this.isCharge(item) ? "#047857" : "#111827",
        },
        {
          text: this.formatCurrency(item.saldoPosterior || 0),
          alignment: "right",
          style: "amountStrong",
          color: (item.saldoPosterior || 0) < 0 ? "#B91C1C" : "#111827",
        },
      ]),
      [
        { text: "Totales", colSpan: 5, style: "totalLabel" },
        {},
        {},
        {},
        {},
        {
          text: this.formatCurrency(totalCargos),
          alignment: "right",
          style: "totalValue",
        },
        {
          text: this.formatCurrency(totalAbonos),
          alignment: "right",
          style: "totalValue",
        },
        {
          text: this.formatCurrency(data.saldoFinal || 0),
          alignment: "right",
          style: "totalValue",
        },
      ],
    ];

    const docDefinition: TDocumentDefinitions = {
      pageSize: "LETTER",
      pageOrientation: "landscape",
      pageMargins: [28, 100, 28, 28],
      header: (currentPage: number) =>
        currentPage === 1
          ? this.buildDocumentHeader({
              title: "ESTADO DE CUENTA",
              documentCode: "Luxury Building Group",
              badge: "CONTABILIDAD",
              generatedAt,
              logo,
              compact: false,
              headerWidth: 735,
            })
          : { text: "" },
      footer: (currentPage, pageCount): Content => ({
        margin: [28, 8, 28, 0],
        columns: [
          {
            text: "Luxury Building Group SA de CV",
            color: "#6B7280",
            fontSize: 8,
          },
          {
            text: `Cuenta ${data.numCta || "-"} | Periodo ${data.fechaInicio || "-"} al ${data.fechaFin || "-"}`,
            alignment: "center",
            color: "#6B7280",
            fontSize: 8,
          },
          {
            text: `Pagina ${currentPage} de ${pageCount}`,
            alignment: "right",
            color: "#6B7280",
            fontSize: 8,
          },
        ],
      }),
      defaultStyle: {
        font: "Roboto",
        fontSize: 8.5,
        color: "#111827",
      },
      styles: this.buildStyles(),
      content: [
        {
          columns: [
            {
              width: "*",
              stack: [
                { text: "ESTADO DE CUENTA", style: "title" },
                {
                  text: "Detalle cronologico de movimientos, cargos, abonos y saldo progresivo",
                  style: "eyebrowSubtle",
                },
                {
                  margin: [0, 10, 0, 0],
                  text: [
                    { text: "Cuenta: ", bold: true },
                    data.numCta || "-",
                    { text: "    Propiedad: ", bold: true },
                    data.departamento || "-",
                  ],
                },
                {
                  text: [
                    { text: "Periodo consultado: ", bold: true },
                    `${data.fechaInicio || "-"} al ${data.fechaFin || "-"}`,
                  ],
                  margin: [0, 2, 0, 0],
                },
              ],
            },
            {
              width: 260,
              stack: [
                {
                  columns: [
                    this.buildMetricCell("Saldo inicial", this.formatCurrency(data.saldoInicial || 0)),
                    this.buildMetricCell("Saldo final", this.formatCurrency(data.saldoFinal || 0), true),
                  ],
                  columnGap: 8,
                },
                {
                  margin: [0, 8, 0, 0],
                  columns: [
                    this.buildMetricCell("Cargos", this.formatCurrency(totalCargos)),
                    this.buildMetricCell("Abonos", this.formatCurrency(totalAbonos)),
                  ],
                  columnGap: 8,
                },
              ],
            },
          ],
        },
        {
          margin: [0, 18, 0, 0],
          stack: [
            { text: "Movimientos del periodo", style: "sectionTitle" },
            {
              text: `${movimientos.length} movimientos aplicados en el rango consultado.`,
              style: "sectionHelp",
              margin: [0, 2, 0, 8],
            },
            {
              table: {
                headerRows: 1,
                widths: [38, 52, 54, "*", 76, 68, 68, 76],
                body,
              },
              layout: {
                fillColor: (rowIndex: number) => {
                  if (rowIndex === 0) return "#E5E7EB";
                  if (rowIndex === body.length - 1) return "#F3F4F6";
                  return rowIndex % 2 === 0 ? "#FAFAFA" : null;
                },
                hLineColor: () => "#D1D5DB",
                vLineColor: () => "#D1D5DB",
                paddingLeft: () => 4,
                paddingRight: () => 4,
                paddingTop: () => 4,
                paddingBottom: () => 4,
              },
            },
          ],
        },
      ],
    };

    const fileName = `Estado-Cuenta-${data.numCta || "cuenta"}-${data.fechaFin || "corte"}.pdf`;
    this.pdfMakeInstance.createPdf(docDefinition).download(fileName);
  }

  private buildSummaryTable(
    totalCargos: number,
    totalAbonos: number,
    totalVencido: number,
    totalPendiente: number,
  ): any {
    return {
      margin: [0, 16, 0, 0],
      table: {
        widths: ["*", "*", "*"],
        body: [
          [
            this.buildMetricCell("Cargos", this.formatCurrency(totalCargos)),
            this.buildMetricCell("Abonos", this.formatCurrency(totalAbonos)),
            this.buildMetricCell("Vencido actual", this.formatCurrency(totalVencido), true),
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 0,
        paddingRight: () => 10,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
    };
  }

  private buildConceptTable(
    conceptos: AspelCobranzaDetalleConcepto[],
    totalInteresesSimulados: number,
    totalDescuentoSimulado: number,
  ): any {
    const totalCargos = conceptos.reduce((sum, item) => sum + item.cargos, 0);
    const totalAbonos = conceptos.reduce((sum, item) => sum + item.abonos, 0);
    const totalVencido = conceptos.reduce((sum, item) => sum + item.totalVencido, 0);
    const totalPendiente = conceptos.reduce((sum, item) => sum + item.saldoFinal, 0);
    const totalConSimulacion =
      totalPendiente + totalInteresesSimulados - totalDescuentoSimulado;

    const body = [
      [
        this.tableHeader("Concepto"),
        this.tableHeader("Cargos", "right"),
        this.tableHeader("Abonos", "right"),
        this.tableHeader("Vencido", "right"),
        this.tableHeader("Pendiente", "right"),
      ],
      ...conceptos.map((item) => [
        {
          stack: [
            { text: item.concepto || "-", style: "conceptTitle" },
            ...(item.nombreCuenta &&
            item.nombreCuenta.toUpperCase() !== item.concepto.toUpperCase()
              ? [{ text: item.nombreCuenta, style: "conceptSubtitle" }]
              : []),
          ],
        },
        { text: this.formatCurrency(item.cargos), alignment: "right", style: "mono" },
        { text: this.formatCurrency(item.abonos), alignment: "right", style: "mono" },
        {
          text: this.formatCurrency(item.totalVencido),
          alignment: "right",
          style: "mono",
          color: item.totalVencido > 0 ? "#B45309" : "#6B7280",
        },
        {
          text: this.formatCurrency(item.saldoFinal),
          alignment: "right",
          style: "amountStrong",
          color: item.saldoFinal > 0 ? "#B91C1C" : "#111827",
        },
      ]),
      [
        {
          text: "Mas intereses moratorios (simulado)",
          style: "simRowLabelWarn",
        },
        { text: "", alignment: "right" },
        { text: "", alignment: "right" },
        { text: "", alignment: "right" },
        {
          text: `+ ${this.formatCurrency(totalInteresesSimulados)}`,
          alignment: "right",
          style: "simRowValueWarn",
        },
      ],
      [
        {
          text: "Menos descuento por pronto pago (simulado)",
          style: "simRowLabelOk",
        },
        { text: "", alignment: "right" },
        { text: "", alignment: "right" },
        { text: "", alignment: "right" },
        {
          text: `- ${this.formatCurrency(totalDescuentoSimulado)}`,
          alignment: "right",
          style: "simRowValueOk",
        },
      ],
      [
        { text: "Totales", style: "totalLabel" },
        {
          text: this.formatCurrency(totalCargos),
          alignment: "right",
          style: "totalValue",
        },
        {
          text: this.formatCurrency(totalAbonos),
          alignment: "right",
          style: "totalValue",
        },
        {
          text: this.formatCurrency(totalVencido),
          alignment: "right",
          style: "totalValue",
        },
        {
          text: this.formatCurrency(totalConSimulacion),
          alignment: "right",
          style: "totalValue",
        },
      ],
    ];

    return {
      margin: [0, 18, 0, 0],
      stack: [
        { text: "Desglose de la deuda", style: "sectionTitle" },
        {
          text: "Solo aparecen conceptos que realmente forman parte del adeudo o que tienen adelantos aplicables.",
          style: "sectionHelp",
          margin: [0, 2, 0, 8],
        },
        {
          table: {
            headerRows: 1,
            widths: [190, 74, 74, 74, 78],
            body,
          },
          layout: {
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return "#E8EEF8";
              if (rowIndex === body.length - 3) return "#FFF7ED";
              if (rowIndex === body.length - 2) return "#ECFDF5";
              if (rowIndex === body.length - 1) return "#F3F4F6";
              return rowIndex % 2 === 0 ? "#FAFAFA" : null;
            },
            hLineColor: () => "#D1D5DB",
            vLineColor: () => "#D1D5DB",
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
        },
      ],
    };
  }

  private buildVencidosSections(
    vencidos: Array<AspelCobranzaDetalleVencido & { concepto: string }>,
  ): any[] {
    if (!vencidos.length) return [];

    const groups = vencidos.reduce<Array<{
      concepto: string;
      items: Array<AspelCobranzaDetalleVencido & { concepto: string }>;
    }>>((acc, item) => {
      const existing = acc.find((group) => group.concepto === item.concepto);
      if (existing) {
        existing.items.push(item);
        return acc;
      }

      acc.push({ concepto: item.concepto, items: [item] });
      return acc;
    }, []);

    return groups.map((group, index) => {
      const body = [
        [
          this.tableHeader("Fecha"),
          this.tableHeader("Detalle"),
          this.tableHeader("Pendiente", "right"),
        ],
        ...group.items.map((item) => [
          { text: item.fechaCargo || "-", style: "mono" },
          { text: item.conceptoDetalle || "-", style: "bodyText" },
          {
            text: this.formatCurrency(item.saldoPendiente),
            alignment: "right",
            style: "amountStrong",
            color: "#B45309",
          },
        ]),
      ];

      return {
        margin: [0, index === 0 ? 18 : 12, 0, 0],
        stack: [
          ...(index === 0
            ? [{ text: "Saldos vencidos que componen la deuda", style: "sectionTitle" }]
            : []),
          {
            text: group.concepto,
            style: "yellowSectionTitle",
            margin: [0, index === 0 ? 6 : 0, 0, 6],
          },
          {
            table: {
              headerRows: 1,
              widths: [78, "*", 92],
              body,
            },
            layout: {
              fillColor: (rowIndex: number) => (rowIndex === 0 ? "#FEF3C7" : rowIndex % 2 === 0 ? "#FFFBEB" : null),
              hLineColor: () => "#F3D28A",
              vLineColor: () => "#F3D28A",
              paddingLeft: () => 6,
              paddingRight: () => 6,
              paddingTop: () => 5,
              paddingBottom: () => 5,
            },
          },
        ],
      };
    });
  }

  private buildAdelantosSection(
    conceptos: AspelCobranzaDetalleConcepto[],
  ): any {
    const rows = conceptos
      .filter((item) => item.adelanto > 0)
      .map((item) => [
        { text: item.concepto, style: "conceptTitle" },
        { text: item.numCta || "-", style: "mono" },
        {
          text: this.formatCurrency(item.adelanto),
          alignment: "right",
          style: "amountStrong",
          color: "#047857",
        },
      ]);

    return {
      margin: [0, 18, 0, 0],
      stack: [
        { text: "Adelantos a favor", style: "sectionTitle" },
        {
          text: "Los sobrepagos o pagos adelantados se muestran por separado para no inflar el adeudo pendiente.",
          style: "sectionHelp",
          margin: [0, 2, 0, 8],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", 110, 90],
            body: [
              [
                this.tableHeader("Concepto"),
                this.tableHeader("Cuenta"),
                this.tableHeader("Monto", "right"),
              ],
              ...rows,
            ],
          },
          layout: {
            fillColor: (rowIndex: number) => (rowIndex === 0 ? "#DCFCE7" : rowIndex % 2 === 0 ? "#F0FDF4" : null),
            hLineColor: () => "#BBF7D0",
            vLineColor: () => "#BBF7D0",
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
        },
      ],
    };
  }

  private buildMetricCell(label: string, value: string, highlight: boolean = false): any {
    return {
      stack: [
        { text: label, style: highlight ? "metricLabelHighlight" : "metricLabel" },
        { text: value, style: highlight ? "metricValueHighlight" : "metricValue" },
      ],
      fillColor: highlight ? "#E0ECFF" : "#F3F4F6",
      margin: [0, 0, 0, 0],
      border: [false, false, false, false],
    };
  }

  private buildDocumentHeader(options: {
    title: string;
    documentCode: string;
    badge: string;
    generatedAt: Date;
    logo: string | null;
    compact: boolean;
    headerWidth: number;
  }): Content {
    const compact = options.compact;

    return {
      margin: compact ? [28, 12, 28, 0] : [28, 20, 28, 0],
      stack: [
        {
          canvas: [
            {
              type: "rect",
              x: 0,
              y: 0,
              w: options.headerWidth,
              h: compact ? 3 : 5,
              color: "#0B3164",
            },
          ],
        },
        {
          margin: [0, 0, 0, 0],
          table: {
            widths: [74, "*", 150],
            body: [
              [
                options.logo
                  ? {
                      image: options.logo,
                      fit: compact ? [40, 34] : [52, 44],
                      alignment: "center",
                      margin: [0, 6, 0, 6],
                      border: [false, false, false, false],
                    }
                  : {
                      text: "LUX",
                      style: "logoFallback",
                      margin: [0, 8, 0, 0],
                      border: [false, false, false, false],
                    },
                {
                  stack: [
                    { text: this.customerIdS.customerName() || "LuxuryApp", style: compact ? "headerCompanyCompact" : "headerCompany" },
                    { text: options.title, style: compact ? "headerDocumentCompact" : "headerDocument" },
                    {
                      text: `${options.documentCode} | Generado ${this.formatDateTime(options.generatedAt)}`,
                      style: "headerMeta",
                      margin: [0, 2, 0, 0],
                    },
                  ],
                  margin: [0, compact ? 6 : 10, 0, 6],
                  border: [false, false, false, false],
                },
                {
                  stack: [
                    {
                      text: options.badge,
                      style: "headerBadge",
                      alignment: "right",
                    },
                    {
                      text: this.customerIdS.nombreCorto() || this.customerIdS.customerName() || "",
                      style: "headerMeta",
                      alignment: "right",
                      margin: [0, 8, 0, 0],
                    },
                  ],
                  margin: [0, compact ? 8 : 12, 0, 0],
                  border: [false, false, false, false],
                },
              ],
            ],
          },
          layout: {
            fillColor: () => "#F3F4F6",
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 12,
            paddingRight: () => 12,
            paddingTop: () => 0,
            paddingBottom: () => 0,
          },
        },
        {
          margin: [0, 0, 0, 2],
          canvas: [
            {
              type: "rect",
              x: 0,
              y: 0,
              w: options.headerWidth,
              h: 3,
              color: "#C9A84C",
            },
          ],
        },
      ],
    };
  }

  private tableHeader(text: string, alignment: "left" | "right" = "left"): any {
    return {
      text,
      style: "tableHeader",
      alignment,
    };
  }

  private getVisibleConceptos(
    conceptos: AspelCobranzaDetalleConcepto[],
  ): AspelCobranzaDetalleConcepto[] {
    return conceptos
      .filter((item) =>
        item.saldoInicial !== 0 ||
        item.cargos !== 0 ||
        item.abonos !== 0 ||
        item.saldoFinal !== 0 ||
        item.totalVencido !== 0 ||
        item.adelanto !== 0 ||
        item.vencidos.some((vencido) => vencido.saldoPendiente > 0),
      )
      .sort((a, b) => b.saldoFinal - a.saldoFinal || a.concepto.localeCompare(b.concepto));
  }

  private formatCurrency(value: number): string {
    return this.currencyFormatter.format(value || 0);
  }

  private formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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

  private async getLogoDataUrl(): Promise<string | null> {
    const nextSource = this.customerIdS.customerPhotoPath();
    if (!nextSource) return null;
    if (this.logoDataUrl && this.logoSource === nextSource) return this.logoDataUrl;

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

  private buildStyles(): StyleDictionary {
    return {
      title: {
        fontSize: 20,
        bold: true,
        color: "#2563EB",
      },
      eyebrowSubtle: {
        fontSize: 8.5,
        color: "#6B7280",
      },
      metaLabel: {
        fontSize: 8,
        color: "#6B7280",
      },
      heroAmount: {
        fontSize: 18,
        bold: true,
        color: "#1D4ED8",
      },
      sectionTitle: {
        fontSize: 13,
        bold: true,
        color: "#111827",
      },
      yellowSectionTitle: {
        fontSize: 10.5,
        bold: true,
        color: "#9A3412",
      },
      sectionHelp: {
        fontSize: 8,
        color: "#6B7280",
      },
      metricLabel: {
        fontSize: 8,
        color: "#6B7280",
        bold: true,
      },
      metricValue: {
        fontSize: 12,
        bold: true,
        color: "#111827",
        margin: [0, 4, 0, 0],
      },
      metricLabelHighlight: {
        fontSize: 8,
        color: "#1D4ED8",
        bold: true,
      },
      metricValueHighlight: {
        fontSize: 13,
        bold: true,
        color: "#1D4ED8",
        margin: [0, 4, 0, 0],
      },
      tableHeader: {
        bold: true,
        color: "#111827",
        fontSize: 9,
      },
      conceptTitle: {
        bold: true,
        color: "#111827",
      },
      conceptSubtitle: {
        fontSize: 7.5,
        color: "#6B7280",
        margin: [0, 2, 0, 0],
      },
      amountStrong: {
        bold: true,
        fontSize: 9,
      },
      totalLabel: {
        bold: true,
        color: "#111827",
      },
      totalValue: {
        bold: true,
        color: "#111827",
        fontSize: 9,
      },
      mono: {
        fontSize: 8.5,
      },
      bodyText: {
        fontSize: 8.5,
        color: "#374151",
      },
      note: {
        fontSize: 8,
        color: "#6B7280",
      },
      simBadgeTitle: {
        bold: true,
        fontSize: 10,
        color: "#111827",
      },
      simBadgeText: {
        fontSize: 8,
        color: "#4B5563",
      },
      simBadgeValueWarn: {
        bold: true,
        fontSize: 16,
        color: "#C2410C",
      },
      simBadgeValueOk: {
        bold: true,
        fontSize: 16,
        color: "#047857",
      },
      simRowLabel: {
        fontSize: 9,
        color: "#111827",
      },
      simRowLabelWarn: {
        fontSize: 9,
        color: "#9A3412",
        bold: true,
      },
      simRowLabelOk: {
        fontSize: 9,
        color: "#047857",
        bold: true,
      },
      simRowValue: {
        fontSize: 9,
        color: "#111827",
        bold: true,
      },
      simRowValueWarn: {
        fontSize: 9,
        color: "#C2410C",
        bold: true,
      },
      simRowValueOk: {
        fontSize: 9,
        color: "#047857",
        bold: true,
      },
      simTotalLabel: {
        fontSize: 10,
        color: "#1D4ED8",
        bold: true,
      },
      simTotalValue: {
        fontSize: 11,
        color: "#1D4ED8",
        bold: true,
      },
      headerCompany: {
        fontSize: 13,
        bold: true,
        color: "#111827",
      },
      headerCompanyCompact: {
        fontSize: 11,
        bold: true,
        color: "#111827",
      },
      headerDocument: {
        fontSize: 13,
        bold: true,
        color: "#0B3164",
      },
      headerDocumentCompact: {
        fontSize: 11,
        bold: true,
        color: "#0B3164",
      },
      headerMeta: {
        fontSize: 8,
        color: "#6B7280",
      },
      headerBadge: {
        fontSize: 8,
        bold: true,
        color: "#FFFFFF",
        background: "#0B3164",
      },
      logoFallback: {
        fontSize: 14,
        bold: true,
        color: "#0B3164",
      },
      monoTiny: {
        fontSize: 7.5,
      },
    };
  }
}
