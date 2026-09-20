import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CarouselBase } from "@ui/base/carousel.base";
import {
  CarouselComponent as OwlCarouselComponent,
  CarouselModule,
  OwlOptions,
} from "ngx-owl-carousel-o";

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
  imports: [CarouselModule, NgTemplateOutlet],
  template: `
    <owl-carousel-o [options]="owlOptions" (changed)="onChanged($event)">
      @for (item of value(); track $index) {
        <ng-template carouselSlide [id]="'app-carousel-slide-' + $index">
          <ng-container
            [ngTemplateOutlet]="itemTemplate() ?? null"
            [ngTemplateOutletContext]="{ $implicit: item }"
          />
        </ng-template>
      }
    </owl-carousel-o>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      owl-carousel-o,
      owl-carousel-o .owl-carousel,
      owl-carousel-o .owl-stage-outer {
        display: block;
        width: 100%;
      }

      owl-carousel-o .owl-stage-outer {
        overflow: hidden;
      }

      owl-carousel-o .owl-stage {
        display: flex;
      }

      owl-carousel-o .owl-item {
        flex: 0 0 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Carousel extends CarouselBase {
  private readonly carousel = viewChild(OwlCarouselComponent);

  constructor() {
    super();
    effect(() => {
      const carousel = this.carousel();
      const page = this.page();

      if (carousel && this.value().length > 0) {
        carousel.to(`app-carousel-slide-${page}`);
      }
    });
  }

  protected get owlOptions(): OwlOptions {
    return {
      items: this.numVisible(),
      slideBy: this.numScroll(),
      loop: this.circular(),
      autoplay: this.autoplayInterval() > 0,
      autoplayTimeout: this.autoplayInterval(),
      nav: this.showNavigators(),
      dots: this.showIndicators(),
      startPosition: this.page(),
    };
  }

  protected onChanged(event: { startPosition?: number }): void {
    if (typeof event.startPosition === "number") {
      this.onPage.emit(event.startPosition);
    }
  }
}
