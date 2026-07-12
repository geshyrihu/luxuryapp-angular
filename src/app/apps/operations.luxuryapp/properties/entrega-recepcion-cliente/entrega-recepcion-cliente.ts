import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApplicationRole } from "src/app/core/interfaces/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EntregaRecepcionClienteForm } from "src/app/apps/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-cliente-form";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";

@Component({
  selector: "app-entrega-recepcion-cliente-lista",
  templateUrl: "./entrega-recepcion-cliente.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonLabelEdit,
    AppIcon,
    WebButtonIconViewPdf,
    PrimeNgCustomTableEmptyMessage,
    WebButtonLabelItem,
    WebButtonLabelDelete,
    TableModule,
    WebButtonLabel,
    ActionMenu,
    PrimeNgCustomCaption,
    DataViewMobile,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelItem,
  ],
})
export class EntregaRecepcionClienteLista {
  // --- INYECCIONES (sin cambios) ---
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  route = inject(Router);
  public aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;
  data = signal<any[]>([]);
  loading = signal(true);
  // ¡MEJORA! El departamento ahora es un signal.
  departamento = signal<string>("");

  // --- PROPIEDADES ESTóTICAS (sin cambios) ---
  globalFilterFields = computed(() => globalFilterFields(this.data()));
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  cb_departamento = [
    { value: "JURIDICO" },
    { value: "ADMINISTRACIÓN Y FINANZAS" },
    { value: "OPERACIONES Y MANTENIMIENTO" },
  ];
  ref: DynamicDialogRef;

  constructor() {
    // 1. Ejecutamos la configuración única para establecer el estado inicial del signal.
    this.onValidarCargo();

    // 2. Creamos el effect que reacciona a TODOS los cambios de estado relevantes.
    effect(() => {
      // Leemos las dependencias
      const customerId: string = this.customerIdS.customerId();
      const depto = this.departamento();

      // El effect se ejecutará si cambia el cliente O el departamento.
      if (customerId && depto) {
        this.onLoadData();
      }
    });
  }

  // ¡MEJORA! Este método ahora solo establece el estado inicial del signal.
  private onValidarCargo(): void {
    let initialDept = this.cb_departamento[0].value; // Valor por defecto
    if (this.aspRoleS.hasRole(ApplicationRole.Contador))
      initialDept = this.cb_departamento[1].value;
    if (this.aspRoleS.hasRole(ApplicationRole.Legal))
      initialDept = this.cb_departamento[0].value;
    if (this.aspRoleS.hasRole(ApplicationRole.JefeMantenimiento))
      initialDept = this.cb_departamento[2].value;
    this.departamento.set(initialDept);
  }

  // ¡MEJORA! Este método ahora es súper simple. Solo actualiza el signal.
  // El effect se encargará de llamar a onLoadData.
  onChangDepartamento(departamento: string): void {
    this.departamento.set(departamento);
  }

  private onLoadData(): void {
    // * Peticion para generar los items de entrega recepcion (sin cambios)
    this.apiResponseS.onGetItem(Endpoints.EntregaRecepcionCliente.generateData);

    // ¡CORRECCIÑN! Leemos los valores de los signals con ()
    const urlApi = Endpoints.EntregaRecepcionCliente.getByCustomerAndDepartment(
      this.customerIdS.customerId(),
      this.departamento(),
    );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => {
        this.data.set(result);
      })
      .finally(() => {});
  }

  // ... El resto de tus métodos (onModalForm, onValidarDocument, etc.) están bien.
  // Siguen llamando a onLoadData() para recargar la lista después de una acción, lo cual es correcto.
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        EntregaRecepcionClienteForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onValidarDocument(id: any) {
    this.apiResponseS
      .onPut(
        Endpoints.EntregaRecepcionCliente.validateFile(
          this.authS.applicationUserId,
          id,
        ),
        null,
      )
      .then(() => {
        this.onLoadData();
      });
  }
  onInvalidarDocument(id: any) {
    this.apiResponseS
      .onPut(Endpoints.EntregaRecepcionCliente.invalidateFile(id), null)
      .then(() => {
        this.onLoadData();
      });
  }

  onDeleteFile(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.EntregaRecepcionCliente.deleteFile(id))
      .then(() => {
        this.onLoadData();
      });
  }

  navigateToPdf(url: string) {
    window.open(url, "_blank");
  }
}
