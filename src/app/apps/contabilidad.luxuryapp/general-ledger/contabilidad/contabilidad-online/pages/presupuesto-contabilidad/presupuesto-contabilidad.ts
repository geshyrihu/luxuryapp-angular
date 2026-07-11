import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import type {
  PresupuestoContabilidadFila,
  PresupuestoContabilidadResponse,
} from "src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/cobranza-online/models/presupuesto-contabilidad.model";
import { PurchaseHistory } from "src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-web-aspel/purchase-history";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { reportFilterState } from "../../state/financial-report-filter.state";

@Component({
  selector: "app-presupuesto-contabilidad",
  imports: [AppIcon, CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./presupuesto-contabilidad.html",
})
export class PresupuestoContabilidad {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  public filterS = reportFilterState;

  loading = signal(false);
  data = signal<PresupuestoContabilidadResponse | null>(null);

  readonly acumLabel = computed(() => {
    const names = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    return `ACUMULADO ENE-${names[this.filterS.mesIdx()]}`;
  });

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      const mes = this.filterS.mesIdx() + 1;
      this.filterS.refreshTick();
      if (custId && yr) void this.loadData(custId, yr, mes);
    });
  }

  async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    this.data.set(null);
    const result = await this.apiS.onGetItem<PresupuestoContabilidadResponse>(
      Endpoints.ContabilidadOnline.FinancialStatements.presupuestoContabilidad(
        customerId,
        year,
        mes,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Presupuesto Contabilidad");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }
    this.loading.set(false);
  }

  /** Fila vacía = todos los montos son cero. Los totales (nivel 4) nunca se omiten. */
  isFilaVacia(fila: PresupuestoContabilidadFila): boolean {
    if (fila.nivel === 4) return false;
    return (
      fila.pstoMensual === 0 &&
      fila.acumuladoAnual === 0 &&
      fila.presupAnual === 0 &&
      fila.montosEjercidos.every((v) => v === 0)
    );
  }

  rowClass(fila: PresupuestoContabilidadFila): string {
    switch (fila.nivel) {
      case 1:
        return "rf-row-section";
      case 2:
        return "rf-row-group";
      case 4:
        return "rf-row-total";
      default:
        return "";
    }
  }

  descClass(fila: PresupuestoContabilidadFila): string {
    if (fila.nivel === 1 || fila.nivel === 4) return "rf-td-descripcion";
    if (fila.nivel === 2) return "rf-td-descripcion";
    return "rf-td-descripcion--item";
  }

  numClass(fila: PresupuestoContabilidadFila): string {
    return fila.nivel === 4 ? "rf-td-number--total" : "rf-td-number";
  }

  fmt(v: number): string {
    if (v === 0) return "-";
    const formatted = new Intl.NumberFormat("es-MX", {
      maximumFractionDigits: 0,
    }).format(Math.abs(v));
    return v < 0 ? `(${formatted})` : formatted;
  }

  isNeg(v: number): boolean {
    return v < 0;
  }

  trackByCuenta(_i: number, fila: PresupuestoContabilidadFila): string {
    return fila.numeroCuenta + fila.descripcion;
  }

  trackByIndex(i: number): number {
    return i;
  }

  showPurchaseHistory(fila: PresupuestoContabilidadFila) {
    if (fila.nivel === 4 || fila.nivel === 1) return; // Prevent clicking on totals or top level sections if not intended

    this.dialogHandlerS.openDialog(
      PurchaseHistory,
      {
        fiscalYear: this.filterS.year(),
        accountNumber: fila.numeroCuenta,
      },
      `HISTORIAL DE COMPRAS DE ${fila.descripcion}`,
      this.dialogHandlerS.sizeFull,
    );
  }
}
