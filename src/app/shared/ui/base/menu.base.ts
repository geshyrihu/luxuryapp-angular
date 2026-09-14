import { Directive, input } from "@angular/core";

@Directive()
export abstract class MenuBase {
  styleClass = input<string>("");
  model = input<any>(undefined);
}
