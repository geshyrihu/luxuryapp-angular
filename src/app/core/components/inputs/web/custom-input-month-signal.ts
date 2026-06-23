import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 🗓️ CUSTOM INPUT MONTH
 * -------------------------------------------------------------------------
 * Selector de mes nativo con esteroides.
 * Simple, directo y efectivo.
 */
@Component({
  selector: "custom-input-month",
  imports: [BaseInputSignal, ReactiveFormsModule, InputTextModule],
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
        pInputText
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readOnly]="readonly()"
        label
        [pSize]="size()"
        fluid
      />
    </base-input-signal>
  `,
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
