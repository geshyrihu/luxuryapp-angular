import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { IonFab, IonFabButton, IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { addOutline, chevronForwardOutline } from "ionicons/icons";
import { TooltipModule } from "primeng/tooltip";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-add",
  imports: [CommonModule, TooltipModule, AppIcon, IonItem, IonLabel, IonIcon, IonFab, IonFabButton],
  template: `
    @if (platform.isMobile()) {
      @if (fabMode()) {
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button
            color="primary"
            [disabled]="disabled()"
            (click)="clicked.emit($event)"
            style="--border-radius:16px;--box-shadow:0 6px 20px rgba(0,61,155,0.35);"
          >
            <ion-icon name="add-outline" />
          </ion-fab-button>
        </ion-fab>
      } @else {
        <ion-item button detail="false" lines="none"
          [disabled]="disabled()" [class]="customClass()"
          (click)="clicked.emit($event)"
          style="--background:#eef3ff;--background-activated:#dbeafe;--border-radius:14px;
                 --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
                 margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
        >
          <div slot="start" style="width:38px;height:38px;border-radius:10px;background:#bfdbfe;
               display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
            <ion-icon name="add-outline" style="font-size:20px;color:#1d4ed8;" />
          </div>
          <ion-label style="font-weight:600;font-size:15px;color:#1e293b;">
            {{ label() || "Agregar" }}
          </ion-label>
          <ion-icon name="chevron-forward-outline" slot="end" style="color:#94a3b8;font-size:16px;" />
        </ion-item>
      }
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="btnClasses() + ' ' + customClass()"
        [ngClass]="customNgClass()"
        (click)="clicked.emit($event)"
        [pTooltip]="ngbTooltip() || label() || 'Agregar'"
        tooltipPosition="top"
      >
        <span [class]="iconShellClasses(true)" aria-hidden="true">
          <app-icon [icon]="finalIcon()" />
        </span>
        <span>{{ label() || "Agregar" }}</span>
      </button>
    }
  `,
})
export class CustomButtonAdd extends BaseButton {
  protected readonly platform = inject(PlatformService);

  override severity = input<any>("primary");
  override variant = input<"outlined" | "text" | null>("outlined");
  override fluid = input<boolean>(true);

  fabMode = input<boolean>(false);

  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:plus");

  constructor() {
    super();
    addIcons({ addOutline, chevronForwardOutline });
  }
}
