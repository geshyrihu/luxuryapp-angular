import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { environment } from "src/environments/environment";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label";

/**
 * 📄 PDF VIEWER MODAL
 * -------------------------------------------------------------------------
 * Visor de PDFs en ventana modal.
 */
@Component({
  selector: "app-pdf-viewer-modal",
  imports: [PdfViewerModule, ProgressSpinnerModule, WebButtonLabel],
  templateUrl: "./pdf-viewer-modal.html",
})
export class PdfViewerModal implements OnInit, OnDestroy {
  private dialogConfig = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);

  pdfSrc = signal<Uint8Array | null>(null);
  fileName: string = "document.pdf";
  private rawUrl: string = "";

  ngOnInit(): void {
    if (this.dialogConfig.data && this.dialogConfig.data.pdfSrc) {
      let pdfUrl = this.dialogConfig.data.pdfSrc;
      this.fileName = this.dialogConfig.data.fileName || this.fileName;

      if (!pdfUrl.startsWith("http")) {
        const urlBase = environment.API_BASE_URL;
        pdfUrl = urlBase + pdfUrl;
      }

      this.rawUrl = pdfUrl;

      // Obtenemos el archivo y lo convertimos a Uint8Array
      this.apiResponseS
        .getBlobFileFromFullUrl(pdfUrl)
        .then(async (blob) => {
          if (blob) {
            const arrayBuffer = await blob.arrayBuffer();
            this.pdfSrc.set(new Uint8Array(arrayBuffer));
          } else {
            console.error("PdfViewerModal: Failed to fetch PDF Blob.");
          }
        })
        .catch((error) => {
          console.error("PdfViewerModal: Error fetching PDF Blob:", error);
        });
    }
  }

  ngOnDestroy(): void {}

  downloadPdf(): void {
    const link = document.createElement("a");
    link.href = this.rawUrl;
    link.download = this.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

