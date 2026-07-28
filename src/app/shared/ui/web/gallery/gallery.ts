import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { GalleryBase } from "@ui/base/gallery.base";
import { GalleriaModule } from "primeng/galleria";

@Component({
  selector: "app-gallery",
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [GalleriaModule],
  template: `
    <p-galleria
      [value]="images()"
      [showThumbnails]="true"
      [thumbnailPosition]="thumbnailPosition()"
      [circular]="true"
      [responsiveOptions]="responsiveOptions"
      containerStyle="max-width: 100%"
      styleClass="w-full"
    >
      <ng-template let-image pTemplate="item">
        <img
          [src]="image.src || image.url || image"
          [alt]="image.alt || image.title || ''"
          style="width: 100%; display: block;"
        />
      </ng-template>
      <ng-template let-image pTemplate="thumbnail">
        <img
          [src]="image.thumbnail || image.src || image.url || image"
          [alt]="image.alt || image.title || ''"
        />
      </ng-template>
    </p-galleria>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Gallery extends GalleryBase {
  responsiveOptions = [
    { breakpoint: "1024px", numVisible: 5 },
    { breakpoint: "768px", numVisible: 3 },
    { breakpoint: "560px", numVisible: 1 },
  ];
}
