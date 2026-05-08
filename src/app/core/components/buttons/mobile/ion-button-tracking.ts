import { Component, input, output } from "@angular/core";
import { IonBadge, IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { notificationsOutline } from "ionicons/icons";
import { BaseIonicButton } from "../base/base-ionic-button";

@Component({
  selector: "ion-button-tracking",
  imports: [IonButton, IonIcon, IonBadge],
  template: `
    @if (mostrar()) {
      <div style="position: relative; display: inline-flex;">
        <ion-button
          [disabled]="disabled()"
          fill="clear"
          size="small"
          (click)="onTrackingClick($event)"
          style="
            --border-radius: 10px;
            --background: #f1f5f9;
            --background-activated: #e2e8f0;
            --color: #475569;
            --padding-start: 8px;
            --padding-end: 8px;
            width: 40px; height: 40px;
          "
        >
          <ion-icon name="notifications-outline" slot="icon-only"
            style="font-size: 20px;">
          </ion-icon>
        </ion-button>

        @if (badgeCount() && badgeCount()! > 0) {
          <ion-badge
            color="danger"
            style="
              position: absolute;
              top: 2px; right: 2px;
              font-size: 0.6rem;
              font-weight: 700;
              min-width: 18px; height: 18px;
              padding: 2px 4px;
              border-radius: 9px;
              pointer-events: none;
              box-shadow: 0 1px 4px rgba(220,38,38,0.4);
            "
          >
            {{ badgeCount()! > 99 ? "99+" : badgeCount() }}
          </ion-badge>
        }
      </div>
    }
  `,
})
export class IonButtonTracking extends BaseIonicButton {
  override color = input<string>("medium");

  badgeCount = input<number | null | undefined>(undefined);
  ticketId = input<string | number | null>(null);
  title = input<string>("Seguimiento");

  clickTracking = output<{ ticketId: string | number | null; title: string }>();

  constructor() {
    super();
    addIcons({ notificationsOutline });
  }

  onTrackingClick(event: MouseEvent): void {
    event.stopPropagation();
    this.clickTracking.emit({ ticketId: this.ticketId(), title: this.title() });
  }
}









