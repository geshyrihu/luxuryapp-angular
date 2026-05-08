import { Component, inject, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { FieldsetModule } from "primeng/fieldset";
import { TagModule } from "primeng/tag";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-provider-card",
  templateUrl: "./provider-card.html",
  imports: [CardModule, FieldsetModule, TagModule],
})
export class TarjetaProveedor implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  model: any;
  providerId: any;
  urlLogo = "";

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    if (this.providerId !== null) {
      this.onLoadItem();
    }
  }
  onLoadItem() {
    this.apiResponseS
      .onGetItem(
        `Providers/${this.providerId}/${this.customerIdS.customerId()}`,
      )
      .then((result: any) => {
        this.urlLogo = result.pathPhoto;
        this.model = result;
      });
  }
}









