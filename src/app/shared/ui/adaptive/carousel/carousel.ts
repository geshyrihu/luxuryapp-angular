import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { CarouselBase } from "@ui/base/carousel.base";
import { MobileCarousel } from "@ui/mobile/carousel/carousel";
import { Carousel } from "@ui/web/carousel/carousel";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-carousel",

  imports: [NgTemplateOutlet, Carousel, MobileCarousel],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
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
        (onPage)="onPage.emit($event)"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-carousel>
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
        (onPage)="onPage.emit($event)"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-carousel>
    }
  `,
})
export class LxCarousel extends CarouselBase {
  protected platform = inject(PlatformService);
}
