import { Component, ViewEncapsulation } from "@angular/core";
import { StatusBadgeBase } from "@ui/base/status-badge.base";
import { AppIconMobile } from "src/app/shared/ui/mobile/app-icon/app-icon";

@Component({
  selector: "ili-status-badge",

  imports: [AppIconMobile],
  template: `
    <span
      class="ili-status-badge"
      [style.background]="styles.bg"
      [style.color]="styles.text"
      [style.border-color]="styles.border"
      [style.cursor]="clickable() ? 'pointer' : 'default'"
      (click)="onStatusClick()"
    >
      @if (showIcon()) {
        <ili-icon [icon]="getIcon()" class="ili-status-badge-icon" />
      }
      {{ getStatusText() }}
    </span>
  `,
  styles: [
    `
      .ili-status-badge {
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
      .ili-status-badge:active {
        opacity: 0.7;
      }
      .ili-status-badge-icon {
        font-size: 0.85rem;
        line-height: 1;
        display: inline-flex;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileStatusBadge extends StatusBadgeBase {}
