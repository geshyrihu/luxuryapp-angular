import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../../base/base-input-signal";

/**
 * ✍️ WEB INPUT TEXT (PrimeNG)
 * -------------------------------------------------------------------------
 * Implementación de escritorio del input de texto (pInputText). Es interno:
 * se consume desde el delegador adaptativo `custom-input-text-signal`
 * (`@ui/inputs/adaptive/input-text`), no directamente en los forms.
 */
@Component({
  selector: "web-input-text",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, InputTextModule],
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
        [type]="type()"
        pInputText
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readOnly]="readonly()"
        [class]="customClass()"
        [pSize]="size()"
        [invalid]="isInvalid()"
        [attr.list]="list()"
        fluid
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputText),
      multi: true,
    },
  ],
})
export class WebInputText
  extends BaseInputSignal
  implements ControlValueAccessor
{
  constructor() {
    super();
  }
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  type = input<string>("text");
  list = input<string | undefined>(undefined);

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  override writeValue(obj: any): void {
    super.writeValue(obj);
  }
  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
  }
}
