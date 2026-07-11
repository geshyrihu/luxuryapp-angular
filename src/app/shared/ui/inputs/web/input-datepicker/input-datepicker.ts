import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";
import { CustomInputDatepicker } from "../custom-input-datepicker-signal";

@Component({
  selector: "web-input-datepicker",

  imports: [ReactiveFormsModule, CustomInputDatepicker],
  template: `
    <web-custom-input-datepicker-signal
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
      [showTime]="showTime()"
      [showClear]="showClear()"
      [showIcon]="showIcon()"
      [hourFormat]="hourFormat()"
      [readonlyInput]="readonlyInput()"
      [showButtonBar]="showButtonBar()"
      [dateStyle]="dateStyle()"
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
  showTime = input<boolean>(false);
  showClear = input<boolean>(false);
  showIcon = input<boolean>(true);
  hourFormat = input<string>("24");
  readonlyInput = input<boolean>(true);
  showButtonBar = input<boolean>(true);
  dateStyle = input<Record<string, string>>({ minWidth: "195px" });
}
