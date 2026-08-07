import {
  Component,
  input,
  model,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export interface TabBarItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}

/**
 * AppTabBar — Barra de pestañas horizontal para navegación dentro de una vista.
 * Funciona en web (styled tabs) y mobile (segmented-control pattern).
 * Diferente de BottomNav: va en la parte superior de la sección, no al pie de la app.
 */
@Component({
  selector: "app-tab-bar",

  imports: [AppIcon],
  template: `
    <div class="tab-bar" role="tablist" [class.tab-bar-compact]="compact()">
      @for (tab of tabs(); track tab.id) {
        <button
          class="tab-bar-item"
          role="tab"
          [class.tab-bar-active]="activeId() === tab.id"
          [class.tab-bar-disabled]="tab.disabled"
          [attr.aria-selected]="activeId() === tab.id"
          [attr.aria-disabled]="tab.disabled"
          [attr.aria-controls]="tab.id + '-panel'"
          [disabled]="tab.disabled"
          (click)="select(tab)"
        >
          @if (tab.icon) {
            <app-icon [icon]="tab.icon" class="tab-bar-icon" />
          }
          <span>{{ tab.label }}</span>
          @if (tab.badge && tab.badge > 0) {
            <span class="tab-bar-badge">{{
              tab.badge > 99 ? "99+" : tab.badge
            }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: [
    `
      .tab-bar {
        display: flex;
        align-items: stretch;
        border-bottom: 2px solid var(--ds-border, #e2e8f0);
        background: var(--ds-bg-surface, #fff);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .tab-bar::-webkit-scrollbar {
        display: none;
      }
      .tab-bar-compact .tab-bar-item {
        padding: 0.4rem 0.75rem;
      }
      .tab-bar-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.625rem 1rem;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        cursor: pointer;
        font-size: var(--ds-font-size-label, 0.875rem);
        font-weight: 500;
        color: var(--ds-text-muted);
        white-space: nowrap;
        transition:
          color 0.15s,
          border-color 0.15s;
      }
      .tab-bar-item:hover:not(.tab-bar-disabled) {
        color: var(--ds-text-primary);
      }
      .tab-bar-active {
        color: var(--ds-primary, #003d9b) !important;
        border-bottom-color: var(--ds-primary, #003d9b);
        font-weight: 600;
      }
      .tab-bar-disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .tab-bar-icon {
        font-size: 1rem;
      }
      .tab-bar-badge {
        background: var(--ds-danger, #ba1a1a);
        color: #fff;
        font-size: 0.625rem;
        font-weight: 700;
        border-radius: var(--ds-radius-full, 9999px);
        padding: 0.1rem 0.35rem;
        min-width: 16px;
        text-align: center;
        line-height: 1.4;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppTabBar {
  tabs = input<TabBarItem[]>([]);
  activeId = model<string>("");
  compact = input<boolean>(false);

  tabChange = output<TabBarItem>();

  select(tab: TabBarItem): void {
    if (tab.disabled) return;
    this.activeId.set(tab.id);
    this.tabChange.emit(tab);
  }
}
