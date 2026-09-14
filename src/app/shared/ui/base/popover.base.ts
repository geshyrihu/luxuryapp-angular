import { Directive, input } from "@angular/core";

@Directive()
export abstract class PopoverBase {
  styleClass = input<string>("");
  appendTo = input<any>("body");
  dismissable = input<boolean>(true);
  autoZIndex = input<boolean>(true);
  focusOnShow = input<boolean>(true);
}
