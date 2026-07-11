import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SubirPdf } from "../custom-input-upload-pdf-signal";

@Component({
  selector: "web-input-upload-pdf",

  imports: [SubirPdf],
  template: ` <app-subir-pdf /> `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class WebInputUploadPdf {}
