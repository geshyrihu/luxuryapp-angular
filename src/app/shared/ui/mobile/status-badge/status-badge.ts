import { Component, ViewEncapsulation } from "@angular/core";
import { StatusBadgeBase } from "@ui/core/status-badge.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-status-badge-mobile",

  imports: [AppIconMobile],
  template: `
    <span
      class="lux-status-badge-mobile"
      [style.background]="styles.bg"
      [style.color]="styles.text"
      [style.border-color]="styles.border"
      [style.cursor]="clickable() ? 'pointer' : 'default'"
      (click)="onStatusClick()"
    >
      @if (showIcon()) {
        <lux-icon-mobile [icon]="getIcon()" class="lux-status-badge-mobile-icon" />
      }
      {{ getStatusText() }}
    </span>
  `,
  styles: [
    `
      .lux-status-badge-mobile {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.7rem;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        border-radius: 9999px;
        border: 1px solid transparent;
        white-space: nowrap;
        user-select: none;
      }
      .lux-status-badge-mobile:active {
        opacity: 0.7;
      }
      .lux-status-badge-mobile-icon {
        font-size: 0.85rem;
        line-height: 1;
        display: inline-flex;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileStatusBadge extends StatusBadgeBase {}

