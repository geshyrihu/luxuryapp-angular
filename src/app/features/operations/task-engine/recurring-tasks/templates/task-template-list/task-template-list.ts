import { Component, OnInit, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { TableModule } from "primeng/table";
import {
  WebButtonLabelActiveDesactive,
  WebButtonLabelDelete,
  WebButtonLabelItem,
} from "src/app/core/components/buttons/web-label";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { TaskTemplate } from "src/app/core/models/recurring-tasks/task-template.model";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskTemplateForm } from "../task-template-form/task-template-form";
@Component({
  selector: "app-task-template-list",
  templateUrl: "./task-template-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    ActionMenu,
    WebButtonLabelActiveDesactive,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    WebButtonLabelDelete,
    DataViewMobile,
    PrimeNgCustomCaption,
    TableModule,

    WebButtonLabelItem,
    WebButtonLabelActiveDesactive,
    WebButtonLabelDelete,
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
