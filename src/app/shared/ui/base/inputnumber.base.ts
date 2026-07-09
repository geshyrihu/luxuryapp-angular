import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class InputnumberBase {
  styleClass = input<string>("");
  placeholder = input<any>(undefined);
  min = input<any>(undefined);
  max = input<any>(undefined);
  mode = input<any>(undefined);
  value = model<any>(undefined);
}
