import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { AppSpinner } from "../../web/spinner/spinner";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "il-button",

   imports: [AppIcon, AppSpinner, LxTooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
       [lxTooltip]="tooltipText()"
       [tooltipPosition]="tooltipPosition()"
       [tooltipDisabled]="!tooltipText()"
      [attr.aria-label]="ariaLabel() || title() || label() || null"
      (click)="emitClick($event)"
    >
      @if (loading()) {
        <app-spinner [size]="16" [strokeWidth]="6" ariaLabel="Cargando" />
      } @else if (emoji()) {
        <span>{{ emoji() }}</span>
      } @else if (iconClass()) {
        <app-icon [icon]="resolvedIconClass()" />
      } @else if (icon()) {
        <app-icon [icon]="resolvedIcon()" />
      }
      <span>{{ label() || "Continuar" }}</span>
    </button>
  `,
})
export class WebButtonLabel extends BaseButton {}
