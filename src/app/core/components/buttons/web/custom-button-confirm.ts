import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { AlertController, IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { checkmarkOutline, chevronForwardOutline } from "ionicons/icons";
import { TooltipModule } from "primeng/tooltip";
import Swal from "sweetalert2";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-confirm",
  imports: [CommonModule, TooltipModule, AppIcon, IonItem, IonLabel, IonIcon],
  template: `
    @if (platform.isMobile()) {
      <ion-item button detail="false" lines="none"
        [disabled]="disabled()" [class]="customClass()"
        (click)="confirmAction($event)"
        style="--background:#f0fdf4;--background-activated:#dcfce7;--border-radius:14px;
               --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
               margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
      >
        <div slot="start" style="width:38px;height:38px;border-radius:10px;background:#bbf7d0;
             display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
          @if (emoji()) {
            <span style="font-size:20px;">{{ emoji() }}</span>
          } @else {
            <ion-icon name="checkmark-outline" style="font-size:20px;color:#15803d;" />
          }
        </div>
        <ion-label style="font-weight:600;font-size:15px;color:#15803d;">
          {{ label() || "Confirmar" }}
        </ion-label>
        <ion-icon name="chevron-forward-outline" slot="end" style="color:#86efac;font-size:16px;" />
      </ion-item>
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="btnClasses() + ' ' + customClass()"
        [ngClass]="customNgClass()"
        (click)="confirmAction($event)"
        [pTooltip]="pTooltip() || label() || 'Confirmar'"
        tooltipPosition="top"
      >
        <span [class]="iconShellClasses(showLabelOnDesktop())" aria-hidden="true">
          <app-icon [icon]="finalIcon()" />
        </span>
        @if (showLabelOnDesktop()) {
          <span>{{ label() || "Confirmar" }}</span>
        }
      </button>
    }
  `,
})
export class CustomButtonConfirm extends BaseButton {
  protected readonly platform = inject(PlatformService);
  private readonly alertCtrl = inject(AlertController);

  override text = input<boolean>(true);
  override severity = input<any>("success");
  override rounded = input<boolean>(false);
  override icon = input<string>("check");

  pTooltip = input<string>("");
  swalTitle = input<string>("Confirmar");
  swalText = input<string>("Esta seguro de que desea realizar esta accion?");
  swalConfirmButtonText = input<string>("Si, confirmar");
  swalCancelButtonText = input<string>("Cancelar");
  swalIcon = input<"success" | "warning" | "info" | "question">("question");

  confirmed = output<void>();
  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:check");

  constructor() {
    super();
    addIcons({ checkmarkOutline, chevronForwardOutline });
  }

  async confirmAction(event: Event): Promise<void> {
    if (this.platform.isMobile()) {
      const alert = await this.alertCtrl.create({
        header: this.swalTitle(),
        message: this.swalText(),
        buttons: [
          { text: this.swalCancelButtonText(), role: "cancel" },
          { text: this.swalConfirmButtonText(), role: "confirm", handler: () => this.confirmed.emit() },
        ],
      });
      await alert.present();
    } else {
      const result = await Swal.fire({
        title: this.swalTitle(), text: this.swalText(), icon: this.swalIcon(),
        showCancelButton: true, confirmButtonText: this.swalConfirmButtonText(),
        cancelButtonText: this.swalCancelButtonText(), reverseButtons: true,
        focusConfirm: false, focusCancel: false,
        customClass: { container: "my-swal-container" },
      });
      if (result.isConfirmed) this.confirmed.emit();
    }
  }
}
