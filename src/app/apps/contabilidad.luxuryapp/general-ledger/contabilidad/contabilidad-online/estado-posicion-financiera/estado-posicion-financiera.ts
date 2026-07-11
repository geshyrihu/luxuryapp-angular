import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";

import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IEpfDTO } from "../interfaces/aspel-budget.interface";
import { AccountingNumberPipe } from "../pipes/accounting-number.pipe";
import { reportFilterState } from "../state/financial-report-filter.state";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-estado-posicion-financiera",
  imports: [
    AppIcon,CommonModule, FormsModule, LxSkeleton, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
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
