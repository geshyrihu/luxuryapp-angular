import { NgClass } from "@angular/common";
import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 📧 CUSTOM INPUT EMAIL
 * -------------------------------------------------------------------------
 * Input específico para correos electrónicos.
 * Usa type="email" para activar el teclado de email en móviles.
 */
@Component({
  selector: "web-custom-input-email",
  imports: [BaseInputSignal, ReactiveFormsModule, NgClass],
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
        type="email"
        class="form-control"
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readOnly]="readonly()"
        [disabled]="disabled()"
        [ngClass]="customClass()"
        inputmode="email"
        autocomplete="email"
        fluid
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputEmail),
      multi: true,
    },
  ],
})
export class CustomInputEmail extends BaseInputSignal {
  customClass = input<string>("");
}
