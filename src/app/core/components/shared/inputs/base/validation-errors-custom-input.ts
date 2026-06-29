import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-validation-errors-custom-input",
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (shouldShow()) {
      <small class="block mt-1 text-red-500">
        {{ firstError() }}
      </small>
    }
  `,
})
export class ValidationErrorsCustomInput {
  control = input<AbstractControl | null>(null);

  protected readonly shouldShow = computed(() => {
    const control = this.control();
    return !!control && control.invalid && (control.dirty || control.touched);
  });

  protected readonly firstError = computed(() => {
    const errors = this.control()?.errors;
    if (!errors) return "";
    if (errors["required"]) return "Este campo es obligatorio.";
    if (errors["email"]) return "Ingresa un correo valido.";
    if (errors["minlength"]) return `Minimo ${errors["minlength"].requiredLength} caracteres.`;
    if (errors["maxlength"]) return `Maximo ${errors["maxlength"].requiredLength} caracteres.`;
    if (errors["min"]) return `El valor minimo es ${errors["min"].min}.`;
    if (errors["max"]) return `El valor maximo es ${errors["max"].max}.`;
    if (errors["pattern"]) return "El formato no es valido.";
    return "Revisa el valor capturado.";
  });
}
