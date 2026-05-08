import { Component, inject, input, OnDestroy, OnInit, signal } from "@angular/core";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { environment } from "src/environments/environment";
import { ApiResponseService } from "../../services/api-response.service";

/**
 * 📄 PDF VIEWER EMBED
 * -------------------------------------------------------------------------
 * Visor de PDFs embebido en pagina. No es modal.
 * Solo usuarios con acceso al proceso pueden visualizar.
 * La descarga NO esta habilitada.
 */
@Component({
  selector: "app-pdf-viewer-embed",
  imports: [PdfViewerModule, ProgressSpinnerModule],
  templateUrl: "./pdf-viewer-embed.html",
})
export class PdfViewerEmbed implements OnInit, OnDestroy {
  private apiResponseS = inject(ApiResponseService);

  pdfUrl = input.required<string>({ alias: "pdfUrl" });
  fileName = input<string>("documento.pdf");

  pdfSrc = signal<Uint8Array | null>(null);
  private rawUrl: string = "";

  ngOnInit(): void {
    let pdfUrl = this.pdfUrl();

    if (!pdfUrl.startsWith("http")) {
      pdfUrl = environment.API_BASE_URL + pdfUrl;
    }

    this.rawUrl = pdfUrl;

    this.apiResponseS
      .getBlobFileFromFullUrl(pdfUrl)
      .then(async (blob) => {
        if (blob) {
          const arrayBuffer = await blob.arrayBuffer();
          this.pdfSrc.set(new Uint8Array(arrayBuffer));
        }
      })
      .catch((error) => {
        console.error("PdfViewerEmbed: Error al cargar PDF:", error);
      });
  }

  ngOnDestroy(): void {}
}