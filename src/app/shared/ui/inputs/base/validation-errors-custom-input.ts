import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { AbstractControl, ReactiveFormsModule } from "@angular/forms";

/**
 * 🚦 VALIDATION ERRORS CUSTOM INPUT
 * -------------------------------------------------------------------------
 * Componente compartido (web + mobile) para mostrar errores de validación.
 */
@Component({
  selector: "app-validation-errors-custom-input",
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (shouldShowErrors()) {
      <div class="text-red-500 mt-1">
        @for (error of getErrors(); track error) {
          <small>{{ error }}</small>
        }
      </div>
    }
  `,
})
export class ValidationErrorsCustomInput {
  control = input.required<AbstractControl | any>();
  placeholder = input<string>("");

  shouldShowErrors(): boolean {
    const ctrl = this.control();
    return ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  getErrors(): string[] {
    const ctrl = this.control();
    return Object.keys(ctrl?.errors || {}).map((key: string) => {
      switch (key) {
        case "required":
          return `El campo ${this.placeholder()} es requerido.`;
        case "minlength":
          return `El campo debe tener mínimo ${ctrl.errors.minlength.requiredLength} caracteres.`;
        case "maxlength":
          return `El campo debe tener máximo ${ctrl.errors.maxlength.requiredLength} caracteres.`;
        case "min":
          return `Valor mínimo requerido: ${ctrl.errors[key].min}`;
        case "max":
          return `Valor máximo requerido: ${ctrl.errors[key].max}`;
        case "email":
          return `Ingresa un email válido`;
        case "pattern":
          return `El formato de ${this.placeholder()} es inválido.`;
        case "emailExist":
          return `El correo electrónico ya está registrado.`;
        case "phoneExist":
          return `El número telefónico ya está registrado.`;
        case "customError":
          return `${ctrl.errors[key]}`;
        default:
          return `Error desconocido: ${key}`;
      }
    });
  }
}









