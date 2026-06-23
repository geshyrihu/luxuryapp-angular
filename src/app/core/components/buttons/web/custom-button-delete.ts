import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { AlertController, IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronForwardOutline, trashOutline } from "ionicons/icons";
import { TooltipModule } from "primeng/tooltip";
import Swal from "sweetalert2";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-delete",
  imports: [CommonModule, TooltipModule, AppIcon, IonItem, IonLabel, IonIcon],
  template: `
    @if (platform.isMobile()) {
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
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="btnClasses() + ' ' + customClass()"
        [ngClass]="customNgClass()"
        (click)="confirmDelete($event)"
        [pTooltip]="ngbTooltip() || label() || 'Eliminar'"
        [tooltipPosition]="tooltipPosition()"
      >
        <span [class]="iconShellClasses(showLabelOnDesktop() && !!label())" aria-hidden="true">
          <app-icon [icon]="finalIcon()" />
        </span>
        @if (showLabelOnDesktop() && label()) {
          <span>{{ label() }}</span>
        }
      </button>
    }
  `,
})
export class CustomButtonDelete extends BaseButton {
  protected readonly platform = inject(PlatformService);
  private readonly alertCtrl = inject(AlertController);

  override text = input<boolean>(true);
  override severity = input<any>("danger");
  override rounded = input<boolean>(true);
  override size = input<any>("small");

  confirmHeader = input<string>("Confirmar eliminacion");
  confirmMessage = input<string>("Esta seguro de que desea eliminar este registro?");
  confirmAcceptLabel = input<string>("Si, eliminar");
  confirmRejectLabel = input<string>("Cancelar");
  isLinked = input<boolean>(false);
  confirmLinkedMessage = input<string>(
    "Este registro esta vinculado a otros registros. Esta seguro de continuar?",
  );

  confirmed = output<void>();
  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:delete");

  constructor() {
    super();
    addIcons({ trashOutline, chevronForwardOutline });
  }

  async confirmDelete(event: Event): Promise<void> {
    const message = this.isLinked() ? this.confirmLinkedMessage() : this.confirmMessage();

    if (this.platform.isMobile()) {
      const alert = await this.alertCtrl.create({
        header: this.confirmHeader(),
        message,
        buttons: [
          { text: this.confirmRejectLabel(), role: "cancel" },
          { text: this.confirmAcceptLabel(), role: "confirm", cssClass: "ion-color-danger", handler: () => this.confirmed.emit() },
        ],
      });
      await alert.present();
    } else {
      const result = await Swal.fire({
        title: this.confirmHeader(), text: message, icon: "warning",
        showCancelButton: true, confirmButtonText: this.confirmAcceptLabel(),
        cancelButtonText: this.confirmRejectLabel(), reverseButtons: true,
        focusConfirm: false, focusCancel: false,
        customClass: { container: "my-swal-container" },
      });
      if (result.isConfirmed) this.confirmed.emit();
    }
  }
}
