import { Directive, input } from "@angular/core";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

@Directive()
export abstract class TooltipBase {
  text = input<string>("");
  position = input<TooltipPosition>("top");
  disabled = input<boolean>(false);
  delay = input<number>(0);
}
