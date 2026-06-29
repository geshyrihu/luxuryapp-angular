import { CommonModule } from "@angular/common";
import { Component, inject, input, output } from "@angular/core";
import { AlertController, IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronForwardOutline, trashOutline } from "ionicons/icons";
import { BaseIonicButton } from "../../shared/buttons/base/base-ionic-button";

@Component({
  selector: "ion-button-delete",
  imports: [CommonModule, IonItem, IonLabel, IonIcon],
  template: `
    <ion-item button detail="false" lines="none"
      [disabled]="disabled()" [class]="customClass()"
      (click)="confirmDelete($event)"
      style="--background:#fff5f5;--background-activated:#fee2e2;--border-radius:14px;
             --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
             margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
    >
      <div slot="start" style="width:38px;height:38px;border-radius:10px;background:#fecaca;
           display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
        <ion-icon name="trash-outline" style="font-size:20px;color:#dc2626;" />
      </div>
      <ion-label style="font-weight:600;font-size:15px;color:#dc2626;">
        {{ label() || "Eliminar" }}
      </ion-label>
      <ion-icon name="chevron-forward-outline" slot="end" style="color:#fca5a5;font-size:16px;" />
    </ion-item>
  `,
})
export class IonButtonDelete extends BaseIonicButton {
  private readonly alertCtrl = inject(AlertController);

  confirmHeader = input<string>("Confirmar eliminación");
  confirmMessage = input<string>("¿Está seguro de que desea eliminar este registro?");
  confirmAcceptLabel = input<string>("Sí, eliminar");
  confirmRejectLabel = input<string>("Cancelar");

  confirmed = output<void>();

  async confirmDelete(event: Event): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.confirmHeader(),
      message: this.confirmMessage(),
      buttons: [
        { text: this.confirmRejectLabel(), role: "cancel" },
        { text: this.confirmAcceptLabel(), role: "confirm", cssClass: "ion-color-danger", handler: () => this.confirmed.emit() },
      ],
    });
    await alert.present();
  }

  constructor() {
    super();
    addIcons({ trashOutline, chevronForwardOutline });
  }
}


