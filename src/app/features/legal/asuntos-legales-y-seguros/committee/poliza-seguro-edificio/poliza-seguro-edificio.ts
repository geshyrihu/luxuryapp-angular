import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import {
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  businessOutline,
  calendarClearOutline,
  calendarOutline,
  documentTextOutline,
  folderOpenOutline,
  warningOutline,
} from "ionicons/icons";
import { CardModule } from "primeng/card";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PdfViewerModal } from "src/app/core/components/shared/pdf-viewer-modal/pdf-viewer-modal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-poliza-seguro-edificio",
  imports: [
    CommonModule,
    CardModule,
    CustomButtonViewPdf,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    CustomButtonViewPdf,
    AppIcon,
  ],
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
      .onGetItem(`PolicyContract/building-insurance/${customerId}`)
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

