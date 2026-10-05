import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { RecurringTaskTemplateCatalog } from "@core/interfaces/recurring-tasks/recurring-task-template-catalog.interface";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { RecurringTaskCatalogListDesktop } from "./desktop/recurring-task-catalog-list-desktop";
import { RecurringTaskCatalogListMobile } from "./mobile/recurring-task-catalog-list-mobile";
import { RecurringTaskCatalogForm } from "../recurring-task-catalog-form/recurring-task-catalog-form";

@Component({
  selector: "app-recurring-task-catalog-list",
  templateUrl: "./recurring-task-catalog-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RecurringTaskCatalogListDesktop, RecurringTaskCatalogListMobile],
})
export class RecurringTaskCatalogList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  data = signal<RecurringTaskTemplateCatalog[]>([]);
  loading = signal(true);
  activeOnly = signal<boolean>(true);

  ngOnInit(): void {
    void this.onLoadData();
  }

  async onLoadData(activeOnly: boolean = this.activeOnly()): Promise<void> {
    this.loading.set(true);

    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      this.data.set([]);
      this.loading.set(false);
      return;
    }

    try {
      const response = await this.apiResponseS.onGetList<
        RecurringTaskTemplateCatalog[]
      >(Endpoints.RecurringTaskCatalog.list(customerId, undefined, activeOnly));

      this.data.set(response ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  async onToggleStatus(templateId: string): Promise<void> {
    const result = await this.apiResponseS.onPatch(
      Endpoints.RecurringTaskCatalog.toggleStatus(templateId),
      {},
    );

    if (result !== false) {
      await this.onLoadData();
    }
  }

  onChangeState(activeOnly: boolean): void {
    this.activeOnly.set(activeOnly);
    void this.onLoadData(activeOnly);
  }

  showForm(template?: RecurringTaskTemplateCatalog): void {
    this.dialogHandlerS
      .openDialog(
        RecurringTaskCatalogForm,
        { template },
        template ? "Editar Plantilla Recurrente" : "Nueva Plantilla Recurrente",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) void this.onLoadData();
      });
  }
}
