import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ImageBase } from "@ui/base/image.base";
import { ImageModule } from "primeng/image";

/**
 * AppImage — Wrapper sobre p-image (display con preview/lightbox).
 */
@Component({
  selector: "app-image",

  imports: [ImageModule],
  template: `
    <p-image
      [src]="src()"
      [alt]="alt()"
      [preview]="preview()"
      [width]="widthStr()"
      [height]="heightStr()"
      [imageClass]="imageClass()"
      [imageStyle]="imageStyle() ?? null"
      [class]="styleClass()"
      [appendTo]="appendTo() ?? undefined"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppImage extends ImageBase {}
