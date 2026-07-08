import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { CustomInputMonth } from "../custom-input-month-signal";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-month",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputMonth],
  template: `
    <custom-input-month
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
      useExisting: forwardRef(() => WebInputMonth),
      multi: true,
    },
  ],
})
export class WebInputMonth extends BaseInputSignal {
  size = input<"small" | "large" | undefined>(undefined);
}
