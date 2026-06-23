import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { IonButton, IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { saveOutline, syncOutline } from "ionicons/icons";
import { TooltipModule } from "primeng/tooltip";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../app-icon/app-icon.component";
import { ButtonType } from "../../../enums/button-type";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-save",
  imports: [CommonModule, TooltipModule, AppIcon, IonButton, IonIcon, IonSpinner],
  template: `
    @if (platform.isMobile()) {
      <ion-button
        [disabled]="disabled() || submitting()"
        expand="block"
        type="submit"
        style="
          --border-radius: 14px;
          --background: linear-gradient(135deg, var(--primary-400,#6687b3), var(--primary-500,#0b3164));
          --background-activated: var(--primary-600,#092953);
          --box-shadow: 0 4px 16px rgba(21,94,192,0.35);
          --color: #ffffff;
          height: 52px;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.4px;
        "
        (click)="clicked.emit($event)"
      >
        @if (submitting()) {
          <ion-spinner name="crescent" style="color:#fff;width:20px;height:20px;" />
        } @else {
          <ion-icon [name]="finalIonicIcon()" slot="start" />
          {{ finalLabel() }}
        }
      </ion-button>
    } @else {
      <div class="text-right">
        <button
          [type]="type() || 'submit'"
          [disabled]="disabled() || submitting()"
          [class]="btnClasses() + ' ' + customClass()"
          [ngClass]="customNgClass()"
          (click)="clicked.emit($event)"
        >
          <span [class]="iconShellClasses(true)" aria-hidden="true">
            @if (submitting()) {
              <app-icon icon="mdi:loading" class="ds-animate-spin" />
            } @else {
              <app-icon [icon]="finalIcon()" />
            }
          </span>
          <span>{{ finalLabel() }}</span>
        </button>
      </div>
    }
  `,
})
export class CustomButtonSave extends BaseButton {
  protected readonly platform = inject(PlatformService);

  override severity = input<any>("primary");
  override variant = input<"outlined" | "text" | null>("outlined");
  override type = input<ButtonType>(ButtonType.Submit);
  override size = input<any>("small");

  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });

  finalIcon = computed(
    () => this.icon() || this.iconClass() || (this.propertyId() ? "mdi:sync" : "mdi:content-save"),
  );

  finalIonicIcon = computed(() => this.propertyId() ? "sync-outline" : "save-outline");

  constructor() {
    super();
    addIcons({ saveOutline, syncOutline });
  }
}
