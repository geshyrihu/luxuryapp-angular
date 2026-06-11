import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LazyLoadEvent } from "primeng/api";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { CardModule } from "primeng/card";
import { DatePickerModule } from "primeng/datepicker";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
// import { Subscription } from "rxjs"; // Removed
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonItem } from "src/app/core/components/buttons/mobile";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
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
import { ExcelExportService } from "src/app/features/tenant/contabilidad/presupuesto-propuesta/services/excel-export.service";
import { ProductOutputForm } from "./product-output-form";
import { ProductReturn } from "./product-return";
@Component({
  selector: "app-product-output-list",
  templateUrl: "./product-output-list.html",
  imports: [
    CommonModule,
    TableModule,
    PrimeNgCustomTableFooter,
    CustomInputTextSignal,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    ReactiveFormsModule,
    CardModule,
    CustomButtonDownload,
    CustomButton,


    DatePickerModule,

    IonButtonItem,
  ],
  providers: [PaginationService],
})
export class ProductOutputList implements OnInit, OnDestroy {
  // InyecciÃ³n de Dependencias
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

  // ConfiguraciÃ³n de la tabla
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

      const monthName = this.selectedDateControl.value.toLocaleString("es-MX", { month: "long" });
      reportName = `ReporteSalidas-${monthName.charAt(0).toUpperCase() + monthName.slice(1)}-${year}.xlsx`;
    }

    const response = await this.apiResponseS.onGetPaged<{ items: any[]; totalRecords: number }>(url);
    if (!response?.data?.items?.length) return;

    await this.excelExportS.exportSalidaProductos(response.data.items, reportName);
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










