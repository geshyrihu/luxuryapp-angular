import { Component, contentChild, inject, TemplateRef } from "@angular/core";
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
        [page]="page()"
        [numScroll]="numScroll()"
        [showIndicators]="showIndicators()"
        [showNavigators]="showNavigators()"
        [itemTemplate]="item()"
        (onPage)="onPage.emit($event)"
      />
    } @else {
      <app-carousel
        [value]="value()"
        [autoplayInterval]="autoplayInterval()"
        [numVisible]="numVisible()"
        [circular]="circular()"
        [page]="page()"
        [numScroll]="numScroll()"
        [showIndicators]="showIndicators()"
        [showNavigators]="showNavigators()"
        [itemTemplate]="item()"
        (onPage)="onPage.emit($event)"
      />
    }
  `,
})
export class LxCarousel extends CarouselBase {
  protected platform = inject(PlatformService);
  /** Plantilla `<ng-template #item let-slide>` proyectada por el consumidor. */
  protected item = contentChild<TemplateRef<unknown>>("item");
}
