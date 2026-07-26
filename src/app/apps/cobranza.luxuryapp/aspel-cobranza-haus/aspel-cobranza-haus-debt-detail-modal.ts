import { CommonModule, CurrencyPipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";

import { TableModule } from "@ui/web/primeng-table/primeng-table";

import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { AspelCobranzaDetalleResponse } from "./aspel-cobranza-haus.models";

import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";

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
    ButtonModule,
    RippleModule,
  ],
})
export class AspelCobranzaHausDebtDetailModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly loading = signal(true);
  readonly detail = signal<AspelCobranzaDetalleResponse | null>(null);

  readonly row = this.config.data?.row;
  readonly customerId = this.config.data?.customerId as string | undefined;
  readonly fechaFin = this.config.data?.fechaFin as string | undefined;
  readonly isCommitteeMode = this.config.data?.isCommitteeMode ?? false;
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
      (sum, item) => sum + (item.saldoFinal ?? item.saldo_final ?? 0),
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
    try {
      const response = await this.apiResponseS.onGetItem<AspelCobranzaDetalleResponse>(
        Endpoints.CobranzaLive.detalleCobranzaRango(this.customerId, this.row.numCtaBase)
      );
      if (response) {
        const normalized = this.normalizeResponse(response);
        if (this.isCommitteeMode) {
          normalized.conceptos = normalized.conceptos.filter(c => c.saldoFinal > 0);
          normalized.conceptos.forEach(c => {
            c.vencidos = c.vencidos.filter(v => v.saldoPendiente > 0);
          });
          normalized.totalConceptos = normalized.conceptos.length;
        }
        this.detail.set(normalized);
      }
    } finally {
      this.loading.set(false);
    }
  }

  private normalizeResponse(
    response: AspelCobranzaDetalleResponse,
  ): AspelCobranzaDetalleResponse {
    return {
      numCtaBase: response.numCtaBase ?? response.num_cta_base ?? "",
      departamento: response.departamento ?? "",
      fechaInicio: response.fechaInicio ?? response.fecha_inicio ?? "",
      fechaFin: response.fechaFin ?? response.fecha_fin ?? "",
      saldoInicialTotal: response.saldoInicialTotal ?? response.saldo_inicial_total ?? 0,
      totalCargos: response.totalCargos ?? response.total_cargos ?? 0,
      totalAbonos: response.totalAbonos ?? response.total_abonos ?? 0,
      saldoFinalTotal: response.saldoFinalTotal ?? response.saldo_final_total ?? 0,
      totalAdelantos: response.totalAdelantos ?? response.total_adelantos ?? 0,
      totalConceptos: response.totalConceptos ?? response.total_conceptos ?? 0,
      conceptos: (response.conceptos ?? []).map((item) => ({
        concepto: item.concepto ?? "",
        numCta: item.numCta ?? item.num_cta ?? "",
        nombreCuenta: item.nombreCuenta ?? item.nombre_cuenta ?? "",
        saldoInicial: item.saldoInicial ?? item.saldo_inicial ?? 0,
        cargos: item.cargos ?? 0,
        abonos: item.abonos ?? 0,
        saldoFinal: item.saldoFinal ?? item.saldo_final ?? 0,
        totalVencido: item.totalVencido ?? item.total_vencido ?? 0,
        adelanto: item.adelanto ?? 0,
        vencidos: (item.vencidos ?? []).map(v => ({
          fechaCargo: v.fechaCargo ?? v.fecha_cargo ?? "",
          conceptoDetalle: v.conceptoDetalle ?? v.concepto_detalle ?? "",
          saldoPendiente: v.saldoPendiente ?? v.saldo_pendiente ?? 0
        }))
      })),
    };
  }

  private buildFechaInicio(fechaFin?: string): string | undefined {
    if (!fechaFin) return undefined;

    const [year] = fechaFin.split("-");
    return year ? `${year}-01-01` : undefined;
  }
}
