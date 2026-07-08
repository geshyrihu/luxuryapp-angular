import { Component, inject } from "@angular/core";
import { CarouselBase } from "@ui/base/carousel.base";
import { MobileCarousel } from "@ui/mobile/carousel/carousel";
import { Carousel } from "@ui/web/carousel/carousel";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-carousel",

  imports: [Carousel, MobileCarousel],
  template: `
    @if (platform.isMobile()) {
      <ili-carousel
        [value]="value()"
        [autoplayInterval]="autoplayInterval()"
        [numVisible]="numVisible()"
        [circular]="circular()"
      >
        <ng-content />
      </ili-carousel>
    } @else {
      <app-carousel
        [value]="value()"
        [autoplayInterval]="autoplayInterval()"
        [numVisible]="numVisible()"
        [circular]="circular()"
      >
        <ng-content />
      </app-carousel>
    }
  `,
})
export class LxCarousel extends CarouselBase {
  protected platform = inject(PlatformService);
}
