import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { FileUploadBase } from "@ui/core/file-upload.base";
import { IliFileUpload } from "@ui/mobile/file-upload/file-upload";
import { FileUpload as AppFileUpload } from "@ui/web/file-upload/file-upload";

/**
 * Wrapper multiplataforma de FileUpload. Renderiza `app-file-upload` (web) o
 * `ili-file-upload` (móvil) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-file-upload [multiple]="true" />`.
 */
@Component({
  selector: "lux-file-upload",

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
      <lux-file-upload-web
        [chooseLabel]="chooseLabel()"
        [accept]="accept()"
        [maxFileSize]="maxFileSize()"
        [multiple]="multiple()"
        [autoUpload]="autoUpload()"
        [mobileSource]="mobileSource()"
        (filesChange)="filesChange.emit($event)"
        (upload)="upload.emit($event)"
        (onSelect)="onSelect.emit($event)"
      ></lux-file-upload-web>
    }
  `,
})
export class LxFileUpload extends FileUploadBase {
  protected platform = inject(PlatformService);
}
