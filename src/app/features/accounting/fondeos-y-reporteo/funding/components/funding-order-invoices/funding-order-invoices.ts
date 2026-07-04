import { Component, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label/button-item";
import { PdfViewerModal } from "src/app/core/components/web/pdf-viewer-modal/pdf-viewer-modal";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { WebButtonIconItem } from "src/app/core/components/buttons/web-icon/button-item";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-funding-order-invoices",
  imports: [
    WebButtonIconItem,
    TooltipModule,TableModule, WebButtonLabelItem],
  templateUrl: "./funding-order-invoices.html",
})
export class FundingOrderInvoices implements OnInit {
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  dialogHandlerS = inject(DialogHandlerService);
  invoices = signal<any[]>([]);

  ngOnInit(): void {
    if (this.config.data && this.config.data.invoices) {
      this.invoices.set(this.config.data.invoices);
    }
  }

  viewPdf(url: string, fileName: string): void {
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: fileName },
      fileName,
      this.dialogHandlerS.sizeFull,
      true,
    );
  }

  close() {
    this.ref.close();
  }
}
