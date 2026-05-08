import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-add",
  imports: [CommonModule, TooltipModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="btnClasses() + ' ' + customClass()"
      [ngClass]="customNgClass()"
      (click)="clicked.emit($event)"
      [pTooltip]="ngbTooltip() || label() || 'Agregar'"
      tooltipPosition="top"
    >
      <span [class]="iconShellClasses(true)" aria-hidden="true">
        <i [class]="finalIcon()"></i>
      </span>
      <span>{{ label() || "Agregar" }}</span>
    </button>
  `,
})
export class CustomButtonAdd extends BaseButton {
  override severity = input<any>("primary");
  override variant = input<"outlined" | "text" | null>("outlined");
  override fluid = input<boolean>(true);

  finalIcon = computed(() => this.resolvedIconClass() || "pi pi-plus");
}
