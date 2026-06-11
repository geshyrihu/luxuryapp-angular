import { Component, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IonButtonViewPdf } from "src/app/core/components/buttons/mobile";
@Component({
  selector: "app-informe-financiero",
  imports: [
    TableModule,
    CustomButtonViewPdf,
    DataViewMobile,
    IonItem,
    IonLabel,
    IonButtonViewPdf,
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









