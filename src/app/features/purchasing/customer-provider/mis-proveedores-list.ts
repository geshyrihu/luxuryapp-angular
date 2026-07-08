import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { storefrontOutline } from "ionicons/icons";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CustomerProviderForm } from "./customer-provider-form";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-mis-proveedores",
  imports: [MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    AppAvatar,
    PrimeNgCustomCaption,
    ActionMenu,
    DataViewMobile,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonIcon, MobileListItem, AppIcon],

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
    const urlApi = `CustomerProvider/${this.customerIdS.customerId()}`;
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
      .onDelete(`customerprovider/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((prev) =>
            prev.filter((item) => item.id !== id),
          );
      });
  }
}
