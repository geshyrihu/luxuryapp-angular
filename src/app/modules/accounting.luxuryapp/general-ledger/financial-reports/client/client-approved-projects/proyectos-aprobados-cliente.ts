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
import { IProyectosAprobadosDTO } from "../../interfaces/aspel-budget.interface";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AccountingNumberPipe } from "@shared/pipes/accounting-number.pipe";

@Component({
  selector: "app-proyectos-aprobados-cliente",
  imports: [CommonModule, LxSkeleton, AppTable, AppIcon, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./proyectos-aprobados-cliente.html",
})
export class ProyectosAprobadosClienteComponent {
  private apiS = inject(ApiResponseService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

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
        const cid = this.customerId();
        const yr = this.year();

        if (cid && yr) {
          this.loadData(cid, yr);
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
    }

    this.loading.set(false);
  }
}

