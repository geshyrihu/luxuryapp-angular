import { Component, HostListener, ViewEncapsulation } from "@angular/core";
import { PullToRefreshBase } from "@ui/base/pull-to-refresh.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-pull-to-refresh",

  imports: [AppIcon],
  template: `
    <div
      class="ptr-root"
      (mousedown)="onMouseDown($event)"
      (mousemove)="onMouseMove($event)"
      (mouseup)="onMouseEnd()"
      (mouseleave)="onMouseEnd()"
      [class.ptr-refreshing]="refreshing()"
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
        user-select: none;
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
export class PullToRefresh extends PullToRefreshBase {
  private pullingDown = false;
  private mouseStartY = 0;

  onMouseDown(event: MouseEvent): void {
    if (window.scrollY <= 0 && !this.refreshing()) {
      this.pullingDown = true;
      this.mouseStartY = event.clientY;
      this.pulling.set(true);
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.pullingDown || !this.pulling()) return;
    const dist = Math.max(0, event.clientY - this.mouseStartY);
    this.pullDistance.set(Math.min(dist * 0.5, this.threshold * 1.5));
  }

  onMouseEnd(): void {
    if (!this.pulling()) return;
    if (this.pullDistance() >= this.threshold) {
      this.refreshing.set(true);
      this.refresh.emit();
    }
    this.pullingDown = false;
    this.pulling.set(false);
    this.pullDistance.set(0);
    setTimeout(() => this.refreshing.set(false), 2000);
  }

  @HostListener("window:scroll", [])
  onWindowScroll(): void {
    if (this.refreshing() || this.pulling()) return;
  }
}
