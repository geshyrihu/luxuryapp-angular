import { Component, computed, effect, inject, signal } from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { addIcons } from "ionicons";
import { storefrontOutline } from "ionicons/icons";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { CustomerProviderForm } from "./customer-provider-form";

@Component({
  selector: "app-mis-proveedores",
  imports: [
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppAvatar,
    PrimeNgCustomCaption,
    ActionMenu,
    DataViewMobile,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    MobileListItem,
    AppIcon,
  ],
  templateUrl: "./mis-proveedores-list.html",
})
export class MisProveedores {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  // logica para el cambio de cliente
  customerId: string;

  constructor() {
    addIcons({ storefrontOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  // Función para cargar los datos de los CustomerProviders
  onLoadData() {
    const urlApi = Endpoints.CustomerProvider.listByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar información sobre un CustomerProvider
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        CustomerProviderForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.CustomerProvider.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((prev) =>
            prev.filter((item) => item.id !== id),
          );
      });
  }
}

