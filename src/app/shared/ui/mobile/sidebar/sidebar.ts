import { Component, ViewEncapsulation } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SidebarBase } from "@ui/core/sidebar.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-sidebar-mobile",

  imports: [RouterModule, AppIconMobile],
  template: `
    @if (visible()) {
      <div class="lux-sidebar-mobile-backdrop" (click)="onBackdropClick()"></div>
      <div
        class="lux-sidebar-mobile-panel {{ styleClass() }}"
        [class.lux-sidebar-mobile-right]="position() === 'right'"
      >
        <div class="lux-sidebar-mobile-header">
          <span class="lux-sidebar-mobile-title">{{ header() }}</span>
          @if (closable()) {
            <button
              class="lux-sidebar-mobile-close"
              (click)="onHide()"
              aria-label="Cerrar"
            >
              <lux-icon-mobile icon="material-symbols-light:close" />
            </button>
          }
        </div>
        <div class="lux-sidebar-mobile-body">
          <ng-content />
        </div>
      </div>
    }
  `,
  styles: [
    `
      .lux-sidebar-mobile-backdrop {
        position: fixed;
        inset: 0;
        z-index: 990;
        background: var(--ds-bg-overlay);
        backdrop-filter: blur(2px);
      }
      .lux-sidebar-mobile-panel {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 991;
        width: min(85vw, 320px);
        display: flex;
        flex-direction: column;
        background: var(--ds-bg-surface);
        box-shadow: var(--ds-shadow-xl);
        animation: ili-slide-left 0.25s ease-out;
      }
      .lux-sidebar-mobile-right {
        left: auto;
        right: 0;
        animation: ili-slide-right 0.25s ease-out;
      }
      @keyframes ili-slide-left {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }
      @keyframes ili-slide-right {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      .lux-sidebar-mobile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid var(--ds-border);
      }
      .lux-sidebar-mobile-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .lux-sidebar-mobile-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: none;
        border: none;
        font-size: 1.25rem;
        color: var(--ds-text-secondary);
        cursor: pointer;
        border-radius: var(--ds-radius-sm);
      }
      .lux-sidebar-mobile-close:active {
        background: var(--ds-bg-elevated);
      }
      .lux-sidebar-mobile-body {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileSidebar extends SidebarBase {
  onBackdropClick(): void {
    if (this.closable()) {
      this.onHide();
    }
  }
}

