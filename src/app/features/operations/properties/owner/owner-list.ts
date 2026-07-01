import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { homeOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IOwner } from "src/app/core/interfaces/list-condomino.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ExcelExportService } from "src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/services/excel-export.service";
import { OwnerForm } from "./owner-form";

@Component({
  selector: "app-owner-list",
  templateUrl: "./owner-list.html",
  imports: [
    EmptyState,
    TableModule,
    WebButtonLabel,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonItem,
    IonLabel,
  ],
})
export class OwnerList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  excelExportS = inject(ExcelExportService);

  dataSignal = signal<IOwner[]>([]);
  public AspRole = EApplicationRole;
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;

  // Helpers
  rowsPerPageOptions = rowsPerPageOptions();
  tablePrimeNgRows = tablePrimeNgRows();

  constructor() {
    addIcons({ homeOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `owner/list/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.Owner.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(OwnerForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onExportExcel() {
    this.excelExportS.exportOwnerList(
      this.dataSignal(),
      "Lista de Propietarios.xlsx",
    );
  }

  customSort(event: any) {
    event.data.sort((data1: any, data2: any) => {
      return this.customCompare(data1.property, data2.property);
    });
  }

  private customCompare(x: string, y: string): number {
    const regex = /(\D+)|(\d+)/g;
    const xMatches = x.match(regex);
    const yMatches = y.match(regex);

    const minMatches = Math.min(xMatches.length, yMatches.length);

    for (let i = 0; i < minMatches; i++) {
      const xPart = xMatches[i];
      const yPart = yMatches[i];

      let comparisonResult;

      // Si ambos son numéricos, los comparamos como enteros
      if (!isNaN(parseInt(xPart, 10)) && !isNaN(parseInt(yPart, 10))) {
        comparisonResult = parseInt(xPart, 10) - parseInt(yPart, 10);
      } else {
        // Si no son numéricos, comparamos como cadenas
        comparisonResult = xPart.localeCompare(yPart);
      }

      if (comparisonResult !== 0) {
        return comparisonResult;
      }
    }

    // Si todos los elementos hasta ahora son iguales, el mós corto es menor
    return xMatches.length - yMatches.length;
  }
}
