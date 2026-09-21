import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Router } from "@angular/router";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import { IStateTaxParameter } from "../interfaces/salary-projections.models";
import { ApiResponseService } from '@core/http/services/api-response.service';
import { Endpoints } from '@core/constants/endpoints/endpoints';
import { StateTaxParameterForm } from "./state-tax-parameter-form";

const DASHBOARD_URL = "/hr/salary-projections";

@Component({
  selector: "app-state-tax-parameters",
  templateUrl: "./state-tax-parameters.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppTable, AppSortableColumn, AppSorticon, TableEmptyMessage, WebButtonLabel, WebButtonIcon, WebButtonIconConfirm, DecimalPipe],
})
export class StateTaxParameters {
  private readonly api = inject(ApiResponseService);
  private readonly router = inject(Router);
  private readonly dialogHandler = inject(DialogHandlerService);

  readonly rows = signal<IStateTaxParameter[]>([]);
  readonly loading = signal(true);
  readonly deletingKey = signal<string | null>(null);

  constructor() { void this.load(); }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const rows = await this.api.onGetList<IStateTaxParameter[]>(Endpoints.SalaryProjections.stateTaxParameters);
      if (rows) this.rows.set(rows);
    } finally { this.loading.set(false); }
  }

  back(): void { void this.router.navigateByUrl(DASHBOARD_URL); }

  openModal(row?: IStateTaxParameter): void {
    void this.dialogHandler.openDialog(StateTaxParameterForm, { row }, row ? "Editar ISN patronal" : "Nuevo parámetro de ISN", this.dialogHandler.sizeSm).then((saved) => { if (saved) void this.load(); });
  }

  async delete(row: IStateTaxParameter): Promise<void> {
    const key = this.key(row.state, row.year);
    if (this.deletingKey()) return;
    this.deletingKey.set(key);
    try {
      if (await this.api.onDelete(Endpoints.SalaryProjections.stateTaxDelete(row.state, row.year))) {
        this.rows.update((rows) => rows.filter((item) => this.key(item.state, item.year) !== key));
      }
    } finally { this.deletingKey.set(null); }
  }

  private key(state: number, year: number): string { return `${state}-${year}`; }
}

