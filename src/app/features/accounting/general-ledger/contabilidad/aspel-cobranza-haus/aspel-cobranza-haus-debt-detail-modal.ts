import { CommonModule, CurrencyPipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { TableModule } from "primeng/table";

import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AspelPendientesConceptoResponse } from "./aspel-cobranza-haus.models";

@Component({
  selector: "app-aspel-cobranza-haus-debt-detail-modal",
  templateUrl: "./aspel-cobranza-haus-debt-detail-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    TableModule,
    WebButtonLabel,
    PrimeNgCustomCaption,
    CurrencyPipe,
    NgClass,
    LxTag,
    LxMessage,
  ],
})
export class AspelCobranzaHausDebtDetailModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly loading = signal(true);
  readonly detail = signal<AspelPendientesConceptoResponse | null>(null);

  readonly row = this.config.data?.row;
  readonly customerId = this.config.data?.customerId as string | undefined;
  readonly fechaFin = this.config.data?.fechaFin as string | undefined;
  readonly fechaInicio = this.buildFechaInicio(this.fechaFin);

  readonly totalSaldoInicial = computed(() =>
    (this.detail()?.conceptos ?? []).reduce(
      (sum, item) => sum + (item.saldoInicial ?? item.saldo_inicial ?? 0),
      0,
    ),
  );
  readonly totalCargos = computed(() =>
    (this.detail()?.conceptos ?? []).reduce(
      (sum, item) => sum + (item.cargos ?? 0),
      0,
    ),
  );
  readonly totalAbonos = computed(() =>
    (this.detail()?.conceptos ?? []).reduce(
      (sum, item) => sum + (item.abonos ?? 0),
      0,
    ),
  );
  readonly totalPendiente = computed(() =>
    (this.detail()?.conceptos ?? []).reduce(
      (sum, item) => sum + (item.saldoPendiente ?? item.saldo_pendiente ?? 0),
      0,
    ),
  );

  ngOnInit(): void {
    void this.loadDetail();
  }

  close() {
    this.ref.close();
  }

  downloadAvisoCobro(): void {}

  downloadEstadoCuenta(): void {}

  getConceptSeverity(
    concepto: string,
  ): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    const normalized = concepto.toUpperCase();
    if (normalized.includes("MTTO")) return "info";
    if (normalized.includes("EXTRA")) return "warn";
    if (normalized.includes("RESERVA")) return "success";
    if (normalized.includes("TARJETA")) return "contrast";
    return "secondary";
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return "text-red-600";
    if (balance < 0) return "text-green-600";
    return "text-color";
  }

  private async loadDetail() {
    if (
      !this.customerId ||
      !this.row?.numCtaBase ||
      !this.fechaInicio ||
      !this.fechaFin
    ) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.loading.set(false);
  }

  private normalizeResponse(
    response: AspelPendientesConceptoResponse,
  ): AspelPendientesConceptoResponse {
    return {
      numCtaBase: response.numCtaBase ?? response.num_cta_base ?? "",
      departamento: response.departamento ?? "",
      fechaInicio: response.fechaInicio ?? response.fecha_inicio ?? "",
      fechaFin: response.fechaFin ?? response.fecha_fin ?? "",
      totalConceptos:
        response.totalConceptos ??
        response.total_conceptos ??
        response.conceptos?.length ??
        0,
      conceptos: (response.conceptos ?? []).map((item) => ({
        concepto: item.concepto ?? "",
        numCta: item.numCta ?? item.num_cta ?? "",
        nombreCuenta: item.nombreCuenta ?? item.nombre_cuenta ?? "",
        saldoInicial: item.saldoInicial ?? item.saldo_inicial ?? 0,
        cargos: item.cargos ?? 0,
        abonos: item.abonos ?? 0,
        saldoPendiente: item.saldoPendiente ?? item.saldo_pendiente ?? 0,
      })),
    };
  }

  private buildFechaInicio(fechaFin?: string): string | undefined {
    if (!fechaFin) return undefined;

    const [year] = fechaFin.split("-");
    return year ? `${year}-01-01` : undefined;
  }
}
