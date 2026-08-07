import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { StatusBadgeBase } from "@ui/base/status-badge.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

// Re-export para consumidores existentes que importan desde este módulo.
export {
  EStatus,
  ETypeEmpresa,
  type StatusClickEvent,
} from "@ui/base/status-badge.base";

@Component({
  selector: "app-status-badge",
  imports: [LxTooltipDirective, AppIcon],
  template: `
    <span
      class="status-badge"
      [style.background]="styles.bg"
      [style.color]="styles.text"
      [style.border-color]="styles.border"
      [style.cursor]="clickable() ? 'pointer' : 'default'"
      [lxTooltip]="tooltip()"
      (click)="onStatusClick()"
    >
      @if (showIcon()) {
        <app-icon [icon]="getIcon()" class="status-badge-icon" />
      }
      {{ getStatusText() }}
    </span>
  `,
  styles: [
    `
      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.15rem 0.6rem;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        border-radius: 9999px;
        border: 1px solid transparent;
        white-space: nowrap;
        user-select: none;
        transition: opacity 0.15s;
      }
      .status-badge:hover {
        opacity: 0.85;
      }
      .status-badge-icon {
        font-size: 0.8rem;
        line-height: 1;
        display: inline-flex;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class StatusBadge extends StatusBadgeBase {}
