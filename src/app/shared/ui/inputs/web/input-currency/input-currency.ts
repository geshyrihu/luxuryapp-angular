import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputNumberModule } from "primeng/inputnumber";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-currency",

  imports: [BaseInputSignal, ReactiveFormsModule, InputNumberModule],
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
      <p-inputnumber
        [inputId]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
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
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputCurrency),
      multi: true,
    },
  ],
})
export class WebInputCurrency extends BaseInputSignal {
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
