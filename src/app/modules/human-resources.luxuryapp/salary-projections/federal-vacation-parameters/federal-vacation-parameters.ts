import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import { IFederalVacationParameter } from "../interfaces/salary-projections.models";
import { SalaryProjectionsService } from "../salary-projections.service";
import { FederalVacationParameterForm } from "./federal-vacation-parameter-form";

const DASHBOARD_URL = "/hr/salary-projections";

@Component({
  selector: "app-federal-vacation-parameters",
  templateUrl: "./federal-vacation-parameters.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableEmptyMessage,
    WebButtonLabel,
    WebButtonIcon,
    WebButtonIconConfirm,
  ],
})
export class FederalVacationParameters {
  private readonly service = inject(SalaryProjectionsService);
  private readonly router = inject(Router);
  private readonly dialogHandler = inject(DialogHandlerService);

  readonly rows = signal<IFederalVacationParameter[]>([]);
  readonly loading = signal(true);
  readonly deletingKey = signal<string | null>(null);

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const rows = await this.service.getFederalVacationParameters();
      if (rows) this.rows.set(rows);
    } finally {
      this.loading.set(false);
    }
  }

  back(): void {
    void this.router.navigateByUrl(DASHBOARD_URL);
  }

  openModal(row?: IFederalVacationParameter): void {
    void this.dialogHandler.openDialog(
      FederalVacationParameterForm,
      { row },
      row ? "Editar vacaciones federales" : "Nuevo parámetro de vacaciones",
      this.dialogHandler.sizeSm,
    ).then((saved) => { if (saved) void this.load(); });
  }

  async delete(row: IFederalVacationParameter): Promise<void> {
    const key = this.key(row.yearsOfService, row.year);
    if (this.deletingKey()) return;
    this.deletingKey.set(key);
    try {
      if (await this.service.deleteFederalVacationParameter(row.yearsOfService, row.year)) {
        this.rows.update((rows) => rows.filter((item) => this.key(item.yearsOfService, item.year) !== key));
      }
    } finally {
      this.deletingKey.set(null);
    }
  }

  private key(yearsOfService: number, year: number): string {
    return `${yearsOfService}-${year}`;
  }
}
