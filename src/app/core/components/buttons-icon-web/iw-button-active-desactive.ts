import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IwButtonBase } from "./iw-button-base";

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
      <app-icon [icon]="state() ? 'mdi:lock-outline' : 'mdi:lock-open-variant-outline'" />
    </button>
  `,
})
export class IwBtnActiveDesactive extends IwButtonBase {
  state = input<boolean>(true);

  stateChange = output<boolean>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("secondary");

  protected toggleState(): void {
    if (this.disabled() || this.loading()) return;
    this.stateChange.emit(!this.state());
  }
}
