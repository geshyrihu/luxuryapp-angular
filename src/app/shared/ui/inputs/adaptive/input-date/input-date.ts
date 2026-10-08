import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  inject,
  input,
} from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from "@angular/forms";
import { PlatformService } from "@core/services/platform.service";
import { BaseInputSignal } from "../../core/base-input-signal";
import {
  isValidDateInputValue,
  normalizeDateInputValue,
} from "../../core/date-value";
import { IonInputDate } from "../../mobile/ion-input-date";
import { WebInputDate } from "../../web/input-date/input-date";

@Component({
  selector: "lux-input-date-signal",

  imports: [WebInputDate, IonInputDate],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDate),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputDate),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-date
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [minDate]="minDate()"
        [size]="size()"
      />
    } @else {
      <web-input-date
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
        [disable]="disable()"
        [mode]="mode()"
        [minDate]="minDate()"
        [size]="size()"
      />
    }
  `,
})
export class InputDate extends BaseInputSignal implements Validator {
  protected platform = inject(PlatformService);

  disable = input<Date[]>([]);
  mode = input<"single" | "multiple" | "range">("single");
  minDate = input<Date | string | null>(null);
  size = input<"small" | "large" | undefined>(undefined);

  private validatorChange: () => void = () => {};

  private readonly dateValueValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => this.validate(control);

  private readonly dateControlEffect = effect((onCleanup) => {
    const control = this.control() || this.internalControl;
    if (this.mode() !== "single") return;

    control.addValidators(this.dateValueValidator);

    const normalizeValue = (value: unknown): void => {
      if (this.mode() !== "single") return;
      const normalizedValue = normalizeDateInputValue(value);
      if (normalizedValue !== value) {
        control.setValue(normalizedValue, { emitEvent: false });
      }
    };

    normalizeValue(control.value);
    control.updateValueAndValidity({ emitEvent: false });

    const subscription = control.valueChanges.subscribe(normalizeValue);
    onCleanup(() => {
      subscription.unsubscribe();
      control.removeValidators(this.dateValueValidator);
      control.updateValueAndValidity({ emitEvent: false });
    });
  });

  private readonly modeValidatorEffect = effect(() => {
    this.mode();
    this.validatorChange();
  });

  override writeValue(value: unknown): void {
    super.writeValue(
      this.mode() === "single" ? normalizeDateInputValue(value) : value,
    );
  }

  override registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = (value) =>
      fn(this.mode() === "single" ? normalizeDateInputValue(value) : value);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.mode() !== "single") return null;
    return isValidDateInputValue(control.value) ? null : { invalidDate: true };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChange = fn;
  }
}
