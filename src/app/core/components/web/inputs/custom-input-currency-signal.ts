import { Component, computed, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-currency-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, InputNumberModule, FloatLabelModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="requiredInput()"
    >
      <p-floatlabel variant="on" class="w-full">
        <p-inputNumber
          [inputId]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="' '"
          [readonly]="readonly()"
          [showButtons]="showButtons()"
          [minFractionDigits]="minFractionDigits()"
          [maxFractionDigits]="maxFractionDigits()"
          mode="decimal"
          [useGrouping]="useGrouping()"
          [prefix]="prefix()"
          [suffix]="suffix()"
          [showClear]="showClear()"
          locale="es-MX"
          [inputStyleClass]="inputStyleClass()"
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
    useExisting: forwardRef(() => CustomInputCurrencySignal),
    multi: true,
  }],
})
export class CustomInputCurrencySignal extends BaseInputSignal {
  showButtons = input<boolean>(false);
  minFractionDigits = input<number>(2);
  maxFractionDigits = input<number>(2);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  useGrouping = input<boolean>(true);
  prefix = input<string | undefined>("$ ");
  suffix = input<string | undefined>(undefined);
  showClear = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  step = input<number>(1);
  inputStyleClass = computed(() => {
    let classes = this.customClass();
    const s = this.size() ?? this.mobileSize();
    if (s === "small") classes += " p-inputtext-sm";
    if (s === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });
}
