import { Endpoints } from "src/app/core/constants/endpoints";
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
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { ConfirmationService } from "primeng/api";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AccountingCatalogDTO } from "./interfaces/accounting-catalog.model";
import { AccountingCatalogWithParent } from "./interfaces/AccountingCatalogWithParent";
import { GroupedAccountingCatalogDTO } from "./interfaces/grouped-accounting-catalog.model";

@Component({
  selector: "app-accounting-catalog",
  templateUrl: "./accounting-catalog.html",
  imports: [
    WebButtonLabel,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConfirmationService],
})
export class AccountingCatalog {
  // Servicios
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  confirmationService = inject(ConfirmationService);
  // excelService = inject(AccountingCatalogExcelService); // Inject the service

  // Seóales
  groupedDataSignal = signal<GroupedAccountingCatalogDTO[]>([]);
  // ? flattenedData con descripción del padre é listo para agrupar en p-table
  flattenedDataSignal = computed<AccountingCatalogWithParent[]>(() => {
    return this.groupedDataSignal()
      .flatMap((group) =>
        group.childAccounts.map((child) => ({
          ...child,
          cuentaPadre: group.cuentaPadre, // ej: "601-001-000"
          // cuentaPadreDescripcion:
          //   group.descripcionCuentaPadre || "[Sin descripción]",
        })),
      )
      .sort((a, b) => (a.cuentaPadre || "").localeCompare(b.cuentaPadre || ""));
  });

  // ? Datos agrupados para mobile (clave = "código é descripción")
  mobileGroupedData = computed<{ [key: string]: AccountingCatalogDTO[] }>(
    () => {
      const result: { [key: string]: AccountingCatalogDTO[] } = {};
      for (const group of this.groupedDataSignal()) {
        const key = `${group.cuentaPadre}  || "[Sin descripción]"}`;
        result[key] = group.childAccounts;
      }
      return result;
    },
  );

  currentYear = signal(2026);
  loading = signal(true);
  tablePrimeNgRows = tablePrimeNgRows();
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

    const urlApi = Endpoints.RefactorContabilidad.accountingCatalogCustomeryear(customerId, this.currentYear());
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
      { header: "Descripción", key: "descripcionCuenta", width: 50 }
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
