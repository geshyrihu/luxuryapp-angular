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
            style="--border-radius:16px;--box-shadow:0 6px 20px color-mix(in srgb, var(--primary-600) 35%, transparent);"
          >
            <ion-icon name="add-outline" />
          </ion-fab-button>
        </ion-fab>
      } @else {
        <ion-item button detail="false" lines="none"
          [disabled]="disabled()" [class]="customClass()"
          (click)="clicked.emit($event)"
          style="--background:var(--primary-50);--background-activated:var(--primary-100);--border-radius:8px;
                 --padding-start:10px;--inner-padding-end:14px;--min-height:44px;
                 margin-bottom:4px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
        >
          <div slot="start" style="width:32px;height:32px;border-radius:8px;background:var(--primary-200);
               display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
            <ion-icon name="add-outline" style="font-size:17px;color:var(--primary-600);" />
          </div>
          <ion-label style="font-weight:600;font-size:13px;color:var(--secondary-800);">
            {{ label() || "Agregar" }}
          </ion-label>
          <ion-icon name="chevron-forward-outline" slot="end" style="color:var(--secondary-400);font-size:14px;" />
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
