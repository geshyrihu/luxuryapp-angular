import { NgClass } from "@angular/common";
import { Component, computed, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 🔢 CUSTOM INPUT DECIMAL
 * -------------------------------------------------------------------------
 * Input numérico general con soporte para decimales.
 * Configurable para manejar prefijos, sufijos y agrupación.
 */
@Component({
  selector: "custom-input-decimal-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, NgClass],
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
      <input
        type="number"
        class="form-control"
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [step]="decimalStep()"
        [ngClass]="inputStyleClass()"
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
    if (this.size() === "small") classes += " form-control-sm";
    if (this.size() === "large") classes += " form-control-lg";
    return classes.trim();
  });

  decimalStep = computed(() => 10 ** -this.maxFractionDigits());
}
