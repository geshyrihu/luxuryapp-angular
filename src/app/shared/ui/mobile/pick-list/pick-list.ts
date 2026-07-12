import { Component, ViewEncapsulation } from "@angular/core";
import { PickListBase } from "@ui/base/pick-list.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-pick-list",

  imports: [AppIcon],
  template: `
    <div class="ili-pick-list">
      <div class="ili-pick-list-column">
        <div class="ili-pick-list-header">Origen ({{ source().length }})</div>
        <div class="ili-pick-list-items">
          @for (item of source(); track $index) {
            <div class="ili-pick-list-item">
              <span class="ili-pick-list-label">{{
                item.label || item.name || item
              }}</span>
              <button
                class="ili-pick-list-move"
                (click)="moveToTarget($index)"
                title="Mover a destino"
              >
                <app-icon icon="mdi:chevron-right" />
              </button>
            </div>
          }
          @if (source().length === 0) {
            <div class="ili-pick-list-empty">Sin elementos</div>
          }
        </div>
      </div>
      <div class="ili-pick-list-column">
        <div class="ili-pick-list-header">Destino ({{ target().length }})</div>
        <div class="ili-pick-list-items">
          @for (item of target(); track $index) {
            <div class="ili-pick-list-item">
              <button
                class="ili-pick-list-move"
                (click)="moveToSource($index)"
                title="Mover a origen"
              >
                <app-icon icon="mdi:chevron-left" />
              </button>
              <span class="ili-pick-list-label">{{
                item.label || item.name || item
              }}</span>
            </div>
          }
          @if (target().length === 0) {
            <div class="ili-pick-list-empty">Sin elementos</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .ili-pick-list {
        display: flex;
        gap: 0.5rem;
        width: 100%;
      }
      .ili-pick-list-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 8px);
        overflow: hidden;
      }
      .ili-pick-list-header {
        padding: 0.625rem 0.75rem;
        font-size: var(--ds-font-size-small, 0.8125rem);
        font-weight: 600;
        color: var(--ds-text-primary);
        background: var(--ds-bg-muted, #f1f5f9);
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }
      .ili-pick-list-items {
        display: flex;
        flex-direction: column;
        min-height: 8rem;
        max-height: 20rem;
        overflow-y: auto;
      }
      .ili-pick-list-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5rem 0.625rem;
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }
      .ili-pick-list-item:last-child {
        border-bottom: none;
      }
      .ili-pick-list-label {
        flex: 1;
        font-size: var(--ds-font-size-body, 0.9375rem);
        color: var(--ds-text-primary);
      }
      .ili-pick-list-move {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-sm, 4px);
        background: var(--ds-bg-primary, #ffffff);
        color: var(--ds-primary, #003d9b);
        cursor: pointer;
        padding: 0;
        font-size: 1rem;
      }
      .ili-pick-list-move:active {
        background: var(--ds-bg-muted, #f1f5f9);
      }
      .ili-pick-list-empty {
        padding: 1.5rem 0.75rem;
        text-align: center;
        font-size: var(--ds-font-size-small, 0.8125rem);
        color: var(--ds-text-muted);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobilePickList extends PickListBase {
  moveToTarget(index: number): void {
    const src = [...this.source()];
    const tgt = [...this.target()];
    if (index >= 0 && index < src.length) {
      tgt.push(src[index]);
      src.splice(index, 1);
      this.source.set(src);
      this.target.set(tgt);
    }
  }

  moveToSource(index: number): void {
    const src = [...this.source()];
    const tgt = [...this.target()];
    if (index >= 0 && index < tgt.length) {
      src.push(tgt[index]);
      tgt.splice(index, 1);
      this.source.set(src);
      this.target.set(tgt);
    }
  }
}
