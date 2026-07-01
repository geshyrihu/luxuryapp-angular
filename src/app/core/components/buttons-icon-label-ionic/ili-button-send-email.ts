import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IliButtonBase } from "./ili-button-base";

@Component({
  selector: "ili-button-send-email",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="fill()"
      [color]="color()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="confirmSend()"
    >
      <app-icon [icon]="iconClass() || 'mdi:email-outline'" slot="start" />
      {{ label() || "Enviar correo" }}
    </ion-button>
  `,
})
export class IliButtonSendEmail extends IliButtonBase {
  confirmMessage = input<string>("Deseas enviar el correo electronico ahora?");
  confirmed = output<void>();

  protected confirmSend(): void {
    if (this.disabled() || this.loading()) return;
    if (window.confirm(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}
