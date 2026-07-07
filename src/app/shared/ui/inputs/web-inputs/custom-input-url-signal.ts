import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 🔗 CUSTOM INPUT URL
 * -------------------------------------------------------------------------
 * Input específico para direcciones web.
 * Valida formato automáticamente en móviles.
 */
@Component({
  selector: "custom-input-url",
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
        type="url"
        pInputText
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readOnly]="readonly()"
        [disabled]="disabled()"
        [class]="customClass()"
        fluid
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputUrl),
      multi: true,
    },
  ],
})
export class CustomInputUrl extends BaseInputSignal {
  customClass = input<string>("");
}
