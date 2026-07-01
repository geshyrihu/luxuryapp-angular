import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web/label";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { CurrencyMexicoPipe } from "src/app/core/pipes/currencyMexico.pipe";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { MantenimientoPreventivoForm } from "../mantenimiento-preventivo/mantenimiento-preventivo-form";
const date = new Date();
@Component({
  selector: "app-listado-anual-mantenimiento",
  templateUrl: "./listado-anual-mantenimiento.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    TableModule,
    SelectModule,
    PrimeNgCustomCaption,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    WebButtonLabelDelete,
    CommonModule,
    TooltipModule,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,

    CurrencyMexicoPipe,
    SanitizeHtmlPipe,

    WebButtonLabelItem,
  ],
})
export class ListadoAnualMantenimiento {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  dataSignal = signal<any[]>([]);

  public AspRole = EApplicationRole;

  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  monthControl = new FormControl<number>(new Date().getMonth() + 1);
  months = signal<ISelectItem[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  groupedData = computed(() => {
    const data = this.dataSignal();
    return data.reduce((acc: any, item: any) => {
      const key = item.inventoryCategory || "Sin Categor�a";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  });

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadEnumSelectItem();
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    const url = `MaintenanceCalendars/list/${this.customerIdS.customerId()}/${
      this.monthControl.value
    }`;
    this.apiResponseS.onGetList(url).then((result: any) => {
      this.dataSignal.set(result || []);
    });
  }
  calculateCustomerTotal(name: any) {
    let total = 0;
    const data = this.dataSignal();
    if (data) {
      for (let customer of data) {
        if (customer.inventoryCategory === name) {
          total++;
        }
      }
    }
    return total;
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`maintenancecalendars/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        MantenimientoPreventivoForm,
        {
          id: data.id,
          task: data.task,
          idMachinery: data.idMachinery,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  selectMonth() {
    this.onLoadData();
  }
  onLoadEnumSelectItem() {
    this.apiResponseS
      .onGetEnumSelectItem(`EMonth/${false}`)
      .then((result: any) => {
        const sorted = (result || []).sort((a, b) => a.value - b.value);
        this.months.set(sorted);
      });
  }
}
