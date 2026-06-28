import { Component, forwardRef, input, output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { SelectModule } from "primeng/select";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { BaseInputSignal } from "../../inputs/base/base-input-signal";

@Component({
  selector: "custom-input-select-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, SelectModule, FloatLabelModule],
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
      <p-floatlabel variant="on" class="w-full">
        <p-select
          [options]="data()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder() || ' '"
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
          [size]="size() ?? mobileSize()"
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
    useExisting: forwardRef(() => CustomInputSelectSignal),
    multi: true,
  }],
})
export class CustomInputSelectSignal extends BaseInputSignal implements ControlValueAccessor {
  selectionChange = output<any>();
  data = input<ISelectItem[]>([]);
  valueDefault = input<any>(null);
  showClear = input<boolean>(true);
  filter = input<boolean>(false);
  loading = input<boolean>(false);
  filterBy = input<string>("label");
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  constructor() { super(); }
  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
  override writeValue(obj: any): void { super.writeValue(obj); }
  override setDisabledState(isDisabled: boolean): void { super.setDisabledState(isDisabled); }
}

