import { Component, computed, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * ✨ CUSTOM INPUT NG SELECT (WRAPPER)
 * -------------------------------------------------------------------------
 * Un adaptador para aquellos que extrañan la API de ng-select.
 * Mapea 'items', 'bindLabel' y 'bindValue' a las propiedades de PrimeNG p-select.
 */
@Component({
  selector: "custom-input-ng-select",
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
        [options]="items()"
        [optionLabel]="bindLabel()"
        [optionValue]="bindValue()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [showClear]="clearable()"
        [filter]="searchable()"
        [readonly]="readonly()"
        [class]="getSizeClass()"
        fluid
        [inputId]="id()"
        appendTo="body"
      />
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputNgSelect),
      multi: true,
    },
  ],
})
export class CustomInputNgSelect extends BaseInputSignal {
  // <--- Inputs tipo ng-select --->
  items = input<any[]>([]);
  bindLabel = input<string>("label");
  bindValue = input<string>("value");
  clearable = input<boolean>(true);
  searchable = input<boolean>(true);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);

  getSizeClass = computed(() => {
    let classes = this.customClass();
    if (this.size() === "small") classes += " p-inputtext-sm";
    if (this.size() === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });
}
