import { Component, computed, effect, inject, signal } from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { addIcons } from "ionicons";
import { storefrontOutline } from "ionicons/icons";
import { CustomerProviderForm } from "./customer-provider-form";
import { MisProveedoresDesktop } from "./desktop/mis-proveedores-list-desktop";
import { MisProveedoresMobile } from "./mobile/mis-proveedores-list-mobile";

@Component({
  selector: "app-mis-proveedores",
  imports: [MisProveedoresDesktop, MisProveedoresMobile],
  templateUrl: "./mis-proveedores-list.html",
})
export class MisProveedores {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
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
        this.dialogHandlerS.sizeXl,
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
