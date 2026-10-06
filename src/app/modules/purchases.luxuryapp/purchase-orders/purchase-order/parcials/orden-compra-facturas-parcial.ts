import { CommonModule } from "@angular/common";

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";

import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button"; // Nueva importación
import { LxIcon } from "@ui/adaptive/icon/icon";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import {
  PurchaseOrderInvoice,
  PurchaseOrderValidationResult,
} from "../purchase-order.types";
@Component({
  selector: "app-orden-compra-facturas-parcial",
  templateUrl: "./orden-compra-facturas-parcial.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    AppTable,
    WebButtonLabel,
    LxMessage,
    LxIcon,
    LxTag,
    LxSkeleton,
  ],
})
export class OrdenCompraFacturasParcial {
  facturas = input.required<PurchaseOrderInvoice[]>();
  ordenCompraId = input.required<string>();
  apiResponseS = inject(ApiResponseService);
  customToastService = inject(CustomToastService);
  dialogHandlerS = inject(DialogHandlerService);

  isValidating = signal(false);
  validationResult = signal<PurchaseOrderValidationResult | null>(null);

  descargarArchivo(url: string): void {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.target = "_blank";
    link.click();
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

  onValidateInvoice() {
    this.isValidating.set(true);
    this.validationResult.set(null);

    const urlApi = Endpoints.PurchaseOrders.validateInvoice(
      this.ordenCompraId(),
    );

    this.apiResponseS
      .onPost<PurchaseOrderValidationResult>(urlApi, {})
      .then((result) => {
        if (!result) return;
        this.validationResult.set(result);
        if (result.isValid) {
          this.customToastService.showSuccess(
            "Validación Exitosa",
            result.message,
          );
        } else {
          this.customToastService.showError(
            "Validación Fallida",
            result.message,
          );
        }
      })
      .catch((error) => {
        console.error("Error en la validación:", error);
        this.customToastService.showError(
          "Error",
          "Error al validar facturas.",
        );
      })
      .finally(() => {
        this.isValidating.set(false);
      });
  }
}
