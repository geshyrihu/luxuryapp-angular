import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { CustomInputDateTimeSignal } from "../custom-input-date-time-signal";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-date-time",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputDateTimeSignal],
  template: `
    <custom-input-date-time-signal
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
