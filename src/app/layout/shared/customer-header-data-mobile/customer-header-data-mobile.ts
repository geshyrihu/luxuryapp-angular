import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-customer-header-data-mobile",
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./customer-header-data-mobile.html",
})
export class CustomerHeaderDataMobile {
  public customerIdS = inject(CustomerIdService);
}









