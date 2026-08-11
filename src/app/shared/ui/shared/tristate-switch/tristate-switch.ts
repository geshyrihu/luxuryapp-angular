import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  ViewEncapsulation,
} from "@angular/core";

export type TriState = true | false | null;

/**
 * AppTristateSwitch — Toggle de 3 estados: ON / OFF / Indeterminado (null).
 * Uso: permisos heredados, configuraciones parciales, selección múltiple mixta.
 * Diferente de CustomInputSwitch que solo maneja boolean.
 */
@Component({
  selector: "app-tristate-switch",

  imports: [],
  template: `
    <div
      class="tri-root"
      [class.tri-disabled]="disabled()"
      [attr.aria-label]="label()"
    >
      @if (label()) {
        <label class="tri-label">{{ label() }}</label>
      }

      <div class="tri-row">
        <button
          class="tri-track"
          type="button"
          role="checkbox"
          [attr.aria-checked]="ariaChecked()"
          [attr.aria-label]="label()"
          [disabled]="disabled()"
          (click)="cycle()"
        >
          <span class="tri-thumb" [class]="thumbClass()">
            @if (value() === true) {
              <span class="tri-icon">✓</span>
            } @else if (value() === null) {
              <span class="tri-icon tri-icon-dash">—</span>
            } @else {
              <span class="tri-icon tri-icon-off">✕</span>
            }
          </span>
        </button>

        <span class="tri-state-label">{{ stateLabel() }}</span>
      </div>

      @if (hint()) {
        <span class="tri-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .tri-root {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .tri-disabled {
        opacity: 0.55;
        pointer-events: none;
      }
      .tri-label {
        font-size: var(--ds-font-size-label);
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .tri-row {
        display: flex;
        align-items: center;
        gap: 0.625rem;
      }
      .tri-hint {
        font-size: var(--ds-font-size-help);
        color: var(--ds-text-muted);
      }

      .tri-track {
        width: 48px;
        height: 26px;
        border-radius: var(--ds-radius-full);
        border: 1.5px solid var(--ds-border);
        background: var(--ds-bg-sunken);
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        transition:
          background 0.2s,
          border-color 0.2s;
        position: relative;
      }

      /* ON state */
      .tri-track:has(.tri-thumb-on) {
        background: var(--ds-primary);
        border-color: var(--ds-primary);
      }
      /* Indeterminate state */
      .tri-track:has(.tri-thumb-indeterminate) {
        background: var(--ds-warning);
        border-color: transparent;
      }

      .tri-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--ds-bg-surface);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      }
      .tri-thumb-on {
        transform: translateX(22px);
      }
      .tri-thumb-indeterminate {
        transform: translateX(11px);
      }
      .tri-thumb-off {
        transform: translateX(0);
      }

      .tri-icon {
        font-size: 0.625rem;
        font-weight: 700;
        line-height: 1;
      }
      .tri-icon-dash {
        color: var(--ds-accent-text-warning);
      }
      .tri-icon-off {
        color: var(--ds-text-muted);
      }
      .tri-thumb-on .tri-icon {
        color: var(--ds-primary);
      }

      .tri-state-label {
        font-size: var(--ds-font-size-help);
        color: var(--ds-text-secondary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppTristateSwitch {
  value = model<TriState>(false);
  label = input<string>("");
  hint = input<string>("");
  disabled = input<boolean>(false);

  changed = output<TriState>();

  /** Cicla: false → true → null → false */
  cycle(): void {
    const next: TriState =
      this.value() === false ? true : this.value() === true ? null : false;
    this.value.set(next);
    this.changed.emit(next);
  }

  thumbClass(): string {
    if (this.value() === true) return "tri-thumb tri-thumb-on";
    if (this.value() === null) return "tri-thumb tri-thumb-indeterminate";
    return "tri-thumb tri-thumb-off";
  }

  stateLabel(): string {
    if (this.value() === true) return "Activado";
    if (this.value() === null) return "Heredado";
    return "Desactivado";
  }

  ariaChecked(): string {
    if (this.value() === true) return "true";
    if (this.value() === null) return "mixed";
    return "false";
  }
}
