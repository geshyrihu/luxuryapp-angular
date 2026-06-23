import { Component, computed, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CatalogoRevisionesInspeccionForm } from "./catalogo-revisiones-inspeccion-form";
@Component({
  selector: "app-catalogo-revisiones-inspeccion",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
    CustomButtonDelete,
    CustomButtonEdit,
  ],
  templateUrl: "./catalogo-revisiones-inspeccion.html",
})
export class CatalogoRevisionesInspeccion {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // Declaración e inicialización de variables
  dataSignal = signal<any>(null);

  /*
  /PRIME NG TABLE OPTIONS
  */
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  /*
  /PRIME NG TABLE OPTIONS
  */
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS.onGetList(Endpoints.InspectionReviewCatalog.getAll).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.dataSignal.set(result);
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: any) {
    this.apiResponseS.onDelete(Endpoints.InspectionReviewCatalog.delete(id)).then(() => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.set(this.dataSignal().filter((item) => item.id !== id));
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        CatalogoRevisionesInspeccionForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}









