import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

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
        [locale]="spanishLocale"
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

  size = input<"small" | "large" | undefined>(undefined);
  protected readonly spanishLocale = Spanish;

  handleFlatpickrChange(date: string) {
    this.onChange(date);
    this.onTouch();
  }
}
