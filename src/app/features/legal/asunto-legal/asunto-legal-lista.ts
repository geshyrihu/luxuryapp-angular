import { Component, computed, inject, signal } from "@angular/core";
import {
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
} from "@ionic/angular/standalone";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { addIcons } from "ionicons";
import { addOutline, createOutline, trashOutline } from "ionicons/icons";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AsuntoLegalForm } from "src/app/features/legal/asunto-legal/asunto-legal-form";
import { CategoriaAsuntoLegalForm } from "src/app/features/legal/asunto-legal/categoria-asunto-legal-form";
import { IonButtonDelete, IonButtonEdit } from "src/app/core/components/buttons/mobile";
@Component({
  selector: "app-asunto-legal-lista",
  templateUrl: "./asunto-legal-lista.html",
  imports: [
    CardModule,
    TableModule,
    NgbTooltipModule,
    CustomButton,
    CustomButtonEdit,
    CustomButtonDelete,
    ActionMenu,
    PrimeNgCustomCaption,
    DataViewMobile,
    IonItemGroup,
    IonItemDivider,
    IonItem,
    IonLabel,
    IonButtonDelete,
    IonButtonEdit,
  ],
})
export class AsuntoLegalLista {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  ref: DynamicDialogRef; // Referencia a un cuadro de diÃƒÂ³logo modal
  // DeclaraciÃƒÂ³n e inicializaciÃƒÂ³n de variables
  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  constructor() {
    addIcons({
      addOutline,
      createOutline,
      trashOutline,
    });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.LegalMatters.getAll)
      .then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.dataSignal.set(result);
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.LegalMatters.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((current) =>
            current.filter((item) => item.id !== id),
          );
      });
  }

  // FunciÃƒÂ³n para abrir un cuadro de diÃƒÂ³logo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(AsuntoLegalForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalEditCategorie(data: any) {
    this.dialogHandlerS
      .openDialog(
        CategoriaAsuntoLegalForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onDeleteCategorie(id: string) {
    this.apiResponseS.onDelete(Endpoints.LegalMatters.deleteCategory(id)).then(() => {
      this.onLoadData();
    });
  }
}









