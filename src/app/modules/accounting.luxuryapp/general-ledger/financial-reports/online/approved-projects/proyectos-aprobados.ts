import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AccountingNumberPipe } from "@shared/pipes/accounting-number.pipe";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { IProyectosAprobadosDTO } from "../../interfaces/aspel-budget.interface";
import { FinancialReportFilterStore } from "../state/financial-report-filter.store.service";

@Component({
  selector: "app-proyectos-aprobados",

  imports: [LxSkeleton, LxIcon, CommonModule, AppTable, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./proyectos-aprobados.html",
})
export class ProyectosAprobadosComponent {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filters = inject(FinancialReportFilterStore);

  data = signal<IProyectosAprobadosDTO | null>(null);
  loading = signal<boolean>(false);

  public mesesNombres = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  constructor() {
    effect(
      () => {
        const customerId = this.customerIdS.customerId();
        const year = this.filters.year();
        this.filters.refreshTick();

        if (customerId && year) {
          this.loadData(customerId, year);
        }
      },
      { allowSignalWrites: true },
    );
  }

  private async loadData(customerId: string, year: number) {
    this.loading.set(true);
    this.data.set(null);

    const result = await this.apiS.onGetItem<IProyectosAprobadosDTO>(
      Endpoints.ContabilidadOnline.FinancialStatements.proyectosAprobados(
        customerId,
        year,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filters.currentReportName.set("Proyectos Aprobados");
      this.filters.currentReportContext.set(JSON.stringify(result));
    }

    this.loading.set(false);
  }
}
