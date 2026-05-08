import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * ⏰ CUSTOM INPUT HOUR
 * -------------------------------------------------------------------------
 * Input para selección de hora usando Flatpickr.
 * Elegante, ligero y funcional.
 */
@Component({
  selector: "custom-input-hour-signal",
  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    FlatpickrDirective,
    InputTextModule,
  ],
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
        type="text"
        pInputText
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        mwlFlatpickr
        [altInput]="true"
        [convertModelValue]="true"
        [enableTime]="true"
        [noCalendar]="true"
        dateFormat="H:i"
        [pSize]="size()"
        (change)="handleFlatpickrChange($event.target.value)"
        fluid
      />
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputHour),
      multi: true,
    },
  ],
})
export class CustomInputHour extends BaseInputSignal {
  // <--- Inputs Específicos --->
  size = input<"small" | "large" | undefined>(undefined);

  // 🔄 Manejo de cambios desde Flatpickr
  handleFlatpickrChange(date: string) {
    this.onChange(date);
    this.onTouch();
  }
}
