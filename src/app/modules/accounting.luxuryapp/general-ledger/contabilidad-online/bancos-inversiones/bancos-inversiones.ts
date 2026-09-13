import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { SkeletonModule } from "@ui/web/primeng-skeleton/primeng-skeleton";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IBancosInversionesDto } from "../interfaces/aspel-budget.interface";
import { reportFilterState } from "../state/financial-report-filter.state";

import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-bancos-inversiones",

  imports: [LxSkeleton, AppIcon, CommonModule, SkeletonModule, TableModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./bancos-inversiones.html",
})
export class BancosInversionesComponent {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private filters = reportFilterState;

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

    const url =
      Endpoints.ContabilidadOnline.FinancialStatements.bancosInversiones(
        customerId,
        year,
        mes,
      );

    const result = await this.apiS.onGetItem<IBancosInversionesDto>(url);
    if (result) {
      this.data.set(result);
      this.filters.currentReportName.set("Bancos e Inversiones");
      this.filters.currentReportContext.set(JSON.stringify(result));
    }

    this.loading.set(false);
  }
}
