import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { OrderListBase } from "@ui/base/order-list.base";

@Component({
  selector: "ili-order-list",
  standalone: true,
  imports: [CommonModule, AppIcon],
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
              <app-icon icon="mdi:chevron-up" />
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
              <app-icon icon="mdi:chevron-down" />
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .ili-order-list { width: 100%; }
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
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-md, 8px);
      background: var(--ds-bg-primary, #ffffff);
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
      background: var(--ds-bg-muted, #f1f5f9);
      border-radius: var(--ds-radius-sm, 4px);
      color: var(--ds-text-secondary);
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      transition: background 0.15s;
    }
    .ili-order-list-drag:active:not(:disabled) {
      background: var(--ds-bg-elevated, #e2e8f0);
    }
    .ili-order-list-drag:disabled {
      opacity: 0.3;
      cursor: default;
    }
  `],
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
