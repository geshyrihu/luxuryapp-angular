import { Component, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { CustomInputDatepicker } from "../custom-input-datepicker-signal";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-datepicker",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputDatepicker],
  template: `
    <custom-input-datepicker-signal
      [control]="control() || internalControl"
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
      [selectionMode]="selectionMode()"
      [dateFormat]="dateFormat()"
      (dateSelect)="dateSelect.emit($event)"
      (dateClear)="dateClear.emit()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputDatepicker),
      multi: true,
    },
  ],
})
export class WebInputDatepicker extends BaseInputSignal {
  dateSelect = output<any>();
  dateClear = output<void>();
  dateFormat = input<string>("dd/mm/yy");
  selectionMode = input<"single" | "multiple" | "range" | undefined>(undefined);
}
