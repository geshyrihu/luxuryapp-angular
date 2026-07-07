import { Component, computed, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputNumberModule } from "primeng/inputnumber";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 🔢 CUSTOM INPUT DECIMAL
 * -------------------------------------------------------------------------
 * Input numérico general con soporte para decimales.
 * Configurable para manejar prefijos, sufijos y agrupación.
 */
@Component({
  selector: "custom-input-decimal-signal",
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
        [inputStyleClass]="inputStyleClass()"
        fluid
        locale="es-MX"
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputDecimal),
      multi: true,
    },
  ],
})
export class CustomInputDecimal extends BaseInputSignal {
  // <--- Inputs Específicos --->
  showButtons = input<boolean>(false);
  minFractionDigits = input<number>(0);
  maxFractionDigits = input<number>(4);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  useGrouping = input<boolean>(true);
  prefix = input<string | undefined>(undefined);
  suffix = input<string | undefined>(undefined);
  showClear = input<boolean>(false);

  // <--- Computados --->
  inputStyleClass = computed(() => {
    let classes = this.customClass();
    if (this.size() === "small") classes += " p-inputtext-sm";
    if (this.size() === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });
}
