import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { AppBadge } from "../../web/badge/badge";
import { BaseButton } from "../base/base-button";
import { TrackingEvent } from "../shared/tracking";

@Component({
  selector: "iw-button-tracking",

  imports: [AppIcon, AppBadge],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="onTrackingClick($event)"
    >
      <span class="tracking-badge-anchor">
        <app-icon [icon]="resolvedIconClass() || IconCatalog.Alert" />
        @if (badgeCount()) {
          <app-badge [value]="badgeCount()!" color="danger" size="small" />
        }
      </span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .tracking-badge-anchor {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .tracking-badge-anchor app-badge {
        position: absolute;
        top: -0.35rem;
        right: -0.45rem;
        font-size: 0.6rem;
        line-height: 1rem;
      }
    `,
  ],
})
export class WebButtonIconTracking extends BaseButton {
  protected readonly IconCatalog = AppIconCatalog;
  badgeCount = input<number | null | undefined>(undefined);
  ticketId = input<string | number | null>(null);
  trackingTitle = input<string>("Seguimiento");

  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
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
