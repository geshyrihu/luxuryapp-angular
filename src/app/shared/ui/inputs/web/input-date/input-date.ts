import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-date",
  standalone: true,
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
      [noMargin]="noMargin()"
      [description]="description()"
      [hidden]="hidden()"
    >
      <input
        pInputText
        mwlFlatpickr
        type="text"
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [disable]="disable()"
        [mode]="mode()"
        [locale]="spanishLocale"
        [altInput]="true"
        [altFormat]="'d/M/Y'"
        [convertModelValue]="true"
        [dateFormat]="'Y-m-d'"
        [allowInput]="true"
        fluid
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputDate),
      multi: true,
    },
  ],
})
export class WebInputDate extends BaseInputSignal {
  disable = input<Date[]>([]);
  mode = input<"single" | "multiple" | "range">("single");
  protected readonly spanishLocale = Spanish;

  override writeValue(value: any): void {
    if (value) {
      if (typeof value === "string" && value.includes("-")) {
        const [year, month, day] = value.slice(0, 10).split("-").map(Number);
        super.writeValue(new Date(year, month - 1, day));
      } else {
        super.writeValue(new Date(value));
      }
    } else {
      super.writeValue(value);
    }
  }
}
