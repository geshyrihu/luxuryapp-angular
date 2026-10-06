import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ProductosListDesktop } from "./desktop/productos-list-desktop";
import { ProductosListMobile } from "./mobile/productos-list-mobile";
import { ProductosForm } from "./productos-form";

@Component({
  selector: "app-productos-list",
  templateUrl: "./productos-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProductosListDesktop, ProductosListMobile],
})
export class ProductosList implements OnInit {
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  // Signals
  dataSignal = signal<any[]>([]);
  filteredDataSignal = signal<any[]>([]);
  public AspRole = ApplicationRole;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  private readonly MOBILE_PAGE_SIZE = 20;
  mobilePage = signal(1);
  mobileDataSignal = signal<any[]>([]);
  mobileTotalRecords = signal(0);

  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  account_id: string = this.authS.userToken.infoUserAuthDTO.applicationUserId;

  ngOnInit(): void {
    this.onLoadData();
    this.onLoadMobile();
  }

  onLoadData() {
    return this.apiResponseS
      .onGetList(Endpoints.Products.getAll)
      .then((result: any) => {
        if (result) {
          this.dataSignal.set(result);
          this.filteredDataSignal.set(result);
        }
      });
  }

  onLoadMobile() {
    this.mobilePage.set(1);
    const params = {
      page: 1,
      recordsNumber: this.MOBILE_PAGE_SIZE,
      sortField: "",
      sortOrder: 1,
      filter: "",
    };
    return this.apiResponseS
      .onGetListNotLoading<any>(Endpoints.Products.getAllPaged, params)
      .then((result: any) => {
        if (result) {
          this.mobileDataSignal.set(result.items ?? []);
          this.mobileTotalRecords.set(result.totalRecords ?? 0);
        }
      });
  }

  // ... Eliminar registro
  async onDelete(id: any) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este producto?",
    );
    if (!ok) return;
    return this.apiResponseS
      .onDelete(Endpoints.Products.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
          this.filteredDataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
          this.mobileDataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
          this.mobileTotalRecords.update((n) => n - 1);
        }
      });
  }

  loadNextPage(event: any) {
    const nextPage = this.mobilePage() + 1;
    const params = {
      page: nextPage,
      recordsNumber: this.MOBILE_PAGE_SIZE,
      sortField: "",
      sortOrder: 1,
      filter: "",
    };
    this.apiResponseS
      .onGetListNotLoading<any>(Endpoints.Products.getAllPaged, params)
      .then((result: any) => {
        if (result?.items?.length) {
          this.mobilePage.set(nextPage);
          this.mobileDataSignal.update((items) => [...items, ...result.items]);
        }
        event.target.complete();
        const noMore = !result || !result.items?.length;
        const allLoaded =
          this.mobileDataSignal().length >= this.mobileTotalRecords();
        if (noMore || allLoaded) event.target.disabled = true;
      });
  }

  // ... Llamada al Modal agregar o editar
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(ProductosForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
          this.onLoadMobile();
        }
      });
  }
}
