import { CommonModule } from "@angular/common";

import { Component, inject, input, signal } from "@angular/core";
import { MessageModule } from "primeng/message";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button"; // Nueva importación
import { PdfViewerModal } from "src/app/core/components/shared/pdf-viewer-modal/pdf-viewer-modal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-orden-compra-facturas-parcial",
  templateUrl: "./orden-compra-facturas-parcial.html",
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    MessageModule,
    SkeletonModule,
    WebButtonLabel,
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

    const urlApi = `funding/validate-invoice/${this.ordenCompraId()}`;

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
