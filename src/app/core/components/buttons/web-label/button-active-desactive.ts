import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "il-button-active-desactive",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="toggleState()"
    >
      <app-icon
        [icon]="state() ? 'mdi:lock-outline' : 'mdi:lock-open-variant-outline'"
      />
      <span>{{ state() ? inactivasLabel() : activasLabel() }}</span>
    </button>
  `,
})
export class WebButtonLabelActiveDesactive extends BaseButton {
  state = input<boolean>(true);
  activasLabel = input<string>("Activos");
  inactivasLabel = input<string>("Inactivos");

  stateChange = output<boolean>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "outline",
  );
  override severity = input<any>("secondary");

  protected toggleState(): void {
    if (this.disabled() || this.loading()) return;
    this.stateChange.emit(!this.state());
  }
}

