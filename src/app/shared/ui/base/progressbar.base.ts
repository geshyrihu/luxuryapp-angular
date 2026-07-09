import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class ProgressbarBase {
  styleClass = input<string>("");
  value = input<any>(undefined);
  style = input<any>(undefined);
  showValue = input<any>(undefined);
  color = input<any>(undefined);
}
