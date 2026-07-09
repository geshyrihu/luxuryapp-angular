import { Component, inject } from "@angular/core";
import { FileUploadBase } from "@ui/base/file-upload.base";
import { IliFileUpload } from "@ui/mobile/file-upload/file-upload";
import { FileUpload as AppFileUpload } from "@ui/web/file-upload/file-upload";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de FileUpload. Renderiza `app-file-upload` (web) o
 * `ili-file-upload` (móvil) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-file-upload [multiple]="true" />`.
 */
@Component({
  selector: "lx-file-upload",

  imports: [AppFileUpload, IliFileUpload],
  template: `
    @if (platform.isMobile()) {
      <ili-file-upload
        [chooseLabel]="chooseLabel()"
        [accept]="accept()"
        [maxFileSize]="maxFileSize()"
        [multiple]="multiple()"
        [autoUpload]="autoUpload()"
        [mobileSource]="mobileSource()"
        (filesChange)="filesChange.emit($event)"
        (upload)="upload.emit($event)"
        (onSelect)="onSelect.emit($event)"
      ></ili-file-upload>
    } @else {
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
    }
  `,
})
export class LxFileUpload extends FileUploadBase {
  protected platform = inject(PlatformService);
}
