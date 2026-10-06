import { DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { SwalService } from "@core/services/swal.service";
import { ButtonWeb } from "@ui/buttons/web";


import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { IStateTaxParameter } from "../interfaces/salary-projections.models";
import { StateTaxParameterForm } from "./state-tax-parameter-form";

const DASHBOARD_URL = "/hr/salary-projections";

@Component({
  selector: "app-state-tax-parameters",
  templateUrl: "./state-tax-parameters.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppTable,
    AppSortableColumn,
    TableEmptyMessage,
    ButtonWeb,
    DecimalPipe],
})
export class StateTaxParameters {
  private readonly api = inject(ApiResponseService);
  private readonly router = inject(Router);
  private readonly dialogHandler = inject(DialogHandlerService);
  private readonly swalS = inject(SwalService);

  readonly rows = signal<IStateTaxParameter[]>([]);
  readonly loading = signal(true);
  readonly deletingKey = signal<string | null>(null);

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const rows = await this.api.onGetList<IStateTaxParameter[]>(
        Endpoints.SalaryProjections.stateTaxParameters,
      );
      if (rows) this.rows.set(rows);
    } finally {
      this.loading.set(false);
    }
  }

  back(): void {
    void this.router.navigateByUrl(DASHBOARD_URL);
  }

  openModal(row?: IStateTaxParameter): void {
    void this.dialogHandler
      .openDialog(
        StateTaxParameterForm,
        { row },
        row ? "Editar ISN patronal" : "Nuevo parámetro de ISN",
        this.dialogHandler.sizeSm,
      )
      .then((saved) => {
        if (saved) void this.load();
      });
  }

  async delete(row: IStateTaxParameter): Promise<void> {
    const key = this.key(row.state, row.year);
    if (this.deletingKey()) return;
    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: "¿Estás seguro de que quieres eliminar este parámetro?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
    this.deletingKey.set(key);
    try {
      if (
        await this.api.onDelete(
          Endpoints.SalaryProjections.stateTaxDelete(row.state, row.year),
        )
      ) {
        this.rows.update((rows) =>
          rows.filter((item) => this.key(item.state, item.year) !== key),
        );
      }
    } finally {
      this.deletingKey.set(null);
    }
  }

  private key(state: number, year: number): string {
    return `${state}-${year}`;
  }
}
