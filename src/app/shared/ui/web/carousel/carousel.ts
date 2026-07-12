import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { CarouselBase } from "@ui/base/carousel.base";
import { CarouselModule } from "primeng/carousel";

@Component({
  selector: "app-carousel",

  imports: [CarouselModule],
  template: `
    <p-carousel
      [value]="value()"
      [numVisible]="numVisible()"
      [circular]="circular()"
      [autoplayInterval]="autoplayInterval()"
      [page]="page()"
      [numScroll]="numScroll()"
      [showIndicators]="showIndicators()"
      [showNavigators]="showNavigators()"
      (onPage)="onPage.emit($event)"
      styleClass="w-full"
    >
      <ng-content />
    </p-carousel>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Carousel extends CarouselBase {}
