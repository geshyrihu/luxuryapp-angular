import {
  Component,
  input,
  model,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputOtpModule } from "primeng/inputotp";

/**
 * AppOtpInput â€” Wrapper sobre p-inputotp para 2FA y confirmaciÃ³n de operaciones crÃ­ticas.
 * Emite `complete` cuando todos los dÃ­gitos estÃ¡n rellenos.
 */
@Component({
  selector: "app-otp-input",
  standalone: true,
  imports: [CommonModule, FormsModule, InputOtpModule],
  template: `
    <div class="app-otp-root">
      @if (label()) {
        <label class="app-otp-label">{{ label() }}</label>
      }

      <!-- p-inputotp: readonly cubre el caso disabled en PrimeNG 21 -->
      <div [class.app-otp-disabled]="disabled()">
        <p-inputotp
          [(ngModel)]="value"
          [length]="length()"
          [integerOnly]="integerOnly()"
          [readonly]="disabled()"
          [mask]="mask()"
          (ngModelChange)="onValueChange($event)"
        />
      </div>

      @if (error()) {
        <span class="app-otp-error">{{ error() }}</span>
      } @else if (hint()) {
        <span class="app-otp-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [`
    .app-otp-root {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .app-otp-label {
      font-size: var(--ds-font-size-label, 0.875rem);
      color: var(--ds-text-secondary);
      font-weight: 500;
    }
    .app-otp-hint {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-muted);
    }
    .app-otp-error {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-danger, #ba1a1a);
    }
    .app-otp-disabled {
      opacity: 0.55;
      pointer-events: none;
      cursor: not-allowed;
    }
    /* DS overrides */
    .p-inputotp-input {
      width: 2.75rem;
      height: 2.75rem;
      text-align: center;
      font-size: var(--ds-font-size-card-title, 1rem);
      font-weight: 600;
      border: 1.5px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-md, 6px);
      background: var(--ds-bg-surface, #fff);
      color: var(--ds-text-primary);
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .p-inputotp-input:focus {
      border-color: var(--ds-primary, #003d9b);
      box-shadow: 0 0 0 3px var(--ds-primary-200, #b2c5ff);
      outline: none;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppOtpInput {
  value = model<string>("");
  label = input<string>("");
  hint = input<string>("");
  error = input<string>("");
  length = input<number>(6);
  integerOnly = input<boolean>(true);
  disabled = input<boolean>(false);
  mask = input<boolean>(false);

  complete = output<string>();

  onValueChange(val: string): void {
    if (val && val.length === this.length()) {
      this.complete.emit(val);
    }
  }
}
