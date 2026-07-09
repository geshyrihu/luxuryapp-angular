import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { IonImg } from "@ionic/angular/standalone";
import { ImageBase } from "@ui/base/image.base";

/**
 * MobileImage — Wrapper sobre `ion-img` (lazy-load nativo). `preview` no aplica en
 * móvil (ion-img no tiene lightbox); la imagen se muestra directa.
 */
@Component({
  selector: "ili-image",

  imports: [CommonModule, IonImg],
  template: `
    <ion-img
      [src]="src()"
      [alt]="alt()"
      [class]="(imageClass() + ' ' + styleClass()).trim()"
      [ngStyle]="mobileStyle()"
    />
  `,
  styles: [
    `
      ili-image ion-img::part(image) {
        object-fit: contain;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileImage extends ImageBase {}
