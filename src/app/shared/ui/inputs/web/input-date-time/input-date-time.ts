import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";
import { CustomInputDateTimeSignal } from "../custom-input-date-time-signal";

@Component({
  selector: "web-input-date-time",

  imports: [ReactiveFormsModule, CustomInputDateTimeSignal],
  template: `
    <web-custom-input-date-time-signal
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
      [size]="size()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputDateTime),
      multi: true,
    },
  ],
})
export class WebInputDateTime extends BaseInputSignal {
  size = input<"small" | "large" | undefined>(undefined);
}
