import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageModule } from "primeng/image";
import { ImageBase } from "@ui/base/image.base";

/**
 * AppImage — Wrapper sobre p-image (display con preview/lightbox).
 */
@Component({
  selector: "app-image",
  standalone: true,
  imports: [CommonModule, ImageModule],
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
