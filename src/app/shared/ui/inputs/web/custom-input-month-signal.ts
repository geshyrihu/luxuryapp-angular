import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 🗓️ CUSTOM INPUT MONTH
 * -------------------------------------------------------------------------
 * Selector de mes nativo con esteroides.
 * Simple, directo y efectivo.
 */
@Component({
  selector: "web-custom-input-month",
  imports: [BaseInputSignal, ReactiveFormsModule],
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
    >
      <input
        type="month"
        class="form-control"
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readOnly]="readonly()"
        [disabled]="disabled()"
        label
        [class.form-control-sm]="size() === 'small'"
        [class.form-control-lg]="size() === 'large'"
        fluid
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputMonth),
      multi: true,
    },
  ],
})
export class CustomInputMonth extends BaseInputSignal {
  size = input<"small" | "large" | undefined>(undefined);
}
