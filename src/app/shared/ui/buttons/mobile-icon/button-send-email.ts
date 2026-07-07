import { CommonModule } from "@angular/common";
import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";
import { confirmAction } from "../shared/confirm";

@Component({
  selector: "ii-button-send-email",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="confirmSend()"
    >
      <app-icon [icon]="iconClass() || 'mdi:email-outline'" slot="icon-only" />
    </ion-button>
  `,
})
export class MobileButtonIconSendEmail extends MobileButtonBase {
  confirmMessage = input<string>("Deseas enviar el correo electronico ahora?");
  confirmed = output<void>();

  protected confirmSend(): void {
    if (this.disabled() || this.loading()) return;
    if (confirmAction(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}

