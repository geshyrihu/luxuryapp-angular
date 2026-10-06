import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { TaskGroupCategoryListDesktop } from "./desktop/task-group-category-list-desktop";
import { TaskGroupCategoryListMobile } from "./mobile/task-group-category-list-mobile";
import { TaskGroupCategoryForm } from "./task-group-category-form";

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-task-group-category-list",
  templateUrl: "./task-group-category-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskGroupCategoryListDesktop, TaskGroupCategoryListMobile],
})
export class TaskGroupCategoryList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);
  loading = signal(true);
  ref: DynamicDialogRef;
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.TaskGroupCategories.getAll)
      .then((result: any) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.TaskGroupCategories.delete(id))
      .then((wasDeleted: boolean) => {
        if (wasDeleted) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        TaskGroupCategoryForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
