import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
@Component({
  selector: "app-customer-header-data-mobile",
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./customer-header-data-mobile.html",
})
export class CustomerHeaderDataMobile {
  public customerIdS = inject(CustomerIdService);
}

