import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ToastController } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  alertCircle,
  checkmarkCircle,
  close,
  informationCircle,
  warning,
} from "ionicons/icons";
import { ToastBase } from "../../base/toast.base";

@Component({
  selector: "ili-toast",
  template: ``,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MobileToast extends ToastBase {
  private toastController = inject(ToastController);

  constructor() {
    super();
    addIcons({
      checkmarkCircle,
      alertCircle,
      warning,
      informationCircle,
      close,
    });
  }

  async show(): Promise<void> {
    const ionToast = await this.toastController.create({
      message: this.detail()
        ? `${this.summary()}: ${this.detail()}`
        : this.summary(),
      duration: this.life(),
      color: this.ionColor(),
      position: "top",
      icon: this.ionIcon(),
      buttons: [{ side: "end", icon: "close", role: "cancel" }],
      cssClass: "custom-mobile-toast",
    });
    await ionToast.present();
  }
}
