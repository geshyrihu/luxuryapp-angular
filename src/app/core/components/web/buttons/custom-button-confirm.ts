import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { WebButtonBase } from "./web-button-base";

@Component({
  selector: "custom-button-confirm",
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
      @if (showLabelOnDesktop()) {
        <span>{{ label() || "Confirmar" }}</span>
      }
    </button>
  `,
})
export class CustomButtonConfirm extends WebButtonBase {
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
