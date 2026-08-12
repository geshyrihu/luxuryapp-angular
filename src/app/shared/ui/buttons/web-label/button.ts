import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { AppSpinner } from "../../web/spinner/spinner";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "il-button",

  imports: [AppIcon, AppSpinner],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
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
