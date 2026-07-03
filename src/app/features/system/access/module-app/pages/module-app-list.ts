import { Component, computed, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { phonePortraitOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { IModuleAppDTO } from "../models/module-app.dto";
import { ModuleAppForm } from "./module-app-form";
@Component({
  selector: "app-module-app-list",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    TagModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    RouterModule,
    IonItem,
    IonLabel,
  ],
  templateUrl: "./module-app-list.html",
})
export class ModuleAppList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  constructor() {
    addIcons({ phonePortraitOutline });
  }

  // Declaración e inicialización de variables
  dataSignal = signal<IModuleAppDTO[]>([]);

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<IModuleAppDTO[]>(Endpoints.ModuleApps.getAll)
      .then((result) => {
        // Ordenar datos para agrupar por pathParent
        const sortedData = (result || []).sort((a, b) => {
          const pathParentA = a.pathParent || "";
          const pathParentB = b.pathParent || "";

          if (pathParentA < pathParentB) return -1;
          if (pathParentA > pathParentB) return 1;

          // If pathParent is the same, sort by nameModule
          if (a.nameModule < b.nameModule) return -1;
          if (a.nameModule > b.nameModule) return 1;

          return 0;
        });

        this.dataSignal.set(sortedData);
      });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: string) {
    this.apiResponseS.onDelete(Endpoints.ModuleApps.delete(id)).then((_) => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.update((data) => data.filter((item) => item.id !== id));
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(ModuleAppForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
