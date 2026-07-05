import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonNote } from "@ionic/angular/standalone";
import { BaseInputSignal } from "./base-input-signal";

/**
 * 📱 BASE IONIC INPUT - Cimiento para inputs de vistas móviles
 * -------------------------------------------------------------------------
 * Extiende BaseInputSignal para reutilizar toda la lógica de
 * ControlValueAccessor y validaciones, pero sobreescribe el template
 * para usar el layout nativo de Ionic: IonItem / IonLabel / IonNote.
 *
 * Para inputs web/desktop PrimeNG usar: BaseInputSignal (web/)
 *
 * Uso:
 * @Component({
 *   imports: [BaseIonicInput, IonInput, ReactiveFormsModule],
 *   template: `
 *     <base-ionic-input [label]="label()" [control]="control()" [required]="requiredInput()">
 *       <ion-input [formControl]="control()" [placeholder]="placeholder()"></ion-input>
 *     </base-ionic-input>
 *   `
 * })
 */
@Component({
  selector: "base-ionic-input",
  imports: [CommonModule, ReactiveFormsModule, IonNote],
  template: `
    @if (onlyInput()) {
      <!-- Solo input sin wrapper (para casos embebidos) -->
      <ng-content></ng-content>
    } @else {
      <!-- Layout Ionic: IonItem actúa como contenedor del label + control -->
      @if (label()) {
        <!-- El label nativo flotante lo manejará el ion-input interno, omitimos inyectar label manual -->
        <ng-content></ng-content>
      }
      <!-- El input específico se proyecta aquí -->
      <ng-content></ng-content>

      <!-- Mensajes de error bajo el input -->
      @if (shouldShowErrors()) {
        <div class="ion-padding-horizontal ion-padding-bottom">
          @for (error of getValidationErrors(); track error) {
            <ion-note color="danger">
              <small>{{ error }}</small>
            </ion-note>
          }
        </div>
      }
    }
  `,
  styles: [
    `
      /* El estilo del outline nativo lo maneja el theme global
         (_ionic-rn-theme.scss § 9). Aquí solo la nota de error. */
      ion-note {
        display: block;
        font-size: 0.75rem;
        margin-top: 4px;
        margin-left: 12px;
      }
    `,
  ],
})
export class BaseIonicInput extends BaseInputSignal {
  /** lines: separador del ion-item */
  readonly lines = () => "full" as const;

  /** Clase personalizada para el ion-item */
  readonly customClass = () => "";

  shouldShowErrors(): boolean {
    const ctrl = this.control() || this.internalControl;
    return ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  getValidationErrors(): string[] {
    const ctrl = this.control() || this.internalControl;
    return Object.keys(ctrl?.errors || {}).map((key: string) => {
      const label = this.placeholder() || (this.label() as string) || "Campo";
      switch (key) {
        case "required":
          return `${label} es requerido.`;
        case "minlength":
          return `Mínimo ${ctrl.errors.minlength.requiredLength} caracteres.`;
        case "maxlength":
          return `Máximo ${ctrl.errors.maxlength.requiredLength} caracteres.`;
        case "min":
          return `Valor mínimo: ${ctrl.errors[key].min}`;
        case "max":
          return `Valor máximo: ${ctrl.errors[key].max}`;
        case "email":
          return `Email inválido.`;
        case "pattern":
          return `Formato de ${label} inválido.`;
        case "customError":
          return `${ctrl.errors[key]}`;
        default:
          return `Error: ${key}`;
      }
    });
  }
}
