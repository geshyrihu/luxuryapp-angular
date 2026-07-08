import { Component, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TableModule } from "primeng/table";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-informe-financiero",
  imports: [
    TableModule,
    WebButtonLabelViewPdf,
    DataViewMobile,    WebButtonLabelViewPdf,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./informe-financiero-list.html",
})
export class InformeFinanciero {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);

  globalFilterFields: string[] = [];
  loading = signal(true);

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `FinancialReport/List/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(urlApi).then((response: any) => {
      this.dataSignal.set(response);
    });
  }
}
