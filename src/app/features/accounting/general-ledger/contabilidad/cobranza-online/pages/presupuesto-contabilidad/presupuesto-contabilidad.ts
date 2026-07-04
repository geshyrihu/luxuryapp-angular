import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { ButtonModule } from "primeng/button";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import type {
  PresupuestoContabilidadFila,
  PresupuestoContabilidadResponse,
} from "../../models/presupuesto-contabilidad.model";

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
  selector: "app-presupuesto-contabilidad",
  imports: [CommonModule, FormsModule, ButtonModule, CustomInputSelectSignal, DataViewMobile, IonItem, IonLabel, WebButtonLabel],
  templateUrl: "./presupuesto-contabilidad.html",
})
export class PresupuestoContabilidad {
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);

  readonly currentYear = signal(new Date().getFullYear());
  readonly mes = signal(new Date().getMonth() + 1);
  readonly loading = signal(false);
  readonly data = signal<PresupuestoContabilidadResponse | null>(null);

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());
  readonly mesesOpciones = MESES_OPCIONES;

  readonly globalFilterFields = ["numeroCuenta", "descripcion"];
  readonly mobileRows = computed(() => {
    const d = this.data();
    if (!d) return [];
    return d.filas.map((f) => ({
      numeroCuenta: f.numeroCuenta,
      descripcion: f.descripcion,
      pstoMensual: this.formatNum(f.pstoMensual),
      acumuladoAnual: this.formatNum(f.acumuladoAnual),
      presupRestante: this.formatNum(f.presupRestante),
    }));
  });

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
    const result =
      await this.apiResponseS.onGetItem<PresupuestoContabilidadResponse>(
        Endpoints.ContabilidadOnline.FinancialStatements.presupuestoContabilidad(
          customerId,
          this.currentYear(),
          this.mes(),
        ),
        false,
      );
    this.data.set(
      (result as PresupuestoContabilidadResponse | null) ?? null,
    );
    this.loading.set(false);
  }

  rowClass(fila: PresupuestoContabilidadFila): string {
    switch (fila.nivel) {
      case 1:
        return "pc-row-mayor";
      case 2:
        return "pc-row-subcuenta";
      case 3:
        return "pc-row-detalle";
      case 4:
        return "pc-row-total";
      default:
        return "";
    }
  }

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

  trackByIndex(index: number): number {
    return index;
  }

  trackByCuenta(index: number, fila: PresupuestoContabilidadFila): string {
    return fila.numeroCuenta + fila.descripcion;
  }
}
