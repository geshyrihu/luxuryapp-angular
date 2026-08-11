import { Component, ViewEncapsulation } from "@angular/core";
import { VirtualScrollerBase } from "@ui/base/virtual-scroller.base";

@Component({
  selector: "ili-virtual-scroller",

  imports: [],
  template: `
    <div class="ili-virtual-scroller-root" [style.maxHeight]="scrollHeight()">
      @for (item of items(); track $index) {
        <div class="ili-virtual-scroller-item">{{ item }}</div>
      }
    </div>
  `,
  styles: [
    `
      .ili-virtual-scroller-root {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .ili-virtual-scroller-item {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--ds-border);
        color: var(--ds-text-primary);
        font-size: var(--ds-font-size-body);
        min-height: 40px;
        display: flex;
        align-items: center;
      }
      .ili-virtual-scroller-item:last-child {
        border-bottom: none;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileVirtualScroller extends VirtualScrollerBase {}
