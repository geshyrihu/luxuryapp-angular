import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
import { OtpInputBase } from "@ui/base/otp-input.base";

@Component({
  selector: "ili-otp-input",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ili-otp-root">
      @if (label()) {
        <label class="ili-otp-label">{{ label() }}</label>
      }

      <div class="ili-otp-boxes" [class.ili-otp-disabled]="disabled()">
        @for (i of slots; track i) {
          <input
            #box
            class="ili-otp-box"
            [type]="mask() ? 'password' : 'text'"
            [attr.inputmode]="integerOnly() ? 'numeric' : 'text'"
            [attr.autocomplete]="i === 0 ? 'one-time-code' : 'off'"
            [value]="charAt(i)"
            maxlength="1"
            [disabled]="disabled()"
            (input)="onInput(i, $event)"
            (keydown)="onKeydown(i, $event)"
            (focus)="onFocus($event)"
          />
        }
      </div>

      @if (error()) {
        <span class="ili-otp-error">{{ error() }}</span>
      } @else if (hint()) {
        <span class="ili-otp-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .ili-otp-root {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .ili-otp-label {
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .ili-otp-boxes {
        display: flex;
        gap: 0.5rem;
      }
      .ili-otp-disabled {
        opacity: 0.55;
        pointer-events: none;
      }
      .ili-otp-box {
        width: 2.75rem;
        height: 3.25rem;
        text-align: center;
        font-size: 1.25rem;
        font-weight: 600;
        border: 1.5px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        background: var(--ds-bg-surface, #fff);
        color: var(--ds-text-primary);
        transition:
          border-color 0.15s,
          box-shadow 0.15s;
      }
      .ili-otp-box:focus {
        border-color: var(--ds-primary, #003d9b);
        box-shadow: 0 0 0 3px var(--ds-primary-200, #b2c5ff);
        outline: none;
      }
      .ili-otp-error {
        font-size: 0.8125rem;
        color: var(--ds-danger, #ba1a1a);
      }
      .ili-otp-hint {
        font-size: 0.8125rem;
        color: var(--ds-text-muted);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileOtpInput extends OtpInputBase {
  @ViewChildren("box") private boxes!: QueryList<ElementRef<HTMLInputElement>>;

  charAt(i: number): string {
    return this.value()?.[i] ?? "";
  }

  onFocus(event: Event): void {
    (event.target as HTMLInputElement).select();
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    let ch = input.value;
    if (this.integerOnly()) ch = ch.replace(/\D/g, "");
    ch = ch.slice(-1);
    input.value = ch;

    const chars = Array.from(
      { length: this.length() },
      (_, k) => this.value()?.[k] ?? "",
    );
    chars[index] = ch;
    const newVal = chars.join("");
    this.value.set(newVal);
    this.onValueChange(newVal);

    if (ch && index < this.length() - 1) {
      this.focusBox(index + 1);
    }
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === "Backspace" && !input.value && index > 0) {
      event.preventDefault();
      this.focusBox(index - 1);
    }
  }

  private focusBox(index: number): void {
    this.boxes.get(index)?.nativeElement.focus();
  }
}
