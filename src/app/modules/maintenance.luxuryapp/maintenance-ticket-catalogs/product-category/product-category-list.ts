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
import { ProductCategoryListDesktop } from "./desktop/product-category-list-desktop";
import { ProductCategoryListMobile } from "./mobile/product-category-list-mobile";
import { ProductCategoryForm } from "./product-category-form";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-product-category-list",
  templateUrl: "./product-category-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCategoryListDesktop, ProductCategoryListMobile],
})
export class ProductCategoryList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  data = signal<Category[]>([]);
  readonly globalFilterFields = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.ProductCategories.getAll)
      .then((result: any) => {
        this.data.set(result);
      });
  }

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.ProductCategories.delete(id))
      .then((result: boolean) => {
        if (result)
          this.data.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProductCategoryForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
