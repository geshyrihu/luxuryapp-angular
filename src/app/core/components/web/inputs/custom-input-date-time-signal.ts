import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 📅⌚ CUSTOM INPUT DATE TIME
 * -------------------------------------------------------------------------
 * Para cuando la fecha no es suficiente y necesitas la hora exacta.
 * Usa un calendario con seleccionador de tiempo.
 */
@Component({
  selector: "custom-input-date-time-signal",
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
        pInputText
        mwlFlatpickr
        ngDefaultControl
        type="text"
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [locale]="spanishLocale"
        [enableTime]="true"
        [time24hr]="true"
        [altInput]="true"
        [altFormat]="'d/M/Y H:i'"
        [dateFormat]="'Y-m-d H:i'"
        (onSelect)="handleDateChange($event)"
        [allowInput]="true"
        fluid
      />
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputDateTimeSignal),
      multi: true,
    },
  ],
})
export class CustomInputDateTimeSignal extends BaseInputSignal {
  size = input<"small" | "large" | undefined>(undefined);
  cdr = inject(ChangeDetectorRef);
  protected readonly spanishLocale = Spanish;

  // Manejo manual de cambios para asegurar que el valor se propague
  handleDateChange(date: any) {
    this.onChange(date);
    this.onTouch();
  }
}
