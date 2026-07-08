import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { MeterGroupBase } from "@ui/base/meter-group.base";

@Component({
  selector: "ili-meter-group",

  imports: [CommonModule],
  template: `
    <div class="ili-meter-group-root">
      <div class="ili-meter-group-bar">
        @for (item of value(); track $index) {
          <div
            class="ili-meter-group-segment"
            [style.width.%]="segmentWidth(item)"
            [style.background]="item.color || 'var(--ds-primary, #003d9b)'"
            [title]="item.label || ''"
          ></div>
        }
      </div>
      <div class="ili-meter-group-legend">
        @for (item of value(); track $index) {
          <div class="ili-meter-group-legend-item">
            <span
              class="ili-meter-group-legend-dot"
              [style.background]="item.color || 'var(--ds-primary, #003d9b)'"
            ></span>
            <span class="ili-meter-group-legend-label">{{
              item.label || ""
            }}</span>
            <span class="ili-meter-group-legend-value">{{ item.value }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .ili-meter-group-root {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .ili-meter-group-bar {
        display: flex;
        height: 12px;
        border-radius: var(--ds-radius-full, 9999px);
        overflow: hidden;
        background: var(--ds-border, #e2e8f0);
      }
      .ili-meter-group-segment {
        transition: width 0.3s ease;
      }
      .ili-meter-group-segment:first-child {
        border-radius: var(--ds-radius-full, 9999px) 0 0
          var(--ds-radius-full, 9999px);
      }
      .ili-meter-group-segment:last-child {
        border-radius: 0 var(--ds-radius-full, 9999px)
          var(--ds-radius-full, 9999px) 0;
      }
      .ili-meter-group-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .ili-meter-group-legend-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-secondary, #475569);
      }
      .ili-meter-group-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .ili-meter-group-legend-value {
        font-weight: 600;
        color: var(--ds-text-primary, #1e293b);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileMeterGroup extends MeterGroupBase {
  segmentWidth(item: any): number {
    const total = this.value().reduce(
      (sum: number, i: any) => sum + (i.value ?? 0),
      0,
    );
    if (total === 0) return 0;
    return ((item.value ?? 0) / total) * 100;
  }
}
