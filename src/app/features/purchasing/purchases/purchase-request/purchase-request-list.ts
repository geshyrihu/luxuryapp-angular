import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cartOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PurchaseRequestForm } from "./purchase-request-form";
@Component({
  selector: "app-purchase-request-list",
  templateUrl: "./purchase-request-list.html",
  imports: [
    EmptyState,
    CommonModule,
    RouterModule,
    TableModule,
    CustomButton,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    ActionMenu,
    DataViewMobile,
    IonItem,
    IonLabel,
  ],
})
export class PurchaseRequestList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  data = signal<any[]>([]); // Â¡MEJORA! data tambiÃ©n es un signal
  public AspRole = EApplicationRole;

  globalFilterFields: string[] = [];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  ref: DynamicDialogRef;
  statusFilter = signal<number>(3);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ cartOutline });
    // --- MOTOR REACTIVO ÃšNICO ---
    // Este effect ahora se ejecuta si `customerId` O `statusFilter` cambian.
    effect(() => {
      // 1. Leemos AMBOS signals de los que dependemos.
      const customerId: string = this.customerIdS.customerId();
      const status = this.statusFilter(); // Leemos el signal del filtro

      // 2. CondiciÃ³n de seguridad.
      if (customerId) {
        // 3. Llamamos a la carga de datos con los valores actuales de los signals.
        this.onLoadData(customerId, status);
      }
    });
  }

  async onLoadData(customerId: string, status: number) {
    try {
      const result = await this.apiResponseS.onGetList<any[]>(
        Endpoints.PurchaseRequests.listByCustomerAndStatus(customerId, status),
      );
      this.data.set(result);
      this.globalFilterFields = globalFilterFields(result);
    } catch (error) {
      console.error("Error al cargar las solicitudes:", error);
      this.data.set([]);
    } finally {
    }
  }
  async onDelete(id: any) {
    // Â¡MEJORA! En lugar de filtrar localmente, recargamos desde el servidor
    // para asegurar que la vista es 100% consistente con la base de datos.
    await this.apiResponseS.onDelete(Endpoints.PurchaseRequests.delete(id));
    this.onLoadData(this.customerIdS.customerId(), this.statusFilter());
  }

  onSelectStatus(status: number) {
    // Â¡CAMBIO CLAVE! La Ãºnica responsabilidad de este mÃ©todo es actualizar el estado.
    // Ya no llama a onLoadData. El `effect` se encargarÃ¡ de eso automÃ¡ticamente.
    this.statusFilter.set(status);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PurchaseRequestForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          // Â¡MEJORA! Recargamos los datos usando los valores actuales de los signals.
          this.onLoadData(this.customerIdS.customerId(), this.statusFilter());
        }
      });
  }
}
