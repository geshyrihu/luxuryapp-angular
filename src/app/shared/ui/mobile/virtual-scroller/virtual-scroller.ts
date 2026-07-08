import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { VirtualScrollerBase } from "@ui/base/virtual-scroller.base";

@Component({
  selector: "ili-virtual-scroller",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ili-virtual-scroller-root" [style.maxHeight]="scrollHeight()">
      @for (item of items(); track $index) {
        <div class="ili-virtual-scroller-item">{{ item }}</div>
      }
    </div>
  `,
  styles: [`
    .ili-virtual-scroller-root {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .ili-virtual-scroller-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--ds-border, #e2e8f0);
      color: var(--ds-text-primary, #1e293b);
      font-size: var(--ds-font-size-body, 0.875rem);
      min-height: 40px;
      display: flex;
      align-items: center;
    }
    .ili-virtual-scroller-item:last-child {
      border-bottom: none;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileVirtualScroller extends VirtualScrollerBase {}
