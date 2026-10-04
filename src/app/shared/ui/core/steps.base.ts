import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class StepsBase {
  styleClass = input<string>("");
  model = input<any>(undefined);
  readonly = input<any>(undefined);
  activeIndex = model<any>(undefined);
}
