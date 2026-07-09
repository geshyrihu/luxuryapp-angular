import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class PanelmenuBase {
  styleClass = input<string>("");
  model = input<any>(undefined);
}
