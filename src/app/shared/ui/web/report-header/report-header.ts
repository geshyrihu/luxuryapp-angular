import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TicketFilterService } from "src/app/core/services/ticket-filter.service";

/**
 * 📄 REPORT HEADER
 * -------------------------------------------------------------------------
 * Cabecera estándar para reportes impresos.
 * Muestra el logo del cliente automáticamente.
 */
@Component({
  selector: "app-report-header",

  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="grid">
      <div class="col text-center">
        <img
          [src]="logoUrl()"
          [alt]="nameCustomer()"
          style="width: 100px; height: 150px; max-width: 100%; height: auto"
        />
      </div>
    </div>
    <hr />
  `,
})
export class ReportHeader {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterReportOperationService = inject(TicketFilterService);

  // <--- Inputs --->
  nameCustomerInput = input<string>("", { alias: "nameCustomer" });
  logoCustomerInput = input<string>("", { alias: "logoCustomer" });

  // <--- State from API --->
  private customerFromApi = signal<{
    nameCustomer: string;
    photoPath: string;
  } | null>(null);

  // <--- Derived State (Computed Signals) for the template --->
  nameCustomer = computed(() => {
    return (
      this.customerFromApi()?.nameCustomer || this.nameCustomerInput() || ""
    );
  });

  logoUrl = computed(() => {
    const fromApi = this.customerFromApi()?.photoPath;
    const fromInput = this.logoCustomerInput();
    return fromApi || fromInput || "assets/images/default-avatar.png";
  });

  constructor() {
    // Effect to trigger data loading when customerId changes
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData(customerId);
      } else {
        // Reset if customerId is cleared
        this.customerFromApi.set(null);
      }
    });
  }

  private onLoadData(customerId: string) {
    const urlApi = Endpoints.Customers.getByIdLegacy(customerId);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      if (result) {
        this.customerFromApi.set(result);
      }
    });
  }
}
