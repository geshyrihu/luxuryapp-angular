import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { AlertController, IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronForwardOutline, mailOutline } from "ionicons/icons";
import { TooltipModule } from "primeng/tooltip";
import Swal from "sweetalert2";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-send-email",
  imports: [CommonModule, TooltipModule, AppIcon, IonItem, IonLabel, IonIcon],
  template: `
    @if (platform.isMobile()) {
      <ion-item button detail="false" lines="none"
        [disabled]="disabled()" [class]="customClass()"
        (click)="confirmSend($event)"
        style="--background:#eef3ff;--background-activated:#dbeafe;--border-radius:14px;
               --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
               margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
      >
        <div slot="start" style="width:38px;height:38px;border-radius:10px;background:#bfdbfe;
             display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
          <ion-icon name="mail-outline" style="font-size:20px;color:#1d4ed8;" />
        </div>
        <ion-label style="font-weight:600;font-size:15px;color:#1e293b;">
          {{ label() || "Enviar correo" }}
        </ion-label>
        <ion-icon name="chevron-forward-outline" slot="end" style="color:#94a3b8;font-size:16px;" />
      </ion-item>
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="btnClasses() + ' ' + customClass()"
        [ngClass]="customNgClass()"
        (click)="confirmSend($event)"
        [pTooltip]="pTooltip() || label() || 'Enviar correo'"
        tooltipPosition="top"
      >
        <span [class]="iconShellClasses(showLabelOnDesktop())" aria-hidden="true">
          <app-icon [icon]="finalIcon()" />
        </span>
        @if (showLabelOnDesktop()) {
          <span>{{ label() || "Enviar" }}</span>
        }
      </button>
    }
  `,
})
export class CustomButtonSendEmail extends BaseButton {
  protected readonly platform = inject(PlatformService);
  private readonly alertCtrl = inject(AlertController);

  override text = input<boolean>(true);
  override rounded = input<boolean>(true);

  pTooltip = input<string>("");
  confirmHeader = input<string>("Enviar correo electronico");
  confirmMessage = input<string>("Desea enviar el correo electronico ahora?");
  confirmAcceptLabel = input<string>("Si, enviar");
  confirmRejectLabel = input<string>("Cancelar");

  confirmed = output<void>();
  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:email-outline");

  constructor() {
    super();
    addIcons({ mailOutline, chevronForwardOutline });
  }

  async confirmSend(event: Event): Promise<void> {
    if (this.platform.isMobile()) {
      const alert = await this.alertCtrl.create({
        header: this.confirmHeader(),
        message: this.confirmMessage(),
        buttons: [
          { text: this.confirmRejectLabel(), role: "cancel" },
          { text: this.confirmAcceptLabel(), role: "confirm", handler: () => this.confirmed.emit() },
        ],
      });
      await alert.present();
    } else {
      const result = await Swal.fire({
        title: this.confirmHeader(), text: this.confirmMessage(), icon: "info",
        showCancelButton: true, confirmButtonText: this.confirmAcceptLabel(),
        cancelButtonText: this.confirmRejectLabel(), reverseButtons: true,
        focusConfirm: false, focusCancel: false,
        customClass: { container: "my-swal-container" },
      });
      if (result.isConfirmed) this.confirmed.emit();
    }
  }
}
