import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { MobileButtonLabelActiveDesactive } from "@ui/buttons/mobile-label/button-active-desactive";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { RecurringTaskTemplateCatalog } from "src/app/core/interfaces/recurring-tasks/recurring-task-template-catalog.interface";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { RecurringTaskCatalogForm } from "../recurring-task-catalog-form/recurring-task-catalog-form";

@Component({
  selector: "app-recurring-task-catalog-list",
  templateUrl: "./recurring-task-catalog-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconActiveDesactive,
    WebButtonIconEdit,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelActiveDesactive,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    DataViewMobile,
    PrimeNgCustomCaption,
    TableModule,
    MobileListItem,
    AppIcon,
  ],
})
export class RecurringTaskCatalogList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  data = signal<RecurringTaskTemplateCatalog[]>([]);
  loading = signal(true);
  activeOnly = signal<boolean>(true);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

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
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) void this.onLoadData();
      });
  }

  isActive(template: RecurringTaskTemplateCatalog): boolean {
    const status = String(template.status).toLowerCase();
    return status === "active" || status === "activo" || status === "true";
  }
}
