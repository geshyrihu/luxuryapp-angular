import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { addIcons } from "ionicons";
import {
  businessOutline,
  calendarClearOutline,
  calendarOutline,
  documentTextOutline,
  folderOpenOutline,
  warningOutline,
} from "ionicons/icons";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-poliza-seguro-edificio",
  imports: [CommonModule, WebButtonLabelViewPdf, AppIcon],
  templateUrl: "./poliza-seguro-edificio.html",
})
export class PolizaSeguroEdificio {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
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
  viewPdf(url: string, fileName: string): void {
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: fileName },
      fileName,
      this.dialogHandlerS.sizeFull,
      true, // ? autoMaximize = true
    );
  }
}
