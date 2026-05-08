import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

export interface CobranzaMetricasResponseDTO {
  totalFacturado: number;
  totalCobrado: number;
  totalPendiente: number;
  totalVencido: number;
  porcentajeCobrado: number;
  totalPropiedades: number;
  propiedadesAlCorriente: number;
  propiedadesConDeuda: number;
  propiedadesMorosas: number;
  topDeudores: TopDeudorDTO[];
  tendenciaMensual: TendenciaMensualDTO[];
}

export interface TopDeudorDTO {
  propertyId: string;
  propertyName: string;
  totalAdeudado: number;
  cargosVencidos: number;
}

export interface TendenciaMensualDTO {
  year: number;
  month: number;
  mesNombre: string;
  totalFacturado: number;
  totalCobrado: number;
}

@Component({
  selector: "app-cobranza-dashboard",
  imports: [CommonModule, DecimalPipe, CustomButton],
  templateUrl: "./cobranza-dashboard.html",
})
export default class CobranzaDashboard {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private router = inject(Router);

  metricas = signal<CobranzaMetricasResponseDTO | null>(null);
  meses = signal<number>(6);

  // Computed: barra de tendencia como % del máximo para visualización
  maxFacturado = computed(() => {
    const t = this.metricas()?.tendenciaMensual ?? [];
    return Math.max(
      ...t.map((m) => Math.max(m.totalFacturado, m.totalCobrado)),
      1,
    );
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        setTimeout(() => this.onLoadData());
      }
    });
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    const res = await this.apiResponseS.onGetItem<CobranzaMetricasResponseDTO>(
      Endpoints.AccountingCoi.NativeCollection.Analytics.metrics(customerId) + this.meses(),
    );
    if (res) this.metricas.set(res);
  }

  changeMeses(n: number) {
    this.meses.set(n);
    this.onLoadData();
  }

  navigateToPayments() {
    this.router.navigate(['/cobranza-nativa/payments']);
  }

  barWidth(value: number): string {
    return `${Math.round((value / this.maxFacturado()) * 100)}%`;
  }
}
