import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SkeletonModule } from "primeng/skeleton";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IEpfDTO } from "../../models/aspel-budget.interface";
import { reportFilterState } from "../../state/financial-report-filter.state";

@Component({
  selector: "app-estado-posicion-financiera",
  imports: [CommonModule, FormsModule, SkeletonModule],
  templateUrl: "./estado-posicion-financiera.html",
})
export class EstadoPosicionFinanciera {
  private readonly apiS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  public readonly filterS = reportFilterState;

  private readonly MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  loading = signal<boolean>(false);
  data = signal<IEpfDTO | null>(null);

  selectedMonthName = computed(() => this.MONTHS[this.filterS.mesIdx()]);
  epfActivo = computed(() => this.data()?.activo ?? []);
  epfPasivo = computed(() => this.data()?.pasivo ?? []);
  epfCapital = computed(() => this.data()?.capital ?? []);
  totalActivo = computed(() => this.data()?.totalActivo ?? 0);
  totalPasivo = computed(() => this.data()?.totalPasivo ?? 0);
  totalCapital = computed(() => this.data()?.totalCapital ?? 0);
  totalPasivoCapital = computed(() => this.data()?.totalPasivoCapital ?? 0);

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      this.filterS.refreshTick();
      const mes = this.filterS.mesIdx() + 1;

      if (custId && yr) {
        this.loadData(custId, yr, mes);
      }
    });
  }

  async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    this.data.set(null);

    const result = await this.apiS.onGetItem<IEpfDTO>(
      Endpoints.ContabilidadOnline.FinancialStatements.epf(
        customerId,
        year,
        mes,
      ),
    );

    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Estado de Posición Financiera");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }

    this.loading.set(false);
  }
}
