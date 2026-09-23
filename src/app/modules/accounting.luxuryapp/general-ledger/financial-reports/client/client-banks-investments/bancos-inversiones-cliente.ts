import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { AppTable } from "@ui/web/table/table";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AccountingNumberPipe } from "@shared/pipes/accounting-number.pipe";
import { IBancosInversionesDto } from "../../interfaces/aspel-budget.interface";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";

@Component({
  selector: "app-bancos-inversiones-cliente",
  imports: [CommonModule, LxSkeleton, AppTable, AppIcon, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./bancos-inversiones-cliente.html",
})
export class BancosInversionesClienteComponent {
  private apiS = inject(ApiResponseService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  data = signal<IBancosInversionesDto | null>(null);
  loading = signal<boolean>(false);

  constructor() {
    effect(
      () => {
        const cid = this.customerId();
        const yr = this.year();
        const m = this.mes();

        if (cid && yr && m) {
          this.loadData(cid, yr, m);
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
    }

    this.loading.set(false);
  }
}

