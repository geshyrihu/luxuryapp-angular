import { Component, inject } from "@angular/core";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-customer-header-data-mobile",
  imports: [],
  templateUrl: "./customer-header-data-mobile.html",
})
export class CustomerHeaderDataMobile {
  public customerIdS = inject(CustomerIdService);
}









