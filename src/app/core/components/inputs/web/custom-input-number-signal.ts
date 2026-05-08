import { Component, computed, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputNumberModule } from "primeng/inputnumber";
import { BaseInputSignal } from "../base/base-input-signal";

// 🔢 COMPONENTE DE INPUT NUMÉRICO
// Un componente para entradas numéricas que extiende la funcionalidad de BaseInput.
@Component({
  selector: "custom-input-number-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, InputNumberModule],
  template: `
    <!-- 🏗️ ESTRUCTURA BASE -->
    <!-- Reutilizamos BaseInput para manejar la etiqueta, los errores y la disposición. -->
    <base-input-signal
      [control]="control() || internalControl"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="requiredInput()"
      [onlyInput]="onlyInput()"
      [noMargin]="noMargin()"
    >
      <!-- 🚀 CONTENIDO PROYECTADO -->
      <!-- Este es el input numérico real que se inyectará en BaseInput. -->
      <p-inputnumber
        [inputId]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [attr.min]="min()"
        [attr.max]="max()"
        [attr.step]="step()"
        [showButtons]="showButtons()"
        [minFractionDigits]="minFractionDigits()"
        [maxFractionDigits]="maxFractionDigits()"
        [mode]="mode()"
        [currency]="currency()"
        [locale]="locale()"
        [useGrouping]="useGrouping()"
        [prefix]="prefix()"
        [suffix]="suffix()"
        [showClear]="showClear()"
        [inputStyleClass]="inputStyleClass()"
        [invalid]="isInvalid()"
        (onBlur)="blur.emit()"
        (keydown.enter)="enter.emit()"
        fluid
      />
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputNumberSignal),
      multi: true,
    },
  ],
})
export class CustomInputNumberSignal extends BaseInputSignal {
  // 🎨 PROPIEDADES ADICIONALES
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  showButtons = input<boolean>(false);
  step = input<number>(1);
  minFractionDigits = input<number | undefined>(undefined);
  maxFractionDigits = input<number | undefined>(undefined);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  mode = input<"decimal" | "currency">("decimal");
  currency = input<string | undefined>(undefined);
  useGrouping = input<boolean>(true);
  prefix = input<string | undefined>(undefined);
  suffix = input<string | undefined>(undefined);
  showClear = input<boolean>(false);
  locale = input<string>("es-MX");

  // 🔔 EVENTOS
  blur = output<void>();
  enter = output<void>();

  inputStyleClass = computed(() => {
    let classes = this.customClass();
    if (this.size() === "small") classes += " p-inputtext-sm";
    if (this.size() === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });
}
