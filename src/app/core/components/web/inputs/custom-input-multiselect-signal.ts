import { Component, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { MultiSelectModule } from "primeng/multiselect";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-multiselect-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, MultiSelectModule, FloatLabelModule],
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
      <p-floatlabel variant="on" class="w-full">
        <p-multiSelect
          [options]="options()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder() || ' '"
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
    useExisting: forwardRef(() => CustomInputMultiselectSignal),
    multi: true,
  }],
})
export class CustomInputMultiselectSignal extends BaseInputSignal {
  customClass = input<string>("");
  selectionChange = output<any>();
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
    const s = this.size() ?? this.mobileSize();
    if (s === "small") return "p-inputtext-sm";
    if (s === "large") return "p-inputtext-lg";
    return "";
  }
}
