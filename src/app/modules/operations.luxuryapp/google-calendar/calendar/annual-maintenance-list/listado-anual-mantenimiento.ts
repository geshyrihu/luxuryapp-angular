import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { CurrencyMexicoPipe } from "@shared/pipes/currencyMexico.pipe";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { MantenimientoPreventivoForm } from "../preventive-maintenance/mantenimiento-preventivo-form";
const date = new Date();

import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-listado-anual-mantenimiento",
  templateUrl: "./listado-anual-mantenimiento.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ButtonWeb,
    ButtonMobile,
    MobileActionMenu,
    TableEmptyMessage,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    CustomInputSelectSignal,
    LuxTableCaption,
    LxTooltipDirective,
    TableFooter,
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
  confirmS = inject(ConfirmService);
  dataSignal = signal<any[]>([]);

  public AspRole = ApplicationRole;

  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  monthControl = new FormControl<number>(new Date().getMonth() + 1);
  months = signal<SelectItemDto[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  groupedData = computed(() => {
    const data = this.dataSignal();
    return data.reduce((acc: any, item: any) => {
      const key = item.inventoryCategory || "Sin Categoróa";
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
    const url = Endpoints.MaintenanceCalendars.listAnnualByCustomerAndMonth(
      this.customerIdS.customerId(),
      this.monthControl.value,
    );
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
  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.MaintenanceCalendars.deleteLegacy(id))
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
        this.dialogHandlerS.sizeXl,
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
      .onGetEnumSelectItem(`month/${false}`)
      .then((result: any) => {
        const sorted = (result || []).sort((a, b) => a.value - b.value);
        this.months.set([{ label: "Todos", value: "" } as any, ...sorted]);
      });
  }
}
