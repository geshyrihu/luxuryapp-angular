import { Component, computed, effect, inject, signal } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AccountingCatalogDTO } from "../models/accounting-catalog.model";
import { GroupedAccountingCatalogDTO } from "../models/grouped-accounting-catalog.model";

// import { AccountingCatalogExcelService } from "./services/accounting-catalog-excel.service";
interface AccountingCatalogWithParent extends AccountingCatalogDTO {
  cuentaPadre: string;
}

@Component({
  selector: "app-accounting-catalog",
  templateUrl: "./accounting-catalog.html",
  imports: [
    CustomButton,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    CardModule,
  ],
  providers: [ConfirmationService],
})
export class AccountingCatalog {
  // Servicios
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  confirmationService = inject(ConfirmationService);
  // excelService = inject(AccountingCatalogExcelService); // Inject the service

  // Señales
  groupedDataSignal = signal<GroupedAccountingCatalogDTO[]>([]);
  // ✅ flattenedData con descripción del padre — listo para agrupar en p-table
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

  // ✅ Datos agrupados para mobile (clave = "código — descripción")
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

    const urlApi = `AccountingCatalog/customer/${customerId}?year=${this.currentYear()}`;
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
      { header: "Descripción", key: "descripcionCuenta", width: 50 },
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
