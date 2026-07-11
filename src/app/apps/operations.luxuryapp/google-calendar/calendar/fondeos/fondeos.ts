import { Component, ChangeDetectionStrategy } from "@angular/core";
import { WebButtonLabelDownload } from "@ui/buttons/web-label/button-download";
@Component({
  selector: "app-fondeos",
  templateUrl: "./fondeos.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WebButtonLabelDownload],
})
export class Fondeos {
  descargarPDF() {
    const url = "assets/documents/FONDEOS2023.pdf"; // Ruta al archivo PDF
    window.open(url, "_blank");
  }
}
