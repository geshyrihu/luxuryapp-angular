import { Component, ViewEncapsulation } from "@angular/core";
import { OrderListBase } from "@ui/base/order-list.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-order-list",

  imports: [AppIcon],
  template: `
    <div class="ili-order-list">
      <div class="ili-order-list-items">
        @for (item of value(); track $index) {
          <div class="ili-order-list-item" [style]="listStyle()">
            <button
              class="ili-order-list-drag"
              (click)="moveUp($index)"
              [disabled]="$index === 0"
              title="Mover arriba"
            >
              <app-icon icon="material-symbols-light:keyboard-arrow-up" />
            </button>
            <div class="ili-order-list-content">
              <ng-content [select]="'[orderListItem]'" />
            </div>
            <button
              class="ili-order-list-drag"
              (click)="moveDown($index)"
              [disabled]="$index === value().length - 1"
              title="Mover abajo"
            >
              <app-icon icon="material-symbols-light:keyboard-arrow-down" />
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .ili-order-list {
        width: 100%;
      }
      .ili-order-list-items {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .ili-order-list-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 0.75rem;
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        background: var(--ds-bg-primary);
      }
      .ili-order-list-content {
        flex: 1;
        min-width: 0;
      }
      .ili-order-list-drag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border: none;
        background: var(--ds-bg-muted);
        border-radius: var(--ds-radius-sm);
        color: var(--ds-text-secondary);
        cursor: pointer;
        font-size: 1rem;
        padding: 0;
        transition: background 0.15s;
      }
      .ili-order-list-drag:active:not(:disabled) {
        background: var(--ds-bg-elevated);
      }
      .ili-order-list-drag:disabled {
        opacity: 0.3;
        cursor: default;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileOrderList extends OrderListBase {
  moveUp(index: number): void {
    if (index <= 0) return;
    const arr = [...this.value()];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    this.value.set(arr);
  }

  moveDown(index: number): void {
    if (index >= this.value().length - 1) return;
    const arr = [...this.value()];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    this.value.set(arr);
  }
}
