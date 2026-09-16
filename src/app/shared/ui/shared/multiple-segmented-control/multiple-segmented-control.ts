import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

/** Opción de un control segmentado. */
export interface SegmentItem {
  value: any;
  label: string;
  icon?: AppIconName;
}

/**
 * 🎚️ Control segmentado múltiple (multiple segmented control) — agnóstico web/mobile.
 * Selector de múltiples opciones entre varias, estilo "pill". CSS puro + signals.
 *
 * Uso:
 * ```html
 * <app-multiple-segmented-control
 *   [items]="segments"
 *   [(value)]="selectedValues"
 *   (changed)="onChange($event)"
 * />
 * ```
 */
@Component({
  selector: "app-multiple-segmented-control",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="seg seg--multiple" role="tablist" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.value) {
        <button
          type="button"
          role="tab"
          class="seg__item"
          [class.seg__item--active]="isSelected(item.value)"
          [attr.aria-selected]="isSelected(item.value)"
          (click)="toggleSelection(item.value)"
        >
          @if (item.icon) {
            <app-icon [icon]="item.icon" class="seg__icon" />
          }
          <span>{{ item.label }}</span>
        </button>
      }
    </div>
  `,
  styles: [
    `
      .seg--multiple {
        display: inline-flex;
        gap: 0.25rem;
        padding: 0.25rem;
        border-radius: var(--ds-radius-lg);
        background: var(--ds-surface-container);
        border: 1px solid var(--ds-border);
        max-width: 100%;
        overflow-x: auto;
        flex-wrap: wrap;
      }
      .seg__item {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        padding: 0.45rem 1rem;
        border: none;
        border-radius: var(--ds-radius-md);
        background: transparent;
        color: var(--ds-text-secondary);
        font-family: inherit;
        font-size: var(--ds-font-size-help);
        font-weight: var(--ds-font-weight-medium);
        white-space: nowrap;
        cursor: pointer;
        transition:
          background-color 0.2s ease,
          color 0.2s ease,
          box-shadow 0.2s ease;
      }
      .seg__item:hover:not(.seg__item--active) {
        color: var(--ds-text-primary);
        background: var(--ds-surface-variant);
      }
      .seg__item--active {
        background: var(--ds-surface-container-lowest);
        color: var(--ds-primary);
        font-weight: var(--ds-font-weight-semibold);
        box-shadow: var(--ds-shadow-sm);
        border: 1px solid var(--ds-primary);
      }
      .seg__icon {
        font-size: 1.05rem;
      }
    `,
  ],
})
export class MultipleSegmentedControl {
  /** Opciones a mostrar. */
  items = input<SegmentItem[]>([]);
  /** Valores seleccionados (multiple) (two-way: `[(value)]`). */
  value = model<any[]>([]);
  /** Etiqueta accesible del grupo. */
  ariaLabel = input<string>("Selector múltiple");
  /** Emite el nuevo valor (array) al cambiar. */
  changed = output<any[]>();

  isSelected(value: any): boolean {
    return this.value().includes(value);
  }

  toggleSelection(value: any): void {
    const current = this.value();
    const index = current.indexOf(value);

    if (index === -1) {
      // Add value if not selected
      this.value.update((v) => [...v, value]);
      this.changed.emit(this.value());
    } else {
      // Remove value if already selected
      this.value.update((v) => v.filter((v) => v !== value));
      this.changed.emit(this.value());
    }
  }
}
