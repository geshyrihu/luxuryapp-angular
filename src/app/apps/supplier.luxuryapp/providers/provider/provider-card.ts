import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from "@angular/core";

import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
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
        `providers/${this.providerId}/${this.customerIdS.customerId()}`,
      )
      .then((result: any) => {
        if (!result) return;
        this.urlLogo = result.pathPhoto ?? "";
        this.model = result;
        this.cdr.detectChanges();
      });
  }
}
