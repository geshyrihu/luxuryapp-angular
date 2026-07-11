import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LxSpinner } from "@ui/adaptive/spinner/spinner";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { AiAgentComponent } from "src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/contabilidad-online/ai-agent/ai-agent";
import { reportFilterState } from "src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/contabilidad-online/state/financial-report-filter.state";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import {
  IReportColumn,
  IReportResult,
  IReportResultRow,
} from "../interfaces/report-definition.interface";

@Component({
  selector: "app-report-viewer",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LxSpinner,
    WebButtonLabel,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    AiAgentComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./report-viewer.html",
})
export class ReportViewer implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private toastS = inject(CustomToastService);
  private fb = inject(NonNullableFormBuilder);
  public filterS = reportFilterState;

  aiAgent = viewChild<AiAgentComponent>("aiAgent");

  reportId = signal("");

  filtroForm = this.fb.group({
    anio: this.fb.control(new Date().getFullYear()),
    mes: this.fb.control(new Date().getMonth() + 1),
  });

  meses = [
    { label: "Enero", value: 1 },
    { label: "Febrero", value: 2 },
    { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Mayo", value: 5 },
    { label: "Junio", value: 6 },
    { label: "Julio", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 },
    { label: "Noviembre", value: 11 },
    { label: "Diciembre", value: 12 },
  ];

  loading = signal(false);
  resultado = signal<IReportResult | null>(null);
  advertencias = signal<string[]>([]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id") ?? "";
    this.reportId.set(id);
    if (id) this.ejecutar();
  }

  async ejecutar() {
    this.loading.set(true);
    this.resultado.set(null);
    this.advertencias.set([]);

    const { anio, mes } = this.filtroForm.getRawValue();
    const result = await this.api.onPost<IReportResult>(
      Endpoints.DynamicReports.execute,
      {
        reportId: this.reportId(),
        customerId: this.customerIdS.customerId(),
        year: anio,
        month: mes,
      },
    );

    if (result) {
      this.resultado.set(result);
      this.advertencias.set(result.warnings ?? []);
      this.filterS.currentReportName.set(result.reportName);
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }
    this.loading.set(false);
  }

  exportarExcel() {
    const r = this.resultado();
    if (!r) return;
    const req = this.buildRequest();
    this.api.onDownloadFilePost(
      Endpoints.DynamicReports.executeExcel,
      req,
      `${r.reportName}.xlsx`,
    );
  }

  exportarPdf() {
    const r = this.resultado();
    if (!r) return;
    const req = this.buildRequest();
    this.api.onDownloadFilePost(
      Endpoints.DynamicReports.executePdf,
      req,
      `${r.reportName}.pdf`,
    );
  }

  compartir() {
    const { anio, mes } = this.filtroForm.getRawValue();
    const url = `${window.location.origin}/contabilidad/reportes/ver/${this.reportId()}?year=${anio}&month=${mes}`;
    navigator.clipboard
      .writeText(url)
      .then(() =>
        this.toastS.showSuccess("Copiado", "Enlace copiado al portapapeles."),
      );
  }

  // é”€é”€ Helpers de tipo de visualización é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€

  esDobleColumna(): boolean {
    return this.resultado()?.visualizationType === "table-twoColumn";
  }

  esBudgetVsActual(): boolean {
    return this.resultado()?.visualizationType === "table-budgetVsActual";
  }

  esSummaryCards(): boolean {
    return this.resultado()?.visualizationType === "summary-cards";
  }

  /** Columnas real / presupuesto para table-budgetVsActual */
  colReal(cols: IReportColumn[]): IReportColumn | undefined {
    return cols.find((c) => c.dataSource === "contabilidad");
  }

  colPresupuesto(cols: IReportColumn[]): IReportColumn | undefined {
    return cols.find((c) => c.dataSource === "budget");
  }

  variacion(row: IReportResultRow, cols: IReportColumn[]): number | null {
    const real = this.colReal(cols);
    const ppto = this.colPresupuesto(cols);
    if (!real || !ppto) return null;
    const r = row.values[real.id] ?? null;
    const p = row.values[ppto.id] ?? null;
    if (r === null || p === null) return null;
    return r - p;
  }

  porcentajeVariacion(
    row: IReportResultRow,
    cols: IReportColumn[],
  ): number | null {
    const ppto = this.colPresupuesto(cols);
    if (!ppto) return null;
    const p = row.values[ppto.id] ?? null;
    if (!p) return null;
    const v = this.variacion(row, cols);
    if (v === null) return null;
    return (v / Math.abs(p)) * 100;
  }

  /** Renglones grandTotal / subtotal para summary-cards */
  kpiCards(): IReportResultRow[] {
    return (this.resultado()?.sections ?? [])
      .flatMap((s) => s.rows)
      .filter(
        (r) => r.type === "grandTotal" || (r.type === "subtotal" && r.bold),
      );
  }

  // é”€é”€ Util é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€é”€

  mitadSecciones(): [IReportResultRow[], IReportResultRow[]] {
    const secs = this.resultado()?.sections ?? [];
    const mid = Math.ceil(secs.length / 2);
    return [
      secs.slice(0, mid).flatMap((s) => s.rows),
      secs.slice(mid).flatMap((s) => s.rows),
    ];
  }

  esRenglonEspecial(row: IReportResultRow): boolean {
    return row.type === "spacer" || row.type === "header";
  }

  valorFormateado(val: number | null | undefined): string {
    if (val === null || val === undefined) return "-";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  }

  porcentajeFormateado(val: number | null | undefined): string {
    if (val === null || val === undefined) return "-";
    return `${val >= 0 ? "+" : ""}${val.toFixed(1)}%`;
  }

  private buildRequest() {
    const { anio, mes } = this.filtroForm.getRawValue();
    return {
      reportId: this.reportId(),
      customerId: this.customerIdS.customerId(),
      year: anio,
      month: mes,
    };
  }

  // esTipoDobleColumna() kept for backward compat with template
  esTipoDobleColumna(): boolean {
    return this.esDobleColumna();
  }
}
