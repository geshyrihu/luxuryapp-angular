import { Component, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ColorPickerModule } from "primeng/colorpicker";
import { ColorPickerBase } from "src/app/core/components/shared/color-picker/color-picker-base";

/**
 * AppColorPicker — Wrapper sobre p-colorpicker con label, formato y vista inline.
 * p-colorpicker PrimeNG 21: inputs válidos: inline, format, defaultColor, appendTo.
 */
@Component({
  selector: "app-color-picker",
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPickerModule],
  template: `
    <div class="cp-root" [class.cp-root-disabled]="disabled()">
      @if (label()) {
        <label class="cp-label">{{ label() }}</label>
      }

      <div class="cp-row">
        <p-colorpicker
          [(ngModel)]="value"
          [inline]="inline()"
          [format]="format()"
          [defaultColor]="defaultColor()"
          [appendTo]="inline() ? null : 'body'"
          (onChange)="changed.emit($event.value)"
        />

        @if (showHex() && value()) {
          <code class="cp-hex-display">{{ hexDisplay() }}</code>
        }

        @if (!inline() && allowClear() && value()) {
          <button class="cp-clear" type="button" (click)="clear()" title="Limpiar">✕</button>
        }
      </div>

      @if (hint()) {
        <span class="cp-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [`
    .cp-root { display: flex; flex-direction: column; gap: 0.35rem; }
    .cp-root-disabled { opacity: 0.55; pointer-events: none; }
    .cp-label { font-size: var(--ds-font-size-label, 0.875rem); color: var(--ds-text-secondary); font-weight: 500; }
    .cp-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .cp-hex-display {
      font-family: var(--ds-font-family-mono, monospace);
      font-size: var(--ds-font-size-help, 0.8125rem);
      background: var(--ds-bg-elevated, #f1f3ff);
      padding: 0.2rem 0.5rem;
      border-radius: var(--ds-radius-sm, 4px);
      color: var(--ds-text-primary);
    }
    .cp-clear {
      width: 20px; height: 20px; border-radius: 50%;
      border: 1px solid var(--ds-border-strong); background: none;
      font-size: 0.625rem; color: var(--ds-text-muted); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .cp-clear:hover { background: var(--ds-danger-light, #ffdad6); color: var(--ds-danger); border-color: var(--ds-danger); }
    .cp-hint { font-size: var(--ds-font-size-help, 0.8125rem); color: var(--ds-text-muted); }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppColorPicker extends ColorPickerBase {}
