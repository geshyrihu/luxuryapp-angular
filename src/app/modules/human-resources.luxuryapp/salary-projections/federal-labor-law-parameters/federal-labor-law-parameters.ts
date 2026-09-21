import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Router } from "@angular/router";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import { IFederalLaborLawParameter } from "../interfaces/salary-projections.models";
import { ApiResponseService } from '@core/http/services/api-response.service';
import { Endpoints } from '@core/constants/endpoints/endpoints';
import { FederalLaborLawParameterForm } from "./federal-labor-law-parameter-form";

const DASHBOARD_URL = "/hr/salary-projections";

@Component({
  selector: "app-federal-labor-law-parameters",
  templateUrl: "./federal-labor-law-parameters.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppTable, AppSortableColumn, AppSorticon, TableEmptyMessage, WebButtonLabel, WebButtonIcon, WebButtonIconConfirm, DecimalPipe],
})
export class FederalLaborLawParameters {
  private readonly api = inject(ApiResponseService);
  private readonly router = inject(Router);
  private readonly dialogHandler = inject(DialogHandlerService);

  readonly rows = signal<IFederalLaborLawParameter[]>([]);
  readonly loading = signal(true);
  readonly deletingYear = signal<number | null>(null);

  constructor() { void this.load(); }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const rows = await this.api.onGetList<IFederalLaborLawParameter[]>(Endpoints.SalaryProjections.federalLaborLawParameters);
      if (rows) this.rows.set(rows);
    } finally { this.loading.set(false); }
  }

  back(): void { void this.router.navigateByUrl(DASHBOARD_URL); }

  openModal(row?: IFederalLaborLawParameter): void {
    void this.dialogHandler.openDialog(FederalLaborLawParameterForm, { row }, row ? "Editar parámetros LFT" : "Nuevo parámetro LFT", this.dialogHandler.sizeSm).then((saved) => { if (saved) void this.load(); });
  }

  async delete(row: IFederalLaborLawParameter): Promise<void> {
    if (this.deletingYear()) return;
    this.deletingYear.set(row.year);
    try {
      if (await this.api.onDelete(Endpoints.SalaryProjections.federalLaborLawParameter(row.year))) {
        this.rows.update((rows) => rows.filter((item) => item.year !== row.year));
      }
    } finally { this.deletingYear.set(null); }
  }

}

