import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ProductEntryListDesktop } from "./desktop/product-entry-list-desktop";
import { ProductEntryListMobile } from "./mobile/product-entry-list-mobile";
import { ProductEntryForm } from "./product-entry-form";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-list-entradas",
  templateUrl: "./product-entry-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProductEntryListDesktop, ProductEntryListMobile],
})
export class ProductEntryList {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  platformS = inject(PlatformService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;

  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = Endpoints.ProductEntries.listByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
      }
    });
  }
  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.ProductEntries.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
        }
      });
  }

  onAddEntrada(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProductEntryForm,
        {
          id: data.id,
          almacenId: data.almacenId,
          idProducto: data.idProducto,
          nombreProducto: data.nombreProducto,
        },
        "Entrada de Productos",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
