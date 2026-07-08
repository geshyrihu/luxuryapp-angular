import { Directive, input } from "@angular/core";

@Directive()
export abstract class AnimateOnScrollBase {
  animation = input<string>("fadeIn");
  delay = input<number>(0);
  threshold = input<number>(0.1);
}
