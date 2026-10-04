import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { Property } from "@core/interfaces/property.interface";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SwalService } from "@core/services/swal.service";
import { OwnerForm } from "../owner/owner-form";
import { PropiedadesListDesktop } from "./desktop/propiedades-list-desktop";
import { PropiedadesListMobile } from "./mobile/propiedades-list-mobile";
import { PropiedadesForm } from "./propiedades-form";

@Component({
  selector: "app-propiedades-list",
  templateUrl: "./propiedades-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PropiedadesListDesktop, PropiedadesListMobile],
})
export class PropiedadesList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  dataSignal = signal<Property[]>([]);
  public AspRole = ApplicationRole;
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;

  canManage = computed(() =>
    this.aspRoleS.hasAny([
      ApplicationRole.Asistente,
      ApplicationRole.Administrador,
      ApplicationRole.SuperUsuario,
    ]),
  );

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
      .openDialog(PropiedadesForm, data, data.title, this.dialogHandlerS.sizeXl)
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
        this.dialogHandlerS.sizeXl,
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
      SwalService.notify(
        "error",
        "Tipo de archivo no permitido",
        "Por favor, selecciona un archivo de Excel (.xlsx o .xls).",
      );
      return;
    }

    SwalService.show({
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
