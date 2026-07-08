import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { CarouselModule } from "primeng/carousel";
import { CarouselBase } from "@ui/base/carousel.base";

@Component({
  selector: "app-carousel",
  standalone: true,
  imports: [CommonModule, CarouselModule],
  template: `
    <p-carousel
      [value]="value()"
      [numVisible]="numVisible()"
      [circular]="circular()"
      [autoplayInterval]="autoplayInterval()"
      styleClass="w-full"
    >
      <ng-template let-item pTemplate="item">
        <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: item }" />
      </ng-template>
    </p-carousel>
    <ng-template #contentTemplate let-item>
      <ng-content [select]="'[carouselItem]'" />
    </ng-template>
  `,
  styles: [`
    :host { display: block; width: 100%; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Carousel extends CarouselBase {}
