import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IFlujoCajaDto } from "../../models/aspel-budget.interface";
import { AccountingNumberPipe } from "../../pipes/accounting-number.pipe";
import { reportFilterState } from "../../state/financial-report-filter.state";

@Component({
  selector: "app-flujo-efectivo",
  imports: [CommonModule, FormsModule, TableModule, AccountingNumberPipe],
  templateUrl: "./flujo-efectivo.html",
})
export class FlujoEfectivo {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterS = reportFilterState;

  loading = signal<boolean>(false);
  data = signal<IFlujoCajaDto | null>(null);

  columnas = computed(() => {
    const cols = this.data()?.columnas ?? [];
    if (cols.length === 0) return [];
    const maxIdx = Math.min(cols.length - 2, this.filterS.mesIdx());
    return [...cols.slice(0, maxIdx + 1), cols[cols.length - 1]];
  });

  grupos = computed(() => {
    const grps = this.data()?.grupos ?? [];
    if (grps.length === 0) return [];
    const maxIdx = Math.min(11, this.filterS.mesIdx());
    return grps.map(g => ({
      ...g,
      filas: g.filas.map(f => ({
        ...f,
        montos: [...f.montos.slice(0, maxIdx + 1), f.montos[f.montos.length - 1]]
      }))
    }));
  });

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      this.filterS.refreshTick();
      if (custId && yr) {
        this.loadData(custId, yr);
      }
    });
  }

  async loadData(customerId: string, year: number) {
    this.loading.set(true);
    const result = await this.apiS.onGetItem<IFlujoCajaDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.cashFlow(
        customerId,
        year,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Flujo de Efectivo");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }
    this.loading.set(false);
  }
}
