import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-date",

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
        [disable]="disable()"
        [mode]="mode()"
        [minDate]="minDate()"
        [monthSelectorType]="'dropdown'"
        [locale]="spanishLocale"
        [altInput]="true"
        [altFormat]="'d/m/Y'"
        [convertModelValue]="false"
        [dateFormat]="'Y-m-d'"
        [allowInput]="true"
        [parseDate]="parseDate"
        fluid
        class="w-full"
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
  minDate = input<Date | string | null>(null);
  protected readonly spanishLocale = Spanish;

  // Parser para permitir tipear dd/mm/yyyy (y seguir aceptando yyyy-mm-dd / Date).
  // Flatpickr usa config.parseDate para interpretar el texto tipeado en el altInput.
  parseDate = (date: string | Date): Date | undefined => {
    if (date == null) return undefined;
    if (date instanceof Date) return isNaN(date.getTime()) ? undefined : date;
    if (typeof date !== "string") return undefined;

    const value = date.trim();
    const dayMonthYear = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dayMonthYear) {
      const day = +dayMonthYear[1];
      const month = +dayMonthYear[2];
      const year = +dayMonthYear[3];
      const parsed = new Date(year, month - 1, day);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }

    const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      const parsed = new Date(+iso[1], +iso[2] - 1, +iso[3]);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }

    const fallback = new Date(value);
    return isNaN(fallback.getTime()) ? undefined : fallback;
  };

  override writeValue(value: any): void {
    if (value) {
      if (typeof value === "string") {
        if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          super.writeValue(value);
        } else if (value.includes("-")) {
          const [year, month, day] = value.slice(0, 10).split("-").map(Number);
          super.writeValue(new Date(year, month - 1, day));
        } else {
          super.writeValue(new Date(value));
        }
      } else {
        super.writeValue(new Date(value));
      }
    } else {
      super.writeValue(value);
    }
  }
}
