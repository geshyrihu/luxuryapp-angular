import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class PanelMenuBase {
  styleClass = input<string>("");
  model = input<any>(undefined);
}
