import { Directive, input, model } from "@angular/core";

@Directive()
export abstract class OrderListBase {
  value = model<any[]>([]);
  listStyle = input<any>({});
}
