import { Component, forwardRef, output } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-check-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, CheckboxModule],
  template: `
    <!-- 🏗️ ESTRUCTURA BASE -->
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
      <!-- 🚀 CHECKBOX DE PRIMENG -->
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
      useExisting: forwardRef(() => CustomInputCheckSignal),
      multi: true,
    },
  ],
})
export class CustomInputCheckSignal
  extends BaseInputSignal
  implements ControlValueAccessor
{
  // 📤 EVENTO DE SALIDA
  checkChange = output<boolean>();

  constructor() {
    super();
  }

  // 🔄 MANEJO DE CAMBIOS
  // El evento de PrimeNG checkbox devuelve un objeto con la propiedad 'checked'
  onValueChange(event: any): void {
    const newValue = event.checked;
    this.onChange(newValue);
    this.onTouch();
    this.checkChange.emit(newValue);
  }

  // Explicit implementation to avoid 'registerOnChange is not a function' error
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










