import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IwButtonBase } from "./iw-button-base";

@Component({
  selector: "iw-button-send-email",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="confirmSend()"
    >
      <app-icon [icon]="iconClass() || 'mdi:email-outline'" />
    </button>
  `,
})
export class IwButtonSendEmail extends IwButtonBase {
  confirmMessage = input<string>("Deseas enviar el correo electronico ahora?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("info");

  protected confirmSend(): void {
    if (this.disabled() || this.loading()) return;
    if (window.confirm(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}
