import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { AccountingCatalogDesktop } from "./desktop/accounting-catalog-desktop";
import { AccountingCatalogWithParent } from "./interfaces/AccountingCatalogWithParent";
import { GroupedAccountingCatalogDTO } from "./interfaces/grouped-accounting-catalog.model";
import { AccountingCatalogMobile } from "./mobile/accounting-catalog-mobile";

@Component({
  selector: "app-accounting-catalog",
  templateUrl: "./accounting-catalog.html",
  imports: [AccountingCatalogDesktop, AccountingCatalogMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AccountingCatalog {
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);

  groupedDataSignal = signal<GroupedAccountingCatalogDTO[]>([]);
  flattenedDataSignal = computed<AccountingCatalogWithParent[]>(() => {
    return this.groupedDataSignal()
      .flatMap((group) =>
        group.childAccounts.map((child) => ({
          ...child,
          cuentaPadre: group.cuentaPadre,
        })),
      )
      .sort((a, b) => (a.cuentaPadre || "").localeCompare(b.cuentaPadre || ""));
  });

  currentYear = signal(2026);
  loading = signal(true);

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
    // Export pendiente (servicio deshabilitado).
  }
}
