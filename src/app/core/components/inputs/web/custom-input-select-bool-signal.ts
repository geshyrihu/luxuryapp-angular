import { Component, computed, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { BaseInputSignal } from "../base/base-input-signal";

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
        [readonly]="readonly()"
        [class]="getInputStyleClass()"
        fluid
        appendTo="body"
      />
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSelectBool),
      multi: true,
    },
  ],
})
export class CustomInputSelectBool extends BaseInputSignal {

  activeLabel = input<string>("Activo");
  inactiveLabel = input<string>("Inactivo");
  showClear = input<boolean>(true);
  size = input<"small" | "large" | undefined>(undefined);

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
