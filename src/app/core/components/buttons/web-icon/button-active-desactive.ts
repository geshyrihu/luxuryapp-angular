import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button-active-desactive",
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
        [icon]="state() ? 'fluent-color:lock-16' : 'fluent-color:unlock-16'"
      />
    </button>
  `,
})
export class WebButtonIconActiveDesactive extends BaseButton {
  state = input<boolean>(true);

  stateChange = output<boolean>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("secondary");

  protected toggleState(): void {
    if (this.disabled() || this.loading()) return;
    this.stateChange.emit(!this.state());
  }
}
