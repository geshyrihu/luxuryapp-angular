import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ProviderSupportList } from "@core/interfaces/provider-support-list.interface";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { addIcons } from "ionicons";
import { personOutline } from "ionicons/icons";
import { ProviderSupportDesktop } from "./desktop/provider-support-desktop";
import { ProviderSupportMobile } from "./mobile/provider-support-mobile";
import { ProviderSupportForm } from "./provider-support-form";

@Component({
  selector: "app-provider-support",
  templateUrl: "./provider-support.html",
  imports: [ProviderSupportDesktop, ProviderSupportMobile],
})
export class ProviderSupport implements OnInit {
  platformS = inject(PlatformService);
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  // Declaración e inicialización de variables
  dataSignal = signal<ProviderSupportList[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  constructor() {
    addIcons({ personOutline });
  }

  ngOnInit(): void {
    // Cuando se inicia el componente, cargar los datos de los bancos
    this.onLoadData();
  }
  // Función para cargar los datos
  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.ProviderSupport.getAll)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  //Modal Agregar o editar
  // Función para abrir un cuadro de diálogo modal para agregar o editar información sobre un CustomerProvider
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProviderSupportForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  // Función para eliminar
  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.ProviderSupport.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }
}
