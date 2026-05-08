import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import {
  IonButtonDelete,
  IonButtonEdit,
} from "src/app/core/components/buttons/mobile";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
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
@Component({
  selector: "app-propiedades-list",
  templateUrl: "./propiedades-list.html",
  imports: [
    CommonModule,
    TableModule,
    CustomButtonEdit,
    CustomButtonDelete,
    DataViewMobile,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButton,
    IonItem,
    IonLabel,
    IonButtonDelete,
    IonButtonEdit,
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
    this.apiResponseS.onDelete(`Property/${id}`).then((result: boolean) => {
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
