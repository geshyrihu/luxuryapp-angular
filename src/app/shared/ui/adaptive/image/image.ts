import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { ImageBase } from "@ui/base/image.base";
import { MobileImage } from "@ui/mobile/image/image";
import { AppImage } from "@ui/web/image/image";

/**
 * Wrapper multiplataforma de Image. Renderiza `app-image` (web, con preview) o
 * `ili-image` (Ionic ion-img) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-image [src]="..." [preview]="true" />`.
 */
@Component({
  selector: "lux-image",

  imports: [AppImage, MobileImage],
  template: `
    @if (platform.isMobile()) {
      <ili-image
        [src]="src()"
        [alt]="alt()"
        [width]="width()"
        [height]="height()"
        [preview]="preview()"
        [imageClass]="imageClass()"
        [imageStyle]="imageStyle()"
        [styleClass]="styleClass()"
      />
    } @else {
      <app-image
        [src]="src()"
        [alt]="alt()"
        [preview]="preview()"
        [width]="width()"
        [height]="height()"
        [imageClass]="imageClass()"
        [imageStyle]="imageStyle()"
        [styleClass]="styleClass()"
        [appendTo]="appendTo()"
      />
    }
  `,
})
export class LxImage extends ImageBase {
  protected platform = inject(PlatformService);
}
