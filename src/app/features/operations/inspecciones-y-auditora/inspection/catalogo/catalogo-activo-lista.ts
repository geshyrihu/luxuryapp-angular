import { Component, computed, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
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
import { CatalogoActivoForm } from "./catalogo-activo-form";
@Component({
  selector: "app-catalogo-activo-lista",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
  ],
  templateUrl: "./catalogo-activo-lista.html",
})
export class CatalogoActivoLista {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // Declaracion e inicializacion de variables
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ref: DynamicDialogRef; // Referencia a un cuadro de dialogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.CatalogAssets.getAll)
      .then((result: any) => {
        // Actualizamos el valor del signal con los datos recibidos
        this.dataSignal.set(result);
      });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: any) {
    this.apiResponseS.onDelete(Endpoints.CatalogAssets.delete(id)).then(() => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.set(
        this.dataSignal().filter((item: any) => item.id !== id),
      );
    });
  }

  // Funcion para abrir un cuadro de dialogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        CatalogoActivoForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

export interface CatalogAsset {
  id: string;
  folio: string;
  name: string;
  assetCategory: EAssetCategory;
}
export enum EAssetCategory {
  Equipo,
  Amenidades,
  Mobiliario,
  AreasComunes,
  Gimnasio,
  Sistemas,
  "Almacenes, cuartos y bodegas",
}
export interface CatalogAssetAddOrEdit {
  folio: string;
  name: string;
  assetCategory: EAssetCategory;
}
