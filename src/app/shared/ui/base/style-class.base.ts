import { Directive, input } from "@angular/core";

@Directive()
export abstract class StyleClassBase {
  enterClass = input<string>("");
  leaveClass = input<string>("");
  hideOnOutsideClick = input<boolean>(false);
  toggleClass = input<string>("");
}
