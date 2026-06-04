import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-active-desactive",
  imports: [CommonModule, TooltipModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="stateClasses()"
      (click)="toggleState()"
      [pTooltip]="dynamicLabel()"
      [tooltipPosition]="tooltipPosition()"
    >
      <span [class]="dynamicIconShellClass()" aria-hidden="true">
        <i [class]="dynamicIcon()"></i>
      </span>
      <span>{{ dynamicLabel() }}</span>
    </button>
  `,
})
export class CustomBtnActiveDesactive extends BaseButton {
  override severity = input<any>("secondary");
  override fluid = input<boolean>(true);

  state = input<boolean>(true);
  activasLabel = input<string>("Activos");
  inactivasLabel = input<string>("Inactivos");

  stateChange = output<boolean>();

  dynamicLabel = computed(() =>
    this.state() ? this.inactivasLabel() : this.activasLabel(),
  );

  dynamicIcon = computed(() =>
    this.state() ? "pi pi-eye-slash" : "pi pi-eye",
  );

  dynamicIconShellClass = computed(() =>
    [
      "btn-icon-shell",
      "btn-icon-shell--soft",
      "btn-icon-shell--with-label",
      this.state()
        ? "bg-white-alpha-20 text-green-700"
        : "bg-white-alpha-20 text-red-700",
    ].join(" "),
  );

  stateClasses = computed(() => {
    const base = "btn no-print w-full ";
    return this.state()
      ? base + "btn-outline-success"
      : base + "btn-outline-danger";
  });

  toggleState(): void {
    this.stateChange.emit(!this.state());
  }
}
