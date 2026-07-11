import { Component, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { SelectButtonModule } from "primeng/selectbutton";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-select-button-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, SelectButtonModule],
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
      <p-selectbutton
        [options]="options()"
        [formControl]="control() || internalControl"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [multiple]="multiple()"
        [class]="customClass()"
        [size]="size()"
        [disabled]="disabled()"
        [invalid]="isInvalid()"
        (onChange)="selectionChange.emit($event)"
      >
        <ng-content></ng-content>
      </p-selectbutton>
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
