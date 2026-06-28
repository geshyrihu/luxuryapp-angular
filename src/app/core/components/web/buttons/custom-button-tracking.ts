import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { IonBadge, IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { notificationsOutline } from "ionicons/icons";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { TooltipModule } from "primeng/tooltip";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../../buttons/base/base-button";

@Component({
  selector: "custom-button-tracking",
  imports: [CommonModule, TooltipModule, OverlayBadgeModule, AppIcon, IonButton, IonIcon, IonBadge],
  template: `
    @if (platform.isMobile()) {
      <div style="position:relative;display:inline-flex;">
        <ion-button
          [disabled]="disabled()"
          fill="clear"
          size="small"
          (click)="onTrackingClick($event)"
          style="--border-radius:10px;--background:#f1f5f9;--background-activated:#e2e8f0;
                 --color:#475569;--padding-start:8px;--padding-end:8px;width:40px;height:40px;"
        >
          <ion-icon name="notifications-outline" slot="icon-only" style="font-size:20px;" />
        </ion-button>
        @if (badgeCount() && badgeCount()! > 0) {
          <ion-badge color="danger"
            style="position:absolute;top:2px;right:2px;font-size:0.6rem;font-weight:700;
                   min-width:18px;height:18px;padding:2px 4px;border-radius:9px;
                   pointer-events:none;box-shadow:0 1px 4px rgba(220,38,38,0.4);">
            {{ badgeCount()! > 99 ? "99+" : badgeCount() }}
          </ion-badge>
        }
      </div>
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="btnClasses() + ' relative ' + customClass()"
        [ngClass]="customNgClass()"
        (click)="onTrackingClick($event)"
        [pTooltip]="tooltipText() || label() || 'Seguimiento'"
        tooltipPosition="bottom"
      >
        <p-overlaybadge
          [value]="badgeCount() ?? 0"
          severity="danger"
          [style]="{ 'font-size': '0.6rem', 'min-width': '1rem', 'height': '1rem', 'line-height': '1rem', 'padding': '0 0.2rem' }"
          [badgeDisabled]="!badgeCount() || badgeCount()! <= 0"
        >
          <app-icon [icon]="finalIcon()" />
        </p-overlaybadge>
      </button>
    }
  `,
  styles: [],
})
export class CustomButtonTracking extends BaseButton {
  protected readonly platform = inject(PlatformService);

  override text = input<boolean>(true);
  override rounded = input<boolean>(true);

  tooltipText = input<string>("");
  badgeCount = input<number | null | undefined>(undefined);
  ticketId = input<string | number | null>(null);
  title = input<string>("Seguimiento");

  clickTracking = output<{ ticketId: string | number | null; title: string }>();
  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:map-marker");

  constructor() {
    super();
    addIcons({ notificationsOutline });
  }

  onTrackingClick(event: MouseEvent): void {
    event.stopPropagation();
    this.clickTracking.emit({ ticketId: this.ticketId(), title: this.title() });
  }
}


