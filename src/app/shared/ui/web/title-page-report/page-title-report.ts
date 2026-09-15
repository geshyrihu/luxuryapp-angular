import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { PeriodMonthService } from "@core/services/periodo-month.service";

/**
 * 📑 PAGE TITLE REPORT
 * -------------------------------------------------------------------------
 * Cabecera completa para reportes de página.
 * Muestra logo del cliente, título, periodo y logo de LuxuryApp.
 */
@Component({
  selector: "page-title-report",
  template: `
    <div class="row align-items-center">
      <!-- Logo Cliente -->
      <div class="col-fixed" style="width: 60px">
        <img
          [src]="
            logoCustomer() ? logoCustomer() : 'assets/images/default-avatar.png'
          "
          alt=""
          class="w-full rounded"
          style="max-height: 100px;"
        />
      </div>
      <!-- Texto Central -->
      <div class="col text-center">
        <h4 class="mb-0 font-bold">{{ nameCustomer() }}</h4>
        <h6 class="mt-2 mb-0">{{ title() }}</h6>
        <h6 class="mt-2 mb-0">{{ periodo() }}</h6>
      </div>
      <!-- Logo Luxury -->
      <div class="col-fixed" style="width: 100px">
        <img
          src="assets/images/logo-luxury.jpg"
          alt=""
          class="w-full rounded"
          style="max-height: 150px;"
        />
      </div>
    </div>
    <hr />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      img {
        object-fit: contain;
        border-radius: 0.5rem;
      }
    `,
  ],
})
export class PageTitleReport {
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);
  private periodMonthService = inject(PeriodMonthService);
  private dateS = inject(DateService);

  // <--- Inputs --->
  title = input<string | undefined>(undefined);

  // Default periodo computed from service if not provided
  periodo = input<string>(
    this.dateS.formatDateTimeToMMMMAAAA(
      this.periodMonthService.getPeriodoInicio,
    ),
  );

  nameCustomer = signal<string>("");
  logoCustomer = signal<string>("");

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    const urlApi = Endpoints.Customers.getByIdLegacy(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.nameCustomer.set(result.nameCustomer);
      this.logoCustomer.set(result.photoPath);
    });
  }
}

