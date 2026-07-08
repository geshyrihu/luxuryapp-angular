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
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CustomInputDatepicker } from "@ui/inputs/web/custom-input-datepicker-signal";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { LazyLoadEvent } from "primeng/api";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
// import { Subscription } from "rxjs"; // Removed
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PaginationService } from "src/app/core/services/pagination.service";
import { ExcelExportService } from "src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/services/excel-export.service";
import { ProductOutputForm } from "./product-output-form";
import { ProductReturn } from "./product-return";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { TooltipModule } from "primeng/tooltip";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-product-output-list",
  templateUrl: "./product-output-list.html",
  imports: [
    WebButtonIcon,
    WebButtonIconDownload,
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconDelete,
    TooltipModule,
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
    CardModule,
    CustomInputDatepicker,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [PaginationService],
})
export class ProductOutputList implements OnInit, OnDestroy {
  // Inyección de Dependencias
  apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  public paginationService = inject(PaginationService);
  private excelExportS = inject(ExcelExportService);
  // Enums y referencias
  public AspRole = EApplicationRole;
  public ref: DynamicDialogRef;

  // Estado del componente
  // Estado del componente
  // dataSignal = signal<any[]>([]); // Replaced by toSignal below

  // Signals from PaginationService
  dataSignal = toSignal(this.paginationService.data$, { initialValue: [] });
  loading = toSignal(this.paginationService.loading$, { initialValue: true });
  totalRecords = toSignal(this.paginationService.totalRecords$, {
    initialValue: 0,
  });

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

    let url = `SalidaProductos/GetPagedList?customerId=${customerId}`;
    if (this.selectedDateControl.value) {
      const month = this.selectedDateControl.value.getMonth() + 1;
      const year = this.selectedDateControl.value.getFullYear();
      url += `&month=${month}&year=${year}`;
    }

    this.paginationService.initialize(url, this.tablePrimeNgRows);
    // this.subscribeToPaginationObservables(); // Removed
    this.paginationService.loadData();
  }

  // subscribeToPaginationObservables method removed

  loadDataLazy(event: LazyLoadEvent): void {
    this.paginationService.handleLazyLoad(event);
  }

  applyFilter(): void {
    this.paginationService.applyFilter(this.filterControl.value || "");
  }

  clearFilter(): void {
    this.selectedDateControl.setValue(null);
    this.filterControl.setValue("");
    this.initializePagination();
  }

  async onGenerateReport(): Promise<void> {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) return;

    let url = `SalidaProductos/GetPagedList?customerId=${customerId}&RecordsNumber=2147483647&Page=1`;
    let reportName = "Reporte de Salidas.xlsx";

    if (this.selectedDateControl.value) {
      const month = this.selectedDateControl.value.getMonth() + 1;
      const year = this.selectedDateControl.value.getFullYear();
      url += `&month=${month}&year=${year}`;

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
      .onDelete(`salidaproductos/${id}`)
      .then((result: boolean) => {
        if (result) this.paginationService.refreshData();
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
        if (result) this.paginationService.refreshData();
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
          this.paginationService.refreshData();
        }
      });
  }

  ngOnDestroy(): void {
    // this.subscriptions.unsubscribe(); // Removed
  }
}
