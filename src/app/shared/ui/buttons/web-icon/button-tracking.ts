import { CommonModule } from "@angular/common";
import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";
import { TrackingEvent } from "../shared/tracking";

@Component({
  selector: "iw-button-tracking",
  standalone: true,
  imports: [CommonModule, AppIcon, OverlayBadgeModule],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="onTrackingClick($event)"
    >
      <p-overlaybadge
        [value]="badgeCount()"
        severity="danger"
        [style]="{
          'font-size': '0.6rem',
          'min-width': '1rem',
          height: '1rem',
          'line-height': '1rem',
          padding: '0 0.2rem',
        }"
        [badgeDisabled]="badgeCount() === 0"
      >
        <app-icon [icon]="iconClass() || 'fluent-color:alert-24'" />
      </p-overlaybadge>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host ::ng-deep .p-overlaybadge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        border: none !important;
      }

      :host ::ng-deep .p-overlaybadge > iconify-icon {
        width: 1em;
        height: 1em;
        display: inline-block;
      }

      :host ::ng-deep .p-overlaybadge .p-overlay-badge {
        transform: translate(30%, -30%);
      }
    `,
  ],
})
export class WebButtonIconTracking extends BaseButton {
  badgeCount = input<number | null | undefined>(undefined);
  ticketId = input<string | number | null>(null);
  trackingTitle = input<string>("Seguimiento");

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("secondary");

  clickTracking = output<TrackingEvent>();

  protected onTrackingClick(event: Event): void {
    if (this.disabled() || this.loading()) return;
    this.clickTracking.emit({
      ticketId: this.ticketId(),
      title: this.trackingTitle(),
    });
  }
}
