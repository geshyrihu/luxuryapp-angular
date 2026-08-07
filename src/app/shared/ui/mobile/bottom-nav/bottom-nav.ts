import { Component, ViewEncapsulation } from "@angular/core";
import { BottomNavBase } from "@ui/base/bottom-nav.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export type { BottomNavItem } from "@ui/base/bottom-nav.base";

@Component({
  selector: "ili-bottom-nav",

  imports: [AppIcon],
  template: `
    <nav class="bottom-nav" role="tablist" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.id) {
        <button
          class="bottom-nav-item"
          role="tab"
          [class.bottom-nav-active]="activeId() === item.id"
          [attr.aria-selected]="activeId() === item.id"
          [attr.aria-label]="item.label"
          (click)="select(item.id)"
        >
          <div class="bottom-nav-icon-wrap">
            <app-icon
              [icon]="
                activeId() === item.id && item.activeIcon
                  ? item.activeIcon
                  : item.icon
              "
              class="bottom-nav-icon"
            />
            @if (item.badge && item.badge > 0) {
              <span class="bottom-nav-badge">{{
                item.badge > 99 ? "99+" : item.badge
              }}</span>
            }
          </div>
          <span class="bottom-nav-label">{{ item.label }}</span>
        </button>
      }
    </nav>
  `,
  styles: [
    `
      .bottom-nav {
        display: flex;
        align-items: stretch;
        background: var(--ds-bg-surface, #fff);
        border-top: 1px solid var(--ds-border, #e2e8f0);
        height: 60px;
        width: 100%;
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
      .bottom-nav-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.15rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem 0.25rem;
        color: var(--ds-text-muted);
        transition: color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .bottom-nav-item:active {
        transform: scale(0.92);
      }
      .bottom-nav-active {
        color: var(--ds-primary, #003d9b);
      }
      .bottom-nav-icon-wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bottom-nav-icon {
        font-size: 1.375rem;
      }
      .bottom-nav-badge {
        position: absolute;
        top: -5px;
        right: -7px;
        background: var(--ds-danger, #ba1a1a);
        color: #fff;
        font-size: 0.6rem;
        font-weight: 700;
        border-radius: var(--ds-radius-full, 9999px);
        padding: 0.1rem 0.3rem;
        min-width: 16px;
        text-align: center;
        line-height: 1.4;
      }
      .bottom-nav-label {
        font-size: 0.65rem;
        font-weight: 500;
        line-height: 1;
      }
      .bottom-nav-active .bottom-nav-label {
        font-weight: 600;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileBottomNav extends BottomNavBase {}
