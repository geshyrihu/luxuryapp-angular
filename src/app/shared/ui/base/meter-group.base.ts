import { Directive, input } from "@angular/core";

@Directive()
export abstract class MeterGroupBase {
  value = input<any[]>([]);
  min = input(0);
  max = input(100);
}
