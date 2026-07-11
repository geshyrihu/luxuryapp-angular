import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ExcelExportService } from "src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-propuesta/services/excel-export.service";
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
import { Owner } from "src/app/core/interfaces/list-condomino.interface";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OwnerForm } from "./owner-form";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-owner-list",
  templateUrl: "./owner-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonLabel,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
  ],
})
export class OwnerList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  excelExportS = inject(ExcelExportService);

  dataSignal = signal<Owner[]>([]);
  public AspRole = ApplicationRole;
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;

  // Helpers
  rowsPerPageOptions = rowsPerPageOptions();
  tablePrimeNgRows = tablePrimeNgRows();

  constructor() {
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

      // Si ambos son numíricos, los comparamos como enteros
      if (!isNaN(parseInt(xPart, 10)) && !isNaN(parseInt(yPart, 10))) {
        comparisonResult = parseInt(xPart, 10) - parseInt(yPart, 10);
      } else {
        // Si no son numíricos, comparamos como cadenas
        comparisonResult = xPart.localeCompare(yPart);
      }

      if (comparisonResult !== 0) {
        return comparisonResult;
      }
    }

    // Si todos los elementos hasta ahora son iguales, el mís corto es menor
    return xMatches.length - yMatches.length;
  }
}
