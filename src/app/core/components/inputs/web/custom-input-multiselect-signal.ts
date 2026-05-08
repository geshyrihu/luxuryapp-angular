import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { BaseInputSignal } from "../base/base-input-signal";
@Component({
  selector: "custom-input-multiselect-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, MultiSelectModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
    >
      <p-multiSelect
        [options]="options()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [filter]="filter()"
        display="chip"
        [showClear]="showClear()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [inputId]="id()"
        [class]="getSizeClass()"
        (onChange)="onChange($event.value)"
        (onBlur)="onTouch()"
        appendTo="body"
        fluid
      ></p-multiSelect>
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputMultiselect),
      multi: true,
    },
  ],
})
export class CustomInputMultiselect extends BaseInputSignal {
  options = input<ISelectItem[]>([]);
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  filter = input<boolean>(true);
  showClear = input<boolean>(true);
  size = input<"small" | "large" | undefined>(undefined);

  getSizeClass(): string {
    if (this.size() === "small") return "p-inputtext-sm";
    if (this.size() === "large") return "p-inputtext-lg";
    return "";
  }
}
