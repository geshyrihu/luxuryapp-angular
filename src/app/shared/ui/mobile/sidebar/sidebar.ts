import { Component, ViewEncapsulation } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SidebarBase } from "@ui/base/sidebar.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-sidebar",

  imports: [RouterModule, AppIcon],
  template: `
    @if (visible()) {
      <div class="ili-sidebar-backdrop" (click)="onBackdropClick()"></div>
      <div
        class="ili-sidebar-panel {{ styleClass() }}"
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
        background: var(--ds-bg-overlay);
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
        background: var(--ds-bg-surface);
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
        border-bottom: 1px solid var(--ds-border);
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
        border-radius: var(--ds-radius-sm);
      }
      .ili-sidebar-close:active {
        background: var(--ds-bg-elevated);
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
