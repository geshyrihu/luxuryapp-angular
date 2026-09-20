import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from "@angular/core";
import { Router } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import {
  ISalaryProjection,
  salaryProjectionStateSeverity,
  salaryProjectionStateText,
} from "../interfaces/salary-projections.models";
import { SalaryProjectionsService } from "../salary-projections.service";
import { SalaryProjectionCreateDialog } from "./salary-projection-create-dialog";

const DETAIL_URL = "/hr/salary-projections";

@Component({
  selector: "app-salary-projections-list",
  templateUrl: "./salary-projections-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableEmptyMessage,
    LxTag,
    WebButtonLabel,
    WebButtonIcon,
    WebButtonIconConfirm,
    ApiDatePipe,
  ],
})
export class SalaryProjectionsList {
  private readonly service = inject(SalaryProjectionsService);
  private readonly customerIdService = inject(CustomerIdService);
  private readonly router = inject(Router);
  private readonly dialogHandler = inject(DialogHandlerService);

  readonly rows = signal<ISalaryProjection[]>([]);
  readonly loading = signal(true);
  readonly creating = signal(false);
  readonly deletingId = signal<string | null>(null);
  readonly globalFilterFields = signal(["folio", "name"]);

  readonly stateText = salaryProjectionStateText;
  readonly stateSeverity = salaryProjectionStateSeverity;

  constructor() {
    effect(() => {
      const customerId = this.customerIdService.customerId();
      if (customerId) {
        untracked(() => {
          void this.load();
        });
      }
    });
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.service.getList();
      if (data) {
        this.rows.set(data);
      }
    } finally {
      this.loading.set(false);
    }
  }

  openDetail(item: ISalaryProjection): void {
    void this.router.navigate([DETAIL_URL, item.id]);
  }

  async deleteProjection(item: ISalaryProjection): Promise<void> {
    if (this.deletingId()) {
      return;
    }

    this.deletingId.set(item.id);
    try {
      const deleted = await this.service.delete(item.id);
      if (deleted) {
        this.rows.update((currentRows) =>
          currentRows.filter((row) => row.id !== item.id),
        );
      }
    } finally {
      this.deletingId.set(null);
    }
  }

  async openCreateDialog(): Promise<void> {
    if (this.creating()) {
      return;
    }

    const result = await this.dialogHandler.openDialog<{ name: string }>(
      SalaryProjectionCreateDialog,
      {},
      "Nueva propuesta",
      this.dialogHandler.sizeSm,
    );

    if (!result?.name) {
      return;
    }

    this.creating.set(true);
    try {
      const created = await this.service.create({
        name: result.name,
        folio: "",
        scenarios: [
          {
            name: "Escenario Base",
            description: "Escenario base de la proyección",
            items: [],
          },
        ],
      });

      if (created) {
        await this.router.navigate([DETAIL_URL, created.id]);
      }
    } finally {
      this.creating.set(false);
    }
  }
}
