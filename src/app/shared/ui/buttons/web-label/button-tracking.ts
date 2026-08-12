import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";
import { TrackingEvent } from "../shared/tracking";

@Component({
  selector: "il-button-tracking",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="onTrackingClick($event)"
    >
      <app-icon [icon]="resolvedIconClass() || 'material-symbols-light:notifications-outline'" />
      <span>{{ label() || "Seguimiento" }}</span>
      @if (badgeCount() && badgeCount()! > 0) {
        <span
          class="absolute top-0 right-0 inline-flex align-items-center justify-content-center text-xs border-circle bg-red-500 text-white"
          style="min-width:1.1rem;height:1.1rem;transform:translate(30%,-30%);"
        >
          {{ badgeCount()! > 99 ? "99+" : badgeCount() }}
        </span>
      }
    </button>
  `,
})
export class WebButtonLabelTracking extends BaseButton {
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
