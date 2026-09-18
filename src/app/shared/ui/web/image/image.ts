import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { NgStyle } from "@angular/common";
import { Gallery, GalleryModule, ImageItem } from "ng-gallery";
import { Lightbox, LightboxModule } from "ng-gallery/lightbox";
import { ImageBase } from "@ui/base/image.base";

let nextGalleryId = 0;

/**
 * AppImage — Imagen nativa con preview accesible mediante ng-gallery.
 * `appendTo` se conserva por contrato; el lightbox monta su overlay en body.
 */
@Component({
  selector: "app-image",

  imports: [NgStyle, GalleryModule, LightboxModule],
  template: `
    @if (preview()) {
      <button
        type="button"
        [class]="('app-image-trigger ' + styleClass()).trim()"
        aria-label="Ampliar imagen"
        (click)="openPreview()"
      >
        <img
          [src]="src()"
          [alt]="alt()"
          [class]="imageClass()"
          [style.width]="widthStyle()"
          [style.height]="heightStyle()"
          [ngStyle]="imageStyle()"
        />
      </button>
    } @else {
      <span [class]="styleClass()">
        <img
          [src]="src()"
          [alt]="alt()"
          [class]="imageClass()"
          [style.width]="widthStyle()"
          [style.height]="heightStyle()"
          [ngStyle]="imageStyle()"
        />
      </span>
    }
  `,
  styles: [
    `
      .app-image-trigger {
        display: inline-block;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: zoom-in;
      }

      .app-image-trigger:focus-visible {
        outline: 2px solid var(--ds-primary-500, #0d6efd);
        outline-offset: 2px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppImage extends ImageBase {
  private readonly gallery = inject(Gallery);
  private readonly lightbox = inject(Lightbox);
  private readonly galleryId = `app-image-${nextGalleryId++}`;

  openPreview(): void {
    this.gallery.ref(this.galleryId).load([
      new ImageItem({
        src: this.src(),
        alt: this.alt(),
      }),
    ]);
    this.lightbox.open(0, this.galleryId, {
      role: "dialog",
      ariaLabel: this.alt() || "Vista previa de imagen",
      keyboardShortcuts: true,
    });
  }

  widthStyle(): string | undefined {
    return this.nativeCssSize(this.widthStr());
  }

  heightStyle(): string | undefined {
    return this.nativeCssSize(this.heightStr());
  }

  private nativeCssSize(value: string | undefined): string | undefined {
    return value && /^\d+$/.test(value) ? `${value}px` : value;
  }
}
