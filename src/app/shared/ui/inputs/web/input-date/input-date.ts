import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es";
import { BaseInputSignal } from "../../core/base-input-signal";
import { parseDateInputValue } from "../../core/date-value";

@Component({
  selector: "web-input-date",

  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    FlatpickrDirective],
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
        <!-- 🚀 CRÍTICO: [convertModelValue]="true" es la magia aquí.
             El wrapper adaptativo formatea el valor a string (YYYY-MM-DD). 
             Si esto fuera false, Flatpickr esperaría objetos Date y fallaría
             al comparar los strings de la API, borrando la fecha al recargar. -->
        [convertModelValue]="true"
        [dateFormat]="'Y-m-d'"
        [allowInput]="true"
        [parseDate]="parseDate"
        class="form-control w-full"
        [class.form-control-sm]="size() === 'small'"
        [class.form-control-lg]="size() === 'large'"
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputDate),
      multi: true,
    }],
})
export class WebInputDate extends BaseInputSignal {
  disable = input<Date[]>([]);
  mode = input<"single" | "multiple" | "range">("single");
  minDate = input<Date | string | null>(null);
  size = input<"small" | "large" | undefined>(undefined);
  protected readonly spanishLocale = Spanish;

  // Parser para permitir tipear dd/mm/yyyy (y seguir aceptando yyyy-mm-dd / Date).
  // Flatpickr usa config.parseDate para interpretar el texto tipeado en el altInput.
  parseDate = (date: string | Date): Date | undefined => {
    return parseDateInputValue(date) ?? undefined;
  };

  // 🧹 Se eliminó el override de writeValue:
  // Como ahora convertModelValue=true delega a Flatpickr la lectura de los strings,
  // y este componente ya no se usa directamente con formControlName (sino a través 
  // de su wrapper adaptativo InputDate pasándole directamente [control]), sobreescribir 
  // el writeValue solo generaba desincronizaciones de ciclo de vida en Angular Signals.
}
