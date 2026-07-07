import { Component, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { DatePickerModule } from "primeng/datepicker";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-datepicker-signal",
  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    DatePickerModule,
    InputTextModule,
  ],
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
    >
      <p-datepicker
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [dateFormat]="dateFormat()"
        [showTime]="showTime()"
        [showClear]="showClear()"
        [showIcon]="showIcon()"
        [hourFormat]="hourFormat()"
        [readonlyInput]="readonlyInput()"
        [showButtonBar]="showButtonBar()"
        [selectionMode]="selectionMode()"
        [disabled]="disabled()"
        [invalid]="isInvalid()"
        [style]="dateStyle()"
        appendTo="body"
        (onClear)="dateClear.emit()"
        (onSelect)="dateSelect.emit($event)"
        fluid
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputDatepicker),
      multi: true,
    },
  ],
})
export class CustomInputDatepicker
  extends BaseInputSignal
  implements ControlValueAccessor
{
  dateSelect = output<any>();
  dateClear = output<void>();
  dateFormat = input<string>("dd/mm/yy");
  showTime = input<boolean>(false);
  showClear = input<boolean>(false);
  showIcon = input<boolean>(true);
  hourFormat = input<string>("24");
  readonlyInput = input<boolean>(true);
  showButtonBar = input<boolean>(true);
  selectionMode = input<"single" | "multiple" | "range" | undefined>(undefined);
  dateStyle = input<Record<string, string>>({ minWidth: "195px" });

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
