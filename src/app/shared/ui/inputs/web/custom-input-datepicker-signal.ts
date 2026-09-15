import { Component, computed, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "web-custom-input-datepicker-signal",
  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    FlatpickrDirective,
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
      <input
        class="form-control"
        mwlFlatpickr
        type="text"
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [dateFormat]="flatpickrDateFormat()"
        [enableTime]="showTime()"
        [time24hr]="hourFormat() === '24'"
        [mode]="flatpickrMode()"
        [readonly]="readonlyInput()"
        [disabled]="disabled()"
        [style]="dateStyle()"
        appendTo="body"
        (flatpickrChange)="dateSelect.emit($event)"
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

  flatpickrMode = computed(() => this.selectionMode() === "range" ? "range" : this.selectionMode() === "multiple" ? "multiple" : "single");
  flatpickrDateFormat = computed(() => this.dateFormat() === "dd/mm/yy" ? "d/m/Y" : this.dateFormat());

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
