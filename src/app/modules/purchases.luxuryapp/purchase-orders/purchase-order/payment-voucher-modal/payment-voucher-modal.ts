import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";


@Component({
  selector: "app-payment-voucher-modal",
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
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
  confirmS = inject(ConfirmService);
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

  async onDelete(id: string) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este comprobante?",
    );
    if (!ok) return;
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
