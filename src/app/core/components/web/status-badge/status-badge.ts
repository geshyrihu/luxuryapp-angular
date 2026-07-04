import { Component, ViewEncapsulation } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { StatusBadgeBase } from "src/app/core/components/shared/status-badge/status-badge-base";

// Re-export para consumidores existentes que importan desde este módulo.
export {
  EStatus,
  ETypeEmpresa,
  type StatusClickEvent,
} from "src/app/core/components/shared/status-badge/status-badge-base";

@Component({
  selector: "app-status-badge",
  imports: [TooltipModule, AppIcon],
  template: `
    <span
      class="status-badge"
      [style.background]="styles.bg"
      [style.color]="styles.text"
      [style.border-color]="styles.border"
      [style.cursor]="clickable() ? 'pointer' : 'default'"
      [pTooltip]="tooltip()"
      (click)="onStatusClick()"
    >
      @if (showIcon()) {
        <app-icon [icon]="getIcon()" class="status-badge-icon" />
      }
      {{ getStatusText() }}
    </span>
  `,
  styles: [`
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
  `],
  encapsulation: ViewEncapsulation.None,
})
export class StatusBadge extends StatusBadgeBase {}
