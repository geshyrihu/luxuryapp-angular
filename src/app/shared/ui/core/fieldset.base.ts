import { Directive, input } from "@angular/core";

@Directive()
export abstract class FieldsetBase {
  legend = input<string>("");
  toggleable = input<boolean>(false);
  collapsed = input<boolean>(false);
}
