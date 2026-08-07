import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { InputDatepicker } from "@ui/inputs/adaptive/input-datepicker/input-datepicker";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
// import { Subscription } from "rxjs"; // Removed
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { ExcelExportService } from "src/app/apps/contabilidad.luxuryapp/general-ledger/presupuesto-propuesta/excel-export.service";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PaginationStore } from "src/app/core/services/pagination-store";
import { ProductOutputForm } from "./product-output-form";
import { ProductReturn } from "./product-return";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-product-output-list",
  templateUrl: "./product-output-list.html",
  imports: [
    WebButtonIcon,
    WebButtonIconDownload,
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconDelete,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    PrimeNgCustomTableFooter,
    CustomInputTextSignal,
    DataViewMobile,

    ReactiveFormsModule,
    InputDatepicker,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [PaginationStore],
})
export class ProductOutputList implements OnInit, OnDestroy {
  // Inyección de Dependencias
  apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  private store = inject<PaginationStore<any>>(PaginationStore);
  private excelExportS = inject(ExcelExportService);
  // Enums y referencias
  public AspRole = ApplicationRole;
  public ref: DynamicDialogRef;

  // Estado del componente
  // Estado del componente
  // dataSignal = signal<any[]>([]); // Replaced by toSignal below

  // Signals del PaginationStore (mecanismo canónico)
  protected readonly dataSignal = this.store.data;
  protected readonly loading = this.store.loading;
  protected readonly totalRecords = this.store.totalRecords;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    return data.length > 0 ? Object.keys(data[0]) : [];
  });

  // totalRecords: number = 0; // Replaced by signal
  selectedDateControl = new FormControl<Date | null>(null);
  filterControl = new FormControl<string>("");

  // Configuración de la tabla
  // loading = signal(true); // Replaced by toSignal
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  // private subscriptions = new Subscription(); // Removed

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.initializePagination();
    });
  }
  ngOnInit(): void {
    this.initializePagination();
  }

  onLoadData(): void {
    this.initializePagination();
  }

  initializePagination(): void {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) return;

    const month = this.selectedDateControl.value
      ? this.selectedDateControl.value.getMonth() + 1
      : undefined;
    const year = this.selectedDateControl.value
      ? this.selectedDateControl.value.getFullYear()
      : undefined;
    const url = Endpoints.ProductOutputs.getPaged(customerId, month, year);

    this.store.configure(url, { recordsNumber: this.tablePrimeNgRows });
    this.store.load();
  }

  // subscribeToPaginationObservables method removed

  loadDataLazy(event: any): void {
    this.store.onLazyLoad(event);
  }

  applyFilter(): void {
    this.store.setFilter(this.filterControl.value || "");
  }

  clearFilter(): void {
    this.selectedDateControl.setValue(null);
    this.filterControl.setValue("");
    this.initializePagination();
  }

  async onGenerateReport(): Promise<void> {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) return;

    const month = this.selectedDateControl.value
      ? this.selectedDateControl.value.getMonth() + 1
      : undefined;
    const year = this.selectedDateControl.value
      ? this.selectedDateControl.value.getFullYear()
      : undefined;
    const url = Endpoints.ProductOutputs.getPaged(
      customerId,
      month,
      year,
      2147483647,
      1,
    );
    let reportName = "Reporte de Salidas.xlsx";

    if (this.selectedDateControl.value) {
      const monthName = this.selectedDateControl.value.toLocaleString("es-MX", {
        month: "long",
      });
      reportName = `ReporteSalidas-${monthName.charAt(0).toUpperCase() + monthName.slice(1)}-${year}.xlsx`;
    }

    const response = await this.apiResponseS.onGetPaged<{
      items: any[];
      totalRecords: number;
    }>(url);
    if (!response?.data?.items?.length) return;

    await this.excelExportS.exportSalidaProductos(
      response.data.items,
      reportName,
    );
  }

  onDelete(id: any): void {
    this.apiResponseS
      .onDelete(Endpoints.ProductOutputs.delete(id))
      .then((result: boolean) => {
        if (result) this.store.refresh();
      });
  }

  onEditSalida(data: any): void {
    this.dialogHandlerS
      .openDialog(
        ProductOutputForm,
        {
          id: data.id,
          idProducto: data.idProducto,
          nombreProducto: data.nombreProducto,
          almacenId: data.almacenId,
          idInventarioProducto: data.idInventarioProducto,
        },
        "Salida de Productos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.store.refresh();
      });
  }

  onReturnProduct(item: any): void {
    this.dialogHandlerS
      .openDialog(
        ProductReturn,
        item,
        "Devolver Producto",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.store.refresh();
        }
      });
  }

  ngOnDestroy(): void {
    // this.subscriptions.unsubscribe(); // Removed
  }
}
