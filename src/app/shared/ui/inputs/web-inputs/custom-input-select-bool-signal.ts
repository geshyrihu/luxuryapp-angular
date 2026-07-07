import { Component, computed, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * ☯️ CUSTOM INPUT SELECT BOOLEAN
 * -------------------------------------------------------------------------
 * Para decisiones binarias: Sí/No, Activo/Inactivo.
 * Configurable y directo.
 */
@Component({
  selector: "custom-input-select-signal-bool",
  imports: [BaseInputSignal, ReactiveFormsModule, SelectModule],
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
      <p-select
        [inputId]="id()"
        [options]="boolOptions()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        optionLabel="label"
        optionValue="value"
        [showClear]="showClear()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [class]="getInputStyleClass()"
        fluid
        appendTo="body"
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSelectBool),
      multi: true,
    },
  ],
})
export class CustomInputSelectBool extends BaseInputSignal {
  // <--- Inputs Específicos --->
  activeLabel = input<string>("Activo");
  inactiveLabel = input<string>("Inactivo");
  showClear = input<boolean>(true);
  size = input<"small" | "large" | undefined>(undefined);

  // <--- Computados --->
  boolOptions = computed(() => [
    { value: true, label: this.activeLabel() },
    { value: false, label: this.inactiveLabel() },
  ]);

  getInputStyleClass = computed(() => {
    if (this.size() === "small") return "p-inputtext-sm";
    if (this.size() === "large") return "p-inputtext-lg";
    return "";
  });
}
