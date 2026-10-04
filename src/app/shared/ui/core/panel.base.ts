import { Directive, input } from "@angular/core";

@Directive()
export abstract class PanelBase {
  header = input<string>("");
  toggleable = input<boolean>(false);
  collapsed = input<boolean>(false);
}
