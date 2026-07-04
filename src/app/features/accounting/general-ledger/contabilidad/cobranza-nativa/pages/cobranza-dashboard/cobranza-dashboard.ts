import { CommonModule, DecimalPipe } from "@angular/common";
import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { ROUTES } from "src/app/routing/route-paths";

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
  imports: [CommonModule, DecimalPipe, WebButtonLabel, AppIcon],
  templateUrl: "./cobranza-dashboard.html",
})
export default class CobranzaDashboard {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private signalRService = inject(SignalRService);

  private realtimeCustomerId: string | null = null;

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
    this.signalRService.nativeCollectionUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.onLoadData();
      });

    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.setupRealtime(customerId);
        setTimeout(() => this.onLoadData());
      }
    });
  }

  private setupRealtime(customerId: string) {
    if (this.realtimeCustomerId === customerId) return;

    if (this.realtimeCustomerId) {
      void this.signalRService.leaveNativeCollectionGroup(this.realtimeCustomerId);
    }

    this.realtimeCustomerId = customerId;
    this.signalRService.start();
    void this.signalRService.joinNativeCollectionGroup(customerId);

    this.destroyRef.onDestroy(() => {
      if (this.realtimeCustomerId) {
        void this.signalRService.leaveNativeCollectionGroup(
          this.realtimeCustomerId,
        );
      }
    });
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    const res = await this.apiResponseS.onGetItem<CobranzaMetricasResponseDTO>(
      Endpoints.AccountingCoi.NativeCollection.Analytics.metrics(customerId) +
        this.meses(),
    );
    if (res) this.metricas.set(res);
  }

  changeMeses(n: number) {
    this.meses.set(n);
    this.onLoadData();
  }

  navigateToPayments() {
    this.router.navigate(ROUTES.COBRANZA_NATIVA.PAGOS);
  }

  barWidth(value: number): string {
    return `${Math.round((value / this.maxFacturado()) * 100)}%`;
  }
}
