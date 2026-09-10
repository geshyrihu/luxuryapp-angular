import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { SkeletonModule } from "@ui/web/primeng-skeleton/primeng-skeleton";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { IProyectosAprobadosDTO } from "../interfaces/aspel-budget.interface";
import { reportFilterState } from "../state/financial-report-filter.state";

@Component({
  selector: "app-proyectos-aprobados",

  imports: [LxSkeleton, AppIcon, CommonModule, SkeletonModule, TableModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./proyectos-aprobados.html",
})
export class ProyectosAprobadosComponent {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filters = reportFilterState;

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

    const url =
      Endpoints.ContabilidadOnline.FinancialStatements.proyectosAprobados(
        customerId,
        year,
      );

    const result = await this.apiS.onGetItem<IProyectosAprobadosDTO>(url);
    if (result) {
      this.data.set(result);
      this.filters.currentReportName.set("Proyectos Aprobados");
      this.filters.currentReportContext.set(JSON.stringify(result));
    }

    this.loading.set(false);
  }
}
