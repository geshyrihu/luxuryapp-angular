import { Directive, input } from "@angular/core";

@Directive()
export abstract class CarouselBase {
  value = input<any[]>([]);
  autoplayInterval = input<number>(3000);
  numVisible = input<number>(1);
  circular = input<boolean>(true);
}
