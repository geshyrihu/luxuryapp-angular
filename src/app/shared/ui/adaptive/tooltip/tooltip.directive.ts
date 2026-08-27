import { Directive } from "@angular/core";
import { Tooltip } from "primeng/tooltip";

@Directive({
  selector: "[lxTooltip]",

  hostDirectives: [
    {
      directive: Tooltip,
      inputs: [
        "pTooltip: lxTooltip",
        "tooltipPosition",
        "tooltipDisabled",
        "tooltipStyleClass",
        "tooltipEvent",
        "tooltipZIndex",
        "escape",
        "positionStyle",
        "fitContent",
      ],
    },
  ],
})
export class LxTooltipDirective {}
