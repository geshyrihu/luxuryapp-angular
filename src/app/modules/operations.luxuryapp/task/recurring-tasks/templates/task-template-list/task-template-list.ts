import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TaskTemplate } from "@core/interfaces/recurring-tasks/task-template.interface";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ROUTES } from "src/app/routing/route-paths";
import { TaskTemplateForm } from "../task-template-form/task-template-form";
import { TaskTemplateListDesktop } from "./desktop/task-template-list-desktop";
import { TaskTemplateListMobile } from "./mobile/task-template-list-mobile";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-task-template-list",
  templateUrl: "./task-template-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TaskTemplateListDesktop, TaskTemplateListMobile],
})
export class TaskTemplateList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  private router = inject(Router);
  public dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  data = signal<TaskTemplate[]>([]);
  loading = signal(true);
  state = signal<boolean>(true);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(state: boolean = this.state()) {
    this.loading.set(true);
    const urlApi = Endpoints.RecurringTasks.Templates.getByState(state);
    this.apiResponseS
      .onGetList<TaskTemplate[]>(urlApi)
      .then((response) => {
        if (response) {
          this.data.set(response);
        } else {
          this.data.set([]);
        }
      })
      .catch((error) => {
        console.error("Request Error:", error);
        this.data.set([]);
      })
      .finally(() => this.loading.set(false));
  }

  onManageItems(templateId: string) {
    this.router.navigate(ROUTES.TAREAS_RECURRENTES.ITEMS(templateId));
  }

  async onDelete(id: string) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    const urlApi = Endpoints.RecurringTasks.Templates.delete(id);
    this.apiResponseS
      .onDelete(urlApi)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
