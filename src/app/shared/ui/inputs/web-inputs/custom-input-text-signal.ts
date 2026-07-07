import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * ✍️ CUSTOM INPUT TEXT SIGNAL
 * -------------------------------------------------------------------------
 * El input de texto clásico, pero vitaminado con Signals y PrimeNG.
 * Extiende de `BaseInputSignal` para heredar toda la lógica aburrida.
 *
 * Uso:
 * <custom-input-text-signal [control]="form.controls.nombre" label="Nombre" />
 */
@Component({
  selector: "custom-input-text-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, InputTextModule],
  template: `
    <!--
      Pasamos todos los inputs al padre (base-input-signal)
      para que él monte el label, el layout y los errores.
    -->
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
      <!--
        El INPUT real está aquí dentro.
        Usamos pInputText de PrimeNG para que se vea premium. 💎
      -->
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
      useExisting: forwardRef(() => CustomInputTextSignal),
      multi: true,
    },
  ],
})
export class CustomInputTextSignal
  extends BaseInputSignal
  implements ControlValueAccessor
{
  constructor() {
    super();
  }
  // <--- 🎨 Personalización visual --->
  // Clases CSS extra para cuando te sientes creativo 🎨
  customClass = input<string>("");
  // Tamaño del input: 'small' (compacto) o 'large' (vistoso) 📏
  size = input<"small" | "large" | undefined>(undefined);

  // <--- ⚙️ Configuración --->
  // Tipo de input: text, password, email, number... tú mandas 🕹️
  type = input<string>("text");
  // ID de una datalist para sugerencias de autocompletado 📋
  list = input<string | undefined>(undefined);

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
