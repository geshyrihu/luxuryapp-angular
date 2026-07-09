import { ChangeDetectorRef, Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";

import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
import { LxDivider } from "@ui/adaptive/divider/divider";

import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxCard } from "@ui/adaptive/card/card";
@Component({
  selector: "app-provider-card",
  templateUrl: "./provider-card.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxTag, LxCard, LxFieldset, LxDivider],
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









