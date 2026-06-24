import { Component, computed, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputNumberModule } from "primeng/inputnumber";
import { BaseInputSignal } from "../base/base-input-signal";
import { IonInputCurrency } from "../mobile/ion-input-currency";

@Component({
  selector: "custom-input-currency-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, InputNumberModule, IonInputCurrency],
  template: `
    @if (platform.isMobile()) {
      <ion-input-currency
        [control]="control()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [customClass]="customClass()"
        [size]="size()"
        [showClear]="showClear()"
      />
    } @else {
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
        <p-inputNumber
          [inputId]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
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
      </base-input-signal>
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputCurrencySignal),
      multi: true,
    },
  ],
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

  inputStyleClass = computed(() => {
    let classes = this.customClass();
    if (this.size() === "small") classes += " p-inputtext-sm";
    if (this.size() === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });
}
