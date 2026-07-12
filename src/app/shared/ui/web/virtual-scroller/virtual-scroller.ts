import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { VirtualScrollerBase } from "@ui/base/virtual-scroller.base";
import { ScrollerModule } from "primeng/scroller";

@Component({
  selector: "app-virtual-scroller",

  imports: [ScrollerModule],
  template: `
    <p-scroller
      [items]="items()"
      [itemSize]="itemSize()"
      [scrollHeight]="scrollHeight()"
      styleClass="app-virtual-scroller"
    >
      <ng-template pTemplate="item" let-item>
        <div class="app-virtual-scroller-item">{{ item }}</div>
      </ng-template>
    </p-scroller>
  `,
  styles: [
    `
      .app-virtual-scroller-item {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
        color: var(--ds-text-primary, #1e293b);
        font-size: var(--ds-font-size-body, 0.875rem);
      }
      .app-virtual-scroller-item:last-child {
        border-bottom: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppVirtualScroller extends VirtualScrollerBase {}
