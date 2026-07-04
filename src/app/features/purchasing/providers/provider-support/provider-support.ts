import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { personOutline } from "ionicons/icons";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { IProviderSupportList } from "src/app/core/interfaces/provider-support-list.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ProviderSupportForm } from "./provider-support-form";
import { MobileActionMenu } from "src/app/core/components/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "src/app/core/components/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "src/app/core/components/buttons/mobile-label/button-delete";

import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";

@Component({
  selector: "app-provider-support",
  templateUrl: "./provider-support.html",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    AvatarModule,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    PrimeNgCustomCaption,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonItem,
    IonLabel,
  ],
})
export class ProviderSupport implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // Declaración e inicialización de variables
  dataSignal = signal<IProviderSupportList[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  scrollHeight = this.tableScrollHeightS.scrollHeight;

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
        this.dialogHandlerS.sizeLg,
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
