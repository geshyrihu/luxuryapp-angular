import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { ExcelExportService } from "@accounting.luxuryapp/general-ledger/budget-proposals/excel-export.service";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { tableRows } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PaginationStore } from "@core/services/pagination-store";
import { PlatformService } from "@core/services/platform.service";
import { ProductOutputListDesktop } from "./desktop/product-output-list-desktop";
import { ProductOutputListMobile } from "./mobile/product-output-list-mobile";
import { ProductOutputForm } from "./product-output-form";
import { ProductReturn } from "./product-return";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-product-output-list",
  templateUrl: "./product-output-list.html",
  imports: [ProductOutputListDesktop, ProductOutputListMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [PaginationStore],
})
export class ProductOutputList implements OnInit, OnDestroy {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  platformS = inject(PlatformService);
  private store = inject<PaginationStore<any>>(PaginationStore);
  private excelExportS = inject(ExcelExportService);
  public AspRole = ApplicationRole;
  public ref: DynamicDialogRef;

  protected readonly dataSignal = this.store.data;
  protected readonly loading = this.store.loading;
  protected readonly totalRecords = this.store.totalRecords;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    return data.length > 0 ? Object.keys(data[0]) : [];
  });

  selectedDateControl = new FormControl<Date | null>(null);
  filterControl = new FormControl<string>("");

  tableRows: number = tableRows();

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

    this.store.configure(url, { recordsNumber: this.tableRows });
    this.store.load();
  }

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

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) {
          this.store.refresh();
        }
      });
  }

  ngOnDestroy(): void {}
}
