import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-date-signal",
  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    FlatpickrDirective,
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
    >
      <input
        pInputText
        mwlFlatpickr
        type="text"
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [disable]="disable()"
        [mode]="mode()"
        [altInput]="true"
        [altFormat]="'d/M/Y'"
        [dateFormat]="'Y-m-d'"
        [allowInput]="true"
        fluid
      />
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputDateSignal),
      multi: true,
    },
  ],
})
export class CustomInputDateSignal extends BaseInputSignal {
  disable = input<Date[]>([]);
  mode = input<"single" | "multiple" | "range">("single");

  override writeValue(value: any): void {
    if (value) {
      super.writeValue(new Date(value));
    } else {
      super.writeValue(value);
    }
  }
}










