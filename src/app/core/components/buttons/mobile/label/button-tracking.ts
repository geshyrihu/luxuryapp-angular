import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { IonBadge, IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";
import { TrackingEvent } from "../../shared/tracking";

@Component({
  selector: "ili-button-tracking",
  standalone: true,
  imports: [CommonModule, IonButton, IonBadge, AppIcon],
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="fill()"
      [color]="color()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="onTrackingClick($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:bell-outline'" slot="start" />
      {{ label() || "Seguimiento" }}
      @if (badgeCount() && badgeCount()! > 0) {
        <ion-badge color="danger" slot="end">
          {{ badgeCount()! > 99 ? "99+" : badgeCount() }}
        </ion-badge>
      }
    </ion-button>
  `,
})
export class MobileButtonLabelTracking extends MobileButtonBase {
  badgeCount = input<number | null | undefined>(undefined);
  ticketId = input<string | number | null>(null);
  trackingTitle = input<string>("Seguimiento");

  clickTracking = output<TrackingEvent>();

  protected onTrackingClick(event: Event): void {
    if (this.disabled() || this.loading()) return;
    this.clickTracking.emit({
      ticketId: this.ticketId(),
      title: this.trackingTitle(),
    });
  }
}
