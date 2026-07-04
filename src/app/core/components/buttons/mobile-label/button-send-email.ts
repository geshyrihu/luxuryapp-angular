import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";
import { confirmAction } from "../shared/confirm";

@Component({
  selector: "ili-button-send-email",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
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
export class MobileButtonLabelSendEmail extends MobileButtonBase {
  confirmMessage = input<string>("Deseas enviar el correo electronico ahora?");
  confirmed = output<void>();

  protected confirmSend(): void {
    if (this.disabled() || this.loading()) return;
    if (confirmAction(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}

