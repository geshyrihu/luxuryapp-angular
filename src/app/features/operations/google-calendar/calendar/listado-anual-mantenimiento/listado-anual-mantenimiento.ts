import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
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

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-listado-anual-mantenimiento",
  templateUrl: "./listado-anual-mantenimiento.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    PrimeNgCustomCaption,

    CommonModule,
    TooltipModule,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    CurrencyMexicoPipe,
    SanitizeHtmlPipe,
    MobileListItem,
    AppIcon,
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
      const key = item.inventoryCategory || "Sin CategorÃ³a";
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
        this.months.set([{ label: "Todos", value: "" } as any, ...sorted]);
      });
  }
}
