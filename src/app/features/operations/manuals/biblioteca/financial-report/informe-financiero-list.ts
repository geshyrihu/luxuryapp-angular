import { Component, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { WebButtonLabelViewPdf } from "src/app/core/components/buttons/web-label/button-view-pdf";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-informe-financiero",
  imports: [
    TableModule,
    WebButtonLabelViewPdf,
    DataViewMobile,
    IonItem,
    IonLabel,
    WebButtonLabelViewPdf,
  ],
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
