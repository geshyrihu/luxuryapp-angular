import { CommonModule, CurrencyPipe, DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { LxSpinner } from "@ui/adaptive/spinner/spinner";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-funding-purchase-detail",
  imports: [
    LxSpinner,
    CommonModule,
    WebButtonLabel,
    CurrencyPipe,
    DecimalPipe,
    LxTag,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./funding-purchase-detail.html",
})
export class FundingPurchaseDetail {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  // El tipo 'any' es por simplicidad, idealmente aqué iróa la interfaz del DTO
  data = signal<any>(null);
  ordenCompraId: string = "";
  submitting = signal(false);

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    if (this.ordenCompraId !== "") this.onLoadData();
  }
  onLoadData() {
    const urlApi = Endpoints.Funding.purchaseDetails(
      this.ordenCompraId,
    );
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.data.set(result);
      this.submitting.set(false);
    });
  }
  onPrint() {
    window.print();
  }
}
