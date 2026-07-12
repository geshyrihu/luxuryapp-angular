import { Component, ViewEncapsulation } from "@angular/core";
import { PullToRefreshBase } from "@ui/base/pull-to-refresh.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-pull-to-refresh",

  imports: [AppIcon],
  template: `
    <div
      class="ptr-root"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd()"
    >
      @if (pulling()) {
        <div class="ptr-indicator" [style.height.px]="pullDistance()">
          <div class="ptr-spinner" [class.ptr-spinning]="refreshing()">
            <app-icon
              [icon]="refreshing() ? 'mdi:loading' : 'mdi:arrow-down'"
            />
          </div>
          <span class="ptr-text">
            {{ refreshing() ? "Actualizando..." : "Suelta para actualizar" }}
          </span>
        </div>
      }
      <div
        class="ptr-content"
        [style.transform]="'translateY(' + pullDistance() + 'px)'"
      >
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      .ptr-root {
        overflow: hidden;
        position: relative;
      }
      .ptr-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        width: 100%;
        background: var(--ds-bg-elevated, #f4f5f8);
        color: var(--ds-text-muted);
        font-size: var(--ds-font-size-table, 0.875rem);
        transition: height 0.2s;
        overflow: hidden;
      }
      .ptr-spinner {
        font-size: 1.25rem;
      }
      .ptr-spinning {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .ptr-content {
        transition: transform 0.2s;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobilePullToRefresh extends PullToRefreshBase {}
