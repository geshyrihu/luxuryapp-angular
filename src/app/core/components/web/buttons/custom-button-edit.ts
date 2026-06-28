import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronForwardOutline, createOutline } from "ionicons/icons";
import { TooltipModule } from "primeng/tooltip";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../../buttons/base/base-button";

@Component({
  selector: "custom-button-edit",
  imports: [CommonModule, TooltipModule, AppIcon, IonItem, IonLabel, IonIcon],
  template: `
    @if (platform.isMobile()) {
      <ion-item button detail="false" lines="none"
        [disabled]="disabled()" [class]="customClass()"
        (click)="clicked.emit($event)"
        style="--background:var(--primary-50);--background-activated:var(--primary-100);--border-radius:8px;
               --padding-start:10px;--inner-padding-end:14px;--min-height:44px;
               margin-bottom:4px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
      >
        <div slot="start" style="width:32px;height:32px;border-radius:8px;background:var(--primary-200);
             display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
          <ion-icon name="create-outline" style="font-size:17px;color:var(--primary-600);" />
        </div>
        <ion-label style="font-weight:600;font-size:13px;color:var(--secondary-800);">
          {{ label() || "Editar" }}
        </ion-label>
        <ion-icon name="chevron-forward-outline" slot="end" style="color:var(--secondary-400);font-size:14px;" />
      </ion-item>
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="btnClasses() + ' ' + customClass()"
        [ngClass]="customNgClass()"
        (click)="clicked.emit($event)"
        [pTooltip]="ngbTooltip() || label() || 'Editar'"
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
export class CustomButtonEdit extends BaseButton {
  protected readonly platform = inject(PlatformService);

  override text = input<boolean>(true);
  override severity = input<any>("info");
  override rounded = input<boolean>(true);
  override size = input<any>("small");

  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:pencil");

  constructor() {
    super();
    addIcons({ createOutline, chevronForwardOutline });
  }
}


