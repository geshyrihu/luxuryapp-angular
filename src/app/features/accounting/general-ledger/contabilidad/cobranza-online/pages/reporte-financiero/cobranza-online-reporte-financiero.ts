import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import type {
  ReporteFinancieroFila,
  ReporteFinancieroResponse,
} from "../../models/cobranza-online-reporte-financiero.model";

interface OpcionMes {
  label: string;
  value: number;
}

const MESES_OPCIONES: OpcionMes[] = [
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

@Component({
  selector: "app-cobranza-online-reporte-financiero",
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule],
  templateUrl: "./cobranza-online-reporte-financiero.html",
})
export class CobranzaOnlineReporteFinanciero {
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);

  readonly currentYear = signal(new Date().getFullYear());
  readonly mesInicio = signal(1);
  readonly mesFin = signal(new Date().getMonth() + 1);
  readonly loading = signal(false);
  readonly data = signal<ReporteFinancieroResponse | null>(null);

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());
  readonly mesesOpciones = MESES_OPCIONES;

  readonly yearsOptions = computed(() => {
    const current = new Date().getFullYear();
    return [current, current - 1, current - 2].map((y) => ({
      label: String(y),
      value: y,
    }));
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (!customerId) {
        this.data.set(null);
        return;
      }
      void this.loadData(customerId);
    });
  }

  async onConsultar() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    await this.loadData(customerId);
  }

  private async loadData(customerId: string) {
    this.loading.set(true);
    const result = await this.apiResponseS.onGetItem<ReporteFinancieroResponse>(
      Endpoints.AccountingCoi.CobranzaOnline.ReporteFinanciero.get(
        customerId,
        this.currentYear(),
        this.mesInicio(),
        this.mesFin(),
      ),
      false,
    );
    this.data.set((result as ReporteFinancieroResponse | null) ?? null);
    this.loading.set(false);
  }

  // -------------------------------------------------------------------------
  // Helpers de formato
  // -------------------------------------------------------------------------

  formatNum(value: number): string {
    if (value === 0 || value === null || value === undefined) return "-";
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  isNeg(value: number): boolean {
    return value < 0;
  }

  isLastCol(index: number, cols: number): boolean {
    return index === cols - 1;
  }

  /** Devuelve true si todos los valores de la fila son cero */
  isFilaVacia(fila: ReporteFinancieroFila): boolean {
    return fila.valores.every((v) => v === 0);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
