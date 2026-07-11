import { Directive, Input } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Directive({
  selector: '[lxTooltip]',
  standalone: true,
  hostDirectives: [
    {
      directive: Tooltip,
      inputs: [
        'pTooltip: lxTooltip',
        'tooltipPosition',
        'tooltipDisabled',
        'tooltipStyleClass',
        'tooltipEvent',
        'tooltipZIndex',
        'escape',
        'positionStyle',
        'fitContent'
      ]
    }
  ]
})
export class LxTooltipDirective {
}
