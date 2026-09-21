import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import { IFederalVacationParameter } from "../interfaces/salary-projections.models";
import { FederalVacationParameterForm } from "./federal-vacation-parameter-form";

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
    RouterLink,
  ],
})
export class FederalVacationParameters {
  private readonly api = inject(ApiResponseService);
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
      const rows = await this.api.onGetList<IFederalVacationParameter[]>(Endpoints.SalaryProjections.federalVacationParameters);
      if (rows) this.rows.set(rows);
    } finally {
      this.loading.set(false);
    }
  }

  openForm(row?: IFederalVacationParameter): void {
    void this.dialogHandler
      .openDialog<{ saved: boolean }>(
        FederalVacationParameterForm,
        { row },
        row ? "Editar parámetros de vacaciones" : "Nuevos parámetros de vacaciones",
        this.dialogHandler.sizeSm,
      )
      .then((saved) => {
        if (saved) void this.load();
      });
  }

  async deleteParameter(row: IFederalVacationParameter): Promise<void> {
    const key = this.key(row.yearsOfService, row.year);
    if (this.deletingKey()) return;

    this.deletingKey.set(key);
    try {
      if (await this.api.onDelete(Endpoints.SalaryProjections.federalVacationDelete(row.yearsOfService, row.year))) {
        this.rows.update((rows) => rows.filter((item) => this.key(item.yearsOfService, item.year) !== key));
      }
    } finally {
      this.deletingKey.set(null);
    }
  }

  private key(yearsOfService: number, year: number) {
    return `${yearsOfService}-${year}`;
  }
}
