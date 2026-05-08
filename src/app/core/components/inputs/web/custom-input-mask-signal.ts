import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

// 🎭 COMPONENTE DE INPUT CON MÁSCARA
// Un componente para entradas de texto con formato de máscara.
@Component({
  selector: "custom-input-mask-signal",
  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    NgxMaskDirective,
    InputTextModule,
  ],
  template: `
    <!-- 🏗️ ESTRUCTURA BASE -->
    <!-- Reutilizamos BaseInput para manejar la etiqueta, los errores y la disposición. -->
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="requiredInput()"
    >
      <!-- 🚀 CONTENIDO PROYECTADO -->
      <!-- Este es el input con máscara real que se inyectará en BaseInput. -->
      <input
        type="text"
        pInputText
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readOnly]="readonly()"
        [disabled]="disabled()"
        [mask]="customMask()"
        [pSize]="size()"
        fluid
      />
    </base-input-signal>
  `,
  providers: [
    provideNgxMask(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputMaskSignal),
      multi: true,
    },
  ],
})
export class CustomInputMaskSignal extends BaseInputSignal {
  // 🎨 PROPIEDADES ADICIONALES
  customMask = input.required<string>();
  size = input<"small" | "large" | undefined>(undefined);
}
