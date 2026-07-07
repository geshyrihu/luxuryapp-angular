import { Component, ViewEncapsulation, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TooltipBase } from "@ui/base/tooltip.base";

@Component({
  selector: "ili-tooltip",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ili-tooltip-wrapper"
      (touchstart)="onTouchStart()"
      (touchend)="onTouchEnd()"
    >
      <ng-content />
      @if (showTooltip()) {
        <div class="ili-tooltip-popup" [class]="'ili-tooltip-' + position()">
          {{ text() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .ili-tooltip-wrapper { position: relative; display: inline-flex; }
    .ili-tooltip-popup { position: absolute; z-index: 9999; padding: 0.35rem 0.65rem; border-radius: var(--ds-radius-sm, 6px); background: var(--ds-bg-inverse, #1e293b); color: var(--ds-text-inverse, #fff); font-size: 0.75rem; white-space: nowrap; pointer-events: none; box-shadow: var(--ds-shadow-sm, 0 1px 3px rgba(0,0,0,0.15)); }
    .ili-tooltip-top { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
    .ili-tooltip-bottom { top: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
    .ili-tooltip-left { right: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
    .ili-tooltip-right { left: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTooltip extends TooltipBase {
  showTooltip = signal(false);
  private touchTimeout: ReturnType<typeof setTimeout> | null = null;

  onTouchStart(): void {
    if (this.disabled()) return;
    this.touchTimeout = setTimeout(() => this.showTooltip.set(true), this.delay() || 300);
  }

  onTouchEnd(): void {
    if (this.touchTimeout) clearTimeout(this.touchTimeout);
    this.showTooltip.set(false);
  }
}
