import { Directive, input, output, TemplateRef } from "@angular/core";

@Directive()
export abstract class CarouselBase {
  value = input<any[]>([]);
  autoplayInterval = input<number>(3000);
  numVisible = input<number>(1);
  circular = input<boolean>(true);
  page = input<number>(0);
  numScroll = input<number>(1);
  showIndicators = input<boolean>(true);
  showNavigators = input<boolean>(true);
  /** Plantilla de cada slide; recibe el elemento como $implicit. */
  itemTemplate = input<TemplateRef<unknown>>();
  onPage = output<any>();
}
