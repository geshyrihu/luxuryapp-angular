import { ChangeDetectorRef, Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { FieldsetModule } from "primeng/fieldset";
import { TagModule } from "primeng/tag";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-provider-card",
  templateUrl: "./provider-card.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardModule, DividerModule, FieldsetModule, TagModule],
})
export class TarjetaProveedor implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  cdr = inject(ChangeDetectorRef);
  model: any;
  providerId: any;
  urlLogo = "";

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    if (this.providerId) {
      this.onLoadItem();
    }
  }
  onLoadItem() {
    this.apiResponseS
      .onGetItem(
        `Providers/${this.providerId}/${this.customerIdS.customerId()}`,
      )
      .then((result: any) => {
        if (!result) return;
        this.urlLogo = result.pathPhoto ?? "";
        this.model = result;
        this.cdr.detectChanges();
      });
  }
}









