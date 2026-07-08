import { Directive, input } from "@angular/core";

@Directive()
export abstract class VirtualScrollerBase {
  items = input<any[]>([]);
  itemSize = input<number>(40);
  scrollHeight = input<string>("400px");
}
