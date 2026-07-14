import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { addIcons } from "ionicons";
import { addOutline, createOutline, trashOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { AsuntoLegalForm } from "src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/asunto-legal/asunto-legal-form";
import { CategoriaAsuntoLegalForm } from "src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/asunto-legal/categoria-asunto-legal-form";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-asunto-legal-lista",
  templateUrl: "./asunto-legal-lista.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    NgbTooltipModule,
    WebButtonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    ActionMenu,
    PrimeNgCustomCaption,
    DataViewMobile,
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
