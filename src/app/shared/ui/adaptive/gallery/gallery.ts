import { Component, inject } from "@angular/core";
import { GalleryBase } from "@ui/base/gallery.base";
import { MobileGallery } from "@ui/mobile/gallery/gallery";
import { Gallery } from "@ui/web/gallery/gallery";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-gallery",

  imports: [Gallery, MobileGallery],
  template: `
    @if (platform.isMobile()) {
      <ili-gallery
        [images]="images()"
        [thumbnailPosition]="thumbnailPosition()"
      />
    } @else {
      <app-gallery
        [images]="images()"
        [thumbnailPosition]="thumbnailPosition()"
      />
    }
  `,
})
export class LxGallery extends GalleryBase {
  protected platform = inject(PlatformService);
}
