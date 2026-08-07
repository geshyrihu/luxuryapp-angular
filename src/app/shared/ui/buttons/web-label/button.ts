import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "il-button",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="emitClick($event)"
    >
      @if (loading()) {
        <i class="pi pi-spinner pi-spin" aria-hidden="true"></i>
      } @else if (emoji()) {
        <span>{{ emoji() }}</span>
      } @else if (iconClass()) {
        @if (isPrimeIcon(iconClass())) {
          <i [class]="iconClass()"></i>
        } @else {
          <app-icon [icon]="iconClass()" />
        }
      } @else if (icon()) {
        <app-icon [icon]="icon()" />
      }
      <span>{{ label() || "Continuar" }}</span>
    </button>
  `,
})
export class WebButtonLabel extends BaseButton {}
