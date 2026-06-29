import { Component } from "@angular/core";
import { CustomButtonDownload } from "src/app/core/components/web/buttons/custom-button-download";
@Component({
  selector: "app-fondeos",
  templateUrl: "./fondeos.html",
  imports: [CustomButtonDownload],
})
export class Fondeos {
  descargarPDF() {
    const url = "assets/documents/FONDEOS2023.pdf"; // Ruta al archivo PDF
    window.open(url, "_blank");
  }
}

