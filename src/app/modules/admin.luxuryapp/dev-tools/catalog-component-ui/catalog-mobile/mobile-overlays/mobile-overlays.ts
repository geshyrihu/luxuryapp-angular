import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AlertController, IonButton, ToastController } from "@ionic/angular";

@Component({
  selector: "app-mobile-overlays",
  imports: [IonButton],
  template: `<div class="mobile-card"><div class="mobile-card-header">Overlays</div><div class="mobile-card-body d-flex gap-2"><ion-button (click)="showAlert()">Alert</ion-button><ion-button fill="outline" (click)="showToast()">Toast</ion-button></div></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileOverlays {
  private readonly alerts = inject(AlertController);
  private readonly toasts = inject(ToastController);
  async showAlert() { const alert = await this.alerts.create({ header: "Confirmación", message: "Demo de alerta Ionic", buttons: ["OK"] }); await alert.present(); }
  async showToast() { const toast = await this.toasts.create({ message: "Demo de toast Ionic", duration: 1500 }); await toast.present(); }
}
