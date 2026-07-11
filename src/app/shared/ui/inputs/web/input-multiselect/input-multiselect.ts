import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-multiselect",

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
      <p-multiselect
        [options]="options()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [filter]="filter()"
        [display]="selectionDisplay()"
        [showClear]="showClear()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [group]="group()"
        [optionGroupLabel]="optionGroupLabel()"
        [optionGroupChildren]="optionGroupChildren()"
        [inputId]="id()"
        [class]="getComponentClass()"
        [maxSelectedLabels]="maxSelectedLabels()"
        [selectedItemsLabel]="selectedItemsLabel()"
        [scrollHeight]="scrollHeight()"
        [panelStyle]="panelStyle()"
        (onChange)="onChange($event.value)"
        (onBlur)="onTouch()"
        appendTo="body"
        fluid
      ></p-multiselect>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputMultiselect),
      multi: true,
    },
  ],
})
export class WebInputMultiselect extends BaseInputSignal {
  options = input<SelectItemDto[]>([]);
  optionLabel = input<string>("label");
  optionValue = input<string | undefined>("value");
  group = input<boolean>(false);
  optionGroupLabel = input<string>("label");
  optionGroupChildren = input<string>("items");
  filter = input<boolean>(true);
  showClear = input<boolean>(true);
  selectionDisplay = input<"comma" | "chip" | undefined>("chip");
  maxSelectedLabels = input<number | undefined>(undefined);
  selectedItemsLabel = input<string | undefined>(undefined);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  scrollHeight = input<string>("350px");
  panelStyle = input<Record<string, string>>({ "min-width": "20rem" });

  getComponentClass(): string {
    const classes: string[] = [];
    if (this.size() === "small") classes.push("p-inputtext-sm");
    if (this.size() === "large") classes.push("p-inputtext-lg");
    if (this.customClass()) classes.push(this.customClass());
    return classes.join(" ");
  }
}
