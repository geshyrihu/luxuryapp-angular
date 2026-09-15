import { Component, computed, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { AppSelectButton } from "@ui/web/select-button/select-button";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-select-button-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, AppSelectButton],
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
      <app-select-button
        [options]="mappedOptions()"
        [value]="(control() || internalControl).value"
        (valueChange)="onValueChange($event)"
        [class]="customClass()"
        [size]="size()"
        [disabled]="disabled()"
        
      >
        <ng-content></ng-content>
      </app-select-button>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSelectButton),
      multi: true,
    },
  ],
})
export class CustomInputSelectButton
  extends BaseInputSignal
  implements ControlValueAccessor
{
  selectionChange = output<any>();
  options = input<SelectItemDto[]>([]);
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  multiple = input<boolean>(false);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);

  mappedOptions = computed(() => this.options().map((option: any) => ({
    label: option?.[this.optionLabel()] ?? "",
    value: option?.[this.optionValue()],
    disabled: option?.disabled,
  })));

  onValueChange(value: any): void {
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(value);
    this.selectionChange.emit({ value });
  }

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

