import { Directive, input } from "@angular/core";

@Directive()
export abstract class PopoverBase {
  styleClass = input<string>("");
  dismissable = input<boolean>(true);
}
