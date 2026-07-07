import { Component, computed, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 🔐 CUSTOM INPUT PASSWORD
 * -------------------------------------------------------------------------
 * Componente seguro para contraseñas.
 * Incluye máscara (ojito), medidor de fuerza opcional y etiquetas personalizables.
 * Porque la seguridad no tiene por qué ser aburrida. 🕵️‍♂️
 */
@Component({
  selector: "custom-input-password-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, PasswordModule],
  template: `
    <!-- 🏗️ ESTRUCTURA BASE -->
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <!-- 🚀 CONTENIDO PROYECTADO -->
      <p-password
        [inputId]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [feedback]="showStrengthIndicator()"
        [toggleMask]="true"
        [promptLabel]="promptLabel()"
        [weakLabel]="weakLabel()"
        [mediumLabel]="mediumLabel()"
        [strongLabel]="strongLabel()"
        [inputStyleClass]="inputStyleClass()"
        [invalid]="isInvalid()"
        fluid
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputPassword),
      multi: true,
    },
  ],
})
export class CustomInputPassword extends BaseInputSignal {
  // <--- Inputs Específicos --->
  customClass = input<string>("");
  showStrengthIndicator = input<boolean>(false);
  size = input<"small" | "large" | undefined>(undefined);

  // Textos para el feedback de seguridad (¡100% en español!)
  promptLabel = input<string>("Ingresa una contraseña");
  weakLabel = input<string>("Débil 😟");
  mediumLabel = input<string>("Media 😐");
  strongLabel = input<string>("Fuerte 💪");

  // <--- Computados --->
  inputStyleClass = computed(() => {
    let classes = this.customClass();
    if (this.size() === "small") classes += " p-inputtext-sm";
    if (this.size() === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });
}
