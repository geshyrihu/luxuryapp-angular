import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import {
  ISalaryProjection,
  salaryProjectionStateSeverity,
  salaryProjectionStateText,
} from "../interfaces/salary-projections.models";
import { SalaryProjectionsService } from "../salary-projections.service";

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
    CustomInputTextSignal,
    FormsModule,
    ApiDatePipe,
  ],
})
export class SalaryProjectionsList {
  private readonly service = inject(SalaryProjectionsService);
  private readonly customerIdService = inject(CustomerIdService);
  private readonly router = inject(Router);

  readonly rows = signal<ISalaryProjection[]>([]);
  readonly loading = signal(true);
  readonly creating = signal(false);
  readonly newName = signal("");
  readonly globalFilterFields = signal(["folio", "name"]);

  readonly stateText = salaryProjectionStateText;
  readonly stateSeverity = salaryProjectionStateSeverity;

  constructor() {
    effect(() => {
      const customerId = this.customerIdService.customerId();
      if (customerId) {
        void this.load();
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

  openPayrollParameters(): void {
    void this.router.navigate([DETAIL_URL, "payroll-parameters"]);
  }

  async createProjection(): Promise<void> {
    const name = this.newName().trim();
    if (!name || this.creating()) {
      return;
    }

    this.creating.set(true);
    try {
      const created = await this.service.create({
        name,
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
        this.newName.set("");
        await this.router.navigate([DETAIL_URL, created.id]);
      }
    } finally {
      this.creating.set(false);
    }
  }
}
