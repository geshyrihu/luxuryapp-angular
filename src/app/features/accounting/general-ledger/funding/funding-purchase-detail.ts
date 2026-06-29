import { CommonModule, CurrencyPipe, DecimalPipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-funding-purchase-detail",
  imports: [CommonModule, CustomButton, CurrencyPipe, DecimalPipe],
  templateUrl: "./funding-purchase-detail.html",
})
export class FundingPurchaseDetail {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  // El tipo 'any' es por simplicidad, idealmente aquí iría la interfaz del DTO
  data = signal<any>(null);
  ordenCompraId: string = "";
  submitting = signal(false);

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    if (this.ordenCompraId !== "") this.onLoadData();
  }
  onLoadData() {
    const urlApi = `funding/purchase-details/${this.ordenCompraId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.data.set(result);
      this.submitting.set(false);
    });
  }
  onPrint() {
    window.print();
  }
}










