import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { MobileButtonLabelActiveDesactive } from "@ui/buttons/mobile-label/button-active-desactive";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TaskTemplate } from "src/app/core/interfaces/recurring-tasks/task-template.model";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";
import { TaskTemplateForm } from "../task-template-form/task-template-form";

import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";

@Component({
  selector: "app-task-template-list",
  templateUrl: "./task-template-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconActiveDesactive,
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelActiveDesactive,
    MobileButtonLabelItem,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,

    DataViewMobile,
    PrimeNgCustomCaption,
    TableModule,
    MobileListItem,
    AppIcon,
  ],
})
export class TaskTemplateList implements OnInit {
  // private recurringTasksService = inject(RecurringTasksService); // REMOVED
  private apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  public dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  data = signal<TaskTemplate[]>([]); // Converted to signal
  loading = signal(true);
  state = signal<boolean>(true);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(state: boolean = this.state()) {
    this.loading.set(true);
    const urlApi = `recurring-tasks/templates/list/${state}`;
    this.apiResponseS
      .onGetList<TaskTemplate[]>(urlApi)
      .then((response) => {
        if (response) {
          // onGetList returns T | null, so if truthy, it's successful data
          this.data.set(response); // Update signal
        } else {
          this.data.set([]); // Set to empty array on error
        }
      })
      .catch((error) => {
        console.error("Request Error:", error);
        this.data.set([]); // Set to empty array on network error
      })
      .finally(() => this.loading.set(false));
  }

  onManageItems(templateId: string) {
    this.router.navigate(ROUTES.TAREAS_RECURRENTES.ITEMS(templateId));
  }

  onDelete(id: string) {
    // Implement confirmation dialog before deleting
    const urlApi = `recurring-tasks/templates/${id}`;
    this.apiResponseS
      .onDelete(urlApi)
      .then((result: boolean) => {
        // onDelete returns boolean
        if (result) {
          // if true, deletion was successful
          this.onLoadData();
          // Show success toast (handled by ApiResponseService)
        }
        // No else needed, error handling and toasts are done by ApiResponseService
      })
      .catch((error) => {
        console.error("Request Error:", error);
      });
  }

  onChangeState(status: boolean) {
    this.state.set(status);
    this.onLoadData(status);
  }

  showForm(template?: TaskTemplate) {
    this.dialogHandlerS
      .openDialog(
        TaskTemplateForm,
        { template },
        template ? "Editar Plantilla" : "Nueva Plantilla",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
