import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { personOutline } from "ionicons/icons";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { IProviderSupportList } from "src/app/core/interfaces/provider-support-list.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ProviderSupportForm } from "./provider-support-form";
@Component({
  selector: "app-provider-support",
  templateUrl: "./provider-support.html",
  imports: [
    EmptyState,
    CommonModule,
    TableModule,
    AvatarModule,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
  ],
})
export class ProviderSupport implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // DeclaraciÃ³n e inicializaciÃ³n de variables
  dataSignal = signal<IProviderSupportList[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef; // Referencia a un cuadro de diÃ¡logo modal
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ personOutline });
  }

  ngOnInit(): void {
    // Cuando se inicia el componente, cargar los datos de los bancos
    this.onLoadData();
  }
  // FunciÃ³n para cargar los datos
  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.ProviderSupport.getAll)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  //Modal Agregar o editar
  // FunciÃ³n para abrir un cuadro de diÃ¡logo modal para agregar o editar informaciÃ³n sobre un CustomerProvider
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
  // FunciÃ³n para eliminar
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
