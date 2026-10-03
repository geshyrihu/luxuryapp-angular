import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { AppTable } from "@ui/web/table/table";

@Component({
  selector: "app-funding-order-invoices",
  imports: [WebButtonIconItem, LxTooltipDirective, AppTable],
  changeDetection: ChangeDetectionStrategy.Eager,
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
