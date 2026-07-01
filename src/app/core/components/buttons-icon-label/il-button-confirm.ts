import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IlButtonBase } from "./il-button-base";

@Component({
  selector: "il-button-confirm",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="confirmAction($event)"
    >
      @if (emoji()) {
        <span>{{ emoji() }}</span>
      } @else {
        <app-icon [icon]="iconClass() || 'mdi:check-circle-outline'" />
      }
      <span>{{ label() || "Confirmar" }}</span>
    </button>
  `,
})
export class IlButtonConfirm extends IlButtonBase {
  swalText = input<string>("Estas seguro de continuar?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("success");

  protected confirmAction(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (window.confirm(this.swalText())) {
      this.confirmed.emit();
    }
  }
}
