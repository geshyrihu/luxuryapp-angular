import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ButtonWeb } from "@ui/buttons/web";
@Component({
  selector: "app-fondeos",
  templateUrl: "./fondeos.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonWeb],
})
export class Fondeos {
  descargarPDF() {
    const url = "assets/documents/FONDEOS2023.pdf"; // Ruta al archivo PDF
    window.open(url, "_blank");
  }
}
