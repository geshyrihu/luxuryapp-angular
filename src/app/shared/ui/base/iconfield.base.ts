import { Directive, input } from "@angular/core";

@Directive()
export abstract class IconFieldBase {
  iconPosition = input<"left" | "right">("left");
}
