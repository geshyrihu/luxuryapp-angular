import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-customer-header-data-committee",
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./customer-header-data-committee.html",
})
export class CustomerHeaderDataCommittee {
  public customerIdS = inject(CustomerIdService);
}









