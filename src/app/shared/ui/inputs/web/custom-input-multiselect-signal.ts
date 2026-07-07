import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
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
        [group]="group()"
        [optionGroupLabel]="optionGroupLabel()"
        [optionGroupChildren]="optionGroupChildren()"
        [inputId]="id()"
        [class]="getSizeClass()"
        [scrollHeight]="scrollHeight()"
        [panelStyle]="panelStyle()"
        (onChange)="onChange($event.value)"
        (onBlur)="onTouch()"
        appendTo="body"
        fluid
      ></p-multiSelect>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputMultiselectSignal),
      multi: true,
    },
  ],
})
export class CustomInputMultiselectSignal extends BaseInputSignal {
  options = input<ISelectItem[]>([]);
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  group = input<boolean>(false);
  optionGroupLabel = input<string>("label");
  optionGroupChildren = input<string>("items");
  filter = input<boolean>(true);
  showClear = input<boolean>(true);
  size = input<"small" | "large" | undefined>(undefined);
  scrollHeight = input<string>("350px");
  panelStyle = input<Record<string, string>>({ "min-width": "20rem" });

  getSizeClass(): string {
    if (this.size() === "small") return "p-inputtext-sm";
    if (this.size() === "large") return "p-inputtext-lg";
    return "";
  }
}
