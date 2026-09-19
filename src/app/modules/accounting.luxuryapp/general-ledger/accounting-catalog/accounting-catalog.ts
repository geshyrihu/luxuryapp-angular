import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AccountingCatalogDTO } from "./interfaces/accounting-catalog.model";
import { AccountingCatalogWithParent } from "./interfaces/AccountingCatalogWithParent";
import { GroupedAccountingCatalogDTO } from "./interfaces/grouped-accounting-catalog.model";

@Component({
  selector: "app-accounting-catalog",
  templateUrl: "./accounting-catalog.html",
  imports: [
    WebButtonLabel,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableCaption,
    TableFooter,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AccountingCatalog {
  // Servicios
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  // excelService = inject(AccountingCatalogExcelService); // Inject the service

  // Seóales
  groupedDataSignal = signal<GroupedAccountingCatalogDTO[]>([]);
  // ? flattenedData con DESCRIPCIÓN del padre é listo para agrupar en p-table
  flattenedDataSignal = computed<AccountingCatalogWithParent[]>(() => {
    return this.groupedDataSignal()
      .flatMap((group) =>
        group.childAccounts.map((child) => ({
          ...child,
          cuentaPadre: group.cuentaPadre, // ej: "601-001-000"
          // cuentaPadreDescripcion:
          //   group.descripcionCuentaPadre || "[Sin DESCRIPCIÓN]",
        })),
      )
      .sort((a, b) => (a.cuentaPadre || "").localeCompare(b.cuentaPadre || ""));
  });

  // ? Datos agrupados para mobile (clave = "código é DESCRIPCIÓN")
  mobileGroupedData = computed<{ [key: string]: AccountingCatalogDTO[] }>(
    () => {
      const result: { [key: string]: AccountingCatalogDTO[] } = {};
      for (const group of this.groupedDataSignal()) {
        const key = `${group.cuentaPadre}  || "[Sin DESCRIPCIÓN]"}`;
        result[key] = group.childAccounts;
      }
      return result;
    },
  );

  currentYear = signal(2026);
  loading = signal(true);
  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();

  globalFilterFields = computed(() => [
    "codigoCuenta",
    "descripcionCuenta",
    "cuentaPadre",
    "cuentaPadreDescripcion",
  ]);

  constructor() {
    effect(() => {
      const customerId = this.customerIdService.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {
    const customerId = this.customerIdService.customerId();
    if (customerId) {
      this.onLoadData();
    }
  }

  onLoadData(): void {
    this.loading.set(true);
    const customerId = this.customerIdService.customerId();
    if (!customerId) return;

    const urlApi = Endpoints.AccountingCatalog.byCustomerYear(
      customerId,
      this.currentYear(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((response: GroupedAccountingCatalogDTO[]) => {
        this.groupedDataSignal.set(response || []);
      })
      .catch((err) => {
        console.error("Error al cargar catálogo contable:", err);
        this.groupedDataSignal.set([]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  exportData() {
    /*
    const dataToExport = this.flattenedDataSignal();
    const columns = [
      { header: "Cuenta Padre", key: "cuentaPadre", width: 25 },
      { header: "Código", key: "codigoCuenta", width: 25 },
      { header: "DESCRIPCIÓN", key: "descripcionCuenta", width: 50 }
    ];
    this.excelService.exportToExcel(
      dataToExport,
      columns,
      "Catálogo Contable",
      `${this.customerIdService.nombreCorto()}-${this.currentYear()}`
    );
    */
  }
}
