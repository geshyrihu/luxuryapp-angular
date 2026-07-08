import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppImage } from "@ui/web/image/image";
import { MobileImage } from "@ui/mobile/image/image";
import { ImageBase } from "@ui/base/image.base";

/**
 * Wrapper multiplataforma de Image. Renderiza `app-image` (PrimeNG, con preview) o
 * `ili-image` (Ionic ion-img) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-image [src]="..." [preview]="true" />`.
 */
@Component({
  selector: "lx-image",
  standalone: true,
  imports: [AppImage, MobileImage],
  template: `
    @if (platform.isMobile()) {
      <ili-image
        [src]="src()"
        [alt]="alt()"
        [width]="width()"
        [height]="height()"
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
