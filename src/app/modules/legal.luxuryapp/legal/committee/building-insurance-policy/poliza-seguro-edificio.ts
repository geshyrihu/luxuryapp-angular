import { Component, effect, inject, signal } from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { addIcons } from "ionicons";
import {
  businessOutline,
  calendarClearOutline,
  calendarOutline,
  documentTextOutline,
  folderOpenOutline,
  warningOutline,
} from "ionicons/icons";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
@Component({
  selector: "app-poliza-seguro-edificio",
  imports: [ApiDatePipe, PdfViewerTrigger, AppIcon],
  templateUrl: "./poliza-seguro-edificio.html",
})
export class PolizaSeguroEdificio {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  data = signal<any>(null);

  constructor() {
    addIcons({
      businessOutline,
      documentTextOutline,
      calendarOutline,
      calendarClearOutline,
      folderOpenOutline,
      warningOutline,
    });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    this.apiResponseS
      .onGetItem(Endpoints.PolicyContracts.buildingInsurance(customerId))
      .then((result) => {
        this.data.set(result);
      });
  }
}
