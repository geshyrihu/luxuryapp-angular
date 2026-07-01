import { Directive, input } from "@angular/core";
import { BaseButton } from "../../revisar-si.sirve/base/base-button";

@Directive({
  host: {
    "[class.custom-button-fluid]": "fluid()",
  },
})
export abstract class WebButtonBase extends BaseButton {
  showLabelOnDesktop = input<boolean>(true);
  tooltip = input<string>("");
  tooltipPosition = input<"top" | "bottom" | "left" | "right">("top");
  ariaLabel = input<string>("");
}
