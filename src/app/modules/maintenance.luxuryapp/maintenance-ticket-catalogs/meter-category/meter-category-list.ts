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
import { Category } from "@core/interfaces/category.interface";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { MeterCategoryListDesktop } from "./desktop/meter-category-list-desktop";
import { MeterCategoryForm } from "./meter-category-form";
import { MeterCategoryListMobile } from "./mobile/meter-category-list-mobile";

@Component({
  selector: "app-meter-category-list",
  templateUrl: "./meter-category-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MeterCategoryListDesktop, MeterCategoryListMobile],
})
export class MeterCategoryList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  data = signal<Category[]>([]);
  loading = signal(true);
  ref: DynamicDialogRef;
  readonly globalFilterFields = computed(() => {
    const currentData = this.data();
    if (!currentData || currentData.length === 0) return [];
    return globalFilterFields(currentData);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList(Endpoints.MeterCategories.getAll)
      .then((result: any) => {
        this.data.set(result ?? []);
        this.loading.set(false);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.MeterCategories.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.data.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        MeterCategoryForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
