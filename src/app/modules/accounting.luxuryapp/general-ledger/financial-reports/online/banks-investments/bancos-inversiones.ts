import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { IBancosInversionesDto } from "../../interfaces/aspel-budget.interface";
import { FinancialReportFilterStore } from "../state/financial-report-filter.store.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";

import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { AppTable } from "@ui/web/table/table";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-bancos-inversiones",

  imports: [LxSkeleton, AppIcon, CommonModule, AppTable],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./bancos-inversiones.html",
})
export class BancosInversionesComponent {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private filters = inject(FinancialReportFilterStore);

  data = signal<IBancosInversionesDto | null>(null);
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

    const result = await this.apiS.onGetItem<IBancosInversionesDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.bancosInversiones(
        customerId,
        year,
        mes,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filters.currentReportName.set("Bancos e Inversiones");
      this.filters.currentReportContext.set(JSON.stringify(result));
    }

    this.loading.set(false);
  }
}
