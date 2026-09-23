import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { IFondoReservaDTO } from "../../interfaces/aspel-budget.interface";
import { FinancialReportFilterStore } from "../state/financial-report-filter.store.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";

@Component({
  selector: "app-fondo-reserva",

  imports: [LxSkeleton, AppIcon, CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./fondo-reserva.html",
})
export class FondoReservaComponent {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private filters = inject(FinancialReportFilterStore);

  data = signal<IFondoReservaDTO | null>(null);
  loading = signal<boolean>(false);

  constructor() {
    effect(
      () => {
        const customerId = this.customerIdS.customerId();
        const year = this.filters.year();
        this.filters.refreshTick();
        const mesIdx = this.filters.mesIdx();

        if (customerId && year && mesIdx >= 0) {
          this.loadData(customerId, year, mesIdx + 1);
        }
      },
      { allowSignalWrites: true },
    );
  }

  private async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    this.data.set(null);

    const result = await this.apiS.onGetItem<IFondoReservaDTO>(
      Endpoints.ContabilidadOnline.FinancialStatements.fondoReserva(
        customerId,
        year,
        mes,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filters.currentReportName.set("Fondo de Reserva");
      this.filters.currentReportContext.set(JSON.stringify(result));
    }

    this.loading.set(false);
  }
}
