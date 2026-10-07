import { NgClass } from "@angular/common";
import { Component, ViewEncapsulation, signal } from "@angular/core";
import { TooltipBase } from "@ui/core/tooltip.base";

@Component({
  selector: "lux-tooltip-mobile",

  imports: [NgClass],
  template: `
    <div
      class="lux-tooltip-mobile-wrapper"
      (touchstart)="onTouchStart()"
      (touchend)="onTouchEnd()"
    >
      <ng-content />
      @if (showTooltip()) {
        <div class="lux-tooltip-mobile-popup" [ngClass]="'lux-tooltip-mobile-' + position()">
          {{ text() }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .lux-tooltip-mobile-wrapper {
        position: relative;
        display: inline-flex;
      }
      .lux-tooltip-mobile-popup {
        position: absolute;
        z-index: 9999;
        padding: 0.35rem 0.65rem;
        border-radius: var(--ds-radius-sm);
        background: var(--ds-bg-inverse);
        color: var(--ds-text-inverse);
        font-size: 0.75rem;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: var(--ds-shadow-sm);
      }
      .lux-tooltip-mobile-top {
        bottom: calc(100% + 6px);
        left: 50%;
        transform: translateX(-50%);
      }
      .lux-tooltip-mobile-bottom {
        top: calc(100% + 6px);
        left: 50%;
        transform: translateX(-50%);
      }
      .lux-tooltip-mobile-left {
        right: calc(100% + 6px);
        top: 50%;
        transform: translateY(-50%);
      }
      .lux-tooltip-mobile-right {
        left: calc(100% + 6px);
        top: 50%;
        transform: translateY(-50%);
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTooltip extends TooltipBase {
  showTooltip = signal(false);
  private touchTimeout: ReturnType<typeof setTimeout> | null = null;

  onTouchStart(): void {
    if (this.disabled()) return;
    this.touchTimeout = setTimeout(
      () => this.showTooltip.set(true),
      this.delay() || 300,
    );
  }

  onTouchEnd(): void {
    if (this.touchTimeout) clearTimeout(this.touchTimeout);
    this.showTooltip.set(false);
  }
}
