import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { IonBadge, IonButton } from "@ionic/angular";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import { MobileButtonBase } from "../mobile-button-base";
import { TrackingEvent } from "../shared/tracking";

@Component({
  selector: "ili-button-tracking",

  imports: [IonButton, IonBadge, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="onTrackingClick($event)"
    >
      <lux-icon
        [icon]="resolvedIconClass() || IconCatalog.BellOutline"
        slot="start"
      />
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
  protected override readonly IconCatalog = AppIconCatalog;
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
