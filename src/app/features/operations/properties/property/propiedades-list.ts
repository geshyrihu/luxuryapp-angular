import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IProperty } from "src/app/core/interfaces/property.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import Swal from "sweetalert2";
import { PropertyOccupantManager } from "./property-occupant-manager";
import { PropiedadesForm } from "./propiedades-form";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";

@Component({
  selector: "app-propiedades-list",
  templateUrl: "./propiedades-list.html",
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    IonItem,
    IonLabel,
    // Tabla web (acciones directas → solo icono)
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonIconItem,
    // Caption (CTA general, no es acción de fila)
    WebButtonLabel,
    // Vista móvil
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
  ],
})
export class PropiedadesList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  dataSignal = signal<IProperty[]>([]);
  public AspRole = EApplicationRole;
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `Property/list/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result || []);
    });
  }

  onDelete(id: any) {
    return this.apiResponseS
      .onDelete(Endpoints.Properties.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(PropiedadesForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  showOccupantsDialog(property: IProperty) {
    this.dialogHandlerS
      .openDialog(
        PropertyOccupantManager,
        {
          propertyId: property.id,
          propertyName: property.fullName,
        },
        `Ocupantes de ${property.fullName}`,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  downloadTemplate() {
    this.apiResponseS.onDownloadFile(
      `Property/download-template/${this.customerIdS.customerId()}`,
      "Propiedades_Plantilla.xlsx",
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // Reset the file input for the next upload
    event.target.value = null;

    const allowedExtensions = /(\.xlsx|\.xls)$/i;
    if (!allowedExtensions.exec(file.name)) {
      Swal.fire(
        "Tipo de archivo no permitido",
        "Por favor, selecciona un archivo de Excel (.xlsx o .xls).",
        "error",
      );
      return;
    }

    Swal.fire({
      title: "Confirmar Importación",
      text: "Asegórate de que el archivo utiliza el formato de la plantilla descargada. óDeseas continuar?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí, importar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("file", file, file.name);
        const url = `Property/import/${this.customerIdS.customerId()}`;
        this.apiResponseS.onPostFile(url, formData).then((result) => {
          if (result) {
            this.onLoadData();
          }
        });
      }
    });
  }
}
