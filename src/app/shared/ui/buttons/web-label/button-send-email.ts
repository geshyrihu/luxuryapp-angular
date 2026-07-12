import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";
import { confirmAction } from "../shared/confirm";

@Component({
  selector: "il-button-send-email",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="confirmSend()"
    >
      <app-icon [icon]="iconClass() || 'mdi:email-outline'" />
      <span>{{ label() || "Enviar correo" }}</span>
    </button>
  `,
})
export class WebButtonLabelSendEmail extends BaseButton {
  confirmMessage = input<string>("Deseas enviar el correo electronico ahora?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("info");

  protected confirmSend(): void {
    if (this.disabled() || this.loading()) return;
    if (confirmAction(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}
