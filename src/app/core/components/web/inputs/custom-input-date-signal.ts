import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FlatpickrDirective } from "angularx-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-date-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, FlatpickrDirective, InputTextModule, FloatLabelModule],
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
      <p-floatlabel variant="on" class="w-full">
        <input
          pInputText
          mwlFlatpickr
          type="text"
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="' '"
          [readonly]="readonly()"
          [disable]="disable()"
          [mode]="mode()"
          [locale]="spanishLocale"
          [altInput]="true"
          [altFormat]="'d/M/Y'"
          [convertModelValue]="true"
          [dateFormat]="'Y-m-d'"
          [allowInput]="true"
          [pSize]="mobileSize()"
          fluid
        />
        @if (label()) {
          <label [for]="id()">
            {{ label() }}
            @if (isRequired()) { <span style="color:var(--ds-danger)"> *</span> }
          </label>
        }
      </p-floatlabel>
    </base-input-signal>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputDateSignal),
    multi: true,
  }],
})
export class CustomInputDateSignal extends BaseInputSignal {
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
