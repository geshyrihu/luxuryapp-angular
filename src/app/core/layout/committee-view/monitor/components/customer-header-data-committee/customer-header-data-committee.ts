import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
@Component({
  selector: "app-customer-header-data-committee",
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./customer-header-data-committee.html",
})
export class CustomerHeaderDataCommittee {
  public customerIdS = inject(CustomerIdService);
}
