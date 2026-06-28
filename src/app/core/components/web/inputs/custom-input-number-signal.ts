import { Component, computed, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";
import { BaseInputSignal } from "../../inputs/base/base-input-signal";

@Component({
  selector: "custom-input-number-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, InputNumberModule, FloatLabelModule],
  template: `
    <base-input-signal
      [control]="control() || internalControl"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="requiredInput()"
      [onlyInput]="onlyInput()"
      [noMargin]="noMargin()"
    >
      <p-floatlabel variant="on" class="w-full">
        <p-inputnumber
          [inputId]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="' '"
          [readonly]="readonly()"
          [attr.min]="min()"
          [attr.max]="max()"
          [attr.step]="step()"
          [showButtons]="showButtons()"
          [minFractionDigits]="minFractionDigits()"
          [maxFractionDigits]="maxFractionDigits()"
          [mode]="mode()"
          [currency]="currency()"
          [locale]="locale()"
          [useGrouping]="useGrouping()"
          [prefix]="prefix()"
          [suffix]="suffix()"
          [showClear]="showClear()"
          [inputStyleClass]="inputStyleClass()"
          [invalid]="isInvalid()"
          (onBlur)="blur.emit()"
          (keydown.enter)="enter.emit()"
          fluid
        />
        @if (label()) {
          <label [for]="id()">
            {{ label() }}
            @if (isRequired()) { <span style="color:var(--ds-danger)"> *</span> }
          </label>
        }
      </p-floatlabel>
    </base-input-signal>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputNumberSignal),
    multi: true,
  }],
})
export class CustomInputNumberSignal extends BaseInputSignal {
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  showButtons = input<boolean>(false);
  step = input<number>(1);
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
  inputStyleClass = computed(() => {
    let classes = this.customClass();
    const s = this.size() ?? this.mobileSize();
    if (s === "small") classes += " p-inputtext-sm";
    if (s === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });
}

