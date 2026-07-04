import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { CustomInputFile } from "src/app/core/components/inputs/web/custom-input-file-signal";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PdfViewerModal } from "src/app/core/components/web/pdf-viewer-modal/pdf-viewer-modal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";

import { WebButtonIcon } from "src/app/core/components/buttons/web-icon/button";

@Component({
  selector: "app-payment-voucher-modal",
  imports: [
    WebButtonIcon,
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    WebButtonLabel,
    WebButtonLabelDelete,
    CustomInputFile,
  ],
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
