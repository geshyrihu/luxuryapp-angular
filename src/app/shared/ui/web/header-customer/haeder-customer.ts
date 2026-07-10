import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { AvatarModule } from "primeng/avatar";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TicketFilterService } from "src/app/core/services/ticket-filter.service";

/**
 * 👤 HEADER CUSTOMER
 * -------------------------------------------------------------------------
 * Cabecera elegante para mostrar la identidad del cliente.
 * Se actualiza reactivamente cuando cambia el Customer ID.
 */
@Component({
  selector: "app-header-customer",
  imports: [AvatarModule],
  template: `
    <div
      class="header-customer flex align-items-center justify-content-between"
    >
      <p-avatar
        [image]="
          logoCustomer() ? logoCustomer() : 'assets/images/default-avatar.png'
        "
        shape="circle"
        size="xlarge"
        class="header-avatar"
      ></p-avatar>
      <div class="header-details text-center">
        <!-- Mostramos el nombre recuperado de la API -->
        <h4 class="mb-1">{{ nameCustomer() }}</h4>
        <!-- Título y subtítulo personalizables -->
        <h4 class="mb-1">{{ title() }}</h4>
        <p class="mb-0">{{ subTitle() }}</p>
      </div>
      <div class="header-empty"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .header-customer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 1rem;
        background: var(--ds-bg-surface);
        .header-avatar {
          margin-right: 1rem;
        }

        .header-details {
          flex: 1;
          text-align: center;
        }
      }
    `,
  ],
})
export class HeaderCustomer {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  public filterReportOperationService = inject(TicketFilterService);

  // <--- Inputs --->
  title = input<string>("Titulo de cabecera");
  subTitle = input<string>("");

  logoCustomer = signal<string>("");
  nameCustomer = signal<string>("");

  constructor() {
    // Reacciona a cambios en el ID del cliente automágicamente ✨
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
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
