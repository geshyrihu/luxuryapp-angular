import { CommonModule } from "@angular/common";
import { Component, inject, input, output } from "@angular/core";
import { AlertController, IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronForwardOutline, mailOutline } from "ionicons/icons";
import { BaseIonicButton } from "../base/base-ionic-button";

@Component({
  selector: "ion-button-send-email",
  imports: [CommonModule, IonItem, IonLabel, IonIcon],
  template: `
    <ion-item button detail="false" lines="none"
      [disabled]="disabled()" [class]="customClass()"
      (click)="confirmSend($event)"
      style="--background:var(--primary-50);--background-activated:var(--primary-100);--border-radius:14px;
             --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
             margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
    >
      <div slot="start" style="width:38px;height:38px;border-radius:10px;background:var(--primary-200);
           display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
        <ion-icon name="mail-outline" style="font-size:20px;color:var(--primary-600);" />
      </div>
      <ion-label style="font-weight:600;font-size:15px;color:var(--secondary-800);">
        {{ label() || "Enviar correo" }}
      </ion-label>
      <ion-icon name="chevron-forward-outline" slot="end" style="color:var(--secondary-400);font-size:16px;" />
    </ion-item>
  `,
})
export class IonButtonSendEmail extends BaseIonicButton {
  private readonly alertCtrl = inject(AlertController);

  confirmHeader = input<string>("Enviar correo electrónico");
  confirmMessage = input<string>("¿Desea enviar el correo electrónico ahora?");
  confirmAcceptLabel = input<string>("Sí, enviar");
  confirmRejectLabel = input<string>("Cancelar");

  confirmed = output<void>();

  async confirmSend(event: Event): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.confirmHeader(),
      message: this.confirmMessage(),
      buttons: [
        { text: this.confirmRejectLabel(), role: "cancel" },
        { text: this.confirmAcceptLabel(), role: "confirm", handler: () => this.confirmed.emit() },
      ],
    });
    await alert.present();
  }

  constructor() {
    super();
    addIcons({ mailOutline, chevronForwardOutline });
  }
}
