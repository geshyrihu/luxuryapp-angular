import { CommonModule } from "@angular/common";

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";

import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { TableModule } from "@ui/web/primeng-table/primeng-table";

import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button"; // Nueva importación
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-orden-compra-facturas-parcial",
  templateUrl: "./orden-compra-facturas-parcial.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    TableModule,
    WebButtonLabel,
    LxMessage,
    AppIcon,
    LxTag,
    LxSkeleton,
  ],
})
export class OrdenCompraFacturasParcial {
  facturas = input.required<any[]>();
  ordenCompraId = input.required<number>();
  apiResponseS = inject(ApiResponseService);
  customToastService = inject(CustomToastService);
  dialogHandlerS = inject(DialogHandlerService);

  isValidating = signal(false);
  validationResult = signal<any | null>(null);

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
      .onPost<any>(urlApi, {})
      .then((result: any) => {
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
