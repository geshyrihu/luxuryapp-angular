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
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { SwalService } from "@core/services/swal.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";


import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import {
  ISalaryProjection,
  salaryProjectionStateSeverity,
  salaryProjectionStateText,
} from "../interfaces/salary-projections.models";
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
    ButtonWeb,
    ApiDatePipe],
})
export class SalaryProjectionsList {
  private readonly api = inject(ApiResponseService);
  private readonly customerIdService = inject(CustomerIdService);
  private readonly router = inject(Router);
  private readonly dialogHandler = inject(DialogHandlerService);
  private readonly swalS = inject(SwalService);

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
      const data = await this.api.onGetList<ISalaryProjection[]>(
        Endpoints.SalaryProjections.base,
      );
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

    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: "¿Estás seguro de que quieres eliminar esta propuesta?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;

    this.deletingId.set(item.id);
    try {
      const deleted = await this.api.onDelete(
        Endpoints.SalaryProjections.byId(item.id),
      );
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
      this.dialogHandler.sizeMd,
    );

    if (!result?.name) {
      return;
    }

    this.creating.set(true);
    try {
      const created = await this.api.onPost<ISalaryProjection>(
        Endpoints.SalaryProjections.base,
        {
          name: result.name,
          folio: "",
          scenarios: [
            {
              name: "Escenario Base",
              description: "Escenario base de la proyeccin",
              items: [],
            }],
        },
      );

      if (created) {
        await this.router.navigate([DETAIL_URL, created.id]);
      }
    } finally {
      this.creating.set(false);
    }
  }
}
