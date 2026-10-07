import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../core/base-input-signal";

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
      useExisting: forwardRef(() => LuxInputEmail),
      multi: true,
    },
  ],
})
export class LuxInputEmail extends BaseInputSignal {
  customClass = input<string>("");
}
