import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-payment-voucher-modal",
  imports: [
    WebButtonIcon,
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    WebButtonLabel,
    CustomInputFile,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./payment-voucher-modal.html",
})
export class PaymentVoucherModal implements OnInit {
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  dialogHandlerS = inject(DialogHandlerService);
  ordenCompraId: string = "";
  comprobantes = signal<any[]>([]);
  submitting = signal(false);
  file: File | null = null;

  ngOnInit(): void {
    if (this.config.data) {
      this.ordenCompraId = this.config.data.ordenCompraId;
      this.comprobantes.set(this.config.data.comprobantes || []);
    }
  }

  onFileChange(file: File) {
    this.file = file;
  }

  onAdd() {
    if (!this.file) return;

    this.submitting.set(true);
    const formData = new FormData();
    formData.append("file", this.file);

    this.apiResponseS
      .onPost(
        Endpoints.PurchaseOrderPaymentVouchers.upload(this.ordenCompraId),
        formData,
      )
      .then((res: any) => {
        this.comprobantes.update((list) => [...list, res]);
        this.file = null;
        this.submitting.set(false);
      })
      .catch(() => this.submitting.set(false));
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.PurchaseOrderPaymentVouchers.delete(id))
      .then(() => {
        this.comprobantes.update((list) => list.filter((x) => x.id !== id));
      });
  }

  viewFile(url: string, name: string) {
    if (name.toLowerCase().endsWith(".pdf")) {
      this.dialogHandlerS.openDialog(
        PdfViewerModal,
        { pdfSrc: url, fileName: name },
        name,
        this.dialogHandlerS.sizeFull,
        true,
      );
    } else {
      window.open(url, "_blank");
    }
  }

  close() {
    this.ref.close(this.comprobantes());
  }
}
