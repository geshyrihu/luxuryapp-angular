import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-informe-financiero",
  imports: [
    TableModule,
    WebButtonLabelViewPdf,
    DataViewMobile,
    WebButtonLabelViewPdf,
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
    const urlApi = Endpoints.FinancialReport.listByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS.onGetList(urlApi).then((response: any) => {
      this.dataSignal.set(response);
    });
  }
}
