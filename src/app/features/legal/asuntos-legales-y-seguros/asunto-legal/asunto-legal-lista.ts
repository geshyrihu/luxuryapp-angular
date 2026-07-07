import { Component, computed, inject, signal, ChangeDetectionStrategy } from "@angular/core";
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
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AsuntoLegalForm } from "src/app/features/legal/asuntos-legales-y-seguros/asunto-legal/asunto-legal-form";
import { CategoriaAsuntoLegalForm } from "src/app/features/legal/asuntos-legales-y-seguros/asunto-legal/categoria-asunto-legal-form";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

@Component({
  selector: "app-asunto-legal-lista",
  templateUrl: "./asunto-legal-lista.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CardModule,
    TableModule,
    NgbTooltipModule,
    WebButtonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    ActionMenu,
    PrimeNgCustomCaption,
    DataViewMobile,
    IonItemGroup,
    IonItemDivider,
    IonItem,
    IonLabel,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
  ],
})
export class AsuntoLegalLista {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  // Declaración e inicialización de variables
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

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
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
    this.apiResponseS
      .onDelete(Endpoints.LegalMatters.deleteCategory(id))
      .then(() => {
        this.onLoadData();
      });
  }
}
