import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IFlujoCajaDto } from "../../models/aspel-budget.interface";
import { reportFilterState } from "../../state/financial-report-filter.state";

@Component({
  selector: "app-flujo-efectivo",
  imports: [CommonModule, FormsModule, TableModule, CustomButton, DecimalPipe],
  templateUrl: "./flujo-efectivo.html",
})
export class FlujoEfectivo {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterS = reportFilterState;

  // State
  loading = signal<boolean>(false);
  data = signal<IFlujoCajaDto | null>(null);

  // Computed requeridos por el HTML
  nombreEmpresa = computed(() => this.data()?.nombreEmpresa || "");

  meses = computed(() => this.data()?.meses ?? []);

  totalIngresos = computed(() =>
    this.meses().reduce((s, m) => s + m.ingresos, 0),
  );
  totalGastos = computed(() => this.meses().reduce((s, m) => s + m.gastos, 0));
  totalFlujoNeto = computed(() =>
    this.meses().reduce((s, m) => s + m.flujoNeto, 0),
  );

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      if (custId && yr) {
        this.loadData(custId, yr);
      }
    });
  }

  onLoad() {
    const custId = this.customerIdS.customerId();
    const yr = this.filterS.year();
    if (custId && yr) {
      this.loadData(custId, yr);
    }
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
      this.filterS.currentReportName.set('Flujo de Efectivo');
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }
    this.loading.set(false);
  }
}
