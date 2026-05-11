import { CommonModule, CurrencyPipe, NgClass } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import {
  AspelPendienteConceptoItem,
  AspelPendientesConceptoResponse,
} from "./aspel-cobranza-haus.models";

@Component({
  selector: "app-aspel-cobranza-haus-debt-detail-modal",
  templateUrl: "./aspel-cobranza-haus-debt-detail-modal.html",
  styleUrls: ["./aspel-cobranza-haus-debt-detail-modal.scss"],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    MessageModule,
    TagModule,
    CustomButtonDownload,
    PrimeNgCustomCaption,
    CurrencyPipe,
    NgClass,
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
  readonly fechaInicio = this.config.data?.fechaInicio as string | undefined;
  readonly fechaFin = this.config.data?.fechaFin as string | undefined;

  readonly totalSaldoInicial = computed(() =>
    (this.detail()?.conceptos ?? []).reduce(
      (sum, item) => sum + (item.saldoInicial ?? item.saldo_inicial ?? 0),
      0,
    ),
  );
  readonly totalCargos = computed(() =>
    (this.detail()?.conceptos ?? []).reduce((sum, item) => sum + (item.cargos ?? 0), 0),
  );
  readonly totalAbonos = computed(() =>
    (this.detail()?.conceptos ?? []).reduce((sum, item) => sum + (item.abonos ?? 0), 0),
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

  downloadAvisoCobro(): void {
    if (!this.customerId || !this.row?.numCtaBase || !this.fechaInicio || !this.fechaFin) return;

    this.apiResponseS.onDownloadFile(
      Endpoints.AspelCobranza.avisoCobroPdf(
        this.customerId,
        this.row.numCtaBase,
        this.fechaInicio,
        this.fechaFin,
      ),
      `Aviso-Cobro-${this.row.numCtaBase}-${this.fechaFin}.pdf`,
    );
  }

  downloadEstadoCuenta(): void {
    if (!this.customerId || !this.row?.numCtaBase || !this.fechaInicio || !this.fechaFin) return;

    this.apiResponseS.onDownloadFile(
      Endpoints.AspelCobranza.estadoCuentaPdf(
        this.customerId,
        this.row.numCtaBase,
        this.fechaInicio,
        this.fechaFin,
      ),
      `Estado-Cuenta-${this.row.numCtaBase}-${this.fechaFin}.pdf`,
    );
  }

  getConceptSeverity(concepto: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
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
    if (!this.customerId || !this.row?.numCtaBase || !this.fechaInicio || !this.fechaFin) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    const response = await this.apiResponseS.onGetItem<AspelPendientesConceptoResponse>(
      Endpoints.AspelCobranza.pendientesConceptoRango(
        this.customerId,
        this.row.numCtaBase,
        this.fechaInicio,
        this.fechaFin,
      ),
      false,
    );

    this.detail.set(response ? this.normalizeResponse(response) : null);
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
        response.totalConceptos ?? response.total_conceptos ?? response.conceptos?.length ?? 0,
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
}
