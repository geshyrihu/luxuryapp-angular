import { Component, forwardRef, output } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { BaseInputSignal } from "../../base/base-input-signal";

/**
 * ☑️ WEB INPUT CHECK (PrimeNG) — interno del delegador `custom-input-check-signal`.
 */
@Component({
  selector: "web-input-check",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, CheckboxModule],
  template: `
    <base-input-signal
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [disabled]="disabled()"
      [required]="requiredInput()"
      [control]="control()"
      [description]="description()"
      [hidden]="hidden()"
    >
      <div class="checkbox-wrapper">
        <p-checkbox
          [inputId]="id()"
          [formControl]="control() || internalControl"
          [binary]="true"
          (onChange)="onValueChange($event)"
        />
        <label [for]="id()" class="checkbox-label">{{ placeholder() }}</label>
      </div>
    </base-input-signal>
  `,
  styles: [
    `
      .checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .checkbox-label {
        cursor: pointer;
        margin: 0;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputCheck),
      multi: true,
    },
  ],
})
export class WebInputCheck
  extends BaseInputSignal
  implements ControlValueAccessor
{
  checkChange = output<boolean>();

  constructor() {
    super();
  }
  onValueChange(event: any): void {
    const newValue = event.checked;
    this.onChange(newValue);
    this.onTouch();
    this.checkChange.emit(newValue);
  }
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
