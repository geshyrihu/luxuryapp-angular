import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";

import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";

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
        Endpoints.Providers.getByIdAndCustomer(
          this.providerId,
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => {
        if (!result) return;
        this.urlLogo = result.pathPhoto ?? "";
        this.model = result;
        this.cdr.detectChanges();
      });
  }
}
