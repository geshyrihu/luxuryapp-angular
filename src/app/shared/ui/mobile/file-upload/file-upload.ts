import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FileUploadBase } from "@ui/base/file-upload.base";
import { FileUpload as AppFileUpload } from "@ui/web/file-upload/file-upload";

/**
 * MobileFileUpload — wrapper móvil sobre el upload de PrimeNG (no existe
 * equivalente Ionic). Delega al componente web `app-file-upload`, que ya
 * contempla la fuente móvil (cámara/galería) vía `mobileSource`.
 */
@Component({
  selector: "ili-file-upload",

  imports: [AppFileUpload],
  template: `
    <app-file-upload
      [chooseLabel]="chooseLabel()"
      [accept]="accept()"
      [maxFileSize]="maxFileSize()"
      [multiple]="multiple()"
      [autoUpload]="autoUpload()"
      [mobileSource]="mobileSource()"
      (filesChange)="filesChange.emit($event)"
      (upload)="upload.emit($event)"
      (onSelect)="onSelect.emit($event)"
    ></app-file-upload>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliFileUpload extends FileUploadBase {}
