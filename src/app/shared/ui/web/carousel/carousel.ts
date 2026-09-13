import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { CarouselBase } from "@ui/base/carousel.base";
import { NgbCarouselModule, NgbSlideEvent } from "@ng-bootstrap/ng-bootstrap";

/**
 * AppCarousel — wrapper sobre NgbCarousel. [Fase 3 migración Bootstrap,
 * 2026-09-13] Reemplaza `p-carousel`. Limitación conocida: NgbCarousel
 * muestra un solo slide activo a la vez — `numVisible`/`numScroll` > 1
 * (varios ítems simultáneos, como el carrusel de tarjetas de PrimeNG) no
 * tiene efecto visual aquí. Se conservan en `CarouselBase` por
 * compatibilidad de API; el único consumidor real usa `numVisible=1`.
 */
@Component({
  selector: "app-carousel",
  imports: [NgbCarouselModule, NgTemplateOutlet],
  template: `
    <ngb-carousel
      [interval]="autoplayInterval()"
      [wrap]="circular()"
      [showNavigationArrows]="showNavigators()"
      [showNavigationIndicators]="showIndicators()"
      [activeId]="'app-carousel-slide-' + page()"
      (slide)="onSlide($event)"
    >
      @for (item of value(); track $index) {
        <ng-template ngbSlide [id]="'app-carousel-slide-' + $index">
          <ng-container
            [ngTemplateOutlet]="itemTemplate() ?? null"
            [ngTemplateOutletContext]="{ $implicit: item }"
          />
        </ng-template>
      }
    </ngb-carousel>
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
export class Carousel extends CarouselBase {
  protected onSlide(event: NgbSlideEvent): void {
    const index = Number(event.current.replace("app-carousel-slide-", ""));
    if (!Number.isNaN(index)) {
      this.onPage.emit(index);
    }
  }
}
