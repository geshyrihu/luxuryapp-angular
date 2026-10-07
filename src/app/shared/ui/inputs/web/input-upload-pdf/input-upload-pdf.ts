import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SubirPdf } from "../lux-input-upload-pdf-signal";

@Component({
  selector: "web-input-upload-pdf",

  imports: [SubirPdf],
  template: ` <lux-subir-pdf /> `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class WebInputUploadPdf {}
