import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SidebarBase } from "@ui/base/sidebar.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-sidebar",

  imports: [CommonModule, RouterModule, AppIcon],
  template: `
    @if (visible()) {
      <div class="ili-sidebar-backdrop" (click)="onBackdropClick()"></div>
      <div
        class="ili-sidebar-panel"
        [class.ili-sidebar-right]="position() === 'right'"
      >
        <div class="ili-sidebar-header">
          <span class="ili-sidebar-title">{{ header() }}</span>
          @if (closable()) {
            <button
              class="ili-sidebar-close"
              (click)="onHide()"
              aria-label="Cerrar"
            >
              <app-icon icon="mdi:close" />
            </button>
          }
        </div>
        <div class="ili-sidebar-body">
          <ng-content />
        </div>
      </div>
    }
  `,
  styles: [
    `
      .ili-sidebar-backdrop {
        position: fixed;
        inset: 0;
        z-index: 990;
        background: var(--ds-bg-overlay, rgba(0, 0, 0, 0.4));
        backdrop-filter: blur(2px);
      }
      .ili-sidebar-panel {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 991;
        width: min(85vw, 320px);
        display: flex;
        flex-direction: column;
        background: var(--ds-bg-surface, #ffffff);
        box-shadow: var(--ds-shadow-xl);
        animation: ili-slide-left 0.25s ease-out;
      }
      .ili-sidebar-right {
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
      .ili-sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }
      .ili-sidebar-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .ili-sidebar-close {
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
        border-radius: var(--ds-radius-sm, 4px);
      }
      .ili-sidebar-close:active {
        background: var(--ds-bg-elevated, #f1f3ff);
      }
      .ili-sidebar-body {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileSidebar extends SidebarBase {
  onBackdropClick(): void {
    if (this.closable()) {
      this.onHide();
    }
  }
}
