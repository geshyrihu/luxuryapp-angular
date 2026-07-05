import { Component, forwardRef, input, output } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { SelectModule } from "primeng/select";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { BaseInputSignal } from "../../base/base-input-signal";

/**
 * 🔽 WEB INPUT SELECT (PrimeNG) — interno del delegador `custom-input-select-signal`.
 */
@Component({
  selector: "web-input-select",
  standalone: true,
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
      [noMargin]="noMargin()"
      [description]="description()"
      [hidden]="hidden()"
      [onlyInput]="onlyInput()"
    >
      <p-select
        [options]="data()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [showClear]="showClear()"
        [attr.disabled]="disabled() ? true : null"
        [readonly]="readonly()"
        [inputId]="id()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [dataKey]="optionValue()"
        [class]="customClass()"
        fluid
        (onChange)="selectionChange.emit($event)"
        appendTo="body"
        [filter]="filter()"
        [filterBy]="filterBy()"
        [invalid]="isInvalid()"
        [size]="size()"
      />
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputSelect),
      multi: true,
    },
  ],
})
export class WebInputSelect
  extends BaseInputSignal
  implements ControlValueAccessor
{
  selectionChange = output<any>();
  data = input<ISelectItem[]>([]);
  showClear = input<boolean>(true);
  filter = input<boolean>(false);
  filterBy = input<string>("label");
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);

  constructor() {
    super();
  }
  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  override writeValue(obj: any): void {
    super.writeValue(obj);
  }
  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
  }
}
