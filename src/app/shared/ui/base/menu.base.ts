import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class MenuBase {
  styleClass = input<string>("");
  model = input<any>(undefined);
  popup = input<any>(undefined);
}
