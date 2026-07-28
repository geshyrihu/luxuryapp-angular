import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Property } from "src/app/core/interfaces/property.interface";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import Swal from "sweetalert2";
import { OwnerForm } from "../owner/owner-form";
import { PropiedadesForm } from "./propiedades-form";

@Component({
  selector: "app-propiedades-list",
  templateUrl: "./propiedades-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    TableModule,
    LxTooltipDirective,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
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
    MobileListItem,
    AppIcon,
  ],
})
export class PropiedadesList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  dataSignal = signal<Property[]>([]);
  public AspRole = ApplicationRole;
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
    const urlApi = Endpoints.Properties.listByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result || []);
    });
  }

  formatAccountNumber(accountNumber: string): string {
    const digits = (accountNumber || "").replace(/\D/g, "");
    if (!digits) return "";

    return digits.match(/.{1,3}/g)?.join("-") ?? digits;
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

  showOccupantsDialog(property: Property) {
    this.dialogHandlerS
      .openDialog(
        OwnerForm,
        {
          id: "",
          propertyId: property.id,
          propertyName: property.fullName,
          title: `Agregar ocupante a ${property.fullName}`,
        },
        `Agregar ocupante a ${property.fullName}`,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  downloadTemplate() {
    this.apiResponseS.onDownloadFile(
      Endpoints.Properties.downloadTemplate(this.customerIdS.customerId()),
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
        const url = Endpoints.Properties.importByCustomer(
          this.customerIdS.customerId(),
        );
        this.apiResponseS.onPostFile(url, formData).then((result) => {
          if (result) {
            this.onLoadData();
          }
        });
      }
    });
  }
}
