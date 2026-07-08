import { Component, ChangeDetectionStrategy } from "@angular/core";
import { SubirPdf } from "../custom-input-upload-pdf-signal";

@Component({
  selector: "web-input-upload-pdf",
  standalone: true,
  imports: [SubirPdf],
  template: `
    <app-custom-input-upload-pdf-signal />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class WebInputUploadPdf {}
