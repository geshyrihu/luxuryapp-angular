import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PurchaseHistory } from "@accounting.luxuryapp/general-ledger/aspel-web-budget/purchase-history";
import type {
  PresupuestoContabilidadFila,
  PresupuestoContabilidadResponse,
} from "@collections.luxuryapp/online-collections/interfaces/presupuesto-contabilidad.model";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AccountingNumberPipe } from "@shared/pipes/accounting-number.pipe";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-presupuesto-contabilidad-cliente",
  imports: [AppIcon, CommonModule, AccountingNumberPipe, DataViewMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./presupuesto-contabilidad-cliente.html",
})
export class PresupuestoContabilidadClienteComponent {
  private readonly apiS = inject(ApiResponseService);
  private readonly dialogHandlerS = inject(DialogHandlerService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  readonly loading = signal(false);
  readonly data = signal<PresupuestoContabilidadResponse | null>(null);

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
    return `ACUMULADO ENE-${names[this.mes() - 1]}`;
  });

  constructor() {
    effect(() => {
      const cid = this.customerId();
      const yr = this.year();
      const m = this.mes();
      if (cid && yr && m) void this.loadData(cid, yr, m);
    });
  }

  private async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    const result = await this.apiS.onGetItem<PresupuestoContabilidadResponse>(
      Endpoints.ContabilidadOnline.FinancialStatements.presupuestoContabilidad(
        customerId,
        year,
        mes,
      ),
    );
    this.data.set(result ?? null);
    this.loading.set(false);
  }

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
    if (fila.nivel === 3) return "rf-td-descripcion--item";
    return "rf-td-descripcion";
  }

  numClass(fila: PresupuestoContabilidadFila): string {
    return fila.nivel === 4 ? "rf-td-number--total" : "rf-td-number";
  }

  trackByIndex(i: number): number {
    return i;
  }
  trackByFila(_i: number, fila: PresupuestoContabilidadFila): string {
    return fila.numeroCuenta + fila.descripcion;
  }

  showPurchaseHistory(fila: PresupuestoContabilidadFila) {
    if (fila.nivel === 4 || fila.nivel === 1) return;

    this.dialogHandlerS.openDialog(
      PurchaseHistory,
      {
        fiscalYear: this.year(),
        accountNumber: fila.numeroCuenta,
      },
      `HISTORIAL DE COMPRAS DE ${fila.descripcion}`,
      this.dialogHandlerS.sizeFull,
    );
  }
}


