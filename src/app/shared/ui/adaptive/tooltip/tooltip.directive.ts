import { Directive } from "@angular/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Directive({
  selector: "[lxTooltip]",

  hostDirectives: [
    {
      directive: NgbTooltip,
      inputs: [
        "ngbTooltip: lxTooltip",
        "placement: tooltipPosition",
        "disableTooltip: tooltipDisabled",
        "tooltipClass: tooltipStyleClass",
        "triggers: tooltipEvent",
        "autoClose",
        "animation",
        "container",
        "openDelay",
        "closeDelay",
      ],
    },
  ],
})
export class LxTooltipDirective {
  constructor(private readonly tooltip: NgbTooltip) {
    // Render global overlays outside header stacking contexts and overflow.
    this.tooltip.container = "body";
  }
}
