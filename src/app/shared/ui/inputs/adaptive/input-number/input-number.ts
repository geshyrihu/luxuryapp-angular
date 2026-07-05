import { Component, forwardRef, inject, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputNumber } from "../../mobile/ion-input-number";
import { WebInputNumber } from "../../web/input-number/input-number";

/**
 * 🔀 INPUT NUMBER — adaptativo. `<custom-input-number-signal>` →
 * web `<web-input-number>` (PrimeNG) o móvil `<ion-input-number>` (Ionic).
 */
@Component({
  selector: "custom-input-number-signal",
  standalone: true,
  imports: [WebInputNumber, IonInputNumber],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumber),
      multi: true,
    },
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-number
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
      />
    } @else {
      <web-input-number
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [onlyInput]="onlyInput()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [showButtons]="showButtons()"
        [minFractionDigits]="minFractionDigits()"
        [maxFractionDigits]="maxFractionDigits()"
        [customClass]="customClass()"
        [size]="size()"
        [mode]="mode()"
        [currency]="currency()"
        [locale]="locale()"
        [useGrouping]="useGrouping()"
        [prefix]="prefix()"
        [suffix]="suffix()"
        [showClear]="showClear()"
        (blur)="blur.emit()"
        (enter)="enter.emit()"
      />
    }
  `,
})
export class InputNumber extends BaseInputSignal {
  protected platform = inject(PlatformService);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  step = input<number>(1);
  showButtons = input<boolean>(false);
  minFractionDigits = input<number | undefined>(undefined);
  maxFractionDigits = input<number | undefined>(undefined);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  mode = input<"decimal" | "currency">("decimal");
  currency = input<string | undefined>(undefined);
  useGrouping = input<boolean>(true);
  prefix = input<string | undefined>(undefined);
  suffix = input<string | undefined>(undefined);
  showClear = input<boolean>(false);
  locale = input<string>("es-MX");

  blur = output<void>();
  enter = output<void>();
}
