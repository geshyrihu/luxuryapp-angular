import { Directive, input, model } from "@angular/core";

@Directive()
export abstract class KnobBase {
  value = model<number>(0);
  min = input(0);
  max = input(100);
  step = input(1);
  size = input(100);
  color = input("var(--ds-primary)");
}
