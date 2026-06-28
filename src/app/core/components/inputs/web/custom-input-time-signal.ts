import { Component, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * ⏰ CUSTOM INPUT TIME
 * -------------------------------------------------------------------------
 * Input de tiempo nativo simple y confiable.
 * Sin complicaciones.
 */
@Component({
  selector: "custom-input-time-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, InputTextModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [disabled]="disabled()"
      [required]="requiredInput()"
    >
      <input
        [formControl]="control() || internalControl"
        pInputText
        fluid
        type="time"
        [id]="id()"
        [placeholder]="placeholder()"
        fluid
        appendTo="body"
      />
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputTime),
      multi: true,
    },
  ],
})
export class CustomInputTime extends BaseInputSignal {}
