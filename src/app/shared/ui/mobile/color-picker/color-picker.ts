import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { ColorPickerBase } from "@ui/base/color-picker.base";

@Component({
  selector: "ili-color-picker",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ili-cp-root" [class.ili-cp-disabled]="disabled()">
      @if (label()) {
        <label class="ili-cp-label">{{ label() }}</label>
      }

      <div class="ili-cp-row">
        <input
          type="color"
          class="ili-cp-swatch"
          [value]="nativeValue()"
          [disabled]="disabled()"
          (input)="onInput($event)"
        />

        @if (showHex() && value()) {
          <code class="ili-cp-hex">{{ hexDisplay() }}</code>
        }

        @if (allowClear() && value()) {
          <button type="button" class="ili-cp-clear" (click)="clear()" title="Limpiar">
            ✕
          </button>
        }
      </div>

      @if (hint()) {
        <span class="ili-cp-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .ili-cp-root {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .ili-cp-disabled {
        opacity: 0.55;
        pointer-events: none;
      }
      .ili-cp-label {
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .ili-cp-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .ili-cp-swatch {
        width: 44px;
        height: 44px;
        padding: 0;
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        background: none;
        cursor: pointer;
      }
      .ili-cp-hex {
        font-family: var(--ds-font-family-mono, monospace);
        font-size: 0.8125rem;
        background: var(--ds-bg-elevated, #f1f3ff);
        padding: 0.2rem 0.5rem;
        border-radius: var(--ds-radius-sm, 4px);
        color: var(--ds-text-primary);
      }
      .ili-cp-clear {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid var(--ds-border-strong);
        background: none;
        font-size: 0.75rem;
        color: var(--ds-text-muted);
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .ili-cp-hint {
        font-size: 0.8125rem;
        color: var(--ds-text-muted);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileColorPicker extends ColorPickerBase {
  protected nativeValue(): string {
    const v = this.value();
    const base = v || this.defaultColor() || "ff0000";
    return base.startsWith("#") ? base : `#${base}`;
  }

  protected onInput(event: Event): void {
    const hex = (event.target as HTMLInputElement).value;
    this.value.set(hex);
    this.changed.emit(hex);
  }
}
