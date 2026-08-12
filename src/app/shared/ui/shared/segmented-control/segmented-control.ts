import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

/** Opción de un control segmentado. */
export interface SegmentItem {
  value: any;
  label: string;
  icon?: AppIconName;
}

/**
 * 🎚️ Control segmentado (segmented control) — agnóstico web/mobile.
 * Selector de una opción entre varias, estilo "pill". CSS puro + signals.
 *
 * Uso:
 * ```html
 * <app-segmented-control
 *   [items]="segments"
 *   [(value)]="view"
 *   (changed)="onChange($event)"
 * />
 * ```
 */
@Component({
  selector: "app-segmented-control",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="seg" role="tablist" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.value) {
        <button
          type="button"
          role="tab"
          class="seg__item"
          [class.seg__item--active]="value() === item.value"
          [attr.aria-selected]="value() === item.value"
          (click)="select(item.value)"
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
      .seg {
        display: inline-flex;
        gap: 0.25rem;
        padding: 0.25rem;
        border-radius: var(--ds-radius-lg);
        background: var(--ds-surface-container);
        border: 1px solid var(--ds-border);
        max-width: 100%;
        overflow-x: auto;
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
      }
      .seg__item--active {
        background: var(--ds-surface-container-lowest);
        color: var(--ds-primary);
        font-weight: var(--ds-font-weight-semibold);
        box-shadow: var(--ds-shadow-sm);
      }
      .seg__icon {
        font-size: 1.05rem;
      }
    `,
  ],
})
export class SegmentedControl {
  /** Opciones a mostrar. */
  items = input<SegmentItem[]>([]);
  /** Valor seleccionado (two-way: `[(value)]`). */
  value = model<any>("");
  /** Etiqueta accesible del grupo. */
  ariaLabel = input<string>("Selector");
  /** Emite el nuevo valor al cambiar. */
  changed = output<any>();

  select(value: any): void {
    this.value.set(value);
    this.changed.emit(value);
  }
}
