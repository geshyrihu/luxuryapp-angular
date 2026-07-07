import { Component, forwardRef, output, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../base/base-input-signal";

// 🔄 COMPONENTE DE SWITCH
// Un componente para interruptores de tipo on/off.
@Component({
  selector: "custom-input-switch-signal",
  imports: [BaseInputSignal, ReactiveFormsModule],
  template: `
    <!-- 🏗️ ESTRUCTURA BASE -->
    <!-- Reutilizamos BaseInput para manejar la etiqueta, los errores y la disposición. -->
    <base-input-signal
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [disabled]="disabled()"
      [required]="requiredInput()"
      [control]="control()"
    >
      <!-- 🚀 CONTENIDO PROYECTADO -->
      <!-- Este es el switch real que se inyectará en BaseInput. -->
      <div class="form-check form-switch">
        <input
          type="checkbox"
          class="form-check-input"
          [id]="id()"
          [formControl]="control() || internalControl"
          (change)="onValueChange($event)"
        />
        <label class="form-check-label" [for]="id()">{{ placeholder() }}</label>
      </div>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSwitch),
      multi: true,
    },
  ],
})
export class CustomInputSwitch extends BaseInputSignal {
  // 📤 EVENTO DE SALIDA
  // Notifica al componente padre cuando el valor del switch cambia.
  switchChange = output<boolean>();

  // 🔄 MANEJO DE CAMBIOS
  // Notifica a ControlValueAccessor y al componente padre cuando el valor del switch cambia.
  onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.checked;
    this.onChange(newValue);
    this.onTouch();
    this.switchChange.emit(newValue);
  }
}
