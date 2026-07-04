import { Component } from "@angular/core";
import { WebButtonLabelDownload } from "@ui/buttons/web-label/button-download";
@Component({
  selector: "app-fondeos",
  templateUrl: "./fondeos.html",
  imports: [WebButtonLabelDownload],
})
export class Fondeos {
  descargarPDF() {
    const url = "assets/documents/FONDEOS2023.pdf"; // Ruta al archivo PDF
    window.open(url, "_blank");
  }
}
